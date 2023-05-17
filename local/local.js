const { handler } = require('../functions/blog-posts');

const main = async () => {
  try {
    const data = await handler();
    const parse = JSON.parse(data.body);
    console.log(11, parse);
  } catch (error) {
    console.log(99, error.message)
  }
}

main();
