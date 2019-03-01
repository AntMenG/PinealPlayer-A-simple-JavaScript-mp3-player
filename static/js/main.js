const remote = require('electron').remote;
const glob = require('glob');
const storage = require('electron-json-storage');
var fs = require('fs');

//const currentWindow = remote.getCurrentWindow();
//currentWindow.music

const app = remote.app;
var mp3 = glob.sync(app.getPath('music') + '/**/*.mp3');
var m4a = glob.sync(app.getPath('music') + '/**/*.m4a');
m4a.forEach((m4a) => {
	mp3.push(m4a);
});
var store;
/*
mp3.forEach((mp3) => {
	var nname = mp3.replace(' (www.setbeat.com)','');
	fs.rename(mp3, nname, function (err) {
		if (err) throw err;
		console.log('renamed complete');
	  });
	  fs.stat('/tmp/world', function (err, stats) {
		if (err) throw err;
		console.log('stats: ' + JSON.stringify(stats));
	});
});
*/
//storage.remove('music');
storage.get('music', function(error, data) {
	if (error) throw error;
	store = data;
	init();
	initControls();
});