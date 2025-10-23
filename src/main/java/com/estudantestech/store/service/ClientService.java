package com.estudantestech.store.service;

import com.estudantestech.store.domain.adress.Adress;
import com.estudantestech.store.domain.client.Client;
import com.estudantestech.store.domain.client.CreateClientDTO;
import com.estudantestech.store.domain.client.UpdateClientDTO;
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

        Client client = new Client(
                createClientDTO.name(),
                createClientDTO.email(),
                createClientDTO.cpf(),
                createClientDTO.birthDate(),
                createClientDTO.gender(),
                encryptedPassword,
                Instant.now(),
                null
        );

        boolean hasAnyAddress = (createClientDTO.cep() != null && !createClientDTO.cep().isBlank())
                || (createClientDTO.street() != null && !createClientDTO.street().isBlank());

        if (hasAnyAddress) {
            Adress adress = new Adress(
                    createClientDTO.cep(),
                    createClientDTO.street(),
                    createClientDTO.number(),
                    createClientDTO.complement(),
                    createClientDTO.neighborhood(),
                    createClientDTO.city(),
                    createClientDTO.state(),
                    client
            );
            client.getAdresses().add(adress);
        }

        Client saved = clientRepository.save(client);
        return saved.getClientId();
    }

    public Optional<Client> getClientById (String clientId) {
        return clientRepository.findById(UUID.fromString(clientId));
    }

    public List<Client> listClients() {
        return clientRepository.findAll();
    }

    // autenticacao client email + password
    public Optional<Client> authenticate(String email, String rawPassword) {
        if (email == null || email.isBlank() || rawPassword == null || rawPassword.isBlank()) {
            return Optional.empty();
        }
        return clientRepository.findByEmail(email)
                .filter(c -> passwordEncoder.matches(rawPassword, c.getPassword()));
    }

    // atualiza só alguns campos do client
    public Optional<Client> updateClient(String clientId, UpdateClientDTO update) {
        if (clientId == null || clientId.isBlank()) {
            return Optional.empty();
        }
        var opt = clientRepository.findById(UUID.fromString(clientId));
        if (opt.isEmpty()) return Optional.empty();

        var client = opt.get();
        if (update != null) {
            if (update.name() != null && !update.name().isBlank()) {
                client.setName(update.name());
            }
            if (update.birthDate() != null) {
                client.setBirthDate(update.birthDate());
            }
            if (update.gender() != null && !update.gender().isBlank()) {
                client.setGender(update.gender());
            }
            if (update.password() != null && !update.password().isBlank()) {
                client.setPassword(passwordEncoder.encode(update.password()));
            }
        }
        var saved = clientRepository.save(client);
        return Optional.of(saved);
    }
}
