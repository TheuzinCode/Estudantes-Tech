package com.estudantestech.store.controller;

import com.estudantestech.store.domain.client.Client;
import com.estudantestech.store.domain.client.CreateClientDTO;
import com.estudantestech.store.domain.client.ClientLoginRequest;
import com.estudantestech.store.domain.client.ClientLoginResponse;
import com.estudantestech.store.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    @Autowired
    private ClientService clientService;

    // create
    @PostMapping
    public ResponseEntity<Client> createClient(@RequestBody CreateClientDTO createClientDTO) {
        var clientId = clientService.createClient(createClientDTO);

        return ResponseEntity.created(URI.create("/api/clients" + clientId.toString())).build();
    }

    // get by id
    @GetMapping("/{clientId}")
    public ResponseEntity<Client> getClientById(@PathVariable("clientId") String clientId) {
        var client = clientService.getClientById(clientId);

        if (client.isPresent()) {
            return ResponseEntity.ok(client.get());
        }

        return ResponseEntity.notFound().build();
    }

    // get all
    @GetMapping
    public ResponseEntity<java.util.List<Client>> listClients() {
        var clients = clientService.listClients();
        return ResponseEntity.ok(clients);
    }

    // login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody ClientLoginRequest loginRequest) {
        var clientOpt = clientService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
        if (clientOpt.isPresent()) {
            var client = clientOpt.get();
            return ResponseEntity.ok(new ClientLoginResponse(client.getClientId().toString(), client.getName(), client.getEmail()));
        }
        return ResponseEntity.status(401).body("Credenciais inválidas");
    }
}
