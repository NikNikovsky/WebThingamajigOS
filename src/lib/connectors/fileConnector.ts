import { BaseConnector, ApiResponse } from './baseConnector';

export interface FileMetadata {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  size: number;
  createdAt: string;
  updatedAt: string;
}

export interface FileContent {
  id: string;
  name: string;
  path: string;
  content: string;
  type: string;
}

export class FileConnector extends BaseConnector {
  async listFiles(dirPath: string = '/'): Promise<ApiResponse<FileMetadata[]>> {
    const encodedPath = encodeURIComponent(dirPath);
    return this.get<FileMetadata[]>(`/api/files/list?path=${encodedPath}`);
  }

  async getFile(filePath: string): Promise<ApiResponse<FileContent>> {
    const encodedPath = encodeURIComponent(filePath);
    return this.get<FileContent>(`/api/files/get?path=${encodedPath}`);
  }

  async saveFile(
    filePath: string,
    content: string,
    type: string = 'text/plain'
  ): Promise<ApiResponse<FileMetadata>> {
    return this.post<FileMetadata>('/api/files/save', {
      path: filePath,
      content,
      type,
    });
  }

  async deleteFile(filePath: string): Promise<ApiResponse<{ message: string }>> {
    return this.post('/api/files/delete', {
      path: filePath,
    });
  }

  async createFolder(folderPath: string): Promise<ApiResponse<FileMetadata>> {
    return this.post<FileMetadata>('/api/files/create-folder', {
      path: folderPath,
    });
  }

  async renameFile(
    oldPath: string,
    newName: string
  ): Promise<ApiResponse<FileMetadata>> {
    return this.post<FileMetadata>('/api/files/rename', {
      oldPath,
      newName,
    });
  }
}

export const fileConnector = new FileConnector();
