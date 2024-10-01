DROP SCHEMA IF EXISTS pointmaster;
CREATE DATABASE pointmaster;
USE pointmaster;

CREATE TABLE business (
  business_id VARCHAR(36) NOT NULL PRIMARY KEY,
  business_name VARCHAR(255) NOT NULL,
  business_mail VARCHAR(255) NOT NULL,
  business_url VARCHAR(2048), 
  business_hotline VARCHAR(64),
  business_description TEXT,
  business_address VARCHAR(1048),
  business_owner_name VARCHAR(255) NOT NULL,
  business_owner_mail VARCHAR(255) NOT NULL,
  business_owner_phone VARCHAR(55),
  business_owner_address VARCHAR(255),  
  business_owner_birthday DATE,
  business_owner_photo_url VARCHAR(2048),
  business_password VARCHAR(2048) NOT NULL,
  logo_url VARCHAR(2048),
  business_registration_number VARCHAR(100),
  business_type VARCHAR(50),
  business_registration_date DATE,
  status BOOL NOT NULL
);

CREATE TRIGGER before_insert_business
BEFORE INSERT ON business
FOR EACH ROW
SET NEW.business_id = UUID();

CREATE TABLE business_branch (
  branch_id VARCHAR(36) NOT NULL PRIMARY KEY,
  business_id VARCHAR(36) NOT NULL,
  branch_name VARCHAR(255) NOT NULL,
  branch_location VARCHAR(255), -- Added this column to match your insert statement
  status BOOL NOT NULL,
  FOREIGN KEY (business_id) REFERENCES business(business_id)
);

CREATE TRIGGER before_insert_business_branch
BEFORE INSERT ON business_branch
FOR EACH ROW
SET NEW.branch_id = UUID();

CREATE TABLE employee (
  employee_id VARCHAR(36) NOT NULL PRIMARY KEY,
  branch_id VARCHAR(36) NOT NULL,
  employee_name VARCHAR(255) NOT NULL,
  role VARCHAR(128),
  salary FLOAT,
  phone VARCHAR(55),
  employee_address VARCHAR(255),
  birthday DATE,
  photo_url VARCHAR(2048),
  status BOOL NOT NULL,
  employee_email VARCHAR(255),
  password VARCHAR(2048),
  FOREIGN KEY (branch_id) REFERENCES business_branch(branch_id)
);

CREATE TRIGGER before_insert_employee
BEFORE INSERT ON employee
FOR EACH ROW
SET NEW.employee_id = UUID();

CREATE TABLE loyalty_programs (
  loyalty_program_id VARCHAR(36) NOT NULL PRIMARY KEY,
  business_id VARCHAR(36) NOT NULL,
  loyalty_program_name VARCHAR(255) NOT NULL,
  points_per_hundred INT NOT NULL,
  redeem_value FLOAT,
  by_sales BOOL NOT NULL,
  minimum_eligibility_value FLOAT,
  start_date DATETIME NOT NULL,
  FOREIGN KEY (business_id) REFERENCES business(business_id)
);

CREATE TRIGGER before_insert_loyalty_programs
BEFORE INSERT ON loyalty_programs
FOR EACH ROW
SET NEW.loyalty_program_id = UUID();

CREATE TABLE customer (
  customer_id VARCHAR(36) NOT NULL PRIMARY KEY, -- Changed customer_id to NOT NULL
  customer_name VARCHAR(255) NOT NULL,
  photo_url VARCHAR(2048),
  customer_mail VARCHAR(255),
  customer_phone VARCHAR(55) NOT NULL UNIQUE, -- Ensuring unique phone numbers
  birthday DATE,
  gender VARCHAR(55),
  password VARCHAR(2048)
);

CREATE TRIGGER before_insert_customer
BEFORE INSERT ON customer
FOR EACH ROW
SET NEW.customer_id = UUID();

