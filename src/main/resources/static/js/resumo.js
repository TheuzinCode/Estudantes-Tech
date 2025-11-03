// Carregar dados do pedido


document.addEventListener('DOMContentLoaded', function() {
    carregarDados();
    renderizarResumo();
    configurarEventos();
});

const pedido = JSON.parse(localStorage.getItem('pedido'))
console.log("Pedido carregado do localStorage:", pedido);

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
    document.getElementById('btnConfirmar').addEventListener('click', async function() {
        await confirmarPedido();
        window.location.href = '/loja';
    });
}

    let data;



 async function confirmarPedido() {
        const order = {
          clientId: pedido.clientId,
          totalValue: pedido.total,
          itens: pedido.produtos.map(p => ({
                             productId: p.id,
                             quantity: p.qty,
                             price: p.price
                         })),
          parcelas: pedido.cartao ? pedido.cartao.parcelas : 1,
          paymentMethod: pedido.formaPagamento
        }

    try{
        const resp = await fetch('/api/orders', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(order)

        })

        data = await resp.json();

        console.log("data " + data.orderId)


        if (!resp.ok) {
            const errorText = await resp.text();
            throw new Error(`Erro ao confirmar pedido: ${errorText}`);
        }

        alert(`Pedido confirmado com sucesso!
              Número do pedido: ${data.orderId}
              Total: ${data.totalValue}`);



                localStorage.removeItem('pedido');
                localStorage.removeItem('cart_v1');


    }catch (err) {
         alert('Erro ao conectar com o servidor: ' + (err?.message || err))
    }

}