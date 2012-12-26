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

var Dropbox = require('com.clinsoftsol.dropboxti');
var DBClient = Dropbox.createClient({
									appKey: myAppKey,
                                    appSecret: myAppSecret,
                                    appRoot: Dropbox.DB_ROOT_APP,
                                    });

var win = Ti.UI.createWindow({backgroundColor: 'white', layout: 'vertical'});

/*
 * Linking user
 */
var linkBut = Ti.UI.createButton({title: 'Link'});
win.add(linkBut);
linkBut.addEventListener('click', function(e){
	if(DBClient.isLinked) {
		Ti.API.info("Dropbox already linked. Userids: " + DBClient.userIds());
		alert("Already linked");
	}
	else {
		DBClient.link();
	}
});

DBClient.addEventListener('linked', function(e){
	Ti.API.info("Dropbox linked now. Userids: " + e.userids);
});

/*
 * Un-linking accounts
 */
var unlinkBut = Ti.UI.createButton({title: 'Unlink'});
win.add(unlinkBut);
unlinkBut.addEventListener('click', function(e){
	DBClient.unlink();
});

/*
 * Get account information
 */
var acInfoBut = Ti.UI.createButton({title: 'Get Account Info'});
win.add(acInfoBut);

acInfoBut.addEventListener('click', function(e){
	DBClient.loadAccountInfo();
});

DBClient.addEventListener('loadedAccountInfo', function(e){
	Ti.API.info('country = '+e.country);
	Ti.API.info('displayName = '+e.displayName);
	Ti.API.info('userId = '+e.userId);
	Ti.API.info('referralLink = '+e.referralLink);
	Ti.API.info('Quota.normalBytes = '+e.quota.normalBytes);
	Ti.API.info('Quota.sharedBytes = '+e.quota.sharedBytes);
	Ti.API.info('Quota.totalConsumedBytes = '+e.quota.totalConsumedBytes);
	Ti.API.info('Quota.totalBytes = '+e.quota.totalBytes);
});

DBClient.addEventListener('loadAccountError', function(e){
	Ti.API.info('Load account error = '+e.error);	
});

/*
 * Open the window
 */
win.open();

})();
