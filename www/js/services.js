angular.module('starter.services', [])

	/**
	 * Security service related to form validation...
	 *
	 */
	.factory('security', function() {
	  
	  return {

	  	email : function(email) {
	  		if (null !== email || typeof email !== 'undefined') {
	  			var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    			return re.test(email);
    		}
    		return false;
	  	},

	  	password : function(psw) {
	  		if (typeof psw !== 'undefined') {
	  			return true;
	  		}
	  		return false;
	  	}
	  	
	  };
	});