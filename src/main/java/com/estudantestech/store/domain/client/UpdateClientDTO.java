package com.estudantestech.store.domain.client;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

public record UpdateClientDTO (
        String name,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd") Date birthDate,
        String gender,
        String password
){}
