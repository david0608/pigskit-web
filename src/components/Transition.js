import React from 'react'
import clsx from 'clsx'
import Measure from 'react-measure'

class HeightComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            contentIndex: 0,
            isStart: false,
            isEnd: true,
        }
    }

    componentDidMount() {
        if (this.props.forwardRef) {
            this.props.forwardRef.current = this
        }
    }

    renderContent(index) {
        if (index === this.state.contentIndex) return
        this.setState({
            contentIndex: index,
            isStart: false,
            isEnd: false,
        })
        this.endOnTimeOut(200)
    }

    onResize({ entry }) {
        let height = entry?.height
        if (!height) return
        this.height = height

        if (this.isStart) return
        this.setState({
            isStart: true,
        })

        if (this.state.isEnd) return
        this.endOnTimeOut(this.props.timeout)
    }

    endOnTimeOut(timeout) {
        clearTimeout(this.lastTimeout)
        this.lastTimeout = setTimeout(() => {
            this.setState({
                isStart: true,
                isEnd: true,
            })
        }, timeout)
    }

    componentWillUnmount() {
        clearTimeout(this.lastTimeout)
    }

    render() {
        const {
            className,
            timeout,
            rootRef,
            forwardRef,
            ...otherProps
        } = this.props

        const children = React.Children.toArray(this.props.children)[this.state.contentIndex]

        const style = {
            height: this.state.isEnd ? 'auto' : this.height,
            overflow: this.state.isEnd ? '' : 'hidden',
            transition: `height ${timeout}ms`,
        }

        return (
            <div
                ref={rootRef}
                className={clsx('Transition-height-root', className)}
                style={style}
                {...otherProps}
            >
                <Measure
                    onResize={this.onResize.bind(this)}
                >
                    {({ measureRef }) => {
                        return (
                            <div ref={measureRef}>
                                {children}
                            </div>
                        )
                    }}
                </Measure>
            </div>
        )
    }
}

const Height = React.forwardRef((props, ref) => <HeightComponent forwardRef={ref} {...props}/>)

export default {
    Height,
}