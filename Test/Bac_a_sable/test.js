var f1= null;
var f2= null;
var x = 0;

function init(){
	
	var strWindowFeatures = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes,width=500,heigth=50";
	f1 =   windowObjectReference = window.open("f1.html", "f1", strWindowFeatures);
	f2 =   windowObjectReference = window.open("f2.html", "f2", strWindowFeatures);
	
	f1.document.getElementById("left").value = 11;

	localStorage.setItem("shared",0);
	localStorage.setItem('f1',f1);
}

function shareFonction(){
	console.log(x);
	x++;
	var f = localStorage.getItem('f1');
	var shared = localStorage.getItem("shared"); 
	document.getElementById("left").value = shared;
	console.log(shared);
}

function afficheMap(myMap){
	console.log("DEBUG");
	myMap.forEach(function(value, key) {
	  console.log(key + " = " + value);
	}, myMap)
}