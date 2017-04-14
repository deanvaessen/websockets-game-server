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

/**
* { Methods}
*/

let exposed = new class {

	/**
	 * { Register player on new connection }
	 */
	connectedPlayer(runtimeVariables, userID) {

		console.log('triggerSupport.js_connectedPlayer - Received this new user:')
		console.log(userID)

		/**
		 * { Logic }
		 */
		// Count and register user
		runtimeVariables.numClients++;
		runtimeVariables.connectedClients.push(userID);
		console.log('Number of connected clients:', runtimeVariables.numClients);

		// Log it
		logger.log({
			messageContent : `User ${userID} connected!`,
			messageLevel : 'info',
			messageOutput : 'file',
			messageLocationLookIn : 'projectRoot',
			messageLocationPath : 'backend/logs/game'
		});

		// Let the other clients know
		runtimeVariables.io.emit('stats', {
			numClients: runtimeVariables.numClients,
			playerList : runtimeVariables.connectedClients
		 });

		// Check position and inform client
		const  queuePosition = runtimeVariables.connectedClients.indexOf(userID);

		runtimeVariables.io.sockets.connected[runtimeVariables.connectedClients[queuePosition]].emit('whisper', {
			message: `Hi, your position in the queue is ${queuePosition + 1}`
		});

		runtimeVariables.io.sockets.connected[runtimeVariables.connectedClients[queuePosition]].emit('queueUpdate', {
			id: userID,
			position: queuePosition + 1,
			connected: true,
			playerList: runtimeVariables.connectedClients
		});

	}

	/**
	 * { Player disconnection }
	 */
	disconnectedPlayer(runtimeVariables, userID) {

		console.log('triggerSupport.js_disconnectedPlayer - Received this user:')
		console.log(userID)

		/**
		 * { Variables }
		 */
		// Find out who it was
		const disconnectClientPosition = runtimeVariables.connectedClients.indexOf(userID);


		/**
		 * { Logic }
		 */
		logger.log({
			messageContent : `User ${userID} disconnected!`,
			messageLevel : 'info',
			messageOutput : 'file',
			messageLocationLookIn : 'projectRoot',
			messageLocationPath : 'backend/logs/game'
		});


		// Update client list
		runtimeVariables.connectedClients.splice(disconnectClientPosition, 1);

		// Update count and let the other clients know
		runtimeVariables.numClients--;
		runtimeVariables.io.emit('stats', {
			numClients: runtimeVariables.numClients,
			playerList : runtimeVariables.connectedClients
		 });

		// Tell each client behind the disconnected user about their new position
		runtimeVariables.connectedClients.forEach((item, index) =>  {
			if (index >= disconnectClientPosition ) {
				runtimeVariables.io.sockets.connected[item].emit('whisper', {
					message: `Your position in the queue is now ${index + 1}`,
				});

				runtimeVariables.io.sockets.connected[item].emit('queueUpdate', {
					id: userID,
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
			} else {
				console.log('I am not triggering a view update after this disconnect for:');
				console.log(item, index)
			}
		})

		console.log('Connected clients:', runtimeVariables.numClients);
		console.log(runtimeVariables.connectedClients);
	}
};

/**
 * Export
 */
module.exports = exposed;