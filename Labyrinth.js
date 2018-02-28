var N
var wx, hy
var side, length
var indentx, indenty
var cell = []
var vertex = []
var dx = [-1,0,1,0]
var dy = [0,-1,0,1]
var max_probability=70
var min_probability=25
var hero
var i_hero, j_hero
var buf = []
var answer = []
var if_exit_shown
var length_of_exit
var music
var Lvl
var x_start, y_start
var x_new, y_new
var if_two_touches 
var end_of_level
var button_start_game
var indenty_in_menu
var arrow_left, arrow_left, arrow_left, arrow_left
var if_we_end_level
var button_back_to_menu
var if_we_in_the_game
var if_we_in_the_menu
var if_all_fingers_up
var free_levels = []

function getrandom(min,max)
{
   return Math.floor(Math.random()*(max-min+1))+min
}

function show_end_of_level()
{
     if(Lvl<5) end_of_level.src = 'end_of_level.png'
     else end_of_level.src = 'end_of_level_completed.png'
	 
	 end_of_level.style.display = ''
	 
	 document.ontouchstart = touch_the_screen_after_level
}	 

function end_level()
{
     ctx.clearRect(0,0,wx,hy)
	 
     hero.style.display = 'none'
	 button_back_to_menu.style.display  = 'none'
	 hide_arrows()
	 	 
	 show_end_of_level()	 
}

function remove_hero(dy,dx)
{
  
	if(dx==1)
	{
	   if(cell[i_hero][j_hero].right==1) return 
	}
 
	if(dx==-1)
	{
	   if(cell[i_hero][j_hero].left==1) return 
	}

	if(dy==1)
	{
	   if(cell[i_hero][j_hero].bottom==1) return 
	}
	
	if(dy==-1)
	{
	   if(cell[i_hero][j_hero].top==1) return 
	}

    i_hero = i_hero+dy
	j_hero = j_hero+dx
	
	place_hero(i_hero,j_hero)
		
	if(if_exit_shown==true)
	{
      clear_exit()
	  if_exit_shown = false
	}	
	
}

function change_place_of_hero(event)
{
   switch (event.target.direction)
	 {
	    case 0: {remove_hero(0,-1); break; }
	    case 1: {remove_hero(-1,0); break; }
	    case 2: {remove_hero(0,1); break; }
	    case 3: {remove_hero(1,0); break; }			
	 }
}

function end_free_level()
{
    hide_arrows()
   	button_back_to_menu.style.display = 'none'
    hero.style.display = 'none'	
	
	ctx.clearRect(0,0,wx,hy)
	   
    show_free_levels()
}

function end_touching(event)
{
		
	if(event.touches.length==0)
	{
	 
	 if( (i_hero==0) && (j_hero==N) )
	 {
	    end_free_level()
		  return false;
	 }
	 
     if(if_two_touches==true)
     {
		   if_two_touches=false
		   return false
	   } 
	}	 
	
}

function touch_screen_in_the_game(event)
{
  
  if(event.touches.length==2)
	{ 
	    if_two_touches = true
	
	    if(if_exit_shown==false)
			{
 	        show_exit(i_hero, j_hero)
				  if_exit_shown=true
			}
			return false
	}
	
	document.ontouchend = end_touching

}

function touch_the_screen_after_level(event)
{

  if(event.touches.length>0) 
	{
	   document.ontouchend = function(event)
		 {
		   if(event.touches.length==0)
			 {
         if(if_we_in_the_menu==true) return false
				 
				 end_of_level.style.display = 'none'
				 
				 ctx.clearRect(0,0,wx,hy)
				 
				 if(Lvl==3)
				 {
				   button_free_play.src = 'button_free_play_open.png'
				   button_survival.src = 'button_survival_open.png'
				   
				   button_free_play.state = 1
				 
           goto_the_menu()
				   Lvl=1
				 } 
				 else
				 {
     				 Lvl++
	     			 create_level(Lvl)
				 }	 
			 } 	 
		 } 
	}
}


