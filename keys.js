let keys = {}
let pressedOnce = {}
function zoommm (key, modifier) {
	zoom(modifier); 
	sleep(30).then(() => {
		if (keys[key]) zoommm(key, modifier)
	})
}
function transss (key, m1, m2) {
	translate(m1, m2);
	sleep(1).then(() => {	
		if (keys[key]) transss(key, m1, m2)
	})
}
function frameChangeee (key, speedd) {
	(frame = (frame + speedd)) && render()
	if (keys["Shift"]) return;
	sleep(1).then(() => {	
		if (keys[key]) frameChangeee(key, speedd)
	})
}
document.addEventListener('keydown', function (e) {
	console.info(e.key)
	keys[e.key] = true;
	if (pressedOnce[e.key]) return;
	pressedOnce[e.key] = true;
	switch (e.key) {
	case "=":
		zoommm(e.key, 1.4)
		break;
	case "-":
		zoommm(e.key, -1.4)
		break;
	case "d":
	case "D":
		transss(e.key, 0.1, 0)
		break;
	case "a":
	case "A":
		transss(e.key, -0.1, 0)
		break;
	case "w":
	case "W":
		transss(e.key, 0, 0.1)
		break;
	case "s":
	case "S":
		transss(e.key, 0, -0.1)
		break;	
	case "q":
	case "Q":
		frameChangeee(e.key, -speed)
		break;
	case "e":
	case "E":
		frameChangeee(e.key, speed)
		break;
	}
})
document.addEventListener('keyup', function (e) {delete keys[e.key]; delete pressedOnce[e.key];})

document.addEventListener('keypress', function (e) {
	e.preventDefault()
	switch (e.key) {
	case " ":
		togglePause()
		break;
	case ".":
		updateIterate(1)
		break;
	case ",":
		updateIterate(-1)
		break;
	case ">":
		escape_radius++
		render()
		break;
	case "<":
		escape_radius--
		render()
		break;
	}
})