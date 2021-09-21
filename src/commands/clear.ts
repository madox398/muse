import {Message} from 'discord.js';
import {TYPES} from '../types';
import {inject, injectable} from 'inversify';
import PlayerManager from '../managers/player';
import Command from '.';

@injectable()
export default class implements Command {
  public name = 'clear';
  public aliases = ['c'];
  public examples = [
    ['clear', 'usuwa wszystkie utwory z kolejki oprócz aktualnie odtwarzanego']
  ];

  public requiresVC = true;

  private readonly playerManager: PlayerManager;

  constructor(@inject(TYPES.Managers.Player) playerManager: PlayerManager) {
    this.playerManager = playerManager;
  }

  public async execute(msg: Message, _: string []): Promise<void> {
    this.playerManager.get(msg.guild!.id).clear();

    await msg.channel.send('już wyczyszczone szefie');
  }
}
