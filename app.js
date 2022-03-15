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

function criarTarefa() {
    const inputTarefa = document.querySelector("#input-tarefa").value;
    const id = Date.now();
    document.querySelector("#input-tarefa").value = "";

    if (buscarTarefasDoUsuario(usuario) == null) {
        const listaDeTarefas = {
            tarefas: []
        };

        listaDeTarefas.tarefas.push({ id: id, descricao: inputTarefa, concluida: false, prioridade: false });
        salvarTarefasDoUsuario(usuario, listaDeTarefas);

    } else {
        const listaDeTarefas = buscarTarefasDoUsuario(usuario);
        listaDeTarefas.tarefas.push({ id: id, descricao: inputTarefa, concluida: false, prioridade: false });

        salvarTarefasDoUsuario(usuario, listaDeTarefas);
    }
    imprimirListaDeTarefas();
}


function imprimirListaDeTarefas() {
    const listaDeTarefas = buscarTarefasDoUsuario(usuario);

    if(listaDeTarefas == null) {
        return;
    }

    listaDeTarefas.tarefas.sort(function (a, b) {
        if(a.prioridade == true && b.prioridade == false){
            return -1;
        }
        
        if(a.prioridade == b.prioridade){
            if(a.id < b.id){
                return -1;
            }
        }
        
    });

    document.querySelector("#lista-de-tarefas").innerHTML = "";

    listaDeTarefas.tarefas.forEach(element => {
        let checkbox = "";
        let descricaoDaTarefa = "";
        let prioridade = "";

        if(element.concluida == true){
            checkbox = `<input class="form-check-input me-2 btn-marcar" type="checkbox" checked = "true" data-tarefa=${element.id} value="" >`;
            descricaoDaTarefa = `<a href="#" class="flex-grow-1 link-dark tarefa-concluida">${element.descricao}</a>`;
        } else if(element.concluida == false) {
            checkbox = `<input class="form-check-input me-2 btn-marcar" type="checkbox"  data-tarefa=${element.id} value="" >`;
            descricaoDaTarefa = `<a href="#" class="flex-grow-1 link-dark text-decoration-none">${element.descricao}</a>`;
        }

        if(element.prioridade == true) {
            prioridade = `<i class="bi bi-star-fill link-dark me-3 icone-prioridade" data-tarefa=${element.id}></i>`;
        } else if(element.prioridade == false) {
            prioridade = `<i class="bi bi-star link-dark me-3" data-tarefa=${element.id}></i>`
        }

        document.querySelector("#lista-de-tarefas").innerHTML = document.querySelector("#lista-de-tarefas").innerHTML +
            `<li class="tarefa list-group-item mb-2 d-flex">
            ${checkbox + descricaoDaTarefa}
            <a href="#" class="btn-prioridade">${prioridade}</a>
            <a href="#" class="btn-excluir"><i class="bi bi-trash link-dark" data-tarefa=${element.id}></i></a>
        </li>`;
    });
    adicionarEventoCheckBox();
    adicionarEventoExcluir();
    adicionarEventoPrioridade();

}

function adicionarEventoCheckBox() {
    const listaCheckBox = document.querySelectorAll(".btn-marcar");
    listaCheckBox.forEach(element => {
        element.onclick = marcarTarefa;
    });
}

function marcarTarefa(evento) {
    const listaDeTarefas = buscarTarefasDoUsuario(usuario);
    let tarefaClicada;

    listaDeTarefas.tarefas.forEach(element => {
        if(element.id == evento.target.dataset.tarefa) {
            tarefaClicada = element;
        }
    });

    if(tarefaClicada.concluida == false) {
        tarefaClicada.concluida = true;
    }else if(tarefaClicada.concluida == true){
        tarefaClicada.concluida = false;
    }

    salvarTarefasDoUsuario(usuario, listaDeTarefas);

    imprimirListaDeTarefas()
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

function adicionarEventoPrioridade() {
    const listaBtnPrioridade = document.querySelectorAll(".btn-prioridade");
    listaBtnPrioridade.forEach(element => {
        element.onclick = marcarPrioridade;
    });
}

function marcarPrioridade(evento) {
    const listaDeTarefas = buscarTarefasDoUsuario(usuario);
    let tarefaClicada;

    listaDeTarefas.tarefas.forEach(element => {
        if(element.id == evento.target.dataset.tarefa) {
            tarefaClicada = element 
        }
    });

    if(tarefaClicada.prioridade == false) {
        tarefaClicada.prioridade = true;
    }else if(tarefaClicada.prioridade == true) {
        tarefaClicada.prioridade = false;
    }
    salvarTarefasDoUsuario(usuario, listaDeTarefas);
    imprimirListaDeTarefas();
}











