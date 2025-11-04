package com.estudantestech.store.controller;

import com.estudantestech.store.domain.order.Order;
import com.estudantestech.store.domain.order.OrderRequestDTO;
import com.estudantestech.store.domain.order.OrderResponseDTO;
import com.estudantestech.store.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/orders")
    public ResponseEntity<OrderResponseDTO> createOrder(@RequestBody OrderRequestDTO orderDTO){
        OrderResponseDTO createOrder = orderService.createOrder(orderDTO);
        return ResponseEntity.ok(createOrder);
    }


    @GetMapping("/pedido/{clientId}")
    public ResponseEntity<List<Order>> buscarPedidos(@PathVariable UUID clientId){

        List<Order> pedidos = orderService.burcarPedido(clientId);

        return ResponseEntity.ok(pedidos);
    }

}
