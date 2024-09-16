export interface IUser {
  avatar: string
  nick_name: string
  is_admin: boolean
  id: number
  email: string
  user_name: string
  createdAt: string
  updatedAt: string
}

export type loginData = {
  user_name: string
  password: string
  confirm_password: string
  nick_name?: string
  email?: string
}
