(function(ctx,$M){ // $M = matter.js
	var Map = {
		numberOfPlayer : 4,
		init : function(){
			App.consolLog(' --------------------> Map Loaded !');
			self.startPatern();
		},
		startPatern : function(){
			App.consolLog(' --------------------> 1rst patern !');
			// x, y, w, h, option

			// start patern for 4  player 
			if(this.numberOfPlayer === 4){
			
				App.consolLog(' --------------------> 4 player patern !');
				App.GameEngine.world.add(App.GameEngine.World.engine.world, [
					App.GameEngine.bodies.rectangle(window.innerWidth/4,0, 10,window.innerHeight/2 ,{ isStatic: true, collisionFilter :{group:-1} }),
					App.GameEngine.bodies.rectangle(window.innerWidth/2,window.innerHeight/4 , window.innerWidth/2,10,{ isStatic: true, collisionFilter :{group:-1} }),
					App.GameEngine.bodies.rectangle(window.innerWidth/4,window.innerHeight/2 , 10,window.innerHeight/2 ,{ isStatic: true, collisionFilter :{group:-1} }),
					App.GameEngine.bodies.rectangle(window.innerWidth/4,window.innerHeight/4 , window.innerWidth/2,10,{ isStatic: true, collisionFilter :{group:-1} }),
				]);
			}
			
			// start patern for 3 player 
			if(this.numberOfPlayer === 3){
				App.consolLog(' --------------------> 3 player patern !');
				App.GameEngine.world.add(App.GameEngine.World.engine.world, [
					App.GameEngine.bodies.rectangle(window.innerWidth/4,0, 10,window.innerHeight/2 ,{ isStatic: true , collisionFilter :{group:-1}}),
					App.GameEngine.bodies.rectangle(window.innerWidth/2,window.innerHeight/4 , window.innerWidth/2,10,{ isStatic: true , collisionFilter :{group:-1}}),
					App.GameEngine.bodies.rectangle(window.innerWidth/4,window.innerHeight/4 , window.innerWidth/2,10,{ isStatic: true , collisionFilter :{group:-1}}),
				]);
			}
			// start patern for 2 player 
			if(this.numberOfPlayer === 2){
				App.consolLog(' --------------------> 2 player patern !');
				App.GameEngine.world.add(App.GameEngine.World.engine.world, [
					
					App.GameEngine.bodies.rectangle(window.innerWidth/2,window.innerHeight/4 , window.innerWidth,10,{ isStatic: true, collisionFilter :{group:-1} }),

				]);
			}
			if(this.numberOfPlayer === 0 ||  this.numberOfPlayer === 1){
				App.consolLog(' --------------------> waiting for player ...... !');
			}

		}
	}
	ctx.Map = Map;
	var self = Map;
})(App.GameEngine, Matter);