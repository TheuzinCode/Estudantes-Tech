package com.estudantestech.store.service;

import com.estudantestech.store.domain.client.Client;
import com.estudantestech.store.domain.client.CreateClientDTO;
import com.estudantestech.store.repositories.AdressRepository;
import com.estudantestech.store.repositories.ClientRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Date;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ClientServiceTest {

    @Mock
    ClientRepository clientRepository;

    @Mock
    AdressRepository adressRepository;

    @Mock
    PasswordEncoder passwordEncoder;

    @InjectMocks
    ClientService clientService;

    @Test
    void createClient_success() {
        CreateClientDTO dto = new CreateClientDTO(
                "Joao",
                "12345678900",
                "email@email.com",
                new Date(),
                "M",
                "senha123",
                null,
                null,
                null,
                null,
                null,
                null,
                null
        );

        when(clientRepository.existsByEmail("email@email.com")).thenReturn(false);
        when(passwordEncoder.encode("senha123")).thenReturn("encoded");
        when(clientRepository.save(any(Client.class))).thenAnswer(invocation -> {
            Client c = invocation.getArgument(0);
            c.setClientId(UUID.randomUUID());
            return c;
        });

        UUID id = clientService.createClient(dto);

        assertNotNull(id);
        verify(clientRepository).existsByEmail("email@email.com");
        verify(passwordEncoder).encode("senha123");
        verify(clientRepository).save(any(Client.class));
    }

    @Test
    void createClient_emailAlreadyExists_throwsException() {
        CreateClientDTO dto = new CreateClientDTO(
                "Joao",
                "12345678900",
                "email@email.com",
                new Date(),
                "M",
                "senha123",
                null,
                null,
                null,
                null,
                null,
                null,
                null
        );

        when(clientRepository.existsByEmail("email@email.com")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> clientService.createClient(dto));
        verify(clientRepository).existsByEmail("email@email.com");
        verifyNoMoreInteractions(clientRepository);
    }

    @Test
    void authenticate_success() {
        Client client = new Client(
                "Maria",
                "email@email.com",
                null,
                null,
                null,
                "encoded"
        );
        client.setClientId(UUID.randomUUID());

        when(clientRepository.findByEmail("email@email.com")).thenReturn(Optional.of(client));
        when(passwordEncoder.matches("senha", "encoded")).thenReturn(true);

        Optional<Client> result = clientService.authenticate("email@email.com", "senha");

        assertTrue(result.isPresent());
        assertEquals(client.getClientId(), result.get().getClientId());
        verify(clientRepository).findByEmail("email@email.com");
        verify(passwordEncoder).matches("senha", "encoded");
    }
}
