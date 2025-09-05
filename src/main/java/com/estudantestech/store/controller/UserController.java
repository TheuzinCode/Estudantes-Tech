package com.estudantestech.store.controller;

import com.estudantestech.store.domain.user.UpdateUserDTO;
import com.estudantestech.store.domain.user.User;
import com.estudantestech.store.domain.user.CreateUserDTO;
import com.estudantestech.store.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    // Create user
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody CreateUserDTO createUserDTO){
        var userId = userService.createUser(createUserDTO);
        return ResponseEntity.created(URI.create("/api/users" + userId.toString())).build();
    }

    // Get user by id
    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable("userId") String userId) {
        var user = userService.getUserById(userId);

        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        }

        return ResponseEntity.notFound().build();
    }

    // Get all users
    @GetMapping
    public ResponseEntity<List<User>> listUsers() {
        var users = userService.listUsers();

        return ResponseEntity.ok(users);
    }

     @PutMapping("/{userId}")
     public ResponseEntity<Void> updateUserById(@PathVariable("userId") String userId,
                                                @RequestBody UpdateUserDTO updateUserDTO) {
        userService.updateUserById(userId, updateUserDTO);
        return ResponseEntity.noContent().build();
     }

    // Delete user by Id
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteById(@PathVariable("userId") String userId) {
        userService.deleteById(userId);
        return ResponseEntity.noContent().build();
    }

    // Get para a pagina usuarios
    @GetMapping("/usuarios")
    public String usuarios(Model model) {
        model.addAttribute("users", userService.listUsers());
        return "usuarios";
    }
}
