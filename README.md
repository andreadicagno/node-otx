# node-otx

## Alienvault Open Threat Exchange
[Open Threat Exchange][otx] is an open community that allows participants to learn about the latest threats, research indicators of compromise observed in their environments, share threats they have identified, and automatically update their security infrastructure with the latest indicators to defend their environment.

## OTX for nodejs

This module is a parser that streams Threat Intelligence Feed from [OTX API][otx_api], into javascript objects. It implements the Node.js [stream API][stream].
It is both easy to use and extremely powerful.

## How to install

    npm install otx

## Getting Started

Copy from the [OTX API page][otx_api] your OTX Key

    var otx = require('otx');

    var stream = otx.getAll({
      apikey: 'YOUR API KEY',                   // MANDATORY
      modified_since: '2016-03-18T16:07:29',    // OPTIONAL, Default null
      limit: 10                                 // OPTIONAL
    })

    stream.on('data', function(data) {
      console.log(data);
    })

    stream.on('done', function(data) {
      console.log('Download - DONE');
    })

## Functions

### otx.getAll
Get All Subscribed Pulses from OTX.
#### Params
*	`apikey` DirectConnect user API Key.
*	`[modified_since]` Timestamp to filter returned pulses. `Default: null`
*	`[limit]` The page size to retrieve in a single request. `Default: null`

### otx.getIOC
Extract IOC from getAll stream.
#### Params
*	`[types]` Array that contains the IOC types to extract. `Default: ['IPv4', 'domain']`
*	`[iocOnly]` Returns only an array of IOC indicators. `Default: false`

## Example
    var otx = require('otx');

    var stream = new otx.getAll({
      apikey: 'YOUR API KEY'
    })

    var ioc = new otx.getIOC(['domain', 'url'], true);

    stream.pipe(ioc).on('data', function(data) {
      console.log(data);
    })

    stream.pipe(ioc).on('error', function(error) {
      console.error(error);
    })

    stream.pipe(ioc).on('done', function() {
      console.log('DONE!');
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
