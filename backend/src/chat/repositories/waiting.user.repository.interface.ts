import User from "../interfaces/user.interface";

export interface IWaitingUserRepository {

    get(): string;

    create(userId: string): string;

    delete(userId: string): void;
}