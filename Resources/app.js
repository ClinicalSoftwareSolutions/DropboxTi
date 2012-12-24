/*
 *  
 */

//bootstrap and check dependencies
if (Ti.version < 2.0 ) {
	alert('Sorry - this application template requires Titanium Mobile SDK 2.0 or later');	  	
}

// This is a single context application with multiple windows in a stack
(function() {

/*
 * BEFORE USING THIS APP YOU MUST CREATE A FILE CALLED
 * KeysNotForGit.js
 * In that file put:
 * 
	var myAppKey = "<< REPLACE WITH YOUR KEY>>"
	var myAppSecret = "<< REPLACE WITH YOUR SECRET >>";
 */
Ti.include('KeysNotForGit.js');

var win = Ti.UI.createWindow({backgroundColor: 'white', layout: 'vertical'});
var linkBut = Ti.UI.createButton({title: 'Link'});
win.add(linkBut);
var unlinkBut = Ti.UI.createButton({title: 'Unlink'});
win.add(unlinkBut);

var Dropbox = require('com.clinsoftsol.dropboxti');
var DBClient = Dropbox.createClient({
									appKey: myAppKey,
                                    appSecret: myAppSecret,
                                    appRoot: Dropbox.DB_ROOT_APP,
                                    });

DBClient.addEventListener('linked', function(e){
	Ti.API.info("Dropbox linked now. Userids: " + e.userids);
	DBClient.loadAccountInfo();
});

linkBut.addEventListener('click', function(e){
	if(DBClient.isLinked) {
		Ti.API.info("Dropbox already linked. Userids: " + DBClient.userIds());
		DBClient.loadAccountInfo();
		alert("Already linked");
	}
	else {
		DBClient.link();
	}
});

unlinkBut.addEventListener('click', function(e){
	DBClient.unlink();
});

DBClient.addEventListener('loadedAccountInfo', function(e){
	Ti.API.info('userId = '+e.userId);
});

DBClient.addEventListener('loadAccountError', function(e){
	Ti.API.info('Load account error = '+e.error);	
});

win.open();

})();
