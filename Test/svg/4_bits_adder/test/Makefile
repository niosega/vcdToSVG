processeur.vcd : processeur.vhdl
	ghdl -a processeur.vhdl
	ghdl -e testbench
	./testbench --stop-time=1ns --vcd=processeur.vcd

clean :	
	rm testbench
	rm processeur.vcd
	rm work-obj93.cf
	rm processeur.o
	rm e~testbench.o
