import { z } from 'zod';
import { sql, and, like, gte, lte, desc, asc } from 'drizzle-orm';
import { protectedProcedure, router } from '../_core/trpc';
import { getDb } from '../db';
import { TRPCError } from '@trpc/server';
import { ENV } from '../_core/env';

/**
 * Owner-only router for managing customer inquiries
 * Only accessible to the website owner
 */

const ownerOnlyProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user?.openId !== ENV.ownerOpenId) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Owner access required' });
  }
  return next({ ctx });
});

export const inquiriesRouter = router({
  /**
   * Get paginated list of inquiries with optional filtering
   */
  list: ownerOnlyProcedure
    .input(
      z.object({
        page: z.number().int().min(1).default(1),
        pageSize: z.number().int().min(1).max(100).default(20),
        search: z.string().optional(),
        product: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        sortBy: z.enum(['created_at', 'name', 'email']).default('created_at'),
        sortOrder: z.enum(['asc', 'desc']).default('desc'),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database unavailable' });
      }

      try {
        // Build WHERE clause using Drizzle
        const conditions: any[] = [];

        if (input.search) {
          conditions.push(
            sql`(email LIKE ${`%${input.search}%`} OR name LIKE ${`%${input.search}%`})`
          );
        }

        if (input.product) {
          conditions.push(sql`product = ${input.product}`);
        }

        if (input.startDate) {
          conditions.push(sql`created_at >= ${input.startDate}`);
        }

        if (input.endDate) {
          const endOfDay = new Date(input.endDate);
          endOfDay.setHours(23, 59, 59, 999);
          conditions.push(sql`created_at <= ${endOfDay}`);
        }

        // Get total count
        const countQuery = conditions.length > 0
          ? sql`SELECT COUNT(*) as total FROM contact_inquiries WHERE ${and(...conditions)}`
          : sql`SELECT COUNT(*) as total FROM contact_inquiries`;

        const countResult = await db.execute(countQuery);
        const total = (countResult as any)[0]?.total || 0;

        // Get paginated results
        const offset = (input.page - 1) * input.pageSize;

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        const dataQuery = sql`
          SELECT id, name, email, phone, message, product, created_at
          FROM contact_inquiries
          ${whereClause ? sql`WHERE ${whereClause}` : sql``}
          ORDER BY ${input.sortBy === 'created_at' ? (input.sortOrder === 'desc' ? desc(sql`created_at`) : asc(sql`created_at`)) : sql`${sql.identifier(input.sortBy)} ${sql.raw(input.sortOrder.toUpperCase())}`}
          LIMIT ${input.pageSize} OFFSET ${offset}
        `;

        const results = await db.execute(dataQuery);

        return {
          data: results as any[],
          pagination: {
            total,
            page: input.page,
            pageSize: input.pageSize,
            totalPages: Math.ceil(total / input.pageSize),
          },
        };
      } catch (error) {
        console.error('[Inquiries] List error:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch inquiries' });
      }
    }),

  /**
   * Export all inquiries (no pagination)
   */
  exportAll: ownerOnlyProcedure
    .input(
      z.object({
        search: z.string().optional(),
        product: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database unavailable' });
      }

      try {
        // Build WHERE clause
        const conditions: any[] = [];

        if (input.search) {
          conditions.push(
            sql`(email LIKE ${`%${input.search}%`} OR name LIKE ${`%${input.search}%`})`
          );
        }

        if (input.product) {
          conditions.push(sql`product = ${input.product}`);
        }

        if (input.startDate) {
          conditions.push(sql`created_at >= ${input.startDate}`);
        }

        if (input.endDate) {
          const endOfDay = new Date(input.endDate);
          endOfDay.setHours(23, 59, 59, 999);
          conditions.push(sql`created_at <= ${endOfDay}`);
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        const query = sql`
          SELECT id, name, email, phone, message, product, created_at
          FROM contact_inquiries
          ${whereClause ? sql`WHERE ${whereClause}` : sql``}
          ORDER BY created_at DESC
        `;

        const results = await db.execute(query);
        return results as any[];
      } catch (error) {
        console.error('[Inquiries] Export error:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to export inquiries' });
      }
    }),

  /**
   * Get inquiry by ID
   */
  getById: ownerOnlyProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database unavailable' });
      }

      try {
        const query = sql`SELECT * FROM contact_inquiries WHERE id = ${input.id}`;
        const results = await db.execute(query);
        const resultsArray = results as any[];
        if (!resultsArray || resultsArray.length === 0) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Inquiry not found' });
        }
        return (results as any[])[0];
      } catch (error) {
        console.error('[Inquiries] Get by ID error:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch inquiry' });
      }
    }),

  /**
   * Delete inquiry by ID
   */
  delete: ownerOnlyProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database unavailable' });
      }

      try {
        const query = sql`DELETE FROM contact_inquiries WHERE id = ${input.id}`;
        await db.execute(query);
        return { success: true };
      } catch (error) {
        console.error('[Inquiries] Delete error:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete inquiry' });
      }
    }),

  /**
   * Get statistics
   */
  stats: ownerOnlyProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database unavailable' });
    }

    try {
      const totalQuery = sql`SELECT COUNT(*) as total FROM contact_inquiries`;
      const totalResult = await db.execute(totalQuery);
      const total = (totalResult as any)[0]?.total || 0;

      const todayQuery = sql`SELECT COUNT(*) as count FROM contact_inquiries WHERE DATE(created_at) = CURDATE()`;
      const todayResult = await db.execute(todayQuery);
      const today = (todayResult as any)[0]?.count || 0;

      const productsQuery = sql`SELECT product, COUNT(*) as count FROM contact_inquiries GROUP BY product ORDER BY count DESC LIMIT 5`;
      const productsResult = await db.execute(productsQuery);
      const topProducts = productsResult as any[];

      return {
        total,
        today,
        topProducts,
      };
    } catch (error) {
      console.error('[Inquiries] Stats error:', error);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch statistics' });
    }
  }),
});
