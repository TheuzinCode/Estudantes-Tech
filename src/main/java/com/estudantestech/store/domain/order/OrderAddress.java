package com.estudantestech.store.domain.order;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "OrderAddress")
@Getter
@Setter
public class OrderAddress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderAddressId;

    private String cep;
    private String street;
    private String number;
    private String complement;
    private String neighborhood;
    private String city;
    private String state;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonBackReference
    private Order order;
}
