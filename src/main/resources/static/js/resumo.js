// Carregar dados do pedido


document.addEventListener('DOMContentLoaded', function() {
    carregarDados();
    renderizarResumo();
    configurarEventos();
    renderizarFrete();
});

const pedido = JSON.parse(localStorage.getItem('pedido'))
console.log("Pedido carregado do localStorage:", pedido);
const frete = localStorage.getItem('cart_shipping_v1')



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

            <div class="produto-info">
                <h4>${produto.name}</h4>
                <p>Quantidade: ${produto.qty}</p>
                <p class="produto-preco">R$ ${(produto.price * produto.qty).toFixed(2).replace('.', ',')}</p>
            </div>
        </div>
    `).join('');


    let valorFrete = 0


    if(frete == "premium"){
        valorFrete = 15
    }if(frete == "expresso"){
        valorFrete = 10
    }if(frete == "economico"){
        valorFrete = 5
    }

    pedido.valorFrete = valorFrete;

    // Calcular e renderizar totais
    const subtotal = pedido.produtos.reduce((acc, p)  => acc + (p.price * p.qty), 0);

    const total = subtotal + valorFrete

    console.log(total)
    const desconto = pedido.formaPagamento === 'boleto' ? total * 0.05 : 0;
    const totalFinal = total - desconto;


    document.getElementById('subtotalResumo').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    document.getElementById('totalResumo').textContent = `R$ ${totalFinal.toFixed(2).replace('.', ',')}`;

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
    document.getElementById('btnConfirmar').addEventListener('click', async function(e) {
        e.preventDefault()
        await confirmarPedido();
        window.location.href = '/loja';
    });
}

function renderizarFrete(){
    const selectFrete = document.getElementById('frete');

    console.log(frete)
    if(frete == "premium"){
        selectFrete.innerHTML =`<div class="summary-item">
                                 <span class="summary-item-name">frete premium</span>
                                 <span id="valueFrete">R$ 15.00</span>
                                </div>
                                `;
    }
    if(frete == "expresso"){
        selectFrete.innerHTML =`<div class="summary-item">
                                 <span class="summary-item-name">frete Expresso</span>
                                 <span id="valueFrete">R$ 10.00</span>
                                </div>
                                `;
    }
    if(frete == "economico"){
        selectFrete.innerHTML =`<div class="summary-item">
                                 <span class="summary-item-name">frete Econômico</span>
                                 <span id="valueFrete">R$ 5.00</span>
                                </div>
                                `;
    }
}

    let data;


 async function confirmarPedido() {

        const order = {
          clientId: pedido.clientId,
          totalValue: pedido.total,
          frete: pedido.valorFrete,
          itens: pedido.produtos.map(p => ({
                             productId: p.id,
                             quantity: p.qty,
                             price: p.price
                         })),
          parcelas: pedido.cartao ? pedido.cartao.parcelas : 1,
          paymentMethod: pedido.formaPagamento,
          enderecos: [{
                     cep: pedido.endereco.cep,
                     street: pedido.endereco.street,
                     number: pedido.endereco.number,
                     neighborhood: pedido.endereco.neighborhood,
                     city: pedido.endereco.city,
                     state: pedido.endereco.state,
                     complement: pedido.endereco.complement
                  }]
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
              Total: ${data.totalValue.toFixed(2).replace('.', ',')}`);


        localStorage.removeItem("pedido")
        localStorage.removeItem("cart_v1")


    }catch (err) {
         alert('Erro ao conectar com o servidor: ' + (err?.message || err))
    }

}