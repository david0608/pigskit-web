import React from 'react'
import styled from 'styled-components'
import clsx from 'clsx'
import Transition from './utils/Transition'

const AbstractRoot = styled.div`
    cursor: pointer;
    outline: none;

    &.blur {
        background-color: #f9f9f9;

        >.Abstract-body:hover {
            background-color: #ececec;
        }
    }

    &.focus {
        cursor: unset;
    }

    >.Abstract-body {
        outline: none;
    }
`

class Abstract extends React.Component {
    constructor(props) {
        super(props)
        this.refRoot = React.createRef()
        this.refBody = React.createRef()
        this.refContent = React.createRef()
        this.state = {
            focus: false
        }
    }

    componentDidMount() {
        if (this.props.forwardRef) {
            this.props.forwardRef.current = this
        }
    }

    shouldOpenOnFocus(event) {
        let body = event.currentTarget
        let blured = event.relatedTarget
        if (!body.contains(blured) && !this.state.focus) {
            this.refContent.current.renderContent(1)
            this.setState({ focus: true })
        }
    }

    shouldCloseOnBlur(event) {
        // Never close after opened in debug mode.
        if (this.props.debug) return

        let body = event.currentTarget
        let focused = event.relatedTarget
        if (!body.contains(focused) && this.state.focus) {
            this.refContent.current.renderContent(0)
            this.setState({ focus: false })
        }
    }

    focus() {
        this.refBody.current.focus()
    }

    blur() {
        this.refRoot.current.focus()
    }

    render() {
        const {
            className,
            children,
        } = this.props
        
        return (
            <AbstractRoot
                ref={this.refRoot}
                className={clsx(this.state.focus ? 'focus' : 'blur', className)}
                tabIndex={-1}
            >
                <Transition.Height
                    className='Abstract-body'
                    ref={this.refContent}
                    rootRef={this.refBody}
                    tabIndex={-1}
                    onFocus={this.shouldOpenOnFocus.bind(this)}
                    onBlur={this.shouldCloseOnBlur.bind(this)}
                    timeout={300}
                >
                    {children}
                </Transition.Height>
            </AbstractRoot>
        )
    }
}

export default React.forwardRef((props, ref) => <Abstract forwardRef={ref} {...props}/>)