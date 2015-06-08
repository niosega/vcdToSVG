

----------------------------------------------------------------------
---  An asynchronous memory
----------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.all;
use IEEE.Numeric_Std.all;

entity memory256x8 is
  port (
    ck   : in  std_logic;
    we      : in  std_logic;
    address : in  std_logic_vector(7 downto 0);
    datain  : in  std_logic_vector(7 downto 0);
    dataout : out std_logic_vector(7 downto 0)
  );
end entity memory256x8;

architecture rtl of memory256x8 is
  type ram_array is array (0 to 255) of std_logic_vector(7 downto 0);
  signal ram : ram_array := (
-- on peut tester l'un des programmes qui suivent en le copiant au début de la RAM.

-- Programme test 1
    "01001100", --0  cst -> a
    "00000001", --1   (constante: au début on met 1)
	
-- un programme qui lit dans b successivement toutes les valeurs de son propre code
-- a est le pointeur vers le code
    --~ "01101001", -- 0  [a] -> b
    --~ "01001101", -- 1 cst -> b
    --~ "00000001", -- 2   (constante: -1)
    --~ "00000010", -- 3   a+b -> a
    --~ "01111000", --6   JA (flemme de calculer le JR)
    --~ "00000000", --7      0   
    
    
-- le programme qui s'automodifie pour tester l'écriture mémoire
    --~ "01001100", --0  cst -> a
    --~ "00010001", --1   (constante: au début on met 17)
    --~ "01001101", --2 cst -> b
    --~ "11111111", --3   (constante: -1)
    --~ "01110110", --4  b -> [cst]
    --~ "00000001", --5   (constante, l'adresse: on écrase le 17)
    --~ "01111000", --6   JA 
    --~ "00000000", --7      0   Au second tour on doit lire -1 dans a
 
--- le programme qui compare deux constantes et met la plus grande dans B
    --~ "01001100", --0 cst -> a
    --~ "00010001", --1   (constante)
    --~ "01001101", --2 cst -> b
    --~ "01000111", --3   (constante: -1)
    --~ "00110010", --4 B-A?
    --~ "11100010", --5 A1   jr 2 IFN
    --~ "01000010", --6 9C   B -> A
    --~ "10000000", --6 9C   jr 0 (boucle infinie)


--- un programme qui décompte A de 3 à 0 puis s'arrête
    --~ "01001100", --0 cst -> a
    --~ "00000011", --1   (constante: 3)
    --~ "01001101", --2 cst -> b
    --~ "11111111", --3   (constante: -1)
    --~ "00000010", --4 02   a+b -> a
    --~ "10100010", --5 A1   jr 2 IFZ
    --~ "10011110", --6 9C   jr -2
    --~ "10000000", --6 9C   jr 0 (boucle infinie)
    --~ 
    --~ "00000011", -- a+b -> b
    --~ "00000011", -- a+b -> b
    --~ "00000011", -- a+b -> b
    --~ "00000011", -- a+b -> b
    --~ "00000011", -- a+b -> b
    --~ "00000011", -- a+b -> b
    --~ "00000011", -- a+b -> b

    others => "UUUUUUUU");

begin
  dataout <= "UUUUUUUU" when address="UUUUUUUU"
             else ram(to_integer(unsigned(address))) after 0.2 ns ;

  ram_process: process(ck) is
  begin
    if rising_edge(ck) then
      if we = '1' then
        ram(to_integer(unsigned(address))) <= datain;
      end if;
    end if;
  end process ram_process;
end architecture rtl;


-- An 8-bit register entity to make the code smaller and closer to the drawing
library IEEE;
use IEEE.STD_LOGIC_1164.all;
entity reg8bits is
  port (
    rst     : in  std_logic;
    ck      : in  std_logic;
    ce      : in  std_logic;
    di      : in  std_logic_vector(7 downto 0);
    do      : out std_logic_vector(7 downto 0)
  );
end entity;  
-- This is a behaviorial description of a register. However, all
-- the synthesis tools will be able to infer a flip-flop with synchronous reset
-- and clock enable
architecture rtl of reg8bits is
begin
  reg: process(ck) is
  begin
    if rising_edge(ck) then
      if rst = '1' then
        do <= x"00";
      else
         if ce = '1' then
           do <= di;
         end if;
      end if;
    end if;
  end process;
end architecture rtl;


----------------------------------------------------------------------
---  Processor
----------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.all;
use IEEE.Numeric_Std.all;

entity processor is
  port (
    rst     : in  std_logic;
    ck      : in  std_logic;
    we      : out  std_logic;
    ma      : out  std_logic_vector(7 downto 0);
    mdi     : in  std_logic_vector(7 downto 0);
    mdo     : out std_logic_vector(7 downto 0)
  );
end entity;  


architecture rtl of processor is
  component reg8bits is
  port (
    rst     : in  std_logic;
    ck      : in  std_logic;
    ce      : in  std_logic;
    di      : in  std_logic_vector(7 downto 0);
    do      : out std_logic_vector(7 downto 0)
  );
  end component;  

  subtype state is std_logic_vector(3 downto 0);
  -- State encoding:
  constant LoadInstr: state :=    "0000";
  constant InstrLoaded: state  := "0001";
  constant LoadCst  : state :=    "0010";
  constant CstLoaded  : state :=  "0011";
  constant WriteBack: state :=    "0100";
  constant ReadMem   : state :=   "0101";
  constant WriteMem  : state :=   "0110";
  constant IllegalInstr  : state := "1111";
	-- Registers to hold the current state and the next state
	signal currentState, nextState	   : state;

  --registers output and input
  signal instr, cst,
         a, b, aluOut, regABIn, arg1, arg2,
         pc, pcIn, pcOffset, nextPC    : std_logic_vector(7 downto 0);
  -- decomposition of input word
  signal destS, arg1S, arg2S, jr : std_logic;
  signal codeOp : std_logic_vector(3 downto 0);
  signal cond : std_logic_vector(1 downto 0);
  signal offset : std_logic_vector(4 downto 0);

  -- all the clock enable signale
  signal ceInstr, ceCst, ceA, ceB, ceDest, ceFlags, cePC, ja, progFetch : std_logic;

  -- other signals en vrac
  signal Z, C, N, aluZ, aluC, aluN, condTrue: std_logic;
  signal addResult, subResult: std_logic_vector(8 downto 0);
  
  -- for the FSM
  signal instrIsJA, instrIsJR, instrIsALU, instrIsCmp, instrIsNotOrCp, instrIsMem, oneWordInstr: std_logic;
  
begin

  -- All the registers in the design (except the control unit)
  regPC: reg8bits port map (rst=>rst, ck=>ck, ce=>cePC, di=>pcIn, do=>pc );
  regInstr: reg8bits port map (rst=>rst, ck=>ck, ce=>ceInstr, di=>mdi, do=>instr );
  regCst: reg8bits port map (rst=>rst, ck=>ck, ce=>ceCst, di=>mdi, do=>cst );
  regA: reg8bits port map (rst=>rst, ck=>ck, ce=>ceA, di=>regABIn, do=>a );
  regB: reg8bits port map (rst=>rst, ck=>ck, ce=>ceB, di=>regABIn, do=>b );

  -- The multiplexer on ma and PC
  ma <= pc when progFetch='1' else arg2;

  -- the input of regPC
  pcOffset <= "00000001" when jr='0'
            else  offset(4) & offset(4) & offset(4) & offset; -- sign extension 
  nextPC <= std_logic_vector(unsigned(pc) + unsigned(pcOffset));
  pcIn <= cst when ja='1' else nextPC;

  --the input of regA and regB
  regABIn <= mdi when codeOp="1101" else aluOut;
    
  --  Decomposition of the instruction word
  codeOp <= instr(6 downto 3);   
  destS <= instr(0);  
  arg1S <= instr(1);  
  arg2S <= instr(2);  
  offset <= instr(4 downto 0);
  cond <= instr(6 downto 5);
  -- the multiplexers selecting arg1 and arg2
  arg1 <= a when arg1S='0' else b;
  arg2 <= a when arg2S='0' else cst;

  -- ALU internals
  -- the adder/subtractor
  addResult <= std_logic_vector(signed('0' & arg1) + signed('0' & arg2));
  subResult <= std_logic_vector(signed('0' & arg1) - signed('0' & arg2));
  -- the following is the VHDL for a big multiplexer. Go draw it!
  with codeOp select
  aluOut <=
    addResult(7 downto 0)             when "0000",
    subResult(7 downto 0)             when "0001",
    arg1 and arg2                     when "0010",
    arg1 or  arg2                     when "0011",
    arg1 xor arg2                     when "0100",
    '0' & arg1(7 downto 1)            when "0101", -- lsr
    subResult(7 downto 0)             when "0110", -- cmp
    arg1 xor (7 downto 0 => arg2S)    when "1000",
    arg2                              when "1001",
    x"00" when others;

    -- flags
  aluC <= addResult(8) when codeOp="0000" else
          subResult(8) when codeOp="0001" or codeOp="0110" else
          arg1(0)  when codeOp="0101" else '0';
  aluZ <= '1' when aluOut = x"00" else '0'; 
  aluN <= aluOut(7);
  ceFlags <= instrIsALU and not codeOp(3) and ceDest;
  regFlags:  process(ck) is
  begin
    if rising_edge(ck) then
      if rst = '1' then
        C <= '0';
        Z <= '0';
        N <= '0';
      else
         if ceFlags = '1' then
           C <= aluC;
           Z <= aluZ;
           N <= aluN;
         end if;
      end if;
    end if;
  end process;
  
  ceA <= ceDest and not destS;
  ceB <= ceDest and destS;
  mdo <= arg1;

  -- The FSM register
  stateReg: process(ck) is
    begin  if rising_edge(ck) then
           if rst = '1' then  currentState <= "0000";
           else  currentState <= nextState; 
         end if;  end if;
    end process;
  -- The FSM transition function
  nextState <=
    InstrLoaded when currentState=LoadInstr
    else
    LoadCst when currentState = InstrLoaded and oneWordInstr='0'
    else
    CstLoaded when currentState=loadCst
    else
    ReadMem when (codeOp="1101" and (currentState=CstLoaded or currentState=InstrLoaded))
    else
    WriteMem when (codeOp="1110" and (currentState=CstLoaded or currentState=InstrLoaded))
    else
    WriteBack when (
      (currentState = InstrLoaded and oneWordInstr='1' and instrIsJR='0' and instrIsCmp='0') 
      or (currentState = CstLoaded and instrIsMem='0' and instrIsJA='0' )     )
    else
    LoadInstr when currentState=WriteBack or currentState=WriteMem
                   or (currentState=InstrLoaded and InstrIsJR='1')
                   or (currentState=InstrLoaded and InstrIsCmp='1')
                   or (currentState=CstLoaded and InstrIsJA='1')
                   or (currentState=ReadMem)
    else IllegalInstr;
          

  -- A few intermediate signals to simplify the FSM output function
  instrIsJA <= '1' when instr(7 downto 3) = "01111" else '0';
  instrIsJR <= instr(7);
  instrIsALU <= '1' when instrIsJR='0' and (codeOp="0000" or codeOp="0001" or codeOp="0010" or codeOp="0011" or codeOp="0100" or codeOp="0101" or codeOp="0110" or codeOp="1000" or codeOp="1001") else '0';
  instrIsMem <= '1'  when instrIsJR='0' and (codeOp="1101" or codeOp="1110") else '0';
  InstrIsNotOrCp <= '1' when (instr(7 downto 3) = "01000") else '0';
  InstrIsCmp <= '1' when (instr(7 downto 3) = "00110") else '0';
  oneWordInstr <= instrIsJR or InstrIsNotOrCp or ((instrIsALU or instrIsMem) and not arg2S);
--  twoWordInstr <= instrIsJA or ((instrIsALU or instrIsMem) and arg2S);        

  -- The FSM output function
  ceInstr <='1' when currentState=LoadInstr
             else '0';
  progFetch <= '1' when currentState=LoadInstr
                or (currentState=LoadCst) 
                else '0';
  we <= '1' when currentState=writeMem else '0';
  ceDest <='1' when currentState=WriteBack or currentState=ReadMem else '0';
  cePC <='1' when currentState=InstrLoaded or currentState=CstLoaded
          else '0'; -- in case of JR or JA we jump back to LoadInstr with 
  ceCst <='1' when currentState=loadCst else '0';    
  ja <= '1' when (instrIsJA='1' and CurrentState=CstLoaded) else '0' ;
  condTrue <= '1' when (cond="00" or (cond="01" and Z='1') or  (cond="10" and C='1') or (cond="11" and N='1') ) 
                  else '0'; 
  jr <= instrIsJR and condTrue;
  
end architecture rtl;



---------  Test bench -----------------
library ieee; 
use ieee.std_logic_1164.all;
library work;

entity testbench is
end entity;

architecture behaviorial of testbench is
  component memory256x8 is
  port (
    ck   : in  std_logic;
    we      : in  std_logic;
    address : in  std_logic_vector(7 downto 0);
    datain  : in  std_logic_vector(7 downto 0);
    dataout : out std_logic_vector(7 downto 0)
  );
  end component;

  component processor is
  port (
    rst      : in  std_logic;
    ck       : in  std_logic;
    we       : out  std_logic;
    ma       : out  std_logic_vector(7 downto 0);
    mdi      : in  std_logic_vector(7 downto 0);
    mdo      : out std_logic_vector(7 downto 0)
  );
  end component;
  
  signal ma,dp2m,dm2p : std_logic_vector(7 downto 0);
  signal ck, we, rst : std_logic;
begin 
  mem:  memory256x8
    port map ( ck => ck, we => we, address => ma, datain => dp2m, dataout => dm2p) ;

  proc:  processor
    port map ( ck => ck, rst => rst, we => we, ma => ma, mdi => dm2p, mdo => dp2m) ;

  clock_process : process 
   begin
     ck <= '1';
     wait for 0.5 ns; 
     ck <= '0';
     wait for 0.5 ns; 
   end process;

  rst_process : process 
   begin
     rst <= '1';
     wait for 1.1 ns; 
     rst <= '0';
     wait for 1 us; 
   end process;



end;
