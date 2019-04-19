// 引入第三方模块mysql express
const express=require("express");
const mysql=require("mysql");
// 1.1引入模块cors--跨域
const cors=require("cors");
// 2.创建连接池
var pool=mysql.createPool({
    host:'127.0.0.1',
    user:"root",
    password:"",
    database:"hmz",
})
// 3创建express对象
var server=express();
// 3.1配置允许访问列
// 3.11引用session
const session=require("express-session");
// 3.11配置session信息
server.use(session({
    secret:"128位随机字符串",//128位随机字符串  安全字符串
    resave:false,//每次请求更新session值
    saveUninitialized:true,//初始化保存数据
    cookie:{
        maxAge:1000*60*60*24      //cookie辅助session工作
    }
}))
// 3.2配置静态资源目录 public
server.use(express.static("public"));
// 3.3配置第三方中间件---post
const bodyParser=require("body-parser");
// 3.4配置json是否自动转换
server.use(bodyParser.urlencoded(
    {extended:false}
))
// 4为express对象绑定监听端口
server.listen(5050);

//1.检索用户 
server.get('/retrieval',(req,res)=>{
	var phone=req.query.phone1;
    var sql='select uid from hmz_user where phone=?';
	pool.query(sql,[phone],(err,result)=>{
		if(err) throw err;
		if(result.length>0){
            res.send({code:1,msg:"该手机号已被注册"})
        }else{
            res.send({code:-1,msg:"手机号未被注册"})
        }
	});
});


// 功能1：注册
server.post("/register",(req,res)=>{
    var phone=req.body.phone;
    var upwd=req.body.upwd;
    var sql='select uid from hmz_user where phone=?';
    pool.query(sql,[phone],(err,result)=>{
        if(err) throw err;
        if(result.length<0){ 
            var sql="insert into hmz_user values(null,?,?,null,null,null)";
            pool.query(sql,[phone,upwd],(err,result)=>{
                if(err) throw err;
                if(result.affectedRows>0){
                    res.send('1');
                }
            })
        }else{
             res.send({code:1,msg:"该手机号已被注册"})
        }
    })
})

// 功能2：登录
server.post("/login",(req,res)=>{
    var phone=req.body.phone;
    var upwd=req.body.upwd;
    var sql="select uid from hmz_user where phone=? and upwd=?";
    pool.query(sql,[phone,upwd],(err,result)=>{
        if(err) throw err;
        if(result.length>0){
            // 用户登录成功
            // 获取用户id
            var uid=result[0].uid;
            // 保存session对象中
            req.session.uid=uid;
            res.send('1');
        }else{
            res.send('-1');
        }
    })
})

// 功能3：首页轮播图
server.get("/imglist",(req,res)=>{
    var rows=[
        {id:1,img_url:"img/banner/banner-1.jpg"},
        {id:2,img_url:"img/banner/banner-2.jpg"},
        {id:3,img_url:"img/banner/banner-3.jpg"},
        {id:4,img_url:"img/banner/banner-4.jpg"},
        {id:5,img_url:"img/banner/banner-5.jpg"},
        {id:6,img_url:"img/banner/banner-6.jpg"},
    ];
    res.send({code:1,data:rows});
})

// 功能四：首页内容切换
server.get('/every',(req,res)=>{
    // 1.参数
    var every=req.query.every;
    var sql="select * from hmz_index where every like ?";
    pool.query(sql,["%"+every+"%"],(err,result)=>{
        if(err) throw err;
        res.send(result);

    })

})

// 功能四：首页内容切换
server.get('/video',(req,res)=>{
    // 1.参数
    var video=req.query.video;
    var sql="select * from hmz_index where video like ?";
    pool.query(sql,["%"+video+"%"],(err,result)=>{
        if(err) throw err;
        res.send(result);

    })

})
// 功能四：首页九宫格
server.get("/grid",(req,res)=>{
    var sql="select * from hmz_grid";
	pool.query(sql,(err,result)=>{
		if(err) throw err;
		res.send(result);

	})
})
// 功能五：首页商品
server.get("/indexList",(req,res)=>{
    var sql="select * from hmz_index";
	pool.query(sql,(err,result)=>{
        if(err) throw err;
		res.send(result);
        
	})
})
// 功能七：九宫格详情页标题的内容
server.get('/productList',(req,res)=>{
    // 1.参数
    var gid=req.query.gid;
    var sql="select * from hmz_productList where grid_id=?";
    pool.query(sql,[gid],(err,result)=>{
        if(err) throw err;
        res.send(result);

    })

})

