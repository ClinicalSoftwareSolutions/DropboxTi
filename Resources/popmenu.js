/**
 * @author Neville Dastur
 */
var m_mainWin;
var m_actions = [];

exports.createPopupMenu = function(_name ,_actions) {
	Ti.API.info(typeof(_actions));
	if(_actions) {
		m_actions = _actions;
	}
	var m_mainWin = Ti.UI.createWindow({fullscreen: true, backgroundColor:'#000000', opacity:'70%'});
	
	var subView = Ti.UI.createView({width:'280dp', height:'400dp'});
	var headLbl = Ti.UI.createLabel({text:'Choose Action', top:'0dp', heigth:'44dp', font: {weight:'bold'}});
	subView.add(headLbl);
	var tv = Ti.UI.createTableView({top:'44dp', minRowHeight:'44dp', data: m_actions});
	subView.add(tv);
	
	tv.addEventListener('click',function(e){
		if(e.row.func!=="cancel") {
			Ti.App.fireEvent('app:PopMenu_'+_name, {
				func: e.row.func,
			});
		}
		m_mainWin.close();
	});

	m_mainWin.add(subView);
	return m_mainWin;
}

exports.addAction = function(_actionTitle, _actionFunctionName) {
	m_actions.push({
		title: _actionTitle,
		func: _actionFunctionName
		});
}
