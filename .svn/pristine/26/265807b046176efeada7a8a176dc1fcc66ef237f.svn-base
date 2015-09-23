/*
*   @author fanyu
*   @date 2015-08-08
*   @version 1.0
*   @description 证件类型校验
*/
var certiVerify = {
    /*
    *   @param  {obj}  params   入参对象
    *   @param {jquery obj}    params.$certiType       证件类型select id
    *   @param {jquery obj}    params.$idCardNum       证件号码input id
    *   @param {function}    params.$blurCallback      选择证件类型select change回调函数
    *   @param {function}    params.$changeCallback    证件号码input blur回调函数
    */
    init: function(params){
        var _self = this;
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
            var errorMsg = _self.verify(certiType,certiCode);
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
                return this.is18Idcard(certCode);
            }else {
                return "身份证号码必须为18位！";
            }
        }else if(certiType === '1002'){//护照号
            if(certCodeLength < 6) {
                return "证件号码不合法：不能小于6个字符！";
            }
        }else if(certiType === '3001' || certiType === '4001' || certiType === '1004'){//手机号
            if (!(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(certCode))) {
                return "手机号码不合法：正确手机号码！!";
            }
        }
    },
    is18Idcard: function(idcard) {
        idcard = idcard.toUpperCase();
        //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
        if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(idcard))) {
            return "该身份证号码不符合身份证号码规则!";
        }
        //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。 
        //下面分别分析出生日期和校验位 
        var len, re;
        len = idcard.length;
        if (len == 18) {
            re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
            var arrSplit = idcard.match(re);
            //检查生日日期是否正确 
            var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
            var bGoodDay;
            bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
            if (!bGoodDay) {
                return "该身份证号码不符合身份证号码规则!";
            }else {
                //检验18位身份证的校验码是否正确。 
                //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。 
                var valnum;
                var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                var nTemp = 0, i;
                for (i = 0; i < 17; i++) {
                    nTemp += idcard.substr(i, 1) * arrInt[i];
                }
                valnum = arrCh[nTemp % 11];
                if (valnum != idcard.substr(17, 1)) {
                    return "该身份证号码不符合身份证号码规则!";
                }
                return false;
            }
        }
        return false;
    },
    is15Idcard: function(idcard) {
        idcard = idcard.toUpperCase();
        //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
        if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(idcard))) {
            return "该身份证号码不符合身份证号码规则!";
        }
        //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。 
        //下面分别分析出生日期和校验位 
        var len, re;
        len = idcard.length;
        if (len == 15) {
            re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
            var arrSplit = idcard.match(re);
            //检查生日日期是否正确 
            var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
            var bGoodDay;
            bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
            if (!bGoodDay) {
                return "该身份证号码不符合身份证号码规则!";
            }else {
                //将15位身份证转成18位 
                //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。 
                var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                var nTemp = 0, i;
                idcard = idcard.substr(0, 6) + '19' + idcard.substr(6, idcard.length - 6);
                for (i = 0; i < 17; i++) {
                    nTemp += idcard.substr(i, 1) * arrInt[i];
                }
                idcard += arrCh[nTemp % 11];
                return false;
            }
        }
        return false;
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
    }
}