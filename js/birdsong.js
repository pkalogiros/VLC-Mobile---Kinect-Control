function birdsongMobile() {
	/************************
	* bnchMrk (int) - in milliseconds
	* Used for Benchmarking our code (look at the bottom of the function)
	*************************/
	var bnchMrk = new Date();
	
	/************************
	* passed as a global - context of main object
	* - the glue between all modules
	*************************/
	var q = this;

	/************************
	* functions that run on DOM Load are pushed
	* into this array
	************************/
	this.DOMLoad = [];
	this.contentLoaded = false; //supports advanced DOMContentLoaded?
	this.domLoaded = false;
//End of Private Variables	

//Public Variables
/************************
* agent (string)
* browser's user agent
*************************/
this.agent = navigator.userAgent.toLowerCase();

//MODULES

//ON DOM LOAD
	q.OnDomReady = function( callback ) {
		if( q.domLoaded )
			callback.call( this );
		else
			q.DOMLoad.push( callback );
	};
//FS. FEATURE SUPPORT
	function FS($q) { // $q -> q, object passed by refference
		/************************************
		* Constructor code of feature support
		* 1st check for touch-Events
		* -----------------------------------
		* Quite advanced devices use/support touch events
		* so if such a device is met, we with certainty know 
		* that the user doesnot use an old and obsolete browser
		*************************************/
		
		var agent = $q.agent; //public global var becomes local (performance gain)
		try {
			// ARE WE USING A TOUCH BASED DEVICE
			document.createEvent("TouchEvent");
			
			if( !( 'ontouchstart' in document.documentElement ) )
				document.createEvent("TouchEventasdf1234");	//faux error
			
			$q.onmousedown = 'ontouchstart',
			$q.onmouseup = 'ontouchend',
			$q.onmousemove = 'ontouchmove';
			$q.touches = true; //used in other modules as well
			
			//Getting the mouse Position - through the touches array
			$q.getPageX = function(e){
				return e.touches[0].pageX;
			};
			$q.getPageY = function(e){
				return e.touches[0].pageY;
			};
			
			$q.contentLoaded = true;
			
			//Hover class fix for android/iphone touch enabled devices, explained the global css file
			document.getElementsByTagName('html')[0].id = "no-hover";
			
			////BROWSER DETECTION TOUCH EVENTS
			// 1. Opera Mobile
			// 2. Mobile Safari (iOs)
			// 3. Android Webkit
			// 4. Symbian
			// 5. Blackberry
			// 6. IE (?)
			// 7. PalmOS
			// 8. Webkit other
			// 9. Moz Fennec Fox
			//10. Other
			if( window.opera )
				$q.browser = 'opera',
				$q.prefix = 'o',
				$q.contentLoaded = false;
			else if( agent.indexOf('Mac OS') >= 0 ) //touch Events AND Mac OS agent string = iphone/ipad
				$q.browser = 'ios',
				$q.prefix = 'webkit';
			else if( agent.indexOf('ndroid') >= 0 ) {
				$q.browser = 'Android';
				
				if( agent.indexOf('webkit') >= 0 ) { //check to see if we are using a webkit based Android Browser, and not for example Firefox Fennec
					$q.prefix = 'webkit';
					var vers = parseFloat( agent.substr( (agent.indexOf('ndroid') + 6 ) ).substr( 1, agent.indexOf(';') ) ); //grabbing Android's version
					if( vers < 2.3 )
						document.getElementsByTagName('html')[0].className = "no3d";
				}
				//remove Android's scrollbars
				setTimeout( function() { window.scrollTo( 0, 1 ); }, 62 );
			}
			else if( agent.indexOf('series60' ) >= 0 || agent.indexOf('symbian') >= 0 )
				$q.browser = 'symbian',
				$q.prefix = 'webkit';
			else if( agent.indexOf('blackberry') >= 0 )
				$q.browser = 'blackberry',
				$q.prefix = '';
			else if( document.all )
				$q.browser = 'ie',
				$q.prefix = 'ms'; //sanity check
			else if( agent.indexOf('palm') >= 0 )
				$q.browser = 'palmOS',
				$q.prefix = '';
			else{ //touch based browsers - generic
				if( agent.indexOf('webkit' ) >= 0 )
					$q.browser = 'webkit',
					$q.prefix = 'webkit';
				else if( agent.indexOf('gecko') >= 0 )
					$q.browser = 'moz',
					$q.prefix = 'Moz';
				else
					$q.browser = 'undefined',
					$q.prefix = '';
			}
		} catch (e) {
			//KEY BASED DEVICE
			$q.onmousedown = 'onmousedown',
			$q.onmouseup = 'onmouseup',
			$q.onmousemove = 'onmousemove';
			$q.touches = false;
			
			//grabbing the position based on Mouse position
			$q.getPageX = function(e){
				return e.clientX;
			};
			$q.getPageY = function(e){
				return e.clientY;
			};
			// 07 / 2011 opera is the #1 browser in the mobile market
			////BROWSER DETECTION KEY EVENTS
			// 1. Opera Mini
			// 2. IE
			// 3. Symbian
			// 4. Blackberry
			// 5. PalmOS
			// 6. Webkit --desktop--
			// 7. Moz Firefox
			// 8. other
			if( window.opera ) {
				$q.browser = 'opera',
				$q.prefix = 'o',
				$q.contentLoaded = false;
			
				//Opera check class
				if( agent.indexOf('mini') >= 0 )
				{
					document.getElementsByTagName('html')[0].className = "opMini";
					bnchMrk = bnchMrk - 150; //Opera Mini is quite weak and cannot handle complicated animations
					
					$q.DOMLoad.push( function() { //on old versions there also seems to be a crazy bug with page widths
						var w = document.body.clientWidth;
						if( w >= 280 && w < 480 ) {
							document.getElementsByTagName('body')[0].style.width = w + 'px';
						}
					});
				}
			}
			else if( !document.addEventListener && agent.indexOf('msie') >= 0 ) {
				$q.browser = 'ie',
				$q.prefix = 'ms',
				$q.contentLoaded = false;
				//bnchMrk = bnchMrk - 10; //weakening the benchmark score
				
				if( agent.indexOf('mobile') >= 0 )
				{
					document.getElementsByTagName('html')[0].className = "ie";
					
					var vers = parseFloat( agent.substr( agent.indexOf('msie') + 5 ).substr( 0, 3 ) );
					if( vers  <= 7 )
						bnchMrk = bnchMrk - 200; //no effects for pre Mango Window Phones
				}
				else
				{
					//if ie
					document.getElementsByTagName('html')[0].className = "ie";
					
					var vers = parseFloat( agent.substr( agent.indexOf('msie') + 5 ).substr( 0, 3 ) );
					if( vers  <= 7 ) //if ie7 desktop version
						document.getElementsByTagName('html')[0].className = "ie deskIE7";
				}
			}
			else if( agent.indexOf('MSIE') >= 0 )
			{   //using an ok version of ie
				$q.browser = 'ie',
				$q.prefix = 'ms';
			}
			else if( agent.indexOf('series60') >= 0 || agent.indexOf('symbian') >= 0 )
				$q.browser = 'symbian',
				$q.prefix = 'webkit',
				$q.contentLoaded = false;
			else if( agent.indexOf('blackberry') >= 0 )
				$q.browser = 'blackberry',
				$q.prefix = '',
				$q.contentLoaded = false;
			else if( agent.indexOf('palm') >= 0 )
				$q.browser = 'palmOS',
				$q.prefix = '',
				$q.contentLoaded = false;
			else{ //key based browsers - generic
				if( agent.indexOf('webkit') >= 0 )
					$q.browser = 'webkit',
					$q.prefix = 'webkit',
					$q.contentLoaded = true;
				else if( agent.indexOf('gecko') >= 0 )
					$q.browser = 'moz',
					$q.prefix = 'Moz',
					$q.contentLoaded = true;
				else
					$q.browser = 'undefined',
					$q.prefix = '',
					$q.contentLoaded = false;
			}
		}
		
		//Is the browser capable of handling CSS 3 TRANSITIONS?
		$q.cssTransitions = false;
		var div = document.createElement('div');
		
		if( $q.prefix.length >= 1 )
			div.innerHTML = '<div style= "-' + ($q.prefix).toLowerCase() + '-transition:color 1s linear;"></div>';
		else //probably not going to work since most transitinos are still browser-prefix based
			div.innerHTML = '<div style= "transition:color 1s linear;"></div>';
			
		$q.cssTransitions = (div.firstChild.style[ $q.prefix + 'Transition' ] !== undefined);
		//div = null; //ie mem release not needed
	}
	
this.fs = new FS(q);
//END OF FS() (FEATURE SUPPORT)

//HANDLERS AND EVENT LISTENERS
	//Traditional Handler Model
	this.onHandler = {
		/************************
		* Binding Event Handlers
		* we use object events, because of better support 
		* in old mobile devices
		*************************/
		"addHandler" : function( event, obj, callback ) {
			var objOld = obj[event];
			if( objOld != null )
				obj[event] = function(e) { objOld(e); callback(e); };
			else
				obj[event] = function(e) { event = event || window.event; callback(e); };
		},
		/************************
		* Remove event Handlers and clearing memm
		*************************/
		"killHandler" : function( event, obj ) {
			obj[event] = null;
		}
	};
	
	//Advanced Handler Model
	function handler( srx, sry, newx, newy ){}
	//Making touchEvents Respond to their actual events
	if( q.touches )
	{
		/***********************************
		* touchS (event)
		* Adds the class 'clicked' to the focused element
		* Also removes the class when another link is pressed 
		* or a timeout is fired (before the context menu shows up)
		***********************************/
		function touchS(e) {
			q.stopPropagation(e);
			var t = e.currentTarget,
				tmpObj = q.hObj, //local variable for the master handler object (class of handler(srx, sry, newx, newy) )
				d = e.touches[0]; //the current touch
			
			if( q.contextTimeout )	//removing "clicked" class from the clicked element if no timeout is set
			{ 
				var em = q.sos2.className;
				if( em.indexOf('clic') >= 0 )
					q.sos2.className = em.substr(0, (em.indexOf('clic') )); //removes clicked class (for hover states)
			}
			
			t.className += ' clicked'; //hover states can be quite broken in touchScreen devices (ipad, android etc) therefore we utilize a "clicked" class
			q.sos = e.srcElement, //storing data of the clicked/focused element
			q.sos2 = t;
			
			q.srx = d.pageX, //getting the coordinates
			q.sry = d.pageY,
			q.newx = q.srx,
			q.newy = q.sry;
			
			q.contextTimeout = setTimeout( function(){
				var emt = q.sos2.className;
				if( emt.indexOf('clic') >= 0 )
					q.sos2.className = emt.substr(0, (emt.indexOf('clic') )); //removes clicked class (for hover states)
					
				q.contextTimeout = false; //completely deactivates the timeout - for the above condition
			}, 1520 );
				
			//Once we have touched the element we Construct listeners for touchMove and Touchend.
			//Reason for this, is that it is much faster and logical to have 500 listeners (one for each link), and 502 once the touchstart event has fired,
			//rather than 1500 listeners, for touchstart, touchmove and touchend.
			return false;
		}
		/***********************************
		* touchS_NoBlock (event)
		* - Triggered when an object receives an on 'touchstart' event
		* prevents the propagation of the event, and builds handlers of TouchMove and 
		* TouchEnd.
		* - Initializes the events 2d coordinates
		* - Allows page scrolling
		***********************************/
		handler.prototype.touchS_NoBlock = function(e) {
			if( e.touches.length > 1)
			{
				q.preventDefault(e);
				q.stopPropagation(e);
				return false;
			}
			var tmpObj = q.hObj;
			touchS(e);
			
			tmpObj.addEventObserver( e.currentTarget, tmpObj, 'touchmove', "touchM" );
			tmpObj.addEventObserver( e.currentTarget, tmpObj, 'touchend', "touchE" );
			
			return false;
		};
		/***********************************
		* touchS_NoBlock (event)
		* - Triggered when an object receives an on 'touchstart' event
		* prevents the propagation AND default action of the event, and builds handlers of TouchMove and 
		* TouchEnd.
		* - Initializes the events 2d coordinates
		* - Prevents page from scrolling
		***********************************/
		handler.prototype.touchS = function(e) {
			q.preventDefault(e);
			
			if( e.touches.length > 1 )
			{
				q.stopPropagation(e);
				return false;
			}
			
			var tmpObj = q.hObj;
			touchS(e);
			
			tmpObj.addEventObserver( e.currentTarget, tmpObj, 'touchmove', "touchM" );
			tmpObj.addEventObserver( e.currentTarget, tmpObj, 'touchend', "touchEClick" );
			
			return false;
		};
		/***********************************
		* touchM (event, element)
		* - Updates the events coordinates
		***********************************/
		function touchM(e){
			//q.stopPropagation(e);
			//q.preventDefault(e);
			var d = e.touches[0];

			q.newx = d.pageX,
			q.newy = d.pageY;
			return false;
		};
		handler.prototype.touchM = function(e) { touchM(e); };
		/***********************************
		* touchM (event, element)
		* - Updates the events coordinates,
		*	removes handlers and fires virtual events
		***********************************/
		function touchE( e, t, touchEnd, eventType ) {
			var that = q,
			tmpObj = that.hObj;
			
			that.stopPropagation(e);
			
			tmpObj.removeEventObserver(e.currentTarget, tmpObj, 'touchmove', "touchM");
			tmpObj.removeEventObserver(e.currentTarget, tmpObj, 'touchend', touchEnd);
			
			clearTimeout( q.contextTimeout ); //clearing the class reset timeout
			q.contextTimeout = false;	//and deactivating it completely
			
			var emt;
			if( (emt = that.sos2.className) != '' )
			{
				that.sos2.className = emt.substr(0, (emt.indexOf('clic') )); //removes clicked class (for hover states)
			}
			else
			{
				emt = that.sos2.parentNode.className;
				that.sos2.parentNode.className = emt.substr( 0, (emt.indexOf('clic') ));
			}
			// #### Links error of margin 40pixels horizontally, 10 vertically
			if( (that.newx <( that.srx + 40) && that.newx > (that.srx - 40) && that.newy < (that.sry + 10) && that.newy > (that.sry - 10) ) ) //checked to see whether we are still on the element or we have moved
			{
				var evObj = document.createEvent('MouseEvents'); //firing the custom event
				evObj.initEvent( eventType, true, true );
				that.sos.dispatchEvent(evObj);
			}
			
			return false;
		}
		handler.prototype.touchE = function( e, t ) {
			touchE( e, t, 'touchE', 'vnt' ); //vnt, custom event so that we donot block the browsers antive scrolling
			return false;
		};
		handler.prototype.touchEClick = function( e, t ) {
			touchE( e, t, 'touchEClick', 'click' ); //default handler initialization (blocks scroll)
			return false;
		};
		
	}
	/***********************************
	* addEventObserver (object, handlerObject, eventType, callbackFunction)
	* - keeps tracks of anonymously declared methods and provides a basic way 
	* to remove them - only on advanced devices
	***********************************/
	handler.prototype.addEventObserver = function( t, inObject, inEventType, inCallback ) { 	
		//we would need event sanitization if we were targeting all browsers with this object
		var propKey	= inCallback + '_' + inEventType;
		
		inObject[propKey] = function(e) { inObject[inCallback]( e, t ); };
		t.addEventListener( inEventType, inObject[propKey], false ); 
	};
	/***********************************
	* removeEventObserver (object, handlerObject, eventType, callbackFunction)
	* - removes anonymously declared methods/handlers
	***********************************/
	handler.prototype.removeEventObserver = function(t, inObject, inEventType, inCallback)  
	{ 
		var propKey	= inCallback + '_' + inEventType;
		
		t.removeEventListener( inEventType, inObject[propKey], false ); 
		delete( inObject[propKey] );
	};
//END OF HANDLERS AND EVENT LISTENERS


//DOM HIERARCHY AND TRAVERSION FUNCTIONS
	/****************************
	* Dynamic object creation so we can achieve function chaining,
	* same way libraries like Dojo and jQuery do
	*
	* Objects are much faster than first Class and double evaluation
	****************************/
	
	this._obj = {
		"$" : function(el) {
			this.el = el;
			return this;
		},
		//toggles specified class
		toggleClass : function(clss) {
			var el = this.el,	//storing object data locally
				elClss = el.className,
				ind;
				
			if( (ind = elClss.indexOf( clss )) >= 0 )
				if( elClss === clss )
					el.className = "";
				else
					el.className = elClss.substr( 0, ind - 1 ) + elClss.substr( (ind + clss.length) );
			else
				if( !elClss || elClss === "" )
					el.className = clss;
				else
					el.className += ' '+clss;
					
			return this;
		},
		//grabbing the previous element - sibling
		prev : function() {
			var ret = this.el.previousSibling;
			
			while( ret && ret.nodeType === 3 )
				ret = ret.previousSibling;
				
			this.el = ret;
			
			return this;
		},
		next : function() {
			var ret = el.nextSibling;
			
			while( ret && ret.nodeType === 3 )
				ret = ret.nextSibling;
			
			this.el = ret;
			
			return this;
		},
		index : function() {
			var i = 0,
				l = this.el.previousSibling;
				
			while( (l) )
			{ 
				if( l.nodeType !== 3 ) 
					i++;
					
				l = l.previousSibling; 
			};
			
			//delete( this.el );
			return i;
		},
		//grabbing the parent nodes
		parent : function() {
			this.el = this.el.parentNode;
			return this; //return the parent element
		},
		parents : function( sel, level ) {
			var ret = this.el,
				callback,
				clss,
				tag = clss = 0,
				selType; //selector type
			
			if( !level )
				level = 1;
			
			if( sel === 0 )
			{
				callback = function() { return true; };
				selType = -1;
			}
			else
			{
				selType = sel.indexOf('.');
			
				if( selType === -1 )
				{
					callback = function( th, tag, t ){ return q.tagCheck( th, tag ); };
					tag = sel;
				}
				else if( selType === 0 )
				{	
					callback = function( th, tag, clss ){ return q.classCheck( th, clss ); };
					clss = sel.substr(1); 
				}
				else
				{
					callback = function( th, tag, clss ){ return ( q.tagCheck( th, tag ) && q.classCheck( th, clss ) ); };
					tag = sel.substr( 0, selType );
					clss = sel.substr( selType + 1 );
				}
			}
			
			while( level-- > 0 ) {
				ret = ret.parentNode;
			}
			while( 1 ){	
				if( callback( ret, tag, clss ) ){
					delete( this.callback );
					this.el = ret;
					return this;
				}
				else
					ret = ret.parentNode;
			}
		},
		children : function() {
			return getChildren( this.el.childNodes[0], null );
		},
		//finds the elements by iterating upwards
		findUpwards : function( sel ) {
			var sel = q.strtok( sel );

			var clss;
			if( (clss = sel.indexOf('.')) > 0 )
			{
				var tag = sel.substr( 0, clss ),
					CLSS = sel.substr( clss + 1 ),
					elp = this.el;
					
				if( tag.length === 0 )
				{
					while(1)
					{
						clss = elp.childNodes;
						for( var i = 0, len = clss.length; i < len; i++ )
							if( clss[i].className.indexOf(CLSS) >= 0 )
							{
								delete( this.el );
								return q.qEL( clss[i] );	
							}
						elp = elp.parentNode;
					}
				}
				else
				{
					while( 1 )
					{
						clss = elp.getElementsByTagName( tag );
						for( var i = 0, len = clss.length; i < len; i++ )
							if( clss[i].className.indexOf(CLSS) >= 0 )
							{
								delete( this.el );
								return q.qEL( clss[i] );	
							}
						elp = elp.parentNode;
					}
				}
			}
			else
			{
				while( 1 )
				{
					elp = elp.parentNode;
					if( elp.tagName == tag ){
						delete( this.el );
						return q.qEL( elp );
					}
				}
			}
			//ret = ret.getElementsByTagName(sel)[cnt];
			//delete( this.el );
			//return (new _obj(ret));
		},
		//grabs the closest element by gonig upwards (findUpwards finds the first only)
		closestUpwards : function(sel) {
			var sel = q.strtok(sel);
			
			var clss;
			if( (clss = sel.indexOf('.')) > 0 )
			{
				var tag = sel.substr( 0, clss );
				var CLSS = sel.substr( clss + 1 );
				var elp = this.el;
				if( tag.length == 0 )
				{
					while(1)
					{
						var index = this.index(),
							held=[];
							
						elp = elp.parentNode;	
						clss = elp.childNodes;
						
						for(var i = 0,len = clss.length; i < len; i++)
							if(clss[i].className.indexOf(CLSS) >= 0)
							{
								held.push( i );
							}
						
						if( held.length > 0 )
						{
							var dif = 100, cand = 0, hlindex;
							for( var i = 0, hlen = held.length; i < hlen; i++ )
							{
								hlindex = q.qEL( clss[ held[i] ] ).index();
								if( Math.abs( hlindex - index ) < dif )
								{
									dif = Math.abs( hlindex - index );
									cand = held[i];
								}
							}
							//delete( this.el );
							return q.qEL( clss[cand] );
						}
						
					}
				}
				else
				{
					while( 1 )
					{
						var index = q.qEL(elp).index(),
							held=[];
						
						elp = elp.parentNode;
						clss = elp.getElementsByTagName( tag );
						
						for( var i = 0, len = clss.length; i < len; i++ )
							if( clss[i].className.indexOf(CLSS) >= 0 ){
								held.push( i );
							}
						
											
						if( held.length > 0 )
						{
							var dif = 100, cand = 0, hlindex;
							for( var i = 0, hlen = held.length; i < hlen; i++ )
							{
								hlindex = q.qEL( clss[ held[i] ] ).index();
								if (Math.abs( hlindex - index ) < dif)
								{
									dif = Math.abs( hlindex - index );
									cand = held[i];
								}
							}
							//delete( this.el );
							return q.qEL( clss[cand] );
						}
						
					}
				}
			}
			else
			{
				while( 1 )
				{
					elp = elp.parentNode;
					if( elp.tagName == tag ){
						//delete( this.el );
						return q.qEL( elp );
					}
				}
			}
			//ret = ret.getElementsByTagName(sel)[cnt];
			//delete( this.el );
			//return (new _obj(ret));
		},
		getLastSiblings  : function() {
			var skipMe = this.el,
			n = skipMe.parentNode.lastChild;
			
			var r = [],
			    elem = null;
			    
			for ( ; n; n = n.previousSibling ) {
			    if( n.nodeType == 1 && n != skipMe)
					r.push( n ); 
				else if( n === skipMe )
					return r;
			}
			return r;
		},
		/***************************
		*	current left offset
		***************************/
		curOffsetLeft : function() {
			var curleft = 0,
			    $thisObj = this.el.offsetParent;
				
			if (  $thisObj && $thisObj.offsetParent ) {
				do {
					curleft += $thisObj.offsetLeft;
				} while ( $thisObj = $thisObj.offsetParent );
			}
			//delete( this.el );
			return curleft;
		},
		/**************************************************
		* Returns full dimensions of the element.
		* Arguments: 'height'/'width', bool
		* if BOOL is true, it returns ONLY PADDING+WIDTH || HEIGHT
		***************************************************/
		getOutsideSize : function ( what, bool ) { //width - height
			var element = this.el;
			
			if( bool ){
				var ret = window.getComputedStyle( element ,null ).getPropertyValue( what );
				return parseInt(ret);
			}
			else{
				var offsetSize = what == 'width' ? element.offsetWidth : element.offsetHeight;
				var outsideSize= ( what == 'width' ? element.offsetWidth : element.offsetHeight ) - offsetSize;
			}
			var ret = offsetSize - outsideSize;
			//delete( this.el );
			return ret;
		},
		getSiblings : function() {
			var el = this.el;
			return getChildren( el.parentNode.childNodes[0], el );
		},
		/************************
		* Add class to the current _object
		* and remove the same class from its siblings
		*************************/
		makeActive : function(clss) {
			var el = this.el;
			
			if( el )
			{
				var sibs = this.getSiblings();
				for( var i = 0, len = sibs.length; i < len; i++ )
				{
					var sib = sibs[i];
					var ind;
					
					if( (ind = sib.className.indexOf(clss)) >= 0 )
						sib.className = sib.className.substr( 0, ind - 1 );
				}
				el.className += ' '+clss;
			}
			return this;
		},
		/************************
		* Returns the node encapsulated in the _object
		*************************/
		get : function() {
			return this.el;
		},
		/************************
		* _obj destructor
		*************************/
		CLR : function() {
			delete( this.el );
			return false;
		},
		/************************
		* SCROLLER CORE PLUG IN
		* allows the user to scroll up to an element (and focus on it)
		* or add to an anchor-hash link a nice scrolling transition effect
		*************************/
		scroll : function(o) { this.Scroller.render( this.el, o ); return this; },
		scrollTo : function(o) { this.Scroller.renderINIT( this.el, o ); return this; },
		Scroller : {
			// control the speed of the scroller.
			// dont change it here directly, use Scroller.speed=50;
			$this : function(){ return this },
			speed: 10,
			currScrollTop: 0,
			focus: false,
			// returns the Y position of the div
			gy: function ( d ) {
				var gy = d.offsetTop;
				
				if ( d.offsetParent ) 
					while ( d = d.offsetParent ) 
						gy += d.offsetTop;
						
				return gy;
			},
			// returns the current scroll position
			scrollTop: function() {
				var body = document.body,
					d = document.documentElement;	
				
				if (body && body.scrollTop) 
					return body.scrollTop;
					
				if (d && d.scrollTop) 
					return d.scrollTop;
					
				if (window.pageYOffset) 
					return window.pageYOffset;
				
				return 0;
			},
			// attach an event for an element
			// (element, type, function)
			add: function( event, body, d ) {
				if( event.addEventListener )
					return event.addEventListener( body, d, false );
					
				if( event.attachEvent ) //ie
					return event.attachEvent( 'on' + body, d )
			},
			// kill an event of an element
			end: function(e) {
				if( e.type == 'click' ) { 
					q.stopPropagation(e); 
					q.preventDefault(e); 
				}
			},
			// move the scroll bar to the particular div.
			scroll: function(d) {
					h = this.currScrollTop;

					a = h;
				
				if( d > a )
					a += Math.ceil( (d - a) / this.speed );
				else
					a = a + (d - a) / this.speed;
				this.currScrollTop = a;
				
				window.scrollTo( 0, a );
				this.currScrollTop = a = parseInt( a );
				
				if( a == d || this.offsetTop == a )
				{ 
					clearInterval( this.interval );
					
					if( this.focus ) 
						this.focus.focus();
				};
				this.offsetTop = a;
			},
			// initializer
			renderINIT : function( iD, focusEL ){
				var Scroller = this,
					h = this.scrollTop(),
					d = Scroller.gy( iD );
				//Scroller.end(this);
				
				this.currScrollTop = this.scrollTop();
				
				Scroller.focus = focusEL;
				clearInterval( Scroller.interval );
				
				if( d <= h || (d - h > 280) )
				{
					Scroller.interval = setInterval( function(){ Scroller.scroll( d ) }, 10 );
				}
				else
					if( this.focus ) this.focus.focus(); 
			},
			render: function( l, iD ) {
				var Scroller = this;
				if( !iD ) iD = l.hash;

				if( iD && iD.indexOf('#') != -1 )
				{
					Scroller.add( l,'click', Scroller.end )
					l.onclick = function() {
						Scroller.end(this);
						Scroller.focus = false;
						l = iD.substr( 1 );
						
						Scroller.currScrollTop = Scroller.scrollTop();
						
						var a = document.getElementById( l );
						clearInterval( Scroller.interval );
						
						var d = Scroller.gy( a ),
							h = Scroller.scrollTop();
							
						if( d <= h || ( d - h > 300 ) )
						{
							
							Scroller.interval = setInterval( function(){ Scroller.scroll( d ) }, 10 );
						}
						else
							if( Scroller.focus ) Scroller.focus.focus(); 
					};
				}
			}
		}
		
	};
	this.qEL = function(e) { 
		var mobj = Object.create(  q._obj ); 
		return mobj.$(e); 
	};
	
	/************************
	* Get all the childrens but the "skipMe"
	*************************/
	function getChildren(n, skipMe) {
		var r = [];
		var elem = null;
		for ( ; n; n = n.nextSibling ) 
		   if ( n.nodeType == 1 && n != skipMe)
			  r.push( n );        
		return r;
	}
	
	
	//Overloading the _obj json with conditonal functions based on the browsers abilities and performance
	this._obj.find = 		
		/************************
		* Tread through the specified selector (ex: 'ul li p')
		* and return the value/index specified in cnt. 
		* No error for margin (double spaces, or classnames) allowed
		* We cannot do complex string functions on mobile devices.
		*************************/
		function(sel, cnt) {
			var sel = q.strtok(sel),
			retNew,
			ret = this.el,
			len = sel.length - 1;
			
			if( (sel instanceof Array) )
			{	
				for( var i = 0; i < len; i++ )
					ret = ret.getElementsByTagName( sel[i] )[0];

				retNew = ret.getElementsByTagName( sel[len] )[cnt];
				
				if( retNew == undefined ) 
					retNew = ret.getElementsByTagName( sel[len] )[ (cnt - 1) ];
				var mobj = Object.create( q._obj );
				return mobj.$( retNew );
			}
			else
			{	
				retNew = ret.getElementsByTagName( sel )[cnt];
				var mobj = Object.create( q._obj );
				return mobj.$( retNew );
			}
		};
//END OF DOM FUNCTIONS

//FX
	function fx( frameRate ) {
		//public variables : agent->user agent.
		//thatFX : this
		//frameRate : the global framerate
		var agent = q.agent,
		qFX = this;
		this.frameRate = frameRate;
		
		//Used to clear timers and steps.
		this.mInterval = {};
		
		/***************************
		* To be advanced...
		* - fx.Core, handles the animation / framerate etc
		* object, steps to completion, value per step, initValue, attribute/property, savedValue, callback, points/pixels/percent, hidden?, reset)
		*****************************/
		if( !qFX.frameRate )
		{
			this.Core = function( args ) {
				var opts = {
					obj: null, 
					steps: 100, 
					stepVal: 1, 
					init: 0, 
					property: null, 
					to: 100, 
					save: 0, 
					callback: function(){}, 
					valueType: 'px', 
					display: 'none', 
					reset: true
				};
				opts  = q.extend( opts, args );
				
				if( opts.init === 0 )
					opts.obj.style.display = 'block';
				else
					opts.obj.style.display = opts.display;
					
				if( !opts.reset )
					opts.obj.style[ opts.property ] = '';
				else
					opts.obj.style[ opts.property ] = opts.to + opts.valueType;

				clearInterval( qFX.mInterval[opts.obj] );
				qFX.mInterval[opts.obj] = null;
				opts.callback();
				
			};
		}
		else
		{
			this.Core = function( args ) {
				var opts = {
					obj: null, 
					steps: 100, 
					stepVal: 1, 
					init: 0, 
					property: null, 
					to: 100, 
					save: 0, 
					callback: function(){}, 
					valueType: 'px', 
					display: 'none', 
					reset: false
				};
				opts  = q.extend( opts, args );
				
				var steps = parseInt( opts.steps ),
					startSteps = steps,
					newVal = opts.init;
				
				if( opts.init > opts.to )
					opts.stepVal = opts.stepVal > 0 ? opts.stepVal * -1 : opts.stepVal;
					
				clearInterval( qFX.mInterval[opts.obj] );
				
				//first step happens immediately
				newVal = newVal+opts.stepVal;

				opts.obj.style[opts.property] = newVal + opts.valueType;
				steps--;
				//setting the interval
				qFX.mInterval[opts.obj] = setInterval( function() {
					newVal = newVal + opts.stepVal;
					
					opts.obj.style[opts.property]= newVal + opts.valueType;
					
					steps--;
					if( steps <= 0 )
					{
						if( opts.init === 0 )
							opts.obj.style.display = 'block';
						else
							opts.obj.style.display = opts.display;
							
							
						if( !opts.reset )
							opts.obj.style[opts.property] = '';
						else
							opts.obj.style[opts.property] = opts.to + opts.valueType;
						
						clearInterval( qFX.mInterval[opts.obj] );
						qFX.mInterval[opts.obj] = null;
						opts.callback();
					}
				}, qFX.frameRate );
			};
		}
		
		//Simple Slide Effect
		//css transitions?
		if( q.cssTransitions )
		{	
			this.toggleSlide = function( obj, duration, to, property, callback ) {
				var objStyle = obj.style,
				objP = obj.parentNode,
				objPClass = objP.className;
				
				//We are checking for CLOSED.
				if( objPClass.indexOf('closed') > 0)
				{
					objP.className = objPClass.substr( 0, objPClass.indexOf('closed') - 1 );
					objStyle.display = 'block';
					var save = q.qEL( obj ).getOutsideSize( property );
					
					objStyle[ property ] = to + 'px';
					objStyle[ q.prefix + 'Transition' ] = '';
					
					setTimeout( function() {
						objStyle[ q.prefix + 'Transition' ] = property + ' ' + duration + 'ms ease-in-out';
						objStyle[ property ] = save + 'px';
						 
						qFX.mInterval[obj] = setTimeout(function() { 
								objStyle[property] = save;
								clearTimeout( qFX.mInterval[obj] );
								qFX.mInterval[obj] = null;
								callback();
							}, ( duration + 20 )
						);
					}, 16 );
				}
				else
				{
					if( qFX.mInterval[ obj ] === null )
					{
						var kept = q.qEL( obj ).getOutsideSize( property ) + 'px';
						objStyle.webkitTransition = '';
						objStyle[property] = '';
						var save = q.qEL( obj ).getOutsideSize( property ) + 'px';
						objStyle[property] = kept;
						
						setTimeout( function() {
							objStyle.webkitTransition = property + ' ' + duration + 'ms ease-in-out';
							objStyle[property] = to + 'px';
							
							qFX.mInterval[obj] = setTimeout(function(){ 
									objStyle[property] = save;
									clearTimeout( qFX.mInterval[obj] );
									qFX.mInterval[obj] = null;
									objStyle.display = 'none';
									objP.className = objPClass + ' closed';
									callback();
								}, ( duration + 20 ) 
							);
						}, 14 );
					}
				}
			};
		}
		else //nope we are not (desktop browsers, wp7 etc)
		{
			this.toggleSlide = function( obj, duration, to, property, callback ){
				var objP = obj.parentNode,
				objPClass = objP.className,
				objStyle = obj.style;
				
				if( objPClass.indexOf('closed') > 0 )
				{
					objP.className = objPClass.substr( 0, objPClass.indexOf('closed') - 1 );
					obj.style.display = 'block';
					var save = q.qEL( obj ).getOutsideSize( property );
					objStyle[property] = '0px';
					
					if( qFX.frameRate ) //we proceed with the anim
					{ 
						var steps = duration / qFX.frameRate;
						var init;
						var stepVal = (to + save ) / steps;
						init = 0;
						objStyle[property] = 0 + 'px';
						steps--;
						
						qFX.Core( { 
									"obj": obj, 
									"steps": steps, 
									"stepVal": stepVal, 
									"init": init, 
									"property": property, 
									"to": to, 
									"save": save, 
									"callback": callback 
								  }
						);
						
					}
					else{
						objStyle[property] = '';
						callback();
					}
				}
				else
				{
					if( qFX.frameRate ) //we proceed with the anim
					{
						var steps = duration / qFX.frameRate;
						if( qFX.mInterval[obj] != null )
						{}
						else
						{      
							var save = q.qEL( obj ).getOutsideSize( property );
							var init;
							var stepVal = ( to - save ) / steps;
							init = save + stepVal;
							objStyle[property] = init +' px';
							steps--;
							
							qFX.Core( {
										"obj":obj, 
										"steps":steps, 
										"stepVal":stepVal, 
										"init":init, 
										"property":property, 
										"to":to, 
										"save":save, 
										"callback": function() { 
														callback(); 
														objP.className += ' closed'; 
													} 
									  }
							);
							
						}
					}
					else
					{
						var save = q.qEL( obj ).getOutsideSize( property );
						objStyle.display = 'none';
						objStyle[property] = '';
						objP.className += ' closed';
						callback();
					}
				}
			};
		}
	}
//END OF FX

//HELPER FUNCTIONS (lie directly in the q object. No dependecies.

	this.tagCheck = function( th, tag ) {
		return ( th.tagName === tag.toUpperCase() );
	};
	this.classCheck = function( th,clss ) {
		return ( th.className.indexOf(clss) >= 0);
	};
	/***************************
	* Cross Browser functions
	****************************/
	if (!Object.create) 
	{
		Object.create = function (o) {
			function F() {}
			F.prototype = o;
			return new F();
		};
	}

	
	if( !window.getComputedStyle ){
		window.getComputedStyle = function( el, pseudo ) {
			this.el = el;
			this.getPropertyValue = function( prop ) { 
				var re = /(\-([a-z]){1})/g;
				if ( prop == 'float' ) prop = 'styleFloat';

				if( !el.currentStyle )
				{  
					return prop === 'width' ? (el.offsetWidth)  : (el.offsetHeight);
				}

				if ( re.test(prop) ) 
				{
					prop = prop.replace( re, function() {
						return arguments[2].toUpperCase();
					} );
				}
				else if(  el.currentStyle[prop]== 'auto' )
				{
					var tmp = prop == 'width' ? (el.offsetWidth)  : (el.offsetHeight);
					return tmp;
				}
				return el.currentStyle[prop] ? el.currentStyle[prop] : null;
			}
			return this;
		}
		
		if (!Array.prototype.indexOf) 
		{
		  Array.prototype.indexOf = function( obj, fromIndex ) {
			if ( fromIndex == null ) {
				fromIndex = 0;
			} 
			else if ( fromIndex < 0 ) 
			{
				fromIndex = Math.max( 0, this.length + fromIndex );
			}
			for ( var i = fromIndex, j = this.length; i < j; i++ ) 
			{
				if (this[i] === obj)
					return i;
			}
			return -1;
		  };
		}
	}
	if( document.getElementsByClassName )
	{
		this.getElementsByClass = function( clss, context ) {
			return context.getElementsByClassName( clss );
		}
	}
	else
	{
		this.getElementsByClass = function( cl, context ) {
				var retnode = [];
				var myclass = new RegExp('\\b' + cl + '\\b');
				var elem = context.getElementsByTagName('*');
				for ( var i = 0, len = elem.length; i < len; i++ ) {
					var classes = elem[i].className;
					if ( myclass.test(classes) ) retnode.push( elem[i] );
				}
				return retnode;
			};   
	}
	
	if( document.addEventListener ){
		this.stopPropagation = function(e) {
			e.stopPropagation();
		};
		this.preventDefault = function(e) {
			e.preventDefault();
		};
	}
	else
	{
		//for ie (bubbling)
		this.stopPropagation = function(e) {
			window.event.cancelBubble = true;
		};
		this.preventDefault = function(e) {
			window.event.returnValue = false;
		};
	}
	this.keyCounter = function($th,e,max) {
		q.stopPropagation(e);
		setTimeout( function() {
			var l = $th.value.length;
			if( l >= max )
			{
				var kept = q.qEL( $th ).findUpwards('span.num').get();
				kept.getElementsByTagName('span')[0].innerHTML = max;
				$th.value=$th.value.substr( 0, max );
				kept.className = 'num red';
				
				return false;
			}
			var kept = q.qEL( $th ).findUpwards('span.num').get();
			kept.className = 'num';
			kept.getElementsByTagName('span')[0].innerHTML = l;
			
		}, 12 );	
	};
	this.clearVal = function( $th ) {
		if( $th.getAttribute('alt') == $th.value )
			$th.value = '';
			
		if( !$th.onblur )
		{
			$th.onblur = function() {
				if( this.value.length === 0 )
					this.value = this.getAttribute('alt')
			};
		}
	};
	
	/************************
	* getWidth() 
	* -Cross Browser, returns the window's width
	*
	* getHeight() 
	* -Cross Browser, returns the window's height
	*************************/
	if ( self.innerHeight )
	{
		var getWidth = function() {
			return self.innerWidth;
		};
		var getHeight = function() {
			return self.innerHeight;
		};
	}
	else if( document.documentElement && document.documentElement.clientHeight )
	{
		var getWidth = function() {
			return document.documentElement.clientWidth;
		};
		var getHeight = function() {
			return document.documentElement.clientHeight;
		};
	}
	else if( document.body )
	{
		var getWidth = function() {
			return document.body.clientWidth;
		};
		var getHeight = function() {
			return document.body.clientHeight;
		};
	}
	/************************
	* Changes an element's class, to 
	* -vrt (vertical)
	* -hrz (horizontal)
	* depending on its width
	*************************/
	this.orientation = function( obj ){
		var w = getWidth(); 
		
		if( w >= 400 ) //is our resolution large enough to accomodate the icons in landscape mode?
			obj.className = 'vrt';
		else
			obj.className = 'hrz';
	}
	/************************
	* Binding a repeating timer that checks for the device's width
	* Runs immediately on initialization (no call)
	************************/
	this.orientationINIT = function() {
		var content;
		if( (content = document.getElementById('content')) != undefined ){
			this.orientation( content );
		
			var Orient = setInterval( function() {
				q.orientation( content );
			}, 580 ); //each 580ms a call for orientation change
		}
	}
	
	/*************************
	* EACH( objectArray, callback )
	* Traverses through every single object of an array
	* and runs code in a privately specified scope
	**************************/
	this.EACH = function( objArr, callback ) {
		for( var i=0, l = objArr.length; i < l; i++ )
		{
			if( callback.call( objArr[i] ) === false )
				break;
		}
	};
	/***********************
	*  String trim. Returns an array
	*  used for our minimal selector engine ( 'ul li a' )
	************************/
	this.strtok = function( str ) {
		var f = str.indexOf(' '), 
		    ret = [];
		    
		if( f > 0 )
		{
			do
			{
				ret.push( str.substr( 0, f ) );
				str = str.substr( f );
			}
			while( (f = str.indexOf(' ')) > 0 );
			ret.push( str.substr( 1, str.length ) );
		}
		else
			ret = str;
			
		return ret;
	};
	
	/***********************
	*  Options extender
	************************/
	this.extend = function() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if ( typeof target === "boolean" )
		{
			deep = target;
			target = arguments[1] || {};
			// skip the boolean and the target
			i = 2;
		}
		if ( length === i )
		{
			target = this;
			--i;
		}

		for ( ; i < length; i++ )
		{
			// Only deal with non-null/undefined values
			if ( (options = arguments[ i ]) != null ) 
			{
				for ( name in options ) 
				{
					src = target[ name ];
					copy = options[ name ];

					// Prevent never-ending loop
					if ( target === copy ) 
						continue;
						
					if ( copy !== undefined ) 
						target[ name ] = copy;
					
				}
			}
		}
		return target;
	};

