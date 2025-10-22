package com.estudantestech.store.domain.client;

import lombok.Getter;

@Getter
public class ClientLoginResponse {
    private String clientId;
    private String name;
    private String email;

    public ClientLoginResponse(String clientId, String name, String email) {
        this.clientId = clientId;
        this.name = name;
        this.email = email;
    }
}


