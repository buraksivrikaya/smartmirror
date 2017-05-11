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
  		$('#loggedInSettingsMenu').removeClass('hidden');
  	}else{
  		$('#logOutButton').addClass('hidden');
  		$('#loginAreaButton').removeClass('hidden');
  		$('#settingsMenuButton').addClass('hidden');
  		$('#loggedInSettingsMenu').addClass('hidden');
  	}


  	$('#logOutButton').on('click', function(){
		localStorage.setItem('SmartLogedIn', 0);
		localStorage.setItem('SmartAdmin', 0);
		localStorage.setItem('SmartUserName', 0);
		$.notify('Çıkış Yapılıyor. Lütfen Bekleyiniz', {className:"notify", showDuration:"500", autoHide: true, globalPosition: "top right" });
		window.setTimeout(function() {
			location.reload();	
		}, 500);
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
				$.notify('Giriş Yapılıyor. Lütfen Bekleyiniz', {className:"notify", showDuration:"500", autoHide: true, globalPosition: "top right" });
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
					        		$('input[name=user]').notify( "Hatalı Kullanıcı", {className: "error", position:"left middle"});
					        	}
					        	else if(result == "2"){//incorrect password
					        		console.log("şifre hatalı");
					        		$('input[type=password]').notify( "Hatalı Şifre", {className: "error", position:"left middle"});
					        	}
					        	else{//correct password
									console.log("her sey dogru");
									var res = JSON.parse(result);
									localStorage.setItem('SmartLogedIn', 1);
									console.log(res[1]);
									localStorage.setItem('SmartAdmin', res[1] == true ? 1:0);
									localStorage.setItem('SmartUserName', res[0]);
									//notify.close();
									location.reload();
					        	}
					    	}
						});
					}
					else{
						console.log("kısa kullanıcı adı veya password");
					    $('#loginButton').notify( "Kısa kullanıcı adı veya şifre", {className: "error", position:"bottom center"});
					}
				}, 500);
			});
		});
	});




    $('#showAllUsersButton').on('click', function(e){
        console.log("all users list");

        $.ajax({
            url: "./getUsers",
            success: function(result){
                var temp = '<ul id="userList" class="list-group">\
                <h4 class="list-group-item-heading">Kullanıcı Listesi</h4>';
                var userList = JSON.parse(result);
                userList.forEach(function(item,index){
                	console.log(item.id);
			        temp += '<li class="list-group-item"><a class="removeUserButton" data-id="'+ item.id +'"><span class="glyphicon glyphicon-trash"></span></a>' + item.id +'\
			        ' + (item.twitter > 0 ? '<i class="fa fa-twitter authIcon"></i>' : '') + (item.gmail > 0 ? '<i class="fa fa-envelope-o authIcon"></i>' : '') +'</li>';
			    });
				temp += '</ul>';

                $('#container').html(temp);


                $('#container').ready(function(){
				    $('.removeUserButton').on('click', function(e){
				    	var userToRemove = $(this).data('id');
				        console.log("remove user " + userToRemove);

				        if(confirm(userToRemove + ' kişisini silmek istediğinizden emin misiniz?')){
				        	console.log("removed " + userToRemove);
				        	$.ajax({
						    	url: "./removeUser", 
						    	data: {id : userToRemove}, 
						    	success: function(result){
				        			$.notify(userToRemove + ' kişisi başarıyla silindi...', {className:"success", showDuration:"500", autoHide: true, globalPosition: "top right" });
						    		$('#showAllUsersButton').click();
						    	}
							});
				        }else{
				        	console.log("canceled");
				        	$.notify(userToRemove + ' kişisini silme iptal edildi...', {className:"notify", showDuration:"500", autoHide: true, globalPosition: "top right" });
				        }
				        

				    });

                });

            }
        });

    });


    $('#settingsMenuButton').on('click', function(e){
        console.log("settings menu clicked");
        var grantedTemplate = '<i class="fa fa-check-circle-o grantedIcon" aria-hidden="true"></i>';
        var unGrantedTemplate = '<i class="fa fa-times-circle-o grantedIcon" aria-hidden="true"></i>';
        var settingsListTemplate= '<ul class="list-group">\
							        <li class="list-group-item" id="gmailAuth"><i class="fa fa-envelope-o authIcon"></i>Gmail\
							        	<a href="http://localhost:3000/auth/gmail" id="authGmailButton" class="btn btn-info authButton" role="button">Giriş</a>\
							        	<a id="authGmailButton" class="btn btn-danger authButton" role="button">Çıkış</a></li>\
							        <li class="list-group-item" id=twitterAuth><i class="fa fa-twitter authIcon"></i>Twitter\
							        	<a href="/auth/gmail" id="" class="btn btn-info authButton" role="button">Giriş</a>\
							        	<a id="" class="btn btn-danger authButton" role="button">Çıkış</a></li></li></ul>';


        $('#container').html(settingsListTemplate);
		var username = localStorage.getItem("SmartUserName");

		$.ajax({
	    	url: "./getUserSettings", 
	    	data: {id : username}, 
	    	success: function(result){
    			var settings = JSON.parse(result);
    			settings.gmail == 1 ? $('#gmailAuth i').before(grantedTemplate): $('#gmailAuth i').before(unGrantedTemplate);
    			settings.twitter == 1 ? $('#twitterAuth i').before(grantedTemplate): $('#twitterAuth i').before(unGrantedTemplate);
	    	}
		});
    });



    $('#wirelessGetButton').on('click', function(e){
    	var wirlessContainerTemplate = '<div id="wirelessSSID-container">\
									  		<ul class="list-group">\
									  		</ul>\
							  			</div>';

		
    });
});
