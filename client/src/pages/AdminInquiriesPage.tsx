import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { trpc } from '@/lib/trpc';
import { Download, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminInquiriesPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [product, setProduct] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);

  // Fetch inquiries list
  const { data: listData, isLoading: isLoadingList, refetch } = trpc.inquiries.list.useQuery({
    page,
    pageSize,
    search: search || undefined,
    product: product || undefined,
    startDate: startDate ? new Date(startDate + 'T00:00:00Z') : undefined,
    endDate: endDate ? new Date(endDate + 'T23:59:59Z') : undefined,
  });

  // Fetch statistics
  const { data: stats } = trpc.inquiries.stats.useQuery();

  // Fetch all data for export
  const { data: exportData, isLoading: isLoadingExport } = trpc.inquiries.exportAll.useQuery(
    {
      search: search || undefined,
      product: product || undefined,
      startDate: startDate ? new Date(startDate + 'T00:00:00Z') : undefined,
      endDate: endDate ? new Date(endDate + 'T23:59:59Z') : undefined,
    },
    {
      enabled: false, // Only fetch when explicitly requested
    }
  );

  // Delete mutation
  const deleteInquiry = trpc.inquiries.delete.useMutation({
    onSuccess: () => {
      refetch();
      setShowDetail(false);
    },
  });

  // Get unique products from stats
  const products = useMemo(() => {
    if (!stats?.topProducts) return [];
    return stats.topProducts.map((p: any) => p.product).filter(Boolean);
  }, [stats]);

  // Export to CSV
  const handleExport = async () => {
    if (!exportData) return;

    const headers = ['ID', 'Name', 'Email', 'Phone', 'Message', 'Product', 'Created At'];
    const rows = exportData.map((inquiry: any) => [
      inquiry.id,
      inquiry.name,
      inquiry.email,
      inquiry.phone || '',
      inquiry.message,
      inquiry.product || '',
      format(new Date(inquiry.created_at || 0), 'yyyy-MM-dd HH:mm:ss'),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) =>
        row
          .map((cell) => {
            // Escape quotes and wrap in quotes if contains comma
            const str = String(cell || '');
            return str.includes(',') || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str;
          })
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inquiries-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewDetail = async (inquiry: any) => {
    setSelectedInquiry(inquiry);
    setShowDetail(true);
  };

  const handleDeleteInquiry = async (id: number) => {
    if (confirm('Are you sure you want to delete this inquiry?')) {
      await deleteInquiry.mutateAsync({ id });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Inquiries</h1>
          <p className="text-gray-600">Manage and track all customer inquiries</p>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="p-6">
              <div className="text-sm font-medium text-gray-600">Total Inquiries</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</div>
            </Card>
            <Card className="p-6">
              <div className="text-sm font-medium text-gray-600">Today</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">{stats.today}</div>
            </Card>
            <Card className="p-6">
              <div className="text-sm font-medium text-gray-600">Top Product</div>
              <div className="text-lg font-bold text-gray-900 mt-2 truncate">
                {stats.topProducts?.[0]?.product || 'N/A'}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {stats.topProducts?.[0]?.count || 0} inquiries
              </div>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Input
              placeholder="Search by email or name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="col-span-1 md:col-span-2"
            />

            <Select value={product || "all"} onValueChange={(value) => {
              setProduct(value === "all" ? "" : value);
              setPage(1);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                {products.map((p) => (
                  <SelectItem key={p} value={p || "general"}>
                    {p || "General"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={startDate}
              onChange={(e) => {
                const val = e.target.value;
                if (val) {
                  setStartDate(val);
                  setPage(1);
                }
              }}
              placeholder="Start date"
            />

            <Input
              type="date"
              value={endDate}
              onChange={(e) => {
                const val = e.target.value;
                if (val) {
                  setEndDate(val);
                  setPage(1);
                }
              }}
              placeholder="End date"
            />

            <Button
              onClick={async () => {
                try {
                  // Manually trigger export query using useQuery's client method
                  const utils = trpc.useUtils();
                  const data = await utils.inquiries.exportAll.fetch({
                    search: search || undefined,
                    product: product || undefined,
                    startDate: startDate ? new Date(startDate + 'T00:00:00Z') : undefined,
                    endDate: endDate ? new Date(endDate + 'T23:59:59Z') : undefined,
                  });
                  
                  if (data && Array.isArray(data)) {
                    const headers = ['ID', 'Name', 'Email', 'Phone', 'Message', 'Product', 'Created At'];
                    const rows = data.map((inquiry: any) => [
                      inquiry.id,
                      inquiry.name,
                      inquiry.email,
                      inquiry.phone || '',
                      inquiry.message,
                      inquiry.product || '',
                      format(new Date(inquiry.created_at || 0), 'yyyy-MM-dd HH:mm:ss'),
                    ]);

                    const csv = [
                      headers.join(','),
                      ...rows.map((row: any[]) =>
                        row
                          .map((cell: any) => {
                            const str = String(cell || '');
                            return str.includes(',') || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str;
                          })
                          .join(',')
                      ),
                    ].join('\n');

                    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                    const link = document.createElement('a');
                    const url = URL.createObjectURL(blob);
                    link.setAttribute('href', url);
                    link.setAttribute('download', `inquiries-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.csv`);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }
                } catch (error) {
                  console.error('Export failed:', error);
                }
              }}
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </Card>

        {/* Table */}
        <Card className="overflow-hidden">
          {isLoadingList ? (
            <div className="flex items-center justify-center p-12">
              <Spinner />
            </div>
          ) : !listData?.data || listData.data.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500">No inquiries found</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listData.data.map((inquiry: any) => (
                    <TableRow key={inquiry.id}>
                      <TableCell className="font-medium">{inquiry.name}</TableCell>
                      <TableCell>{inquiry.email}</TableCell>
                      <TableCell>{inquiry.product || '-'}</TableCell>
                      <TableCell>{format(new Date(inquiry.created_at || 0), 'MMM dd, yyyy')}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetail(inquiry)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteInquiry(inquiry.id)}
                          disabled={deleteInquiry.isPending}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {listData.pagination && listData.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t">
                  <div className="text-sm text-gray-600">
                    Page {listData.pagination.page} of {listData.pagination.totalPages} (
                    {listData.pagination.total} total)
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.min(listData.pagination.totalPages, page + 1))}
                      disabled={page === listData.pagination.totalPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      </div>

      {/* Detail Dialog */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Inquiry Details</DialogTitle>
            <DialogDescription>ID: {selectedInquiry?.id}</DialogDescription>
          </DialogHeader>

          {selectedInquiry && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Name</label>
                <p className="text-gray-900">{selectedInquiry.name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-900">{selectedInquiry.email}</p>
              </div>

              {selectedInquiry.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-gray-900">{selectedInquiry.phone}</p>
                </div>
              )}

              {selectedInquiry.product && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Product</label>
                  <p className="text-gray-900">{selectedInquiry.product}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-600">Message</label>
                <p className="text-gray-900 whitespace-pre-wrap">{selectedInquiry.message}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Submitted At</label>
                <p className="text-gray-900">
                  {format(new Date(selectedInquiry.created_at || 0), 'PPpp')}
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteInquiry(selectedInquiry.id)}
                  disabled={deleteInquiry.isPending}
                >
                  Delete Inquiry
                </Button>
                <Button variant="outline" onClick={() => setShowDetail(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
