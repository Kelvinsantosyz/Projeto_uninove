// formulario.js

document.getElementById('chamado-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário
    enviarChamado(); // Chama a função para enviar o chamado
});

// Função para enviar o chamado
async function enviarChamado() {
    const chamadoData = {
        ramo: document.getElementById('ramo').value,
        nome: document.getElementById('nome').value,
        sobrenome: document.getElementById('sobrenome').value,
        telefone: document.getElementById('telefone').value,
        email: document.getElementById('email').value,
        descricao: document.getElementById('descricao').value
    };

    try {
        const response = await fetch('/chamados', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(chamadoData)
        });

        const result = await response.json(); // Converte a resposta em JSON

        if (response.ok) {
            console.log('Chamado enviado com sucesso:', result);
            alert('Chamado enviado com sucesso!');
            document.getElementById('chamado-form').reset(); // Limpa o formulário
            adicionarChamadoLista(chamadoData); // Adiciona o chamado à lista
        } else {
            console.error('Erro ao enviar chamado:', result.message);
            alert('Erro ao enviar chamado: ' + result.message);
        }
    } catch (error) {
        alert('Obg');
    }
}


