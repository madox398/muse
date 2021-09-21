import {Message} from 'discord.js';
import {TYPES} from '../types';
import {inject, injectable} from 'inversify';
import PlayerManager from '../managers/player';
import {STATUS} from '../services/player';
import errorMsg from '../utils/error-msg';
import Command from '.';

@injectable()
export default class implements Command {
  public name = 'pause';
  public aliases = [];
  public examples = [
    ['pause', 'wstrzymuje aktualnie odtwarzany utwór']
  ];

  public requiresVC = true;

  private readonly playerManager: PlayerManager;

  constructor(@inject(TYPES.Managers.Player) playerManager: PlayerManager) {
    this.playerManager = playerManager;
  }

  public async execute(msg: Message, _: string []): Promise<void> {
    const player = this.playerManager.get(msg.guild!.id);

    if (player.status !== STATUS.PLAYING) {
      await msg.channel.send(errorMsg('nic nie jest odtwarzane'));
      return;
    }

    player.pause();
    await msg.channel.send('wstrzymano');
  }
}
