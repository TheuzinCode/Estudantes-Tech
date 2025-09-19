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
    private Integer stars;

    @Column(length = 2000)
    private String description;
    private Integer quantity;
    private BigDecimal value;
    private boolean active = true;

    @CreationTimestamp
    private Instant creationTimestamp;

    @UpdateTimestamp
    private Instant updateTimestamp;

    public Product(String name, Integer stars, String description, Integer quantity, BigDecimal value, boolean active, Instant creationTimestamp, Instant updateTimestamp) {
        this.name = name;
        this.stars = stars;
        this.description = description;
        this.quantity = quantity;
        this.value = value;
        this.active = active;
    }

    public Product () {

    }

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ImagesProduct> imagesProducts = new ArrayList<>();


}
