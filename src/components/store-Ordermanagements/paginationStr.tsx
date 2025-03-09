"use client";  // Menandakan bahwa komponen ini dijalankan di sisi klien

import React from "react";

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const Paginationstr: React.FC<PaginationProps> = ({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize); // Hitung jumlah total halaman

  // Menangani ketika tombol "Prev" ditekan
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1); // Halaman sebelumnya
    }
  };

  // Menangani ketika tombol "Next" ditekan
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1); // Halaman berikutnya
    }
  };

  // Menangani perubahan ukuran halaman
  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = Number(event.target.value);
    onPageSizeChange(newPageSize); // Update pageSize
    // Reset halaman ke 1 ketika pageSize diubah
    onPageChange(1); 
  };

  return (
    <div className="flex justify-between items-center mt-6">
      <div>
        <label>Page Size: </label>
        <select
          value={pageSize}
          onChange={handlePageSizeChange}
          className="bg-gray-600 text-white px-3 py-2 rounded-md"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
};

export default Paginationstr;
