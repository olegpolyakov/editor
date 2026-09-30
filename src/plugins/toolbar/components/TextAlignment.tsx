import { useContext } from 'react';

import { Button, ButtonGroup } from '@olegpolyakov/ui';

import ToolbarContext from '../ToolbarContext';

export default function TextAlignment({
    onAlignLeft,
    onAlignCenter,
    onAlignRight,
    onAlignJustify
}: {
    onAlignLeft: () => void;
    onAlignCenter: () => void;
    onAlignRight: () => void;
    onAlignJustify: () => void;
}) {
    const { buttonSize } = useContext(ToolbarContext);

    return (
        <ButtonGroup size={buttonSize}>
            <Button
                icon="format_align_left"
                onClick={onAlignLeft}
                aria-label="Left Align"
            />
                    
            <Button
                icon="format_align_center"
                onClick={onAlignCenter}
                aria-label="Center Align"
            />
                
            <Button
                icon="format_align_right"
                onClick={onAlignRight}
                aria-label="Right Align"
            />
                
            <Button
                icon="format_align_justify"
                onClick={onAlignJustify}
                aria-label="Justify Align"
            />
        </ButtonGroup>
    );
}