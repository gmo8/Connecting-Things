var face = [];
var position = {x:0, y:0};
var scale = 0;
var orientation = {x:0, y:0, z:0};
var mouthWidth = 0;
var mouthHeight = 0;
var eyebrowLeft = 0;
var eyebrowRight = 0;
var eyeLeft = 0;
var eyeRight = 0;
var jaw = 0;
var nostrils = 0;



function preload(){
	bat = loadImage("pics/bat.png");
	dog = loadImage("pics/dog.png");
	hill = loadImage("pics/hill.png");
	mouse = loadImage("pics/mouse.png");
	owl = loadImage("pics/owl.png");
	trump = loadImage("pics/trump.png");
	wolf = loadImage("pics/wolf.png");

}

function setup() {
  	createCanvas(700, 700);
	setupOsc(8338, 3334);

}

function draw() {
	  background(66, 244, 161);
	  
	  image(bat, 5, 230, 170, 170);
	  image(dog, 50, 400, 170, 170);
	  image(trump, 200, 500, 170, 170);
	  image(mouse, 400, 460, 170, 170);
	  image(owl, 470, 300, 170, 170);
	  image(hill, 370, 120, 170, 170);
	  image(wolf, 172, 90, 170, 170);

	  text('What is consciousness?', 200, 350, 400, 600);
	  textSize(20)
	  textStyle(ITALIC);
	  

	// FACE_OUTLINE : 0 - 16
	// LEFT_EYEBROW : 17 - 21
	// RIGHT_EYEBROW : 22 - 26
	// NOSE_BRIDGE : 27 - 30
	// NOSE_BOTTOM : 31 - 35
	// LEFT_EYE : 36 - 41
	// RIGHT_EYE : 42 - 47
	// INNER_MOUTH : 48 - 59
	// OUTER_MOUTH : 60 - 65
	//rectMode(CENTER);
	//var mouth = map(mouthHeight, 1, 3, 0, 255);
	//fill(mouth-120, mouth+120, 0);
	//ellipse(position.x, position.y, 100, 100);

	var wink = map(eyeLeft, 1, 3, 100, 300);
	fill(wink-120, wink+120, 250);
	ellipse(position.x, position.y, 15, 15);

	var wink2 = map(eyeRight, 1, 3, 100, 300);
	fill(wink2-120, wink2+120, 250);
	ellipse(position.x+35, position.y, 15, 15);

	


}

function receiveOsc(address, value) {
	if (address == '/raw') {
		face = [];
		for (var i=0; i<value.length; i+=2) {
			face.push({x:value[i], y:value[i+1]});
		}
	}
	else if (address == '/pose/position') {
		position = {x:value[0], y:value[1]};
	}
	else if (address == '/pose/scale') {
		scale = value[0];
	}
	else if (address == '/pose/orientation') {
		orientation = {x:value[0], y:value[1], z:value[2]};
	}
	else if (address == '/gesture/mouth/width') {
		mouthWidth = value[0];
	}
	else if (address == '/gesture/mouth/height') {
		mouthHeight = value[0];
		//print(mouthHeight);
	}
	else if (address == '/gesture/eyebrow/left') {
		eyebrowLeft = value[0];
	}
	else if (address == '/gesture/eyebrow/right') {
		eyebrowRight = value[0];
	}
	else if (address == '/gesture/eye/left') {
		eyeLeft = value[0];
		//print(eyeLeft);
	}
	else if (address == '/gesture/eye/right') {
		eyeRight = value[0];
		//print(eyeRight);
	}
	else if (address == '/gesture/jaw') {
		jaw = value[0];
	}
	else if (address == '/gesture/nostrils') {
		nostrils = value[0];
	}
}

function setupOsc(oscPortIn, oscPortOut) {
	var socket = io.connect('http://127.0.0.1:8081', { port: 8081, rememberTransport: false });
	socket.on('connect', function() {
		socket.emit('config', {	
			server: { port: oscPortIn,  host: '127.0.0.1'},
			client: { port: oscPortOut, host: '127.0.0.1'}
		});
	});
	socket.on('message', function(msg) {
		if (msg[0] == '#bundle') {
			for (var i=2; i<msg.length; i++) {
				receiveOsc(msg[i][0], msg[i].splice(1));
			}
		} else {
			receiveOsc(msg[0], msg.splice(1));
		}
	});
}