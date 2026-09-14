package com.example.demo.service;
import com.example.demo.entity.Product;
import com.example.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
@Service
public class ProductService{
 @Autowired private ProductRepository repository;
 public Page<Product> getProducts(int page,int size,String sortBy,String direction){
  Sort sort=direction.equalsIgnoreCase("desc")?Sort.by(sortBy).descending():Sort.by(sortBy).ascending();
  Pageable pageable=PageRequest.of(page,size,sort);
  return repository.findAll(pageable);
 }
 public Product save(Product p){return repository.save(p);}
}
