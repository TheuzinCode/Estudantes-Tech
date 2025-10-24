package com.estudantestech.store.domain.adress;

import com.estudantestech.store.domain.client.Client;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Table(name = "adresses")
@Entity
@Setter
@Getter
public class Adress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long adressId;

    private String cep;
    private String street;
    private String number;
    private String complement;
    private String neighborhood;
    private String city;
    private String state;

    @Column(name = "is_default")
    @JsonProperty("isDefault")
    private boolean isDefault = false;

    @ManyToOne
    @JoinColumn(name = "idClient")
    @JsonIgnore
    private Client client;

    public Adress() {
    }

    public Adress (String cep, String street, String number, String complement, String neighborhood, String city, String state, Client client) {
        this.cep = cep;
        this.street = street;
        this.number = number;
        this.complement = complement;
        this.neighborhood = neighborhood;
        this.city = city;
        this.state = state;
        this.client = client;
    }
}
