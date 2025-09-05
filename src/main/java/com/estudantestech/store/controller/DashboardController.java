package com.estudantestech.store.controller;

import com.estudantestech.store.domain.user.User;
import com.estudantestech.store.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DashboardController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/dashboard")
    public String dashboard(Authentication authentication, Model model) {
        User user = userRepository.findByEmail(authentication.getName());
        model.addAttribute("isAdmin", user.isAdmin());
        return "dashboard";
    }
}