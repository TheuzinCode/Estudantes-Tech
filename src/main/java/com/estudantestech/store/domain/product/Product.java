package com.estudantestech.store.domain.product;

import com.estudantestech.store.domain.images.ImagesProduct;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Table(name = "products")
@Entity
@Getter
@Setter
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long idProduct;
    private String name;
    private double stars;

    @Lob
    private String description;
    private Integer quantity;
    private BigDecimal price;
    private boolean active = true;

    @CreationTimestamp
    private Instant creationTimestamp;

    @UpdateTimestamp
    private Instant updateTimestamp;

    public Product(String name, double stars, String description, Integer quantity, BigDecimal price, boolean active, Instant creationTimestamp, Instant updateTimestamp) {
        this.name = name;
        this.stars = stars;
        this.description = description;
        this.quantity = quantity;
        this.price = price;
        this.active = active;
    }

    public Product () {

    }

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ImagesProduct> imagesProducts = new ArrayList<>();
}
