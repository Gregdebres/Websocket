const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


app.use(express.static("public"));
wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", (message) => {
        console.log(`Received: ${message}`);
        ws.send(`Server: You said "${message}"`);
    });

    ws.on("close", () => console.log("Client disconnected"));
});

server.listen(3000, () => console.log("Server running on http://localhost:3000"));

// Frontend: public/index.html
const fs = require('fs');
const path = require('path');

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebSocket Chat</title>
</head>
<body>
    <h1>WebSocket Chat</h1>
    <input type="text" id="message" placeholder="Type a message...">
    <button onclick="sendMessage()">Send</button>
    <ul id="messages"></ul>
    
    <script>
        const ws = new WebSocket("ws://localhost:3000");

        ws.onmessage = (event) => {
            const messages = document.getElementById("messages");
            const li = document.createElement("li");
            li.textContent = event.data;
            messages.appendChild(li);
        };

        function sendMessage() {
            const input = document.getElementById("message");
            ws.send(input.value);
            input.value = "";
        }
    </script>
</body>
</html>
`;

const publicDir = path.join(__dirname, "public");
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}
fs.writeFileSync(path.join(publicDir, "index.html"), htmlContent, "utf8");
