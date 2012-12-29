/**
 * @author Neville Dastur
 */

var m_popmenu = require('popmenu');
m_popmenu.addAction('Show thumbnail','thumb');
m_popmenu.addAction('Download File','dl');
m_popmenu.addAction('Create Folder','mkdir');
//m_popmenu.addAction('','');
m_popmenu.addAction('Cancel','cancel');

exports.createFileListWin = function(_metadata) {
	var self = Ti.UI.createWindow({});
	var i;
	var data = [];
	for(i=0;i<_metadata.length;i++) {
		var lbl = Ti.UI.createLabel({text: _metadata[i].filename, textAlign: 'left', left: '30dp'});
		var tr = Ti.UI.createTableViewRow({
			hasDetail: (_metadata[i].isDirectory)?true:false,
			hasChild: (_metadata[i].isDirectory)?false:true,
			leftImage: '/DBIcons16/'+_metadata[i].icon+'.gif',
		});
		tr.add(lbl);
		data.push(tr);
	}
	var tv = Ti.UI.createTableView({
		data: data,
		minRowHeight: '44dp',
		});
	self.add(tv);
	
	tv.addEventListener('click', function(e){
		var popmenu = m_popmenu.createPopupMenu("filelist");
		popmenu.open();		
	});
	
	return self;
}
