import { CODA_TOKEN } from '$env/static/private';

export async function POST({ request }) {
  const body = await request.arrayBuffer();
  const text = new TextDecoder("utf-8").decode(body);
  const { otp, visionid } = JSON.parse(text);

  const response = await fetch(`https://coda.io/apis/v1/docs/fHY8GL_n6t/tables/grid-2sXlKa226O/rows?query=c--9qjuaZ4qI:${visionid}`, {
    headers: {
      'Authorization': CODA_TOKEN
    }
  });

  const data = await response.json();  
  // console.log("data: " + JSON.stringify(data))
  const otpFromData = data.items[0].values['c-AtdGQIpZcl'];

  const isSame = otp == otpFromData; // compare otp from request with otp from data
  const rowId = data.items[0].id; // get the id of the row
  const email = data.items[0].values['c-_D2HQUK9Ta'];

  if (isSame && otp !== '') {
    // Update Coda field
    const updateResponse = await fetch(`https://coda.io/apis/v1/docs/fHY8GL_n6t/tables/grid-2sXlKa226O/rows/${rowId}`, {
      method: 'PUT',
      headers: {
        'Authorization': CODA_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'row': {
          'cells': [{
            'column': 'c-1Z9jPN3dRw',
            'value': true
          },{
            'column': 'c-AtdGQIpZcl',
            'value': ''
          }]
        }
      })
    });
    const updateData = await updateResponse.json();
    console.log(updateData);

    const listmonkResponse = await fetch('https://listmonk.visioncreator.works/subscription/form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'email': email,
        'l': 'eebca037-e9d6-4ef6-ac48-1eaeb5a80e33'
      }).toString()
    });
      const listmonkData = await listmonkResponse
      console.log(listmonkData);  
  } else {
    await fetch(`https://coda.io/apis/v1/docs/fHY8GL_n6t/tables/grid-2sXlKa226O/rows/${rowId}`, {
      method: 'PUT',
      headers: {
        'Authorization': CODA_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'row': {
          'cells': [{
            'column': 'c-AtdGQIpZcl',
            'value': ''
          }]
        }
      })
    });
  }

  return new Response(JSON.stringify({ isSame } ), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}