// types/category-types.ts
export interface Category {
  id: number;
  category_name: string;
  description: string;
  Product?: string;
}

export interface CategoryFormData {
  category_name: string;
  description: string;
}
