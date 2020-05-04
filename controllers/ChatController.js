/*need modules : 
 - http
 - fs
 - path
 - express
 - mysql
 - bodyParser
 - session
 

 this modules are load in server.js

*/



// socket ..
var userConnected = []; // list of current connected users to chat
var history  = []; // history of chat message save in one instance

var ChatController = function() {
	
};

ChatController.prototype = {
	'initChat' : function(chatSocket, socket, fs){

		if(_session.user){
			// put nickname in sockent connection for disconnet good user
			socket.client.conn.nickname = _session.nickname;
			
			userConnected.push(_session.nickname);
			
			userConnected = userConnected.unique();
			chatSocket.emit('users_chat_list', userConnected);
			socket.on('first_load', function(){

				socket.emit('msg_receiver', history);
			});
			socket.on('msg_sended',function(msg){
				history.push(msg);
				fs.writeFile('./controllers/chatHistory/historyChat.json', JSON.stringify(history, null, 4) ); 
				chatSocket.emit('msg_receiver', history);
			});
			return;

		}	
	},
	'disconnect' : function(chatSocket, socket, fs){
		var index = userConnected.indexOf(socket.client.conn.nickname);
		if (index > -1) {
			userConnected.splice(index, 1);
		}
		chatSocket.emit('users_chat_list', userConnected);
	}
};
/*----------------------helper function-------------------*/
Array.prototype.unique=[].unique||function(){var o={},i,l=this.length,r=[];for(i=0;i<l;i++)o[this[i]]=this[i];for(i in o)r.push(o[i]);return r}

module.exports = new ChatController();