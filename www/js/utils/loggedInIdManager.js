function getLoggedInId () {
	var authenticationId = localStorage['Authentication'];
	return authenticationId;
}

function deleteLoggedInId () {
	localStorage.removeItem('Authentication');
}

module.exports = {
	get: getLoggedInId,
	delete: deleteLoggedInId
};