import { Server } from "socket.io";
import Match from "../interfaces/match.interface";
import User from "../interfaces/user.interface";
import { IMatchRepository } from "../repositories/match.repository.interface";
import { IWaitingUserRepository } from "../repositories/waiting.user.repository.interface";
import { IMatchService } from "./match.service.interface";
import { IUserService } from "./user.service.interface";
import { IWaitingUserService } from "./waiting.user.service.interface";
import { Inject, Injectable } from "@nestjs/common";
import MatcherDTO from "../dtos/matcher.dto";

@Injectable()
export class MatchService implements IMatchService {

    constructor(@Inject('IUserService') private userService: IUserService,
                @Inject('IMatchRepository') private matchRepository: IMatchRepository,
                @Inject('IWaitingUserService') private waitingUserService: IWaitingUserService) {

                }

    create(user: User, wss: Server): Match {
        const matchingUser = this.waitingUserService.get();

        if(matchingUser == null || matchingUser.id === user.id){
            this.waitingUserService.create(user.id);
            return null;
        }

        const match = {
            user1: user,
            user2: matchingUser,
        } as Match;

        wss.to(match.user1.socketId).emit("matchedReceiver", { responsible: true, receiver: match.user2 } as MatcherDTO);
        wss.to(match.user2.socketId).emit("matchedReceiver", { responsible: false, receiver: match.user1 } as MatcherDTO);

        this.matchRepository.create(match.user1.id, match.user2.id);

        return match;
    }

    exist(user: User): Match {
        const matchingUserId = this.matchRepository.exist(user.id);

        if(matchingUserId == null){
            return null;
        }

        const matchingUser = this.userService.getById(matchingUserId);
        if(matchingUser == null){
            return null;
        }

        return {
            user1: user,
            user2: matchingUser,
        } as Match;
    }

    delete(match: Match): void {

        this.matchRepository.delete(match.user1.id, match.user2.id);
    }

    deleteByUser(user: User): void {
        const matchingUserId = this.matchRepository.exist(user.id);
        
        if(matchingUserId == null){
            return;
        }

        this.matchRepository.delete(user.id, matchingUserId);
    }

    isValid({user1, user2}: Match): boolean {
        return this.matchRepository.isValid(user1.id, user2.id);
    }
}