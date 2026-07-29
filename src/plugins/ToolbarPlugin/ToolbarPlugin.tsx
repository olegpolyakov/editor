import { useCallback, useEffect, useState } from 'react';

import { $isListNode } from '@lexical/list';
import { $isHeadingNode } from '@lexical/rich-text';
import { $findMatchingParent, mergeRegister } from '@lexical/utils';
import {
    $getSelection,
    $isRangeSelection,
    $isRootOrShadowRoot,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    COMMAND_PRIORITY_LOW
} from 'lexical';

import BlockType from './components/BlockType';
import History from './components/History';
import Lists from './components/Lists';
import TextAlignment from './components/TextAlignment';
import TextFormat from './components/TextFormat';
import Toolbar from './Toolbar';
import useToolbarEditor from './useToolbarEditor';

export type ToolbarPluginOptions = {
    hideBlockType?: boolean;
    hideHistory?: boolean;
    hideLists?: boolean;
    hideTextFormat?: boolean;
    hideTextAlignment?: boolean;
};

export default function ToolbarPlugin({
    compact,
    options = {}
}: {
    compact?: boolean;
    options?: ToolbarPluginOptions;
}) {
    const editor = useToolbarEditor();

    const [blockType, setBlockType] = useState('paragraph');
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);

    const $updateToolbar = useCallback(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
            const anchorNode = selection.anchor.getNode();

            if ($isRootOrShadowRoot(anchorNode)) {
                return null;
            }

            let topLevelElement = $findMatchingParent(anchorNode, node => {
                const parent = node.getParent();
                return parent !== null && $isRootOrShadowRoot(parent);
            });

            if (topLevelElement === null) {
                topLevelElement = anchorNode.getTopLevelElementOrThrow();
            }

            if ($isHeadingNode(topLevelElement)) {
                setBlockType(topLevelElement.getTag());
            } else if ($isListNode(topLevelElement)) {
                const type = topLevelElement.getListType();
                setBlockType(`${type}List`);
            } else {
                setBlockType(topLevelElement.getType());
            }

            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
        }
    }, []);

    useEffect(() => {
        return mergeRegister(
            editor.onUpdate(() => $updateToolbar()),

            // TODO Move to history component
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                payload => {
                    setCanUndo(payload);
                    return false;
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                CAN_REDO_COMMAND,
                payload => {
                    setCanRedo(payload);
                    return false;
                },
                COMMAND_PRIORITY_LOW
            )
        );
    }, [editor, $updateToolbar]);

    const {
        hideBlockType = false,
        hideHistory = false,
        hideLists = false,
        hideTextAlignment = false,
        hideTextFormat = false
    } = options;

    return (
        <Toolbar compact={compact}>
            {!hideBlockType &&
                <BlockType
                    value={blockType}
                    onChange={blockType => editor.setBlockType(blockType)}
                />
            }
            
            {!hideHistory && 
                <History
                    canRedo={canRedo}
                    canUndo={canUndo}
                    onRedo={() => editor.redo()}
                    onUndo={() => editor.undo()}
                />
            }

            {!hideTextFormat && 
                <TextFormat
                    isBold={isBold}
                    isItalic={isItalic}
                    isUnderline={isUnderline}
                    onBold={() => editor.bold()}
                    onItalic={() => editor.italic()}
                    onUnderline={() => editor.underline()}
                />
            }

            {!hideTextAlignment &&
                <TextAlignment
                    onAlignLeft={() => editor.alignLeft()}
                    onAlignCenter={() => editor.alignCenter()}
                    onAlignRight={() => editor.alignRight()}
                    onAlignJustify={() => editor.alignLeft()}
                />
            }

            {!hideLists &&
                <Lists
                    onOrderedList={() => editor.insertOrderedList()}
                    onUnorderedList={() => editor.insertUnorderedList()}
                    onCheckList={() => editor.insertCheckList()}
                />
            }
        </Toolbar>
    );
}