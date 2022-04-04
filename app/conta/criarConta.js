
window.onload = aoCarregarPagina;


function aoCarregarPagina() {
    const btnCadastrar = document.querySelector("#btn-cadastrar");

    btnCadastrar.onclick = aoCadastrarUsuario;

}
//função contrutora do objeto Usuario
function Usuario(nome, email, senha) {
    this.nome = nome.toUpperCase();
    this.email = email;
    this.senha = senha;
}


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

    //cria um novo objeto Usuario
    let usuario = new Usuario(nomeUsuario, emailUsuario, senhaUsuario);

    //condição para verificar se email já foi cadastrado
    if (localStorage.getItem(usuario.email) !== null) {
        const elementoToast = document.querySelector("#elemento-toast");
        const toast = new bootstrap.Toast(elementoToast);
        toast.show();

        //interrompe o submit do formulario
        return false;
    }

    //função para criar uma entrada no banco de dados (chave: valor)
    localStorage.setItem(usuario.email, JSON.stringify(usuario));
}















