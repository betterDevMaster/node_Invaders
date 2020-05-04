(function(ctx,$M){ // $M = matter.js
	var Mob = {
		pool : [],
		
		init : function(){
			App.consolLog(' --------------------> Mob Loaded !');
			
			this.spawn(['type1', 'type2'], [1,2]);
		},
		initMob : function(type, speed){
			if(type.type === 'type1'){
				type.body = App.GameEngine.bodies.rectangle(App.config.mob.type1.x, App.config.mob.type1.y, App.config.mob.type1.width, App.config.mob.type1.height,{
					render: {
					         fillStyle: App.config.mob.type1.color,
					    },

				
					label :  App.GameEngine.config.mob.type1.name,
					density: App.GameEngine.config.mob.type1.body.density, 
					friction: App.GameEngine.config.mob.type1.body.friction, 
					restitution: App.GameEngine.config.mob.type1.body.restitution,
					mass : App.GameEngine.config.mob.type1.body.mass,
					collisionFilter :{group:-1}

				});
				type.body.life = App.GameEngine.config.mob.type1.life;
				type.speed = speed || 0.5;
			}
			if(type.type === 'type2'){
				type.body = App.GameEngine.bodies.rectangle(App.config.mob.type2.x, App.config.mob.type2.y, App.config.mob.type2.width, App.config.mob.type2.height,{
					render: {
					         fillStyle: App.config.mob.type2.color,
					    },

				
					label :  App.GameEngine.config.mob.type2.name,
					density: App.GameEngine.config.mob.type2.body.density, 
					friction: App.GameEngine.config.mob.type2.body.friction, 
					restitution: App.GameEngine.config.mob.type2.body.restitution,
					mass : App.GameEngine.config.mob.type2.body.mass,
					collisionFilter :{group:-1}

				});
				type.body.life = App.GameEngine.config.mob.type2.life;
				type.speed = speed || 0.5;
			}
			
			return type;
		},
		spawn : function(type, nb){
			var types = type;
			var nb = nb;

			for(var i =0; i<types.length; i++){
				if(types[i] === 'type1'){
					for(var j =0; j<nb[i]; j++){

						var type1 = {type : App.GameEngine.config.mob.type1.name};
						this.initMob(type1, App.GameEngine.config.mob.type1.speed);
						
						var x = App.getRandomInt(0,App.GameEngine.World.renderer.canvas.clientWidth);
						var y = App.getRandomInt(0,App.GameEngine.World.renderer.canvas.clientHeight);
						$M.Body.setPosition(type1.body, {x:x, y:y})
						self.pool.push(type1);
						
					}
				}	
				if(types[i] === 'type2'){
					for(var j =0; j<nb[i]; j++){
						var type2 = {type : App.GameEngine.config.mob.type2.name};
						this.initMob(type2, App.GameEngine.config.mob.type2.speed);
						
						var x = App.getRandomInt(0,App.GameEngine.World.renderer.canvas.clientWidth);
						var y = App.getRandomInt(0,App.GameEngine.World.renderer.canvas.clientHeight);
						$M.Body.setPosition(type2.body, {x:x, y:y})
						self.pool.push(type2);
						/*App.GameEngine.world.add(App.GameEngine.World.engine.world, self.pool.body)*/
					}
				}

			}
			for(var i =0; i<self.pool.length; i++){
				App.GameEngine.world.add(App.GameEngine.World.engine.world, self.pool[i].body);
			}
			
		},
		aggro : function(target, mob){
			for(var i = 0; i< mob.length; i++){


				if(target.body.position.x < mob[i].body.position.x ){
					mob[i].body.positionImpulse.x  -= Math.cos(Math.atan2(target.body.position.x -mob[i].body.position.x,target.body.position.y -mob[i].body.position.y)+ Math.PI/2)*mob[i].speed;
			
				}
				else{
					
					mob[i].body.positionImpulse.x  += Math.cos(Math.atan2(target.body.position.x -mob[i].body.position.x,target.body.position.y -mob[i].body.position.y)- Math.PI/2)*mob[i].speed;
					
				}
				if(target.body.position.y < mob[i].body.position.y){
					mob[i].body.positionImpulse.y  += Math.sin(Math.atan2(target.body.position.x -mob[i].body.position.x,target.body.position.y -mob[i].body.position.y)+ Math.PI/2)*mob[i].speed;
				}
				else{
					mob[i].body.positionImpulse.y  -= Math.sin(Math.atan2(target.body.position.x -mob[i].body.position.x, target.body.position.y -mob[i].body.position.y)- Math.PI/2)*mob[i].speed;

				}
				
			}
		},

	}
	ctx.Mob = Mob;
	var self = Mob;
})(App.GameEngine, Matter);