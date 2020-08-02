import React from 'react';
import Button from 'react-bootstrap/Button'
import ProgressBar from 'react-bootstrap/ProgressBar'

class DataDownloader extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            gatheringData:false,
            progress:0,
        }
    }
    
    render() {
        return(
            <>
                <Button onClick={this.downloadCSV}>Download Data</Button>
                {this.progressBar}
            </>
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

    downloadCSV = () => {
        this.setState({
            gatheringData: true,
            progress: 0
        })
        var atag = document.createElement("a");
        var file = new Blob([this.getCSV()], {type: 'text/csv'});
        atag.href = URL.createObjectURL(file);
        atag.download = "redditPulseData.csv";
        atag.click();
        this.setState({
            gatheringData: false,
            progress: 0,
        })
    }

    getCSV() {
        const data = this.props.data
        let csv = "date_tag,text,id,score,link_id,parent_id,permalink,subreddit,locked,author_flair_text\n";
        
        let fields=["id","score","link_id","parent_id","permalink",
            "subreddit","locked","author_flair_text"]

        let completed = 0;
        for(let row of data) {
            // Add date
            let date = new Date(0);
            date.setUTCSeconds(row.created_utc);
            csv += '"' + date.toISOString() + '",'

            // Add body
            csv += '"' + row.body.replace(/\\n|"/g, "") + '",'

            // Add everything else
            for (let field of fields) {
                csv+= '"' + row[field] + '",'
            }

            csv = csv.slice(0, -1) + "\n"; // Remove last comma
            completed++;
            this.setState({
                progress: Math.round(completed/data.length),
            })
        }

        return csv;
    }
}

export default DataDownloader;