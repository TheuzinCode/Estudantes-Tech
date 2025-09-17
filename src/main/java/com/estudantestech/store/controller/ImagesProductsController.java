package com.estudantestech.store.controller;


import com.estudantestech.store.repositories.ImagesProductsRepository;
import com.estudantestech.store.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
public class ImagesProductsController {

    private final ProductService service;

    public ImagesProductsController(ProductService service) {
        this.service = service;
    }


}

