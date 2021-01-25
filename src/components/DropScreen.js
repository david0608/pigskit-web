import React, { useContext } from 'react'
import styled from 'styled-components'
import clsx from 'clsx'
import { BsX } from 'react-icons/bs'
import { withClass } from './utils'
import CircButton from './CircButton'

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

const DropScreenShadow = withClass(
    'DropScreen-shadow',
    styled.div`
        display: none;
        position: fixed;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, .1);
        z-index: 100;

        &.Display {
            display: block;
        }
    `,
)

const DropScreenRoot = withClass(
    'DropScreen-root',
    styled.div`
        position: fixed;
        left: 50%;
        transform: translate(-50%, -300px);
        background-color: white;
        box-shadow: 0 2px 28px 0 rgba(0,0,0,0.12);
        border: 1px solid rgba(0,0,0,0.2);
        z-index: 101;
        transition: unset;

        @media screen and (max-width: 499px) {
            width: 100%;
        }

        &.Display {
            transition: transform .5s;
            transform: translate(-50%, 50px);

            @media screen and (max-width: 499px) {
                transform: translate(-50%, 0px)
            }
        }

        >.Close {
            position: absolute;
            right: 10px;
            top: -12px;
            z-index: 109;

            @media screen and (max-width: 499px) {
                right: 5px;
                top: 5px;
            }
        }
    `
)

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
            <DropScreenShadow
                className={clsx(this.state.display && 'Display')}
                onClick={this.close.bind(this)}
            />
            <DropScreenRoot
                className={clsx(this.props.className, this.state.display && 'Display')}
            >
                <CircButton
                    className='Close'
                    onClick={this.close.bind(this)}
                    labelSize='20px'
                >
                    <BsX/>
                </CircButton>
                {this.state.content}
            </DropScreenRoot>
        </>)
    }
}

export function useDropScreen() {
    return useContext(Context)
}

export default DropScreenProvider