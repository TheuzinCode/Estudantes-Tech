package com.estudantestech.store.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class StorePageController {
        @GetMapping("/loja")
        public String storePage() {
            return "loja";
        }
}
