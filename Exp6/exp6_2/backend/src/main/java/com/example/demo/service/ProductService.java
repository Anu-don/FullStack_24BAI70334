package com.example.demo.service;

import com.example.demo.entity.Category;
import com.example.demo.entity.Product;
import com.example.demo.entity.ProductRequest;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.ProductRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repo;
    private final CategoryRepository categoryRepo;

    public ProductService(ProductRepository repo, CategoryRepository categoryRepo) {
        this.repo = repo;
        this.categoryRepo = categoryRepo;
    }

    @Transactional(readOnly = true)
    public List<Product> getAllOptimized() {
        return repo.findAllWithCategory();
    }

    @Cacheable("products")
    @Transactional(readOnly = true)
    public List<Product> getAllCached() {
        return repo.findAllWithCategory();
    }

    @Transactional
    public Product addProduct(ProductRequest request) {
        Category category = categoryRepo.findById(request.getCategoryId())
            .orElseThrow(() -> new RuntimeException("Category not found"));
        Product p = new Product();
        p.setName(request.getName());
        p.setPrice(request.getPrice());
        p.setCategory(category);
        return repo.save(p);
    }

    @Transactional
    public void deleteProduct(Long id) {
        repo.deleteById(id);
    }
}