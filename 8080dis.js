//I havea a stack that goes up as bytes get added<br>
//SP always point to next "empty" position to write to (post increase i think it called)<br> 
var memory_shared_buffer = new SharedArrayBuffer(0x10000);
var memory_s = new Int8Array(memory_shared_buffer);
var memory_u = new Uint8Array(memory_shared_buffer);

var PC = 0;

var d_ops = [];

//NOPs
function NOP(){
    console.log_ext(`${PC} NOP`);
}
d_ops[0x00] = () => NOP();
d_ops[0x10] = () => NOP();
d_ops[0x20] = () => NOP();
d_ops[0x30] = () => NOP();

d_ops[0x08] = () => NOP();
d_ops[0x18] = () => NOP();
d_ops[0x28] = () => NOP();
d_ops[0x38] = () => NOP();


//LXIs
function LXI(dst,src){
    console.log_ext(`${PC} LXI ${dst} ${src}`);
}
//LXI B
d_ops[0x01] = () => LXI('BC',read_two_bytes());
//LXI D
d_ops[0x11] = () => LXI('DE',read_two_bytes());
//LXI H
d_ops[0x21] = () => LXI('HL',read_two_bytes());
//LXI SP
d_ops[0x31] = () => LXI('SP',read_two_bytes());


//STAXs
function STAX(mem_addr){
    console.log_ext(`${PC} STAX ${mem_addr}`);
}
d_ops[0x02] = () => STAX('BC');
d_ops[0x12] = () => STAX('DC');

//SHLD
function SHLD(dest){
    console.log_ext(`${PC} SHLD ${dest}`);
}
d_ops[0x22] = () => SHLD(read_two_bytes());

//STA
function STA(dest){
    console.log_ext(`${PC} STA ${dest}`);
}
d_ops[0x32] = () => STA(read_two_bytes());

//INXs
function INX(dest){
    console.log_ext(`${PC} INX ${dest}`);
}
d_ops[0x03] = () => INX('BC');
d_ops[0x13] = () => INX('DE');
d_ops[0x23] = () => INX('HL');
d_ops[0x33] = () => INX('SP');

//INRs
function INR(dest){
    console.log_ext(`${PC} INR ${dest}`);
}
d_ops[0x04] = () => INR('B');
d_ops[0x14] = () => INR('D');
d_ops[0x24] = () => INR('H');
d_ops[0x34] = () => INR('M');

d_ops[0x0C] = () => INR('C');
d_ops[0x1C] = () => INR('E');
d_ops[0x2C] = () => INR('L');
d_ops[0x3C] = () => INR('A');


//DCRs
function DCR(dest){
    console.log_ext(`${PC} DCR ${dest}`);
}
d_ops[0x05] = () => DCR('B');
d_ops[0x15] = () => DCR('D');
d_ops[0x25] = () => DCR('H');
d_ops[0x35] = () => DCR('M');

d_ops[0x0D] = () => DCR('C');
d_ops[0x1D] = () => DCR('E');
d_ops[0x2D] = () => DCR('L');
d_ops[0x3D] = () => DCR('A');


//MVIs
function MVI(dest,val){
    console.log_ext(`${PC} MVI ${dest}, ${val}`);
}
d_ops[0x06] = () => MVI('B',read_one_byte());
d_ops[0x16] = () => MVI('D',read_one_byte());
d_ops[0x26] = () => MVI('H',read_one_byte());
d_ops[0x36] = () => MVI('M',read_one_byte());

d_ops[0x0E] = () => MVI('C',read_one_byte());
d_ops[0x1E] = () => MVI('E',read_one_byte());
d_ops[0x2E] = () => MVI('L',read_one_byte());
d_ops[0x3E] = () => MVI('A',read_one_byte());


//RLC
function RLC(){
    console.log_ext(`${PC} RLC`);
}
d_ops[0x07] = () => RLC();


//RAL
function RAL(){
    console.log_ext(`${PC} RAL`);
}
d_ops[0x17] = () => RAL();


//DAA
function DAA(){
    console.log_ext(`${PC} DAA`);
}
d_ops[0x27] = () => DAA();


//STC
function STC(){
    console.log_ext(`${PC} STC`);
}
d_ops[0x37] = () => STC();

//DADs
function DAD(src){
    console.log_ext(`${PC} DAD ${src}`);
}
d_ops[0x09] = () => DAD('BC');
d_ops[0x19] = () => DAD('DE');
d_ops[0x29] = () => DAD('HL');
d_ops[0x39] = () => DAD('SP');


