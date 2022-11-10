var bd = openDatabase("meuBD", "1.0", " Meu Banco de Dados", 4080);

bd.transaction(function (criar) {
    criar.executeSql("CREATE TABLE formulario (nome TEXT,idade INTEGER)");
});

function salvarInfo() {
    const nomeUsuario = document
        .getElementById("nome-usuario")
        .value.toUpperCase();
    const idadeUsuario = parseInt(
        document.getElementById("idade-usuario").value
    )
    
    ;

    if (nomeUsuario === "" || isNaN(idadeUsuario)) {
        alert("Faltam informaçoes!");
        return false;
    }

    bd.transaction(function (inserir) {
        inserir.executeSql(
            "INSERT INTO formulario (nome, idade) VALUES (?, ?)",
            [nomeUsuario, idadeUsuario]
        );
    });
    console.log(nomeUsuario, idadeUsuario);

    document.getElementById("nome-usuario").value = "";
    document.getElementById("idade-usuario").value = "";
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
                document.getElementById("pesquisa-nome-usuario").value = nome;
                document.getElementById("resuldado-pesquisa").value = idade;
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
                    ).innerHTML += `<p onclick="mostrarCartaoAltera('${item.nome}',${item.idade})"> Nome: ${item.nome}, ${item.idade} anos</p>`;
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
