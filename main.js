// Импортируем библиотеку fastify для развертывания веб-сервера
const fastify = require('fastify')({
    logger: true // Эта штука нужна, чтобы в терминале отображались логи запросов
})
const TelegramBot = require('node-telegram-bot-api');
const chatId = '654245065'
const token = '5991048838:AAESt-ulIcp4xF_bay9QsMS2Yb6RUblTclw'
const bot = new TelegramBot(token, {polling: true})
// Блок кода, который нужен для исправления ошибки с CORS
fastify.register(require('@fastify/cors'), (instance) => {
    return (req, callback) => {
        const corsOptions = {
            // This is NOT recommended for production as it enables reflection exploits
            origin: true
        };  

        // do not include CORS headers for requests from localhost
        if (/^localhost$/m.test(req.headers.origin)) {
            corsOptions.origin = false
        }

        // callback expects two parameters: error and options
        callback(null, corsOptions)
    }
})

bot.on('message', (msg) => {
    bot.sendMessage(chatId, 'Ты включил пылесос!');
    bot.sendMessage(chatId, 'Бжжжжжжжжжж!');
    bot.sendPhoto(chatId, 'images/Heisenberg.jpg')
  });

// Создание маршрута для get запроса
fastify.get('/', function (request, reply) {
    reply.send({ hello: 'world' })
})

// Создание маршрута для post запроса
fastify.post('/post',function (request, reply) {
    console.log(`Тело запроса: `,JSON.stringify(request.body))
    reply.send(request.body)
})

// Создание запроса с использование path параметров
fastify.get('/:id',function (request, reply) {
    console.log(`Path параметры, переданные в запросе: `,JSON.stringify(request.params))
    reply.send(request.params)
})

// Создание запроса с использованием query параметров
fastify.get('/query',function (request, reply) {
    console.log(`Query параметры, переданные в запросе`, JSON.stringify(request.query))
    reply.send(request.query)
})

const posts = []


fastify.post('/post/create', async function (request, reply){
    try {
        const title = request.body.title
        const description = request.body.description      
        const author = request.body.author
        const date = new Date().getDate().toString() + '.' + new Date().getMonth().toString() + '.' +new Date().getFullYear().toString()
        const readTime = request.body.readTime
  
      if(title.length == 0) {
        reply.status(400)
        reply.send({message: 'Название пустое'})
        return
      }  
      if(description.length == 0) {
        reply.status(400)
        reply.send({message: 'Описание пустое'})
        return
      }  
      if(author.length == 0) {
        reply.status(400)
        reply.send({message: 'Автор пустой'})
        return
      }
      if(readTime.length === 0){
        reply.status(400) 
        reply.send({message: 'Время прочтения пустое'})
        return
      }
      const object = {title,description,author,date,readTime}
      posts.push(object)
      console.log(object)
      await bot.sendMessage(chatId,'➕Добавлен новый пост:' + '\ntitle: ' + JSON.stringify(object.title)
      + '\ndescription: ' + JSON.stringify(object.description)+ '\nauthor: ' + JSON.stringify(object.author)
      + '\ndate: ' + JSON.stringify(object.date)+ '\nreadTime: ' + JSON.stringify(object.readTime))
      reply.send({message: {succes:true}})
    } 
    catch (e){
      console.log(e)
    }
})

fastify.get('/post/read', async function (request, reply){
    try{
        await bot.sendMessage(chatId,'Список постов:')
        for (let post of posts){
            await bot.sendMessage(chatId,'\ntitle: ' + JSON.stringify(post.title)
            + '\n➡️description: ' + JSON.stringify(post.description)+ '\n➡️author: ' + JSON.stringify(post.author)
            + '\n➡️date: ' + JSON.stringify(post.date)+ '\n➡️readTime: ' + JSON.stringify(post.readTime))
        }
        console.log(posts)
        reply.send(posts)
    } catch(e){
        console.log(e)
    }
})


// Запускаем сервер на порту 3000
fastify.listen({ port: 3000 }, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})