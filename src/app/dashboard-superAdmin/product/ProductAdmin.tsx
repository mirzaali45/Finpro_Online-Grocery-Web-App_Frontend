"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

import Modal from "@/components/product-management/Modal";
import ProductForm from "@/components/product-management/ProductForm";
import ImageUploadForm from "@/components/product-management/ImageUploadForm";
import { Pagination } from "@/components/product-list/Pagination";

import { Product, ProductFormData } from "@/types/product-types";
import { productService } from "@/services/product.service";
import { formatRupiah } from "@/helper/currencyRp";
import Swal from "sweetalert2";

export default function ProductAdmin() {
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
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

  // Effects
  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  // Data fetching
  const fetchProducts = async (page: number) => {
    setLoading(true);
    try {
      const response = await productService.getProducts(page);
      setProducts(response.products);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Form handlers
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

  const handleImageUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProduct || selectedFiles.length === 0) return;

    setLoading(true);
    try {
      await productService.uploadProductImages(
        selectedProduct.product_id,
        selectedFiles
      );
      await fetchProducts(currentPage);
      setShowImageUploadModal(false);
      resetForm();
    } catch (error) {
      console.error("Error uploading images:", error);
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
      await fetchProducts(currentPage);
      setShowEditModal(false);
      resetForm();
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: number) => {
    // Show confirmation dialog with SweetAlert2
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this deletion!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        confirmButton: "py-2 px-4 mx-2 rounded-lg",
        cancelButton: "py-2 px-4 mx-2 rounded-lg",
        popup: "rounded-lg",
      },
    });

    // If user confirmed
    if (result.isConfirmed) {
      try {
        await productService.deleteProduct(productId);

        // Show success message
        Swal.fire({
          title: "Deleted!",
          text: "The product has been deleted successfully.",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
          timer: 2000,
          timerProgressBar: true,
        });

        // Refresh the products list
        await fetchProducts(currentPage);
      } catch (error) {
        // Show error message
        Swal.fire({
          title: "Error!",
          text: "Failed to delete the product. Please try again.",
          icon: "error",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        });

        console.error("Error deleting product:", error);
      }
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
    setSelectedProduct(null);
    setSelectedFiles([]);
  };

  // UI components
  const renderProductCard = (product: Product) => (
    <div
      key={product.product_id}
      className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
    >
      <div className="relative w-full h-48 bg-gray-50">
        {product.ProductImage?.[0] ? (
          <Image
            src={product.ProductImage[0].url}
            alt={product.name}
            fill
            className="object-cover absolute inset-0"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 line-clamp-1 hover:line-clamp-none transition-all duration-300">
          {product.name}
        </h3>

        <div className="space-y-2.5 mb-4 flex-grow">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Category</span>
            <span className="text-sm font-medium truncate max-w-[120px]">
              {product.category.category_name}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Price</span>
            <span className="text-sm font-medium text-blue-600">
              {formatRupiah(product.price)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Store</span>
            <span className="text-sm font-medium truncate max-w-[120px]">
              {product.store.store_name}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto">
          <button
            onClick={() => {
              setSelectedProduct(product);
              setFormData({
                name: product.name,
                description: product.description,
                price: product.price.toString(),
                category_id: product.category.category_id.toString(),
                store_id: product.store_id.toString(),
                initial_quantity: "",
              });
              setShowEditModal(true);
            }}
            className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Pencil className="w-4 h-4" /> Edit
          </button>
          <button
            onClick={() => handleDelete(product.product_id)}
            className="flex items-center gap-1 px-3 py-1.5 bg-red-50 border border-red-200 text-red-600 rounded-md hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Products Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your store&apos;s product catalog
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Content */}
      {loading && !products.length ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-blue-500"></div>
            <p className="mt-4 text-gray-500">Loading products...</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              All Products
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Showing {products.length} products
            </p>
          </div>

          <div className="p-6">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-500 text-center">
                  No products found. Start by adding a new product.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-center">
                {products.map((product) => (
                  <div key={product.product_id}>
                    {renderProductCard(product)}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center py-4 border-t border-gray-200">
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <Modal
        isOpen={showAddModal}
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
        isOpen={showEditModal}
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
        isOpen={showImageUploadModal}
        onClose={() => {
          setShowImageUploadModal(false);
          resetForm();
          fetchProducts(currentPage);
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
    </>
  );
}