function clear_exit()
{

  var k
	var x,y
	var i,j
	
	for(k=0;k<length_of_exit;k++)
	{
	   i = answer[k].y
		 j = answer[k].x
		 
		 x = indentx+j*side+side/3
		 y = indenty+i*side+side/3
		 
		 ctx.clearRect(x-1,y-1,side/3+2,side/3+2)
	
	}

}

function show_path(length)
{
  var k
	var x,y
	var i,j
	
	for(k=0;k<length;k++)
	{
	   i = answer[k].y
		 j = answer[k].x
		 
		 x = indentx+j*side+side/3
		 y = indenty+i*side+side/3
		 
		 ctx.fillStyle = 'green'
		 
		 ctx.fillRect(x,y,side/3,side/3)
	
	}

}

function find_exit(i,j,lvl)
{
   var length_path

   if( (i==0) && (j==N-1) ) return 0
	 
	 buf[i][j]=1
	 
	 if((cell[i][j].right==0) && (buf[i][j+1]==0))
	 {
	        answer[lvl].x = j+1
			answer[lvl].y = i
			length_path = find_exit(i,j+1,lvl+1)
			if(length_path>=0) return length_path+1
	 }
	 
	 if((cell[i][j].left==0) && (buf[i][j-1]==0))
	 {
	        answer[lvl].x = j-1
			answer[lvl].y = i
			length_path = find_exit(i,j-1,lvl+1)
			if(length_path>=0) return length_path+1
	 }

	 if((cell[i][j].top==0) && (buf[i-1][j]==0))
	 {
	        answer[lvl].x = j
			answer[lvl].y = i-1
			length_path = find_exit(i-1,j,lvl+1)
			if(length_path>=0) return length_path+1
	 }
	 
	 if((cell[i][j].bottom==0) && (buf[i+1][j]==0))
	 {
	        answer[lvl].x = j
			answer[lvl].y = i+1
			length_path = find_exit(i+1,j,lvl+1)
			if(length_path>=0) return length_path+1
	 }
	 
	 return -1;
}

function show_exit(i,j)
{
     var length

	 zero_buf()
     length = find_exit(i,j,0)
	 show_path(length)

	 if_exit_shown = true
	 length_of_exit = length
}

	
function make_maze(k,p,wd,prob,wall_length,curr_deep,max_deep)
{
   if(curr_deep>max_deep) return

   var rand, t
   var i=k, j=p
   var x,y
   var our_prob
   var temp=0
   var length
   
   x = indentx+j*side
   y = indenty+i*side
   
   for(t=0;t<4;t++)
   {
	  if(vertex[i+dy[t]][j+dx[t]]==0)
    {
	   rand = getrandom(1,100)	

		 if(rand<=prob)
		 {
			
			length = getrandom(1,wall_length)
			
			while( !((vertex[i+dy[t]][j+dx[t]]==1) ||  (temp>length)) )
			{
			  temp++

		      ctx.beginPath()
			  ctx.moveTo(x-dx[t]*wd,y-dy[t]*wd)
				
				i = i+dy[t]
				j = j+dx[t]

				vertex[i][j]=1
				
                x = indentx+j*side
                y = indenty+i*side
			
  	            ctx.lineTo(x,y)
                ctx.stroke()
	  		
				if(prob<min_probability) make_maze(i,j,wd,min_probability,wall_length,curr_deep+1,max_deep)					
				else make_maze(i,j,wd,prob-5,wall_length,curr_deep+1,max_deep)
				
				if(dx[t]==-1)
				{
					 cell[i-1][j].bottom = 1
					 cell[i][j].top = 1
				}
				
				if(dx[t]==1)
				{
					 cell[i-1][j-1].bottom = 1
					 cell[i][j-1].top = 1
				}

				if(dy[t]==-1)
				{
					 cell[i][j-1].right = 1
					 cell[i][j].left = 1
				}

				if(dy[t]==1)
				{
					 cell[i-1][j-1].right = 1
					 cell[i-1][j].left = 1
				}
				
			}	
						
			if(prob<min_probability) make_maze(i,j,wd,min_probability,wall_length,curr_deep+1,max_deep)
            else make_maze(i,j,wd,prob-5,wall_length,curr_deep+1,max_deep)		
		 }		 
    }	  
   }
}

