window.onload = iniciar;

function iniciar() {
    const btnEntrar = document.querySelector("#btn-entrar");

    btnEntrar.onclick = validarUsuario;

}

function validarUsuario(evento) {
    const inputEmail = document.querySelector("#inputEmail").value;
    const inputSenha = document.querySelector("#inputSenha").value;

    const formulario = document.querySelector("#formulario");

    //condição para verificar se o formulario foi preenchido corretamente
    if (formulario.checkValidity() == false) {
        return;
    };

    if (localStorage.getItem(inputEmail) == null) {
        document.querySelector("#erro").innerHTML = `Usuário ou senha incorretos.`;
        return false;
    }


    if (localStorage.getItem(inputEmail) !== null) {
        const usuario = JSON.parse(localStorage.getItem(inputEmail));

        if (inputSenha === usuario.senha) {
            localStorage.setItem("logado", JSON.stringify({ logado: true, nome: usuario.nome, email: usuario.email }));
            return true;

        } else {
            const elementoToast = document.querySelector("#elemento-toast");
            const toast = new bootstrap.Toast(elementoToast);
            toast.show();
            return false;
        }
    }

}


