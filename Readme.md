<body>
    <h1>Smart POS Server Configuration</h1>

<div align = "center">
    <img src="https://github.com/user-attachments/assets/31ad211f-fd99-4ef8-bb98-50261317dc95" />
</div>





<h2>Table of Contents</h2>
<ul>
    <li><a href="#overview">Overview</a></li>
    <li><a href="#docker-setup">Docker Setup</a></li>
    <ul>
        <li><a href="#services">Services</a></li>
        <li><a href="#configuration">Configuration</a></li>
    </ul>
    <li><a href="#starting-docker">Starting Docker</a></li>
    <li><a href="#managing-services">Managing Services</a></li>
    <li><a href="#troubleshooting">Troubleshooting</a></li>
    <li><a href="#swagger-intro">Introduction Swagger</a></li>
    <li><a href="#how-swagger-work">How to Access End Points Using Swagger</a>
    <li><a href="#license">License</a></li>
    
</ul>

<h2 id="overview">Overview</h2>
<p>The Smart POS system leverages Docker Compose to manage and orchestrate multiple microservices alongside a MySQL database. This setup ensures a streamlined and modular architecture, facilitating ease of development, testing, and deployment.</p>

<h2 id="docker-setup">Docker Setup</h2>

<h3 id="services">Services</h3>
<p>The system is composed of the following services:</p>
<ul>
    <li><strong>MySQL Database:</strong> Manages the data for the Smart POS system.</li>
    <li><strong>Admin Service:</strong> Handles administrative functions.</li>
    <li><strong>Auth Service:</strong> Manages authentication and authorization.</li>
    <li><strong>Cashier Service:</strong> Manages cashier-related operations.</li>
    <li><strong>Customer Service:</strong> Handles customer interactions and functionalities.</li>
</ul>

<h3 id="configuration">Configuration</h3>
<p>The Docker Compose file defines the following configuration:</p>
<pre><code>
version: '3.8'

services:
  db:
    image: mysql
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: pointmaster
    ports:
      - "3308:3306"
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
</code></pre>

<h2 id="starting-docker">Starting Docker</h2>
<p>Follow these steps to get Docker up and running:</p>
<ol>
    <li><strong>Install Docker:</strong> Download Docker Desktop from <a href="https://www.docker.com/products/docker-desktop" target="_blank">Docker's official website</a> and follow the installation instructions for your operating system.</li>
    <li><strong>Install Docker Compose:</strong> Docker Compose is bundled with Docker Desktop. If you're using a different installation, follow the instructions at <a href="https://docs.docker.com/compose/install/" target="_blank">Docker Compose Installation</a>.</li>
    <li><strong>Verify Installation:</strong> Open a terminal and check the installation by running:
        <pre><code>docker --version
docker-compose --version</code></pre>
        </li>
        <li><strong>Start Docker:</strong> Launch Docker Desktop to start the Docker engine.</li>
    </ol>

<h2 id="managing-services">Managing Services</h2>
<p>To manage the services, use Docker Compose commands:</p>
<ul>
    <li><strong>Start Services:</strong> To start all services, run:
        <pre><code>docker-compose up</code></pre>
    </li>
    <li><strong>Rebuild Services:</strong> If you make changes to the services, rebuild them with:
        <pre><code>docker-compose up --build</code></pre>
    </li>
    <li><strong>Restart Services:</strong> To restart all services, use:
        <pre><code>docker-compose restart</code></pre>
    </li>
    <li><strong>Stop Services:</strong> To stop all services, run:
        <pre><code>docker-compose down</code></pre>
    </li>
</ul>

<p>When all services are running it will be shown like this:</p>
<div align= "center">
 <img width="1428" alt="Screenshot 2024-09-15 at 17 43 44" src="https://github.com/user-attachments/assets/bd9d4d74-aba7-4be7-bf37-b71d84df972b">
</div>

<div>
<img width="899" alt="Screenshot 2024-09-15 at 17 45 46" src="https://github.com/user-attachments/assets/ea7a1cac-2053-4d74-9170-f3eab72c2495">
</div>
<h2 id="troubleshooting">Troubleshooting</h2>
<p>If you encounter issues:</p>
<ul>
    <li><strong>Check Logs:</strong> View logs for a specific service to diagnose problems:
        <pre><code>docker-compose logs [service-name]</code></pre>
    </li>
    <li><strong>Verify Configuration:</strong> Ensure your <code>docker-compose.yml</code> file is correctly configured and all necessary environment variables are set.</li>
    <li><strong>Restart Docker:</strong> Sometimes, restarting Docker Desktop can resolve issues.</li>
</ul>

<h2 id= "#swagger-intro">Introduction to Swagger</h2>
<p>Swagger is a powerful tool for designing, building, documenting, and consuming RESTful APIs. It provides a standardized way to describe your API's endpoints, methods, and data models. With Swagger, you can generate interactive API documentation that allows developers to understand and test the API directly from the documentation.</p>

<p>Key benefits of using Swagger include:</p>
<ul>
    <li><strong>Interactive Documentation:</strong> Users can interact with the API directly from the documentation, making it easier to understand and test the API.</li>
    <li><strong>Code Generation:</strong> Swagger can generate client libraries, server stubs, and API documentation in various programming languages.</li>
    <li><strong>Standardized API Description:</strong> Swagger uses a standardized format (OpenAPI Specification) to describe APIs, making it easier to share and understand API specifications.</li>
</ul>

<p>For more information, visit the <a href="https://swagger.io/" target="_blank">Swagger official website</a>.</p>

<h2 id="how-swagger-work">Accessing Endpoints Using Swagger</h2>
<p>Swagger provides an interactive interface to explore and interact with your API endpoints. Here’s how you can use Swagger to access and test your API endpoints:</p>

<ol>
    <li><strong>Open the Swagger UI:</strong> Navigate to the URL where Swagger UI is hosted. This is typically served from the <code>/api-docs</code> path of your application. For example:
        <pre><code>http://localhost:3002/api-docs</code></pre>
    </li>
    <img width="1440" alt="Screenshot 2024-09-15 at 18 00 18" src="https://github.com/user-attachments/assets/302d44d3-2133-4414-bdaf-225e38757ff3">

 <li><strong>Explore the API Documentation:</strong> The Swagger UI will display a list of available API endpoints organized by their categories. You can expand each category to view the detailed documentation of the endpoints, including descriptions, request parameters, and response formats.</li>
    
<li><strong>Interact with Endpoints:</strong> To test an endpoint, follow these steps:
    <ul>
        <li>Select the endpoint you want to test from the list.</li>
        <li>Click on the endpoint to expand it and view its details.</li>
        <li>Enter any required parameters or request body in the provided fields.</li>
        <li>Click the <strong>Execute</strong> button to send the request to the server.</li>
    </ul>
</li>

<li><strong>View Response:</strong> After executing the request, Swagger UI will display the response from the server, including the status code, response headers, and the response body. This allows you to verify that the endpoint behaves as expected.</li>
</ol>

<p>Using Swagger UI makes it easy to understand and test your API endpoints interactively, helping you ensure that your API works correctly and is well-documented.</p>

<h2 id="license">License</h2>
<p>This project is licensed under the MIT License. See the <a href="LICENSE">LICENSE</a> file for more details.</p>
</body>
