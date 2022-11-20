//SP always point to next "empty" position to write to (post increase i think it called)<br> 

/*

todo
actual emulation cycle xDDDD

display state in html


tester



*/

var tmp = 0;



var disassemble_table = ["nop", "lxi b,#", "stax b", "inx b",
"inr b", "dcr b", "mvi b,#", "rlc", "ill", "dad b", "ldax b", "dcx b",
"inr c", "dcr c", "mvi c,#", "rrc", "ill", "lxi d,#", "stax d", "inx d",
"inr d", "dcr d", "mvi d,#", "ral", "ill", "dad d", "ldax d", "dcx d",
"inr e", "dcr e", "mvi e,#", "rar", "ill", "lxi h,#", "shld", "inx h",
"inr h", "dcr h", "mvi h,#", "daa", "ill", "dad h", "lhld", "dcx h",
"inr l", "dcr l", "mvi l,#", "cma", "ill", "lxi sp,#", "sta $", "inx sp",
"inr M", "dcr M", "mvi M,#", "stc", "ill", "dad sp", "lda $", "dcx sp",
"inr a", "dcr a", "mvi a,#", "cmc", "mov b,b", "mov b,c", "mov b,d",
"mov b,e", "mov b,h", "mov b,l", "mov b,M", "mov b,a", "mov c,b", "mov c,c",
"mov c,d", "mov c,e", "mov c,h", "mov c,l", "mov c,M", "mov c,a", "mov d,b",
"mov d,c", "mov d,d", "mov d,e", "mov d,h", "mov d,l", "mov d,M", "mov d,a",
"mov e,b", "mov e,c", "mov e,d", "mov e,e", "mov e,h", "mov e,l", "mov e,M",
"mov e,a", "mov h,b", "mov h,c", "mov h,d", "mov h,e", "mov h,h", "mov h,l",
"mov h,M", "mov h,a", "mov l,b", "mov l,c", "mov l,d", "mov l,e", "mov l,h",
"mov l,l", "mov l,M", "mov l,a", "mov M,b", "mov M,c", "mov M,d", "mov M,e",
"mov M,h", "mov M,l", "hlt", "mov M,a", "mov a,b", "mov a,c", "mov a,d",
"mov a,e", "mov a,h", "mov a,l", "mov a,M", "mov a,a", "add b", "add c",
"add d", "add e", "add h", "add l", "add M", "add a", "adc b", "adc c",
"adc d", "adc e", "adc h", "adc l", "adc M", "adc a", "sub b", "sub c",
"sub d", "sub e", "sub h", "sub l", "sub M", "sub a", "sbb b", "sbb c",
"sbb d", "sbb e", "sbb h", "sbb l", "sbb M", "sbb a", "ana b", "ana c",
"ana d", "ana e", "ana h", "ana l", "ana M", "ana a", "xra b", "xra c",
"xra d", "xra e", "xra h", "xra l", "xra M", "xra a", "ora b", "ora c",
"ora d", "ora e", "ora h", "ora l", "ora M", "ora a", "cmp b", "cmp c",
"cmp d", "cmp e", "cmp h", "cmp l", "cmp M", "cmp a", "rnz", "pop b",
"jnz $", "jmp $", "cnz $", "push b", "adi #", "rst 0", "rz", "ret", "jz $",
"ill", "cz $", "call $", "aci #", "rst 1", "rnc", "pop d", "jnc $", "out p",
"cnc $", "push d", "sui #", "rst 2", "rc", "ill", "jc $", "in p", "cc $",
"ill", "sbi #", "rst 3", "rpo", "pop h", "jpo $", "xthl", "cpo $", "push h",
"ani #", "rst 4", "rpe", "pchl", "jpe $", "xchg", "cpe $", "ill", "xri #",
"rst 5", "rp", "pop psw", "jp $", "di", "cp $", "push psw", "ori #",
"rst 6", "rm", "sphl", "jm $", "ei", "cm $", "ill", "cpi #", "rst 7"];

//overwrite with your devie functions
function read_from_port(addr){return 0x00};
function write_to_port(a,addr){}

var cpu = {
    iff: 0,
    interrupt_pending: 0,
    interrupt_vector: 0,
    halted: 0
}


function i8080_step(){

    if (cpu.interrupt_pending && cpu.iff) {
        cpu.interrupt_pending = 0;
        cpu.iff = 0;
        cpu.halted = 0;
    
        ops[cpu.interrupt_vector].call();
      } else if (!cpu.halted) {

        //console.log(`${disassemble_table[memory[regs.PC[0]]]} ${(memory[regs.PC[0]]).toString(16)}`);
        ops[read_one_byte_and_inc_pc()].call();
      }
}

function i8080_init(){
    for(let reg in regs){
        regs[reg][0] = 0;
    }
    for(let flag in flags){
        flags[flag] = 0;
    }
    flags.ONE = 1;
    buildFlagRegister();
}

//result tmp storage 
var res ={'8':new Uint8Array(1),'16':new Uint16Array(1)};

var flags = {};
flags.SIGN = 0;
flags.ZERO = 0;
flags.AUXCARRY = 0;
flags.PARITY = 0;
flags.ONE = 1;
flags.CARRY = 0;


var regs = {};
let sAF = new SharedArrayBuffer(2);
regs.AF = new Uint16Array(sAF);
regs.A = new Uint8Array(sAF,1,1);
regs.F = new Uint8Array(sAF,0,1);


let sBC = new SharedArrayBuffer(2);
regs.BC = new Uint16Array(sBC)
regs.B = new Uint8Array(sBC,1,1);
regs.C = new Uint8Array(sBC,0,1);

