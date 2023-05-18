require('dotenv').config()

const { local } = require('../functions/refresh-validator');

const main = async () => {
  try {
    const data = await local();
    const parse = JSON.parse(data.body);
    // console.log(11, parse);
  } catch (error) {
    console.log(99, error.message)
  }
}

main();
