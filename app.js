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
    imprimirListaDeTarefas();

    document.querySelector("#btn-sair").onclick = sair;

    document.querySelector("#criar-tarefa").onclick = criarTarefa;


}

function sair() {
    localStorage.removeItem("logado");
    window.location.href = "/index.html"
}

function imprimirNomeDoUsuario() {
    const nomeUsuario = document.querySelector("#nome-usuario");

    const nomeCompleto = usuario.nome;
    const primeiroNome = nomeCompleto.split(" ", 1);

    nomeUsuario.innerHTML = primeiroNome;
}



function buscarTarefasDoUsuario(usuario) {
    const chave = usuario.email + "_tarefas";
    const listaDeTarefas = JSON.parse(localStorage.getItem(chave));
    return listaDeTarefas;
}

function salvarTarefasDoUsuario(usuario, listaDeTarefas) {
    const chave = usuario.email + "_tarefas";
    localStorage.setItem(chave, JSON.stringify(listaDeTarefas));
}


function imprimirListaDeTarefas() {
    const listaDeTarefas = buscarTarefasDoUsuario(usuario);

    if(listaDeTarefas == null) {
        return;
    }

    document.querySelector("#lista-de-tarefas").innerHTML = "";

    listaDeTarefas.tarefas.forEach(element => {
        let checkbox = "";
        let descricaoDaTarefa = "";

        if(element.concluida == true){
            checkbox = `<input class="form-check-input me-2 btn-marcar" type="checkbox" checked = "true" data-tarefa=${element.id} value="" >`;
            descricaoDaTarefa = `<a href="#" class="flex-grow-1 link-dark tarefa-concluida">${element.descricao}</a>`;
        } else if(element.concluida == false) {
            checkbox = `<input class="form-check-input me-2 btn-marcar" type="checkbox"  data-tarefa=${element.id} value="" >`;
            descricaoDaTarefa = `<a href="#" class="flex-grow-1 link-dark text-decoration-none">${element.descricao}</a>`;
        }
        document.querySelector("#lista-de-tarefas").innerHTML = document.querySelector("#lista-de-tarefas").innerHTML +
            `<li class="tarefa list-group-item mb-2 d-flex">
            ${checkbox + descricaoDaTarefa}
            <a href="#" class="btn-prioridade"><i class="bi bi-star link-dark me-3" ></i></a>
            <a href="#" class="btn-excluir"><i class="bi bi-trash link-dark" data-tarefa=${element.id}></i></a>
        </li>`;
    });
    adicionarEventoCheckBox();
    adicionarEventoExcluir();

}

function adicionarEventoCheckBox() {
    const listaCheckBox = document.querySelectorAll(".btn-marcar");
    listaCheckBox.forEach(element => {
        element.onclick = marcarTarefa;
    });
}

function adicionarEventoExcluir() {
    const listaBtnExcluir = document.querySelectorAll(".btn-excluir");
    listaBtnExcluir.forEach(element => {
        element.onclick = excluirTarefa;
    });
}

function excluirTarefa(evento) {
    const listaDeTarefas = buscarTarefasDoUsuario(usuario);
    let indice;

    listaDeTarefas.tarefas.forEach((element, i) => {
        
        if(element.id == evento.target.dataset.tarefa) {
           indice = i;
        }
    });

    listaDeTarefas.tarefas.splice(indice, 1);

   salvarTarefasDoUsuario(usuario, listaDeTarefas);
   imprimirListaDeTarefas();
}



function criarTarefa() {
    const inputTarefa = document.querySelector("#input-tarefa").value;
    const id = Date.now();

    if (buscarTarefasDoUsuario(usuario) == null) {
        const listaDeTarefas = {
            tarefas: []
        };

        listaDeTarefas.tarefas.push({ id: id, descricao: inputTarefa, concluida: false });
        salvarTarefasDoUsuario(usuario, listaDeTarefas);

    } else {
        const listaDeTarefas = buscarTarefasDoUsuario(usuario);
        listaDeTarefas.tarefas.push({ id: id, descricao: inputTarefa, concluida: false });

        salvarTarefasDoUsuario(usuario, listaDeTarefas);
    }
    imprimirListaDeTarefas();
}


function marcarTarefa(evento) {

    if (evento.target.checked == true) {
        marcarConcluida(evento);
        

    } else {
        marcarNaoConcuida(evento);

    }

    imprimirListaDeTarefas()
}

function marcarConcluida(evento) {
    const listaDeTarefas = buscarTarefasDoUsuario(usuario);

    listaDeTarefas.tarefas.forEach(element => {
        if(element.id == evento.target.dataset.tarefa) {
            element.concluida = true;
        }
    })

    salvarTarefasDoUsuario(usuario, listaDeTarefas);
   
}

function marcarNaoConcuida(evento) {
    const listaDeTarefas = buscarTarefasDoUsuario(usuario);

    listaDeTarefas.tarefas.forEach(element => {
        if(element.id == evento.target.dataset.tarefa) {
            element.concluida = false;
        }
    })

    salvarTarefasDoUsuario(usuario, listaDeTarefas);
    
}





