---------  Copy your full adder here --------
library ieee; 
use ieee.std_logic_1164.all;
library work;
entity fulladder is
   port ( x, y, cin : in std_logic;
          cout, sum : out  std_logic );
end entity;

architecture rtl of fulladder is
begin
  sum <= (x xor y) xor cin after 30 ps;
  cout <= (x and y ) or (x and cin) or (y and cin) after 80 ps;
end architecture;

-----------------------Registre
library ieee; 
use ieee.std_logic_1164.all;
library work;
entity registry is
generic (n: integer); -- generic means: architectural parameter
   port ( clk, rst, enable : in std_logic;
		  entree: in std_logic_vector(n-1 downto 0);
          sortie: out  std_logic_vector(n-1 downto 0) );
end entity;

architecture rtl of registry is
begin
	process (rst)
	begin
		if rst='1'then
			addloop: -- this is a label, mandatory on for ... generate loops
			for i in 0 to n-1 loop  
			  
				sortie(i)<='0';
			end loop;		
		end if;
	end process;
	
	process(clk)
	begin
		if rising_edge(clk) then
			if enable = '1' then
				addloop: -- this is a label, mandatory on for ... generate loops
				for i in 0 to n-1 loop  
				   
					sortie(i)<=entree(i);
				end loop;				
			end if;
		end if;
	end process;
end architecture;


-------------------------------Clock

library ieee; 
use ieee.std_logic_1164.all;
library work;

entity clock_generator is
   port ( clk0 : out  std_logic );
end entity;

architecture behaviorial of clock_generator is
   constant clk_period : time := 1 ns;
   begin
   clock_process :process
   begin
     clk0 <= '0';
     wait for clk_period/2;  --for 0.5 ns signal is '0'.
     clk0 <= '1';
     wait for clk_period/2;  --for next 0.5 ns signal is '1'.
   end process;
end;
---------  An n-bit adder ------------------

library ieee; 
use ieee.std_logic_1164.all;
library work;
entity adder is
  generic (n: integer :=8); -- generic means: architectural parameter
  port(x : in std_logic_vector(n-1 downto 0);
       y : in std_logic_vector(n-1 downto 0);
       cin : in std_logic;
       s : out std_logic_vector(n-1 downto 0);
       cout : out std_logic );
end entity;

architecture rtl of adder is
  component fulladder is
   port ( x, y, cin : in std_logic;
          cout, sum : out  std_logic );
    end component;

-- the vector of internal carries. Note that it is n+1 bits
  signal  c : std_logic_vector (n downto 0);

begin

     c(0)<=cin;
    addloop: -- this is a label, mandatory on for ... generate loops
     for i in 0 to n-1 generate  
      begin   
        fulladderinstance:
          fulladder port map (  
          x => x(i),  
          y => y(i),  
          cin => c(i),  
          cout => c(i+1),
          sum => s(i)
          );  
      end generate;
      
   cout <= c(n);
   
end architecture;


---------  Compteur ------------------

library ieee; 
use ieee.std_logic_1164.all;
library work;
entity compteur is
  generic (n: integer:=8); -- generic means: architectural parameter
  port(    
		reset : in std_logic;
       sortieCompteur : out std_logic_vector(n-1 downto 0)
       );
end entity;

architecture rtl of compteur is
 component adder is
  generic (n: integer:=8);
  port(x : in std_logic_vector(n-1 downto 0);
       y : in std_logic_vector(n-1 downto 0);
       cin : in std_logic;
       s : out std_logic_vector(n-1 downto 0);
       cout : out std_logic );
    end component;

component clock_generator is
  port(clk0 : out std_logic );
    end component;
    
component registry is
	generic (n: integer:=8);
  port(clk, rst, enable : in std_logic;
		  entree: in std_logic_vector(n-1 downto 0);
          sortie: out  std_logic_vector(n-1 downto 0) );
    end component;

-- the vector of internal carries. Note that it is n+1 bits
  signal  entreeReg,sortieReg : std_logic_vector (n-1 downto 0);
  signal  clock, dev0 : std_logic;
  

begin

	adderinstance:
    adder port map (  
		  cin=>'1',
          x => sortieReg,  
          y => "00000000",           
          s => entreeReg,
          cout=>dev0
          );  
          
    reginstance:
    registry port map (  
          clk=>clock,
          rst=>reset,
          enable=>'1',
          entree=>entreeReg,
          sortie=>sortieReg
          ); 
          
    clkinstance:
    clock_generator port map (  
			clk0=>clock
          );  
          
	sortieCompteur<=sortieReg; 
 
end architecture;

---------  Its test bench -----------------
library ieee; 
use ieee.std_logic_1164.all;
library work;

entity testbench is
generic (n: integer:= 8);
end entity;

architecture behaviorial of testbench is

  -- We need to redeclare adder, because it appears in testbench,
  -- but not fulladder

  component compteur is 
   generic (n: integer); -- generic means: architectural parameter

  port(	reset : in std_logic;
       sortieCompteur : out std_logic_vector(n-1 downto 0)
  );
    end component;
    
  signal resultat : std_logic_vector(n-1 downto 0);
  signal monReset : std_logic;
  
begin 
  --  Instantiate the Unit Under Test (UUT)
  uut: compteur
    generic map ( n=>n )  -- at some point the size of the architecture must
                            -- be fixed
    port map (sortieCompteur=>resultat, reset=>monReset) ;

  -- A process is an infinite loop
   test_process :process 
   begin
     monReset<='1';
     wait for 10 ns;
     monReset<='0';
     wait for 666 ns;
     -- add more tests here
   end process;

end;


