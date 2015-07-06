//~ Some common RGB values 
var zeroColor = "#ff0000"; //rouge
var oneColor = "#00dd00"; // vert
var undefinedColor = "#0000ff"; // bleu
var wireBitsColor = "#ff0088"; // rose
var valueBitsColor = "#003300"; // vert dégueu

var stateOfFiles = false;

//~ Called when the button "Generate !" is clicked
function main(){
	//~ If there is no files missing .
	stateOfFiles = myVCD != null && mySVG != null && myCOR != null ;
	if(stateOfFiles ==  true){
		traitement();
	}
	//~ If there is. 
	else{
		alert("Please add files ! ");
	}
}

//~ Call the VCD and SVG parser and begin the animation 
function traitement(){
	
	//~ Find the correspondance between SVG and VCD
	mySVGtoVCD = analyseCOR(myCOR); // svg:vcd
	
	//~ Create the list of animated variables (VCD names) 
	var list = new Array();
	mySVGtoVCD.forEach(function(value,key){
		list.push(value);
	},mySVGtoVCD);

	//~ Parse the VCD file according to the previous list 
	[myListeVariables,myTableauTemps] = parse(myVCD,list);
	
	//~ Change the size of listChrono
	changeSize(list);
	 
	//~ Ask to print the drawing at time 0 
	changeTime();
	
}

function changeSize(list){
	//~ Envoie la nouvelle taille de la liste 
	var toSend ="ChangeListSize:"+list.length; // TODO
	f1.postMessage(toSend,"*");
	
	//~ Envoie le nouveau contenu de la liste 
	toSend="ChangeListContent:"; // TODO
	for(var i in list){
		if(myChronoVariables.indexOf(list[i])==-1){
			toSend+="<option value="+list[i]+">"+list[i]+"</option>";
		}
		else{
			toSend+="<option value="+list[i]+">*"+list[i]+"</option>";
		}
	}	
	f1.postMessage(toSend,"*"); 
}


//~ Return the value of the variable with VHDL name given in parameters at time myTime 
function getValueForTime(nomVHDL){
	var combien = 0;
	var myLength = -1; 
	myListeVariables.forEach(function(valeur,cle){
		if((valeur.scope+valeur.name)==nomVHDL){
			combien = valeur.afficheTempsA(myTableauTemps[myTime]);
			myLength=valeur.length;
		}
	},myListeVariables);
	return [combien,myLength];
}

//~ Update the time zone and the drawing 
function changeTime(){

	//~ Update of the time zone 
	var zone = document.getElementById("time");
	zone.innerHTML = "Time : "+myTableauTemps[myTime];

	//~ Create an DOM representation of the SVG file, filtering only the <g></g> nodes 
	var svgParser = new DOMParser();
	svgParser = svgParser.parseFromString(mySVG, "image/svg+xml");	
	
	//~ Select all GNodes 
	var allGNode = svgParser.querySelectorAll("g[f2d='yes']");

	mySVGtoVCD.forEach(function(key,value){ // key = svg value = vcd
		//~ Temporary variables 
		var couleur = 0;
		var textIndex=0;
		var keyIndex=-1;
		var pathIndex= new Array();
		var combien=0;
		var myLength=0;
		
		//~ Get the key and the size for time value of the current variable
		[combien,myLength] = getValueForTime(key);

		//~ For all GNode 
		for(var i=0;i<allGNode.length;i++){
			pathIndex.length=0;
			
			for(var j in allGNode[i].childNodes){
				//~ If the childNode is a path then add it to the list 
				if(allGNode[i].childNodes[j].tagName=="path"){
					pathIndex.push(j);
				}
 				//~ If it is a textContent for the key of an n-bits varibles 
				else if(allGNode[i].childNodes[j].tagName=="text" && allGNode[i].childNodes[j].childNodes[0].childNodes[0].data=="#value#"){
					keyIndex=j;
				}
				//~ If it is a textContent containing the name of the variable
				else if(allGNode[i].childNodes[j].tagName=="text"){
					textIndex = j;
				}
			}

			//~  Get the text content of the node
			var textContent = allGNode[i].childNodes[textIndex].childNodes[0].childNodes[0].data;

			var splitTextContent = textContent.substring(1,textContent.length-1).split(":");
				if(splitTextContent[0]==value){		
					if(myLength==1){	
							//~ Select the right color depending on the key 
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
							var x = key.split(".");
							allGNode[i].childNodes[textIndex].childNodes[0].childNodes[0].data = x[x.length-1];
							allGNode[i].childNodes[textIndex].style.fill=couleur;
						}
					
					else{
						//~ Change the color of the wires
						for(var pI in pathIndex){
								allGNode[i].childNodes[pathIndex[pI]].style.stroke=wireBitsColor;
						}							
						//~ Change the color of the text
						var x = key.split(".");
						allGNode[i].childNodes[textIndex].childNodes[0].childNodes[0].data = x[x.length-1];
						allGNode[i].childNodes[textIndex].style.fill=wireBitsColor;
						//~ Change the key
						allGNode[i].childNodes[keyIndex].style.fill=valueBitsColor;
						allGNode[i].childNodes[keyIndex].childNodes[0].textContent = combien;
				}		
			}
		}
	},mySVGtoVCD);
	
	
	//~ Print to the SVG zone the computed SVG 
	var s = new XMLSerializer();
	var contenu = s.serializeToString(svgParser);
	afficheSVG(contenu);
}

//~ Print the text given in parameter into the SVG zone 
function afficheSVG(text){
	var toSend = "ChangeSVGContent:"+text; // TODO
	f2.postMessage(toSend,"*");
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

function changeToTimeT(val){
	if(val>=0 && val<=myTableauTemps.length-1){
		myTime = val;
		changeTime();
	}
}
