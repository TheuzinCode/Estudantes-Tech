package com.estudantestech.store.controller;

import com.estudantestech.store.domain.user.CreateUserDTO;
import com.estudantestech.store.domain.user.UpdateUserDTO;
import com.estudantestech.store.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class UserPageController {
    @Autowired
    private UserService userService;

    @GetMapping("/usuarios")
    public String usuarios(Model model) {
        model.addAttribute("users", userService.listUsers());
        return "usuarios";
    }

    @PostMapping("/usuarios/criar")
    public String criarUsuario(@RequestParam String name,
                               @RequestParam String cpf,
                               @RequestParam String email,
                               @RequestParam String password,
                               @RequestParam(required = false) Boolean isAdmin,
                               Model model) {
        if (userService.emailExists(email)) {
            model.addAttribute("emailError", true);
            model.addAttribute("users", userService.listUsers());
            return "usuarios";
        }
        userService.createUser(new CreateUserDTO(
                name,
                cpf,
                email,
                password,
                isAdmin != null && isAdmin,
                true // sempre ativo ao criar
        ));
        return "redirect:/usuarios";
    }

    @PostMapping("/usuarios/editar/{id}")
    public String editarUsuario(@PathVariable("id") String id,
                                @RequestParam String name,
                                @RequestParam String password,
                                @RequestParam String cpf,
                                @RequestParam(required = false) Boolean isAdmin,
                                @RequestParam Boolean active) {
        userService.updateUserById(id, new UpdateUserDTO(
                name,
                password,
                cpf,
                isAdmin != null && isAdmin,
                active
        ));
        return "redirect:/usuarios";
    }

    @PostMapping("/usuarios/excluir/{id}")
    public String excluirUsuario(@PathVariable("id") String id) {
        userService.deleteById(id);
        return "redirect:/usuarios";
    }
}