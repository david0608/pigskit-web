import React, { useContext } from 'react'
import clsx from 'clsx'
import { BsX } from 'react-icons/bs'
import CircButton from '../utils/CircButton'
import './index.less'

const Context = React.createContext()

const DropScreenProvider = React.memo((props) => {
    const {
        dropScreenClassName,
        children,
    } = props

    const refDropScreen = React.createRef()
    
    return (
        <Context.Provider value={refDropScreen}>
            <DropScreen
                forwardRef={refDropScreen}
                className={dropScreenClassName}
            />
            {children}
        </Context.Provider>
    )
})

class DropScreen extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            display: false,
            content: null,
        }
    }

    componentDidMount() {
        if (this.props.forwardRef) this.props.forwardRef.current = this
    }

    componentDidUpdate() {
        if (this.props.forwardRef) this.props.forwardRef.current = this
    }

    open(content) {
        this.setState({
            display: true,
            content: content,
        })
    }

    close() {
        this.setState({
            display: false,
            content: null,
        })
    }

    render() {
        return (<>
            <div
                className={clsx('DropScreen-shadow', this.state.display && 'Display')}
                onClick={this.close.bind(this)}
            />
            <div
                className={clsx('DropScreen-root', this.props.className, this.state.display && 'Display')}
            >
                <CircButton
                    className='Close'
                    onClick={this.close.bind(this)}
                >
                    <BsX/>
                </CircButton>
                {this.state.content}
            </div>
        </>)
    }
}

export function useDropScreen() {
    return useContext(Context)
}

export default DropScreenProvider