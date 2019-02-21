const pbar = document.getElementById("pbar");
var audio = document.getElementById("audio");
var progressFlag = true, playFlag = false;


window.addEventListener('load', () => {
	var win = remote.BrowserWindow.getFocusedWindow();
	document.getElementById('minimize').addEventListener('click', () => {
		win.minimize();
	});
	document.getElementById('maximize').addEventListener('click', () => {
		if (win.isMaximized()) {
			win.restore();
		} else {
			win.maximize();
		}
	});
	document.getElementById('close').addEventListener('click', () => {
		win.close();
	});

	var output = Object.keys(music)[0];
	setAudio(music[output], 1);

	document.getElementById("before")
	.addEventListener('click', () => {
		last_next(
			Number(audio.getAttribute('data-index')) - 1
		);
	});

	document.getElementById("after")
	.addEventListener('click', () => {
		last_next(
			Number(audio.getAttribute('data-index')) + 1
		);
	});

	function last_next (index) {
		var output = Object.keys(music)[index];
		if (output) {
			setAudio(music[output]);
		} else {
			if (index < 0) {
				console.log('Inicio de canciones');
			} else if (index == sounds) {
				console.log('Fin de Canciones');
			}
		}
	}

	// Progress Control
	pbar.addEventListener('mouseover', (e) => {
		progressFlag = false;
	});

	pbar.addEventListener('click', (e) => {
		audio.currentTime = pbar.value;
	});

	pbar.addEventListener('mouseout', (e) => {
		progressFlag = true;
	});

	// Play control 
	var play = document.getElementById('play');
	play.addEventListener('click', (e) => {
		if (playFlag) {
			audio.pause();
		} else {
			if ( audio.getAttribute('src') == "" ) {
				console.log("Sin Música");
			} else {
				audio.play();
			}
		}
	});

	audio.onplaying = () => {
		var totalTime = document.getElementById('totalTime');
		playFlag = true;
		play.classList = 'stop color';
		totalTime.innerText = display(audio.duration);
	}
	
	audio.ontimeupdate = () => {
		var currentTime = document.getElementById('currentTime');
		pbar.setAttribute('max',audio.duration);
		if (progressFlag) {
			pbar.value = audio.currentTime;
		}
		currentTime.innerText = `${display(audio.currentTime)}`;
		if (audio.duration == audio.currentTime) {
			last_next(
				Number(audio.getAttribute('data-index')) + 1
			);
		}
	}

	audio.onpause = () => {
		playFlag = false;
		play.classList = 'play color';
	}
	
});

function display (seconds) {
  const hours = seconds / 3600
  const minutes = (seconds % 3600) / 60
  seconds %= 60
  if (hours >= 1) {
    return [hours, minutes, seconds].map(format).join(':')
  } else {
    return [minutes, seconds].map(format).join(':')
  }
}

function format (val) {
  return ('0' + Math.floor(val)).slice(-2)
}