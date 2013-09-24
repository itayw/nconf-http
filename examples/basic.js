/**
 *  joola.io
 *
 *  Copyright Joola Smart Solutions, Ltd. <info@joo.la>
 *
 *  Licensed under GNU General Public License 3.0 or later.
 *  Some rights reserved. See LICENSE, AUTHORS.
 *
 *  @license GPL-3.0+ <http://spdx.org/licenses/GPL-3.0+>
 */

var
  nconf = require('nconf');

require('../lib/nconf-http');

nconf.use('http', { url: 'http://localhost:40001/conf/joola.io.analytics',
  callback: function () {
    console.log(nconf.get('version'));
  }
});

