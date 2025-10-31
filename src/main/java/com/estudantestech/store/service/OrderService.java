package com.estudantestech.store.service;


import com.estudantestech.store.domain.client.Client;
import com.estudantestech.store.domain.order.*;
import com.estudantestech.store.domain.product.Product;
import com.estudantestech.store.repositories.ClientRepository;
import com.estudantestech.store.repositories.OrderRepository;
import com.estudantestech.store.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ProductRepository productRepository;



    public OrderResponseDTO createOrder(OrderRequestDTO orderDTO){

        Client client = clientRepository.findById(orderDTO.clientId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        Order order = new Order();

        order.setClient(client);
        order.setTotalValue(orderDTO.totalValue());
        order.setParcelas(orderDTO.parcelas());
        order.setPaymentMethod(orderDTO.paymentMethod());

        for(ItemOrderDTO itemOrderDTO : orderDTO.itens()){
            Product product = productRepository.findById(itemOrderDTO.productId())
                    .orElseThrow(() -> new RuntimeException("PRODUTO NÃO ENCONTRADO"));

            ItemOrder itens = new ItemOrder();
            itens.setProduct(product);
            itens.setQuantity(itemOrderDTO.quantity());
            itens.setPriceProduct(itemOrderDTO.price());
            order.adicionarItens(itens);
        }

        Order saved = orderRepository.save(order);


        List<ItemOrderDTO> itensDTO = new ArrayList<>();

        for (ItemOrder i : saved.getItens()) {

            ItemOrderDTO itemDTO = new ItemOrderDTO(
                    i.getProduct().getIdProduct(),
                    i.getQuantity(),
                    i.getPriceProduct()

            );
            itensDTO.add(itemDTO);
        }

        return new OrderResponseDTO(
                saved.getOrderId(),
                saved.getClient().getClientId(),
                itensDTO,
                saved.getTotalValue()
        );


    }
}
