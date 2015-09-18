###
弱提示
e.g
toast.show('这里是话题')
toast.show('只显示最新的')
###

ag.factory 'toast', ->
	container = 'body'
	return {
		show: (text)->
			el = $('<div></div>').addClass('Co-toast').css({
				opacity: 0.85
				zIndex:99999
				position:'fixed'
				background:'#000'
				padding:'20px 30px'
				color:'#fff'
				borderRadius:6
			}).text(text).appendTo(container)
			el.css({
				top: ($(window).height()-el.outerHeight())*0.5
				left:($(window).width()-el.outerWidth())*0.5
			}).delay(3000).fadeOut 400
	}