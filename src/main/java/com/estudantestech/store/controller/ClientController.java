package com.estudantestech.store.controller;

import com.estudantestech.store.domain.client.Client;
import com.estudantestech.store.domain.client.CreateClientDTO;
import com.estudantestech.store.domain.client.ClientLoginRequest;
import com.estudantestech.store.domain.client.ClientLoginResponse;
import com.estudantestech.store.domain.client.UpdateClientDTO;
import com.estudantestech.store.domain.adress.Adress;
import com.estudantestech.store.domain.adress.CreateAdressDTO;
import com.estudantestech.store.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    @Autowired
    private ClientService clientService;

    // create
    @PostMapping
    public ResponseEntity<Client> createClient(@RequestBody CreateClientDTO createClientDTO) {
        try {
            var clientId = clientService.createClient(createClientDTO);
            return ResponseEntity.created(URI.create("/api/clients" + clientId.toString())).build();
        } catch (IllegalArgumentException ex) {
            // email duplicado ou inválido
            String msg = ex.getMessage() != null ? ex.getMessage() : "Dados inválidos";
            if (msg.toLowerCase().contains("email")) {
                return ResponseEntity.status(409).build();
            }
            return ResponseEntity.badRequest().build();
        } catch (DataIntegrityViolationException ex) {
            // pega violacao do unique constraint no banco
            return ResponseEntity.status(409).build();
        }
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

    // atualiza os campos editaveis
    @PutMapping("/{clientId}")
    public ResponseEntity<?> updateClient(@PathVariable("clientId") String clientId, @RequestBody UpdateClientDTO update) {
        var updated = clientService.updateClient(clientId, update);
        if (updated.isPresent()) {
            return ResponseEntity.ok(updated.get());
        }
        return ResponseEntity.notFound().build();
    }

    // mostra os endereços do client
    @GetMapping("/{clientId}/addresses")
    public ResponseEntity<List<Adress>> listAddresses(@PathVariable("clientId") String clientId) {
        return ResponseEntity.ok(clientService.listAddresses(clientId));
    }

    // cria um novo endereço para o client
    @PostMapping("/{clientId}/addresses")
    public ResponseEntity<?> addAddress(@PathVariable("clientId") String clientId, @RequestBody CreateAdressDTO dto) {
        var saved = clientService.addAddress(clientId, dto);
        if (saved.isPresent()) {
            return ResponseEntity.ok(saved.get());
        }
        return ResponseEntity.badRequest().body("Não foi possível adicionar o endereço.");
    }

    // marca um endereço como padrão
    @PutMapping("/{clientId}/addresses/{adressId}/default")
    public ResponseEntity<?> setDefaultAddress(@PathVariable("clientId") String clientId, @PathVariable("adressId") Long adressId) {
        var updated = clientService.setDefaultAddress(clientId, adressId);
        if (updated.isPresent()) {
            return ResponseEntity.ok(updated.get());
        }
        return ResponseEntity.notFound().build();
    }
}