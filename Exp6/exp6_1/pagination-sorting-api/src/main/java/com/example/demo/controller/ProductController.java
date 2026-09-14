package com.example.demo.controller;
import com.example.demo.entity.Product;
import com.example.demo.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/products")
public class ProductController{
 @Autowired private ProductService service;
 @PostMapping public Product addProduct(@RequestBody Product p){return service.save(p);}
 @GetMapping public Page<Product> getProducts(@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="5") int size,@RequestParam(defaultValue="id") String sortBy,@RequestParam(defaultValue="asc") String direction){
  return service.getProducts(page,size,sortBy,direction);
 }
}
