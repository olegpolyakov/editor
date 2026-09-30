import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { DRAG_DROP_PASTE } from '@lexical/rich-text';
import { mergeRegister } from '@lexical/utils';
import {
    $getNodeByKey,
    $insertNodes,
    COMMAND_PRIORITY_EDITOR,
    COMMAND_PRIORITY_LOW,
    type NodeKey
} from 'lexical';

import { INSERT_FILE_COMMAND, INSERT_IMAGE_COMMAND } from './commands';
import { $createFileNode, FileNode } from './nodes/FileNode';
import { $createImageNode, ImageNode } from './nodes/ImageNode';
import type { Storage, UploadedAsset, UploadStatus } from './types';
import UploadContext from './UploadContext';

export type UploadPluginProps = {
    storage?: Storage;
    children?: ReactNode;
};

export default function UploadPlugin({ storage, children }: UploadPluginProps) {
    const [editor] = useLexicalComposerContext();

    const [statuses, setStatuses] = useState<Map<NodeKey, UploadStatus>>(() => new Map());

    // keeps the resolved asset for a node so it can be passed to storage.delete() once the node is removed
    const assetsByKey = useRef<Map<NodeKey, UploadedAsset>>(new Map());

    const setStatus = useCallback((key: NodeKey, status: UploadStatus | undefined) => {
        setStatuses(prev => {
            const next = new Map(prev);

            if (status) next.set(key, status);
            else next.delete(key);

            return next;
        });
    }, []);

    const uploadFile = useCallback((file: File, createNode: (asset: UploadedAsset) => ImageNode | FileNode) => {
        if (!storage) return;

        const objectUrl = URL.createObjectURL(file);
        const placeholderAsset: UploadedAsset = {
            id: objectUrl,
            src: objectUrl,
            previewSrc: objectUrl,
            filename: file.name,
            size: file.size,
            contentType: file.type
        };

        let nodeKey: NodeKey | undefined;

        editor.update(() => {
            const node = createNode(placeholderAsset);
            nodeKey = node.getKey();
            $insertNodes([node]);
        });

        if (!nodeKey) return;

        assetsByKey.current.set(nodeKey, placeholderAsset);
        setStatus(nodeKey, { state: 'uploading' });

        storage.upload(file)
            .then(asset => {
                assetsByKey.current.set(nodeKey!, asset);
                setStatus(nodeKey!, { state: 'done' });
                URL.revokeObjectURL(objectUrl);

                editor.update(() => {
                    const node = $getNodeByKey(nodeKey!);

                    if (
                        node instanceof ImageNode ||
                        node instanceof FileNode
                    ) {
                        node.setAsset(asset);
                    }
                });
            })
            .catch((error: Error) => {
                setStatus(nodeKey!, {
                    state: 'error',
                    error: error.message
                });
            });
    }, [editor, setStatus, storage]);

    useEffect(() => {
        function cleanupNode(key: NodeKey, mutation: string) {
            if (mutation !== 'destroyed') return;

            const asset = assetsByKey.current.get(key);
            assetsByKey.current.delete(key);
            setStatus(key, undefined);

            if (asset && storage) {
                storage.delete(asset);
            }
        }

        return mergeRegister(
            editor.registerCommand(
                INSERT_IMAGE_COMMAND,
                files => {
                    files.forEach(file => uploadFile(file, asset => $createImageNode(asset)));
                    return true;
                },
                COMMAND_PRIORITY_EDITOR
            ),
            editor.registerCommand(
                INSERT_FILE_COMMAND,
                files => {
                    files.forEach(file => uploadFile(file, asset => $createFileNode(asset)));
                    return true;
                },
                COMMAND_PRIORITY_EDITOR
            ),
            editor.registerCommand(
                DRAG_DROP_PASTE,
                files => {
                    const images = files.filter(file => file.type.startsWith('image/'));
                    const rest = files.filter(file => !file.type.startsWith('image/'));

                    if (images.length) editor.dispatchCommand(INSERT_IMAGE_COMMAND, images);
                    if (rest.length) editor.dispatchCommand(INSERT_FILE_COMMAND, rest);

                    return true;
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerMutationListener(ImageNode, mutations => {
                mutations.forEach((mutation, key) => cleanupNode(key, mutation));
            }),
            editor.registerMutationListener(FileNode, mutations => {
                mutations.forEach((mutation, key) => cleanupNode(key, mutation));
            })
        );
    }, [editor, setStatus, storage, uploadFile]);

    const contextValue = useMemo(() => ({ storage, statuses }), [storage, statuses]);

    return (
        <UploadContext value={contextValue}>
            {children}
        </UploadContext>
    );
}