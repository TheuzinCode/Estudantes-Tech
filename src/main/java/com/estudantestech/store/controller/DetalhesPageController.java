package com.estudantestech.store.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class DetalhesPageController {

    @GetMapping("/admPedidosEdicao/{id}")
    public String paginaEdicao(@PathVariable Long id, Model model) {
        model.addAttribute("idPedido", id);
        return "admPedidosEdicao"; // carrega src/main/resources/templates/admPedidosEdicao.html
    }
}
