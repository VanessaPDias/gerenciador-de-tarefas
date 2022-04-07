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
app.patch('/usuarios/:usuarioid/tarefas/:tarefaid', alterarTarefa);
app.delete('/usuarios/:usuarioid/tarefas/:tarefaid', excluirTarefa);

function criarUsuario(req, res) {
    let usuario = {
        id: crypto.randomUUID(),
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        listaDeTarefas: []
    };

    const usuarioEncontrado = listaDeUsuarios.usuarios.find(usuario => usuario.email == usuario.email);

    if(!usuarioEncontrado) {
        listaDeUsuarios.usuarios.push(usuario);
        res.send({ usuarioId: usuario.id });
    } else {
        res.status(400).send({ erro: "email já foi cadastrado" });
    }

     console.log(listaDeUsuarios)

}

function login(req, res) {
    const email = req.body.email;
    const senha = req.body.senha;

    const usuarioEncontrado = listaDeUsuarios.usuarios.find(usuario => email == usuario.email && senha == usuario.senha);

    if(!usuarioEncontrado) {
        res.status(400).send({ erro: "Usuário ou senha incorretos" });
    } else {
        res.send({ usuarioId: usuarioEncontrado.id });
    }


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
        tarefaConcluida: false,
        tarefaComPrioridade: false
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
        res.send({tarefaId: novaTarefa.tarefaId})
    }

}

function alterarTarefa(req, res) {
    const usuarioId = req.params.usuarioid;
    const tarefaId = req.params.tarefaid;

    let usuarioEncontrado = listaDeUsuarios.usuarios.find(usuario => usuario.id == usuarioId);

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

