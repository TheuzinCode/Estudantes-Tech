package com.estudantestech.store.domain.client;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

public record CreateClientDTO (
        String name,
        String cpf,
        String email,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy") Date birthDate,
        String gender,
        String password,
        // address
        String cep,
        String street,
        String neighborhood,
        String city,
        String state,
        String number,
        String complement
) {}
