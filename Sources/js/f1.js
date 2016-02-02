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


function changeChronoSize(param){
	document.getElementById("chronoZone").setAttribute("width",param);
}

function changeChronoHeigth(param){
	document.getElementById("chronoZone").style.height=param;
}


function onClickListChrono(value){
	master.postMessage("ListClickOn:"+value,"*");
}

function changeSVGContent(param){
	var zone = document.getElementById("chronoZone");
	zone.innerHTML =param;
}

function resize(){
	master.postMessage("F1Resize:"+document.body.clientWidth,"*");
}

function changeToTimeT(when){
	master.postMessage("ChangeToTime:"+when,"*");
}

function clickOnListDescending(where){
	master.postMessage("ClickOnListDescending:"+where,"*");
}
