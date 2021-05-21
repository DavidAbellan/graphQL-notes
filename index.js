const express=require('express');
const graphQL = require('express-graphql');
const schema = require('./schema/schema')

/*graphiql true para abrir graphiql*/ 
const app = express()
app.use('/graphql', graphQL.graphqlHTTP({
    schema,
    graphiql:true

}))

app.listen(3131, () => {
    console.log("Escuchando...");
})