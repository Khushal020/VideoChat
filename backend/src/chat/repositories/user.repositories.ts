import { Injector } from "@nestjs/core/injector/injector";
import User from "../interfaces/user.interface";
import { IUserRepository } from "./user.repository.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserRepository implements IUserRepository {

    users: Map<string, User>;

    constructor() {

        this.users = new Map<string, User>();
    }

    getById(id: string): User {

        return this.users.get(id);
    }

    create(user: User): User {
        this.users.set(user.id, user);
        
        return this.getById(user.id);
    }

    delete(id: string): void {

        this.users.delete(id);
    }

    upsert(user: User): User {

        user = this.create(user);
        return user;
    }


}