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
app.get('/usuarios', buscarUsuario);

function criarUsuario(req, res) {
    let usuario = {
        id: crypto.randomUUID(),
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha
    };

    let usuarioDuplicado = false;

    listaDeUsuarios.usuarios.forEach(element => {
        if (element.email == usuario.email) {
            usuarioDuplicado = true;
        }

    })

    if (usuarioDuplicado == true) {
        res.status(400).send("email já foi cadastrado");
        return;
    }

    listaDeUsuarios.usuarios.push(usuario);
    res.send(usuario.id);
}

function login(req, res) {
    const email = req.body.email;
    const senha = req.body.senha;

    listaDeUsuarios.usuarios.forEach(usuario => {
        if(usuario.email == email && usuario.senha == senha){
            console.log("validação ok")
        } else {
            res.status(400).send("Usuário ou senha incorretos");
        }
    })
    res.send();
}

function buscarUsuario(req, res) {
    const id =req.query.id;
    let usuarioEncontrado;

    listaDeUsuarios.usuarios.forEach(usuario => {
        if(id == usuario.id) {
           usuarioEncontrado = usuario;
        }
    });

    if(!usuarioEncontrado) {
        res.status(404).send("Usuário não encontrado");
    }

    res.send({
        id: usuarioEncontrado.id, 
        nome: usuarioEncontrado.nome, 
        email: usuarioEncontrado.email
    });
}

