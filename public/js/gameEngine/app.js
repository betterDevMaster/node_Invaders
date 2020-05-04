(function(ctx){
	var App = {
		debug : true,
		// canvas : document.getElementsByTagName("canvas"),
		// context :null,
		init : function(){
			// App.canvas = App.canvas[0];
			// App.canvas.height = window.innerHeight/2;
			// App.canvas.width = window.innerWidth/2;

			// App.context = App.canvas.getContext("2d");

			if(this.debug === true){
				console.log(' :::::::::::::::::: DEBUG MODE ACTIVATE :::::::::::::::::: ');
			}
			this.consolLog(' ---------------->    App Loaded ! ')
			this.GameEngine.init();
		},
		getRandomInt : function(min, max) {
		  min = Math.ceil(min);
		  max = Math.floor(max);
		  return Math.floor(Math.random() * (max - min)) + min;
		},
	
		consolLog : function(msg){
			if(this.debug === true){
				return console.log(msg);
			}	
		},
	}
	ctx.App = App;
})(window);
