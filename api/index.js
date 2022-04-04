const express = require('express');
const cors = require('cors');
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

function criarUsuario(req, res) {
    let usuario = {
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
    res.send();
    console.log(listaDeUsuarios.usuarios)
}

