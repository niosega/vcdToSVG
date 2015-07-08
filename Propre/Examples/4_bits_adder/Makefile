4_bits_adder.vcd : 4_bits_adder.vhdl
	ghdl -a 4_bits_adder.vhdl
	ghdl -e testbench
	./testbench --stop-time=270000fs --vcd=4_bits_adder.vcd


clean :	
	rm testbench
	rm 4_bits_adder.vcd
	rm work-obj93.cf
	rm 4_bits_adder.o
	rm e~testbench.o

propre :
	rm testbench
	rm work-obj93.cf
	rm 4_bits_adder.o
	rm e~testbench.o
