class PlayerClass{
	constructor(name,w,h,x,y,color,key_l,key_u,key_r,key_d,key_j){
		var self = this;
		this.name = name;
		this.width = w;
		this.height = h;
		this.x = x;
		this.y = y;
		this.color = color;
		this.readyTojump =true;
		this.keyBoard = {
			'left_key':key_l,
			'up_key':key_u,
			'right_key':key_r,
			'down_key':key_d,
			'jump_key' : key_j,

			'left':false,
			'up':false,
			'right':false,
			'down':false,
			'jump': false,


			keydown : function(evt){
				switch(evt.keyCode){
					case self.keyBoard.left_key:
					self.keyBoard.left = true;
					break;
					case self.keyBoard.up_key:
					self.keyBoard.up = true;
					break;
					case self.keyBoard.right_key:
					self.keyBoard.right = true;
					break;
					case self.keyBoard.down_key:
					self.keyBoard.down = true;
					break;
					case self.keyBoard.jump_key:
					self.keyBoard.jump = true;
					break;
				}
			},
			keyup : function(evt){
				switch(evt.keyCode){
					case self.keyBoard.left_key:
					self.keyBoard.left = false;
					break;
					case self.keyBoard.up_key:
					self.keyBoard.up = false;
					break;
					case self.keyBoard.right_key:
					self.keyBoard.right = false;
					break;
					case self.keyBoard.down_key:
					self.keyBoard.down = false;
					break;
					case self.keyBoard.jump_key:
					self.keyBoard.jump = false;
					break;
				}
			}
		}
		document.addEventListener('keydown',this.keyBoard.keydown, false);
		document.addEventListener('keyup',this.keyBoard.keyup, false);
	}
	drawIt(ctx){
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);

	}
	move(obj, v, j){
		

		if(this.keyBoard.left === true){
			obj.body.positionImpulse.x -=v;

			// socket.emit('move',this);
		}
		if(this.keyBoard.right === true){
			obj.body.positionImpulse.x +=v;
			// socket.emit('move',this);
		}
		if(this.keyBoard.up === true){
			// obj.body.positionImpulse.y -=v;
			// socket.emit('move',this);
		}
		if(this.keyBoard.down === true){
			// obj.body.positionImpulse.y +=v;
			// socket.emit('move',this);
		}
		if(this.keyBoard.jump === true && this.readyTojump === true){
			obj.body.positionImpulse.y -=  j
			this.readyTojump = false;
			window.setTimeout(function(){
				App.GameEngine.Player.player.readyTojump = true;
			},App.GameEngine.config.player.canJump);
		}
	}


}