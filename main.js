(function(){

	console.log('main.js loaded');

	//initialize keypress.js listener thing
	var listener = new window.keypress.Listener();

	//the property names are comboCodes
	//each comboCode is a digital representation of each fingerpress
	//so 1000 is one index finger down
	//0001 is one pinky finger down
	//0101 is middle and pinky, etc.

	//map the comboCode to the audio id in the html

	var soundMap = {
		'0111' : "tone1", //SDF
		'1011' : "tone2", //ADF
		'1101' : "tone3", //ASF
		'1110' : "tone4", //ASD
		'0011' : "tone5", //DF
		'0101' : "tone6", //SF
		'0110' : "tone7", //SD
		'1000' : "tone8", //A
		'0100' : "tone9", //S
		'0010' : "tone10", //D
		'0001' : "tone11", //F
		'1100' : "tone12", //AS
		'1010' : "tone13", //AD
		'1001' : "tone14", //AF
		'1111' : "tone15", //ASDF
	};

	var $audioElements = $('audio');

	//this constructs a keypress combo registration object to be 
	//used with the regiser_many method, which takes an array of
	//combo registrations

	//keyCombo = string i.e. "a d"
	//comboCode = string i.e. "1010"

	var mostFingersCombo = "";
	var isMostFingersCombo = false;

	//this checks to see if the current combo being pressed contains
	//more keys than any other combo in the current keypress.
	//if so, it is the current combo, and only this combo should
	//fire a tone

	function checkIfRealCombo(keys) {

		if(keys.length > mostFingersCombo.length) {
			mostFingersCombo = keys;
			console.log('mostFingersCombo: ' + mostFingersCombo);
			return true;
		} else {
			console.log('mostFingersCombo: ' + mostFingersCombo);
			return false;
		};
	};

	function stopAllAudio() {
		$audioElements.each(function() {
			console.log(this.currentTime); 
			this.pause();
			this.currentTime = 0;
		})
	}	

	var comboRegistration = function (keyCombo, comboCode) {

		this.keyCombo = keyCombo;
		this.comboCode = comboCode;
		this.downEvent = function() {

			var audioElementId = soundMap[comboCode];
			var currentSound;
			

			console.log('keydown: ' + comboCode);

			//if this combo involves the most keys,
			//AND no other combo of equal length has been registered
			//THEN this becomes real combo

			isMostFingersCombo = checkIfRealCombo(keyCombo);

			if (isMostFingersCombo) {

				if (audioElementId) {

					stopAllAudio();
					console.log(audioElementId + ' play');

					currentSound = document.getElementById(audioElementId);
					currentSound.play();

				} else {
					console.log('key not registered');
				};
			};

			if (keyCombo.length === 1) {
				switch(keyCombo) {
			    case 'a':
			        $('#a-press').hide().fadeIn(600);
			        break;
			    case 's':
			        $('#s-press').hide().fadeIn(600);
			        break;
			    case 'd':
			        $('#d-press').hide().fadeIn(600);
			        break;
			    case 'f':
			        $('#f-press').hide().fadeIn(600);
			        break;    
			    default:
			        break;
}
			}

		};	

		this.upEvent = function() {

			var audioElementId = soundMap[comboCode];
			var currentSound;

			console.log('keyup: ' + comboCode);

			mostFingersCombo = "";

			if (audioElementId) {
				console.log(audioElementId + ' stop');

				currentSound = document.getElementById(audioElementId);
				currentSound.pause();
				currentSound.currentTime = 0;
			} else {
				console.log('key not registered');
			}
		}

		var comboRegistrationRule = {
			"keys" : this.keyCombo,
			"is_unordered" : true,
			"prevent_repeat" : true,
			"on_keydown" : this.downEvent,
			"on_keyup" : this.upEvent
		}

		return comboRegistrationRule;

	}

	var comboRegistrations = [
	    new comboRegistration('s d f','0111'),
		new comboRegistration('a d f','1011'),		
		new comboRegistration('a s f','1101'),	
		new comboRegistration('a s d','1110'),
		new comboRegistration('d f', '0011'),
		new comboRegistration('s f','0101'),		
		new comboRegistration('s d','0110'),
		new comboRegistration('a','1000'),
		new comboRegistration('s','0100'),		
		new comboRegistration('d','0010'),	
		new comboRegistration('f','0001'),
		new comboRegistration('a s', '1100'),
		new comboRegistration('a d','1010'),		
		new comboRegistration('a f','1001'),	
		new comboRegistration('a s d f','1111')	
	];

	listener.register_many(comboRegistrations);

})();