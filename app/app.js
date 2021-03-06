let usuarioId = "";
recuperarUsuarioLogado();

function recuperarUsuarioLogado() {
    const usuarioEncontrado = JSON.parse(localStorage.getItem("logado"));

    if (!usuarioEncontrado) {
        window.location.href = "/login/entrar.html";
    };

    usuarioId = usuarioEncontrado.usuarioId;

    buscarUsuario(usuarioEncontrado);

    return usuarioEncontrado;
}

function buscarUsuario(usuarioEncontrado) {
    const url = `${config.urlDaApi}/usuarios/${usuarioEncontrado.usuarioId}`;

    fetch(url)
        .then(function (resp) {
            if (resp.ok) {
                resp.json().then(function (respConvertida) {
                    const usuario = respConvertida;

                    imprimirNomeDoUsuario(usuario);
                    atualizarMenu();
                    buscarTarefasDoUsuario(usuarioId)
                    listarTarefasFiltradas(usuario.tarefas);
                })
            }

        })


}

if (window.location.hash == "") {
    window.location.hash = "todas"
}

window.onload = aoCarregarPagina;

function aoCarregarPagina() {

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
    window.location.href = "./index.html"
}

function imprimirNomeDoUsuario(usuario) {
    const nomeUsuario = document.querySelector("#nome-usuario");

    const nomeCompleto = usuario.nome;
    const primeiroNome = nomeCompleto.split(" ", 1);

    nomeUsuario.innerHTML = primeiroNome;
}



function buscarTarefasDoUsuario(usuarioId) {
    const url = `${config.urlDaApi}/usuarios/${usuarioId}/tarefas`;

    fetch(url)
        .then(function (resp) {
            if (resp.ok) {
                resp.json().then(function (respConvertida) {
                    const usuario = respConvertida;
                    listarTarefasFiltradas(usuario.tarefas)
                })
            }
        })


}

function aoClicarNoBotaoCriarTarefa(evento) {
    const descricaoDaTarefa = document.querySelector("#input-tarefa").value;

    document.querySelector("#input-tarefa").value = "";

    //endpoint
    const url = `${config.urlDaApi}/usuarios/${usuarioId}/tarefas`;

    //construtor do objeto Request - cria a requisi????o para o servidor
    const request = new Request(url, {
        method: 'POST',
        //conteudo enviado
        body: JSON.stringify(
            {
                descricao: descricaoDaTarefa
            }),
        headers: {
            //tipo de conteudo enviado
            "Content-Type": "application/json"
        }
    });

    fetch(request)
        .then(function (resp) {
            if (resp.ok) {
                buscarTarefasDoUsuario(usuarioId)

            } else {
                resp.json().then(function (respConvertida) {
                    const elementoToast = document.querySelector("#elemento-toast");
                    const toast = new bootstrap.Toast(elementoToast);

                    document.querySelector("#mensagem-erro").innerHTML = respConvertida.erro;
                    toast.show();
                })
            }
        })

}

