import {MuseLocale} from './.locale';
import {QueuedSong} from '../services/player';

export const baseLocale: MuseLocale = {
  loadingMessage: 'cows! count \'em',
  loadingMessageIcons: ['🐮', '🐴', '🐄'],
  doneMessage: 'u betcha',
  leaveMessage: 'u betcha',

  addedSongsMessage: (songs: QueuedSong[], addToFrontOfQueue: boolean, extraMsg: string) => {
    const firstSong = songs[0];

    if (songs.length === 1) {
      return `u betcha, **${firstSong.title}** added to the${addToFrontOfQueue ? ' front of the' : ''} queue${extraMsg}`;
    }

    return `u betcha, **${firstSong.title}** and ${songs.length - 1} other songs were added to the queue${extraMsg}`;
  },

  skipMessage: () => 'keep \'er movin\''
};
