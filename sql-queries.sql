create database library;
CREATE TABLE IF NOT EXISTS `customer` (
    `customer_id` varchar(500) NOT NULL UNIQUE,
    `customer_name` varchar(255) NOT NULL,
    PRIMARY KEY (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=92628 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE IF NOT EXISTS `fees` (
    `genre` varchar(255) NOT NULL UNIQUE,
    `fees` varchar(255) NOT NULL UNIQUE,
    PRIMARY KEY (`genre`),
) ENGINE=InnoDB AUTO_INCREMENT=92628 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE IF NOT EXISTS `books` (
    `book_id` varchar(500) NOT NULL UNIQUE,
    `book_name` varchar(255) NOT NULL,
    `genre` varchar(255) NULL DEFAULT 'REGULAR',
    `author_name` varchar(255),
    `total_copies` int,
    `available_copies` int,
    PRIMARY KEY (`book_id`),
    KEY (`book_name`),
    FOREIGN KEY (genre) REFERENCES fees(genre)
) ENGINE=InnoDB AUTO_INCREMENT=92628 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE IF NOT EXISTS `books_lent` (
    `id` varchar(255) NOT NULL,
    `book_id` varchar(500) NOT NULL UNIQUE,
    `customer_id` varchar(500) NOT NULL,
    `lend_date` timestamp DEFAULT CURRENT_TIMESTAMP,
    `days_to_return` int NULL DEFAULT 7,
    `return_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY (`book_id`),
    KEY (`customer_id`),
    FOREIGN KEY (book_id) REFERENCES books(book_id),
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
) ENGINE=InnoDB AUTO_INCREMENT=92628 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- id, date