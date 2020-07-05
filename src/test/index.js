import React from 'react';
import ReactDOM from 'react-dom';
import './index.less';

import SearchField from '../components/utils/SearchField'
import TextInput from '../components/utils/TextInput'

const App = () => {
    return (
        <div className='TestRoot'>
            <SearchField
                className='Test-Search'
                onCommit={(value) => console.log(value)}
            />
            <TextInput
                className='Test-Input'
                label='input'
            />
        </div>
    )
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);