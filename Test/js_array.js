function Variable(type,length,id,name) {
	this.type=type;
	this.length=length;
	this.id=id;
	this.name=name;
	
	this.toString = function(){
		return "type : "+type+" length : "+length+" id : "+id+" name : "+name;
	}
}

//~ Affiche dans la console et dans la textarea la chaine str
function affiche(str){
	var zoneTexte = document.getElementById("textDiv");
	zoneTexte.textContent=zoneTexte.textContent+"\n"+str+"\n";
	console.log(str);
}

function clear(){
	var zoneTexte = document.getElementById("textDiv");
	zoneTexte.textContent="";
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
	
	//~ Tableau contenant les lignes du vcd
	var lignes = vcd.split('\n');
	//~ Tableau contenant les mots d'une ligne
	var mots="";
	//~ Tableau contenant la liste des variables du vcd
	var listeVariables = new Array();
	
	var b = true;
	var i = 0;
	//~ Pour chaque ligne
	//~ for(var i in lignes){
	affiche("---- DEBUT CONTEXTE ----");
	while(b==true){
		mots = lignes[i].split(' ');
		if(mots[0]=="$enddefinitions"){
			b=false;
			for(var x in listeVariables){
				affiche(listeVariables[x]);
			}
		}
		else if(mots[0]=="$var"){
			var type = mots[1];
			var length = mots[2];
			var id = mots[3];
			var name = mots[4];
			var nouvelleVariable = new Variable(type,length,id,name);
			listeVariables.push(nouvelleVariable);
		}
		else{
			//~ affiche(lignes[i]);
		}
		i++;
	}
	affiche("---- FIN CONTEXTE ----");
	
}
