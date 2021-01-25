import React from 'react'
import styled from 'styled-components'
import clsx from 'clsx'

const EntryRoot = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    >.Name {
        margin: 20px 0px 10px;
    }

    >.LatestUpdate {
        margin: 5px 0px 20px;
    }
`

const Entry = props => {
    const {
        data,
    } = props

    return (
        <EntryRoot>
            <span
                className={clsx('Name', 'Text_header_2nd', 'Text_link')}
                onClick={() => location.href = `${location.origin}#/shop/${data.id}`}
            >
                {data.name}
            </span>
            {data.description}
            <span className={clsx('LatestUpdate', 'Text_remark')}>
                {`Latest updated at ${(new Date(data.latestUpdate)).toLocaleString('en')}`}
            </span>
        </EntryRoot>
    )
}

export default Entry