package com.estudantestech.store.domain.product;

import java.math.BigDecimal;

public record UpdateProductDTO(String name, Integer quantity, BigDecimal value, boolean active) {
}
