import React from 'react'

import {Row, Col, Form} from 'react-bootstrap'
import DatePicker from 'react-datepicker'

/**
 * @summary A form that gives options for a pushshift query
 */
class DataQuery extends React.Component {
    static _minDate = new Date(Date.parse("2005-12-01"));
    static maxDate = new Date(Date.now());

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return(
            <>
                <Row>
                    <Col>
                        <Form.Control placeholder="Subreddit" 
                            onChange={e => 
                                this.eventChange(e,"subreddit")}/>
                        {this.afterDatePicker}
                    </Col>
                    <Col>
                        <Form.Control placeholder="Search Term" 
                            onChange={e => 
                                this.eventChange(e,"term")}/>
                        {this.beforeDatePicker}
                    </Col>
                </Row>
                <hr/>
            </>
        )
    }

    /**
     * Deals with event then passes on change
     * @param {Event} event 
     * @param {String} field 
     */
    eventChange(event, field) {
        event.preventDefault();
        this.props.onChange(this.props.index,field,event.target.value);
    }

    get afterDatePicker() {
        return (
            <div className="date-picker">
                <DatePicker 
                    selected={this.props.d.afterDate}
                    className="form-control"
                    placeholderText={"Start Date"}
                    onChange={e => 
                        this.props.onChange(this.props.index,"afterDate",e)}
                    showTimeSelect
                    minDate={DataQuery._minDate}
                    maxDate={DataQuery.maxDate}/>
            </div>
        )
    }

    get beforeDatePicker() {
        return (
            <div className="date-picker">
                <DatePicker 
                    selected={this.props.d.beforeDate}
                    className="form-control"
                    placeholderText={"End Date"}
                    onChange={e => 
                        this.props.onChange(this.props.index,"beforeDate",e)}
                    showTimeSelect
                    minDate={this.minDate}
                    maxDate={DataQuery.maxDate}/>
            </div>
        )
    }

    get minDate() {
        // If an after date is selected, use that
        if(this.props.d.afterDate) {return this.props.d.afterDate}

        // Otherwise use the default
        return this._minDate;
    }
}

export default DataQuery;