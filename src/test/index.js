import ReactDOM from 'react-dom'
import React from "react"
import CheckList from '../components/utils/CheckList'
import './index.less'

function App() {
    return (
        <CheckList
            multiple
            listItems={{
                1: 'one',
                2: 'two',
                3: 'three',
            }}
            ItemComponent={(props) => {
                const {
                    itemKey,
                    itemValue,
                } = props

                return (
                    <div>
                        {itemValue}
                    </div>
                )
            }}
        />
    )
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
)