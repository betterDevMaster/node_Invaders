(function(ctx, $){
	var app = {
		init : function(){
			this.cssHeight();
			// disconect socket on click anv button
			var $nav_disconect = $('.navy-btn');
			$nav_disconect.on('click', function(evt){
				socket.emit('disconnect');
			});
			this.post_content();
			this.update_profile();
			this.remove_content();
			this.searchFriend();
			this.addFriend();
		},
		cssHeight : function(){
			//hack for height always 100%
			var height = $(document).height();
			$('.home, .left-column').css('height',height);
		},
		update_profile : function(){
			var update_mode = false;
			var $update_btn = $('.update-profile-btn');
			$update_btn.on('click', function(){
				var $header = $('.main-header');
				var $child_header = $('.main-header').children();
				var $profile_text = $('.profile-text');
				var $news_profile = $('.news-profile');
				var $avatar = $('.profile-img');
				
				var dataKeeper = {
					'original_presentation' : $profile_text[0].innerText.trim(),
					'original_avatar' : $avatar.attr('src'),
				};



			
				if(update_mode === false){
					console.log(dataKeeper )
					// update mode enable
					update_mode  = true;
					
					$news_profile.css('display','none');
					$header.empty();
					$profile_text.empty();
					$header.append("<form class='update-form' action='profile/modify' method='post' enctype='multipart/form-data'></form>");
					
					for(var i = 0; i<$child_header.length; i++){
					
						$('.update-form').append($child_header[i]);
					}
					$('.update-form').append("<input type='file' name='avatar' id='avatar-img-file' style='display:none'></input>");
					$avatar.on('mouseover',function(){
						$avatar.css('cursor','pointer');
					})
					$avatar.on('click',function(){
						$("input[id='avatar-img-file']").click();

						
					})

					$profile_text.append("<textarea name='presentation' placeholder='write your presentation here' class='form-control' row='5'>"+dataKeeper.original_presentation+"</textarea>");
					
				}
				else{
					// update mode disable

					update_mode = false;

					// take presentation text value
					$profile_text = $profile_text.children().val();

					$update_form_content = $('.update-form').children();
					$('.update-form').submit();
				}
				
			});
		},
		post_content : function(){
			var $post_btn = $('.post-btn');
			var $comment_btn = $('.comment_btn');
			

			$post_btn.on('click', function(evt){
				var $elem = evt.target;
				
				var $form = $('form');
				var $this = $(this).attr('data-type');
				evt.preventDefault();
				//if post is a status or comment
				if($this === 'post'){
					$form.attr('action', 'profile/post-status');
					
					// take id of friend

					var split = window.location.href.split('/');
					if(isNaN(split[split.length-1]) !== true){ // if is a number
						$form.attr('action', 'profile/post-status/'+split[split.length-1]);
					}

					if($('.post-content').val() == ""|| $('.post-content').val() == " "){
						
						return;
					}
				
					$.ajax({
			 			url: $form.attr('action'),
			 			method : $form.attr('method'),
			 			data :{'content' : $('.post-content').val()},	
			 			success : function(res){
			 				window.location.href = window.location.href;
			 				
			 			},
			 			error : function(res){
			 				alert('sorry bug ajax try update your browser or contact me');
			 				}
			 			});
				}
				else if($this === 'comment'){
					$form.attr('action', 'profile/post-comment');
					
					var comment_content = $(this).parent().find('textarea').val();
					if(comment_content == ""|| comment_content == " "){
						return;
					}					
					$.ajax({
			 			url: $form.attr('action'),
			 			method : $form.attr('method'),
			 			data : {'content' : comment_content , 'post_id': $(this).attr('data-post-id')},	
			 			success : function(res){
			 				var insertAt = $($elem).parent();

			 				insertAt.before("<li class='col-xs-12 comment' data-type='comment'><p>------> "+res.comment_nickname+" a dit: "+res.comment_content+"</p></li>")
			 				
			 				
			 			},
			 			error : function(res){
			 				alert('sorry bug ajax try update your browser or contact me');
			 			}
			 		});
					
				}
			});
		},
		remove_content : function(){
			$(' .post, .comment').on('mouseenter', function(){
				var $form = $('form');

				var $type = $(this).attr('data-type');
				var split = window.location.href.split('/');
				if(isNaN(split[split.length-1]) !== true || split[split.length-1] === 'pre'){ // if is a number
					return;
				}
					$(this).append("<button type='submit' class='remove-content btn btn-default'>x</button>")
					$remove_btn = $('.remove-content');
					$remove_btn.on('mouseenter',function(){
					
						$(this).parent().css('background-color','lightgrey');
					})
					$remove_btn.on('mouseleave',function(){
					
						$(this).parent().css('background-color','inherit');
					})
					
					$remove_btn.on('click',function(evt){
						evt.preventDefault();
						
							var $elem = $(this).parent()
							var $id= $elem.attr('data-id');
							$form.attr('action','profile/supp/'+$type+'/'+$id);
							$.ajax({
					 			url: $form.attr('action'),
					 			method : 'get',	
					 			success : function(res){
					 				if($elem.attr('data-type')==='post'){
					 					window.location.href = window.location.href;
					 				}
					 				else{
					 					$($elem).remove();

					 					alert('comment deleted ! ');
					 				}
					 			},
					 			error : function(res){
					 				alert('sorry bug ajax try update your browser or contact me');
					 			}
				 			});
						
					});
				
				$remove_btn.on('mouseleave',function(){
				
					$(this).parent().css('background-color','inherit');
				})

			})
			$(' .post, .comment').on('mouseleave', function(){
				$(this).css('background-color','inherit');
				$('.remove-content').remove();


				
			});
			
		},
		searchFriend : function(){
			var $form = $('form');
			$('.search-btn').on('click', function(evt){
				evt.preventDefault();
				$form.attr('action','friends/search');
				var $search = $('.search').val();
				$.ajax({
		 			url: $form.attr('action'),
		 			method : 'post',
		 			data : {'searchRequest' : $search},	
		 			success : function(res){
		 				if(res.error){
		 					$('.error-msg').remove();
		 					$form.after("<p class='error-msg'>"+res.error+"</p>");	
		 				}
		 				else{
		 					
		 					$('.error-msg').remove();
		 					$('.name-player').remove()
		 					$form.after("<a class='name-player' href='friend-profile/"+res.user.id+"/pre'><img src='"+res.profile.avatar+"' alt='picture of request friend' height='50px' width='50px'>"+res.user.nickname+"</a>");	
		 				}
		 			},
		 			error : function(res){
		 				alert('sorry bug ajax try update your browser or contact me');
		 			}
			 	});
			})
		},
		addFriend : function(){
			var $form = $('form');
			var split = window.location.href.split('/');
			if(isNaN(split[split.length-2]) !== true && split[split.length-1] === 'pre'){ // if is a number
				
				$form.attr('action','inv');
				
			}
			else{
				return;
			}
			$('.add-friend-btn').on('click', function(){
				$.ajax({
		 			url: $form.attr('action'),
		 			method : 'post',
		 			success : function(res){
		 				alert(res);
		 				
		 			},
		 			error : function(res){
		 				alert('sorry bug ajax try update your browser or contact me');
		 			}
			 	});
			})
		}
	};
	var self = app;
	ctx.app = app;
})(window, jQuery);