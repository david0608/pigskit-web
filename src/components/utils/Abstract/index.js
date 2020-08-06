import React from 'react'
import clsx from 'clsx'
import './index.less'

class Abstract extends React.Component {
    constructor(props) {
        super(props)
        this.refRoot = React.createRef()
        this.refPsudo = React.createRef()
        this.state = {
            detail: false,
        }
    }

    componentDidMount() {
        if (this.props.forwardRef) {
            this.props.forwardRef.current = this
        }
    }

    shouldOpenOnFocus(event) {
        let root = event.currentTarget
        let blured = event.relatedTarget
        if (!root.contains(blured)) this.setState({ detail: true })
    }

    shouldCloseOnBlur(event) {
        let root = event.currentTarget
        let focused = event.relatedTarget
        if (!root.contains(focused)) this.setState({ detail: false })
    }

    focus() {
        this.refRoot.current.focus()
    }

    blur() {
        this.refPsudo.current.focus()
    }

    render() {
        return (<>
            <div
                ref={this.refRoot}
                className={clsx('Abstract-root', this.state.detail && 'Detail', this.props.className)}
                tabIndex={-1}
                onFocus={(e) => this.shouldOpenOnFocus(e)}
                onBlur={(e) => this.shouldCloseOnBlur(e)}
            >
                {
                    this.state.detail ?
                    this.props.detailContent :
                    this.props.outlineContent
                }
            </div>
            <div
                ref={this.refPsudo}
                tabIndex={-1}
            />
        </>)
    }
}

export default React.forwardRef((props, ref) => <Abstract forwardRef={ref} {...props}/>)