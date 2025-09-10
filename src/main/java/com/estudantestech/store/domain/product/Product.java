package com.estudantestech.store.domain.product;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Table(name = "products")
@Entity
@Getter
@Setter
public class Product {
    @Id
    @GeneratedValue
    private UUID id;

    private String name;
    private Integer quantity;
    private BigDecimal value;

    @CreationTimestamp
    private Instant creationTimestamp;

    @UpdateTimestamp
    private Instant updateTimestamp;

    public Product(String name, Integer quantity, BigDecimal value, Instant creationTimestamp, Instant updateTimestamp) {
        this.name = name;
        this.quantity = quantity;
        this.value = value;
    }

    public Product () {

    }
}
