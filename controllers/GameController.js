var GameController = function() {
	
};

GameController.prototype = {
	'init' : function(io, req, res, mysql_use){
		var gameSocket= io.of('/gameSocket');
		gameSocket.on('connection', function (socket) {
                    		console.log("-> "+_session.user + " s'est connecter à une partie !");
                    		socket.emit('playerConnect',_session.nickname);
                    		socket.on('disconnect',function(){
                    			
                    			socket.disconnect();
                    		});
                	});
		res.render("dashboard/dashboard-game");
	},
};

module.exports = new GameController();