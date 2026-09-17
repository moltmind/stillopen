var nav_footerlinks = new Object();

nav_footerlinks.mouseoverBold="false";
nav_footerlinks.selectedBgcolor="";
nav_footerlinks.importedImageMouseOver="";
nav_footerlinks.numLinks="5";
nav_footerlinks.textColor="#FFFFFF";
nav_footerlinks.mouseoverBgcolor="";
nav_footerlinks.tabCategory="basic";
nav_footerlinks.border="";
nav_footerlinks.selectedItalic="false";
nav_footerlinks.graphicMouseover="false";
nav_footerlinks.type="Navigation";
nav_footerlinks.basicTab="White";
nav_footerlinks.horizontalSpacing="20";
nav_footerlinks.horizontalWrap="6";
nav_footerlinks.shinyButton="Shiny_Aqua";
nav_footerlinks.mouseoverEffect="true";
nav_footerlinks.modernButton="Basic_Black";
nav_footerlinks.orientation="horizontal";
nav_footerlinks.funButton="Arts_and_Crafts";
nav_footerlinks.darkButton="Basic_Black";
nav_footerlinks.selectedTextcolor="#FFFFFF";
nav_footerlinks.lineWidth="1";
nav_footerlinks.mouseoverTextcolor="";
nav_footerlinks.bold="false";
nav_footerlinks.texturedButton="Brick";
nav_footerlinks.accentStyle="Square";
nav_footerlinks.style="text";
nav_footerlinks.holidayButton="Christmas_Ornaments";
nav_footerlinks.textSize="9";
nav_footerlinks.lineColor="#FFFFFF";
nav_footerlinks.brightButton="Chicky";
nav_footerlinks.mouseoverUnderline="false";
nav_footerlinks.accentColor="Black";
nav_footerlinks.imageHeight="";
nav_footerlinks.background="";
nav_footerlinks.textFont="Arial";
nav_footerlinks.hasLinks="true";
nav_footerlinks.sophisticatedButton="Antique";
nav_footerlinks.underline="false";
nav_footerlinks.simpleButton="Autumn_Leaves";
nav_footerlinks.italic="false";
nav_footerlinks.importedImageSelected="";
nav_footerlinks.basicButton="Gray";
nav_footerlinks.navID="nav_footerlinks";
nav_footerlinks.buttonCategory="basic";
nav_footerlinks.dirty="false";
nav_footerlinks.selectedBold="false";
nav_footerlinks.selectedEffect="true";
nav_footerlinks.graphicSelected="false";
nav_footerlinks.version="5";
nav_footerlinks.verticalSpacing="10";
nav_footerlinks.squareTab="Camel";
nav_footerlinks.mouseoverItalic="false";
nav_footerlinks.justification="left";
nav_footerlinks.imageWidth="";
nav_footerlinks.selectedUnderline="false";
nav_footerlinks.accentType="lines";
nav_footerlinks.importedImage="";
nav_footerlinks.width="424";
nav_footerlinks.height="15";

nav_footerlinks.navName = "footerlinks";
nav_footerlinks.imagePath = "null";
nav_footerlinks.selectedImagePath = "/~media/elements/LayoutClipart/";
nav_footerlinks.mouseOverImagePath = "/~media/elements/LayoutClipart/";
nav_footerlinks.imageWidth = "16";
nav_footerlinks.imageHeight = "16";
nav_footerlinks.fontClass = "size9 Arial9";
nav_footerlinks.fontFace = "Arial, Helvetica, sans-serif";


var baseHref = '';
// this will only work if getElementsByTagName works
if (document.getElementsByTagName)
{
    // this will only work if we can find a base tag
    var base = document.getElementsByTagName('base');
    // Verify that the base object exists
    if (base && base.length > 0)
    {
        // if you don't specify a base href, href comes back as undefined
        if (base[0].href != undefined)
        {
            // get the base href
            baseHref = base[0].href;
            // add a trailing slash if base href doesn't already have one
            if (baseHref != '' && baseHref.charAt(baseHref.length - 1) != '/')
            {
                baseHref += '/';
            }
        }
    }
}


