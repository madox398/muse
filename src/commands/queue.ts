import {Message, MessageEmbed} from 'discord.js';
import {TYPES} from '../types';
import {inject, injectable} from 'inversify';
import PlayerManager from '../managers/player';
import {STATUS} from '../services/player';
import Command from '.';
import getProgressBar from '../utils/get-progress-bar';
import errorMsg from '../utils/error-msg';
import {prettyTime} from '../utils/time';
import getYouTubeID from 'get-youtube-id';

const PAGE_SIZE = 10;

@injectable()
export default class implements Command {
  public name = 'queue';
  public aliases = ['q'];
  public examples = [
    ['queue', 'pokaż obecną kolejkę'],
    ['queue 2', 'pokaż drugą stronę kolejki']
  ];

  private readonly playerManager: PlayerManager;

  constructor(@inject(TYPES.Managers.Player) playerManager: PlayerManager) {
    this.playerManager = playerManager;
  }

  public async execute(msg: Message, args: string []): Promise<void> {
    const player = this.playerManager.get(msg.guild!.id);

    const currentlyPlaying = player.getCurrent();

    if (currentlyPlaying) {
      const queueSize = player.queueSize();
      const queuePage = args[0] ? parseInt(args[0], 10) : 1;

      const maxQueuePage = Math.ceil((queueSize + 1) / PAGE_SIZE);

      if (queuePage > maxQueuePage) {
        await msg.channel.send(errorMsg('kolejka nie jest aż tak duża'));
        return;
      }

      const embed = new MessageEmbed();

      embed.setTitle(currentlyPlaying.title);
      embed.setURL(`https://www.youtube.com/watch?v=${currentlyPlaying.url.length === 11 ? currentlyPlaying.url : getYouTubeID(currentlyPlaying.url) ?? ''}`);

      let description = player.status === STATUS.PLAYING ? '⏹️' : '▶️';
      description += ' ';
      description += getProgressBar(20, player.getPosition() / currentlyPlaying.length);
      description += ' ';
      description += `\`[${prettyTime(player.getPosition())}/${currentlyPlaying.isLive ? ' na' : prettyTime(currentlyPlaying.length)}]\``;
      description += ' 🔉';
      description += player.isQueueEmpty() ? '' : '\n\n**Nastepne:**';

      embed.setDescription(description);

      let footer = `Source: ${currentlyPlaying.artist}`;

      if (currentlyPlaying.playlist) {
        footer += ` (${currentlyPlaying.playlist.title})`;
      }

      embed.setFooter(footer);

      const queuePageBegin = (queuePage - 1) * PAGE_SIZE;
      const queuePageEnd = queuePageBegin + PAGE_SIZE;

      player.getQueue().slice(queuePageBegin, queuePageEnd).forEach((song, i) => {
        embed.addField(`${(i + 1 + queuePageBegin).toString()}/${queueSize.toString()}`, song.title, false);
      });

      embed.addField('Page', `${queuePage} out of ${maxQueuePage}`, false);

      await msg.channel.send(embed);
    } else {
      await msg.channel.send('kolejka jest pusta');
    }
  }
}
