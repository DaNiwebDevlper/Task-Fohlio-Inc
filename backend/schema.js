const { buildSchema } = require('graphql');

// Initial mock user data
let users = [
  {
    id: '1754227253222',
    name: 'Text user 1',
    email: 'test1@example.com',
    role: 'user',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: '17542272532323',
    name: 'Qasir Nadeem',
    email: 'qasirnadeem@gmail.com',
    role: 'admin',
    status: 'active',
    createdAt: new Date().toISOString(),
  }
];

// GraphQL Schema
const schema = buildSchema(`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    status: String!
    createdAt: String!
  }

  input AddUserInput {
    name: String!
    email: String!
    role: String!
    status: String!
  }

  input UpdateUserInput {
    name: String
    email: String
    role: String
    status: String
  }

  type Query {
    users: [User]
    user(id: ID!): User
  }

  type Mutation {
    addUser(input: AddUserInput!): User
    updateUser(id: ID!, input: UpdateUserInput!): User
    deleteUser(id: ID!): String
  }
`);

// Resolvers
const root = {
  users: () => users,

  user: ({ id }) => users.find(u => u.id === id),

  addUser: ({ input }) => {
    const newUser = {
      id: String(Date.now()),
      ...input,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    return newUser;
  },

  updateUser: ({ id, input }) => {
    const index = users.findIndex(user => user.id === id);
    if (index === -1) throw new Error('User not found');
    users[index] = {
      ...users[index],
      ...input,
    };
    return users[index];
  },

  deleteUser: ({ id }) => {
    const index = users.findIndex(user => user.id === id);
    if (index === -1) throw new Error('User not found');
    users.splice(index, 1);
    return `User with id ${id} deleted successfully`;
  },
};

module.exports = { schema, root };
