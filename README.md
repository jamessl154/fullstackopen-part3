## part3
https://fullstackopen.com/en/part3

### Programming a server with NodeJS and Express
---
In this part, the goal was to build a RESTful API using Express that replaced the json-server used by the phonebook frontend app from part2. I learned how to set up a node-express development environment with nodemon, ESLint, and the VS Code REST Client plugin. We also learned and applied knowledge specific to express concerning the request-response cycle, logging using morgan, middleware chaining and centralized error handling. This repository contains the frontend and backend of the phonebook app. The backend in ```index.js``` serves static files from the build directory, ```app.use(express.static('build))```, that was built from the phonebook app using ```npm run build``` and then copied into this repository. After synchronizing the frontend with the backend in development modes, I then deployed the production build to heroku. We then continued to develop the app further by integrating the document database MongoDB, with the ODM Mongoose, to persist data in the route handlers of the express server.

```mongo.js``` a command-line tool that: retrieves all documents from the MongoDB 'people' collection, if 3 arguments are specified with the correct password. Or, adds a new document to the 'people' collection, if 5 arguments are specifed with  the correct password.

Live App: https://hidden-shore-67603.herokuapp.com