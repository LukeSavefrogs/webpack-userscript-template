const test_func = require('./js/functions.js');


console.log("%c_GM_info demo", "color: red; font-size: large");


// You can use Tampermonkey functions (if you enabled them in the `index.meta.js` file)
// See also https://www.tampermonkey.net/documentation.php#_grant
unsafeWindow.console.clear();
unsafeWindow.console.log(GM_info);


// Here we test the required function. 
// Should output "It Works!" in the console.
test_func();