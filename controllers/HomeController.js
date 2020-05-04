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


var mailer = require('../models/Sender_email.js');


var HomeController = function() {
	
};

HomeController.prototype = {
	'log' : function(req, res, mysql_use) {
		var login = req.body.login.trim().replace(/(<([^>]+)>)/ig,"");
		var password = req.body.password.trim().replace(/(<([^>]+)>)/ig,"");
		
		var selectQuery = "SELECT * FROM users WHERE login LIKE'"+login+"' AND password='"+password+"'";
		
		mysql_use.query(selectQuery,function(err, result, field){
			var msg = "";
			if(result == ""){

				msg = "<p><strong>Login</strong> or Password are not good !</p>";
				
				res.send([false,msg]);
				res.end();
				
			}
			else{
				_session=req.session;
				_session.user_id = result[0].id;
				_session.user = login;
				_session.nickname = result[0].nickname
				_session.token = result[0].token;
				var resp = {'user':result[0].nickname, 'url' : '/inv/'+result[0].token};
				res.send(resp);
				res.end();
			}
			
		});
	},
	'sign': function(req,res, mysql_use){
		var login = req.body.login.trim().replace(/(<([^>]+)>)/ig,"");
		var password = req.body.password.trim().replace(/(<([^>]+)>)/ig,"");
		var email = req.body.email.trim().replace(/(<([^>]+)>)/ig,"");
		var nickname = req.body.nickname.trim().replace(/(<([^>]+)>)/ig,"");
		var token = generateToken(20);
		var checked = false;
		var url = req.originalUrl;

		var selectQuery = "SELECT * FROM users WHERE login LIKE '"+login+"' OR nickname LIKE '"+nickname+"' OR email='"+email+"' ";
		var insertQuery = "INSERT INTO users (login,nickname,password,email,token,validate) VALUES('"+login+"', '"+nickname+"','"+password+"','"+email+"','"+token+"','0');";

		mysql_use.query(selectQuery,function(err, result, field){
			var msg={
				'type':'',
				'msg':''
			};
			if(result == ""){
				checked = true;	
			}
			else{
				checked = false;		
			}
			if( checked === true){

				mysql_use.query(insertQuery);

				_session=req.session;
				_session.user = login;
				_session.nickname = nickname;
				_session.token = token;
				_session.home_url = 'http://localhost:8000/inv'+token;
				mysql_use.query("select id from users where users.login ='"+login+"'",function(err, result, field){
					_session.user_id = result[0].id;
					res.send([true,token]);
					console.log(login +' was subscribe ! confirm mailsending to ... '+email);
				
					var mail ={
						to : email,
						subject : 'Invaders-game Confirm your email',
						html : "<head><style>body{font-family : verdana;}</style></head><body><h1> Welcome " +login+" </h1><p>you need confim your email for join the battle <a href =http://localhost:8000"+url+"/confirm_email/"+token+"> click here</a> to confirm </p></body>"
					};
					mailer.sendNodemailer('smtp',mail.to,mail.subject,mail.html);// type send, to, subject, html
					res.end();
				})

			}
			else{
				if(login === result[0].login){
					msg.type = 'login';
					msg.msg = "<p><strong>Login</strong> already taken !</p> ";
				}
				
				if(nickname === result[0].nickname){
					msg.type = "nickname";
					msg.msg = "<p><strong>Nickname</strong> already taken !</p> ";
				}
				
				if(email === result[0].email){
					msg.type = "email";
					msg.msg = "<p><strong>Email</strong> already taken !</p> ";
				} 
				
				res.send([false,msg]);
				res.end();	
			}
		});
	},
	'confirmEmail' :function(res,req, mysql_use, callback){
		var url = req.req.url;
		var part = url.split('/');
		var token = part[part.length-1];
		var selectQuery = "SELECT users.id from users WHERE users.token LIKE '"+token+"';";

		mysql_use.query(selectQuery, function(err, result, field){
			
			var insertQuery = "INSERT  IGNORE INTO profiles (user_id, avatar) VALUES ('"+result[0].id+"','/uploads/avatars/unknow.png')";
			var insertQuery2 = "INSERT IGNORE  INTO scores (user_id, score) VALUES ('"+result[0].id+"', 0)";
			mysql_use.query(insertQuery);
			mysql_use.query(insertQuery2);
		});
		var updateQuery ="UPDATE Invaders.users SET validate = '1' WHERE users.token LIKE '"+token+"' ; ";

	
		mysql_use.query(updateQuery,function(err, result, field){
			
			if (err){
				console.log('confirm mail error : ' + err);
			}
			else{
				console.log('mail confirmed !! for token_user : ' + token);
				callback();
				return;

			}
		});
		



		
	}
};
/*----------------------helper function-------------------*/
function generateToken(nb){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

    for( var i=0; i < nb; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
module.exports = new HomeController();