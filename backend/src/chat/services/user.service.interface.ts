import User from "../interfaces/user.interface";

export interface IUserService {

    getById(id: string): User;

    create(user: User): User;

    delete(id: string);
}