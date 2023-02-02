const {TextInputStyle, ButtonBuilder, ButtonStyle, Events, Collector, Embed} = require('discord.js')
const {TextInputBuilder, ActionRowBuilder, EmbedBuilder } = require('@discordjs/builders')
const {EnkaClient} = require("enka-network-api")
const enka = new EnkaClient()
const fs = require('fs')


class Akasha {

constructor (client, color) {
    this.elementList = {
        "Ice": 0xa0d7e4,
        "Wind": 0x75c3a9,
        "Electric": 0xb08fc2,
        "Fire": 0xef7a35,   
        "Traveler": 0xffffff,
        "Rock": 0xfab72e,
        "Water": 0x4bc3f1,
        "Grass": 0xa6c938
    }
    this.client = client
    this.tokencolor = color
    this.fs = fs
    
}

async createInfoEmbed(file, interaction, userData, userId, pagetotal) {
    const author = interaction.user
    const playerInfo = userData.playerInfo
    const nameCard = enka.getNameCardById(playerInfo.nameCardId)
    const iconChar = enka.getCharacterById(userData.playerInfo.profilePicture.avatarId)
    const iconElement = (iconChar._nameId==='PlayerBoy'||iconChar._nameId==='PlayerGirl')?"Traveler":iconChar.element.id
    const targetUserObject = await this.client.users.fetch(userId)
    const embed = new EmbedBuilder()
        .addFields(
            {'name': 'Name: ', 'value': `${file[userId].name}`},
            {'name': 'Genshin Name: ', 'value': `${playerInfo.nickname}`},
            {'name': 'Signature: ', 'value': `${playerInfo.signature}`},
            {'name': 'UID: ', 'value': `${file[userId].uid}`},
            {'name': 'AR: ', 'value': `${playerInfo.level}`},
            {'name': 'Abyss: ', 'value': `Floor ${playerInfo.towerFloorIndex} Chamber ${userData.playerInfo.towerLevelIndex}`},
            {'name': 'Achievements: ', 'value': `${playerInfo.finishAchievementNum}`}
            )
        .setImage(nameCard.pictures[1].url)
        .setColor(this.elements[iconElement])
        .setThumbnail(iconChar.icon.url)
        .setTitle(`Showing data for ${targetUserObject.username}#${targetUserObject.discriminator}`)
        .setAuthor({name: `Command by ${author.username}#${author.discriminator}`, iconURL: `${interaction.user.displayAvatarURL()}`})
        .setFooter({text:`Page 1/${pagetotal}`})
        .setTimestamp()
    return embed.toJSON()
}

characterEmbed(character, interaction, pagenum=0, pagetotal=0) {
    const author = interaction.user
    const data = character.characterData
    const status = character.status
    const iconElement = data.element.id
    const dmgBonus = this.relevantDmgBonus(iconElement)
    const embed = new EmbedBuilder()
    .addFields(
        {'name': 'Name', 'value': `${data._nameId}`, inline: true},
        {'name':"\u200B", 'value':"\u200B", inline: true},
        {'name': 'Constellation ', 'value': `${character.unlockedConstellations.length}`, inline: true},
        {'name': 'Level', 'value': `${character.level}`, inline: true},
        {'name':"\u200B", 'value':"\u200B", inline: true},
        {'name': 'Friendship', 'value': `${character.friendship}`, inline: true},
        {'name':"\u200B", 'value':"**Character Stats:**"},
        {'name': 'HP', 'value': `${Math.round(status.maxHealth.value)}`, inline: true},
        {'name': 'ATK','value': `${Math.round(status.attack.value)}`, inline:true},
        {'name':"\u200B", 'value':"\u200B", inline: true},
        {'name': 'DEF','value': `${Math.round(status.defense.value)}`, inline:true},
        {'name': 'EM','value': `${Math.round(status.elementMastery.value)}`, inline:true},
        {'name':"\u200B", 'value':"\u200B", inline: true},
        {'name': `${dmgBonus[1]}%`,'value': `${Math.round(status[(dmgBonus[0])].value*100)}%`, inline:false},
        {'name': 'Crit Damage','value': `${Math.round(status.critDamage.value*100)}%`, inline:true},
        {'name': 'Crit Rate', 'value': `${Math.round(status.critRate.value*100)}%`, inline: true}
        )
    .setThumbnail(character.weapon.weaponData.awakenIcon.url)
    .setImage(data.splashImage.url)
    .setColor(this.elements[iconElement])
    .setFooter({text: `Page ${pagenum+1}/${pagetotal+1}`})
    .setAuthor({name: `Command by ${author.username}#${author.discriminator}`, iconURL: `${interaction.user.displayAvatarURL()}`})
    .setTitle(`Showing data for character ${pagenum} of ${pagetotal}`)
    .setTimestamp()
    return embed
}

async addTwoButtons(id1, id2, name1, name2, enabled1=true, enabled2=true) {
    const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId(id1)
					.setLabel(name1)
					.setStyle(ButtonStyle.Primary)
                    .setDisabled(!enabled1),
                new ButtonBuilder()
                    .setCustomId(id2)
                    .setLabel(name2)
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(!enabled2)
			)
    return row
}

