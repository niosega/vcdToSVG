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
	var myLocalSVG = mySVG;
	
	var zone = document.getElementById("time");
	zone.innerHTML = "Time : "+myTableauTemps[myTime];
	
	myVariableVisualisee.forEach(function(value,key){
		var nomVHDL = value;
		var combien = 0;
		myListeVariables.forEach(function(valeur,cle){
			if(valeur.name==nomVHDL){
				combien = valeur.afficheTempsA(myTableauTemps[myTime]);
				if(valeur.length>1){
					//~ combien = ConvertBase.bin2hex(combien);
					combien = -1;
				}
			}
		},myListeVariables);
		if(combien==0){
			myLocalSVG = myLocalSVG.replace(">$"+key+":"+value+"$","style=\"fill:"+rouge+"\">"+key);
		}
		else if(combien==1){
			myLocalSVG = myLocalSVG.replace(">$"+key+":"+value+"$","style=\"fill:"+vert+"\">"+key);
		}
		else if(combien=="U"){
			myLocalSVG = myLocalSVG.replace(">$"+key+":"+value+"$","style=\"fill:"+bleu+"\">"+key);
		}
		else{
			myLocalSVG = myLocalSVG.replace(">$"+key+":"+value+"$","style=\"fill:#FFC0CB\">"+key);
		}

	},myVariableVisualisee);
	
	afficheSVG(myLocalSVG);
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