CREATE TABLE bill (
  bill_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, -- Changed to auto-increment
  branch_id VARCHAR(36) NOT NULL,
  employee_id VARCHAR(36) NOT NULL,
  payment_method VARCHAR(32),
  total_price FLOAT NOT NULL,
  discount FLOAT,
  received FLOAT,
  status BOOL NOT NULL,
  notes VARCHAR(4096),
  date_time DATETIME NOT NULL,
  customer_phone VARCHAR(55), -- Adjusted this to reference customer_phone
  FOREIGN KEY (branch_id) REFERENCES business_branch(branch_id),
  FOREIGN KEY (employee_id) REFERENCES employee(employee_id),
  FOREIGN KEY (customer_phone) REFERENCES customer(customer_phone) -- Changed this to customer_phone
);

-- CREATE TRIGGER before_insert_bill
-- BEFORE INSERT ON bill
-- FOR EACH ROW
-- SET NEW.bill_id = UUID();

CREATE TABLE work_time (
  employee_id VARCHAR(36) NOT NULL,
  in_time DATETIME NOT NULL,
  out_time DATETIME,
  FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
);

CREATE TABLE customer_loyalty (
  customer_id VARCHAR(36) NOT NULL,
  loyalty_program_id VARCHAR(36) NOT NULL,
  start_date DATETIME NOT NULL,
  points FLOAT,
  PRIMARY KEY (customer_id, loyalty_program_id),
  FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
  FOREIGN KEY (loyalty_program_id) REFERENCES loyalty_programs(loyalty_program_id)
);

CREATE TABLE categories (
  category_id VARCHAR(36) NOT NULL PRIMARY KEY,
  branch_id VARCHAR(36) NOT NULL,
  category_name VARCHAR(255) NOT NULL,
  category_location VARCHAR(255),
  status BOOL NOT NULL,
  FOREIGN KEY (branch_id) REFERENCES business_branch(branch_id)
);

CREATE TRIGGER before_insert_categories
BEFORE INSERT ON categories
FOR EACH ROW
SET NEW.category_id = UUID();