async userEmbed(interaction, userId, file) {
    await interaction.deferReply()
    const userData = (await enka.fetchUser(parseInt(file[userId].uid)))
    let page = 0;
    let charembeds;

    if (userData.showCharacterDetails) {
        charembeds = userData.characters.map((ele, ind, arr)=>{
            return this.characterEmbed(ele, interaction, ind+1, arr.length)
        })
    } else {
        charembeds = [new EmbedBuilder().setTitle({name: 'none'})]
    }
    let infoembed = await this.createInfoEmbed(file, interaction, userData._data, userId, charembeds.length+1)
    const embeds = [infoembed].concat(charembeds)
    let firstPageButtons = await this.addTwoButtons("back", "next", "Back", "Next", false, true)
    let middlePageButtons = await this.addTwoButtons("back", "next", "Back", "Next", true, true)
    let lastPageButtons = await this.addTwoButtons("back", "next", "Back", "Next", true, false)

    await interaction.editReply({embeds: [embeds[0]], components: [firstPageButtons]})

    const nextcollector = interaction.channel.createMessageComponentCollector({time: 120000, max: 100})
    
    nextcollector.on('collect', async i => {
        try{
            try {
            await i.deferReply()
            } catch (e) {
                console.log('error acknoledged')
            }
            if (i.customId==='next') page += 1
            else page -= 1
            
    
            
            if (page===0) await interaction.editReply({embeds: [embeds[0]], components: [firstPageButtons], content: ''})
            else if (page>0 && page<embeds.length-1) {
                await interaction.editReply({embeds: [embeds[page]], components: [middlePageButtons], })
            } else if (page===embeds.length-1) {
                await interaction.editReply({embeds: [embeds[page]], components: [lastPageButtons], content: ''})
            }

            await i.deleteReply()
     } catch (err) {
        console.log(err)
        await interaction.followUp('Something went wrong i guess')
     }
    })
    nextcollector.on('end', async i => {
        await interaction.editReply({components:[]})
    })
}




roundAR(ar) {
    
    if (ar>=50) return ar
    else if (ar<=30) return 30
    else if (ar<=35) return 35
    else if (ar<=40) return 40
    else if (ar<=45) return 45
    else if (ar<=49) return 49

}

getRole(ar) {
    ar = parseInt(ar)
    this.available = {
        'test': '1051245108743381002',
        60: '1025772742034862160',
        59: '1025772453605150861',
        58: '942226024983330836',
        57: '925466999105159229',
        56: '925466936391909457',
        55: '925466876430151760',
        54: '925466822856302613',
        53: '925466764576452712',
        52: '925466728387993625',
        51: '925466617746432070',
        50: '925467201199300649',
        49: '925466576684212234',
        45: '925466533558370365',
        40: '925466487995637800',
        35: '925466434946080779',
        30: '925466348660862996'
    }
    return this.available[this.roundAR(ar)]
}

relevantDmgBonus(element) {
    if (element==='Ice') return ['cryoDamage', "Cryo DMG"]
    else if (element==='Wind') return ['anemoDamage', 'Anemo DMG']
    else if (element==='Electric') return ['electroDamage', 'Electro DMG']
    else if (element==='Fire') return ['pyroDamage', 'Pyro DMG']
    else if (element==='Traveler') return ['physicalDamage', 'Phys DMG']
    else if (element==='Rock') return ['geoDamage', 'Geo DMG']
    else if (element==='Water') return ['hydroDamage', 'Hydro DMG']
    else if (element==='Grass') return ['dendroDamage', 'Dendro DMG']
}

async wildToken(message, file) {
    const color = this.tokencolor.color
    const embed = new EmbedBuilder()
        .setAuthor({name: "Katheryne's token roulette: ", iconURL: this.client.user.displayAvatarURL()})
        .setTitle("A token has appeared!")
        .setFields({"name": "Click the button below to win!", "value": "\u200B"})
        .setColor(color)
    const button = new ButtonBuilder()
        .setLabel("Click!")
        .setCustomId("tokenbutton")
        .setStyle(ButtonStyle.Success)
    const actionbutton = new ActionRowBuilder().addComponents(button)
    const reply = await message.channel.send({embeds: [embed], components: [actionbutton]})
    const usercollector = message.channel.createMessageComponentCollector({time: 60000, max:1})

    usercollector.on('collect', async i => {
        if (i.customId==='tokenbutton') {
            const finish = new EmbedBuilder()
                .setAuthor({name: "Katheryne's token roulette: ", iconURL: this.client.user.displayAvatarURL()})
                .setTitle(`${i.user.username}#${i.user.discriminator} Wins!`)
                .setColor(color)
                .setThumbnail(i.user.displayAvatarURL())
                .addFields({"name": "Use /token \"help\" to find out more!", 'value': "\u200B"})
            await reply.edit({embeds: [finish], components: []})
        }
        file[i.user.id].tokens++
        fs.writeFileSync('data.json', JSON.stringify(file))
    })
    
}


get elements() {
    return this.elementList
}


}

module.exports = Akasha