import {MuseLocale} from './.locale';
import {baseLocale} from './base.locale';
import {Snowflake} from 'discord.js';
import {Settings} from '../models';
import {udanyLocale} from './udany.locale';

const locales: Record<string, MuseLocale> = {
  base: baseLocale,
  udany: udanyLocale
};

export async function getLocale(guildId: Snowflake): Promise<MuseLocale> {
  let settings = await Settings.findByPk(guildId);
  let locale = settings?.locale ?? 'base';

  if (locales[locale]) {
    return locales[locale];
  }

  return locales.base;
}
