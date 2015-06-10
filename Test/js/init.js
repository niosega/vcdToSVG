var mySlider;

function openFile(event) {
				
	var input = event.target;
	var reader = new FileReader();
	
	var file = input.files[0];
	
	var toDoOnLoad = function(){
		  var text = reader.result;
		  traite(text);
	};
	
	var toDoOnLoadStart = function(){
		clear();
	}
	
	var toDoOnProgress = function(){
		
	}
	
	reader.onload = toDoOnLoad;
	reader.onloadstart=toDoOnLoadStart;
	reader.onprogress= toDoOnProgress;
	
	reader.readAsText(file);
	
}
			
function doOnLoad(){
			
	mySlider = new dhtmlXSlider("slider");
	
	mySlider.attachEvent("onChange", function(value){

	});
	
	mySlider.attachEvent("onSlideEnd", function(value){
		console.log("Valeur slider : "+value);
	});
}

function doOnUnload(){
	if (mySlider != null){
		mySlider.unload();
		mySlider = null;
	}
}