let usuario = null;
let para = null;

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
        to: para,
        text: textoDigitado,
        type: "message"
    }
    
    const requisicao = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages", mensagem)
    requisicao.then(renderizaMensagens)
    requisicao.catch(trataErroMensagem)
    
}

function selecionaParaTodos() {
    para = "Todos"
}

function trataErroMensagem () {    
    alert("erro")
}


function buscaMensagens () {
    const promessa = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages");
    promessa.then(percorreDados);    
}

function percorreDados (resposta){
    const dados = resposta.data;
    console.log(dados)
    for (let i = 0; i < dados.length; i++ ){
        const posicao = i;
        renderizaMensagens(dados, posicao)
    }
}

function renderizaMensagens(dados, posicao) {

    const divBatePapo = document.querySelector(".bate-papo");
    usuario = dados[posicao].from;
    para = dados[posicao].to;
    const texto = dados[posicao].text;    
    const tipo = dados[posicao].type;
    const horario = dados[posicao].time;

    if (para === "Todos" && tipo === "status") {
        divBatePapo.innerHTML += `<div class="mensagem-ações">(${horario})
        <strong>${usuario}</strong> para ${para}:  ${texto}</div>`
        

    } else if (para === "Todos" && tipo === "message") {
        divBatePapo.innerHTML += `<div class="mensagem-publica">(${horario})
        <strong>${usuario}</strong> para ${para}:  ${texto}</div>`
        
        
    } else if (para === "Todos" && tipo === "private_message") {
        divBatePapo.innerHTML += `<div class="mensagem-privada">(${horario})
        <strong>${usuario}</strong> para ${para}:  ${texto}</div>`
    }
    
  
}

function exibeUsuários() {
 const fundo = document.querySelector(".fundo")
 fundo.classList.remove("escondido")
}

function voltaTelaInicial(tela) {
    tela.classList.add("escondido")
}

aoEntrar ()

// setInterval(renderizaMensagens, 3000)

