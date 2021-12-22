# Control your desktop remotely !

This is a simple tool to control your desktop (linux, not tested on windows)
remotely using your phone.

Want to skip to the next episode from your bed without having to get up ?
Me neither, that's why I made this thing ! Go to `http://your-desktop-id:8081`
and start taking control of your PC with your phone.

## Set up

```bash
$ git clone https://github.com/CRBl69/remote-mouse.git
$ cd remote-mouse
$ npm run start
```

Then go to the `http://your-desktop-ip:8081` and you're good to go.

There is a gamepad available at `http://your-desktop-ip:8081/gamepad.html`

## Future

Changing ports is not yet supported, but is comming in the near future.

Some other features are planned to be implemented:

- support non-touch devices
- more layouts
- better keyboard experience (which currently sucks)

## Disclaimer

This is a WIP personal project, don't use this in serious environements for
remote control (obviously).

Help/features request are welcome.

I know there is KDE Connect but you can't use it without 500MB of KDE
packages so meh... Plus it does not support everything (like a gamepad
layout) as far as I know.