let sDE = new SharedArrayBuffer(2);
regs.DE = new Uint16Array(sDE);
regs.D = new Uint8Array(sDE,1,1);
regs.E = new Uint8Array(sDE,0,1);

let sHL = new SharedArrayBuffer(2);
regs.HL = new Uint16Array(sHL);
regs.H = new Uint8Array(sHL,1,1);
regs.L = new Uint8Array(sHL,0,1);

regs.SP = new Uint16Array(1);
regs.PC = new Uint16Array(1);


var ops = [];
var memory = new Uint8Array(0x10000);
var device_ports = new Int8Array(0xff);
var bus_address = 0;
var allow_interrupts = true;
var wait_for_interrupt = false;

//magic memory locations for RST
/*
memory[0] = 0xFF;
memory[16] = 0xFF;
memory[32] = 0xFF;
memory[48] = 0xFF;
memory[64] = 0xFF;
memory[80] = 0xFF;
*/



//NOPs
function NOP(){}
ops[0x00] = () => NOP();
ops[0x10] = () => NOP();
ops[0x20] = () => NOP();
ops[0x30] = () => NOP();

ops[0x08] = () => NOP();
ops[0x18] = () => NOP();
ops[0x28] = () => NOP();
ops[0x38] = () => NOP();


//LXIs
function LXI(dst1,dst2){
    regs[dst1][0]=read_two_bytes_and_inc_pc();
}

function LXI_SP(){
    regs.SP[0] = read_two_bytes_and_inc_pc();
}

//LXI B
ops[0x01] = () => LXI('BC');
//LXI D
ops[0x11] = () => LXI('DE');
//LXI H
ops[0x21] = () => LXI('HL');
//LXI SP
ops[0x31] = () => LXI_SP();


//STAXs
function STAX(mem_addr){
    memory[mem_addr] = regs.A[0];
}
ops[0x02] = () => STAX(regs.BC[0]);
ops[0x12] = () => STAX(regs.DE[0]);

//SHLD
function SHLD(dest){
    //console.log('shld dest',dest)
    memory[dest+1] = regs.H[0];
    memory[dest] = regs.L[0];
}
ops[0x22] = () => SHLD(read_two_bytes_and_inc_pc());

//STA
function STA(dest){
    memory[dest] = regs.A[0];
}
ops[0x32] = () => STA(read_two_bytes_and_inc_pc());

//INXs
function INX(dest){
    regs[dest][0] += 1;
}
ops[0x03] = () => INX('BC');
ops[0x13] = () => INX('DE');
ops[0x23] = () => INX('HL');
ops[0x33] = () => INX('SP');

//INRs
function INR(dest){
    if(dest=='M'){
        tmp = memory[regs.HL[0]] + 1;
        checkFlags(tmp);
        flags.AUXCARRY = carry(4, regs.HL[0], 1, 0);
        memory[regs.HL[0]] = tmp;
    }
    else{
        tmp = regs[dest][0] + 1;
        checkFlags(tmp);
        flags.AUXCARRY = carry(4, regs[dest][0], 1, 0);
        regs[dest][0] = tmp;
    }
}
ops[0x04] = () => INR('B');
ops[0x14] = () => INR('D');
ops[0x24] = () => INR('H');
ops[0x34] = () => INR('M');

ops[0x0C] = () => INR('C');
ops[0x1C] = () => INR('E');
ops[0x2C] = () => INR('L');
ops[0x3C] = () => INR('A');


//DCRs
function DCR(dest){
    if(dest=='M'){
        tmp = memory[regs.HL[0]] - 1;
        flags.AUXCARRY = !((tmp & 0xF) == 0xF)?1:0;
        checkFlags(tmp);
        memory[regs.HL[0]] = tmp;
    }
    else{
        tmp = regs[dest][0] - 1;
        flags.AUXCARRY = !((tmp & 0xF) == 0xF)?1:0;
        checkFlags(tmp);
        regs[dest][0] = tmp;
    }
}
ops[0x05] = () => DCR('B');
ops[0x15] = () => DCR('D');
ops[0x25] = () => DCR('H');
ops[0x35] = () => DCR('M');

ops[0x0D] = () => DCR('C');
ops[0x1D] = () => DCR('E');
ops[0x2D] = () => DCR('L');
ops[0x3D] = () => DCR('A');


//MVIs
function MVI(dest,val){
	 regs[dest][0] = val;
}

function MVI_M(val){
	memory[regs.HL[0]] = val;
}

ops[0x06] = () => MVI('B',read_one_byte_and_inc_pc());
ops[0x16] = () => MVI('D',read_one_byte_and_inc_pc());
ops[0x26] = () => MVI('H',read_one_byte_and_inc_pc());
ops[0x36] = () => MVI_M(read_one_byte_and_inc_pc());

ops[0x0E] = () => MVI('C',read_one_byte_and_inc_pc());
ops[0x1E] = () => MVI('E',read_one_byte_and_inc_pc());
ops[0x2E] = () => MVI('L',read_one_byte_and_inc_pc());
ops[0x3E] = () => MVI('A',read_one_byte_and_inc_pc());


//RLC
function RLC(){
    let msb  = regs.A[0]>>7;
    flags.CARRY = msb;
    regs.A[0] = regs.A[0]<<1;
    regs.A[0] = regs.A[0] | msb;
    buildFlagRegister();
}
ops[0x07] = () => RLC();


//RAL
function RAL(){
    let lsb  = regs.A[0] & 0x01;
    let msb  = regs.A[0]>>7;
    regs.A[0] = regs.A[0]<<1;
    regs.A[0] = regs.A[0] | flags.CARRY;
    flags.CARRY = msb;

    buildFlagRegister();
}
ops[0x17] = () => RAL();


