/*******************************
 * [entry.js]
 * The app entry file
 ******************************/
/*eslint-disable */

/**
 * { Dependencies }
 */
	// Styling
	import './style.scss';

	// React
	import React from 'react';
	import ReactDOM from 'react-dom';

	// The app
	import App from './components/root/root';

/**
 * { Init }
 * Initiate the app
 */

// Render the app on screen
ReactDOM.render(<App />, document.getElementById('app'));

