(function(ctx,$M){ // $M = matter.js
	var World = {
		init : function(){
			self.initWorld();
		},
		initWorld : function(){

			this.engine = App.GameEngine.physic.create();
			
			//set physic border to the canvas
		
			App.GameEngine.world.add(this.engine.world, [
				App.GameEngine.bodies.rectangle(App.GameEngine.config.render.border.width, -App.GameEngine.config.render.border.offset, App.GameEngine.config.render.border.width*2,50, { isStatic: true, collisionFilter :{group:-1} }),
				App.GameEngine.bodies.rectangle(App.GameEngine.config.render.border.width, App.GameEngine.config.render.border.height+App.GameEngine.config.render.border.offset, App.GameEngine.config.render.border.width*2, 50, { isStatic: true, collisionFilter :{group:-1} }),
				App.GameEngine.bodies.rectangle(App.GameEngine.config.render.border.width +App.GameEngine.config.render.border.offset, App.GameEngine.config.render.border.height, 50, App.GameEngine.config.render.border.height*2, { isStatic: true, collisionFilter :{group:-1} }),
				App.GameEngine.bodies.rectangle(-App.GameEngine.config.render.border.offset,  App.GameEngine.config.render.border.height, 50,  App.GameEngine.config.render.border.height*2, { isStatic: true, collisionFilter :{group:-1} })
			]);

			// init renderer
			if(App.debug === true){
				this.renderer = App.GameEngine.render.create({
					element : document.body,
					engine : self.engine,
					context : '2d',
					options: {
					        width: App.GameEngine.config.render.size.width,
					        height: App.GameEngine.config.render.size.height,
					        pixelRatio: 1,
					        background: App.GameEngine.config.render.background,
					        wireframeBackground: '#222',
					        hasBounds: false,
					        enabled: false,
					        wireframes: true,
					        showSleeping: false,
					        showDebug: false,
					        showBroadphase: true,
					        showBounds: true ,
					        showVelocity: false,
					        showCollisions: true,
					        showSeparations: false,
					        showAxes: false,
					        showPositions: false,
					        showAngleIndicator: false,
					        showIds: true,
					        showShadows: false,
					        showVertexNumbers: false,
					        showConvexHulls: false,
					        showInternalEdges: false,
					        showMousePosition: false,
					       
					}
				});
			}
			else{
				this.renderer = App.GameEngine.render.create({
					element : document.body,
					engine : self.engine,
					context : '2d',
					options: {
					        width: App.GameEngine.config.render.size.width,
					        height: App.GameEngine.config.render.size.height,
					        pixelRatio: 1,
					        background: App.GameEngine.config.render.background,
					        wireframeBackground: '#222',
					        hasBounds: false,
					        enabled: false,
					        wireframes: false,
					        showSleeping: false,
					        showDebug: false,
					        showBroadphase: false,
					        showBounds: false ,
					        showVelocity: false,
					        showCollisions: false,
					        showSeparations: false,
					        showAxes: false,
					        showPositions: false,
					        showAngleIndicator: false,
					        showIds: false,
					        showShadows: false,
					        showVertexNumbers: false,
					        showConvexHulls: false,
					        showInternalEdges: false,
					        showMousePosition: false,
					       
					}
				});
			}
			//set world property
			this.engine.world.gravity.y = App.GameEngine.config.world.gravity.y;

			// when player is ready we add player to the world
			document.addEventListener('playerLoaded', function(){
				App.consolLog(' --------------------> player Loaded !');
				App.GameEngine.world.add(self.engine.world,[App.GameEngine.Player.player.body])
				App.GameEngine.render.run(self.renderer);
				App.GameEngine.gameReady = true;
				App.consolLog(' ~~~~~~~~~~~~~~~~ OBJECT LOGS ~~~~~~~~~~~~');
				App.consolLog('1: player, 2: engine, 3: map, 4: mob');
				App.consolLog(App.GameEngine.Player);
				App.consolLog(self.engine);
				App.consolLog(App.GameEngine.Map);
				App.consolLog(App.GameEngine.Mob);
				App.consolLog(' ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
				App.consolLog(' ::::::::::::::::::::::Game IS Ready!:::::::::::::::::::::::::::');

			})
			App.consolLog(' ------------------>  Game World Loaded!');	
		},
		gravitySimulator : function(obj, x, y, reverse){
			var reverse = reverse
			if( reverse === false ){
				for (var i =0; i<obj.length; i++){
					obj[i].positionImpulse.y += y;
					obj[i].positionImpulse.x += x;
				}
			}
			else{
				for (var i =0; i<obj.length; i++){
					obj[i].positionImpulse.y -= y;
					obj[i].positionImpulse.x -= x;
				}
			}			
		}
	}
	ctx.World = World;
	var self = World;
})(App.GameEngine, Matter);