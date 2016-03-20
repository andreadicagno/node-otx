# node-otx

## Alienvaut Open Threat Exchange
[Open Threat Exchange][otx] is an open community that allows participants to learn about the latest threats, research indicators of compromise observed in their environments, share threats they have identified, and automatically update their security infrastructure with the latest indicators to defend their environment.

## OTX for nodejs

This module is a parser that streams Threat Intelligence Feed from [OTX API][otx_api], into javascript objects. It implements the Node.js [stream API][stream].
It is both easy to use and extremely powerful.

## How to install

    npm install otx

## How to use

Copy from the [OTX API page][otx_api] your OTX Key

    var otx = require('otx');

    var stream = otx.getAll({
      apikey: 'YOUR API KEY',                 // MANDATORY
      modified_since: '2016-03-18T16:07:29'   // OPTIONAL, Default null
    })

    stream.on('data', function(data) {
      console.log(data);
    })


## Features

*   Follow the Node.js [streaming API][stream]
*   Support big datasets
*   Small memory usage
*   MIT License

## Contacts
[![Linkedin](https://static.licdn.com/scds/common/u/images/logos/linkedin/logo_in_nav_44x36.png) Linkedin Profile](https://it.linkedin.com/in/andrea-di-cagno-abbrescia-852579a7)

[otx]: https://otx.alienvault.com/
[otx_api]: https://otx.alienvault.com/api/
[stream]: https://nodejs.org/api/stream.html
