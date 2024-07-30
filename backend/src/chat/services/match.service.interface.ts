import { Server } from "socket.io";
import Match from "../interfaces/match.interface";
import User from "../interfaces/user.interface";

export interface IMatchService {

    create(user: User, wss: Server): Match; 

    exist(user: User): Match;

    delete(match: Match): void;

    deleteByUser(user: User): void;

    isValid(match: Match): boolean;
    
    
}