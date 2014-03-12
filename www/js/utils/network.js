function isOffline () {
	var networkState = navigator.network.connection.type;
	return (networkState === Connection.NONE || networkState === Connection.UNKNOWN || !networkState);
}

module.exports = {
	isOffline: isOffline
};