//DAA

// Decimal Adjust Accumulator: the eight-bit number in register A is adjusted
// to form two four-bit binary-coded-decimal digits.
// For example, if A=$2B and DAA is executed, A becomes $31.

function DAA(){
    //special
    
    let cy = flags.CARRY;
    let correction = 0;
  
    let lsb = regs.A[0] & 0x0F;
    let msb = regs.A[0] >> 4;
  
    if (flags.AUXCARRY || lsb > 9) {
      correction += 0x06;
    }
  
    if (flags.CARRY || msb > 9 || (msb >= 9 && lsb > 9)) {
      correction += 0x60;
      cy = 1;
    }
  
    ADD(correction);
    flags.CARRY = 1;
  
}
ops[0x27] = () => DAA();


//STC
function STC(){
    flags.CARRY = 1;
    buildFlagRegister();
}
ops[0x37] = () => STC();

//DADs
function DAD(src){
    tmp = regs.HL[0] + regs[src][0];
    checkFlags(tmp, 'C');
    regs.HL[0] = tmp;
}
ops[0x09] = () => DAD('BC');
ops[0x19] = () => DAD('DE');
ops[0x29] = () => DAD('HL');
ops[0x39] = () => DAD('SP');


//LDAXs
function LDAX(src){
    regs.A[0] = memory[src]
}
ops[0x0A] = () => LDAX(regs.BC[0]);
ops[0x1A] = () => LDAX(regs.DE[0]);


//LHLD
function LHLD(address){
    regs.L[0] = memory[address];
    regs.H[0] = memory[address+1];
}
ops[0x2A] = () => LHLD(read_two_bytes_and_inc_pc());

//LDA
function LDA(addr){
    regs.A[0] = memory[addr];
}
ops[0x3A] = () => LDA(read_two_bytes_and_inc_pc());

//DXCs
function DXC(dest){
    regs[dest][0] -= 1;
}
ops[0x0B] = () => DXC('BC');
ops[0x1B] = () => DXC('DE');
ops[0x2B] = () => DXC('HL');
ops[0x3B] = () => DXC('SP');

//RRC
function RRC(){
    let lsb = regs.A[0] & 0x01;
    flags.CARRY = lsb;
    regs.A[0] = regs.A[0]>>1;
    regs.A[0] = regs.A[0] | lsb<<7;
    buildFlagRegister();
}
ops[0x0F] = () => RRC();


//RAR
function RAR(){
    let lsb = regs.A[0] & 0x01;
    regs.A[0] = regs.A[0] >> 1;
    regs.A[0] = (flags.CARRY<<7) | regs.A[0];
    flags.CARRY = lsb;
    buildFlagRegister();
}
ops[0x1F] = () => RAR();

//CMA
function CMA(){
    regs.A[0] = 0xFF - regs.A[0];
}
ops[0x2F] = () => CMA();


//CMC
function CMC(){
    flags.CARRY = flags.CARRY?0:1;
    buildFlagRegister();
}
ops[0x3F] = () => CMC();


//MOVs 0x40-0x7F
function MOV(dst,src){
    regs[dst][0] = regs[src][0];
}
function MOV_X_M(dst){
    regs[dst][0] = memory[regs.HL[0]];
} 
function MOV_M_X(src){
    memory[regs.HL[0]] = regs[src][0];
}
ops[0x40] = () => MOV('B','B');
ops[0x41] = () => MOV('B','C');
ops[0x42] = () => MOV('B','D');
ops[0x43] = () => MOV('B','E');
ops[0x44] = () => MOV('B','H');
ops[0x45] = () => MOV('B','L');
ops[0x46] = () => MOV_X_M('B');
ops[0x47] = () => MOV('B','A');
ops[0x48] = () => MOV('C','B');
ops[0x49] = () => MOV('C','C');
ops[0x4A] = () => MOV('C','D');
ops[0x4B] = () => MOV('C','E');
ops[0x4C] = () => MOV('C','H');
ops[0x4D] = () => MOV('C','L');
ops[0x4E] = () => MOV_X_M('C');
ops[0x4F] = () => MOV('C','A');
ops[0x50] = () => MOV('D','B');
ops[0x51] = () => MOV('D','C');
ops[0x52] = () => MOV('D','D');
ops[0x53] = () => MOV('D','E');
ops[0x54] = () => MOV('D','H');
ops[0x55] = () => MOV('D','L');
ops[0x56] = () => MOV_X_M('D');
ops[0x57] = () => MOV('D','A');
ops[0x58] = () => MOV('E','B');
ops[0x59] = () => MOV('E','C');
ops[0x5A] = () => MOV('E','D');
ops[0x5B] = () => MOV('E','E');
ops[0x5C] = () => MOV('E','H');
ops[0x5D] = () => MOV('E','L');
ops[0x5E] = () => MOV_X_M('E');
ops[0x5F] = () => MOV('E','A');
ops[0x60] = () => MOV('H','B');
ops[0x61] = () => MOV('H','C');
ops[0x62] = () => MOV('H','D');
ops[0x63] = () => MOV('H','E');
ops[0x64] = () => MOV('H','H');
ops[0x65] = () => MOV('H','L');
ops[0x66] = () => MOV_X_M('H');
ops[0x67] = () => MOV('H','A');
ops[0x68] = () => MOV('L','B');
ops[0x69] = () => MOV('L','C');
ops[0x6A] = () => MOV('L','D');
ops[0x6B] = () => MOV('L','E');
ops[0x6C] = () => MOV('L','H');
ops[0x6D] = () => MOV('L','L');
ops[0x6E] = () => MOV_X_M('L');
ops[0x6F] = () => MOV('L','A');
ops[0x70] = () => MOV_M_X('B');
ops[0x71] = () => MOV_M_X('C');
ops[0x72] = () => MOV_M_X('D');
ops[0x73] = () => MOV_M_X('E');
ops[0x74] = () => MOV_M_X('H');
ops[0x75] = () => MOV_M_X('L');
ops[0x76] = () => HLT();
ops[0x77] = () => MOV_M_X('A');
ops[0x78] = () => MOV('A','B');
ops[0x79] = () => MOV('A','C');
ops[0x7A] = () => MOV('A','D');
ops[0x7B] = () => MOV('A','E');
ops[0x7C] = () => MOV('A','H');
ops[0x7D] = () => MOV('A','L');
ops[0x7E] = () => MOV_X_M('A');
ops[0x7F] = () => MOV('A','A');

