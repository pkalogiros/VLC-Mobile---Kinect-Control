/**********************************************************************
 * Global variables
 *********************************************************************/

var old_time = 0;
var pl_cur_id;
var albumart_id = -1;

/**********************************************************************
 * Slider functions
 *********************************************************************/
 
var slider_mouse_down = 0,
	slider_dx = 0,
	is_mute	= false,
	masterTimeout;

setTimeout(function(){
	update_status();
},0);

function update_playlist()
{
    loadXMLDoc( 'requests/playlist.xml', parse_playlist );
}

function update_status( id )
{
	if( vlcJS.active === 0 || id === 1 )
		loadXMLDoc( 'requests/status.xml', parse_status );
	else if( vlcJS.active === 1 )
		update_playlist();
	else
		{ //filelist
		}
		
		
	clearTimeout(masterTimeout);
			
	masterTimeout = setTimeout(function(){
		update_status();
	},1280);
}

function clear_children( elt )
{   
    if( elt )
        while( elt.hasChildNodes() )
            elt.removeChild( elt.firstChild );
}

function parse_playlist()
{
    if( req.readyState == 4 )
    {
        if( req.status == 200 )
        {
			if( req.responseXML == null ) return false;
			
            var answer = req.responseXML.documentElement,
				playtree = document.getElementById( 'playlist' ),
				Lvl1 = answer.childNodes,
				len1= Lvl1.length;
			
            pl_cur_id = 0;  /* changed to the current id is there actually
                             * is a current id */
							 
			while( len1-- )
			{
				if( Lvl1[ len1 ].nodeType !== 1 )
					continue;
				else
				{
					//Media library and playlist
					var lvl2 = Lvl1[ len1 ].childNodes,
						len2 = lvl2.length;
						
					playtree.innerHTML = "";
					
					if( len2 > 0 )
					{
						while( len2-- )
						{
							if( lvl2[ len2 ].nodeType !== 1 )
								continue;
							
							var li = document.createElement('li'),
								str = "";
								
							if( lvl2[ len2 ].getAttribute('current') === "current" )
								li.className = "active";
							
							li.id = "pl_" + lvl2[ len2 ].getAttribute('id');
							li.setAttribute("onclick", "vlcJS.pl_play(" + lvl2[ len2 ].getAttribute('id') + ")");
							
							str = lvl2[ len2 ].getAttribute('name');
							str += "  -  " + format_time( lvl2[ len2 ].getAttribute('duration') / 1000000 );
							var a = document.createElement('a');
							a.setAttribute('onclick', 'vlcJS.pl_delete(' + lvl2[ len2 ].getAttribute('id') + ')');
							a.innerHTML = "X";
							a.href="#";
							//bind To touchSnoblock
							li.addEventListener('touchstart', birdsong.hObj.touchS_NoBlock, false);
							
							
							li.innerHTML = str;
							a.addEventListener('touchstart', birdsong.hObj.touchS_NoBlock, false);
							a.addEventListener('click', function(e){e.stopPropagation();e.preventDefault();}, false);
							if( birdsong.touches )
								li.addEventListener('click', function(e){e.stopPropagation();e.preventDefault();}, false);
							
							li.appendChild( a );
							
							playtree.appendChild( li );
							
						}
					}
				}
			}
			
        }
        else
        {
           // alert( 'Error! HTTP server replied: ' + req.status );
        }
    }
}

