# Editor

## Установка

```sh
npm i @olegpolyakov/editor
```

## Использование

```jsx
import { render } from 'react-dom';

import { Editor, Storage } from '@olegpolyakov/editor';
import '@olegpolyakov/styles.css';

import data from './data.json';

const storage: Storage = {
    upload(file: File) {
        return Promise.resolve();
    },
    delete() {
        return Promise.resolve();
    }
};

export default function App() {
    return (
        <Editor
            data={data}
            storage={storage}
            onStateChange={(editorState) => console.log(editorState.toJSON())}
            onDataChange={data => console.log(data)}
            onError={(error) => console.error(error)}
        />
    );
}
```
