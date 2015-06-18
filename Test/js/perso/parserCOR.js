//~ Fill the correspondance map with the file given as input 
function analyseCOR(COR){
	
	var SVGtoVCD = new Map(); 
	
	var lines = COR.split("\n");
	
	for(var i in lines){
		var currentLine = lines[i];
		var splittedCurrentLine = currentLine.split(":");
		SVGtoVCD.set(splittedCurrentLine[0],splittedCurrentLine[1]);
	}
	
	return SVGtoVCD;
	
}