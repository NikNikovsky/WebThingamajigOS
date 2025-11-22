import { BaseConnector, ApiResponse } from './baseConnector';

export interface UserSettings {
  theme?: 'light' | 'dark';
  language?: string;
  preferences?: Record<string, any>;
}

export interface UserProfile {
  userId: string;
  username: string;
  email?: string;
  createdAt: string;
  settings: UserSettings;
}

export class SettingsConnector extends BaseConnector {
  async getUserProfile(): Promise<ApiResponse<UserProfile>> {
    return this.get<UserProfile>('/api/user/profile');
  }

  async updateProfile(profile: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    return this.put<UserProfile>('/api/user/profile', profile);
  }

  async getSettings(): Promise<ApiResponse<UserSettings>> {
    return this.get<UserSettings>('/api/user/settings');
  }

  async updateSettings(settings: UserSettings): Promise<ApiResponse<UserSettings>> {
    return this.put<UserSettings>('/api/user/settings', settings);
  }

  async deleteAccount(): Promise<ApiResponse<{ message: string }>> {
    return this.post('/api/user/delete', {});
  }
}

export const settingsConnector = new SettingsConnector();
