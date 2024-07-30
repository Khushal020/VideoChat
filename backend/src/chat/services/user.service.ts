import { Inject, Injectable } from "@nestjs/common";
import User from "../interfaces/user.interface";
import { IUserRepository } from "../repositories/user.repository.interface";
import { UserRepository } from "../repositories/user.repositories";

@Injectable()
export class UserService {


    constructor(@Inject('IUserRepository') private userRepository: IUserRepository){}

    getById(id: string): User {

        return this.userRepository.getById(id);
    }

    create(user: User): User {
        return this.userRepository.create(user);
    }

    delete(id: string): void {
        this.userRepository.delete(id);
    }
}