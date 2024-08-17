
CREATE TABLE `business` (
  `business_id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `business_mail` VARCHAR(255) NOT NULL,
  `business_url` VARCHAR(2048),
  `business_hotline` VARCHAR(64),
  `business_description` TEXT,
  `business_address` VARCHAR(1048),
  `business_owner_name` VARCHAR(255) NOT NULL,
  `business_owner_mail` VARCHAR(255) NOT NULL,
  `business_password` VARCHAR(2048) NOT NULL,
  `logo_location` VARCHAR(255),
  `business_hours` JSON,
  `business_registration_number` VARCHAR(100),
  `business_type` VARCHAR(50),
  `business_registration_date` DATE,
  `status` BOOL NOT NULL
);

CREATE TRIGGER before_insert_business
BEFORE INSERT ON `business`
FOR EACH ROW
SET NEW.`business_id` = UUID();

CREATE TABLE `business_branch` (
  `branch_id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `business_id` VARCHAR(36) NOT NULL,
  `branch_name` VARCHAR(255) NOT NULL,
  `branch_location` VARCHAR(255),
  `branch_manager_id` VARCHAR(36),
  `branch_manager_name` VARCHAR(255),
  `branch_manager_mail` VARCHAR(255),
  `branch_manager_password` VARCHAR(1048),
  `status` BOOL NOT NULL,
  FOREIGN KEY (`business_id`) REFERENCES `business`(`business_id`)
);

CREATE TRIGGER before_insert_business_branch
BEFORE INSERT ON `business_branch`
FOR EACH ROW
SET NEW.`branch_id` = UUID();

CREATE TABLE `employee` (
  `employee_id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `branch_id` VARCHAR(36) NOT NULL,
  `employee_name` VARCHAR(255) NOT NULL,
  `role` VARCHAR(128),
  `salary` FLOAT,
  `photo_url` VARCHAR(2048),
  `status` BOOL NOT NULL,
  FOREIGN KEY (`branch_id`) REFERENCES `business_branch`(`branch_id`)
);

CREATE TRIGGER before_insert_employee
BEFORE INSERT ON `employee`
FOR EACH ROW
SET NEW.`employee_id` = UUID();

CREATE TABLE `loyalty_programs` (
  `loyalty_program_id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `business_id` VARCHAR(36) NOT NULL,
  `loyalty_program_name` VARCHAR(255) NOT NULL,
  `points_per_hundred` INT NOT NULL,
  `redeem_value` FLOAT,
  `by_sales` BOOL NOT NULL,
  `minimum_eligibility_value` FLOAT,
  `start_date` DATETIME NOT NULL,
  FOREIGN KEY (`business_id`) REFERENCES `business`(`business_id`)
);

CREATE TABLE `customer` (
  `customer_id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `customer_name` VARCHAR(255) NOT NULL,
  `customer_mail` VARCHAR(255),
  `customer_phone` VARCHAR(55),
  `birthday` DATE,
  `gender` VARCHAR(55),
  `password` VARCHAR(2048)
);

CREATE TABLE `bill` (
  `bill_id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `branch_id` VARCHAR(36) NOT NULL,
  `employee_id` VARCHAR(36) NOT NULL,
  `payment_method` VARCHAR(32),
  `total_price` FLOAT NOT NULL,
  `received` FLOAT,
  `status` BOOL NOT NULL,
  `notes` VARCHAR(4096),
  `date_time` DATETIME NOT NULL,
  `customer_id` VARCHAR(36),
  FOREIGN KEY (`branch_id`) REFERENCES `business_branch`(`branch_id`),
  FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`),
  FOREIGN KEY (`customer_id`) REFERENCES `customer`(`customer_id`)
);

CREATE TRIGGER before_insert_bill
BEFORE INSERT ON `bill`
FOR EACH ROW
SET NEW.`bill_id` = UUID();

CREATE TRIGGER before_insert_customer
BEFORE INSERT ON `customer`
FOR EACH ROW
SET NEW.`customer_id` = UUID();

CREATE TABLE `work_time` (
  `employee_id` VARCHAR(36) NOT NULL,
  `in_time` DATETIME NOT NULL,
  `out_time` DATETIME,
  FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`)
);

CREATE TRIGGER before_insert_loyalty_programs
BEFORE INSERT ON `loyalty_programs`
FOR EACH ROW
SET NEW.`loyalty_program_id` = UUID();

CREATE TABLE `customer_loyalty` (
  `customer_id` VARCHAR(36) NOT NULL,
  `loyalty_program_id` VARCHAR(36) NOT NULL,
  `start_date` DATETIME NOT NULL,
  `points` FLOAT,
  PRIMARY KEY (`customer_id`, `loyalty_program_id`),
  FOREIGN KEY (`customer_id`) REFERENCES `customer`(`customer_id`),
  FOREIGN KEY (`loyalty_program_id`) REFERENCES `loyalty_programs`(`loyalty_program_id`)
);

CREATE TABLE `categories` (
  `category_id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `branch_id` VARCHAR(36) NOT NULL,
  `category_name` VARCHAR(255) NOT NULL,
  `category_location` VARCHAR(255),
  FOREIGN KEY (`branch_id`) REFERENCES `business_branch`(`branch_id`)
);

CREATE TABLE `items` (
  `item_id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `category_id` VARCHAR(36) NOT NULL,
  `item_name` VARCHAR(255) NOT NULL,
  `minimum_stock` FLOAT,
  `barcode` VARCHAR(255),
  `stock` FLOAT,
  `image_url` VARCHAR(2048),
  `exp_date` DATE,
  `discount` FLOAT,
  `supplier_name` VARCHAR(255),
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`category_id`)
);

CREATE TABLE `bill_items` (
  `bill_id` VARCHAR(36) NOT NULL,
  `item_id` VARCHAR(36) NOT NULL,
  `quantity` INT NOT NULL,
  PRIMARY KEY (`bill_id`, `item_id`),
  FOREIGN KEY (`bill_id`) REFERENCES `bill`(`bill_id`),
  FOREIGN KEY (`item_id`) REFERENCES `items`(`item_id`)
);

CREATE TRIGGER before_insert_categories
BEFORE INSERT ON `categories`
FOR EACH ROW
SET NEW.`category_id` = UUID();

CREATE TRIGGER before_insert_items
BEFORE INSERT ON `items`
FOR EACH ROW
SET NEW.`item_id` = UUID();
