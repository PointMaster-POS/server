-- Insert data into business table
INSERT INTO business (business_mail, business_url, business_hotline, business_description, business_address, business_owner_name, business_owner_mail, business_password, logo_location, business_hours, business_registration_number, business_type, business_registration_date, status)
VALUES 
('owner1@example.com', 'http://examplebusiness1.com', '123456789', 'A description of business 1', '123 Business St, City, Country', 'Owner 1', 'owner1@example.com', 'hashedpassword1', 'logo1.png', '{"monday":"9:00-17:00","tuesday":"9:00-17:00"}', 'BRN123456', 'Retail', '2022-01-01', true),
('owner2@example.com', 'http://examplebusiness2.com', '987654321', 'A description of business 2', '456 Market Rd, City, Country', 'Owner 2', 'owner2@example.com', 'hashedpassword2', 'logo2.png', '{"monday":"10:00-18:00","tuesday":"10:00-18:00"}', 'BRN654321', 'Service', '2023-05-15', true);

-- Insert data into business_branch table
INSERT INTO business_branch (business_id, branch_name, branch_location, branch_manager_id, branch_manager_name, branch_manager_mail, branch_manager_password, status)
VALUES 
((SELECT business_id FROM business WHERE business_mail = 'owner1@example.com'), 'Branch 1', 'Downtown', NULL, 'Manager 1', 'manager1@example.com', 'hashedmanagerpassword1', true),
((SELECT business_id FROM business WHERE business_mail = 'owner2@example.com'), 'Branch 2', 'Uptown', NULL, 'Manager 2', 'manager2@example.com', 'hashedmanagerpassword2', true);

-- Insert data into employee table
INSERT INTO employee (branch_id, employee_name, role, salary, photo_url, status)
VALUES 
((SELECT branch_id FROM business_branch WHERE branch_name = 'Branch 1'), 'Employee 1', 'Cashier', 3000, 'employee1.png', true),
((SELECT branch_id FROM business_branch WHERE branch_name = 'Branch 2'), 'Employee 2', 'Sales', 3500, 'employee2.png', true);

-- Insert data into loyalty_programs table
INSERT INTO loyalty_programs (business_id, loyalty_program_name, points_per_hundred, redeem_value, by_sales, minimum_eligibility_value, start_date)
VALUES 
((SELECT business_id FROM business WHERE business_mail = 'owner1@example.com'), 'Loyalty Program 1', 10, 0.1, true, 100, '2024-01-01'),
((SELECT business_id FROM business WHERE business_mail = 'owner2@example.com'), 'Loyalty Program 2', 15, 0.15, true, 150, '2024-02-01');

-- Insert data into customer table
INSERT INTO customer (customer_name, customer_mail, customer_phone, birthday, gender, password)
VALUES 
('John Doe', 'john.doe@example.com', '123456789', '1990-01-01', 'Male', 'hashedpassword123'),
('Jane Smith', 'jane.smith@example.com', '987654321', '1985-05-15', 'Female', 'hashedpassword456');

-- Insert data into bill table
INSERT INTO bill (branch_id, employee_id, payment_method, total_price, received, status, notes, date_time, customer_id)
VALUES 
((SELECT branch_id FROM business_branch WHERE branch_name = 'Branch 1'), (SELECT employee_id FROM employee WHERE employee_name = 'Employee 1'), 'Credit Card', 100.5, 100.5, true, 'First purchase', '2024-08-01 10:00:00', (SELECT customer_id FROM customer WHERE customer_name = 'John Doe')),
((SELECT branch_id FROM business_branch WHERE branch_name = 'Branch 2'), (SELECT employee_id FROM employee WHERE employee_name = 'Employee 2'), 'Cash', 200.0, 200.0, true, 'Second purchase', '2024-08-02 14:30:00', (SELECT customer_id FROM customer WHERE customer_name = 'Jane Smith'));

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
INSERT INTO categories (branch_id, category_name, category_location)
VALUES 
((SELECT branch_id FROM business_branch WHERE branch_name = 'Branch 1'), 'Electronics', 'Aisle 1'),
((SELECT branch_id FROM business_branch WHERE branch_name = 'Branch 2'), 'Clothing', 'Aisle 2');

-- Insert data into items table
INSERT INTO items (category_id, item_name, minimum_stock, barcode, stock, image_url, exp_date, discount, supplier_name)
VALUES 
((SELECT category_id FROM categories WHERE category_name = 'Electronics'), 'Laptop', 10, '123456789012', 50, 'laptop.png', '2025-12-31', 10, 'Supplier 1'),
((SELECT category_id FROM categories WHERE category_name = 'Clothing'), 'T-Shirt', 20, '987654321098', 100, 'tshirt.png', '2024-08-31', 5, 'Supplier 2');

-- Insert data into bill_items table
INSERT INTO bill_items (bill_id, item_id, quantity)
VALUES 
((SELECT bill_id FROM bill WHERE notes = 'First purchase'), (SELECT item_id FROM items WHERE item_name = 'Laptop'), 1),
((SELECT bill_id FROM bill WHERE notes = 'Second purchase'), (SELECT item_id FROM items WHERE item_name = 'T-Shirt'), 2);
