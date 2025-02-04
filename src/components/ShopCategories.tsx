"use client";

import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { categoryService } from "@/components/hooks/useCategoryAdmin";
import { Category } from "@/types/category-types";
import Image from "next/image";

export default function ShopCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch categories"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="bg-black py-20">
        <div className="max-w-[1440px] mx-auto px-20 text-center">
          <div className="animate-pulse text-white text-2xl">
            Loading Categories...
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-black py-20">
        <div className="max-w-[1440px] mx-auto px-20 text-center">
          <div className="text-red-500 text-2xl">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-black py-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20">
        <h2 className="text-white text-3xl sm:text-4xl font-bold mb-12 text-center">
          Shop by Category
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.category_name}
              href={`/category/${category.category_name.toLowerCase()}`}
              className="bg-gray-800/50 rounded-lg p-6 sm:p-8 lg:p-12 flex flex-col items-center justify-center 
                 hover:bg-gray-800/70 hover:scale-105 transition-all duration-300 group aspect-square"
            >
              <div className="relative w-full h-1/2">
                <Image
                  src={category.category_thumbnail || "/placeholder.jpg"}
                  alt={`${category.category_name} thumbnail`}
                  fill
                  className="object-contain rounded-full group-hover:opacity-80 transition-opacity"
                />
              </div>
              <span className="text-white text-lg font-medium text-center mt-4 group-hover:text-gray-300 transition-colors">
                {category.category_name}
              </span>
            </Link>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center text-gray-500 mt-12">
            No categories available
          </div>
        )}
      </div>
    </section>
  );
}