function make_path(n,m,wd)
{
    var k
    var i=n
    var j=m
    var x,y
	
    k=getrandom(0,3)
    
    x = indentx+j*side
    y = indenty+i*side

  	ctx.beginPath()
    ctx.moveTo(x-dx[k]*wd,y-dy[k]*wd)
		
		while( !(vertex[i][j]==1))
		{
		    vertex[i][j]=1 
		 
   	        i = i+dy[k]
	        j = j+dx[k]

			if(k==0)
			{
			   cell[i-1][j].bottom = 1
			   cell[i][j].top = 1
			}
			
			if(k==2)
			{
			   cell[i-1][j-1].bottom = 1
			   cell[i][j-1].top = 1
			}

			if(k==1)
			{
			   cell[i][j-1].right = 1
			   cell[i][j].left = 1
			}

			if(k==3)
			{
			   cell[i-1][j-1].right = 1
			   cell[i-1][j].left = 1
			}

		}
		
      x = indentx+j*side
      y = indenty+i*side

	  ctx.lineTo(x,y)
	  ctx.stroke()
	
}

function correct_maze_2(wd)
{
  var i,j
	
	for(i=0;i<=N;i++)
		for(j=0;j<=N;j++)
		  if(vertex[i][j]==0) make_path(i,j,wd)

}

function correct_maze(wd,wall_length)
{
   var i = Math.round(N/2)
	 var j = Math.round(N/2)
	 
	 var side=0
	 var length=1
	 var dx=1
	 var dy=0
	 var k=0
	 
	 while(2>1)
	 {
	  j+=dx
      i+=dy
		
		if( (i<0) || (i>N) ) break;
		if( (j<0) || (j>N) ) break;
		
		if(vertex[i][j]==1)
		{
		  make_maze(i,j,wd,70,wall_length,0,N/5)
		}	

         k++

		if(k==length)
		{
		   switch (side) 
			 {
			        case 0: { dx=0; dy=-1; break; }
					case 1: { dx=-1; dy=0; break; }
					case 2: { dx=0; dy=1; break; }
					case 3: { dx=1; dy=0; break; }
			 
			 }
			 
			 side = (side+1)%4
			 if((side==1) || (side==3) ) length++
			 k=0
		}
	 
	 }
  
}

function generate_maze(wall_length)
{
   var width = hy/200
   var length_of_branch = Math.floor(N/5)+1
 
   ctx.beginPath()
   ctx.moveTo(indentx+length+width,indenty-width/2)
   
   ctx.lineTo(indentx-width/2,indenty-width/2)
   ctx.lineTo(indentx-width/2,indenty+length+width/2)
   ctx.lineTo(indentx+length+width/2,indenty+length+width/2)
   ctx.lineTo(indentx+length+width/2,indenty+side-width/4)

   ctx.lineWidth = width
   ctx.strokeStyle = 'black'
   ctx.stroke()   
      
   ctx.lineWidth = width/2
   
   for(var i=0;i<=N;i++)
   {
      make_maze(i,0,width/4,60,wall_length,0,length_of_branch);
      make_maze(i,N,width/4,60,wall_length,0,length_of_branch);
      make_maze(0,i,width/4,60,wall_length,0,length_of_branch);
      make_maze(N,i,width/4,60,wall_length,0,length_of_branch);
   }
   
   correct_maze(width/4,wall_length)
   correct_maze_2(width/4,wall_length)

}

function zero_buf()
{
   for(var i=0;i<=N;i++)
      for( var j=0;j<=N;j++)
	      buf[i][j]=0
}
 
