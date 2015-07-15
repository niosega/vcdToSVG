8_bits_processor.vcd : 8_bits_processor.vhdl
	ghdl -a 8_bits_processor.vhdl
	ghdl -e testbench
	./testbench --stop-time=1ns --vcd=8_bits_processor.vcd
	rm testbench
	rm work-obj93.cf
	rm 8_bits_processor.o
	rm e~testbench.o

clean :	
	rm 8_bits_processor.vcd

