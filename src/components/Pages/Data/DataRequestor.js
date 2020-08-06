import React from 'react'
import ReactDOM from 'react-dom';
import "react-datepicker/dist/react-datepicker.css";
import {Form, Row, Col, Button, ProgressBar} from 'react-bootstrap'

import DataRetriever from '../../../DataRetriever.js'
import DataDownloader from './DataDownloader'
import ErrorModal from '../../ErrorModal'
import DataQuery from './DataQuery'

class DataRequestor extends React.Component {
    minDate = new Date(Date.parse("2005-12-01"));
    maxDate = new Date(Date.now());
    minResults = 1000;
    maxResults = 100000;
    resultStep = 100;

    constructor(props) {
        super(props);
        this.state={
            numResults: 10000,
            progress: 0,
            gatheringData: false,
            queries: [{}],
        }
    }

    render() {
        return (
            <div id="data-requestor">
                <Form onSubmit={this.onSubmit}>
                    {this.state.queries.map((d,i) => 
                        <DataQuery key={i} d={d} index={i}
                            onChange={this.onQueryChange}/>
                    )}
                    {this.subtractQueryButton}
                    {this.addQueryButton}
                    <Row>
                        <Col>
                            {this.numResultsSlider}
                            <Button type="submit" id="data-requestor-submit">
                                Request Data
                            </Button>
                        </Col>
                    </Row>
                </Form>
                {this.progressBar}
                {this.state.data ? <DataDownloader data={this.state.data}/> 
                    : null}
            </div>
        )
    }

    get addQueryButton () {
        return (
            <Button onClick={this.addQuery}>Add Query</Button>
        )
    }

    get subtractQueryButton () {
        return (
            this.state.queries.length > 1 ? 
                <Button onClick={this.subtractQuery}>Subtract Query</Button> :
                null
        )
    }

    get progressBar() {
        let bar = null;
        if(this.state.gatheringData) {
            bar = (
                <div>
                    <ProgressBar animated 
                        now={this.state.progress}
                        label={`${this.state.progress}%`}/>
                </div>
            )
        }
        return bar
    }

    get numResultsSlider() {
        return (
            <Form.Group controlId="numResultsSlider" id="num-results-slider">
                <Form.Label>{"Number of Results: " + this.state.numResults}</Form.Label>
                <Form.Control type="range" 
                    onChange={this.setNumResults}
                    min={this.minResults}
                    max={this.maxResults}
                    step={this.resultStep}
                    value={this.state.numResults}/>
            </Form.Group>
        )
    }

    /**
     * @summary Callback for a change in a query
     * @param {Number} index query component index
     * @param field the field of the value being updated
     * @param {Event} value the update event
     */
    onQueryChange = (index, field, value) => {
        let queries = [...this.state.queries];
        queries[index][field] = value
        this.setState({
            queries: queries
        })
    }

    addQuery = () => {
        const queries = this.state.queries
        queries.push({})
        this.setState({queries:queries})
    }

    subtractQuery = () => {
        const queries = this.state.queries.slice(0,this.state.queries.length-1)
        this.setState({queries:queries})
    }

    onSubmit = (event) => {
        event.preventDefault();
        
        this.setState({
            gatheringData:true,
            data: null,
        })
        DataRetriever.getRequests(
            this.state.queries,
            this.state.numResults,
            this.setProgress)
            .then(commentData => this.setState({
                data:commentData,
                gatheringData:false,
                progress:0,
            }), err => {
                this.alertError(err);
                this.setState({
                    gatheringData:false,
                    progress:0,
                })
            });

    }

    setProgress = (progress) => {
        this.setState({
            progress:Math.round(progress)
        })
    }

    setSubreddit = (event) => {
        event.preventDefault();
        this.setState({
            subreddit:event.target.value,
        })
    }

    setQuery = (event) => {
        event.preventDefault();
        this.setState({
            query:event.target.value,
        })
    }

    setNumResults = (event) => {
        event.preventDefault();
        this.setState({
            numResults:event.target.value,
        })
    }

    setAfterDate = (date) => {
        this.setState({ 
            afterDate:date 
        })
    }

    setBeforeDate = (date) => {
        this.setState({ 
            beforeDate:date
        })
    }

    alertError = (err) => {
        console.log("alertError called");
        ReactDOM.render(<ErrorModal err={err}/>,document.getElementById('error-modal'))
    }
}

export default DataRequestor;