CREATE TABLE items (
  item_id VARCHAR(36) NOT NULL PRIMARY KEY,
  category_id VARCHAR(36) NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  minimum_stock FLOAT,
  barcode VARCHAR(255),
  stock FLOAT,
  price FLOAT,
  buying_price FLOAT,
  image_url varchar(2048),
  exp_date DATE,
  discount FLOAT,
  supplier_name VARCHAR(255),
  supplier_contact VARCHAR(255),
  status BOOL NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

CREATE TRIGGER before_insert_items
BEFORE INSERT ON items
FOR EACH ROW
SET NEW.item_id = UUID();


-- --trigger to set category status to false when branch status is set to false
-- CREATE TRIGGER before_update_branch
-- BEFORE UPDATE ON business_branch
-- FOR EACH ROW
-- BEGIN
--   IF NEW.status = false THEN
--     UPDATE categories SET status = false WHERE branch_id = NEW.branch_id;
--   END IF;
-- END;

-- --trigger to delete all items in a category when the category status is set to false
-- CREATE TRIGGER before_update_categories
-- BEFORE UPDATE ON categories
-- FOR EACH ROW  
-- BEGIN
--   IF NEW.status = false THEN
--     DELETE FROM items WHERE category_id = NEW.category_id;
--   END IF;
-- END;


CREATE TABLE bill_items (
  bill_id INT NOT NULL,
  item_id VARCHAR(36) NOT NULL,
  quantity INT NOT NULL,
  PRIMARY KEY (bill_id, item_id),
  FOREIGN KEY (bill_id) REFERENCES bill(bill_id),
  FOREIGN KEY (item_id) REFERENCES items(item_id)
);

-- Insert data into business table
INSERT INTO business (business_name, business_mail, business_url, business_hotline, business_description, business_address, business_owner_name, business_owner_mail, business_owner_phone, business_owner_address, business_owner_birthday, business_owner_photo_url, business_password, logo_url, business_registration_number, business_type, business_registration_date, status)
VALUES 
('Lassana Flora', 'owner1@example.com', 'https://firebasestorage.googleapis.com/v0/b/pointmaster-79d9a.appspot.com/o/business-logos%2Fabstract-dark-purple-gradient-background-perfect-for-promotion-presentation-wallpaper-design-etc-vector.jpg?alt=media&token=861697d8-9991-47b3-8a49-df5fc71f0fe7', '123456789', 'A description of business 1', '123 Business St, City, Country', 'Owner 1', 'owner1@example.com', 0222222222, '123 Owner St, City, Country', '1990-01-01', 'https://example.com/owner1.jpg', '$2a$10$AEmY09NKHS4b3LtFayfXreUSlZ3h6WaErKlOT5wxYIblCpGtxGEEy','logo1.png', 'BRN123456', 'Retail', '2023-01-01', true),
('Perera & Sons', 'owner2@example.com', 'http://examplebusiness2.com', '987654321', 'A description of business 2', '456 Market Rd, City, Country', 'Owner 2', 'owner2@example.com', 0333333333, '456 Owner St, City, Country', '1995-05-15', 'https://example.com/owner2.jpg', '$2a$10$AEmY09NKHS4b3LtFayfXreUSlZ3h6WaErKlOT5wxYIblCpGtxGEEy','https://firebasestorage.googleapis.com/v0/b/pointmaster-79d9a.appspot.com/o/business-logos%2Fabstract-dark-purple-gradient-background-perfect-for-promotion-presentation-wallpaper-design-etc-vector.jpg?alt=media&token=861697d8-9991-47b3-8a49-df5fc71f0fe7', 'BRN654321', 'Food & Beverage', '2023-02-01', true);

-- Insert data into business_branch table
INSERT INTO business_branch (business_id, branch_name, branch_location, status)
VALUES 
((SELECT business_id FROM business WHERE business_mail = 'owner1@example.com'), 'Branch 1', 'Downtown', true),
((SELECT business_id FROM business WHERE business_mail = 'owner2@example.com'), 'Branch 2', 'Uptown', true);

-- Insert data into employee table
INSERT INTO employee (branch_id, employee_name, role, salary, photo_url, status, employee_email, password , phone , employee_address, birthday)
VALUES 
((SELECT branch_id FROM business_branch WHERE branch_name = 'Branch 1'), 'Employee 1', 'Cashier', 3000, 'employee1.png', true, 'john.doe@example.com', '$2a$12$YiVwORUpdUpZQSK5nbAf5uLoc3quatyJX1d4gjmFKe.QftSYFOelW', '123456789', '123 Employee St, City, Country', '1995-01-01'),
((SELECT branch_id FROM business_branch WHERE branch_name = 'Branch 2'), 'Employee 2', 'Sales', 3500, 'employee2.png', true, 'joane.doe@example.com', 'hashedpassword4', '987654321', '456 Employee St, City, Country', '1990-05-15');

-- Insert data into loyalty_programs table
INSERT INTO loyalty_programs (business_id, loyalty_program_name, points_per_hundred, redeem_value, by_sales, minimum_eligibility_value, start_date)
VALUES 
((SELECT business_id FROM business WHERE business_mail = 'owner1@example.com'), 'Loyalty Program 1', 10, 0.1, true, 100, '2024-01-01'),
((SELECT business_id FROM business WHERE business_mail = 'owner2@example.com'), 'Loyalty Program 2', 15, 0.15, true, 150, '2024-02-01');

-- Insert data into customer table
INSERT INTO customer (customer_name, photo_url, customer_mail, customer_phone, birthday, gender, password)
VALUES 
('John Doe', 'https://firebasestorage.googleapis.com/v0/b/pointmaster-79d9a.appspot.com/o/business-logos%2Fabstract-dark-purple-gradient-background-perfect-for-promotion-presentation-wallpaper-design-etc-vector.jpg?alt=media&token=861697d8-9991-47b3-8a49-df5fc71f0fe7', 'john.doe@example.com', '123456789', '1990-01-01', 'Male', '$2a$12$YiVwORUpdUpZQSK5nbAf5uLoc3quatyJX1d4gjmFKe.QftSYFOelW'),
('Jane Smith', 'https://firebasestorage.googleapis.com/v0/b/pointmaster-79d9a.appspot.com/o/business-logos%2Fabstract-dark-purple-gradient-background-perfect-for-promotion-presentation-wallpaper-design-etc-vector.jpg?alt=media&token=861697d8-9991-47b3-8a49-df5fc71f0fe7','jane.smith@example.com', '987654321', '1985-05-15', 'Female', 'hashedpassword456');

-- -- Insert data into bill table
-- INSERT INTO bill (branch_id, employee_id, payment_method, total_price, received, status, notes, date_time, customer_id)
-- VALUES 
-- ((SELECT branch_id FROM business_branch WHERE branch_name = 'Branch 1'), (SELECT employee_id FROM employee WHERE employee_name = 'Employee 1'), 'Credit Card', 100.5, 100.5, true, 'First purchase', '2024-08-01 10:00:00', (SELECT customer_id FROM customer WHERE customer_name = 'John Doe')),
-- ((SELECT branch_id FROM business_branch WHERE branch_name = 'Branch 2'), (SELECT employee_id FROM employee WHERE employee_name = 'Employee 2'), 'Cash', 200.0, 200.0, true, 'Second purchase', '2024-08-02 14:30:00', (SELECT customer_id FROM customer WHERE customer_name = 'Jane Smith'));

-- Insert data into work_time table
INSERT INTO work_time (employee_id, in_time, out_time)
VALUES 
((SELECT employee_id FROM employee WHERE employee_name = 'Employee 1'), '2024-08-01 09:00:00', '2024-08-01 17:00:00'),
((SELECT employee_id FROM employee WHERE employee_name = 'Employee 2'), '2024-08-02 10:00:00', '2024-08-02 18:00:00');

-- Insert data into customer_loyalty table
INSERT INTO customer_loyalty (customer_id, loyalty_program_id, start_date, points)
VALUES 
((SELECT customer_id FROM customer WHERE customer_name = 'John Doe'), (SELECT loyalty_program_id FROM loyalty_programs WHERE loyalty_program_name = 'Loyalty Program 1'), '2024-08-01', 50),
((SELECT customer_id FROM customer WHERE customer_name = 'Jane Smith'), (SELECT loyalty_program_id FROM loyalty_programs WHERE loyalty_program_name = 'Loyalty Program 2'), '2024-08-02', 75);

-- Insert data into categories table
INSERT INTO categories (branch_id, category_name, category_location, status)
VALUES 
((SELECT branch_id FROM business_branch WHERE branch_name = 'Branch 1'), 'Electronics', 'Aisle 1', true),
((SELECT branch_id FROM business_branch WHERE branch_name = 'Branch 1'), 'Clothing', 'Aisle 2', true);

-- Insert data into items table
INSERT INTO items (category_id, item_name, minimum_stock, barcode, stock, price, buying_price, image_url, exp_date, discount, supplier_name, supplier_contact, status)
VALUES 
((SELECT category_id FROM categories WHERE category_name = 'Electronics'), 'Laptop', 10, '123456789012', 50, 10030,40 ,'https://firebasestorage.googleapis.com/v0/b/pointmaster-79d9a.appspot.com/o/business-logos%2Fabstract-dark-purple-gradient-background-perfect-for-promotion-presentation-wallpaper-design-etc-vector.jpg?alt=media&token=861697d8-9991-47b3-8a49-df5fc71f0fe7', '2023-12-31', 10, 'Supplier 1', '123456789', true),
((SELECT category_id FROM categories WHERE category_name = 'Clothing'), 'T-Shirt', 20, '987654321098', 100, 10000, 400,'tshirt.png', '2024-08-31', 5, 'Supplier 2', '987654321', true);

-- Insert data into bill_items table
-- INSERT INTO bill_items (bill_id, item_id, quantity)
-- VALUES 
-- ((SELECT bill_id FROM bill WHERE notes = 'First purchase'), (SELECT item_id FROM items WHERE item_name = 'Laptop'), 1),
-- ((SELECT bill_id FROM bill WHERE notes = 'Second purchase'), (SELECT item_id FROM items WHERE item_name = 'T-Shirt'));
