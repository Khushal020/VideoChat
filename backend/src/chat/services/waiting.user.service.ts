import { Inject, Injectable } from "@nestjs/common";
import User from "../interfaces/user.interface";
import { IWaitingUserRepository } from "../repositories/waiting.user.repository.interface";
import { IUserService } from "./user.service.interface";
import { IWaitingUserService } from "./waiting.user.service.interface";

@Injectable()
export class WaitingUserService implements IWaitingUserService {
    
    constructor(@Inject('IWaitingUserRepository') private waitingUserRepository: IWaitingUserRepository,
                @Inject('IUserService') private userService: IUserService){

    }

    get(): User {
        while(true){
            const userId = this.waitingUserRepository.get();

            if(!userId) {
                return null;
            }

            const user = this.userService.getById(userId);

            if(user) {
                return user;
            }
        }
    }

    create(userId: string): string {
        this.waitingUserRepository.create(userId);
        return userId;
    }

    delete(userId: string): void {
        this.waitingUserRepository.delete(userId);
        return;
    }
}