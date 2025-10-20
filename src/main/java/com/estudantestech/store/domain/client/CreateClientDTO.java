package com.estudantestech.store.domain.client;

import java.util.Date;

public record CreateClientDTO (String name, String cpf, String email, Date birthDate, String gender, String password) {
}
