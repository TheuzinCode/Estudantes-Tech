package com.estudantestech.store.domain.order;

import com.estudantestech.store.domain.product.Product;

import java.math.BigDecimal;

public record ItemOrderDTO(Long productId, Integer quantity, BigDecimal price) {
}
