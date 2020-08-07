import React from 'react'

import HelpModal from './HelpModal';

/**
 * A button that can be clicked for more information.
 * @prop body JSX help element to display in modal on click
 */
class HelpButton extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            show:false
        }
    }

    render() {
        return(
            <>
                <HelpModal 
                    body={this.props.body} 
                    show={this.state.show}
                    handleClose={this.handleClose}/>
                <button type={"button"} className={"help"} onClick={this.onClick}>
                    ?
                </button>
            </>
        )
    }

    onClick = () => {
        this.setState({
            show:true
        })
    }

    handleClose = () => {
        if(!this.state.show) return;
        this.setState({
            show:false
        })
    }
}

export default HelpButton;