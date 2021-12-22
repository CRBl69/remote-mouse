const api = new Api();

let reconnect = document.getElementById('reconnect');

api.onWsClose(() => {
    reconnect.classList.remove('hidden');
});

reconnect.addEventListener('click', () => {
    api.reconnect();
    setTimeout(() => {
        if(api.isConnected()) {
            reconnect.classList.add('hidden');
        }
    }, 100)
})

let touchpad = document.getElementById('main');
let leftClick = document.getElementById('left-click');
let rightClick = document.getElementById('right-click');
let keyboard = document.getElementById('keyboard');
let specialKeysContainer = document.getElementById('special-keys');
let keyboardButton = document.getElementById('keyboard-button');
let doubleClick = false;
let scrolling = false;
let specialKeys = {
    command: document.getElementById('meta'),
    control: document.getElementById('ctrl'),
    shift: document.getElementById('shift'),
    alt: document.getElementById('alt'),
    escape: document.getElementById('escape'),
    delete: document.getElementById('del'),
    backspace: document.getElementById('backspace'),
    enter: document.getElementById('enter'),
    left: document.getElementById('left'),
    right: document.getElementById('right'),
    up: document.getElementById('up'),
    down: document.getElementById('down'),
}

let buffer = {
    x: 0,
    y: 0
}

let start = {
    x: 0,
    y: 0
}

keyboardButton.onclick = () => {
    if (keyboardButton.innerText == 'Keyboard') {
        specialKeysContainer.classList.remove('hidden');
        keyboardButton.innerText = 'Hide';
        keyboard.focus();
    } else {
        specialKeysContainer.classList.add('hidden');
        keyboardButton.innerText = 'Keyboard';
    }
}

keyboard.onkeyup = () => {
    api.sendKey(keyboard.value);
    keyboard.value = '';
}

keyboard.addEventListener("compositionstart", function(event) {
    event.preventDefault();
});

leftClick.onclick = () => {
    api.mouseClick('left');
}

rightClick.onclick = () => {
    api.mouseClick('right');
}

touchpad.ontouchstart = (data) => {
    buffer = {
        x: data.changedTouches['0'].clientX,
        y: data.changedTouches['0'].clientY
    }
    start = {
        x: data.changedTouches['0'].clientX,
        y: data.changedTouches['0'].clientY
    }
    if (doubleClick == true) {
        api.mouseToggle('left', 'down');
    }
}

touchpad.ontouchend = (data) => {
    buffer = {
        x: data.changedTouches['0'].clientX,
        y: data.changedTouches['0'].clientY
    }
    if (Math.abs(buffer.x - start.x) < 10 && Math.abs(buffer.y - start.y) < 10 && scrolling == false) {
        api.mouseClick('left');
    }
    api.mouseToggle('left', 'up');
    doubleClick = true;
    setTimeout(() => { doubleClick = false }, 100);
    scrolling = false;
}

touchpad.ontouchmove = (data) => {
    data.preventDefault();
    if(data.changedTouches.length > 1) {
        scrolling = true;
    }
    let x = data.changedTouches['0'].clientX;
    let y = data.changedTouches['0'].clientY;
    if(!scrolling) {
        api.mouseMove(x - buffer.x, y - buffer.y);
    } else {
        api.scroll(y - buffer.y);
    }
    buffer = { x, y }
}

let clickToggle = (element) => {
    element.classList.toggle('clicked');
};

let toggleSpecialKeys = ["alt", "shift", "control", "command"];

for(let toggleKey of toggleSpecialKeys) {
    specialKeys[toggleKey].onclick = () => clickToggle(specialKeys[toggleKey]);
}

for (let element in specialKeys) {
    if(toggleSpecialKeys.find(key => key === element)) {
        specialKeys[element].addEventListener('click', () => {
            let isDown = !specialKeys[element].classList.contains("clicked");
            if(isDown) {
                api.keyUp(element);
            } else {
                api.keyDown(element);
            }
        })
    } else {
        specialKeys[element].addEventListener('click', () => {
            api.sendKey(element);
        })
    }
}
