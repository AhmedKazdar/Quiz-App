import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { UserService } from '../user/user.service';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
  },
})
@Injectable()
export class OnlineGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly userService: UserService) {}

  private onlineUsersMap = new Map<string, string>(); // Socket ID -> Username

  getOnlineUsers(): string[] {
    return Array.from(this.onlineUsersMap.values());
  }

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token;

    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const payload: any = jwt.verify(
        token,
        process.env.JWT_SECRET || '123456',
      );
      const user = await this.userService.findById(payload.sub);

      if (!user) {
        client.disconnect();
        return;
      }

      // Check if the user is already connected by looking for their username in the onlineUsersMap
      const existingSocketId = [...this.onlineUsersMap.entries()].find(
        ([_, username]) => username === user.username,
      )?.[0];

      // If the user is already in the map, we should not add them again
      if (existingSocketId) {
        // Optionally, you can update the existing socket with the new client ID if needed.
        // But for now, we will skip adding them again to prevent duplicate usernames.
        return;
      }

      // Add user to the online users map if they are not already added
      this.onlineUsersMap.set(client.id, user.username);

      // Broadcast the updated list of online users
      this.broadcastOnlineUsers();
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // Remove the user from the map when the client disconnects
    this.onlineUsersMap.delete(client.id);
    this.broadcastOnlineUsers();
  }

  private broadcastOnlineUsers() {
    const users = Array.from(this.onlineUsersMap.values());
    console.log('Broadcasting online users:', users); // Log the current online users
    this.server.emit('onlineUsers', users);
  }
}
