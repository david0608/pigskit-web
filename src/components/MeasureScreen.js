import React, { useCallback, useEffect } from 'react'
import Measure from 'react-measure'
import { connect } from 'react-redux'
import { actions as deviceInfoActions } from '../store/device_info'

const mapStateToProps = (state) => ({
    deviceType: state.deviceInfo.type,
    deviceScrolled: state.deviceInfo.scrolled,
})

const mapDispatchToProps = (dispatch) => ({
    updateDeviceType: (type) => dispatch(deviceInfoActions.updateType(type)),
    updateDeviceScrolled: (scrolled) => dispatch(deviceInfoActions.updateScrolled(scrolled)),
})

const Measurer = connect(
    mapStateToProps,
    mapDispatchToProps,
)((props) => {
    const {
        deviceType,
        updateDeviceType,
        deviceScrolled,
        updateDeviceScrolled,
    } = props

    useEffect(() => {
        const handleScroll = () => {
            if (window.pageYOffset >= 1 && !deviceScrolled) {
                updateDeviceScrolled(true)
            } else if (window.pageYOffset < 1 && deviceScrolled) {
                updateDeviceScrolled(false)
            }
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [deviceScrolled, updateDeviceScrolled])

    const handleResize = useCallback(({ entry }) => {
        if (entry) {
            if (entry.width < 500) {
                if (deviceType != 'mobile') {
                    updateDeviceType('mobile')
                }
            } else if (entry.width < 900) {
                if (deviceType != 'tablets') {
                    updateDeviceType('tablets')
                }
            } else {
                if (deviceType != 'desktop') {
                    updateDeviceType('desktop')
                }
            }
        }
    }, [deviceType, updateDeviceType])
    
    return (
        <Measure onResize={handleResize}>
            {({ measureRef }) => <div ref={measureRef} style={{ width: '100%' }}/>}
        </Measure>
    )
})

const MeasureScreen = connect(
    (state) => ({
        deviceType: state.deviceInfo.type,
    })
)((props) => {
    const {
        deviceType,
        children,
    } = props

    return (<>
        <Measurer/>
        {deviceType === 'unknown' ? null : children}
    </>)
})

export default MeasureScreen