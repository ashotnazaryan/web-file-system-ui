import { Auth } from './auth';
import { Category, CategoryType } from './category';

export interface TransactionState {
  transactions: Transaction[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

export interface TransactionDTO {
  _id?: string;
  userId: Auth['userId'];
  categoryId: Category['id'];
  type: CategoryType;
  name: Category['name'];
  amount: number;
  percentValue?: number;
  createdAt: Date;
}

export interface Transaction {
  id?: string;
  userId: Auth['userId'];
  categoryId: Category['id'];
  type: CategoryType;
  name: Category['name'];
  amount: string;
  percentValue?: string;
  createdAt: string;
}