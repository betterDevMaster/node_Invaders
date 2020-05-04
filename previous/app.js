
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
var socket = io.connect('http://192.168.0.44:8000');

var id = Math.random().toString(36).substr(2);
var player = new Player(id,50,50,0,0,"#fff",81,90,68,83)//name,width,height,x,y,color,left_key,up_key,right_key,down_key

var not_me;
function animate(){
	requestAnimationFrame(animate);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	player.drawIt();
	player.move();
	if(not_me){
		not_me.drawIt();
		
	}


}
function listenServe(){
	socket.emit('login',player);
	socket.on('loged',function(obj){
		not_me = new Player(obj.name,obj.width,obj.height,obj.x,obj.y,"#bbb");
		socket.on('player_move', function(obj){

			not_me.x = obj.x;
			not_me.y = obj.y;
		
		
		
		})
	});

}
animate();
listenServe();



