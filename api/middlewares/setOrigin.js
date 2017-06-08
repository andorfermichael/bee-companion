/*
    Creates origin property on request object
*/
const _ = require('lodash');

function setOrigin(req, res, next) {
    const protocol = req.protocol;
    const hostHeaderIndex = req.rawHeaders.indexOf('Host') + 1;
    const host = hostHeaderIndex?req.rawHeaders[hostHeaderIndex]:undefined;

    if (_.get(req.origin)) {
        next();
    }
    if (!host) {
        _.set(req, 'origin', req.headers.referer?req.headers.referer.substring(0, req.headers.referer.length-1):undefined);
    } else {
        _.set(req, 'origin', protocol + '://' + host);
    }

    next();
}

module.exports = setOrigin;
