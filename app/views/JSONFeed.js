Ext.ns("foodtruck");

foodtruck.JSONFeedPanel = Ext.extend(Ext.Panel, {
	fullscreen: true,
	layout: 'card',
	cls:'feeds-group',
	
	initComponent: function() {
		Ext.apply(this, {
			items:[{
				xtype:'foodtruck-carousel'
			}]		
		});
		foodtruck.JSONFeedPanel.superclass.initComponent.apply(this, arguments);
		this.on({
            scope: this,
            beforerender: this.Request
        });	
	},
		
	Request: function(){
		store = Ext.getStore('ProductCarouselStore');
		store.each(function(){
			var me = this;
			var store = new Ext.data.Store({
					model: 'JSONFeed',
			});
			var dataview = new Ext.DataView({
				layout: 'card',
				tpl : new Ext.XTemplate(
				    '<tpl for=".">'+
					   '<div class="group-feed-widget">'+
							'<div class="widget-title">{name}</div>'+
							'<br />'+
							'<div class="product-info"><i>{dishInfo}</i></div>'+
							'<br /><img src="{image}">'+
							'<div class="product-description">{product}</div>'+
							'<br />'+
							'<div class="buy-button-holder">${price} <div class="buy-button">Add to Order</div></div>'+
					   '</div>'+
					'</tpl>'
				),
				cls: me.data.name,
				itemSelector: 'div.buy-button', 
				store: store,
				listeners: {
					itemtap: function(item, index, e){
						var record = this.store.getAt(index);
						var cents = parseFloat(record.data.price); //allows for cents in price, use this instead of record.data.price which could be a string
						Ext.Msg.alert('', 'Added ' + record.data.name + ' to order', Ext.emptyFn);
						var orderitem = Ext.ModelMgr.create({query: record.data.name, paypalQuery: record.data.paypalQuery, price: record.data.price, listPrice: cents }, 'Item');
						orderitem.save();

						Ext.dispatch({
						    controller: "storeCount",
							action    : "count"
						});
					}
				}
			});
			store.add(me.data);
			Ext.getCmp(me.data.name).add(dataview);
	     });		
	}
});
Ext.reg("foodtruck-jsonfeed-panel", foodtruck.JSONFeedPanel);