//HLT
function HLT(){
    wait_for_interrupt = true;
}

function carry(bit_no, a, b, cy) {
    let result = a + b + cy;
    let res = result ^ a ^ b;
    return ((res & (1 << bit_no))>0)?1:0;
}

//ADDs 0x80 - 0x87
function ADD(to_add){
    tmp = (regs.A[0] + to_add)&0xFF;
    flags.CARRY = carry(8, regs.A[0], to_add, 0);
    flags.AUXCARRY = carry(4, regs.A[0], to_add, 0);
    checkFlags(tmp, ['Z','P','S']);
    regs.A[0] = tmp;
}
ops[0x80] = () => ADD(regs['B'][0]);
ops[0x81] = () => ADD(regs['C'][0]);
ops[0x82] = () => ADD(regs['D'][0]);
ops[0x83] = () => ADD(regs['E'][0]);
ops[0x84] = () => ADD(regs['H'][0]);
ops[0x85] = () => ADD(regs['L'][0]);
ops[0x86] = () => ADD(read_one_byte(regs.HL[0]));
ops[0x87] = () => ADD(regs['A'][0]);

//ADCs 0x88 - 0x8F
function ADC(val){
    tmp = regs.A[0] + val + flags.CARRY;
    flags.CARRY = carry(8, regs.A[0], val, flags.CARRY);
    flags.AUXCARRY = carry(4, regs.A[0], val, flags.CARRY);
    checkFlags(tmp ,['Z','P','S']);
    regs.A[0] = tmp;
}
ops[0x88] = () => ADC(regs['B'][0]);
ops[0x89] = () => ADC(regs['C'][0]);
ops[0x8A] = () => ADC(regs['D'][0]);
ops[0x8B] = () => ADC(regs['E'][0]);
ops[0x8C] = () => ADC(regs['H'][0]);
ops[0x8D] = () => ADC(regs['L'][0]);
ops[0x8E] = () => ADC(read_one_byte(regs.HL[0]));
ops[0x8F] = () => ADC(regs['A'][0]);


//SUBs 0x90-0x97
function SUB(to_sub){
////console.log(to_sub ,~to_sub);
    ADD((~to_sub)+1);
    flags.CARRY = flags.CARRY?0:1;
}
ops[0x90] = () => SUB(regs['B'][0]);
ops[0x91] = () => SUB(regs['C'][0]);
ops[0x92] = () => SUB(regs['D'][0]);
ops[0x93] = () => SUB(regs['E'][0]);
ops[0x94] = () => SUB(regs['H'][0]);
ops[0x95] = () => SUB(regs['L'][0]);
ops[0x96] = () => SUB(read_one_byte(regs.HL[0]));
ops[0x97] = () => SUB(regs['A'][0]);


//SBBs 0x98-0x9F
function SBB(to_sub){
    SUB(to_sub+flags.CARRY)
}
ops[0x98] = () => SBB(regs['B'][0]);
ops[0x99] = () => SBB(regs['C'][0]);
ops[0x9A] = () => SBB(regs['D'][0]);
ops[0x9B] = () => SBB(regs['E'][0]);
ops[0x9C] = () => SBB(regs['H'][0]);
ops[0x9D] = () => SBB(regs['L'][0]);
ops[0x9E] = () => SBB(read_one_byte(regs.HL[0]));
ops[0x9F] = () => SBB(regs['A'][0]);


//ANAs 0xA0-0xA7
function ANA(val){
    tmp = regs.A[0] & val;
    flags.CARRY = 0;
    flags.AUXCARRY = (((regs.A[0] | val) & 0x08) != 0)?0:1;
    checkFlags(tmp, ['Z','S','P']);
    regs.A[0] = tmp;
}

ops[0xA0] = () => ANA(regs.B[0]);
ops[0xA1] = () => ANA(regs.C[0]);
ops[0xA2] = () => ANA(regs.D[0]);
ops[0xA3] = () => ANA(regs.E[0]);
ops[0xA4] = () => ANA(regs.H[0]);
ops[0xA5] = () => ANA(regs.L[0]);
ops[0xA6] = () => ANA(read_one_byte(regs.HL[0]));
ops[0xA7] = () => ANA(regs.A[0]);

//XRAs 0xA8-0xAF
function XRA(val){
    tmp = regs.A[0] ^ val;
    flags.CARRY = 0;
    flags.AUXCARRY = 0;
    checkFlags(tmp,['Z','S','P']);
    regs.A[0] = tmp;
}
ops[0xA8] = () => XRA(regs.B[0]);
ops[0xA9] = () => XRA(regs.C[0]);
ops[0xAA] = () => XRA(regs.D[0]);
ops[0xAB] = () => XRA(regs.E[0]);
ops[0xAC] = () => XRA(regs.H[0]);
ops[0xAD] = () => XRA(regs.L[0]);
ops[0xAE] = () => XRA(read_one_byte(regs.HL[0]));
ops[0xAF] = () => XRA(regs.A[0]);

