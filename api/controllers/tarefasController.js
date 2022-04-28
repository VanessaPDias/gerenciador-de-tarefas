const dados = require('../dados');

const crypto = require('crypto');

function buscarTarefas(req, res) {
    const id = req.params.usuarioid;
    let usuarioEncontrado = dados.usuarios.find(usuario => usuario.id == id);

    if (!usuarioEncontrado) {
        res.status(404).send({ erro: "Usuário não encontrado" });
        return;
    }

    res.send({ tarefas: usuarioEncontrado.listaDeTarefas });
}

function buscarTarefaComId(req, res) {
    const usuarioId = req.params.usuarioid;
    const tarefaId = req.params.tarefaid;

    let usuarioEncontrado = dados.usuarios.find(usuario => usuario.id == usuarioId);
    if (!usuarioEncontrado) {
        res.status(404).send({ erro: "Usuário não encontrado." });
        return;
    }

    let tarefaEncontrada = usuarioEncontrado.listaDeTarefas.find(tarefa => tarefa.tarefaId == tarefaId);
    if (!tarefaEncontrada) {
        res.status(404).send({ erro: "Tarefa não encontrada." });
        return;
    }

    res.send({ descricao: tarefaEncontrada.descricao });
}


function criarTarefa(req, res) {
    const usuarioId = req.params.usuarioid;
    const descricaoDaTarefa = req.body.descricao;

    const novaTarefa = {
        tarefaId: crypto.randomUUID(),
        descricao: descricaoDaTarefa,
        tarefaConcluida: false,
        tarefaComPrioridade: false
    };

    if (!descricaoDaTarefa) {
        res.status(400).send({ erro: "Tarefa sem descrição" });
        return;
    }

    const usuarioEncontrado = dados.usuarios.find(usuario => usuarioId == usuario.id);

    if (!usuarioEncontrado) {
        res.status(404).send({ erro: "Usuário não encontrado" });
    } else {
        usuarioEncontrado.listaDeTarefas.push(novaTarefa);
        res.send({tarefaId: novaTarefa.tarefaId})
    }

}

function alterarTarefa(req, res) {
    const usuarioId = req.params.usuarioid;
    const tarefaId = req.params.tarefaid;

    let usuarioEncontrado = dados.usuarios.find(usuario => usuario.id == usuarioId);

    if (!usuarioEncontrado) {
        res.status(404).send({ erro: "Usuário não encontrado." });
        return;
    }

    let tarefaEncontrada = usuarioEncontrado.listaDeTarefas.find(tarefa => tarefa.tarefaId == tarefaId);

    if (!tarefaEncontrada) {
        res.status(404).send({ erro: "Tarefa não encontrada." });
        return;
    }

    const descricaoDaTarefa = req.body.descricao;
    const tarefaConcluida = req.body.tarefaConcluida;
    const tarefaComPrioridade = req.body.tarefaComPrioridade;

    if(descricaoDaTarefa != undefined && descricaoDaTarefa != null && descricaoDaTarefa != "") {
        tarefaEncontrada.descricao = descricaoDaTarefa;
    }

    if(typeof(tarefaConcluida) == 'boolean') {
        tarefaEncontrada.tarefaConcluida = tarefaConcluida;
    }

    
    if(typeof(tarefaComPrioridade) == 'boolean') {
        tarefaEncontrada.tarefaComPrioridade = tarefaComPrioridade;
    }

    res.send();
}

function excluirTarefa(req, res) {
    const usuarioId = req.params.usuarioid;
    const tarefaId = req.params.tarefaid;

    let usuarioEncontrado = dados.usuarios.find(usuario => usuario.id == usuarioId);
    let tarefaEncontrada = usuarioEncontrado.listaDeTarefas.find(tarefa => tarefa.tarefaId == tarefaId);

    if (!usuarioEncontrado) {
        res.status(404).send({ erro: "Usuário não encontrado." });
        return;
    }

    if (!tarefaEncontrada) {
        res.status(404).send({ erro: "Tarefa não encontrada." });
        return;
    }

    usuarioEncontrado.listaDeTarefas = usuarioEncontrado.listaDeTarefas.filter(tarefa => tarefa.tarefaId != tarefaId);

    res.send();
}

module.exports = {
   buscarTarefas: buscarTarefas,
   buscarTarefaComId: buscarTarefaComId,
   criarTarefa: criarTarefa,
   alterarTarefa: alterarTarefa,
   excluirTarefa: excluirTarefa
}