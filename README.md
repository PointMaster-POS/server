<body>
    <h1>Smart POS Server Configuration</h1>

<div align = "center">
    <img src="https://github.com/user-attachments/assets/31ad211f-fd99-4ef8-bb98-50261317dc95" />
</div>

<h2>Badges</h2>
<p>
    <a href="https://www.docker.com/">
        <img src="https://img.shields.io/badge/Docker-%E2%9C%94%EF%B8%8F-blue" alt="Docker">
    </a>
    <a href="https://docs.docker.com/compose/">
        <img src="https://img.shields.io/badge/Docker%20Compose-%E2%9C%94%EF%B8%8F-blue" alt="Docker Compose">
    </a>
</p>

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

<h2 id="troubleshooting">Troubleshooting</h2>
<p>If you encounter issues:</p>
<ul>
    <li><strong>Check Logs:</strong> View logs for a specific service to diagnose problems:
        <pre><code>docker-compose logs [service-name]</code></pre>
    </li>
    <li><strong>Verify Configuration:</strong> Ensure your <code>docker-compose.yml</code> file is correctly configured and all necessary environment variables are set.</li>
    <li><strong>Restart Docker:</strong> Sometimes, restarting Docker Desktop can resolve issues.</li>
</ul>

<h2 id="license">License</h2>
<p>This project is licensed under the MIT License. See the <a href="LICENSE">LICENSE</a> file for more details.</p>
</body>
