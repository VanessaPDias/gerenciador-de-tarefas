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
        res.status(400).send({erro: "email já foi cadastrado"});
        return;
    }

    listaDeUsuarios.usuarios.push(usuario);
    res.send({usuarioId: usuario.id});
}

function login(req, res) {
    const email = req.body.email;
    const senha = req.body.senha;

    listaDeUsuarios.usuarios.forEach(usuario => {
        if(usuario.email == email && usuario.senha == senha){
            res.send({usuarioId: usuario.id});
        } else {
            res.status(400).send({erro: "Usuário ou senha incorretos"});
        }
    })
    
}

function buscarUsuario(req, res) {
    const id = req.params.id;
    let usuarioEncontrado;

    listaDeUsuarios.usuarios.forEach(usuario => {
        if(id == usuario.id) {
           usuarioEncontrado = usuario;
        }
    });

    if(!usuarioEncontrado) {
        res.status(404).send({erro: "Usuário não encontrado"});
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
    let usuarioEncontrado;

    listaDeUsuarios.usuarios.forEach(usuario => {
        if(id == usuario.id) {
            usuarioEncontrado = usuario;
        }
    });

    if(!usuarioEncontrado) {
        res.status(404).send({erro: "Usuário não encontrado"});
        return;
    }

    res.send({tarefas: usuarioEncontrado.listaDeTarefas});
}

function criarTarefa(req, res) {
    const usuarioId = req.params.usuarioid;
    const descricaoDaTarefa = req.body.descricao;

    const novaTarefa = {
        tarefaId: crypto.randomUUID(),
        descricao:descricaoDaTarefa 
    };

    if(!descricaoDaTarefa) {
        res.status(400).send({erro: "Tarefa sem descrição"});
        return;
    }

    listaDeUsuarios.usuarios.forEach(usuario => {
        if(usuarioId == usuario.id) {
            usuario.listaDeTarefas.push(novaTarefa);
            res.send()
        } else {
            res.status(404).send({erro: "Usuário não encontrado"});
        }
    })

    
}

