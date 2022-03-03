verificarSeUsuarioEstaLogado();

window.onload = iniciar;

function verificarSeUsuarioEstaLogado() {
    const usuario = JSON.parse(localStorage.getItem("logado"));

    if (usuario.logado !== true) {
        window.location.href = "/entrar.html";
    };
}

function iniciar() {
    imprimirNomeDoUsuario();

    document.querySelector("#btnSair").onclick = sair;
}


function imprimirNomeDoUsuario() {
    const nomeUsuario = document.querySelector("#nomeUsuario");

    const nomeCompleto = usuario.nome;
    const primeiroNome = nomeCompleto.split(" ", 1);

    nomeUsuario.innerHTML = primeiroNome;
}

function sair() {
    localStorage.removeItem("logado");
    window.location.href = "/index.html"
}



   


