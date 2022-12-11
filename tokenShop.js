const fs = require('fs')
const { ModalBuilder, TextInputBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder} = require('@discordjs/builders')
const {ButtonStyle, TextInputStyle, Collector, Events} = require('discord.js')


class Token {
    constructor(client, color) {
        this.client = client
        this.color = color
    }

    help(interaction) {
        const embed = new EmbedBuilder()
            .setTitle("Token Help")
            .setAuthor({name: `Command Done By ${interaction.user.username}#${interaction.user.discriminator}`, iconURL: interaction.user.displayAvatarURL()})
            .setFields(
                {"name": "How To Use Shop", "value": "When you input shop into the command, the next field will specify what item you want to buy. If you want to see everything that you can buy, select the allitems option"},
                {'name': "How To See your Tokens", "value": "Simply run the command again, but instead of help click balance"},
                {'name': 'How To Use Color Change', 'value': 'The choice has two values, the first is the role you want to change, and the second is the color. Make sure you actually have a token before running'}
            )
            .setFooter({text:'help command'})
            .setTimestamp()
            .setColor(this.color.color)
        return embed
    }

    shop(interaction) {
        const embed = new EmbedBuilder()
            .setTitle("Token Shop")
            .setAuthor({name: `Command Done By ${interaction.user.username}#${interaction.user.discriminator}`, iconURL: interaction.user.displayAvatarURL()})
            .setFooter({text: "Page 1/1"})
            .setTimestamp()
            .setFields(
                {'name': "Color Change", "value": "changes the color of the specified role", inline: true},
                {'name': 'Cost', 'value': '1 token', inline: true}
            )
            .setColor(this.color.color)
        return embed
    }

    balance(interaction) {
        const file = JSON.parse(fs.readFileSync('data.json', 'utf-8'))
        const embed = new EmbedBuilder()
            .setTitle("Balance")
            .setAuthor({name: `Command Done By ${interaction.user.username}#${interaction.user.discriminator}`, iconURL: interaction.user.displayAvatarURL()})
            .setFooter({text: 'Page 1/1'})
            .setTimestamp()
            .setFields(
                {'name': `Your (${interaction.user.username}#${interaction.user.discriminator}'s) balance:`, 'value': `${file[interaction.user.id].tokens} tokens` }
            )
            .setColor(this.color.color)
        return embed
    }


    async tokencommand(interaction) {
        await interaction.deferReply()
        const choice = interaction.options.getSubcommand()
        if (choice === 'help') {
            const embeds = this.help(interaction)
            await interaction.editReply({embeds: [embeds]})
        }
        if (choice === 'allitems') {
            const embeds = this.shop(interaction)
            await interaction.editReply({embeds: [embeds]})
        }
        if (choice === 'changecolor') {
            console.log('hi')
        }
        if (choice === 'balance') {
            const embeds = this.balance(interaction)
            await interaction.editReply({embeds: [embeds]})
        }
        console.log(choice)
    }
}

module.exports = Token