# GraphQL with MongoDB Example

A GraphQL API built with Node.js, TypeScript, Apollo Server 4, Express, and MongoDB. This project demonstrates full CRUD operations with persistent data storage, proper error handling, and graceful shutdown mechanisms.

## Instructions

At the root of the project, create an **.env** file with the following:

```
MONGODB_URI="mongodb+srv://<USERNAME>:<PASSWORD>@<HOST>/?appName=devrel-graphql"
DB_NAME="graphql_example"
PORT=3000
```

You could also just rename the **.env.example** file that was provided as a sample.

You can find the `MONGODB_URI` from within the [MongoDB Atlas Dashboard](https://cloud.mongodb.com).

When this is done, navigate to the root of the project from the command line and execute the following commands:

```
npm install
npm run build
npm run start
```

The above commands will install the dependencies, build the project, and start serving it on port 3000. You can interact with the API from your GraphQL client of choice.

## Author

[Nic Raboy](https://nraboy.com)

## License

ISC

