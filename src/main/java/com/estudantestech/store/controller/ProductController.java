package com.estudantestech.store.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.estudantestech.store.domain.product.Product;
import com.estudantestech.store.dto.CreateProductDTO;
import com.estudantestech.store.repositories.ProductRepository;
import com.estudantestech.store.service.ProductService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService service;


    public ProductController(ProductService service){
        this.service = service;
    }

@Autowired
private ProductRepository productRepository;

@PostMapping
public ResponseEntity<CreateProductDTO> save(@RequestBody @Valid CreateProductDTO productDto ){
    Product productEntity = productDto.CreateProduct();
    Product savedProduct = productRepository.save(productEntity);

    CreateProductDTO response = new CreateProductDTO(
            savedProduct.getIdProduct(),
            savedProduct.getName(),
            savedProduct.getStars(),
            savedProduct.getDescription(),
            savedProduct.getQuantity(),
            savedProduct.getValue(),
            savedProduct.isActive()
    );

    return ResponseEntity.ok(response);
}

    @GetMapping("{id}")
    public ResponseEntity<CreateProductDTO> getProductById(@PathVariable("id") Long id){
        var idProduct = id;
        Optional<Product> optionalProduct = service.getProductById(idProduct);
        if (optionalProduct.isPresent()){
            Product product = optionalProduct.get();
            CreateProductDTO dto = new CreateProductDTO(
                    product.getIdProduct(),
                    product.getName(),
                    product.getStars(),
                    product.getDescription(),
                    product.getQuantity(),
                    product.getValue(),
                    product.isActive());
            return ResponseEntity.ok(dto);
        }

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id){
        var idProduct = id;
        Optional<Product> productOptional = service.getProductById(idProduct);

        if (productOptional.isEmpty()){
            return ResponseEntity.notFound().build();
        }

        service.delete(productOptional.get());

        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<CreateProductDTO>> search(@RequestParam(value = "name", required = false) String name){
        List<Product> result = service.search(name);
        List<CreateProductDTO> list = result
                .stream()
                .map(product -> new CreateProductDTO(
                        product.getIdProduct(),
                        product.getName(),
                        product.getStars(),
                        product.getDescription(),
                        product.getQuantity(),
                        product.getValue(),
                        product.isActive()
                        )
                ).collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @PutMapping("/atualizar/{id}")
    public ResponseEntity<Void> update(@PathVariable("id") Long id, @RequestBody CreateProductDTO productDTO){
        var idProduct = (id);
        Optional<Product> productOptional = service.getProductById(idProduct);

        if (productOptional.isEmpty()){
            return ResponseEntity.notFound().build();
        }

        var product = productOptional.get();
        product.setName(productDTO.name());
        product.setStars(productDTO.stars());
        product.setDescription(productDTO.description());
        product.setQuantity(productDTO.quantity());
        product.setValue(productDTO.value());
        product.setActive(productDTO.active());
        service.update(product);

        return ResponseEntity.noContent().build();
    }
}
