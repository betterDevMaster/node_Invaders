(function(ctx,$M){ // $M = matter.js
	var Player = {
		life : App.GameEngine.config.player.life,
		ammo : App.GameEngine.config.player.ammo,
		weapon : App.GameEngine.config.player.weapon,
		speed : App.GameEngine.config.player.speed,
		jump : App.GameEngine.config.player.jump,
		player : null,
		fire : false,
		bullet :{
			hit:null,
			body:null,
			speed: App.GameEngine.config.bullet.speed,
			aimDest : {
				x : null,
				y : null,
				left : false,
				up : false,
			},
		},
	
		
		eventMouse : {
			'mousedown':false,
			'mouseup':false,
		},
		playerReady: new Event('playerLoaded'),
		init : function(){
			self.initPlayer();
			self.initWeapon();
		},
		initPlayer : function(){
			socket.on('playerConnect',function(nickname){
				var codeDone = false;
				self.player = new PlayerClass(nickname, App.GameEngine.config.player.size.width,App.GameEngine.config.player.size.height,50,50,'#0fffff',App.GameEngine.config.player.input.left,App.GameEngine.config.player.input.up,App.GameEngine.config.player.input.right,App.GameEngine.config.player.input.down, App.GameEngine.config.player.input.jump);

				self.player.body = App.GameEngine.bodies.rectangle(self.player.x, self.player.y, self.player.width, self.player.height,{
					render: {
					         fillStyle: self.player.color,
					    },

					collisionFilter :{group:-2},
					label : self.player.name,
					density: App.GameEngine.config.player.body.density, 
					friction: App.GameEngine.config.player.body.friction, 
					restitution: App.GameEngine.config.player.body.restitution,
					mass : App.GameEngine.config.player.body.mass,

				})

				codeDone = true;
				if(codeDone == true){
					document.dispatchEvent(self.playerReady);
				}

			});
		},
		initWeapon : function(){
			App.GameEngine.World.renderer.canvas.addEventListener('mousedown', self.mousedown)
			App.GameEngine.World.renderer.canvas.addEventListener('mouseup',self.mouseup)
			
		},
		getMousePos : function(canvas, evt) { // helper function to get mouse pos on canvas
			var rect = canvas.getBoundingClientRect();
			return {
				x: evt.clientX - rect.left,
				y: evt.clientY - rect.top
			}
		},

		mousedown : function(evt){
			self.eventMouse.mousedown = true;
			self.fire = true;
			self.eventMouse.mouseup = false;
			self.bullet.aimDest = self.getMousePos(this, evt);
			if(self.bullet.aimDest.x < self.player.body.position.x ){
				self.bullet.aimDest.left = true;
			}
			else{
				self.bullet.aimDest.left = false;
			}
			if(self.bullet.aimDest.y < self.player.body.position.y){
				self.bullet.aimDest.up = true;

			}
			else{
				self.bullet.aimDest.up = false;	
			}

			
		},
		mouseup : function(){
			self.eventMouse.mouseup = true;
			self.eventMouse.mousedown = false;
		},
		choseWeapon : function(weapon){
			var weapon = weapon || 'gun';
			var gunMode = false;
			if(weapon === 'gun'){
				self.bullet.hit = App.GameEngine.config.player.hit.gun;
				 gunMode = true;
				if(self.eventMouse.mousedown === true && self.fire === true && self.eventMouse.mouseup === false){
					self.fire = true;


				}
			}
			if(weapon === 'smg'){
				self.bullet.hit = App.GameEngine.config.player.hit.smg;
				if(self.eventMouse.mousedown === true && self.fire === true){
					self.fire = true;
					
				}
				if(self.eventMouse.mouseup === true && self.fire === true){
					
					self.fire = false;
					
				}

			}
			if(self.fire === true){
				if(gunMode === true){
					self.fire = false;
				}
				

				App.GameEngine.world.add(App.GameEngine.World.engine.world, [
					App.GameEngine.bodies.circle(self.player.x,self.player.y, 10 ,{mass:0.1,
						density :0.1,
						friction : 0,
						frictionAir : 0,
						frictionStatic : 0,
						speed:0,
						slop:0,
						sleepThreshold : 0,
						label : 'bullet',
						timeScale: 0,
						collisionFilter :{group:-2}
					}),
				]);
				for(var i =0; i<App.GameEngine.World.engine.world.bodies.length; i++){
					if(App.GameEngine.World.engine.world.bodies[i].label === "bullet"){
						self.bullet.body = App.GameEngine.World.engine.world.bodies[i];
						self.bullet.body.hit = self.bullet.hit;
						
						
						
					}
				}
				if(self.bullet.aimDest.left === true ){
				
					self.bullet.body.position.x  -= Math.cos(Math.atan2(self.bullet.aimDest.x - self.bullet.body.position.x, self.bullet.aimDest.y - self.bullet.body.position.y)+ Math.PI/2)*self.bullet.speed;
					
					
				}
				else{
					self.bullet.body.position.x  += Math.cos(Math.atan2(self.bullet.aimDest.x - self.bullet.body.position.x, self.bullet.aimDest.y - self.bullet.body.position.y)- Math.PI/2)*self.bullet.speed;
					
				}
				if( self.bullet.aimDest.up === true ){
					self.bullet.body.position.y  -= Math.sin(Math.atan2(self.bullet.aimDest.x - self.bullet.body.position.x, self.bullet.aimDest.y - self.bullet.body.position.y)- Math.PI/2)*self.bullet.speed;
					
				}
				else{
					self.bullet.body.position.y  += Math.sin(Math.atan2(self.bullet.aimDest.x - self.bullet.body.position.x, self.bullet.aimDest.y - self.bullet.body.position.y)+Math.PI/2)*self.bullet.speed;

				}	

				
			}	
		},
		
	}
	ctx.Player = Player;
	var self = Player;
})(App.GameEngine, Matter);