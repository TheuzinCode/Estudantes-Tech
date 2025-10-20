package com.estudantestech.store.service;

import com.estudantestech.store.domain.client.Client;
import com.estudantestech.store.domain.client.CreateClientDTO;
import com.estudantestech.store.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UUID createClient(CreateClientDTO createClientDTO) {
        String encryptedPassword = passwordEncoder.encode(createClientDTO.password());

        Client entity = new Client(
                createClientDTO.name(),
                createClientDTO.cpf(),
                createClientDTO.email(),
                createClientDTO.birthDate(),
                createClientDTO.gender(),
                encryptedPassword,
                Instant.now(),
                null
        );

        Client clientSaved = clientRepository.save(entity);
        return clientSaved.getClientId();
    }

    public Optional<Client> getClientById (String clientId) {
        return clientRepository.findById(UUID.fromString(clientId));
    }

    public List<Client> listClients() {
        return clientRepository.findAll();
    }
}
