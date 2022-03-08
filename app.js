const usuario = recuperarUsuarioLogado();

function recuperarUsuarioLogado() {
    const usuarioEncontrado = JSON.parse(localStorage.getItem("logado"));

    if (usuarioEncontrado == null || usuarioEncontrado.logado !== true) {
        window.location.href = "/entrar.html";
    };
    return usuarioEncontrado;
}

window.onload = iniciar;

function iniciar() {
    imprimirNomeDoUsuario();
    recuperarListaDeTarefas();
    adicionarEventoCheckBox()
    
    document.querySelector("#btn-sair").onclick = sair;
    
    document.querySelector("#criar-tarefa").onclick = criarTarefa;
    
    
}

function imprimirNomeDoUsuario() {
    const nomeUsuario = document.querySelector("#nome-usuario");

    const nomeCompleto = usuario.nome;
    const primeiroNome = nomeCompleto.split(" ", 1);

    nomeUsuario.innerHTML = primeiroNome;
}


function recuperarListaDeTarefas() {
    const listaEncontrada = JSON.parse(localStorage.getItem(usuario.email + "_tarefas"));

    if (listaEncontrada !== null) {
        imprimirListaDeTarefas()
    }
}


function imprimirListaDeTarefas() {
    const chave = usuario.email + "_tarefas";
    const listaDeTarefas = JSON.parse(localStorage.getItem(chave));
    
    
    listaDeTarefas.tarefas.forEach(element => {
        document.querySelector("#lista-de-tarefas").innerHTML = document.querySelector("#lista-de-tarefas").innerHTML + 
        `<li class="tarefa list-group-item mb-2 d-flex">
        <input class="form-check-input me-2 btn-marcar" type="checkbox" value="" >
        <a href="#" class="flex-grow-1 link-dark text-decoration-none">${element}</a>
        <a href="" class="" id="btn-prioridade"><i class="bi bi-star link-dark"></i></a>
        </li>`;
        adicionarEventoCheckBox()
    });
    
}

function adicionarEventoCheckBox() {
    const listaCheckBox = document.querySelectorAll(".btn-marcar");
    listaCheckBox.forEach(element => {
        element.onclick = concluirTarefa;
    });
}

function sair() {
    localStorage.removeItem("logado");
    window.location.href = "/index.html"
}


function criarTarefa() {
    const inputTarefa = document.querySelector("#input-tarefa").value;
    const chave = usuario.email + "_tarefas";

    if (localStorage.getItem(chave) == null) {
        const listaDeTarefas = {
            tarefas: []
        };

        listaDeTarefas.tarefas.push(inputTarefa);

        localStorage.setItem(chave, JSON.stringify(listaDeTarefas));

        imprimirListaDeTarefas();

    } else {
        const listaDeTarefas = JSON.parse(localStorage.getItem(chave));
        listaDeTarefas.tarefas.push(inputTarefa);
        localStorage.setItem(chave, JSON.stringify(listaDeTarefas));
        document.querySelector("#lista-de-tarefas").innerHTML = ""
        imprimirListaDeTarefas();
    }
}

// function listarTarefas(chave) {
//     const listaDeTarefas = JSON.parse(localStorage.getItem(chave));

//     listaDeTarefas.tarefas.forEach(element => {
//         console.log(element)

//         document.querySelector("#lista-de-tarefas").innerHTML = document.querySelector("#lista-de-tarefas").innerHTML + `<li class="tarefa list-group-item">${element}</li>`;
//     });

//}

function concluirTarefa(evento) {
    if(evento.target.checked == true){
        evento.target.parentElement.classList.add("tarefa-concluida");
    } else {
        evento.target.parentElement.classList.remove("tarefa-concluida");
    }
}






