window.onload = iniciar;

function iniciar() {
    const btnEntrar = document.querySelector("#btn-entrar");

    btnEntrar.onclick = validarUsuario;

}

function validarUsuario(evento) {
    const emailUsuario = document.querySelector("#inputEmail").value;
    const senhaUsuario = document.querySelector("#inputSenha").value;

    const formulario = document.querySelector("#formulario");

    //condição para verificar se o formulario foi preenchido corretamente
    if (formulario.checkValidity() == false) {
        return;
    };


    //endpoint
    const url = 'http://localhost:3000/login';

    //construtor do objeto Request - cria a requisição para o servidor
    const request = new Request(url, {
        method: 'POST',
        //conteudo enviado
        body: JSON.stringify(
            {
                email: emailUsuario,
                senha: senhaUsuario
            }),
        headers: {
            //tipo de conteudo enviado
            "Content-Type": "application/json"
        }
    });

    //faz a solicitacao para o servidor
    fetch(request)
        //promise com a resposta enviada pelo servidor
        .then(function (resp) {
            if (resp.ok) {
                resp.json().then(function(respConvertida){
                localStorage.setItem("logado", JSON.stringify({ usuarioId: respConvertida.usuarioId, nome: respConvertida.nome, email: respConvertida.email, tarefas: respConvertida.tarefas }));
                window.location.href = "../app.html";    
                })
                
            } else {
                //converte a resposta para json
                resp.json().then(function (respConvertida) {
                    const elementoToast = document.querySelector("#elemento-toast");
                    const toast = new bootstrap.Toast(elementoToast);

                    document.querySelector("#mensagem-erro").innerHTML = respConvertida.erro;
                    toast.show();
                })
            }
        })

    return false;
}


