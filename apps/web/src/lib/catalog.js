export function formatPrice(price) {
  if (!Number(price)) {
    return 'Price on request';
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export function sortProductsByPosition(products = []) {
  return [...products].sort((a, b) => {
    const positionA = Number(a.sortOrder) > 0 ? Number(a.sortOrder) : 9999;
    const positionB = Number(b.sortOrder) > 0 ? Number(b.sortOrder) : 9999;
    return positionA - positionB;
  });
}
