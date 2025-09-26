package com.estudantestech.store.controller;

import com.estudantestech.store.domain.images.ImagesProduct;
import com.estudantestech.store.repositories.ImagesProductsRepository;
import com.estudantestech.store.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
public class ImagesProductsController {

    private final ProductService service;

    public ImagesProductsController(ProductService service) {
        this.service = service;
    }

    @Autowired
    private ImagesProductsRepository imagesProductsRepository;

    @GetMapping("/images/{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable Long id) {
        ImagesProduct image = imagesProductsRepository.findById(id).orElse(null);
        if (image == null || image.getDados() == null) {
            return ResponseEntity.notFound().build();
        }
        MediaType mediaType = MediaType.IMAGE_JPEG;
        if ("image/png".equals(image.getTipo())) {
            mediaType = MediaType.IMAGE_PNG;
        }
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(mediaType);
        return new ResponseEntity<>(image.getDados(), headers, HttpStatus.OK);
    }

}
