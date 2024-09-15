<body>
    <h1>Smart POS Server Configuration</h1>
<div items = "center" >
<img src = "https://github.com/user-attachments/assets/21476550-9936-4b9c-81f6-f26e5857f97c" />
</div>
 <h2>Table of Contents</h2>
 <ul>
     <li><a href="#overview">Overview</a></li>
     <li><a href="#docker-setup">Docker Setup</a></li>
     <ul>
         <li><a href="#mysql-database">MySQL Database</a></li>
         <li><a href="#admin-service">Admin Service</a></li>
         <li><a href="#auth-service">Auth Service</a></li>
         <li><a href="#cashier-service">Cashier Service</a></li>
         <li><a href="#customer-service">Customer Service</a></li>
     </ul>
     <li><a href="#how-to-restart-services">How to Restart Services</a></li>
     <li><a href="#usage">Usage</a></li>
     <li><a href="#contributing">Contributing</a></li>
     <li><a href="#license">License</a></li>
 </ul>

 <h2 id="overview">Overview</h2>
 <p>The Smart POS system uses Docker Compose to orchestrate several microservices and a MySQL database. This setup enables easy management of services, allowing them to interact seamlessly while being isolated in separate containers.</p>

 <h2 id="docker-setup">Docker Setup</h2>

 <h3 id="mysql-database">MySQL Database</h3>
 <p>The MySQL database is configured to manage data for the Smart POS system. It listens on port 3308 externally and maps to port 3306 internally within the Docker network.</p>

 <h3 id="admin-service">Admin Service</h3>
 <p>The Admin Service handles administrative tasks and is built from the <code>./admin-service</code> directory. It listens on port 3001 and connects to the MySQL database.</p>

 <h3 id="auth-service">Auth Service</h3>
 <p>The Auth Service manages authentication and is built from the <code>./auth-service</code> directory. It listens on port 3002 and also connects to the MySQL database.</p>

 <h3 id="cashier-service">Cashier Service</h3>
 <p>The Cashier Service manages cashier operations and is built from the <code>./cashier-service</code> directory. It listens on port 3003 and connects to the MySQL database.</p>

 <h3 id="customer-service">Customer Service</h3>
 <p>The Customer Service handles customer interactions and is built from the <code>./customer-service</code> directory. It listens on port 3004 and connects to the MySQL database.</p>

 <h2 id="how-to-restart-services">How to Restart Services</h2>
 <p>To restart the services, use the following Docker Compose command:</p>
 <pre><code>docker-compose restart</code></pre>
 <p>This will restart all services defined in the <code>docker-compose.yml</code> file. For a complete restart, you can stop and then start the services using:</p>
 <pre><code>docker-compose down
docker-compose up</code></pre>

 <h2 id="usage">Usage</h2>
 <p>To start all services defined in the <code>docker-compose.yml</code> file, run:</p>
 <pre><code>docker-compose up</code></pre>
 <p>To rebuild the services if you make changes, use:</p>
 <pre><code>docker-compose up --build</code></pre>

 <h2 id="contributing">Contributing</h2>
 <p>Contributions to the Smart POS project are welcome. Please open an issue or submit a pull request to improve the setup or functionality.</p>

 <h2 id="license">License</h2>
 <p>This project is licensed under the MIT License. See the <a href="LICENSE">LICENSE</a> file for details.</p>
</body>
