/*******************************
 * [gameclient.js]
 * The core js file.
 ******************************/

/**
* { Dependencies }
*/

	// Vendor functions
		// Socket.IO
		import io from 'socket.io-client';
		const socket = io.connect('http://localhost:3001');

/**
* { App }
*/

const index = (function() {

	/**
	* { init }
	* Init the app
	*/
	const init = function(view) {
		/**
		 * { Listeners }
		 */

			/**
			 * { Socket.IO }
			 */

			// Server-wide
				// Server wide message announcements
				socket.on('announcements', (data) => {
					console.log('Got a server wide announcement:', data.message);

					view.setState({
						announcement : data.message
					});
				});

				// Statistics updates
				socket.on('stats', (data) => {
					console.log('Number of connected clients:', data.numClients);
					console.log('Connected clients:', data.playerList);

					view.setState({
						playerList : data.playerList
					});
				});

			// Individual users
				// Whispers to individual users
				socket.on('whisper', (data) => {
					console.log('Got whisper:', data.message);

					view.setState({
						whisper : data.message
					});
				});

				// Queue updates
				socket.on('queueUpdate', (data) => {
					view.setState({
						id : data.id,
						queuePosition : data.position,
						connected : data.connected,
						playerList : data.playerList
					});
				});
	};

	/**
	* { startGame }
	* Give the call to start the game
	*/
	const startGame = function() {
		console.log('Gameclient is sending a start call!');

		socket.emit('gameStartRequest');
	};

	/**
	* { disconnectUser }
	* Disconnect a user
	*/
	const disconnectUser = function(userToDisconnect) {
		console.log('Gameclient is sending a disconnect call!');

		socket.emit('disconnectRequest', {
			user : userToDisconnect
		});
	};

	return {
		init : init,
		startGame : startGame,
		disconnectUser : disconnectUser,
	};
}());

/**
 * Export
 */
export default index;
