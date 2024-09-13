export interface User {
  login: string;
  name: string; 
  avatar_url: string; 
}

export interface UserDetail {
  login: string;
  name: string;
  bio: string;
  avatar_url: string;
  company: string;
  location: string;
  email: string;
}

export interface Repo {
  id: number;
  name: string;
  html_url: string;
}

export interface UserDetailProps {
  user: UserDetail;
  repos: Repo[];
}
