/* [nodename, id, name, navigationtext, href, isnavigation, childs[], templatename] */

if (typeof(decodeURIComponent) == 'undefined') {
  decodeURIComponent = function(s) {
    return unescape(s);
  }
}

function jdecode(s) {
    s = s.replace(/\+/g, "%20")
    return decodeURIComponent(s);
}

var POS_NODENAME=0;
var POS_ID=1;
var POS_NAME=2;
var POS_NAVIGATIONTEXT=3;
var POS_HREF=4;
var POS_ISNAVIGATION=5;
var POS_CHILDS=6;
var POS_TEMPLATENAME=7;
var POS_TARGET=8;
var theSitetree=[ 
	['PAGE','5001',jdecode('Home'),jdecode(''), jdecode('%2F5001.html'), 'true',[],'',''],
	['PAGE','6401',jdecode('Services'),jdecode(''), jdecode('%2F6401.html'), 'true',[],'',''],
	['PAGE','6422',jdecode('Media'),jdecode(''), jdecode('%2F6422.html'), 'true',[],'',''],
	['PAGE','6443',jdecode('Contact'),jdecode(''), jdecode('%2F6443.html'), 'true',[],'',''],
	['PAGE','6901',jdecode('Location'),jdecode(''), jdecode('%2F6901.html'), 'true',[],'','']];
var siteelementCount=5;
theSitetree.topTemplateName='Collage';
theSitetree.paletteFamily='F9C116';
theSitetree.keyvisualId='2469';
theSitetree.keyvisualName='verkehr.jpg';
theSitetree.fontsetId='403';
theSitetree.graphicsetId='459';
theSitetree.contentColor='000000';
theSitetree.contentBGColor='FFFFFF';
var localeDef={
  language: 'en',
  country: 'US'
};
var prodDef={
  wl_name: 'qwest',
  product: 'WSCSYSSSSLYTCPH7'
};
var theTemplate={
				hasFlashNavigation: 'false',
				hasFlashLogo: 	'false',
				hasFlashCompanyname: 'false',
				hasFlashElements: 'false',
				hasCompanyname: 'false',
				name: 			'Collage',
				paletteFamily: 	'F9C116',
				keyvisualId: 	'2469',
				keyvisualName: 	'verkehr.jpg',
				fontsetId: 		'403',
				graphicsetId: 	'459',
				contentColor: 	'000000',
				contentBGColor: 'FFFFFF',
				a_color: 		'FFFFFF',
				b_color: 		'F9C116',
				c_color: 		'FFFFFF',
				d_color: 		'FFFFFF',
				e_color: 		'FFFFFF',
				f_color: 		'FFFFFF',
				hasCustomLogo: 	'false',
				contentFontFace:'Verdana, Arial, Helvetica, sans-serif',
				contentFontSize:'12',
				useFavicon:     'false'
			  };
var webappMappings = {};
webappMappings['5000']=webappMappings['5000-']={
webappId:    '5000',
documentId:  '5001',
internalId:  '',
customField: '20130628-143552'
};
webappMappings['7060']=webappMappings['7060-81d3d0c72c921d55589629af065535f4']={
webappId:    '7060',
documentId:  '6422',
internalId:  '81d3d0c72c921d55589629af065535f4',
customField: 'language:en;country:US;'
};
webappMappings['5000']=webappMappings['5000-']={
webappId:    '5000',
documentId:  '6401',
internalId:  '',
customField: '20130628-144638'
};
webappMappings['5000']=webappMappings['5000-']={
webappId:    '5000',
documentId:  '6443',
internalId:  '',
customField: '20130628-145019'
};
webappMappings['5000']=webappMappings['5000-']={
webappId:    '5000',
documentId:  '6422',
internalId:  '',
customField: '20130628-141557'
};
webappMappings['5000']=webappMappings['5000-']={
webappId:    '5000',
documentId:  '6901',
internalId:  '',
customField: '20130628-152049'
};
var webAppHostname = 'cgi-wsc.chi.us.siteprotect.com:80';
var canonHostname = 'wsc-worker02.chi.us.siteprotect.com';
var accountId     = 'AHW050INPQOM';
var companyName   = 'Ken%27s+Service+Center%2C+LLC';
var htmlTitle	  = '';
var metaKeywords  = '';
var metaContents  = '';
theSitetree.getById = function(id, ar) {
	if (typeof(ar) == 'undefined'){
		ar = this;
	}
	for (var i=0; i < ar.length; i++) {
		if (ar[i][POS_ID] == id){
			return ar[i];
		}
		if (ar[i][POS_CHILDS].length > 0) {
			var result=this.getById(id, ar[i][POS_CHILDS]);
			if (result != null){
				return result;
			}
		}
	}
	return null;
};