// 功能八：九宫格详情页标题的内容切换
server.get('/sousuo',(req,res)=>{
    // 1.参数
    var gid=req.query.gid;
    var hname=req.query.hname;
    var sql="select * from hmz_productList where grid_id=? and hname like ?";
    pool.query(sql,[gid,"%"+hname+"%"],(err,result)=>{
        if(err) throw err;
        res.send(result);

    })

})
// 功能八：九宫格详情页标题的内容切换
server.get('/zuixin',(req,res)=>{
    // 1.参数
    var gid=req.query.gid;
    var zname=req.query.zname;
    var sql="select * from hmz_productList where grid_id=? and zname like ?";
    pool.query(sql,[gid,"%"+zname+"%"],(err,result)=>{
        if(err) throw err;
        res.send(result);

    })

})

// 推荐列表
server.get('/recommend',(req,res)=>{
    var sql="select * from hmz_productList";
    pool.query(sql,(err,result)=>{
        if(err) throw err;
        res.send(result);
    })

})
// 搜索--最新
server.get('/quan',(req,res)=>{
    // 1.参数
    var zname=req.query.zname;
    var sql="select * from hmz_productList where zname like ?";
    pool.query(sql,["%"+zname+"%"],(err,result)=>{
        if(err) throw err;
        res.send(result);
    })

})
//分类搜索
server.get('/biaoTi',(req,res)=>{
    // 1.参数
    var ti=req.query.ti;
    var sql="select * from hmz_productList where biaoti like ?";
    pool.query(sql,["%"+ti+"%"],(err,result)=>{
        if(err) throw err;
        res.send(result);
    })

})
// 搜索框搜索
server.get("/sousuo",(req,res)=>{
	var title=req.query.title;
	var sql="select * from hmz_flower where title like ?";
	console.log(sql)
	pool.query(sql,["%"+title+"%"],(err,result)=>{
		if(err) throw err;
		res.send(result);
	})
})
// 获取搜索框搜索的名字去数据库拿相应的图片、标题等
server.get("/sou",(req,res)=>{
	var title=req.query.title;
	var sql="select * from hmz_productList where title like ?";
	pool.query(sql,["%"+title+"%"],(err,result)=>{
		if(err) throw err;
		res.send(result);
	})
})

//详情页内容
server.get("/details",(req,res)=>{
    var lid=req.query.lid;
	var sql="select * from hmz_flower where lid=?";
    pool.query(sql,[lid],(err,result)=>{
        if(err) throw err;
        res.send({code:1,data:result});
    })
})

//发送评论
server.post("/addcomment",(req,res)=>{
    if(!req.session.uid){
        res.send({code:-1,data:[],msg:"请登录"});
        return;
    }
    var uid=req.session.uid;
    var lid=req.body.lid;
    var content=req.body.content;
    var sql="select * from hmz_comment where user_id=? and flower_id=?"
    pool.query(sql,[lid,uid],(err,result)=>{
        if(err) throw err
        var sql='INSERT INTO hmz_comment(id,flower_id,user_id,content,ctime,count) VALUES(null,?,?,?,now(),1)';
        pool.query(sql,[lid,uid,content],(err,result)=>{
            if(err)throw err;
            res.send({code:1,msg:"添加成功"})   
        })
    })
})

//评论数量+1
server.get("/addCount",(req,res)=>{
    var lid=req.query.lid;
    var sql="select * from hmz_comment where flower_id=?"
    pool.query(sql,[lid],(err,result)=>{
        if(err) throw err
        
        if(result.length!=0){
            var sql=`update hmz_comment set count=count+1 where flower_id=${lid}`;
        }else{
            var sql="select * from hmz_comment"
        }
        pool.query(sql,(err,result)=>{
            if(err)throw err;
            res.send({code:1,msg:"添加成功"})    
        })
    })
})


