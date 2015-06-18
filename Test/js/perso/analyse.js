//~ Some common RGB values 
var zeroColor = "#ff0000"; //rouge
var oneColor = "#00dd00"; // vert
var undefinedColor = "#0000ff"; // bleu
var wireBitsColor = "#ff0088"; // rose
var valueBitsColor = "#003300";

//~ Called when the button "Generate !" is clicked
function main(){
	//~ If there is no files missing .
	if(myVCD != null && mySVG != null){
		traitement();
	}
	//~ If there is. 
	else{
		alert("Please add files ! ");
	}
}

function traitement(){
	
	//~ Read the SVG file
	//~ Find the variables that must be animated ( put into myVariableVisualisee )
	//~ Add the variables into a list for VCD parsing 
	var liste = new Array();
	myVariableVisualisee = analyseSVG(mySVG);
	myVariableVisualisee.forEach(function(value,key){
		liste.push(value);
	},myVariableVisualisee);


	//~ Parse the VCD file according to the previous list 
	[myListeVariables,myTableauTemps] = parse(myVCD,liste);
	
	//~ Ask to print the drawing at time 0 
	changeTime();
	
}

//~ Return the value of the variable with VHDL name given in parameters at time myTime 
function getValueForTime(nomVHDL){
	var combien = 0;
	var myLength = 0; 
	myListeVariables.forEach(function(valeur,cle){
		if((valeur.scope+valeur.name)==nomVHDL){
			combien = valeur.afficheTempsA(myTableauTemps[myTime]);
			myLength=valeur.length;
		}
	},myListeVariables);
	return [combien,myLength];
}

function changeTime(){

	//~ Update of the time zone 
	var zone = document.getElementById("time");
	zone.innerHTML = "Time : "+myTableauTemps[myTime];

	//~ Create an DOM representation of the SVG file, filtering only the <g></g> nodes 
	var svgParser = new DOMParser();
	svgParser = svgParser.parseFromString(mySVG, "image/svg+xml");	
	var allGNode = svgParser.querySelectorAll("g");

	myVariableVisualisee.forEach(function(value,key){
		var couleur = 0;
		var textIndex=0;

		var valueIndex=-1;
		var pathIndex= new Array();
		var combien=0;
		var myLength=0;
		[combien,myLength] = getValueForTime(value);

		for(var i = 1;i<allGNode.length;i++){

			pathIndex.length=0;
			
			for(var j in allGNode[i].childNodes){
				if(allGNode[i].childNodes[j].tagName=="path"){
					pathIndex.push(j);
				}
 					
				else if(allGNode[i].childNodes[j].tagName=="text" && allGNode[i].childNodes[j].childNodes[0].childNodes[0].data=="#value#"){
					valueIndex=j;
				}
				else if(allGNode[i].childNodes[j].tagName=="text"){
					textIndex = j;
				}
			}

			var textContent = allGNode[i].childNodes[textIndex].childNodes[0].childNodes[0].data;

			if(textContent[0]=="$"){

				var splitTextContent = textContent.substring(1,textContent.length-1).split(":");
				
					if(splitTextContent[0]==key){				
						if(myLength==1){	
								if(combien == 1 ){
									couleur=oneColor;
								}
								else if( combien ==0){
									couleur=zeroColor;
								}
								else if( combien == 'U'){
									couleur=undefinedColor;
								}		
								//~ Change the color of the wires
								for(var pI in pathIndex){
									allGNode[i].childNodes[pathIndex[pI]].style.stroke=couleur;
								}
								//~ Change the color of the text
								var x = value.split(".");
								allGNode[i].childNodes[textIndex].childNodes[0].childNodes[0].data = x[x.length-1];
								allGNode[i].childNodes[textIndex].style.fill=couleur;
							}
						
						else{
							//~ Change the color of the wires
							for(var pI in pathIndex){
									allGNode[i].childNodes[pathIndex[pI]].style.stroke=wireBitsColor;
							}							
							//~ Change the color of the text
							var x = value.split(".");
							allGNode[i].childNodes[textIndex].childNodes[0].childNodes[0].data = x[x.length-1];
							allGNode[i].childNodes[textIndex].style.fill=wireBitsColor;
							//~ Change the value
							allGNode[i].childNodes[valueIndex].style.fill=valueBitsColor;
							allGNode[i].childNodes[valueIndex].childNodes[0].textContent = combien;
					}		
				}
			}
		}
	},myVariableVisualisee);
	
	
	//~ Print to the SVG zone the computed SVG 
	var s = new XMLSerializer();
	var contenu = s.serializeToString(svgParser);
	afficheSVG(contenu);
}

//~ Print the text given in parameter into the SVG zone 
function afficheSVG(text){
	var zone = document.getElementById("secondSVG");
	zone.innerHTML =text;
}

//~ Increase the position in the time-array and ask to print the new drawing 
function nextTime(){
	if(myTime<myTableauTemps.length-1){
		myTime++;
		changeTime();
	}
}

//~ Decrease the position in the time-array and ask to print the new drawing 
function previousTime(){
	if(myTime>0){
		myTime--;
		changeTime();
	}
}
