const axios = require('axios').default;

const getBlogPosts = async function(event, context) {
  try {
    const username = 'fifthavenue';

    console.log(10, context && context.hasOwnProperty('clientContext') && context.clientContext)

    let url = `https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`;
    let response = await axios.get(url, {
      headers: {
        'x-ig-app-id': '936619743392459',
      }
    });
    const uid = response.data.data.user.id;

    const variables = JSON.stringify({ id: uid, first: 12 });
    url = `https://www.instagram.com/graphql/query/?query_hash=e769aa130647d2354c40ea6a439bfc08&variables=${variables}`;
    response = await axios.get(url);

    const blogPosts = response.data.data.user.edge_owner_to_timeline_media.edges.map(oneEdge => oneEdge.node);
    return {
      statusCode: 200,
      body: JSON.stringify({ note: 'Ok', blogPosts }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ note: error.message, error: String(error) }),
    };
  };
};

exports.handler = getBlogPosts;
