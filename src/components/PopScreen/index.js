import React from 'react';
import clsx from 'clsx';
import { BsX } from 'react-icons/bs';
import CircButton from '../utils/CircButton';
import './index.less';

class PopScreen extends React.PureComponent {
    constructor(props) {
        super();
        this.forwardRef = props.forwardRef;
        this.state = {
            display: false,
            contentRenderer: () => null,
        };
    }

    componentDidMount() {
        if (this.forwardRef) {
            this.forwardRef.current = this;
        }
    }

    open(renderer) {
        this.setState({
            display: true,
            contentRenderer: renderer
        })
    }

    close() {
        this.setState({
            display: false,
            contentRenderer: () => null,
        })
    }

    render() {
        return (<>
            <div
                className={clsx('PopScreenShadow', this.state.display && 'display')}
                onClick={this.close.bind(this)}
            />
            <div
                className={clsx('PopScreenRoot', this.props.className, this.state.display && 'display')}
            >
                <CircButton
                    className='CloseButton'
                    onClick={this.close.bind(this)}
                >
                    <BsX/>
                </CircButton>
                {this.state.contentRenderer()}
            </div>
        </>)
    }
}

export default React.forwardRef((props, ref) => <PopScreen forwardRef={ref} {...props}/>)