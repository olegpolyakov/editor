import { type JSX, useContext } from 'react';

import {
    DecoratorNode,
    type EditorConfig,
    type LexicalNode,
    type NodeKey,
    type SerializedLexicalNode,
    type Spread
} from 'lexical';

import { Image, Spinner } from '@olegpolyakov/ui';

import type { UploadedAsset } from '../types';
import UploadContext from '../UploadContext';

import styles from './ImageNode.module.scss';

export type SerializedImageNode = Spread<{
    type: 'image';
    version: 1;
    asset: UploadedAsset;
    altText: string;
}, SerializedLexicalNode>;

export class ImageNode extends DecoratorNode<JSX.Element> {
    __asset: UploadedAsset;
    __altText: string;

    static getType(): string {
        return 'image';
    }

    static clone(node: ImageNode): ImageNode {
        return new ImageNode(node.__asset, node.__altText, node.__key);
    }

    static importJSON(serializedNode: SerializedImageNode): ImageNode {
        return $createImageNode(serializedNode.asset, serializedNode.altText);
    }

    constructor(asset: UploadedAsset, altText = '', key?: NodeKey) {
        super(key);
        this.__asset = asset;
        this.__altText = altText;
    }

    exportJSON(): SerializedImageNode {
        return {
            ...super.exportJSON(),
            type: 'image',
            version: 1,
            asset: this.__asset,
            altText: this.__altText
        };
    }

    createDOM(config: EditorConfig): HTMLElement {
        const element = document.createElement('span');
        element.className = config.theme.image ?? '';
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
        return (
            <ImageComponent
                nodeKey={this.getKey()}
                asset={this.__asset}
                altText={this.__altText}
            />
        );
    }
}

function ImageComponent({
    nodeKey,
    asset,
    altText
}: {
    nodeKey: NodeKey;
    asset: UploadedAsset;
    altText: string;
}) {
    const { statuses } = useContext(UploadContext);
    const status = statuses.get(nodeKey);

    return (
        <span className={styles.root}>
            <Image
                className={styles.image}
                src={asset.previewSrc || asset.src}
                alt={altText}
            />

            {status?.state === 'uploading' &&
                <span className={styles.overlay}>
                    <Spinner size="s" />
                </span>
            }

            {status?.state === 'error' &&
                <span className={styles.error} role="alert">
                    {status.error || 'Upload failed'}
                </span>
            }
        </span>
    );
}

export function $createImageNode(asset: UploadedAsset, altText = ''): ImageNode {
    return new ImageNode(asset, altText);
}

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
    return node instanceof ImageNode;
}
