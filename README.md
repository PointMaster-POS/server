# PointMaster Services
<div>
This project includes multiple services for the PointMaster system, built with Node.js and MySQL, and containerized using Docker. Docker Compose is used to orchestrate and manage these services.
</div>
![P](https://github.com/user-attachments/assets/69ef0349-09d8-4085-a87a-8cfcd8f69852)
<p align="center">
  <a href="https://badge.fury.io/js/electron-markdownify">
    

  </a>
  <a href="https://gitter.im/amitmerchant1990/electron-markdownify"><img src="https://badges.gitter.im/amitmerchant1990/electron-markdownify.svg"></a>
  <a href="https://saythanks.io/to/bullredeyes@gmail.com">
      <img src="https://img.shields.io/badge/SayThanks.io-%E2%98%BC-1EAEDB.svg">
  </a>
  <a href="https://www.paypal.me/AmitMerchant">
    <img src="https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&amp;style=flat">
  </a>
</p>


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
```
then you can see four services and one database folders
<img width="321" alt="Screenshot 2024-09-15 at 16 18 06" src="https://github.com/user-attachments/assets/53f075b4-ea6f-470c-b56a-13881224d1f0">

##service-details

###Service Details

##db

#Image: mysql
#Ports: Exposes port 3306
#Environment Variables:
MYSQL_ROOT_PASSWORD: Password for the root user
MYSQL_DATABASE: Database name to create
admin-service
Build Context: ./admin-service
Ports: 3001:3001
Environment Variables:
ACCESS_TOKEN_SECRET: Secret key for token encryption
DB_HOST: Hostname for the database
DB_PORT: Port for the database
DB_USER: Database user
DB_PASSWORD: Database password
DB_NAME: Database name
auth-service
Build Context: ./auth-service
Ports: 3002:3002
Environment Variables:
Same as admin-service
cashier-service
Build Context: ./cashier-service
Ports: 3003:3003
Environment Variables:
Same as admin-service
customer-service
Build Context: ./customer-service
Ports: 3004:3004
Environment Variables:
Same as admin-service




