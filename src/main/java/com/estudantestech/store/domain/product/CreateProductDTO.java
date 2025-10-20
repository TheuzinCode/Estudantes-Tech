package com.estudantestech.store.domain.product;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record CreateProductDTO(Long id,
                               @NotBlank(message = "campo obrigatorio") String name,
                               @NotNull(message = "campo obrigatorio") double stars,
                               @NotBlank(message = "campo obrigatorio") String description,
                               @NotNull (message = "campo obrigatorio") Integer quantity,
                               @NotNull (message = "campo obrigatorio") BigDecimal price,
                               boolean active) {

    public Product CreateProduct(){
        Product product = new Product();
        product.setName(this.name);
        product.setStars(this.stars);
        product.setDescription(this.description);
        product.setQuantity(this.quantity);
        product.setPrice(this.price);
        product.setActive(true);
        return product;
    }
}
