package com.estudantestech.store.dto;

import java.math.BigDecimal;

public record UpdateProductDTO(String name, Integer quantity, BigDecimal value, boolean active) {
}
