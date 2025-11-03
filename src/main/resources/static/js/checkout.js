

    // Inicialização


let enderecos = [];
let enderecoSelecionado = null;
let formaPagamento = "cartao";

const botaoFinalizar = document.getElementById('botaoFinalizarCompra')
const auth = JSON.parse(localStorage.getItem('clientAuth'))
const product = JSON.parse(localStorage.getItem('cart_v1'))
const frete = localStorage.getItem('cart_shipping_v1')
const addressList = document.getElementById('addressList');




function verificarLogado(botaoFinalizar) {
    if (!auth || auth.logged !== true || !auth.clientId) {
               event.preventDefault();
               window.alert("você precisar estar logado para finalizar a compra")
               window.location.href = '/entrar'
    }

}

if (botaoFinalizar) {
    botaoFinalizar.addEventListener("click", verificarLogado);
}




    //LISTAR ENDEREÇOS
 async function loadAddresses(){
           const resp = await fetch(`/api/clients/${auth.clientId}/addresses`)
           if (!resp.ok) { addressList.innerHTML = '<p>Não foi possível carregar endereços.</p>'; return }
           const list = await resp.json()
           enderecos = list;
            addressList.innerHTML = list.map((endereco, index) => `
                    <label class="address-option">
                        <input type="radio" name="address" value="${endereco.adressId}" ${index === 0 ? 'checked' : ''}>
                       <div class="address-card">
                          <p>${endereco.street} - ${endereco.number} <br>
                          ${endereco.neighborhood} - ${endereco.city}<br>
                            CEP: ${endereco.cep}</p>
                        </div>
                   </label>
            `).join('');

                // Seleção de endereço
                document.querySelectorAll('input[name="address"]').forEach(radio => {
                    radio.addEventListener('change', function() {
                        const enderecoId = parseInt(this.value);
                        enderecoSelecionado = enderecos.find(e => e.adressId === enderecoId);
                    });
                });
                 if (enderecos.length > 0) {
                     enderecoSelecionado = enderecos[0];
                    }

 }


    //Renderizar resumo lateral
function renderizarResumo() {
    const summaryItems = document.getElementById('summaryItems');

    summaryItems.innerHTML = product.items.map((produto) => `
        <div class="summary-item">
            <span class="summary-item-name">${produto.qty}x ${produto.name}</span>
            <span>R$ ${(produto.price * produto.qty).toFixed(2).replace('.', ',')}</span>
        </div>
    `).join('');
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

document.addEventListener('DOMContentLoaded', async function() {
    await loadAddresses();
    renderizarResumo();
    configurarEventos();
    calcularTotais();
    renderizarFrete()
});


    // Calcular totais
    let total = 0;
    let subtotal = 0;

function calcularTotais() {
    let valueFrete = 0;
     if(frete === "premium"){
        valueFrete = 15
     }
     if(frete === "expresso"){
         valueFrete = 10
     }
     if(frete === "economico"){
         valueFrete = 5
     }
    subtotal = valueFrete + (product.items.reduce((acc, p) => acc + (p.price * p.qty), 0));
    const desconto = formaPagamento === 'boleto' ? subtotal * 0.05 : 0;
    total = subtotal - desconto;

    document.getElementById('subtotal').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    document.getElementById('total').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;

    const discountRow = document.getElementById('discountRow');
    if (formaPagamento === 'boleto') {
        discountRow.style.display = 'flex';
        document.getElementById('discount').textContent = `- R$ ${desconto.toFixed(2).replace('.', ',')}`;
    } else {
        discountRow.style.display = 'none';
    }
}




//Configurar eventos
function configurarEventos() {


    // Seleção de forma de pagamento
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', function() {
            formaPagamento = this.value;

            const cartaoForm = document.getElementById('cartaoForm');
            const boletoInfo = document.getElementById('boletoInfo');

            if (formaPagamento === 'cartao') {
                cartaoForm.style.display = 'block';
                boletoInfo.style.display = 'none';
            } else {
                cartaoForm.style.display = 'none';
                boletoInfo.style.display = 'block';
            }

            calcularTotais();
        });
    });

    // Formatação do número do cartão
    const cardNumber = document.getElementById('cardNumber');
    cardNumber.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
    });

    // Formatação da data de validade
    const cardExpiry = document.getElementById('cardExpiry');
    cardExpiry.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        e.target.value = value;
    });

    // Apenas números no CVV
    const cardCVV = document.getElementById('cardCVV');
    cardCVV.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '');
    });

    // Botão continuar
    document.getElementById('btnContinuar').addEventListener('click', function() {
        if (validarFormulario()) {
            salvarDados();
            window.location.href = 'resumo';
        }
    });
}


// Validar formulário
function validarFormulario() {
    if (!enderecoSelecionado) {
        alert('Por favor, selecione um endereço de entrega.');
        return false;
    }

    if (formaPagamento === 'cartao') {
        const cardNumber = document.getElementById('cardNumber').value;
        const cardName = document.getElementById('cardName').value;
        const cardExpiry = document.getElementById('cardExpiry').value;
        const cardCVV = document.getElementById('cardCVV').value;

        if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
            alert('Por favor, insira um número de cartão válido.');
            return false;
        }

        if (!cardName || cardName.trim().length < 3) {
            alert('Por favor, insira o nome completo do titular do cartão.');
            return false;
        }

        if (!cardExpiry || cardExpiry.length < 5) {
            alert('Por favor, insira a data de validade do cartão.');
            return false;
        }

        if (!cardCVV || cardCVV.length < 3) {
            alert('Por favor, insira o código CVV do cartão.');
            return false;
        }
    }

    return true;
}

// Salvar dados no localStorage
function salvarDados() {
    const dados = {
        clientId : auth.clientId,
        formaPagamento: formaPagamento,
        total: total,
        subtotal: subtotal,
        endereco: enderecoSelecionado,
        produtos: product.items

    };

    if (formaPagamento === 'cartao') {
        const cardNumber = document.getElementById('cardNumber').value;
        const cardName = document.getElementById('cardName').value;
        const installments = document.getElementById('installments').value;

        dados.cartao = {
            numero: cardNumber,
            nome: cardName,
            parcelas: installments
        };
    }

    localStorage.setItem('pedido', JSON.stringify(dados));
}