//ORAs 0xB0-0xB7
function ORA(val){
    tmp = regs.A[0] | val;
    flags.CARRY = 0;
    flags.AUXCARRY = 0;
    checkFlags(tmp, ['Z','S','P']);
    regs.A[0] = tmp;
}
ops[0xB0] = () => ORA(regs['B'][0]);
ops[0xB1] = () => ORA(regs['C'][0]);
ops[0xB2] = () => ORA(regs['D'][0]);
ops[0xB3] = () => ORA(regs['E'][0]);
ops[0xB4] = () => ORA(regs['H'][0]);
ops[0xB5] = () => ORA(regs['L'][0]);
ops[0xB6] = () => ORA(read_one_byte(regs.HL[0]));
ops[0xB7] = () => ORA(regs['A'][0]);

//CMP 0xB8-0xBF
function CMP(to_compare){
    let result = regs.A[0] - to_compare;
    flags.CARRY = (result>>8)&0x01;
    flags.AUXCARRY = (~(regs.A[0] ^ result ^ to_compare) & 0x10)>0?1:0;
    ////console.log((result&0xFF),result,)
    checkFlags((result&0xFF), ['Z','S','P']);
}
ops[0xB8] = () => CMP(regs['B'][0]);
ops[0xB9] = () => CMP(regs['C'][0]);
ops[0xBA] = () => CMP(regs['D'][0]);
ops[0xBB] = () => CMP(regs['E'][0]);
ops[0xBC] = () => CMP(regs['H'][0]);
ops[0xBD] = () => CMP(regs['L'][0]);
ops[0xBE] = () => CMP(read_one_byte(regs.HL[0]));
ops[0xBF] = () => CMP(regs['A'][0]);


//RN[X]s
function RNX(flag){
    if(!flags[flag]){
        regs.PC[0] = memory[regs.SP[0]+1]<<8 | memory[regs.SP[0]];
        regs.SP[0] += 2;
    }
}
ops[0xC0] = () => RNX('ZERO');
ops[0xD0] = () => RNX('CARRY');
ops[0xE0] = () => RNX('PARITY')
ops[0xF0] = () => RNX('SIGN')


//POPs
function POP(dest){
    regs[dest][0] = memory[regs.SP[0]+1]<<8 | memory[regs.SP[0]];
    regs.SP[0] += 2;
}
ops[0xC1] = () => POP('BC');
ops[0xD1] = () => POP('DE');
ops[0xE1] = () => POP('HL');

//POP PSW
function POP_PSW(){
    regs.F[0] = memory[regs.SP[0]];
    regs.A[0] = memory[regs.SP[0]+1];
    regs.SP[0] += 2;
    parseRegFToFlags()
}
ops[0xF1] = () => POP_PSW();

//JNZ
function JNZ(addr){
    if(!flags.ZERO){
        regs.PC[0] = addr;
    }
}
ops[0xC2] = () => JNZ(read_two_bytes_and_inc_pc());

//JNC
function JNC(addr){
    if(!flags.CARRY){
        regs.PC[0] = addr;
    }
}
ops[0xD2] = () => JNC(read_two_bytes_and_inc_pc());

//JPO
function JPO(addr){
    if(!flags.PARITY){
        regs.PC[0] = addr;
    }
}
ops[0xE2] = () => JPO(read_two_bytes_and_inc_pc());

//JP
function JP(addr){
    if(!flags.SIGN){
        regs.PC[0] = addr;
    }
}
ops[0xF2] = () => JP(read_two_bytes_and_inc_pc());

//JMP
function JMP(addr){
    regs.PC[0]  = addr;
}
ops[0xC3] = () => JMP(read_two_bytes_and_inc_pc());

//OUT
function OUT(bus_address){
    write_to_port(regs.A[0],bus_address);
}
ops[0xD3] = () => OUT(read_one_byte_and_inc_pc());

//XTHL
function XTHL(){
    let tmp = regs.L[0];
    regs.L[0] = memory[regs.SP[0]];
    memory[regs.SP[0]] = tmp;

    tmp = regs.H[0];
    regs.H[0] = memory[regs.SP[0]+1];
    memory[regs.SP[0]+1] = tmp;
}
ops[0xE3] = () => XTHL();

//DI
function DI(){
    cpu.iff = false;
}
ops[0xF3] = () => DI();

//CNZ
function CNZ(address){
    if(!flags.ZERO){
        PUSH(regs.PC[0]);
        regs.PC[0] = address;

    }
}
ops[0xC4] = () => CNZ(read_two_bytes_and_inc_pc());

//CNC
function CNC(address){
    if(!flags.CARRY){
        PUSH(regs.PC[0]);
        regs.PC[0] = address;
    }
}
ops[0xD4] = () => CNC(read_two_bytes_and_inc_pc());

//CPO
function CPO(address){
    if(!flags.PARITY){
        PUSH(regs.PC[0]);
        regs.PC[0] = address;
    }
}
ops[0xE4] = () => CPO(read_two_bytes_and_inc_pc());

//CP
function CP(address){
    if(!flags.SIGN){
        PUSH(regs.PC[0]);
        regs.PC[0] = address;
    }
}
ops[0xF4] = () => CP(read_two_bytes_and_inc_pc());



