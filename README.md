# websocket-game-server
A websocket connected game server with Express using React to display updates on the screen.

![Screenshot of the front-end component](/meta/screenshot.png?raw=true "Front-end component screenshot")

## Intro
------
### What does the demo offer from a user perspective?
* Player connects to game (``localhost:3001``)
* Player is put in a queue and informed on screen
* Player that is first in queue is shown a working start button
* Player clicks on start button. After a certain time (game duration is set by the ``NODE_ENV`` setting), the player is put back to the end of the queue and the start button is passed to the person next in line
* When a player disconnects, the people that occupy a position behind the player are moved forward in the queue and are informed of this

### Further features
* Logging to ``code\backend\logs(\game and \node)`` with my own library (https://github.com/deanvaessen/log-library)
* Different node environments ``(NODE_ENV)`` are able to influence the runtime options of the server. These are being generated from ``code\backend\config\config.js`` based on the current node environment (defined by the scripts in ``package.json``). As a demonstration of a possible option, took the duration of the game before the start button is passed to a different user as a variable that changes

## Usage
------
### How do I run it?
1. First ``npm install`` from ``code\``
2. Pick a run script from ``code\``:
    * Run
        * **``npm start`` - (Re)builds/prepares front-end and starts the back-end with ``NODE_ENV=prod``**
        * ``npm run start-prod`` - Start the back-end with ``NODE_ENV=prod``
        * ``npm run start-staging`` - Start the back-end with ``NODE_ENV=staging``


    * Develop
        * ``npm run start-dev`` - Re-builds/prepares front-end and starts the back-end with ``NODE_ENV=dev``
        * ``npm run start-dev-frontend`` - Starts the webpack dev server on ``http://localhost:3000`` to enable modification of the front-end app
        * ``npm run build`` - (Re)builds the front-end

**NOTES:**

1. Both ``npm start`` and ``npm start-dev`` first build and prepare latest front-end package for the back-end to serve (and copy it to the public dir of the back-end with NCP after), but the other options do not! If you need a new front-end build, run ``npm run build`` first.
2. ``npm run start-dev`` includes PM2 functionality to restart the server on back-end file changes, the others have this option disabled.

### How do I connect?
* If you are running ``start-dev-frontend``, connect to ``http://localhost:3000``
* For all other options: ``http://localhost:3001``

## Details
------
### Technology

**Front-end:**

* React for reactivity and game updates on the front-end

**Back-end:**

* Websockets for communication between front-end/back-end
* Express
* Bluebird
* Node.JS
* My own logging library for logging server/game events

**Ops:**

* PM2 to keep the server alive on crashes and watch for updates to development files that would warrant a server restart during development (disabled on prod)

**Development:**

* Webpack for the front-end build tooling, with webpack dev server and hot reloading of changes
* esLint for linting
* ES6 support with Babel

### File structure
* ``code\backend`` - Holds the back-end server
    * ``code\backend\config\`` - ``NODE_ENV`` specific settings
    * ``code\backend\logs\`` - Logs
    * ``code\backend\helpers\`` - Helpers for the back-end server
    * ``code\backend\public\`` - Public directory that holds the front-end app served by the back-end


* ``code\frontend`` - Holds the front-end tooling that is served by the backend (this folder is only used for development of the front-end app, not during operation)

## Extra notes
------
* Front-end is but a simplified supporting feature. The React component for example is just a simple component that is not further split into sub components. Same with the SCSS files.
* If you launch socket events from the frontend (like kicking someone) while you are in 'dev mode' through webpack, it will duplicate that request through all open tabs that you may have open (and are connected to the server). This leads to strange bugs. Use a production start instead ('npm run')
