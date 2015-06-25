var textSize = 15;

var selectWidth = 100;;
var totalWidth;

var varWidth = 100;
var valueWidth ;
var varHeigth = 40;

var background = "85,85,85";

var nBitsComplete = new Array();

function onClickListChrono(val){
	var options = document.getElementById("listChrono").querySelectorAll("option[value='"+val+"']")[0];
	var i = myChronoVariables.indexOf(val);
	var temp = new Array();
	if(i==-1){
		myChronoVariables.push(val);
		options.innerHTML = "*"+val;
	}
	else{
		options.innerHTML = val;
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

	selectWidth = 100;;
	totalWidth = document.body.clientWidth - selectWidth;
	document.getElementById("chronoZone").setAttribute("width",totalWidth);
	
	varWidth = 100;
	valueWidth = totalWidth-varWidth;
	varHeigth = 40;
	
	var totalHeigth = 0;

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
			//~ innerSVG += createRect(varWidth,y,valueWidth,varHeigth,background,0.5);
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
			
			var isExtended = nBitsComplete.indexOf(myChronoVariables[i]) != -1;
			var direction = " ▶";
			if(isExtended == true){
				direction =" ▼";
			}
			
			x = 0;
			innerSVG += createRect(x,y,varWidth,varHeigth);
			innerSVG += createClickableText(x+5,y+textSize+10,myChronoVariables[i]+direction,textSize,"coucou('"+myChronoVariables[i]+"');");
			//~ innerSVG += createRect(varWidth,y,valueWidth,varHeigth,background,0.5);
			
			x += varWidth;
			for(var myTime in myTableauTemps){
				myListeVariables.forEach(function(valeur,cle){
					if((valeur.scope+valeur.name)==myChronoVariables[i]){
						combien = valeur.afficheTempsA(myTableauTemps[myTime]);
					}
				},myListeVariables);
				innerSVG += createText(x+5,y+varHeigth/2,bin2hex(combien),textSize);
				x += individualWidth;
			}
			y += varHeigth;
	
			if(isExtended == true){			
				for(var k = 0;k<myLength;k++){
					x = 0;
					innerSVG += createRect(x,y,varWidth,varHeigth);
					innerSVG += createText(x+5,y+textSize+10,"☭ "+myChronoVariables[i]+"["+k+"]",textSize);
					//~ innerSVG += createRect(varWidth,y,valueWidth,varHeigth,background,0.5);
					
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

	}
	
	//~ Print the value changes
	innerSVG += createRect(varWidth,varHeigth,valueWidth,y-varHeigth,background,0.5);
	x=0;
	for(var i in myTableauTemps){
		innerSVG += createLine(x+varWidth+2.5,varHeigth,x+varWidth+2.5,y,undefinedColor);
		x += individualWidth;
	}
	
	document.getElementById("tdChronoZone").setAttribute("heigth",y);
	affiche(document.getElementById("tdChronoZone").getAttribute("heigth"));

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

function createClickableText(x,y,text,size,click){
	var toRet = "<text onclick=\""+click+"\" x=\""+x+"\" y=\""+y+"\" font-size=\""+size+"\" >"+text+"</text>";
	return toRet;
}

function createText(x,y,text,size){
	var toRet = "<text x=\""+x+"\" y=\""+y+"\" font-size=\""+size+"\" >"+text+"</text>";
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
	var zone = document.getElementById("chronoZone");
	zone.innerHTML =text;
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
	return toRet2;
}