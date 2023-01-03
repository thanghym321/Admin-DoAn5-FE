import { Role } from "./role";

export class User {
    user_Id: number;
    userName: string;
    passWord: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    role: Role;
    token?: string;
}
