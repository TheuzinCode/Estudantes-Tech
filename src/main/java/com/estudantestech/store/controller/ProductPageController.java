package com.estudantestech.store.controller;

import com.estudantestech.store.domain.product.Product;
import com.estudantestech.store.dto.CreateProductDTO;
import com.estudantestech.store.repositories.ProductRepository;
import com.estudantestech.store.service.ImagesProductsService;
import com.estudantestech.store.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;


@Controller
public class ProductPageController {

    @Autowired
    private ProductService productService;

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
        model.addAttribute("product", produtoOpt.get());
        return "alterarProduto";
    }

    //EDITAR PRODUTO
    @PostMapping("/produtos/salvar")
    public String salvarProduto(@ModelAttribute("produto") Product product) {
        productRepository.save(product);
        return "redirect:/products";

    }

}
