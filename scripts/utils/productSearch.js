export function normalizeSearchTerm(value) {
  return String(value ?? '')
    .trim()
    .toLocaleLowerCase()
    .replace(/\s+/g, ' ');
}

function getSearchableText(product) {
  return [
    product.name,
    product.category,
    product.brand,
    ...(product.keywords || [])
  ]
    .filter(Boolean)
    .join(' ')
    .toLocaleLowerCase();
}

export function searchProducts(products, searchTerm) {
  const normalizedTerm = normalizeSearchTerm(searchTerm);

  if (!normalizedTerm) {
    return products;
  }

  const searchWords = normalizedTerm.split(' ');

  return products.filter((product) => {
    const searchableText = getSearchableText(product);
    return searchWords.every((word) => searchableText.includes(word));
  });
}
