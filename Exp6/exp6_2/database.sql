CREATE DATABASE IF NOT EXISTS productdb;
USE productdb;

CREATE TABLE IF NOT EXISTS category (
    id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS product (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(150) NOT NULL,
    price       DOUBLE NOT NULL,
    category_id BIGINT,
    FOREIGN KEY (category_id) REFERENCES category(id)
);

INSERT INTO category (name) VALUES
    ('Electronics'),
    ('Clothing'),
    ('Books'),
    ('Home & Kitchen'),
    ('Sports');

INSERT INTO product (name, price, category_id) VALUES
    ('iPhone 15',        79999, 1),
    ('Samsung Galaxy S24',69999, 1),
    ('Sony Headphones',  12999, 1),
    ('Nike T-Shirt',      1499, 2),
    ('Levi''s Jeans',     3499, 2),
    ('Adidas Jacket',     4999, 2),
    ('Clean Code',         699, 3),
    ('The Pragmatic Programmer', 799, 3),
    ('System Design Interview', 899, 3),
    ('Instant Pot',       8999, 4),
    ('Non-stick Pan Set', 2499, 4),
    ('Cricket Bat',       1999, 5),
    ('Yoga Mat',           899, 5);
