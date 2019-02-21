const { app, BrowserWindow, globalShortcut  } = require('electron');
const storage = require('electron-json-storage');

app.on('ready', () => {
	let win = new BrowserWindow({
		width: 1000,
		height: 600,
		frame: false,  
		minWidth: 400,
		minHeight: 600,
		backgroundColor: 'rgb( 240, 240, 240)',
		webPreferences: {
			//experimentalFeatures: true
			nodeIntegration: true
		}
	});
	win.loadURL(`file://${__dirname}/view/index.html`);
});