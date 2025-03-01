// types/category-types.ts
export interface Category {
  id: number;
  category_name: string;
  description: string;
  category_thumbnail?: string;
  Product?: string;
}

export interface CategoryFormData {
  category_name: string;
  description: string;
}
