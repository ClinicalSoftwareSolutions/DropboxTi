/**
 * @author Neville Dastur
 */
var m_mainWin;
var m_actions = [];
var m_data = null;

exports.createPopupMenu = function(_args) {
	Ti.API.info("Path passed createPopupMenu: " + _args.data.path);
	m_data = _args.data;
	
	Ti.API.info(typeof(_args.actions));
	if(_args.actions) {
		m_actions = _args.actions;
	}
	var m_mainWin = Ti.UI.createWindow({
		backgroundColor:'#000000', opacity:'30%'});
	
	var subView = Ti.UI.createView({width:'280dp', height:'400dp',backgroundColor:'#ffffff'});
	var headLbl = Ti.UI.createLabel({text:'Choose Action', font: { fontSize:26 },textAlign:'center',
		top:'0dp', heigth:'44dp', width:Ti.UI.FILL,
		backgroundColor:'#f5f5f5'});
	subView.add(headLbl);
	var tv = Ti.UI.createTableView({top:'44dp', minRowHeight:'44dp', data: m_actions});
	subView.add(tv);
	
	tv.addEventListener('click',function(e){
		if(e.row.func!=="cancel") {
			Ti.App.fireEvent('app:PopMenu_'+_args.name, {
				func: e.row.func,
				data: m_data,
			});
		}
		m_mainWin.close();
	});

	m_mainWin.add(subView);
	return m_mainWin;
}

exports.addAction = function(_actionTitle, _actionFunctionName,_props) {
	m_actions.push({
		title: _actionTitle,
		func: _actionFunctionName,
		props: _props
		});
}
