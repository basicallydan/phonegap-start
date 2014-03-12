var sinon = require('sinon');
var jsdom = require('jsdom').jsdom;
var doc = jsdom('<html><body></body></html>');
window = doc.createWindow();
var AuthenticationManager = require('../../js/auth/AuthenticationManager');
var $ = require('jquery');
var should = require('should');

describe('AuthenticationModel', function() {
    beforeEach(function () {
        localStorage = {};
        var store = {};

        localStorage.getItem = function (key) {
            return store[key];
        };

        localStorage.setItem = function (key, value) {
            return store[key] = value + '';
        };

        localStorage.removeItem = function (key) {
            return store[key] = undefined;
        };

        localStorage.clear = function () {
            store = {};
        };

        sinon.stub($, 'ajax', function (opts) {
            if (opts.type === 'POST') {
                var body = JSON.parse(opts.data);
                if (body.sessions.email === 'email@address.com') {
                    opts.success();
                } else if (body.sessions.email === 'wrong@address.com') {
                    opts.error();
                }
            } else {
                if (opts.success) {
                    opts.success();
                }
            }
        });
    });

    afterEach(function () {
        $.ajax.restore();
    });
    
    describe('new AuthenticationManager()', function () {
        it('should not be logged in', function() {
            var manager = new AuthenticationManager();
            manager.loggedIn().should.eql(false);
        });

        it('should be logged in', function() {
            localStorage.setItem('username', 'email@address.com');
            var manager = new AuthenticationManager();
            manager.loggedIn().should.eql(true);
            manager.username.should.eql('email@address.com');
        });
    });

    describe('.login()', function () {
        it('should log in', function() {
            var manager = new AuthenticationManager();
            manager.login('email@address.com', 'password');
            $.ajax.calledWithMatch({
                url: 'http://uat.upmysport.com/sessions',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify({ 'sessions': {'email' : 'email@address.com', 'password': 'password'} })
            }).should.eql(true, 'The AJAX call should be made');
            manager.loggedIn().should.eql(true, 'The user should be logged in');
            localStorage.getItem('username').should.eql('email@address.com');
        });

        it('should fail to log in with incorrect credentials', function() {
            var manager = new AuthenticationManager();
            var hitError = false;
            manager.login('wrong@address.com', 'password', {
                error: function () {
                    hitError = true;
                }
            });
            $.ajax.calledWithMatch({
                url: 'http://uat.upmysport.com/sessions',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify({ 'sessions': {'email' : 'wrong@address.com', 'password': 'password'} })
            }).should.eql(true, 'The AJAX call should be made');
            manager.loggedIn().should.eql(false, 'The user should not be logged in');
            hitError.should.eql(true, 'The error callback should be hit');
            (typeof(localStorage.getItem('username')) === 'undefined').should.eql(true, '');
        });
    });

    describe('.logout()', function () {
        it('should log out', function() {
            localStorage.setItem('username', 'email@address.com');
            var manager = new AuthenticationManager();
            manager.logout();
            $.ajax.calledWithMatch({
                url: 'http://uat.upmysport.com/sessions',
                type: 'DELETE',
                dataType: undefined,
                data: undefined
            }).should.eql(true);
            manager.loggedIn().should.eql(false);
            (typeof(localStorage.getItem('username')) === 'undefined').should.eql(true);
        });
    });
});
