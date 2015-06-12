//~ La variable représentant le slider 
var mySlider = null;
//~ La variable représentant le contenu du fichier VCD
var myVCD = null;
//~ La variable représentant le contenu du fichier SVG
var mySVG = null;
//~ La variable représentant le temps actuel
var myTime = 0; 
//~ La variable représentant les temps
var myTableauTemps = new Array();
//~ La variable représentant la liste des variables et leurs valeurs 
var myListeVariables = new Map();
//~ La variable représentant la liste des variables visualisées et leurs noms VHDL 
var myVariableVisualisee = new Map();


//~ Ce qu'il se passe à l'ouverture du fichier VCD
function openVCDFile(event){
	//~ alert("VCD opened");
	var input = event.target;
	var reader = new FileReader();
	
	var file = input.files[0];
	
	var toDoOnLoad = function(){
		myVCD = reader.result;
		//~ Appel à la fonction de parsing VCD 
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

//~ Ce qu'il se passe à l'ouverture de la page 
function doOnLoad(){
	clear();
	mySlider = new dhtmlXSlider("slider");
	
	mySlider.attachEvent("onChange", function(value){

	});
	
	mySlider.attachEvent("onSlideEnd", function(value){
		console.log("Valeur slider : "+value);

	});
	
	
}

//~ Ce qu'il se passe à la fermeture de la page
function doOnUnload(){
	if (mySlider != null){
		mySlider.unload();
		mySlider = null;
	}
}

//~ Ce qu'il se passe quand on clique sur le bouton 
function onClickButton(){
	main();
}