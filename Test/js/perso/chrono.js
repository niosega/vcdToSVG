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
	var svgElement = document.getElementById("drawing")
	
	var boudingRect = document.getElementById("chronoZone").getBoundingClientRect();
	var totalWidth = boudingRect.width;
	var varWidth = 100;
	var valueWidth = totalWidth-varWidth;
	var varHeigth = 40;

	var x=0;
	var y=0;

	for(var i in myChronoVariables){
		affiche(i);
		innerSVG += createRect(x,y,varWidth,varHeigth);
		y += varHeigth;
	}
	
	printChrono(innerSVG);
}

function createRect(x,y,dx,dy){
	var toRet = "<rect x=\""+x+"\" y=\""+y+"\" width=\""+dx+"\" height=\""+dy+"\" style=\" fill:rgb(255,255,255);stroke-width:3;stroke:rgb(0,0,0) \" />";
	return toRet;
}

//~ Print the text given in parameter into the chrono zone
function printChrono(text){
	var zone = document.getElementById("chronoZone");
	zone.innerHTML =text;
}