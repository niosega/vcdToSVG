var textSize = 15;

var selectWidth = 100;
var totalWidth;

var varWidth = 100;
var valueWidth ;
var varHeigth = 40;

var background = "85,85,85";
var valueColor = "#cc6600";

var f1Width = -1;

var nBitsComplete = new Array();

function onClickListChrono(val){
	var i = myChronoVariables.indexOf(val);
	var temp = new Array();
	if(i==-1){
		myChronoVariables.push(val);
		f1.postMessage("ChangeOption:*"+val,"*");
	}
	else{
		f1.postMessage("ChangeOption:"+val,"*");
		for(var x in myChronoVariables){
			if(x!=i){
				temp.push(myChronoVariables[x]);
			}
		}
		myChronoVariables=null;
		myChronoVariables=temp;
	}
	createChrono();
}

function createChrono(){
	var innerSVG = "";
	textSize = 15;

	selectWidth = 100;

	//~ totalWidth = document.body.clientWidth;
	totalWidth = f1Width;
	
	//~ document.getElementById("chronoZone").setAttribute("width",totalWidth);
	f1.postMessage("SetChronoZoneWidth:"+totalWidth,"*");
		
	//~ document.getElementById("gauche").style.width= 73;
	
	
	//~ document.getElementById("droite").style.width= totalWidth;
	
	varWidth = 100;
	valueWidth = totalWidth-varWidth;
	varHeigth = 40;
	
	var totalHeigth = 0;

	var x=0;
	var y=0;
	
	//~ Print the time line 
	innerSVG += createRect(x,y,varWidth,varHeigth);
	innerSVG += createClickableText(x+5,y+textSize+10,"TIME",textSize,"changeToTimeT('"+1+"');");

	var individualWidth = valueWidth/myTableauTemps.length;
	innerSVG += createRect(varWidth,0,valueWidth,varHeigth);
	for(var i in myTableauTemps){
		innerSVG += createClickableText(x+varWidth+5,y+textSize+10,myTableauTemps[i],textSize,"changeToTimeT('"+i+"');");
		x += individualWidth;
	}
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
		
		innerSVG += createDash(varWidth,12+y+varHeigth/2,varWidth+totalWidth,12+y+varHeigth/2,undefinedColor);
		
		if(myLength==1){
			innerSVG += createRect(x,y,varWidth,varHeigth);
			innerSVG += createText(x+5,y+textSize+10,myChronoVariables[i],textSize);
			x += varWidth;
			for(var myTime in myTableauTemps){
				myListeVariables.forEach(function(valeur,cle){
					if((valeur.scope+valeur.name)==myChronoVariables[i]){
						combien = valeur.afficheTempsA(myTableauTemps[myTime]);
					}
				},myListeVariables);
				if(combien == 1){
					innerSVG += createLine(x+5,-12+y+varHeigth/2,x+individualWidth,-12+y+varHeigth/2,oneColor);
				}
				else if(combien == 0 ){
					innerSVG += createLine(x+5,12+y+varHeigth/2,x+individualWidth,12+y+varHeigth/2,oneColor);
				}
				else{
					innerSVG += createLine(x+5,-12+y+varHeigth/2,x+individualWidth,-12+y+varHeigth/2,zeroColor);
					innerSVG += createLine(x+5,12+y+varHeigth/2,x+individualWidth,12+y+varHeigth/2,zeroColor);
					innerSVG += createText(x+5,y+textSize+10,"U",textSize,valueColor);
				}
				x += individualWidth;
			}
			y += varHeigth;
		}
		else{
			
			var isExtended = nBitsComplete.indexOf(myChronoVariables[i]) != -1;
			var direction = " ▶";
			if(isExtended == true){
				direction =" ▼";
			}
			
			x = 0;
			innerSVG += createRect(x,y,varWidth,varHeigth);
			innerSVG += createClickableText(x+5,y+textSize+10,myChronoVariables[i]+direction,textSize,"coucou('"+myChronoVariables[i]+"');");
			
			x += varWidth;
			for(var myTime in myTableauTemps){
				myListeVariables.forEach(function(valeur,cle){
					if((valeur.scope+valeur.name)==myChronoVariables[i]){
						combien = valeur.afficheTempsA(myTableauTemps[myTime]);
					}
				},myListeVariables);
				innerSVG += createText(x+5,y+varHeigth/2,bin2hex(combien),textSize,valueColor);
				x += individualWidth;
			}
			y += varHeigth;
	
			if(isExtended == true){	
				for(var k = 0;k<myLength;k++){
					innerSVG += createDash(varWidth,12+y+varHeigth/2,varWidth+totalWidth,12+y+varHeigth/2,undefinedColor);		
					x = 0;
					innerSVG += createRect(x,y,varWidth,varHeigth);
					innerSVG += createText(x+5,y+textSize+10,"☭ "+myChronoVariables[i]+"["+k+"]",textSize);
					
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
							innerSVG += createLine(x+5,12+y+varHeigth/2,x+individualWidth,12+y+varHeigth/2,oneColor);
						}
						else{
							innerSVG += createLine(x+5,-12+y+varHeigth/2,x+individualWidth,-12+y+varHeigth/2,zeroColor);
							innerSVG += createLine(x+5,12+y+varHeigth/2,x+individualWidth,12+y+varHeigth/2,zeroColor);
							innerSVG += createText(x+5,y+textSize+10,"U",textSize,valueColor);
						}
						x += individualWidth;
					}
					y += varHeigth;
				}	
			}
		}

	}
	

	innerSVG += createRect(varWidth,varHeigth,valueWidth,y-varHeigth,background,0.5);
	x=0;
	for(var i in myTableauTemps){
		innerSVG += createDash(x+varWidth+2.5,varHeigth,x+varWidth+2.5,y,undefinedColor);
		x += individualWidth;
	}
	
	//~ document.getElementById("chronoZone").style.height=y;
	//~ document.getElementById("all").style.height=y;

	printChrono(innerSVG);
}

