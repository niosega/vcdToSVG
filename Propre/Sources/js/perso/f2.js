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
		var param = event.data.substring(event.data.indexOf(":")+1,event.data.length);
		changeSVGContent(param);
		console.log("Change SVG content.");
	}
	else if(event.data.contains("ChangeTime")){
		var zone = document.getElementById("time");
		var param = event.data.substring(event.data.indexOf(":")+1,event.data.length);
		zone.innerHTML = param;
		console.log("Change the time");
	}
	else{
		alert("F2\nData : "+event.data+"\nSource : "+event.source+"\nOrigin : "+event.origin);
	}
	//~ master.postMessage("Hello master f2","*");
}

function changeSVGContent(param){
	var zone = document.getElementById("drawing");
	zone.innerHTML = param;
}

function previousTime(){
	master.postMessage("GoToPreviousTime","*");
}

function nextTime(){
	master.postMessage("GoToNextTime","*");
}

function animateChrono(value,key){
	master.postMessage("ListClickOn:"+value+"!"+key,"*");
}