//获取评论数量
server.get("/getCount",(req,res)=>{
    var lid=req.query.lid;
	var sql="select count from hmz_comment where flower_id=?";
    pool.query(sql,[lid],(err,result)=>{
        if(err) throw err;
        res.send({code:1,data:result});
    })
})
//评论列表
server.get("/getComment",(req,res)=>{
    //1:参数 
    var lid = req.query.lid;
    var pno = req.query.pno;
    var pageSize = req.query.pageSize;
    if(!pno){
      pno = 1;
    }
    if(!pageSize){
      pageSize = 5;
    }
    var sql = " SELECT id,flower_id,content,ctime FROM hmz_comment WHERE flower_id = ? LIMIT ?,?";
    var offset = (pno-1)*pageSize;
    pageSize = parseInt(pageSize);
    pool.query(sql,[lid,offset,pageSize],(err,result)=>{
      if(err)throw err;
      res.send({code:1,data:result});
    })
  })
  //收藏
  server.get('/cellection',(req,res)=>{
    //   检测用户是否登录
    if(!req.session.uid){
        res.send({code:-1,data:[],msg:"请登录"});
        return;
    }  
    // 1.参数
    var uid=req.session.uid;
    var lid=req.query.lid;
    var title=req.query.title;
    var pic=req.query.pic;
    var watch=req.query.watch;
    var isVideo=req.query.isVideo;
    var classify=req.query.classify;
    var sql="select * from hmz_collect where user_id=? and flower_id=?";
    pool.query(sql,[uid,lid],(err,result)=>{
        if(err) throw err
        if(result.length==0){
            var sql=`INSERT INTO hmz_collect(id,flower_id,user_id,title,pic,watch,isVideo,classify) VALUES(null,${lid},${uid},'${title}','${pic}',${watch},${isVideo},'${classify}')`;
        }else{
            var sql="delete from hmz_collect where user_id=? and flower_id=?";
        }
        pool.query(sql,[uid,lid],(err,result)=>{
            if(err)throw err;
            if(result.affectedRows>0){
                res.send({code:1,msg:"添加成功"})  
            }
        })
    })
})
 
//收藏页获取收藏
server.get("/getCollect",(req,res)=>{
    var uid=req.session.uid;
	var sql="select * from hmz_collect where user_id=?";
    pool.query(sql,[uid],(err,result)=>{
        if(err) throw err;
        res.send({code:1,data:result});
    })
})

//详情表上获取收藏
server.get("/getCollectLid",(req,res)=>{
    var lid=req.query.lid
    var uid=req.session.uid;
	var sql="select * from hmz_collect where user_id=? and flower_id=?";
    pool.query(sql,[uid,lid],(err,result)=>{
        if(err) throw err;
        res.send({code:1,data:result});
    })
})

// 观看量
server.get("/Watch",(req,res)=>{
    var uid=req.session.uid;
    var lid=req.query.lid;
    var sql=`update hmz_flower set watch=watch+1 where lid=${lid}`;
    pool.query(sql,[lid],(err,result)=>{
            if (err) throw err;
            res.send({code:1,msg:"观看成功"});
    })   
})

// 喜欢量
server.get("/likes",(req,res)=>{
    if(!req.session.uid){
        res.send({code:-1,data:[],msg:"请登录"});
        return;
    }
    var uid=req.session.uid;
    var lid=req.query.lid;
    var sql="select * from hmz_like where user_id=? and flower_id=?";
    pool.query(sql,[uid,lid],(err,result)=>{
        if (err) throw err;
        if(result.length==0){
            var sql=`INSERT INTO hmz_like(id,flower_id,user_id,count) VALUES(null,${lid},${uid},1)`;
        }else{
            var sql=`update hmz_like set count=count+1 where flower_id=${lid}`
        }
        pool.query(sql,[uid,lid],(err,result)=>{
            if (err) throw err;
            res.send({code:1,data:result});
        })
    })   
})
// 获取喜欢量
server.get("/linkCount",(req,res)=>{
    var lid=req.query.lid;
    var sql="select count from hmz_like where flower_id=?";
    pool.query(sql,[lid],(err,result)=>{
            if (err) throw err;
            res.send({code:1,data:result});
    })   
})
// 获取个人喜欢量
server.get("/Own",(req,res)=>{
    if(!req.session.uid){
        res.send({code:-1,data:[],msg:"请登录"});
        return;
    }
    var lid=req.query.lid;
    var uid=req.session.uid;
    var sql="select * from hmz_like where user_id=? and flower_id=?";
    pool.query(sql,[uid,lid],(err,result)=>{
            if (err) throw err;
            res.send({code:1,data:result});
    })   
})
 
