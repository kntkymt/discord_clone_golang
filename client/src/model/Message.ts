import { User } from './User';

export interface Message {
  id: number;
  content: string;
  user: User;
  createTime: string;
  updateTime: string;
};
