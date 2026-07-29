import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';

import { Provider } from '@olegpolyakov/ui';

import { ToolbarEditor } from '@/index';

import './index.scss';

function Demo() {
    return (
        <Provider>
            <div className="Demo">
                <ErrorBoundary
                    // @ts-ignore
                    fallbackRender={() => 'ERROR'}
                    onError={error => console.error('Error in boundary', error)}
                >
                    <ToolbarEditor
                        onChange={() => {}}
                    />
                </ErrorBoundary>
            </div>
        </Provider>
    );
};

createRoot(document.getElementById('root')!).render(<Demo />);