class Player{
	constructor(name,w,h,x,y,color,key_l,key_u,key_r,key_d){
		var self = this;
		this.name = name;
		this.width = w;
		this.height = h;
		this.x = x;
		this.y = y;
		this.color = color;
		this.keyBoard = {
			'left_key':key_l,
			'up_key':key_u,
			'right_key':key_r,
			'down_key':key_d,

			'left':false,
			'up':false,
			'right':false,
			'down':false,

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
				}
			}
		}
		document.addEventListener('keydown',this.keyBoard.keydown, false);
		document.addEventListener('keyup',this.keyBoard.keyup, false);
	}

	drawIt(){
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);

	}
	move(){
		if(this.keyBoard.left === true){
			this.x -=3;
			socket.emit('move',this);
		}
		if(this.keyBoard.right === true){
			this.x +=3;
			socket.emit('move',this);
		}
		if(this.keyBoard.up === true){
			this.y -=3;
			socket.emit('move',this);
		}
		if(this.keyBoard.down === true){
			this.y +=3;
			socket.emit('move',this);
		}
	}


}