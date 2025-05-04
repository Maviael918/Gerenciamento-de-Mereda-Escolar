// Armazenamento de dados no localStorage
const storage = {
    escolas: JSON.parse(localStorage.getItem('escolas')) || [],
    produtos: JSON.parse(localStorage.getItem('produtos')) || [],
    alocacoes: JSON.parse(localStorage.getItem('alocacoes')) || [],

    save() {
        localStorage.setItem('escolas', JSON.stringify(this.escolas));
        localStorage.setItem('produtos', JSON.stringify(this.produtos));
        localStorage.setItem('alocacoes', JSON.stringify(this.alocacoes));
    }
};

// Elementos do modal
const modal = document.getElementById('modal-frizers');
const modalTitle = document.getElementById('modal-title');
const modalFrizersContainer = document.getElementById('modal-frizers-container');
const closeModal = document.querySelector('.close-modal');

// Navegação por abas
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
        
        // Atualiza as listas quando a aba de cadastrados é aberta
        if (btn.dataset.tab === 'cadastrados') {
            renderListasCadastrados();
        }
        // Atualiza a visualização quando a aba é aberta
        else if (btn.dataset.tab === 'visualizacao') {
            renderEscolasVisualizacao();
        }
    });
});

// Formulário de Escolas
document.getElementById('form-escola').addEventListener('submit', e => {
    e.preventDefault();
    const nome = document.getElementById('nome-escola').value.trim();
    
    if (nome) {
        storage.escolas.push({
            id: Date.now(),
            nome
        });
        
        storage.save();
        document.getElementById('form-escola').reset();
        renderEscolas();
        renderEscolasVisualizacao();
        populateSelects();
    }
});

// Formulário de Produtos
document.getElementById('form-produto').addEventListener('submit', e => {
    e.preventDefault();
    const nome = document.getElementById('nome-produto').value.trim();
    
    if (nome) {
        storage.produtos.push({
            id: Date.now(),
            nome
        });
        
        storage.save();
        document.getElementById('form-produto').reset();
        renderProdutos();
        populateSelects();
    }
});

// Formulário de Alocação
document.getElementById('form-alocacao').addEventListener('submit', e => {
    e.preventDefault();
    const escolaId = parseInt(document.getElementById('escola-alocacao').value);
    const produtoId = parseInt(document.getElementById('produto-alocacao').value);
    const frise = parseInt(document.getElementById('frise-alocacao').value);
    const quantidade = parseInt(document.getElementById('quantidade-alocacao').value);
    
    if (escolaId && frise && produtoId && quantidade > 0) {
        storage.alocacoes.push({
            id: Date.now(),
            escolaId,
            produtoId,
            frise,
            quantidade
        });
        
        storage.save();
        document.getElementById('form-alocacao').reset();
        renderAlocacoes();
        renderEscolasVisualizacao();
    }
});

// Função para renderizar a visualização das escolas
function renderEscolasVisualizacao() {
    const container = document.getElementById('visualizacao-escolas');
    container.innerHTML = '';
    
    const termoBusca = document.getElementById('busca-escola').value.toLowerCase();
    
    const escolasFiltradas = storage.escolas.filter(escola => 
        escola.nome.toLowerCase().includes(termoBusca)
    );
    
    escolasFiltradas.forEach(escola => {
        const card = document.createElement('div');
        card.className = 'escola-card';
        
        // Conta quantos frises estão ocupados nesta escola
        const frisesOcupados = new Set(
            storage.alocacoes
                .filter(a => a.escolaId === escola.id)
                .map(a => a.frise)
        ).size;
        
        card.innerHTML = `
            <div class="escola-icon">
                <i class="fas fa-school"></i>
            </div>
            <div class="escola-name">${escola.nome}</div>
            <div class="escola-info">${frisesOcupados}/11 frises ocupados</div>
        `;
        
        card.addEventListener('click', () => {
            openModalFrizers(escola);
        });
        
        container.appendChild(card);
    });
}

// Função para renderizar as listas na aba de cadastrados
function renderListasCadastrados() {
    renderEscolas();
    renderProdutos();
    renderAlocacoes();
}

