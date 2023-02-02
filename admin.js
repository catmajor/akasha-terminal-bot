const fs = require('fs')
const {Client} = require('discord.js')

class Admin {
    constructor(client, color) {
        this.client = client
        this.color = color
    }

    async role(interaction) {
        await interaction.deferReply({ephemeral: true})
        const who = interaction.options.getUser('who')
        const role = interaction.options.getRole('role')
        return [who, role]
    }

    async addrole(interaction, role = 0, who = 0) {
        let command = false
        if (role===0||who===0) 
        {
            command = true;
            [who, role] = await this.role(interaction)
        }
        let file = JSON.parse(fs.readFileSync('data.json', 'utf-8'))
        try {
            if (role.name.match(/AR/)) {
                await interaction.followUp({content: 'Make sure you delete the appropriate roles after so that shit doesnt break'})
                
            }
            if (file[who.id].regularRoles.some(n => n===role.id)) {
                if (command) await interaction.editReply({content: 'User already has this role', ephemeral: true})
                return
            }
            file[who.id].regularRoles.push(role.id)
            let roles = file[who.id].regularRoles
            if (who.genshinPlayer === true) {
                roles = roles.concat(who.arRole)
             }
            const personRoleManager = await interaction.guild.members.fetch({user: who.id, force: true})
            await personRoleManager.edit({roles: roles})
            if (command) await interaction.editReply({content: "Done!", ephemeral: true})
            fs.writeFileSync('data.json', JSON.stringify(file))

        }
        catch (err) {
            console.log(err)
            if (role===null||who===null) 
            {
                interaction.editReply({content: "Something went wrong", ephemeral: true})
            }
        }
    }

    async removerole(interaction, role = null, who = null) {
        if (role===null||who===null) 
        {
            [who, role] = await this.role(interaction)
        }
        let file = JSON.parse(fs.readFileSync('data.json', 'utf-8'))
        try {
            let index = file[who.id].regularRoles.indexOf(role.id)
            index = file[who.id].genshinPlayer&&role.id===file[who.id].arRole?"arRole":index
            if (index === -1) {
                interaction.editReply({content: "User does not have this role", ephemeral: true})
                return
            }
            if (index==="arRole") {
                file[who.id].arRole = undefined
                file[who.id].genshinPlayer = false
            } else {
                file[who.id].regularRoles.splice(index, 1)
            }
            let roles = file[who.id].regularRoles
            if (who.genshinPlayer === true) {
                roles = roles.concat(who.arRole)
             }
            const personRoleManager = await interaction.guild.members.fetch({user: who.id, force: true})
            await personRoleManager.edit({roles: roles})
            await interaction.editReply({content: "Done!", ephemeral: true})
            fs.writeFileSync('data.json', JSON.stringify(file))

        }
        catch (err) {
            console.log(err)
            if (role===null||who===null) 
            {
                interaction.editReply({content: "Something went wrong", ephemeral: true})
            }
            
        }
    }
}

module.exports = Admin