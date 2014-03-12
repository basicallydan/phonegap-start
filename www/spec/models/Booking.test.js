var sinon = require('sinon');
var jsdom = require('jsdom').jsdom;
var doc = jsdom('<html><body></body></html>');
window = doc.createWindow();
var BookingModel = require('../../js/models/Booking');
var $ = require('jquery');
var should = require('should');
var config = require('../../js/config/config.js');
var moment = require('moment');

describe('BookingModel', function() {
	describe('.viewModel()', function () {
		var model = new BookingModel({
			booking: {
				title: 'Whatever',
				price_in_units: 50000,
				currency: 'GBP',
				comments: [
					{
						body: null,
						action: 'instructor_changes_time',
						from: 'instructor',
						username: 'bestinstructorever',
						created_at: moment().subtract(3, 'd').format(config.incomingDateFormat)
					},
					{
						body: null,
						action: 'instructor_makes_offer',
						from: 'instructor',
						username: 'bestinstructorever',
						created_at: moment().subtract(2, 'd').format(config.incomingDateFormat)
					},
					{
						body: 'Hello this is a comment.',
						action: 'message',
						from: 'user',
						username: 'whassisface',
						created_at: moment().subtract(1, 'd').format(config.incomingDateFormat)
					},
					{
						body: null,
						action: 'instructor_confirms',
						from: 'instructor',
						username: 'bestinstructorever',
						created_at: moment().subtract(5, 'h').format(config.incomingDateFormat)
					},
					{
						body: null,
						action: 'user_confirms',
						from: 'user',
						username: 'whassisface',
						created_at: moment().subtract(4, 'h').format(config.incomingDateFormat)
					}
				]
			}
		});

		var vm = model.viewModel();

		it('should display the formatted currency', function () {
			vm.booking.formattedPrice.should.eql('£500');
		});

		it('should show booking time changed', function() {
			vm.booking.comments[0].text.should.eql('Booking time changed');
			vm.booking.comments[0].formattedDate.should.eql('3 days ago');
			vm.booking.comments[0].currentUser.should.eql(true);
			vm.booking.comments[0].cssClass.should.eql('comment-action');
		});

		it('should show booking price changed', function() {
			vm.booking.comments[1].text.should.eql('Booking price changed');
			vm.booking.comments[1].formattedDate.should.eql('2 days ago');
			vm.booking.comments[1].currentUser.should.eql(true);
			vm.booking.comments[1].cssClass.should.eql('comment-action');
		});

		it('should show user comment', function() {
			vm.booking.comments[2].text.should.eql('Hello this is a comment.');
			vm.booking.comments[2].formattedDate.should.eql('a day ago');
			vm.booking.comments[2].currentUser.should.eql(false);
			vm.booking.comments[2].cssClass.should.eql('');
		});

		it('should show instructor confirmation', function() {
			vm.booking.comments[3].text.should.eql('Confirmed by instructor');
			vm.booking.comments[3].formattedDate.should.eql('5 hours ago');
			vm.booking.comments[3].currentUser.should.eql(true);
			vm.booking.comments[3].cssClass.should.eql('comment-action');
		});

		it('should show user confirmation', function() {
			vm.booking.comments[4].text.should.eql('Confirmed by user');
			vm.booking.comments[4].formattedDate.should.eql('4 hours ago');
			vm.booking.comments[4].currentUser.should.eql(false);
			vm.booking.comments[4].cssClass.should.eql('comment-action');
		});
	});
});
