package com.estudantestech.store.domain.order;


import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

// O QUE EU VOU RECEBER DO SITE
public record OrderRequestDTO(UUID clientId,
                              BigDecimal totalValue,
                              List<ItemOrderDTO> itens,
                              String parcelas,
                              String paymentMethod) {
}
