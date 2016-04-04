function AppleCentralitzat(){
	var baseUrl = "http://sc-pre.aoc.cat/appletCentralitzat",
		appUrl = window.location.protocol + "//" + window.location.host,
		receiveSignatureService = "/demo/receiveSignature",
		checkReceiveSignatureService = "/demo/checkReceiveSignature";
	
	this.getStartSignUrl = function() {
		return baseUrl + '/startSignProcess';
	}

	this.getResponseSignature = function(){
		return baseUrl + '/responseSignature';
	}

	this.getReceiveSignatureUrl = function(){
		return appUrl + receiveSignatureService;
	}

	this.getCheckReceiveSignature = function(){
		return appUrl + checkReceiveSignatureService;
	}

	this.setReceiveSignatureUrl = function(service){
		receiveSignatureService = service;
	}

	this.setCheckReceiveSignature = function(service){
		checkReceiveSignatureService = service;
	}


	this.baseSetup = {
		callbackUrl : this.getReceiveSignatureUrl(),
		id_intern : "1",
		descripcio : "Signatura de document",
		applet_cfg : {}
	},

	this.sign = function(config){
		console.log(config)
		var msg = [];
		if(!config){
			msg.push("configuraci&oacute; incorrecta de la signatura");
		}

		if(!config.keystore_type || isNaN(config.keystore_type)){
			msg.push("keystore_type incorrecte");
		}

		if(!config.signature_mode || isNaN(config.signature_mode)){
			msg.push("signature_mode incorrecte");
		}

		if(!config.doc_type || isNaN(config.doc_type)){
			msg.push("doc_type incorrecte");
		}

		if(!config.document_to_sign || config.document_to_sign.length===0){
			msg.push("document_to_sign incorrecte");
		}

		if(msg.length>0){
			alert(msg.join("\n"));
			return;
		}

		this.baseSetup.applet_cfg = config;
		this.baseSetup.applet_cfg.signButtonCaption = "Signa";
		this.baseSetup.applet_cfg.js_event = "true";

		console.log(JSON.stringify(this.baseSetup.applet_cfg ))

		var newWindow = window.open();
		var data = JSON.stringify(this.baseSetup);
		$.ajax({
	    	headers: { 
	        	'Accept': 'application/json',
	        	'Content-Type': 'application/json' 
	    	},
	    	'type': 'POST',
	    	'url': this.getStartSignUrl(),
	    	'data': data,
	    	'dataType': 'json',
	    	'success': this.signCallback(newWindow, this),
	    	'error' : function(){
	    		alert('error')
	    	}
		});

	},

	this.signCallback = function (window, origin_applet){ 
		return function (data){
			if(data.status === 'OK'){
				window.location = baseUrl+'?id=' + data.tokenId;
				var checkResponse = setInterval(function(){
					$.ajax({
				    	headers: { 
				        	'Accept': 'application/json',
				        	'Content-Type': 'application/json' 
				    	},
				    	'type': 'POST',
				    	'url': origin_applet.getCheckReceiveSignature(),
				    	'data': JSON.stringify({"token" : data.tokenId}),
				    	'dataType': 'text',
				    	'success': function (data){
							if(data.length>0){
								$('body').append('<br /><br />Contingut de la signatura:<br /><textarea style="width:50%" rows="50">' + data + '</textarea>');
								clearInterval(checkResponse);
							}
						},
				    	'error' : function(err){
				    		alert('error')
				    	}
					});
				}, 3000);
			}else{
				window.close();
			}
		}
	},

	this.test = function(){
		this.sign()
	}

}

var applet = new AppleCentralitzat();
