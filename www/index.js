$(document).ready(function(){
	console.log(admin);
 	
  	if(admin == 1){
  		$('.adminSetting').removeClass('hidden');
  	}else{
  		$('.adminSetting').addClass('hidden');
  	}

  	if(loggedIn == 1){
  		$('#logOutButton').removeClass('hidden');
  		$('#loginAreaButton').addClass('hidden');
  		$('#settingsMenuButton').removeClass('hidden');
  	}else{
  		$('#logOutButton').addClass('hidden');
  		$('#loginAreaButton').removeClass('hidden');
  		$('#settingsMenuButton').addClass('hidden');
  	}


  	$('#logOutButton').on('click', function(){
		localStorage.setItem('SmartLogedIn', 0);
		localStorage.setItem('SmartAdmin', 0);
		localStorage.setItem('SmartUserName', 0);
		$.notify('<strong>Çıkış Yapılıyor</strong> Lütfen Bekleyiniz', { allow_dismiss: false });
		window.setTimeout(function() {
			location.reload();	
		}, 200);
  	});

	$('#loginAreaButton').on('click', function(){
		$(this).closest('li').addClass('active');
		$('#container').html('<div id="login-container">\
							        <div class="form-box">\
							            <form>\
							                <input name="user" type="text" placeholder="kullanıcı adı">\
							                <input type="password" placeholder="şifre">\
							                <button id="loginButton" class="btn btn-info btn-block login" id="load" data-loading-text="<i class=\'fa fa-spinner fa-spin\'></i> Giriş">Giriş</button>\
							            </form>\
							        </div>\
							    </div>\
							</div>');

		$('#container').ready(function(){
			$('#loginButton').on('click', function(e){	
				var notify = $.notify('<strong>Giriş Yapılıyor</strong> Lütfen Bekleyiniz', { allow_dismiss: false });
				e.preventDefault();
				var $this = $(this);
				$this.button('loading');
				setTimeout(function() {
					$this.button('reset');

					var userName = $("input[name=user]").val();
					var password = $("input[type=password]").val();
					if(userName.length > 0 && password.length > 0){
						$.ajax({
					    	url: "./login", 
					    	data: {id : userName, password : password}, 
					    	success: function(result){
					        	if(result == "1"){//no user
					        		console.log("boyle kullanıcı adı ile biri yok");
					        	}
					        	else if(result == "2"){//incorrect password
					        		console.log("şifre hatalı");

					        	}
					        	else{//correct password
									console.log("her sey dogru");
									var res = JSON.parse(result);
									localStorage.setItem('SmartLogedIn', 1);
									localStorage.setItem('SmartAdmin', res[1]);
									localStorage.setItem('SmartUserName', res[0]);
									notify.close();
									location.reload();
					        	}
					    	}
						});
					}
					else{
						console.log("kısa kullanıcı adı veya password");
					}




				}, 1000);
			});

		});
          
	});






});
