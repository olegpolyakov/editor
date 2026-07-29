import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { ToolbarEditor } from './helpers';

export default function useToolbarEditor() {
    const [editor] = useLexicalComposerContext();

    return new ToolbarEditor(editor);
}