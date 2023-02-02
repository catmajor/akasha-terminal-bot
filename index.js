const fs = require('fs')
const {Client, GatewayIntentBits, TextInputStyle, ButtonBuilder, ButtonStyle, Events, Collector, PermissionsBitField} = require('discord.js')
const { ModalBuilder, TextInputBuilder, ActionRowBuilder, EmbedBuilder } = require('@discordjs/builders')
const {EnkaClient} = require("enka-network-api")
const Akasha = require("./akasha")
const Rainbow = require("./rainbow")
const Token = require("./tokenShop")
const Admin = require("./admin")
const { domainToUnicode } = require('url')
const e = require('express')
require('dotenv/config')
const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]})
const enka = new EnkaClient()


const systemMessageColor = new Rainbow()

const tokencmd = new Token(client, systemMessageColor)
const akasha = new Akasha(client, systemMessageColor)
const admin = new Admin(client, systemMessageColor)
loggingColor = new Rainbow()






client.on('ready', () => console.log(`${client.user.username}#${client.user.discriminator}: Connected to Irminsul`))



client.on('interactionCreate', async interaction => {


    if (interaction.isChatInputCommand()) {
        if (interaction.commandName === 'info') {
            const person = interaction.options.getUser('who')
            const data = interaction.options.getString('data')
            
            file = JSON.parse(fs.readFileSync('data.json', 'utf8'))
            let info;
            if (Object.keys(file).some(n => n === person.id)) {
                if (!file[person.id].genshinPlayer) {
                    const embed = new EmbedBuilder()
                        .setAuthor({name: `Command Done By ${interaction.user.username}#${interaction.user.discriminator}`, iconURL: interaction.user.displayAvatarURL()})
                        .setTitle(`This person is not a genshin player`)
                        .setFooter({text: "NotPlayer"})
                        .setTimestamp()
                        .setColor(systemMessageColor.color)
                    await interaction.reply({embeds: [embed]})
                    return
                }
                info =  file[person.id][data]
            } else {
                const embed = new EmbedBuilder()
                    .setAuthor({name: `Command Done By ${interaction.user.username}#${interaction.user.discriminator}`, iconURL: interaction.user.displayAvatarURL()})
                    .setTitle("User probably doesn't exist, if you haven't accidentally selected the bot itself please dm me")
                    .setFooter({text: "InvalidId"})
                    .setTimestamp()
                    .setColor(systemMessageColor.color)
                await interaction.reply({embeds: [embed]})
                return
            }
            const embed = new EmbedBuilder()
                .setAuthor({name: `Command Done By ${interaction.user.username}#${interaction.user.discriminator}`, iconURL: interaction.user.displayAvatarURL()})
                .setTitle(`${person.username}#${person.discriminator}'s ${data} is ${info}`)
                .setFooter({text: "Info Command"})
                .setTimestamp()
                .setColor(systemMessageColor.color)
            interaction.reply({embeds: [embed]})
        }


        if (interaction.commandName === 'register') {
            row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('registeryes')
                .setLabel('Yes I play Genshin')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('registero')
                .setLabel('No I Do not play Genshin')
                .setStyle(ButtonStyle.Danger)
            )
            interaction.reply({content: "Do You Play Genshin?", components: [row]})
            const registercollector = interaction.channel.createMessageComponentCollector({time: 10000, max: 1})
            registercollector.on('collect', async i => {
                if (i.customId==="registeryes") {
                    const modal = new ModalBuilder()
                        .setCustomId('registeryesgenshin')
                        .setTitle('Please fill out accurately')
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
                    i.showModal(modal)
                } else {
                    const modal = new ModalBuilder()
                        .setCustomId('registernogenshin')
                        .setTitle('Please fill out accurately')
                    const modalname = new TextInputBuilder()
                        .setCustomId('registernameinput')
                        .setLabel('Enter your irl name:')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                    const modalinvite = new TextInputBuilder()
                        .setCustomId('userinvite')
                        .setLabel('Who did you get your invite from? (optional)')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(false)
                    const namerow = new ActionRowBuilder().addComponents(modalname)
                    const inviterow = new ActionRowBuilder().addComponents(modalinvite)
                    modal.addComponents(namerow, inviterow)
                    i.showModal(modal)
                }
            })
            registercollector.on('end', async i => {await interaction.deleteReply()})
        }


        if (interaction.commandName === 'profile') {
            file = JSON.parse(fs.readFileSync('data.json', 'utf8'))
            if (!file[interaction.user.id].genshinPlayer) {
                const embed = new EmbedBuilder()
                        .setAuthor({name: `Command Done By ${interaction.user.username}#${interaction.user.discriminator}`, iconURL: interaction.user.displayAvatarURL()})
                        .setTitle(`This person is not a genshin player`)
                        .setFooter({text: "NotPlayer"})
                        .setTimestamp()
                        .setColor(systemMessageColor.color)
                await interaction.reply({embeds: [embed]})
                return
            }
            const userId = interaction.options.getUser('who').id
            await akasha.userEmbed(interaction, userId, file)
        }


        if (interaction.commandName === 'update') {
            file = JSON.parse(fs.readFileSync('data.json', 'utf8'))
            const userId = interaction.user.id
            const personRoleManager = await interaction.guild.members.fetch({user: userId, force: true})
            const person = file[userId]
            let removeroles = personRoleManager._roles.length
            let roles = person.regularRoles
            if (person.genshinPlayer === true) {
               roles = roles.concat(person.arRole)
            }
            const rolesnum = roles.length - removeroles
            personRoleManager.edit({roles: roles}).catch(err => console.log(err))
            await interaction.reply(`${rolesnum>=0?`Added ${rolesnum}`:`Removed ${rolesnum*-1}`} role${Math.abs(rolesnum)===1?'':'s'}`)
        }
        
        if (interaction.commandName === 'token') {
            await tokencmd.tokencommand(interaction)
        }
        if (interaction.commandName === 'giveroles') {
            if (interaction.user.id!=='333634786209955850') {
                interaction.reply({content: "Summer stop trying to break my bot", ephemeral: true})
                return
            }
            await admin.addrole(interaction)
        }
        if (interaction.commandName === 'removeroles') {
            if (interaction.user.id!=='333634786209955850') {
                interaction.reply({content: "Summer stop trying to break my bot", ephemeral: true})
                return
            }
            await admin.removerole(interaction)
        }
        if (interaction.commandName === 'test') {
            const uid = 629640528
            const character = (await enka.fetchUser(uid))
            const embed = await characterEmbed(character.characters[0], interaction)
            interaction.reply({embeds: [embed]})
        }   
    }



    if (interaction.isModalSubmit()) {
        console.log(interaction.customId)
        const registeredRole = '958093670421237790' //958093670421237790 in server 1051245030007902257 in testing
        const nonGenshinRole = '958071522071818292' //958071522071818292 in server 1051245075218309210 in testing
        if (interaction.customId ==='registeryesgenshin') {
            const name = interaction.fields.getTextInputValue('registernameinput')
            const uid = interaction.fields.getTextInputValue('registeruidinput')
            if ((uid.match(/\d+/) === null)||(uid.match(/\d+/)[0].length !== 9)) {
                await interaction.reply('uid not a number, try again')
                return
            }
            await interaction.deferReply()
            user = await enka.fetchUser(parseInt(uid)).then(res => res._data).catch(err => console.log(err))

            file = JSON.parse(fs.readFileSync('data.json', 'utf8'))
            userId = interaction.user.id
            if (!Object.keys(file).some(n => n === interaction.user.id)) {
                dummy = {}
                dummy.name = name
                dummy.uid = uid
                dummy.arRole = akasha.getRole(user.playerInfo.level)
                dummy.tokens = 0
                dummy.genshinPlayer = true
                dummy.regularRoles = [registeredRole]
                file[userId] = dummy
            } else {
                elim = file[userId].regularRoles.findIndex(n => n === '1051245075218309210')
                if (elim!==-1) file[userId].regularRoles[elim] = registeredRole
                else file[userId].regularRoles.push(registeredRole)
                file[userId].name = name
                file[userId].uid = uid
                file[userId].genshinPlayer = true
                file[userId].arRole = akasha.getRole(user.playerInfo.level)
            }
            fs.writeFileSync('data.json', JSON.stringify(file))
            await interaction.editReply(`Hello ${name} with uid ${uid}, genshin username ${user.playerInfo.nickname} at ar ${user.playerInfo.level} and signature ${user.playerInfo.signature}`)
        } 
        if (interaction.customId === 'registernogenshin') {
            const name = interaction.fields.getTextInputValue('registernameinput')
            const invite = interaction.fields.getTextInputValue('userinvite')
            file = JSON.parse(fs.readFileSync('data.json', 'utf8'))
            userId = interaction.user.id
            await interaction.deferReply()
            if (!Object.keys(file).some(n => n === interaction.user.id)) {
                dummy = {}
                dummy.name = name
                dummy.invite = invite
                dummy.tokens = 0
                dummy.genshinPlayer = false
                dummy.regularRoles = [nonGenshinRole]
                file[userId] = dummy
            } else {
                elim = file[userId].regularRoles.findIndex(n => n === registeredRole)
                if (elim!==-1) file[userId].regularRoles[elim] = nonGenshinRole
                else file[userId].regularRoles.push(nonGenshinRole)
                file[userId].name = name
                file[userId].invite = invite
                file[userId].genshinPlayer = false
            }
            await interaction.editReply(`Hello ${name} (consider downloading genshin)`)
            fs.writeFileSync('data.json', JSON.stringify(file))
            
            
        }
    }



    if (interaction.isUserContextMenuCommand()) {
        file = JSON.parse(fs.readFileSync('data.json', 'utf8'))
        
        if (!file[interaction.user.id].genshinPlayer) {
            await interaction.reply("Person does not play genshin")
            return
        }
        const userId = interaction.targetId
        await akasha.userEmbed(interaction, userId, file)
    }

    
})

