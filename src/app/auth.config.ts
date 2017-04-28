interface AuthConfiguration {
	domain: string,
	clientID: string,
	lock: any
	// lock: {
	// 	socialButtonStyle: "big" | "small",
	// 	initialScreen: any,
	// 	theme: {
	// 		logo: string,
	// 		primaryColor: string,
	// 		foregroundColor: string,
	// 		labeledSubmitButton: boolean
	// 	},
	// 	languageDictionary: {
	// 		title: string
	// 	},
	// 	additionalSignUpFields: [{
	// 		name: string,
	// 		placeholder: string,
	// 		validator: any
	// 	}]
	// }
}

export const myConfig: AuthConfiguration = {
	domain: 'bee-companion.eu.auth0.com',
	clientID: 'GYa4pWTXDi17cBIf8bDtaFhTS1LiJwGr',
	lock: {
		socialButtonStyle: 'small',
		theme: {
			logo: '../assets/img/BeeCompanion_mainlogo.png',
			primaryColor: '#F6DD3B',
			foregroundColor: "#000000",
	    	labeledSubmitButton: false
		},
		languageDictionary: {
			title: 'Bee Companion'
		},
		additionalSignUpFields: [{
		    name: "username",
		    placeholder: "your desired username",
		    validator: function(name) {
		      return {
		         valid: name.length >= 3,
		         hint: "Must have 3 or more chars" // optional
		      };
		    }
		  },
		  {
		    name: "first_name",
		    placeholder: "your first name",
		    validator: function(name) {
		      return {
		         valid: name.length >= 3,
		         hint: "Must have 3 or more chars" // optional
		      };
		    }
		  },
		  {
		    name: "last_name",
		    placeholder: "your last name",
		    validator: function(name) {
		      return {
		         valid: name.length >= 3,
		         hint: "Must have 3 or more chars" // optional
		      };
		    }
		  }]
	}
}

export const postConfig = { 
	method: 'POST',
	url: 'https://bee-companion.eu.auth0.com/dbconnections/change_password',
	headers: { 
		'content-type': 'application/json' 
	},
	body: { 
		client_id: 'GYa4pWTXDi17cBIf8bDtaFhTS1LiJwGr',
		email: '',
 		connection: 'Username-Password-Authentication'
 	},
  	json: true 
}