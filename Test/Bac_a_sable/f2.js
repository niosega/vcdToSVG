var master = null;

function init(){
	window.addEventListener("message", receiveMessage, false);
}

function receiveMessage(event){
	if(event.data == "MasterSpeaking"){
		master = event.source;
	}
	else if(event.data == "F1Speaking"){
		f1 = event.source;
	}
	else{
		alert("F2\nData : "+event.data+"\nSource : "+event.source+"\nOrigin : "+event.origin);
	}
	master.postMessage("Hello master f2","*");
}
