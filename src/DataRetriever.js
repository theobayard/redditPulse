class DataRetriever {
    static _commentsURL = "https://api.pushshift.io/reddit/search/comment/?";
    static _maxQsize = 100; // The most results pushshift will return
    static _queryDelay = 1100;

    /**
     * @summary fetches a query
     * @param query query url to fetch
     */
    static async _getQuery(query) {
        console.log(`Pushshift request ${query}`);
        let data;
        try {
            let resp = await fetch(query, {
                referrerPolicy: "no-referrer"
            });
            data = await resp.json();
        }
        catch {
            setTimeout(DataRetriever._queryDelay)
            data = DataRetriever._getQuery(query)
        }

        return data;
    }

    /**
     * @summary fetches a list of queries
     * @param {Array<String>} queries list of query urls
     */
    static async _getQueries(queries) {
        let fetchedQs = []
        for (let q of queries) {
            setTimeout(DataRetriever._queryDelay);
            fetchedQs.push(await DataRetriever._getQuery(q));
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

        // Get a summary of comment volumn
        let aggQuery = DataRetriever._commentsURL + 
            "aggs=created_utc&frequency=hour&size=0" +
            (after ? "&after=" + afterEpoch : "") +
            (before ? "&before=" + beforeEpoch : "") +
            (subreddit ? "&subreddit=" + subreddit : "") +
            (q ? "&q=" + q : "");
        let agg = await DataRetriever._getQuery(aggQuery)
        agg = await agg.aggs.created_utc

        let numBins = Math.round(numComments/DataRetriever._maxQsize)
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
     * @description Gathers the top comments that match the paramaters. 
     * To get around pushshift's 500 comment per query, this ceates multiple 
     * bins that are adjusted for posting frequency.
     */
    static async getComments(after, before, subreddit, q, numComments) {
        let queries = await DataRetriever._makeQueries(after,before,subreddit,q,numComments);
        let results = await DataRetriever._getQueries(queries);
        console.log(results);
        return results.flat()
    }
}

export default DataRetriever;