var config;

fetch("/config.json")
    .then(function (resp) {
        if (resp.ok) {
            resp.json().then(function (respConvertida) {
                config = respConvertida.config;
            })
        }
    })        