import { msgConfiguraIntSiTefInterativoEx, msgVerificaPresencaPinPad } from "./msg";

var ffi = require("ffi-napi");
var ref = require("ref-napi");
var struct = require("ref-struct-di");
var array = require("ref-array-napi");
var finalize = require("finalize");
const path = require("path");
const readline = require("readline");

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
    res = await sitef.ConfiguraIntSiTefInterativoEx("127.0.0.1", "00000000", "11T3642A", "", "[ParmsClient=1=0000000000000;2=0000000000000")
    return msgConfiguraIntSiTefInterativoEx(res)
}

async function verificaPresencaPinPad(sitef: any) {
    res = await sitef.VerificaPresencaPinPad();
    return msgVerificaPresencaPinPad(res)
}

async function iniciaFuncaoSiTef(sitef: any) {
    let retorno = await sitef.IniciaFuncaoSiTefInterativo(2, "10,00" ,"0", '20220101', '000000', "operadorJoao", "", "");
    while (retorno === 10000) { // Aguarda o retorno da função
      const continua = await sitef.ContinuaFuncaoSiTefInterativo(0, 0, 0, 0, "", 0, 0)
      if (!continua) break;
      console.log("continua", continua)
    }
    return retorno;

}


async function main() {
  console.log("\n\n*** Pressione Ctrl+C para finalizar a aplicação ***");
  const dllSitef = loadLibraries();
  const sitef = ffi.Library(dllSitef, {
    ConfiguraIntSiTefInterativoEx: ["int",["string", "string", "string", "string", "string"]],
    IniciaFuncaoSiTefInterativo: ["int",["int", "string", "string", "string", "string", "string", "string", "string"]],
    VerificaPresencaPinPad: ["int",[]],
    EscreveMensagemPermanentePinPad: ["int",["string"]],
    ContinuaFuncaoSiTefInterativo: ["int",["int", "int", "int", "int", "string", "int", "int"]],
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
