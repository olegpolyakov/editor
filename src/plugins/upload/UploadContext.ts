import { createContext } from 'react';

import type { NodeKey } from 'lexical';

import type { Storage, UploadedAsset, UploadStatus } from './types';

export type UploadContextValue = {
    storage?: Storage<UploadedAsset>;
    statuses: Map<NodeKey, UploadStatus>;
};

export default createContext<UploadContextValue>({
    statuses: new Map()
});