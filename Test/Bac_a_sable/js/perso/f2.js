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
		var param = event.data.substring(event.data.indexOf(":"),event.data.length);
		changeSVGContent(param);
	}
	else{
		alert("F2\nData : "+event.data+"\nSource : "+event.source+"\nOrigin : "+event.origin);
	}
	//~ master.postMessage("Hello master f2","*");
}

function changeSVGContent(param){
	var zone = document.getElementById("drawingZone");
	zone.innerHTML = param;
}
