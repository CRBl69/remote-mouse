class Api {
    constructor(wsPort) {
        this.wsPort = wsPort;
        this.reconnect();
    }

    sendKey(key) {
        this._send("keypress", key);
    }

    keyDown(key) {
        this._send("keydown", key);
    }

    keyUp(key) {
        this._send("keyup", key);
    }

    mouseMove(x, y) {
        this._send("mousemove", {x, y});
    }

    mouseClick(left) {
        this._send("mouseclick", left);
    }

    mouseToggle(left, up) {
        this._send("mousetoggle", { left, up });
    }

    scroll(y) {
        this._send("scroll", y);
    }

    _send(type, data) {
        this.ws.send(JSON.stringify({ type, data }));
        console.log({ type, data });
    }

    onWsClose(callback) {
        this.ws.onclose = callback;
    }

    isConnected() {
        return this.ws.readyState == 1;
    }

    reconnect() {
        this.ws = new WebSocket(`ws://${location.hostname}:${this.wsPort}`);
    }
}
