import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import type { DogProfile, Event, Post, Notice, Tag, OwnerProfile, Comment } from './types';

// API設定
const API_CONFIG = {
  baseURL: process.env. || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// カスタムエラークラス
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Axiosインスタンスの作成
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create(API_CONFIG);

  // リクエストインターセプター
  instance.interceptors.request.use(
    (config) => {
      // トークンの自動追加
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // レスポンスインターセプター
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response) {
        const { status, data } = error.response;
        const errorMessage = (data as any)?.detail || 'APIエラーが発生しました';
        throw new ApiError(status, errorMessage, data);
      }
      throw new ApiError(0, 'ネットワークエラーが発生しました');
    }
  );

  return instance;
};

const api = createApiInstance();

// 型定義
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  address: string;
  phoneNumber: string;
  imabariResidency: string;
  vaccinationCertificate: File;
  dogName: string;
  dogBreed: string;
  dogWeight: number;
  dogPersonality: string[];
  dogLastVaccinationDate: string;
}

export interface CreatePostRequest {
  content: string;
  category: string;
  hashtags?: string;
  image?: File;
}

export interface AddCommentRequest {
  postId: number;
  text: string;
}

export interface AddDogRequest {
  name: string;
  breed: string;
  weight: string;
  personality: string[];
  lastVaccinationDate: string;
  vaccinationCertificate: File;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// API関数
export const apiClient = {
  // 認証関連
  login: async (data: LoginRequest): Promise<ApiResponse<{ access_token: string; token_type: string }>> => {
    try {
      const response = await api.post('/auth/login', data);
      const { access_token } = response.data;
      localStorage.setItem('access_token', access_token);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  register: async (data: RegisterRequest): Promise<ApiResponse<OwnerProfile>> => {
    try {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('fullName', data.fullName);
      formData.append('address', data.address);
      formData.append('phoneNumber', data.phoneNumber);
      formData.append('imabariResidency', data.imabariResidency);
      formData.append('vaccinationCertificate', data.vaccinationCertificate);

      const response = await api.post('/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  forgotPassword: async (email: string): Promise<ApiResponse<{ message: string }>> => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: (): void => {
    localStorage.removeItem('access_token');
  },

  // ユーザー関連
  getCurrentUser: async (): Promise<ApiResponse<OwnerProfile>> => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateUserProfile: async (data: Partial<OwnerProfile>): Promise<ApiResponse<OwnerProfile>> => {
    try {
      const response = await api.put('/users/profile', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 犬のプロフィール関連
  getUserDogs: async (): Promise<ApiResponse<DogProfile[]>> => {
    try {
      const response = await api.get('/dogs');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addDog: async (data: AddDogRequest): Promise<ApiResponse<DogProfile>> => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('breed', data.breed);
      formData.append('weight', data.weight);
      formData.append('personality', JSON.stringify(data.personality));
      formData.append('lastVaccinationDate', data.lastVaccinationDate);
      formData.append('vaccinationCertificate', data.vaccinationCertificate);

      const response = await api.post('/dogs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateDog: async (dogId: number, data: Partial<DogProfile>): Promise<ApiResponse<DogProfile>> => {
    try {
      const response = await api.put(`/dogs/${dogId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteDog: async (dogId: number): Promise<ApiResponse<{ message: string }>> => {
    try {
      const response = await api.delete(`/dogs/${dogId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 投稿関連
  getPosts: async (params?: { tag?: string; search?: string }): Promise<ApiResponse<Post[]>> => {
    try {
      const response = await api.get('/posts', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createPost: async (data: CreatePostRequest): Promise<ApiResponse<Post>> => {
    try {
      const formData = new FormData();
      formData.append('content', data.content);
      formData.append('category', data.category);
      if (data.hashtags) formData.append('hashtags', data.hashtags);
      if (data.image) formData.append('image', data.image);

      const response = await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  likePost: async (postId: number): Promise<ApiResponse<{ message: string }>> => {
    try {
      const response = await api.post(`/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addComment: async (data: AddCommentRequest): Promise<ApiResponse<Comment>> => {
    try {
      const response = await api.post(`/posts/${data.postId}/comments`, {
        text: data.text,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // イベント関連
  getEvents: async (): Promise<ApiResponse<Event[]>> => {
    try {
      const response = await api.get('/events');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCalendar: async (year: number, month: number): Promise<ApiResponse<any>> => {
    try {
      const response = await api.get(`/calendar/${year}/${month}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // お知らせ関連
  getNotices: async (): Promise<ApiResponse<Notice[]>> => {
    try {
      const response = await api.get('/notices');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  markNoticeAsRead: async (noticeId: number): Promise<ApiResponse<{ message: string }>> => {
    try {
      const response = await api.put(`/notices/${noticeId}/read`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 入場関連
  scanQRCode: async (qrData: string): Promise<ApiResponse<{ message: string; qr_data: string }>> => {
    try {
      const response = await api.post('/entry/scan', { qrData });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  enterDogRun: async (dogIds: number[]): Promise<ApiResponse<{ message: string; dog_ids: number[] }>> => {
    try {
      const response = await api.post('/entry/enter', { dogIds });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  exitDogRun: async (): Promise<ApiResponse<{ message: string }>> => {
    try {
      const response = await api.post('/entry/exit');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // タグ関連
  getTags: async (): Promise<ApiResponse<Tag[]>> => {
    try {
      const response = await api.get('/tags');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// ユーティリティ関数
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('access_token');
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('access_token');
};

export default apiClient; 