nav_footerlinks.links=new Array(5);
var nav_footerlinks_Link1 = new Object();
nav_footerlinks_Link1.type = "url";
nav_footerlinks_Link1.displayName = "Home";
nav_footerlinks_Link1.linkWindow = "_self";
nav_footerlinks_Link1.linkValue = "index.html";
nav_footerlinks_Link1.linkIndex = "1";
nav_footerlinks.links[0] = nav_footerlinks_Link1;
var nav_footerlinks_Link2 = new Object();
nav_footerlinks_Link2.type = "existing";
nav_footerlinks_Link2.displayName = "About Us";
nav_footerlinks_Link2.linkWindow = "_self";
nav_footerlinks_Link2.linkValue = "washington-drilling-about.html";
nav_footerlinks_Link2.linkIndex = "2";
nav_footerlinks.links[1] = nav_footerlinks_Link2;
var nav_footerlinks_Link3 = new Object();
nav_footerlinks_Link3.type = "existing";
nav_footerlinks_Link3.displayName = "Products and Services";
nav_footerlinks_Link3.linkWindow = "_self";
nav_footerlinks_Link3.linkValue = "washington-drilling-services.html";
nav_footerlinks_Link3.linkIndex = "3";
nav_footerlinks.links[2] = nav_footerlinks_Link3;
var nav_footerlinks_Link4 = new Object();
nav_footerlinks_Link4.type = "existing";
nav_footerlinks_Link4.displayName = "Helpful Links";
nav_footerlinks_Link4.linkWindow = "_self";
nav_footerlinks_Link4.linkValue = "washington-drilling-links.html";
nav_footerlinks_Link4.linkIndex = "4";
nav_footerlinks.links[3] = nav_footerlinks_Link4;
var nav_footerlinks_Link5 = new Object();
nav_footerlinks_Link5.type = "existing";
nav_footerlinks_Link5.displayName = "Contact Us";
nav_footerlinks_Link5.linkWindow = "_self";
nav_footerlinks_Link5.linkValue = "contact-washington-drilling.html";
nav_footerlinks_Link5.linkIndex = "5";
nav_footerlinks.links[4] = nav_footerlinks_Link5;
function backgroundMouseOn(tdElement, newColor)
{
	if(tdElement != null) {
		tdElement.oldBGColor = tdElement.style.backgroundColor;
		tdElement.style.backgroundColor = newColor;
	}
}
function backgroundMouseOff(tdElement)
{
	if(tdElement != null) {
		tdElement.style.backgroundColor = tdElement.oldBGColor;
	}
} 

function doMouseChange(Navigation,tdElement,linkIndex,bisMouseOver) {
	if (Navigation.mouseoverEffect != 'true') {
		return;
	}	
	var link = Navigation.links[linkIndex-1];
	var bIsCurrentPage = isCurrentPage(link);
	var bShowMouseoverBg = !(bIsCurrentPage
			&& 'true' == Navigation.selectedEffect && Navigation.selectedBgcolor);
	var fontElement = getLinkFontElement(tdElement);
	if(fontElement != null) {
		doFontChange(Navigation,fontElement,bIsCurrentPage,bisMouseOver);
	}
	
	if (Navigation.mouseoverBgcolor && bShowMouseoverBg) {
		if(bisMouseOver) {
			backgroundMouseOn(tdElement,Navigation.mouseoverBgcolor);
		} else {
			backgroundMouseOff(tdElement);
		}
	}
}
function addStyle(Navigation, Link, tdElement,vNavTrElement) {
	if (tdElement == null) {
		return;
	}
	var strFontColor = Navigation.textColor;
	if ('true' == Navigation.selectedEffect) {
		if (Navigation.selectedTextcolor) {
			strFontColor = Navigation.selectedTextcolor;
		}
		if (Navigation.selectedBgcolor) {
			if (Navigation.orientation == 'horizontal') {
				tdElement.style.backgroundColor = Navigation.selectedBgcolor;
			} else {
				if (vNavTrElement != null) {
					vNavTrElement.style.backgroundColor = Navigation.selectedBgcolor;
				}
			}
		}
	}
	var fontElement = getLinkFontElement(tdElement);
	if (fontElement != null) {
		fontElement.style.color = strFontColor;
	}
	tdElement.style.color = strFontColor;
	if ('true' == Navigation.selectedEffect) {
		if ('true' == Navigation.selectedBold) {
			tdElement.style.fontWeight = "bold";
		}
		if ('true' == Navigation.selectedItalic) {
			tdElement.style.fontStyle = "italic";
		}
		if ('true' == Navigation.selectedUnderline) {
			tdElement.style.textDecoration = "underline";
		}
	}
}

