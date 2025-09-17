package com.estudantestech.store.service;

import com.estudantestech.store.domain.images.ImagesProduct;
import com.estudantestech.store.domain.product.Product;
import com.estudantestech.store.repositories.ImagesProductsRepository;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

public class ImagesProductsService {

    private final ImagesProductsRepository imagesProductsRepository;

    public ImagesProductsService(ImagesProductsRepository imagesProductsRepository) {
        this.imagesProductsRepository = imagesProductsRepository;
    }


    public ImagesProduct save(MultipartFile file, Product product) throws IOException {

        ImagesProduct imagesProduct = new ImagesProduct();
        imagesProduct.setTipo(file.getContentType());
        imagesProduct.setDados(file.getBytes());
        product.getImagesProducts().add(imagesProduct);

        ImagesProduct images = imagesProductsRepository.save(imagesProduct);

        images.setName("imagem " + images.getId());

        return imagesProductsRepository.save(images);
    }


    public Optional<ImagesProduct> getImagesProducts(Long id){
        return imagesProductsRepository.findById(id);
    }

    public void delete(ImagesProduct imagesProduct){
            imagesProductsRepository.delete(imagesProduct);
    }

    public void update(ImagesProduct imagesProduct){
        if (imagesProduct.getId() == null)
            throw new IllegalArgumentException("Para atualizar, é necessario que o a imagem já esteja salvo na base");
        imagesProductsRepository.save(imagesProduct);
    }

}
