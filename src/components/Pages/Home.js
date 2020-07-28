import React from 'react';

import PageHeader from './PageHeader'
 
class Home extends React.Component {
    render() {
        return (
            <div className='page text'>
                <PageHeader 
                    title="Welcome to Reddit Pulse"
                    desc='This is a website dedicated to using topic modeling to investigate, or get the "pulse" of, Reddit. To start, head over to the data set page and gather some data.'
                    />
            </div>
         );
    }
}

export default Home;