export interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'admin';
  xp?: number;
  streak?: number;
}
