var mySlider;

//~ Ce qu'il se passe à l'ouverture du fichier
function openFile(event) {
				
	var input = event.target;
	var reader = new FileReader();
	
	var file = input.files[0];
	
	var toDoOnLoad = function(){
		  var text = reader.result;
		  testSvg(text);
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
		generateSVG(value);
	});
	
	mySlider.attachEvent("onSlideEnd", function(value){
		console.log("Valeur slider : "+value);
		//~ generateSVG(value);
	});
	
	
}

//~ Ce qu'il se passe à la fermeture de la page
function doOnUnload(){
	if (mySlider != null){
		mySlider.unload();
		mySlider = null;
	}
}