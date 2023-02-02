const { REST, Routes, SlashCommandBuilder, ContextMenuCommandBuilder, ApplicationCommandType, PermissionFlagsBits } = require('discord.js');
const { cp } = require('fs');
const commands=  []
require('dotenv/config')


const info = new SlashCommandBuilder()
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

const register = new SlashCommandBuilder()
    .setName('register')
    .setDescription('register/update info')

const contextmenuinfo = new ContextMenuCommandBuilder()
	.setName('User Information')
	.setType(ApplicationCommandType.User)


const profile = new SlashCommandBuilder()
    .setName('profile')
    .setDescription('get the full profile of a person including character stats of those on display if enabled')
    .addUserOption(option => option
        .setName('who')
        .setDescription('Tag of the person')
        .setRequired(true)
        )


const update = new SlashCommandBuilder()
      .setName('update')
      .setDescription('update your roles')

const token = new SlashCommandBuilder()
      .setName("token")
      .setDescription("Cool things that you can spend tokens on i guess")

      .addSubcommand(command => command.setName('help')
        .setDescription('help with tokens'))

      .addSubcommand(subcommand => subcommand.setName('shop')
        .setDescription('view all things that you can buy with tokens'))

      .addSubcommand(command => command.setName('balance')
        .setDescription('Get your balance'))

      .addSubcommand(subcommand => subcommand.setName('colorchange')
        .setDescription('Change color')
        .addRoleOption(option => option.setName('role')
          .setName('role')
          .setDescription('name of the role you want to change')
          .setRequired(true))
        .addStringOption(option => option.setName('color')
          .setName('color')
          .setDescription('color in hex')
          .setRequired(true)))
        
const giverole = new SlashCommandBuilder()
      .setName('giveroles')
      .setDescription('you know what this does')
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
      .addUserOption(option => option
        .setName('who')
        .setDescription('aaaaa')
        .setRequired(true))
      .addRoleOption(option => option
        .setName('role')
        .setDescription('aaaaaaaa')
        .setRequired(true))

const removerole = new SlashCommandBuilder()
      .setName('removeroles')
      .setDescription('you know what this does')
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
      .addUserOption(option => option
        .setName('who')
        .setDescription('aaaaa')
        .setRequired(true))
      .addRoleOption(option => option
        .setName('role')
        .setDescription('aaaaaaaa')
        .setRequired(true))


const test = new SlashCommandBuilder()
    .setName('test')
    .setDescription('test')
    .addStringOption(option => option.setName('test').setDescription('test'))

commands.push(info.toJSON())
commands.push(register.toJSON())
commands.push(contextmenuinfo.toJSON())
commands.push(profile.toJSON())
commands.push(test.toJSON())
commands.push(update.toJSON())
commands.push(token.toJSON())
commands.push(giverole.toJSON())
commands.push(removerole.toJSON())

console.log(commands)
const rest = new REST({version:'10'}).setToken(process.env.TOKEN)

const run = async () => {
    try {
      console.log('Started refreshing application (/) commands.');
    //katheryne id 927720261879496724
    //akasha id 1021065405810364477
      await rest.put(Routes.applicationGuildCommands('927720261879496724', '925465107264315452'), { body: commands });
  
      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    }
  }

  run()