import { describe, it, expect } from 'vitest';
import { getProducts, getPages, getTranslations, getMenus } from './data-store';

describe('nevenshop data-store', () => {
  it('loads products', () => {
    const products = getProducts();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });

  it('loads pages', () => {
    const pages = getPages();
    expect(Array.isArray(pages)).toBe(true);
    expect(pages.length).toBeGreaterThan(0);
  });

  it('loads translations for en', () => {
    const translations = getTranslations('en');
    expect(typeof translations).toBe('object');
  });

  it('loads menus', () => {
    const menus = getMenus();
    expect(typeof menus).toBe('object');
  });

  it('products have required fields', () => {
    const products = getProducts();
    const product = products[0];
    expect(product).toHaveProperty('id');
    expect(product).toHaveProperty('slug');
    expect(product).toHaveProperty('title');
  });

  it('pages have required fields', () => {
    const pages = getPages();
    const page = pages[0];
    expect(page).toHaveProperty('id');
    expect(page).toHaveProperty('slug');
    expect(page).toHaveProperty('title');
  });
});
