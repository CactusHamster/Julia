//591, 193, 32 is a cool frame uwu
function prop(oldNum, newmin, newmax, oldmin, oldmax) { var a = ((oldNum - oldmin) / (oldmax - oldmin)) * (newmax - newmin) + newmin; return a;}
let rerendering = true;
let renderFunctionRunning = false;
let morphing = true;
//let imagedataurl;
const canvas = document.getElementsByTagName('canvas')[0]
let w = window.innerWidth
let h = window.innerHeight
let ITERATIONS = 60
let escape_radius = 40
let frame = 0
let speed = 0.2
let frameDelay = 20
let yy = [-1.5, 1.5]
let xx = [-1.5 * (w/h), 1.5 * (w/h)]
canvas.width = w; canvas.height = h
const gpu = new GPU({canvas: canvas});
let julia = gpu.createKernel(function(xx, yy, a, c, iterations, radius) {
	let x = (this.thread.x / this.constants.w) * (xx[1] - xx[0]) + xx[0]
	let y = (this.thread.y / this.constants.h) * (yy[1] - yy[0]) + yy[0]
	var i = 0;
	//let z = [0, 0]
	while (x * x + y * y < radius && i < iterations) {
		let xt = x**2 - y**2 + a;
		y = 2.0 * x * y + c;
		x = xt;
		i = i + 1;
	}
	//i = i - Math.log(Math.log(escape_radius)) / Math.log(2)
	//i = i + 2 - Math.log(Math.log((x**2) + (y**2))) / /*Math.log(2)*/ 0.6931471805599453 // +2 is just for some extra iterations to help it along uwu
	i = i - Math.log(Math.log((x**2) + (y**2))) / Math.log(2)
	if (!(i>=0)) {this.color(0, 0, 0); return 0}
	i = (i / ((iterations + 2) - Math.log(Math.log((this.constants.w**2) + (this.constants.h**2))))) * 255
	//Interpolation: x = (cos(x * Pi + Pi) + 1) / 2; or x = (sin(x * Pi - Pi / 2) + 1) / 2;
	let r=0, g=0, b=0;
	r = Math.sin(i * ((Math.PI*2) / 255) + 2) * 127.5 + 127.5; g = Math.sin(i * ((Math.PI*2) / 255) + 0) * 127.5 + 127.5; b = Math.sin(i * ((Math.PI*2) / 255) + 4) * 127.5 + 127.5
	/*let f = (Math.PI*2 / 255)
	r = Math.sin(i * f + 0.2) * 127.5 + 127.5;
	g = Math.sin(i * f + 0) * 127.5 + 127.5;
	b = Math.sin(i * f + 0.6) * 127.5 + 127.5*/
	
	//let colors = [0, 0, 0, 0, 72, 145, 119, 187, 255, 255, 255, 255, 255, 255, 0, 255, 128, 0, 0, 0, 0]
	this.color(r/255, g/255, b/255)
	//return i
	
	//let colors = [[0, 0, 0], [0, 72, 145], [119, 187, 255], [255, 255, 255], [255, 255, 0], [255, 128, 0], [0, 0, 0]]
}).setOutput([canvas.width, canvas.height])
.setGraphical(true)
.setConstants({h: canvas.height, w: canvas.width})
.setFixIntegerDivisionAccuracy(true).setTactic('precision')


function fastSin (a, range) {
  return Math.abs(((a+1) % (range*4)) - range*2) - range
}

function render () {
	if (renderFunctionRunning) return false;
	renderFunctionRunning = true
	//let a = -0.8 + 0.6 * /*fastSin*/Math.sin(frame / (Math.PI * 20), 1)
	//let c = 0.156 + 0.4 * Math.cos(frame / (Math.PI * 40))
	//let a = prop(Math.cos(frame * 0.1), -1, 1, -Math.PI*0.1, Math.PI*0.1)
	//let c = prop(Math.sin(frame * 0.1), -1, 1, -Math.PI*1, Math.PI*1)
	let a = -0.8 + 0.6 * Math.sin(frame / (Math.PI * 20))
	let c = 0.156 + 0.4 * Math.cos(frame / (Math.PI * 40))
	julia(xx, yy, a, c, ITERATIONS, escape_radius)
	//console.log(imagedataurl)
	renderFunctionRunning = false
	return true;
}

function dltext(filename, text) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}

//function download(filename, url) { var element = document.createElement('a'); element.setAttribute('href', url); element.setAttribute('download', filename); element.style.display = 'none'; document.body.appendChild(element); element.click(); document.body.removeChild(element); }
//canvas.addEventListener('click', function () {if (typeof imagedataurl != 'undefined') download('julia.png', imagedataurl)})
function translate(n=0,a=0){if(0!=n){var t=.1*Math.abs(xx[1]-xx[0]);xx=xx.map(function(a){return a+t*n})}if(0!=a){t=.1*Math.abs(yy[1]-yy[0]);yy=yy.map(function(n){return n+t*a})}render()}
function zoom(x){x/=100;let y=Math.abs(xx[1]-xx[0]),a=Math.abs(yy[1]-yy[0]);yy[0]=yy[0]+a*x,yy[1]=yy[1]-a*x,xx[0]=xx[0]+y*x,xx[1]=xx[1]-y*x,render()}
function sleep(e){return new Promise(n=>{setTimeout(n,e)})}
function rerender () { let ar = render(); if (morphing && ar) frame = frame + speed; sleep(frameDelay).then(() => { if (rerendering) rerender(); }) }
function togglePause () { morphing = !morphing; rerendering = !rerendering; rerender() }
let Ittv; function updateIterate(t=1){if(t<0&&ITERATIONS-t<=1)return;ITERATIONS+=t,clearTimeout(Ittv);let e=document.getElementById("iterationsDisplay");e.innerText=ITERATIONS,e.style.transition="0s",e.style.opacity=1,render(),Ittv=setTimeout(function(){let t=document.getElementById("iterationsDisplay");t.style.transition="2s",t.style.opacity=0},500)}
rerender()
