import { iPrescription } from './ticket';

export interface iConsumer {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  uid: string;
  dob: string | number | Date;
  age: string | number;
  gender: 'M' | 'F' | 'O';
}

interface iTicket {
  _id: string;
  consumer: string;
  prescription: iPrescription;
  creator: string;
  assigned: string;
  stage: string;
}

export interface iConsumerStore {
  registerUhid: string;
  setRegisterUhid: (registerUhid: string) => void;
  searchResults: iConsumer[];
  setSearchResults: (consumers: iConsumer[]) => void;
  consumerHistory: iTicket[];
  setConsumerHistory: (ticket: iTicket[]) => void;
}
