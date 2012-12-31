/**
 * @author Neville Dastur
 */

var m_popmenu = require('popmenu');
m_popmenu.addAction('Download File','dl');
m_popmenu.addAction('Show detail view','detail');
m_popmenu.addAction('Get copy ref','copyref');
m_popmenu.addAction('Get Share Link','share');
m_popmenu.addAction('Get streamable Link','stream');
m_popmenu.addAction('Load revisions','revs');
m_popmenu.addAction('Restore file','restore');
m_popmenu.addAction('Copy file','copy');
m_popmenu.addAction('Move file','move');
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
			path: _metadata[i].path,
			fn: _metadata[i].filename,
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
		var popmenu = m_popmenu.createPopupMenu({
			name: "filelist",
			data: {
				path: e.row.path,
				filename: e.row.fn,
			}
		});
		popmenu.open();		
	});
	
	return self;
}
