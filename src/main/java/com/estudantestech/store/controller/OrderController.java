package com.estudantestech.store.controller;

import com.estudantestech.store.domain.order.*;
import com.estudantestech.store.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class OrderController {

    @Autowired
    private OrderService orderService;



    //CRIAR UM PEDIDO
    @PostMapping("/orders")
    public ResponseEntity<OrderResponseDTO> createOrder(@RequestBody OrderRequestDTO orderDTO){
        OrderResponseDTO createOrder = orderService.createOrder(orderDTO);
        return ResponseEntity.ok(createOrder);
    }

    //listar todos pedidos do cliente
    @GetMapping("/pedido/{clientId}")
    public ResponseEntity<List<Order>> buscarPedidos(@PathVariable UUID clientId){
        List<Order> pedidos = orderService.burcarPedido(clientId);
        return ResponseEntity.ok(pedidos);
    }


    //PARTE PAGINAS ADM

    //LISTAR TODOS PEDIDOS DA TELA DO ADM
    //CORRETO NÃO MEXER
    @GetMapping("/todosPedidos")
    public ResponseEntity<List<Order>> listarAll(){
        List<Order> orders = orderService.selectAll();
        return ResponseEntity.ok(orders);
    }


    @GetMapping("/pedidosDetalhes/{id}")
    public ResponseEntity<detalhesCompletoDTO> getOrderById(@PathVariable("id")Long id){
        detalhesCompletoDTO detalhesCompletoDTO = orderService.getDetalhesCompleto(id);
       return ResponseEntity.ok(detalhesCompletoDTO);
    }


    @PutMapping("/admPedidosEdicao/{id}/status")
    public ResponseEntity<?>atualizarStatus( @PathVariable Long id,
                                                  @RequestBody AtualizarStatusDTO atualizarStatusDTO){
        orderService.atulizatStatus(id, atualizarStatusDTO.statusOrder());
        return ResponseEntity.ok("Status atualizado com sucesso!");
    }



}
