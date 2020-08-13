import React from 'react'
import { connect } from 'react-redux'
import clsx from 'clsx'
import { GoPlus } from "react-icons/go"
import { FloatList } from '../utils/FloatList'
import Button from '../utils/Button'
import SearchField from '../utils/SearchField'
import './index.less'

class Terminal extends React.PureComponent {
    constructor(props) {
        super(props)
        this.params = {}
        this.refQuery = React.createRef()
    }

    search(val) {
        this.params.searchValue = val
        this.refresh()
    }

    refresh() {
        this.refQuery.current?.refetch(this.params)
    }

    render() {
        const {
            className,
            title,
            newUrl,
            NewComponent,
            QueryComponent = () => null,
            BodyComponent = () => null,
        } = this.props

        return (
            <div className={clsx('Terminal-root', className)}>
                <Title>{title}</Title>
                <Control
                    terminal={this}
                    newUrl={newUrl}
                    NewComponent={NewComponent}
                />
                <QueryComponent
                    ref={this.refQuery}
                >
                    <BodyComponent/>
                </QueryComponent>
            </div>
        )
    }
}

const Title = (props) => (
    props.children ?
    <div className='Title'>
        {props.children}
    </div> :
    null
)

const Control = connect(
    (state) => ({
        deviceType: state.deviceInfo.type,
    })
)((props) => {
    const {
        deviceType,
        terminal,
        newUrl,
        NewComponent = () => null,
    } = props

    return (
        <div className={clsx('Control', deviceType)}>
            <SearchField onCommit={(value) => terminal.search(value)}/>
            <div className='Right'>
                <ControlItem
                    className='New'
                    deviceType={deviceType}
                    onClick={newUrl ? () => location.href = newUrl : null}
                    contentElements={<NewComponent onComplete={() => terminal.refresh()}/>}
                >
                    <GoPlus/>New
                </ControlItem>
            </div>
        </div>
    )
})

const ControlItem = (props) => {
    const {
        className,
        deviceType,
        onClick,
        contentElements,
        children,
    } = props

    if (onClick) {
        return (
            <Button
                className={clsx('Control-item', className)}
                onClick={onClick}
            >
                {children}
            </Button>
        )
    } else {
        return (
            <FloatList
                className='Control-item'
                label={<Button className={className}>{children}</Button>}
                fullScreen={deviceType === 'mobile'}
                rightAligned
            >
                {contentElements}
            </FloatList>
        )
    }
}

export default Terminal