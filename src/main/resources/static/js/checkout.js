// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    loadAddresses()
    //renderizarEnderecos();
    //renderizarResumo();
    //configurarEventos();
    //calcularTotais();
});


const botaoFinalizar = document.getElementById('botaoFinalizarCompra')

const auth = JSON.parse(localStorage.getItem('clientAuth'))
const product = JSON.parse(localStorage.getItem(''))

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
            const addressList = document.getElementById('addressList');
            addressList.innerHTML = list.map((endereco, index) => `
                    <label class="address-option">
                        <input type="radio" name="address" value="${endereco.id}" ${index === 0 ? 'checked' : ''}>
                       <div class="address-card">
                          <p>${endereco.street} - ${endereco.number}<br>
                          ${endereco.neighborhood} - ${endereco.city}<br>
                            CEP: ${endereco.cep}</p>
                        </div>
                   </label>
            `).join('');
 }
