#!/usr/bin/env node
var upmonSlack = require('../')
process.stdin.pipe(upmonSlack()).pipe(process.stdout)
