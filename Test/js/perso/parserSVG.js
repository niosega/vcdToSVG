function afficheMapSVG(map){
	map.forEach(function(value,key){
		affiche("key : "+key+" valeur : "+value);
	},map)
}

function analyseSVG(svg){
	lignes=svg.split("\n");
	variableVisualisee = new Map();
	for(var i in lignes){
		var firstDollar = lignes[i].indexOf("$");
		var lastDollar = lignes[i].lastIndexOf("$");
		var temp = lignes[i].substring(firstDollar+1,lastDollar);
		if(temp.length>0){
			variableVisualisee.set(temp.split(":")[0],temp.split(":")[1]);
		}
	}
	return variableVisualisee;
}