import Match from "../interfaces/match.interface";
import User from "../interfaces/user.interface";
import { IMatchRepository } from "./match.repository.interface";

export class MatchRepository implements IMatchRepository {

    private matches: Object;

    constructor() {
        this.matches = {};
    }


    create(userId1: string, userId2: string): boolean {
        
        this.matches[userId1] = userId2;
        this.matches[userId2] = userId1;

        return true;
    }
    
    delete(userId1: string, userId2: string): boolean {
        delete this.matches[userId1];
        delete this.matches[userId2];

        return true;
    }

    exist(userId: string): string {
        if (this.matches[userId]) {
            return this.matches[userId];
        }

        return null;
    }

    isValid(senderId: string, receiverId: string): boolean {
        return this.matches[senderId] === receiverId;
    }

    
}