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

//~ Affiche dans la console 
function affiche(str){
	var zone = document.getElementById("comment");
	zone.value = zone.value+"\n "+str;
	console.log(str);
}

function clear(){
		var zone = document.getElementById("comment");
	zone.value = "";
}

//~ Affiche la map
function afficheMap(map){
	map.forEach(function(value,key){
		affiche("clé : "+key+" | "+value.toString());
	},map)
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
	nouvelleVariable.lastValue = valeurCourante;
	//~ affiche("DEBUG : key : "+key+" time : "+newTime +" valeur : "+valeurCourante);
	nouvelleVariable.value.set(newTime,valeurCourante);
	map.set(ancienneVariable.id,nouvelleVariable);
}

//~ Parse le fichier vcd
function parse(vcd,variableInteressante){
	clear();
	//~ Tableau contenant les lignes du vcd
	var lignes = vcd.split('\n');
	//~ Tableau contenant les mots d'une ligne
	var mots="";
	//~ Tableau contenant la liste des variables du vcd
	var listeVariables = new Map();
	//~ Chaine représentant le module courant
	var scope=""; 
	
	//~ -------  VARIABLE ------- ~//
	var b = true;
	var i = 0;
	while(b==true){
		mots = lignes[i].split(' ');
		if(mots[0]=="$enddefinitions"){
			b=false;
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
			if(length>1){
				var name = mots[4].substring(0,mots[4].indexOf('['));
			}
			else{
				var name = mots[4];
			}
			var nouvelleVariable = new Variable(type,length,id,scope,name);
			if((variableInteressante.indexOf(name)!=-1 || variableInteressante.length==0)){
				listeVariables.set(id,nouvelleVariable);
			}
		}
		else{
			
		}
		i++;
	}
	
	//~ -------  VALEURS ------- ~//
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
		}
		else if(mots[0].length==2){
			valeurVariable=mots[0].charAt(0);
			idVariable=mots[0].charAt(1);
			if(listeVariables.has(idVariable)==true){
				changeMapValue(listeVariables,idVariable,temps,valeurVariable);
			}
		}
		else if(mots[0].length>0){
			idVariable = mots[1];
			valeurVariable = mots[0].substring(1,mots[0].length);
			if(listeVariables.has(idVariable)==true){
				changeMapValue(listeVariables,idVariable,temps,valeurVariable);
			}
		}
		else{
			
		}
	}
	
	return [listeVariables, tableauTemps];
}


