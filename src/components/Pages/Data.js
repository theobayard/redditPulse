import React from 'react'

import PageHeader from './PageHeader'
import DataRetriever from '../../DataRetriever'

class Data extends React.Component {
    render () {
        console.log(DataRetriever.getComments(new Date("2018"),new Date("2019"),"AskReddit","why",1000))
        return (
            <div className="page data">
                <PageHeader 
                    title="Data Scraper"
                    desc="This page uses pushshift (shout out to Jason Baumgartner) to create a dataset for you to analyze."/>
            </div>
        )
    }
}

export default Data;