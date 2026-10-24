import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Edit3, Eye, EyeOff, FolderHeart, ImagePlus, Images, KeyRound, Package, Plus, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { createAdminClient, getBanners, getCategories, getGalleryItems, getProducts } from '@/lib/api';
import { formatPrice } from '@/lib/catalog';

const emptyCategory = {
  name: '',
  description: '',
  parentId: '',
};

const emptyProduct = {
  name: '',
  category: '',
  description: '',
  price: '',
  originalPrice: '',
  sortOrder: '',
  featured: false,
  available: true,
  subcategory: '',
};

const emptyBanner = {
  title: '',
  link: '',
  order: 1,
  active: true,
};

const emptyGalleryItem = {
  title: '',
  order: 1,
  active: true,
};
const emptyAnnouncement = { text: '', link: '', active: true };
const emptyTestimonial = { name: '', review: '', occasion: '', rating: 5, active: true };

const inputClass = 'w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring';

function Field({ label, children }) {
  return (
    <label className="block text-sm font-medium">
      <span className="mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function createImageItems(files) {
  // Do not rely only on the browser-reported MIME type: Windows often reports
  // an empty type for HEIC files selected from Explorer.
  const imageFiles = Array.from(files);
  const items = await Promise.all(imageFiles.map(async (file) => {
    const isHeic = /\.(heic|heif)$/i.test(file.name) || /image\/hei[cf]/i.test(file.type);
    let previewFile = file;

    if (isHeic) {
      // Keep the HEIC decoder out of the initial Admin bundle; it is only
      // needed when an HEIC/HEIF file is actually selected.
      const heicModule = await import('heic2any');
      const heic2any = heicModule.default?.default || heicModule.default || heicModule;
      const converted = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.9,
      });
      previewFile = Array.isArray(converted) ? converted[0] : converted;
    }

    const dataUrl = await fileToDataUrl(previewFile);
    return {
      id: `${file.name}-${file.lastModified}-${typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(36).slice(2)}`,
      name: isHeic ? file.name.replace(/\.(heic|heif)$/i, '.jpg') : file.name,
      // Use the data URL for the preview too; this works reliably after the
      // hidden file input is reset and on deployed browsers.
      preview: dataUrl,
      dataUrl,
    };
  }));

  return items;
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/30">
          <Icon className="h-5 w-5 text-foreground" />
        </span>
        <div>
          <p className="text-2xl font-semibold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}

function ProductListRow({ product, onEdit, onDelete }) {
  return (
    <div className="grid grid-cols-[5rem_1fr] gap-3 rounded-md border bg-background/70 p-2.5 sm:grid-cols-[5rem_minmax(0,1fr)_auto] sm:items-center">
      <img
        src={product.image || product.images?.[0] || '/images/mini-uphaarrr-logo.png'}
        alt={product.name}
        className="h-20 w-20 shrink-0 rounded-md object-cover"
        draggable={false}
        loading="lazy"
      />
      <div className="min-w-0 self-center">
        <p className="truncate text-sm font-semibold sm:text-base">{product.name}</p>
        <p className="truncate text-xs text-muted-foreground sm:text-sm">{product.category?.name || 'No category'}</p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="text-sm font-medium">{formatPrice(product.price)}</p>
          <p className={product.available ? 'text-xs font-medium text-green-700' : 'text-xs font-medium text-muted-foreground'}>
            {product.available ? 'Available' : 'Hidden'}
          </p>
        </div>
      </div>
      <div className="col-span-2 flex gap-2 sm:col-span-1 sm:justify-end">
        <Button type="button" variant="outline" size="sm" onClick={() => onEdit(product)}>
          <Edit3 className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => onDelete(product)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );
}

function BannerListRow({ banner, onEdit, onDelete }) {
  return (
    <div className="grid grid-cols-[6rem_1fr] gap-3 rounded-md border bg-background/70 p-2.5 sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:items-center">
      <img
        src={banner.image || '/images/mini-uphaarrr-logo.png'}
        alt={banner.title || 'Homepage banner'}
        className="h-14 w-24 shrink-0 rounded-md object-cover sm:h-16 sm:w-28"
        draggable={false}
        loading="lazy"
      />
      <div className="min-w-0 self-center">
        <p className="truncate text-sm font-semibold sm:text-base">{banner.title || 'Untitled banner'}</p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>{banner.active ? 'Active' : 'Disabled'}</span>
          <span>Order: {banner.order}</span>
        </div>
        {banner.link ? <p className="mt-1 truncate text-xs text-muted-foreground">{banner.link}</p> : null}
      </div>
      <div className="col-span-2 flex gap-2 sm:col-span-1 sm:justify-end">
        <Button type="button" variant="outline" size="sm" onClick={() => onEdit(banner)}>
          <Edit3 className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => onDelete(banner)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );
}

