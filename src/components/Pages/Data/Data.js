import React from 'react'

import PageHeader from '../PageHeader'
import DataRequestor from './DataRequestor'

class Data extends React.Component {
    render () {
        return (
            <div className="page data">
                <PageHeader 
                    title="Data Scraper"
                    desc="This page uses pushshift (shout out to Jason Baumgartner) to create a dataset for you to analyze."/>
                <DataRequestor/>
            </div>
        )
    }
}

export default Data;