// board

let board;
let boardwidth= 360;
let boardheight= 576;
// let boardwidth= 640;
// let boardheight= 1024;
let context;


//doodler
let doodlerwidth =46;
let doodlerheight =46;
let doodlerx = boardwidth/2 - doodlerwidth;
let doodlery = boardheight*7/8 - doodlerheight;
let doodlerrightimg;
let doodlerleftimg;

//physics
let velocityx=0;
let velocityy=0;
let initialvelocityy=-8;
let gravity = 0.4;

//platform
let platformarray =[];
let platformwidth = 60;
let platformheight = 18;
let platformimg;

//score
let score =0;
let maxscore=0;
let gameover= false;


let doodler = {
	img: null,
	x: doodlerx,
	y: doodlery,
	width: doodlerwidth,
	height: doodlerheight
}


window.onload = function(){
	board = document.getElementById("board");
	board.height = boardheight;
	board.width = boardwidth;
	context = board.getContext("2d");

	//draw doodler
	doodlerrightimg = new Image();
	doodlerrightimg.src="./doodler-right.png";
	doodler.img= doodlerrightimg;
	doodlerrightimg.onload = function(){
		context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);

	}

	doodlerleftimg =new Image();
	doodlerleftimg.src ="./doodler-left.png"


	platformimg = new Image();
	platformimg.src ="./platform.png"

	velocityy= initialvelocityy;
	placeplatform();
	requestAnimationFrame(update);
	document.addEventListener("keydown", movedoodler)

}


function update(){
	requestAnimationFrame(update);
	if (gameover){
		return;
	}
	context.clearRect(0,0, board.width, board.height);

	//doodler
	doodler.x += velocityx;
	if (doodler.x > boardwidth){
		doodler.x =0;
	}else if (doodler.x+ doodler.width<0){
		doodler.x =boardwidth;
	}

	velocityy += gravity;
	doodler.y += velocityy;
	if(doodler.y > board.height){
		gameover=true;
	}
	context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);

	//platforms
	for(let i=0; i< platformarray.length;i++){
		let platform = platformarray[i];
		if (velocityy< 0 && doodler.y < boardheight*3/4){
			platform.y -= initialvelocityy;
		}
		if(detectcollution(doodler,platform) && velocityy >= 0){
			velocityy= initialvelocityy; //jump
		}
		context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
	}

	//clear and add new platform
	while(platformarray.length>0 && platformarray[0].y >boardheight){
		platformarray.shift(); //remove first elemnt fromarray
		newplatform();
	}

	//score
	updatescore();
	context.fillStyle = "black";
	context.font ="16px sans-serif";
	context.fillText(score, 5, 20);

	if (gameover){
		context.fillText("Gameover Press 'Space' to Restart",boardwidth/7, boardheight*7/8)
	}
}


function movedoodler(e) {
	if (e.code == "ArrowRight"|| e.code == "KeyD") {
		velocityx =4;
		doodler.img = doodlerrightimg;
	}
	else if (e.code == "ArrowLeft"|| e.code == "KeyA") {
		velocityx =-4;
		doodler.img = doodlerleftimg;
	}

	else if(e.code =="Space" && gameover){
		//reset

		velocityy =initialvelocityy;
		velocityx = 0;
		score= 0;
		maxscore=0;
		gameover=false;
		placeplatform();
		doodler = {
			img: doodlerrightimg,
			x: doodlerx,
			y: doodlery,
			width: doodlerwidth,
			height: doodlerheight
		}
	}

}

function placeplatform() {
	platformarray=[];

	//starting platforms
	let platform = {
		img: platformimg,
		x: boardwidth/3,
		y: boardheight - 50,
		width : platformwidth,
		height: platformheight
	}

	platformarray.push(platform);


	for(let i=0; i<6; i++){
		let randomx =Math.floor(Math.random() * boardwidth* 3/4);
		let platform = {
			img: platformimg,
			x: randomx,
			y: boardheight - 75*i -150,
			width : platformwidth,
			height: platformheight
		}

	platformarray.push(platform);

	}


}

function detectcollution(a,b){
	return a.x<b.x +b.width && a.x + a.width > b.x &&
			a.y < b.y+ b.height && a.y + a.height > b.y;
}

function newplatform() {
	let randomx =Math.floor(Math.random() * boardwidth* 3/4);
	let platform = {
		img: platformimg,
		x: randomx,
		y: -platformheight,
		width : platformwidth,
		height: platformheight
	}

	platformarray.push(platform);
	
}

function updatescore(){
	let points = Math.floor(50*Math.random());
	if(velocityy<0){
		maxscore += points;
		if(score < maxscore){
			score= maxscore;
		}
	}else if(velocityy >=0){
		maxscore -= points;
	}

}