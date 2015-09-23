/*
*   @deprecated 
*
*   @author fanyu
*   @date 2015-08-08
*   @description 证件类型校验
*/
var certiVerify = {
    _POWER:[7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
    DATE_SEPARATOR:"-",
    init: function(params){
        //选择证件类型
        params.$certiType.on('change', function(){
            if($.isFunction(params.changeCallback)){
                params.changeCallback();
            }
        })
        //输入框失去焦点时判断是否符合证件类型
        params.$idCardNum.on('blur',function(){
            var _this = $(this),
                certiType = params.$certiType.val(),
                certiCode = _this.val();
            var errorMsg = certiVerify.verify(certiType,certiCode);
            if($.isFunction(params.blurCallback)){
                params.blurCallback(errorMsg?errorMsg:'');
            }
        })
    },
    verify : function(certiType, certCode){
        var certCodeLength = certCode.replace(/[^\x00-\xff]/g,"aa").length;
        if (certiType === '1001') {//身份证
            if (!certCode) {
                return "身份证为空或未定义！";
            } else if(certCode.length == 15) {
                return "不支持15位身份证号！";
            } else if(!this.isId(certCode)){
                return "身份证不符合18位的基本规则！";
            }
            if(certCode.length == 18) {
                return this.isValidate18Idcard(certCode);
            }else {
                return "身份证号码必须为18位！";
            }
        }else if(certiType === '1002'){//护照号
            if(certCodeLength < 6) {
                return "证件号码不合法：不能小于6个字符！";
            }
        }else if(certiType === '3001' || certiType === '4001' || certiType === '1004'){//手机号
            if(certCodeLength != 11) {
                return "手机号码不合法：正确手机号码！";
            }
        }
    },
    isValidate18Idcard: function(idcard) {
        if(idcard) {
            if (idcard.length == 18) {
                //首先获取月份值
                var month = idcard.substring(10,12);
                if(month > 12 || month < 1) {
                    return true;    //月份不合法直接返回false
                }
                //获取日期值
                var day = idcard.substring(12,14);
                if(day > 31 || day < 1) {
                    return true;    
                }
                // 获取前17位
                var idcard17 = idcard.substring(0, 17);
                if(this.isDigital(idcard17)) {
                    var bit = this.converStringToIntArray(idcard17);
                    // 获取和值与11取模得到余数进行校验码
                    var sum17 = this.getPowerSum(bit);
                    var checkCode = this.getCheckCodeBySum(sum17);
                    // 获取第18位
                    var idcard18Code = idcard.substring(17, 18);
                    if(checkCode && (checkCode == idcard18Code.toLowerCase())) {
                        //出生日期距离系统时间必须为0-120周岁 add by tongys
                        var timeNow = new Date();
                        var curDate = "";
                        curDate = timeNow.getFullYear()+"-";
                        curDate = curDate + (timeNow.getMonth()+1)+"-";
                        curDate = curDate + timeNow.getDate();
                        var birthDate = idcard.substring(6,10)+"-"+idcard.substring(10,12)+"-"+idcard.substring(12,14);
                        if(this.g_CompareDate(curDate,birthDate) < 0 || this.g_MonthsBetween(curDate,birthDate) > 120*12 ) {
                            return "出生日期距离当前时间必须为0-120周岁之间！";
                        }
                        return false;
                    }else {
                        return "该身份证号码不符合身份证号码规则!";
                    }
                }
            }
        }
        return result;
    },
    isId:function(id){
        return this.is15Id(id) || this.is18Id(id);
    },
    is15Id: function(id){
        var patrn = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
        var result =  true;
        if(!patrn.exec(id)) {
            result = false;
        }
        return result;
    },
    is18Id: function(id){
        var patrn = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([\d|x|X]{1})$/;
        var result =  true;
        if(!patrn.exec(id)) {
            result = false;
        }
        return result;
    },
    isDigital: function(idcard){
        var patrn = /^[0-9]*$/;
        var result =  true;
        if(!patrn.exec(idcard)) {
            result = false;
        }
        return result;
    },
    converStringToIntArray: function(idcard){
        var result = null;
        if(idcard) {
            result = new Array(idcard.length);
            for(var i=0,len=idcard.length; i<len; i++) {
                try {
                    result[i] = parseInt(idcard.charAt(i));
                }catch(e) {
                    result = null;
                    alert("身份证的前17位必须全部为数字,请核实！");
                }
            }
        }
        return result;
    },
    getPowerSum:function(bit) {
        var sum = 0;
        if(bit != null && this._POWER.length == bit.length) {
            for(var i=0,len=bit.length; i<len; i++) {
                sum = sum + bit[i] * this._POWER[i];
            }
        }
        return sum;
    },
    getCheckCodeBySum: function(sum17) {
        var checkCode = null;
        if(sum17) {
            var modValue = sum17 % 11;
            switch(true) {
                case modValue > 2:
                    checkCode = (12-modValue)+"";
                    break;
                case modValue == 2:
                    checkCode = "x";
                    break;
                case modValue == 1:
                    checkCode = "0";
                    break;
                case modValue == 0:
                    checkCode = "1";
                    break;
            }
        }
        return checkCode;
    },
    g_IsDate: function (str){
        if(str=='')return true;
       if(this.DATE_SEPARATOR==null) this.DATE_SEPARATOR ="-";
       var regExpStr = "^\\d{4}" + this.DATE_SEPARATOR + "\\d{1,2}" + this.DATE_SEPARATOR + "\\d{1,2}$";
       var patrn = new RegExp(regExpStr);

       if(!patrn.exec(str)) return false;
       var dateArray  = str.split(this.DATE_SEPARATOR);
       var d= new Date(dateArray[0],dateArray[1]-1,dateArray[2]);
       var issame =(d && (d.getFullYear()==dateArray[0])&& (d.getMonth()+1==dateArray[1]) &&(d.getDate()==dateArray[2]));
       if (!issame)
           {
         return false;
           }
       return true;
    },
    //判断日期大小,输入两个日期字符串，返回两个日期的大小
    // 0一样大 ，1 第一日期大 ，-1 第二个日期大,-2错误
    g_CompareDate: function (date_str1 ,date_str2){
      if(date_str1 ==null)date_str1='';
      if(date_str2==null ) date_str2='';

      if(date_str1 ==date_str2)return 0;

      if( !this.g_IsDateTime(date_str1) && !this.g_IsDate(date_str1)
          || !this.g_IsDateTime(date_str2) && !this.g_IsDate(date_str2) ){
        //alert(g_I18NMessage("appframe_core","commutil_comparedate_err"));
        return -2;
      }

      if(date_str1 =='' && date_str2 !='') return -1;
      if(date_str2 =='' && date_str1 !='')return 1;

      var hour =0;
      var min =0;
      var sec =0;

      var dateTimeArray = date_str1.split(" ");
      var dateArray  = dateTimeArray[0].split(this.DATE_SEPARATOR);
      if(dateTimeArray.length>1){
        var timeArray = dateTimeArray[1].split(":");
        hour = timeArray[0];
        min = timeArray[1]
        sec = timeArray[2]
      }
      var d1= new Date(dateArray[0],dateArray[1]-1,dateArray[2],hour ,min ,sec);

      hour =0;
      min =0;
      sec =0;

      dateTimeArray = date_str2.split(" ");
      dateArray  = dateTimeArray[0].split(this.DATE_SEPARATOR);
      if(dateTimeArray.length>1){
        var timeArray = dateTimeArray[1].split(":");
        hour = timeArray[0];
        min = timeArray[1]
        sec = timeArray[2]
      }
      var d2= new Date(dateArray[0],dateArray[1]-1,dateArray[2],hour ,min ,sec);

      if (d1.getTime()==d2.getTime()) return 0;
      if(d1.getTime()>d2.getTime())return 1;
      else return -1;
    },
    /**
    判断月份差,输入两个日期字符串，返回两个月份差
    如果输入的是非法值，抛出异常
    (year1-year2)*12+(month1-month2)
    add by yangbb
    */
    g_MonthsBetween : function (date_str1 ,date_str2){
        if(date_str1 ==null){
            date_str1='';
        }   
        if(date_str2==null ){
            date_str2='';
        }   

        if(date_str1 ==date_str2){
            return 0;
        }
        
        if( !this.g_IsDateTime(date_str1) && !this.g_IsDate(date_str1)|| !this.g_IsDateTime(date_str2) && !this.g_IsDate(date_str2) ){
            //alert(g_I18NMessage("appframe_core","commutil_comparedate_err"));
            //抛出异常
            //throw new Error(g_I18NMessage("appframe_core","commutil_not_date"));
        }

        //解析时间字符串
        var year1 =0;
        var month1 =0;
        var day1 =0;
        var dateTimeArray = date_str1.split(" ");
        var dateArray  = dateTimeArray[0].split(this.DATE_SEPARATOR);
        year1=dateArray[0];
        month1=dateArray[1];
        day1=dateArray[2];
        
        var year2 =0;
        var month2 =0;
        var day2 =0;
        dateTimeArray = date_str2.split(" ");
        dateArray  = dateTimeArray[0].split(this.DATE_SEPARATOR);
        year2=dateArray[0];
        month2=dateArray[1];
        day2=dateArray[2];
        
        return (year1-year2)*12+(month1-month2);
    },

    /*********************************************************************************
    * FUNCTION: g_IsDateTime 校验日期是否合法yyyy-mm-dd H24:MI:SS这种格式的日期+时间
    * PARAMETER: 字符串s
    * RETURNS: true/false
    *********************************************************************************/
    g_IsDateTime: function(str){
        if(str=='')return true;
       if(this.DATE_SEPARATOR==null) this.DATE_SEPARATOR ="-";
       var regExpStr = "^\\d{4}" + this.DATE_SEPARATOR + "\\d{1,2}" + this.DATE_SEPARATOR + "\\d{1,2}\\s\\d{2}:\\d{1,2}:\\d{1,2}$";
       var patrn = new RegExp(regExpStr);

       if(!patrn.exec(str)) return false;
       var dateTimeArray = str.split(" ");
       if(dateTimeArray==null || dateTimeArray.length!=2) return false;
       var dateArray  = dateTimeArray[0].split(this.DATE_SEPARATOR);
       var timeArray = dateTimeArray[1].split(":");
       var d= new Date(dateArray[0],dateArray[1]-1,dateArray[2],timeArray[0],timeArray[1],timeArray[2]);
       var issame =(d && (d.getFullYear()==dateArray[0])&& (d.getMonth()+1==dateArray[1]) &&(d.getDate()==dateArray[2]) && (d.getHours() == timeArray[0]) && (d.getMinutes()== timeArray[1]) && (d.getSeconds()== timeArray[2])  );
       if (!issame)
           {
         return false;
           }
       return true;
    }
}