/**
 * Created by onlyhom on 2017/5/14.
 */


$(function () {
    var login_box = $('.login-box');
    var register_box = $('.register-box');
    var user_box = $('.user-box');

    //切换到注册面板
    login_box.find('a.link').on('click',function () {
        login_box.hide();
        register_box.show();
    });

    //切换到登录面板
    register_box.find('a.link').on('click',function () {
        login_box.show();
        register_box.hide();
    });

    register_box.find('.btn-submit').on('click',function () {
        //通过ajax提交请求
        $.ajax({
            type:'post',
            url:'/api/user/register',
            data:{
                'username':register_box.find('[name="username"]').val(),
                'password':register_box.find('[name="password"]').val(),
                'repassword':register_box.find('[name="repassword"]').val()
            },
            dataType:'json',
            success:function (result) {
                console.log('success');
                console.log(result);
                register_box.find('.tips').text(result.message);
                if(!result.code){ //注册成功
                    setTimeout(function () {
                        login_box.show();
                        register_box.hide();
                    },1000);
                }

            },
            error:function (XMLHttpRequest, textStatus, errorThrown) {
                console.log('error');
                console.log(errorThrown);
            }
        });
    });

    login_box.find('.btn-submit').on('click',function () {
        //通过ajax提交请求
        $.ajax({
            type:'post',
            url:'/api/user/login',
            data:{
                'username':login_box.find('[name="username"]').val(),
                'password':login_box.find('[name="password"]').val()
            },
            dataType:'json',
            success:function (result) {
                console.log('success');
                console.log(result);
                login_box.find('.tips').text(result.message);
                if(!result.code){ //登录成功
                    setTimeout(function () {
                        // user_box.show();
                        // login_box.hide();
                        window.location.reload();
                        //user_box.find('.username').text(result.userInfo.username); //在模板中写了
                    },1000);
                }

            },
            error:function (XMLHttpRequest, textStatus, errorThrown) {
                console.log('error');
                console.log(errorThrown);
            }
        });
    });

    $('#logout').on('click',function () {
        $.ajax({
            url:'api/user/logout',
            success:function (result) {
                if(!result.code){
                    window.location.reload();
                }
            }
        });
    });

});