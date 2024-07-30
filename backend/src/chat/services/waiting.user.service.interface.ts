import User from "../interfaces/user.interface";

export interface IWaitingUserService {
    get(): User;
    create(userId: string): string;
    delete(userId: string): void;
}