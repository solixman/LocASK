export interface User {
  id: string;
  email: string;
  name: string | null;
  picture: string | null;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  latitude: number;
  longitude: number;
  distance?: number;
  userId: string;
  createdAt: string;
  likesCount: number;
  user?: {
    id: string;
    name: string | null;
    picture: string | null;
  };
  isLiked?: boolean;
}

export interface Answer {
  id: string;
  content: string;
  userId: string;
  questionId: string;
  createdAt: string;
  user?: {
    id: string;
    name: string | null;
    picture: string | null;
  };
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
