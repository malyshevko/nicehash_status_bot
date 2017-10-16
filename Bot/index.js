const TelegramBot = require('node-telegram-bot-api');
const request = require("request");

const token = '450883971:AAGlrZn8CF-g67xOvf2M6LQGGZRKT5UQHnA';
const bot = new TelegramBot(token, {polling: true});
 
bot.on('message', (msg) => {
	const chatId = msg.chat.id;
	console.log(msg);
	getRequest("stats.provider.workers","addr=3QTNRyHTuriqTZfmeyAEgbSJNeybjA3sNj").then(result => getWorkerInfo(result,chatId));
});
var chatId = ['277615689'];
var second = 350, the_interval = second * 1000;
var url = "https://api.nicehash.com/api?method=";
var workers = 2;
setInterval(function() {
	getRequest("stats.provider.workers","addr=3QTNRyHTuriqTZfmeyAEgbSJNeybjA3sNj").then(result => checkWorkerStatus(result));
}, the_interval);

function checkWorkerStatus(body){
	var workers_response = body.result.workers;
	if(workers_response.length < workers){
		sendMessageInfoAllUser('Один из воркеров упал');
	}	
	for(var i = 0; i < workers_response.length; i++){
		if(workers_response[i][1].a <= 0){
			sendMessageInfoAllUser('Упал воркер: ' + workers_response[i][0]);
		}
	}
}
function getRequest(method,param){
	return new Promise(function(resolve, reject){
		request({
			url: url + method + "&" + param,
			json: true
		}, function (error, response, body) {
			if (!error && response.statusCode === 200) {
				resolve(body);
			}else{
				reject(error);
			}
		})
	});
}
function sendMessageInfoAllUser(message){
	for(var i=0; i<chatId.length; i++){
		bot.sendMessage(chatId[i],message);
	}
}
function sendMessageUser(message,user){
	bot.sendMessage(user,message);
} 
function getWorkerInfo(body,user){
	var workers_response = body.result.workers;
	sendMessageUser('Worker launch: ' + workers_response.length,user);
	for(var i = 0; i < workers_response.length; i++){
		sendMessageUser('Worker: ' + workers_response[i][0] + ' работает с хэшрейтом: ' + workers_response[i][1].a,user);
	}
}
