import { useContext } from 'react';

import { Button, ButtonGroup } from '@olegpolyakov/ui';

import ToolbarContext from '../ToolbarContext';

export default function TextFormat({
    isBold,
    isItalic,
    isUnderline,
    onBold,
    onItalic,
    onUnderline
}: {
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
    onBold: () => void;
    onItalic: () => void;
    onUnderline: () => void;
}) {
    const { buttonSize } = useContext(ToolbarContext);

    return (
        <ButtonGroup size={buttonSize}>
            <Button
                icon="format_bold"
                active={isBold}
                onClick={onBold}
                aria-label="Format Bold"
                aria-pressed={isBold}
            />
                
            <Button
                icon="format_italic"
                active={isItalic}
                onClick={onItalic}
                aria-label="Format Italics"
                aria-pressed={isItalic}
            />
                
            <Button
                icon="format_underlined"
                active={isUnderline}
                onClick={onUnderline}
                aria-label="Format Underline"
                aria-pressed={isUnderline}
            />
        </ButtonGroup>
    );
}