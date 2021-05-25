const bcrypt = require('bcrypt');
const e = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const auth= {
    login : async(email, password, secretKey)=>{
        const user = await User.findOne({email:email});
        if(!user) return{error :'Usuario Incorrecto'}
        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword) return{error :'Password Incorrecto'}
        const token = await jwt.sign({
            _id: user._id,
            name : user.name,
            date: user.date

        }, secretKey) 


        return{message:'Login correcto', token : token}
    },
    checkHeaders: (req,res,next) =>{
        /*de la request recuperamos dentro del header el
        campo Authorization que es donde va el token*/
        const token= req.header('Authorization');
        /* le hacemos un split al token porque lo estamos enviando
        desde la autorizacion de Postman Bearer y nos va a enviar :
        "Bearer 23ujd9j23pj..."*/
        const jwtoken = token.split(' ')[1];
        if(jwtoken) {
            try{
                /* export SECRET_KEY_JWT_COURSE_API=1234 en consola para crear
                una variable global */
                const payload = jwt.verify(jwtoken,'secretKey1');
                req.user= payload;
                req.user.auth = true;
                return next()

            }catch (e){
                req.user= {auth:false}
                return next()   
            }

        }else{
            req.user= {auth:false}
            return next()
        }
    }
}
module.exports = auth