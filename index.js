const express=require('express');
const graphQL = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const auth = require('./utils/auth');

console.log(process.env.SECRET_KEY_JWT_COURSE_API)

mongoose.connect('mongodb://localhost/graphql_db', {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false
}).then(()=>console.log('Conectado a graphql_db '))
.catch(error => console.log("Error de conexión"))


/*graphiql true para abrir graphiql*/ 
const app = express()

app.use(
 auth.checkHeaders
)

app.use('/graphql', graphQL.graphqlHTTP((req)=>{
 return{
 
    schema,
    graphiql:true,
    context : {
        user : req.user
    }}

}))

app.listen(3131, () => {
    console.log("Escuchando...");
})