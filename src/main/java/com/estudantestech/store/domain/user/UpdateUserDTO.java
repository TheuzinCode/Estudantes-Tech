package com.estudantestech.store.domain.user;

public record UpdateUserDTO (String name, String password, String cpf, Boolean isAdmin, Boolean active) {
}
