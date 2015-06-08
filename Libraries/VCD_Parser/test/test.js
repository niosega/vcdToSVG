//~ function sayHello(){
	//~ var fs = require('fs');
	//~ var vcd = require('../');
	//~ alert('ik');
	//~ var s = fs.createReadStream(__dirname + '/test.vcd')
	  //~ .pipe(vcd.createStream({
		//~ rename: {
		  //~ "0": 'enable',
		  //~ "1": 'miso',
		  //~ "2": 'irq',
		  //~ "3": 'mosi',
		  //~ "4": 'sck',
		  //~ "5": 'sw_en'
		//~ },
		//~ ignore: ["6", "7"]
	  //~ }))
	  //~ .on('begin', function (state) {
		//~ console.log(state);
	  //~ })
	  //~ .on('sample', function (sample, changes, last) {
		//~ console.log(sample, changes, last)
	  //~ })
//~ }

function sayHello() {
	//var fs = require('fs');
	console.log(vcd);
}
