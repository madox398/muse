import {MuseLocale} from './.locale';
import {baseLocale} from './base.locale';
import {QueuedSong} from '../services/player';

export const udanyLocale: MuseLocale = {
  ...baseLocale,
  loadingMessage: '...',
  loadingMessageIcons: ['✨', '💖', '💟'],
  doneMessage: 'All good! ✔',
  leaveMessage: 'Bye 😘 💕',

  addedSongsMessage: (songs: QueuedSong[], addToFrontOfQueue: boolean, extraMsg: string) => {
    const firstSong = songs[0];
    const icon = `${addToFrontOfQueue ? '🆙' : '✅ '}`;

    if (songs.length === 1) {
      return `${icon} **${firstSong.title}**${extraMsg}`;
    }

    const moreSongs = songs.length - 1;

    return `${icon} **${firstSong.title}** and ${moreSongs} more song${moreSongs > 1 ? 's' : ''}${extraMsg}`;
  },

  skipMessage: (skipCount: number) => `⏭ ${skipCount}`
};
