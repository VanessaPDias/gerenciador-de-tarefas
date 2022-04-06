const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});

app.use(cors());
app.use(express.json());

const listaDeUsuarios = {
    usuarios: []
};



app.post('/usuarios', criarUsuario);
app.post('/login', login);
app.get('/usuarios/:id', buscarUsuario);
app.get('/usuarios/:usuarioid/tarefas', buscarTarefas);
app.post('/usuarios/:usuarioid/tarefas', criarTarefa);
app.patch('/usuarios/:usuarioid/tarefas/:tarefaid', marcarTarefa);
app.delete('/usuarios/:usuarioid/tarefas/:tarefaid', excluirTarefa);

function criarUsuario(req, res) {
    let usuario = {
        id: crypto.randomUUID(),
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        listaDeTarefas: []
    };

    let usuarioDuplicado = false;

    listaDeUsuarios.usuarios.forEach(element => {
        if (element.email == usuario.email) {
            usuarioDuplicado = true;
        }

    })

    if (usuarioDuplicado == true) {
        res.status(400).send({ erro: "email já foi cadastrado" });
        return;
    }

    listaDeUsuarios.usuarios.push(usuario);
    res.send({ usuarioId: usuario.id });
}

function login(req, res) {
    const email = req.body.email;
    const senha = req.body.senha;

    listaDeUsuarios.usuarios.forEach(usuario => {
        if (usuario.email == email && usuario.senha == senha) {
            res.send({ usuarioId: usuario.id });
        } else {
            res.status(400).send({ erro: "Usuário ou senha incorretos" });
        }
    })

}

function buscarUsuario(req, res) {
    const id = req.params.id;
    const usuarioEncontrado = listaDeUsuarios.usuarios.find(usuario => id == usuario.id);

    if (!usuarioEncontrado) {
        res.status(404).send({ erro: "Usuário não encontrado" });
        return;
    }

    res.send({
        id: usuarioEncontrado.id,
        nome: usuarioEncontrado.nome,
        email: usuarioEncontrado.email
    });
}

function buscarTarefas(req, res) {
    const id = req.params.usuarioid;
    let usuarioEncontrado = listaDeUsuarios.usuarios.find(usuario => usuario.id == id);

    if (!usuarioEncontrado) {
        res.status(404).send({ erro: "Usuário não encontrado" });
        return;
    }

    res.send({ tarefas: usuarioEncontrado.listaDeTarefas });
}

function criarTarefa(req, res) {
    const usuarioId = req.params.usuarioid;
    const descricaoDaTarefa = req.body.descricao;

    const novaTarefa = {
        tarefaId: crypto.randomUUID(),
        descricao: descricaoDaTarefa,
        tarefaConcluida: false
    };

    if (!descricaoDaTarefa) {
        res.status(400).send({ erro: "Tarefa sem descrição" });
        return;
    }

    const usuarioEncontrado = listaDeUsuarios.usuarios.find(usuario => usuarioId == usuario.id);

    if (!usuarioEncontrado) {
        res.status(404).send({ erro: "Usuário não encontrado" });
    } else {
        usuarioEncontrado.listaDeTarefas.push(novaTarefa);
        res.send()
    }

}

function marcarTarefa(req, res) {
    const usuarioId = req.params.usuarioid;
    const tarefaId = req.params.tarefaid;

    let usuarioEncontrado = listaDeUsuarios.usuarios.find(usuario => usuario.id == usuarioId);
    let tarefaEncontrada = usuarioEncontrado.listaDeTarefas.find(tarefa => tarefa.tarefaId == tarefaId);

    if (!usuarioEncontrado) {
        res.status(404).send({ erro: "Usuário não encontrado." });
        return;
    }

    if (!tarefaEncontrada) {
        res.status(404).send({ erro: "Tarefa não encontrada." });
        return;
    }

    tarefaEncontrada.tarefaConcluida = req.body.tarefaConcluida;

    res.send();
}

function excluirTarefa(req, res) {
    const usuarioId = req.params.usuarioid;
    const tarefaId = req.params.tarefaid;

    let usuarioEncontrado = listaDeUsuarios.usuarios.find(usuario => usuario.id == usuarioId);
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

    res.send(usuarioEncontrado.listaDeTarefas);
}

