var f1= null;
var f2= null;
var x = 0;

function init(){
	
	window.addEventListener("message", receiveMessage, false);
	
	var strWindowFeatures = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes,width=500,heigth=50";
	f1 = window.open("f1.html", "f1", strWindowFeatures);
	f2 = window.open("f2.html", "f2", strWindowFeatures);
	
	//~ Weird but otherwise we cannot use f2 
	f3 =   windowObjectReference = window.open("http://www.google.fr", "f3", strWindowFeatures);
	f3.close();
	
	//~ Speak to the slaves so that they can know their master 
	f1.postMessage("MasterSpeaking","*");
	f2.postMessage("MasterSpeaking","*");
	
	
}

function receiveMessage(event){
	alert("MAITRE \nData : "+event.data+"\nSource : "+event.source+"\nOrigin : "+event.origin);
}
