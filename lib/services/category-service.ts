import { API } from 'aws-amplify';
import { isAdmin } from '@/lib/auth';

export interface CategoryCreate {
  name: string;
  description?: string;
}

export interface Category extends CategoryCreate {
  id: string;
}

export class CategoryService {
  static async getCategories(): Promise<Category[]> {
    try {
      const response = await API.get('api', '/admin/categories', {});
      return response;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  static async createCategory(category: CategoryCreate): Promise<Category> {
    if (!await isAdmin()) {
      throw new Error('Unauthorized: Admin access required');
    }
    try {
      const response = await API.post('api', '/admin/categories', {
        body: category
      });
      return response;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  static async updateCategory(id: string, category: CategoryCreate): Promise<Category> {
    if (!await isAdmin()) {
      throw new Error('Unauthorized: Admin access required');
    }
    try {
      const response = await API.put('api', `/admin/categories/${id}`, {
        body: category
      });
      return response;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  static async deleteCategory(id: string): Promise<void> {
    if (!await isAdmin()) {
      throw new Error('Unauthorized: Admin access required');
    }
    try {
      await API.del('api', `/admin/categories/${id}`, {});
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
}
