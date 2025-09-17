package com.estudantestech.store.repositories;

import com.estudantestech.store.domain.images.ImagesProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ImagesProductsRepository extends JpaRepository<ImagesProduct, Long> {
    Optional<ImagesProduct> findById(Long id);
}
