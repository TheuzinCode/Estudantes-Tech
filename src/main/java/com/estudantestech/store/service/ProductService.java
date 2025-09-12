package com.estudantestech.store.service;

import com.estudantestech.store.domain.product.Product;
import com.estudantestech.store.domain.user.User;
import com.estudantestech.store.repositories.ProductRepository;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProductService {


    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository){
        this.productRepository = productRepository;
    }


    public Product save(Product product){
        productRepository.save(product);
        return product;
    }


    public List<Product> listProduct() {
        return productRepository.findAll();
    }



    public Optional<Product> getProductById(UUID id){
        return productRepository.findById(id);

    }



    public void delete(Product product){
        productRepository.delete(product);
    }

    public List<Product> search(String name){
        if (name != null){
            return productRepository.findByName(name);
        }
        return productRepository.findAll();
    }

    public void update(@NotNull Product product){
        if (product.getId() == null)
            throw new IllegalArgumentException("Para atualizar, é necessario que o produto já esteja salvo na base");

        productRepository.save(product);
    }
}
