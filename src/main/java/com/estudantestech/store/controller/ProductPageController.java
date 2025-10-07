package com.estudantestech.store.controller;

import com.estudantestech.store.domain.product.Product;
import com.estudantestech.store.dto.CreateProductDTO;
import com.estudantestech.store.repositories.ImagesProductsRepository;
import com.estudantestech.store.repositories.ProductRepository;
import com.estudantestech.store.service.ImagesProductsService;
import com.estudantestech.store.service.ProductService;
import org.antlr.v4.runtime.misc.LogManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import com.estudantestech.store.domain.images.ImagesProduct;


@Controller
public class ProductPageController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ImagesProductsRepository imagesProductsRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ImagesProductsService imagesProductsService;

    //PRIMEIRA TELA DE PRODUTOS
    @GetMapping("/products")
    public String products(Model model, @RequestParam(required = false)String name) {
        model.addAttribute("products", productService.search(name));
        return "produtos";
    }

    //TELA DE CADASTRO DE PRODUTOS
    @GetMapping("/cadastro")
    public String form(Model model){
        model.addAttribute("product", new Product());
        return "criarProduto";
    }

    //CADASTRO DE PRODUTOS
    @PostMapping("/cadastro/novo")
    public String salvarProduto(@ModelAttribute("produto") Product product,
                                @RequestParam("imageFile") MultipartFile imageFile) {

       try {
           Product saveProduct = productRepository.save(product);
           if (!imageFile.isEmpty()) {
               imagesProductsService.save(imageFile, saveProduct);
           }
       }catch (Exception e){
           e.printStackTrace();
       }
        return "redirect:/products";
    }

    //TELA DE EDITAR PRODUTO
    @GetMapping("/produtos/editar/{id}")
    public String mostrarFormularioDeEdicao(@PathVariable("id") Long id, Model model) {
        Optional<Product> produtoOpt = productRepository.findById(id);
        if (!produtoOpt.isPresent()) {
            return "redirect:/produtos";
        }
        Product produto = produtoOpt.get();

        // Busca o id da imagem principal do produto
        Long imageId = null;
        if (produto.getImagesProducts() != null && !produto.getImagesProducts().isEmpty()) {
            ImagesProduct principal = produto.getImagesProducts().stream()
                .filter(ImagesProduct::isPrincipal)
                .findFirst()
                .orElse(produto.getImagesProducts().get(0));
            imageId = principal.getId();
        }
        model.addAttribute("product", produto);
        model.addAttribute("imageId", imageId);
        return "alterarProduto";
    }

    //EDITAR PRODUTO
    @PostMapping("/produtos/salvar")
    public String editarProduto(@ModelAttribute("produto") Product product,
                                @RequestParam(value = "imageFile", required = false) MultipartFile imageFile,
                                @RequestParam(value = "imageId", required = false) Long imageId){


        try{
            productRepository.save(product);
            if ( imageFile != null && !imageFile.isEmpty() && imageId != null){
                imagesProductsService.updateImage(imageId, imageFile);
            }
        } catch (IOException e) {
            e.printStackTrace();
            return "erro";
        }

        return "redirect:/products";
    }

}
