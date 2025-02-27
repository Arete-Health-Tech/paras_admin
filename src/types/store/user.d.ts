import { Roles } from '../../constants/types';

export interface iUser {
  Unit: ObjectId;
  _id: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  uid: string;
  role: Roles;
  image: string;
  access: string;
  refresh: string;
}

export interface iUserStore {
  user: null | iUser;
  setUser: (user: iUser | null) => void;
  
}
