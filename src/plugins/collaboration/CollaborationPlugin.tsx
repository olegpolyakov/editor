import { type RefObject, useCallback, useContext, useState } from 'react';

import { LexicalCollaboration } from '@lexical/react/LexicalCollaborationContext';
import { CollaborationPlugin as LexicalCollaborationPlugin } from '@lexical/react/LexicalCollaborationPlugin';
import type * as Y from 'yjs';

import CollaborationContext from './CollaborationContext';
import { collaborationColors } from './data';
import { createWebsocketProvider } from './providers';

export type CollaborationPluginOptions = {
    documentId: string;
    websocketUrl: string;
    accessToken: string;
    username: string;
};

export type CollaborationPluginProps = CollaborationPluginOptions & {
    initialEditorState?: string;
    cursorsContainerRef?: RefObject<HTMLElement | null>;
};

export default function CollaborationPlugin({
    documentId,
    websocketUrl,
    accessToken,
    username,
    initialEditorState,
    cursorsContainerRef
}: CollaborationPluginProps) {
    const { setCollaborators } = useContext(CollaborationContext);

    const [cursorColor] = useState(() => {
        const index = Math.floor(Math.random() * collaborationColors.length);
        return collaborationColors[index];
    });

    const providerFactory = useCallback(
        (id: string, yjsDocMap: Map<string, Y.Doc>) => {
            return createWebsocketProvider(id, yjsDocMap, websocketUrl, accessToken, setCollaborators);
        },
        [accessToken, websocketUrl, setCollaborators]
    );

    return (
        <LexicalCollaboration>
            <LexicalCollaborationPlugin
                id={documentId}
                providerFactory={providerFactory}
                initialEditorState={initialEditorState}
                username={username}
                cursorColor={cursorColor}
                cursorsContainerRef={cursorsContainerRef}
                shouldBootstrap
            />
        </LexicalCollaboration>
    );
}