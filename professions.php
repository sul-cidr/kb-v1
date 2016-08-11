<html>
<head>
	<title>Fam/Brit::PROD  (19Jun)</title>
	<link rel="stylesheet" type="text/css" href="../lib/ext-3.4.0/resources/css/ext-all.css" />
	<link rel="stylesheet" type="text/css" href="css/examples.css" />
	<script type="text/javascript" src="../lib/ext-3.4.0/adapter/ext/ext-base.js"></script>
	<script type="text/javascript" src="../lib/ext-3.4.0/ext-all.js"></script>
	<script>
	Ext.onReady(function(){
		Ext.BLANK_IMAGE_URL = 'images/s.gif';
		Ext.QuickTips.init();
		Ext.form.VTypes.nameVal  = /^[A-Z][A-Za-z]+\s[A-Z][A-Za-z]+$/;
		Ext.form.VTypes.nameMask = /[A-Za-z ]/;
		Ext.form.VTypes.nameText = 'Invalid Director Name.';
		Ext.form.VTypes.name = function(v){
			return Ext.form.VTypes.nameVal.test(v);
		}
		var id_name = { columnWidth: .35, layout: 'form',
			items: [{
				xtype: 'textfield',
				fieldLabel: 'Indiv ID',
				name: 'indiv_id',
				allowBlank: false,
				width: 50
			},{
				xtype: 'textarea',
				fieldLabel: 'Full name',
				name: 'fullname',
				width: 250,
				height: 50
			}, {
				xtype: 'textfield',
				fieldLabel: 'Rec #',
				name: 'recno',
				width: 50
			}, {
				xtype: 'textarea',
				fieldLabel: 'Existing tags',
				name: 'notes',
				width: 250,
				height: 35
			}]
		}
		var years = { columnWidth: .27, layout: 'form',
			items: [{
				xtype: 'textfield',
				fieldLabel: 'Birth year',
				name: 'byear',
				width: 50
			},{
				xtype: 'textfield',
				fieldLabel: 'Death year',
				name: 'dyear',
				width: 50
			},{
				xtype: 'textfield',
				fieldLabel: 'New tag(s)',
				name: 'tags',
				width: 100
			}, {
				xtype: 'textarea',
				fieldLabel: 'Tag notes',
				name: 'profnotes',
				autoScroll: true,
				height: 50,
				width: 165
			}]	
		}
		var occu = { columnWidth: .38, layout: 'form',
			items: [{
					xtype: 'textarea',
					fieldLabel: 'OCCU',
					name: 'occutext',
					autoScroll: true,
					labelWidth: 50,
					height: 140,
					width: 300
			}]	
		}
		set1 = {
			xtype: 'checkboxgroup',
			fieldLabel: '<b>Business/Finance/<br/>Property</b>',
			itemCls: 'x-check-group-alt',
			id: 'cbg_set1',
			border: true,
			columns: 7,
			vertical: true,
			items: [

				 {boxLabel: 'adviser', value: 'adviser', name: 'cb-vert-5'},
				 {boxLabel: 'banker', value: 'banker', name: 'cb-vert-2'},
				 {boxLabel: 'businessperson', value: 'businessperson', id: 'cb1_5'},
				 {boxLabel: 'financial manager', value: 'financial manager', name: 'cb-vert-1'},
				 {boxLabel: 'financier', value: 'financier', name: 'cb-vert-1'},
				 {boxLabel: 'industrialist', value: 'industrialist', 
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb1_5').setValue(1);}}},
				 {boxLabel: 'landowner', value: 'landowner', name: 'cb-vert-4'},
				 {boxLabel: 'manager', value: 'manager', name: 'cb-vert-3'},
				 {boxLabel: 'merchant', value: 'merchant', 
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb1_5').setValue(1);}}},
				 {boxLabel: 'shipowner', value: 'shipowner', name: 'cb-vert-4'}
			]
	  }
	  	set2 = {
			xtype: 'checkboxgroup',
			fieldLabel: '<b>Colonies</b>',
			//itemCls: 'x-check-group-alt',
			id: 'cbg_set2',
			frame: true,
			columns: 7,
			vertical: true,
			items: [
				 {boxLabel: 'colonist', value: 'colonist', name: 'cb-vert-1'},
				 {boxLabel: 'colonized', value: 'colonized', name: 'cb-vert-2'},
				 {boxLabel: 'slaveowner', value: 'slaveowner', name: 'cb-vert-2'}
			]
	  }
	  	set3 = {
			xtype: 'checkboxgroup',
			fieldLabel: '<b>Politics</b>',
			itemCls: 'x-check-group-alt',
			id: 'cbg_set3',
			frame: true,
			columns: 7,
			vertical: true,
			items: [
				 {boxLabel: 'abolitionist', value: 'abolitionist', 
					handler: function(field, value) {if(value) {Ext.getCmp('cb3_9').setValue(1);}}},
				 {boxLabel: 'activist', value: 'activist', id: 'cb3_9'},
				 {boxLabel: 'chancellor of the<br/>&nbsp;&nbsp;&nbsp;&nbsp;exchequer', value: 'chancellor of the exchequer'},
				 {boxLabel: 'colonial politician', value: 'colonial politician',  
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb3_1').setValue(1);}}},
				 {boxLabel: 'feminist', value: 'feminist',  
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb3_9').setValue(1);}}},
				 {boxLabel: 'foreign secretary', value: 'foreign secretary', 
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb3_1').setValue(1);}}},
				 {boxLabel: 'governor', value: 'governor', name: 'cb-vert-2'},
				 {boxLabel: 'home secretary', value: 'home secretary', 
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb3_1').setValue(1);}}},
				 {boxLabel: 'political rebel', value: 'political rebel', id: 'cb3_12'},
				 {boxLabel: 'politician', value: 'politician', id: 'cb3_1'},
				 {boxLabel: 'president', value: 'president', 
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb3_1').setValue(1);}}},
				 {boxLabel: 'prime minister', value: 'prime minister', 
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb3_1').setValue(1);}}},
				 {boxLabel: 'privy councellor', value: 'privy councellor'},		 
				 {boxLabel: 'spy',  value: 'spy',
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb3_12').setValue(1);}}},
				 {boxLabel: 'viceroy', value: 'viceroy', name: 'cb-vert-1'}
			]
	  }
	  	set4 = {
			xtype: 'checkboxgroup',
			fieldLabel: '<b>Diplomacy/<br/>Civil Service</b>',
			//itemCls: 'x-check-group-alt',
			id: 'cbg_set4',
			frame: true,
			columns: 7,
			vertical: true,
			items: [
				{boxLabel: 'administrator', value: 'administrator'},
				 {boxLabel: 'civil servant', value: 'civil servant', id: 'cb4_2'},
				 {boxLabel: 'colonial<br/>&nbsp;&nbsp;&nbsp;&nbsp;civil servant', value: 'colonial civil servant',  
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb4_2').setValue(1);}}},
				 {boxLabel: 'diplomat', value: 'diplomat', name: 'cb-vert-1'},					
				{boxLabel: 'official', value: 'official'},
				{boxLabel: 'public servant', value: 'public servant'}
			]
	  }
	  	set5 = {
			xtype: 'checkboxgroup',
			fieldLabel: '<b>Law</b>',
			itemCls: 'x-check-group-alt',
			id: 'cbg_set5',
			frame: true,
			columns: 7,
			vertical: true,
			items: [
				{boxLabel: 'judge', value: 'judge', name: 'cb-vert-2'},			
				{boxLabel: 'jurist', value: 'jurist', name: 'cb-vert-2'},	
				{boxLabel: 'law officer', value: 'law officer', name: 'cb-vert-2'},
				{boxLabel: 'lawyer', value: 'lawyer', name: 'cb-vert-1'}
				 ]
	  }		
	  	set6 = {
			xtype: 'checkboxgroup',
			fieldLabel: '<b>Medicine</b>',
			//itemCls: 'x-check-group-alt',
			id: 'cbg_set6',
			frame: true,
			columns: 7,
			vertical: true,
			items: [
				 {boxLabel: 'doctor', value: 'doctor', name: 'cb-vert-1'},
				 {boxLabel: 'nurse', value: 'nurse', name: 'cb-vert-2'}
			]
	  }	
	  	set7 = {
			xtype: 'checkboxgroup',
			fieldLabel: '<b>Royalty/Court</b>',
			itemCls: 'x-check-group-alt',
			id: 'cbg_set7',
			frame: true,
			columns: 7,
			vertical: true,
			items: [
				 {boxLabel: 'courtier', value: 'courtier', name: 'cb-vert-2'},	
				 {boxLabel: 'magnate', value: 'magnate', name: 'cb-vert-2'},
				 {boxLabel: 'noble', value: 'noble', name: 'cb-vert-2'},	
				 {boxLabel: 'royalty', value: 'royalty', name: 'cb-vert-2'},
				 {boxLabel: 'sovereign', value: 'sovereign', name: 'cb-vert-1'},
			]
	  }	
	  	set8 = {
			xtype: 'checkboxgroup',
			fieldLabel: '<b>Armed Svcs/<br/>Merchant Navy</b>',
			//itemCls: 'x-check-group-alt',
			id: 'cbg_set8',
			frame: true,
			columns: 7,
			vertical: true,
			items: [
				 {boxLabel: 'sailor', value: 'sailor', id: 'cb8_1'},
				 {boxLabel: 'naval officer', value: 'naval officer',  
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb8_1').setValue(1);}}},
				 {boxLabel: 'airman', value: 'airman', id: 'cb8_3'},
				 {boxLabel: 'air force officer', value: 'air force officer',
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb8_3').setValue(1);}}},
				 {boxLabel: 'soldier', value: 'soldier', id: 'cb8_5'},
				 {boxLabel: 'army officer', value: 'army officer',
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb8_5').setValue(1);}}},	
				 {boxLabel: 'marine', value: 'soldier', id: 'cb8_7'},
				 {boxLabel: 'marine officer', value: 'army officer',
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb8_7').setValue(1);}}},	
				 {boxLabel: 'merchant officer', value: 'merchant officer'},
				 {boxLabel: 'intelligence officer', value: 'intelligence officer'}		
			]
	  }	
	  	set9 = {
			xtype: 'checkboxgroup',
			fieldLabel: '<b>Religion</b>',
			itemCls: 'x-check-group-alt',
			id: 'cbg_set9',
			frame: true,
			columns: 7,
			vertical: true,
			items: [
				 {boxLabel: 'archbishop', value: 'archbishop',
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb9_1').setValue(1);}}},
				 {boxLabel: 'religious figure', value: 'religious figure', id: 'cb9_1'},
				 {boxLabel: 'saint', value: 'saint',
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb9_1').setValue(1);}}}
			]
	  }	
	  	set10 = {
			xtype: 'checkboxgroup',
			fieldLabel: '<b>Arts/<br/>Humanities/<br/>Scholarship</b>',
			//itemCls: 'x-check-group-alt',
			id: 'cbg_set10',
			frame: true,
			columns: 7,
			vertical: true,
			items: [
				 {boxLabel: 'aesthete', value: 'aesthete',},
				 {boxLabel: 'architect', value: 'architect', name: 'cb-vert-1'},
				 {boxLabel: 'artist', value: 'artist', id: 'cb10_7'},
				 {boxLabel: 'author', value: 'author', id: 'cb10_3'},			
				 {boxLabel: 'classicist', value: 'classicist',
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb10_13').setValue(1);}}},	
				 {boxLabel: 'composer', value: 'composer',
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb10_10').setValue(1);}}},
				 {boxLabel: 'collector', value: 'collector', name: 'cb-vert-2'},
				 {boxLabel: 'curator', value: 'curator', name: 'cb-vert-2'},
				 {boxLabel: 'dancer', value: 'dancer', name: 'cb-vert-2'},
				 {boxLabel: 'designer', value: 'designer', name: 'cb-vert-2'},
				 {boxLabel: 'diarist', value: 'diarist', name: 'cb-vert-2'},
				 {boxLabel: 'dramatist', value: 'dramatist', name: 'cb-vert-1'},
				 {boxLabel: 'economist', value: 'economist',
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb10_13').setValue(1);}}},	
				 {boxLabel: 'film director', value: 'film director'},
				 {boxLabel: 'historian', value: 'historian',
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb10_13').setValue(1);}}},
				 {boxLabel: 'journalist', value: 'journalist', name: 'cb-vert-2'},
				 {boxLabel: 'linguist', value: 'linguist',
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb10_13').setValue(1);}}},	
				 {boxLabel: 'musician', value: 'musician', id: 'cb10_10'},
				 {boxLabel: 'novelist', value: 'novelist',
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb10_3').setValue(1);}}},
 				 {boxLabel: 'orientalist', value: 'orientalist'},
				 {boxLabel: 'painter', value: 'painter',
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb10_7').setValue(1);}}},
				 {boxLabel: 'performer (non-mus)', value: 'performer (non-musical)', name: 'cb-vert-2'},	
				 {boxLabel: 'philosopher', value: 'philosopher',
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb10_13').setValue(1);}}},
 				 {boxLabel: 'photographer', value: 'photographer'},
				 {boxLabel: 'poet', value: 'poet',
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb10_3').setValue(1);}}},
				 {boxLabel: 'publisher', value: 'publisher', name: 'cb-vert-2'},
				 {boxLabel: 'scholar', value: 'scholar', id: 'cb10_13'},
				 {boxLabel: 'sculptor', value: 'sculptor',
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb10_7').setValue(1);}}},	
				 {boxLabel: 'singer', value: 'singer'},
				 {boxLabel: 'sociologist', value: 'sociologist',
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb10_13').setValue(1);}}},	
				 {boxLabel: 'theologian', value: 'theologian',
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb10_13').setValue(1);}}}
			]
	  }	
	  	set11 = {
			xtype: 'checkboxgroup',
			fieldLabel: '<b>Education</b>',
			itemCls: 'x-check-group-alt',
			id: 'cbg_set11',
			frame: true,
			columns: 7,
			vertical: true,
			items: [
				 {boxLabel: 'educator', value: 'educator', name: 'cb-vert-1'}		]
	  }	
	  	set12 = {
			xtype: 'checkboxgroup',
			fieldLabel: '<b>Nature</b>',
			//itemCls: 'x-check-group-alt',
			id: 'cbg_set12',
			frame: true,
			columns: 7,
			vertical: true,
			items: [
				 {boxLabel: 'explorer', value: 'explorer', name: 'cb-vert-1'},	
 				 {boxLabel: 'naturalist', value: 'naturalist', name: 'cb-vert-2'} ]
	  }	
	  	set13 = {
			xtype: 'checkboxgroup',
			fieldLabel: '<b>Science/Eng</b>',
			itemCls: 'x-check-group-alt',
			id: 'cbg_set13',
			frame: true,
			columns: 7,
			vertical: true,
			items: [
				{boxLabel: 'agriculturalist', value: 'agriculturalist'},
				{boxLabel: 'anthropologist', value: 'anthropologist',
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb13_2').setValue(1);}}},
				{boxLabel: 'archaeologist', value: 'archaeologist',
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb13_2').setValue(1);}}},
				{boxLabel: 'astronomer', value: 'astronomer',
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb13_2').setValue(1);}}},
				{boxLabel: 'biologist', value: 'biologist',
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb13_2').setValue(1);}}},
				{boxLabel: 'botanist', value: 'botanist',
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb13_2').setValue(1);}}},
				{boxLabel: 'cartographer', value: 'cartographer'},
				{boxLabel: 'chemist', value: 'chemist',
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb13_2').setValue(1);}}},
				{boxLabel: 'civil engineer', value: 'civil engineer',
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb13_4').setValue(1);}}},
				{boxLabel: 'conservationist', value: 'conservationist',
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb13_4').setValue(1);}}},
				{boxLabel: 'engineer', value: 'engineer', id: 'cb13_4'},	
				{boxLabel: 'geographer', value: 'geographer',
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb13_2').setValue(1);}}},
				{boxLabel: 'geologist', value: 'geologist',
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb13_2').setValue(1);}}},
				{boxLabel: 'inventor', value: 'inventor'},
				{boxLabel: 'mathematician', value: 'mathematician'},
				{boxLabel: 'mech engineer', value: 'mechanical engineer',
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb13_4').setValue(1);}}},
				{boxLabel: 'meteorologist', value: 'meteorologist',
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb13_2').setValue(1);}}},
				{boxLabel: 'physicist', value: 'physicist',
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb13_2').setValue(1);}}},
				{boxLabel: 'physiologist', value: 'physiologist',
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb13_2').setValue(1);}}},
				{boxLabel: 'psychologist', value: 'psychologist',
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb13_2').setValue(1);}}},
				{boxLabel: 'scientist', value: 'scientist', id: 'cb13_2'},
				{boxLabel: 'surveyor', value: 'surveyor'},
				{boxLabel: 'zoologist', value: 'zoologist',
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb13_2').setValue(1);}}},

				]
	  }	
	  	set14 = {
			xtype: 'checkboxgroup',
			fieldLabel: '<b>Society</b>',
			//itemCls: 'x-check-group-alt',
			id: 'cbg_set14',
			frame: true,
			columns: 7,
			vertical: true,
			items: [
				 {boxLabel: 'celeb/notorious', value: 'celebrity/person of notoriety', name: 'cb-vert-2'},		
				 {boxLabel: 'criminal/outlaw', value: 'criminal/outlaw', name: 'cb-vert-2'},
				 {boxLabel: 'dandy', value: 'dandy',
				 	handler: function(field, value) {if(value) {Ext.getCmp('cb14_3').setValue(1);}}},
				 {boxLabel: 'patron', value: 'patron', name: 'cb-vert-1'},
				 {boxLabel: 'society figure', value: 'society figure', id: 'cb14_3'},
				 {boxLabel: 'traveller', value: 'traveller', name: 'cb-vert-1'}			
			]
	  }		  
	  	set15 = {
			xtype: 'checkboxgroup',
			fieldLabel: '<b>Sport/Trade/Labour</b>',
			itemCls: 'x-check-group-alt',
			id: 'cbg_set15',
			frame: true,
			columns: 7,
			vertical: true,
			items: [
				 {boxLabel: 'agent', value: 'agent', name: 'cb-vert-1'},
				 {boxLabel: 'artisan', value: 'artisan', name: 'cb-vert-2'},
				 {boxLabel: 'athlete', value: 'athlete', name: 'cb-vert-1'},
				 {boxLabel: 'chef', value: 'chef', name: 'cb-vert-1'},
				 {boxLabel: 'clerk', value: 'clerk', name: 'cb-vert-1'},
				 {boxLabel: 'farmer', value: 'farmer', name: 'cb-vert-2'},
				 {boxLabel: 'gardener', value: 'gardener', name: 'cb-vert-2'},
				 {boxLabel: 'labourer', value: 'labourer', name: 'cb-vert-1'},
				 {boxLabel: 'lunatic', value: 'lunatic', name: 'cb-vert-2'},		
				 {boxLabel: 'printer', value: 'printer', name: 'cb-vert-2'},	
				 {boxLabel: 'record keeper', value: 'record keeper', name: 'cb-vert-2'},
				 {boxLabel: 'secretary', value: 'secretary', name: 'cb-vert-1'},
				 {boxLabel: 'servant', value: 'servant', name: 'cb-vert-2'}	,	
				 {boxLabel: 'tradesman', value: 'tradesman', name: 'cb-vert-2'}
			]
	  }		  
	  
	  
	  famous_form = new Ext.FormPanel({ 
			url: 'php/q_famous_submit.php',
			renderTo: "div-bigform",
			frame: true,
			title: 'Assign Professions',
			width: 1050,
			labelWidth: 75,	
			items: [{
				xtype: 'fieldset',
				title: 'base data',
				hideBorders: true,
				layout: 'column',
				items:[id_name, years, occu]
			}, {
				xtype: 'fieldset',
				title: 'professions',
				id: 'allprofs',
				//hideBorders: true,
				layout: 'form',
				labelWidth: 110,
				items:[set1, set2, set3, set4, set5, set6, set7, set8, set9, set10,set11, set12, set13, set14, set15] //, col2, col3]
			}
			],
			buttons: [{
				text: 'Save and get next',
				handler: function(){
					// aggregate all sets
					profarray = new Array();
					profarray = profarray.concat(Ext.pluck(Ext.getCmp('cbg_set1').getValue(), 'value'))
					profarray = profarray.concat(Ext.pluck(Ext.getCmp('cbg_set2').getValue(), 'value'))
					profarray = profarray.concat(Ext.pluck(Ext.getCmp('cbg_set3').getValue(), 'value'))
					profarray = profarray.concat(Ext.pluck(Ext.getCmp('cbg_set4').getValue(), 'value'))
					profarray = profarray.concat(Ext.pluck(Ext.getCmp('cbg_set5').getValue(), 'value'))
					profarray = profarray.concat(Ext.pluck(Ext.getCmp('cbg_set6').getValue(), 'value'))
					profarray = profarray.concat(Ext.pluck(Ext.getCmp('cbg_set7').getValue(), 'value'))
					profarray = profarray.concat(Ext.pluck(Ext.getCmp('cbg_set8').getValue(), 'value'))
					profarray = profarray.concat(Ext.pluck(Ext.getCmp('cbg_set9').getValue(), 'value'))
					profarray = profarray.concat(Ext.pluck(Ext.getCmp('cbg_set10').getValue(), 'value'))
					profarray = profarray.concat(Ext.pluck(Ext.getCmp('cbg_set11').getValue(), 'value'))
					profarray = profarray.concat(Ext.pluck(Ext.getCmp('cbg_set12').getValue(), 'value'))
					profarray = profarray.concat(Ext.pluck(Ext.getCmp('cbg_set13').getValue(), 'value'))
					profarray = profarray.concat(Ext.pluck(Ext.getCmp('cbg_set14').getValue(), 'value'))
					profarray = profarray.concat(Ext.pluck(Ext.getCmp('cbg_set15').getValue(), 'value'))
					// Ext.pluck(Ext.getCmp('cbg_set1').getValue(), 'value')
					famous_form.getForm().submit({
						method: 'GET',
						params: {
							i: famous_form.getForm().findField('indiv_id').value,
							p: profarray.join(),
							t: famous_form.getForm().getValues().tags,
							n: famous_form.getForm().getValues().profnotes
						},
						success: function(form, action){
							// Ext.Msg.alert('Success', 'It worked...maybe; check the db');
							famous_form.getForm().reset();
							famous_form.getForm().load({url:'php/q_famous_get.php'});
						},
						failure: function(form, action){
							if (action.failureType == Ext.form.Action.CLIENT_INVALID) {
								Ext.Msg.alert("Cannot submit", "Some fields are still invalid");
							} else if (action.failureType === Ext.form.Action.CONNECT_FAILURE) {
								Ext.Msg.alert('Failure', 'Server communication failure: '+a.response.status+' '+a.response.statusText);
							}
						}
					});

				}
			}]
		});

	function getNewTags(){
		var req = Ext.Ajax.request( {
			 // relative path
			url: 'php/q_gettags.php',
			method: 'GET',
			success: function(req) {
				response = req.responseText;
				if ((/^ERROR|INFO/).test(response) || response === '') {
				  alert("ERROR/INFO" + response);
				} else {
				// alert (response);
					jsonTags = eval('(' + response + ')');
					document.getElementById("div-newtags").innerHTML = jsonTags;
				}
			}
		})
	};
	function getOne(){
		var req = Ext.Ajax.request( {
			 // relative path
			url: 'php/q_famous_get.php',
			method: 'GET',
			success: function(req) {
				response = req.responseText;
				if ((/^ERROR|INFO/).test(response) || response === '') {
				  alert("ERROR/INFO" + response);
				} else {
				// alert (response);
					jsonObj = eval('(' + response + ')');
					//ds.loadData(jsonObject);
					famous_form.getForm().load(jsonObj);
				}
			}
		})
	};
		//getOne();
		famous_form.getForm().load({url:'php/q_famous_get.php'}); //,params:{id: 1}
		getNewTags();
		//next = parseInt(famous_form.getForm().findField('recno').value) + 1
	});
	</script>
</head>
<body><div id="content" style="width:1200px;">
<div id="div-bigform" style=" float:left"></div>
<div id="div-newtags" style=" float:left; padding-left:5px;"><h3>tags added to date</h3><br/>
<?php
include("../conn/conn_webapp.php");
$dbconn = pg_connect($connectString_kindred_prod);
if (!$dbconn) {
  handleError('Could not connect to the database');
}
$sql = "select distinct(tags) from indiv_text order by tags;";
 //$foo = pg_query("set search_path = i;"); 
 $res = pg_query($sql);
  if ($res) {
	$r = 0;
	while ($row = pg_fetch_row($res)) {
		echo $row[0]."<br/>";
	  $r++;
	$count = $r;
	}
  }
?>
</div>
</div>
</body>
</html>