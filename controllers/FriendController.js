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
var FriendController = function() {
};

FriendController.prototype = {
	'init' : function(req, res, mysql_use){
		req.params = 'token';
		var _session = req.session;

		var count = 0; // hack asynchrone counter
		var profilesFriendArr = [];// stack our friends
		var profilesPreFriendArr = []; // stack our future friends
		var requestFriend = []; // stack our friend request

		var selectUser = "SELECT * FROM users WHERE token='"+_session.token+"'";
		mysql_use.query(selectUser, function(err, user, field){
			if(user[0].validate == 1){
				var select = "SELECT * FROM friends WHERE user_id1="+_session.user_id;

				var select2 = "SELECT * FROM friends WHERE user_id2="+_session.user_id+" AND validate=0";
				mysql_use.query(select2, function(err2,relationship2 ,field2){
					if(relationship2 != ''){

						for(var i=0; i<relationship2.length; i++){
							
							var selectFriend = "SELECT * FROM profiles WHERE user_id="+relationship2[i].user_id1;
							mysql_use.query(selectFriend,function(err2,profile,field2){
								requestFriend.push(profile[0]);
								
							});
						}
					}
					else{ 
						requestFriend = null;
					}
				})

				mysql_use.query(select, function(err,relationship,field){
					if(relationship != ''){
						for(var i=0; i<relationship.length; i++){
							
							var selectFriend = "SELECT * FROM profiles WHERE user_id="+relationship[i].user_id2;

							mysql_use.query(selectFriend,function(err2,profile,field2){

								if(relationship[count].validate == 1){
									profilesFriendArr.push(profile[0]);
								}
								else if(relationship[count].validate == 0){
									profilesPreFriendArr.push(profile[0]);
								}
								if(relationship.length-1 == count){
							
									res.render('dashboard/dashboard-friend',{
											'requestFriend' : requestFriend,
											'profilesFriendArr' : profilesFriendArr,
											'profilesPreFriendArr' : profilesPreFriendArr,
										});
								}
								count++;
								
							});
						}
					}
					else{

						setTimeout(function(){ // warning hack for execute this code asynchrone use promise is better
							
							profilesFriendArr = null;
							profilesPreFriendArr = null;
					
							res.render('dashboard/dashboard-friend',{
								'requestFriend' : requestFriend,
								'profilesFriendArr' : profilesFriendArr,
								'profilesPreFriendArr' : profilesPreFriendArr,
							});
						});
					}	

				})	
			}

			else{
				res.send('please valid your email for acces profile option');
				res.end();
			}
		});
	},
	'showFriendProfile':function(req, res, mysql_use){
		
		var _session = req.session;
		var guestMode = false;
		var select = "SELECT * FROM users WHERE id='"+req.params.id+"'";

		//if we are on future friend profil
		var checkPre = req.params.pre;

		
		var selectFriendship = "SELECT * FROM friends WHERE user_id1 = "+_session.user_id+" AND user_id2 = "+req.params.id
		mysql_use.query(selectFriendship, function(err, friendship, field){
			if(friendship !=''){
				if(friendship[0].validate != 1){
					guestMode = true;

				}
				else{
					guestMode = false;
				}
			}
		});
		if(checkPre === 'pre'){
			guestMode = true;
		}

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
										  'guestMode' : guestMode,
						                			  'nickname' : user[0].nickname,
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
										 'guestMode' : guestMode,
						                			  'nickname' : user[0].nickname,
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
	'postFriendStatus' : function(req, res, mysql_use){

		var _session = req.session;
		var select = "SELECT * FROM users WHERE id='"+req.params.id+"'";
		var post_content = req.body.content;

		mysql_use.query(select, function(err, user, field){
			var insertQuery = "INSERT INTO Invaders.posts ( user_id, content_post, nickname) VALUES ('"+user[0].id+"','"+post_content+"' , '"+_session.nickname+"');";
			var result = {'post_nickname':_session.nickname, 'post_content': post_content}; //res of request
			mysql_use.query(insertQuery, function(){
				res.send(result);
			});
		});	
	},
	'searchFriend' : function(req, res, mysql_use){
		var playerName = req.body.searchRequest;
		var result = {user:{}};
		var select = "SELECT id, nickname FROM users WHERE users.nickname LIKE '"+playerName+"'";
		mysql_use.query(select, function(err, user, field){
			if(user != ''){
				result.user.id= user[0].id;
				result.user.nickname = user[0].nickname;
				var selectProfile = "SELECT * FROM profiles WHERE user_id="+result.user.id;
				mysql_use.query(selectProfile, function(err2, profile, field2){
					if(profile != ''){
						result.profile = profile[0];
						res.send(result);
					}
					else{
						result.error = "this player doesn't have profile"
						res.send(result);
					}
				});
			}
			else{

				result.error = "this player doesn't exist"
				res.send(result);
			}
		
		});
	},
	'addFriendRequest' : function(req, res, mysql_use){
		var _session = req.session;
		var wantToAdd = req.params.id;
		var insert = "INSERT INTO friends (user_id1, user_id2, validate) VALUES ("+_session.user_id+","+wantToAdd+", 0);"
		mysql_use.query(insert);
		res.send('Friend request sended ! ');
	},
	'addFriend': function(req, res, mysql_use){
		var _session = req.session;

		var insert = "INSERT INTO friends (user_id1, user_id2, validate) VALUES ("+_session.user_id+","+req.params.id+", 1);";
		var update = "UPDATE friends SET validate = 1 WHERE user_id2 = "+_session.user_id;
		mysql_use.query(insert);
		mysql_use.query(update);
		res.redirect('/inv/'+_session.token+'/friends');


	}
};
/*----------------------helper function-------------------*/

module.exports = new FriendController();