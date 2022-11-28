const fs = require('fs')
require('dotenv/config')
const {Client, GatewayIntentBits, InteractionCollector, TextInputStyle} = require('discord.js')
const { ModalBuilder, TextInputBuilder, ActionRowBuilder } = require('@discordjs/builders')
const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]})

client.on('ready', () => console.log(`${client.user.username}#${client.user.discriminator}: Connection to Irminsul Secure`))

client.on('interactionCreate', async interaction=> {

    if (interaction.isChatInputCommand()) {
        if (interaction.commandName === 'info') {
            const person = interaction.options.getUser('who')
            const data = interaction.options.getString('data')
            const botreply = () => {
                file = fs.readFileSync('data.txt', 'utf8')
                file = JSON.parse(file)
                let info;
                file.forEach(ele=>{
                    if (ele.discordId===person.id) {
                        info =  ele[data]}
                })
                return info
            }
            interaction.reply(`${person.username}#${person.discriminator}'s ${data} is ${botreply()}`)
        }






        if (interaction.commandName === 'register') {
            const modal = new ModalBuilder().setCustomId('registerinput').setTitle('All fields optional except name')
            const modalname = new TextInputBuilder()
                .setCustomId('registernameinput')
                .setLabel('Enter your irl name:')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
            const namerow = new ActionRowBuilder().addComponents(modalname)
            const modaluid = new TextInputBuilder()
                .setCustomId('registeruidinput')
                .setLabel('Enter your uid:')
                .setStyle(TextInputStyle.Short)
                .setRequired(false)
                .setMaxLength(9)
                .setMinLength(9)
            const uidrow = new ActionRowBuilder().addComponents(modaluid)
            modal.addComponents(namerow, uidrow)
            interaction.showModal(modal)
        }
    }
    if (interaction.isModalSubmit()) {
        if (interaction.customId==='registerinput') {
            const name = interaction.fields.getTextInputValue('registernameinput')
            const uid = interaction.fields.getTextInputValue('registeruidinput')
            if ((uid.match(/\d+/)===null)||(uid.match(/\d+/)[0].length!==9)) {
                await interaction.reply('uid not a number, try again')
                return
            }
            file = JSON.parse(fs.readFileSync('data.txt', 'utf8'))
            const indexOfPerson=file.findIndex(ele=>ele.discordId===interaction.user.id)
            if (indexOfPerson===-1) {
                dummy={}
                dummy.name=name
                dummy.uid=uid
                file.push(dummy)
            } else {
                file[indexOfPerson].name=name
                file[indexOfPerson].uid=uid
            }
            fs.writeFileSync('data.txt', JSON.stringify(file))
            await interaction.reply(`Hello ${name} with uid ${uid}`)
        }
    }
    return
})






client.login(process.env.TOKEN)