theSitetree.getParentById = function(id, ar) {
	if (typeof(ar) == 'undefined'){
		ar = this;
	}
	for (var i=0; i < ar.length; i++) {
		for (var j = 0; j < ar[i][POS_CHILDS].length; j++) {
			if (ar[i][POS_CHILDS][j][POS_ID] == id) {
				// child found
				return ar[i];
			}
			var result=this.getParentById(id, ar[i][POS_CHILDS]);
			if (result != null){
				return result;
			}
		}
	}
	return null;
};

theSitetree.getName = function(id) {
	var elem = this.getById(id);
	if (elem != null){
		return elem[POS_NAME];
	}
	return null;
};

theSitetree.getNavigationText = function(id) {
	var elem = this.getById(id);
	if (elem != null){
		return elem[POS_NAVIGATIONTEXT];
	}
	return null;
};

theSitetree.getHREF = function(id) {
	var elem = this.getById(id);
	if (elem != null){
		return elem[POS_HREF];
	}
	return null;
};

theSitetree.getIsNavigation = function(id) {
	var elem = this.getById(id);
	if (elem != null){
		return elem[POS_ISNAVIGATION];
	}
	return null;
};

theSitetree.getTemplateName = function(id, lastTemplateName, ar) {
	if (typeof(lastTemplateName) == 'undefined'){
		lastTemplateName = this.topTemplateName;
	}
	if (typeof(ar) == 'undefined'){
		ar = this;
	}
	for (var i=0; i < ar.length; i++) {
		var actTemplateName = ar[i][POS_TEMPLATENAME];
		if (actTemplateName == ''){
			actTemplateName = lastTemplateName;
		}
		if (ar[i][POS_ID] == id) {
			return actTemplateName;
		}
		if (ar[i][POS_CHILDS].length > 0) {
			var result=this.getTemplateName(id, actTemplateName, ar[i][POS_CHILDS]);
			if (result != null){
				return result;
			}
		}
	}
	return null;
};

theSitetree.getByXx = function(lookup, xx, ar) {
    if (typeof(ar) == 'undefined'){
    	ar = this;
    }
    for (var i=0; i < ar.length; i++) {
        if (ar[i][xx] == lookup){
        	return ar[i];
        }
        if (ar[i][POS_CHILDS].length > 0) {
        	var result=this.getByXx(lookup, xx, ar[i][POS_CHILDS]);
            if (result != null){
                return result;
               }
        }
    }
    return null;
};

function gotoPage(lookup) {
	if(__path_prefix__ == "/servlet/CMServeRES" && typeof (changePage) == 'function'){
		changePage(lookup);
		return;
	}
	var page = theSitetree.getHREF(lookup);
	if (!page) {
		var testFor = [ POS_NAME, POS_NAVIGATIONTEXT ];
		for (var i=0 ; i < testFor.length ; i++) {
			var p = theSitetree.getByXx(lookup, testFor[i]);
			if (p != null) {
				page = p[POS_HREF];
				break;
			}
		}
	}
	document.location.href = (new URL(__path_prefix__ + page, true, true)).toString();
};
