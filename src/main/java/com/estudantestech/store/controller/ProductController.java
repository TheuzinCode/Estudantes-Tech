package com.estudantestech.store.controller;

import com.estudantestech.store.domain.product.Product;
import com.estudantestech.store.dto.CreateProductDTO;
import com.estudantestech.store.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService service;


    public ProductController(ProductService service){
        this.service = service;
    }

   /* @PostMapping("/save")
    public ResponseEntity<Void> save(@RequestBody @Valid CreateProductDTO product ){
            Product productEntity = product.CreateProduct();
            service.save(productEntity);
            return ResponseEntity.noContent().build();

    }


    */

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
