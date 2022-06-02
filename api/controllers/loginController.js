
const bancoDeDados = require("../conexao");


function login(req, res) {
    const email = req.body.email;
    const senha = req.body.senha;

    const conexao = bancoDeDados.abrirConexao();


    conexao.query(`select UsuarioId from usuarios where email = '${email}' and senha = '${senha}'`, function (error, results, fields) {
        const usuarioEncontrado = results[0];

        if (!usuarioEncontrado) {
            res.status(400).send({ erro: "Usuário ou senha incorretos" });
        } else {
            res.send({ usuarioId: usuarioEncontrado.UsuarioId });
        }
    });

}

exports.login = login;