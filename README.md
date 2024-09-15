<div><h1>Docker Compose Setup for Pointmaster</h1>

<p>This document provides an overview of the Docker Compose setup for the Pointmaster application, which includes various services and a MySQL database.</p>
 <h2>Services</h2>
    <h3>1. Database Service (db)</h3>
    <p>This service uses the MySQL image to provide the database for the application.</p>
    <pre>
    <code>
      image: mysql
      environment:
        MYSQL_ROOT_PASSWORD: password
        MYSQL_DATABASE: pointmaster
      ports:
        - "3308:3306"  # External port 3308, internal port 3306
      restart: always
    </code>
    </pre>
    <h3>2. Admin Service (admin-service)</h3>
    <p>This service is responsible for admin functionalities and is built from the <code>./admin-service</code> directory.</p>
    <pre>
    <code>
      build:
        context: ./admin-service
        dockerfile: Dockerfile
      ports:
        - "3001:3001"
      environment:
        - ACCESS_TOKEN_SECRET=panadura
        - DB_HOST=db
        - DB_PORT=3306
        - DB_USER=root
        - DB_PASSWORD=password
        - DB_NAME=pointmaster
      depends_on:
        - db
      restart: on-failure
    </code>
    </pre>
    <h3>3. Authentication Service (auth-service)</h3>
    <p>This service handles authentication and is built from the <code>./auth-service</code> directory.</p>
    <pre>
    <code>
      build:
        context: ./auth-service
        dockerfile: Dockerfile
      ports:
        - "3002:3002"
      environment:
        - ACCESS_TOKEN_SECRET=panadura
        - DB_HOST=db
        - DB_PORT=3306
        - DB_USER=root
        - DB_PASSWORD=password
        - DB_NAME=pointmaster
      depends_on:
        - db
      restart: on-failure
    </code>
    </pre>
    <h3>4. Cashier Service (cashier-service)</h3>
    <p>This service manages cashier-related functionalities and is built from the <code>./cashier-service</code> directory.</p>
    <pre>
    <code>
      build:
        context: ./cashier-service
        dockerfile: Dockerfile
      ports:
        - "3003:3003"
      environment:
        - ACCESS_TOKEN_SECRET=panadura
        - DB_HOST=db
        - DB_PORT=3306
        - DB_USER=root
        - DB_PASSWORD=password
        - DB_NAME=pointmaster
      depends_on:
        - db
      restart: on-failure
    </code>
    </pre>
     <h3>5. Customer Service (customer-service)</h3>
    <p>This service handles customer interactions and is built from the <code>./customer-service</code> directory.</p>
    <pre>
    <code>
      build:
        context: ./customer-service
        dockerfile: Dockerfile
      ports:
        - "3004:3004"
      environment:
        - ACCESS_TOKEN_SECRET=panadura
        - DB_HOST=db
        - DB_PORT=3306
        - DB_USER=root
        - DB_PASSWORD=password
        - DB_NAME=pointmaster
      depends_on:
        - db
      restart: on-failure
    </code>
    </pre>
<h2>Configuration Notes</h2>
    <ul>
        <li>Ensure that the MySQL port is correctly mapped to avoid conflicts.</li>
        <li>Check the environment variables for each service to ensure they are correctly configured to connect to the database.</li>
        <li>The <code>depends_on</code> directive ensures that the database service starts before the other services that depend on it.</li>
    </ul>
<h2>Usage</h2>
    <p>To start the services, run the following command:</p>
    <pre>
    <code>
      docker-compose up
    </code>
    </pre>
<p>To stop the services, use:</p>
    <pre>
    <code>
      docker-compose down
    </code>
    </pre>
    
 <p>For more information on Docker Compose, refer to the <a href="https://docs.docker.com/compose/">official documentation</a>.</p>
</div>
