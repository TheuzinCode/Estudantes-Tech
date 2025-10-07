package com.estudantestech.store.service;

import com.estudantestech.store.domain.images.ImagesProduct;
import com.estudantestech.store.domain.product.Product;
import com.estudantestech.store.repositories.ImagesProductsRepository;
import com.estudantestech.store.repositories.ProductRepository;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {




    private final ProductRepository productRepository;

    private final ImagesProductsRepository imagesProductsRepository;

   private final ImagesProductsService imagesProductsService;

    public ProductService(ProductRepository productRepository, ImagesProductsRepository imagesProductsRepository, ImagesProductsService imagesProductsService){
        this.productRepository = productRepository;
        this.imagesProductsRepository = imagesProductsRepository;
        this.imagesProductsService = imagesProductsService;
        ;
    }



    public Product save(Product product, MultipartFile file) throws IOException {

        Product savedProduct = productRepository.save(product);

        if (file.isEmpty() && file != null){

            ImagesProduct imagesProduct = new ImagesProduct();

            imagesProduct.setTipo(file.getContentType());
            imagesProduct.setDados(file.getBytes());

            imagesProduct.setProduct(product);
            product.getImagesProducts().add(imagesProduct);

            ImagesProduct images = imagesProductsRepository.save(imagesProduct);

            images.setName("imagem " + images.getId());
        }



        return productRepository.save(product);
    }


    public List<Product> listProduct() {
        return productRepository.findAll();
    }


    public Optional<Product> getProductById(Long id){
        return productRepository.findById(id);

    }


    public void delete(Product product){
        productRepository.delete(product);
    }

    public List<Product> search(String name){
        if (name != null){
            return productRepository.findByNameContainingIgnoreCase(name);
        }
        return productRepository.findAll(Sort.by(Sort.Direction.DESC, "idProduct"));
    }


    public void update(@NotNull Product product) {
        if (product.getIdProduct() == 0)
            throw new IllegalArgumentException("Para atualizar, é necessario que o produto já esteja salvo na base");

        productRepository.save(product);
    }
}
