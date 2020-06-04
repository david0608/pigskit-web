import React from 'react';
import { BsX } from 'react-icons/bs';
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
            <div className={`PopScreenShadow${this.state.display ? ' display' : ''}`} onClick={this.close.bind(this)}/>
            <div className={`PopScreenRoot${this.props.className ? ` ${this.props.className}` : ''}${this.state.display ? ' display' : ''}`}>
                <div className="CloseIcon" onClick={this.close.bind(this)}><BsX/></div>
                {this.state.contentRenderer()}
            </div>
        </>)
    }
}

export default React.forwardRef((props, ref) => <PopScreen forwardRef={ref} {...props}/>)