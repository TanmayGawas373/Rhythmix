export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface UserEditProps{
  name:string;
  email:string;
  role:string;
}