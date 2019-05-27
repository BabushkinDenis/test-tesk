## System requirements
You should install:

- **node.js**: no less then 5.3.0 
- **npm**
- **MySQL** 

## installation instructions
To start the test task you need
- install nodejs npm and MySQl Server
- create database and tables using **test.sql** file in root directory
- change access rights in file : /config/dbConfig.js to yor MySql Server
- in root directory execute the command **npm install**
- execute the command **npm run build**
- start the server **npm run server** please sure that the port 3001 and 3002 are free
- open your browser at **http://localhost:3001**

## Available Scripts

In the project directory, you can run:

### `npm dev`

Runs the app in the development mode.<br>

### `npm test`

Launches the test runner <br>
Now project has one simple test.

### `npm run build`

Builds the app for production to the `build` folder.<br>