// Função para abrir o modal com os frises da escola
function openModalFrizers(escola) {
    modalTitle.textContent = `Frizers - ${escola.nome}`;
    modalFrizersContainer.innerHTML = '';
    
    // Cria um card para cada frise (1-11)
    for (let frise = 1; frise <= 11; frise++) {
        const frizerDiv = document.createElement('div');
        frizerDiv.className = 'frizer-card';
        
        const header = document.createElement('div');
        header.className = 'frizer-header';
        
        // Conta produtos neste frise
        const produtosNoFrise = storage.alocacoes.filter(a => 
            a.escolaId === escola.id && a.frise === frise
        ).length;
        
        header.innerHTML = `
            <span>Frise ${frise}</span>
            <span>${produtosNoFrise} itens</span>
        `;
        
        const content = document.createElement('div');
        content.className = 'frizer-items';
        
        // Filtra alocações para esta escola e frise
        const alocacoes = storage.alocacoes.filter(a => 
            a.escolaId === escola.id && a.frise === frise
        );
        
        if (alocacoes.length > 0) {
            alocacoes.forEach(alocacao => {
                const produto = storage.produtos.find(p => p.id === alocacao.produtoId);
                if (produto) {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'frizer-item';
                    itemDiv.innerHTML = `
                        <span>${produto.nome}</span>
                        <span>${alocacao.quantidade}</span>
                    `;
                    content.appendChild(itemDiv);
                }
            });
        } else {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty-frizer';
            emptyDiv.textContent = 'Vazio';
            content.appendChild(emptyDiv);
        }
        
        frizerDiv.appendChild(header);
        frizerDiv.appendChild(content);
        modalFrizersContainer.appendChild(frizerDiv);
    }
    
    modal.style.display = 'block';
}

// Fechar modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Busca de escolas
document.getElementById('busca-escola').addEventListener('input', () => {
    renderEscolasVisualizacao();
});

// Funções de renderização
function renderEscolas() {
    const container = document.getElementById('lista-escolas');
    container.innerHTML = '';
    
    storage.escolas.forEach(escola => {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `
            <span>${escola.nome}</span>
            <button onclick="deleteEscola(${escola.id})">Excluir</button>
        `;
        container.appendChild(div);
    });
}

function renderProdutos() {
    const container = document.getElementById('lista-produtos');
    container.innerHTML = '';
    
    storage.produtos.forEach(produto => {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `
            <span>${produto.nome}</span>
            <button onclick="deleteProduto(${produto.id})">Excluir</button>
        `;
        container.appendChild(div);
    });
}

function renderAlocacoes() {
    const container = document.getElementById('lista-alocacoes');
    container.innerHTML = '';
    
    storage.alocacoes.forEach(alocacao => {
        const escola = storage.escolas.find(e => e.id === alocacao.escolaId);
        const produto = storage.produtos.find(p => p.id === alocacao.produtoId);
        
        if (escola && produto) {
            const div = document.createElement('div');
            div.className = 'item';
            div.innerHTML = `
                <span>
                    ${produto.nome} | ${escola.nome} | Frise ${alocacao.frise} | Qtd: ${alocacao.quantidade}
                </span>
                <button onclick="deleteAlocacao(${alocacao.id})">Excluir</button>
            `;
            container.appendChild(div);
        }
    });
}

// Funções para popular selects
function populateSelects() {
    const escolaSelect = document.getElementById('escola-alocacao');
    const produtoSelect = document.getElementById('produto-alocacao');
    
    escolaSelect.innerHTML = '<option value="">Selecione a Escola</option>' + 
        storage.escolas.map(escola => `<option value="${escola.id}">${escola.nome}</option>`).join('');
    
    produtoSelect.innerHTML = '<option value="">Selecione o Produto</option>' + 
        storage.produtos.map(produto => `<option value="${produto.id}">${produto.nome}</option>`).join('');
}

// Funções de exclusão (globais)
window.deleteEscola = (id) => {
    if (confirm('Tem certeza que deseja excluir esta escola e todas suas alocações?')) {
        storage.escolas = storage.escolas.filter(e => e.id !== id);
        storage.alocacoes = storage.alocacoes.filter(a => a.escolaId !== id);
        storage.save();
        renderEscolas();
        renderEscolasVisualizacao();
        renderAlocacoes();
        populateSelects();
    }
};

window.deleteProduto = (id) => {
    if (confirm('Tem certeza que deseja excluir este produto e todas suas alocações?')) {
        storage.produtos = storage.produtos.filter(p => p.id !== id);
        storage.alocacoes = storage.alocacoes.filter(a => a.produtoId !== id);
        storage.save();
        renderProdutos();
        renderAlocacoes();
        renderEscolasVisualizacao();
        populateSelects();
    }
};

window.deleteAlocacao = (id) => {
    if (confirm('Tem certeza que deseja excluir esta alocação?')) {
        storage.alocacoes = storage.alocacoes.filter(a => a.id !== id);
        storage.save();
        renderAlocacoes();
        renderEscolasVisualizacao();
    }
};

// Inicialização
function init() {
    renderEscolas();
    renderProdutos();
    renderAlocacoes();
    renderEscolasVisualizacao();
    populateSelects();
}

init();