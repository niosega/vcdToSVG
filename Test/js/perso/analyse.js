//~ Some common RGB values 
var rouge = "#ff0000";
var vert = "#00ff00";
var bleu = "#0000ff";
var rose = "#ff0088";

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

		[combien,myLength] = getValueForTime(value);
		
		for(var i = 1;i<allGNode.length;i++){
			var textContent = allGNode[i].childNodes[3].childNodes[0].childNodes[0].data;
			if(textContent[0]=="$"){
				var splitTextContent = textContent.substring(1,textContent.length-1).split(":");
					if(splitTextContent[0]==key){
						if(myLength==1){
							
							if(combien == 1 ){
								couleur=vert;
							}
							else if( combien ==0){
								couleur=rouge;
							}
							else if( combien == 'U'){
								couleur=bleu;
							}
							
							
				//~ /!\/!\/!\/!\			SI LE WIRE EST DESSINER AVANT LE TEXTE MARCHE PAS, DEPEND DE LORDRE DE CREATION SUR INKSCAPE   /!\/!\/!\/!\/!\
							
							
							
							//~ Change the color of the text
							var x = value.split(".");
							allGNode[i].childNodes[3].childNodes[0].childNodes[0].data = x[x.length-1];
							allGNode[i].childNodes[3].setAttribute("style","fill:"+couleur+";font-size:16px;font-style:normal;font-weight:normal;line-height:125%;letter-spacing:0px;word-spacing:0px;fill-opacity:1;stroke:none;font-family:Sans");
							//~ Change the color of the wire
							allGNode[i].childNodes[1].setAttribute("style","fill:none;stroke:"+couleur+";stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1");
						}
						else{
							
							if(combien.indexOf("U")!=-1){
								couleur=bleu;
								combien="";
							}
							else{
								couleur=rose;
								combien = ConvertBase.bin2hex(combien);
							}
							//~ Change the color of the text
							var x = value.split(".");
							allGNode[i].childNodes[3].childNodes[0].childNodes[0].data = x[x.length-1]+" "+combien;
							allGNode[i].childNodes[3].setAttribute("style","fill:"+couleur+";font-size:16px;font-style:normal;font-weight:normal;line-height:125%;letter-spacing:0px;word-spacing:0px;fill-opacity:1;stroke:none;font-family:Sans");
							//~ Change the color of the wire
							allGNode[i].childNodes[1].setAttribute("style","fill:none;stroke:"+couleur+";stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1");
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
	zone.innerHTML = text;
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