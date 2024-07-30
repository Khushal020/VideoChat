import { Inject, Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import Message from './interfaces/message.interface';
import { UserService } from './services/user.service';
import User from './interfaces/user.interface';
import { IUserService } from './services/user.service.interface';
import Match from './interfaces/match.interface';
import { IMatchService } from './services/match.service.interface';
import { IWaitingUserService } from './services/waiting.user.service.interface';
import SendCandidateDTO from './dtos/send.candidate.dto';
import ConnectionOfferDTO from './dtos/connection.offer.dto';
import ConnectionAnswerDTO from './dtos/connection.answer.dto';

@WebSocketGateway({
  cors: {
    origins: ["*"],
    credentials: true,
  },
  transport: ['websocket'],
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {


  constructor(@Inject('IUserService') private userService: IUserService,
              @Inject('IMatchService') private matchService: IMatchService,
              @Inject('IWaitingUserService') private waitingUserService: IWaitingUserService) {
    this.userService = userService;
  }

  private logger: Logger = new Logger('MessageGateway');

  @WebSocketServer() wss: Server;

  afterInit(server: Server) {
    this.logger.log('Initialized');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client Disconnected: ${client.id}`);

    const userId = client.handshake.headers.username || client.handshake.auth.username;

    const user = {id: userId, username: userId, socketId: client.id} as User;

    const existingMatch = this.matchService.exist(user);

    this.matchService.deleteByUser({id: userId} as User);
    this.userService.delete(userId);

    if(existingMatch == null){
      return;
    }
    
    this.matchService.create(existingMatch.user2, this.wss);

    // this.userService.removeUserBySocketId(client.handshake.headers);
  }

  handleConnection(client: Socket, ...args: any[]) {

    let user: User = {
      id: client.handshake.auth.username || client.handshake.headers.username,
      username: client.handshake.auth.username || client.handshake.headers.username,
      socketId: client.id,
    };

    this.wss.to(client.id).emit('connected', user);

    user = this.userService.create(user);

    const match = this.matchService.create(user, this.wss);

    this.logger.log(`Client Connected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleSendMessage(@ConnectedSocket() client: Socket, @MessageBody() { message, match }: Message): void {


    if(this.matchService.isValid(match)){
      this.wss.to(match.user2.socketId).emit('message', message);
    }
    return;
  }

  @SubscribeMessage('typing')
  handleSendTypingStatus(@ConnectedSocket() client: Socket, @MessageBody() { message, match }: Message): void {


    if(this.matchService.isValid(match)){
      this.wss.to(match.user2.socketId).emit('typing', message);
    }
    return;
  }

  @SubscribeMessage('next')
  handleNext(@ConnectedSocket() client: Socket, @MessageBody() match: Match): void {
    
    if (!this.matchService.isValid(match)) {
      return;
    }

    this.matchService.delete(match);

    const firstMatch = this.matchService.create(match.user1, this.wss);

    const secondMatch = this.matchService.create(match.user2, this.wss);
    return;
  }

  @SubscribeMessage('send_candidate')
  handleSendCandidates(@ConnectedSocket() client: Socket, @MessageBody() { candidate, match }: SendCandidateDTO): void {

    if (!this.matchService.isValid(match)) {
      return;
    }

    this.wss.to(match.user2.socketId).emit('send_candidate', {candidate, match} as SendCandidateDTO);
    return;
  }

  @SubscribeMessage('send_connection_offer')
  async sendConnectionOffer(@ConnectedSocket() client: Socket, @MessageBody() { offer, match }: ConnectionOfferDTO) {

    if (!this.matchService.isValid(match)) {
      return;
    }

    this.wss.to(match.user2.socketId).emit('send_connection_offer', {
      offer,
      match,
    });

    return;
  }

  @SubscribeMessage('answer')
  async answer(@ConnectedSocket() socket: Socket, @MessageBody() { answer, match }: ConnectionAnswerDTO) {

    if (!this.matchService.isValid(match)) {
      return;
    }

    this.wss.to(match.user2.socketId).emit('answer', {
      answer,
      match,
    });

    return;
  }

  @SubscribeMessage('is_valid_match')
  async isValidMatch(@ConnectedSocket() socket: Socket, @MessageBody() match: Match) {

    const isValid = this.matchService.isValid(match);
    
    this.wss.to(match.user1.socketId).emit('is_valid_match', isValid);

    return;
  }
}
