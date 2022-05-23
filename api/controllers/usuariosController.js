
const mySql = require('mysql2');

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

    if (!novoUsuario.email) {
        res.status(400).send({ erro: "Não é possível cadastrar usuário sem email" });
        return;
    }


    const conexao = mySql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'admin',
        database: 'todolist'
    });

    conexao.connect();

    conexao.query(`select UsuarioId from usuarios where email = '${novoUsuario.email}'`, function (error, results, fields) {
        const usuarioEncontrado = results[0];

        if (!usuarioEncontrado) {
            conexao.query(`insert into usuarios (UsuarioId, Nome, Email, Senha) 
            values ('${novoUsuario.id}', '${novoUsuario.nome}', '${novoUsuario.email}', '${novoUsuario.senha}')`, function (error, results, fields) {
                if(error) {
                    res.status(500).send({erro: "Houve um erro interno ao tentar execultar a sua operação. Tente mais tarde."});
                    return;
                }
               
                res.send({ usuarioId: novoUsuario.id });
                
            })
            
        } else {
            res.status(400).send({ erro: "Email já foi cadastrado" });
        }
    });


}

function buscarUsuario(req, res) {
    const id = req.params.id;

    const conexao = mySql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'admin',
        database: 'todolist'
    });

    conexao.connect();

    conexao.query(`select * from usuarios where UsuarioId = ${id}`, function (error, results, fields) {
        const usuarioEncontrado = results[0];

        if (!usuarioEncontrado) {
            res.status(404).send({ erro: "Usuário não encontrado" });
            return;
        }
    
        res.send({
            id: usuarioEncontrado.UsuarioId,
            nome: usuarioEncontrado.Nome,
            email: usuarioEncontrado.Email,
            //tarefas: usuarioEncontrado.listaDeTarefas
        });
    })

}

module.exports = {
    criarUsuario: criarUsuario,
    buscarUsuario: buscarUsuario
}