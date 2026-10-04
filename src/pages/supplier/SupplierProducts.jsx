import React, { useState, useEffect } from 'react';
import { 
  Tag, Plus, Edit3, CheckCircle2, AlertTriangle, 
  Search, RefreshCw, X, Image as ImageIcon, Upload, Check, Link as LinkIcon
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getSupplierProducts, addSupplierProduct, updateSupplierProduct } from '../../services/api';
import { AVAILABLE_COMMODITY_PRESETS, getCommodityVisual } from '../../utils/commodityVisuals';

export default function SupplierProducts() {
  const { currentSupplier } = useApp();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Mandatory Product Image States
  const [selectedImage, setSelectedImage] = useState('');
  const [imageTab, setImageTab] = useState('PRESET'); // 'PRESET' | 'UPLOAD' | 'URL'
  const [imageError, setImageError] = useState(null);
  const [customUrlInput, setCustomUrlInput] = useState('');

  const supId = currentSupplier?.id || 'sup_01';

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getSupplierProducts(supId);
      setProducts(data);
    } catch (err) {
      console.error("Error loading supplier products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [supId]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setSelectedImage('');
    setImageError(null);
    setCustomUrlInput('');
    setImageTab('PRESET');
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    const initialImg = prod.image || prod.image_url || getCommodityVisual(prod.name, prod.category).image || '';
    setSelectedImage(initialImg);
    setImageError(null);
    setCustomUrlInput('');
    setImageTab('PRESET');
    setIsAddModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingProduct(null);
    setSelectedImage('');
    setImageError(null);
    setCustomUrlInput('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError("Please upload a valid image file (JPG, PNG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image file size exceeds 5MB limit. Please upload a smaller image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target.result);
      setImageError(null);
    };
    reader.onerror = () => {
      setImageError("Failed to read image file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleToggleAvailability = async (prod) => {
    const updatedStatus = !prod.is_available;
    try {
      await updateSupplierProduct(supId, prod.id, { is_available: updatedStatus });
      setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, is_available: updatedStatus } : p));
      setNotification(`${prod.name} marked as ${updatedStatus ? 'Available' : 'Unavailable'}`);
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      alert("Failed to toggle availability: " + err.message);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();

    // STRICT MANDATORY VALIDATION: Product image must be provided
    if (!selectedImage || !selectedImage.trim()) {
      setImageError("Product image is mandatory. Please choose an image from the presets or upload your own image.");
      return;
    }

    const formData = new FormData(e.target);
    const payload = {
      name: formData.get('name'),
      category: formData.get('category'),
      image: selectedImage,
      unit_of_measure: formData.get('unit_of_measure'),
      unit_weight_kg: parseFloat(formData.get('unit_weight_kg') || 1),
      retail_price: parseFloat(formData.get('retail_price') || 0),
      wholesale_price: parseFloat(formData.get('wholesale_price') || 0),
      min_wholesale_quantity: parseFloat(formData.get('min_wholesale_quantity') || 10),
      available_quantity: parseFloat(formData.get('available_quantity') || 0),
      max_order_quantity: formData.get('max_order_quantity') ? parseFloat(formData.get('max_order_quantity')) : null,
      service_radius_km: parseFloat(formData.get('service_radius_km') || 50),
      lead_time_days: parseInt(formData.get('lead_time_days') || 2),
      discount_pct: parseFloat(formData.get('discount_pct') || 0),
      is_available: formData.get('is_available') === 'on'
    };

    try {
      if (editingProduct) {
        await updateSupplierProduct(supId, editingProduct.id, payload);
        setNotification(`Product "${payload.name}" updated successfully`);
        handleCloseModal();
      } else {
        await addSupplierProduct(supId, payload);
        setNotification(`Product "${payload.name}" added to catalog`);
        handleCloseModal();
      }
      setTimeout(() => setNotification(null), 3000);
      await loadProducts();
    } catch (err) {
      alert("Failed to save product: " + err.message);
    }
  };

  const categories = ['ALL', ...new Set(products.map(p => p.category).filter(Boolean))];

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Wholesale Catalog
            </span>
            <span className="text-xs text-slate-500 font-normal">
              {products.length} Products Configured
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Product & Inventory Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure wholesale commercial terms, minimum wholesale order thresholds (MOQ), and monitor warehouse stock levels.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={loadProducts}
            className="px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700/60 transition flex items-center space-x-1.5 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-3.5 py-1.5 rounded-md bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-medium transition shadow-sm flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-700" />
          <span>{notification}</span>
        </div>
      )}

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search catalog products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="soft-input w-full rounded-full pl-9 pr-3 py-1.5 text-xs border border-slate-200/80 dark:border-white/[0.08]"
          />
        </div>

        <div className="p-1 rounded-xl bg-slate-100/80 dark:bg-slate-850/80 border border-slate-200/70 dark:border-white/[0.06] flex items-center space-x-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 shadow-soft-inset">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white dark:bg-[#111827] text-slate-900 dark:text-white shadow-soft-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table (Clean B2B Data Layout) */}
      <div className="soft-card rounded-2.5xl border border-slate-200/80 dark:border-white/[0.08] shadow-soft overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No products found matching your search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">Product Details</th>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4 text-right">Wholesale Price</th>
                  <th className="py-2.5 px-4 text-right">Retail Ref</th>
                  <th className="py-2.5 px-4 text-right">Configured MOQ</th>
                  <th className="py-2.5 px-4 text-right">Stock Level</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-medium">
                {filtered.map((prod) => {
                  const avail = prod.available_quantity || 0;
                  const moq = prod.min_wholesale_quantity || 0;
                  const isCritical = avail < moq;
                  const isLowStock = avail < (moq * 1.5);

                  return (
                    <tr key={prod.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-700/30 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-11 h-11 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 flex-shrink-0 relative shadow-2xs">
                            <img
                              src={prod.image || getCommodityVisual(prod.name, prod.category).image}
                              alt={prod.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-slate-100">{prod.name}</div>
                            <div className="text-[11px] text-slate-400">
                              Unit: {prod.unit_of_measure} ({prod.unit_weight_kg || 1} kg) • Lead: {prod.lead_time_days || 2}d
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                          {prod.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          ₹{Number(prod.wholesale_price).toLocaleString('en-IN')}/{prod.unit_of_measure}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-400">
                        ₹{Number(prod.retail_price || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-slate-700 dark:text-slate-300">
                        {moq} {prod.unit_of_measure}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {avail} {prod.unit_of_measure}
                        </div>
                        {isCritical ? (
                          <span className="text-[10px] text-rose-700 dark:text-rose-400 font-medium inline-flex items-center space-x-0.5">
                            <AlertTriangle className="w-2.5 h-2.5" />
                            <span>Below MOQ</span>
                          </span>
                        ) : isLowStock ? (
                          <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                            Low Stock
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                            Optimal
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleAvailability(prod)}
                          className={`px-2 py-0.5 rounded text-[11px] font-medium border transition cursor-pointer ${
                            prod.is_available
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                              : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:border-slate-600'
                          }`}
                          title="Click to toggle availability"
                        >
                          {prod.is_available ? 'Active' : 'Disabled'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleOpenEditModal(prod)}
                          className="px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition inline-flex items-center space-x-1 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3 text-slate-500" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {(isAddModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200/80 dark:border-white/[0.08] soft-panel p-6 sm:p-8 shadow-soft-lg space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200/80 dark:border-white/[0.06]">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Tag className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
                <span>{editingProduct ? 'Edit Commercial Terms' : 'Add Wholesale Product'}</span>
              </h3>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              {/* MANDATORY PRODUCT IMAGE SECTION */}
              <div className="p-4 rounded-2.5xl soft-inset border border-slate-200/60 dark:border-white/[0.04] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ImageIcon className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Product Image <span className="text-rose-600 dark:text-rose-400">*</span>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                      Mandatory
                    </span>
                  </div>

                  {selectedImage && (
                    <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Image Ready</span>
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Every wholesale listing requires a real-world commodity visual for Kiranas to inspect mandi quality. You can choose from available commodity presets or upload your own warehouse image.
                </p>

                {/* If image is selected, show active image preview strip */}
                {selectedImage ? (
                  <div className="relative rounded-xl overflow-hidden border-2 border-emerald-700 dark:border-emerald-600 bg-slate-900 p-2.5 flex items-center justify-between shadow-sm">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/20 flex-shrink-0 bg-black">
                        <img 
                          src={selectedImage} 
                          alt="Active Product Visual" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-bold text-white">Active Product Visual</span>
                          <span className="text-[9px] font-bold bg-emerald-800 text-white px-1.5 py-0.5 rounded uppercase">Attached</span>
                        </div>
                        <p className="text-[10px] text-white/70 max-w-[260px] sm:max-w-xs truncate font-mono">
                          {selectedImage.startsWith('data:') ? 'Custom Uploaded File (Base64)' : selectedImage}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage('');
                        setImageError(null);
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/70 hover:bg-rose-900 border border-rose-800 rounded-lg transition cursor-pointer"
                    >
                      Change Image
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Mode Navigation Tabs */}
                    <div className="flex border-b border-slate-200 dark:border-slate-700 text-xs">
                      <button
                        type="button"
                        onClick={() => { setImageTab('PRESET'); setImageError(null); }}
                        className={`pb-2 px-3 font-semibold transition border-b-2 cursor-pointer flex items-center space-x-1.5 ${
                          imageTab === 'PRESET'
                            ? 'border-emerald-800 text-emerald-800 dark:border-emerald-400 dark:text-emerald-400'
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Choose from Available Options ({AVAILABLE_COMMODITY_PRESETS.length})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => { setImageTab('UPLOAD'); setImageError(null); }}
                        className={`pb-2 px-3 font-semibold transition border-b-2 cursor-pointer flex items-center space-x-1.5 ${
                          imageTab === 'UPLOAD'
                            ? 'border-emerald-800 text-emerald-800 dark:border-emerald-400 dark:text-emerald-400'
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Your Own Image</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => { setImageTab('URL'); setImageError(null); }}
                        className={`pb-2 px-3 font-semibold transition border-b-2 cursor-pointer flex items-center space-x-1.5 ${
                          imageTab === 'URL'
                            ? 'border-emerald-800 text-emerald-800 dark:border-emerald-400 dark:text-emerald-400'
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                        <span>Paste Link</span>
                      </button>
                    </div>

                    {/* Tab 1: Available Preset Options Grid */}
                    {imageTab === 'PRESET' && (
                      <div className="space-y-2">
                        <span className="text-[11px] text-slate-500 font-medium block">
                          Click any commodity below to assign it immediately:
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-52 overflow-y-auto pr-1">
                          {AVAILABLE_COMMODITY_PRESETS.map((preset) => (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => {
                                setSelectedImage(preset.image);
                                setImageError(null);
                              }}
                              className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-emerald-700 dark:hover:border-emerald-500 transition text-left cursor-pointer p-1.5 bg-white dark:bg-slate-800 hover:shadow-md"
                            >
                              <div className="relative h-14 w-full rounded-lg overflow-hidden bg-slate-900 mb-1">
                                <img 
                                  src={preset.image} 
                                  alt={preset.label} 
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/25" />
                              </div>
                              <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                                {preset.label}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate">
                                {preset.commodityType}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tab 2: Upload Own Image File */}
                    {imageTab === 'UPLOAD' && (
                      <div className="p-5 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-700 text-center space-y-2 bg-white dark:bg-slate-800/60 transition">
                        <Upload className="w-7 h-7 mx-auto text-emerald-800 dark:text-emerald-400" />
                        <div>
                          <label 
                            htmlFor="product_image_file" 
                            className="cursor-pointer font-bold text-emerald-800 dark:text-emerald-400 hover:underline text-xs"
                          >
                            Click to browse image from device
                          </label>
                          <span className="text-slate-500 text-xs"> (JPG, PNG, WEBP)</span>
                          <input
                            id="product_image_file"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileUpload}
                          />
                        </div>
                        <p className="text-[10px] text-slate-400">
                          Maximum file size: 5MB. Photo will be displayed on Kirana pool cards and commodity detail pages.
                        </p>
                      </div>
                    )}

                    {/* Tab 3: Paste Direct Image Link */}
                    {imageTab === 'URL' && (
                      <div className="space-y-2 bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                        <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block">
                          Direct Commodity Image URL (HTTPS)
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="url"
                            placeholder="https://images.unsplash.com/... or https://..."
                            value={customUrlInput}
                            onChange={(e) => setCustomUrlInput(e.target.value)}
                            className="flex-1 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (!customUrlInput.trim()) return;
                              setSelectedImage(customUrlInput.trim());
                              setImageError(null);
                            }}
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs transition cursor-pointer"
                          >
                            Apply URL
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Validation Feedback Warning */}
                {imageError && (
                  <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-[11px] font-medium flex items-center space-x-2 animate-shake">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                    <span>{imageError}</span>
                  </div>
                )}
              </div>

              {/* Standard Product Attributes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Product Name</label>
                  <input
                    name="name"
                    required
                    defaultValue={editingProduct?.name || ''}
                    placeholder="e.g. Sona Masoori Rice (25kg)"
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Category</label>
                  <select
                    name="category"
                    defaultValue={editingProduct?.category || 'Grains'}
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  >
                    <option value="Grains">Grains & Pulses</option>
                    <option value="Oils">Oils & Dairy</option>
                    <option value="Spices">Spices & Condiments</option>
                    <option value="Beverages">Beverages & Snacks</option>
                    <option value="Personal Care">Personal Care & Household</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Unit of Measure</label>
                  <input
                    name="unit_of_measure"
                    required
                    defaultValue={editingProduct?.unit_of_measure || 'bag'}
                    placeholder="bag, tin, carton"
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Unit Weight (kg)</label>
                  <input
                    name="unit_weight_kg"
                    type="number"
                    step="0.1"
                    defaultValue={editingProduct?.unit_weight_kg || 25.0}
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Retail Price (₹)</label>
                  <input
                    name="retail_price"
                    type="number"
                    step="0.5"
                    defaultValue={editingProduct?.retail_price || 1450}
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-emerald-800 dark:text-emerald-400 mb-1">Wholesale Base (₹)</label>
                  <input
                    name="wholesale_price"
                    type="number"
                    step="0.5"
                    required
                    defaultValue={editingProduct?.wholesale_price || 1180}
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1.5 font-semibold bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-emerald-800 dark:text-emerald-400 mb-1">Supplier MOQ</label>
                  <input
                    name="min_wholesale_quantity"
                    type="number"
                    step="1"
                    required
                    defaultValue={editingProduct?.min_wholesale_quantity || 40}
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1.5 font-semibold bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Available Stock</label>
                  <input
                    name="available_quantity"
                    type="number"
                    step="1"
                    required
                    defaultValue={editingProduct?.available_quantity || 500}
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Max Order Qty</label>
                  <input
                    name="max_order_quantity"
                    type="number"
                    step="1"
                    defaultValue={editingProduct?.max_order_quantity || ''}
                    placeholder="e.g. 1500"
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Radius (km)</label>
                  <input
                    name="service_radius_km"
                    type="number"
                    step="1"
                    defaultValue={editingProduct?.service_radius_km || 50}
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Lead Time (days)</label>
                  <input
                    name="lead_time_days"
                    type="number"
                    step="1"
                    defaultValue={editingProduct?.lead_time_days || 2}
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="is_available"
                  name="is_available"
                  defaultChecked={editingProduct ? editingProduct.is_available : true}
                  className="rounded border-slate-300 text-emerald-800 focus:ring-emerald-800 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="is_available" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  Product is currently active & open for Kirana group pooling
                </label>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-3.5 py-1.5 rounded-md text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-medium transition shadow-sm cursor-pointer"
                >
                  {editingProduct ? 'Save Changes' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