// Combined escape html and javascript
function escapeHtmlInlineScript(s, escapeSingleQuotes, escapeDoubleQuotes){
	return htmlEncode(escapeScript(s, escapeSingleQuotes, escapeDoubleQuotes));
}

function htmlEncode(s){
	if (typeof(s) != "string") return "";
	
	var result = "";
	for (var i = 0; i < s.length; i++) {
		var ch = s.charAt(i);
		switch (ch) {
		case '<':
			result += "&lt;";
			break;
		case '>':
			result += "&gt;";
			break;
		case '&':
			result += "&amp;";
			break;
		case '"':
			result += "&quot;";
			break;
		case "'":
			result += "&#39;";
			break;
		default:
			result += ch;
		}
	}
	return result;
}

/* escapes slashes and quotes. the default is to escape quotes,
 * but this can be turned off.
 * this function is used for javascript and also for escaping urls
 * within background-image css.	 
 */
function escapeScript(s, escapeSingleQuotes, escapeDoubleQuotes){
	if (typeof(s) != "string") return "";
	
	var result = "";
	for (var i = 0; i < s.length; i++) {
		var ch = s.charAt(i);
		switch (ch) {
		case '\'':
			if (escapeSingleQuotes == null || escapeSingleQuotes)
				result += "\\\'";
			break;
		case '\"':
			if (escapeDoubleQuotes == null || escapeDoubleQuotes)
				result += "\\\"";
			break;
		case '\\':
			result += "\\\\";
			break;
		default:
			result += ch;
		}
	}
	return result;
}

//
// This .js file includes utility functions used by both graphical and text navs
// in their rendering.  User pages including a nav element will import this file, along
// with TextNavigation.js and GraphicNavigation.js.  The functions within will
// be called by the [navname].js file generated at publish time.

function fixLinkValue(Link)
{
	if(Link.type!='existing')
	{
		return Link.linkValue;
	}
	else
	{
		return baseHref + strRelativePathToRoot + Link.linkValue;
	}
}

function isCurrentPage(Link)
{
	if(Link.type!='existing')
	{
		return false;
	}
	var strLinkValue = Link.linkValue.toLowerCase();
	return (strRelativePagePath == strLinkValue);
}

function toggleOnMouseChange(fontElement,newColor, bold, underline, italic)
{
	if(fontElement == null) {
		return;
	}
	if(newColor)
	{
		fontElement.style.color=newColor;
	}
	fontElement.style.fontWeight = (bold=='true' ? 'bold' : 'normal');
	fontElement.style.textDecoration = (underline=='true' ? 'underline' : 'none');
	fontElement.style.fontStyle = (italic=='true' ? 'italic' : 'normal');

}

