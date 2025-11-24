package com.estudantestech.store.domain.order;

public record OrderAddressDTO(
         String cep,
         String street,
         String number,
         String complement,
         String neighborhood,
         String city,
         String state
) {
}
