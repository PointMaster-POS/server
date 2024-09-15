PointMaster Services
This project contains multiple services built with Node.js and MySQL for the PointMaster system. Each service (Admin, Auth, Cashier, Customer) is containerized using Docker and orchestrated with Docker Compose.

Prerequisites
Before running this project, ensure that you have the following installed:

Docker
Docker Compose
Setup Instructions
Step 1: Clone the Repository
Clone the repository to your local machine:

bash
Copy code
git clone <repository-url>
cd <repository-directory>
Step 2: Set Up Environment Variables
Ensure the environment variables in docker-compose.yml are properly set. The required environment variables for each service are:

ACCESS_TOKEN_SECRET: Secret key used for token encryption.
DB_HOST: Hostname for the MySQL database (db is the Docker service name).
DB_PORT: Port number for the MySQL database (typically 3306).
DB_USER: MySQL user (default: root).
DB_PASSWORD: MySQL password (default: password).
DB_NAME: MySQL database name (default: pointmaster).
Step 3: Build and Run the Services
To build and start the services using Docker Compose, run:

bash
Copy code
docker-compose up --build
This will start all services defined in the docker-compose.yml file:

db: MySQL database service.
admin-service: Node.js service for the admin features.
auth-service: Node.js service for authentication.
cashier-service: Node.js service for cashier functionalities.
customer-service: Node.js service for customer-related features.
Step 4: Access the Services
After the services are running, you can access the individual services on their respective ports:

Admin Service: http://localhost:3001
Auth Service: http://localhost:3002
Cashier Service: http://localhost:3003
Customer Service: http://localhost:3004
The MySQL database will be accessible on port 3308 (mapped from 3306 inside the container).

Step 5: Restart Policies
Each service has a restart policy set to on-failure, meaning the service will automatically restart if it crashes.

You can also manually restart any service using:

bash
Copy code
docker-compose restart <service-name>
For example, to restart the auth-service:

bash
Copy code
docker-compose restart auth-service
Step 6: Stop the Services
To stop all services, run:

bash
Copy code
docker-compose down
This will stop and remove all containers, networks, and volumes created by Docker Compose.

Troubleshooting
MySQL Initialization: Ensure that the db.sql file is properly placed in the ./db.sql directory so that the MySQL service can initialize the database with the provided schema.

Service Errors: Check the logs for any service using:

bash
Copy code
docker-compose logs <service-name>
Network Issues: If services cannot connect to the database, verify that DB_HOST is set to db, which is the service name for the MySQL container in Docker Compose.

Additional Commands
Build without starting:

bash
Copy code
docker-compose build
Start services in the background:

bash
Copy code
docker-compose up -d
