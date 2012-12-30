/*
 * Example app for demo of the DropboxTi module
 * 
 *
Member									Location			Notes
-(id)isLinked;							app.js
-(NSArray*)userIds:(id)args;			app.js
-(id)link:(id)args;						app.js
-(id)unlink:(id)args;					app.js
-(void)loadAccountInfo:(id)args;		app.js
-(void)loadMetadata:(id)args;			app.js
-(void)loadDelta:(id)cursor;			app.js				Two methods chunked and loadall
-(void)loadThumbnail:(id)args;			viewdetail.js
-(void)cancelThumbnailLoad:(id)args;	NYI
-(void)loadRevisionsForFile:(id)args;	app.js / fileui.js
-(void)restoreFile:(id)args;
-(void)loadFile:(id)args;				app.js / fileui.js
-(void)cancelFileLoad:(NSString*)path;
-(void)createFolder:(id)args;			app.js
-(void)deletePath:(id)args;				app.js
-(void)copyPath:(id)args;
-(void)createCopyRef:(id)args;			app.js / fileui.js
-(void)movePath:(id)args;
-(void)uploadFile:(id)args;				app.js
-(void)loadSharableLink:(id)args;		app.js / fileui.js
-(void)loadStreamableURL:(id)args;		app.js / fileui.js
-(void)searchPath:(id)args;				app.js
 
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
                                    onerror: function(e) {dbclientError(e.error,e.subtype,e.code);},
                                    });

if(DBClient.isLinked) {                                    
	// I don't know why, but it seem account info needs to be called before
	// any of the other network operations work.
	// So if linked call this straight away
    DBClient.loadAccountInfo();
}

require('viewdetail').setDropboxClient(DBClient);

var containingWin = Ti.UI.createWindow({});
var win = Ti.UI.createWindow({title: 'Dropbox Example App', backgroundColor: 'white', layout: 'vertical'});
var nv = Ti.UI.iPhone.createNavigationGroup({window: win});
containingWin.add(nv);

var data = [];
data.push({title: 'Link', func: 'link'});
data.push({title: 'Unlink', func: 'unlink'});
data.push({title: 'Get Account Info', func: 'acinfo'});
data.push({title: 'Load Metadata from path', func: 'loadmeta'});
data.push({title: 'Load Delta chunked', func: 'delta'});
data.push({title: 'Load Delta using loadall', func: 'deltaall'});
data.push({title: 'Create Folder', func: 'mkdir'});
data.push({title: 'Delete Path', func: 'rm'});
data.push({title: 'Search', func: 'search'});
data.push({title: 'Upload test file', func: 'upload'});

var tv = Ti.UI.createTableView({
	data: data,
});

tv.addEventListener('click',function(e){
	var func = e.row.func;
	switch(func) {
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
    			cancel: 1, buttonNames: ['OK','Cancel']
  			});
  			dialog.addEventListener('click', function(e){
    			if (e.index !== e.source.cancel) {
    				DBClient.loadMetadata({path: e.text});
    			}
  			});
  			dialog.show();
  		break;
  		case 'mkdir':
  			var dialog = Ti.UI.createAlertDialog({
    			title: 'Enter path to create', style: Ti.UI.iPhone.AlertDialogStyle.PLAIN_TEXT_INPUT,
    			cancel: 1, buttonNames: ['OK','Cancel']
  			});
  			dialog.addEventListener('click', function(e){
    			if (e.index !== e.source.cancel) {
    				DBClient.createFolder({path: e.text});
    			}
  			});
  			dialog.show();		
  		break;
  		case 'rm':
  			var dialog = Ti.UI.createAlertDialog({
    			title: 'Enter path (can be dir or file) to delete. USE CAREFULLY',
    			style: Ti.UI.iPhone.AlertDialogStyle.PLAIN_TEXT_INPUT,
    			cancel: 1, buttonNames: ['OK','Cancel']
  			});
  			dialog.addEventListener('click', function(e){
    			if (e.index !== e.source.cancel) {
    				DBClient.deletePath({path: e.text});
    			}
  			});
  			dialog.show();		
  		break;
		case 'delta':
		case 'deltaall':
  			var dialog = Ti.UI.createAlertDialog({
    			title: 'Enter delta string', style: Ti.UI.iPhone.AlertDialogStyle.PLAIN_TEXT_INPUT,
    			cancel: 1, buttonNames: ['OK','Cancel']
  			});
  			dialog.addEventListener('click', function(e){
    			if (e.index !== e.source.cancel) {
    				DBClient.loadDelta({cursor: e.text, loadall: (func=='deltaall')?true:false});
    			}
  			});
  			dialog.show();
		break;
		case 'search':
  			var dialog = Ti.UI.createAlertDialog({
    			title: 'Enter search string', style: Ti.UI.iPhone.AlertDialogStyle.PLAIN_TEXT_INPUT,
    			cancel: 1, buttonNames: ['OK','Cancel']
  			});
  			dialog.addEventListener('click', function(e){
    			if (e.index !== e.source.cancel) {
    				// For the demo app we just search root
    				DBClient.searchPath({path:"/", keyword: e.text,});
    			}
  			});
  			dialog.show();		
		break;
		case 'upload':
			file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "/TestFile4Upload.png");
			DBClient.uploadFile({
				path: '/TestFile4Upload.png',
				file: file,
				//parentRev: ''
			});
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

DBClient.addEventListener('loadedDeltaEntries',function(e){
	log("***LOADED DELTA***");
	log("Cursor: "+e.cursor);
	log("shouldReset "+((e.shouldReset)?"Yes":"No") );
	log("hasMore "+((e.hasMore)?"Yes":"No") );
	log("Number of delta entries from event: "+e.count);
	log("Number of delta entries by calling asscessor: "+DBClient.getDeltaEntryCount());
	
	// Retrieve at most 20 entries for the demo app
	var num2retrieve = (e.count < 20) ? e.count : 20;
	var i;
	for(i=0;i<num2retrieve;i++) {
		var entry = DBClient.getDeltaEntry(i);
		log(" Delta for "+entry.lowercasePath + " hasMetadata: "+( (entry.hasMetadata)?"Yes":"No" ));
	}
});

DBClient.addEventListener('loadProgress',function(e){
	log("Load progress for: "+e.path+". Progress: "+e.progress);
});

DBClient.addEventListener('loadedFile',function(e){
	log("File loaded into: "+e.path);
	log(" Content type: "+e.contentType);
});

DBClient.addEventListener('uploadProgress',function(e){	
	log("Load progress for: " + e.path + " to " + e.destPath + ". Progress: "+e.progress);
});

DBClient.addEventListener('uploadedFile',function(e){
	log("Uploaded file: "+e.path+" from srcPath "+e.srcPath);
});

DBClient.addEventListener('createdCopyRef',function(e){
	log("Copy reference generated: "+e.copyRef);
});

DBClient.addEventListener('loadedSharableLink',function(e){
	log("Shareable link for "+e.path+" is "+e.url);
});

DBClient.addEventListener('loadedStreamableURL',function(e){
	log("Streamable link for "+e.path+" is "+e.url);
});

DBClient.addEventListener('loadedRevisions',function(e){
	log("There are "+e.revisions.length+" revisions for path: "+e.path);
	var i;
	for(i=0;i<e.revisions.length;i++) {
		log(" - Rev: "+e.revisions[i].rev);
		log(" - humanReadableSize: "+e.revisions[i].humanReadableSize)
		log(" - Last mod date: "+ Date( e.revisions[i].lastModifiedDate ).toString());
	}
});

DBClient.addEventListener('loadedSearchResults',function(e){
	log("Search returned "+e.results.length+" results");
	if(e.results.length>0) {
		var i;
		for(i=0;i<e.results.length;i++) {
			log( ((e.results[i].isDirectory)?"[D] ":"[F] " ) + e.results[i].path);
		}
	}
});

DBClient.addEventListener('createdFolder',function(e){
	log("Created folder "+e.path+" Root: "+e.root+" Rev: "+e.rev);
});

DBClient.addEventListener('deletedPath',function(e){
	log("Deleted path "+e.path);
});

function dbclientError(error,subtype,code) {
	log("DB Client error: "+error);
	log("Error subtype = "+subtype);
	log("Error code = "+code);
}

function printMetadataInfo(_data) {
	log("Metadata for "+_data.filename);
	log(" isDirectory: "+((_data.isDirectory)?'Yes':'No'))
	log(" hasThumbnail:"+((_data.thumbnailExists)?'Yes':'No'));
}

Ti.App.addEventListener('app:PopMenu_filelist',function(e){
	switch(e.func) {
		case 'dl':
			DBClient.loadFile({path: e.data.path});
		break;
		case 'detail':
			log("Opening details window with path: "+e.data.path);
			var w = require('/viewdetail').createDetailsWin(e.data.path);
			nv.open(w);
		break;
		case 'copyref':
			DBClient.createCopyRef({path: e.data.path});
		break;
		case 'share':
			DBClient.loadSharableLink({path: e.data.path, shorturl: true});
		break;
		case 'stream':
			DBClient.loadStreamableURL({path: e.data.path});
		break;
		case 'revs':
			DBClient.loadRevisionsForFile({path: e.data.path, limit: 50});
		break;
	}
});

/*
 * Open the window
 */
containingWin.open();

})();
