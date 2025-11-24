package com.estudantestech.store.domain.order;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record detalhesCompletoDTO(UUID clienteId,
                                  BigDecimal totalValue,
                                  BigDecimal frete,
                                  StatusOrder status,
                                  List<ItemOrderDTO> itens,
                                  String parcelas,
                                  String paymentMethod,
                                  List<OrderAddressDTO> enderecos) {
}
