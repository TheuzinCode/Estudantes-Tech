package com.estudantestech.store.domain.client;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ClientLoginRequest {
    private String email;
    private String password;

}