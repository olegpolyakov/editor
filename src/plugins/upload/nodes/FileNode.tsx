import { type JSX, useContext } from 'react';

import {
    DecoratorNode,
    type EditorConfig,
    type LexicalNode,
    type NodeKey,
    type SerializedLexicalNode,
    type Spread
} from 'lexical';

import { Pill, Spinner } from '@olegpolyakov/ui';

import { formatFileSize } from '../helpers';
import type { UploadedAsset } from '../types';
import UploadContext from '../UploadContext';

import styles from './FileNode.module.scss';

export type SerializedFileNode = Spread<{
    type: 'file';
    version: 1;
    asset: UploadedAsset;
}, SerializedLexicalNode>;

export class FileNode extends DecoratorNode<JSX.Element> {
    __asset: UploadedAsset;

    static getType(): string {
        return 'file';
    }

    static clone(node: FileNode): FileNode {
        return new FileNode(node.__asset, node.__key);
    }

    static importJSON(serializedNode: SerializedFileNode): FileNode {
        return $createFileNode(serializedNode.asset);
    }

    constructor(asset: UploadedAsset, key?: NodeKey) {
        super(key);
        this.__asset = asset;
    }

    exportJSON(): SerializedFileNode {
        return {
            ...super.exportJSON(),
            type: 'file',
            version: 1,
            asset: this.__asset
        };
    }

    createDOM(config: EditorConfig): HTMLElement {
        const element = document.createElement('span');
        element.className = config.theme.file ?? '';
        return element;
    }

    updateDOM(): false {
        return false;
    }

    getAsset(): UploadedAsset {
        return this.__asset;
    }

    setAsset(asset: UploadedAsset): void {
        this.getWritable().__asset = asset;
    }

    decorate(): JSX.Element {
        return <FileComponent
            nodeKey={this.getKey()}
            asset={this.__asset}
        />;
    }
}

function FileComponent({ nodeKey, asset }: { nodeKey: NodeKey; asset: UploadedAsset }) {
    const { statuses } = useContext(UploadContext);
    const status = statuses.get(nodeKey);
    const uploading = status?.state === 'uploading';

    return (
        <span className={styles.root}>
            <Pill
                as="a"
                href={asset.src}
                download={asset.filename}
                icon={uploading ? undefined : 'attach_file'}
                start={uploading && <Spinner size="xs" />}
                content={`${asset.filename} (${formatFileSize(asset.size)})`}
                interactive
            />

            {status?.state === 'error' &&
                <span
                    className={styles.error}
                    role="alert"
                >
                    {status.error || 'Upload failed'}
                </span>
            }
        </span>
    );
}

export function $createFileNode(asset: UploadedAsset): FileNode {
    return new FileNode(asset);
}

export function $isFileNode(node: LexicalNode | null | undefined): node is FileNode {
    return node instanceof FileNode;
}
