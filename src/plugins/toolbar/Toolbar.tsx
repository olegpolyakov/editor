import { Children, type ReactNode, useMemo, useRef } from 'react';

import { Divider, type MenuProps } from '@olegpolyakov/ui';
import cn from '@olegpolyakov/frontend/helpers/classnames';

import ToolbarContext from './ToolbarContext';

import styles from './Toolbar.module.scss';

export default function Toolbar({
    children,    
    compact = false
}: {
    children: ReactNode | ReactNode[];
    compact?: boolean;
}) {
    const toolbarRef = useRef<HTMLDivElement>(null);
    const buttonSize = compact ? 's' : 'm';
    const value = useMemo(() => ({
        compact,
        buttonSize: buttonSize as MenuProps['size']
    }), [compact, buttonSize]);
    const childrenArray = Children.toArray(children);
    
    return (
        <ToolbarContext value={value}>
            <div
                ref={toolbarRef}
                className={cn(styles.root, compact && styles.compact)}
            >
                {childrenArray.map((child, index, children) => <>
                    {child}
                    {index < children.length  - 1 &&
                        <Divider
                            className={styles.divider}
                            orientation="vertical"
                        />
                    }
                </>)}
            </div>
        </ToolbarContext>
    );
}
