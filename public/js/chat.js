//chat 0.8
(function(ctx , $){
	'use strict';
	var chat = {
		
		send_msg : function(){
			var user = sessionStorage.getItem("user");
			$(' .dashboard .msg-form').append("<input name='user' id='user' type = 'hidden' value="+user+"></input>");
			$(' .dashboard .msg-form').on('submit',function(evt){
				evt.preventDefault();
				var msg = {
					'user' : user,
					'content' : $(' .dashboard .msg').val()
				};
				
				socket.emit('msg_sended', msg);
			
				$(' .dashboard .msg').val('');
			});	
		},
		get_msg : function(limit){
			socket.emit('first_load');
			var user = sessionStorage.getItem("user")
			var $this = $(' .dashboard .msg-form');
			var $chat = $(' .dashboard .chat');
			
			
	
			var check_msg = false;

			socket.on('msg_receiver', function(msg){

				var talk = [];
				var talkForPop=[];
				for(var i =0; i<msg.length; i++){
					talk += '<p ><span class='+msg[i].user+' style=\'color: #729002\'>'+msg[i].user+'</span> say :'+'</p>'+'<p>'+msg[i].content+'</p>';	
				}
				$chat.empty().append(talk);
				$chat.scrollTop(100000);
				
				check_msg = false;
			});
		},	
		check_user : function(){

			var $users = $('.dashboard .users');

			socket.on('users_chat_list',function(list){
				var liste = [];
				for(var i = 0 ; i< list.length; i++){
					
					liste += '<li>'+list[i]+'</li>';
				}
				$users.empty().append('<h2>Users logged: </h2>'+'<ul>'+liste+'</ul>');
			})
		}
	}
	ctx.chat = chat;
})(app, jQuery)