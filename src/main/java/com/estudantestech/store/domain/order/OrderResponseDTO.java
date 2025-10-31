package com.estudantestech.store.domain.order;


import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record OrderResponseDTO(Long orderId,
                               UUID client,
                               List<ItemOrderDTO> itens,
                               BigDecimal totalValue) {
}
