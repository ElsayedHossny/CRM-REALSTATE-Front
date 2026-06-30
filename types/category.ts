export interface FilterInput {
  filterName: string;
  options: string[];
  currentOptionInput: string; // حقل مؤقت لإدخال الخيار في الفورم
}

export interface CategoryFilter {
  filterName: string;
  options: string[];
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  filiters: CategoryFilter[]; // مسمى الباك إند الحالي (filiters)
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryPayload {
  name: string;
  slug: string;
  filiters: CategoryFilter[];
}