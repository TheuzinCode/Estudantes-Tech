package com.estudantestech.store.domain.adress;

public record CreateAdressDTO (
        String cep,
        String street,
        String number,
        String complement,
        String neighborhood,
        String city,
        String state
) {}
