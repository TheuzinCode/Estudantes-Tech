package com.estudantestech.store.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.estudantestech.store.domain.product.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByName(String name);
    List<Product> findByNameContainingIgnoreCase(String name);

    // paginação de produtos
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
