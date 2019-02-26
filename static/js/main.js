const remote = require('electron').remote;
const glob = require('glob');
const storage = require('electron-json-storage');

//const currentWindow = remote.getCurrentWindow();
//currentWindow.music

const app = remote.app;
var mp3 = glob.sync(app.getPath('music') + '/*.mp3');
var store;

storage.remove('music');
storage.get('music', function(error, data) {
	if (error) throw error;
	store = data;
	init();
	initControls();
});