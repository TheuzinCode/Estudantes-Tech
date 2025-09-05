package com.estudantestech.store.domain.user;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Table(name = "users")
@Entity
@Setter
@Getter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID userId;

    private String name;
    private String cpf;
    private String email;
    private String password;
    private boolean isAdmin;
    private boolean active = true;

    @CreationTimestamp
    private Instant creationTimestamp;

    @UpdateTimestamp
    private Instant updateTimestamp;

    public User(String name, String cpf, String email, String password, boolean isAdmin, boolean active, Instant creationTimestamp, Instant updateTimestamp) {
        this.name = name;
        this.cpf = cpf;
        this.email = email;
        this.password = password;
        this.isAdmin = isAdmin;
        this.active = active;
    }

    public User() {
    }
}
