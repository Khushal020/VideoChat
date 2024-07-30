import { Inject } from "@nestjs/common";
import User from "../interfaces/user.interface";
import { IWaitingUserRepository } from "./waiting.user.repository.interface";
import { IUserRepository } from "./user.repository.interface";

export class WaitingUserRepository implements IWaitingUserRepository {

    private waitingUsers: Array<string>;

    constructor(){
        this.waitingUsers = [];
    }

    get(): string {
        if(this.waitingUsers.length == 0){
            return null;
        }
        
        return this.waitingUsers.pop();
    }

    create(userId: string): string{
        this.waitingUsers.push(userId);
        return userId;
    }

    delete(userId: string): void {
        const index = this.waitingUsers.findIndex(u => u === userId);
        this.waitingUsers.splice(index);
        return;
    }


}