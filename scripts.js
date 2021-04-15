let usuario = null;
let paraQuem = "Todos";
const divBatePapo = document.querySelector(".bate-papo");

function aoEntrar () {
    usuario = prompt("Qual é o seu nome?") 
    validaçãoUsuario(usuario)  
}

function validaçãoUsuario (usuario) {
    const dados = {
        name: usuario
    }
    const requisicao = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants", dados)
    requisicao.then(buscaMensagens)  
    requisicao.catch(trataErroLogin)
}

function trataErroLogin (erro){
    const statusCode = erro.response.status
    if (statusCode === 400) { 
        alert("Digite outro nome, o que você escolheu já está em uso!")    
        aoEntrar()
    }    
}

function enviaMensagem () {
    const texto = document.querySelector(".inputbase");
    const textoDigitado = texto.value;
    
    const mensagem = {
        from: usuario,
        to: paraQuem,
        text: textoDigitado,
        type: "message"
    }
    
    texto.value = "";
    const requisicao = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages", mensagem);
    requisicao.then(buscaMensagens); 
    requisicao.catch(trataErroMensagem);   
}

function selecionaParaTodos() {
    paraQuem = "Todos";
}

function selecionaMensagemPrivada() {

}

function atualizaUsuarios() {
    
}

function trataErroMensagem () {     
    alert("Você ficou muito tempo ausente, digite seu nome novamente!")  
    aoEntrar();
}

function buscaMensagens () {    
    const promessa = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages");
    promessa.then(percorreDados);    
}

function percorreDados (resposta){
    const dados = resposta.data;   
    divBatePapo.innerHTML = "";
    for (let i = 0; i < dados.length; i++ ){
        const posicao = i;
        renderizaMensagens(dados, posicao)
    }
}

function renderizaMensagens(dados, posicao) {
    
    const divBatePapo = document.querySelector(".bate-papo");
    const usuarioNome = dados[posicao].from;
    const para = dados[posicao].to;
    const texto = dados[posicao].text;    
    const tipo = dados[posicao].type;
    const horario = dados[posicao].time;   


    if (para === "Todos" && tipo === "status") {
        divBatePapo.innerHTML += `<div class="mensagem-ações">(${horario})
        <strong>${usuarioNome}</strong> para ${para}:  ${texto}</div>`
        

    } else if (para === "Todos" && tipo === "message") {
        divBatePapo.innerHTML += `<div class="mensagem-publica">(${horario})
        <strong>${usuarioNome}</strong> para ${para}:  ${texto}</div>`
        
        
    } else if (para === "Todos" && tipo === "private_message") {
        divBatePapo.innerHTML += `<div class="mensagem-privada">(${horario})
        <strong>${usuarioNome}</strong> para ${para}:  ${texto}</div>`
    } 
    
    document.body.scrollTop = document.body.scrollHeight;
    document.documentElement.scrollTop = document.documentElement.scrollHeight;  
}

function exibeUsuários() {
    const fundo = document.querySelector(".fundo");
    fundo.classList.remove("escondido");
}

function voltaTelaInicial(tela) {
    tela.classList.add("escondido");
}

function mantemOnline() {    
    const dados = {
        name: usuario
    }    
    const requisicaoOn = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/status", dados);
    requisicaoOn.then(buscaMensagens);
    requisicaoOn.catch(aoEntrar);
}

aoEntrar ()
setInterval(buscaMensagens, 3000);
setInterval(mantemOnline, 5000);

