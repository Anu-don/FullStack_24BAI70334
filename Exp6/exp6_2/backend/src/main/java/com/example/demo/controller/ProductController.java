package com.example.demo.controller;

import com.example.demo.entity.Product;
import com.example.demo.entity.ProductRequest;
import com.example.demo.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/optimized")
    public List<Product> optimized() {
        return productService.getAllOptimized();
    }

    @GetMapping("/cached")
    public List<Product> cached() {
        return productService.getAllCached();
    }

    @PostMapping
    public Product addProduct(@RequestBody ProductRequest request) {
        return productService.addProduct(request);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }
}