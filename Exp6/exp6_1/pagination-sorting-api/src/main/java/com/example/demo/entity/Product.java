package com.example.demo.entity;
import jakarta.persistence.*;
@Entity
public class Product{
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
 private Long id; private String name; private String category; private double price;
 public Product(){} public Product(String name,String category,double price){this.name=name;this.category=category;this.price=price;}
 public Long getId(){return id;} public String getName(){return name;} public void setName(String n){name=n;}
 public String getCategory(){return category;} public void setCategory(String c){category=c;}
 public double getPrice(){return price;} public void setPrice(double p){price=p;}
}
