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
