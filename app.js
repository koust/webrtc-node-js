// const WebSocket = require('ws');

// const wss = new WebSocket.Server({ port: (process.env.PORT || 5000) }, () => {
//     console.log("Signaling server is now listening on port 8080")
// });
const express = require('express')
const http = require('http')
const WebSocket = require('ws')

const port = process.env.PORT || 8080
const app = express()
const httpServer = http.createServer(app)
const wss = new WebSocket.Server({
    'server': httpServer
})
httpServer.listen(port)


// Broadcast to all.
wss.broadcast = (ws, data) => {
    wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

wss.on('connection', (ws) => {
    console.log(`Client connected. Total connected clients: ${wss.clients.size}`)
    
    ws.onmessage = (message) => {
        console.log(message.data + "\n");
        wss.broadcast(ws, message.data);
    }

    ws.onclose = () => {
        console.log(`Client disconnected. Total connected clients: ${wss.clients.size}`)
    }
});