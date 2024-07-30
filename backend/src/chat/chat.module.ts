import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { ConfigModule } from "@nestjs/config";
import { repositoryProviders } from "./repositories/repository.provider";
import { serviceProviders } from "./services/service.provider";


@Module({
    imports: [
        ConfigModule,
    ],
    providers: [
        ...repositoryProviders,
        ...serviceProviders,
        ChatGateway],
    exports: [ChatGateway]
  })
export class ChatModule {}
