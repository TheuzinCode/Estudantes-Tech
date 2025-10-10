package com.estudantestech.store.controller;

import com.estudantestech.store.domain.images.ImagesProduct;
import com.estudantestech.store.domain.product.Product;
import com.estudantestech.store.domain.user.User;
import com.estudantestech.store.repositories.ImagesProductsRepository;
import com.estudantestech.store.repositories.ProductRepository;
import com.estudantestech.store.repositories.UserRepository;
import com.estudantestech.store.service.ImagesProductsService;
import com.estudantestech.store.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

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

    @Autowired
    private UserRepository userRepository;


    //PRIMEIRA TELA DE PRODUTOS
    @GetMapping("/products")
    public String products(Model model,
                           Authentication authentication,
                           @RequestParam(required = false)String name) {

        User user = userRepository.findByEmail(authentication.getName());
        model.addAttribute("isAdmin", user.isAdmin());

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
                                @RequestParam("imageFile") MultipartFile[] imageFile) {

       try {
           Product saveProduct = productRepository.save(product);
           if (imageFile != null && imageFile.length > 0) {
               for (MultipartFile file : imageFile) {
                   if (!file.isEmpty()) {
                       imagesProductsService.save(file, saveProduct);
                   }
               }
           }
       }catch (Exception e){
           e.printStackTrace();
       }
        return "redirect:/products";
    }

    //TELA DE EDITAR PRODUTO
    @GetMapping("/produtos/editar/{id}")
    public String mostrarFormularioDeEdicao(@PathVariable("id") Long id, Authentication authentication, Model model) {
        Optional<Product> produtoOpt = productRepository.findById(id);
        if (!produtoOpt.isPresent()) {
            return "redirect:/produtos";
        }
        Product produto = produtoOpt.get();

        User user = userRepository.findByEmail(authentication.getName());
        model.addAttribute("isAdmin", user.isAdmin());


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
                                Authentication authentication,
                                Model model,
                                @RequestParam(value = "imageFile", required = false) MultipartFile imageFile,
                                @RequestParam(value = "imageId", required = false) Long imageId){


        User user = userRepository.findByEmail(authentication.getName());
        model.addAttribute("isAdmin", user.isAdmin());

        try{

            if (user.isAdmin()){
                productRepository.save(product);
                if ( imageFile != null && !imageFile.isEmpty() && imageId != null){
                    imagesProductsService.updateImage(imageId, imageFile);
                }
            }else {
                Product productFromDB = productRepository.findById(product.getIdProduct())
                        .orElseThrow(() -> new RuntimeException("Produto não encontrado!"));
                productFromDB.setQuantity(product.getQuantity());
               productRepository.save(productFromDB);
            }


        } catch (IOException e) {
            e.printStackTrace();
            return "erro";
        }

        return "redirect:/products";
    }
    
    @GetMapping("/loja")
    public String loja(Model model, @RequestParam(required = false) String name) {
        model.addAttribute("products", productService.search(name));
        return "loja";
    }

}
