// index.js - Final Version

console.log('🔍 index.js has started');

require('dotenv').config();
const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose');
const { GraphQLScalarType, Kind } = require('graphql');

// Import models
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Review = require('./models/Review');

// Custom Date scalar
const DateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Custom Date scalar type',
  serialize(value) {
    return value.getTime(); // Date -> Integer timestamp
  },
  parseValue(value) {
    return new Date(value); // Integer timestamp -> Date
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10));
    }
    return null;
  },
});

// GraphQL schema
const typeDefs = gql`
  scalar Date

  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: Date!
  }

  type Category {
    id: ID!
    name: String!
  }

  type Product {
    id: ID!
    name: String!
    description: String
    price: Float!
    category: Category
    reviews: [Review]
  }

  type OrderItem {
    product: Product!
    quantity: Int!
  }

  type Order {
    id: ID!
    user: User!
    items: [OrderItem!]!
    total: Float!
    placedAt: Date!
  }

  type Review {
    id: ID!
    product: Product!
    user: User!
    rating: Int!
    comment: String
    createdAt: Date!
  }

  type Query {
    users: [User!]
    products(categoryId: ID): [Product!]
    orders(userId: ID): [Order!]
    reviews(productId: ID): [Review!]
  }

  type Mutation {
    addUser(name: String!, email: String!, password: String!): User
    addCategory(name: String!): Category
    addProduct(name: String!, description: String, price: Float!, categoryId: ID!): Product
    createOrder(userId: ID!, items: [OrderItemInput!]!): Order
    addReview(productId: ID!, userId: ID!, rating: Int!, comment: String): Review
  }

  input OrderItemInput {
    productId: ID!
    quantity: Int!
  }
`;

// Resolvers with .exec() for queries
const resolvers = {
  Date: DateScalar,

  Query: {
    users: () => User.find().exec(),
    products: (_, { categoryId }) =>
      Product.find(categoryId ? { category: categoryId } : {})
        .populate('category')
        .exec(),
    orders: (_, { userId }) =>
      Order.find({ user: userId }).populate('items.product').exec(),
    reviews: (_, { productId }) =>
      Review.find({ product: productId }).exec(),
  },

  Product: {
    reviews: (product) => Review.find({ product: product.id }).exec(),
  },

  OrderItem: {
    product: (item) => Product.findById(item.product).exec(),
  },

  Order: {
    user: (order) => User.findById(order.user).exec(),
  },

  Review: {
    user: (r) => User.findById(r.user).exec(),
    product: (r) => Product.findById(r.product).exec(),
  },

  Mutation: {
    addUser: (_, { name, email, password }) =>
      User.create({ name, email, passwordHash: password }),
    addCategory: (_, { name }) => Category.create({ name }),
    addProduct: (_, args) =>
      Product.create({
        name: args.name,
        description: args.description,
        price: args.price,
        category: args.categoryId,
      }),
    createOrder: async (_, { userId, items }) => {
      let total = 0;
      const orderItems = await Promise.all(
        items.map(async ({ productId, quantity }) => {
          const p = await Product.findById(productId);
          total += p.price * quantity;
          return { product: productId, quantity };
        })
      );
      return Order.create({ user: userId, items: orderItems, total });
    },
    addReview: (_, { productId, userId, rating, comment }) =>
      Review.create({ product: productId, user: userId, rating, comment }),
  },
};

// Server bootstrap with logging
async function start() {
  try {
    console.log('🟢 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connection established');

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      introspection: true, // ✅ enables introspection in production
      playground: true     // ✅ enables GraphQL Playground UI
    });

    server
        .listen({ port: process.env.PORT || 4000, path: "/graphql" })
        .then(({ url }) => console.log(`🚀 Server ready at ${url}`))
        .catch((err) => console.error('❌ Apollo Server failed to start:', err));
  } catch (err) {
    console.error('❌ Error in server bootstrap:', err);
    process.exit(1);
  }
}

start();
