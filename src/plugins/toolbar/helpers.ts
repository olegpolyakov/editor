import {
    INSERT_CHECK_LIST_COMMAND,
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND
} from '@lexical/list';
import {
    $createHeadingNode,
    $createQuoteNode
} from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import {
    $createParagraphNode,
    $getSelection,
    type CommandListener,
    type CommandListenerPriority,
    type CommandListenerPriorityBefore,
    FORMAT_ELEMENT_COMMAND,
    FORMAT_TEXT_COMMAND,
    type LexicalCommand,
    type LexicalEditor,
    REDO_COMMAND,
    UNDO_COMMAND
} from 'lexical';

export class ToolbarEditor {
    private editor: LexicalEditor;

    constructor(editor: LexicalEditor) {
        this.editor = editor;
    }

    setBlockType(type: string) {
        if (type === 'paragraph') {
            formatParagraph(this.editor);
        } else if (type === 'quote') {
            formatQuote(this.editor);
        } else {
            formatHeading(this.editor, type as 'h1' | 'h2' | 'h3');
        }
    }

    undo() {
        this.editor.dispatchCommand(UNDO_COMMAND, undefined);
    }

    redo() {
        this.editor.dispatchCommand(REDO_COMMAND, undefined);
    }

    bold() {
        this.editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
    }

    italic() {
        this.editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
    }

    underline() {
        this.editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
    }

    alignLeft() {
        this.editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
    }

    alignCenter() {
        this.editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
    }

    alignRight() {
        this.editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
    }

    alignJustify() {
        this.editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
    }

    insertUnorderedList() {
        this.editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    }

    insertOrderedList() {
        this.editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }

    insertCheckList() {
        this.editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    }

    registerCommand<T = unknown>(
        command: LexicalCommand<T>,
        listener: CommandListener<T>,
        priority: CommandListenerPriority | CommandListenerPriorityBefore
    ): () => void {
        return this.editor.registerCommand(command, listener, priority);
    }

    onUpdate(fn: () => void) {
        return this.editor.registerUpdateListener(({ editorState, prevEditorState, tags }) => {
            console.log('UPDATE', prevEditorState, tags);
            editorState.read(
                () => {
                    fn();
                },
                { editor: this.editor }
            );
        });
    }
}

export function formatParagraph(editor: LexicalEditor) {
    editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createParagraphNode());
    });
}

export function formatHeading(editor: LexicalEditor, headingTag: 'h1' | 'h2' | 'h3') {
    editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createHeadingNode(headingTag));
    });
}

export function formatQuote(editor: LexicalEditor) {
    editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createQuoteNode());
    });
}
