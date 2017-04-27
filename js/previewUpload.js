;(function($){  
    $.fn.previewUpload=function(options){  
        /**  
        *默认选项配置  
        *  
        */  
        var defaults={  
            //预览框的样色设置  
            'preview':{  
                'border':'1px dashed',  
                'width':200,//必须int   
                'height':250,//必须int   
  
            },  
            //上传操作框样式,默认为空，不做设置  
            'uploadImage':{},  
            //选择图片的按钮样式  
            'btnCss':{  
                'display':'inline-block',  
                'line-height':'28px',  
                'font-size':'14px',  
                'text-align':'center',    
                'border':'1px solid #d0d0d5',  
                'border-radius':'4px',  
                'padding':'0 15px',  
                'min-width':'40px',  
                'background-color':'#fff',  
                'background-repeat':'no-repeat',  
                'background-position':'center',  
                '-webkit-transition':'border-color .15s, background-color .15s',  
                'transition':' border-color .15s, background-color .15s',  
                'outline':'0 none',  
                'cursor':'pointer',  
                'overflow':'visible',  
                'border':'1px solid #00a5e0',  
                'background-color':'#00a5e0',  
                'color':'#fff',  
                'float':'left',  
            },  
            //input file的样式  
            'inputCss':{  
                'position':'absolute',  
                'clip':'rect(0 0 0 0)',  
            },  
            //弹出框选择文件的类型  
            'imageType':null,  
            //设置图片的大小,int  
            'imgSize':100,  
            // 允许上传的图片格式  
            'typeAllow':'jpeg,jpg,png,gif',  
            // 定义选择文件时，弹出框文件显示类型，默认是所有图片  
            'acceptType':'image/*',  
            //读取base64编码的图片数据  
            'imgblod':null,  
            // ajax异步提交的数据的url  
            'url':null,  
            // 从php返回html元素的最外层id  
            /**  
            *eg:<span id="resinfo"><font color=green>上传成功</font></span>  
            */  
            'infoid':'resinfo',  
            //设置返回信息在页面显示的实际时间  
            'statTime':2000  
  
        }  
  
        /**  
        *继承覆盖默认配置  
        *  
        */  
        var config=$.extend(defaults,options);  
            config.sizeWarming='图片太大,请选择小于'+config.imgSize+'kb的图片';  
            config.typeWarming='您上传的图片格式不正确，请重新选择!';  
            config.browerWarming='浏览器版本太低';  
        /**  
        *实例化对象this  
        *将this赋值全局的变量  
        */  
        var previewUploadDiv=$(this);  
  
        /**  
        *动态创建html元素  
        *  
        */  
        var previewImage,uploadImage,imgTips;  
  
        previewImage='<div class="previewImage" id="localImag"><img src="" id="preview"></div>';  
  
        uploadImage='<div class="uploadImage" style="margin-top:5px;">\  
                        <label class="btn-select-img" for="img" >选择图片</label>\  
                        <form id="imgform" method="post" action='+config.url+'>\  
                            <input type="file" id="img" name="myimg">\  
                        </form>\  
                        <button class="btn btn-sm btn-info btn-upload-img" style="margin-left:20px;">上传</button>\  
                        <span class="imgsizespan"></span>\  
                    </div>';  
        imgTips='<div class="imgTips"style="float:left">小于'+config.imgSize+'kb的'+config.typeAllow+'</div>';  
  
        /**  
        *添加append  
        */  
        previewUploadDiv.append(previewImage+uploadImage+imgTips);  
  
  
        /**  
        *设置样式  
        *  
        */  
        //预览框样式  
        previewUploadDiv.find('div.previewImage').css(config.preview);  
  
        //上传操作按钮框上传图片按钮样式的样式  
        previewUploadDiv.find('div.uploadImage').css(config.uploadImage);  
  
        /**上传图片按钮样式  
        *鼠标移动样式  
        *  
        */  
        previewUploadDiv.find('div.uploadImage label.btn-select-img').css(config.btnCss).mouseover(function(){  
            $(this).css({  
                'background-color':'#00b4f5',  
                'border-color': '#00b4f5',  
                'color':'#fff'  
            });  
        }).mouseout(function(){  
            $(this).css(config.btnCss);  
        });  
  
  
        /**input file的框的样式，主要是将该框隐藏透明掉  
        *同时指定浏览器接受的文件类型，即选择文件弹出框的符合的文件  
        *  
        */  
        previewUploadDiv.find('input#img').css(config.inputCss).attr('accept',config.acceptType);  
  
        /**  
        *图片预览函数  
        *  
        */  
        function setImagePreview(){  
            //获取图片对象  
            var imgObj=document.getElementById("img");  
            // 获取预览框对象  
            var imgObjPreview=document.getElementById("preview");  
            //判断获取的对象是否存在，chrom和firefox  
            if(imgObj.files && imgObj.files[0]){  
                // 检查大小和格式  
                var valid=checkSize(imgObj);  
                if(valid){  
                    //火狐下，直接设img属性  
                    imgObjPreview.style.display = 'block';  
                    //火狐下,width，height要有单位'px'  
                    imgObjPreview.style.width = (config.preview.width-2)+'px';  
                    imgObjPreview.style.height = (config.preview.height-2)+'px';  
                    // imgObjPreview.src = docObj.files[0].getAsDataURL(imgObj.files[0]);  
                    //判断浏览器的内核类别  
                    var URL = window.URL || window.webkitURL;   
                    var objURL=URL.createObjectURL(imgObj.files[0]);  
  
                    //html5中的FileReader,将读取图片以base64的编码数据  
                    var reader = new FileReader();  
                    //DATA URL 协议读取base64编码数据  
                    // 格式：data:image/gif;base64，......  
                    reader.readAsDataURL(imgObj.files[0]);  
  
                    //读取数据完成，触发一次事件函数  
                    if(imgObjPreview.src = objURL){  
                        /**每次调用createObjectURL的时候,一个新的URL对象就被创建了.  
                        *即使你已经为同一个文件创建过一个URL.   
                        *如果你不再需要这个对象,要释放它,需要使用URL.revokeObjectURL()方法.  
                        *当页面被关闭,浏览器会自动释放它,但是为了最佳性能和内存使用,当确保不再用得到它的时候,就应该释放它.  
                        */  
                        //等图片加载完毕，再释放内存  
                        imgObjPreview.onload=function(){  
                            URL.revokeObjectURL(objURL);  
                        }  
                        //读取完图片数据触发时间执行  
                        reader.onload = function(){   
                                // 将读取的base64数据赋值配置的全局变量  
                                config.imgblod=this.result;  
                        }  
                    }else{  
                        reader.onload = function(){  
                                // 将读取的base64数据赋值配置的全局变量  
                                config.imgblod=this.result;  
                                imgObjPreview.src=this.result;  
                        }  
                    }  
                      
                }else{  
                    return false;  
                }              
            }else{  
                //IE下，使用滤镜  
                imgObj.select();  
                imgObj.blur();  
                //获取文本内容值，在IE中input type=file 选择文件之后input显示的是文件在本地的路径  
                var imgSrc = document.selection.createRange().text;  
                var localImagId = document.getElementById("localImag");  
                //必须设置初始大小  
                localImagId.style.width =config.preview.width-2;  
                localImagId.style.height =config.preview.height-2;  
                //判断格式   
                var imgType=imgSrc.split('.')[1];  
                if(config.typeAllow.indexOf(imgType)==-1){  
                    // config.ievolid=0;  
                    alert(config.typeWarming);  
                    return false;  
                }  
                //获取图片大小  
                var img=new Image();  
                img.src=imgSrc;  
                // 图片加载完毕执行  
                img.onload=function(e){  
                    var imgSize=Math.ceil(img.fileSize/1024);  
                    if(imgSize>config.imgSize){  
                        img=null;  
                        alert(config.sizeWarming);  
                        return false;  
                    }else{  
                        //将图片显示在预览框  
                        try{  
                            localImagId.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";  
                            localImagId.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;  
                            previewUploadDiv.find('span.imgsizespan').text(imgSize+'kb');  
                        }  
                        catch(e)  
                        {  
                            alert(config.typeWarming);  
                            return false;  
                        }  
                        imgObjPreview.style.display ='none';  
                        document.selection.empty();  
                        return ;      
                    }  
                }  
            }  
            return true;  
        }  
  
        /**  
        *限制上传图片的大小和格式  
        *firefox和chrome  
        */  
        function checkSize(imgObj){  
            var imgSize,imgType;  
            if(imgObj.files && imgObj.files[0]){  
                // 单位字节->kb  
                imgSize=Math.ceil(imgObj.files[0]['size']/1024);  
                //图片类型  
                imgType=imgObj.files[0]['type'].split('/')[1];  
                // 大小比较  
                if(imgSize>config.imgSize){  
                    alert(config.sizeWarming);  
                    return false;  
                }  
                //判断类型   
                if(config.typeAllow.indexOf(imgType)==-1){  
                    alert(config.typeWarming);  
                    return false;  
                }  
                previewUploadDiv.find('span.imgsizespan').text(imgSize+'kb');  
                return true;  
            }else{  
                return true;  
            }  
        }  
  
        /**  
        *ajax异步将数据post服务端  
        *  
        */  
        function ajaxpost(){  
            previewUploadDiv.find('button.btn-upload-img').text('正在保存');  
            //支持html5的浏览器，IE9+  
            if(config.imgblod){  
                /**  
                *ajax异步提交数据  
                *  
                */  
                $.post(config.url,{'base64Data':config.imgblod,'type':'base64'},function(data){  
                    if(data){  
                        previewUploadDiv.find('button.btn-upload-img').text('上传');  
                        previewUploadDiv.find('span.imgsizespan').html(data);  
                        //启动一个异步定时器  
                        setTimeout(function(){  
                            previewUploadDiv.find('span.imgsizespan').empty();  
                        },config.statTime);  
                    }  
                });  
            /**IE8以下的浏览器  
            *只能将图片上传，再进行base641编码  
            *  
            */  
            }else{  
                //先移除iframe  
                previewUploadDiv.find('iframe#uploadiframe').remove();  
                //动态创建form表单上传属性  
                previewUploadDiv.find('form#imgform').attr('enctype','multipart/form-data').attr("encoding", "multipart/form-data").attr('target','uploadiframe');  
                var iframeDiv = document.createElement('div');  
                iframeDiv.className='iframeDiv';  
                iframeDiv.innerHTML='<iframe id="uploadiframe" name="uploadiframe" style="display:none"></iframe>';  
  
                previewUploadDiv.append(iframeDiv);  
  
                //立即执行回调函数  
                (function(callback){  
                    //表单提交上传  
                    previewUploadDiv.find('form#imgform').submit();  
                    //setInterval() 方法返回的id句柄  
                    config.timeid=setInterval(callback,200);  
                })(function(){  
                    //ie特有document.all  
                    if(document.all){  
                        var content=document.getElementById('uploadiframe').contentDocument.getElementById(config.infoid).innerHTML;  
                        if(content){  
                            previewUploadDiv.find('button.btn-upload-img').text('上传');  
                            previewUploadDiv.find('span.imgsizespan').html(content);  
                            //启动一个异步定时器  
                            setTimeout(function(){  
                                previewUploadDiv.find('span.imgsizespan').empty();  
                            },config.statTime);  
                            //关闭setInterval()循环函数  
                            window.clearInterval(config.timeid);  
                        }                 
                    }  
                });  
            }  
        }  
        /**  
        *监听input file的文件图片是否改变  
        *  
        */  
        // juqery1.8低版本存在live(),jquery1.9+移除live()，用on()函数  
        if(previewUploadDiv.find('input#img').live){  
            previewUploadDiv.find('input#img').live('change',setImagePreview);  
        }else{  
            previewUploadDiv.find('input#img').on('change',setImagePreview);  
        }  
          
        /**  
        *监听是否上传  
        *  
        */  
        if(previewUploadDiv.find('button.btn-upload-img').live){  
            previewUploadDiv.find('button.btn-upload-img').live('click',ajaxpost);  
        }else{  
            previewUploadDiv.find('button.btn-upload-img').on('click',ajaxpost);  
        }  
                  
    }  
})(jQuery);  