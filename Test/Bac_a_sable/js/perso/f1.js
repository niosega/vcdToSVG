var master = null;

function init(){
	window.addEventListener("message", receiveMessage, false);
}

function receiveMessage(event){
	if(event.data == "MasterSpeaking"){
		master = event.source;
		console.log("First Message from Master received");
		master.postMessage("F1Width:"+document.body.clientWidth,"*");
	}
	else if(event.data.contains("ChangeListSize")){
		var param = event.data.substring(event.data.indexOf(":")+1,event.data.length);
		changeListSize(param);
	}
	else if(event.data.contains("ChangeListContent")){
		var param = event.data.substring(event.data.indexOf(":")+1,event.data.length);
		changeListContent(param);
	}
	else if(event.data.contains("ChangeOption")){
		var param = event.data.substring(event.data.indexOf(":")+1,event.data.length);
		changeOption(param);
	}
	else if(event.data.contains("ChangeSVGContent")){
		var param = event.data.substring(event.data.indexOf(":")+1,event.data.length);
		changeSVGContent(param);
	}
	else if(event.data.contains("SetChronoZoneWidth")){
		var param = event.data.substring(event.data.indexOf(":")+1,event.data.length);
		changeChronoSize(param);
	}
	else{
		alert("F1\nData : "+event.data+"\nSource : "+event.source+"\nOrigin : "+event.origin);
	}
	//~ master.postMessage("Hello master f1","*");
}

function changeListSize(param){
	var zone = document.getElementById("listChrono");
	zone.size = param;
}

function changeChronoSize(param){
	document.getElementById("chronoZone").setAttribute("width",param);
}

function changeListContent(param){
	var zone = document.getElementById("listChrono");
	zone.innerHTML = param;
}

function onClickListChrono(value){
	master.postMessage("ListClickOn:"+value,"*");
}

function changeOption(value){
	var tempValue = value;
	if(value.contains("*")){
		tempValue = value.substring(1,value.length);
	}
	var options = document.getElementById("listChrono").querySelectorAll("option[value='"+tempValue+"']")[0];
	options.innerHTML = value;
}

function changeSVGContent(param){
	var zone = document.getElementById("chronoZone");
	zone.innerHTML =param;
}
