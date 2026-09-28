import type { Provider } from '@lexical/yjs';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

import type { ConnectedUser } from './types';

export function createWebsocketProvider(
    id: string,
    yjsDocMap: Map<string, Y.Doc>,
    websocketUrl: string,
    accessToken: string,
    onUsersChange: (users: ConnectedUser[]) => void
): Provider {
    const doc = getDocFromMap(id, yjsDocMap);
    const provider = new WebsocketProvider(websocketUrl, id, doc, {
        params: { token: accessToken }
    });

    const publishUsers = () => {
        const users = [...provider.awareness.getStates()].flatMap(([clientId, state]) => {
            const user = {
                clientId,
                name: state.name,
                color: state.color
            } as ConnectedUser;

            return user.name && user.color
                ? [user]
                : [];
        });

        onUsersChange?.(users);
    };

    provider.awareness.on('change', publishUsers);
    publishUsers();

    return provider as unknown as Provider;
}

function getDocFromMap(id: string, yjsDocMap: Map<string, Y.Doc>): Y.Doc {
    let doc = yjsDocMap.get(id);

    if (doc === undefined) {
        doc = new Y.Doc();
        yjsDocMap.set(id, doc);
    }

    return doc;
}