//PUSH
function PUSH(word){
    regs.SP[0] -= 2;
    memory[regs.SP[0]+1] = word >> 8;
    memory[regs.SP[0]] = word & 0xFF;
}
ops[0xC5] = () => PUSH(regs['BC'][0]);
ops[0xD5] = () => PUSH(regs['DE'][0]);
ops[0xE5] = () => PUSH(regs['HL'][0]);
ops[0xF5] = () => PUSH(regs['AF'][0]);


//ADI
function ADI(to_add){
    tmp = (regs.A[0] + to_add) & 0xFF;
    flags.CARRY = carry(8, regs.A[0], to_add, 0);
    flags.AUXCARRY = carry(4, regs.A[0], to_add, 0);
    checkFlags(tmp,['S','Z','P']);
    regs.A[0] = tmp;
}
ops[0xC6] = () => ADI(read_one_byte_and_inc_pc());

//SUI
function SUI(to_substract){
    /*
    tmp = regs.A[0] - to_substract;
    checkFlags(tmp);
    regs.A[0] = tmp;
    */
   ADI(~to_substract+1);
   flags.CARRY = flags.CARRY?0:1;

}
ops[0xD6] = () => SUI(read_one_byte_and_inc_pc());

//ANI
function ANI(to_and){

    tmp = regs.A[0]&to_and;  
    flags.CARRY = 0;
    flags.AUXCARRY = (((regs.A[0] | to_and) & 0x08) != 0)?1:0;
    checkFlags(tmp, ['Z','P','S']);

    regs.A[0] = tmp;
}
ops[0xE6] = () => ANI(read_one_byte_and_inc_pc());


//ORI
function ORI(to_or){
    flags.CARRY = 0;
    flags.AUXCARRY = 0;
    tmp = regs.A[0]|to_or;
    checkFlags(tmp);
    regs.A[0] = tmp;
}
ops[0xF6] = () => ORI(read_one_byte_and_inc_pc());


//RST
function RST(offset){
    memory[regs.SP[0]] = regs.PC[0];
    regs.SP[0] -= 1;
    regs.PC[0] = 8*offset;
}
ops[0xC7] = () => RST(0);
ops[0xD7] = () => RST(2);
ops[0xE7] = () => RST(4);
ops[0xF7] = () => RST(6);
ops[0xCF] = () => RST(1);
ops[0xDF] = () => RST(3);
ops[0xEF] = () => RST(5);
ops[0xFF] = () => RST(7);

//RZ RC
function RZ(){
    if(flags.ZERO){
        RET();   
    }
}
ops[0xC8] = () => RZ();

function RC(){
    if(flags.CARRY){
        RET();    
    }
}
ops[0xD8] = () => RC();


//RPE
function RPE(){
    if(flags.PARITY){
        RET();    
    }
}
ops[0xE8] = () => RPE();

//RM
function RM(){
    if(flags.SIGN){
        RET();
    }
}
ops[0xF8] = () => RM();

//RET
function RET(){
    regs.PC[0] = memory[regs.SP[0]+1] << 8 | memory[regs.SP[0]];
    regs.SP[0] += 2;
}
ops[0xC9] = () => RET();
ops[0xD9] = () => RET();
//0xD9 *RET == NOTHING?

//PCHL
function PCHL(){
    regs.PC[0] = regs.HL[0];
}
ops[0xE9] = () => PCHL();

//SPHL
function SPHL(){
    regs.SP[0] = regs.HL[0];
}
ops[0xF9] = () => SPHL();


//JZ
function JZ(jump_to){
    if(flags.ZERO){
        ////console.log("jz flag is ", flags.ZERO)
        regs.PC[0] = jump_to;
    }
}
ops[0xCA] = () => JZ(read_two_bytes_and_inc_pc());

//JC
function JC(jump_to){
    if(flags.CARRY){
        regs.PC[0] = jump_to;
    }
}
ops[0xDA] = () => JC(read_two_bytes_and_inc_pc());

//JPE
function JPE(jump_to){
    if(flags.PARITY){
        regs.PC[0] = jump_to;
    }
}
ops[0xEA] = () => JPE(read_two_bytes_and_inc_pc());


//JM
function JM(jump_to){
    if(flags.SIGN){
        regs.PC[0] = jump_to;
    }
}
ops[0xFA] = () => JM(read_two_bytes_and_inc_pc());

ops[0xCB] = () => JMP(read_two_bytes_and_inc_pc());

//IN TODO devices
function IN(bus_address){
    regs.A[0] = read_from_port(bus_address);

}
ops[0xDB] = () => IN(read_one_byte_and_inc_pc());

//XCHG
function XCHG(){
    let temp = regs.HL[0];
    regs.HL[0] = regs.DE[0];
    regs.DE[0] = temp;
}
ops[0xEB] = () => XCHG();

//EI
function EI(){
    cpu.iff = true;
}
ops[0xFB] = () => EI();

//CZ
function CZ(jump_to){
    if(flags.ZERO){
        CALL(jump_to);
    }
}
ops[0xCC] = () => CZ(read_two_bytes_and_inc_pc());


//CC
function CC(jump_to){
    if(flags.CARRY){
        CALL(jump_to);
    }
}
ops[0xDC] = () => CC(read_two_bytes_and_inc_pc());

//CPE
function CPE(jump_to){
    if(flags.PARITY){
        CALL(jump_to);
    }
}
ops[0xEC] = () => CPE(read_two_bytes_and_inc_pc());

//CM
function CM(jump_to){
    if(flags.SIGN){
        CALL(jump_to);
    }
}
ops[0xFC] = () => CM(read_two_bytes_and_inc_pc());

