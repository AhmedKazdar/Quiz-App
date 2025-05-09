"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnlineGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt = require("jsonwebtoken");
const user_service_1 = require("../user/user.service");
const common_1 = require("@nestjs/common");
let OnlineGateway = class OnlineGateway {
    userService;
    server;
    constructor(userService) {
        this.userService = userService;
    }
    onlineUsersMap = new Map();
    getOnlineUsers() {
        return Array.from(this.onlineUsersMap.values());
    }
    async handleConnection(client) {
        const token = client.handshake.auth.token;
        if (!token) {
            client.disconnect();
            return;
        }
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET || '123456');
            const user = await this.userService.findById(payload.sub);
            if (!user) {
                client.disconnect();
                return;
            }
            const existingSocketId = [...this.onlineUsersMap.entries()].find(([_, username]) => username === user.username)?.[0];
            if (existingSocketId) {
                return;
            }
            this.onlineUsersMap.set(client.id, user.username);
            this.broadcastOnlineUsers();
        }
        catch (error) {
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        this.onlineUsersMap.delete(client.id);
        this.broadcastOnlineUsers();
    }
    broadcastOnlineUsers() {
        const users = Array.from(this.onlineUsersMap.values());
        console.log('Broadcasting online users:', users);
        this.server.emit('onlineUsers', users);
    }
};
exports.OnlineGateway = OnlineGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], OnlineGateway.prototype, "server", void 0);
exports.OnlineGateway = OnlineGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: 'http://localhost:5173',
        },
    }),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], OnlineGateway);
//# sourceMappingURL=online.gateway.js.map