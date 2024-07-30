import { MatchRepository } from "./match.repository";
import { UserRepository } from "./user.repositories";
import { WaitingUserRepository } from "./waiting.user.repository";

export const repositoryProviders = [
    {
        provide: 'IUserRepository',
        useClass: UserRepository,
    },
    {
        provide: 'IMatchRepository',
        useClass: MatchRepository,
    },
    {
        provide: 'IWaitingUserRepository',
        useClass: WaitingUserRepository,
    },
]