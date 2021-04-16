let usuario = null;
let paraQuem = "Todos";
const divBatePapo = document.querySelector(".bate-papo");
let visibilidade = "message";

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
        type: visibilidade
    }  
     
    texto.value = "";
    const requisicao = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages", mensagem);
    requisicao.then(buscaMensagens); 
    requisicao.catch(trataErroMensagem);       
}

function selecionaParaTodos() {
    paraQuem = "Todos";
}

function selecionaMensagemFocada (check, usuario) { 
    const primeiroSelecionado = document.querySelector(".contato.selecionado")      
    if(primeiroSelecionado !== null){
        primeiroSelecionado.classList.toggle('selecionado')
    } 
    check.classList.add('selecionado') 
    paraQuem = usuario;     
    alteraDivEnviandoPara()
}

function mostraSidebar() {
    const fundo = document.querySelector(".fundo")
    fundo.classList.remove("escondido")
    exibeUsuarios()
    buscaUsuarios();     
}

function selecionaVisibilidade(elemento, tipoMensagem){ 
    const primeiroSelecionado = document.querySelector('.visibilidade.selecionado')
    console.log(primeiroSelecionado)
    if(primeiroSelecionado !== null){
        primeiroSelecionado.classList.remove('selecionado')
    }   
    elemento.classList.add('selecionado')
    visibilidade = tipoMensagem;
    alteraDivEnviandoPara()
}

function enviaComEnter(){
    const inputEle = document.getElementById('placeholder-text-base');
    inputEle.addEventListener('keyup', function(e){
      var key = e.which || e.keyCode;
      if (key == 13) { 
        enviaMensagem()       
      }
    });    
}

function buscaUsuarios() {   
    const requisicao = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants");
    requisicao.then(percorreUsuarios); 
}

function percorreUsuarios(resposta) {
    const dadosUsuarios = resposta.data;   
    const divContatos = document.querySelector(".participantes-ativos");
    divContatos.innerHTML = `<div class="contato" onclick="selecionaMensagemFocada(this, 'Todos')">
    <ion-icon name="person-circle" class="ion-icon-sidebar"></ion-icon>
    <span>Todos</span>
    <ion-icon name="checkmark-sharp" class="ion-icon-sidebar-check"></ion-icon>  
    </div>  
    `;

    for (let i = 0; i < dadosUsuarios.length; i++ ){
        const posicao = i;
        renderizaUsuarios(dadosUsuarios, posicao)
    }
}

function renderizaUsuarios(dadosUsuarios, posicao){
    const divContatos = document.querySelector(".participantes-ativos");
    const usuario = dadosUsuarios[posicao].name;    
    divContatos.innerHTML += `<div class="contato" onclick="selecionaMensagemFocada(this, '${usuario}')">
    <ion-icon name="person-circle" class="ion-icon-sidebar"></ion-icon>    
    <span>${usuario}</span>
    <ion-icon name="checkmark-sharp" class="ion-icon-sidebar-check"></ion-icon>
    </div>    
    `    
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

    } else if (usuarioNome === usuario && tipo === "private_message") {
        divBatePapo.innerHTML += `<div class="mensagem-privada">(${horario})
        <strong>${usuarioNome}</strong> para ${para}:  ${texto}</div>`
        
    } else if (usuarioNome === usuario && tipo === "message") {
        divBatePapo.innerHTML += `<div class="mensagem-publica">(${horario})
        <strong>${usuarioNome}</strong> para ${para}:  ${texto}</div>`
    }
    
    document.body.scrollTop = document.body.scrollHeight;
    document.documentElement.scrollTop = document.documentElement.scrollHeight;  
}

function exibeUsuarios() {
    const fundo = document.querySelector(".fundo");
    fundo.classList.remove("escondido");
    const side = document.querySelector(".sidebar");
    side.classList.remove("escondido")    
}

function voltaTelaInicial() {
    const tela = document.querySelector(".fundo")
    tela.classList.add("escondido");  
    const side = document.querySelector(".sidebar");
    side.classList.add("escondido");   
}

function mantemOnline() {    
    const dados = {
        name: usuario
    }    
    const requisicaoOn = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/status", dados);
    requisicaoOn.then(buscaMensagens);
    requisicaoOn.catch(aoEntrar);
}

function alteraDivEnviandoPara(){    
    const divEnviandoPara = document.querySelector(".base2")
    divEnviandoPara.innerHTML = "";
    let recebeVisibilidade = visibilidade;
  
    if (recebeVisibilidade === "message") { 
         recebeVisibilidade = "mensagem pública"        
         divEnviandoPara.innerHTML = `Enviando para ${paraQuem} (${recebeVisibilidade})`
     } else if (recebeVisibilidade === "private_message") {
        recebeVisibilidade = "mensagem privada"
        divEnviandoPara.innerHTML = `Enviando para ${paraQuem} (${recebeVisibilidade})`    
     }    
}



aoEntrar ()
enviaComEnter()
setInterval(buscaMensagens, 3000);
setInterval(mantemOnline, 5000);
setInterval(buscaUsuarios, 10000);
