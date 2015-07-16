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
	  	},

	  	birthday : function(birth) {
	  		var re = /((?:0[1-9])|(?:1[0-2]))\/((?:0[0-9])|(?:[1-2][0-9])|(?:3[0-1]))\/(\d{4})/;
	  		return re.test(birth);
	  	},

	  	samePsw : function(pass, confirm) {
	  		return pass === confirm;
	  	},

	  	notEmpty : function(data, verified) {
	  		var status = true;

	  		angular.forEach(verified, function(value) {
	  			if (typeof data[value] === 'undefined') {
	  				status = false;
	  			}
	  		});
	  		return status;
	  	}

	  };
	})

	/**
	 * Serialize service
	 *
	 */
	.factory('serialize', function() {

		return {

			serializeData : function(data) { 
			    // If this is not an object, defer to native stringification.
			    if ( ! angular.isObject( data ) ) { 
			        return( ( data == null ) ? "" : data.toString() ); 
			    }

			    var buffer = [];

			    // Serialize each key in the object.
			    for ( var name in data ) { 
			        if ( ! data.hasOwnProperty( name ) ) { 
			            continue; 
			        }

			        var value = data[ name ];

			        buffer.push(
			            encodeURIComponent( name ) + "=" + encodeURIComponent( ( value == null ) ? "" : value )
			        ); 
			    }

			    // Serialize the buffer and clean it up for transportation.
			    var source = buffer.join( "&" ).replace( /%20/g, "+" ); 
			    return( source ); 
			}
		}
	})

	/**
	 * Auth service
	 *
	 */
	.factory('shareDataService', function() {

		var selectedDefi;

		return {}
	});