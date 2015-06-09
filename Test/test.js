//~ Object qui représente une variable 
function Variable(type,length,id,name,value) {
	this.type=type;
	this.length=length;
	this.id=id;
	this.name=name;
	this.value=value;
	
	this.toString = function(){
		return "type : "+type+" length : "+length+" id : "+id+" name : "+name+" value : "+value;
	}
	
	this.changeValue = function(value){
		this.value=value;
	}
}

//~ Affiche dans la console et dans la textarea la chaine str
function affiche(str){
	var zoneTexte = document.getElementById("textDiv");
	zoneTexte.textContent=zoneTexte.textContent+"\n"+str+"\n";
	console.log(str);
}

//~ Affiche la map
function afficheMap(map){
	map.forEach(function(value,key){
		affiche("clé : "+key+" | "+value.toString());
	},map)
}
 
//~ Vide la textarea 
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

//~ Change la valeur associé la clé key dans la map 
function changeMapValue(map,key,newValue){
	var ancienneVariable = map.get(key);
	map.delete(key);
	var nouvelleVariable = new Variable(ancienneVariable.type,ancienneVariable.length,ancienneVariable.id,ancienneVariable.name,newValue);
	map.set(ancienneVariable.id,nouvelleVariable);
}
			
function parse(vcd){
	
	//~ Tableau contenant les lignes du vcd
	var lignes = vcd.split('\n');
	//~ Tableau contenant les mots d'une ligne
	var mots="";
	//~ Tableau contenant la liste des variables du vcd
	var listeVariables = new Map();
	
	//~ -------  VARIABLE ------- ~//
	affiche("---- DEBUT VARIABLE ----");
	var b = true;
	var i = 0;
	while(b==true){
		mots = lignes[i].split(' ');
		if(mots[0]=="$enddefinitions"){
			b=false;
			afficheMap(listeVariables);
		}
		else if(mots[0]=="$var"){
			var type = mots[1];
			var length = mots[2];
			var id = mots[3];
			var name = mots[4];
			var nouvelleVariable = new Variable(type,length,id,name,"x");
			listeVariables.set(id,nouvelleVariable);
		}
		else{
			
		}
		i++;
	}
	affiche("---- FIN VARIABLE ----");
	
	//~ -------  VALEURS ------- ~//
	affiche("---- DEBUT VALEURS ----");
	for(i;i<lignes.length;i++){
		mots = lignes[i].split(' ');
	}
	affiche("---- FIN VALEURS ----");
}
