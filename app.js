const usuario = recuperarUsuarioLogado();

window.onload = iniciar;

function recuperarUsuarioLogado() {
    const usuarioEncontrado = JSON.parse(localStorage.getItem("logado"));

    if (usuarioEncontrado == null || usuarioEncontrado.logado !== true ) {
        window.location.href = "/entrar.html";
    };

    return usuarioEncontrado;
}

function iniciar() {
    imprimirNomeDoUsuario();

    document.querySelector("#btn-sair").onclick = sair;

    document.querySelector("#criar-tarefa").onclick = criarTarefa;
}


function imprimirNomeDoUsuario() {
    const nomeUsuario = document.querySelector("#nome-usuario");

    const nomeCompleto = usuario.nome;
    const primeiroNome = nomeCompleto.split(" ", 1);

    nomeUsuario.innerHTML = primeiroNome;
}

function sair() {
    localStorage.removeItem("logado");
    window.location.href = "/index.html"
}


function criarTarefa() {
    const inputTarefa = document.querySelector("#input-tarefa").value;

    const chave = usuario.email + "_tarefas";

    if(localStorage.getItem(chave) == null) {
        const listaDeTarefas = { 
            tarefas: []
        };

       listaDeTarefas.tarefas.push(inputTarefa);

        localStorage.setItem(chave, JSON.stringify(jh));
    } else {
        const listaDeTarefas = JSON.parse(localStorage.getItem(chave));
        listaDeTarefas.tarefas.push(inputTarefa);
        localStorage.setItem(chave, JSON.stringify(listaDeTarefas));
    }
}


   


