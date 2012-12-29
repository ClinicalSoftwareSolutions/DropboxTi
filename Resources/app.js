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
                                    appRoot: Dropbox.DB_ROOT_FULL,
                                    onerror: function(e) {dbclientError(e);},
                                    });

var containingWin = Ti.UI.createWindow({});
var win = Ti.UI.createWindow({title: 'Dropbox Example App', backgroundColor: 'white', layout: 'vertical'});
var nv = Ti.UI.iPhone.createNavigationGroup({window: win});
containingWin.add(nv);

var data = [];
data.push({title: 'Link', func: 'link'});
data.push({title: 'Unlink', func: 'unlink'});
data.push({title: 'Get Account Info', func: 'acinfo'});
data.push({title: 'Load Metadata from path', func: 'loadmeta'});

var tv = Ti.UI.createTableView({
	data: data,
//	height: '50%',
});

tv.addEventListener('click',function(e){
	switch(e.row.func) {
		case 'link':
			if(DBClient.isLinked) {
				Ti.API.info("Dropbox already linked. Userids: " + DBClient.userIds());
				alert("Already linked");
			}
			else {
				DBClient.link();
			}
		break;
		case 'unlink':
			DBClient.unlink();
		break;
		case 'acinfo':
			DBClient.loadAccountInfo();
		break;
		case 'loadmeta':
  			var dialog = Ti.UI.createAlertDialog({
    			title: 'Enter path',
    			style: Ti.UI.iPhone.AlertDialogStyle.PLAIN_TEXT_INPUT,
    			cancel: 1,
    			buttonNames: ['OK','Cancel']
  			});
  			dialog.addEventListener('click', function(e){
    			if (e.index !== e.source.cancel) {
    				DBClient.loadMetadata({path: e.text});
    			}
  			});
  			dialog.show();
  			break;
	}
});
win.add(tv);

// Add a scroll view for output
// var sv = Ti.UI.createScrollView({layout: 'vertical', heigth: '50%'});
// self.add(sv);

function log(_msg) {
	Ti.API.info(_msg);		
}
/*
 * Linking user
 */
DBClient.addEventListener('linked', function(e){
	log("Dropbox linked now. Userids: " + e.userids);
});

/*
 * Get account information
 */
DBClient.addEventListener('loadedAccountInfo', function(e){
	require('var_dump').display(e);

	log("*** ACCOUNT INFO ***");
	log('country = '+e.country);
	log('displayName = '+e.displayName);
	log('userId = '+e.userId);
	log('referralLink = '+e.referralLink);
	log('Quota.normalBytes = '+e.quota.normalBytes);
	log('Quota.sharedBytes = '+e.quota.sharedBytes);
	log('Quota.totalConsumedBytes = '+e.quota.totalConsumedBytes);
	log('Quota.totalBytes = '+e.quota.totalBytes);	
});

DBClient.addEventListener('loadAccountError', function(e){
	log('Load account error = '+e.error);	
});

/*
 * Metadata load
 */
DBClient.addEventListener('loadedMetadata',function(e){
	require('var_dump').display(e);
	
	if(e.datatype==='dir') {
		log("Metadata has "+e.contents.length+" items.");
		nv.open( require('fileui').createFileListWin(e.contents) );
	}
	
	if(e.datatype==='file') {
		printMetadataInfo(e.data);	
	}
});

function dbclientError(e) {
	log("DB Client error");
	log("Error subtype = "+e.subtype);	
}

function printMetadataInfo(_data) {
	log("Metadata for "+_data.filename);
	log(" isDirectory: "+((_data.isDirectory)?'Yes':'No'))
	log(" hasThumbnail:"+((_data.thumbnailExists)?'Yes':'No'));
}

/*
 * Open the window
 */
containingWin.open();

Ti.App.addEventListener('app:PopMenu_filelist',function(e){
	
});

})();
