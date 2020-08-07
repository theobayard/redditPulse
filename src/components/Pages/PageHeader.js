import React from 'react'

import pulseIcon from '../../svg/pulseIcon.svg'
import HelpButton from '../HelpButton'

/**
 * @summary A standard header for this website
 * @prop {String} title Title text for the page
 * @prop {String} desc A description of the page
 * @prop {JSX} help element that gives information about page
 */
class PageHeader extends React.Component {
    render () {
        return (
            <div id={"page-header"}>
                {this.props.help ? <HelpButton body={this.props.help}/> : null}
                <h1 style={{paddingTop:'20px'}}>{this.props.title}</h1>
                <img src={pulseIcon} alt={"A pulse symbol"}/>
                <p id={'page-description'}>{this.props.desc}</p>
            </div>
        )
    }
}

export default PageHeader;