function imprimirListaDeTarefas(listaDeTarefas) {

    if (listaDeTarefas == null) {
        return;
    }

    listaDeTarefas.sort(function (a, b) {
        if (a.tarefaComPrioridade == true && b.tarefaComPrioridade == false) {
            return -1;
        }

        if (a.tarefaComPrioridade == b.tarefaComPrioridade) {
            if (a.id < b.id) {
                return -1;
            }
        }

    });

    document.querySelector("#lista-de-tarefas").innerHTML = "";

    listaDeTarefas.forEach(element => {
        let checkbox = "";
        let descricaoDaTarefa = "";
        let prioridade = "";

        if (element.tarefaConcluida == true) {
            checkbox = `<input class="form-check-input me-2 btn-marcar" type="checkbox" checked = "true" data-tarefa=${element.tarefaId} value="" >`;
            descricaoDaTarefa = `<a class="flex-grow-1 link-dark tarefa-concluida" data-tarefa=${element.tarefaId}>${element.descricao}</a>`;
        } else if (element.tarefaConcluida == false) {
            checkbox = `<input class="form-check-input me-2 btn-marcar" type="checkbox"  data-tarefa=${element.tarefaId} value="" >`;
            descricaoDaTarefa = `<a class="flex-grow-1 link-dark text-decoration-none" data-tarefa=${element.tarefaId} data-bs-toggle="modal" data-bs-target="#modal-editar-tarefa">${element.descricao}</a>`;
        }

        if (element.tarefaComPrioridade == true) {
            prioridade = `<i class="bi bi-star-fill link-dark me-3 icone-prioridade" data-tarefa=${element.tarefaId} data-prioridade="true" ></i>`;
        } else if (element.tarefaComPrioridade == false) {
            prioridade = `<i class="bi bi-star link-dark me-3" data-tarefa=${element.tarefaId}></i>`
        }

        document.querySelector("#lista-de-tarefas").innerHTML = document.querySelector("#lista-de-tarefas").innerHTML +
            `<li class="tarefa list-group-item mb-2 d-flex">
            ${checkbox + descricaoDaTarefa}
            <a class="btn-prioridade">${prioridade}</a>
            <a class="btn-excluir"><i class="bi bi-trash link-dark" data-tarefa=${element.tarefaId}></i></a>
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
    const tarefaId = evento.target.dataset.tarefa;
    const checkbox = evento.target.checked;

    const url = `${config.urlDaApi}/usuarios/${usuarioId}/tarefas/${tarefaId}`

    if (checkbox == true) {
        const request = new Request(url, {
            method: 'PATCH',
            body: JSON.stringify(
                {
                    tarefaConcluida: true
                }),
            headers: {
                "Content-Type": "application/json"
            }

        });

        fetch(request)
            .then(function (resp) {
                if (resp.ok) {
                    buscarTarefasDoUsuario(usuarioId);
                }
            })
    }

    if (!checkbox) {
        const request = new Request(url, {
            method: 'PATCH',
            body: JSON.stringify(
                {
                    tarefaConcluida: false
                }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        fetch(request)
            .then(function (resp) {
                if (resp.ok) {
                    buscarTarefasDoUsuario(usuarioId);
                }
            })
    }

}


function adicionarEventoExcluir() {
    const listaBtnExcluir = document.querySelectorAll(".btn-excluir");
    listaBtnExcluir.forEach(element => {
        element.onclick = aoExcluirTarefa;
    });
}

function aoExcluirTarefa(evento) {
    const tarefaId = evento.target.dataset.tarefa;

    const url = `${config.urlDaApi}/usuarios/${usuarioId}/tarefas/${tarefaId}`;

    const request = new Request(url, {
        method: 'DELETE',
        headers: new Headers()
    });

    fetch(request)
        .then(function (resp) {
            if (resp.ok) {
                buscarTarefasDoUsuario(usuarioId);

            }
        })

}

function adicionarEventoPrioridade() {
    const listaBtnPrioridade = document.querySelectorAll(".btn-prioridade");
    listaBtnPrioridade.forEach(element => {
        element.onclick = aoMarcarPrioridade;
    });
}

function aoMarcarPrioridade(evento) {
    const tarefaId = evento.target.dataset.tarefa;
    const prioridade = evento.target.dataset.prioridade;

    const booleanPrioridade = (prioridade == "true");

    const url = `${config.urlDaApi}/usuarios/${usuarioId}/tarefas/${tarefaId}`

    if (!booleanPrioridade) {
        const request = new Request(url, {
            method: 'PATCH',
            body: JSON.stringify(
                {
                    tarefaComPrioridade: true
                }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        fetch(request)
            .then(function (resp) {
                if (resp.ok) {
                    buscarTarefasDoUsuario(usuarioId);
                }
            })
    } else if (booleanPrioridade == true) {
        const request = new Request(url, {
            method: 'PATCH',
            body: JSON.stringify(
                {
                    tarefaComPrioridade: false
                }),
            headers: {
                "Content-Type": "application/json"
            }

        });

        fetch(request)
            .then(function (resp) {
                if (resp.ok) {
                    buscarTarefasDoUsuario(usuarioId);
                }
            })
    }


}

function aoClicarNaTarefa(evento) {
    const tarefaId = evento.relatedTarget.dataset.tarefa;

    const url = `${config.urlDaApi}/usuarios/${usuarioId}/tarefas/${tarefaId}`;

    fetch(url)
        .then(function (resp) {
            if (resp.ok) {
                resp.json().then(function (respConvertida) {
                    document.querySelector("#input-editar-tarefa").value = respConvertida.descricao;
                    document.querySelector("#id-tarefa").value = tarefaId;
                })
            }
        })

    
}

function aoClicarNoBotaoSalvar() {
    const novaDescricaoTarefa = document.querySelector("#input-editar-tarefa").value;
    const tarefaId = document.querySelector("#id-tarefa").value;

    const url = `${config.urlDaApi}/usuarios/${usuarioId}/tarefas/${tarefaId}`

    const request = new Request(url, {
        method: 'PATCH',
        body: JSON.stringify(
            {
                descricao: novaDescricaoTarefa
            }),
        headers: {
            "Content-Type": "application/json"
        }
    });

    fetch(request)
        .then(function (resp) {
            if (resp.ok) {
                buscarTarefasDoUsuario(usuarioId);
            }
        })
    

}

function aoClicarNosItensDoMenu(evento) {
    const hrefElemento = evento.target.hash;
    window.location.hash = hrefElemento;

    atualizarMenu();
    buscarTarefasDoUsuario(usuarioId);
}

function atualizarMenu() {
    const itensDoMenu = document.querySelectorAll(".item-menu");
    itensDoMenu.forEach(item => {
        item.classList.remove("active");
    });

    const hashDaPagina = window.location.hash;
    const elementosHrefEncontrados = document.querySelectorAll(`*[href='${hashDaPagina}']`);
    elementosHrefEncontrados.forEach(element => {
        element.classList.add("active");
    });
}

function listarTarefasFiltradas(tarefas) {

    const hashDaPagina = window.location.hash;

    let tarefasFiltradas = [];

    if (hashDaPagina == "#todas") {
        tarefas.forEach(element => {
            tarefasFiltradas.push(element);
        });
    } else if (hashDaPagina == "#a-fazer") {
        tarefas.forEach(element => {
            if (element.tarefaConcluida == false) {
                tarefasFiltradas.push(element);
            }
        });
    } else if (hashDaPagina == "#concluidas") {
        tarefas.forEach(element => {
            if (element.tarefaConcluida == true) {
                tarefasFiltradas.push(element);
            }
        });
    } else if (hashDaPagina == "#prioridades") {
        tarefas.forEach(element => {
            if (element.tarefaComPrioridade == true) {
                tarefasFiltradas.push(element);
            }
        });
    } else {
        tarefasFiltradas = tarefas;
    }

    imprimirListaDeTarefas(tarefasFiltradas);
}






