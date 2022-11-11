var bd = openDatabase("meuBD", "1.0", " Meu Banco de Dados", 4080);

bd.transaction(function (criar) {
    criar.executeSql(
        "CREATE TABLE formulario (nome TEXT, idade INTEGER,altura FLOAT(2, 4), dataNasc DATE  , contatos JSON)"
    );
});

function salvarInfo() {
    const nomeUsuario = document
        .getElementById("nome-usuario")
        .value.toUpperCase();
    const idadeUsuario = parseInt(
        document.getElementById("idade-usuario").value
    );

    const altura = parseFloat(document.getElementById("altura-usuario").value);
    const dataNasc = document.getElementById("data-nasc-usuario").value;

    const emailUsuario = document.getElementById("email-usuario").value;
    const telefoneUsuario = document.getElementById("telefone-usuario").value;

    const contatos = { "e-mail": emailUsuario, tel: telefoneUsuario };

    if (nomeUsuario === "" || isNaN(idadeUsuario)) {
        alert("Faltam informaçoes!");
        return false;
    }
    console.log([
        nomeUsuario,
        idadeUsuario,
        altura,
        dataNasc,
        JSON.stringify(contatos),
    ]);
    bd.transaction(function (inserir) {
        inserir.executeSql(
            "INSERT INTO formulario (nome, idade, altura, dataNasc, contatos) VALUES (?, ?, ?, ?, ?)",
            [
                nomeUsuario,
                idadeUsuario,
                altura,
                dataNasc,
                JSON.stringify(contatos),
            ]
        );
    });
    console.log(nomeUsuario, idadeUsuario, altura, dataNasc, contatos);

    document.getElementById("nome-usuario").value = "";
    document.getElementById("idade-usuario").value = "";
    document.getElementById("altura-usuario").value = "";
    document.getElementById("data-nasc-usuario").value = "";

    document.getElementById("email-usuario").value = "";
    document.getElementById("telefone-usuario").value = "";
}

function pesquisaPorNome() {
    const nomeUsuario = document
        .getElementById("pesquisa-nome-usuario")
        .value.toUpperCase();

    bd.transaction(function (ler) {
        ler.executeSql(
            `SELECT * FROM  formulario WHERE nome LIKE "%${nomeUsuario}%"`,
            [],
            function (ler, resultados) {
                const tamanho = resultados.rows.length;

                const msg = tamanho + "linhas encontradas";
                console.log(msg);

                const nome = resultados.rows.item(tamanho - 1).nome;
                const idade = resultados.rows.item(tamanho - 1).idade;
                const cpf = resultados.rows.item(-1).cpf;
                const email = resultados.rows.item(-1).email;
                document.getElementById("pesquisa-nome-usuario").value = nome;
                document.getElementById("resuldado-pesquisa").value = idade;
                document.getElementById("pesquisa-cpf-usuario").value = cpf;
                document.getElementById("pesquisa-email-usuario").value = email;
            }
        );
    });
}

function exibeBD() {
    bd.transaction(function (exibe) {
        exibe.executeSql(
            "SELECT * FROM formulario",
            [],
            function (exibe, resultados) {
                const tamanho = resultados.rows.length;
                let item;

                document.getElementById("lista-bd").innerHTML = "";

                for (let i = 0; i < tamanho; i++) {
                    item = resultados.rows.item(i);
                    document.getElementById(
                        "lista-bd"
                    ).innerHTML += `<p onclick="mostrarCartaoAltera('${item.nome}',${item.idade},'${item.cpf}','${item.email})"> Nome: ${item.nome}, ${item.idade} anos</p>`;
                }
            }
        );
    });
}

function alteraInfo() {
    const novoNome = document.getElementById("nome-alteraçao").value;
    const novaIdade = parseInt(
        document.getElementById("idade-alteraçao").value
    );

    bd.transaction(function (altera) {
        altera.executeSql(
            `UPDATE formulario SET nome= "${novoNome}",idade=${novaIdade} WHERE nome= "${nomeAtualParaEditar}" AND idade=${idadeAtualParaEditar}`
        );
    });
    exibeBD();
}

function excluiInfo() {
    bd.transaction(function (excluir) {
        excluir.executeSql(
            `DELETE FROM formulario WHERE nome="${nomeAtualParaEditar}" AND idade=${idadeAtualParaEditar}`
        );
    });

    exibeBD();
}
