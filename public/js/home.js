// homme page
'use strict';
(function(ctx, $ ){

	var app = {
		init : function(){
			var mySwiper = new Swiper ('.swiper-container', {
				// Optional parameters
				direction: 'vertical',
				loop: true,
				autoplay:10000,
				speed : 1000,
				effect :'fade',
				fade: {
					crossFade: true
				},

				// If we need pagination
				pagination: '.swiper-pagination',

			  })   
			this.chooseForm();
			this.ajaxSubmit();
		},
		chooseForm : function(){
			var $login_btn = $(".login-choose");
			var $sign_btn =$(".sign-choose");
			var $page_form = $('.page-form');
			var login_ready =false;
			var sign_ready = false;
			var $swiper = $('.swiper-container');
			$login_btn.on('click',function(){
				
				$swiper.fadeOut(400);
				setTimeout(function(){
					$page_form.fadeIn(500);
					
				},600);
			
				self.showForm('log');
				
			});
			$sign_btn.on('click',function(){
			
				$swiper.fadeOut(400);
				setTimeout(function(){
					$page_form.fadeIn(500);
				},600);
				self.showForm('sign');
			});
		},
		// sign form or log form typeOfForm = sign || log
		showForm : function(typeOfForm){
			var type = typeOfForm;
			var $form = $('.form');
			var $alert = $('.alert');
			var url = window.location.href;
			$form.empty();
			var log_form = "<label for=\"login\">login</label><input class=\"form-control login\" name=\"login\" type=\"text\"  required/><label for=\"pasword\">password</label><input type=\"password\"class=\"form-control password\" name=\"password\" required /><button type=\"submit\" class=\"btn btn-success login-button\">login</button>";
			
			var sign_form = "<label for=\"login\">Enter your login connection</label><input class=\"form-control login\" name=\"login\" type=\"text\"  required/><label for=\"pasword\">Enter your password here</label><input type=\"password\"class=\"form-control password\" name=\"password\" required /><label for=\"email\">Enter your email</label><input type=\"email\" name=\"email\" class=\"email form-control\" required/><label for=\"nickname\">Enter your in game nickname</label><input type=\"text\" name=\"nickname\" class=\"form-control nickname\"  required/><button  class=\"btn btn-success sign-button\">sign in</button>";
			
			if(typeOfForm === 'log'){
				$form.attr('data-type','log');
				$form.empty();
				$form.attr('action',url+'log');
				$form.addClass('log-form');
				$form.removeClass('sign-form');
				$form.append(log_form);
				
			}
			else if(typeOfForm === 'sign'){
				$form.attr('data-type','sign');
				$form.empty();
				$form.attr('action',url+'sign');
				$form.addClass('sign-form');
				$form.removeClass('log-form');
				$form.append(sign_form);
				
			}
			$form.children('input').on('focus', function(){
					$alert.fadeOut(500);
			});
		},
		ajaxSubmit : function(){

			$('form').on('submit',function(evt){
			 	evt.preventDefault();
			 	var $alert = $(".alert");
				var $form = $('form');
			 	if($form.attr('data-type') === 'sign'){
			 		if(self.secureForm($form)){
			 			$.ajax({
			 			url: $form.attr('action'),
			 			method : $form.attr('method'),
			 			data : $form.serialize(),	
			 			success : function(res){
			 				if(res[0] === true){
			 					console.log(res);
			 					window.location.replace('inv/'+res[1]);
			 				}
			 				else{
			 					$alert.empty();

			 					if(res[1].type === 'login'){
			 						$alert.append(res[1].msg).fadeIn(500).removeClass('hidden');
									
			 					}
			 					if(res[1].type === 'nickname'){
			 						$alert.append(res[1].msg).fadeIn(500).removeClass('hidden');
			 					}
			 					if(res[1].type === 'email'){
			 						$alert.append(res[1].msg).fadeIn(500).removeClass('hidden');
			 					}
			 				}
			 			},
			 			error : function(res){
			 				alert('sorry bug ajax try update your browser or contact me');
			 				}
			 			})
			 		}
			 	}	
			 	else if($form.attr('data-type') === 'log'){
			 		if(self.secureForm($form)){
						$.ajax({
							url: $form.attr('action'),
							method : $form.attr('method'),
							data : $form.serialize(),	
							success : function(res){
								if(res[0] != false){
									
									sessionStorage.setItem('user', res.user);

									document.location.href= res.url;

								}
								else{
									$alert.empty();
									$alert.append(res[1]).fadeIn(500).removeClass('hidden');
								}
							},
							error : function(res){
								alert('sorry bug ajax try update your browser or contact me');
							}
						});
					}
			 	}
			 });
			


			// if($form.attr('data-type') === 'log'){
			// 	$form.on('submit',function(evt){
			// 		evt.preventDefault();
			// 		if(self.secureForm($form)){
			// 			$.ajax({
			// 				url: $form.attr('action'),
			// 				method : $form.attr('method'),
			// 				data : $form.serialize(),	
			// 				success : function(res){
			// 					if(res[0] != false){
									
			// 						sessionStorage.setItem('user', res.user);

			// 						document.location.href= res.url;

			// 					}
			// 					else{
			// 						$alert.empty();
			// 						$alert.append(res[1]).fadeIn(500).removeClass('hidden');
			// 					}
			// 				},
			// 				error : function(res){
			// 					alert('sorry bug ajax try update your browser or contact me');
			// 				}
			// 			});
			// 		}
			// 	});
			// }
		},
		secureForm : function(form){
			var $form_secure = form;
			var $alert = $('.alert');
			var msg ="";
			var checked = true;
			var $inputs = $form_secure.children('input');

			
			$alert.empty();
			

			// à ameliorer;

			for ( var i =0; i<$inputs.length; i++){
				var $input = $($inputs[i]);
				$input.val($input.val().replace(/(<([^>]+)>)/ig,""));
				if($input.val().trim().length < 4){
					msg = "<p><strong>Error</strong> Please all field need most of 4 charactere length</p>";
					$alert.append(msg).fadeIn(500).removeClass('hidden');
					return false;
				}

			}
			return checked;
		},

	}
	ctx.app = app;
	var self = app;
})(window, jQuery);
