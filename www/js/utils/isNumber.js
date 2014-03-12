function isNumber(v) {
	if (typeof isNaN !== 'undefined') {
		return !isNaN(v);
	} else {
		return typeof parseInt(v) !== 'undefined';
	}
}

module.exports = isNumber;