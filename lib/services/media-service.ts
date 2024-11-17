import { API } from 'aws-amplify';

export interface MediaMetadata {
  categoryId: string;
  title: string;
  description?: string;
  filename: string;
}

interface UploadOptions {
  file: File;
  metadata: MediaMetadata;
  onProgress?: (progress: number) => void;
}

export class MediaService {
  static async uploadMedia({ file, metadata, onProgress }: UploadOptions): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('metadata', JSON.stringify(metadata));

      await API.post('api', '/admin/media', {
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('Error uploading media:', error);
      throw error;
    }
  }

  static async getMediaByCategory(categoryId: string): Promise<any[]> {
    try {
      const response = await API.get('api', `/admin/media/${categoryId}`, {});
      return response;
    } catch (error) {
      console.error('Error fetching media:', error);
      throw error;
    }
  }
}
