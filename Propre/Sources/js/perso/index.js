//~ La variable représentant le contenu du fichier VCD
var myVCD = null;
//~ La variable représentant le contenu du fichier SVG
var mySVG = null;
//~ La variable représentant le contenu du fichier COR
var myCOR = null;
//~ La variable représentant le temps actuel
var myTime = 0; 
//~ La variable représentant les temps
var myTableauTemps = new Array();
//~ La variable représentant la liste des variables et leurs valeurs 
var myListeVariables = new Map();
//~ La variable représentant la liste des variables visualisées et leurs noms VHDL 
var myVariableVisualisee = new Map();
//~ La variable représentant la liste des correspondances nomSVG nomVCD
var mySVGtoVCD = new Map(); 
//~ La variable représentant la liste des variables visualisées dans les chronos
var myChronoVariables = new Array(); 
var f1= null;
var f2= null;

function init(){
	
	window.addEventListener("message", receiveMessage, false);
	
}

function receiveMessage(event){
	if(event.data == "GoToPreviousTime"){
		previousTime();
		console.log("Going to previous time.");
	}
	else if(event.data == "GoToNextTime"){
		nextTime();
		console.log("Going to next time.");
	}
	else if(event.data.contains("ChangeToTime")){
		var param = event.data.substring(event.data.indexOf(":")+1,event.data.length);
		changeToTimeT(param);
		console.log("Going to next time.");
	}
	else if(event.data.contains("ListClickOn")){
		var param = event.data.substring(event.data.indexOf(":")+1,event.data.indexOf("!"));
		var param2 = event.data.substring(event.data.indexOf("!")+1,event.data.length);
		changeListChrono(param,param2);
		console.log("onClickList event received.");
	}
	else if(event.data.contains("F1Width")){
		var param = event.data.substring(event.data.indexOf(":")+1,event.data.length);
		f1Width = param;
		console.log("f1 width received : "+param);
	}
	else if(event.data.contains("F1Resize")){
		var param = event.data.substring(event.data.indexOf(":")+1,event.data.length);
		f1Width = param;
		resize();
		console.log("f1 width received : "+param);
	}
	else{
		alert("MAITRE \nData : "+event.data+"\nSource : "+event.source+"\nOrigin : "+event.origin);
	}
}

//~ Ce qu'il se passe à l'ouverture du fichier VCD
function openVCDFile(event){
	//~ alert("VCD opened");
	var input = event.target;
	var reader = new FileReader();
	
	var file = input.files[0];
	
	var toDoOnLoad = function(){
		myVCD = reader.result;
	};
	
	var toDoOnLoadStart = function(){

	}
	
	var toDoOnProgress = function(){
		
	}
	
	reader.onload = toDoOnLoad;
	reader.onloadstart=toDoOnLoadStart;
	reader.onprogress= toDoOnProgress;
	
	reader.readAsText(file);
	
}

//~ Ce qu'il se passe à l'ouverture du fichier SVG 
function openSVGFile(event){
	//~ alert("SVG opened");
	var input = event.target;
	var reader = new FileReader();
	
	var file = input.files[0];
	
	var toDoOnLoad = function(){
		  mySVG = reader.result;
	};
	
	var toDoOnLoadStart = function(){

	}
	
	var toDoOnProgress = function(){
		
	}
	
	reader.onload = toDoOnLoad;
	reader.onloadstart=toDoOnLoadStart;
	reader.onprogress= toDoOnProgress;
	
	reader.readAsText(file);
}

//~ Ce qu'il se passe à l'ouverture du fichier COR 
function openCORFile(event){
	var input = event.target;
	var reader = new FileReader();
	
	var file = input.files[0];
	
	var toDoOnLoad = function(){
		  myCOR = reader.result;
	};
	
	var toDoOnLoadStart = function(){

	}
	
	var toDoOnProgress = function(){
		
	}
	
	reader.onload = toDoOnLoad;
	reader.onloadstart=toDoOnLoadStart;
	reader.onprogress= toDoOnProgress;
	
	reader.readAsText(file);
}

//~ Ce qu'il se passe quand on clique sur le bouton 
function onClickButton(){
	
	stateOfFiles = myVCD != null && mySVG != null && myCOR != null ;
	//~ If there is no file missing 
	if(stateOfFiles ==  true){
		//~ Opening slaves windows 
		var strWindowFeatures = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes,width=500,heigth=50";
		f1 = window.open("f1.html", "f1", strWindowFeatures);
		f2 = window.open("f2.html", "f2", strWindowFeatures);
		
		//~ Weird but otherwise we cannot use f2 
		f3 = window.open("http://www.google.fr", "f3", strWindowFeatures);
		f3.close();
		
		//~ Speak to the slaves so that they can know their master 
		f1.postMessage("MasterSpeaking","*");
		f2.postMessage("MasterSpeaking","*");
		
		traitement();
		createChrono();
	}
	//~ If there is. 
	else{
		alert("Please add files ! ");
	}
}
