/*
* Author: cdzhongpeizhi@jd.com
* desc: pagination component for you.jd.com
* update date: 2015-08-01
* dependencies: jquery 1.8+, requirejs, mustache
*/

(function(window){
	function pagination(options){
		this.init(options);
	}
	pageObj= {
		init: function(options){
			var that=this;
			options = $.extend(true,{
				id: 'pagearea',
				dataViewId: 'dataView',
				pageSize: 5,
				currentPage: 1,
				simpleModel:false,
				prevClass: "prev-page",
				nextClass: "next-page",
				pageClass: "page-num",
				pageNumClass: 'page-current',
				currentClass: 'current'
			},options);
			that.options=options;
			that.loadTpl();
			that.render(options.currentPage,options.totalPages);
			that.event();
		},
		loadTpl: function(){
			var that=this,
					options=that.options;
			if(!options.isRenderData) {
				require(['text!'+options.tpl],function(tpl){
					that.tpl=tpl;
				});
			}
		},
		render: function(currentPage,totalPages){
			var options=this.options,
					pageSize=options.pageSize,
					deviator=Math.floor(pageSize/2),
					currentPage=parseInt(currentPage,10),
					totalPages= totalPages ? totalPages : options.totalPages,
					htmlArr=[];

			if(currentPage==1){
				var startIndex=1,
						disabledClass=' disabled';
			}else{
				var startIndex=currentPage-deviator<=0 ? 1 : currentPage-deviator;
						disabledClass='';
			}

			var endIndex=(startIndex+pageSize > totalPages+1 ? totalPages+1 : startIndex+pageSize);

			if(endIndex-startIndex<=pageSize){
				startIndex=(endIndex-pageSize<1 ? 1 : endIndex-pageSize);
			}

			if(currentPage==endIndex-1){
				var	endDisabledClass=' disabled';
			}else{
				var	endDisabledClass='';
			}

			function isShowCtrBtn(){
				if(options.simpleModel && totalPages>1){
					return true;
				}
				if(totalPages>pageSize){
					return true;
				}
				return false;
			}

			if(isShowCtrBtn()) htmlArr.push('<a class="'+options.prevClass+disabledClass+'" href="javascript:void(0)">Prev</a>');
				if(!options.simpleModel){
					for(var i=startIndex; i<endIndex; i++){
						htmlArr.push('<a data-page="'+i+'" class="'+options.pageClass+(currentPage==i ? ' '+options.currentClass: '')+'" href="javascript:void(0)">'+i+'</a>');
					}
				}
			if(isShowCtrBtn()) htmlArr.push('<a class="'+options.nextClass+endDisabledClass+'" href="javascript:void(0)">Next</a>');

			$("#"+options.id).html(htmlArr.join(''));
		},
		event: function(){
			var that=this,
					options=that.options;

			var callbacks={
				success: function(data){
					//parse data
					if(typeof options.parse==="function"){
						data=options.parse(data);
					}
					//update view
					that.updateView(data,options.isRenderData);
				},
				error: function(data){
					that.showError(data.errorMsg);
				}
			};
			$(document).on('click.pagination','#'+options.id,function(e){
				var $elem=$(e.target);

				//disable
				if($elem.hasClass(options.currentClass) || $elem.hasClass('disabled')){
					return;
				}
				//click page num
				if($elem.hasClass(options.pageClass)){
					that.currentElem=$elem;
					that.updatePagebarView($elem);
					//Site.api.pagination(that.getUrl($elem,options.url),that.getParam($elem),callbacks);
					return;
				}
				//prev page
				if($elem.hasClass(options.prevClass)){
					that.currentElem=$elem;
					that.updatePagebarView($elem,-1);
					//Site.api.pagination(that.getUrl($elem,options.url),that.getParam($elem),callbacks);
					return
				}
				//next page
				if($elem.hasClass(options.nextClass)){
					that.currentElem=$elem;
					that.updatePagebarView($elem,1);
					//Site.api.pagination(that.getUrl($elem,options.url),that.getParam($elem),callbacks);
					return
				}
			});
		},
		getUrl: function($elem,defaultUrl){
			var apiAcion=$elem.closest("form").attr("action"),
					url=apiAcion ? apiAcion : defaultUrl;
			return url;
		},
		updatePagebarView: function($elem,deviator){
			var that=this
					options=that.options;

			switch(deviator){
				case -1:
					var pageNum=parseInt(that.getPageNum()-1);
					break;
				case 1:
					var pageNum=parseInt(that.getPageNum()+1);
					break;
				default:
					var pageNum=$elem.attr("data-page");
					break;
			}

			that.setPageNum(pageNum);
			that.render(pageNum);
			that.showLoading()
		},
		setPageNum: function(value){
			this.getPageContainer().find("."+this.options.pageNumClass).val(value);
		},
		showLoading: function(){
			var that=this,html='';
			html+='<div class="comment_network_tip loading-container">';
	      html+='<i class="loading-l"></i>';
	      html+='<p>加载中，请稍等!</p>';
	    html+='</div>';
	    that.getContainer().html(html);
		},
		showError: function(message){
			var that=this,html=message;
	    that.getContainer().html(html);
		},
		updateView: function(data,isRenderData){
			var that=this;
			if(isRenderData){
				that.getContainer().html(data);
				return;
			}
			that.getContainer().html(Mustache.render(that.tpl,data));
		},
		getPageContainer: function(){
			return this.currentElem.closest('#'+this.options.id).parent('form');
		},
		getPageNum: function(){
			var options=this.options;
			return parseInt(this.getPageContainer().find('.'+options.pageNumClass).val());
		},
		getContainer: function(){
			return $('#'+this.options.dataViewId);
		},
		getParam: function($elem) {
			return $elem.closest("form").serializeArray();
		}
	}
	$.extend(pagination.prototype,pageObj);

	// Expose pagination to the global object
	window.pagination=pagination;
})(window)
