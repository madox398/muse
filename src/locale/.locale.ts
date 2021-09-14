import {QueuedSong} from '../services/player';

export interface MuseLocale {
  loadingMessageIcons: string[];
  loadingMessage: string;
  doneMessage: string;
  leaveMessage: string;

  addedSongsMessage: (songs: QueuedSong[], addToFrontOfQueue: boolean, extraMsg: string) => string;

  skipMessage: (skipCount: number) => string
}
