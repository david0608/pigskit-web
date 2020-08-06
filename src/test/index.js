import React from 'react';
import ReactDOM from 'react-dom';
import './index.less';

import ImageInput from '../components/utils/ImageInput'
import DropScreenProvider from '../components/DropScreen'

const App = () => {
    return (
        <div className='TestRoot'>
            <DropScreenProvider>
                <ImageInput
                    className='TextImageInput'
                    aspect={2}
                />
            </DropScreenProvider>
        </div>
    )
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);