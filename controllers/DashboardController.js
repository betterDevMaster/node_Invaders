/*need modules : 
 - http
 - fs
 - path
 - express
 - mysql
 - bodyParser
 - session
 

 this modules are load in server.js

-chat
*/



var ChatController = require('./ChatController.js');
var ProfileController = require('./ProfileController.js');
var FriendController = require('./FriendController.js');
var GameController  = require('./GameController.js');

var DashboardController = function() {
	
};

DashboardController.prototype = {
	'initSocket' : function( io, fs){
		var chatSocket= io.of('/chatSocket');
		chatSocket.on('connection', function (socket) {
                    		console.log("-> "+_session.user + " s'est connecter à la tavern !");
                    		ChatController.initChat(chatSocket,socket, fs);
                    		socket.on('disconnect',function(){
                    			ChatController.disconnect(chatSocket,socket, fs);
                    			socket.disconnect();

                    		});
                	});
		
	},
	'showProfile' : function(req, res, mysql){
		ProfileController.init(req, res, mysql);
	},
	'postStatus' : function(req, res, mysql){
		ProfileController.postStatus(req, res, mysql);
	},
	'commentStatus' : function(req, res, mysql){
		ProfileController.commentStatus(req, res, mysql);
	},
	'updateProfile' : function(fs, req, res, mysql){
		ProfileController.updateProfile(fs,req, res, mysql);
	},
	'removePost' : function(req, res, mysql){
		ProfileController.removePost(req, res, mysql);
	},
	'initFriend' : function(req, res, mysql){
		FriendController.init(req, res, mysql);
	},
	'showFriendProfile' : function(req, res, mysql){
		FriendController.showFriendProfile(req, res, mysql);
	},
	'postFriendStatus' : function(req, res, mysql){
		FriendController.postFriendStatus(req, res, mysql);
	},
	'searchFriend' : function(req, res, mysql){
		FriendController.searchFriend(req, res, mysql);
	},
	'addFriendRequest' : function(req, res, mysql){
		FriendController.addFriendRequest(req, res, mysql);
	},
	'addFriend' : function(req, res, mysql){
		FriendController.addFriend(req, res, mysql);
	},
	'launchGame' : function(io, req, res, mysql){
		GameController.init(io, req, res, mysql);
	}
};
/*----------------------helper function-------------------*/

module.exports = new DashboardController();