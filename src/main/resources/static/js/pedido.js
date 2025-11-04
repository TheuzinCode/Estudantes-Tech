

document.addEventListener("DOMContentLoaded", () => {
  carregarPedidos()

})

const auth = JSON.parse(localStorage.getItem('clientAuth'))

async function carregarPedidos() {

  const resp = await fetch(`/api/pedido/${auth.clientId}`)

  const data = await resp.json()
  console.log(data)

  const listaPedidos = document.getElementById("listaPedidos")
  const semPedidos = document.getElementById("semPedidos")

  listaPedidos.style.display = "flex"
  semPedidos.style.display = "none"

  renderizarPedidos(data)
}

function renderizarPedidos(data) {
  const listaPedidos = document.getElementById("listaPedidos")

  // Ordenar por data decrescente (mais recentes primeiro)
  const pedidosOrdenados = [...data].sort((a, b) => {
    return new Date(b.data + " " + b.horario) - new Date(a.data + " " + a.horario)
  })

  listaPedidos.innerHTML = pedidosOrdenados
    .map(
      (pedido) => `
        <div class="pedido-card">
            <div class="pedido-header">
                <div class="pedido-info">
                    <div class="pedido-label">Número do Pedido</div>
                    <div class="pedido-valor">${pedido.orderId}</div>
                </div>
                <div class="pedido-info">

                    <div class="pedido-label">Data</div>
                   <div class="pedido-valor">${new Date(pedido.creationTimestamp).toISOString().split("T")[0]}</div>
                </div>
                <div class="pedido-info">
                    <div class="pedido-label">Valor Total</div>
                    <div class="pedido-valor preco">R$ ${pedido.totalValue.toFixed(2).replace(".", ",")}</div>
                </div>
                <div class="pedido-info">
                    <div class="pedido-label">Status</div>
                    <span class="status-badge status-${pedido.status}">${(pedido.status)}</span>
                </div>
            </div>
            <div class="pedido-footer">
                <button class="btn btn-sm btn-detalhes" onclick="abrirDetalhes('${pedido.id}')">
                    Mais Detalhes →
                </button>
            </div>
        </div>
    `,
    )
    .join("")
}
