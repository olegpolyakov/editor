import { useContext } from 'react';

import { Button, ButtonGroup } from '@olegpolyakov/ui';

import ToolbarContext from '../ToolbarContext';

export default function History({
    canUndo,
    canRedo,
    onUndo,
    onRedo
}: {
    canUndo: boolean;
    canRedo: boolean;
    onUndo: () => void;
    onRedo: () => void;
}) {
    const { buttonSize } = useContext(ToolbarContext);

    return (
        <ButtonGroup size={buttonSize}>
            <Button
                icon="undo"
                disabled={!canUndo}
                onClick={onUndo}
                aria-label="Undo"
            />
        
            <Button
                icon="redo"
                disabled={!canRedo}
                onClick={onRedo}
                aria-label="Redo"
            />
        </ButtonGroup>
    );
}