const { handler } = require('../functions/meta');

const main = async () => {
  try {
    const data = await handler();
    const parse = JSON.parse(data?.body);
    console.log(11, parse?.value);
  } catch (error) {
    console.log(99, error?.message)
  }
}

main();
