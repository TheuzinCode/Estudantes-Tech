package com.estudantestech.store.repositories;

import com.estudantestech.store.domain.images.ImagesProduct;
import com.estudantestech.store.domain.product.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;
import java.util.UUID;

public interface ImagesProductsRepository extends JpaRepository<ImagesProduct, Long> {


    Optional<ImagesProduct> findById(Long id);
}
