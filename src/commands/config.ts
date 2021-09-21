import {TextChannel, Message, GuildChannel} from 'discord.js';
import {injectable} from 'inversify';
import {Settings} from '../models';
import errorMsg from '../utils/error-msg';
import Command from '.';

@injectable()
export default class implements Command {
  public name = 'config';
  public aliases = [];
  public examples = [
    ['config prefix !', 'ustawia prefix na !'],
    ['config channel music-commands', 'powiązanie bota z kanałem `music-commands`']
  ];

  public async execute(msg: Message, args: string []): Promise<void> {
    if (args.length === 0) {
      // Show current settings
      const settings = await Settings.findByPk(msg.guild!.id);

      if (settings) {
        let response = `prefix: \`${settings.prefix}\`\n`;
        response += `channel: ${msg.guild!.channels.cache.get(settings.channel)!.toString()}`;

        await msg.channel.send(response);
      }

      return;
    }

    const setting = args[0];

    if (args.length !== 2) {
      await msg.channel.send(errorMsg('nieprawidłowa liczba argumentów'));
      return;
    }

    if (msg.author.id !== msg.guild!.owner!.id) {
      await msg.channel.send(errorMsg('nie Ty jesteś właścicielem serwera'));
      return;
    }

    switch (setting) {
      case 'prefix': {
        const newPrefix = args[1];

        await Settings.update({prefix: newPrefix}, {where: {guildId: msg.guild!.id}});

        await msg.channel.send(`👍 prefix updated to \`${newPrefix}\``);
        break;
      }

      case 'channel': {
        let channel: GuildChannel | undefined;

        if (args[1].includes('<#') && args[1].includes('>')) {
          channel = msg.guild!.channels.cache.find(c => c.id === args[1].slice(2, args[1].indexOf('>')));
        } else {
          channel = msg.guild!.channels.cache.find(c => c.name === args[1]);
        }

        if (channel && channel.type === 'text') {
          await Settings.update({channel: channel.id}, {where: {guildId: msg.guild!.id}});

          await Promise.all([
            (channel as TextChannel).send('Teraz tutaj nasłuchuję komend'),
            msg.react('👍')
          ]);
        } else {
          await msg.channel.send(errorMsg('albo ten kanał nie istnieje, albo chcesz, żebym stał się czuły i słuchał kanału głosowego.'));
        }

        break;
      }

      default:
        await msg.channel.send(errorMsg('Nigdy w życiu nie spotkałem się z takim ustawieniem.'));
    }
  }
}
