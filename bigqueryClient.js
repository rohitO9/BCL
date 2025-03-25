const { BigQuery } = require('@google-cloud/bigquery');
require('dotenv').config();

const bigquery = new BigQuery({
  projectId: process.env.PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

async function runQuery(query) {
const options = {
        query,
        location: 'asia-south1', 
      };
  const [job] = await bigquery.createQueryJob(options );
  const [rows] = await job.getQueryResults();
  return rows;
}

module.exports = { runQuery };
