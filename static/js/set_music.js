const coverArt = require('cover-art');
const jsmediatags = require("jsmediatags");
const cont = document.getElementById("cont");
var audio = document.getElementById("audio");

var music = {};
var sounds = 0;

//Create list
function init () {
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
}

function findPic (mp3, artist, title, img) {
	coverArt(artist, title, function (err, url) {		
		console.log(artist);
		if (!err) {
			img.setAttribute('data-error', '0');
			if (url) {
				img.setAttribute('src', url);
				music[mp3.id].pic = url;
				createPath(mp3.id, url);
			} else {
				coverArt(artist, null, function (err, url) {
					if (url) {
						img.setAttribute('src', url);
						music[mp3.id].pic = url;
						createPath(mp3.id, url);
					} else {
						img.setAttribute('src', '../static/img/img.png');
						music[mp3.id].pic = '../static/img/img.png';
						createPath(mp3.id, '../static/img/img.png');
					}
				});
			}
		} else {
			img.setAttribute('data-error', '1');
			img.setAttribute('src', '../static/img/img.png');
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
	canNove (mp3);
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

function canNove (mp3) {
	let after = document.getElementById('after'),
		before = document.getElementById('before');
	if (mp3.index == 0) {
		before
		.setAttribute('data-disable','1');
		after
		.setAttribute('data-disable','0');
	} else if (mp3.index + 1 == sounds) {
		before
		.setAttribute('data-disable','0');
		after
		.setAttribute('data-disable','1');
	} else {
		before
		.setAttribute('data-disable','0');
		after
		.setAttribute('data-disable','0');
	}
}