var vlcJS = {
	curr_id : false,
	state : true,
	active : 0,
	playlistActive : false,
	pauseButton : false,
	volume : false,
	
	pl_play : function( id ) {
		loadXMLDoc( 'requests/status.xml?command=pl_play&id='+id, parse_status );
		this.pl_cur_id = id;
		
		var els = document.getElementById('playlist').getElementsByTagName('li'),
			i = -1;
		while( els[ ++i ] )
			els[ i ].className = "";
			
		vlcJS.playlistActive = document.getElementById( "pl_" + id );
		vlcJS.playlistActive.className = "active";
	},
	
	pl_pause : function() {
		if( this.state == "playing" )
			loadXMLDoc( 'requests/status.xml?command=pl_pause&id=' + this.pl_cur_id, parse_status );
		else if( this.state == "paused" )
			loadXMLDoc( 'requests/status.xml?command=pl_pause&id=' + this.pl_cur_id, parse_status );
		else
			loadXMLDoc( 'requests/status.xml?command=pl_play&id='+this.pl_cur_id, parse_status );
	},

	pl_stop : function() {
		if( window.birdsong && birdsong.touches )
			setTimeout(function(){
				if( confirm("Stop playback?") )
					loadXMLDoc( 'requests/status.xml?command=pl_stop', parse_status );
			},22);
		else if( window.birdsong )
		{
			if( confirm("Stop playback?") )
				loadXMLDoc( 'requests/status.xml?command=pl_stop', parse_status );
		}
		else
			loadXMLDoc( 'requests/status.xml?command=pl_stop', parse_status );
	},
	
	slider_seek : function() {
		//this.moving = true;
		this.seek( parseInt( document.getElementById('scrub').style.left ) + "%25");
	},
	
	volume_down : function() {
			loadXMLDoc( 'requests/status.xml?command=volume&val=-20', parse_status );
	},
	
	volume_up : function() {
			loadXMLDoc( 'requests/status.xml?command=volume&val=%2B20', parse_status );
	},
	
	set_volume : function( volume ) {
			loadXMLDoc( 'requests/status.xml?command=volume&val=' + volume, parse_status );
	},
	
	mute : function() {
		if( is_mute )
			loadXMLDoc( 'requests/status.xml?command=volume&val=+80', parse_status );
		else
			loadXMLDoc( 'requests/status.xml?command=volume&val=*0', parse_status );
		
		is_mute = !is_mute;
	},
	
	fullscreen : function() {
		loadXMLDoc( 'requests/status.xml?command=fullscreen', parse_status );
	},
	
	snapshot : function() {
		loadXMLDoc( 'requests/status.xml?command=snapshot', parse_status );
	},
	
	seek : function( pos ) {
		this.moving = true;
		loadXMLDoc( 'requests/status.xml?command=seek&val='+pos, parse_status );
	},
	
	pl_next : function()
	{
		loadXMLDoc( 'requests/status.xml?command=pl_next', parse_status );
	},
	
	pl_previous : function()
	{
		loadXMLDoc( 'requests/status.xml?command=pl_previous', parse_status );
	},
	
	pl_delete : function( id ) {
		loadXMLDoc( 'requests/status.xml?command=pl_delete&id='+id, parse_status );
		
		if( document.getElementById( "pl_" + id ) ) {
			document.getElementById( "pl_" + id ).style.display = "none";
		}
	},
	
	pl_empty : function() {
		if( birdsong.touches )
			setTimeout(function(){
				if( confirm("Empty playlist?") )
					loadXMLDoc( 'requests/status.xml?command=pl_empty', parse_status );
			},22);
		else
			if( confirm("Empty playlist?") )
				loadXMLDoc( 'requests/status.xml?command=pl_empty', parse_status );
	},
	
	pl_sort : function( sort, order ) {
		loadXMLDoc( 'requests/status.xml?command=pl_sort&id='+order+'&val='+sort, parse_status );
	},
	
	pl_shuffle : function() {
		loadXMLDoc( 'requests/status.xml?command=pl_random', parse_status );
	},
	
	pl_loop : function() {
		loadXMLDoc( 'requests/status.xml?command=pl_loop', parse_status );
	},
	
	pl_repeat : function() {
		loadXMLDoc( 'requests/status.xml?command=pl_repeat', parse_status );
	},
	
	browse : function( dest ) {
		//
		document.getElementById( 'browse_dest' ).value = dest;
		document.getElementById( 'browse_lastdir' ).value = "~";
		vlcJS.browse_dir( document.getElementById( 'browse_lastdir' ).value );
	},
	browse_file : function( dest ) {
		document.getElementById( 'browse_dest' ).value = dest;
		document.getElementById( 'browse_lastdir' ).value;
		vlcJS.in_play();
	},
	
	browse_fileQEUE : function( dest ) {
		document.getElementById( 'browse_dest' ).value = dest;
		document.getElementById( 'browse_lastdir' ).value;
		vlcJS.in_enqueue();
	},
	
	browse_dir : function( dir ) {
		document.getElementById( 'browse_lastdir' ).value = dir;
		loadXMLDoc( 'requests/browse.xml?dir='+encodeURIComponent(dir), parse_browse_dir );
	},

	browse_path : function( p ) {
		document.getElementById( ( 'browse_dest' ) ).value = p;
		document.getElementById( ( 'browse_dest' ) ).focus();
	},

	refresh_albumart : function( force ) {
		if( albumart_id != pl_cur_id || force )
		{
			var now = new Date();
			var albumart = document.getElementById( 'albumart' );
			albumart.src = '/art?timestamp=' + now.getTime();
			albumart_id = pl_cur_id;
		}
	},
	
	in_play : function() {
		var input = document.getElementById('browse_dest').value;
		var url = 'requests/status.xml?command=in_play&input='+encodeURIComponent( addslashes(escapebackslashes(input)) );
		loadXMLDoc( url, 1 );
		setTimeout( function(){
			update_status(1);
			update_playlist();
		}, 1500 );
	},

	in_enqueue : function() {
		var input = document.getElementById('browse_dest').value;
		var url = 'requests/status.xml?command=in_enqueue&input='+encodeURIComponent( addslashes(escapebackslashes(input)) );
		loadXMLDoc( url, 1 );
		setTimeout( 'update_playlist()', 1500 );
	},
	
	activate : function( id ) {
		var lnks = document.getElementById('header').getElementsByTagName('a');
		
		lnks[0].className = ""; 
		lnks[1].className = ""; 
		lnks[2].className = ""; 
		
		lnks[id].className = "act"; 
		
		if( id === 0 )
			document.getElementById('wrap').className='showOne';
		else if( id === 1 )
			document.getElementById('wrap').className='showTwo';
		else if( id === 2 )
			document.getElementById('wrap').className='showThree';
			
		vlcJS.active = id;
	}

};

