var currentTime = new Date();
var currentHours = currentTime.getHours();
var currentMinutes = currentTime.getMinutes();

var notificationElements = {
	user: 'undefined user',
	connection: 'Test Ağı',
	clock: currentHours + ':' + currentMinutes,
}