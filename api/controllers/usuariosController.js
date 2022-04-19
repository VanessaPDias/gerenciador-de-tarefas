
const dados = require('../dados')

//geração de identificadores unicos
const crypto = require('crypto'); 

function criarUsuario(req, res) {
    let novoUsuario = {
        id: crypto.randomUUID(),
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        listaDeTarefas: []
    };


    novoUsuario.batatas = 10.;

    const usuarioEncontrado = dados.usuarios.find(usuario => novoUsuario.email == usuario.email);

    if(!usuarioEncontrado) {
        dados.usuarios.push(novoUsuario);
        res.send({ usuarioId: novoUsuario.id });
    } else {
        res.status(400).send({ erro: "email já foi cadastrado" });
    }

}

function buscarUsuario(req, res) {
    const id = req.params.id;
    const usuarioEncontrado = dados.usuarios.find(usuario => id == usuario.id);

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

module.exports = {
    criarUsuario: criarUsuario,
    buscarUsuario: buscarUsuario
}