window.vlcJS = vlcJS;

function loadXMLDoc( url, callback )
{
  if ( window.XMLHttpRequest )
  {
    req = new XMLHttpRequest();
    req.onreadystatechange = callback;
    req.open( "GET", url, true );
    req.send( null );
  }
  else if ( window.ActiveXObject )
  {
    req = new ActiveXObject( "Microsoft.XMLHTTP" );
    if ( req )
    {
      req.onreadystatechange = callback;
      req.open( "GET", url, true );
      req.send();
    }
  }
}

function parse_status()
{
    if( req.readyState == 4 )
    {
        if( req.status == 200 )
        {
            var status = req.responseXML.documentElement,
				state = status.getElementsByTagName( 'state' )[0].firstChild.data,
				timetag = status.getElementsByTagName( 'time' );
				
			vlcJS.state = state;
			
            if( timetag.length > 0 )
            {
                var new_time = timetag[0].firstChild.data;
            }
            else
            {
                new_time = old_time;
            }
            var lengthtag = status.getElementsByTagName( 'length' );
            var length;
            if( lengthtag.length > 0 )
            {
                length = lengthtag[0].firstChild.data;
            }
            else
            {
                length = 0;
            }
            var slider_position,
				volLevel = status.getElementsByTagName( 'volume' )[0].firstChild.data/5.12;
            positiontag = status.getElementsByTagName( 'position' );
			
			if( !vlcJS.moving )
				document.getElementById('scrub').style.left = positiontag[0].firstChild.data + "%";
			else
				vlcJS.moving = false;
			
            //if( old_time > new_time )
             //   setTimeout('update_playlist()',50);
				
            old_time = new_time;
            set_text( 'time', format_time( new_time ) );
            set_text( 'length', format_time( length ) );
            if( status.getElementsByTagName( 'volume' ).length != 0 )
                set_text( 'volume', Math.floor( volLevel )+'%' );
			
			if( volLevel <= 20 )
				vlcJS.volume.className = "low";
			else if( volLevel <= 40 )
				vlcJS.volume.className = "med";
			else if( volLevel <= 60 )
				vlcJS.volume.className = "high";
			else if( volLevel <= 80 )
				vlcJS.volume.className = "veryHigh";
			else if( volLevel <= 90 )
				vlcJS.volume.className = "veryHigh2";
			else
				vlcJS.volume.className = "tooHigh";
		   
			setTimeout(function(){
				if( vlcJS.state.toUpperCase() == "STOP" )
					vlcJS.pauseButton.innerHTML = "STOPPED";
				else
					vlcJS.pauseButton.innerHTML = vlcJS.state.toUpperCase();
			},40);
		   
		   
            var tree = document.createElement( "ul" );
            var categories = status.getElementsByTagName( 'category' );
            var i;
            for( i = 0; i < categories.length; i++ )
            {
                var item = document.createElement( "li" );
                item.appendChild( document.createTextNode( categories[i].getAttribute( 'name' ) ) );
                var subtree = document.createElement( "dl" );
                var infos = categories[i].getElementsByTagName( 'info' );
                var j;
                for( j = 0; j < infos.length; j++ )
                {
                    var subitem = document.createElement( "dt" );
                    subitem.appendChild( document.createTextNode( infos[j].getAttribute( 'name' ) ) );
                    subtree.appendChild( subitem );
                    if( infos[j].hasChildNodes() )
                    {
                        var subitem = document.createElement( "dd" );
                        subitem.appendChild( document.createTextNode( infos[j].firstChild.data ) );
                        subtree.appendChild( subitem );
                    }
                }
                item.appendChild( subtree );
                tree.appendChild( item );
            }
            var infotree = document.getElementById('info' );
            clear_children( infotree );
            infotree.appendChild( tree );
           
        }
        else
        {
            /*alert( 'Error! HTTP server replied: ' + req.status );*/
        }
    }
}

