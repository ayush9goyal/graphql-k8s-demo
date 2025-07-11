# graphql-k8s-demo

A demo GraphQL application showcasing deployment on Kubernetes and Render, backed by MongoDB and Apollo Server.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Running Locally](#running-locally)
5. [Deploying on Render](#deploying-on-render)
6. [Usage Examples](#usage-examples)
7. [Tools & Technologies](#tools--technologies)
8. [Summary](#summary)

---

## Overview

`graphql-k8s-demo` is a Node.js & Apollo Server GraphQL application, backed by MongoDB, containerized with Docker, and deployed on Kubernetes via Render.com. It demonstrates end-to-end setup of a production-like GraphQL service on the cloud.

## What is GraphQL?

GraphQL is an open-source data query and manipulation language for APIs, along with a runtime for fulfilling queries with your existing data. Unlike traditional REST APIs, where servers expose multiple endpoints and define the shape of the returned data, GraphQL exposes a single endpoint through which clients specify exactly what data they need. This approach minimizes over-fetching and under-fetching, providing more efficient and flexible data retrieval.

### How GraphQL is used in this project

In this demo, I define a GraphQL schema using Apollo Server that models types like `User` and operations such as queries (`hello`, `users`) and mutations (`createUser`). When a client issues a GraphQL request—via the GraphQL Playground or an HTTP POST to `/graphql`—Apollo Server resolves each field by fetching or modifying data in MongoDB and returns a JSON response containing only the requested fields.

## GraphQL vs REST APIs

| Feature                 | GraphQL                                                | REST                                                    |
| ----------------------- | ------------------------------------------------------ | ------------------------------------------------------- |
| Endpoint structure      | Single endpoint (e.g., `/graphql`)                     | Multiple endpoints (e.g., `/users`, `/posts`)           |
| Data fetching           | Clients request exactly what they need                 | Server-defined responses; may over-fetch or under-fetch |
| Versioning              | No explicit versioning; schema evolves with new fields | Often versioned in URLs or headers (`/v1/users`)        |
| Performance             | Single request for nested resources                    | Multiple round trips for nested or related data         |
| Tooling & introspection | Built-in introspection and playground UI               | Relies on external docs (Swagger/OpenAPI)               |

---

`graphql-k8s-demo` is a Node.js & Apollo Server GraphQL application, backed by MongoDB, containerized with Docker, and deployed on Kubernetes via Render.com. It demonstrates end-to-end setup of a production‑like GraphQL service on the cloud.

---

## Prerequisites

* **Node.js** (v14+)
* **Docker** (v20+)
* **kubectl** CLI
* **Render account** (free tier supported)
* **MongoDB Atlas** or local instance (connection URI)

---

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/graphql-k8s-demo.git
   cd graphql-k8s-demo
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   * Create a `.env` file in the project root:

     ```env
     MONGODB_URI=<your-mongo-uri>
     PORT=4000
     ```

---

## Running Locally

1. **Start the server**

   ```bash
   npm start
   ```

2. **Access GraphQL Playground** Open your browser at:

   ```
   http://localhost:4000/graphql
   ```

3. **Example Queries**

   * **Hello World**

     ```graphql
     query {
       hello
     }
     ```

   * **List Users**

     ```graphql
     query {
       users {
         id
         name
         email
       }
     }
     ```

   * **Create a User**

     ```graphql
     mutation {
       createUser(name: "Alice", email: "alice@example.com") {
         id
         name
         email
       }
     }
     ```

4. **cURL Example**

   ```bash
   curl -X POST http://localhost:4000/graphql \
     -H 'Content-Type: application/json' \
     -d '{"query":"{ hello }"}'
   ```

---

## Deploying on Render

1. **Connect GitHub repo** to your Render account.
2. **Create a new Web Service**

   * **Environment**: Node
   * **Build Command**: `npm install && npm run build`
   * **Start Command**: `npm start`
   * **Env Vars**: Add `MONGODB_URI` and `PORT=4000`
3. **Automatic Deploys** on each push to `main` branch.
4. **Verify** deployment at your Render URL (e.g. `https://graphql-k8s-demo.onrender.com/graphql`).

---

## Usage Examples

After deployment, use the same queries against your Render URL. For example:

```bash
curl -X POST https://studio.apollographql.com/sandbox/explorer \
  -H 'Content-Type: application/json' \
  -d '{"query":"{ users { id name } }"}'
```

Or via Playground:

```
https://studio.apollographql.com/sandbox/explorer
```

---

## Tools & Technologies

| Tool                   | Purpose                            | Docs & Learning                                                                                      | Used By                          |
| ---------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------- |
| **Node.js**            | JavaScript runtime                 | [https://nodejs.org/docs](https://nodejs.org/docs)                                                   | Netflix, Walmart, PayPal         |
| **Apollo Server**      | GraphQL server framework           | [https://www.apollographql.com/docs/apollo-server](https://www.apollographql.com/docs/apollo-server) | Airbnb, Twitter, Expedia         |
| **GraphQL**            | API query language                 | [https://graphql.org/learn/](https://graphql.org/learn/)                                             | GitHub, Shopify, Facebook        |
| **MongoDB**            | NoSQL document database            | [https://docs.mongodb.com/](https://docs.mongodb.com/)                                               | Uber, eBay, Adobe                |
| **Docker**             | Containerization                   | [https://docs.docker.com/](https://docs.docker.com/)                                                 | PayPal, ADP, Spotify             |
| **Kubernetes**         | Container orchestration            | [https://kubernetes.io/docs](https://kubernetes.io/docs)                                             | Google, Spotify, CERN            |
| **Render**             | Cloud hosting & managed Kubernetes | [https://render.com/docs](https://render.com/docs)                                                   | Basecamp, Figma, Asana           |
| **GraphQL Playground** | Interactive API explorer           | [https://github.com/graphql/graphql-playground](https://github.com/graphql/graphql-playground)       | Used widely in GraphQL community |

---

## Summary

This project demonstrates a full-stack GraphQL service, from schema design to cloud deployment. It covers local development, containerization, Kubernetes orchestration, and managed cloud hosting on Render.

---

*/Feel free to open issues or contribute via pull requests!*
