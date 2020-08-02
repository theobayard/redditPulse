class DataRetriever {
    static _commentsURL = "https://api.pushshift.io/reddit/search/comment/?";
    static _maxQsize = 100; // The most results pushshift will return
    static _queryDelay = 1000;
    static _queriesBeforeGiveUp = 10;

    /**
     * @summary fetches a query
     * @param query query url to fetch
     */
    static async _getQuery(query, delayScalar = 1) {
        console.log(`Pushshift request ${query}`);
        let data;
        try {
            let resp = await fetch(query, {
                referrerPolicy: "no-referrer"
            });
            data = await resp.json();
        }
        catch {
            await this.sleep(DataRetriever._queryDelay*delayScalar)
            if (delayScalar > this._queriesBeforeGiveUp) {
                alert("Pushshift doesn't appear to be responding. Please refresh this page and verify that your internet is working. If that doesn't work, make sure that pushshift is functioning properly.");
                return null;
            }
            data = DataRetriever._getQuery(query,delayScalar+1)
        }

        return data;
    }

    /**
     * @summary fetches a list of queries
     * @param {Array<String>} queries list of query urls
     */
    static async _getQueries(queries, progress) {
        let fetchedQs = []
        let numCompleted = 0;
        for (let q of queries) {
            await this.sleep(DataRetriever._queryDelay);
            const fetchedQ = await DataRetriever._getQuery(q)
            fetchedQs.push(fetchedQ.data);

            numCompleted++;
            progress(numCompleted/queries.length*100)
        }
        return fetchedQs;
    }

    /**
     * @summary Creates time bins proportional to post frequency
     * @param {Date} after starting date
     * @param {Date} before ending date
     * @param subreddit
     * @param q search term
     * @param numComments
     */
    static async _getBins(after, before, subreddit, q, numComments) {
        let afterEpoch = after ? Math.round(after.getTime() / 1000) : null;
        let beforeEpoch = before ? Math.round(before.getTime() / 1000) : null;

        // Decide frequency of aggregate
        let numBins = Math.round(numComments/DataRetriever._maxQsize)
        let avgBinTime = (beforeEpoch - afterEpoch) / numBins;
        let fiveHours = 18000;
        let freq;
        avgBinTime > fiveHours ? freq = "hour" : freq = "minute";

        // Get a summary of comment volumn
        let aggQuery = DataRetriever._commentsURL + 
            "aggs=created_utc&size=0" +
            "&frequency=" + freq +
            (after ? "&after=" + afterEpoch : "") +
            (before ? "&before=" + beforeEpoch : "") +
            (subreddit ? "&subreddit=" + subreddit : "") +
            (q ? "&q=" + q : "");
        let agg = await DataRetriever._getQuery(aggQuery);
        agg = await agg.aggs.created_utc;

        if(agg.length===0) throw Error("Search Returned Zero Results");

        let totalComments = agg.reduce((a,b) => a + b.doc_count,0)
        let commentsPerBin = Math.round(totalComments/numBins)

        // Create bins by pushing once the current bin is "full"
        let bins = []
        let currentBin = {numComments:0,after:agg[0].key}
        agg.forEach(a => {
            currentBin.before = a.key;

            // If bin is "full" push and reset
            if(currentBin.numComments >= commentsPerBin) {
                bins.push({...currentBin})
                currentBin.numComments = 0;
                currentBin.after = currentBin.before;
            }

            currentBin.numComments = currentBin.numComments + a.doc_count;

        });
        bins.push({...currentBin})

        return bins;
    }

    /**
     * @summary makes a list of necessary queries
     * @param {Date} after starting date
     * @param {Date} before ending date
     * @param subreddit
     * @param q search term
     * @param numComments
     */
    static async _makeQueries(after, before, subreddit, q, numComments) {
        let bins = await DataRetriever._getBins(after,before,subreddit,q,numComments);
        return bins.map(bin => 
            DataRetriever._makeQuery(bin.after,bin.before,subreddit,q)
        )
    }

    /**
     * @summary makes a pushshift api query from params
     * @param {Number} after starting epoch
     * @param {Number} before ending epoch
     * @param subreddit
     * @param q search term
     */
    static _makeQuery(after, before, subreddit, q) {
        return DataRetriever._commentsURL +
            "sort_type=score&sort=desc" +
            "&size=" + DataRetriever._maxQsize +
            (after ? "&after=" + after : "") +
            (before ? "&before=" + before : "") +
            (subreddit ? "&subreddit=" + subreddit : "") +
            (q ? "&q=" + q : "");
    }

    /**
     * @summary gets reddit comment dataset with the given params
     * @param {Date} after starting date
     * @param {Date} before ending date
     * @param subreddit
     * @param q search term
     * @param numComments
     * @param {Function} progress a callback function to display progress
     * @description Gathers the top comments that match the paramaters. 
     * To get around pushshift's 500 comment per query, this ceates multiple 
     * bins that are adjusted for posting frequency.
     */
    static async getComments(after, before, subreddit, q, numComments, progress) {
        let queries = await DataRetriever._makeQueries(after,before,subreddit,q,numComments);
        let results = await DataRetriever._getQueries(queries, progress);
        return results.flat(2);
    }

    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export default DataRetriever;