var ws;

function connectSocketServer(callback) {
    var support = "MozWebSocket" in window ? 'MozWebSocket' : ("WebSocket" in window ? 'WebSocket' : null);

    if (support == null) {
        return;
    }
    if( ws != null){
        ws.close();
    }

    console.log("* Connecting to server ..");

    ws = new window[support]('ws://127.0.0.1:50000/');

    ws.onmessage = function (evt) {
        var json = evt.data;

        console.log(json);
        if (json == ""){
            return
        }

        var data = JSON.parse(json);

        if( data["action"] == "message"){
			
			var message = data["data"];

			add_message(message);
			console.log('start');

        }
    };

    ws.onopen = function () {
        console.log('* Connection open');
        if( typeof callback != "undefined" ){
            callback("open");
        }
    };

    ws.onclose = function () {
        console.log('* Connection closed');
        if( typeof callback != "undefined" ){
            callback("close");
        }
    }
}

function disconnectWebSocket() {
    if (ws) {
        ws.close();
    }
    console.log("close");
}

function add_message(message){

	$("#_message").val(message);

}

function connect(){

    connectSocketServer(function(state){

        if( state == "open" ){
			console.log('Open');
        }
        else{
			console.log('Close');
        }
    });

}

function send_message(message){

	// var message = $("#_message_send").val();
	var time_str = get_time_str();

	var send = {
        "key": "PalmSecureService",
		"action": "Open",
		"message": message,
		"time": time_str
	};
    
    var send_str = JSON.stringify(send);
    
    ws.send(send_str);
    
	var self_msg = "[" + time_str + "] 送信:" + message;

	add_message(self_msg);
	console.log(self_msg);
}

function get_time_str(){

	var now = new Date();
	var y = now.getFullYear();
	var m = padding_zero(now.getMonth() + 1, 2);
	var d = padding_zero(now.getDate(), 2);
	var h = padding_zero(now.getHours(), 2);
	var i = padding_zero(now.getMinutes(), 2);
	var s = padding_zero(now.getSeconds(), 2);

	var ret = y + "/" + m + "/" + d + " " + h + ":" + i + ":" + s;

	return ret;
}

function padding_zero(src, len){
	return ("0" + src).slice(-len);
}

$(document).ready(function(){
	
	connect();

});