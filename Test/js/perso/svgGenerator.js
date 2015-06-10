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
var otherRect="";
function testSvg(vcd){
	var clientHeight = document.getElementById('svgPlace').clientHeight;
	var clientWidth = document.getElementById('svgPlace').clientWidth;
	var s = Snap("#svg");
	
	otherRect = s.rect(0,0,200,200).attr({ stroke: '#123456', 'strokeWidth': 20, fill: 'green' });
	var g = s.group();
	var tux = Snap.load("processeur.svg", function ( loadedFragment ) {
													g.append( loadedFragment );
													g.hover( hoverover, hoverout );
											} );

	var hoverover = function() { g.animate({ transform: 's2r45,150,150' }, 1000, mina.bounce ) };
	var hoverout = function() { g.animate({ transform: 's1r0,150,150' }, 1000, mina.bounce ) };
	//~ var clickFunc = function () {
		//~ otherRect.transform('');
		//~ otherRect.animate({ transform: 'r360, 150,150' },2000, mina.bounce, null );
	//~ };
	//~ otherRect.click( clickFunc );
	
	//~ [listeVariables,tableauTemps] = parse(vcd,new Array());
	//~ var sr = "";
	//~ for(var i in tableauTemps){
		//~ sr=sr+(" Temps : "+tableauTemps[i]);
		//~ listeVariables.forEach(function(value,key){
			//~ sr=sr+" | "+(value.scope+value.name+" "+value.afficheTempsA(tableauTemps[i]));
		//~ },listeVariables)
	//~ }
	//~ s.text(20,20,sr);
	
}

function generateSVG(value){
	otherRect.attr({ height: value*10 , width: value*14});
}