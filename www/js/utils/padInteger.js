function padInteger(num, size) {
	size = size || 2;
	var s = num + '';
	while (s.length < size) s = '0' + s;
	return s;
}

module.exports = padInteger;