//CALL
function CALL(to_call){
    regs.SP[0] -= 2;
    memory[regs.SP[0]+1] = regs.PC[0] >> 8;
    memory[regs.SP[0]] = regs.PC[0] & 0xFF;
    regs.PC[0] = to_call;
}
ops[0xCD] = () => CALL(read_two_bytes_and_inc_pc());
ops[0xDD] = () => CALL(read_two_bytes_and_inc_pc());
ops[0xED] = () => CALL(read_two_bytes_and_inc_pc());
ops[0xFD] = () => CALL(read_two_bytes_and_inc_pc());

//ACI
function ACI(to_add){
    tmp = (regs.A[0] + to_add + flags.CARRY)&0xff;
    let cy = flags.CARRY; 
    flags.CARRY = carry(8, regs.A[0], to_add, cy);
    flags.AUXCARRY = carry(4, regs.A[0], to_add, cy);
    checkFlags(tmp,['S','Z','P']);
    regs.A[0] = tmp;
}
ops[0xCE] =  () => ACI(read_one_byte_and_inc_pc());

//SBI
function SBI(to_sub){
    tmp = (regs.A[0] - to_sub - flags.CARRY)&0xff;
    let cy = flags.CARRY; 
    flags.CARRY = carry(8, regs.A[0], ~to_sub, !cy)?0:1;
    flags.AUXCARRY = carry(4, regs.A[0], ~to_sub, !cy);
    checkFlags(tmp,['S','Z','P']);
    regs.A[0] = tmp;

}
ops[0xDE] = () => SBI(read_one_byte_and_inc_pc());

//XRI
function XRI(to_xor){
    regs.A[0] = regs.A[0] ^ to_xor;
    flags.CARRY = 0;
    flags.AUXCARRY = 0;
    checkFlags(tmp,['S','Z','P']);
}
ops[0xEE] = () => XRI(read_one_byte_and_inc_pc());

//CPI
function CPI(to_compare){
    tmp = regs.A[0] - to_compare;
    flags.CARRY = (tmp>>8)&0x1;
    flags.AUXCARRY = (~(regs.A[0] ^ tmp ^ to_compare) & 0x10)>0?1:0;
    checkFlags(tmp&0xFF,['S','Z','P']);
}
ops[0xFE] = () => CPI(read_one_byte_and_inc_pc());


function read_one_byte_and_inc_pc(){
    let byte = memory[regs.PC[0]];
    ////console.log('one byte',byte);
    regs.PC[0] += 1;
    return byte;
}

function read_two_bytes_and_inc_pc(){
    let byte1 = read_one_byte_and_inc_pc();
    let byte2 = read_one_byte_and_inc_pc();
    ////console.log('two bytes', (byte2<<8)|byte1, (byte1<<8)|byte2);
    return (byte2<<8)|byte1;
}


function read_one_byte(addr){
    return memory[addr];
}

function read_two_bytes(addr){
    let byte1 = read_one_byte(addr);
    let byte2 = read_one_byte(addr+1);
    ////console.log(('two bytes no inc', (byte2<<8)|byte1));
    return ((byte2<<8)|byte1);
}

function checkFlags(accu, flags_affcted = ['S','Z','A','P','C']){
    //SIGN
    if(flags_affcted.includes('S')){
        flags.SIGN = (accu&0xFF)>>7;
    }
    
    //ZERO
    if(flags_affcted.includes('Z')){
        if(accu==0){
            flags.ZERO = 1;
        }
        else{
            flags.ZERO = 0;
        }
    }
    
    //AUXCarry
    
    //PARITY
    if(flags_affcted.includes('P')){

        /*
        flags.PARITY = 1;
        let acc_cpy = (Number.parseInt(accu&0xFF)).toString(2).replace('-','0');
 //       ////console.log(accu,acc_cpy)
        for(let bit of acc_cpy){
            flags.PARITY = (flags.PARITY + Number.parseInt(bit)) % 2;
        }
        */
        let nb_one_bits = 0;
        for (let i = 0; i < 8; i++) {
            nb_one_bits += ((accu >> i) & 1);
        }
        
        flags.PARITY = ((nb_one_bits & 1) == 0)?1:0;
            
    }
    

    //CARRY
    if(flags_affcted.includes('C')){
        flags.CARRY = (accu>>8)&0x01;
    }
    
    regs.F[0] = (flags.SIGN<<7) | (flags.ZERO<<6) | (0<<5) | (flags.AUXCARRY<<4) | (0<<3) | (flags.PARITY<<2) | (1<<1) | flags.CARRY;

}

function buildFlagRegister(){
    regs.F[0] = (flags.SIGN<<7) | (flags.ZERO<<6) | (0<<5) | (flags.AUXCARRY<<4) | (0<<3) | (flags.PARITY<<2) | (1<<1) | flags.CARRY;
}

function parseRegFToFlags(){
    flags.SIGN = (regs.F[0]>>7) &0x01;
    flags.ZERO = (regs.F[0]>>6) &0x01;
    flags.AUXCARRY = (regs.F[0]>>4) &0x01;
    flags.PARITY = (regs.F[0]>>2) &0x01;
    flags.CARRY = (regs.F[0] & 0x01);
}

function getByteFromMem(addr){
    return memory[addr];
}
//this part configureds the 8080 with a terminal? to run the test roms


function rb(addr){
    return memory[addr];
}

function wb(addr, val){
    memory[addr] = val;
}




var test_finished = 0;
function write_to_port(a,port){

    if(port == 0){
        test_finished = 1;
        console.log('test_finished')
    }
    else if (port == 1){
        let op = regs.C[0];


        if(op == 2){
            let char = number2Char(regs.E[0]);
            stdo.innerHTML += char;
        }
        if(op == 9){
            let addr = regs.DE[0];
            let char = null;
            do {
                char = number2Char(rb(addr));
                stdo.innerHTML += char;

                //console.log(`${char}`);
                addr+=1;
            }while(number2Char(rb(addr)) != '$');
            stdo.innerHTML += '\n';
        }
    }

}