//LDAXs
function LDAX(src){
    console.log_ext(`${PC} LDAX ${src}`);
}
d_ops[0x0A] = () => LDAX('BC');
d_ops[0x1A] = () => LDAX('DE');


//LHLD
function LHLD(src){
    console.log_ext(`${PC} LHLD ${src}`)
}
d_ops[0x2A] = () => LHLD(read_two_bytes());

//LDA
function LDA(addr){
    console.log_ext(`${PC} LDA ${addr}`);
}
d_ops[0x3A] = () => LDA(read_two_bytes());

//DXCs
function DXC(dest){
    console.log_ext(`${PC} DXC ${dest}`);
}
d_ops[0x0B] = () => DXC('BC');
d_ops[0x1B] = () => DXC('DE');
d_ops[0x2B] = () => DXC('HL');
d_ops[0x3B] = () => DXC('SP');

//RRC
function RRC(){
    console.log_ext(`${PC} RRC`);
}
d_ops[0x0F] = () => RRC();


//RAR
function RAR(){
    console.log_ext(`${PC} RAR`);
}
d_ops[0x1F] = () => RAR();

//CMA
function CMA(){
    console.log_ext(`${PC} CMA`);
}
d_ops[0x2F] = () => CMA();


//CMC
function CMC(){
    console.log_ext(`${PC} CMC`);
}
d_ops[0x3F] = () => CMC();


//MOVs 0x40-0x7F
function MOV(dst,src){
    console.log_ext(`${PC} MOV ${dst} ${src}`);
}
d_ops[0x40] = () => MOV('B','B');
d_ops[0x41] = () => MOV('B','C');
d_ops[0x42] = () => MOV('B','D');
d_ops[0x43] = () => MOV('B','E');
d_ops[0x44] = () => MOV('B','H');
d_ops[0x45] = () => MOV('B','L');
d_ops[0x46] = () => MOV('B','M');
d_ops[0x47] = () => MOV('B','A');
d_ops[0x48] = () => MOV('C','B');
d_ops[0x49] = () => MOV('C','C');
d_ops[0x4A] = () => MOV('C','D');
d_ops[0x4B] = () => MOV('C','E');
d_ops[0x4C] = () => MOV('C','H');
d_ops[0x4D] = () => MOV('C','L');
d_ops[0x4E] = () => MOV('C','M');
d_ops[0x4F] = () => MOV('C','A');
d_ops[0x50] = () => MOV('D','B');
d_ops[0x51] = () => MOV('D','C');
d_ops[0x52] = () => MOV('D','D');
d_ops[0x53] = () => MOV('D','E');
d_ops[0x54] = () => MOV('D','H');
d_ops[0x55] = () => MOV('D','L');
d_ops[0x56] = () => MOV('D','M');
d_ops[0x57] = () => MOV('D','A');
d_ops[0x58] = () => MOV('E','B');
d_ops[0x59] = () => MOV('E','C');
d_ops[0x5A] = () => MOV('E','D');
d_ops[0x5B] = () => MOV('E','E');
d_ops[0x5C] = () => MOV('E','H');
d_ops[0x5D] = () => MOV('E','L');
d_ops[0x5E] = () => MOV('E','M');
d_ops[0x5F] = () => MOV('E','A');
d_ops[0x60] = () => MOV('H','B');
d_ops[0x61] = () => MOV('H','C');
d_ops[0x62] = () => MOV('H','D');
d_ops[0x63] = () => MOV('H','E');
d_ops[0x64] = () => MOV('H','H');
d_ops[0x65] = () => MOV('H','L');
d_ops[0x66] = () => MOV('H','M');
d_ops[0x67] = () => MOV('H','A');
d_ops[0x68] = () => MOV('L','B');
d_ops[0x69] = () => MOV('L','C');
d_ops[0x6A] = () => MOV('L','D');
d_ops[0x6B] = () => MOV('L','E');
d_ops[0x6C] = () => MOV('L','H');
d_ops[0x6D] = () => MOV('L','L');
d_ops[0x6E] = () => MOV('L','M');
d_ops[0x6F] = () => MOV('L','A');
d_ops[0x70] = () => MOV('M','B');
d_ops[0x71] = () => MOV('M','C');
d_ops[0x72] = () => MOV('M','D');
d_ops[0x73] = () => MOV('M','E');
d_ops[0x74] = () => MOV('M','H');
d_ops[0x75] = () => MOV('M','L');
d_ops[0x76] = () => HLT();
d_ops[0x77] = () => MOV('M','A');
d_ops[0x78] = () => MOV('A','B');
d_ops[0x79] = () => MOV('A','C');
d_ops[0x7A] = () => MOV('A','D');
d_ops[0x7B] = () => MOV('A','E');
d_ops[0x7C] = () => MOV('A','H');
d_ops[0x7D] = () => MOV('A','L');
d_ops[0x7E] = () => MOV('A','M');
d_ops[0x7F] = () => MOV('A','A');

