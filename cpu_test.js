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
