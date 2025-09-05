package com.estudantestech.store.domain.user;

public record CreateUserDTO(String name, String cpf, String email, String password, boolean isAdmin, boolean active) {
}
