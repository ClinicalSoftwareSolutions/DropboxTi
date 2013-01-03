/**
 * @author Neville Dastur
 */

var Dropbox = require('com.clinsoftsol.dropboxti');
var DBC = null;

exports.setDropboxClient = function(_client) {
	DBC	= _client;
}

exports.createDetailsWin = function(_path) {
	var self = Ti.UI.createWindow({title: 'Details', backgroundColor:'#ffffff'});
	var thumbsize = Dropbox.getThumbSize(Dropbox.DB_THUMB_MEDIUM);
	var thumbview = Ti.UI.createImageView({top:10, left:10, height:thumbsize.height, width:thumbsize.width});
	self.add(thumbview);
	
	// Create and cancel that overlays the thumb imageview
	var cancelBut = Ti.UI.createButton({title: 'Cancel\nThumb',
		top:10, left:10, height:thumbsize.height, width:thumbsize.width});
	self.add(cancelBut);
	cancelBut.addEventListener('click',function(e){
		DBC.cancelThumbnailLoad({path:_path, size: Dropbox.DB_THUMB_MEDIUM});
	});
	
	DBC.addEventListener('loadedThumbnail', function(e){
		cancelBut.hide();
		thumbview.setImage(e.thumbnail.file);
	});
	
	DBC.loadThumbnail({path:_path, size: Dropbox.DB_THUMB_MEDIUM});
	return self;
}
