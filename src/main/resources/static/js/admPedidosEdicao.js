document.addEventListener('DOMContentLoaded', function() {
       carregarPedido()
});


 async function carregarPedido(){

  const id = window.location.pathname
    .split("/")
    .filter(Boolean)
    .pop();

  const resp = await fetch(`/api/pedidosDetalhes/${id}`)

  const data = await resp.json()

  console.log(data)

  await renderizarResumo(data)

 }


function renderizarResumo(data) {
    // Renderizar endereço
    const enderecoResumo = document.getElementById('enderecoResumo');
    enderecoResumo.innerHTML = `
        <p>${data.enderecos[0].street}</p>
        <p>${data.enderecos[0].neighborhood} - ${data.enderecos[0].city} - ${data.enderecos[0].number}</p>
        <p>CEP: ${data.enderecos[0].cep}</p>
    `;

    // Renderizar forma de pagamento
    const pagamentoResumo = document.getElementById('pagamentoResumo');
    if (data.paymentMethod === 'cartao') {
         pagamentoResumo.innerHTML = `
            <p><strong>Cartão de Crédito</strong></p>
            <p>${data.parcelas} sem juros</p>
        `;
    } else {
        pagamentoResumo.innerHTML = `
            <p><strong>Boleto Bancário</strong></p>
            <p>${data.parcelas}</p>
        `;
    }

    //Renderizar Status
    const statusPedido = document.getElementById("StatusPedido");
    statusPedido.innerHTML =`<h5>${data.status}</h5>
                                         `

    // Renderizar produtos
    const produtosResumo = document.getElementById('produtosResumo');

    produtosResumo.innerHTML = data.itens.map(produto => `
        <div class="produto-item">

            <div class="produto-info">
                <h4>${produto.name}</h4>
                <p>Quantidade: ${produto.quantity}</p>
                <p class="produto-preco">R$ ${(produto.price * produto.quantity).toFixed(2).replace('.', ',')}</p>
            </div>
        </div>
    `).join('');


    // Calcular e renderizar totais
    const subtotal = data.itens.reduce((acc, p)  => acc + (p.price * p.quantity), 0);

    const valorTotal = data.totalValue + (data.totalValue * 0.05)

    let frete = "";
    if(data.frete == 5 ){
        frete = "economico"
    }
    if(data.frete == 10 ){
        frete = "expresso"
    }
    if(data.frete == 15 ){
        frete = "premium"
    }

    renderizarFrete(frete)

    let totalSemDesconto = data.frete + subtotal

    let valorDoDesconto = totalSemDesconto *0.05


    document.getElementById('subtotalResumo').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    document.getElementById('totalResumo').textContent = `R$ ${data.totalValue.toFixed(2).replace('.', ',')}`;

     if (data.paymentMethod === 'boleto') {
            document.getElementById('discountRowResumo').style.display = 'flex';
            document.getElementById('discountResumo').textContent = `- R$ ${valorDoDesconto.toFixed(2).replace('.', ',')}`;
        }

}

function renderizarFrete(frete){
    const selectFrete = document.getElementById('frete');


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

