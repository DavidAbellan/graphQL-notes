const graphQL = require('graphql');
const Course = require('../models/course');
const Professor = require('../models/professor');
const User = require('../models/user');
const bcrypto = require('bcrypt');
const auth = require('../utils/auth');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLList
} = graphQL;

const CourseType = new GraphQLObjectType({
    name: 'Course',
    fields: () => ({
        id: {
            type: GraphQLString
        },
        name: {
            type: GraphQLString
        },
        languaje: {
            type: GraphQLString
        },
        date: {
            type: GraphQLString
        },
        professor: {
            type: ProfessorType,
            resolve(parent,args) {
                return Professor.findById(parent.professorId);
            }
        }
    })
})



const ProfessorType = new GraphQLObjectType({
    name: 'Professor',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        age: {
            type: GraphQLInt
        },
        active: {
            type: GraphQLBoolean
        },
        date: {
            type: GraphQLString
        },
        /*uno a muchos*/
        course : {
            type : new GraphQLList (CourseType) ,
            resolve(parent, args) {
                return Course.find({professorId:parent.id});

                }
            
        }
    })
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString
        },
        password: {
            type: GraphQLString
        },
        date: {
            type: GraphQLString
        }
    })
})

const MessageType = new GraphQLObjectType({
    name:"Message",
    fields:()=>({
         message:{type:GraphQLString},
         token :{type:GraphQLString},
         error : {type:GraphQLString}
    })
})
const RootQuery = new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
            course: {
                type: CourseType,
                args: {
                    id: {
                        type: GraphQLString
                    }
                },
                resolve(parent, args, context) {
                    if (!context.user.auth) {
                        throw new Error('Error de autenticación');
                    }
                    return Course.findById(args.id);

                }
            },
            professor: {
                type: ProfessorType,
                args: {
                    name: {
                        type: GraphQLString
                    }
                },
                resolve(parent, args) {
                    return Professor.findOne({name : args.name});

                }
            },
            user: {
                type: UserType,
                args: {
                    name: {
                        type: GraphQLString
                    }
                },
                resolve(parent, args) {
                    return users.find(user => user.name == args.name)

                }

            },
            courses : {
                type : new GraphQLList(CourseType),
                resolve(parent , args ){
                    return Course.find();
                }
            },
            professors : {
                type: new GraphQLList(ProfessorType),
                resolve(parent,args){
                    return Professor.find();
                }
            }
        }
    }

)
const Mutation  = new GraphQLObjectType({
    name : 'Mutation',
    fields : {
        addCourse : {
            type : CourseType,
            args : {
                name : {type : GraphQLString},
                languaje : {type : GraphQLString},
                date : {type : GraphQLString},
                professorId: {type : GraphQLID}

            },
            resolve(parent,args){
                let course = new Course({
                    name :  args.name,
                    languaje : args.languaje,
                    date : args.date,
                    professorId : args.professorId
                })
                return course.save();
            }
        },
        addProfessor : {
            type : ProfessorType,
            args : {
                name : {type : GraphQLString},
                age : {type : GraphQLInt},
                date : {type : GraphQLString},
                active :{type : GraphQLBoolean}

            },
            resolve(parent,args){
              return Professor(args).save();
            }
        },
        addUser : {
            type : MessageType,
            args : {
                name : {type : GraphQLString},
                email : {type : GraphQLString},
                date : {type : GraphQLString},
                password :{type : GraphQLString}

            },
            async resolve(parent,args){
               let user =await User.findOne({email : args.email}); 
               if(user) return {error:'El usuario ya existe en la BBDD'}
               const salt = await bcrypto.genSalt(10);
               const hashPassword = await bcrypto.hash(args.password,salt);
               user = new User({
                   name : args.name,
                   email : args.email,
                   date : args.date,
                   password : hashPassword
               })
               user.save()
               return {message:'Usuario creado'}    
               
                      
            
            
            }

        },
        login :{
            type: MessageType,
            args:{
                email:{type:GraphQLString},
                password:{type:GraphQLString}
            },
            async resolve(parent,args){
                const result = await auth.login(args.email,args.password,process.env.SECRET_KEY_JWT_COURSE_API);
                return {
                    message: result.message,
                    error :result.error,
                    token : result.token
                }

            }

        },
      
        
        updateCourse :  {
            type : CourseType,
            args : {
                id : {type : GraphQLID},

                name : {type : GraphQLString},
                languaje : {type : GraphQLString},
                date : {type : GraphQLString},
                professorId: {type : GraphQLID}

            },
            resolve(parent,args){
              return Course.findByIdAndUpdate(
                  args.id , {
                    name :  args.name,
                    languaje : args.languaje,
                    date : args.date,
                    professorId : args.professorId
                  }, {
                      new:true
                  }
              )
            }
        },
        deleteCourse :  {
            type : CourseType,
            args : {
                id : {type : GraphQLID}

            },
            resolve(parent,args){
              return Course.findByIdAndDelete(args.id)
              
            }
        },
        deleteProfessor :  {
            type : ProfessorType,
            args : {
                id : {type : GraphQLID}

            },
            resolve(parent,args){
              return Professor.findByIdAndDelete(args.id)
              
            }
        },
        updateProfessor:{
          type: ProfessorType,
          args : {
            id : {type : GraphQLID},

            name : {type : GraphQLString},
            age: {type : GraphQLInt},
            date : {type : GraphQLString},
            active: {type : GraphQLBoolean}

              },
              resolve(parent,args) {
                  return Professor.findByIdAndUpdate(args.id , {  
                      name :  args.name,
                      age : args.age,
                      date : args.date,
                      active : args.active
                  } 
  
                  )
              }
  
          }
  
      },
  
  
        deleteAllCourses :  {
            type : CourseType,
        
            resolve(parent,args){
              return Course.deleteMany({})
              
            }
        }
       
    }


    





)


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation : Mutation
})