function init_test(){


    memory.set(loaded_file,0x100);

    i8080_init();
    regs.PC[0] = 0x100;

    // inject "out 0,a" at 0x0000 (signal to stop the test)
    memory[0x0000] = 0xD3;
    memory[0x0001] = 0x00;

    // inject "out 1,a" at 0x0005 (signal to output some characters)
    memory[0x0005] = 0xD3;
    memory[0x0006] = 0x01;
    memory[0x0007] = 0xC9;

    
    test_finished = 0;
    loaded = true;
    
}
var steps_taken = 0;

function run_test(){
    init_test();

    steps_taken = 0;
    stepper();
}

function stepper(){
    while(!test_finished && loaded && steps_taken<stop_at) {
        one_step();

        if(steps_taken%2500 == 0){
            setTimeout(()=>{
                console.log('steps',steps_taken);
                stepper();
            },5)
            break;
        }
    }
}

function stop(){
    test_finished=true;
    debug_dom.call();
}

var loaded = false;
function one_step(){

    if(loaded){
        i8080_step();
        steps_taken++;
        if(enable_debug && debug_dom){
            debug_dom.call();
        }
    }

}


function number2Char(int){
    return String.fromCharCode(int);
}

/*
function bin2String(array) {
    var result = "";
    for (var i = 0; i < array.length; i++) {
      result += String.fromCharCode(parseInt(array[i], 2));
    }
    return result;
}
*/
//this part controls the elements on the html page


var output = document.getElementById('output');
var stdo = document.getElementById('stdo');



var loaded_file = load_binary_resource("roms/TST8080.COM");
var loaded = true;

console.log_ext = (msg)=>{
    //console.log(msg);
    output.value += msg+"\n";
}

document.getElementById('rom_select').addEventListener('change', (e)=>{
	//console.log(e);
	let selected_rom = e.target.options.selectedIndex;
	selected_rom = e.target.options[selected_rom].value;
	loaded_file = load_binary_resource(selected_rom);
    init_test();
});

document.getElementById('file_input').addEventListener('change', (e)=>{
    //console.log(e);

    var fr = new FileReader();
    fr.readAsArrayBuffer(e.target.files[0]);
    fr.onload = () => {
        loaded_file =  new Uint8Array(fr.result);
        init_test();
    }
})

document.getElementById('enable_debug').addEventListener('change', (e)=>{

    if(e.target.checked){
        enable_debug = true;
    }
    else{
        enable_debug = false;
    }


})


var stop_at = 0xffffffff;

//EXAMPLE PART ONE FIXED FILE
function run_example(){
    stop_at = Number.parseInt(document.getElementById("stop_at").value);
	//console.log("qwert");
    run_test();
}

function run_example_full(){
	//console.log("asd");
    run_test();
}

const domA = document.getElementById('regA');
const domF = document.getElementById('regF');
const domB = document.getElementById('regB');
const domC = document.getElementById('regC');
const domD = document.getElementById('regD');
const domE = document.getElementById('regE');
const domH = document.getElementById('regH');
const domL = document.getElementById('regL');

const domHL = document.getElementById('regHL');
const domPC = document.getElementById('regPC');
const domSP = document.getElementById('regSP');

const domfS = document.getElementById('flagS');
const domfZ = document.getElementById('flagZ');
const domfA = document.getElementById('flagA');
const domfP = document.getElementById('flagP');
const domfC = document.getElementById('flagC');


var enable_debug = false;

function debug_dom(){
    
    domA.innerHTML = regs.A[0].toString(16);
    domF.innerHTML = regs.F[0].toString(16);
    domB.innerHTML = regs.B[0].toString(16);
    domC.innerHTML = regs.C[0].toString(16);
    domD.innerHTML = regs.D[0].toString(16);
    domE.innerHTML = regs.E[0].toString(16);
    domH.innerHTML = regs.H[0].toString(16);
    domL.innerHTML = regs.L[0].toString(16);
    domHL.innerHTML = regs.HL[0].toString(16);
    domPC.innerHTML = regs.PC[0].toString(16);
    domSP.innerHTML = regs.SP[0].toString(16);
    

/*
    domA.innerHTML = regs.A[0];
    domF.innerHTML = regs.F[0];
    domB.innerHTML = regs.B[0];
    domC.innerHTML = regs.C[0];
    domD.innerHTML = regs.D[0];
    domE.innerHTML = regs.E[0];
    domH.innerHTML = regs.H[0];
    domL.innerHTML = regs.L[0];
    domPC.innerHTML = regs.PC[0];
    domSP.innerHTML = regs.SP[0];
*/
    domfS.innerHTML = flags.SIGN;
    domfZ.innerHTML = flags.ZERO;
    domfA.innerHTML = flags.AUXCARRY;
    domfP.innerHTML = flags.PARITY;
    domfC.innerHTML = flags.CARRY;
}


function load_binary_resource(url) {
    var byteArray = [];
    var req = new XMLHttpRequest();
    req.open('GET', url, false);
    req.overrideMimeType('text\/plain; charset=x-user-defined');
    req.send(null);
    if (req.status != 200) return byteArray;
    for (var i = 0; i < req.responseText.length; ++i) {
    byteArray.push(req.responseText.charCodeAt(i) & 0xff)
    }

    tmp = new Uint8Array(byteArray);

    return tmp;
}
