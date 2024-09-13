/* eslint-disable */
interface User {
  login: string;
  name: string;
  bio: string;
  avatar_url: string;
  company: string;
  location: string;
  email: string;
}

interface Repo {
  id: number;
  name: string;
  html_url: string;
}

interface UserDetailProps {
  user: User;
  repos: Repo[];
}
