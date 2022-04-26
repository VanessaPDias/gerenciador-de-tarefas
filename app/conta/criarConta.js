
window.onload = aoCarregarPagina;


function aoCarregarPagina() {
    const btnCadastrar = document.querySelector("#btn-cadastrar");

    btnCadastrar.onclick = aoCadastrarUsuario;

}
// //função contrutora do objeto Usuario
// function Usuario(nome, email, senha) {
//     this.nome = nome.toUpperCase();
//     this.email = email;
//     this.senha = senha;
// }


//função chamada pelo click do botao, recebe como parametro o objeto do evento click
function aoCadastrarUsuario(evento) {
    const nomeUsuario = document.querySelector("#inputNome").value;
    const emailUsuario = document.querySelector("#inputEmail").value;
    const senhaUsuario = document.querySelector("#inputSenha").value;

    const formulario = document.querySelector("#formulario");

    //condição para verificar se o formulario foi preenchido corretamente
    if (formulario.checkValidity() == false) {
        return;
    };

    //endpoint
    const url = 'http://localhost:3000/usuarios';

    //construtor do objeto Request - cria a requisição para o servidor
    const request = new Request(url, {
        method: 'POST',
        //conteudo enviado
        body: JSON.stringify(
            {
                nome: nomeUsuario,
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
                window.location.href = "/login/entrar.html";
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















