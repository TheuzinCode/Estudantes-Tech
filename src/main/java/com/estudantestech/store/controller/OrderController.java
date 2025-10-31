package com.estudantestech.store.controller;

import com.estudantestech.store.domain.order.OrderRequestDTO;
import com.estudantestech.store.domain.order.OrderResponseDTO;
import com.estudantestech.store.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponseDTO> createOrder(@RequestBody OrderRequestDTO orderDTO){
        OrderResponseDTO createOrder = orderService.createOrder(orderDTO);
        return ResponseEntity.ok(createOrder);
    }
}