function doFontChange(Navigation,fontElement,bIsCurrentPage,bisMouseOver) {
	if(fontElement == null) {
		return;
	}
	var textColor;
	var baseTextColor = Navigation.textColor;
	var bold;
	var baseBold = Navigation.bold;
	var underline;
	var baseUnderline = Navigation.underline;
	var italic;
	var baseItalic = Navigation.italic;
	if (bIsCurrentPage && 'true' == Navigation.selectedEffect) {
		textColor = Navigation.selectedTextcolor ? Navigation.selectedTextcolor
				: (Navigation.mouseoverTextColor ? Navigation.mouseoverTextcolor
						: Navigation.textColor);
		baseTextColor = Navigation.selectedTextcolor ? Navigation.selectedTextcolor
				: Navigation.textColor;
		baseBold = bold = Navigation.selectedBold;
		baseUnderline = underline = Navigation.selectedUnderline;
		baseItalic = italic = Navigation.selectedItalic;
	} else {
		textColor = Navigation.mouseoverTextcolor ? Navigation.mouseoverTextcolor
				: Navigation.textColor;
		bold = Navigation.mouseoverBold;
		underline = Navigation.mouseoverUnderline;
		italic = Navigation.mouseoverItalic;
	}
	
	if(bisMouseOver) {
		toggleOnMouseChange(fontElement,textColor,bold,underline,italic);
	} else {
		toggleOnMouseChange(fontElement,baseTextColor,baseBold,baseUnderline,baseItalic);
	}
	

}

function addMouseAndStyleSupportfooterlinks(Navigation,navTbId) {
	var startNode;

	if(typeof(nav_element_id) != 'undefined' && document.getElementById(nav_element_id) != null) {
		startNode = document.getElementById(nav_element_id);
			
	} else if(navTbId != null) {
		startNode = document.getElementById(navTbId);
			
	}
	
	if(startNode != null) {
	  searchForCurrentPageTd(Navigation,startNode);
	}
	

}

function searchForCurrentPageTd(Navigation,startNode) {
	
	if(startNode.childNodes != null) {
		for(var i=0;i<startNode.childNodes.length;i++){
			if(addStyleForCurrentPageTd(Navigation,startNode.childNodes[i])){
			   return;	
			} else {
			   searchForCurrentPageTd(Navigation,startNode.childNodes[i]);
			}
		}
	}

}

function addStyleForCurrentPageTd(Navigation,currentNode) {
	if(Navigation.orientation == 'horizontal') {
		if(currentNode.tagName == 'TD' && currentNode.id != '' && currentNode.id.indexOf(Navigation.navName+navTDLinkPart) != -1){
			var currentTDIdPrefix = Navigation.navName+navTDLinkPart;
			var linkId = currentNode.id.substring(currentTDIdPrefix.length,currentNode.id.length);
			if(isCurrentPage(Navigation.links[linkId-1]) == true) {
				addStyle(Navigation, Navigation.links[linkId-1],currentNode);
				return true;
			}
		}
	} else {
		if(currentNode.tagName == 'TR' && currentNode.id != '' && currentNode.id.indexOf(navTRLinkPrefix) != -1){	
			var currentTRIdPrefix = navTRLinkPrefix+Navigation.navName;
			var linkId = currentNode.id.substring(currentTRIdPrefix.length,currentNode.id.length);
			if(isCurrentPage(Navigation.links[linkId-1]) == true && currentNode.childNodes != null) {
				var currentPageTd;
				for(var i=0;currentNode.childNodes.length;i++) {
					if(typeof(currentNode.childNodes[i].tagName) != 'undefined' && currentNode.childNodes[i].tagName == 'TD' && currentNode.childNodes[i].id.indexOf(Navigation.navName+navTDLinkPart) != -1) {
						currentPageTd = currentNode.childNodes[i];
						addStyle(Navigation, Navigation.links[linkId - 1],currentPageTd,currentNode);
						return true;
					}
				}
			}
		}
	}
	return false;
}

function getChildElementFromTree(startNode,nodesToTraverse) {
	var currentChildNode = startNode;
	
	for(var n= 0;n<nodesToTraverse.length;n++) {
		currentChildNode = getMatchingChildByTag(currentChildNode.childNodes,nodesToTraverse[n]);
	}
	
	return currentChildNode;
}


