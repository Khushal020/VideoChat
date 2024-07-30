import User from "../interfaces/user.interface";

export interface IUserRepository {

    getById(id: string): User;

    create(user: User): User;

    delete(id: string): void;

    upsert(user: User): User;
}