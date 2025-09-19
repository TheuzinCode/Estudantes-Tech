package com.estudantestech.store.repositories;

import com.estudantestech.store.domain.product.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByName(String name);
    List<Product> findByNameContainingIgnoreCase(String name);
}
