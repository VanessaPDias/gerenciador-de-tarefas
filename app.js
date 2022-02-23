

const usuario = JSON.parse(localStorage.getItem("logado"));

if (usuario.logado !== true) {
    window.location.href = "/entrar.html"
};

window.onload = iniciar;

function iniciar() {
    const avatar = document.querySelector("#avatar")
    const nomeUsuario = document.querySelector("#nomeUsuario");


    nomeUsuario.innerHTML = usuario.nome;


}




    // const btnSair = document.querySelector("#btnSair");
    // btnSair.onclick = function () {
    //     localStorage.removeItem("logado");
    //     window.location.href = "/index.html"
    // }



