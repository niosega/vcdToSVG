function traite(vcd){
	var liste = new Array();
	//~ liste.push("ce");
	//~ liste.push("ma");
	[listeVariables,tableauTemps] = parse(vcd,liste);
	
	afficheMap(listeVariables);
	for(var i in tableauTemps){
		affiche("Temps : "+tableauTemps[i]);
		listeVariables.forEach(function(value,key){
			affiche(value.scope+value.name+" "+value.afficheTempsA(tableauTemps[i]));
		},listeVariables)
	}
	
	
}

function testSvg(vcd){
	//~ traite(vcd);
	var clientHeight = document.getElementById('svgPlace').clientHeight;
	var clientWidth = document.getElementById('svgPlace').clientWidth;
	var s = Snap("#svg");
	
	var g = s.group();
	var proc = Snap.load("processeur.svg", function ( loadedFragment ) {g.append( loadedFragment );} );
													
	var move = function(dx,dy) {
        this.attr({
                    transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]
                });
	}

	var start = function() {
			this.data('origTransform', this.transform().local );
	}
	
	var stop = function() {
			console.log('finished dragging');
	}												
	
	g.drag(move,start,stop);
	
	g.dblclick(onClickProc);
	
	
}

function onDoubleClickProc(){

}

function generateSVG(value){
	otherRect.attr({ height: value*10 , width: value*14});
}