function place_hero(i,j)
{
   var x,y
   
   x = indentx+side*j+side/10
   y = indenty+side*i+side/10
   
   hero.style.left = x+"px"
   hero.style.top  = y+"px"
}

function create_hero()
{
  hero = document.createElement('img')
	hero.src='hero.png'
	hero.style.display = 'none'
  hero.style.position = 'absolute'
		
  document.body.appendChild(hero)
}

function init_massives()
{
   for(i=-1;i<=N+1;i++)
     for(j=-1;j<=N+1;j++)
	  {
	    if( (i<1) || (j<1) || (i>N-1) || (j>N-1) ) vertex[i][j]=1
		  else vertex[i][j]=0
	  }
	 
   for(i=0;i<=N-1;i++)
     for(j=0;j<=N-1;j++)
	   {
		  if(i==0) cell[i][j].top = 1
		  else cell[i][j].top = 0
		
		  if(j==0) cell[i][j].left = 1
		  else cell[i][j].left = 0
		
		  if(j==N-1) cell[i][j].right  = 1
		  else cell[i][j].right = 0
		
		  if(i==N-1) cell[i][j].bottom = 1
		  else cell[i][j].bottom = 0
			
	   }
	 
	 cell[0][N-1].right=0
}


function starting()
{
   i_hero = N-1
   j_hero = 0
   
   place_hero(i_hero,j_hero)
	 
   zero_buf()
	 
   if_exit_shown = false
   if_two_touches = false
   if_we_end_level = false
   if_we_in_the_game = true
   if_we_in_the_menu = false
}

function calculate_const()
{
  wx = window.innerWidth
  hy = window.innerHeight
	
  length = 0.8*Math.min(wx,hy)
  indentx  = (wx-length)/2
  indenty  = (hy-length)/4
  
  indenty_in_menu = hy/5
  
  Lvl = 1
  if_we_in_the_menu = true
}

function show_arrows()
{
   arrow_left.style.display = ''
   arrow_right.style.display = ''
   arrow_up.style.display = ''
   arrow_down.style.display = ''	 
}

function hide_arrows()
{
   arrow_left.style.display = 'none'
   arrow_right.style.display = 'none'
   arrow_up.style.display = 'none'
   arrow_down.style.display = 'none'	 
}

function show_menu()
{
  button_start_game.style.display = ''
  button_free_play.style.display = ''
  button_survival.style.display = ''
  button_instruction.style.display = ''
}

function hide_menu()
{
  button_start_game.style.display = 'none'
  button_free_play.style.display = 'none'
  button_survival.style.display = 'none'
  button_instruction.style.display = 'none'
}

function show_free_levels()
{
  var i,j
  
  hide_menu()
  
  
  button_back_to_menu.style.top = hy-2*indenty_in_menu/3+'px'
  button_back_to_menu.style.height = indenty_in_menu/3+'px'  
  button_back_to_menu.style.display = ''
  
  for(i=0;i<3;i++)
	for(j=0;j<3;j++)
	   free_levels[i][j].style.display = ''
		 
	document.ontouchstart = function()
  {
		return false;
	}

}

function hide_free_levels()
{
  var i,j
  
  for(i=0;i<3;i++)
	for(j=0;j<3;j++)
	   free_levels[i][j].style.display = 'none'
}

function create_level(Level)
{

	var wall_length

  switch (Level)
	{
	   case  1: {N=5; wall_length=1; break}
	   case  2: {N=7; wall_length=1; break}
	   case  3: {N=10; wall_length=1; break} 
	   case  4: {N=12; wall_length=2; break}
	   case  5: {N=15; wall_length=2; break}
	}

	if( (Level>1) && (if_we_in_menu) )
	{
	   ctx.fillStyle = 'black'
		 ctx.fillText(Level,0,hy/15)
		 
	}
	
	side = length/N
			
	init_massives()
	generate_maze(wall_length)
	
	hero.style.display = ''
	hero.style.width  = side*0.8+'px'
	hero.style.height = side*0.8+'px'	
	
	show_arrows()
  button_back_to_menu.style.display  = ''	
	
	var size_of_font = indenty/3
	
	ctx.font = size_of_font+'pt Calibri'
	ctx.fillStyle = 'black'
	ctx.fillText('Level '+Level,indentx, indenty*0.7)
	
  starting()
	document.ontouchstart = function (event)
	{
	  document.ontouchend = function (event)
	  {
		if( (i_hero==0) && (j_hero==N) ) end_level()	
	  }
	}
}

