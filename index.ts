import WebSocket from 'ws';
import express from 'express';

let robot = require("robotjs");

const wss = new WebSocket.Server({port: 6942});

wss.on('connection', handleWS);

function handleWS(socket: WebSocket) {
    socket.on('open', () => {console.log('connected')})
    socket.on('message', data => {
        let obj = JSON.parse(data.toString());
        console.log(obj);
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
                console.log(obj.data);
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

app.listen(8081, () => {
    console.log(`App started: http://localhost:8081`);
});
