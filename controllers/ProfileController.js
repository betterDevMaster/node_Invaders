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
var ProfileController = function() {
	
};

ProfileController.prototype = {
	'init':function(req, res, mysql_use){
		req.params = 'token';
		var _session = req.session;
		var guestMode = false;

		var select = "SELECT * FROM users WHERE token='"+_session.token+"'";

		mysql_use.query(select, function(err, user, field){
		
			if(user[0].validate == 1){

				
				var selectProfil = "SELECT profiles.avatar, profiles.presentation, scores.score FROM profiles, scores WHERE  profiles.user_id ='"+user[0].id+"' AND scores.user_id ='"+user[0].id+"'";
				mysql_use.query(selectProfil, function(err2,profile,field2){


					var selectPost = "SELECT posts.nickname, posts.content_post, posts.id  FROM users, posts  WHERE posts.user_id ='"+user[0].id+"' AND users.id ='"+user[0].id+"'";
					
					mysql_use.query(selectPost, function(err3,posts,field3){
						var comments = [];
						posts.reverse();// put last post on the top
						
						var post_count =0;

						if(posts == ''){
							res.render('dashboard/dashboard-profile.ejs',{
										  'guestMode':guestMode,
										  'nickname':null,
						                			  'session':_session,
						                			  'profile': profile[0],
						                			  'posts': posts,
						                			  'comments':comments
						             })
						}
						posts.forEach(function(post){
							
							var selectComment = "SELECT comments.id, comments.content_com, comments.nickname, comments.post_id FROM comments WHERE post_id='"+post.id+"'"; 
							mysql_use.query(selectComment, function(err4, comment, field4){
								post_count++;

								for(var i =0; i< comment.length; i++){
									comments.push(comment[i]);
								}
								if(post_count === posts.length){

									res.render('dashboard/dashboard-profile.ejs',{
										  'guestMode':guestMode,
										  'nickname':null,
						                			  'session':_session,
						                			  'profile': profile[0],
						                			  'posts': posts,
						                			  'comments':comments
						                		});
						             	
								}

							})

						});
					});	
				});	
			}
			else{
				res.send('please valid your email for acces profile option');
				res.end();
			}
		});
	},
	'postStatus' : function(req, res, mysql_use){
		req.params = 'token';
		var _session = req.session;
		var post_content = req.body.content;
		
		var insertQuery = "INSERT INTO Invaders.posts ( user_id, content_post, nickname) VALUES ('"+_session.user_id+"','"+post_content+"' , '"+_session.nickname+"');";
		var result = {'post_nickname':_session.nickname, 'post_content': post_content}; //res of request
		mysql_use.query(insertQuery, function(){
			res.send(result);
		});
	},
	'commentStatus' : function(req, res, mysql_use){
		req.params = 'token';
		var _session = req.session;
		var comment_content = req.body.content;
		var post_id = req.body.post_id;
		var insert = "INSERT INTO Invaders.comments ( user_id, content_com, post_id, nickname) VALUES ('"+_session.user_id+"','"+comment_content+"' ,'"+post_id+"','"+_session.nickname+"');";
		var result = {'comment_nickname':_session.nickname, 'comment_content': comment_content}; //res of request
		mysql_use.query(insert, function(){
			res.send(result);
		});	
	},
	'updateProfile' : function( fs, req, res, mysql_use){
		req.params  = 'token';
		var _session = req.session;
		var profile_presentation = req.body.presentation;
		var avatar_file = req.file;

		if(avatar_file != '' && avatar_file !== undefined){
			var ext = avatar_file.originalname.substr(avatar_file.originalname.lastIndexOf('.') + 1);
			var final_name_avatar = generateToken(50);
			fs.rename(avatar_file.path, './uploads/avatars/'+final_name_avatar+'.'+ext);
			var updateQuery = "UPDATE Invaders.profiles SET avatar ='/uploads/avatars/"+final_name_avatar+'.'+ext+"' WHERE profiles.user_id ='"+_session.user_id+"';";
			mysql_use.query(updateQuery);
		}
		
	
		

		var updateQuery = "UPDATE Invaders.profiles SET presentation='"+profile_presentation+"' WHERE profiles.user_id="+_session.user_id+";";
		mysql_use.query(updateQuery, function(){
			res.redirect('/inv/'+_session.token+'/profile');
		});
	},
	'removePost' : function(req, res, mysql_use){
		if(req.params.type === 'comment'){
			var removeQuery = "DELETE FROM comments WHERE comments.id ='"+req.params.id+"'";
			mysql_use.query(removeQuery);
			res.end();
		}
		if(req.params.type === 'post'){
			var removeQuery = "DELETE FROM posts WHERE posts.id ='"+req.params.id+"'";
			mysql_use.query(removeQuery);
			res.end();
		}
	
		
		
		


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
module.exports = new ProfileController();