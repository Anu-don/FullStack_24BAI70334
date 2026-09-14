package com.example.restapi.service;

import com.example.restapi.dto.ProductDTO;
import com.example.restapi.entity.Product;
import com.example.restapi.exception.ResourceNotFoundException;
import com.example.restapi.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    private static final Logger logger = LoggerFactory.getLogger(ProductServiceImpl.class);

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public ProductDTO createProduct(ProductDTO dto) {
        logger.info("Creating product: name={}", dto.getName());
        Product product = toEntity(dto);
        Product saved = productRepository.save(product);
        logger.info("Product created successfully: id={}", saved.getId());
        return toDTO(saved);
    }

    @Override
    public List<ProductDTO> getAllProducts() {
        logger.debug("Fetching all products");
        List<ProductDTO> products = productRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        logger.debug("Fetched {} products", products.size());
        return products;
    }

    @Override
    public ProductDTO getProductById(Long id) {
        logger.debug("Fetching product: id={}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Product not found: id={}", id);
                    return new ResourceNotFoundException("Product not found with id: " + id);
                });
        return toDTO(product);
    }

    @Override
    public ProductDTO updateProduct(Long id, ProductDTO dto) {
        logger.info("Updating product: id={}", id);
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Update failed, product not found: id={}", id);
                    return new ResourceNotFoundException("Product not found with id: " + id);
                });

        existing.setName(dto.getName());
        existing.setDescription(dto.getDescription());
        existing.setPrice(dto.getPrice());
        existing.setQuantity(dto.getQuantity());

        ProductDTO updated = toDTO(productRepository.save(existing));
        logger.info("Product updated successfully: id={}", id);
        return updated;
    }

    @Override
    public void deleteProduct(Long id) {
        logger.info("Deleting product: id={}", id);
        if (!productRepository.existsById(id)) {
            logger.warn("Delete failed, product not found: id={}", id);
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
        logger.info("Product deleted successfully: id={}", id);
    }

    private Product toEntity(ProductDTO dto) {
        Product product = new Product();
        product.setId(dto.getId());
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setQuantity(dto.getQuantity());
        return product;
    }

    private ProductDTO toDTO(Product product) {
        return new ProductDTO(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getQuantity()
        );
    }
}