/* fomat time in second as hh:mm:ss */
function format_time( s )
{
    var hours = Math.floor(s/3600);
    var minutes = Math.floor((s/60)%60);
    var seconds = Math.floor(s%60);
    if( hours < 10 ) hours = "0"+hours;
    if( minutes < 10 ) minutes = "0"+minutes;
    if( seconds < 10 ) seconds = "0"+seconds;
    return hours+":"+minutes+":"+seconds;
}

/* delete all a tag's children and add a text child node */
function set_text( id, val )
{
    var elt = document.getElementById( id );
	if( !elt) return false;
    while( elt.hasChildNodes() )
        elt.removeChild( elt.firstChild );
    elt.appendChild( document.createTextNode( val ) );
}





function parse_browse_dir( )
{
    if( req.readyState == 4 )
    {
        if( req.status == 200 )
        {
            var answer = req.responseXML.documentElement;
            if( !answer ) return;
            var browser = document.getElementById( 'fileList' );
            var elt = answer.firstChild;
			
			clear_children( browser );
			
            while( elt )
            {
                if( elt.nodeName == "element" )
                {
                    var item = document.createElement( "li" );
                    if( elt.getAttribute( 'type' ) == 'directory' )
                    {
                        item.setAttribute( 'onclick', 'vlcJS.browse_dir(\''+addslashes(escapebackslashes(elt.getAttribute( 'path' )))+'\');return false;');
						item.className = "drct";
					}
                    else
                    {
                        item.setAttribute( 'onclick', 'vlcJS.browse_file(\''+addslashes(escapebackslashes(elt.getAttribute( 'path' )))+'\');return false;' );
						var a = document.createElement('a');
						a.className = "enqeue";
						a.href = "#";
						a.setAttribute('onclick', 'vlcJS.browse_fileQEUE(\''+addslashes(escapebackslashes(elt.getAttribute( 'path' )))+'\');return false;');
						a.innerHTML = "ENQEUE";
						item.appendChild( a );
						
						a.addEventListener('touchstart', birdsong.hObj.touchS_NoBlock, false);
						a.addEventListener('click', function(e){ e.stopPropagation(); e.preventDefault(); },false);			
					}
                    item.appendChild( document.createTextNode( elt.getAttribute( 'name' ) ) );
					
					if( birdsong.touches )
						item.addEventListener('click', function(e){e.preventDefault();e.stopPropagation();}, false);
						
					item.addEventListener('touchstart', birdsong.hObj.touchS_NoBlock, false);
					
                    browser.appendChild( item );
                }
                elt = elt.nextSibling;
            }
            
            
        }
        else
        {
            /*alert( 'Error! HTTP server replied: ' + req.status );*/
        }
    }
}
function escapebackslashes( str ){ return str.replace(/\\/g, '\\\\'); }
function addslashes( str ){ return str.replace(/\'/g, '\\\''); }
function value( id ){ return id.value; }