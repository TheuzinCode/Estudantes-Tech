package com.estudantestech.store.dto;

import com.estudantestech.store.domain.product.Product;

import java.math.BigDecimal;
import java.util.UUID;

public record CreateProductDTO(UUID id, String name, Integer quantity, BigDecimal value, boolean active) {

    public Product CreateProduct(){
        Product product = new Product();
        product.setName(this.name);
        product.setQuantity(this.quantity);
        product.setValue(this.value);
        product.setActive(this.active);
        return product;
    }
}
