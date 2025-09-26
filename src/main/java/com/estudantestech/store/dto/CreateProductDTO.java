package com.estudantestech.store.dto;

import com.estudantestech.store.domain.product.Product;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.UUID;

public record CreateProductDTO(Long id,
                               @NotBlank(message = "campo obrigatorio") String name,
                               @NotNull(message = "campo obrigatorio") double stars,
                               @NotBlank(message = "campo obrigatorio") String description,
                               @NotNull (message = "campo obrigatorio") Integer quantity,
                               @NotNull (message = "campo obrigatorio") BigDecimal value,
                               boolean active) {

    public Product CreateProduct(){
        Product product = new Product();
        product.setName(this.name);
        product.setStars(this.stars);
        product.setDescription(this.description);
        product.setQuantity(this.quantity);
        product.setPrice(this.value);
        product.setActive(true);
        return product;
    }
}
