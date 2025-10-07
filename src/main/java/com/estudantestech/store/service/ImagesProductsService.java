package com.estudantestech.store.service;

import com.estudantestech.store.domain.images.ImagesProduct;
import com.estudantestech.store.domain.product.Product;
import com.estudantestech.store.repositories.ImagesProductsRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Service
public class ImagesProductsService {

    private final ImagesProductsRepository imagesProductsRepository;

    public ImagesProductsService(ImagesProductsRepository imagesProductsRepository) {
        this.imagesProductsRepository = imagesProductsRepository;
    }


    public ImagesProduct save(MultipartFile file, Product product) throws IOException {

        ImagesProduct imagesProduct = new ImagesProduct();
        imagesProduct.setTipo(file.getContentType());
        imagesProduct.setDados(file.getBytes());

        imagesProduct.setProduct(product);
        product.getImagesProducts().add(imagesProduct);

        ImagesProduct images = imagesProductsRepository.save(imagesProduct);

        images.setName("imagem " + images.getId());

        return imagesProductsRepository.save(images);
    }



    public Optional<ImagesProduct> getImagesProductsId(Long id){
        return imagesProductsRepository.findById(id);
    }

    public void delete(ImagesProduct imagesProduct){
            imagesProductsRepository.delete(imagesProduct);
    }

    public ImagesProduct updateImage(long imageId, MultipartFile file) throws IOException {

        ImagesProduct imageToUpdate = imagesProductsRepository.findById(imageId)
                .orElseThrow(() -> new IOException("Imagem com ID " + imageId + " não encontrada."));

        imageToUpdate.setTipo(file.getContentType());
        imageToUpdate.setDados(file.getBytes());

        return imagesProductsRepository.save(imageToUpdate);

    }

}
