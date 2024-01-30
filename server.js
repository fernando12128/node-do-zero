// import {createServer} from 'node:http'

// const server = createServer((req, res) =>  {
//     res.write('oi')

//     return res.end()
// })

// server.listen(3333)


//fazendo com fastify
import {fastify} from 'fastify'
// import {DatabaseMemory} from './database-memory.js'
import { DatabasePostgres } from './database-postgres.js'

const server = fastify()

// const database = new DatabaseMemory()
 const database = new DatabasePostgres()

server.get('/', ()=> {
    return 'hello word'
})

server.post('/video', async(request, reply)=> {

    const {title, description, duration} = request.body

    await database.create({
        title,
        description,
        duration,
    })

    // console.log(database.list())

    return reply.status(201).send()//201 = algo foi criado
})

server.get('/videos', async(request)=> {
    const search = request.query.search

    const videos = await database.list(search)

    return videos
})

server.put('/videos/:id', async (request,reply)=> {
    const videoId = request.params.id
    const {title, description, duration} = request.body

    await database.update(videoId, {
        title,
        description,
        duration
    })

    return reply.status(204).send() // 204 resposta que teve sucesso porem não tem conteudo
})

server.delete('/video/:id', async (request, reply)=> {
    const videoId = request.params.id

    await database.delete(videoId)
    return reply.status(204).send()
})

server.listen({
    port : process.env.PORT ?? 3333,
})