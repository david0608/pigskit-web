import React from 'react'
import clsx from 'clsx'
import { FaPlus, FaMinus } from 'react-icons/fa'
import Button from '../Button'
import './index.less'

class QuantityInput extends React.Component {
    constructor(props) {
        super(props)

        this.minValue = parseInt(this.props.minValue) || 0
        let maxValue = parseInt(this.props.maxValue)
        if (isNaN(maxValue)) {
            this.maxValue = null
        } else {
            this.maxValue = Math.max(this.minValue, maxValue)
        }

        let defaultValue = parseInt(this.props.defaultValue)
        if (isNaN(defaultValue)) {
            defaultValue = 0
        }

        this.state = {
            value: defaultValue
        }
    }

    get value() {
        return this.state.value
    }

    set value(val) {
        if (val === '') {
            this.setState({ value: '' })
            return
        }

        let value = parseInt(val)
        if (isNaN(value)) return
        if (this.maxValue !== null) value = Math.min(this.maxValue, value)
        value = Math.max(this.minValue, value)
        this.setState({ value: value })
    }

    componentDidMount() {
        if (this.props.forwardRef) {
            this.props.forwardRef.current = this
        }
    }

    handleChange(evt) {
        this.value = evt.target.value
    }

    plusOne() {
        this.value = this.value + 1
    }

    minusOne() {
        this.value = this.value - 1
    }

    handleFocus() {
        this.lastValue = this.value
    }

    handleBlur() {
        if (isNaN(parseInt(this.value))) this.value = this.lastValue
    }

    render() {
        const {
            className,
        } = this.props

        return (
            <div className={clsx('QuantityInput-root', className)}>
                <Button onClick={this.minusOne.bind(this)}>
                    <FaMinus/>
                </Button>
                <input
                    value={this.value}
                    onChange={this.handleChange.bind(this)}
                    onFocus={this.handleFocus.bind(this)}
                    onBlur={this.handleBlur.bind(this)}
                />
                <Button onClick={this.plusOne.bind(this)}>
                    <FaPlus/>
                </Button>
            </div>
        )
    }
}

export default React.forwardRef((props, ref) => <QuantityInput forwardRef={ref} {...props}/>)