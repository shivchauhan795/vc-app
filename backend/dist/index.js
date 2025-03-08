"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const uuid_1 = require("uuid");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let allSockets = [];
wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message);
        console.log("message ye hai", parsedMessage);
        if (parsedMessage.type === "join") {
            const user = allSockets.find((s) => s.socket === socket);
            if (!user) {
                allSockets.push({
                    socket,
                    username: parsedMessage.payload.name,
                    roomId: parsedMessage.payload.roomId,
                    id: (0, uuid_1.v4)()
                });
                console.log("all sockets", allSockets);
                const currentUser = allSockets.filter((s) => s.roomId === parsedMessage.payload.roomId && s.socket === socket);
                allSockets.filter((s) => s.roomId === parsedMessage.payload.roomId && s.socket !== socket).forEach((s) => s.socket.send(JSON.stringify({
                    type: "joined",
                    payload: {
                        username: parsedMessage.payload.name,
                        id: currentUser[0].id
                    }
                })));
            }
        }
        else if (parsedMessage.type === "user:call-offer") {
            console.log("inside call offer", parsedMessage.payload.remoteSocketId);
            const me = allSockets.find((s) => socket === s.socket);
            const receiver = allSockets.find((s) => s.id === parsedMessage.payload.remoteSocketId);
            if (receiver) {
                receiver.socket.send(JSON.stringify({
                    type: "incomming:call-offer",
                    payload: {
                        offer: parsedMessage.payload.offer,
                        remoteSocketId: me === null || me === void 0 ? void 0 : me.id
                    }
                }));
            }
            else {
                console.log("No user found with this remoteSocketId:", parsedMessage.payload.remoteSocketId);
            }
        }
        else if (parsedMessage.type === "user-call:accepted") {
            console.log("call accepted");
            const me = allSockets.find((s) => socket === s.socket);
            const receiver = allSockets.find((s) => s.id === parsedMessage.payload.remoteSocketId);
            if (receiver) {
                receiver.socket.send(JSON.stringify({
                    type: "call:accepted",
                    payload: {
                        remoteSocketId: me === null || me === void 0 ? void 0 : me.id,
                        ans: parsedMessage.payload.ans
                    }
                }));
            }
            else {
                console.log("No user found with this remoteSocketId:", parsedMessage.payload.remoteSocketId);
            }
        }
        else if (parsedMessage.type === "peer:negotiationneeded") {
            const me = allSockets.find((s) => socket === s.socket);
            const receiver = allSockets.find((s) => s.id === parsedMessage.payload.remoteSocketId);
            if (receiver) {
                receiver.socket.send(JSON.stringify({
                    type: "peer:negotiationneeded",
                    payload: {
                        offer: parsedMessage.payload.offer,
                        remoteSocketId: me === null || me === void 0 ? void 0 : me.id
                    }
                }));
            }
        }
        else if (parsedMessage.type === "peer:negotiationaccepted") {
            const me = allSockets.find((s) => socket === s.socket);
            const receiver = allSockets.find((s) => s.id === parsedMessage.payload.remoteSocketId);
            if (receiver) {
                receiver.socket.send(JSON.stringify({
                    type: "peer:negotiationFinal",
                    payload: {
                        ans: parsedMessage.payload.ans,
                        remoteSocketId: me === null || me === void 0 ? void 0 : me.id
                    }
                }));
            }
        }
    });
});
wss.on("disconnect", (socket) => {
    allSockets = allSockets.filter((s) => s.socket !== socket);
});
