import { createContext } from 'react';

import type { MenuProps } from '@olegpolyakov/ui';

export type ToolbarContextValue = {
    compact: boolean;
    buttonSize: MenuProps['size']
};

export default createContext<ToolbarContextValue>({
    compact: false,
    buttonSize: 'm'
});