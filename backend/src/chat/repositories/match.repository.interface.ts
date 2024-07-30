import Match from "../interfaces/match.interface";
import User from "../interfaces/user.interface";

export interface IMatchRepository {

    create(userId1: string, userId2: string): boolean;

    delete(userId1: string, userId2: string): boolean;

    exist(userId: string): string;

    isValid(senderId: string, receiverId: string): boolean;
}