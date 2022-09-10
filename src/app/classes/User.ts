import { Role } from "./Role";

export class User {
    id?: number;
    email?: string;
    password?:string;
    role?: any
    username?: string;
    verificationToken?:string
    maxDateValidation?:Date
    isEmailConfirmed?:boolean
  
}

