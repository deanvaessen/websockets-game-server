/* ******************************
 * [gameserver.js]
 * Back-end server lives here
 *
 * Notes:
 * This provides the master switchboard
 * See apiSupport.js and triggerSupport.js for interaction
 ******************************/
 'use strict';

 /**
 * { Dependencies}
 */
	 /**
	 * { Express }
	 */
	import express from 'express';
	const app = express();
	const PORT = 3001;

		// bodyParser
		import bodyParser from 'body-parser';


	/**
	* { Socket.IO }
	*/
	const http = require('http').Server(app); // eslint-disable-line new-cap
	const io = require('socket.io')(http);

		// API
		import apiSupport from './helpers/core/websockets/apiSupport';

		// Triggers
		import triggerSupport from './helpers/core/websockets/triggerSupport';

	/**
	* { Misc }
	*/
	// log-library
	import logger from './helpers/vendor/loglibrary';

	// Environment specific server/app settings
	import environmentConfiguration from './config/config';

/**
 * { Config}
 */

 	/**
 	* { Node }
 	*/
 	// Log init
	console.log(`Node server started with ENV: ${process.env.NODE_ENV}`);

	// Environment specific settings (looks at ENV and produces a config)
	const appConfiguration = new environmentConfiguration();

	console.log(`appConfiguration of this session: ${JSON.stringify(appConfiguration)}`);

	logger.log({
		messageContent : `Node server started with ENV: ${process.env.NODE_ENV}`,
		messageLevel : 'info', // or 'debug' or 'error'
		messageOutput : 'file', // or 'file' or 'stream'
		messageLocationLookIn : 'projectRoot',
		messageLocationPath : 'backend/logs/node'
	});

	logger.log({
		messageContent : `appConfiguration of this session: ${JSON.stringify(appConfiguration)}`,
		messageLevel : 'info',
		messageOutput : 'file',
		messageLocationLookIn : 'projectRoot',
		messageLocationPath : 'backend/logs/game'
	});

	// Catch crashes so the server doesn't go to [insert curse]
	process.on('uncaughtException', function (err) {
		console.error(err);
		console.log("Node NOT Exiting...");

		logger.log({
			messageContent : `Oops! Node crashed with error: ${err}`,
			messageLevel : 'info',
			messageOutput : 'file',
			messageLocationLookIn : 'projectRoot',
			messageLocationPath : 'backend/logs/node'
		});
	});


	/**
	* {Express }
	*/
	app.use(express.static(__dirname + '/public/'));

	app.listen(PORT, 'localhost', err => {
		if (err) {
			console.log(err);
			return;
		}

		console.log(`Backend is listening at http://localhost:${PORT}`);
	});

	/**
	* { Socket.IO }
	*/
	http.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});

/**
* { Sockets and routes }
*/

	/**
	* { on Socket.IO connection }
	*/

		/**
		 * { Announcement }
		 */
		io.on('connection', (socket) => {
			socket.emit('announcements', { message: 'A new user has joined!' });
		});


		/**
		 * { Application runtime variables }
		 * Set variables that are shared across all connections
		 */

		let runtimeVariables = {
			io : io,
			appConfiguration : appConfiguration,
			numClients : 0,
			connectedClients : []
		}

		/**
		 * { Set up a session }
		 */

		io.on('connection', (socket) => {

			/**
			 * { Registration and processing }
			 * Process the new user
			 */

			let userID = socket.id;
			console.log(`New user ${userID} connected!`);

			triggerSupport.connectedPlayer(runtimeVariables, userID);

			/**
			 * { on Disconnect }
			 * Handle disconnection
			 */

			socket.on('disconnect', (socket) =>  {
				console.log(`${userID} disconnected!`);

				triggerSupport.disconnectedPlayer(runtimeVariables, userID);
			});

			/**
			 * { Requests }
			 */

				/**
				 * { Game start request }
				 * Note that the initiation user is only for registration
				 * We are not trusting the client call to dictate who is at the front of the queue
				 */
				socket.on('gameStartRequest', () => {
					console.log(`Client ${userID} is sending a start game request`);

					apiSupport.startGame(runtimeVariables, userID);
				});

				/**
				 * { Disconnection request }
				 * Handle the request to disconnect a user (kick)
				 */
				socket.on('disconnectRequest', (requestPayload) => {
					console.log(`Client ${userID} is sending a disconnect user request`);

					apiSupport.disconnectUser(runtimeVariables, userID, requestPayload);
				});
		});

	/**
	* Express
	*/

	// Send the app to the client
	app.get('/', function(req, res) {
			res.sendFile('index.html', {root: '/backend/public/'});
	});