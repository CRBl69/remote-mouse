// The Api object used to comunicate with the server
let api;

fetch('/ws-port').then(res => res.text()).then(res => {
    api = new Api(res);

    api.onWsClose(() => {
        reconnect.classList.remove('hidden');
    });
});

let reconnect = document.getElementById('reconnect');

reconnect.addEventListener('click', () => {
    api.reconnect();
    setTimeout(() => {
        if(api.isConnected()) {
            reconnect.classList.add('hidden');
        }
    }, 100)
})

// The fullscreen button
let fullscreen = document.getElementById("fullscreen");

// The joystick element
let joystickElement = document.getElementById("joystick");
joystick(document.getElementById("joystick"));
let clickStack = 0;

// The keayboard buttons and their corresponding name
let keyboard = {
    w: {
        element: document.getElementById("w"),
        name: "w",
    },
    a: {
        element: document.getElementById("a"),
        name: "a",
    },
    s: {
        element: document.getElementById("s"),
        name: "s",
    },
    d: {
        element: document.getElementById("d"),
        name: "d",
    },
    e: {
        element: document.getElementById("e"),
        name: "e",
    },
    esc: {
        element: document.getElementById("esc"),
        name: "escape",
    },
    ctrl: {
        element: document.getElementById("ctrl"),
        name: "control",
    },
    shift: {
        element: document.getElementById("shift"),
        name: "shift",
    },
    tab: {
        element: document.getElementById("tab"),
        name: "tab",
    },
}

// The mouse buttons
let mouseButtons = {
    left: document.getElementById("left-click"),
    right: document.getElementById("right-click"),
}
// Handlers for the mouse buttons
mouseButtons.left.ontouchstart = () => {
    mouseButtons.left.classList.add("clicked");
    api.mouseToggle('left', 'down');
};
mouseButtons.left.ontouchend = () => {
    mouseButtons.left.classList.remove("clicked");
    api.mouseToggle('left', 'up');
};
mouseButtons.right.ontouchstart = () => {
    mouseButtons.right.classList.add("clicked");
    api.mouseToggle('right', 'down');
};
mouseButtons.right.ontouchend = () => {
    mouseButtons.right.classList.remove("clicked");
    api.mouseToggle('right', 'up');
};

// Handler for the fullscreen button
fullscreen.onclick = () => {
    document.querySelector('html').requestFullscreen();
};

// Handler for the keyboard buttons
for(const entry of Object.entries(keyboard)) {
    const button = entry[1];
    button.element.ontouchstart = () => {
        api.keyDown(button.name);
        button.element.classList.add("clicked");
    }
    button.element.ontouchend = () => {
        api.keyUp(button.name);
        button.element.classList.remove("clicked");
    }
}

// Joystick logick
function joystick(elmnt) {
    let isPressed = false;
    let initialOffset = {
        x: 0,
        y: 0,
    };
    elmnt.addEventListener('touchstart', dragMouseDown);
    setInterval(() => {
        let distance = getPosition();
        if(isPressed) {
            api.mouseMove(distance.x/5, distance.y/5);
        }
    }, 20);

    function dragMouseDown(e) {
        e.preventDefault();
        isPressed = true;
        clickStack++;
        setTimeout(() => {
            if(clickStack > 1) {
                api.mouseToggle('left', 'down');
            } else if(isPressed == false) {
                api.mouseClick('left');
            }
            clickStack--;
        }, 200);
        let touch = Object.values(e.changedTouches).find(t => t.target.id == 'joystick');
        initialOffset.x = touch.clientX - elmnt.parentNode.getBoundingClientRect().left - elmnt.parentNode.offsetWidth/2;
        initialOffset.y = touch.clientY - elmnt.parentNode.getBoundingClientRect().top - elmnt.parentNode.offsetHeight/2;
        elmnt.addEventListener('touchend', closeDragElement);
        elmnt.addEventListener('touchmove', elementDrag);
    }

    function elementDrag(e) {
        e.preventDefault();

        // Get the touch that is on the joystick
        let touch = Object.values(e.changedTouches).find(t => t.target.id == 'joystick');

        // The touch coordonates relative to the neutral position
        let touchCoords = {
            x: touch.clientX - elmnt.parentNode.getBoundingClientRect().left - elmnt.parentNode.offsetWidth/2 - initialOffset.x,
            y: touch.clientY - elmnt.parentNode.getBoundingClientRect().top - elmnt.parentNode.offsetHeight/2 - initialOffset.y,
        };
        let angle = getAngle(touchCoords);
        let distance = getDistance(touchCoords);
        if(distance > elmnt.parentNode.offsetHeight/2) {
            distance = elmnt.parentNode.offsetHeight/2;
        }
        // The new coordonates of the joystick relative to the neutral position
        let coords = getCoords(distance, angle);
        elmnt.style.top = coords.y - elmnt.offsetHeight/2 + elmnt.parentNode.offsetHeight/2 + "px";
        elmnt.style.left = coords.x - elmnt.offsetWidth/2 + elmnt.parentNode.offsetWidth/2 + "px";
    }

    function closeDragElement() {
        isPressed = false;
        elmnt.removeEventListener('mouseup', closeDragElement);
        elmnt.removeEventListener('mousemove', elementDrag);
        api.mouseToggle('left', 'up');
        elmnt.style.top = (elmnt.parentNode.offsetHeight - elmnt.offsetHeight)/2 + "px";
        elmnt.style.left = (elmnt.parentNode.offsetWidth - elmnt.offsetWidth)/2 + "px";
    }

    /**
     * Get the position of the joystick
     * relative to its neutral position
     */
    function getPosition() {
        let move = {
            x: Math.floor(elmnt.offsetLeft - (elmnt.parentNode.offsetWidth - elmnt.offsetWidth)/2),
            y: Math.floor(elmnt.offsetTop - (elmnt.parentNode.offsetHeight - elmnt.offsetHeight)/2),
        };
        return move;
    }

    /**
     * Get the distance of the joystick
     * relative to its neutral position
     */
    function getDistance(coords) {
        let coordsAbs = {
            x: Math.abs(coords.x),
            y: Math.abs(coords.y),
        };
        let distance = Math.sqrt(Math.pow(coordsAbs.x, 2) + Math.pow(coordsAbs.y, 2));
        return distance;
    }

    /**
     * Get the angle of the joystick
     */
    function getAngle(coords) {
        let angle = Math.atan2(coords.y, coords.x);
        return angle;
    }

    /**
     * Get the coordinates of the given
     * point described by an angle and
     * a distance
     */
    function getCoords(distance, angle) {
        let coords = {
            x: Math.floor(distance * Math.cos(angle)),
            y: Math.floor(distance * Math.sin(angle)),
        };
        return coords;
    }
}
