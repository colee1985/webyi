###
全局LOADING层
e.g
GlobalLoading.show()
GlobalLoading.hide()
###

ag.factory 'GlobalLoading', ->
	container = 'body'
	el = $('<div></div>').addClass('Co-loading').css({
		opacity: 0.85
		zIndex:99999
		position:'fixed'
		# background:'#000'
		padding:'20px 30px'
		color:'#fff'
		top:0
		right:0
		bottom:0
		left:0
		textAlign:'center'
	}).text('……加载中……').appendTo(container).hide()
	linking_number = 0
	return {
		show: ()=>
			el.show()
			linking_number++
		hide: ()=>
			linking_number--
			# console.log linking_number,'by GlobalLoading'
			if linking_number<1
				el.hide()
	}