function create_free_level(event)
{
   //hide_free_levels()
   
   if(event.target.style.display=='none') return false
   
   hide_free_levels()
   
   var wall_length
   
   N = event.target.size

   switch (N)
   {
	   case  10: {wall_length=1; break}
	   case  15: {wall_length=2; break}
	   case  20: {wall_length=2; break} 
	   case  25: {wall_length=3; break}
	   case  30: {wall_length=3; break}
	   case  35: {wall_length=3; break}
	   case  40: {wall_length=3; break}	
	   case  45: {wall_length=4; break}	
	   case  50: {wall_length=4; break}		   
   }
   
   side = length/N
			
   init_massives()
   generate_maze(wall_length)
	
   hero.style.display = ''
   hero.style.width  = side*0.8+'px'
   hero.style.height = side*0.8+'px'	
	
   show_arrows()
   button_back_to_menu.style.display  = ''	
	
   var size_of_font = indenty/3
	
   ctx.font = size_of_font+'pt Calibri'
   ctx.fillStyle = 'black'
   ctx.fillText('Free level (size '+N+'x'+N+')',indentx, indenty*0.7)
	
   starting()   
   document.ontouchstart = touch_screen_in_the_game
}

function init_canvas()
{
  Canvas = document.getElementById("canvas")
  ctx = Canvas.getContext("2d")
}

function init_music()
{
  music = document.getElementById( 'music' )
  music.currentTime = 0
  //music.play()
}

function create_end_of_level()
{
     var length = 3/4*Math.min(wx,hy)

     end_of_level = document.createElement('img')
	 
	 end_of_level.src = 'end_of_level.png'
	 end_of_level.style.display  = 'none'
	 end_of_level.style.position = 'absolute'
	 
	 end_of_level.style.left = (wx-length)/2+'px'
	 end_of_level.style.top  = (hy-length)/2+'px'
	 
	 end_of_level.style.width  = length+'px'
	 end_of_level.style.height = length+'px'
	 
	 document.body.appendChild(end_of_level)
}

function create_instruction()
{
   var length = 3*wx/4
	 var height = length/1.63

   instruction = document.createElement('img')
	 
	 instruction.src = 'instruction.png'
	 instruction.style.display  = 'none'
	 instruction.style.position = 'absolute'
	 
	 instruction.style.left = (wx-length)/2+'px'
	 instruction.style.top  = (hy-height)/2+'px'
	 
	 instruction.style.width  = length+'px'
	 
	 document.body.appendChild(instruction)
}

function touch_start_game(event)
{
   if(button_start_game.style.display=='none') return false
	 
   ctx.fillStyle = 'black'
   ctx.fillText(Lvl,0,hy/20)

	 
	 button_start_game.ontouchend = function(event)
	 {
	  if(event.touches.length==0)
		{	 
           hide_menu()			    		     
		       create_level(Lvl)
		}		
	 }	
}

function goto_the_menu()
{	 
  
	button_back_to_menu.style.display = 'none'
  hero.style.display = 'none'	 
  instruction.style.display = 'none'
	end_of_level.style.display = 'none'
	 
	ctx.clearRect(0,0,wx,hy)
	
	
  if_we_in_the_menu=true
	
	hide_free_levels()
	hide_arrows()
	show_menu()
	 
	document.ontouchstart = function()
	{
	    return false
	}	
	 
}

