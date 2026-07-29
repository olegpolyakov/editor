import { useContext } from 'react';

import { Button, ButtonGroup } from '@olegpolyakov/ui';

import ToolbarContext from '../ToolbarContext';

export default function Lists({
    onOrderedList,
    onUnorderedList,
    onCheckList
}: {
    onOrderedList: () => void;
    onUnorderedList: () => void;
    onCheckList: () => void;
}) {
    const { buttonSize } = useContext(ToolbarContext);

    return (
        <ButtonGroup size={buttonSize}>
            <Button
                icon="format_list_numbered"
                onClick={onOrderedList}
                aria-label="Insert an unordered list"
            />
        
            <Button
                icon="format_list_bulleted"
                onClick={onUnorderedList}
                aria-label="Insert an ordered list"
            />
        
            <Button
                icon="checklist"
                onClick={onCheckList}
                aria-label="Insert a check list"
            />
        </ButtonGroup>
    );
}