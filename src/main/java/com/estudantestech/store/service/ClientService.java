package com.estudantestech.store.service;

import com.estudantestech.store.domain.adress.Adress;
import com.estudantestech.store.domain.adress.CreateAdressDTO;
import com.estudantestech.store.domain.client.Client;
import com.estudantestech.store.domain.client.CreateClientDTO;
import com.estudantestech.store.domain.client.UpdateClientDTO;
import com.estudantestech.store.repositories.AdressRepository;
import com.estudantestech.store.repositories.ClientRepository;
import org.hibernate.NonUniqueResultException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;

@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private AdressRepository adressRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UUID createClient(CreateClientDTO createClientDTO) {
        // impede e-mails duplicados
        if (createClientDTO.email() == null || createClientDTO.email().isBlank()) {
            throw new IllegalArgumentException("Email é obrigatório");
        }
        final String emailNorm = createClientDTO.email().trim().toLowerCase(Locale.ROOT);
        if (clientRepository.existsByEmail(emailNorm)) {
            throw new IllegalArgumentException("Email já cadastrado");
        }

        String encryptedPassword = passwordEncoder.encode(createClientDTO.password());

        Client client = new Client(
                createClientDTO.name(),
                emailNorm,
                createClientDTO.cpf(),
                createClientDTO.birthDate(),
                createClientDTO.gender(),
                encryptedPassword
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
        final String emailNorm = email.trim().toLowerCase(java.util.Locale.ROOT);
        try {
            return clientRepository.findByEmail(emailNorm)
                    .filter(c -> passwordEncoder.matches(rawPassword, c.getPassword()));
        } catch (IncorrectResultSizeDataAccessException | NonUniqueResultException e) {
            // Há duplicatas no banco: trate como credenciais inválidas até saneamento dos dados
            return Optional.empty();
        }
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

    public List<Adress> listAddresses(String clientId) {
        UUID id = UUID.fromString(clientId);
        return adressRepository.findByClient_ClientId(id);
    }

    public Optional<Adress> addAddress(String clientId, CreateAdressDTO dto) {
        if (clientId == null || clientId.isBlank() || dto == null) return Optional.empty();
        var clientOpt = clientRepository.findById(UUID.fromString(clientId));
        if (clientOpt.isEmpty()) return Optional.empty();

        var client = clientOpt.get();
        var adress = new Adress(
                dto.cep(),
                dto.street(),
                dto.number(),
                dto.complement(),
                dto.neighborhood(),
                dto.city(),
                dto.state(),
                client
        );

        var saved = adressRepository.save(adress);
        return Optional.of(saved);
    }
}
