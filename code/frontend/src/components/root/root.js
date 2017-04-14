/*******************************
 * [root.js]
 * The root frontend component
 ******************************/

/**
 * { Dependencies }
 */

	// React
	import React from 'react';

	// Styling
	require('./root.scss');

	// Game client
	import gameClient from './../../gameclient';

/**
 * { Component }
 */

class rootComponent extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			id : props.id,
			connected : props.connected,
			announcement : props.announcement,
			whisper : props.whisper,
			queuePosition : props.queuePosition,
			playerList : props.playerList
		};
		this.disconnectUser = this.disconnectUser.bind(this);
		this.startGame = this.startGame.bind(this);
	}

	startGame(){
		gameClient.startGame(this.state.id);
	}

	disconnectUser(userToDisconnect) {
		console.log(`You are asking me to disconnect ${userToDisconnect}`);
		gameClient.disconnectUser(userToDisconnect);
	}

	componentWillMount() {
		/**
		 * { Init }
		 * Initiate the gameClient and pass in a connection to the view
		 */
		gameClient.init(this);
	}

	componentWilllUnmount() {
	}

	componentDidMount() {
	}

	render() {
		return (
		<div id="appContainer">
			<div className={this.state.connected ? 'communicationPanel' : 'communicationPanel hidden'}>
				<h1>Welcome!</h1>
				<br />

					{
						this.state.whisper ?
							<div>
								<p className="fancy">I have a private message for you:</p>
								<p className="data">{this.state.whisper}</p>
							</div>
						:
						<p>No private message currently available</p>
					}

				<br />

				{
					this.state.announcement ?
					<div>
						<p className="fancy">I have a server wide announcement for you:</p>
						<p className="data">{this.state.announcement}</p>
					</div>
					:
					<p>No server wide announcements currently available</p>
				}

			</div>

			<div className={this.state.connected ? 'gamePanel' : 'gamePanel hidden'}>
				{
					this.state.queuePosition == 1 ?
					<div>
						<div className="gamePanel__startButtonContainer">
							<div className="startButtonContainer__startButton">
							<button onClick={this.startGame}><div>Start!</div></button>
							</div>
						</div>
							<p className="fancy">Your turn! Press start!</p>
					</div>
					:
					<p>Waiting for turn...</p>
				}
			</div>

			<div className={this.state.connected ? 'statisticsPanel' : 'statisticsPanel hidden'}>
				<p className="fancy">Your identifier is: <span className="data">{this.state.id}</span></p>
				<p className="fancy">Your position in the queue is: <span className="data">{this.state.queuePosition} / {this.state.playerList.length}</span></p>
				<div className="statisticsPanel__playerList">
					<p className="fancy">Connected players:</p>
					<ul>
						{
							this.state.playerList.map((item) => (
							<li key={item}>
								<span className="data">{item}</span>
								<button onClick={this.disconnectUser.bind(null, item)}>Disconnect</button>
							</li>
							))
						}
					</ul>
				</div>
			</div>

			<div className={this.state.connected ? 'connectionPanel hidden' : 'connectionPanel '}>
				<h1>You are not connected!</h1>
			</div>
		</div>

		);
	}
}

rootComponent.defaultProps = {
	id : null,
	announcement : null,
	whisper : null,
	queuePosition : null,
	playerList : [],
	connected : false
};

rootComponent.propTypes = {
	id : React.PropTypes.string,
	announcement : React.PropTypes.string,
	whisper : React.PropTypes.string,
	queuePosition : React.PropTypes.number,
	playerList : React.PropTypes.array,
	connected : React.PropTypes.bool
};

export default rootComponent;
