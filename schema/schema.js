const graphQL = require('graphql');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLList
} = graphQL

var courses = [{
        id: '1',
        name: 'JAVA Spring back end',
        languaje: 'JAVA',
        date: '2021',
        professorId:'3'
    },
    {
        id: '2',
        name: 'Angular',
        languaje: 'Javascript',
        date: '2021',
        professorId:'4'

    },
    {
        id: '3',
        name: 'React',
        languaje: 'Javascript',
        date: '2021',
        professorId:'5'

    },
    {
        id: '4',
        name: 'Flutter',
        languaje: 'Dart',
        date: '2021',
        professorId:'4'

    },
    {
        id: '5',
        name: 'Django',
        languaje: 'Python',
        date: '2021',
        professorId:'2'

    }

]
var users = [{
        id: '1',
        name: 'Jonás Alcántara',
        email: 'emial@cma.com',
        password: 'calabazas',
        date: '1984'
    },
    {
        id: '2',
        name: 'Carlos Dean',
        email: 'emaaial@cmas.com',
        password: 'caadsasdbazas',
        date: '1984'
    },
    {
        id: '3',
        name: 'Tomás Jesús',
        email: 'ajskal@cma.com',
        password: 'calabaaazas',
        date: '1984'
    },
    {
        id: '4',
        name: 'Berti Vogts',
        email: 'emiaaal@cma.com',
        password: 'calabaaaazas',
        date: '1984'
    },
    {
        id: '5',
        name: 'Adolf Heiss',
        email: 'emiaaasl@cma.com',
        password: 'calabaasazas',
        date: '1984'
    },


]

var professors = [{
        id: '1',
        name: 'Gregorio Dupont',
        age: 54,
        active: true,
        date: '1984'
    },
    {
        id: '2',
        name: 'David Bizarro',
        email: 43,
        active: true,
        date: '1964'
    },
    {
        id: '3',
        name: 'James Stewart',
        age: 34,
        active: true,
        date: '1994'
    },
    {
        id: '4',
        name: 'Moctezuma',
        age: 54,
        active: true,
        date: '1784'
    },
    {
        id: '5',
        name: 'Francesc Pascua',
        age: 71,
        active: false,
        date: '1884'
    },


]

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
                return professors.find(professor=> professor.id == parent.professorId)
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
                return courses.filter(course=> course.professorId == parent.id)

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
                resolve(parent, args) {
                    return courses.find(curso => curso.id == args.id)

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
                    return professors.find(professor => professor.name == args.name)

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
                    return courses
                }
            },
            professors : {
                type: new GraphQLList(ProfessorType),
                resolve(parent,args){
                    return professors
                }
            }
        }
    }

)
module.exports = new GraphQLSchema({
    query: RootQuery
})