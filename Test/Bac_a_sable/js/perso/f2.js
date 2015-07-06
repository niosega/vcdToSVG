var master = null;

function init(){
	window.addEventListener("message", receiveMessage, false);
}

function receiveMessage(event){
	if(event.data == "MasterSpeaking"){
		master = event.source;
		console.log("First Message from Master received");
	}
	else if(event.data.contains("ChangeSVGContent")){
		
	}
	else{
		alert("F2\nData : "+event.data+"\nSource : "+event.source+"\nOrigin : "+event.origin);
	}
	//~ master.postMessage("Hello master f2","*");
}
