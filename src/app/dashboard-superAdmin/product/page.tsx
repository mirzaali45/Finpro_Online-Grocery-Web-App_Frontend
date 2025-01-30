// app/admin/products/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Sidebar from "@/components/sidebarSuperAdmin";
import Modal from "@/components/product-management/Modal";
import ProductForm from "@/components/product-management/ProductForm";
import ImageUploadForm from "@/components/product-management/ImageUploadForm";
import { productService } from "@/components/hooks/useProductAdmin";
import { Product, ProductFormData } from "@/types/product-types";
import { formatRupiah } from "@/helper/currencyRp";

export default function ProductAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showImageUploadModal, setShowImageUploadModal] =
    useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    category_id: "",
    store_id: "",
    initial_quantity: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newProduct = await productService.createProduct(formData);
      setSelectedProduct(newProduct);
      setShowAddModal(false);
      setShowImageUploadModal(true);
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!selectedProduct) throw new Error("No product selected");
      await productService.updateProduct(selectedProduct.product_id, formData);
      await fetchProducts();
      setShowEditModal(false);
      resetForm();
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await productService.deleteProduct(productId);
      await fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleImageUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProduct || selectedFiles.length === 0) return;

    setLoading(true);
    try {
      await productService.uploadProductImages(
        selectedProduct.product_id,
        selectedFiles
      );
      await fetchProducts();
      setShowImageUploadModal(false);
      resetForm();
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category_id: "",
      store_id: "",
      initial_quantity: "",
    });
    setSelectedFiles([]);
    setSelectedProduct(null);
  };

  const renderProductCard = (product: Product) => (
    <div
      key={product.product_id}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
    >
      <div className="p-4">
        {product.ProductImage?.[0] && (
          <div className="relative w-full h-48 mb-4">
            <Image
              src={product.ProductImage[0].url}
              alt={product.name}
              fill
              className="object-cover rounded-md"
            />
          </div>
        )}
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-sm mb-2">{product.description}</p>
        <p className="font-bold mb-2">{formatRupiah(product.price)}</p>
        <p className="font-bold mb-2">{product.store.store_name}</p>
        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              setSelectedProduct(product);
              setFormData({
                name: product.name,
                description: product.description,
                price: product.price.toString(),
                category_id: product.category_id.toString(),
                store_id: product.store_id.toString(),
                initial_quantity: "",
              });
              setShowEditModal(true);
            }}
            className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Pencil className="w-4 h-4" /> Edit
          </button>
          <button
            onClick={() => handleDelete(product.product_id)}
            className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="p-4 ml-[10vw]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Products Management</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>

        {loading && !products.length ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(renderProductCard)}
          </div>
        )}

        <Modal
          show={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            resetForm();
          }}
          title="Add New Product"
        >
          <ProductForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            loading={loading}
            submitText="Create Product"
            loadingText="Creating..."
          />
        </Modal>

        <Modal
          show={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            resetForm();
          }}
          title="Edit Product"
        >
          <ProductForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleUpdate}
            loading={loading}
            submitText="Update Product"
            loadingText="Updating..."
            isEdit
          />
        </Modal>

        <Modal
          show={showImageUploadModal}
          onClose={() => {
            setShowImageUploadModal(false);
            resetForm();
            fetchProducts();
          }}
          title="Upload Product Images"
        >
          <ImageUploadForm
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            onSubmit={handleImageUpload}
            loading={loading}
          />
        </Modal>
      </div>
    </div>
  );
}
