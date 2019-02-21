const remote = require('electron').remote;
const glob = require('glob');
const coverArt = require('cover-art');
const jsmediatags = require("jsmediatags");
const cont = document.getElementById("cont");
var audio = document.getElementById("audio");
 
const currentWindow = remote.getCurrentWindow();

const app = remote.app;

var mp3 = glob.sync(app.getPath('music') + '/*.mp3');

var music = {}, store = currentWindow.music;
var sounds = 0;

const storage = require('electron-json-storage');

//Create list
mp3.forEach((mp3) => {
	if (store[mp3]) {
		music[mp3] = store[mp3];
		music[mp3].index = sounds
	} else {
		console.log('nuevo');
		var name = mp3.split("/");
		music[mp3] = { 
			id: mp3,
			index: sounds,
			name: name[name.length - 1].split('.mp3')[0],
			path: mp3
		};
	}
	var button = document.createElement('button');
	button.setAttribute('id', music[mp3].id);
	button.setAttribute('value', music[mp3].id);
	button.classList = 'list';
	button.addEventListener('click', (e) => {
		var more = e.target.id[0] + e.target.id[1] + e.target.id[2]
		if(
			!e.target.getAttribute('data-function')
		) {
			setAudio(music[mp3])
		}
	});
	// Número
	var span = document.createElement('span');
	span.appendChild(document.createTextNode(music[mp3].index + 1));
	span.setAttribute('data-attr','number');
	span.classList = 'background';
	button.appendChild(span);
	// Nombre
	span = document.createElement('span');
	span.appendChild(document.createTextNode(music[mp3].name));
	span.setAttribute('data-attr','nombre');
	span.classList = 'color';
	button.appendChild(span);
	var moreButton = document.createElement('button');
	// Options button
	moreButton.setAttribute('id','more' + music[mp3].id);
	moreButton.setAttribute('data-function','more');
	moreButton.style = 'width: 30px; height: 30px;';
	moreButton.classList = 'color';
	button.appendChild(moreButton);
	cont.appendChild(button);
	sounds++;
});

storage.set('music', music, function(error) {
	if (error) throw error;
});

function findPic (mp3, artist, title, img) {
	coverArt(artist, title, function (err, url) {		
		if (err) console.log ;
		if (url) {
			img.setAttribute('src', url);
			music[mp3.id].pic = url;
		} else {
			coverArt(artist, null, function (err, url) {
				if (url) {
					img.setAttribute('src', url);
					music[mp3.id].pic = url;
				} else {
					img.setAttribute('src', '../static/img/img.png');
					music[mp3.id].pic = '../static/img/img.png';
				}
			});
		}
	});
}

function findTags (mp3, img) {
	jsmediatags.read(mp3.path, {
		onSuccess: function(tag) {
			if (tag.tags.artist) {
				var ft = tag.tags.artist.split(' Ft. ');
				var titleFt = tag.tags.title.split(' (feat');
				findPic(mp3, ft[0].split(',')[0], titleFt[0].split(' - ')[0], img);
			} else {
				var ft = mp3.name.split(' - ');
				findPic(mp3, ft[0], null, img);
			}
		},
		onError: function(error) {
			console.log(':(', error.type, error.info);
			img.setAttribute('src', '../static/img/img.png');
			music[mp3.id].pic = '../static/img/img.png';
		}
	});
}

var lastPick;

// start play
function setAudio (mp3, start) {
	if (mp3.index == 0) {
		document.getElementById('before')
		.setAttribute('data-disable','1');
	} else if (mp3.index + 1 == sounds) {
		document.getElementById('after')
		.setAttribute('data-disable','1');
	} else {
		document.getElementById('before')
		.setAttribute('data-disable','0');
		document.getElementById('after')
		.setAttribute('data-disable','0');
	}
	var pic = document.getElementById('pic'),
			img = pic.getElementsByTagName('img')[0];
			img.setAttribute('data-id',mp3.id);
	if (!mp3.pic) {
		findTags(mp3, img);
	} else {
		img.setAttribute('src', mp3.pic);
	}
	if (lastPick) {
		lastPick.setAttribute('class','list')
		lastPick.style = ''; 
	}
	lastPick = document.getElementById(mp3.path);
	lastPick.setAttribute('class','list background active'); 

	audio.setAttribute('src', mp3.path);
	audio.setAttribute('data-index', mp3.index);
	var name = document.getElementById('name');
	name.innerText = mp3.name;
	if (!start) {
		audio.play();
	}
}


var picCont = document.getElementById('pic'),
		image = picCont.getElementsByTagName('img')[0];

image.addEventListener('load', function() {
	var vibrantHex;
	var musicId = image.getAttribute('data-id');
	if(music[musicId].color) {
		vibrantHex = music[musicId].color
	} else {
		var vibrant = new Vibrant(image);
		var swatches = vibrant.swatches();
		if (swatches.hasOwnProperty('Vibrant') && swatches['Vibrant']) {
			vibrantHex = swatches['Vibrant'].getHex();
		} else {
			vibrantHex = '#777777'
		}
		console.log(`color: ${vibrantHex};`);
		music[musicId].color = vibrantHex;
		storage.set('music', music, function(error) {
			if (error) throw error;
			console.log("saved");
		});
	}
	document.getElementById('player').style = `background: ${vibrantHex};`;
	var color = document.getElementsByClassName('color');
	var background = document.getElementsByClassName('background');
	for (var i = 0; i < color.length; i++) {
		color[i].style = `color: ${vibrantHex};`;
	}
	for (var i = 0; i < background.length; i++) {
		background[i].style = `
			background: ${vibrantHex}; 
			box-shadow: 0px 0px 45px ${vibrantHex};
		`;
	}
	document.getElementById('style').innerHTML = `
		::-webkit-scrollbar {
			width: 8px;
			background: rgb( 220, 220, 220);
		}
		::-webkit-scrollbar-thumb {
			background: ${vibrantHex};
			width: 2px !important;
		}
		#app #player #pic,
		#app #player #bar #progress #pbar,
		#app #player #bar #currentTime,
		#app #player #bar #totalTime,
		#app #player #controls button {
			box-shadow: 4px 4px 16px ${vibrantHex};
		}
		#app #player #controls #after {
			box-shadow: -4px -4px 16px ${vibrantHex};
		}
		#app #player #name {
			text-shadow: 1px 1px 4px ${vibrantHex};
		}
		#app #container #space #cont button.list:hover {
			background: ${vibrantHex};
		}
		#app #container #stitle {
			box-shadow: 0px 0px 80px ${vibrantHex};
		}
		#app #container #space #cont button.list.active span,
		#app #container #space #cont button.list.active:hover span {
			text-shadow: 0px 0px 2px ${vibrantHex} !important;
		}
	`;
	// Results into: Vibrant Muted DarkVibrant DarkMuted LightVibrant
});