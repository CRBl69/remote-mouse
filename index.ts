import WebSocket from 'ws';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

let robot = require("robotjs");

let wsPort = getWsPort();

let httpPort = getHttpPort();

const wss = new WebSocket.Server({port: wsPort});

wss.on('connection', handleWs);

function handleWs(socket: WebSocket) {
    socket.on('message', data => {
        let obj = JSON.parse(data.toString());
        switch (obj.type) {
            case 'keypress':
                robot.keyTap(obj.data);
                break;
            case 'keydown':
                robot.keyToggle(obj.data, 'down');
                break;
            case 'keyup':
                robot.keyToggle(obj.data, 'up');
                break;
            case 'mousemove':
                let mouse = robot.getMousePos();
                robot.moveMouse(mouse.x + obj.data.x * 3, mouse.y + obj.data.y * 3);
                break;
            case 'mouseclick':
                robot.mouseClick(obj.data);
                break;
            case 'mousetoggle':
                robot.mouseToggle(obj.data.up, obj.data.left);
                break;
            case 'scroll':
                robot.scrollMouse(0, obj.data / 10);
                break;
        }
    })
}

const app = express();

app.use(express.static('public'));

app.get('/ws-port', (_req, res) => {
    res.send(wsPort.toString());
})

app.listen(httpPort, () => {
    console.log(`Remote mouse started: http://localhost:${httpPort}`);
});

function getHttpPort(): number {
    let httpPort: number;
    try {
        if(process.env.HTTP_PORT) {
            httpPort = parseInt(process.env.HTTP_PORT);
        } else {
            httpPort = 8081;
        }
    } catch (e) {
        console.error("ERROR: HTTP_PORT is not a number, falling back to default port (8081)");
        httpPort = 8081;
    }
    return httpPort;
}

function getWsPort(): number {
    let wsPort: number;
    try {
        if(process.env.WS_PORT) {
            wsPort = parseInt(process.env.WS_PORT);
        } else {
            wsPort = 6942;
        }
    } catch (e) {
        console.error("ERROR: WS_PORT is not a number, falling back to default port (6942)");
        wsPort = 6942;
    }
    return wsPort;
}
