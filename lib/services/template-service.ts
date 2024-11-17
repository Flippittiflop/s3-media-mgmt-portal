import { API } from 'aws-amplify';
import { isAdmin } from '@/lib/auth';

export interface TemplateField {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  required: boolean;
  label: string;
}

export interface TemplateCreate {
  name: string;
  description?: string;
  fields: TemplateField[];
}

export interface Template extends TemplateCreate {
  id: string;
}

export class TemplateService {
  static async getTemplates(): Promise<Template[]> {
    try {
      const response = await API.get('api', '/admin/templates', {});
      return response;
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  }

  static async createTemplate(template: TemplateCreate): Promise<Template> {
    if (!await isAdmin()) {
      throw new Error('Unauthorized: Admin access required');
    }
    try {
      const response = await API.post('api', '/admin/templates', {
        body: template
      });
      return response;
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  }

  static async updateTemplate(id: string, template: TemplateCreate): Promise<Template> {
    if (!await isAdmin()) {
      throw new Error('Unauthorized: Admin access required');
    }
    try {
      const response = await API.put('api', `/admin/templates/${id}`, {
        body: template
      });
      return response;
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  }

  static async deleteTemplate(id: string): Promise<void> {
    if (!await isAdmin()) {
      throw new Error('Unauthorized: Admin access required');
    }
    try {
      await API.del('api', `/admin/templates/${id}`, {});
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  }
}