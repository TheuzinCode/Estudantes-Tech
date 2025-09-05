package com.estudantestech.store.service;

import com.estudantestech.store.domain.user.UpdateUserDTO;
import com.estudantestech.store.domain.user.User;
import com.estudantestech.store.domain.user.CreateUserDTO;
import com.estudantestech.store.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService implements UserDetailsService {

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username);
        if (user == null) {
            throw new UsernameNotFoundException("Usuário não encontrado");
        }
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(user.isAdmin() ? "ADMIN" : "USER"))
        );
    }

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UUID createUser(CreateUserDTO createUserDTO) {

        String encryptedPassword = passwordEncoder.encode(createUserDTO.password());

        User entity = new User(
                createUserDTO.name(),
                createUserDTO.cpf(),
                createUserDTO.email(),
                encryptedPassword,
                createUserDTO.isAdmin(),
                true, // sempre ativo ao criar
                Instant.now(),
                null
        );

        User userSaved = userRepository.save(entity);
        return userSaved.getUserId();
    }

    public Optional<User> getUserById (String userId) {
        return userRepository.findById(UUID.fromString(userId));
    }

    public List<User> listUsers() {
        return userRepository.findAll();
    }

    public void updateUserById(String userId, UpdateUserDTO updateUserDTO) {
        var id = UUID.fromString(userId);
        var userEntity = userRepository.findById(id);

        if (userEntity.isPresent()) {
            var user = userEntity.get();

            if(updateUserDTO.name() != null) {
                user.setName(updateUserDTO.name());
            }

            if(updateUserDTO.isAdmin() != null) {
                user.setAdmin(updateUserDTO.isAdmin());
            }

            if(updateUserDTO.cpf() != null) {
                user.setCpf(updateUserDTO.cpf());
            }

            if(updateUserDTO.active() != null) {
                user.setActive(updateUserDTO.active());
            }

            if(updateUserDTO.password() != null && !updateUserDTO.password().isEmpty()) {
                user.setPassword(passwordEncoder.encode(updateUserDTO.password()));
            }

            userRepository.save(user);
        }
    }

    public void deleteById(String userId) {
        var id = UUID.fromString(userId);
        var userExists = userRepository.existsById(id);

        if (userExists)
            userRepository.deleteById(id);
    }

    public boolean emailExists(String email) {
        return userRepository.findByEmail(email) != null;
    }
}
