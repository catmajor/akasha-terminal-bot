const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const { cp } = require('fs');
require('dotenv/config')


const info = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('get info about a user')
        .addUserOption(option => option.setName('who')
        .setDescription('which user? Type in value as if you were going to ping them')
        .setRequired(true))
        .addStringOption(option => option.setName('data')
        .setDescription('specify the unit of data to find out')
        .addChoices(
            {name: 'person\'s name', value: 'name'},
            {name: 'person\'s uid', value: 'uid'}
        )
        .setRequired(true))
}
const register = {
    data: new SlashCommandBuilder()
    .setName('register')
    .setDescription('register to the server!')}
const commands=  []


commands.push(info.data.toJSON())
commands.push(register.data.toJSON())


console.log(commands)
const rest = new REST({version:'10'}).setToken(process.env.TOKEN)

const run = async () => {
    try {
      console.log('Started refreshing application (/) commands.');
  
      await rest.put(Routes.applicationGuildCommands('1021065405810364477', '1021063876097351740'), { body: commands });
  
      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    }
  }

  run()