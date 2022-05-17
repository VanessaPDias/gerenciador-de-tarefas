//importa o modulo express (biblioteca para contrução de api)
const express = require('express');

//liberar chamadas da api atraves do JS
const cors = require('cors');

//cria uma aplicação express (objeto)
const app = express();

//cria o frontend do swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./swagger.json');

const port = process.env.PORT || 3000;

//inicia o servidor
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});

//middlewares
app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

module.exports.app = app;