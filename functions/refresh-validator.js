const { schedule } = require("@netlify/functions");
const axios = require('axios').default;
const cron = require('cron-validator');

const externalCronInterval = process.env.INSTAGRAM_CRON_INTERVAL || '';
const cronInterval = cron.isValidCron(externalCronInterval) ? externalCronInterval : '@monthly';

const refreshValidator = async function(event, context) {
  try {
    const access_token = process.env.INSTAGRAM_ACCESS_TOKEN;

    if (!(access_token && access_token.length > 0)) {
      throw new Error("Instagram keys needed (INSTAGRAM_ACCESS_TOKEN)")
    }

    const response = await axios.get(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${access_token}`);

    const expires_in =
      response
        && response.hasOwnProperty('data')
        && response.data.hasOwnProperty('expires_in')
        && !isNaN(response.data.expires_in)
        && response.data.expires_in >= 0
        && response.data.expires_in;

    if (!expires_in) {
      throw new Error("Something was wrong")
    }

    const expires_in_days = (expires_in / (60 * 60 * 24)).toFixed(2);
    console.log(200, { 200: response.data });

    return {
      statusCode: 200,
      body: JSON.stringify({
        note: 'Ok',
        expires_in,
        expires_in_days,
      }),
    };
  } catch (error) {
    console.log(500, { 500: error });
    return {
      statusCode: 500,
      body: JSON.stringify({ note: error.message, error: String(error) }),
    };
  };
};

exports.handler = schedule(cronInterval, refreshValidator);