function createNBVariable(){
	
	return innerSVG;
}

function create1BVariable(name,myTime,textSize,x,y){

	return innerSVG;
}

function createDash(x,y,dx,dy,color){
	var toRet = " <line x1=\""+x+"\" y1=\""+y+"\" x2=\""+dx+"\" y2=\""+dy+"\" style=\"stroke:"+color+";stroke-width:1;stroke-dasharray: 2, 2\" />";
	return toRet;
}

function createLine(x,y,dx,dy,color){
	var toRet = " <line x1=\""+x+"\" y1=\""+y+"\" x2=\""+dx+"\" y2=\""+dy+"\" style=\"stroke:"+color+";stroke-width:2\" />";
	return toRet;
}

function createClickableText(x,y,text,size,click){
	var toRet = "<text onclick=\""+click+"\" x=\""+x+"\" y=\""+y+"\" font-size=\""+size+"\" >"+text+"</text>";
	return toRet;
}

function createRegulatedText(x,y,text,size,maxSize,color="#000000"){
	var toRet = "<text x=\""+x+"\" y=\""+y+"\" font-size=\""+size+"\" style=\"fill:"+color +"\" textLength=\""+ maxSize+ "\"  >"+text+"</text>";
	return toRet;
}

function createText(x,y,text,size,color="#000000"){
	var toRet = "<text x=\""+x+"\" y=\""+y+"\" font-size=\""+size+"\" style=\"fill:"+color +"\">"+text+"</text>";
	return toRet;
}

function createClickableRect(x,y,dx,dy,click,fill="255,255,255",opacity="0.0"){
	var toRet = "<rect onclick=\""+click+"\"x=\""+x+"\" y=\""+y+"\" width=\""+dx+"\" height=\""+dy+"\" style=\" fill:rgb("+fill+");stroke-width:3;stroke:rgb(0,0,0);fill-opacity:"+opacity+"\" />";
	return toRet;
}

function createRect(x,y,dx,dy,fill="255,255,255",opacity="0.0"){
	var toRet = "<rect x=\""+x+"\" y=\""+y+"\" width=\""+dx+"\" height=\""+dy+"\" style=\" fill:rgb("+fill+");stroke-width:3;stroke:rgb(0,0,0);fill-opacity:"+opacity+"\" />";
	return toRet;
}

//~ Print the text given in parameter into the chrono zone
function printChrono(text){
	f1.postMessage("ChangeSVGContent:"+text,"*");
}

function coucou(val){
	affiche(val);
	var i = nBitsComplete.indexOf(val);
	var temp = new Array();
	if(i==-1){
		nBitsComplete.push(val);
	}
	else{
		for(var x in nBitsComplete){
			if(x!=i){
				temp.push(nBitsComplete[x]);
			}
		}
		nBitsComplete=null;
		nBitsComplete=temp;
	}
	createChrono();
}

function bin2hex(val){
	var toRet ="";
	for(var i=val.length;i>=0;i=i-4){
		var temp = val.substring(i-4,i);
		if(temp.indexOf("U")!=-1){
			toRet += "U"
		}
		else if(temp==""){}
		else{
			toRet += ConvertBase.bin2hex(temp);
		}
	}
	
	var toRet2="";
	for(var i =toRet.length-1;i>=0;i--){
		toRet2 += toRet[i];
	}
	return toRet2.toUpperCase();
}

function resize(){
	if(stateOfFiles == true){
		createChrono();
	}
}
