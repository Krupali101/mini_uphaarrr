async function requestJson(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const result = await response.json().catch(() => ({
    message: `Request failed with status ${response.status}.`,
  }));

  if (!response.ok) {
    throw new Error(result.message || 'Request failed.');
  }

  return result;
}

export function getCategories(params = {}) {
  const query = new URLSearchParams(params).toString();
  return requestJson(`/api/categories${query ? `?${query}` : ''}`);
}

export function getCategory(idOrSlug) {
  return requestJson(`/api/categories/${encodeURIComponent(idOrSlug)}`);
}

export function getProducts(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, value);
    }
  });

  return requestJson(`/api/products${query.toString() ? `?${query}` : ''}`);
}

export function getBanners(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, value);
    }
  });

  return requestJson(`/api/banners${query.toString() ? `?${query}` : ''}`);
}

export function getGalleryItems(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, value);
    }
  });

  return requestJson(`/api/gallery${query.toString() ? `?${query}` : ''}`);
}

export function getAnnouncement() {
  return requestJson('/api/announcement');
}
export function getTestimonials() { return requestJson('/api/testimonials'); }

export function getProduct(idOrSlug) {
  return requestJson(`/api/products/${encodeURIComponent(idOrSlug)}`);
}

export function createAdminClient(adminToken) {
  const headers = {
    'x-admin-token': adminToken,
  };

  return {
    createCategory: (category) => requestJson('/api/categories', {
      method: 'POST',
      headers,
      body: JSON.stringify(category),
    }),
    updateCategory: (id, category) => requestJson(`/api/categories/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(category),
    }),
    deleteCategory: (id) => requestJson(`/api/categories/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers,
    }),
    getBanners: () => requestJson('/api/banners?includeInactive=true', {
      headers,
    }),
    createBanner: (banner) => requestJson('/api/banners', {
      method: 'POST',
      headers,
      body: JSON.stringify(banner),
    }),
    updateBanner: (id, banner) => requestJson(`/api/banners/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(banner),
    }),
    deleteBanner: (id) => requestJson(`/api/banners/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers,
    }),
    getAnnouncements: () => requestJson('/api/announcement?includeInactive=true', { headers }),
    createAnnouncement: (announcement) => requestJson('/api/announcement', { method: 'POST', headers, body: JSON.stringify(announcement) }),
    updateAnnouncement: (id, announcement) => requestJson(`/api/announcement/${encodeURIComponent(id)}`, { method: 'PUT', headers, body: JSON.stringify(announcement) }),
    deleteAnnouncement: (id) => requestJson(`/api/announcement/${encodeURIComponent(id)}`, { method: 'DELETE', headers }),
    getTestimonials: () => requestJson('/api/testimonials?includeInactive=true', { headers }),
    createTestimonial: (value) => requestJson('/api/testimonials', { method: 'POST', headers, body: JSON.stringify(value) }),
    updateTestimonial: (id, value) => requestJson(`/api/testimonials/${encodeURIComponent(id)}`, { method: 'PUT', headers, body: JSON.stringify(value) }),
    deleteTestimonial: (id) => requestJson(`/api/testimonials/${encodeURIComponent(id)}`, { method: 'DELETE', headers }),
    getGalleryItems: () => requestJson('/api/gallery?includeInactive=true', {
      headers,
    }),
    createGalleryItem: (galleryItem) => requestJson('/api/gallery', {
      method: 'POST',
      headers,
      body: JSON.stringify(galleryItem),
    }),
    updateGalleryItem: (id, galleryItem) => requestJson(`/api/gallery/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(galleryItem),
    }),
    deleteGalleryItem: (id) => requestJson(`/api/gallery/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers,
    }),
    uploadImages: (images) => requestJson('/api/upload-images', {
      method: 'POST',
      headers,
      body: JSON.stringify({ images }),
    }),
    createProduct: (product) => requestJson('/api/products', {
      method: 'POST',
      headers,
      body: JSON.stringify(product),
    }),
    updateProduct: (id, product) => requestJson(`/api/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(product),
    }),
    deleteProduct: (id) => requestJson(`/api/products/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers,
    }),
  };
}