function getMatchingChildByTag(childNodes,tagName) {
	var child;
	for(var i=0;childNodes.length;i++) {
		if(childNodes[i].tagName == tagName) {
			child = childNodes[i];
			break;
		}
	}
	return child;
}
function getLinkFontElement(tdElement){
	var fontElement;
	var aElement = getChildElementFromTree(tdElement,['A']);
	for(var i=0;i < aElement.childNodes.length;i++) {
		if(aElement.childNodes[i].tagName == 'DIV') {
		 	fontElement = getChildElementFromTree(aElement.childNodes[i],['FONT']);
		 	break;
		} else if(aElement.childNodes[i].tagName == 'FONT'){
		 	fontElement = 	aElement.childNodes[i];
		 	break;
		}
	
	}
	return fontElement;
}



	if(typeof(navTRLinkPrefix) == 'undefined') {
		navTRLinkPrefix = 'vNavTR_Link_';
	}
	if(typeof(navTDLinkPart) == 'undefined') {
		navTDLinkPart = '_Link';
	}
	if(document.getElementById('nav_version') == null) {
	if (typeof(navTBSuffix) == 'undefined') {
	navTBSuffix = 0;
	} else {navTBSuffix++;}
		document.write('<TABLE ID="ntb'+navTBSuffix+'"  CELLSPACING=\"0\" CELLPADDING=\"0\" BORDER=\"0\" ><TR ALIGN=\"CENTER\" VALIGN=\"MIDDLE\"><TD><TABLE CELLSPACING=\"0\" CELLPADDING=\"0\" BORDER=\"0\"><TR><TD ALIGN=\"center\" VALIGN=\"MIDDLE\" NOWRAP=\"NOWRAP\" id=\"footerlinks_Link1\" style=\"cursor: pointer;cursor: hand;color:#FFFFFF;font-size: 1px; line-height: 1px;\" onmouseover=\"doMouseChange(nav_footerlinks,this,\'1\',true);\" onmouseout=\"doMouseChange(nav_footerlinks,this,\'1\',false);\"><A HREF=\"index.html\" TARGET=\"_self\" STYLE=\"text-decoration:none;\" NAME=\"Home\"><FONT ID=\"footerlinks_f1\" FACE=\"Arial, Helvetica, sans-serif\" CLASS=\"size9 Arial9\" STYLE=\"color:#FFFFFF\">Home<\/FONT><IMG SRC=\"tp.gif\" WIDTH=\"10.0\" HEIGHT=\"1\" BORDER=\"0\"><\/A><\/TD><TD WIDTH=\"1\" BGCOLOR=\"#FFFFFF\"><IMG style=\"display: block;\" SRC=\"tp.gif\" WIDTH=\"1\"><\/TD><TD ALIGN=\"center\" VALIGN=\"MIDDLE\" NOWRAP=\"NOWRAP\" id=\"footerlinks_Link2\" style=\"cursor: pointer;cursor: hand;color:#FFFFFF;font-size: 1px; line-height: 1px;\" onmouseover=\"doMouseChange(nav_footerlinks,this,\'2\',true);\" onmouseout=\"doMouseChange(nav_footerlinks,this,\'2\',false);\"><A HREF=\"washington-drilling-about.html\" TARGET=\"_self\" STYLE=\"text-decoration:none;\" NAME=\"About Us\"><IMG SRC=\"tp.gif\" WIDTH=\"10.0\" HEIGHT=\"1\" BORDER=\"0\"><FONT ID=\"footerlinks_f2\" FACE=\"Arial, Helvetica, sans-serif\" CLASS=\"size9 Arial9\" STYLE=\"color:#FFFFFF\">About&nbsp;Us<\/FONT><IMG SRC=\"tp.gif\" WIDTH=\"10.0\" HEIGHT=\"1\" BORDER=\"0\"><\/A><\/TD><TD WIDTH=\"1\" BGCOLOR=\"#FFFFFF\"><IMG style=\"display: block;\" SRC=\"tp.gif\" WIDTH=\"1\"><\/TD><TD ALIGN=\"center\" VALIGN=\"MIDDLE\" NOWRAP=\"NOWRAP\" id=\"footerlinks_Link3\" style=\"cursor: pointer;cursor: hand;color:#FFFFFF;font-size: 1px; line-height: 1px;\" onmouseover=\"doMouseChange(nav_footerlinks,this,\'3\',true);\" onmouseout=\"doMouseChange(nav_footerlinks,this,\'3\',false);\"><A HREF=\"washington-drilling-services.html\" TARGET=\"_self\" STYLE=\"text-decoration:none;\" NAME=\"Products and Services\"><IMG SRC=\"tp.gif\" WIDTH=\"10.0\" HEIGHT=\"1\" BORDER=\"0\"><FONT ID=\"footerlinks_f3\" FACE=\"Arial, Helvetica, sans-serif\" CLASS=\"size9 Arial9\" STYLE=\"color:#FFFFFF\">Products&nbsp;and&nbsp;Services<\/FONT><IMG SRC=\"tp.gif\" WIDTH=\"10.0\" HEIGHT=\"1\" BORDER=\"0\"><\/A><\/TD><TD WIDTH=\"1\" BGCOLOR=\"#FFFFFF\"><IMG style=\"display: block;\" SRC=\"tp.gif\" WIDTH=\"1\"><\/TD><TD ALIGN=\"center\" VALIGN=\"MIDDLE\" NOWRAP=\"NOWRAP\" id=\"footerlinks_Link4\" style=\"cursor: pointer;cursor: hand;color:#FFFFFF;font-size: 1px; line-height: 1px;\" onmouseover=\"doMouseChange(nav_footerlinks,this,\'4\',true);\" onmouseout=\"doMouseChange(nav_footerlinks,this,\'4\',false);\"><A HREF=\"washington-drilling-links.html\" TARGET=\"_self\" STYLE=\"text-decoration:none;\" NAME=\"Helpful Links\"><IMG SRC=\"tp.gif\" WIDTH=\"10.0\" HEIGHT=\"1\" BORDER=\"0\"><FONT ID=\"footerlinks_f4\" FACE=\"Arial, Helvetica, sans-serif\" CLASS=\"size9 Arial9\" STYLE=\"color:#FFFFFF\">Helpful&nbsp;Links<\/FONT><IMG SRC=\"tp.gif\" WIDTH=\"10.0\" HEIGHT=\"1\" BORDER=\"0\"><\/A><\/TD><TD WIDTH=\"1\" BGCOLOR=\"#FFFFFF\"><IMG style=\"display: block;\" SRC=\"tp.gif\" WIDTH=\"1\"><\/TD><TD ALIGN=\"center\" VALIGN=\"MIDDLE\" NOWRAP=\"NOWRAP\" id=\"footerlinks_Link5\" style=\"cursor: pointer;cursor: hand;color:#FFFFFF;font-size: 1px; line-height: 1px;\" onmouseover=\"doMouseChange(nav_footerlinks,this,\'5\',true);\" onmouseout=\"doMouseChange(nav_footerlinks,this,\'5\',false);\"><A HREF=\"contact-washington-drilling.html\" TARGET=\"_self\" STYLE=\"text-decoration:none;\" NAME=\"Contact Us\"><IMG SRC=\"tp.gif\" WIDTH=\"10.0\" HEIGHT=\"1\" BORDER=\"0\"><FONT ID=\"footerlinks_f5\" FACE=\"Arial, Helvetica, sans-serif\" CLASS=\"size9 Arial9\" STYLE=\"color:#FFFFFF\">Contact&nbsp;Us<\/FONT><\/A><\/TD><\/TR><\/TABLE><\/TD><\/TR><\/TABLE><script type="text/javascript">addMouseAndStyleSupportfooterlinks(nav_footerlinks,"ntb'+navTBSuffix+'");'+'</scri'+'pt>');
	}

