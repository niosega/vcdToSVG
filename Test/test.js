//~ Object qui représente une variable 
function Variable(type,length,id,scope,name) {
	this.type=type;
	this.length=length;
	this.id=id;
	this.scope=scope;
	this.name=name;
	this.lastValue;
	this.value = new Map();
	
	this.toString = function(){
		return "type : "+type+" length : "+length+" id : "+id+" scope : "+scope +" name : "+name;
	}
	
	this.changeValue = function(value){
		this.value=value;
	}
	
	this.afficheTemps = function(){
		this.value.forEach(function(value,key){
			affiche("Temps "+name+" : "+key+" | "+value);
		},this.value)
	}
	
	this.afficheTempsA = function(t){
		var x = this.value.get(t);
		return x;
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
function changeMapValue(map,key,newTime,newValue){
	var ancienneVariable = map.get(key);
	var ancienneValeur = ancienneVariable.value;
	map.delete(key);
	var nouvelleVariable = new Variable(ancienneVariable.type,ancienneVariable.length,ancienneVariable.id,ancienneVariable.scope,ancienneVariable.name);
	nouvelleVariable.value = ancienneValeur;
	nouvelleVariable.lastValue = newValue;
	if(nouvelleVariable.value.has(newTime)==true){
		nouvelleVariable.value.delete(newTime);
	}
	nouvelleVariable.value.set(newTime,newValue);
	map.set(ancienneVariable.id,nouvelleVariable);
}

//~ Copie la derniere valeur dans la nouvelle valeur temps 
function copyOldValue(map,key,newTime){
	var ancienneVariable = map.get(key);
	var valeurCourante = ancienneVariable.lastValue;
	var nouvelleVariable = new Variable(ancienneVariable.type,ancienneVariable.length,ancienneVariable.id,ancienneVariable.scope,ancienneVariable.name);
	var ancienneValeur = ancienneVariable.value;
	nouvelleVariable.value = ancienneValeur;
	nouvelleVariable.value.set(newTime,valeurCourante);
	map.set(ancienneVariable.id,nouvelleVariable);
}

//~ Parse le fichier vcd
//~ listeVariables contient la liste des variables
function parse(vcd){
	
	//~ Tableau contenant les lignes du vcd
	var lignes = vcd.split('\n');
	//~ Tableau contenant les mots d'une ligne
	var mots="";
	//~ Tableau contenant la liste des variables du vcd
	var listeVariables = new Map();
	//~ Chaine représentant le module courant
	var scope=""; 
	
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
		else if(mots[0]=="$scope"){
			scope=scope+mots[2]+".";
		}
		else if(mots[0]=="$upscope"){
			scope = (scope.substring(0,scope.length-1));
			scope= scope.substring(0,scope.lastIndexOf("."));
			if(scope.length>0){
				scope=scope+".";
			}
		}
		else if(mots[0]=="$var"){
			var type = mots[1];
			var length = mots[2];
			var id = mots[3];
			var name = mots[4];
			var nouvelleVariable = new Variable(type,length,id,scope,name);
			listeVariables.set(id,nouvelleVariable);
		}
		else{
			
		}
		i++;
	}
	affiche("---- FIN VARIABLE ----");
	
	
	//~ -------  VALEURS ------- ~//
	affiche("---- DEBUT VALEURS ----");
	var temps="";
	var idVariable ="";
	var valeurVariable ="";
	var tableauTemps = new Array();
	for(i;i<lignes.length;i++){
		mots = lignes[i].split(' ');
		if(mots[0].charAt(0)=='#'){
			temps = mots[0].substring(1,mots[0].length);
			tableauTemps.push(temps);
			listeVariables.forEach(function(value,key){
				copyOldValue(listeVariables,key,temps);
			},listeVariables)
			affiche("Nous sommes au temps : "+temps);
		}
		else if(mots[0].length==2){
			valeurVariable=mots[0].charAt(0);
			idVariable=mots[0].charAt(1);
			affiche("Id : "+idVariable +" valeur : "+valeurVariable);
			changeMapValue(listeVariables,idVariable,temps,valeurVariable);
		}
		else if(mots[0].length>0){
			idVariable = mots[1];
			valeurVariable = mots[0].substring(1,mots[0].length);
			affiche("Id : "+idVariable +" valeur : "+valeurVariable);
			changeMapValue(listeVariables,idVariable,temps,valeurVariable);
		}
	}
	affiche("---- FIN VALEURS ----");

	affiche("---- DEBUT AFFICHAGE ----");
	for(var i in tableauTemps){
		affiche("Temps : "+tableauTemps[i]);
		listeVariables.forEach(function(value,key){
			affiche(value.scope+value.name+" "+value.afficheTempsA(tableauTemps[i]));
		},listeVariables)
	}
	affiche("---- FIN AFFICHAGE ----");
}
