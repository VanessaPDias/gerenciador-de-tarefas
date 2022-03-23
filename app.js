const usuario = recuperarUsuarioLogado();

function recuperarUsuarioLogado() {
    const usuarioEncontrado = JSON.parse(localStorage.getItem("logado"));

    if (usuarioEncontrado == null || usuarioEncontrado.logado !== true) {
        window.location.href = "/entrar.html";
    };
    return usuarioEncontrado;
}

if(window.location.hash == "") {
    window.location.hash = "todas"
}

window.onload = aoCarregarPagina;

function aoCarregarPagina() {
    imprimirNomeDoUsuario();
    atualizarMenu();
    listarTarefasFiltradas();

    const itensDoMenu = document.querySelectorAll(".item-menu");
    itensDoMenu.forEach(element => {
        element.onclick = aoClicarNosItensDoMenu;
    })

    document.querySelector("#btn-sair").onclick = aoClicarNoBotaoSair;

    document.querySelector("#criar-tarefa").onclick = aoClicarNoBotaoCriarTarefa;

    document.querySelector("#modal-editar-tarefa").addEventListener("show.bs.modal", aoClicarNaTarefa);

    document.querySelector("#btn-editar-salvar").onclick = aoClicarNoBotaoSalvar;


}

function aoClicarNoBotaoSair() {
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

function aoClicarNoBotaoCriarTarefa(evento) {
    const inputTarefa = document.querySelector("#input-tarefa").value;

    if(inputTarefa == "") {
        const elementoToast = document.querySelector("#elemento-toast");
        const toast = new bootstrap.Toast(elementoToast);
        toast.show();
        return;
    }

    const id = Date.now();
    let tarefasEncontradas = buscarTarefasDoUsuario(usuario);

    document.querySelector("#input-tarefa").value = "";

    if (tarefasEncontradas == null) {
        const  novaListaDeTarefas = {
            tarefas: []
        };

        novaListaDeTarefas.tarefas.push({ id: id, descricao: inputTarefa, concluida: false, prioridade: false });
        tarefasEncontradas = novaListaDeTarefas;
        salvarTarefasDoUsuario(usuario,  tarefasEncontradas);

    } else {
        
        tarefasEncontradas.tarefas.push({ id: id, descricao: inputTarefa, concluida: false, prioridade: false });

        salvarTarefasDoUsuario(usuario, tarefasEncontradas);
    }
    imprimirListaDeTarefas(tarefasEncontradas);
}




function imprimirListaDeTarefas(listaDeTarefas) {

    if (listaDeTarefas == null) {
        return;
    }

    listaDeTarefas.tarefas.sort(function (a, b) {
        if (a.prioridade == true && b.prioridade == false) {
            return -1;
        }

        if (a.prioridade == b.prioridade) {
            if (a.id < b.id) {
                return -1;
            }
        }

    });

    document.querySelector("#lista-de-tarefas").innerHTML = "";

    listaDeTarefas.tarefas.forEach(element => {
        let checkbox = "";
        let descricaoDaTarefa = "";
        let prioridade = "";

        if (element.concluida == true) {
            checkbox = `<input class="form-check-input me-2 btn-marcar" type="checkbox" checked = "true" data-tarefa=${element.id} value="" >`;
            descricaoDaTarefa = `<a class="flex-grow-1 link-dark tarefa-concluida" data-tarefa=${element.id}>${element.descricao}</a>`;
        } else if (element.concluida == false) {
            checkbox = `<input class="form-check-input me-2 btn-marcar" type="checkbox"  data-tarefa=${element.id} value="" >`;
            descricaoDaTarefa = `<a class="flex-grow-1 link-dark text-decoration-none" data-tarefa=${element.id} data-bs-toggle="modal" data-bs-target="#modal-editar-tarefa">${element.descricao}</a>`;
        }

        if (element.prioridade == true) {
            prioridade = `<i class="bi bi-star-fill link-dark me-3 icone-prioridade" data-tarefa=${element.id}></i>`;
        } else if (element.prioridade == false) {
            prioridade = `<i class="bi bi-star link-dark me-3" data-tarefa=${element.id}></i>`
        }

        document.querySelector("#lista-de-tarefas").innerHTML = document.querySelector("#lista-de-tarefas").innerHTML +
            `<li class="tarefa list-group-item mb-2 d-flex">
            ${checkbox + descricaoDaTarefa}
            <a class="btn-prioridade">${prioridade}</a>
            <a class="btn-excluir"><i class="bi bi-trash link-dark" data-tarefa=${element.id}></i></a>
        </li>`;
    });
    adicionarEventoCheckBox();
    adicionarEventoExcluir();
    adicionarEventoPrioridade();

}

function adicionarEventoCheckBox() {
    const listaCheckBox = document.querySelectorAll(".btn-marcar");
    listaCheckBox.forEach(element => {
        element.onclick = aoMarcarTarefa;
    });
}

function aoMarcarTarefa(evento) {
    const listaDeTarefas = buscarTarefasDoUsuario(usuario);
    let tarefaClicada;

    listaDeTarefas.tarefas.forEach(element => {
        if (element.id == evento.target.dataset.tarefa) {
            tarefaClicada = element;
        }
    });

    if (tarefaClicada.concluida == false) {
        tarefaClicada.concluida = true;
    } else if (tarefaClicada.concluida == true) {
        tarefaClicada.concluida = false;
    }

    salvarTarefasDoUsuario(usuario, listaDeTarefas);

    listarTarefasFiltradas();
}


function adicionarEventoExcluir() {
    const listaBtnExcluir = document.querySelectorAll(".btn-excluir");
    listaBtnExcluir.forEach(element => {
        element.onclick = aoExcluirTarefa;
    });
}

function aoExcluirTarefa(evento) {
    const listaDeTarefas = buscarTarefasDoUsuario(usuario);
    let indice;

    listaDeTarefas.tarefas.forEach((element, i) => {

        if (element.id == evento.target.dataset.tarefa) {
            indice = i;
        }
    });

    listaDeTarefas.tarefas.splice(indice, 1);

    salvarTarefasDoUsuario(usuario, listaDeTarefas);
    listarTarefasFiltradas();
}

function adicionarEventoPrioridade() {
    const listaBtnPrioridade = document.querySelectorAll(".btn-prioridade");
    listaBtnPrioridade.forEach(element => {
        element.onclick = aoMarcarPrioridade;
    });
}

function aoMarcarPrioridade(evento) {
    const listaDeTarefas = buscarTarefasDoUsuario(usuario);
    let tarefaClicada;

    listaDeTarefas.tarefas.forEach(element => {
        if (element.id == evento.target.dataset.tarefa) {
            tarefaClicada = element
        }
    });

    if (tarefaClicada.prioridade == false) {
        tarefaClicada.prioridade = true;
    } else if (tarefaClicada.prioridade == true) {
        tarefaClicada.prioridade = false;
    }
    salvarTarefasDoUsuario(usuario, listaDeTarefas);
    listarTarefasFiltradas();
}

function aoClicarNaTarefa(evento) {
    const listaDeTarefas = buscarTarefasDoUsuario(usuario);
    let tarefaClicada;

    listaDeTarefas.tarefas.forEach(element => {
        if (element.id == evento.relatedTarget.dataset.tarefa) {
            tarefaClicada = element
        }
    });

    document.querySelector("#input-editar-tarefa").value = tarefaClicada.descricao;
    document.querySelector("#id-tarefa").value = tarefaClicada.id;
}

function aoClicarNoBotaoSalvar() {
    const novaDescricaoTarefa = document.querySelector("#input-editar-tarefa").value;
    const idTarefa = document.querySelector("#id-tarefa").value;

    const listaDeTarefas = buscarTarefasDoUsuario(usuario);
    let tarefaClicada;

    listaDeTarefas.tarefas.forEach(element => {
        if (element.id == idTarefa) {
            tarefaClicada = element
        }
    });

    tarefaClicada.descricao = novaDescricaoTarefa;

    salvarTarefasDoUsuario(usuario, listaDeTarefas);
    listarTarefasFiltradas();

}

function aoClicarNosItensDoMenu(evento) {
    const hrefElemento = evento.target.hash;
    window.location.hash = hrefElemento;

    atualizarMenu();
    listarTarefasFiltradas();
}

function atualizarMenu() {
    const itensDoMenu = document.querySelectorAll(".item-menu");
    itensDoMenu.forEach(element => {
        element.classList.remove("active");
    });

    const hashDaPagina = window.location.hash;
    const elementosHrefEncontrados = document.querySelectorAll(`*[href='${hashDaPagina}']`);
        elementosHrefEncontrados.forEach(element => {
            element.classList.add("active");
   });
}

function listarTarefasFiltradas() {
    const hashDaPagina = window.location.hash;
    const listaDeTarefas = buscarTarefasDoUsuario(usuario);
    let tarefasFiltradas = {
        tarefas: []
    }

    if(hashDaPagina == "#todas") {
        listaDeTarefas.tarefas.forEach(element => {
            tarefasFiltradas.tarefas.push(element);
        });
    } else if(hashDaPagina == "#a-fazer") {
        listaDeTarefas.tarefas.forEach(element => {
            if(element.concluida == false) {
                tarefasFiltradas.tarefas.push(element);
            }
        });
    } else if(hashDaPagina == "#concluidas") {
        listaDeTarefas.tarefas.forEach(element => {
            if(element.concluida == true) {
                tarefasFiltradas.tarefas.push(element);
            }
        });
    } else if(hashDaPagina == "#prioridades") {
        listaDeTarefas.tarefas.forEach(element => {
            if(element.prioridade == true) {
                tarefasFiltradas.tarefas.push(element);
            }
        });
    } else {
        tarefasFiltradas = listaDeTarefas;
    }
    
    imprimirListaDeTarefas(tarefasFiltradas);
}






