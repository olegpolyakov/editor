import { useContext } from 'react';

import { Avatar } from '@olegpolyakov/ui';

import CollaborationContext from './CollaborationContext';

import styles from './CollaborationToolbar.module.scss';

export default function CollaborationToolbar() {
    const { users } = useContext(CollaborationContext);

    if (users.length < 2) return null;

    return (
        <div className={styles.root} aria-label="Connected users">
            {users.map(user => (
                <Avatar key={user.clientId}
                    content={user.name.split(' ').map(n => n[0]).join('')} // initials of the user's name
                    size="s"
                    style={{ backgroundColor: user.color }}
                    title={user.name}
                />
            ))}
        </div>
    );
}