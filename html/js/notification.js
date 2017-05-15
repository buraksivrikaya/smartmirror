const cmd = require('node-cmd');

var setNotificationUserName = function(name){
	notificationElements.user = name;
	$('.notificationElement[data-type="user"]').html(name);
}


var icons='\
<i class="fa fa-arrow-up" aria-hidden="true"></i>\
<i class="fa fa-arrow-left" aria-hidden="true"></i>\
<i class="fa fa-arrow-down" aria-hidden="true"></i>\
<i class="fa fa-arrow-right" aria-hidden="true"></i>'
var setGestureDirectionShow = function(dir){
	if(dir == 'Left'){
		$('.notificationElement[data-type="gestArrow"]').html('<i class="fa fa-arrow-left" style="display:none" aria-hidden="true"></i>');
		$('.notificationElement[data-type="gestArrow"]').fadeIn('fast', function(){
			$(this).fadeOut('slow');
		});
	}

	else if(dir == 'Right'){
		$('.notificationElement[data-type="gestArrow"]').html('<i class="fa fa-arrow-right" aria-hidden="true"></i>');
		$('.notificationElement[data-type="gestArrow"]').fadeIn('fast', function(){
			$(this).fadeOut('slow');
		});
	}

	else if(dir == 'Long down' || dir == 'Down'){
		$('.notificationElement[data-type="gestArrow"]').html('<i class="fa fa-arrow-down" aria-hidden="true"></i>');
		$('.notificationElement[data-type="gestArrow"]').fadeIn('fast', function(){
			$(this).fadeOut('slow');
		});
	}

	else if(dir == 'Long up' || dir == 'Up'){
		$('.notificationElement[data-type="gestArrow"]').html('<i class="fa fa-arrow-up" aria-hidden="true"></i>');
		$('.notificationElement[data-type="gestArrow"]').fadeIn('fast', function(){
			$(this).fadeOut('slow');
		});
	}
}
cmd.get(
    'nmcli connection show',
    function (err, data, stderr) {
        var parsedList = [];
        if (!err) {
            if (data) {
                var unparsedList = data.split('\n');
                var name =unparsedList[1].split(' ');

                $('.notificationElement[data-type="connection"]').html(name[0]);

            } 

        }else {
                $('.notificationElement[data-type="connection"]').html('unknown-connection');
            }
}); 