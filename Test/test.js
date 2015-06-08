var variable = {
	type:"wire",
	length:1,
	id:"!",
	name:"clock_enable"
};	

//~ Affiche dans la console et dans la textarea la chaine str
function affiche(str){
	var zoneTexte = document.getElementById("textDiv");
	zoneTexte.textContent=zoneTexte.textContent+"\n"+str+"\n";
	console.log(str);
}

//~ Compte le nombre d'occurence du caractere char dans la chaine str
function count(str,char){
	var temp = str;
	var compteur =0;
	for(var i =0;i<str.length;i++){
		if(str.charAt(i)==char){
			compteur++;
		}
	}
	return compteur;
}

			
function parse(vcd){
	affiche(variable.name);
}
