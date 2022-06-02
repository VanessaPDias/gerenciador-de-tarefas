const mySql = require('mySql2');
const dados = require("../dados")

const crypto = require('crypto');
const { transcode } = require('buffer');

function buscarTarefas(req, res) {
    const id = req.params.usuarioid;

    const conexao = mySql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'admin',
        database: 'todolist'
    });

    conexao.connect();

    conexao.query(`select UsuarioId, TarefaId, Descricao, Concluida, Prioridade from tarefas where UsuarioId = ${id} and Excluida = false`, function (error, results, fields) {
        if (error) {
            res.status(500).send({ erro: "Houve um erro interno ao tentar executar a sua operação. Tente mais tarde." });
            console.log(error);
            return;
        }

        const usuarioEncontrado = results;

        if (!usuarioEncontrado) {
            res.status(404).send({ erro: "Usuário não encontrado" });
            return;
        }


        res.send({ tarefas: usuarioEncontrado });
    })

}


function buscarTarefaPorId(req, res) {
    const usuarioId = req.params.usuarioid;
    const tarefaId = req.params.tarefaid;

    const conexao = mySql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'admin',
        database: 'todolist'
    });

    conexao.connect();

    conexao.query(`Select Descricao from tarefas where UsuarioId = ${usuarioId} and TarefaId = '${tarefaId}' and Excluida = false`, function (error, results, fields) {

        if (error) {
            res.status(500).send({ erro: "Houve um erro interno ao tentar executar a sua operação. Tente mais tarde." });
            console.log(error);
            return;
        }

        const tarefaEncontrada = results[0];

        if (!tarefaEncontrada) {
            res.status(404).send({ erro: "Tarefa não encontrada" });
            return;
        }

        res.send({ descricao: tarefaEncontrada.Descricao });
    })


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

    const conexao = mySql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'admin',
        database: 'todolist'
    });

    conexao.connect();

    conexao.query(`select UsuarioId from usuarios where UsuarioId = '${usuarioId}'`, function (error, results, fields) {
        if (error) {
            res.status(500).send({ erro: "Houve um erro interno ao tentar executar a sua operação. Tente mais tarde." });
            console.log(error);
            return;
        }

        const usuarioEncontrado = results[0];

        if (usuarioEncontrado) {
            conexao.query(`insert into tarefas (UsuarioId, TarefaId, Descricao, Concluida, Prioridade, Excluida) 
            values ('${usuarioEncontrado.UsuarioId}', '${novaTarefa.tarefaId}', '${novaTarefa.descricao}', ${novaTarefa.tarefaConcluida}, ${novaTarefa.tarefaComPrioridade}, false)`, function (error, results, fields) {
                if (error) {
                    res.status(500).send({ erro: "Houve um erro interno ao tentar executar a sua operação. Tente mais tarde." });
                    console.log(error);
                    return;
                }
                res.send({ tarefaId: novaTarefa.tarefaId })
            })


        } else {
            res.status(404).send({ erro: "Usuário não encontrado" });

        }
    })

}

function alterarTarefa(req, res) {
    const usuarioId = req.params.usuarioid;
    const tarefaId = req.params.tarefaid;

    const conexao = mySql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'admin',
        database: 'todolist'
    });

    conexao.connect();

    conexao.query(`select UsuarioId from usuarios where UsuarioId = '${usuarioId}'`, function (error, results, fields) {
        if (error) {
            res.status(500).send({ erro: "Houve um erro interno ao tentar executar a sua operação. Tente mais tarde." });
            console.log(error);
            return;
        }

        const usuarioEncontrado = results[0];

        if (usuarioEncontrado) {
            conexao.query(`select tarefaId, Descricao, Concluida, Prioridade from tarefas where TarefaId = '${tarefaId}' and Excluida = false`, function (error, results, fields) {
                if (error) {
                    res.status(500).send({ erro: "Houve um erro interno ao tentar executar a sua operação. Tente mais tarde." });
                    console.log(error);
                    return;
                }

                const tarefaEncontrada = results[0];

                if (tarefaEncontrada) {
                    const descricaoDaTarefa = req.body.descricao;
                    const tarefaConcluida = req.body.tarefaConcluida;
                    const tarefaComPrioridade = req.body.tarefaComPrioridade;

                    if (descricaoDaTarefa != undefined && descricaoDaTarefa != null && descricaoDaTarefa != "") {
                        tarefaEncontrada.Descricao = descricaoDaTarefa;
                    }

                    if (typeof (tarefaConcluida) == 'boolean') {
                        tarefaEncontrada.Concluida = tarefaConcluida;
                    }

                    if (typeof (tarefaComPrioridade) == 'boolean') {
                        tarefaEncontrada.Prioridade = tarefaComPrioridade;
                    }

                    conexao.query(`update tarefas set Descricao = '${tarefaEncontrada.Descricao}', Concluida = ${tarefaEncontrada.Concluida}, Prioridade = ${tarefaEncontrada.Prioridade} where TarefaId = '${tarefaId}'`, function (error, results, filds) {
                        if (error) {
                            res.status(500).send({ erro: "Houve um erro interno ao tentar executar a sua operação. Tente mais tarde." });
                            console.log(error);
                            return;
                        }

                        res.send();
                    })
                } else {
                    res.status(404).send({ erro: "Tarefa não encontrada" });
                }

            })


        } else {
            res.status(404).send({ erro: "Usuário não encontrado" });

        }
    })


}

function excluirTarefa(req, res) {
    const usuarioId = req.params.usuarioid;
    const tarefaId = req.params.tarefaid;

    const conexao = mySql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'admin',
        database: 'todolist'
    });

    conexao.connect();

    conexao.query(`select UsuarioId from usuarios where UsuarioId = '${usuarioId}'`, function (error, results, fields) {
        if (error) {
            res.status(500).send({ erro: "Houve um erro interno ao tentar executar a sua operação. Tente mais tarde." });
            console.log(error);
            return;
        }

        const usuarioEncontrado = results[0];

        if (usuarioEncontrado) {
            conexao.query(`select tarefaId from tarefas where TarefaId = '${tarefaId}'`, function (error, results, fields) {
                if (error) {
                    res.status(500).send({ erro: "Houve um erro interno ao tentar executar a sua operação. Tente mais tarde." });
                    console.log(error);
                    return;
                }

                const tarefaEncontrada = results[0];

                if (tarefaEncontrada) {
                    conexao.query(`update tarefas set Excluida = true`, function (error, results, filds) {
                        if (error) {
                            res.status(500).send({ erro: "Houve um erro interno ao tentar executar a sua operação. Tente mais tarde." });
                            console.log(error);
                            return;
                        }

                        res.send();
                    })
                } else {
                    res.status(404).send({ erro: "Tarefa não encontrada" });
                }

            })


        } else {
            res.status(404).send({ erro: "Usuário não encontrado" });

        }
    })


}



module.exports = {
    buscarTarefas: buscarTarefas,
    buscarTarefaComId: buscarTarefaPorId,
    criarTarefa: criarTarefa,
    alterarTarefa: alterarTarefa,
    excluirTarefa: excluirTarefa
}