//END OF HELPER FUNCTIONS

this.hObj = new handler( 0, 0, 0, 0 );

//BENCHMARKING - and Possible Framerates
	var bnchMrk = new Date()-bnchMrk;
	if( bnchMrk < 10 )
		var frameRate = 13;
	else if( bnchMrk < 18 )
		var frameRate = 14;
	else if( bnchMrk < 25 )
		var frameRate = 18;
	else if( bnchMrk < 33 )
		var frameRate = 26;
	else
		var frameRate = false;
		
//END OF BENCHMARKING
	this.fx = new fx( frameRate );
	
	
	if( this.contentLoaded )
	{ 	
		document.addEventListener( "DOMContentLoaded", function() {
			document.removeEventListener( "DOMContentLoaded", arguments.callee, false );
			q.DocumentReady();
		}, false );
	}
	else
	{	
		if( document.readyState )
		{
			var domLoad = setInterval( function() {
				if( document.readyState == "complete" )
				{
					clearInterval( domLoad );
					q.DocumentReady();
				}
			}, 6 );
		}
		else //max fallback
			window.onload = q.DocumentReady();
	}

	q.DocumentReady = function(){
		this.domLoaded = true;
		this.orientationINIT();
		
		if( this.touches )
		{
			var AnchorObjects = document.getElementById('body').getElementsByTagName('a');
			
			for( var i = 0, len = AnchorObjects.length; i < len; ++i )
				AnchorObjects[i].addEventListener( 'touchstart', this.hObj.touchS_NoBlock, false );

			var tmphref;
			
			this.EACH( AnchorObjects, function(){
				var $th = this;
				if( $th.onclick == null )
				{
					$th.mem = $th.href;
					$th.addEventListener( 'vnt', function(e) { e.stopPropagation(); window.location.href = $th.mem; }, false );
					$th.onclick = function() { return false; };
				}
				else
				{
					$th.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();},false);
					$th.mem = $th.onclick;
					//tmphref = $th.getAttribute('href');
					//if( tmphref.length > 8 && tmphref.indexOf('void(') == -1 )
					//{	console.log(1);
					//	$th.addEventListener( 'vnt', function(e) {
					//		e.stopPropagation();
					//		var evObj = document.createEvent('MouseEvents'); //firing the custom event
								//	evObj.initEvent( 'click', true, true );
								//	this.dispatchEvent( evObj );
					//	});
					//}
					//else
					//{
						$th.addEventListener( 'vnt', function(e) { e.stopPropagation(); $th.mem(this); }, false );
						$th.onclick = function(e){ return false; };
					//}
				}
			});
		}
		else
		{
			var AnchorObjects = document.getElementById('body').getElementsByTagName('a');
			for( var i = 0, len = AnchorObjects.length; i < len; ++i )
				AnchorObjects[ i ].addEventListener('click',function(e){e.preventDefault();},false);
		}
		
		if( document.getElementById('volume').innerHTML == "0%" ) is_mute = true;
		
		vlcJS.pauseButton = document.getElementById('pauseButton');
		vlcJS.volume = document.getElementById('volume');
		
		var len = this.DOMLoad.length;
		for( var i = 0; i < len; ++i )
			if( this.DOMLoad[i].call( this ) ) break;
	};
}


		/**************************************************
		* sliderStart
		* grabs the object/node as an argument
		* uses it for slider
		***************************************************/
		birdsongMobile.prototype.sliderStart = function( $this, e, $cont, slideCall ){
			var that = this;
			if( !$cont ) $cont = $this.parentNode;
			
			var timer = new Date();
			
			if( $cont === 1 ){
				$cont = $this;
				$this = $this.childNodes[0];
				
				var $contWidth = this.qEL( $cont ).getOutsideSize( 'width', true ),
					$curleft = this.qEL( $this ).curOffsetLeft();
				
				var win = parseInt( ( parseFloat($this.style.left) / 100 ) * $contWidth );
				if( !win ){ win = 0, act = 0; }	 
				
				var winX = this.getPageX(e);
				var clX = winX-$curleft;
				var maxW = $contWidth;

				win = clX < 0 ? 0 : Math.min( clX, maxW ) ;
				var percent = ( win / ($contWidth) * 100 );
				$this.style.left = (percent)+'%';
				
				var initVal = win;
			}
			else
			{
				var timer = new Date();

				var $contWidth = this.qEL( $cont ).getOutsideSize( 'width', true ),
					$curleft = this.qEL( $this ).curOffsetLeft();
				
				var win = parseInt( ( parseFloat($this.style.left) / 100 ) * $contWidth );
				
				var act;
				if(!win){ 
					win=0,
					act=0;
				}
				var initVal = win;
			}
			
			this.onHandler.addHandler( this.onmousedown,document, function(e){ that.preventDefault(e); } );
			this.onHandler.addHandler( this.onmousemove,document, function(e){ 
				if(!e) e = window.event;
				
				var winX = that.getPageX(e);
				var clX = winX - $curleft - 16;
				var maxW = $contWidth  - 18;
				
				if( win >= -20 && win <= maxW )
				{	
					win = clX<0 ? 0 : Math.min(clX,maxW) ;
					var percent = (win/($contWidth)*100);
					$this.style.left = (percent)+'%';
				}
				
				that.preventDefault(e);
				that.stopPropagation(e);
				
				vlcJS.slider_seek( e, this.parentNode );
			});
			
			that.onHandler.addHandler(that.onmouseup,document, function(e){ 
				that.onHandler.killHandler(that.onmousemove,document);
				that.onHandler.killHandler( that.onmousedown, document );
				that.onHandler.killHandler(that.onmouseup,document);
				that.stopPropagation(e);
				that.preventDefault(e);
				
				vlcJS.slider_seek( e, this.parentNode  );
				
				return false;
			});
			return false;
		};


var birdsong = new birdsongMobile();

birdsong.OnDomReady( function() {		
	if( this.touches )
	{
		var content = document.getElementById('one'),
		    sliders = this.getElementsByClass( 'scrub', content );
		
		for( var i = 0, len = sliders.length; i < len; ++i )
		{	
			sliders[i].ontouchstart = sliders[i].onmousedown;
			sliders[i].onmousedown = null;
			
			var sldP = sliders[i].parentNode;
			sldP.ontouchstart = sldP.onmousedown;
			sldP.onmousedown = null;
		}
	}
});