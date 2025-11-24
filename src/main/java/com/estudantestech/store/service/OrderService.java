package com.estudantestech.store.service;


import com.estudantestech.store.domain.adress.Adress;
import com.estudantestech.store.domain.adress.CreateAdressDTO;
import com.estudantestech.store.domain.client.Client;
import com.estudantestech.store.domain.order.*;
import com.estudantestech.store.domain.product.Product;
import com.estudantestech.store.repositories.ClientRepository;
import com.estudantestech.store.repositories.OrderAddressRepository;
import com.estudantestech.store.repositories.OrderRepository;
import com.estudantestech.store.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderAddressRepository orderAddressRepository;



    public OrderResponseDTO createOrder(OrderRequestDTO orderDTO){

        Client client = clientRepository.findById(orderDTO.clientId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        Order order = new Order();

        order.setClient(client);
        order.setTotalValue(orderDTO.totalValue());
        order.setFrete(orderDTO.frete());
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

        List<OrderAddress> enderecos = orderDTO.enderecos().stream().map(a -> {
            OrderAddress address = new OrderAddress();
            address.setCep(a.cep());
            address.setStreet(a.street());
            address.setNumber(a.number());
            address.setNeighborhood(a.neighborhood());
            address.setCity(a.city());
            address.setState(a.state());
            address.setOrder(order);
            return address;
        }).toList();

        order.setOrderAddresses(enderecos);

        Order saved = orderRepository.save(order);

        List<ItemOrderDTO> itensDTO = new ArrayList<>();

        for (ItemOrder i : saved.getItens()) {

            ItemOrderDTO itemDTO = new ItemOrderDTO(
                    i.getProduct().getIdProduct(),
                    i.getProduct().getName(),
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

    public List<Order>burcarPedido( UUID clientId){
        return orderRepository.findByClientClientId(clientId);
    }


    public List<Order>selectAll(){
        return orderRepository.findAll();
    }


    //tela detalhes do pedido
    public detalhesCompletoDTO getDetalhesCompleto(Long id){
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));


        List<ItemOrderDTO> listaItensDTO = order.getItens().stream()
                .map(item -> new ItemOrderDTO(
                        item.getProduct().getIdProduct(),
                        item.getProduct().getName(),
                        item.getQuantity(),
                        item.getPriceProduct()
                ))
                .toList();


        List<OrderAddressDTO> listaEnderecosDTO = order.getOrderAddresses().stream()
                .map(end -> new OrderAddressDTO(
                        end.getCep(),
                        end.getStreet(),
                        end.getNumber(),
                        end.getComplement(),
                        end.getNeighborhood(),
                        end.getCity(),
                        end.getState()
                ))
                .toList();


        String infoParcelas = "À vista";
        if ("CARTAO".equalsIgnoreCase(order.getPaymentMethod())) {
            infoParcelas = order.getParcelas() + "x";
        }

        return new detalhesCompletoDTO(
                order.getClient().getClientId(),
                order.getTotalValue(),
                order.getFrete(),
                order.getStatus(),
                listaItensDTO,
                infoParcelas,
                order.getPaymentMethod(),
                listaEnderecosDTO
        );


    }




}


