export function msgConfiguraIntSiTefInterativoEx(res: number) {
    switch (res) {
        case 0:
            return `${res} - Não ocorreu erro`;
        case 1:
            return `${res} - Endereço IP inválido ou não resolvido`;
        case 2:
            return `${res} - Código da loja inválido`;
        case 3:
            return `${res} - Código de terminal inválido`;
        case 6:
            return `${res} - Erro na inicialização do Tcp/Ip`;
        case 7:
            return `${res} - Falta de memória`;
        case 8:
            return `${res} - Não encontrou a CliSiTef ou ela está com problemas`;
        case 9:
            return `${res} - Configuração de servidores SiTef foi excedida`;
        case 10:
            return `${res} - Erro de acesso na pasta CliSiTef (possível falta de permissão para escrita)`;
        case 11:
            return `${res} - Dados inválidos passados pela automação.`;
        case 12:
            return `${res} - Modo seguro não ativo (possível falta de configuração no servidor SiTef do arquivo .cha).`;
        case 13:
            return `${res} - Caminho DLL inválido (o caminho completo das bibliotecas está muito grande).`;
        default:
            return `${res} - Erro desconhecido`;
    }
  }


  export function msgVerificaPresencaPinPad(res: number) {
    switch (res) {
        case 0:
            return `${res} - Não existe um PinPad conectado ao micro;`;
        case 1:
            return `${res} -  Existe um PinPad operacional conectado ao micro;`;
        case -1:
            return `${res} - Biblioteca de acesso ao PinPad não encontrada;`;
        default:
            return `${res} - Erro desconhecido`;
    }
  }