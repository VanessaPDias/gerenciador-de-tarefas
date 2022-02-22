
window.onload = iniciar;


function iniciar() {
    const btnCadastrar = document.querySelector("#btn-cadastrar");

    btnCadastrar.onclick = cadastrarUsuario;

    document.querySelector("#inputEmail").onfocus = limparErro;

}

function Usuario(nome, email, senha) {
    this.nome = nome;
    this.email = email;
    this.senha = senha;
}



function cadastrarUsuario(evento) {
    const nomeUsuario = document.querySelector("#inputNome").value;
    const emailUsuario = document.querySelector("#inputEmail").value;
    const senhaUsuario = document.querySelector("#inputSenha").value;

    const formulario = document.querySelector("#formulario");

    if (formulario.checkValidity() == false) {
        return;
    };

    let usuario = new Usuario(nomeUsuario, emailUsuario, senhaUsuario);

    if (localStorage.getItem(usuario.email) !== null) {
       document.querySelector("#erro").innerHTML = `Já existe um usuário cadastrado com esse email.`
       
        evento.preventDefault();
        return;
    }

    localStorage.setItem(usuario.email, JSON.stringify(usuario));
}

function limparErro() {
    document.querySelector("#erro").innerHTML = ``;
}