function GalleryListRow({ galleryItem, onEdit, onDelete }) {
  return (
    <div className="rounded-md border bg-background/70 p-2.5">
      <img
        src={galleryItem.image || '/images/mini-uphaarrr-logo.png'}
        alt={galleryItem.title || 'Gallery image'}
        className="h-24 w-full rounded-md object-cover"
        draggable={false}
        loading="lazy"
      />
      <div className="mt-2 min-w-0">
        <p className="truncate text-sm font-semibold">{galleryItem.title || 'Untitled photo'}</p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>Order: {galleryItem.order}</span>
          <span>{galleryItem.active ? 'Active' : 'Disabled'}</span>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <Button type="button" variant="outline" size="sm" className="flex-1" onClick={() => onEdit(galleryItem)}>
          <Edit3 className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button type="button" variant="outline" size="sm" className="flex-1" onClick={() => onDelete(galleryItem)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );
}

function AnnouncementListRow({ announcement, onEdit, onDelete }) {
  return <div className="flex flex-col gap-3 rounded-md border bg-background/70 p-3 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="text-sm font-semibold">{announcement.text}</p><p className="mt-1 text-xs text-muted-foreground">{announcement.active ? 'Active' : 'Disabled'}{announcement.link ? ` · ${announcement.link}` : ''}</p></div><div className="flex gap-2"><Button type="button" variant="outline" size="sm" onClick={() => onEdit(announcement)}><Edit3 className="mr-2 h-4 w-4" />Edit</Button><Button type="button" variant="outline" size="sm" onClick={() => onDelete(announcement)}><Trash2 className="mr-2 h-4 w-4" />Delete</Button></div></div>;
}

function ImagePicker({ label, multiple = true, images, onAdd, onRemove }) {
  const inputRef = useRef(null);
  const inputId = `image-picker-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const [pickerError, setPickerError] = useState('');

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium">{label}</p>
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
          <ImagePlus className="mr-2 h-4 w-4" />
          Choose Images
        </Button>
      </div>
      <input
        ref={inputRef}
        type="file"
        id={inputId}
        accept="image/png,image/jpeg,image/webp,image/gif,image/avif,image/heic,image/heif,.heic,.heif"
        multiple={multiple}
        className="hidden"
        onChange={async (event) => {
          try {
            setPickerError('');
            const selected = await createImageItems(event.target.files || []);
            if (!selected.length) {
              setPickerError('This file could not be read as an image. Please choose JPG, PNG, WEBP, or HEIC.');
            } else {
              onAdd(selected);
            }
          } catch (error) {
            console.error('Unable to select image:', error);
            setPickerError(error?.message || 'Unable to read this image. Please try converting it to JPG first.');
          } finally {
            event.target.value = '';
          }
        }}
      />
      {pickerError ? <p className="mb-2 text-sm text-destructive">{pickerError}</p> : null}
      {images.length > 0 ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((image) => (
            <div key={image.id} className="group relative aspect-square overflow-hidden rounded-lg border bg-muted">
              <img
                src={image.preview || image.url}
                alt={image.name || 'Selected product image'}
                className="h-full w-full object-cover"
                draggable={false}
              />
              <button
                type="button"
                aria-label="Remove image"
                onClick={() => onRemove(image.id)}
                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-background/95 text-foreground shadow-sm transition hover:bg-destructive hover:text-destructive-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed bg-muted/40 p-6 text-center text-sm text-muted-foreground">
          No images selected yet.
        </div>
      )}
    </div>
  );
}

function AdminPage() {
  const [adminToken, setAdminToken] = useState(() => sessionStorage.getItem('mini-uphaarrr-admin-token') || '');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [categoryForm, setCategoryForm] = useState(emptyCategory);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [bannerForm, setBannerForm] = useState(emptyBanner);
  const [galleryForm, setGalleryForm] = useState(emptyGalleryItem);
  const [announcementForm, setAnnouncementForm] = useState(emptyAnnouncement);
  const [categoryImages, setCategoryImages] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [bannerImages, setBannerImages] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [editingCategoryId, setEditingCategoryId] = useState('');
  const [editingProductId, setEditingProductId] = useState('');
  const [editingBannerId, setEditingBannerId] = useState('');
  const [editingGalleryId, setEditingGalleryId] = useState('');
  const [editingAnnouncementId, setEditingAnnouncementId] = useState('');
  const [testimonialForm, setTestimonialForm] = useState(emptyTestimonial);
  const [editingTestimonialId, setEditingTestimonialId] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState('all');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const adminApi = useMemo(() => createAdminClient(adminToken), [adminToken]);
  const filteredProducts = useMemo(() => {
    if (selectedProductCategory === 'all') {
      return products;
    }

    return products.filter((product) => product.category?.id === selectedProductCategory);
  }, [products, selectedProductCategory]);
  const groupedProducts = useMemo(() => {
    if (selectedProductCategory !== 'all') {
      return [];
    }

    const categoryGroups = categories.map((category) => ({
      id: category.id,
      name: category.name,
      products: products.filter((product) => product.category?.id === category.id),
    }));
    const uncategorizedProducts = products.filter((product) => !product.category?.id);

    return uncategorizedProducts.length > 0
      ? [...categoryGroups, { id: 'uncategorized', name: 'No category', products: uncategorizedProducts }]
      : categoryGroups;
  }, [categories, products, selectedProductCategory]);

  const loadCatalog = () => {
    setError('');
    Promise.all([getCategories({ includeAll: true }), getProducts(), getBanners(), getGalleryItems()])
      .then(([categoryResult, productResult, bannerResult, galleryResult]) => {
        setCategories(categoryResult.categories || []);
        setProducts(productResult.products || []);
        setBanners(bannerResult.banners || []);
        setGalleryItems(galleryResult.galleryItems || []);
      })
      .catch((apiError) => setError(apiError.message || 'Unable to load catalog.'));
  };

  const loadAdminBanners = () => {
    if (!adminToken) {
      return;
    }

    adminApi.getBanners()
      .then((bannerResult) => setBanners(bannerResult.banners || []))
      .catch((apiError) => setError(apiError.message || 'Unable to load banners.'));
  };

  const loadAdminGallery = () => {
    if (!adminToken) {
      return;
    }

    adminApi.getGalleryItems()
      .then((galleryResult) => setGalleryItems(galleryResult.galleryItems || []))
      .catch((apiError) => setError(apiError.message || 'Unable to load gallery images.'));
  };
  const loadAdminAnnouncements = () => {
    if (!adminToken) return;
    adminApi.getAnnouncements().then((result) => setAnnouncements(result.announcements || (result.announcement ? [result.announcement] : []))).catch((apiError) => setError(apiError.message || 'Unable to load announcements.'));
  };
  const loadAdminTestimonials = () => { if (!adminToken) return; adminApi.getTestimonials().then((result) => setTestimonials(result.testimonials || [])).catch((apiError) => setError(apiError.message || 'Unable to load reviews.')); };

  useEffect(() => {
    loadCatalog();
  }, []);

  useEffect(() => {
    if (adminToken) {
      loadAdminAnnouncements();
      loadAdminTestimonials();
    }
  }, [adminToken]);

  const saveToken = () => {
    sessionStorage.setItem('mini-uphaarrr-admin-token', adminToken);
    setMessage('Access key saved for this session.');
    setError('');
    loadAdminBanners();
    loadAdminGallery();
    loadAdminAnnouncements();
    loadAdminTestimonials();
  };

  const uploadNewImages = async (items) => {
    const existingUrls = items.filter((image) => image.url).map((image) => image.url);
    const newImages = items.filter((image) => image.dataUrl);

    if (newImages.length === 0) {
      return existingUrls;
    }

    const result = await adminApi.uploadImages(newImages.map((image) => ({
      dataUrl: image.dataUrl,
      name: image.name,
    })));

    return [...existingUrls, ...(result.images || [])];
  };

  const resetCategoryForm = () => {
    setCategoryForm(emptyCategory);
    setCategoryImages([]);
    setEditingCategoryId('');
  };

  const resetProductForm = () => {
    setProductForm(emptyProduct);
    setProductImages([]);
    setEditingProductId('');
  };

  const resetBannerForm = () => {
    setBannerForm(emptyBanner);
    setBannerImages([]);
    setEditingBannerId('');
  };

  const resetGalleryForm = () => {
    setGalleryForm(emptyGalleryItem);
    setGalleryImages([]);
    setEditingGalleryId('');
  };
  const resetAnnouncementForm = () => { setAnnouncementForm(emptyAnnouncement); setEditingAnnouncementId(''); };
  const resetTestimonialForm = () => { setTestimonialForm(emptyTestimonial); setEditingTestimonialId(''); };
  const handleTestimonialSubmit = async (event) => { event.preventDefault(); setError(''); setMessage(''); setIsSaving(true); try { if (editingTestimonialId) { await adminApi.updateTestimonial(editingTestimonialId, testimonialForm); setMessage('Review saved.'); } else { await adminApi.createTestimonial(testimonialForm); setMessage('Review added.'); } resetTestimonialForm(); loadAdminTestimonials(); } catch (apiError) { setError(apiError.message); } finally { setIsSaving(false); } };

  const handleAnnouncementSubmit = async (event) => {
    event.preventDefault(); setError(''); setMessage(''); setIsSaving(true);
    try {
      if (editingAnnouncementId) { await adminApi.updateAnnouncement(editingAnnouncementId, announcementForm); setMessage('Announcement saved.'); }
      else { await adminApi.createAnnouncement(announcementForm); setMessage('Announcement added.'); }
      resetAnnouncementForm(); loadAdminAnnouncements();
    } catch (apiError) { setError(apiError.message); } finally { setIsSaving(false); }
  };

  const handleCategorySubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsSaving(true);

    try {
      const [image] = await uploadNewImages(categoryImages);
      const payload = {
        ...categoryForm,
        image,
      };

      if (editingCategoryId) {
        await adminApi.updateCategory(editingCategoryId, payload);
        setMessage('Category saved.');
      } else {
        await adminApi.createCategory(payload);
        setMessage('Category added.');
      }

      resetCategoryForm();
      loadCatalog();
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleProductSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsSaving(true);

    try {
      const images = await uploadNewImages(productImages);
      const payload = {
        ...productForm,
        price: Number.parseFloat(productForm.price) || 0,
        priceLabel: String(productForm.price || '').trim(),
        sortOrder: Number(productForm.sortOrder) || 9999,
        images,
      };

      if (editingProductId) {
        await adminApi.updateProduct(editingProductId, payload);
        setMessage('Product saved.');
      } else {
        await adminApi.createProduct(payload);
        setMessage('Product added.');
      }

      resetProductForm();
      loadCatalog();
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBannerSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsSaving(true);

    try {
      const [image] = await uploadNewImages(bannerImages);
      const payload = {
        ...bannerForm,
        order: Number(bannerForm.order || 1),
        image,
      };

      if (editingBannerId) {
        await adminApi.updateBanner(editingBannerId, payload);
        setMessage('Banner saved.');
      } else {
        await adminApi.createBanner(payload);
        setMessage('Banner added.');
      }

      resetBannerForm();
      loadAdminBanners();
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGallerySubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsSaving(true);

    try {
      const [image] = await uploadNewImages(galleryImages);
      const payload = {
        ...galleryForm,
        order: Number(galleryForm.order || 1),
        image,
      };

      if (editingGalleryId) {
        await adminApi.updateGalleryItem(editingGalleryId, payload);
        setMessage('Gallery image saved.');
      } else {
        await adminApi.createGalleryItem(payload);
        setMessage('Gallery image added.');
      }

      resetGalleryForm();
      loadAdminGallery();
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const editCategory = (category) => {
    setEditingCategoryId(category.id);
    setCategoryForm({
      name: category.name,
      description: category.description,
      parentId: category.parentId || '',
    });
    setCategoryImages(category.image ? [{
      id: category.image,
      name: category.name,
      url: category.image,
      preview: category.image,
    }] : []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const editProduct = (product) => {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name,
      category: product.category?.id || '',
      description: product.description,
      price: product.priceLabel || product.price || '',
      originalPrice: product.originalPrice || '',
      sortOrder: product.sortOrder && product.sortOrder < 9999 ? product.sortOrder : '',
      featured: product.featured,
      available: product.available,
      subcategory: product.category?.parentId ? product.category.id : '',
    });
    setProductImages(product.images.map((image) => ({
      id: image,
      name: product.name,
      url: image,
      preview: image,
    })));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const editBanner = (banner) => {
    setEditingBannerId(banner.id);
    setBannerForm({
      title: banner.title || '',
      link: banner.link || '',
      order: banner.order || 1,
      active: banner.active,
    });
    setBannerImages(banner.image ? [{
      id: banner.image,
      name: banner.title || 'Homepage banner',
      url: banner.image,
      preview: banner.image,
    }] : []);
    document.getElementById('banner-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const editGalleryItem = (galleryItem) => {
    setEditingGalleryId(galleryItem.id);
    setGalleryForm({
      title: galleryItem.title || '',
      order: galleryItem.order || 1,
      active: galleryItem.active,
    });
    setGalleryImages(galleryItem.image ? [{
      id: galleryItem.image,
      name: galleryItem.title || 'Gallery image',
      url: galleryItem.image,
      preview: galleryItem.image,
    }] : []);
    document.getElementById('gallery-form')?.scrollIntoView({ behavior: 'smooth' });
  };
  const editAnnouncement = (announcement) => { setEditingAnnouncementId(announcement.id); setAnnouncementForm({ text: announcement.text || '', link: announcement.link || '', active: announcement.active }); document.getElementById('announcement-form')?.scrollIntoView({ behavior: 'smooth' }); };

  const deleteCategory = async (category) => {
    if (!window.confirm(`Delete ${category.name}?`)) {
      return;
    }

    setError('');
    setMessage('');

    try {
      await adminApi.deleteCategory(category.id);
      setMessage('Category deleted.');
      loadCatalog();
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  const toggleCategory = async (category) => {
    setError('');
    setMessage('');
    try {
      await adminApi.updateCategory(category.id, {
        name: category.name,
        description: category.description,
        parentId: category.parentId || '',
        image: category.image || '',
        active: category.active === false,
      });
      setMessage(category.active === false ? 'Category unhidden.' : 'Category hidden.');
      loadCatalog();
    } catch (apiError) {
      setError(apiError.message || 'Unable to update category visibility.');
    }
  };

  const deleteProduct = async (product) => {
    if (!window.confirm(`Delete ${product.name}?`)) {
      return;
    }

    setError('');
    setMessage('');

    try {
      await adminApi.deleteProduct(product.id);
      setMessage('Product deleted.');
      loadCatalog();
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  const deleteBanner = async (banner) => {
    if (!window.confirm(`Delete ${banner.title || 'this banner'}?`)) {
      return;
    }

    setError('');
    setMessage('');

    try {
      await adminApi.deleteBanner(banner.id);
      setMessage('Banner deleted.');
      loadAdminBanners();
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  const deleteGalleryItem = async (galleryItem) => {
    if (!window.confirm('Are you sure you want to delete this gallery image?')) {
      return;
    }

    setError('');
    setMessage('');

    try {
      await adminApi.deleteGalleryItem(galleryItem.id);
      setMessage('Gallery image deleted.');
      loadAdminGallery();
    } catch (apiError) {
      setError(apiError.message);
    }
  };
  const deleteAnnouncement = async (announcement) => {
    if (!window.confirm('Delete this announcement?')) return;
    setError(''); setMessage('');
    try { await adminApi.deleteAnnouncement(announcement.id); setMessage('Announcement deleted.'); loadAdminAnnouncements(); } catch (apiError) { setError(apiError.message); }
  };
  const editTestimonial = (item) => { setEditingTestimonialId(item.id); setTestimonialForm({ name: item.name, review: item.review, occasion: item.occasion || '', rating: item.rating || 5, active: item.active }); document.getElementById('testimonial-form')?.scrollIntoView({ behavior: 'smooth' }); };
  const deleteTestimonial = async (item) => { if (!window.confirm('Delete this review?')) return; try { await adminApi.deleteTestimonial(item.id); setMessage('Review deleted.'); loadAdminTestimonials(); } catch (apiError) { setError(apiError.message); } };

  return (
    <>
      <Helmet>
        <title>Admin - Mini_Uphaarrr</title>
        <meta name="description" content="Mini_Uphaarrr catalog management." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <section className="py-[2.3rem] md:py-12 lg:py-14">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <h1 className="text-3xl md:text-5xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '-0.02em' }}>
                    Mini UpHaarrr admin
                  </h1>
                  <p className="text-muted-foreground">
                    Add products, upload photos, and keep the shop fresh.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" onClick={() => document.getElementById('product-form')?.scrollIntoView({ behavior: 'smooth' })}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                  <Button type="button" variant="outline" onClick={() => document.getElementById('category-form')?.scrollIntoView({ behavior: 'smooth' })}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                  </Button>
                  <Button type="button" variant="outline" onClick={() => document.getElementById('banner-form')?.scrollIntoView({ behavior: 'smooth' })}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Banner
                  </Button>
                  <Button type="button" variant="outline" onClick={() => document.getElementById('gallery-form')?.scrollIntoView({ behavior: 'smooth' })}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Gallery Image
                  </Button>
                  <Button type="button" variant="outline" onClick={() => document.getElementById('announcement-form')?.scrollIntoView({ behavior: 'smooth' })}><Plus className="mr-2 h-4 w-4" />Add Announcement</Button>
                </div>
              </div>

              <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={Package} label="Total products" value={products.length} />
                <StatCard icon={FolderHeart} label="Total categories" value={categories.length} />
                <StatCard icon={Images} label="Homepage banners" value={banners.length} />
                <StatCard icon={ImagePlus} label="Gallery images" value={galleryItems.length} />
              </div>

              <div id="admin-access" className="mb-6 rounded-lg border bg-card p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-primary-foreground" />
                  <h2 className="text-lg font-semibold">Admin access</h2>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    value={adminToken}
                    onChange={(event) => setAdminToken(event.target.value)}
                    className={inputClass}
                    type="password"
                    autoComplete="off"
                    placeholder="Enter admin access key"
                  />
                  <Button type="button" onClick={saveToken}>Unlock</Button>
                </div>
              </div>

              {message ? <p className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm font-medium text-green-700">{message}</p> : null}
              {error ? <p className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">{error}</p> : null}

              <div className="grid items-start gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
                <aside className="sticky top-4 rounded-lg border bg-card p-3 shadow-sm">
                  <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Admin menu</p>
                  <nav className="grid gap-1" aria-label="Admin sections">
                    <Link to="/" className="rounded-md px-3 py-2 text-sm font-medium transition hover:bg-primary/10 hover:text-primary">Home Page</Link>
                    <button type="button" onClick={() => document.getElementById('product-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="rounded-md px-3 py-2 text-left text-sm font-medium transition hover:bg-primary/10 hover:text-primary">Products</button>
                    <button type="button" onClick={() => document.getElementById('category-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="rounded-md px-3 py-2 text-left text-sm font-medium transition hover:bg-primary/10 hover:text-primary">Categories</button>
                    <button type="button" onClick={() => document.getElementById('banner-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="rounded-md px-3 py-2 text-left text-sm font-medium transition hover:bg-primary/10 hover:text-primary">Banners</button>
                    <button type="button" onClick={() => document.getElementById('gallery-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="rounded-md px-3 py-2 text-left text-sm font-medium transition hover:bg-primary/10 hover:text-primary">Gallery</button>
                    <button type="button" onClick={() => document.getElementById('announcement-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="rounded-md px-3 py-2 text-left text-sm font-medium transition hover:bg-primary/10 hover:text-primary">Announcement</button>
                    <button type="button" onClick={() => document.getElementById('testimonial-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="rounded-md px-3 py-2 text-left text-sm font-medium transition hover:bg-primary/10 hover:text-primary">Customer Reviews</button>
                    <button type="button" onClick={() => document.getElementById('admin-access')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="rounded-md px-3 py-2 text-left text-sm font-medium transition hover:bg-primary/10 hover:text-primary">Admin Access</button>
                  </nav>
                </aside>

                <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                <div className="grid gap-6">
                  <section id="product-form" className="rounded-lg border bg-card p-4 shadow-sm">
                    <h2 className="mb-4 text-2xl font-semibold">{editingProductId ? 'Edit product' : 'Add product'}</h2>
                    <form onSubmit={handleProductSubmit} className="grid gap-4">
                      <Field label="Product Name">
                        <input className={inputClass} value={productForm.name} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} />
                      </Field>
                      <Field label="Category">
                        <select className={inputClass} value={productForm.category} onChange={(event) => setProductForm({ ...productForm, category: event.target.value })}>
                          <option value="">Select category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                          ))}
                        </select>
                      </Field>
                      {categories.some((category) => category.parentId === productForm.category) ? (
                        <Field label="Subcategory">
                          <select className={inputClass} value={productForm.subcategory} onChange={(event) => setProductForm({ ...productForm, subcategory: event.target.value })}>
                            <option value="">Select subcategory</option>
                            {categories.filter((category) => category.parentId === productForm.category).map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                          </select>
                        </Field>
                      ) : null}
                      <Field label="Sale Price">
                        <input className={inputClass} type="text" value={productForm.price} onChange={(event) => setProductForm({ ...productForm, price: event.target.value })} placeholder="Example: 300 (2 piece)" />
                      </Field>
                      <Field label="Original Price (optional)">
                        <input className={inputClass} type="number" min="0" value={productForm.originalPrice} onChange={(event) => setProductForm({ ...productForm, originalPrice: event.target.value })} placeholder="Example: 1199" />
                      </Field>
                      <Field label="Position (optional)">
                        <input className={inputClass} type="number" min="1" step="1" value={productForm.sortOrder} onChange={(event) => setProductForm({ ...productForm, sortOrder: event.target.value })} placeholder="Example: 1" />
                        <span className="mt-1 block text-xs font-normal text-muted-foreground">1 = first product, 2 = second product. Leave empty to show after positioned products.</span>
                      </Field>
                      <Field label="Description">
                        <textarea className={inputClass} rows="4" value={productForm.description} onChange={(event) => setProductForm({ ...productForm, description: event.target.value })} />
                      </Field>
                      <ImagePicker
                        label="Product Images"
                        images={productImages}
                        onAdd={(items) => setProductImages((current) => [...current, ...items])}
                        onRemove={(id) => setProductImages((current) => current.filter((image) => image.id !== id))}
                      />
                      <div className="flex flex-wrap gap-4 text-sm">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked={productForm.featured} onChange={(event) => setProductForm({ ...productForm, featured: event.target.checked })} />
                          Featured
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked={productForm.available} onChange={(event) => setProductForm({ ...productForm, available: event.target.checked })} />
                          Available
                        </label>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : editingProductId ? 'Save Product' : 'Add Product'}</Button>
                        {editingProductId ? (
                          <Button type="button" variant="outline" onClick={resetProductForm}>
                            Cancel
                          </Button>
                        ) : null}
                      </div>
                    </form>
                  </section>

                  <section id="category-form" className="rounded-lg border bg-card p-4 shadow-sm">
                    <h2 className="mb-4 text-2xl font-semibold">{editingCategoryId ? 'Edit category' : 'Add category'}</h2>
                    <form onSubmit={handleCategorySubmit} className="grid gap-4">
                      <Field label="Category Name">
                        <input className={inputClass} value={categoryForm.name} onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })} />
                      </Field>
                      <Field label="Description">
                        <textarea className={inputClass} rows="3" value={categoryForm.description} onChange={(event) => setCategoryForm({ ...categoryForm, description: event.target.value })} />
                      </Field>
                      <Field label="Parent Category">
                        <select className={inputClass} value={categoryForm.parentId} onChange={(event) => setCategoryForm({ ...categoryForm, parentId: event.target.value })}>
                          <option value="">None (top-level category)</option>
                          {categories.filter((category) => !category.parentId && category.id !== editingCategoryId).map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                        </select>
                      </Field>
                      <ImagePicker
                        label="Category Image"
                        multiple={false}
                        images={categoryImages}
                        onAdd={(items) => setCategoryImages(items.slice(0, 1))}
                        onRemove={() => setCategoryImages([])}
                      />
                      <div className="flex flex-wrap gap-2">
                        <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Category'}</Button>
                        {editingCategoryId ? (
                          <Button type="button" variant="outline" onClick={resetCategoryForm}>
                            Cancel
                          </Button>
                        ) : null}
                      </div>
                    </form>
                  </section>

                  <section id="banner-form" className="rounded-lg border bg-card p-4 shadow-sm">
                    <h2 className="mb-4 text-2xl font-semibold">{editingBannerId ? 'Edit banner' : 'Add banner'}</h2>
                    <form onSubmit={handleBannerSubmit} className="grid gap-4">
                      <ImagePicker
                        label="Banner Image"
                        multiple={false}
                        images={bannerImages}
                        onAdd={(items) => setBannerImages(items.slice(0, 1))}
                        onRemove={() => setBannerImages([])}
                      />
                      <Field label="Title (optional)">
                        <input
                          className={inputClass}
                          value={bannerForm.title}
                          onChange={(event) => setBannerForm({ ...bannerForm, title: event.target.value })}
                        />
                      </Field>
                      <Field label="Link (optional)">
                        <input
                          className={inputClass}
                          value={bannerForm.link}
                          onChange={(event) => setBannerForm({ ...bannerForm, link: event.target.value })}
                          placeholder="/products"
                        />
                      </Field>
                      <Field label="Display Order">
                        <input
                          className={inputClass}
                          type="number"
                          min="0"
                          value={bannerForm.order}
                          onChange={(event) => setBannerForm({ ...bannerForm, order: event.target.value })}
                        />
                      </Field>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={bannerForm.active}
                          onChange={(event) => setBannerForm({ ...bannerForm, active: event.target.checked })}
                        />
                        Active
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : editingBannerId ? 'Save Banner' : 'Add Banner'}</Button>
                        {editingBannerId ? (
                          <Button type="button" variant="outline" onClick={resetBannerForm}>
                            Cancel
                          </Button>
                        ) : null}
                      </div>
                    </form>
                  </section>

                  <section id="gallery-form" className="rounded-lg border bg-card p-4 shadow-sm">
                    <h2 className="mb-4 text-2xl font-semibold">{editingGalleryId ? 'Edit gallery image' : 'Add gallery image'}</h2>
                    <form onSubmit={handleGallerySubmit} className="grid gap-4">
                      <ImagePicker
                        label="Gallery Image"
                        multiple={false}
                        images={galleryImages}
                        onAdd={(items) => setGalleryImages(items.slice(0, 1))}
                        onRemove={() => setGalleryImages([])}
                      />
                      <Field label="Title (optional)">
                        <input
                          className={inputClass}
                          value={galleryForm.title}
                          onChange={(event) => setGalleryForm({ ...galleryForm, title: event.target.value })}
                        />
                      </Field>
                      <Field label="Display Order">
                        <input
                          className={inputClass}
                          type="number"
                          min="0"
                          value={galleryForm.order}
                          onChange={(event) => setGalleryForm({ ...galleryForm, order: event.target.value })}
                        />
                      </Field>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={galleryForm.active}
                          onChange={(event) => setGalleryForm({ ...galleryForm, active: event.target.checked })}
                        />
                        Active
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : editingGalleryId ? 'Save Gallery Image' : 'Add Image'}</Button>
                        {editingGalleryId ? (
                          <Button type="button" variant="outline" onClick={resetGalleryForm}>
                            Cancel
                          </Button>
                        ) : null}
                      </div>
                    </form>
                  </section>
                  <section id="announcement-form" className="rounded-lg border bg-card p-4 shadow-sm">
                    <h2 className="mb-4 text-2xl font-semibold">{editingAnnouncementId ? 'Edit announcement' : 'Announcement Bar'}</h2>
                    <form onSubmit={handleAnnouncementSubmit} className="grid gap-4">
                      <Field label="Announcement Text"><input required maxLength="200" className={inputClass} value={announcementForm.text} onChange={(event) => setAnnouncementForm({ ...announcementForm, text: event.target.value })} /></Field>
                      <Field label="Optional Link"><input maxLength="1000" className={inputClass} value={announcementForm.link} onChange={(event) => setAnnouncementForm({ ...announcementForm, link: event.target.value })} placeholder="/products" /></Field>
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={announcementForm.active} onChange={(event) => setAnnouncementForm({ ...announcementForm, active: event.target.checked })} />Active</label>
                      <div className="flex flex-wrap gap-2"><Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : editingAnnouncementId ? 'Save Announcement' : 'Add Announcement'}</Button>{editingAnnouncementId ? <Button type="button" variant="outline" onClick={resetAnnouncementForm}>Cancel</Button> : null}</div>
                    </form>
                  </section>
                  <section id="testimonial-form" className="rounded-lg border bg-card p-4 shadow-sm">
                    <h2 className="mb-4 text-2xl font-semibold">{editingTestimonialId ? 'Edit customer review' : 'Add customer review'}</h2>
                    <form onSubmit={handleTestimonialSubmit} className="grid gap-4">
                      <Field label="Customer Name"><input required className={inputClass} value={testimonialForm.name} onChange={(event) => setTestimonialForm({ ...testimonialForm, name: event.target.value })} /></Field>
                      <Field label="Review"><textarea required rows="4" className={inputClass} value={testimonialForm.review} onChange={(event) => setTestimonialForm({ ...testimonialForm, review: event.target.value })} /></Field>
                      <Field label="Occasion"><input className={inputClass} value={testimonialForm.occasion} onChange={(event) => setTestimonialForm({ ...testimonialForm, occasion: event.target.value })} /></Field>
                      <Field label="Rating (1-5)"><input className={inputClass} type="number" min="1" max="5" value={testimonialForm.rating} onChange={(event) => setTestimonialForm({ ...testimonialForm, rating: Number(event.target.value) })} /></Field>
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={testimonialForm.active} onChange={(event) => setTestimonialForm({ ...testimonialForm, active: event.target.checked })} />Active</label>
                      <div className="flex gap-2"><Button type="submit" disabled={isSaving}>{editingTestimonialId ? 'Save Review' : 'Add Review'}</Button>{editingTestimonialId ? <Button type="button" variant="outline" onClick={resetTestimonialForm}>Cancel</Button> : null}</div>
                    </form>
                  </section>
                </div>

                <div className="grid gap-6">
                  <section id="gallery-list" className="rounded-lg border bg-card p-4 shadow-sm">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <h2 className="text-2xl font-semibold">Gallery</h2>
                      <Button type="button" size="sm" onClick={() => document.getElementById('gallery-form')?.scrollIntoView({ behavior: 'smooth' })}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Gallery Image
                      </Button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {galleryItems.map((galleryItem) => (
                        <GalleryListRow
                          key={galleryItem.id}
                          galleryItem={galleryItem}
                          onEdit={editGalleryItem}
                          onDelete={deleteGalleryItem}
                        />
                      ))}
                      {galleryItems.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No gallery images yet.</p>
                      ) : null}
                    </div>
                  </section>
                  <section id="announcement-list" className="rounded-lg border bg-card p-4 shadow-sm"><div className="mb-4 flex items-center justify-between"><h2 className="text-2xl font-semibold">Announcement Bar</h2><Button type="button" size="sm" onClick={() => document.getElementById('announcement-form')?.scrollIntoView({ behavior: 'smooth' })}><Plus className="mr-2 h-4 w-4" />Add Announcement</Button></div><div className="grid gap-2">{announcements.map((announcement) => <AnnouncementListRow key={announcement.id} announcement={announcement} onEdit={editAnnouncement} onDelete={deleteAnnouncement} />)}{announcements.length === 0 ? <p className="text-sm text-muted-foreground">No announcements yet.</p> : null}</div></section>
                  <section id="testimonial-list" className="rounded-lg border bg-card p-4 shadow-sm"><div className="mb-4 flex items-center justify-between"><h2 className="text-2xl font-semibold">Customer Reviews</h2><Button type="button" size="sm" onClick={() => document.getElementById('testimonial-form')?.scrollIntoView({ behavior: 'smooth' })}><Plus className="mr-2 h-4 w-4" />Add Review</Button></div><div className="grid gap-2">{testimonials.map((item) => <div key={item.id} className="rounded-md border bg-background/70 p-3"><p className="text-sm font-semibold">{item.name} · {'★'.repeat(item.rating)}</p><p className="mt-1 text-sm text-muted-foreground">{item.review}</p><p className="mt-1 text-xs text-muted-foreground">{item.occasion || 'Customer review'} · {item.active ? 'Active' : 'Disabled'}</p><div className="mt-3 flex gap-2"><Button type="button" variant="outline" size="sm" onClick={() => editTestimonial(item)}>Edit</Button><Button type="button" variant="outline" size="sm" onClick={() => deleteTestimonial(item)}>Delete</Button></div></div>)}{testimonials.length === 0 ? <p className="text-sm text-muted-foreground">No custom reviews yet. Default reviews are still shown.</p> : null}</div></section>

                  <section className="rounded-lg border bg-card p-4 shadow-sm">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <h2 className="text-2xl font-semibold">Homepage Banners</h2>
                      <Button type="button" size="sm" onClick={() => document.getElementById('banner-form')?.scrollIntoView({ behavior: 'smooth' })}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Banner
                      </Button>
                    </div>
                    <div className="grid gap-2">
                      {banners.map((banner) => (
                        <BannerListRow
                          key={banner.id}
                          banner={banner}
                          onEdit={editBanner}
                          onDelete={deleteBanner}
                        />
                      ))}
                      {banners.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No homepage banners yet.</p>
                      ) : null}
                    </div>
                  </section>

                  <section className="rounded-lg border bg-card p-4 shadow-sm">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <h2 className="text-2xl font-semibold">Products</h2>
                      <select
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring sm:w-56"
                        value={selectedProductCategory}
                        onChange={(event) => setSelectedProductCategory(event.target.value)}
                        aria-label="Filter products by category"
                      >
                        <option value="all">All Categories</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-3">
                      {selectedProductCategory === 'all' ? groupedProducts.map((group) => (
                        group.products.length > 0 ? (
                          <div key={group.id} className="grid gap-2">
                            <div className="flex items-center justify-between rounded-md bg-muted/60 px-3 py-2">
                              <h3 className="text-sm font-semibold">{group.name}</h3>
                              <span className="text-xs font-medium text-muted-foreground">{group.products.length}</span>
                            </div>
                            <div className="grid gap-2">
                              {group.products.map((product) => (
                                <ProductListRow
                                  key={product.id}
                                  product={product}
                                  onEdit={editProduct}
                                  onDelete={deleteProduct}
                                />
                              ))}
                            </div>
                          </div>
                        ) : null
                      )) : filteredProducts.map((product) => (
                        <ProductListRow
                          key={product.id}
                          product={product}
                          onEdit={editProduct}
                          onDelete={deleteProduct}
                        />
                      ))}
                      {filteredProducts.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No products yet.</p>
                      ) : null}
                    </div>
                  </section>

                  <section className="rounded-lg border bg-card p-3 shadow-sm">
                    <h2 className="mb-3 text-xl font-semibold">Categories</h2>
                    <div className="grid gap-2">
                      {categories.map((category) => (
                        <div key={category.id} className="grid grid-cols-[3rem_1fr] gap-3 rounded-md border bg-background/70 p-2 sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:items-center">
                          <img
                            src={category.image || '/images/mini-uphaarrr-logo.png'}
                            alt={category.name}
                            className="h-12 w-12 shrink-0 rounded-md object-cover"
                            draggable={false}
                            loading="lazy"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">{category.name}</p>
                            <p className="truncate text-xs text-muted-foreground">{category.description}</p>
                          </div>
                          <div className="col-span-2 flex gap-2 sm:col-span-1 sm:justify-end">
                            <Button type="button" variant="outline" size="sm" onClick={() => toggleCategory(category)} aria-label={category.active === false ? 'Show category' : 'Hide category'} title={category.active === false ? 'Show category' : 'Hide category'}>
                              {category.active === false ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button type="button" variant="outline" size="sm" onClick={() => editCategory(category)}>
                              <Edit3 className="mr-2 h-4 w-4" />
                              Edit
                            </Button>
                            <Button type="button" variant="outline" size="sm" onClick={() => deleteCategory(category)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                      {categories.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No categories yet.</p>
                      ) : null}
                    </div>
                  </section>
                </div>
              </div>
            </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default AdminPage;
