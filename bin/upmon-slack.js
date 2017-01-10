#!/usr/bin/env node
var upminSlack = require('../')
process.stdin.pipe(upminSlack()).pipe(process.stdout)
