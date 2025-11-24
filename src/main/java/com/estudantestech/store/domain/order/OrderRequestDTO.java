package com.estudantestech.store.domain.order;


import com.estudantestech.store.domain.adress.CreateAdressDTO;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

// O QUE EU VOU RECEBER DO SITE
public record OrderRequestDTO(UUID clientId,
                              BigDecimal totalValue,
                              BigDecimal frete,
                              List<ItemOrderDTO> itens,
                              String parcelas,
                              String paymentMethod,
                              List<OrderAddressDTO> enderecos) {
}
