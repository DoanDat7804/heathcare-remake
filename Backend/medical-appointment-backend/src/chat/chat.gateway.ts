import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { user_msg: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(data)
    const message = await this.chatService.createMessage(data);
    client.emit('newMessage', message); // Gửi lại cho người gửi
  }
}