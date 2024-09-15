
   <h1>Pointmaster System Overview</h1>
    
   <p><strong>Pointmaster</strong> is a comprehensive Point of Sale (POS) system designed to manage various aspects of retail operations. It includes a range of services to handle different functionalities, from customer management to inventory control.</p>

   <h2>System Architecture</h2>
   <p>The Pointmaster system is built using a microservices architecture, allowing for modular development and deployment. The core components of the system include:</p>
   <ul>
       <li><strong>Database Service:</strong> Manages data storage and retrieval using MySQL.</li>
       <li><strong>Admin Service:</strong> Handles administrative tasks and interfaces.</li>
       <li><strong>Authentication Service:</strong> Manages user authentication and authorization.</li>
       <li><strong>Cashier Service:</strong> Manages transactions and cashier operations.</li>
       <li><strong>Customer Service:</strong> Manages customer interactions and loyalty programs.</li>
   </ul>

   <h2>Docker Setup</h2>
   <p>The system is containerized using Docker, which simplifies deployment and ensures consistency across different environments. Below is the Docker Compose configuration used to set up the various services:</p>
   
   <h3>Docker Compose Configuration</h3>
   <pre>
   <code>
   version: '3.8'

   services:
     db:
       image: mysql
       environment:
         MYSQL_ROOT_PASSWORD: password
         MYSQL_DATABASE: pointmaster
       ports:
         - "3308:3306"  # External port 3308, internal port 3306
       restart: always

  admin-service:
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

   auth-service:
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

   cashier-service:
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

   customer-service:
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

   <h3>Service Descriptions</h3>
   <h4>Database Service (db)</h4>
   <p>Uses the MySQL image to provide the database backend. It stores all the data related to the POS system, including transaction records, inventory data, and customer information.</p>

   <h4>Admin Service (admin-service)</h4>
   <p>Handles administrative functionalities such as user management, system settings, and configuration. It is built from the <code>./admin-service</code> directory.</p>

   <h4>Authentication Service (auth-service)</h4>
   <p>Manages authentication and authorization, providing secure access to the system. It is built from the <code>./auth-service</code> directory.</p>

   <h4>Cashier Service (cashier-service)</h4>
   <p>Handles all cashier-related operations, including transactions, bill processing, and receipt generation. It is built from the <code>./cashier-service</code> directory.</p>

   <h4>Customer Service (customer-service)</h4>
   <p>Manages customer interactions, loyalty programs, and account details. It is built from the <code>./customer-service</code> directory.</p>

   <h2>Configuration Notes</h2>
   <ul>
       <li>Ensure the MySQL port is correctly mapped to avoid conflicts with other services.</li>
       <li>Verify the environment variables for each service to ensure they correctly reference the database service.</li>
       <li>Utilize the <code>depends_on</code> directive to ensure proper startup order of services.</li>
   </ul>

   <h2>Usage</h2>
   <p>To start the services, use the following command:</p>
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

   <h2>Additional Resources</h2>
   <p>For more information on Docker Compose and managing containers, refer to the <a href="https://docs.docker.com/compose/">official documentation</a>.</p>

