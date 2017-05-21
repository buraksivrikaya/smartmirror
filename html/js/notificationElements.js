var currentTime = new Date();
var currentHours = currentTime.getHours() < 10 ? '0' + currentTime.getHours() : currentTime.getHours();
var currentMinutes = currentTime.getMinutes() < 10 ? '0' + currentTime.getMinutes() : currentTime.getMinutes();

var notificationElements = {
	gestArrow: '',
	user: 'undefined user',
	connection: 'Test Ağı',
	clock: currentHours + ':' + currentMinutes,
}