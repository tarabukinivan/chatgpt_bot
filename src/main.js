import { Telegraf, session } from 'telegraf'
import { message } from 'telegraf/filters'
import { code } from 'telegraf/format'
import config from 'config'
import { ogg } from './ogg.js'
import { openai } from './openai.js'

const MAX_MESSAGES = 1750;

console.log(config.get('TEST_ENV'))

const INITIAL_SESSION = {
    messages: [],
}
const bot = new Telegraf(config.get('TELEGRAM_TOKEN'))

bot.use(session())

function kolvaslov(arrtext='') {
    let kolvo=0
    console.log("arrtext: ")
    for (var i = 0; i < arrtext.length; i++) {
        console.log(arrtext[i]);
        let words = arrtext[i].content.split(" ");
        let count = words.length;       
        kolvo = kolvo + count         
    }
    console.log("всего слов: " + kolvo)
    return kolvo    
}

function deleted(arrwords){
    let x=0;
    console.log("arrwords:")
    console.log(arrwords)

    let dlina=false;
    while (!dlina) {
        x =kolvaslov(arrwords)
        console.log("x:")
        console.log(x)
        if(x > MAX_MESSAGES){
            arrwords.shift()
        }else{
            dlina=true
        }
    }
    console.log("конечная длина:")
    console.log(x)
    return arrwords
}

bot.command('new', async (ctx) => {
    ctx.session = INITIAL_SESSION
    await ctx.reply('Жду вашего сообщения')
})

bot.command('start', async (ctx) => {
    ctx.session = INITIAL_SESSION
    await ctx.reply('Жду вашего сообщения')
})

bot.on(message('voice'), async ctx => {
    ctx.session ??= INITIAL_SESSION
    try {
        await ctx.reply(code('Сообщение принял. Сервертан эппиэт куутэбит ...'))        
        const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id)        
        const userId = String(ctx.message.from.id)        
        console.log(link.href)
        const oggPath = await ogg.create(link.href, userId)        
        const mp3Path = await ogg.toMp3(oggPath, userId)        
        const text = await openai.transcription(mp3Path)
        await ctx.reply(code(`Ваш запрос: ${text}`))
        console.log("levaud7")
        ctx.session.messages.push({role: openai.roles.USER, content: text})
        ctx.session.messages = deleted(ctx.session.messages)

        let response = await openai.chat(ctx.session.messages)
        console.log("levaud9")

        if(response){
            ctx.session.messages.push({
                role: openai.roles.ASSISTANT,
                content: response.content,
            })
            ctx.session.messages = deleted(ctx.session.messages)
            await ctx.reply(response.content)
        }else{
            console.log("получили undefined")
            await ctx.reply("не получили ответ от сервера, поторите запрос")           
        }
        
    } catch (e){
        console.log("levaud12")
        console.log(`Error while voice message`, e.message)
    }
    
})

bot.on(message('text'), async ctx => {
    ctx.session ??= INITIAL_SESSION
    try {
        await ctx.reply(code('Сообщение принял. Ждем ответ от сервера ...'))
        console.log("lev1")
        ctx.session.messages.push({
            role: openai.roles.USER,
            content: ctx.message.text,
        })
        ctx.session.messages = deleted(ctx.session.messages)
        console.log("lev2")
        let response = await openai.chat(ctx.session.messages)
        
        console.log("lev3")
        if(response){
            ctx.session.messages.push({
                role: openai.roles.ASSISTANT,
                content: response.content,
            })
            ctx.session.messages = deleted(ctx.session.messages)
            await ctx.reply(response.content)
        }else{
            console.log("получили undefined")
            await ctx.reply("не получили ответ от сервера, поторите запрос")           
        }
        console.log("lev4")
    } catch (e){
        console.log("lev5")
        console.log(`Error while voice message`, e.message)
    }
    
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
