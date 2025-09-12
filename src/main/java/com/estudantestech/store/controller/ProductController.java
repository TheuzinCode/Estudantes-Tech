package com.estudantestech.store.controller;

import com.estudantestech.store.domain.product.Product;
import com.estudantestech.store.dto.CreateProductDTO;
import com.estudantestech.store.repositories.ProductRepository;
import com.estudantestech.store.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service){
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Void> save(@RequestBody CreateProductDTO product ){
        Product productEntity = product.CreateProduct();
        service.save(productEntity);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("{id}")
    public ResponseEntity<CreateProductDTO> getProductById(@PathVariable("id") String id){
        var idProduct = UUID.fromString(id);
        Optional<Product> optionalProduct = service.getProductById(idProduct);
        if (optionalProduct.isPresent()){
            Product product = optionalProduct.get();
            CreateProductDTO dto = new CreateProductDTO(
                    product.getId(),
                    product.getName(),
                    product.getQuantity(),
                    product.getValue(),
                    product.isActive());
            return ResponseEntity.ok(dto);
        }

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") String id){
        var idProduct = UUID.fromString(id);
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
                        product.getId(),
                        product.getName(),
                        product.getQuantity(),
                        product.getValue(),
                        product.isActive()
                        )
                ).collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @PutMapping("{id}")
    public ResponseEntity<Void> update(@PathVariable("id") String id, @RequestBody CreateProductDTO productDTO){
        var idProduct = UUID.fromString(id);
        Optional<Product> productOptional = service.getProductById(idProduct);

        if (productOptional.isEmpty()){
            return ResponseEntity.notFound().build();
        }

        var product = productOptional.get();
        product.setName(productDTO.name());
        product.setQuantity(productDTO.quantity());
        product.setValue(productDTO.value());
        product.setActive(productDTO.active());
        service.update(product);

        return ResponseEntity.noContent().build();
    }
}
