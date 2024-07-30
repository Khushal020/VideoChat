import { MatchService } from "./match.service";
import { UserService } from "./user.service";
import { WaitingUserService } from "./waiting.user.service";

export const serviceProviders = [
    {
        provide: 'IUserService',
        useClass: UserService,
    },
    {
        provide: 'IMatchService',
        useClass: MatchService,
    },    
    {
        provide: 'IWaitingUserService',
        useClass: WaitingUserService,
    },
]