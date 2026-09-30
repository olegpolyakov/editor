import { createCommand, type LexicalCommand } from 'lexical';

export const INSERT_IMAGE_COMMAND: LexicalCommand<File[]> = createCommand('INSERT_IMAGE_COMMAND');
export const INSERT_FILE_COMMAND: LexicalCommand<File[]> = createCommand('INSERT_FILE_COMMAND');
