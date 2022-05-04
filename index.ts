import { msgConfiguraIntSiTefInterativoEx, msgVerificaPresencaPinPad } from "./msg";

var ffi = require("ffi-napi");
var ref = require("ref-napi");
var struct = require("ref-struct-di");
var array = require("ref-array-napi");
var finalize = require("finalize");
const path = require("path");
const readline = require("readline");

var refInt = ref.types.int;
var refCString = ref.types.CString;

var buf = Buffer.alloc(1024);

//PARAMS CONFIGURAR FUNCAO SITEF//
let iPSiTef = "127.0.0.1"; 
let idLoja = "00000000";
let idTerminal = "11T3642A";
let reservado = "";
let parametrosAdicionais = "[ParmsClient=1=0000000000000;2=0000000000000]";
//PARAMS CONFIGURAR FUNCAO SITEF//

//PARAMS CONTINUA FUNCAO SITEF//
var comando = "0";
var tipoCampo = "0";
var tamMinimo = "0";
var tamMaximo = "0";
var buffer = buf;
var continua = 0;
//PARAMS CONTINUA FUNCAO SITEF//

var res = null;

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const menu = `
1 - ConfiguraIntSiTefInterativoEx,
2 - IniciaFuncaoSiTefInterativo,
3 - VerificaPresencaPinPad
4 - EscreveMensagemPermanentePinPad
`;

const NAME_DLL = "CliSiTef64I.dll";

function loadLibraries() {
  const dllSitef = path.resolve(__dirname, "bin", NAME_DLL);
  return dllSitef;
}

async function configuraSiTef(sitef: any) {
  res = await sitef.ConfiguraIntSiTefInterativoEx(iPSiTef, idLoja, idTerminal, reservado, parametrosAdicionais)
  return msgConfiguraIntSiTefInterativoEx(res)
}

async function verificaPresencaPinPad(sitef: any) {
    res = await sitef.VerificaPresencaPinPad();
    return msgVerificaPresencaPinPad(res)
}

async function iniciaFuncaoSiTef(sitef: any) {
    let funcao = 2;
    let valor = "10,00";
    let cupomFiscal = "0";
    let dataFiscal = "20220101";
    let horaFiscal = "000000";
    let operador = "João";
    let paramAdic = "";
    let retorno = await sitef.IniciaFuncaoSiTefInterativo(funcao, valor, cupomFiscal, dataFiscal, horaFiscal, operador, paramAdic);
    
    while (retorno === 10000) { // Aguarda o retorno da função
      const response = sitef.ContinuaFuncaoSiTefInterativo(comando, tipoCampo, tamMinimo, tamMaximo, buffer, buffer.length, continua)
      console.log("continua", response)
      console.log("buffer", buffer.toString('utf-8'))
      if (!response) break;
      if (response === -5) break;

    }
    return retorno;

}


async function main() {
  console.log("\n\n*** Pressione Ctrl+C para finalizar a aplicação ***");
  const dllSitef = loadLibraries();
  const sitef = ffi.Library(dllSitef, {
    ConfiguraIntSiTefInterativoEx: [refInt,[refCString, refCString, refCString, refCString, refCString]],
    IniciaFuncaoSiTefInterativo: [refInt,[refInt, refCString, refCString, refCString, refCString, refCString, refCString]],
    VerificaPresencaPinPad: [refInt,[]],
    EscreveMensagemPermanentePinPad: [refInt,[refCString]],
    ContinuaFuncaoSiTefInterativo: [refInt,[refCString, refCString, refCString, refCString, refCString, refInt, refInt]],
  });
  let leitor = async function () {
    rl.question(menu, async function (comando: string) {
      switch (comando) {
        case "1":
            let ret = await configuraSiTef(sitef);
            console.log(ret)
            break;
        case "2":
            let ret2 = await iniciaFuncaoSiTef(sitef);
            console.log(ret2)
          break;
        case "3":
            let ret3 = await verificaPresencaPinPad(sitef);
            console.log(ret3)
          break;
        case "4":
            let ret4 = await sitef.EscreveMensagemPermanentePinPad("Testando DLL");
            console.log(ret4)
          break;
        case "5":
          console.log(ref)
          break;
        case "6":
          break;
        case "7":
          break;
        default:
          break;
      }
      leitor();
    });
  };
  leitor();
}

console.log(`Aplicação de demonstração Sitef com integração para NodeJS rodando no sistema operation Windows.`);
console.log(`Testado no Windows 11, com Node 16.14.0 64 Bits.`);
main();
