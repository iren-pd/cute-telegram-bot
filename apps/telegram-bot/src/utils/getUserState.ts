import { User, UserRole } from "../models/user.model";

const isGuest = (user: User) => user.role === UserRole.GUEST;
const isUser = (user: User) => user.role === UserRole.USER;
const isAdmin = (user: User) => user.role === UserRole.ADMIN;

export { isGuest, isUser, isAdmin };

