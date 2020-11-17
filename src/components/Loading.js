import React from 'react'
import styled from 'styled-components'
import TweenOne from 'rc-tween-one'
import SvgDrawPlugin from 'rc-tween-one/lib/plugin/SvgDrawPlugin'
TweenOne.plugins.push(SvgDrawPlugin)

const LoadingRoot = styled.div`
    padding: 32px 0px;
    text-align: center;
    display: flex;
    justify-content: center;
`

const Loading = React.memo(
    (props) => {
        const {
            className,
            children,
            ...otherProps
        } = props

        return (
            <LoadingRoot className={className}>
                <LoadingRing
                    radius={16}
                    strokeWidth={4}
                    stroke='#dcdcdc'
                    {...otherProps}
                />
            </LoadingRoot>
        )
    }
)

const LoadingRing = (props) => {
    return (
        <TweenOne
            animation={{
                rotate: 360,
                duration: 3600,
                ease: TweenOne.easing.path('M0 100 L100 0')
            }}
            repeat={-1}
            component={AnimatedRing}
            componentProps={props}
        />
    )
}

const AnimatedRing = (props) => {
    const {
        radius = 12,
        strokeWidth = 3,
        ...otherProps
    } = props

    const svgSize = 2 * (radius + strokeWidth)

    return (
        <svg
            width={svgSize}
            height={svgSize}
        >
          <TweenOne
            animation={[
                { SVGDraw: '0 2%', duration: 0},
                { SVGDraw: '0 98%', duration: 900},
                { SVGDraw: '98% 100%', duration: 900}
            ]}
            repeat={-1}
            component={Ring}
            componentProps={{
                radius: radius,
                strokeWidth: strokeWidth,
                ...otherProps
            }}
          />
        </svg>
    )
}

const Ring = (props) => {
    const {
        radius,
        strokeWidth,
        stroke = 'white',
        strokeLinecap = 'round',
        fill = 'none',
    } = props

    const p0 = ringPos(radius, strokeWidth, 0.99)
    const p1 = ringPos(radius, strokeWidth, 0.5)
    const p2 = ringPos(radius, strokeWidth, 0.01)

    return (
        <path
            d={`
                M ${p0.x} ${p0.y}
                A ${radius} ${radius} 0 1 1 ${p1.x} ${p1.y}
                A ${radius} ${radius} 0 1 1 ${p2.x} ${p2.y}
            `}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap={strokeLinecap}
            fill={fill}
        />
    )
}

function ringPos(radius, strokeWidth, ratio) {
    let phaseAngle = ratio * 2 * Math.PI
    return {
        x: radius * (1 + Math.sin(phaseAngle)) + strokeWidth,
        y: radius * (1 - Math.cos(phaseAngle)) + strokeWidth,
    }
}

export {
    Loading,
    LoadingRing,
}