
const bancoDeDados = require("../conexao");

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


    const conexao = bancoDeDados.abrirConexao();

    conexao.query(`select UsuarioId from usuarios where email = '${novoUsuario.email}'`, function (error, results, fields) {
        if(error) {
            res.status(500).send({erro: "Houve um erro interno ao tentar executar a sua operação. Tente mais tarde."});
            console.log(error);
            return;
        }
        const usuarioEncontrado = results[0];

        if (!usuarioEncontrado) {
            conexao.query(`insert into usuarios (UsuarioId, Nome, Email, Senha) 
            values ('${novoUsuario.id}', '${novoUsuario.nome}', '${novoUsuario.email}', '${novoUsuario.senha}')`, function (error, results, fields) {
                if(error) {
                    res.status(500).send({erro: "Houve um erro interno ao tentar executar a sua operação. Tente mais tarde."});
                    console.log(error);
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

    const conexao = bancoDeDados.abrirConexao();

    conexao.query(`select U.UsuarioId, U.Nome, U.Email, T.TarefaId, T.Descricao, T.Concluida, T.Prioridade from usuarios U left join tarefas T on U.usuarioId = T.usuarioId where  U.usuarioId = '${id}'`, function (error, results, fields) {
        if(error) {
            res.status(500).send({erro: "Houve um erro interno ao tentar executar a sua operação. Tente mais tarde."});
            console.log(error);
            return;
        }

        const usuarioEncontrado = results[0];

        if (!usuarioEncontrado) {
            res.status(404).send({ erro: "Usuário não encontrado" });
            return;
        }

        const tarefas = [];

        results.forEach(item => {
            if(!item.TarefaId) {
                return;
            }

            tarefas.push({
                tarefaId: item.TarefaId,
                descricao: item.Descricao,
                tarefaConcluida: item.Concluida,
                tarefaComPrioridade: item.Prioridade
            })
        })
    
        res.send({
            id: usuarioEncontrado.UsuarioId,
            nome: usuarioEncontrado.Nome,
            email: usuarioEncontrado.Email,
            tarefas: tarefas
        });
    })

}

module.exports = {
    criarUsuario: criarUsuario,
    buscarUsuario: buscarUsuario
}