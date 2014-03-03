Tendon.utl = (function() {
	return {
		strCapitalize: function(str) {
			return str.replace(/^./, function (char) {
        		return char.toUpperCase();
		    });
		}
	}
})();