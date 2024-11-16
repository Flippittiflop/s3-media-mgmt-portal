import axios from 'axios';
import { Auth } from 'aws-amplify';
import { isAdmin } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

export interface CategoryCreate {
  name: string;
  description?: string;
}

export interface Category extends CategoryCreate {
  id: string;
}

export class CategoryService {
  private static async getAuthHeader() {
    const session = await Auth.currentSession();
    return {
      Authorization: `Bearer ${session.getIdToken().getJwtToken()}`,
    };
  }

  static async getCategories(): Promise<Category[]> {
    const headers = await this.getAuthHeader();
    const response = await axios.get(`${API_URL}/admin/categories`, { headers });
    return response.data;
  }

  static async createCategory(category: CategoryCreate): Promise<Category> {
    if (!await isAdmin()) {
      throw new Error('Unauthorized: Admin access required');
    }
    const headers = await this.getAuthHeader();
    const response = await axios.post(`${API_URL}/admin/categories`, category, { headers });
    return response.data;
  }

  static async updateCategory(id: string, category: CategoryCreate): Promise<Category> {
    if (!await isAdmin()) {
      throw new Error('Unauthorized: Admin access required');
    }
    const headers = await this.getAuthHeader();
    const response = await axios.put(`${API_URL}/admin/categories/${id}`, category, { headers });
    return response.data;
  }

  static async deleteCategory(id: string): Promise<void> {
    if (!await isAdmin()) {
      throw new Error('Unauthorized: Admin access required');
    }
    const headers = await this.getAuthHeader();
    await axios.delete(`${API_URL}/admin/categories/${id}`, { headers });
  }
}