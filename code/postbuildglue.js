/*******************************
 * [_postbuildglue.js]
 * Some extra glue to give the backend server exactly what it needs to serve
 ******************************/

console.log('postbuildglue.js starting....')

/**
* { Dependencies }
*/

	'use strict';

	const ncp = require('ncp').ncp;
	const fs = require('fs');

/**
* { FileSyncing }
*/

	// Copy required built files to public folder
	ncp.limit = 16;

	ncp('./frontend/build/', './backend/public/', function (err) {
		if (err) {
			return console.error(err);
		}
	});

console.log('postbuildglue.js done!')
