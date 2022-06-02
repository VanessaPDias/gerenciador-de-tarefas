
const servidor = require('./servidor');

const usuariosController = require('./controllers/usuariosController');

const loginController = require('./controllers/loginController');

const tarefasController = require('./controllers/tarefasController');


//definição de rota
servidor.app.post('/usuarios', usuariosController.criarUsuario);
servidor.app.post('/login', loginController.login);
servidor.app.get('/usuarios/:id', usuariosController.buscarUsuario);
servidor.app.get('/usuarios/:usuarioid/tarefas', tarefasController.buscarTarefas);
servidor.app.get('/usuarios/:usuarioid/tarefas/:tarefaid', tarefasController.buscarTarefaComId)
servidor.app.post('/usuarios/:usuarioid/tarefas', tarefasController.criarTarefa);
servidor.app.patch('/usuarios/:usuarioid/tarefas/:tarefaid', tarefasController.alterarTarefa);
servidor.app.delete('/usuarios/:usuarioid/tarefas/:tarefaid', tarefasController.excluirTarefa);


