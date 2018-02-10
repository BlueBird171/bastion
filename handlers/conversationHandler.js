/**
 * @file conversationHandler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const CLEVERBOT = require('cleverbot-node');
const CREDENTIALS = require('../settings/credentials.json');
const BOT = new CLEVERBOT;
BOT.configure({
  botapi: CREDENTIALS.cleverbotAPIkey
});

/**
 * Handles conversations with Bastion
 * @param {Message} message Discord.js message object
 * @returns {void}
 */
module.exports = async message => {
  try {
    if (message.content.length <= `${message.client.user}  `.length) return;

    let guild = await message.client.db.get(`SELECT chat FROM guildSettings WHERE guildID=${message.guild.id}`);
    if (!guild.chat) return;

    BOT.write(message.content, response => {
      if (response.output) {
        message.channel.startTyping();
        setTimeout(async () => {
          try {
            message.channel.stopTyping(true);
            await message.channel.send(response.output);
          }
          catch (e) {
            message.client.log.error(e);
          }
        }, response.output.length * 100);
      }
    });
  }
  catch (e) {
    message.client.log.error(e);
  }
};
