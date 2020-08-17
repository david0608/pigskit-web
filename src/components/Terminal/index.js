import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
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
            newPath,
            NewComponent,
            QueryComponent = () => null,
            BodyComponent = () => null,
        } = this.props

        return (
            <div className={clsx('Terminal-root', className)}>
                <Title>{title}</Title>
                <Control
                    terminal={this}
                    newPath={newPath}
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
        newPath,
        NewComponent,
    } = props

    const [redirect, setRedirect] = useState(false)

    if (redirect) {
        return <Redirect push to={newPath}/>
    } else {
        return (
            <div className={clsx('Control', deviceType)}>
                <SearchField onCommit={(value) => terminal.search(value)}/>
                <div className='Right'>
                    <ControlItem
                        className='New'
                        deviceType={deviceType}
                        onClick={newPath ? () => setRedirect(true) : null}
                        contentElements={NewComponent ? <NewComponent onComplete={() => terminal.refresh()}/> : null}
                    >
                        <GoPlus/>New
                    </ControlItem>
                </div>
            </div>
        )
    }
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
    } else if (contentElements) {
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
    } else {
        return null
    }
}

export default Terminal