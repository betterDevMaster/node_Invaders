(function(ctx,$M){ // $M = matter.js
	var GameEngine = {
		config : App.config,
		game : "",
		gameReady : false,
		physic : $M.Engine,
		render : $M.Render,
		world : $M.World,
		bodies : $M.Bodies,
		init : function(){
			App.consolLog(' ---------------->     GameEngine Loaded !  ')

			

			self.World.init();
			self.Player.init(); // init player
			self.Map.init();
			self.Mob.init();
			this.collider();
			this.update();
		},
		collider: function(){
			$M.Events.on(App.GameEngine.World.engine, "collisionStart", function(evt){
				
				if(evt.pairs[0].bodyA.label ==="bullet"){
					App.GameEngine.world.remove(App.GameEngine.World.engine.world, evt.pairs[0].bodyA)
					
					self.Player.bullet.body = null;
				}
				if(evt.pairs[0].bodyB.label === 'bullet'){

					// App.GameEngine.World.engine.world.bodies.splice(App.GameEngine.World.engine.world.bodies.indexOf(evt.pairs[0].bodyB),1)
					App.GameEngine.world.remove(App.GameEngine.World.engine.world, evt.pairs[0].bodyB)
					self.Player.bullet.body = null;

				}

				if( (evt.pairs[0].bodyA.label ==="type1"  && evt.pairs[0].bodyB.label === self.Player.player.body.label) || (evt.pairs[0].bodyA.label ===self.Player.player.body.label && evt.pairs[0].bodyB.label === "type1") ||(evt.pairs[0].bodyA.label ==="type2"  && evt.pairs[0].bodyB.label === self.Player.player.body.label )||(evt.pairs[0].bodyA.label ===self.Player.player.body.label && evt.pairs[0].bodyB.label === "type2")){
					
					console.log(self.Player.player.body.label +" se fait attaké")	
					
				}
				if( (evt.pairs[0].bodyA.label ==="type1" && evt.pairs[0].bodyB.label === 'bullet')|| (evt.pairs[0].bodyA.label ==="type2" && evt.pairs[0].bodyB.label === 'bullet')) {
					evt.pairs[0].bodyA.life = evt.pairs[0].bodyA.life - evt.pairs[0].bodyB.hit;
					if(evt.pairs[0].bodyA.life <= 0 ){

						App.GameEngine.world.remove(App.GameEngine.World.engine.world, evt.pairs[0].bodyA)
					}

					
					
				}
				if ((evt.pairs[0].bodyA.label ==='bullet' && evt.pairs[0].bodyB.label === "type1" )||(evt.pairs[0].bodyA.label ==="bullet" && evt.pairs[0].bodyB.label === 'type2')){
					evt.pairs[0].bodyB.life = evt.pairs[0].bodyB.life - evt.pairs[0].bodyA.hit;
					if(evt.pairs[0].bodyB.life <= 0 ){
						App.GameEngine.world.remove(App.GameEngine.World.engine.world, evt.pairs[0].bodyB)
					}
					

				}

			})

		},
		update : function(){
			
			window.requestAnimationFrame(self.update);
			self.physic.update(self.World.engine, 1000 / 60);
			if(self.gameReady === true){
				//simulate own gravity cause gravity of matter do a bug with position
				self.World.gravitySimulator([self.Player.player.body], self.config.world.ownGravity.x,  self.config.world.ownGravity.y, false );
				
				self.Player.player.move(self.Player.player, self.Player.speed, self.Player.jump);
				self.Player.player.x = self.Player.player.body.position.x;
				self.Player.player.y = self.Player.player.body.position.y;


				self.Player.choseWeapon(self.Player.weapon);
				if(App.GameEngine.Mob.pool !== null){
					App.GameEngine.Mob.aggro(self.Player.player, self.Mob.pool)
					
				}	
			}
		}

	}
	ctx.GameEngine = GameEngine;
	var self = GameEngine;
})(App, Matter);