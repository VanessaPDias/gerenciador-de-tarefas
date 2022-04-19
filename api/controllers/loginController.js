
const dados = require('../dados')

function login(req, res) {
    const email = req.body.email;
    const senha = req.body.senha;

    const usuarioEncontrado = dados.usuarios.find(usuario => email == usuario.email && senha == usuario.senha);

    if(!usuarioEncontrado) {
        res.status(400).send({ erro: "Usuário ou senha incorretos" });
    } else {
        res.send({ usuarioId: usuarioEncontrado.id });
    }


}

exports.login = login;