client.on('messageDelete', async event => {
    if (event.author.id === client.user.id) return
    const embed = new EmbedBuilder()
        .setTitle(`For Attachments look above /\\`)
        .addFields({"name": "Original Content:", "value": `\u200B${event.content}` })
        .setColor(loggingColor.color)
        .setAuthor({name: `Message Delete: Original message sent by ${event.author.username}#${event.author.discriminator}`, iconURL: `${event.author.displayAvatarURL()}`})
        .setTimestamp()
    attachments = event.attachments?event.attachments.map(ele => ele):null
    event.channel.send({embeds: [embed], files: attachments})
})

client.on('messageUpdate', async event => {
    if (event.author.id === client.user.id) return
    const embed = new EmbedBuilder()
        .setTitle(`For Attachments look above /\\`)
        .addFields(
            {"name": "Original Content:", "value": `\u200B${event.content}` },
            {"name": "New Content:", "value": `\u200B${event.reactions.message.content}`},
            {"name": "Channel", "value": `${event.channel.name}`},
            {"name": "Message ID", "value": `${event.id}`}
        )
        .setColor(loggingColor.color)
        .setAuthor({name: `Message Edit: Original message sent by ${event.author.username}#${event.author.discriminator}`, iconURL: `${event.author.displayAvatarURL()}`})
        .setTimestamp()
    attachments = event.attachments?event.attachments.map(ele => ele):null
    event.channel.send({embeds: [embed], files: attachments})
})

client.on('messageCreate', async message => {
    if (client.user.id===message.author.id) return
    random = Math.floor(Math.random()*256)
    if (random===1) {
        const file = JSON.parse(fs.readFileSync('data.json', 'utf-8'))
        console.log(systemMessageColor.constant)
        await akasha.wildToken(message, file)
        console.log(systemMessageColor.constant)
    }
    if (/m\s*[o0]\s*m*\s*m*\s*y/i.test(message.content)) {
        const file = JSON.parse(fs.readFileSync('data.json', 'utf-8'))
        message.channel.send(`ok ${file[message.author.id].name} :skull:`)
        if (Math.floor(Math.random()*101)===0) {
            let guild = client.guilds.cache.get(message.guild.id)
            admin.addrole(message, guild.roles.cache.find(role=> role.id === '1060022940038611125'), message.author)
            message.channel.send('Damn you really said it enough times :skull:')
        }
    }
})

client.login(process.env.TOKEN)