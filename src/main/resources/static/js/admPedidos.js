document.addEventListener("DOMContentLoaded", () => {
    carregarTodosPedidos()
})



async function carregarTodosPedidos(){
    const resp = await fetch(`/api/todosPedidos`)
    const data = await resp.json()
    console.log(data)
    rederizarTodosPedios(data)
}

function rederizarTodosPedios(data){
    const listarTodosPedidos = document.getElementById("tablePedidos")

     const pedidosOrdenados = [...data].sort((a, b) => {
             return new Date(b.creationTimestamp) - new Date(a.creationTimestamp)
     })

       listarTodosPedidos.innerHTML = pedidosOrdenados
                             .map((pedidos) => `

                                 <tr>
                                   <td>${pedidos.orderId}</td>
                                   <td>${new Date(pedidos.creationTimestamp).toISOString().split("T")[0]}</td>
                                   <td>${pedidos.totalValue}</td>
                                   <td>${pedidos.status}</td>
                                   <td>
                                      <div class="action-buttons">
                                      <button class="btn-alterar"><a href="/admPedidosEdicao/${pedidos.orderId}"
                                                            class="btn-alterar">Editar</a></button>
                                    </div>
                                   </td>
                                 </tr>
                                 `,
                                )
                                   .join("")
}
