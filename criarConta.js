
window.onload = iniciar;


function iniciar() {
    const btnCadastrar = document.querySelector("#btn-cadastrar");

    btnCadastrar.onclick = cadastrarUsuario;

    document.querySelector("#inputEmail").onfocus = limparErro;

}
//função contrutora do objeto Usuario
function Usuario(nome, email, senha) {
    this.nome = nome;
    this.email = email;
    this.senha = senha;
}


//função chamada pelo click do botao, recebe como parametro o objeto do evento click
function cadastrarUsuario(evento) {
    const nomeUsuario = document.querySelector("#inputNome").value;
    const emailUsuario = document.querySelector("#inputEmail").value;
    const senhaUsuario = document.querySelector("#inputSenha").value;

    const formulario = document.querySelector("#formulario");

    //condição para verificar se o formulario foi preenchido corretamente
    if (formulario.checkValidity() == false) {
        return;
    };

    //cria um novo objeto Usuario
    let usuario = new Usuario(nomeUsuario, emailUsuario, senhaUsuario);

    //condição para verificar se email já foi cadastrado
    if (localStorage.getItem(usuario.email) !== null) {
       document.querySelector("#erro").innerHTML = `Já existe um usuário cadastrado com esse email.`
       
       //interrompe o submit do formulario
        return false;
    }

    //função para criar uma entrada no banco de dados (chave: valor)
    localStorage.setItem(usuario.email, JSON.stringify(usuario));
}

function limparErro() {
    document.querySelector("#erro").innerHTML = ``;
}