//HLT
function HLT(){
    console.log_ext(`${PC} HLT`)
}


//ADDs 0x80 - 0x87
function ADD(src){
    console.log_ext(`${PC} ADD ${src}`);
}
d_ops[0x80] = () => ADD('B');
d_ops[0x81] = () => ADD('C');
d_ops[0x82] = () => ADD('D');
d_ops[0x83] = () => ADD('E');
d_ops[0x84] = () => ADD('H');
d_ops[0x85] = () => ADD('L');
d_ops[0x86] = () => ADD('M');
d_ops[0x87] = () => ADD('A');

//ADCs 0x88 - 0x8F
function ADC(src){
    console.log_ext(`${PC} ADC ${src}`);
}
d_ops[0x88] = () => ADC('B');
d_ops[0x89] = () => ADC('C');
d_ops[0x8A] = () => ADC('D');
d_ops[0x8B] = () => ADC('E');
d_ops[0x8C] = () => ADC('H');
d_ops[0x8D] = () => ADC('L');
d_ops[0x8E] = () => ADC('M')
d_ops[0x8F] = () => ADC('A')


//SUBs 0x90-0x97
function SUB(src){
    console.log_ext(`${PC} SUB ${src}`);
}
d_ops[0x90] = () => SUB('B');
d_ops[0x91] = () => SUB('C');
d_ops[0x92] = () => SUB('D');
d_ops[0x93] = () => SUB('E');
d_ops[0x94] = () => SUB('H');
d_ops[0x95] = () => SUB('L');
d_ops[0x96] = () => SUB('M');
d_ops[0x97] = () => SUB('A');


//SBBs 0x98-0x9F
function SBB(src){
    console.log_ext(`${PC} SBB ${src}`);
}
d_ops[0x98] = () => SBB('B');
d_ops[0x99] = () => SBB('C');
d_ops[0x9A] = () => SBB('D');
d_ops[0x9B] = () => SBB('E');
d_ops[0x9C] = () => SBB('H');
d_ops[0x9D] = () => SBB('L');
d_ops[0x9E] = () => SBB('M');
d_ops[0x9F] = () => SBB('A');


//ANAs 0xA0-0xA7
function ANA(src){
    console.log_ext(`${PC} ANA ${src}`);
}
d_ops[0xA0] = () => ANA('B');
d_ops[0xA1] = () => ANA('C');
d_ops[0xA2] = () => ANA('D');
d_ops[0xA3] = () => ANA('E');
d_ops[0xA4] = () => ANA('H');
d_ops[0xA5] = () => ANA('L');
d_ops[0xA6] = () => ANA('M');
d_ops[0xA7] = () => ANA('A');

//XRAs 0xA8-0xAF
function XRA(src){
    console.log_ext(`${PC} XRA ${src}`);
}
d_ops[0xA8] = () => XRA('B');
d_ops[0xA9] = () => XRA('C');
d_ops[0xAA] = () => XRA('D');
d_ops[0xAB] = () => XRA('E');
d_ops[0xAC] = () => XRA('H');
d_ops[0xAD] = () => XRA('L');
d_ops[0xAE] = () => XRA('M');
d_ops[0xAF] = () => XRA('A');

//ORAs 0xB0-0xB7
function ORA(src){
    console.log_ext(`${PC} ORA ${src}`);
}
d_ops[0xB0] = () => ORA('B');
d_ops[0xB1] = () => ORA('C');
d_ops[0xB2] = () => ORA('D');
d_ops[0xB3] = () => ORA('E');
d_ops[0xB4] = () => ORA('H');
d_ops[0xB5] = () => ORA('L');
d_ops[0xB6] = () => ORA('M');
d_ops[0xB7] = () => ORA('A');

