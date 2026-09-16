import { normalizeSearchTerm, searchProducts } from '../../scripts/utils/productSearch.js';

describe('product search', () => {
  const products = [
    { name: 'Wireless Mouse', keywords: ['electronics', 'computer'] },
    { name: 'Cotton T-Shirt', keywords: ['clothing'] }
  ];

  it('normalizes casing and whitespace', () => {
    expect(normalizeSearchTerm('  WIRELESS   Mouse  ')).toBe('wireless mouse');
  });

  it('matches partial words without case sensitivity', () => {
    expect(searchProducts(products, 'wi')).toEqual([products[0]]);
  });

  it('requires every word in a multi-word search to match', () => {
    expect(searchProducts(products, 'wireless computer')).toEqual([products[0]]);
    expect(searchProducts(products, 'wireless clothing')).toEqual([]);
  });
});
