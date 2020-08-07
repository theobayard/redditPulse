import React from 'react'

import PageHeader from '../PageHeader'
import DataRequestor from './DataRequestor'

class Data extends React.Component {
    render () {
        return (
            <div className="page data">
                <PageHeader 
                    title="Data Scraper"
                    desc="This page uses pushshift (shout out to Jason Baumgartner) to create a dataset for you to analyze."
                    help={this.help}/>
                <DataRequestor/>
            </div>
        )
    }

    get help() {
        return (
            <h1>You have been helped</h1>
        )
    }
}

export default Data;