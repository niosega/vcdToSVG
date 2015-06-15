var rouge = "#ff0000";
var vert = "#00ff00";
var bleu = "#0000ff";


function main(){
	if(myVCD != null && mySVG != null){
		traitement();
	}
	else{
		alert("Please add files ! ");
	}
}

function traitement(){
		
	var liste = new Array();
	myVariableVisualisee = analyseSVG(mySVG);
	myVariableVisualisee.forEach(function(value,key){
		liste.push(value);
	},myVariableVisualisee);


	[myListeVariables,myTableauTemps] = parse(myVCD,liste);
	changeTime();
	
}


function changeTime(){

	var zone = document.getElementById("time");
	zone.innerHTML = "Time : "+myTableauTemps[myTime];

	var svgParser = new DOMParser();
	svgParser = svgParser.parseFromString(mySVG, "image/svg+xml");	
	var allGNode = svgParser.querySelectorAll("g");
	
	myVariableVisualisee.forEach(function(value,key){
		
		var myLenght = 0; 
		var couleur = 0;
		
		var nomVHDL = value;
		var combien = 0;
		myListeVariables.forEach(function(valeur,cle){
			if(valeur.name==nomVHDL){
				combien = valeur.afficheTempsA(myTableauTemps[myTime]);
				if(valeur.length>1){
					//~ combien = ConvertBase.bin2hex(combien);
					combien = -1;
				}
				myLength=valeur.length;
			}
		},myListeVariables);
		
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
							//~ Changement de couleur texte 
							allGNode[i].childNodes[3].childNodes[0].childNodes[0].data = value;
							allGNode[i].childNodes[3].setAttribute("style","fill:"+couleur+";font-size:16px;font-style:normal;font-weight:normal;line-height:125%;letter-spacing:0px;word-spacing:0px;fill-opacity:1;stroke:none;font-family:Sans");
							//~ Changement de couleur trait
							allGNode[i].childNodes[1].setAttribute("style","fill:none;stroke:"+couleur+";stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1");
						
						}
						else{
							
						}
					}		
			}
		}
		
	},myVariableVisualisee);
	
	var s = new XMLSerializer();
	var contenu = s.serializeToString(svgParser);
	afficheSVG(contenu);
}

function afficheSVG(text){
	var zone = document.getElementById("secondSVG");
	zone.innerHTML = text;
}

function nextTime(){
	myTime++;
	if(myTime>myTableauTemps.length-1){
		myTime = myTableauTemps.length-1;
	}
	changeTime();
}

function previousTime(){
	myTime--;
	if(myTime<0){
		myTime = 0;
	}
	changeTime();
}