var master = null;

function init(){
	window.addEventListener("message", receiveMessage, false);
}

function receiveMessage(event){
	if(event.data == "MasterSpeaking"){
		master = event.source;
		master.postMessage("F1Width:"+document.body.clientWidth,"*");
		console.log("First Message from Master received");
		
		changeSVGContent("<rect x=\"0\" y=\"0\" width=\"500\" heigth=\"10\" />");
		
	}
	else if(event.data.contains("ChangeListSize")){
		var param = event.data.substring(event.data.indexOf(":")+1,event.data.length);
		changeListSize(param);
		console.log("Change list size to "+param+".");
	}
	else if(event.data.contains("ChangeListContent")){
		var param = event.data.substring(event.data.indexOf(":")+1,event.data.length);
		changeListContent(param);
		console.log("Change list content.");
	}
	else if(event.data.contains("ChangeOption")){
		var param = event.data.substring(event.data.indexOf(":")+1,event.data.length);
		changeOption(param);
		console.log("Change option.");
	}
	else if(event.data.contains("ChangeSVGContent")){
		var param = event.data.substring(event.data.indexOf(":")+1,event.data.length);
		changeSVGContent(param);
		console.log("Change SVG content.");
	}
	else if(event.data.contains("SetChronoZoneWidth")){
		var param = event.data.substring(event.data.indexOf(":")+1,event.data.length);
		changeChronoSize(param);
		console.log("Set the width of the chrono zone");
	}
	else if(event.data.contains("SetChronoZoneHeight")){
		var param = event.data.substring(event.data.indexOf(":")+1,event.data.length);
		changeChronoHeigth(param);
		console.log("Set the heigth of the chrono zone");
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

function changeChronoHeigth(param){
	document.getElementById("chronoZone").style.height=param;
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
