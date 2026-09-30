import { createContext } from 'react';

import type { Collaborator } from './types';

export type CollaborationContextValue = {
    collaborators: Collaborator[];
    setCollaborators: (collaborators: Collaborator[]) => void;
};

export default createContext<CollaborationContextValue>({
    collaborators: [],
    setCollaborators: () => undefined
});