var sinon = require('sinon');
var jsdom = require('jsdom').jsdom;
var doc = jsdom('<html><body></body></html>');
window = doc.createWindow();
var api = require('../../js/api/apiHandlers');
$ = require('jquery');
var should = require('should');

describe('apiHandlers', function() {
	beforeEach(function() {
		sinon.stub($, 'ajax');
	});

	afterEach(function () {
		$.ajax.restore();
	});
	
	describe('.post()', function () {
		it('should make a POST XHR request to the correct URL', function() {
			api.post('http://uat.upmysport.com/test', { yes : 'no' });
			$.ajax.calledWithMatch({
				url: 'http://uat.upmysport.com/test',
				type: 'POST',
				dataType: 'json',
				data: JSON.stringify({"yes":"no"})
			}).should.eql(true);
		});
	});
	
	describe('.delete()', function () {
		it('should make a DELETE XHR request to the correct URL', function() {
			api.delete('http://uat.upmysport.com/test');
			$.ajax.calledWithMatch({
				url: 'http://uat.upmysport.com/test',
				type: 'DELETE',
				dataType: undefined,
				data: undefined
			}).should.eql(true);
		});
	});
});
