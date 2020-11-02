import { Channel } from "./Channel";
import { User } from "./User";

export interface Server {
  id: number;
  name: string;
  users: User[];
  channels: Channel[];
  createTime: string;
  updateTime: string;
};
