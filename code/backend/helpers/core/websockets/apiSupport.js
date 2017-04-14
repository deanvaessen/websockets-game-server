/* ******************************
 * [apiSupport.js]
 * This file holds the actions for related to the backend API.
 *
 * Notes:
 * //sparkles
 ******************************/

/**
* { Dependencies}
*/

	// log-library
	import logger from './../../vendor/loglibrary';

	// bluebird promises
	import Promise from 'bluebird';

/**
* { Methods}
*/

let exposed = new class {

	/**
	 * { Game start }
	 */
	startGame(runtimeVariables, userID, requestPayload) {
		console.log('apiSupport.js_startGame - Called.')

		/**
		 * { Variables }
		 */
		let userReachable = true;

		/**
		 * { Logic }
		 */
		// Grab the current player
		const activePlayer = runtimeVariables.connectedClients.slice(0, 1)[0];

		// Log it
		logger.log({
			messageContent : `Game init start requested by ${userID}! Active player is ${activePlayer}`,
			messageLevel : 'info', // or 'debug' or 'error'
			messageOutput : 'file', // or 'file' or 'stream'
			messageLocationLookIn : 'projectRoot',
			messageLocationPath : 'backend/logs/game'
		});

		// Start the game
		runtimeVariables.io.sockets.emit('announcements', { message: 'A game has started!' });

		setTimeout(function(){
			// Log it
			logger.log({
				messageContent : `Game over!`,
				messageLevel : 'info',
				messageOutput : 'file',
				messageLocationLookIn : 'projectRoot',
				messageLocationPath : 'backend/logs/game'
			});

			// Announcement
			runtimeVariables.io.sockets.emit('announcements', { message: 'A game has ended!' });

			// Try catch to fix issue where player starts game, then disconnects and the game and server can't send message to him anymore
			try {
				runtimeVariables.io.sockets.connected[activePlayer].emit('whisper', {
					message: `Game over!`,
				});
			}
			catch(err) {
				// Log it
				logger.log({
					messageContent : `Oops, user ${activePlayer} disconnected before I could tell him his game ended!`,
					messageLevel : 'info',
					messageOutput : 'file',
					messageLocationLookIn : 'projectRoot',
					messageLocationPath : 'backend/logs/game'
				});
				console.log(`Oops, user ${activePlayer} disconnected before I could tell him his game ended!`);

				userReachable = false;
			}

			// Update client list and ordering if the user is still connected
			if (userReachable) {
				runtimeVariables.connectedClients.push(activePlayer)
				runtimeVariables.connectedClients.splice(0, 1);
			}

			// Inform everyone of their new position
			Promise.all(
				runtimeVariables.connectedClients.map((item, index) =>  {

					// Whisper updates to the client
					runtimeVariables.io.sockets.connected[item].emit('whisper', {
						message: `Your position in the queue is now ${index + 1}`,
					});

					runtimeVariables.io.sockets.connected[item].emit('queueUpdate', {
						id: item,
						position: index + 1,
						connected: true,
						playerList: runtimeVariables.connectedClients
					});

					// Log it
					logger.log({
						messageContent : `Queue position updated for user ${item}`,
						messageLevel : 'info',
						messageOutput : 'file',
						messageLocationLookIn : 'projectRoot',
						messageLocationPath : 'backend/logs/game'
					});
				})
			).then(function() {
				// Log it
				logger.log({
					messageContent : `Queues updated`,
					messageLevel : 'info',
					messageOutput : 'file',
					messageLocationLookIn : 'projectRoot',
					messageLocationPath : 'backend/logs/game'
				});

				console.log('Queues updated')
			});
		},  runtimeVariables.appConfiguration.gameplay.gameDuration);
	}

	/**
	 * { Kick user }
	 */
	disconnectUser(runtimeVariables, userID, requestPayload) {

		console.log('apiSupport.js_disconnectUser - Received:')
		console.log(requestPayload);

		/**
		 * { Variables }
		 */
		let userReachable = true;

		/**
		 * { Logic }
		 */
		// Log it
		logger.log({
			messageContent : `User ${requestPayload.user} has been requested to be disconnected by ${userID}!`,
			messageLevel : 'info',
			messageOutput : 'file',
			messageLocationLookIn : 'projectRoot',
			messageLocationPath : 'backend/logs/game'
		});

		// Disconnect the client
		try {
			// Update the disconnected user to show he has been disconnected before I disconnect him
			runtimeVariables.io.sockets.connected[requestPayload.user].emit('queueUpdate', {
				id: requestPayload.user,
				position: 'You have been disconnected by the server',
				connected: false,
				playerList: []
			});

			// Disconnect
			runtimeVariables.io.sockets.connected[requestPayload.user].disconnect();
		}
		catch(err) {

			// Log it
			logger.log({
				messageContent : `Oops, unable to politely ask ${requestPayload.user} to disconnect`,
				messageLevel : 'info',
				messageOutput : 'file',
				messageLocationLookIn : 'projectRoot',
				messageLocationPath : 'backend/logs/game'
			});
			console.log(`Oops, unable to politely ask ${requestPayload.user} to disconnect!`);

			// Register the issue
			userReachable = false;
		}
		finally {
			if (userReachable) {

				// Log it
				logger.log({
					messageContent : `User ${requestPayload.user} has been disconnected!`,
					messageLevel : 'info',
					messageOutput : 'file',
					messageLocationLookIn : 'projectRoot',
					messageLocationPath : 'backend/logs/game'
				});
			}
		}
	}
};

/**
 * Export
 */
module.exports = exposed;
