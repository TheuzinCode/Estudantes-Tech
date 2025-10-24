package com.estudantestech.store.domain.client;

import com.estudantestech.store.domain.adress.Adress;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Table (name = "clients")
@Entity
@Setter
@Getter
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID clientId;

    private String name;

    @Column(nullable = false, unique = true)
    private String email;
    private String cpf;
    private Date birthDate;
    private String gender;
    @JsonIgnore
    private String password;

    @CreationTimestamp
    private Instant creationTimestamp;

    @UpdateTimestamp
    private Instant updateTimestamp;

    public Client (String name, String email, String cpf, Date birthDate, String gender, String password) {
        this.name = name;
        this.email = email;
        this.cpf = cpf;
        this.birthDate = birthDate;
        this.gender = gender;
        this.password = password;
    }

    public Client() {
    }

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Adress> adresses = new ArrayList<>();
}