function show_instruction()
{

   hide_menu() 

   instruction.style.display = ''
   button_back_to_menu.style.display = ''
	
	document.ontouchstart = function()
	{
	  return false
	}	
}

function create_button_start_game()
{
   var length = 2/5*wx

   button_start_game = document.createElement('img')
	 
	 button_start_game.src = 'button_start_game.png'
	 button_start_game.style.display  = ''
	 button_start_game.style.position = 'absolute'
	 
	 button_start_game.style.left = 1.5*wx/5+'px'
	 button_start_game.style.width  = length+'px'
	 button_start_game.style.top = indenty_in_menu+'px'
	 
	 document.body.appendChild(button_start_game)

	 button_start_game.ontouchstart = touch_start_game
}

function create_button_free_play()
{
   var length = 2/5*wx
   var height = length/3.28
   var h = (hy-2*indenty_in_menu-4*height)/3

     button_free_play = document.createElement('img')
	 
	 button_free_play.src = 'button_free_play_close.png'
	 button_free_play.style.display  = ''
	 button_free_play.style.position = 'absolute'
	 
	 button_free_play.state = 0
	 
	 button_free_play.style.left = 1.5*wx/5+'px'
	 button_free_play.style.width  = length+'px'	 
	 button_free_play.style.top = indenty_in_menu+height+h+'px'
	 
	 document.body.appendChild(button_free_play)
	 
	 button_free_play.ontouchstart = function ()
	 {
	   if(button_free_play.state==0) return false
	   
	   show_free_levels()
	 }
	 
}

function create_button_survival()
{
   var length = 2/5*wx
   var height = length/3.28
   var h = (hy-2*indenty_in_menu-4*height)/3

   button_survival = document.createElement('img')
	 
	 button_survival.src = 'button_survival_close.png'
	 button_survival.style.display  = ''
	 button_survival.style.position = 'absolute'
	 
	 button_survival.style.left = 1.5*wx/5+'px'
	 button_survival.style.width  = length+'px'
	 button_survival.style.top = indenty_in_menu+2*(height+h)+'px'
	 
	 document.body.appendChild(button_survival)
	 
}

function create_button_instruction()
{
   var length = 2/5*wx
   var height = length/3.28
   var h = (hy-2*indenty_in_menu-4*height)/3

   button_instruction = document.createElement('img')
	 
	 button_instruction.src = 'button_instruction.png'
	 button_instruction.style.display  = ''
	 button_instruction.style.position = 'absolute'
	 
	 button_instruction.style.left = 1.5*wx/5+'px'
	 button_instruction.style.width  = length+'px'
	 button_instruction.style.top = indenty_in_menu+3*(height+h)+'px'
	 
	 document.body.appendChild(button_instruction)
	 
	 button_instruction.ontouchstart = show_instruction
}

function create_button_back_to_menu()
{
   var h = (hy-length-indenty)/3

     button_back_to_menu = document.createElement('img')
	 
	 button_back_to_menu.src = 'button_back_to_menu.png'
	 button_back_to_menu.style.display  = 'none'
	 button_back_to_menu.style.position = 'absolute'
	 
	 button_back_to_menu.style.left = wx/20+'px'
	 button_back_to_menu.style.height = h+'px'
	 button_back_to_menu.style.top = indenty+length+h+'px'
	 
	 document.body.appendChild(button_back_to_menu)
	 
	 button_back_to_menu.ontouchstart = function()
	 { 
	    if(button_back_to_menu.style.display=='none') return false
   	    goto_the_menu()
	 }	

}