// 点赞
server.get("/zans",(req,res)=>{
    if(!req.session.uid){
        res.send({code:-1,data:[],msg:"请登录"});
        return;
    }
    var uid=req.session.uid;
    var lid=req.query.lid;
    var cid=req.query.cid;
    var sql="select * from hmz_zan where comment_id=? and user_id=? and flower_id=?";
    pool.query(sql,[cid,uid,lid],(err,result)=>{
        if(err) throw err
        if(result.length==0){
            var sql=`INSERT INTO hmz_zan(id,comment_id,flower_id,user_id,count) VALUES(null,${cid},${lid},${uid},1)`;
        }else{
            var sql="delete from hmz_zan where comment_id=? and user_id=? and flower_id=?";
        }
        pool.query(sql,[cid,uid,lid],(err,result)=>{
            if(err)throw err;
            if(result.affectedRows>0){
                res.send({code:1,msg:"添加成功"})  
            }
        })
    })
       
      
})
//详情表上获取收藏
server.get("/zanCount",(req,res)=>{
    var lid=req.query.lid
    var uid=req.session.uid;
	var sql="select * from hmz_zan where user_id=? and flower_id=?";
    pool.query(sql,[uid,lid],(err,result)=>{
        if(err) throw err;
        res.send({code:1,data:result});
    })
})

// 个人中心 九宫格
server.get("/person",(req,res)=>{
    var rows=[
        {id:1,title:"消息",img_url:"img/grid/menu1.png"},
        {id:2,title:"收藏",img_url:"img/grid/menu2.png"},
        {id:3,title:"设置",img_url:"img/grid/menu3.png"},
        {id:4,title:"位置",img_url:"img/grid/menu4.png"},
        {id:5,title:"搜索",img_url:"img/grid/menu5.png"},
        {id:6,title:"电话",img_url:"img/grid/menu6.png"},
    ];
    res.send(rows);
});

//退出登录
server.get("/Logout",(req,res)=>{
    var uid=req.session.uid="";
	var sql="select * from hmz_user where uid=?";
    pool.query(sql,[uid],(err,result)=>{
        if(err) throw err;
        res.send({code:1,msg:"退出成功"});
    })
})
// 修改账号和密码，判断用户是否登录
server.get("/judge",(req,res)=>{
    var uid=req.session.uid;
    if(!req.session.uid){
        res.send({code:-1,data:[],msg:"请登录"});
        return;
    }
    var sql='select uid from hmz_user';
    pool.query(sql,(err,result)=>{
        if(err) throw err;
        res.send({code:1,data:result})
    })
})
// 修改账号
server.post('/text',(req,res)=>{
	var uid=req.session.uid;
	var phone=req.body.phone;//原账号
	var phone1=req.body.phone1;//修改的账号
	if(phone1.length<6 || phone1.length>20){
		res.send({code:402,msg:'手机号错误'});
		return;
    }
	//执行SQL语句
	var sql='select phone from hmz_user where uid=?';
	pool.query(sql,[uid],(err,result)=>{
		if(err) throw err;
		//根据用户id查出来原账号与你输入的原账号比较，如果相同就修改原来的账号，如果不相同，返回一个数据，表示与原账号不同
		if(result[0].phone == phone){
            var sql=`update hmz_user set phone=${phone1} where uid=${uid}`;
             pool.query(sql,(err,result)=>{
                if(err) throw err;
                res.send({code:1,data:result})
            })
        }else{
            res.send({code:-1,msg:"原手机号不正确"})
        }
       
	})
});
// 修改密码
server.post('/pwd',(req,res)=>{
	var uid=req.session.uid;
	var upwd=req.body.upwd;//原密码
	var upwd1=req.body.upwd1;//修改的密码
	if(upwd1.length<6 || upwd1.length>20){
		res.send({code:402,msg:'密码错误'});
		return;
    }
	//执行SQL语句
	var sql='select upwd from hmz_user where uid=?';
	pool.query(sql,[uid],(err,result)=>{
		if(err) throw err;
		//根据用户id查出来原密码与你输入的原密码比较，如果相同就修改原来的密码，如果不相同，返回一个数据，表示与原密码不同
		if(result[0].upwd == upwd){
            var sql=`update hmz_user set upwd=${upwd1} where uid=${uid}`;
             pool.query(sql,(err,result)=>{
                if(err) throw err;
                res.send({code:1,data:result})
            })
        }else{
            res.send({code:-1,msg:"原密码不正确"})
        }
	})
});

// 判断用户是否登录,登录后把账号显示到个人中心页
server.get("/display",(req,res)=>{
    var uid=req.session.uid;
    if(!req.session.uid){
        res.send({code:-1,data:[],msg:"请登录"});
        return;
    }
    var sql='select phone from hmz_user where uid=?';
    pool.query(sql,[uid],(err,result)=>{
        if(err) throw err;
        res.send({code:1,data:result})
    })
})