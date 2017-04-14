/* ******************************
 * [init.js]
 * Back-end init
 *
 * Notes:
 * This initiation file is used to start the server.
 * This way I can keep using babel and stilluse PM2 to restart the server on crashes
 ******************************/
 'use strict';

 /**
 * { Dependencies }
 */

 // Babel
 require('babel-register')({
	presets: [ 'es2015', 'stage-2' ]
 });

 /**
 * { Init }
 */

 // Server
 require('./gameserver.js');