function create_arrows()
{
     var indent_bot = (hy-indenty-length)
     var size = indent_bot*0.4
	 
     arrow_left = document.createElement('img')
	 
	 arrow_left.src = 'arrow_left.png'
	 arrow_left.style.display  = 'none'
	 arrow_left.style.position = 'absolute'
	 
	 arrow_left.style.left = wx/2-size/2-size+'px'
	 arrow_left.style.height  = size+'px'	 
	 arrow_left.style.top = hy-indent_bot*0.7+'px'
	 
	 document.body.appendChild(arrow_left)

	 
     arrow_right = document.createElement('img')
	 
	 arrow_right.src = 'arrow_right.png'
	 arrow_right.style.display  = 'none'
	 arrow_right.style.position = 'absolute'

	 arrow_right.style.height  = size+'px'	 	 
	 arrow_right.style.left = wx/2+size/2+'px'
	 arrow_right.style.top = hy-indent_bot*0.7+'px'
	 
	 document.body.appendChild(arrow_right)
	 
	 
     arrow_down = document.createElement('img')
	 
	 arrow_down.src = 'arrow_down.png'
	 arrow_down.style.display  = 'none'
	 arrow_down.style.position = 'absolute'
	 
	 arrow_down.style.left = wx/2-size/2+'px'
	 arrow_down.style.height  = size+'px'	 
	 arrow_down.style.top = hy-indent_bot/10-size+'px'
	 
	 document.body.appendChild(arrow_down)
	 

     arrow_up = document.createElement('img')
	 
	 arrow_up.src = 'arrow_up.png'
	 arrow_up.style.display  = 'none'
	 arrow_up.style.position = 'absolute'
	 
	 arrow_up.style.left = wx/2-size/2+'px'
	 arrow_up.style.height  = size+'px'	 
	 arrow_up.style.top = hy-indent_bot*0.9+'px'
	 
	 document.body.appendChild(arrow_up)	 
	 
	 arrow_left.direction = 0
	 arrow_up.direction = 1
	 arrow_right.direction = 2
	 arrow_down.direction = 3	 
	 
	 arrow_left.ontouchstart = arrow_right.ontouchstart = change_place_of_hero
	 arrow_up.ontouchstart = arrow_down.ontouchstart = change_place_of_hero	 
}

function create_free_levels()
{
   var i,j
   
   var size = indenty_in_menu/2
   var dist = (hy-2*indenty_in_menu-3*size)/2
   var indent_x = (wx-3*size-2*dist)/2
   
   for(i=0;i<3;i++)
      free_levels[i] = []
	  
   for(i=0;i<3;i++)
	 for(j=0;j<3;j++)
	 {
		 free_levels[i][j] = document.createElement('img')
		 
		 free_levels[i][j].src = 'free_level_'+(i*3+j)+'.png'
		 free_levels[i][j].style.display  = 'none'
		 free_levels[i][j].style.position = 'absolute'
		 
		 free_levels[i][j].size = 10+5*(i*3+j)
		 
		 free_levels[i][j].style.left = indent_x+j*(size+dist)+'px'
		 free_levels[i][j].style.height = size+'px'	 
		 free_levels[i][j].style.top = indenty_in_menu+i*(size+dist)+'px'
		 
		 document.body.appendChild(free_levels[i][j])	 
   
     free_levels[i][j].ontouchstart = create_free_level   
	 }

}

function init_answer()
{
  var i
	
	for(i=0;i<2502;i++)
	{
	  answer[i] = new Object();
		answer[i].x=0
		answer[i].y=0
	}	

}

function create_massives()
{
   var i,j
   
   for(i=-1;i<=51;i++)
   {
     vertex[i] = []
     if( (i>=0) && (i<=50) )   cell[i] = []
     if( (i>=0) && (i<=51) )   buf[i] = []
   }	 
	 
	 for(i=0;i<51;i++)
	    for(j=0;j<51;j++)
			  cell[i][j] = new Object()

}

function Start()
{
	calculate_const()
	init_canvas()
	create_massives()
	create_hero()
	init_answer()
	//init_music()
	create_end_of_level()
	create_button_start_game()
	create_button_free_play()
	create_button_survival()
	create_button_instruction()
	create_arrows()
	create_button_back_to_menu()
	create_instruction()
	create_free_levels()
	//create_level(Lvl)
}

window.addEventListener( "load", Start );

