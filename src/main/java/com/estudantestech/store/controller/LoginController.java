package com.estudantestech.store.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LoginController {
    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    @GetMapping("/entrar")
    public String entrarPage() {
        return "entrar";
    }

    @GetMapping("/criarConta")
    public String criarContaPage() {
        return "criarConta";
    }

    @GetMapping("/perfil")
    public String perfilPage() {
        return "perfil";
    }

    @GetMapping("/checkout")
    public String checkoutPage() {return "checkout";}

    @GetMapping("/resumo")
    public String resumoPage() {return "resumo";}

    @GetMapping("/pedido")
    public String pedidoPage() {return "pedido";}

    @GetMapping("/admPedidos")
    public String admPedidos() {return "admPedidos";}

}
