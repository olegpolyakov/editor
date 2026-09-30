import { type ChangeEvent, useCallback, useContext, useRef } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { Button, ButtonGroup } from '@olegpolyakov/ui';

import { ToolbarContext } from '../toolbar';

import { INSERT_FILE_COMMAND, INSERT_IMAGE_COMMAND } from './commands';

export default function UploadToolbar() {
    const [editor] = useLexicalComposerContext();

    const { buttonSize } = useContext(ToolbarContext);

    const imageInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (files?.length) {
            editor.dispatchCommand(INSERT_IMAGE_COMMAND, Array.from(files));
        }

        event.target.value = '';
    }, [editor]);

    const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (files?.length) {
            editor.dispatchCommand(INSERT_FILE_COMMAND, Array.from(files));
        }

        event.target.value = '';
    }, [editor]);

    return (
        <ButtonGroup size={buttonSize}>
            <Button
                icon="image"
                onClick={() => imageInputRef.current?.click()}
                aria-label="Insert an image"
            />

            <Button
                icon="attach_file"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Attach a file"
            />

            <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleImageChange}
            />

            <input
                ref={fileInputRef}
                type="file"
                multiple
                hidden
                onChange={handleFileChange}
            />
        </ButtonGroup>
    );
}