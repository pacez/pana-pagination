# pana-pagination
京友邦分页控件，依赖Requirejs,Site,Mustache,jQuery 1.8+  <br/>
遵循系统现有依赖加载/通信接口/模板库规则,代码精简易扩展!

## usage:
```javascript
//初始化：
var page=new pagination({
  tpl: string, //指定视图模板url
  url: string, //指定接口url
  dataViewId: string, //数据填充容器的id
  id: string, //分页id,
  totalPages: int, //总页数
  isRenderData: boole, //是否直接渲染接口返回的data
  simpleModel: boole //是否仅显示prev & next按钮
});

//选中页码:
page.rendar(pageNum,totalPages) //totalPages缺省则读取init中设置的值