//CMP 0xB8-0xBF
function CMP(src){
    console.log_ext(`${PC} CMP ${src}`);
}
d_ops[0xB8] = () => CMP('B');
d_ops[0xB9] = () => CMP('C');
d_ops[0xBA] = () => CMP('D');
d_ops[0xBB] = () => CMP('E');
d_ops[0xBC] = () => CMP('H');
d_ops[0xBD] = () => CMP('L');
d_ops[0xBE] = () => CMP('M');
d_ops[0xBF] = () => CMP('A');


//RN[X]s
function RNX(flag){
    console.log_ext(`${PC} RNX ${flag}`);
}
d_ops[0xC0] = () => RNX('ZERO');
d_ops[0xD0] = () => RNX('CARRY');
d_ops[0xE0] = () => RNX('PARITY')
d_ops[0xF0] = () => RNX('SIGN')


//POPs
function POP(dest){
    console.log_ext(`${PC} POP ${dest}`);
}
d_ops[0xC1] = () => POP('BC');
d_ops[0xD1] = () => POP('DE');
d_ops[0xE1] = () => POP('HL');

//POP PSW
function POP_PSW(){
    console.log_ext(`${PC} POP PSW`);
}
d_ops[0xF1] = () => POP_PSW();

//JNZ
function JNZ(addr){
    console.log_ext(`${PC} JNZ ${addr}`);
}
d_ops[0xC2] = () => JNZ(read_two_bytes());

//JNC
function JNC(addr){
    console.log_ext(`${PC} JNC ${addr}`);
}
d_ops[0xD2] = () => JNC(read_two_bytes());

//JPO
function JPO(addr){
    console.log_ext(`${PC} JPO ${addr}`);
}
d_ops[0xE2] = () => JNZ(read_two_bytes());

//JP
function JP(addr){
    console.log_ext(`${PC} JP ${addr}`);
}
d_ops[0xF2] = () => JP(read_two_bytes());

//JMP
function JMP(addr){
    console.log_ext(`${PC} JMP ${addr}`);
}
d_ops[0xC3] = () => JMP(read_two_bytes());

//OUT
function OUT(bus_address){
    console.log_ext(`${PC} OUT ${bus_address}`);
}
d_ops[0xD3] = () => OUT(read_one_byte());

//XHTL
function XHTL(){
    console.log_ext(`${PC} XHTL`);
}
d_ops[0xE3] = () => XHTL();

//DI
function DI(){
    console.log_ext(`${PC} DI`);
}
d_ops[0xF3] = () => DI();

//CNZ
function CNZ(address){
    console.log_ext(`${PC} CNZ ${address}`);
}
d_ops[0xC4] = () => CNZ(read_two_bytes());

//CNC
function CNC(address){
    console.log_ext(`${PC} CNC ${address}`);
}
d_ops[0xD4] = () => CNC(read_two_bytes());

//CPO
function CPO(address){
    console.log_ext(`${PC} CPO ${address}`);
}
d_ops[0xE4] = () => CPO(read_two_bytes());

//CP
function CP(address){
    console.log_ext(`${PC} CP ${address}`);
}
d_ops[0xF4] = () => CP(read_two_bytes());



//PUSH
function PUSH(src){
    console.log_ext(`${PC} PUSH ${src}`);
}
d_ops[0xC5] = () => PUSH('BC');
d_ops[0xD5] = () => PUSH('DE');
d_ops[0xE5] = () => PUSH('HL');
d_ops[0xF5] = () => PUSH('AF');


//ADI
function ADI(to_add){
    console.log_ext(`${PC} ADI ${to_add}`);
}
d_ops[0xC6] = () => ADI(read_one_byte());

//SUI
function SUI(to_substract){
    console.log_ext(`${PC} SUI ${to_substract}`);
}
d_ops[0xD6] = () => SUI(read_one_byte());

//ANI
function ANI(to_and){
    console.log_ext(`${PC} ANI ${to_and}`);
}
d_ops[0xE6] = () => ANI(read_one_byte());


//ORI
function ORI(to_or){
    console.log_ext(`${PC} ORI ${to_or}`);
}
d_ops[0xF6] = () => ORI(read_one_byte());


//RST
function RST(offset){
    console.log_ext(`${PC} RST ${offset}`);
}
d_ops[0xC7] = () => RST(0);
d_ops[0xD7] = () => RST(2);
d_ops[0xE7] = () => RST(4);
d_ops[0xF7] = () => RST(6);
d_ops[0xCF] = () => RST(1);
d_ops[0xDF] = () => RST(3);
d_ops[0xEF] = () => RST(5);
d_ops[0xFF] = () => RST(7);

