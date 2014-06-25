// Script used to performe emulated tests on web pages
// 
// This script will poke around on the web page
// testing forms and links to make sure no security / stability
// problem is present.
// 
// Use with EXTRA CAUTION

// Do not modify

const SAFE = 0;
const FINE = 1;

const WOW = 2500;
const FAST = 2000;
const MID = 1500;
const SLOW = 1000;
const STILL = 500;

const CHECK_ALL = 0;
const CHECK_DIVS = 1;
const CHECK_FORMS = 2;
const CHECK_BUTTONS = 3;
const CHECK_LINKS = 4;
const CHECK_NONE = -1;

// Configuration
const turtle_safe = SAFE;
const turtle_speed = WOW;
const turtle_mode = CHECK_ALL;

/**
 * Poke the Object for some times
 * @param  node object    Object to poke
 * @param  int pokeTimes  Poke the object for this many times
 * @return int            Return 0 if all is fine
 */
function pokeObject(object, pokeTimes)
{
	if(object)
	{
		for(var i = 1; i < pokeTimes; i += 1)
		{
			object.click();
		}

		return 0;
	}

	return 1;
}

/**
 * Fill in a input with some input
 * @param  node object    Input to put string in
 * @param  string content Content to put in, use "RANDOM" for random content
 * @return int            Return 0 if all is fine
 */
function fillBlank(object, content)
{
	if(content == "RANDOM")
	{
		// Generate random string
		var input;

		object.value = input;
		return 0;
	}
	else
	{
		object.value = content;
		return 0;
	}

	return 1;
}