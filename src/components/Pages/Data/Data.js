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
            <>
                <h2>How to use the Data Page</h2>
                <hr/>
                <br/>
                <h3>Queries</h3>
                <p>
                    You can use these to request subsets of the data on pushshift. 
                    You may add as many queries as you would like. The number of results
                    will be split up evenly between each query. The subreddit field accepts
                    only one subreddit per query and is case sensitive. The search term field 
                    will restrict results to ones which contain the exact word or phrase entered.
                </p>
            </>
        )
    }
}

export default Data;