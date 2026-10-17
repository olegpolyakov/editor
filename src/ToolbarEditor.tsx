import { useRef, useState } from 'react';

import { defineExtension, type EditorThemeClasses, type SerializedEditorState, type SerializedLexicalNode } from 'lexical';
import { CodeExtension, CodeIndentExtension } from '@lexical/code';
import { TabIndentationExtension } from '@lexical/extension';
import { HistoryExtension } from '@lexical/history';
import { CheckListExtension, ListExtension } from '@lexical/list';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalExtensionComposer } from '@lexical/react/LexicalExtensionComposer';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextExtension } from '@lexical/rich-text';

import cn from '@olegpolyakov/frontend/helpers/classnames';

import CollaborationPlugin, {
    CollaborationContext,
    type CollaborationPluginOptions,
    CollaborationToolbar,
    type Collaborator
} from './plugins/collaboration';
import ToolbarPlugin, { ToolbarPluginOptions } from './plugins/toolbar';
import UploadPlugin, { FileNode, ImageNode, type Storage, UploadToolbar } from './plugins/upload';

import styles from './ToolbarEditor.module.scss';

const theme: EditorThemeClasses = {
    heading: {
        h1: styles.heading1,
        h2: styles.heading2,
        h3: styles.heading3
    },
    paragraph: styles.paragraph,
    quote:
    'my-2 border-l-4 [border-left-style:solid] border-zinc-300 pl-4 italic text-zinc-500 dark:border-zinc-600 dark:text-zinc-400',
    list: {
        ol: styles.orderedList,
        olDepth: [
            styles.orderedList1,
            styles.orderedList2,
            styles.orderedList3,
            styles.orderedList4,
            styles.orderedList5
        ],
        ul: styles.unorderedList,
        listitem: styles.listItem,
        listitemChecked: styles.listItemChecked,
        listitemUnchecked: styles.listItemUnchecked,
        nested: {
            listitem: styles.listItemNested
        }
    },
    code: styles.code,
    text: {
        bold: styles.bold,
        italic: styles.italic,
        underline: styles.underline
    }
};

export type EditorState = SerializedEditorState<SerializedLexicalNode>;

export type { ToolbarPluginOptions };
export type { Collaborator } from './plugins/collaboration';
export type { Storage, UploadedAsset } from './plugins/upload';

export default function ToolbarEditor({
    initialState,
    compact,
    toolbar,
    collaboration,
    storage,
    onChange
}: {
    initialState?: EditorState;
    compact?: boolean;
    toolbar?: ToolbarPluginOptions;
    collaboration?: CollaborationPluginOptions;
    storage?: Storage;
    onChange?: (state: EditorState) => void
}) {
    const [extension] = useState(() => defineExtension({
        dependencies: [
            RichTextExtension,
            CodeExtension,
            CodeIndentExtension,
            ListExtension,
            CheckListExtension,
            HistoryExtension,
            TabIndentationExtension
        ],
        name: '@olegpolyakov/editor/toolbar',
        namespace: '@olegpolyakov/editor',
        nodes: [ImageNode, FileNode],
        theme,
        $initialEditorState: editor => {
            if (collaboration || !initialState) return;

            const state = editor.parseEditorState(initialState);
            editor.setEditorState(state, { tag: 'init' });
        }
    }));

    const cursorsContainerRef = useRef<HTMLDivElement>(null);
    const [users, setUsers] = useState<Collaborator[]>([]);

    return (
        <LexicalExtensionComposer
            extension={extension}
            contentEditable={null}
        >
            <CollaborationContext value={{ collaborators: users, setCollaborators: setUsers }}>
                <UploadPlugin storage={storage}>
                    <div className={cn(styles.root, compact && styles.compact)}>
                        <ToolbarPlugin
                            compact={compact}
                            options={toolbar}
                        >
                            {collaboration && <CollaborationToolbar />}
                            {storage && <UploadToolbar />}
                        </ToolbarPlugin>

                        <div
                            ref={cursorsContainerRef}
                            className={styles.body}
                        >
                            <ContentEditable
                                className={styles.content}
                                placeholder={
                                    <div className={styles.placeholder}>
                                        Enter some text...
                                    </div>
                                }
                                aria-label="Rich text editor"
                                aria-placeholder="Enter some text..."
                            />
                        </div>
                    </div>

                    {collaboration ? (
                        <CollaborationPlugin
                            {...collaboration}
                            initialEditorState={initialState ? JSON.stringify(initialState) : undefined}
                            cursorsContainerRef={cursorsContainerRef}
                        />
                    ) : (
                        <OnChangePlugin onChange={editorState => onChange?.(editorState.toJSON())} />
                    )}
                </UploadPlugin>
            </CollaborationContext>
        </LexicalExtensionComposer>
    );
}