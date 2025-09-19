package com.estudantestech.store.domain.images;

import com.estudantestech.store.domain.product.Product;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.engine.internal.Cascade;

import java.util.UUID;


@Table(name = "imagesProduct")
@Entity
@Getter
@Setter
public class ImagesProduct {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String tipo;

    @Lob
    @Column(length = 1000000)
    private byte[] dados;

    @ManyToOne
    @JoinColumn(name = "idProduct")
    private Product product;

    private boolean principal;

    public ImagesProduct() {
    }

    public ImagesProduct(String name, String tipo, byte[] dados) {
        this.name = name;
        this.tipo = tipo;
        this.dados = dados;

    }


}
