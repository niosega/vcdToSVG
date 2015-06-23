var textSize = 15;

var selectWidth = 100;;
var totalWidth;

var varWidth = 100;
var valueWidth ;
var varHeigth = 40;

function onClickListChrono(val){
	var i = myChronoVariables.indexOf(val);
	var temp = new Array();
	if(i==-1){
		myChronoVariables.push(val);
	}
	else{
		for(var x in myChronoVariables){
			if(x!=i){
				temp.push(myChronoVariables[x]);
			}
		}
		myChronoVariables=null;
		myChronoVariables=temp;
	}
	affiche(myChronoVariables);
}

function createChrono(){
	var innerSVG = "";
	textSize = 15;

	selectWidth = 100;;
	totalWidth = document.body.clientWidth - selectWidth;
	document.getElementById("chronoZone").setAttribute("width",totalWidth);
	
	varWidth = 100;
	valueWidth = totalWidth-varWidth;
	varHeigth = 40;

	var x=0;
	var y=0;
	
	//~ Print the time line 
	innerSVG += createRect(x,y,varWidth,varHeigth);
	innerSVG += createText(x+5,y+textSize+10,"TIME",textSize);

	var individualWidth = valueWidth/myTableauTemps.length;
	for(var i in myTableauTemps){
		innerSVG += createText(x+varWidth+5,y+textSize+10,myTableauTemps[i],textSize);
		x += individualWidth;
	}
	innerSVG += createRect(varWidth,0,valueWidth,varHeigth);
	y += varHeigth;
	
	//~ Print the name of the variables
	for(var i in myChronoVariables){
		x = 0;
		var myLength = -1;
		var combien = -1;
		myListeVariables.forEach(function(valeur,cle){
			if((valeur.scope+valeur.name)==myChronoVariables[i]){
				myLength=valeur.length;
			}
		},myListeVariables);
		
		if(myLength==1){
			innerSVG += createRect(x,y,varWidth,varHeigth);
			innerSVG += createText(x+5,y+textSize+10,myChronoVariables[i],textSize);
			innerSVG += createRect(varWidth,y,valueWidth,varHeigth);
			x += varWidth;
			for(var myTime in myTableauTemps){
				myListeVariables.forEach(function(valeur,cle){
					if((valeur.scope+valeur.name)==myChronoVariables[i]){
						combien = valeur.afficheTempsA(myTableauTemps[myTime]);
					}
				},myListeVariables);
				//~ innerSVG += createText(x+5,y+textSize+10,combien,textSize);
				if(combien == 1){
					innerSVG += createLine(x+5,-12+y+varHeigth/2,x+individualWidth,-12+y+varHeigth/2,oneColor);
				}
				else if(combien == 0 ){
					innerSVG += createLine(x+5,12+y+varHeigth/2,x+individualWidth,12+y+varHeigth/2,zeroColor);
				}
				else{
					innerSVG += createLine(x+5,y+varHeigth/2,x+individualWidth,y+varHeigth/2,undefinedColor);
				}
				x += individualWidth;
			}
			y += varHeigth;
		}
		else{
								
			for(var k = 0;k<myLength;k++){
				x = 0;
				innerSVG += createRect(x,y,varWidth,varHeigth);
				innerSVG += createText(x+5,y+textSize+10,myChronoVariables[i]+"["+k+"]",textSize);
				innerSVG += createRect(varWidth,y,valueWidth,varHeigth);
				
				x += varWidth;
				for(var myTime in myTableauTemps){
					myListeVariables.forEach(function(valeur,cle){
						if((valeur.scope+valeur.name)==myChronoVariables[i]){
							combien = valeur.afficheTempsA(myTableauTemps[myTime]);
						}
					},myListeVariables);
					combien = combien[k];
					if(combien == 1){
						innerSVG += createLine(x+5,-12+y+varHeigth/2,x+individualWidth,-12+y+varHeigth/2,oneColor);
					}
					else if(combien == 0 ){
						innerSVG += createLine(x+5,12+y+varHeigth/2,x+individualWidth,12+y+varHeigth/2,zeroColor);
					}
					else{
						innerSVG += createLine(x+5,y+varHeigth/2,x+individualWidth,y+varHeigth/2,undefinedColor);
					}
					x += individualWidth;
				}
				y += varHeigth;
			}	
		}

	}
	
	//~ Print the value changes
	
	 
	printChrono(innerSVG);
}

function createNBVariable(){
	
	return innerSVG;
}

function create1BVariable(name,myTime,textSize,x,y){

	return innerSVG;
}

function createLine(x,y,dx,dy,color){
	var toRet = " <line x1=\""+x+"\" y1=\""+y+"\" x2=\""+dx+"\" y2=\""+dy+"\" style=\"stroke:"+color+";stroke-width:2\" />";
	return toRet;
}

function createText(x,y,text,size){
	var toRet = "<text x=\""+x+"\" y=\""+y+"\" font-size=\""+size+"\" >"+text+"</text>";
	return toRet;
}

function createRect(x,y,dx,dy){
	var toRet = "<rect x=\""+x+"\" y=\""+y+"\" width=\""+dx+"\" height=\""+dy+"\" style=\" fill:rgb(255,255,255);stroke-width:3;stroke:rgb(0,0,0);fill-opacity:0.0 \" />";
	return toRet;
}

//~ Print the text given in parameter into the chrono zone
function printChrono(text){
	var zone = document.getElementById("chronoZone");
	zone.innerHTML =text;
}