import { IUser } from './user';

export interface AxiosResponse<T> {
  code: number | string;
  message: string;
  result: Result<T> | T;
}

export interface Result<T> {
  list?: T[];
  user?: IUser;
  accessToken?: string;
  refreshToken?: string;
  pageNum?: number;
  pageSize?: number;
  total?: number;
  url?: string | string[];
}

export type ErrorResponse = {
  code: string;
  message: string;
};

export type Notify =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'center';


export interface Dialog {
  open: () => void;
  close: () => void;
  validate: () => boolean;
}
export interface Handle {
  show: () => void;
  hide: () => void;
}
