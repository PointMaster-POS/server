Certainly! Here is a full README.md file formatted for your Docker Compose setup:

markdown
Copy code
# PointMaster Services

This project includes multiple services for the PointMaster system, built with Node.js and MySQL, and containerized using Docker. Docker Compose is used to orchestrate and manage these services.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Service Details](#service-details)
- [Restart Policies](#restart-policies)
- [Additional Commands](#additional-commands)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before running this project, ensure that you have the following installed:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Setup Instructions

### Step 1: Clone the Repository

Clone the repository to your local machine:

```bash
git clone <repository-url>
cd <repository-directory>
Step 2: Set Up Environment Variables
Ensure the environment variables in docker-compose.yml are properly set. These variables include:

ACCESS_TOKEN_SECRET: Secret key used for token encryption.
DB_HOST: Hostname for the MySQL database (db is the Docker service name).
DB_PORT: Port number for the MySQL database (3306 is the default).
DB_USER: MySQL user (default: root).
DB_PASSWORD: MySQL password (default: password).
DB_NAME: MySQL database name (default: pointmaster).
Step 3: Build and Run the Services
To build and start the services using Docker Compose, run:

bash
Copy code
docker-compose up --build
This command will start all services defined in the docker-compose.yml file:

db: MySQL database service.
admin-service: Node.js service for administrative features.
auth-service: Node.js service for authentication.
cashier-service: Node.js service for cashier functionalities.
customer-service: Node.js service for customer-related features.
Step 4: Access the Services
After the services are running, you can access them via the following ports:

Admin Service: http://localhost:3001
Auth Service: http://localhost:3002
Cashier Service: http://localhost:3003
Customer Service: http://localhost:3004
The MySQL database will be accessible on port 3308 (mapped from 3306 inside the container).

Step 5: Restart Policies
Each service has a restart policy set to on-failure, which means the service will automatically restart if it crashes.

You can also manually restart any service using:

bash
Copy code
docker-compose restart <service-name>
For example, to restart the auth-service:

bash
Copy code
docker-compose restart auth-service
Step 6: Stop the Services
To stop and remove all services, networks, and volumes created by Docker Compose, run:

bash
Copy code
docker-compose down
Service Details
MySQL Database (db)
Image: mysql
Ports: Exposes port 3306 inside the container, mapped to port 3308 on the host.
Environment Variables:
MYSQL_ROOT_PASSWORD: Root password for MySQL.
MYSQL_DATABASE: Database name to initialize.
Admin Service (admin-service)
Build Context: ./admin-service
Ports: 3001:3001
Environment Variables:
ACCESS_TOKEN_SECRET: Secret key for token encryption.
DB_HOST: db
DB_PORT: 3306
DB_USER: root
DB_PASSWORD: password
DB_NAME: pointmaster
Restart Policy: on-failure
Auth Service (auth-service)
Build Context: ./auth-service
Ports: 3002:3002
Environment Variables: Same as admin-service
Restart Policy: on-failure
Cashier Service (cashier-service)
Build Context: ./cashier-service
Ports: 3003:3003
Environment Variables: Same as admin-service
Restart Policy: on-failure
Customer Service (customer-service)
Build Context: ./customer-service
Ports: 3004:3004
Environment Variables: Same as admin-service
Restart Policy: on-failure
Additional Commands
Build without starting:

bash
Copy code
docker-compose build
Start services in the background:

bash
Copy code
docker-compose up -d
Troubleshooting
MySQL Initialization: Verify that db.sql is correctly placed in the ./db.sql directory so that the MySQL service can initialize the database with the provided schema.

Service Errors: Check the logs for any service issues using:

bash
Copy code
docker-compose logs <service-name>
Network Issues: Ensure that DB_HOST is correctly set to db, which is the service name for the MySQL container in Docker Compose.
