/*******************************
 * [config.js]
 * Config index for the game server
 ******************************/


 /**
 * { Dependencies }
 */

import devSettings from './env/dev';
import stagingSettings from './env/staging';
import prodSettings from './env/prod';

/**
 * { Module }
 *
 */

module.exports = function(){
	switch(process.env.NODE_ENV){
		case 'dev':
				return devSettings;

		case 'prod':
				return prodSettings;

		case 'staging':
				return stagingSettings;

		default:
				return prodSettings;
	}
};