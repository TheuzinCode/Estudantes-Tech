const pedidosFiltrados = []

document.addEventListener("DOMContentLoaded", () => {
  carregarPedidos()
  // Removed filter setup
})

function carregarPedidos() {
  const listaPedidos = document.getElementById("listaPedidos")
  const semPedidos = document.getElementById("semPedidos")

  const pedidos = JSON.parse(localStorage.getItem("pedidos")) || []

  if (pedidos.length === 0) {
    listaPedidos.style.display = "none"
    semPedidos.style.display = "block"
    return
  }

  listaPedidos.style.display = "flex"
  semPedidos.style.display = "none"

  renderizarPedidos(pedidos)
}

function renderizarPedidos(pedidos) {
  const listaPedidos = document.getElementById("listaPedidos")

  // Ordenar por data decrescente (mais recentes primeiro)
  const pedidosOrdenados = [...pedidos].sort((a, b) => {
    return new Date(b.data + " " + b.horario) - new Date(a.data + " " + a.horario)
  })

  listaPedidos.innerHTML = pedidosOrdenados
    .map(
      (pedido) => `
        <div class="pedido-card">
            <div class="pedido-header">
                <div class="pedido-info">
                    <div class="pedido-label">Número do Pedido</div>
                    <div class="pedido-valor">${pedido.id}</div>
                </div>
                <div class="pedido-info">
                    <div class="pedido-label">Data</div>
                    <div class="pedido-valor">${pedido.data} às ${pedido.horario}</div>
                </div>
                <div class="pedido-info">
                    <div class="pedido-label">Valor Total</div>
                    <div class="pedido-valor preco">R$ ${pedido.total.toFixed(2).replace(".", ",")}</div>
                </div>
                <div class="pedido-info">
                    <div class="pedido-label">Status</div>
                    <span class="status-badge status-${pedido.status}">${formatarStatus(pedido.status)}</span>
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

function abrirDetalhes(numeroPedido) {
  const modal = document.getElementById("detalhesModal")
  const conteudo = document.getElementById("conteudoDetalhes")

  const pedidos = JSON.parse(localStorage.getItem("pedidos")) || []
  const pedido = pedidos.find((p) => p.id === numeroPedido)

  if (!pedido) return

  // Construir HTML dos detalhes
  const endereco = pedido.endereco
  const pagamento = pedido.pagamento

  let htmlPagamento = ""
  if (pagamento.tipo === "cartao") {
    htmlPagamento = `
            <p><strong>Tipo:</strong> Cartão de Crédito</p>
            <p><strong>Nome:</strong> ${pagamento.nome}</p>
            <p><strong>Cartão:</strong> **** **** **** ${pagamento.numeroCartao.replace(/\s/g, "").slice(-4)}</p>
            <p><strong>Parcelas:</strong> ${pagamento.parcelas}x</p>
        `
  } else {
    htmlPagamento = `
            <p><strong>Tipo:</strong> Boleto Bancário</p>
            <p><strong>Desconto Aplicado:</strong> 5%</p>
        `
  }

  conteudo.innerHTML = `
        <div style="margin-bottom: 25px;">
            <h3 style="margin-bottom: 15px;">Informações do Pedido</h3>
            <p><strong>Número:</strong> ${pedido.id}</p>
            <p><strong>Data:</strong> ${pedido.data} às ${pedido.horario}</p>
            <p><strong>Status:</strong> <span class="status-badge status-${pedido.status}">${formatarStatus(pedido.status)}</span></p>
        </div>

        <div style="margin-bottom: 25px;">
            <h3 style="margin-bottom: 15px;">Endereço de Entrega</h3>
            <p><strong>${endereco.rua}, ${endereco.numero}</strong></p>
            <p>${endereco.complemento ? endereco.complemento + " - " : ""}${endereco.bairro}</p>
            <p>${endereco.cidade}, ${endereco.estado}</p>
            <p>CEP: ${endereco.cep}</p>
        </div>

        <div style="margin-bottom: 25px;">
            <h3 style="margin-bottom: 15px;">Forma de Pagamento</h3>
            ${htmlPagamento}
        </div>

        <div style="margin-bottom: 25px;">
            <h3 style="margin-bottom: 15px;">Produtos</h3>
            <div class="produtos-lista">
                ${pedido.produtos
                  .map(
                    (produto) => `
                    <div class="produto-item">
                        <img src="${produto.imagem}" alt="${produto.nome}" class="produto-imagem">
                        <div class="produto-info">
                            <div class="produto-nome">${produto.nome}</div>
                            <div class="produto-quantidade">Quantidade: ${produto.quantidade}</div>
                            <div class="produto-preco">R$ ${(produto.preco * produto.quantidade).toFixed(2).replace(".", ",")}</div>
                        </div>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </div>

        <div style="margin-bottom: 25px;">
            <h3 style="margin-bottom: 15px;">Resumo Financeiro</h3>
            <div class="resumo-financeiro">
                <div class="resumo-linha">
                    <span>Subtotal:</span>
                    <span>R$ ${pedido.subtotal.toFixed(2).replace(".", ",")}</span>
                </div>
                ${
                  pedido.desconto > 0
                    ? `
                    <div class="resumo-linha">
                        <span>Desconto (5%):</span>
                        <span class="desconto">- R$ ${pedido.desconto.toFixed(2).replace(".", ",")}</span>
                    </div>
                `
                    : ""
                }
                <div class="resumo-linha total">
                    <span>Total:</span>
                    <span>R$ ${pedido.total.toFixed(2).replace(".", ",")}</span>
                </div>
            </div>
        </div>
    `

  modal.style.display = "flex"
}

function formatarStatus(status) {
  const statusMap = {
    pendente: "Pendente",
    confirmado: "Confirmado",
    enviado: "Enviado",
    entregue: "Entregue",
  }
  return statusMap[status] || status
}

// Fechar modal
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("detalhesModal")
  const closeBtn = document.getElementById("closeModal")

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none"
    })
  }

  // Fechar modal ao clicar fora dele
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none"
    }
  })
})
