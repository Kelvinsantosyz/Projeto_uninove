// chamados.js

// Função para abrir aba com animação suave
function openTab(evt, tabName) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        // Remover a classe 'active' de todas as abas
        content.classList.remove('active');
    });

    const tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(link => link.classList.remove('active'));

    // Adicionar a classe 'active' à aba clicada
    const targetTab = document.getElementById(tabName);
    targetTab.classList.add('active');
    evt.currentTarget.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    const userNameSpan = document.getElementById('user-name');
    const chamadosList = document.getElementById('chamados-list');
    const chamadosListSolucionados = document.getElementById('chamados-list-solucionados');

    // Função para carregar informações do usuário
    async function loadUserInfo() {
        try {
            const response = await fetch('/user-info');
            const data = await response.json();
            if (data.success) {
                const { Nome, Sobrenome } = data.user;
                userNameSpan.textContent = `${Nome} ${Sobrenome}`;
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Erro ao carregar informações do usuário:', error);
            alert('Erro ao se comunicar com o servidor.');
        }
    }

    // Função para carregar chamados
    async function loadChamados() {
        try {
            const response = await fetch('/chamados');
            const data = await response.json();
            chamadosList.innerHTML = '';
            chamadosListSolucionados.innerHTML = '';

            if (data.chamados.length === 0) {
                chamadosList.innerHTML = '<p>Nenhum chamado aberto.</p>';
                chamadosListSolucionados.innerHTML = '<p>Nenhum chamado solucionado.</p>';
            }

            data.chamados.forEach(chamado => {
                const chamadoElement = document.createElement('div');
                chamadoElement.className = chamado.status === 'Solucionado' ? 'chamado solucionado' : 'chamado';

                chamadoElement.innerHTML = `
                    <h2>${chamado.nome} ${chamado.sobrenome}</h2>
                    <p>Email: ${chamado.email}</p>
                    <p>Telefone: ${chamado.telefone}</p>
                    <p>Ramo: ${chamado.ramo}</p>
                    <p>Descrição: ${chamado.descricao}</p>
                    <p>Status: ${chamado.status}</p>
                    <p>Data de Criação: ${new Date(chamado.data_criacao).toLocaleString()}</p>
                `;

                // Criação do botão para atualizar status
                if (chamado.status !== 'Solucionado') {
                    const updateButton = document.createElement('button');
                    updateButton.textContent = 'Marcar como Solucionado';
                    updateButton.onclick = () => updateStatus(chamado.id, 'Solucionado');
                    chamadoElement.appendChild(updateButton);
                }

                // Criação do botão para excluir chamado
                const deleteButton = document.createElement('button');
                deleteButton.className = 'delete';
                deleteButton.textContent = 'Excluir Chamado';
                deleteButton.onclick = () => deleteChamado(chamado.id);
                chamadoElement.appendChild(deleteButton);

                // Adiciona o chamado à lista correspondente
                if (chamado.status === 'Pendente') {
                    chamadosList.appendChild(chamadoElement);
                } else {
                    chamadosListSolucionados.appendChild(chamadoElement);
                }
            });
        } catch (error) {
            console.error('Erro ao carregar chamados:', error);
            chamadosList.innerHTML = 'Erro ao carregar chamados.';
        }
    }

    // Função para atualizar status do chamado
    window.updateStatus = async function(id, status) {
        try {
            const response = await fetch(`/chamados/${id}/status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });
            const data = await response.json();
            if (data.success) {
                alert(data.message);
                loadChamados(); // Recarrega os chamados após atualização
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            alert('Erro ao se comunicar com o servidor.');
        }
    };

    // Função para excluir chamado
    window.deleteChamado = async function(id) {
        try {
            const response = await fetch(`/chamados/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.success) {
                alert(data.message);
                loadChamados(); // Recarrega os chamados após exclusão
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Erro ao excluir chamado:', error);
            alert('Erro ao se comunicar com o servidor.');
        }
    };

    // Função para logout
    document.getElementById('logout-btn').addEventListener('click', async () => {
        try {
            const response = await fetch('/logout', { method: 'POST' });
            const data = await response.json();
            if (data.success) {
                alert(data.message);
                window.location.href = '/index.html';
            } else {
                alert('Erro ao fazer logout.');
            }
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            alert('Erro ao se comunicar com o servidor.');
        }
    });

    // Carregar informações do usuário e chamados ao iniciar
    loadUserInfo();
    loadChamados();

    // Verifica se a aba 'pendentes' deve ser mostrada por padrão
    document.querySelector('.tab-link').click();
});
