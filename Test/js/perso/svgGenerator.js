function traite(vcd){
	var liste = new Array();
	liste.push("ce");
	liste.push("ma[7:0]");
	[listeVariables,tableauTemps] = parse(vcd,liste);
	
	afficheMap(listeVariables);
	for(var i in tableauTemps){
		affiche("Temps : "+tableauTemps[i]);
		listeVariables.forEach(function(value,key){
			affiche(value.scope+value.name+" "+value.afficheTempsA(tableauTemps[i]));
		},listeVariables)
	}
	
	
}

function testSvg(){
	var clientHeight = document.getElementById('svgPlace').clientHeight;
	var clientWidth = document.getElementById('svgPlace').clientWidth;
	var s = Snap("#svg");
	
	var otherRect = s.rect(0,0,200,200).attr({ stroke: '#123456', 'strokeWidth': 20, fill: 'green' });
	var clickFunc = function () {
		otherRect.transform('');
		otherRect.animate({ transform: 'r360, 150,150' },2000, mina.bounce, null );
	};

	otherRect.click( clickFunc );
}




