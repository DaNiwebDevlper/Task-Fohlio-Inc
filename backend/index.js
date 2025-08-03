const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { schema, root } = require('./schema');
const cors = require('cors');
const app = express();
// Enable CORS
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
}));

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/graphql`);
});
