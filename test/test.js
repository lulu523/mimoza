/*global describe, it*/


'use strict';


var assert  = require('assert');

var Mimoza  = require('../');
var eq      = assert.strictEqual;

/*eslint-disable no-undefined*/

describe('defaults', function () {

  var m = Mimoza;


  it('resolve mime by file name', function () {
    eq('text/plain', m.getMimeType('text.txt'));
    eq('text/plain', m.getMimeType('teXt.TXT'));
    eq('text/plain', m.getMimeType('.text.txt'));
    eq('text/plain', m.getMimeType('dir/text.txt'));
    eq('text/plain', m.getMimeType('dir\\ext.txt'));
    eq('text/plain', m.getMimeType('txt'));
  });


  it('unresolvable extention', function () {
    eq(undefined, m.getMimeType('/txt'));
    eq(undefined, m.getMimeType('\\txt'));
    eq(undefined, m.getMimeType('dir/txt'));
    eq(undefined, m.getMimeType('dir\\txt'));
  });


  it('no default mime for unknown extention', function () {
    eq(undefined, m.getMimeType('text.nope'));
  });


  it('mime fallback for unknown extention', function () {
    eq('fallback', m.getMimeType('text.fallback', 'fallback'));
  });


  it('resolve extention by mime', function() {
    eq('.txt', m.getExtension(m.getMimeType('text.txt')));
    eq('.html', m.getExtension(m.getMimeType('text.htm')));
    eq('.bin', m.getExtension('application/octet-stream'));
    eq('.bin', m.getExtension('application/octet-stream '));
    eq('.html', m.getExtension(' text/html; charset=UTF-8'));
    eq('.html', m.getExtension('text/html; charset=UTF-8 '));
    eq('.html', m.getExtension('text/html; charset=UTF-8'));
    eq('.html', m.getExtension('text/html ; charset=UTF-8'));
    eq('.html', m.getExtension('text/html;charset=UTF-8'));
    eq(undefined, m.getExtension('unrecognized'));
    eq(undefined, m.getExtension(null));
    eq(undefined, m.getExtension({}));
  });


  it('mimes are case insensitive', function() {
    eq('.html', m.getExtension('text/Html'));
    eq('.txt', m.getExtension('tExt/plaiN'));
  });

});


describe('custom instance', function () {

  var m = new Mimoza({ defaultType:  'hard/core' });

  m.register('foo/bar', [ 'baz', 'moo' ]);


  it('resolve registered', function () {
    eq('foo/bar', m.getMimeType('.baz'));
    eq('foo/bar', m.getMimeType('/.baz'));
    eq('foo/bar', m.getMimeType('fee.baz'));
    eq('foo/bar', m.getMimeType('foo/fee.baz'));
    eq('foo/bar', m.getMimeType('foo\\fee.baz'));
    eq('foo/bar', m.getMimeType('.baz'));
    eq('foo/bar', m.getMimeType('BaZ'));
    eq('foo/bar', m.getMimeType('moo'));
    eq('.baz', m.getExtension('foo/bar'));
  });

  it('default mime for unknown extention', function () {
    eq('hard/core', m.getMimeType('tada'));
  });


  it('mime fallback for unknown extention', function () {
    eq('soft/core', m.getMimeType('text.fallback', 'soft/core'));
  });

});


describe('node.types check', function () {

  var m = Mimoza;

  it('check that some mimes loaded', function () {
    // some random types checks
    eq('application/octet-stream', m.getMimeType('file.buffer'));
    eq('audio/mp4', m.getMimeType('file.m4a'));

    // node.types definition should overrides apache's defalut
    eq('font/opentype', m.getMimeType('file.otf'));
  });

});


describe('compressibles', function () {

  var m = Mimoza;

  it('resolve compressible mimes', function () {
    eq(true, m.isCompressible('text/html'));
    eq(true, m.isCompressible(' text/hTml; charset=UTF-8 '));
    eq(true, m.isCompressible('application/javascript'));
    eq(false, m.isCompressible('application/octet-stream'));
  });

});


describe('text detect', function () {

  var m = Mimoza;

  it('check if mime type provides text content', function () {
    eq(true, m.isText('text/html'));
    eq(true, m.isText(' text/hTml; charset=UTF-8 '));
    eq(true, m.isText('application/javascript'));
    eq(true, m.isText('application/json'));
    eq(false, m.isText('application/octet-stream'));
  });

});
