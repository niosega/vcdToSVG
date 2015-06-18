function traite(vcd){
	var liste = new Array();
	//~ liste.push("ce");
	//~ liste.push("ma");
	[listeVariables,tableauTemps] = parse(vcd,liste);
	
	var compteur=0;
	
	afficheMap(listeVariables);
	for(var i in tableauTemps){
		compteur=0;
		affiche("\nTemps : "+tableauTemps[i]);
		listeVariables.forEach(function(value,key){
			affiche(value.scope+value.name+" "+value.afficheTempsA(tableauTemps[i]));
			compteur++;
		},listeVariables)
		affiche("\nCOMPTEUR : "+compteur+"\n");
	}
	

	var zone = document.getElementById("secondSVG");
	fontSize=20;
	zone.innerHTML = "";
	var j=0;
	for(var i in tableauTemps){
		j=0;
		zone.innerHTML+= "<text x=\"10\" y="+(60+(i*fontSize)*1.1)+" font-size="+fontSize+">"+tableauTemps[i]+"</text>";	
		listeVariables.forEach(function(value,key){
			if(i==0){
				zone.innerHTML+="<text x="+(200*j+80)+" y="+30+" font-size="+fontSize+">"+value.scope+value.name+"</text>";	
			}
			zone.innerHTML+="<text x="+(200*j+80)+" y="+(60+(i*fontSize)*1.1)+" font-size="+(fontSize-10)+">"+value.afficheTempsA(tableauTemps[i])+"</text>";	
			j++;	
		},listeVariables)
	}

}


function testSvg(vcd){
	traite(vcd);
	var clientHeight = document.getElementById('svgPlace').clientHeight;
	var clientWidth = document.getElementById('svgPlace').clientWidth;
	//~ var s = Snap("#svg");
	//~ 
	//~ var g = s.group();
	//~ var proc = Snap.load("processeur.svg", function ( loadedFragment ) {g.append( loadedFragment );} );
													//~ 
	//~ var move = function(dx,dy) {
        //~ this.attr({
                    //~ transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]
                //~ });
	//~ }
//~ 
	//~ var start = function() {
			//~ this.data('origTransform', this.transform().local );
	//~ }
	//~ 
	//~ var stop = function() {
			//~ console.log('finished dragging');
	//~ }												
	//~ 
	//~ g.drag(move,start,stop);
	//~ 
	//~ g.dblclick(onDoubleClickProc);
	
	
}

function onDoubleClickProc(){
	//~ var zone = document.getElementById("secondSVG");
	//~ zone.innerHTML = "<rect x=\"10\" y=\"10\" width=\"100\" height=\"100\"/>";
}

function generateSVG(value){
	//~ otherRect.attr({ height: value*10 , width: value*14});
}