var sinon = require('sinon');
var jsdom = require('jsdom').jsdom;
var doc = jsdom('<html><body></body></html>');
window = doc.createWindow();
var AuthenticationModel = require('../../js/models/Authentication');
var $ = require('jquery');
var should = require('should');

describe('AuthenticationModel', function() {
	beforeEach(function() {
		sinon.spy($, 'ajax');
	});

	afterEach(function () {
		$.ajax.restore();
	});

	describe('.save()', function () {
		it('should POST to the login endpoint', function() {
			var model = new AuthenticationModel();
			model.save({ email: 'hello', password: 'password' });
			model.get('sessions').email.should.equal('hello');
			model.get('sessions').password.should.equal('password');
		});
	});
});
