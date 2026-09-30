import { useContext } from 'react';

import { Button, Item, Menu } from '@olegpolyakov/ui';

import ToolbarContext from '../ToolbarContext';

const BLOCK_TYPE_NAMES: Record<string, string> = {
    paragraph: 'Paragraph',
    h1: 'Heading 1',
    h2: 'Heading 2',
    h3: 'Heading 3',
    quote: 'Quote',
    bulletList: 'Unordered List',
    numberList: 'Ordered List',
    checkList: 'Check List',
    code: 'Code'
};

const BLOCK_TYPE_ICONS: Record<string, string> = {
    paragraph: 'format_paragraph',
    h1: 'format_h1',
    h2: 'format_h2',
    h3: 'format_h3',
    quote: 'format_quote',
    bulletList: 'format_list_bulleted',
    numberList: 'format_list_numbered',
    checkList: 'checklist',
    code: 'code'
};

const BLOCK_TYPES = [
    'paragraph',
    'h1',
    'h2',
    'h3',
    'quote',
    'bulletList',
    'numberList',
    'checkList',
    'code'
];

export default function BlockType({
    value,
    onChange: changeBlockType
}: {
    value: string;
    onChange: (value: string) => void;
}) {
    const { compact, buttonSize } = useContext(ToolbarContext);
    
    return (
        <Menu
            trigger={
                <Button
                    icon={BLOCK_TYPE_ICONS[value]}
                    content={!compact && BLOCK_TYPE_NAMES[value]}
                    size={buttonSize}
                    title={BLOCK_TYPE_NAMES[value]}
                    aria-label="Block type"
                />
            }
            size={buttonSize}
        >
            {BLOCK_TYPES.map(type => (
                <Item
                    key={type}
                    icon={BLOCK_TYPE_ICONS[type]}
                    content={BLOCK_TYPE_NAMES[type]}
                    onClick={() => changeBlockType(type)}
                />
            ))}
        </Menu>
    );
}