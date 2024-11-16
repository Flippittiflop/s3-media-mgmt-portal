import axios from 'axios';
import { Auth } from 'aws-amplify';

const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

export interface MediaMetadata {
  categoryId: string;
  title: string;
  description?: string;
  filename: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
}

interface UploadOptions {
  file: File;
  metadata: MediaMetadata;
  onProgress?: (progress: number) => void;
}

export class MediaService {
  private static async getAuthHeader() {
    const session = await Auth.currentSession();
    return {
      Authorization: `Bearer ${session.getIdToken().getJwtToken()}`,
    };
  }

  static async uploadMedia({ file, metadata, onProgress }: UploadOptions): Promise<void> {
    const headers = await this.getAuthHeader();
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));

    await axios.post(`${API_URL}/admin/media`, formData, {
      headers: {
        ...headers,
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });
  }

  static async getMediaByCategory(categoryId: string): Promise<any[]> {
    const headers = await this.getAuthHeader();
    const response = await axios.get(`${API_URL}/admin/media/${categoryId}`, { headers });
    return response.data;
  }
}