//RZ RC
function RZ(){
    console.log_ext(`${PC} RZ`);
}
d_ops[0xC8] = () => RZ();

function RC(){
    console.log_ext(`${PC} RC`);
}
d_ops[0xD8] = () => RC();


//RPE
function RPE(){
    console.log_ext(`${PC} RPE`);
}
d_ops[0xE8] = () => RPE();

//RM
function RM(){
    console.log_ext(`${PC} RM`);
}
d_ops[0xF8] = () => RM();

//RET
function RET(){
    console.log_ext(`${PC} RET`);
}
d_ops[0xC9] = () => RET();
d_ops[0xD9] = () => RET();
//0xD9 *RET == NOTHING?

//PCHL
function PCHL(){
    console.log_ext(`${PC} PCHL`);
}
d_ops[0xE9] = () => PCHL();

//SPHL
function SPHL(){
    console.log_ext(`${PC} SPHL`);
}
d_ops[0xF9] = () => SPHL();


//JZ
function JZ(jump_to){
    console.log_ext(`${PC} JS ${jump_to}`);
}
d_ops[0xCA] = () => JZ(read_two_bytes());

//JC
function JC(jump_to){
    console.log_ext(`${PC} JC ${jump_to}`);
}
d_ops[0xDA] = () => JZ(read_two_bytes());

//JPE
function JPE(jump_to){
    console.log_ext(`${PC} JPE ${jump_to}`);
}
d_ops[0xEA] = () => JPE(read_two_bytes());


//JM
function JM(jump_to){
    console.log_ext(`${PC} JM ${jump_to}`);
}
d_ops[0xFA] = () => JM(read_two_bytes());

d_ops[0xCB] = () => JMP(read_two_bytes());


//IN TODO devices
function IN(bus_address){
    console.log_ext(`${PC} IN ${bus_address}`);
}
d_ops[0xDB] = () => IN(read_one_byte());

//XCHG
function XCHG(){
    console.log_ext(`${PC} XCHG`);
}
d_ops[0xEB] = () => XCHG();

//EI
function EI(){
    console.log_ext(`${PC} EI`);
}
d_ops[0xFB] = () => EI();

//CZ
function CZ(jump_to){
    console.log_ext(`${PC} CZ ${jump_to}`);
}
d_ops[0xCC] = () => CZ(read_two_bytes());


//CC
function CC(jump_to){
    console.log_ext(`${PC} CC ${jump_to}`);
}
d_ops[0xDC] = () => CC(read_two_bytes());

//CPE
function CPE(jump_to){
    console.log_ext(`${PC} CPE ${jump_to}`);
}
d_ops[0xEC] = () => CPE(read_two_bytes());

//CM
function CM(jump_to){
    console.log_ext(`${PC} CM ${jump_to}`);
}
d_ops[0xFC] = () => CM(read_two_bytes());

//CALL
function CALL(to_call){
    console.log_ext(`${PC} CALL ${to_call}`);
}
d_ops[0xCD] = () => CALL(read_two_bytes());
d_ops[0xDD] = () => CALL(read_two_bytes());
d_ops[0xED] = () => CALL(read_two_bytes());
d_ops[0xFD] = () => CALL(read_two_bytes());

//ACI
function ACI(to_add){
    console.log_ext(`${PC} ACI ${to_add}`);
}
d_ops[0xCE] =  () => ACI(read_one_byte());

//SBI
function SBI(to_sub){
    console.log_ext(`${PC} SBI ${to_sub}`);
}
d_ops[0xDE] = () => SBI(read_one_byte());

//XRI
function XRI(to_or){
    console.log_ext(`${PC} XRI ${to_or}`);
}
d_ops[0xEE] = () => XRI(read_one_byte());

//CPI
function CPI(to_compare){
    console.log_ext(`${PC} CPI ${to_compare}`);
}
d_ops[0xFE] = () => CPI(read_one_byte());


function read_one_byte(){
    PC += 1;
    let byte = memory_u[PC];
    return byte;
}

function read_two_bytes(){
    let byte1 = read_one_byte();
    let byte2 = read_one_byte();
    return ((byte2<<8)|byte1);
}

function main(){
    let op = 0x00;

    while(op!=0xFF){
        op = memory_u[regs.PC];
        d_ops[ops].call();
    }
}

function jsD(val){
    return (val-1)
}
function jsI(val){
    return (val+1)
}

