
const url = "http://cloud-guard-app.s3.eu-north-1.amazonaws.com";

export const handler = async(event) => {
  console.log('authS3Router event: ', event)

  try {
    const res = await fetch(url + event.path);

    console.log('event.path: ', event.path);
    console.log("event.path.split('.').pop(): ", event.path.split('.').pop());

    const fileExt = event.path.split('.').pop();
    let contentType = 'application/json';

    switch (fileExt) {
      case 'html':
        contentType = 'text/html';
        break;
      case 'css':
        contentType = 'text/css';
        break;
      case 'js':
        contentType = 'application/javascript';
        break;
      case 'json':
        contentType = 'application/json';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      case 'gif':
        contentType = 'image/gif';
        break;
      case 'jpeg':
        contentType = 'image/jpeg';
        break;
      case 'jpg':
        contentType = 'image/jpeg';
        break;
      case 'svg':
        contentType = 'image/svg+xml';
        break;
      case 'xml':
        contentType = 'application/xml';
        break;
      case 'ico':
        contentType = 'image/xicon';
        break;
      case 'webmanifest':
        contentType = 'application/manifest+json';
        break;
    }

    if (res.ok) {
      if (['png', 'gif', 'jpeg', 'jpg'].includes(fileExt)) {
        // For image types, return binary data
        const buffer = await res.arrayBuffer();
        return {
          statusCode: 200,
          isBase64Encoded: true,
          body: Buffer.from(buffer).toString('base64'),
          headers: {
            'Content-Type': contentType,
          },
        };
      } else {
        const content = await res.text();
        return {
          statusCode: 200,
          body: content,
          headers: {
            'Content-Type': contentType,
          },
        };
      }

    } else {
      console.error("Failed to fetch. Status: ", res.status);
      return res.status;
    }
  }
  catch (e) {
    console.error(e);
    return 500;
  }
};
