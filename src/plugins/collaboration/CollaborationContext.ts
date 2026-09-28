import { createContext } from 'react';

import type { ConnectedUser } from './types';

export type CollaborationContextValue = {
    users: ConnectedUser[];
    setUsers: (users: ConnectedUser[]) => void;
};

export default createContext<CollaborationContextValue>({
    users: [],
    setUsers: () => undefined
});