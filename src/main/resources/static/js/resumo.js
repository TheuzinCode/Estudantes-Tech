// Carregar dados do pedido


document.addEventListener('DOMContentLoaded', function() {
    carregarDados();
    renderizarResumo();
    configurarEventos();
});

const pedido = JSON.parse(localStorage.getItem('pedido'))

console.log(pedido)

function carregarDados() {
    if (!pedido) {
        alert('Nenhum pedido encontrado. Redirecionando para o checkout...');
        window.location.href = '/loja';
        return;
    }
}

function renderizarResumo() {
    // Renderizar endereço
    const enderecoResumo = document.getElementById('enderecoResumo');
    enderecoResumo.innerHTML = `
        <p>${pedido.endereco.street}</p>
        <p>${pedido.endereco.neighborhood} - ${pedido.endereco.city} - ${pedido.endereco.number}</p>
        <p>CEP: ${pedido.endereco.cep}</p>
    `;

    // Renderizar forma de pagamento
    const pagamentoResumo = document.getElementById('pagamentoResumo');
    if (pedido.formaPagamento === 'cartao') {
        const ultimosDigitos = pedido.cartao.numero.slice(-4);
        pagamentoResumo.innerHTML = `
            <p><strong>Cartão de Crédito</strong></p>
            <p>**** **** **** ${ultimosDigitos}</p>
            <p>${pedido.cartao.nome}</p>
            <p>${pedido.cartao.parcelas}x sem juros</p>
        `;
    } else {
        pagamentoResumo.innerHTML = `
            <p><strong>Boleto Bancário</strong></p>
            <p>O boleto será enviado para seu e-mail após a confirmação.</p>
            <p style="color: var(--discount); font-weight: 600;">Desconto de 5% aplicado</p>
        `;
    }

    // Renderizar produtos
    const produtosResumo = document.getElementById('produtosResumo');
    produtosResumo.innerHTML = pedido.produtos.map(produto => `
        <div class="produto-item">
            <img src="/api/placeholder/80/80" alt="${produto.name}" class="produto-imagem">
            <div class="produto-info">
                <h4>${produto.name}</h4>
                <p>Quantidade: ${produto.qty}</p>
                <p class="produto-preco">R$ ${(produto.price * produto.qty).toFixed(2).replace('.', ',')}</p>
            </div>
        </div>
    `).join('');

    // Calcular e renderizar totais
    const subtotal = pedido.subtotal;
    const desconto = pedido.formaPagamento === 'boleto' ? subtotal * 0.05 : 0;
    const total = subtotal - desconto;


    document.getElementById('subtotalResumo').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    document.getElementById('totalResumo').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;

    if (pedido.formaPagamento === 'boleto') {
        document.getElementById('discountRowResumo').style.display = 'flex';
        document.getElementById('discountResumo').textContent = `- R$ ${desconto.toFixed(2).replace('.', ',')}`;
    }
}

function configurarEventos() {
    // Botão voltar
    document.getElementById('btnVoltar').addEventListener('click', function() {
        window.location.href = '/checkout';
    });

    // Botão confirmar
    document.getElementById('btnConfirmar').addEventListener('click', function() {
        confirmarPedido();
        window.location.href = '/loja';
    });
}

function confirmarPedido() {
    // Gerar número do pedido
    const numeroPedido = 'PED' + Date.now().toString().slice(-8);

    // Mostrar modal de confirmação
    document.getElementById('numeroPedido').textContent = numeroPedido;
    document.getElementById('modalConfirmacao').style.display = 'flex';

    // Limpar dados do localStorage
    localStorage.removeItem('pedido');
    localStorage.removeItem('cart_v1');
}