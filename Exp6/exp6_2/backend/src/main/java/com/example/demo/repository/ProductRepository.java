package com.example.demo.repository;
import com.example.demo.entity.Product; 
import java.util.List; 
import org.springframework.data.jpa.repository.*; 
public interface ProductRepository extends JpaRepository<Product,Long>{ @Query("SELECT p FROM Product p JOIN FETCH p.category") List<Product> findAllWithCategory(); }

