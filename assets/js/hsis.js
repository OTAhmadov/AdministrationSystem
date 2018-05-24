/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*
var js = document.createElement('script');
js.type = 'text/javascript';
js.src = './dummyData.js';

$("body").append(js);
*/

/*var s = document.createElement("script");
s.type = "text/javascript";
s.src = "js/language/"+lang+".js";
$(".addonJs").append(s);*/

var cropForm = new FormData();
var Hsis = {
    token: '875aa860d8a34413b7fc6104cb5923048c3f7d42c619419ab8acc453268f8bd5',
    lang: 'az',
    appId: 1000003,
    currModule: '',
    operationList: [],
    array: [],
    node: [],
    structureId: '',
    subModuleId: [],
    personId: 0,
    button: '',
    top: 0,
    eduLevels: [],
    universities: [],
    begin: true,
    personId: '',
    tempData: {
        form: ''
    },
    Codes: {
        FOREIGN_UNIVERSITY: 86
    },
    urls: {
        // ROS: "http://localhost:8080/ROS/",
        ROS: "http://192.168.1.78:8082/ROS/",
//         AdminRest: 'http://localhost:8080/AdministrationRest/',
//         AdminRest: 'http://localhost:8080/AdministrationRest/',
        AdminRest: 'http://192.168.1.78:8082/AdministrationRest/',
        HSIS: "http://192.168.1.78:8082/UnibookHsisRest/",
//        HSIS: "http://localhost:8080/UnibookHsisRest/",
        REPORT: 'http://192.168.1.78:8082/ReportingRest/',
        EMS: 'http://192.168.1.78:8082/UnibookEMS/',
        COMMUNICATION: 'http://192.168.1.78:8082/CommunicationRest/',
        NOTIFICATION: 'http://192.168.1.78:8082/NotificationSystem/greeting.html?token=',
//        EMS: 'http://localhost:8080/UnibookEMS/',
        // REPORT: 'http://localhost:8080/ReportingRest/'
    },
    statusCodes: {
        OK: 'OK',
        UNAUTHORIZED: 'UNAUTHORIZED',
        ERROR: 'ERROR',
        INVALID_PARAMS: 'INVALID_PARAMS'
    },
    REGEX: {
        email: /\S+@\S+\.\S+/,
        number: /^\d+$/,
        decimalNumber: /^\d+(\.\d+)?$/,
        TEXT: 'text\/plain',
        PDF: 'application\/pdf',
        XLS: 'application\/vnd\.ms-excel',
        XLSX: 'application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet',
        DOC: 'application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document',
        DOCX: 'application\/msword',
        phone: /\(\+\d{3}\)-\d{2}-\d{3}-\d{2}-\d{2}/,
        IMAGE_EXPRESSION: 'image\/jpeg|image\/png',
    },
    MASK: {
        phone: '(+000)-00-000-00-00'
    },
    initToken: function (cname) {
        var name = cname + "=";

        if (document.cookie == name + null || document.cookie == "") {
            window.location.href = '/AdministrationSystem/greeting.html'
        } else {
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];

                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }

                if (c.indexOf(name) == 0) {
                    Hsis.token = c.substring(name.length, c.length);
                }
            }
        }

    },
    initLanguageCookie: function (name) {
        var ca = document.cookie.split(';');

        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];

            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }

            if (c.indexOf(name) == 0) {
                Hsis.lang = c.substring(name.length, c.length).split('=')[1];
            }
        }

        if (Hsis.lang.trim().length === 0) {
            Hsis.lang = 'az';
        }
    },
    initCurrentModule: function (name) {
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                var currModule = c.substring(name.length, c.length).split('=')[1];
                return currModule;
            }
        }
        return "";
    },
    loadLanguagePack: function (lang) {
        $.getJSON('assets/js/i18n/' + lang + '.json', function (data) {
            $.each(data, function (i, v) {
                Hsis.dictionary[lang][i] = v;
            });
        });
    },
    i18n: function () {
        Hsis.initLanguageCookie('lang');
        var attr = '';

        $('[data-i18n]').each(function () {
            attr = $(this).attr('data-i18n');
            $(this).text(Hsis.dictionary[Hsis.lang][attr]);
            $(this).attr('placeholder', Hsis.dictionary[Hsis.lang][attr]);
        });
    },
    getCookie: function (cookie_name) {

        var results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');

        if (results)
            return (decodeURI(results[2]));
        else
            return null;

    },
    dictionary: {
        az: {},
        en: {},
        ru: {}
    },
    Proxy: {
        loadApplications: function (callback) {
            $.ajax({
                url: Hsis.urls.ROS + 'applications?token=' + Hsis.token,
                type: 'GET',
//                headers: {
//                    'Token': Hsis.token
//                },
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Hsis.statusCodes.OK:
                                    Hsis.Service.parseApplications(data.data);
                                    Hsis.Service.parseApplicationsList(data.data);
                                    $('[data-toggle="tooltip"]').tooltip();
                                    break;

                                case Hsis.statusCodes.ERROR:
                                    break;

                                case Hsis.statusCodes.UNAUTHORIZED:
                                    window.location = Hsis.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                },
                complete: function (data) {

                    if (callback) {
                        callback()
                    }
                }
            });
        },
        loadSubApplications: function (callback) {
            $.ajax({
                url: Hsis.urls.ROS + 'applications/1000014/subApplications?token=' + Hsis.token,
                type: 'GET',
//                headers: {
//                    'Token': Hsis.token
//                },
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Hsis.statusCodes.OK:
                                    if (callback)
                                        callback(data);
//                                    Admin.Service.parseSubApplicationsList(data.data);
//                                    $('[data-toggle="tooltip"]').tooltip()
                                    break;

                                case Hsis.statusCodes.ERROR:
                                    break;

                                case Hsis.statusCodes.UNAUTHORIZED:
                                    window.location = Hsis.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                }
            });
        },
        loadOrgTree: function (callback, container) {
            var tree = {};
            $.ajax({
                url: Hsis.urls.HSIS + 'structures?token=' + Hsis.token,
                type: 'GET',
                global: false,
                beforeSend: function () {
                    if (typeof container !== "undefined") {
                        //                       var obj = $('.small-loading').clone().toggleClass('small-loading tree-preloader').removeClass('hidden');
                        //                       container.before(obj);
                        $('.btn.tree-modal').attr('data-check', 1);
                        NProgress.start();
                    }

                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.ERROR:

                                break;

                            case Hsis.statusCodes.OK:
                                tree = data.data;
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }

                },
                complete: function () {
                    callback(tree);
                    // $('.module-block[data-id="1000009"]').removeAttr('data-check');
                    $('.btn.tree-modal').attr('data-check');
                    NProgress.done();

                }
            });
        },
        loadModules: function (callback) {
            var modules = {};
            $.ajax({
                url: Hsis.urls.ROS + 'applications/' + Hsis.appId + '/modules?token=' + Hsis.token,
                type: 'GET',
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Hsis.statusCodes.OK:
                                    modules = data;
                                    break;

                                case Hsis.statusCodes.ERROR:
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Hsis.statusCodes.UNAUTHORIZED:
                                    window.location = Hsis.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                },
                complete: function () {
                    callback(modules);
                }
            });
        },
        loadSubModules: function (moduleId, callback) {

            $.ajax({
                url: Hsis.urls.ROS + 'applications/modules/' + moduleId + '/subModules?token=' + Hsis.token,
                type: 'GET',
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Hsis.statusCodes.OK:
                                    callback(data);
                                    break;

                                case Hsis.statusCodes.ERROR:
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Hsis.statusCodes.UNAUTHORIZED:
                                    window.location = Hsis.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                }
            });
        },


        // new ajax request
        getAbroadStructure: function (page, form, callback) {
            $.ajax({
                url: Hsis.urls.HSIS + 'structures/abroad?token=' + Hsis.token + '&page=' + (page ? page : 1),
                type: 'GET',
                data: form,
                success: function (result) {
                    try {
                        if (result) {
                            switch (result.code) {
                                case Hsis.statusCodes.OK:
                                    if(callback)
                                        callback(result);
                                    Hsis.Service.loadAbroadStructures(result.data);
                                    break;
                                case Hsis.statusCodes.ERROR:
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;
                                case Hsis.statusCodes.UNAUTHORIZED:
                                    window.location = Hsis.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    } catch (e) {
                        console.error(e);
                    }
                }
            })
        },



        // get request for abroadaddress
        getAbroadAddress: function (page, form, callback) {
            $.ajax({
                url: Hsis.urls.HSIS + 'structures/abroad/address?token=' + Hsis.token + '&page=' + (page ? page : 1),
                type: 'GET',
                data: form,
                success: function (result) {
                    try {
                        if (result) {
                            switch (result.code) {
                                case Hsis.statusCodes.OK:
                                    if(callback)
                                        callback(result);
                                    Hsis.Service.loadAbroadAddress(result.data);
                                    break;
                                case Hsis.statusCodes.ERROR:
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;
                                case Hsis.statusCodes.UNAUTHORIZED:
                                    window.location = Hsis.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    } catch (e) {
                        console.error(e);
                    }
                }
            })
        },


        //AJAX Request
        addAbroadStructure: function (form, callback) {
            $.ajax({
                url: Hsis.urls.HSIS + 'structures/abroad/add?token=' + Hsis.token,
                type: 'POST',
                data: form,
                beforeSend: function() {
                    $('.xtms-approve').attr('disabled', 'disabled');
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.ERROR:
                                if (data.message) {
                                    $.notify(data.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;
                            case Hsis.statusCodes.OK:
                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                if(callback) callback(data);
                                break;
                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'login?app=' + Hsis.token;
                                break;
                        }
                    }
                },
                complete: function() {
                    $('.xtms-approve').removeAttr('disabled');
                }
            })
        },
        removeAbroadStructure: function (id, callback) {
            $.ajax({
                url: Hsis.urls.HSIS + 'structures/abroad/' + id + '/remove?token=' + Hsis.token,
                type: 'POST',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.ERROR:
                                if (data.message) {
                                    $.notify(data.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;
                            case Hsis.statusCodes.OK:
                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                if(callback) callback(data);
                                break;
                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'login?app=' + Hsis.token;
                                break;
                        }
                    }
                }
            })
        },

        //edit
        editAbroadStructure: function (id, formData, callback) {
            $.ajax({
                url: Hsis.urls.HSIS + 'structures/abroad/' + id + '/edit?token=' + Hsis.token,
                type: 'POST',
                data: formData,
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.ERROR:
                                if (data.message) {
                                    $.notify(data.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;
                            case Hsis.statusCodes.OK:
                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                if(callback) callback(data);
                                break;
                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'login?app=' + Hsis.token;
                                break;
                        }
                    }
                }
            })
        },

        getProfile: function () {
            $.ajax({
                url: Hsis.urls.ROS + "profile?token=" + Hsis.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                try {
                                    if (data.data) {
                                        var user = data.data;
                                        $('.profile-data li[data-type="name"]').text(user.person.name + ' ' + user.person.surname + ' ' + user.person.patronymic);
                                        $('.welcome-text p span').text(user.person.name);
                                        $('.profile-data li[data-type="role"]').text(user.role.value[Hsis.lang]);
                                        $('.profile-data li[data-type="org"]').text(user.structure.name[Hsis.lang]);
                                        $('.side-title-block p').text(user.orgName.value[Hsis.lang]);
                                        $('.main-img img').attr('src', Hsis.urls.AdminRest + 'users/' + user.id + '/image?token=' + Hsis.token);
                                        $('.side-title-block img').attr('src', Hsis.urls.HSIS + 'structures/' + user.orgName.id + '/logo?token=' + Hsis.token);
                                        var img = $('.main-img img');
                                        img.on('error', function (e) {
                                            $('.main-img img').attr('src', 'assets/img/guest.png');
                                        })
                                        $('div.big-img img').attr('src', Hsis.urls.AdminRest + 'users/' + user.id + '/image?token=' + Hsis.token);
                                        $('div.big-img img').on('error', function (e) {
                                            $('div.big-img img').attr('src', 'assets/img/guest.png');
                                        });
                                        Hsis.structureId = user.structure.id;
                                    }
                                } catch (err) {
                                    console.error(err);
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                }
            })
        },
        addOrgTree: function (orgTree, callback) {

            $.ajax({
                url: Hsis.urls.HSIS + 'structures/add?token=' + Hsis.token,
                type: 'POST',
                data: orgTree,
                contentType: false,
                processData: false,
                beforeSend: function () {
                    $('#main-div #confirmOrgTree').attr('disabled', 'disabled');
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.ERROR:
                                if (data.message) {
                                    $.notify(data.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'login?app=' + Hsis.token;
                                break;
                        }
                    }
                },
                complete: function (data) {
                    $('#main-div #confirmOrgTree').removeAttr('disabled');

                    if (callback) {
                        callback(data.responseJSON);

                    }

                }
            })
        },
        removeOrgTree: function (id, callback) {
            $.ajax({
                url: Hsis.urls.HSIS + 'structures/' + id + '/remove?token=' + Hsis.token,
                type: 'POST',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.ERROR:
                                if (data.message) {
                                    $.notify(data.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(data);
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'login?app=' + Hsis.token;
                                break;

                        }
                    }
                }
            })
        },
        editOrgTree: function (orgTree, id) {
            $.ajax({
                url: Hsis.urls.HSIS + 'structures/' + id + '/edit?token=' + Hsis.token,
                type: 'POST',
                data: orgTree,
                contentType: false,
                processData: false,
                beforeSend: function () {
                    $('#main-div #confirmOrgTree').attr('disabled', 'disabled')
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.ERROR:
                                if (data.message) {
                                    $.notify(data.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.OK:
                                $('ul.module-list').find('.module-block[data-id="' + Hsis.currModule + '"] a').click();

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                // var tree = $('#jstree');
                                // Hsis.Proxy.loadOrgTree(function (tree) {
                                //     Hsis.Service.parseOrgTree(tree);

                                // }, tree);

                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'login?app=' + Hsis.token;
                                break;

                        }

                    }
                },
                complete: function () {
                    $('#main-div #confirmOrgTree').removeAttr('disabled');
                }

            });
        },
        loadOperations: function (moduleId, callback) {
            var operations = {};
            $.ajax({
                url: Hsis.urls.ROS + 'applications/modules/' + moduleId + '/operations?token=' + Hsis.token,
                type: 'GET',
                global: false,
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Hsis.statusCodes.OK:
                                    operations = data.data;
                                    Hsis.operationList = operations;
                                    break;

                                case Hsis.statusCodes.ERROR:
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Hsis.statusCodes.UNAUTHORIZED:
                                    window.location = Hsis.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                },
                complete: function () {
                    callback(operations);
                    // if ($('#buttons_div').find('ul li').length < 1) {
                    //     $('#buttons_div').hide();
                    //     // console.log('empty')
                    // }
                }
            });
        },
        loadOrgTreeTypes: function (callback) {
            var types;

            $.ajax({
                url: Hsis.urls.HSIS + 'structures/types?token=' + Hsis.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.OK:
                                types = data.data;
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;
                        }
                    }
                },
                complete: function () {
                    callback(types);
                }
            });

        },
        loadOrgTreeDetails: function (treeId, callback) {
            var tree = {};
            $.ajax({
                url: Hsis.urls.HSIS + 'structures/' + treeId + '?token=' + Hsis.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                tree = data.data;
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                },
                complete: function () {
                    callback(tree);
                }
            });

        },
        loadOrgTreeByType: function (typeId, callback, container) {
            var tree = {};
            $.ajax({
                url: Hsis.urls.HSIS + 'structures/bytype/' + typeId + '?token=' + Hsis.token,
                type: 'GET',
                beforeSend: function () {
                    if (typeof container !== "undefined") {
                        //                       var obj = $('.small-loading').clone().toggleClass('small-loading tree-preloader').removeClass('hidden');
                        //                       container.before(obj);
                        container.attr('data-check', 1);
                    }

                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                tree = data.data;
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                },
                complete: function () {
                    callback(tree);
                }
            });
        },
        loadOrgTreeByTypeAndATM: function (typeId, atmType, callback, container) {
            var tree = {};
            $.ajax({
                url: Hsis.urls.HSIS + 'structures/bytype/' + typeId + '?uniTypeId=' + atmType + '&token=' + Hsis.token,
                type: 'GET',
                beforeSend: function () {
                    if (typeof container !== "undefined") {
                        //                       var obj = $('.small-loading').clone().toggleClass('small-loading tree-preloader').removeClass('hidden');
                        //                       container.before(obj);
                        container.attr('data-check', 1);
                    }

                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                tree = data.data;
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                },
                complete: function () {
                    callback(tree);
                }
            });
        },
        loadOrgTreeByATMType: function (typeId, uniTypeId, callback, container) {
            var tree = {};
            $.ajax({
                url: Hsis.urls.HSIS + 'structures?uniTypeId=' + uniTypeId + '&token=' + Hsis.token,
                type: 'GET',
                beforeSend: function () {
                    if (typeof container !== "undefined") {
                        //                       var obj = $('.small-loading').clone().toggleClass('small-loading tree-preloader').removeClass('hidden');
                        //                       container.before(obj);
                        container.attr('data-check', 1);
                    }

                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                tree = data.data;
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                },
                complete: function () {
                    callback(tree);
                }
            });
        },
        getPersonInfoByPinCode: function (pinCode, callback) {
            var data;
            $.ajax({
                url: Hsis.urls.HSIS + 'students/getInfoByPinCode?token=' + Hsis.token + '&pinCode=' + pinCode,
                type: 'POST',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                callback(result.data);
                                break;

                            case Hsis.statusCodes.OK:
                                callback(result.data);
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                }
            });
        },
        loadStudents: function (page, queryParams, callback, before) {
            $.ajax({
                url: Hsis.urls.HSIS + 'students?token=' + Hsis.token + (queryParams ? '&' + queryParams : '') + (page ? '&page=' + page : ''),
                type: 'GET',
                beforeSend: function () {
                    if (before) {
                        $('.module-list .chekbox-con input').attr('disabled', 'disabled');
                    }

                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                Hsis.Service.parseStudents(result.data, page);
                                $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12');
                                $('body').find('.col-sm-4.info').fadeOut(1).css('right', '-100%');
                                if (callback)
                                    callback(result.data);
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }


                    }
                },
                complete: function () {
                    $('.module-list .chekbox-con input').removeAttr('disabled');
                    $('.module-block[data-id="1000011"]').removeAttr('data-check');
                }
            })
        },

        loadAbroadStudents: function (page, queryParams, callback, before) {

            $.ajax({
                url: Hsis.urls.HSIS + 'students/abroad?token=' + Hsis.token + (queryParams ? '&' + queryParams : '') + (page ? '&page=' + page : ''),
                type: 'GET',
                beforeSend: function () {
                    if (before) {
                        $('.module-list .chekbox-con input').attr('disabled', 'disabled');
                    }

                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                Hsis.Service.parseAbroadStudents(result.data, page);
                                $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12');
                                $('body').find('.col-sm-4.info').fadeOut(1).css('right', '-100%');
                                if (callback)
                                    callback(result.data);
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }


                    }
                },
                complete: function () {
                    $('.module-list .chekbox-con input').removeAttr('disabled');
                    $('.module-block[data-id="1000114"]').removeAttr('data-check');
                }
            })
        },
        getStructureListByParentId: function (id, callback) {
            $.ajax({
                url: Hsis.urls.HSIS + 'structures/' + id + '/childs?token=' + Hsis.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                callback(result);
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                }
            })
        },
        loadDictionariesByTypeId: function (typeId, parentId, callback) {
            var result = {};
            $.ajax({
                url: Hsis.urls.AdminRest + 'settings/dictionaries?typeId=' + typeId + '&parentId=' + parentId + '&token=' + Hsis.token,
                type: 'GET',
                global: false,
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Hsis.statusCodes.OK:
                                    result = data.data;
                                    break;

                                case Hsis.statusCodes.ERROR:
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;
                                case Hsis.statusCodes.UNAUTHORIZED:
                                    window.location = Hsis.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                },

                complete: function () {

                    callback(result);
                }

            });
        },
        loadDictionariesListByParentId: function (parentId, callback) {
            var result = {};
            $.ajax({
                url: Hsis.urls.AdminRest + 'settings/dictionaries/parentId/' + parentId + '?token=' + Hsis.token,
                type: 'GET',
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Hsis.statusCodes.OK:
                                    callback(data)
                                    break;

                                case Hsis.statusCodes.ERROR:
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Hsis.statusCodes.UNAUTHORIZED:

                                    window.location = Hsis.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                }

            });
        },
        loadAdressTypes: function (parentId, callback) {
            var result = {};
            $.ajax({
                url: Hsis.urls.AdminRest + 'settings/address/parentId/' + parentId + '?token=' + Hsis.token,
                type: 'GET',
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Hsis.statusCodes.OK:
                                    callback(data.data)
                                    break;

                                case Hsis.statusCodes.ERROR:
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Hsis.statusCodes.UNAUTHORIZED:

                                    window.location = Hsis.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                }

            });
        },
        loadAcademicGroups: function (page, queryParams, callback, before) {
            $.ajax({
                url: Hsis.urls.HSIS + 'groups?token=' + Hsis.token + (queryParams ? '&' + queryParams : '') + (page ? '&page=' + page : ''),
                type: 'GET',
                beforeSend: function () {
                    if (before) {
                        $('#main-div li.sub-module-item').attr('data-attr', 1);
                    }
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $('.notification-parent').notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    position: "bottom center",
                                    style: 'red'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                console.log(result.data)
                                Hsis.Service.parseAcademicGroups(result.data, page);
                                if (callback)
                                    callback(result.data);
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;


                        }


                    }
                },
                complete: function () {
                    $('#main-div li.sub-module-item').removeAttr('data-attr');
                    // $('.module-block[data-id="1000038"]').removeAttr('data-check');
                }
            })
        },
        addAcademicGroup: function (formData, callback) {
            $.ajax({
                url: Hsis.urls.HSIS + 'groups/add?token=' + Hsis.token,
                type: 'POST',
                data: formData,
                beforeSend: function () {
                    $('#main-div #confirmGroup').attr('disabled', 'disabled');
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result);
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                },
                complete: function () {
                    $('#main-div #confirmGroup').removeAttr('disabled');
                }
            });
        },
        getAcademicGroupDetails: function (id, callback) {
            var data = {};
            $.ajax({
                url: Hsis.urls.HSIS + 'groups/' + id + '?token=' + Hsis.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $('.notification-parent').notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    position: "bottom center",
                                    style: 'red'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                data = result.data;
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }


                    }
                },
                complete: function () {
                    if (callback) {
                        callback(data);
                    }
                }
            });
        },
        getAcademicGroupStudentList: function (id, callback) {
            var data = {};
            $.ajax({
                url: Hsis.urls.HSIS + 'groups/' + id + '/getStudsList/?token=' + Hsis.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $('.notification-parent').notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    position: "bottom center",
                                    style: 'red'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                data = result.data;
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }


                    }
                },
                complete: function () {
                    if (callback) {
                        callback(data);
                    }
                }
            });
        },
        getStudentListByOrgId: function (params, callback) {
            var data = {};
            $.ajax({
                url: Hsis.urls.HSIS + 'groups/student' + '?token=' + Hsis.token + (params ? '&' + params : ''),
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $('.notification-parent').notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    position: "bottom center",
                                    style: 'red'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                data = result.data;

                                var htmlTag = $('#possibleStudent');
                                htmlTag.html('');
                                $.each(data, function (i, d) {
                                    var e = $(document.createElement('option'));
                                    e.attr('class', 'option_class');
                                    e.attr('onclick', 'addToSelectedStudentList($(this))');
                                    e.text(d.lastName + " " + d.firstName + " " + d.middleName);
                                    e.val(d.id);
                                    htmlTag.append(e);
                                });

                                if (students !== null) {
                                    $.each(students, function (i, stud) {
                                        var obj = $('#possibleStudent option[value=\'' + stud + '\']');
                                        obj.attr('disabled', 'disabled').attr("style", "background-color:#FF5B57;border-bottom:3px solid #FF5B57;");
                                    });
                                }

                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }


                    }
                }
            });
        },
        editAcademicGroup: function (formData) {
            $.ajax({
                url: Hsis.urls.HSIS + 'groups/edit?token=' + Hsis.token,
                type: 'POST',
                data: formData,
                beforeSend: function () {
                    $('#main-div #confirmGroup').attr('disabled', 'disabled');
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                var firstParams = $('.main-content-upd .group-search-form').serialize();
                                Hsis.Proxy.loadAcademicGroups('', firstParams);
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                },
                complete: function () {
                    $('#main-div #confirmGroup').removeAttr('disabled');
                }
            });
        },
        removeAcademicGroup: function () {

            var id = $('.main-content-upd #buttons_div').attr('data-id');

            $.ajax({
                url: Hsis.urls.HSIS + 'groups/' + id + '/remove?token=' + Hsis.token,
                type: 'POST',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }

                                break;

                            case Hsis.statusCodes.OK:
                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }


                    }
                },
                complete: function () {
                    $('.main-content-upd #buttons_div').removeAttr('data-id');
                    Hsis.Proxy.loadAcademicGroups();
                }
            })
        },
        addStudentsToAcademicGroup: function (formData, callback) {
            $.ajax({
                url: Hsis.urls.HSIS + 'groups/addStuds?token=' + Hsis.token,
                type: 'POST',
                data: formData,
                beforeSend: function (xhr) {
                    $('#main-div #confirmGroup').attr('disabled', 'disabled');
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });

                                if (callback) {
                                    callback();
                                }

                                //$('#main-div .acad-group-form input[name="studentIdArray"]').remove();
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                },
                complete: function () {
                    $('#main-div #confirmGroup').removeAttr('disabled');
                }
            });
        },
        loadShares: function (page, queryParams, callback) {
            $.ajax({
                url: Hsis.urls.HSIS + 'share?token=' + Hsis.token + '&orgId=' + Hsis.structureId + (queryParams ? '&' + queryParams : '') + (page ? '&page=' + page : ''),
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $('.notification-parent').notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    position: "bottom center",
                                    style: 'red'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                Hsis.Service.parseShares(result.data, page);
                                if (callback)
                                    callback(result.data);
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
                complete: function () {
                    // $('.module-block[data-id="1000055"]').removeAttr('data-check');
                }
            })
        },
        loadVisibleToList: function (shareId, callback) {
            var result = {};
            $.ajax({
                url: Hsis.urls.HSIS + 'share/visibleToList?token=' + Hsis.token,
                type: 'GET',
                data: {
                    shareId: shareId
                },
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Hsis.statusCodes.OK:
                                    result = data.data;
                                    break;

                                case Hsis.statusCodes.ERROR:
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Hsis.statusCodes.UNAUTHORIZED:
                                    window.location = Hsis.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                },
                complete: function () {
                    if (callback) {
                        callback(result);
                    }
                }

            });
        },
        loadShareOrgList: function (shareId, callback) {
            var result = {};
            $.ajax({
                url: Hsis.urls.HSIS + 'share/shareOrgList?token=' + Hsis.token,
                type: 'GET',
                data: {
                    shareId: shareId
                },
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Hsis.statusCodes.OK:
                                    result = data.data;
                                    break;

                                case Hsis.statusCodes.ERROR:
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Hsis.statusCodes.UNAUTHORIZED:
                                    window.location = Hsis.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                },
                complete: function () {
                    if (callback) {
                        callback(result);
                    }
                }

            });
        },
        addShare: function (formData) {
            $.ajax({
                url: Hsis.urls.HSIS + 'share/add?token=' + Hsis.token,
                type: 'POST',
                data: formData,
                beforeSend: function (xhr) {
                    $('#main-div #confirmShare').attr('disabled', 'disabled');
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                },
                complete: function () {
                    $('#main-div #confirmShare').removeAttr('disabled');
                }
            });
        },
        editShare: function (formData) {
            $.ajax({
                url: Hsis.urls.HSIS + 'share/edit?token=' + Hsis.token,
                type: 'POST',
                data: formData,
                beforeSend: function (xhr) {
                    $('#main-div #confirmShare').attr('disabled', 'disabled')
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                },
                complete: function () {
                    $('#main-div #confirmShare').removeAttr('disabled');
                }
            });
        },

        getShareDetails: function (id, callback) {
            var data = {};
            $.ajax({
                url: Hsis.urls.HSIS + 'share/' + id + '?token=' + Hsis.token + '&orgId=' + Hsis.structureId,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $('.notification-parent').notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    position: "bottom center",
                                    style: 'red'
                                });
                                break;
                            case Hsis.statusCodes.OK:
                                data = result.data;
                                break;
                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
                complete: function () {
                    if (callback) {
                        callback(data);
                    }
                }
            });
        },

        removeShare: function () {

            var id = $('.main-content-upd #buttons_div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'share/' + id + '/remove?token=' + Hsis.token,
                type: 'POST',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'error'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang]['success'], {
                                        type: 'success'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                        type: 'success'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }


                    }
                },
                complete: function () {
                    $('.main-content-upd #buttons_div').removeAttr('data-id');
                    Hsis.Proxy.loadShares();
                }
            })
        },
        addStudent: function (formData, callback) {
            var person = {};
            $.ajax({
                url: Hsis.urls.HSIS + 'students/add?token=' + Hsis.token,
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                beforeSend: function (xhr) {
                    $('#main-div #confirmStudent').attr('data-check', 1);
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                person = result.data;
                                if (callback) {
                                    callback(person);
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
                complete: function () {
                    cropForm = new FormData();
                    $('#main-div #confirmStudent').attr('data-check', 0);
                }
            });
        },
        addAbroadStudent: function (formData, callback) {
            var person = {};
            $.ajax({
                url: Hsis.urls.HSIS + 'students/abroad/add?token=' + Hsis.token,
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                beforeSend: function (xhr) {
                    $('#main-div #confirmAbroadStudent').attr('disabled', 'disabled');
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                person = result.data;
                                if (callback) {
                                    callback(person);
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
                complete: function () {
                    cropForm = new FormData();
                    $('#main-div #confirmAbroadStudent').removeAttr('disabled');
                }
            });
        },
        removeStudent: function (id, callback) {

            $.ajax({
                url: Hsis.urls.HSIS + 'students/' + id + '/remove?token=' + Hsis.token,
                type: 'POST',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.OK:
                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                if (callback) {
                                    callback();
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }


                    }
                },
                complete: function () {
                    $('.main-content-upd #buttons_div').removeAttr('data-id');
                    Hsis.Proxy.loadStudents();
                }
            })
        },
        getStudentDetails: function (id, callback) {
            var data = {};
            $.ajax({
                url: Hsis.urls.HSIS + 'students/' + id + '?token=' + Hsis.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                data = result.data;
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }


                    }
                },
                complete: function () {
                    callback(data);
                }
            })
        },
        getAbroadStudentDetails: function (id, callback) {
            var data = {};
            $.ajax({
                url: Hsis.urls.HSIS + 'students/abroad/' + id + '?token=' + Hsis.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                data = result.data;
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }


                    }
                },
                complete: function () {
                    callback(data);
                }
            })
        },
        editCommonInfoStudent: function (formData, callback) {
            var id = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'students/' + id + '/commonInfo/edit?token=' + Hsis.token,
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                beforeSend: function (xhr) {
                    $('#main-div .edit-common-info').attr('disabled, disabled');
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });

                                if (callback) {
                                    callback(result);
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }


                    }
                },
                complete: function () {
                    cropForm = new FormData();
                    $('#main-div .edit-common-info').removeAttr('disabled');
                }
            })
        },
        editContactStudent: function (contact, callback) {
            var id = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'students/' + id + '/contact/edit?token=' + Hsis.token,
                type: 'POST',
                data: contact,
                beforeSend: function (xhr) {
                    $('#main-div .btn-contact-modal-submit').attr('disabled', 'disabled')
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.OK:
                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });

                                callback(result);
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }


                    }
                },
                complete: function () {
                    $('#main-div .btn-contact-modal-submit').removeAttr('disabled');
                }
            })
        },
        addStudentContact: function (studentId, contact, callback) {
            $.ajax({
                url: Hsis.urls.HSIS + 'students/' + studentId + '/contacts/add?token=' + Hsis.token,
                type: 'POST',
                data: contact,
                beforeSend: function (xhr) {
                    $('#main-div .btn-contact-modal-submit').attr('disabled', 'disabled');
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result);
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }


                    }
                },
                complete: function () {
                    $('#main-div .btn-contact-modal-submit').removeAttr('disabled');
                }
            });
        },
        removeStudentContact: function (contactId, callback) {
            var id = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'students/' + id + '/contacts/' + contactId + '/remove?token=' + Hsis.token,
                type: 'POST',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.OK:

                                callback(result);
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }


                    }
                }
            });
        },
        loadAddressTree: function (callback) {
            var tree = {};
            $.ajax({
                url: Hsis.urls.HSIS + 'students/addresses?token=' + Hsis.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                tree = result.data;
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'lgoin?app=' + Hsis.appId;
                                break;

                        }
                    }
                },
                complete: function () {
                    callback(tree);
                }
            })
        },
        editStudentAddress: function (address, callback) {
            var id = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'students/' + id + '/address/' + address.id + '/edit?token=' + Hsis.token,
                type: 'POST',
                data: address,
                beforeSend: function (xhr) {
                    $('#main-div #get_permanent_address_edit').attr('disabled', 'disabled');
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:


                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });

                                callback(result.code);
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'lgoin?app=' + Hsis.appId;
                                break;

                        }
                    }
                },
                complete: function () {
                    $('#main-div #get_permanent_address_edit').removeAttr('disabled');
                }
            })
        },
        editStudentAcademicInfo: function (academicInfo, callback) {
            var id = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'students/' + id + '/academicInfo/edit?token=' + Hsis.token,
                type: 'POST',
                data: academicInfo,
                beforeSend: function (xhr) {
                    $('#main-div .edit-academic-info').attr('disabled', 'disabled');
                    $('#main-div .edit-uni-action').attr('disabled', 'disabled');
                    $('#main-div .edit-school-action').attr('disabled', 'disabled');
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result);
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'lgoin?app=' + Hsis.appId;
                                break;

                        }
                    }
                },
                complete: function () {
                    $('#main-div .edit-academic-info').removeAttr('disabled');
                    $('#main-div .edit-uni-action').removeAttr('disabled');
                    $('#main-div .edit-school-action').removeAttr('disabled');
                }
            })
        },
        removeDocFiles: function (fileId, filePath, callback) {
            var id = $('#main-div').attr('data-id');
            var moduleType = $('#main-div').attr('data-type');
            var module = moduleType === 'E' ? 'teachers/' : 'students/';
            $.ajax({
                url: Hsis.urls.HSIS + module + id + '/document/file/' + fileId + '/remove?token=' + Hsis.token,
                type: 'POST',
                data: {
                    filePath: filePath
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result)
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                        }
                    }
                }
            })
        },
        removeStudentDocument: function (docId, callback) {
            var id = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'students/' + id + '/document/' + docId + '/remove?token=' + Hsis.token,
                type: 'POST',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result)
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                        }
                    }
                }
            })
        },
        editStudentDocument: function (document, callback) {
            var id = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'students/' + id + '/document/' + document.id + '/edit?token=' + Hsis.token,
                type: 'POST',
                data: document,
                beforeSend: function (xhr) {
                    $('#main-div .edit-document-submit').attr('disabled', 'disabled');
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result)
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                        }
                    }
                },
                complete: function () {
                    $('#main-div .edit-document-submit').removeAttr('disabled');
                }
            })
        },
        addStudentFiles: function (docId, formData, callback) {
            var id = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'students/' + id + '/document/' + docId + '/file/add?token=' + Hsis.token,
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                beforeSend: function (xhr) {
                    $('#main-div .add-doc-file').attr('disabled', 'disabled');
                    $('#main-div .add-past-edu-doc-file').attr('disabled', 'disabled');
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result)
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                        }
                    }
                },
                complete: function () {
                    $('#main-div .add-doc-file').removeAttr('disabled');
                    $('#main-div .add-past-edu-doc-file').removeAttr('disabled');
                }
            })
        },
        addStudentDocument: function (document, callback) {
            var id = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'students/' + id + '/document/add?token=' + Hsis.token,
                type: 'POST',
                data: document,
                beforeSend: function () {
                    $('#main-div #past_edu_doc_confirm').attr('disabled', 'disabled');
                    $('#main-div .add-document-submit').attr('disabled', 'disabled');
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result)
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                        }
                    }
                },
                complete: function () {
                    $('#main-div #past_edu_doc_confirm').removeAttr('disabled');
                    $('#main-div .add-document-submit').removeAttr('disabled');
                }
            })

        },
        loadTeachers: function (page, queryParams, callback, before) {
            $.ajax({
                url: Hsis.urls.HSIS + 'teachers?token=' + Hsis.token + (queryParams ? '&' + queryParams : '') + (page ? '&page=' + page : ''),
                type: 'GET',
                beforeSend: function () {
                    if (before) {
                        $('#main-div li.sub-module-item').attr('data-attr', 1);
                    }
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                Hsis.Service.parseTeachers(result.data, page);
                                if (callback)
                                    callback(result.data);
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;


                        }


                    }
                },
                complete: function () {
                    $('#main-div li.sub-module-item').removeAttr('data-attr');
                    $('.module-block[data-id="1000010"]').removeAttr('data-check');
                }
            })
        },
        loadStaffTable: function (page, queryParams, callback, before) {
            $.ajax({
                url: Hsis.urls.HSIS + 'teachers?statusId=1000340&token=' + Hsis.token + (queryParams ? '&' + queryParams : '') + (page ? '&page=' + page : ''),
                type: 'GET',
                beforeSend: function () {
                    if (before) {
                        $('#main-div li.sub-module-item').attr('data-attr', 1);
                    }
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                Hsis.Service.parseStaffTable(result.data, page);
                                if (callback)
                                    callback(result.data);
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;


                        }


                    }
                },
                complete: function () {
                    $('#main-div li.sub-module-item').removeAttr('data-attr');
                    $('.module-block[data-id="1000135"]').removeAttr('data-check');
                }
            })
        },
        loadForeignTeachers: function (page, queryParams, callback, before) {
            $.ajax({
                url: Hsis.urls.HSIS + 'teachers/foreign?token=' + Hsis.token + (queryParams ? '&' + queryParams : '') + (page ? '&page=' + page : ''),
                type: 'GET',
                beforeSend: function () {
                    if (before) {
                        $('#main-div li.sub-module-item').attr('data-attr', 1);
                    }
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                Hsis.Service.parseForeignTeachers(result.data, page);
                                if (callback)
                                    callback(result.data);
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;


                        }


                    }
                },
                complete: function () {
                    $('#main-div li.sub-module-item').removeAttr('data-attr');
                    $('.module-block[data-id="1000010"]').removeAttr('data-check');
                }
            })
        },
        removeTeacher: function (id, callback) {

            $.ajax({
                url: Hsis.urls.HSIS + 'teachers/' + id + '/remove?token=' + Hsis.token,
                type: 'POST',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                if (callback) {
                                    callback();
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }


                    }
                },
                complete: function () {
                    $('.main-content-upd #buttons_div').removeAttr('data-id');
                    var params = $('.main-content-upd .teacher-search-form').serialize() + '&subModuleId=' + Hsis.subModuleId;
                    Hsis.Proxy.loadTeachers('', params);
                }
            })
        },
        addTeacher: function (formData) {
            $.ajax({
                url: Hsis.urls.HSIS + 'teachers/add?token=' + Hsis.token,
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                beforeSend: function () {
                    $('#main-div #confirmTeacher').attr('data-check', '1');
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                }, 1);
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'login?appId=' + Hsis.appId;
                                break;

                        }
                    }
                },
                complete: function () {
                    $('#main-div #confirmTeacher').attr('data-check', '0');

                }
            });
        },
        addAcceptedTeacher: function (personId, formData) {
            $.ajax({
                url: Hsis.urls.HSIS + 'teachers/add/' + personId + '?token=' + Hsis.token,
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                beforeSend: function () {
                    $('#main-div #confirmTeacher').attr('disabled', 'disabled');
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'login?appId=' + Hsis.appId;
                                break;

                        }
                    }
                },
                complete: function () {
                    $('#main-div #confirmTeacher').removeAttr('disabled');
                }
            });
        },
        getTeacherDetails: function (id, callback) {
            var data = {};
            $.ajax({
                url: Hsis.urls.HSIS + 'teachers/' + id + '?token=' + Hsis.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                data = result.data;
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }


                    }
                },
                complete: function () {
                    callback(data);
                }
            })
        },
        addTeacherContact: function (teacherId, contact, callback) {
            $.ajax({
                url: Hsis.urls.HSIS + 'teachers/' + teacherId + '/contacts/add?token=' + Hsis.token,
                type: 'POST',
                data: contact,
                beforeSend: function () {
                    $('#main-div .btn-contact-modal-submit').attr('disabled', 'disabled');
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result);
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }


                    }
                },
                complete: function () {
                    $('#main-div .btn-contact-modal-submit').removeAttr('disabled');
                }
            });
        },
        editContactTeacher: function (contact, callback) {
            var id = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'teachers/' + id + '/contact/edit?token=' + Hsis.token,
                type: 'POST',
                data: contact,
                beforeSend: function () {
                    $('#main-div .btn-contact-modal-submit').attr('disabled', 'disabled');
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.OK:


                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result);
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }


                    }
                },
                complete: function () {
                    $('#main-div .btn-contact-modal-submit').removeAttr('disabled');
                }
            })
        },
        removeTeacherContact: function (contactId, callback) {
            var id = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'teachers/' + id + '/contacts/' + contactId + '/remove?token=' + Hsis.token,
                type: 'POST',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.OK:

                                callback(result);
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }


                    }
                }
            });
        },
        editCommonInfoTeacher: function (formData, callback) {
            var id = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'teachers/' + id + '/commonInfo/edit?token=' + Hsis.token,
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                beforeSend: function () {
                    $('#main-div .edit-common-info').attr('disabled', 'disabled');
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.OK:


                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                if (callback) {
                                    callback(result);
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }


                    }
                },
                complete: function () {
                    cropForm = new FormData();
                    $('#main-div .edit-common-info').removeAttr('disabled');
                }
            })
        },
        editTeacherAddress: function (address, callback) {
            var id = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'teachers/' + id + '/address/' + address.id + '/edit?token=' + Hsis.token,
                type: 'POST',
                data: address,
                beforeSend: function () {
                    $('#main-div #get_permanent_address_edit').attr('disabnled', 'disabled');
                    $('#main-div #get_temporary_address_edit').attr('disabnled', 'disabled');
                    $('#main-div #get_birth_place_edit').attr('disabnled', 'disabled');
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:


                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result.code);
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                },
                complete: function () {
                    $('#main-div #get_permanent_address_edit').removeAttr('disabled');
                    $('#main-div #get_temporary_address_edit').removeAttr('disabled');
                    $('#main-div #get_birth_place_edit').removeAttr('disabled');
                }
            })
        },
        addTeacherDocument: function (document, callback) {
            var id = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'teachers/' + id + '/document/add?token=' + Hsis.token,
                type: 'POST',
                data: document,
                beforeSend: function (xhr) {
                    $('#main-div .add-document-submit').attr('disabled', 'disabled');
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result)
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                        }
                    }
                },
                complete: function (jqXHR, textStatus) {
                    $('#main-div .add-document-submit').removeAttr('disabled');
                }
            })

        },
        addTeacherFiles: function (docId, formData, callback) {
            var id = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'teachers/' + id + '/document/' + docId + '/file/add?token=' + Hsis.token,
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result)
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                        }
                    }
                }
            })
        },
        removeTeacherDocument: function (docId, callback) {
            var id = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'teachers/' + id + '/document/' + docId + '/remove?token=' + Hsis.token,
                type: 'POST',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result)
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                        }
                    }
                }
            })
        },
        editTeacherDocument: function (document, callback) {
            var id = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'teachers/' + id + '/document/' + document.id + '/edit?token=' + Hsis.token,
                type: 'POST',
                data: document,
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result)
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                        }
                    }
                }
            })
        },
        getTeacherContactDetails: function (id, callback) {
            var data = {};
            $.ajax({
                url: Hsis.urls.HSIS + 'teachers/' + id + '/contactDetails?token=' + Hsis.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                data = result.data;
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }


                    }
                },
                complete: function () {
                    callback(data);
                }
            })
        },
        getTeacherAddressDetails: function (id, callback) {
            var data = {};
            $.ajax({
                url: Hsis.urls.HSIS + 'teachers/' + id + '/addressDetails?token=' + Hsis.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                data = result.data;
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }


                    }
                },
                complete: function () {
                    callback(data);
                }
            })
        },
        getStudentContactDetails: function (id, callback) {
            var data = {};
            $.ajax({
                url: Hsis.urls.HSIS + 'students/' + id + '/contactDetails?token=' + Hsis.token,
                type: 'GET',
                beforeSend: function () {
                    NProgress.start();
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                data = result.data;
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }


                    }
                },
                complete: function () {
                    callback(data);

                    NProgress.done();
                }
            })
        },
        getStudentAddressDetails: function (id, callback) {
            var data = {};
            $.ajax({
                url: Hsis.urls.HSIS + 'students/' + id + '/addressDetails?token=' + Hsis.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                data = result.data;
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }


                    }
                },
                complete: function () {
                    callback(data);
                }
            })
        },
        getStudentCommonDetails: function (callback) {
            var id = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'students/' + id + '/commonDetails?token=' + Hsis.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                callback(result);
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }


                    }
                }
            })
        },
        getTeacherCommonDetails: function (callback) {
            var id = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'teachers/' + id + '/commonDetails?token=' + Hsis.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                callback(result);
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }


                    }
                }
            })
        },
        removeStudentImage: function (callback) {
            var id = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'students/' + id + '/image/remove?token=' + Hsis.token,
                type: 'POST',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.OK:


                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result);
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }


                    }
                }
            })
        },
        removeTeacherImage: function (callback) {
            var id = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'teachers/' + id + '/image/remove?token=' + Hsis.token,
                type: 'POST',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.OK:


                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result);
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }


                    }
                }
            })
        },
        searchStudent: function (page, query, callback) {
            $.ajax({
                url: Hsis.urls.HSIS + 'students?token=' + Hsis.token + (query ? '&' + query : '') + (page ? '&page=' + page : ''),
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                if (result.data) {
                                    var div = $('.space-for-footer .flex-input');
                                    if (div.html().trim().length == 0) {
                                        var html = '<button  data-i18n="load.more" data-table="students" class="btn loading-margins btn-load-more">' + Hsis.dictionary[Hsis.lang]['load.more'] + '</button>';
                                        div.html(html);
                                    }
                                }
                                Hsis.Service.parseStudents(result.data, page);
                                if (callback)
                                    callback(result.data);
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                }

            })
        },
        searchforeignStudents: function (page, query, callback) {
            $.ajax({
                url: Hsis.urls.HSIS + 'students/foreign?token=' + Hsis.token + (query ? '&' + query : '') + (page ? '&page=' + page : ''),
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                if (result.data) {
                                    var div = $('.space-for-footer .flex-input');
                                    if (div.html().trim().length == 0) {
                                        var html = '<button  data-i18n="load.more" data-table="students" class="btn loading-margins btn-load-more">' + Hsis.dictionary[Hsis.lang]['load.more'] + '</button>';
                                        div.html(html);
                                    }
                                }
                                Hsis.Service.parseForeignStudents(result.data, page);
                                if (callback)
                                    callback(result.data);
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                }

            })
        },
        searchTeacher: function (page, query, callback) {
            $.ajax({
                url: Hsis.urls.HSIS + 'teachers?token=' + Hsis.token + (query ? '&' + query : '') + (page ? '&page=' + page : ''),
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                if (result.data) {
                                    var div = $('.space-for-footer .flex-input');
                                    if (div.html().trim().length == 0) {
                                        var html = '<button  data-i18n="load.more" data-table="teachers" class="btn loading-margins btn-load-more">' + Hsis.dictionary[Hsis.lang]['load.more'] + '</button>';
                                        div.html(html);
                                    }
                                }

                                Hsis.Service.parseTeachers(result.data, page);
                                if (callback)
                                    callback(result.data);
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                },
            })
        },
        editTeacherAcademicInfo: function (acaInfo, callback) {
            var id = $('#main-div').attr('data-id');

            $.ajax({
                url: Hsis.urls.HSIS + 'teachers/' + id + '/academicInfo/edit?token=' + Hsis.token,
                type: 'POST',
                data: acaInfo,
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result);
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                }
            })
        },
        editStudentGraduationInfo: function (graduationInfo) {
            var id = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'students/' + id + '/graduationInfo/edit?token=' + Hsis.token,
                type: 'POST',
                data: {
                    pelcId: graduationInfo.pelcId,
                    actionDate: graduationInfo.actionDate,
                    graduationOrgId: graduationInfo.graduationOrgId,
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:


                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                }
            })
        },
        getFilteredStructureList: function (parentId, typeId, addressTreeId, callback, fullInfoFlag, children) {
            var structure = {};
            $.ajax({
                url: Hsis.urls.HSIS + 'structures/filter?parentId=' + parentId + '&typeId=' + typeId + '&addressTreeId=' + addressTreeId + '&token=' + Hsis.token + '&fullInfoFlag=' + (fullInfoFlag ? fullInfoFlag : '0') + '&children=' + (children ? children : '0'),
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                structure = result.data;
                                callback(structure);
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                }

            });

        },
        addTeacherLanguages: function (form, callback) {
            var id = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'teachers/' + id + '/languages/add?token=' + Hsis.token,
                type: 'POST',
                data: form,
                beforeSend: function (xhr) {
                    $('#main-div .submit-subject').attr('disabled', 'disabled');
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result);
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'login?appId=' + Hsis.appId;
                                break;

                        }
                    }
                },
                complete: function (jqXHR, textStatus) {
                    $('#main-div .submit-subject').removeAttr('disabled');
                }
            });
        },
        addTeacherSubjects: function (form, callback) {
            var id = $('.main-content-upd #buttons_div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'teachers/' + id + '/subjects/add?token=' + Hsis.token,
                type: 'POST',
                data: form,
                beforeSend: function (xhr) {
                    $('#main-div .submit-subject').attr('disabled', 'disabled');
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result);
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'login?appId=' + Hsis.appId;
                                break;

                        }
                    }
                },
                complete: function (jqXHR, textStatus) {
                    $('#main-div .submit-subject').removeAttr('disabled');
                }
            });
        },
        getTeacherLanguages: function (callback) {
            var id = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'teachers/' + id + '/languages?token=' + Hsis.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                callback(result);
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'login?appId=' + Hsis.appId;
                                break;

                        }
                    }
                }
            })
        },
        getTeacherSubjects: function (callback) {
            var id = $('.main-content-upd #buttons_div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'teachers/' + id + '/subjects?token=' + Hsis.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                callback(result);
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'login?appId=' + Hsis.appId;
                                break;

                        }
                    }
                }
            })
        },
        removeTeacherLanguage: function (id, callback) {
            var personId = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'teachers/' + personId + '/language/' + id + '/remove?token=' + Hsis.token,
                type: 'POST',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result);
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'login?appId=' + Hsis.appId;
                                break;

                        }
                    }
                }
            });
        },
        removeTeacherSubject: function (id, callback) {
            var personId = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'teachers/' + personId + '/subject/' + id + '/remove?token=' + Hsis.token,
                type: 'POST',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result);
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'login?appId=' + Hsis.appId;
                                break;

                        }
                    }
                }
            });
        },
        editTeacherWorkInfo: function (work, callback) {
            var personId = $('#main-div').attr('data-id');

            $.ajax({
                url: Hsis.urls.HSIS + 'teachers/' + personId + '/workInfo/edit?token=' + Hsis.token,
                type: 'POST',
                data: work,
                beforeSend: function (xhr) {
                    $('#main-div .edit-work-lifecycle-modal-submit').attr('disabled', 'disabled');
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result);
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'login?appId=' + Hsis.appId;
                                break;

                        }
                    }
                },
                complete: function (jqXHR, textStatus) {
                    $('#main-div .edit-work-lifecycle-modal-submit').removeAttr('disabled');
                }
            });
        },
        addTeacherEduLifeCycle: function (eduLifeCycle, callback) {
            var personId = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'teachers/' + personId + '/eduLifeCycle/add?token=' + Hsis.token,
                type: 'POST',
                data: eduLifeCycle,
                beforeSend: function (xhr) {
                    $('#main-div .btn-add-edu-info').attr('disabled', 'disabled');
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result);
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'login?appId=' + Hsis.appId;
                                break;

                        }
                    }
                },
                complete: function (jqXHR, textStatus) {
                    $('#main-div .btn-add-edu-info').removeAttr('disabled');
                }
            });
        },
        editTeacherEduLifeCycle: function (eduLifeCycle, callback) {
            var personId = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'teachers/' + personId + '/eduLifeCycle/edit?token=' + Hsis.token,
                type: 'POST',
                data: eduLifeCycle,
                beforeSend: function (xhr) {
                    $('#main-div .btn-add-edu-info').attr('disabled', 'disabled');
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result);
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'login?appId=' + Hsis.appId;
                                break;

                        }
                    }
                },
                complete: function (jqXHR, textStatus) {
                    $('#main-div .btn-add-edu-info').removeAttr('disabled');
                }
            });
        },
        removeTeacherEduLifeCycle: function (id, callback) {
            var personId = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'teachers/' + personId + '/eduLifeCycle/' + id + '/remove?token=' + Hsis.token,
                type: 'POST',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result);
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'login?appId=' + Hsis.appId;
                                break;

                        }
                    }
                }
            });
        },
        confirmStudent: function (pelcId, callback) {
            var students = {};
            $.ajax({
                url: Hsis.urls.HSIS + 'students/' + pelcId + '/confirm?token=' + Hsis.token,
                type: 'POST',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                students = result.data;
                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
                complete: function () {
                    callback(students);
                }

            });
        },
        confirmTeacher: function (pwlcId, callback) {
            var teachers = {};
            $.ajax({
                url: Hsis.urls.HSIS + 'teachers/' + pwlcId + '/confirm?token=' + Hsis.token,
                type: 'POST',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                teachers = result.data;
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
                complete: function () {
                    callback(teachers);
                }

            });
        },
        addStudentRelationship: function (relation, callback) {
            var id = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'students/' + id + '/relationship/add?token=' + Hsis.token,
                type: 'POST',
                data: relation,
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result);
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                }

            });
        },
        editStudentRelationship: function (relation, callback) {
            var id = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'students/' + id + '/relationship/edit?token=' + Hsis.token,
                type: 'POST',
                data: relation,
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result);
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                }

            });
        },
        removeStudentRelationship: function (relation, callback) {
            var id = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'students/' + id + '/relationship/remove?token=' + Hsis.token,
                type: 'POST',
                data: relation,
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result);
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                }

            });
        },
        addTeacherAcademicDegree: function (degree, callback) {
            var id = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'teachers/' + id + '/academicDegree/add?token=' + Hsis.token,
                type: 'POST',
                data: degree,
                beforeSend: function (xhr) {
                    $('#main-div .teacher-academic-degree-modal-submit').attr('disabled', 'disabled');
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result);
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
                complete: function (jqXHR, textStatus) {
                    $('#main-div .teacher-academic-degree-modal-submit').removeAttr('disabled');
                }

            });
        },
        editTeacherAcademicDegree: function (degree, callback) {
            var id = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'teachers/' + id + '/academicDegree/edit?token=' + Hsis.token,
                type: 'POST',
                data: degree,
                beforeSend: function (xhr) {
                    $('#main-div .teacher-academic-degree-modal-submit').attr('disabled', 'disabled');
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result);
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
                complete: function (jqXHR, textStatus) {
                    $('#main-div .teacher-academic-degree-modal-submit').removeAttr('disabled');
                }

            });
        },
        removeTeacherAcademicDegree: function (degree, callback) {
            var id = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'teachers/' + id + '/academicDegree/remove?token=' + Hsis.token,
                type: 'POST',
                data: degree,
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result);
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                }

            });
        },
        addTeacherAcademicActivity: function (activity, callback) {
            var id = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'teachers/' + id + '/academicActivity/add?token=' + Hsis.token,
                type: 'POST',
                data: activity,
                beforeSend: function (xhr) {
                    $('#main-div .teacher-research-history-modal-submit').attr('disabled', 'disabled');
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result);
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
                complete: function (jqXHR, textStatus) {
                    $('#main-div .teacher-research-history-modal-submit').removeAttr('disabled');
                }

            });
        },
        editTeacherAcademicActivity: function (activity, callback) {
            var id = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'teachers/' + id + '/academicActivity/edit?token=' + Hsis.token,
                type: 'POST',
                data: activity,
                beforeSend: function (xhr) {
                    $('#main-div .teacher-research-history-modal-submit').attr('disabled', 'disabled');
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result);
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
                complete: function (jqXHR, textStatus) {
                    $('#main-div .teacher-research-history-modal-submit').removeAttr('disabled');
                }
            });
        },
        removeTeacherAcademicActivity: function (activity, callback) {
            var id = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'teachers/' + id + '/academicActivity/remove?token=' + Hsis.token,
                type: 'POST',
                data: activity,
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result);
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                }

            });
        },
        getStudentDetailsByPinCode: function (pincode, callback) {
            $.ajax({
                url: Hsis.urls.HSIS + 'students/pincode/' + pincode + '/details?token=' + Hsis.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                callback(result);
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });

                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                }

            });
        },
        getStudentByPinCode: function (pincode, callback) {
            $.ajax({
                url: Hsis.urls.HSIS + 'students/pincode/' + pincode + '?token=' + Hsis.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                callback(result);
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                }

            });
        },
        addAcceptedStudent: function (studentFormData, personId) {
            $.ajax({
                url: Hsis.urls.HSIS + 'students/' + personId + '/add?token=' + Hsis.token,
                type: 'POST',
                data: studentFormData,
                contentType: false,
                processData: false,
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                }
            });

        },
        getStudentActionDetails: function (id, callback) {
            $.ajax({
                url: Hsis.urls.HSIS + 'students/action/' + id + '?token=' + Hsis.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                callback(result);
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                }
            });

        },

        //get uni college

        // getUniActionDetails: function (id, callback) {
        //     $.ajax({
        //         url: Hsis.urls.HSIS + 'students/action/' + id + '?token=' + Hsis.token,
        //         type: 'GET',
        //         success: function (result) {
        //             if (result) {
        //                 switch (result.code) {
        //                     case Hsis.statusCodes.OK:
        //                         callback(result);
        //                         break;
        //
        //                     case Hsis.statusCodes.ERROR:
        //                         $.notify(Hsis.dictionary[Hsis.lang]['error'], {
        //                             type: 'danger'
        //                         });
        //                         break;
        //
        //                     case Hsis.statusCodes.UNAUTHORIZED:
        //                         window.location = Hsis.urls.ROS + 'unauthorized';
        //                         break;
        //
        //                 }
        //             }
        //         }
        //     });
        //
        // },


        changePassword: function (pass, callback) {
            $.ajax({
                url: Hsis.urls.AdminRest + 'users/changePassword?token=' + Hsis.token,
                type: 'POST',
                data: pass,
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                callback(result);
                                break;

                            case Hsis.statusCodes.INVALID_PARAMS:
                                callback(result);
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                }
            });
        },
        getSpecialityNames: function (callback) {
            var specialities = {};
            $.ajax({
                url: Hsis.urls.AdminRest + 'settings/specialities?token=' + Hsis.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                specialities = result.data;
                                break;


                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                },
                complete: function () {
                    if (callback) {
                        callback(specialities);
                    }
                }
            });
        },
        getOrgAddress: function (id, callback) {
            var address = {};
            $.ajax({
                url: Hsis.urls.HSIS + 'structures/' + id + '/address?token=' + Hsis.token,
                type: 'GET',
                success: function (result) {

                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                address = result.data;
                                break;


                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                },
                complete: function () {
                    if (callback) {
                        callback(address);
                    }
                }


            })
        },
        getTeacherByPincode: function (pincode, callback) {

            $.ajax({
                url: Hsis.urls.HSIS + 'teachers/pincode/' + pincode + '?token=' + Hsis.token,
                type: 'GET',
                success: function (result) {

                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                callback(result.data);
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                }
            })
        },
        getTeacherDetailsByPincode: function (pincode, callback) {

            $.ajax({
                url: Hsis.urls.HSIS + 'teachers/details/pincode/' + pincode + '?token=' + Hsis.token,
                type: 'GET',
                success: function (result) {

                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                callback(result);
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                }
            })
        },
        addPersoneduLifeCycle: function (eduLifeCycle, personId, callback) {
            $.ajax({
                url: Hsis.urls.HSIS + 'students/edulifecycle/' + personId + '/add?token=' + Hsis.token,
                type: 'POST',
                data: eduLifeCycle,
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                callback(result.data);
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                }
            })

        },
        getStudentInfoByTQDK: function (pincode, callback) {

            $.ajax({
                url: Hsis.urls.HSIS + 'students/pincode/' + pincode + '/tqdkDetails?token=' + Hsis.token,
                type: 'GET',
                success: function (result) {

                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                callback(result);
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                }
            })
        },
        getDictionaryStructureTypes: function (callback) {

            $.ajax({
                url: Hsis.urls.AdminRest + 'settings/dictionaries?structureAttr=1&token=' + Hsis.token,
                type: 'GET',
                success: function (result) {

                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                callback(result);
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                }
            })
        },
        removeEduLifeCycle: function (pelcId, callback) {
            $.ajax({
                url: Hsis.urls.HSIS + 'students/edulifecycle/' + pelcId + '/remove?token=' + Hsis.token,
                type: 'POST',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                if (callback) {
                                    callback();
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }

                }

            });

        },
        getOrgsWithoutSchools: function (callback, container) {
            var tree = {};
            $.ajax({
                url: Hsis.urls.HSIS + 'structures/universities?token=' + Hsis.token,
                type: 'GET',
                global: false,
                beforeSend: function () {
                    if (typeof container !== "undefined") {
                        //                       var obj = $('.small-loading').clone().toggleClass('small-loading tree-preloader').removeClass('hidden');
                        //                       container.before(obj);
                        $('.btn.tree-modal').attr('data-check', 1);
                    }
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                tree = data.data;
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
                complete: function () {
                    callback(tree);
                    // $('.module-block[data-id="1000009"]').removeAttr('data-check');
                    $('.btn.tree-modal').attr('data-check');

                }
            })
        },
        getAcademicGroupForSelect: function (params, callback) {
            $.ajax({
                url: Hsis.urls.HSIS + 'groups/select?token=' + Hsis.token + (params ? '&' + params : ''),
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                break;

                            case Hsis.statusCodes.OK:
                                if (callback) {
                                    callback(result.data);
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
            })
        },
        getEduYears: function (callback) {
            $.ajax({
                url: Hsis.urls.REPORT + 'graphicsReport/year?token=' + Hsis.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                if (callback) {
                                    callback(result.data);
                                }

                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;


                        }
                    }

                }
            });
        },
        getOrgPlanByOrgId: function (id, callback) {
            $.ajax({
                url: Hsis.urls.HSIS + 'structures/' + id + '/plan?token=' + Hsis.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                if (callback) {
                                    callback(result.data);
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                }
            })
        },
        addOrgPlan: function (plan, callback) {
            $.ajax({
                url: Hsis.urls.HSIS + 'structures/plan/add?token=' + Hsis.token,
                type: 'POST',
                data: plan,
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                if (callback) {
                                    callback();
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                }
            })
        },
        editOrgPlan: function (id, plan, callback) {
            $.ajax({
                url: Hsis.urls.HSIS + 'structures/plan/' + id + '/edit?token=' + Hsis.token,
                type: 'POST',
                data: plan,
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                if (callback) {
                                    callback();
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                }
            })
        },
        removeOrgPlan: function (id, callback) {
            $.ajax({
                url: Hsis.urls.HSIS + 'structures/plan/' + id + '/remove?token=' + Hsis.token,
                type: 'POST',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                if (callback) {
                                    callback();
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                }
            })
        },
        addOrderDocument: function (formData, callback) {

            $.ajax({
                url: Hsis.urls.HSIS + 'order/add?token=' + Hsis.token,
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                beforeSend: function (xhr) {
//                    $('#main-div #confirmStudent').attr('disabled', 'disabled');
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                if (callback) {
                                    callback(result);
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                },
                complete: function () {
//                    $('#main-div #confirmStudent').removeAttr('disabled');
                }
            });
        },
        getOrderList: function (page, form, callback) {
            $.ajax({
                url: Hsis.urls.HSIS + 'order?token=' + Hsis.token + (page ? '&page=' + page : ''),
                type: 'GET',
                data: form,
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000093"]').attr('data-check', 1);
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                Hsis.Service.parseOrder(result.data, page);
                                if (callback) {
                                    callback(result.data);
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
                complete: function (jqXHR, textStatus) {
                    $('.module-block[data-id="1000093"]').removeAttr('data-check');
                }
            })
        },
        getOrderDetails: function (id, callback) {
            $.ajax({
                url: Hsis.urls.HSIS + 'order/' + id + '?token=' + Hsis.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                if (callback) {
                                    callback(result.data);
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                }
            })
        },
        addOrderFiles: function (docId, formData, callback) {
            var id = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'order/' + docId + '/file/add?token=' + Hsis.token,
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                if (callback) {
                                    callback();
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                        }
                    }
                }
            })
        },
        removeOrderFiles: function (fileId, filePath, callback) {

            $.ajax({
                url: Hsis.urls.HSIS + 'order/file/' + fileId + '/remove?token=' + Hsis.token,
                type: 'POST',
                data: {
                    filePath: filePath
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                if (callback) {
                                    callback(result);
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                        }
                    }
                }
            })
        },
        editOrderDocument: function (form, callback) {

            $.ajax({
                url: Hsis.urls.HSIS + 'order/' + form.id + '/edit?token=' + Hsis.token,
                type: 'POST',
                data: form,
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                if (callback) {
                                    callback(result);
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                        }
                    }
                }
            })
        },
        removeOrderDocument: function (id, callback) {

            $.ajax({
                url: Hsis.urls.HSIS + 'order/' + id + '/remove?token=' + Hsis.token,
                type: 'POST',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                if (callback) {
                                    callback(result);
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                        }
                    }
                }
            })
        },
        addWorkLifeCycle: function (work, callback) {
            var personId = $('#main-div').attr('data-id');
            $.ajax({
                url: Hsis.urls.HSIS + 'teachers/' + personId + '/workInfo/add?token=' + Hsis.token,
                type: 'POST',
                data: work,
                beforeSend: function (xhr) {
                    $('#main-div .edit-work-lifecycle-modal-submit').attr('disabled', 'disabled');
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                if (callback) {
                                    callback(result);
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                },
                complete: function (jqXHR, textStatus) {
                    $('#main-div .edit-work-lifecycle-modal-submit').removeAttr('disabled');
                }
            });
        },
        addDiplom: function (form, callback) {

            $.ajax({
                url: Hsis.urls.HSIS + 'diplom/add?token=' + Hsis.token,
                type: 'POST',
                data: form,
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                if (callback) {
                                    callback(result);
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                        }
                    }
                }
            })
        },
        getDiplomList: function (page, form, callback) {

            $.ajax({
                url: Hsis.urls.HSIS + 'diplom?token=' + Hsis.token + (page ? '&page=' + page : ''),
                type: 'GET',
                data: form,
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000092"]').attr('data-check', 1);
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                Hsis.Service.parseDiplom(result.data, page);
                                if (callback) {
                                    callback(result.data);
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                        }
                    }
                },
                complete: function (jqXHR, textStatus) {
                    $('.module-block[data-id="1000092"]').removeAttr('data-check', 1);
                }
            })
        },
        getDiplomDetails: function (form, callback) {

            $.ajax({
                url: Hsis.urls.HSIS + 'diplom/details?token=' + Hsis.token,
                type: 'GET',
                data: form,
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                if (callback) {
                                    callback(result.data);
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                        }
                    }
                }
            })
        },
        removeDiplom: function (id, callback) {

            $.ajax({
                url: Hsis.urls.HSIS + 'diplom/' + id + '/remove?token=' + Hsis.token,
                type: 'POST',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                if (callback) {
                                    callback(result);
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                        }
                    }
                }
            })
        },
        getTechnicalBaseList: function (page, form, callback) {

            $.ajax({
                url: Hsis.urls.HSIS + 'technical?token=' + Hsis.token + (page ? '&page=' + page : ''),
                type: 'GET',
                data: form,
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000094"]').attr('data-check', 1);
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                Hsis.Service.parseTechnical(result.data, page);
                                if (callback) {
                                    callback(result);
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                        }
                    }
                },
                complete: function (jqXHR, textStatus) {
                    $('.module-block[data-id="1000094"]').removeAttr('data-check', 1);
                }
            })
        },
        addTechnicalBase: function (form, callback) {

            $.ajax({
                url: Hsis.urls.HSIS + 'technical/add?token=' + Hsis.token,
                type: 'POST',
                data: form,
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                if (callback) {
                                    callback(result);
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                        }
                    }
                }
            })
        },
        editTechnicalBase: function (id, form, callback) {

            $.ajax({
                url: Hsis.urls.HSIS + 'technical/' + id + '/edit?token=' + Hsis.token,
                type: 'POST',
                data: form,
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                if (callback) {
                                    callback(result);
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;
                        }
                    }
                }
            })
        },
        removeTechnicalBase: function (id, callback) {

            $.ajax({
                url: Hsis.urls.HSIS + 'technical/' + id + '/remove?token=' + Hsis.token,
                type: 'POST',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                if (callback) {
                                    callback(result);
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                        }
                    }
                }
            })
        },
        getTechnicalBaseDetails: function (id, callback) {

            $.ajax({
                url: Hsis.urls.HSIS + 'technical/' + id + '?token=' + Hsis.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                if (callback) {
                                    callback(result);
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                        }
                    }
                }
            })
        },
        getTechnicalBaseByTypeId: function (id, callback) {

            $.ajax({
                url: Hsis.urls.HSIS + 'technical/type/' + id + '?token=' + Hsis.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                if (callback) {
                                    callback(result);
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                        }
                    }
                }
            })
        },
        getOrgAdministrativeData: function (id, callback) {
            $.ajax({
                url: Hsis.urls.HSIS + 'structures/' + id + '/administrative?token=' + Hsis.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                if (callback) {
                                    callback(result.data);
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                }
            })
        },
        getOrderDocumentsByType: function (id, orgId, callback) {
            $.ajax({
                url: Hsis.urls.HSIS + 'order/type/' + id + '?token=' + Hsis.token,
                type: 'GET',
                data: {
                    orgId: orgId
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                if (callback) {
                                    callback(result.data);
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }

                }
            });

        },
        getForeignAddressTree: function (callback, container) {
            var tree = {};
            $.ajax({
                url: Hsis.urls.HSIS + 'foreign/addresses/?token=' + Hsis.token,
                type: 'GET',
                beforeSend: function () {
                    if (typeof container !== "undefined") {
                        //                       var obj = $('.small-loading').clone().toggleClass('small-loading tree-preloader').removeClass('hidden');
                        //                       container.before(obj);
                        $('.btn.tree-modal').attr('data-check', 1);
                    }
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                tree = result.data;
                                break;
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
                complete: function () {
                    callback(tree);
                    // $('.module-block[data-id="1000105"]').removeAttr('data-check');
                    $('.btn.tree-modal').attr('data-check');
                }
            });
        },
        getStudentsInAbroad: function (page, queryParams, callback) {

            $.ajax({
                url: Hsis.urls.HSIS + 'foreign/students?token=' + Hsis.token + (queryParams ? '&' + queryParams : '') + (page ? '&page=' + page : ''),
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                Hsis.Service.parseStudentsInAbroad(result.data, page);
                                if (callback)
                                    callback(result.data);
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
                complete: function () {
                    // $('.module-block[data-id="1000105"]').removeAttr('data-check');
                }
            })
        },
        loadForeignStudents: function (page, queryParams, callback, before) {

            $.ajax({
                url: Hsis.urls.HSIS + 'students/foreign?token=' + Hsis.token + (queryParams ? '&' + queryParams : '') + (page ? '&page=' + page : ''),
                type: 'GET',
                beforeSend: function () {
                    if (before) {

                    }

                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                Hsis.Service.parseForeignStudents(result.data, page);
                                $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12');
                                $('body').find('.col-sm-4.info').fadeOut(1).css('right', '-100%');
                                if (callback)
                                    callback(result.data);
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }


                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000113"]').removeAttr('data-check');
                }
            })
        },
        getStructureListByFilter: function (id, levelId, callback) {

            $.ajax({
                url: Hsis.urls.HSIS + 'structures/allFilter?token=' + Hsis.token,
                type: 'GET',
                data: {
                    parentId: id ? id : 0,
                    levelId: levelId ? levelId : 0
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                if (callback) {
                                    callback(result.data);
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                        }
                    }
                }
            })
        },
        getOrderAdvancedSearch: function (typeId, orgId, eduYearId, callback) {

            $.ajax({
                url: Hsis.urls.HSIS + 'order/type/' + typeId + '?token=' + Hsis.token + '&orgId=' + orgId + '&eduYearId=' + eduYearId,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                if (callback) {
                                    callback(result);
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                        }
                    }
                }
            })
        },
        getStructureListByAdress: function (id, callback) {

            $.ajax({
                url: Hsis.urls.HSIS + 'structures/address/' + id + '?token=' + Hsis.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                if (callback) {
                                    callback(result);
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                        }
                    }
                }
            })
        },
        getStructureListByAdressandType: function (id, type, callback) {
            $.ajax({
                url: Hsis.urls.HSIS + 'structures/address/' + id + '?orgType=' + type + '&token=' + Hsis.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                if (callback) {
                                    callback(result);
                                }
                                break;
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                        }
                    }
                }
            })
        },


        loadDictionariesByTypeCode: function (parentCode, callback) {
            var form = {
                parentCode: parentCode
            }
            $.ajax({
                url: Hsis.urls.AdminRest + 'settings/dictionaries/type?token=' + Hsis.token,
                type: 'GET',
                data: form,
                success: function (result) {
                    try {
                        if (result) {
                            switch (result.code) {
                                case Hsis.statusCodes.OK:
                                    if (callback) {
                                        callback(result.data)
                                    }

                                    break;

                                case Hsis.statusCodes.ERROR:
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Hsis.statusCodes.UNAUTHORIZED:

                                    window.location = Hsis.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                }

            });
        },
        getStudentsInAbroad: function (page, queryParams, callback) {

            $.ajax({
                url: Hsis.urls.HSIS + 'foreign/students?token=' + Hsis.token + (queryParams ? '&' + queryParams : '') + (page ? '&page=' + page : ''),
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                Hsis.Service.parseStudentsInAbroad(result.data, page);
                                if (callback)
                                    callback(result.data);
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
                complete: function () {
                    // $('.module-block[data-id="1000105"]').removeAttr('data-check');
                }
            })
        },
        getStudentsWithoutOrder: function (form, callback, page) {
            $.ajax({
                url: Hsis.urls.HSIS + 'students/withoutOrder?token=' + Hsis.token + (page ? '&page=' + page : ''),
                type: 'GET',
                data: form,
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;
                            case Hsis.statusCodes.OK:
                                // Hsis.Service.parseStudentsInAbroad(result.data, page);
                                if (callback)
                                    callback(result.data);
                                break;
                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
            });
        },
        getStudentsWithOrder: function (form, callback, page) {
            $.ajax({
                url: Hsis.urls.HSIS + 'students/withOrder?token=' + Hsis.token + (page ? '&page=' + page : ''),
                type: 'GET',
                data: form,
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;
                            case Hsis.statusCodes.OK:
                                // Hsis.Service.parseStudentsInAbroad(result.data, page);
                                console.log(result.data);
                                if (callback)
                                    callback(result.data);
                                break;
                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
            });
        },
        addOrderToStudents: function (form, callback) {
            $.ajax({
                url: Hsis.urls.HSIS + 'students/order/add?token=' + Hsis.token,
                type: 'POST',
                dataType: 'json',
                data: form,
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;
                            case Hsis.statusCodes.OK:
                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                if (callback) {
                                    callback();
                                }
                                break;
                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }

                }
            });
        },

        getForeignRelationList: function (page, form, callback) {

            $.ajax({
                url: Hsis.urls.HSIS + 'foreignRelation?token=' + Hsis.token + (page ? '&page=' + page : ''),
                type: 'GET',
                data: form,
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000116"]').attr('data-check', 1);
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                Hsis.Service.parseForeignRelation(result.data.foreignRelation, page);
                                $('#main-div .data-foreign-relation-count').text(result.data.count);
                                if (callback) {
                                    callback(result);
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                        }
                    }
                },
                complete: function (jqXHR, textStatus) {
                    $('.module-block[data-id="1000116"]').removeAttr('data-check', 1);
                }
            })
        },

        addForeignRelation: function (form, callback) {

            $.ajax({
                url: Hsis.urls.HSIS + 'foreignRelation/add?token=' + Hsis.token,
                type: 'POST',
                data: form,
                beforeSend: function (xhr) {
                    $('#main-div .add-foreign-relation-submit').attr('disabled', 'disabled');
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                if (callback) {
                                    callback(result);
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                        }
                    }
                },
                complete: function (jqXHR, textStatus) {
                    $('#main-div .add-foreign-relation-submit').removeAttr('disabled');
                }
            })
        },

        editForeignRelation: function (id, form, callback) {

            $.ajax({
                url: Hsis.urls.HSIS + 'foreignRelation/' + id + '/edit?token=' + Hsis.token,
                type: 'POST',
                data: form,
                beforeSend: function (xhr) {
                    $('#main-div .add-foreign-relation-submit').attr('disabled', 'disabled');
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                if (callback) {
                                    callback(result);
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                        }
                    }
                },
                complete: function (jqXHR, textStatus) {
                    $('#main-div .add-foreign-relation-submit').removeAttr('disabled');
                }
            })
        },

        removeForeignRelation: function (id, callback) {

            $.ajax({
                url: Hsis.urls.HSIS + 'foreignRelation/' + id + '/remove?token=' + Hsis.token,
                type: 'POST',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                if (callback) {
                                    callback(result);
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                        }
                    }
                }
            })
        },

        getForeignRelationDetails: function (id, callback) {

            $.ajax({
                url: Hsis.urls.HSIS + 'foreignRelation/' + id + '?token=' + Hsis.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                if (callback) {
                                    callback(result);
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                        }
                    }
                }
            })
        },
        getAllCountry: function (callback) {

            $.ajax({
                url: Hsis.urls.HSIS + 'structures/allCountry?token=' + Hsis.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                if (callback) {
                                    callback(result.data);
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                        }
                    }
                }
            })
        },
        getLastOrderByActionId: function (orgId, actionId, callback) {

            $.ajax({
                url: Hsis.urls.HSIS + 'order/action/' + actionId + '?token=' + Hsis.token + '&orgId=' + orgId,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                if (callback) {
                                    callback(result.data);
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                        }
                    }
                }
            })
        },
        getStudentListByOrderId: function (form, callback, page) {

            $.ajax({
                url: Hsis.urls.HSIS + 'students/order/' + form.orderId + '?token=' + Hsis.token + (page ? '&page=' + page : ''),
                type: 'GET',
                data: form,
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                if (callback) {
                                    callback(result.data);
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                        }
                    }
                }
            })
        },
        getStudentsDiplomListByDiplomParams: function (form, callback, page) {

            $.ajax({
                url: Hsis.urls.HSIS + 'diplom/student?token=' + Hsis.token + (page ? '&page=' + page : ''),
                type: 'GET',
                data: form,
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                if (callback) {
                                    callback(result.data);
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                        }
                    }
                }
            })
        },
        addStudentDiplom: function (form, pelcId, callback) {
            $.ajax({
                url: Hsis.urls.HSIS + 'diplom/student/add?token=' + Hsis.token + '&pelcId=' + pelcId,
                type: 'POST',
                data: form,
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                if (callback) {
                                    callback(result);
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                        }
                    }
                }
            })
        },
        removeStudentDiplom: function (form, callback) {
            $.ajax({
                url: Hsis.urls.HSIS + 'diplom/student/remove?token=' + Hsis.token,
                type: 'POST',
                data: form,
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                if (callback) {
                                    callback(result);
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                        }
                    }
                }
            })
        },
        getAllDiplomList: function (form, callback) {
            $.ajax({
                url: Hsis.urls.HSIS + 'diplom/all?token=' + Hsis.token,
                type: 'GET',
                data: form,
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                if (callback) {
                                    callback(result.data);
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                        }
                    }
                }
            })
        },

        removeStudentFromOrder: function (pelcId, orderId, callback) {
            var data;
            $.ajax({
                url: Hsis.urls.HSIS + 'students/' + pelcId + '/order/' + orderId + '/remove?token=' + Hsis.token,
                type: 'POST',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result.data);
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                }
            });
        },

        submitmOrder: function (orderId, callback) {
            var data;
            $.ajax({
                url: Hsis.urls.HSIS + 'order/' + orderId + '/confirm?token=' + Hsis.token,
                type: 'POST',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result.data);
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                }
            });
        },

        addAbroadStudentRegistrationDate: function (form, id, callback) {
            var data;
            $.ajax({
                url: Hsis.urls.HSIS + 'students/' + id + '/registration/add?token=' + Hsis.token,
                type: 'POST',
                data: form,
                beforeSend: function (xhr) {
                    $('#main-div .add-registration-date-submit').attr('disabled', 'disabled');
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result);
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
                complete: function (jqXHR, textStatus) {
                    $('#main-div .add-registration-date-submit').removeAttr('disabled');
                }
            });
        },

        addAbroadStudentAchievement: function (form, id, callback) {
            var data;
            $.ajax({
                url: Hsis.urls.HSIS + 'students/' + id + '/achievement/add?token=' + Hsis.token,
                type: 'POST',
                data: form,
                beforeSend: function (xhr) {
                    $('#main-div .add-archievement-submit').attr('disabled', 'disabled');
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result);
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
                complete: function (jqXHR, textStatus) {
                    $('#main-div .add-archievement-submit').removeAttr('disabled');
                }
            });
        },

        removeAbroadStudentRegistrationDate: function (id, regId, callback) {
            var data;
            $.ajax({
                url: Hsis.urls.HSIS + 'students/' + id + '/registration/' + regId + '/remove?token=' + Hsis.token,
                type: 'POST',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result);
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                }
            });
        },

        removeAbroadStudentAchievement: function (id, achId, callback) {
            var data;
            $.ajax({
                url: Hsis.urls.HSIS + 'students/' + id + '/achievement/' + achId + '/remove?token=' + Hsis.token,
                type: 'POST',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result);
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                }
            });
        },

        editAbroadPelc: function (id, pelcId, form, callback) {
            var data;
            $.ajax({
                url: Hsis.urls.HSIS + 'students/abroad/' + id + '/pelc/' + pelcId + '/edit?token=' + Hsis.token,
                type: 'POST',
                data: form,
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });

                                if (callback)
                                    callback(result);

                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                }
            });
        },

        getStudentEduPlanSubject: function (id, callback) {
            $.ajax({
                url: Hsis.urls.EMS + 'eduplan/pelc/' + id + '?token=' + Hsis.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                if (callback)
                                    callback(result);

                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                }
            });
        },

        editStudentEduPlanMark: function (id, form, callback) {
            $.ajax({
                url: Hsis.urls.EMS + 'eduplan/pelc/' + id + '/graduateMark/edit?token=' + Hsis.token,
                type: 'POST',
                data: form,
                beforeSend: function (xhr) {

                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                if (callback)
                                    callback(result);

                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
                complete: function (jqXHR, textStatus) {

                }
            });
        },

        loadPelcShortInfo: function (id, callback) {
            $.ajax({
                url: Hsis.urls.HSIS + 'students/shortinfo/' + id + '?token=' + Hsis.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                if (callback)
                                    callback(result.data);

                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
            });

        },
        loadDictionaryByMultiParents: function (type, parents, callback) {
            $.ajax({
                url: Hsis.urls.AdminRest + 'settings/dictionary/multipleparent?typeId=' + type + '&parents=' + parents + '&token=' + Hsis.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                if (callback)
                                    callback(result.data);

                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
            });

        },
        loadAbroadAddress: function (type, parent, callback) {
            $.ajax({
                url: Hsis.urls.AdminRest + 'settings/address/abroad?token=' + Hsis.token,
                type: 'GET',
                data: {
                    typeId: type,
                    parentId: parent
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;
                            case Hsis.statusCodes.OK:
                                if (callback)
                                    callback(result.data);
                                break;
                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
            });

        },
        getAbroadOrgByAbroadAddr: function (id, callback) {

            $.ajax({
                url: Hsis.urls.HSIS + 'structures/address/abroad/' + id + '?token=' + Hsis.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                if (callback) {
                                    callback(result.data);
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;
                        }
                    }
                }
            })
        },
        
        getUnreadNotification: function (callback) {
            $.ajax({
                url: Hsis.urls.COMMUNICATION + 'notification/unread/count?token=' + Hsis.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                
                                callback(result);
                                break;

                            case Hsis.statusCodes.INVALID_PARAMS:
                                callback(result);
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                }
            });
        },
    },
    Service: {
        parseApplications: function (applications) {
            var html = '';
            $.each(applications, function (i, v) {
                html += '<div class="col-md-4 p-l-0" title = "' + v.name[Hsis.lang] + '">' +
                    '<li class="button-item">' +
                    '<a data-id="' + v.id + '" target="_blank" class="button-icon" href="' + v.url + '?token=' + Hsis.token + '">' +
                    '<div class="flex-center">' + '<div class="' + v.iconPath + '"></div>' +
                    '<span class="button-name">' + v.shortName[Hsis.lang] + '</span>' +
                    '</div>' +
                    '</a>' +
                    '</li>' +
                    '</div>';
            });

            $('#application-list .div-application').html(html);
        },



        // loadcity parse  to module_1000131
        loadAbroadStructures: function (data, page) {
            if (data) {
                var html = '';
                var count;
                if (page) {
                    count = $('#abroad_structure_table tbody tr').length;
                } else {
                    count = 0;
                }
                    $.each(data, function (i, v) {
                        html += '<tr data-id ="' + v.id +'" data-country-id ="' + v.abroadCountry.id +'" data-city-id ="' + v.abroadCity.id +'" data-uni-name="'+v.name[Hsis.lang]+'">'+
                            '<td>' + ++i + '</td>'+
                            '<td>' + v.abroadCountry.value[Hsis.lang] + '</td>'+
                            '<td>' + v.abroadCity.value[Hsis.lang] + '</td>'+
                            '<td>' + v.name[Hsis.lang] + '</td>'+
                            '<td>'+ Hsis.Service.parseOperations(Hsis.operationList, 2) + '</td>'+
                            '</tr>';
                    });
                    if ($('#main-div #load_more_div').children().length == 0) {
                        $('#main-div #load_more_div').html('<button  data-table="abroad_structure_module" class="btn loading-margins btn-load-more">' + Hsis.dictionary[Hsis.lang]["load.more"] + '</button>');
                    }
                if (page) {
                    $('body').find('#abroad_structure_table tbody').append(html);
                } else {
                    $('body').find('#abroad_structure_table tbody').html(html);
                }
            }
        },

        //load to module_1000132
        loadAbroadAddress: function (data, page) {
            if (data) {
                var html = '';
                var count;
                if (page) {
                    count = $('#abroad-structure-address tbody tr').length;
                } else {
                    count = 0;
                }
                $.each(data, function (i, v) {
                    html += '<tr data-id ="' + v.id +'" data-country-id ="' + v.country.id +'" data-city-id ="' + v.cityName +'" >'+
                        '<td>' + ++i + '</td>'+
                        '<td>' + v.country.value[Hsis.lang] + '</td>'+
                        '<td>' + v.cityName + '</td>'+
                        '<td>'+ Hsis.Service.parseOperations(Hsis.operationList, 2) + '</td>'+
                        '</tr>';
                });
                if ($('#main-div #load_more_div').children().length == 0) {
                    $('#main-div #load_more_div').html('<button  data-table="abroad-structure-address_module" class="btn loading-margins btn-load-more">' + Hsis.dictionary[Hsis.lang]["load.more"] + '</button>');
                }
                if (page) {
                    $('body').find('#abroad-structure-address tbody').append(html);
                } else {
                    $('body').find('#abroad-structure-address tbody').html(html);
                }
            }
        },

        parseApplicationsList: function (data) {
            var html = '';
            if (data) {
                $.each(data, function (i, v) {
                    if (v.id == 1000001)
                        html += '<li data-toggle="tooltip" data-placement="bottom" title = "' + v.name[Hsis.lang] + '">' +
                            '<a data-id="' + v.id + '"  href="' + v.url + '?token=' + Hsis.token + '">' + v.shortName[Hsis.lang] + '</a>' +
                            '</li>';
                });
                Hsis.Proxy.loadSubApplications(function (data) {
                    if (data && data.data) {
                        $.each(data.data, function (i, v) {
                            html += '<li data-toggle="tooltip" data-placement="bottom" title = "' + v.name[Hsis.lang] + '">' +
                                '<a data-id="' + v.id + '"  href="' + v.url + '?token=' + Hsis.token + '">' + v.shortName[Hsis.lang] + '</a>' +
                                '</li>';
                        })
                    }

                    $('.app-con').html(html);
                    $('.app-con a[data-id="' + Hsis.appId + '"]').parent('li').addClass('active');
                    $('[data-toggle="tooltip"]').tooltip();

                    var moduleListItems = $('body').find('.app-con li');
                    console.log(moduleListItems)
                    if (moduleListItems.length > 5) {
                        $('body').find('div.app-list, .hide-menu').addClass('less-menu')
                    } else {
                        $('body').find('div.app-list, .hide-menu').removeClass('less-menu')
                    }
                })

            }

        },
        parseModules: function (modules) {
            var html = '';
            if (modules.data) {

                $.each(modules.data, function (i, v) {
                    if (v.parentId == 0) {
                        html += '<li title="' + v.name[Hsis.lang] + '" data-id="' + v.id + '" class="module-block">' +
                            '<a class="icon-' + v.iconPath + '" >' + v.shortName[Hsis.lang] +
                            '</a></li>';
                    }

                });
            }

            return html;
        },
        parseOrgTree: function (tree) {
            try {
                Hsis.array = [];
                var array = [];
                if (tree.length > 0) {
                    $.each(tree, function (i, v) {

                        var obj = {
                            id: v.id.toString(),
                            dicType: v.type.id,
                            parent: (v.parent.id) == 0 ? "#" : v.parent.id.toString(),
                            text: v.name[Hsis.lang],
                            about: v.about[Hsis.lang],
                            type: v.type.value[Hsis.lang],
                            name: v.name[Hsis.lang],
                            startDate: v.startDate,
                            endDate: v.endDate,
                            shortName: v.shortName[Hsis.lang],
                            li_attr: {
                                // 'data-img': tree[i].iconPath,
                                'title': tree[i].type.value[Hsis.lang]
                                // 'class': 'show-tooltip'
                            },
                        };


                        array.push(obj);
                        Hsis.array.push(obj);
                    });

                    $('body').find('#jstree').jstree('refresh').jstree({
                        "core": {
                            "data": array,
                            "check_callback": true,
//                            'strings': {
//                                'Loading ...': 'Please wait ...'
//                            },
                            "themes": {
                                "variant": "large",
                                "dots": false,
                                "icons": false
                            }
                        },
                        "search": {
                            "case_insensitive": true,
                            "show_only_matches": true
                        },
                        "plugins": ["wholerow", "search", "crrm"]
                    }).on('loaded.jstree', function () {
                        // $('#jstree').jstree('open_all');
                        $('.tree-preloader').remove();
                        $('.module-block[data-id=' + Hsis.currModule + ']').removeAttr('data-check');

                    })
//                    .on('hover_node.jstree', function(e,data) {
                    //                        var node = $("#" + data.node.id);
                    //                        var src = node.attr('data-img')
                    //                        var title = node.attr('title');
                    //                        $('.show-tooltip').tooltip({content : '<div class="org-tree-about-icon">'+
                    //                            '<img class="jstree-icon-black1" src="assets/img/dots/'+src+'">'+
                    //                            '- &nbsp; <span>'+title+'</span>'+
//                        '</div>'});
//                    });
                } else {
                    $('body').find('#jstree').jstree("destroy");
                }
            } catch (err) {
                console.error(err);
            }
        },
        parseOperations: function (operations, type, $obj, callback) {
            var html = '';
            if (operations) {
                var innerButton = $('<div class="dropdown-func op-cont">' +
                    '<div title = "Əməliyyatlar" class="operations operations-top dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                    '<img src="assets/img/upd/table-dots.svg">' +
                    '</div>' + '<ul class="dropdown-menu">' +
                    '</ul>' +
                    '</div>');
                $.each(operations, function (i, v) {
                    if (v.typeId == type) {
                        if (type == '1') {
                            html += '<li><a id="operation_' + v.id + '" href="#" >' + v.name[Hsis.lang] + '</a></li>';

                        } else if (type == '2') {
                            if ($obj) {
                                var statusId = $obj.status ? $obj.status.id : 0;
                                if ((v.id == 1000042 || v.id == 1000041) && statusId == 1000340) {
                                    html += '';
                                } else if ((v.id == 1000028
                                    // || v.id == 1000032
                                ) && statusId == 1000340 && v.roleId != 1000020 && v.roleId != 1000075) {
                                    html += '';
                                } else if ((v.id == 1001311 || v.id == 1001330 || v.id == 1000171) && statusId == 1000340) {
                                    html += '';
                                } else {
                                    html += '<li><a  id="operation_' + v.id + '" data-status = "' + statusId + '" href="#">' + v.name[Hsis.lang] + '</a></li>';
                                }
                            } else {
                                html += '<li><a id="operation_' + v.id + '" data-status = "' + statusId + '" href="#">' + v.name[Hsis.lang] + '</a></li>';
                            }
                        }
                    }
                });
                if (type == '2') {
                    innerButton.find('ul').html(html);
                    return innerButton.html();
                }

            }
            return html;
        },
        parseDictionaryForSelect: function (data) {
            var html = '<option value="0">' + Hsis.dictionary[Hsis.lang]["select"] + '</option>';
            if (data) {
                $.each(data, function (i, v) {
                    html += '<option parent="' + v.parentId + '" code="' + v.code + '" value="' + v.id + '">' + v.value[Hsis.lang] + '</option>';
                });
            }
            return html;
        },

        //for options

        commonParseTree: function (data, objectId, nodeTypeId) {
            try {
                var array = [];
                if (data.length > 0) {

                    $.each(data, function (i, v) {
                        var obj = {
                            id: v.id.toString(),
                            parent: (v.parent.id == 0) ? "#" : v.parent.id.toString(), text: v.name[Hsis.lang],
                            typeId: v.type.id
                        };
                        array.push(obj);
                        Hsis.array.push(obj);
                    });
                    $('#main-div').find('#' + objectId).on('loaded.jstree', function (e, data) {
                        $('.tree-preloader').remove();
                        $('#' + objectId).removeAttr('data-id');
                        $('#' + objectId).removeAttr('data-check');

                    })
                        .jstree({
//                                'conditionalselect' : function(node) {
//                                    if(nodeTypeId) {
//                                        return node.original.typeId == nodeTypeId ? true : false;
//                                    }
//                                    else {
//                                        return true;
//                                    }
//
//                                },
                            "core": {
                                "data": array,
                                "check_callback": true,
                                "themes": {
                                    "variant": "large",
                                    "dots": false,
                                    "icons": true
                                },
                            },
                            "search": {
                                "case_insensitive": true,
                                "show_only_matches": true
                            },
                            "plugins": ["conditionalselect", "wholerow", "search"],
                            "themes": {"stripes": true}
                        });
                } else {
                    $('#main-div').find('#' + objectId).jstree("destroy");
                }
            } catch (err) {
                console.error(err);
            }
        },
        parseEditStudentAddress: function (data) {
            try {
                if (data) {
                    $.each(data.addresses, function (i, v) {
                        switch (v.type.id) {
                            case 1000178:
                                $('#permanent_address_edit').text(v.fullAddress[Hsis.lang] + ', ' + v.name);
                                $('#permanent_address_edit').attr('data-addressTree-id', v.addressTree.id);
                                $('#permanent_address_edit').attr('data-address-name', v.name);
                                $('#permanent_address_edit').removeAttr('data-id').attr('data-id', v.id);
                                $('#main-div #permanent_street_edit').val(v.name);

                                break;

                            case 1000198:

                                $('#temporary_address_edit').text(v.fullAddress[Hsis.lang] + ', ' + v.name);
                                $('#temporary_address_edit').attr('data-addressTree-id', v.addressTree.id);
                                $('#temporary_address_edit').attr('data-address-name', v.name);
                                $('#temporary_address_edit').removeAttr('data-id').attr('data-id', v.id);
                                $('#main-div #temporary_street_edit').val(v.name);
                                break;

                            case 1000199:
                                $('#birth_place_edit').text(v.fullAddress[Hsis.lang]);
                                $('#birth_place_edit').attr('data-addressTree-id', v.addressTree.id);
                                $('#birth_place_edit').attr('data-address-name', v.name);
                                $('#birth_place_edit').removeAttr('data-id').attr('data-id', v.id);
                                break;
                        }
                    })

                }
            } catch (err) {
                console.error(err);
            }
        },
        parseOldStudentAddress: function (data) {
            try {

                if (data) {
                    $.each(data.addresses, function (i, v) {

                        switch (v.type.id) {
                            case 1000178:
                                $('#permanent_address_edit').text(v.fullAddress[Hsis.lang] + ', ' + v.name);

                                break;

                            case 1000198:
                                $('#temporary_address_edit').text(v.fullAddress[Hsis.lang] + ', ' + v.name);
                                break;

                            case 1000199:
                                $('#birth_place_edit').text(v.fullAddress[Hsis.lang]);
                                break;
                        }
                    })

                }

            } catch (err) {
                console.error(err);
            }
        },
        parseEditStudentDocument: function (data, doctype) {
            try {
                var html = '';
                if (data) {
                    $.each(data, function (i, v) {
                        html += '<div class="col-md-12 for-align doc-item" data-doc-id = "' + v.id + '">' +
                            '<table class="table-block col-md-12">' +
                            '<tr>' +
                            '<td>' + Hsis.dictionary[Hsis.lang]['doc_type'] + '</td>' +
                            '<td>' + Hsis.dictionary[Hsis.lang]['serial_number'] + '</td>' +
                            '<td>' + Hsis.dictionary[Hsis.lang]['doc_number'] + '</td>' +
                            '<td>' + Hsis.dictionary[Hsis.lang]['issue_date'] + '</td>' +
                            '<td>' + Hsis.dictionary[Hsis.lang]['end_date'] + '</td>' +
                            '<td></td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td data-id="' + v.type.id + '" class="add-doc-type">' + v.type.value[Hsis.lang] + '</td>' +
                            '<td class="add-doc-serial">' + v.serial + '</td>' +
                            '<td class="add-doc-number">' + v.number + '</td>' +
                            '<td class="add-doc-date">' + v.startDate + '</td>' +
                            '<td class="add-doc-end-date">' + v.endDate + '</td>' + '</tr>' +
                            '</table>' +
                            '<label><p>' + Hsis.dictionary[Hsis.lang]['choose_files'] + '</p><input type="file" multiple class="add-doc-file" data-doc-id = "' + v.id + '"/></label>' +
                            '<div class="operations-button">' +
                            '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="glyphicon glyphicon-list"></span></div>' +
                            '<ul class="dropdown-menu">' +
                            '<li><a href="#" class="student_doc_edit" data-doc-type = "' + doctype + '"data-id = "' + v.id + '" data-type-id = "' + v.type.id + '" data-doc-serial = "' + v.serial + '" data-doc-number = "' + v.number + '" data-doc-start-date = "' + v.startDate + '" data-doc-end-date = "' + v.endDate + '">' + Hsis.dictionary[Hsis.lang]['edit'] + '</a></li>' +
                            '<li><a href="#" class="student_doc_remove" data-id = "' + v.id + '">' + Hsis.dictionary[Hsis.lang]['erase'] + '</a></li>' +
                            '</ul>' +
                            '</div>' +
                            '</div>';


                        if (v.files.length > 0) {
                            html += '<div class = "student-doc-file-div">';
                            $.each(v.files, function (k, j) {
                                html += '<div class="user-doc-file" data-file-id = "' + j.id + '" data-file-path = "' + j.path + '">' +
                                    '<div class="doc-delete">✖</div>' +
                                    '<img src="' + Hsis.urls.HSIS + 'students/file/' + j.id + '?token=' + Hsis.token + '" alt="" width="50" height="50">' +
                                    '<div class="upload-img"><a href="' + Hsis.urls.HSIS + 'students/file/' + j.id + '?token=' + Hsis.token + '" download = "' + j.originalName + '"><img src="assets/img/upload-img.png" width="20" height="20"></a></div>' +
                                    '</div>';
                            });
                            html += '</div>';
                        }

                        html += '</div>';

                    });
                } else {
                    html += '<div class="blank-panel"><h3>' + Hsis.dictionary[Hsis.lang]['no_information'] + '</h3></div>';
                }

            } catch (err) {
                console.error(err);
            }

            return html;

        },
        parseViewStudentDocument: function (data, doctype) {
            try {

                var html = '';
                if (data) {
                    $.each(data, function (i, v) {
                        html += '<div class="col-md-12 for-align doc-item" doc-type="' + doctype + '">' +
                            '<table class="table-block col-md-12">' +
                            '<tr>' +
                            '<td>' + Hsis.dictionary[Hsis.lang]['doc_type'] + '</td>' +
                            '<td>' + Hsis.dictionary[Hsis.lang]['serial_number'] + '</td>' +
                            '<td>' + Hsis.dictionary[Hsis.lang]['doc_number'] + '</td>' +
                            '<td>' + Hsis.dictionary[Hsis.lang]['issue_date'] + '</td>' +
                            '<td>' + Hsis.dictionary[Hsis.lang]['end_date'] + '</td>' + '<td></td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td class="add-doc-type">' + v.type.value[Hsis.lang] + '</td>' +
                            '<td class="add-doc-serial">' + v.serial + '</td>' +
                            '<td class="add-doc-number">' + v.number + '</td>' +
                            '<td class="add-doc-date">' + v.startDate + '</td>' +
                            '<td class="add-doc-end-date">' + v.endDate + '</td>' +
                            '</tr>' +
                            '</table>';


                        if (v.files.length > 0) {
                            html += '<div class = "student-doc-file-div">';
                            $.each(v.files, function (k, j) {
                                html += '<div class="user-doc-file">' +
                                    '<img src="' + Hsis.urls.HSIS + 'students/file/' + j.id + '?token=' + Hsis.token + '" alt="" width="50" height="50">' +
                                    '<div class="upload-img"><a href="' + Hsis.urls.HSIS + 'students/file/' + j.id + '?token=' + Hsis.token + '" download = "' + j.originalName + '"><img src="assets/img/upload-img.png" width="20" height="20"></a></div>' +
                                    '</div>';
                            });
                            html += '</div>';
                        }

                        html += '</div>';
                    });
                } else {
                    html += '<div class="blank-panel"><h3>' + Hsis.dictionary[Hsis.lang]['no_information'] + '</h3></div>';
                }

            } catch (err) {
                console.error(err);
            }

            return html;

        },
        parseEditStudentContact: function (data) {
            try {
                if (data) {
                    var html = '';
                    $.each(data.contacts, function (i, v) {
                        html += '<div class="col-md-12 for-align contact-item">' +
                            '<table class="table-block col-md-12">' +
                            '<thead>' +
                            '<tr><th>' + Hsis.dictionary[Hsis.lang]['contact_type'] + '</th>' +
                            '<th>' + Hsis.dictionary[Hsis.lang]['contact'] + ' </th>' +
                            '</tr></thead>' +
                            '<tbody>' +
                            '<tr >' +
                            '<td>' + v.type.value[Hsis.lang] + '</td>' +
                            '<td>' + v.contact + '</td>' +
                            '</tr>' +
                            '</tbody>' +
                            '</table>' +
                            '<div class="operations-button">' +
                            '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                            '<span class="glyphicon glyphicon-list"></span>' +
                            '</div>' +
                            '<ul class="dropdown-menu">' +
                            '<li class = "edit-contact-li" data-id = "' + v.id + '" data-type-id = "' + v.type.id + '" data-contact = "' + v.contact + '"><a href="#"> ' + Hsis.dictionary[Hsis.lang]['edit'] + ' </a></li>' +
                            '<li class="remove-contact-li" data-id="' + v.id + '"><a href="#" data-id = "' + v.id + '">' + Hsis.dictionary[Hsis.lang]['erase'] + '</a></li>' +
                            '</ul>' +
                            '</div>' +
                            '</div>';


                    });

                    return html;
                }


            } catch (err) {
                console.error(err);
            }

        },
        parseViewStudentContact: function (data) {
            try {
                var html = '';
                if (data) {
                    $.each(data.contacts, function (i, v) {

                        html += '<div class="col-md-12 for-align contact-item">' +
                            '<table class="table-block col-md-12">' +
                            '<thead>' +
                            '<tr><th>' + Hsis.dictionary[Hsis.lang]['contact_type'] + '</th>' +
                            '<th>' + Hsis.dictionary[Hsis.lang]['contact'] + ' </th>' +
                            '</tr></thead>' +
                            '<tbody>' +
                            '<tr >' +
                            '<td>' + v.type.value[Hsis.lang] + '</td>' +
                            '<td>' + v.contact + '</td>' +
                            '</tr>' +
                            '</tbody>' +
                            '</table>' +
                            '</div>';
                    });
                }

            } catch (err) {
                console.error(err);
            }

            return html;
        },
        parseEditTeacherEduLifeCycle: function (data) {
            try {
                var html = '';
                $.each(data.personEduLifeCycles, function (i, v) {

                    html += '<div class="col-md-12 for-align edu-info-item" >' +
                        '<table class="table-block col-md-12">' +
                        '<thead>' +
                        '<tr>' +
                        '<td style="width:145px;">' + Hsis.dictionary[Hsis.lang]['university_name'] + '</td>' +
                        '<td>' + Hsis.dictionary[Hsis.lang]['edu_level'] + '</td>' +
                        '<td>' + Hsis.dictionary[Hsis.lang]['start_action_type'] + '</td>' +
                        '<td>' + Hsis.dictionary[Hsis.lang]['start_date'] + '</td>' +
                        '<td>' + Hsis.dictionary[Hsis.lang]['end_action_type'] + '</td>' +
                        '<td>' + Hsis.dictionary[Hsis.lang]['end_date'] + '</td>' +
                        '<td></td>' +
                        '</tr>' +
                        '</thead>' +
                        '<tbody>' +
                        '<tr>' +
                        '<td>' + v.univer.value[Hsis.lang] + '</td>' +
                        '<td>' + v.eduLevel.value[Hsis.lang] + '</td>' +
                        '<td>' + v.actionType.value[Hsis.lang] + '</td>' +
                        '<td>' + v.actionDate + '</td>' +
                        '<td>' + v.endActionType.value[Hsis.lang] + '</td>' +
                        '<td>' + v.endActionDate + '</td>' +
                        '<td></td>' +
                        '</tr>' +
                        '</tbody>' +
                        '</table>' +
                        '<div class="operations-button">' +
                        '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="glyphicon glyphicon-list"></span></div>' +
                        '<ul class="dropdown-menu">' +
                        '<li><a foreign-org-id="' + v.univer.id + '" class="edit-edu-info" href="#" data-id = "' + v.id + '" data-parent-id = "' + v.actionType.parentId + '" data-org-id="' + v.org.id + '" data-action-type-id="' + v.actionType.id + '" data-end-action-type-id="' + v.endActionType.id + '" data-start-date="' + v.actionDate + '" data-end-date="' + v.endActionDate + '"  data-edu-level-id="' + v.eduLevel.id + '" >' + Hsis.dictionary[Hsis.lang]["edit"] + '</a></li>' +
                        '<li><a class="remove-edu-info" href="#" data-id = "' + v.id + '">' + Hsis.dictionary[Hsis.lang]["erase"] + '</a></li>' +
                        '</ul>' +
                        '</div>' +
                        '</div>';


                });

            } catch (err) {
                console.error(err);
            }

            return html;
        },
        parseViewTeacherEduLifeCycle: function (data) {
            try {
                var html = '';
                $.each(data.personEduLifeCycles, function (i, v) {
                    //console.log(v);
                    html += '<div class="col-md-12 for-align edu-info-item" >' +
                        '<table class="table-block col-md-12">' +
                        '<thead>' + '<tr>' +
                        '<td>' + Hsis.dictionary[Hsis.lang]["university_name"] + '</td>' +
                        '<td>' + Hsis.dictionary[Hsis.lang]["edu_level"] + '</td>' +
                        '<td>' + Hsis.dictionary[Hsis.lang]["start_action_type"] + '</td>' +
                        '<td>' + Hsis.dictionary[Hsis.lang]["start_date"] + '</td>' +
                        '<td>' + Hsis.dictionary[Hsis.lang]["end_action_type"] + '</td>' +
                        '<td>' + Hsis.dictionary[Hsis.lang]["end_date"] + '</td>' +
                        '</tr>' +
                        '</thead>' +
                        '<tbody>' +
                        '<tr>' +
                        '<td>' + v.univer.value[Hsis.lang] + '</td>' +
                        '<td>' + v.eduLevel.value[Hsis.lang] + '</td>' +
                        '<td>' + v.actionType.value[Hsis.lang] + '</td>' +
                        '<td>' + v.actionDate + '</td>' +
                        '<td>' + v.endActionType.value[Hsis.lang] + '</td>' + '<td>' + v.endActionDate + '</td>' +
                        '</tr>' +
                        '</tbody>' +
                        '</table>' +
                        '</div>';

                });

            } catch (err) {
                console.error(err);
            }

            return html;
        },
        parseEditTeacherDocument: function (data, docType) {
            try {

                var html = '';
                if (data) {
                    $.each(data, function (i, v) {
                        html += '<div class="col-md-12 for-align doc-item" data-doc-id = "' + v.id + '">' +
                            '<div class = "col-md-12">' +
                            '<table class="table-block col-md-12">' +
                            '<tr>' + '<td>' + Hsis.dictionary[Hsis.lang]['doc_type'] + '</td>' +
                            '<td>' + Hsis.dictionary[Hsis.lang]['serial_number'] + '</td>' +
                            '<td>' + Hsis.dictionary[Hsis.lang]['doc_number'] + '</td>' +
                            '<td>' + Hsis.dictionary[Hsis.lang]['issue_date'] + '</td>' +
                            '<td>' + Hsis.dictionary[Hsis.lang]['end_date'] + '</td>' +
                            '<td></td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td data-id="' + v.type.id + '" class="add-doc-type">' + v.type.value[Hsis.lang] + '</td>' + '<td class="add-doc-serial">' + v.serial + '</td>' + '<td class="add-doc-number">' + v.number + '</td>' +
                            '<td class="add-doc-date">' + v.startDate + '</td>' +
                            '<td class="add-doc-end-date">' + (v.endDate != null ? v.endDate : '') + '</td>' + '</tr>' +
                            '</table>' +
                            '<label><p>' + Hsis.dictionary[Hsis.lang]['choose_files'] + '</p><input type="file" multiple class="add-doc-file" data-doc-id = "' + v.id + '"/></label>' +
                            '<div class="operations-button">' +
                            '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="glyphicon glyphicon-list"></span></div>' +
                            '<ul class="dropdown-menu">' +
                            '<li><a href="#" class="student_doc_edit" data-doc-type = "' + docType + '"data-id = "' + v.id + '" data-type-id = "' + v.type.id + '" data-doc-serial = "' + v.serial + '" data-doc-number = "' + v.number + '" data-doc-start-date = "' + v.startDate + '" data-doc-end-date = "' + v.endDate + '">' + Hsis.dictionary[Hsis.lang]['edit'] + '</a></li>' +
                            '<li><a href="#" class="student_doc_remove" data-id = "' + v.id + '">' + Hsis.dictionary[Hsis.lang]['erase'] + '</a></li>' +
                            '</ul>' +
                            '</div>' +
                            '</div>';


                        if (v.files.length > 0) {
                            html += '<div class = "student-doc-file-div">';
                            $.each(v.files, function (k, j) {
                                html += '<div class="user-doc-file" data-file-id = "' + j.id + '" data-file-path = "' + j.path + '">' +
                                    '<div class="doc-delete">✖</div>' +
                                    '<img src="' + Hsis.urls.HSIS + 'teachers/file/' + j.id + '?token=' + Hsis.token + '" alt="" width="50" height="50">' +
                                    '<div class="upload-img"><a target="_blank" href="' + Hsis.urls.HSIS + 'teachers/file/' + j.id + '?token=' + Hsis.token + '" download = "' + j.originalName + '"><img src="assets/img/upload-img.png" width="20" height="20"></a></div>' +
                                    '</div>';
                            });
                            html += '</div>';
                        }
                        html += '</div>';
                    });
                }

            } catch (err) {
                console.error(err);
            }

            return html;

        },
        parseViewTeacherDocument: function (data, docType) {
            try {

                var html = '';
                if (data) {
                    $.each(data, function (i, v) {
                        html += '<div class="col-md-12 for-align doc-item" >' +
                            '<div class = "col-md-12">' +
                            '<table class="table-block col-md-12">' +
                            '<tr>' +
                            '<td>' + Hsis.dictionary[Hsis.lang]['doc_type'] + '</td>' +
                            '<td>' + Hsis.dictionary[Hsis.lang]['serial_number'] + '</td>' +
                            '<td>' + Hsis.dictionary[Hsis.lang]['doc_number'] + '</td>' +
                            '<td>' + Hsis.dictionary[Hsis.lang]['issue_date'] + '</td>' +
                            '<td>' + Hsis.dictionary[Hsis.lang]['end_date'] + '</td>' +
                            '<td></td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td  class="add-doc-type">' + v.type.value[Hsis.lang] + '</td>' +
                            '<td class="add-doc-serial">' + v.serial + '</td>' +
                            '<td class="add-doc-number">' + v.number + '</td>' +
                            '<td class="add-doc-date">' + v.startDate + '</td>' +
                            '<td class="add-doc-end-date">' + (v.endDate != null ? v.endDate : '') + '</td>' +
                            '</tr>' +
                            '</table>';


                        if (v.files != null && v.files.length > 0) {
                            html += '<div class = "student-doc-file-div">';
                            $.each(v.files, function (k, j) {
                                html += '<div class="user-doc-file" >' +
                                    '<img src="' + Hsis.urls.HSIS + 'teachers/file/' + j.id + '?token=' + Hsis.token + '" alt="" width="50" height="50">' +
                                    '<div class="upload-img"><a target="_blank" href="' + Hsis.urls.HSIS + 'teachers/file/' + j.id + '?token=' + Hsis.token + '" download = "' + j.originalName + '"><img src="assets/img/upload-img.png" width="20" height="20"></a></div>' +
                                    '</div>';
                            });
                            html += '</div>';
                        }

                        html += '</div>';

                    });
                }

            } catch (err) {
                console.error(err);
            }

            return html;

        },
        parseStudentRelationShip: function (data) {

            try {
                if (data.length > 0) {
                    var html = '';

                    $.each(data, function (i, v) {

                        html += '<div class="col-md-12 for-align relationship-item">' +
                            '<table class="table-block col-md-12">' +
                            '<thead>' +
                            '<tr>' +
                            '<th>' + Hsis.dictionary[Hsis.lang]['relation_type'] + '</th>' +
                            '<th>' + Hsis.dictionary[Hsis.lang]['name'] + '</th>' +
                            '<th>' + Hsis.dictionary[Hsis.lang]['contact'] + '</th>' +
                            '</tr>' + '</thead>' +
                            '<tbody>' +
                            '<tr >' +
                            '<td>' + v.type.value[Hsis.lang] + '</td>' +
                            '<td>' + v.fullName + '</td>' +
                            '<td>' + v.contactNumber + '</td>' +
                            '</tr>' +
                            '</tbody>' +
                            '</table>' +
                            '<div class="operations-button">' +
                            '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                            '<span class="glyphicon glyphicon-list"></span>' +
                            '</div>' +
                            '<ul class="dropdown-menu">' +
                            '<li><a class="edit-student-relationship"  data-id = "' + v.id + '" data-fullname="' + v.fullName + '" data-contact="' + v.contactNumber + '" data-type-id="' + v.type.id + '" href="#" class="edit">' + Hsis.dictionary[Hsis.lang]['edit'] + '</a></li>' +
                            '<li><a class="erase-student-relationship" data-id="' + v.id + '" href="#" class="erase">' + Hsis.dictionary[Hsis.lang]['erase'] + '</a></li>' +
                            '</ul>' +
                            '</div>' +
                            '</div>';


                    });
                }


            } catch (err) {
                console.error(err)
            }
            return html

        },
        parseViewStudentRelationShip: function (data) {

            try {
                var html = '';

                if (data.length > 0) {
                    $.each(data, function (i, v) {

                        html += '<div class="col-md-12 for-align relationship-item">' +
                            '<table class="table-block col-md-12">' +
                            '<thead>' +
                            '<tr>' +
                            '<th>' + Hsis.dictionary[Hsis.lang]['relation_type'] + '</th>' +
                            '<th>' + Hsis.dictionary[Hsis.lang]['name'] + '</th>' +
                            '<th>' + Hsis.dictionary[Hsis.lang]['contact'] + '</th>' +
                            '</tr>' +
                            '</thead>' +
                            '<tbody>' +
                            '<tr >' +
                            '<td>' + v.type.value[Hsis.lang] + '</td>' +
                            '<td>' + v.fullName + '</td>' +
                            '<td>' + v.contactNumber + '</td>' +
                            '</tr>' + '</tbody>' +
                            '</table>' +
                            '</div>';
                    });

                    return html;
                }

            } catch (err) {
                console.error(err)
            }


        },
        parseTeacherAcademicDegree: function (data) {
            try {
                var html = '';
                if (data) {
                    $.each(data, function (i, v) {
                        var status = v.status == 1 ? Hsis.dictionary[Hsis.lang]['active'] : Hsis.dictionary[Hsis.lang]['inactive'];
                        var name = v.academicInfo.typeId == 1000020 ? Hsis.dictionary[Hsis.lang]['academic_degree'] : Hsis.dictionary[Hsis.lang]['academic_name'];
                        html += '<div class="col-md-12 for-align academic-degree-item">' +
                            '<table class="table-block col-md-12">' +
                            '<thead>' +
                            '<tr>' +
                            '<th>' + name + '</th>' +
                            '<th>' + Hsis.dictionary[Hsis.lang]["date"] + '</th>' +
                            //                                '<th>' + Hsis.dictionary[Hsis.lang]["status"] + '</th>' +
                            '</tr>' +
                            '</thead>' +
                            '<tbody>' +
                            '<tr >' +
                            '<td>' + v.academicInfo.value[Hsis.lang] + '</td>' +
                            '<td>' + v.startDate + '</td>' +
                            //                                '<td>' + status + '</td>' +
                            '</tr>' +
                            '</tbody>' +
                            '</table>' +
                            '<div class="operations-button">' + '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                            '<span class="glyphicon glyphicon-list"></span>' +
                            '</div>' + '<ul class="dropdown-menu">' +
                            '<li><a class="edit-teacher-academic-degree-name"  data-dic-type-id = "' + v.academicInfo.typeId + '" data-id = "' + v.id + '" data-startDate="' + v.startDate + '" data-status="' + v.status + '" data-type-id="' + v.academicInfo.id + '" href="#" class="edit">' + Hsis.dictionary[Hsis.lang]['edit'] + '</a></li>' +
                            '<li><a class="erase-teacher-academic-degree-name" data-id="' + v.id + '" href="#" class="erase">' + Hsis.dictionary[Hsis.lang]['erase'] + '</a></li>' +
                            '</ul>' +
                            '</div>' +
                            '</div>';
                    })
                    return html;
                }


            } catch (err) {
                console.error(err)
            }


        },
        parseViewTeacherAcademicDegree: function (data) {
            try {
                var html = '';
                if (data.length > 0) {
                    $.each(data, function (i, v) {
                        var status = v.status == 1 ? Hsis.dictionary[Hsis.lang]['active'] : Hsis.dictionary[Hsis.lang]['inactive'];
                        var name = v.academicInfo.typeId == 1000020 ? Hsis.dictionary[Hsis.lang]['academic_degree'] : Hsis.dictionary[Hsis.lang]['academic_name'];
                        html += '<div class="col-md-12 for-align academic-degree-item">' +
                            '<table class="table-block col-md-12">' +
                            '<thead>' +
                            '<tr>' +
                            '<th>' + name + '</th>' +
                            '<th>' + Hsis.dictionary[Hsis.lang]["date"] + '</th>' +
                            //                                '<th>' + Hsis.dictionary[Hsis.lang]["status"] + '</th>' +
                            '</tr>' +
                            '</thead>' +
                            '<tbody>' +
                            '<tr >' +
                            '<td>' + v.academicInfo.value[Hsis.lang] + '</td>' +
                            '<td>' + v.startDate + '</td>' +
                            //                                '<td>' + status + '</td>' +
                            '</tr>' +
                            '</tbody>' +
                            '</table>' +
                            '</div>';
                    });
                    return html
                }


            } catch (err) {
                console.error(err)
            }

        },
        parseTeacherAcademicActivity: function (data) {

            try {
                var html = '';
                if (data) {
                    $.each(data, function (i, v) {

                        html += '<div class="col-md-12 for-align academic-activity-item">' +
                            '<table class="table-block col-md-12">' +
                            '<thead>' +
                            '<tr>' +
                            '<th>' + Hsis.dictionary[Hsis.lang]['research_type'] + '</th>' +
                            '<th style="width:160px;">' + Hsis.dictionary[Hsis.lang]['research_name'] + '</th>' +
                            '<th>' + Hsis.dictionary[Hsis.lang]['date'] + '</th>' +
                            '</tr>' +
                            '</thead>' +
                            '<tbody>' +
                            '<tr >' +
                            '<td>' + v.researchType.value[Hsis.lang] + '</td>' +
                            '<td>' + v.researchName + '</td>' +
                            '<td>' + v.publishDate + '</td>' +
                            '</tr>' +
                            '</tbody>' +
                            '</table>' +
                            '<div class="operations-button">' +
                            '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                            '<span class="glyphicon glyphicon-list"></span>' +
                            '</div>' +
                            '<ul class="dropdown-menu">' +
                            '<li><a class="edit-teacher-academic-activity"  data-id = "' + v.id + '" data-research-name="' + v.researchName + '" data-publish-date="' + v.publishDate + '" data-type-id="' + v.researchType.id + '" href="#" class="edit">' + Hsis.dictionary[Hsis.lang]['edit'] + '</a></li>' +
                            '<li><a class="erase-teacher-academic-activity" data-id="' + v.id + '" href="#" class="erase">' + Hsis.dictionary[Hsis.lang]['erase'] + '</a></li>' +
                            '</ul>' +
                            '</div>' +
                            '</div>';


                    });
                    return html;
                }


            } catch (err) {
                console.error(err)
            }


        },
        parseViewTeacherAcademicActivity: function (data) {

            try {
                var html = '';
                if (data.length > 0) {
                    $.each(data, function (i, v) {

                        html += '<div class="col-md-12 for-align academic-activity-item">' +
                            '<table class="table-block col-md-12">' +
                            '<thead>' +
                            '<tr>' +
                            '<th>' + Hsis.dictionary[Hsis.lang]['research_type'] + '</th>' +
                            '<th style="width:160px;">' + Hsis.dictionary[Hsis.lang]['research_name'] + '</th>' +
                            '<th>' + Hsis.dictionary[Hsis.lang]['publish_date'] + '</th>' +
                            '</tr>' +
                            '</thead>' +
                            '<tbody>' +
                            '<tr >' +
                            '<td>' + v.researchType.value[Hsis.lang] + '</td>' +
                            '<td>' + v.researchName + '</td>' +
                            '<td>' + v.publishDate + '</td>' +
                            '</tr>' +
                            '</tbody>' +
                            '</table>' +
                            '</div>';
                    });
                    return html;
                }


            } catch (err) {
                console.error(err)
            }


        },
        parseStudentActions: function (data) {
            try {
                var html = '';
                if (data.length > 0) {

                    var studyPlace = "";
                    $.each(data, function (i, v) {
                        switch (v.org.typeId) {
                            case 1000057:
                                studyPlace = Hsis.dictionary[Hsis.lang]['university'];
                                break;
                            case 1000056:
                                studyPlace = Hsis.dictionary[Hsis.lang]['school'];
                                break;
                            case 1000055:
                                studyPlace = Hsis.dictionary[Hsis.lang]['college'];
                                break;
                            default:
                                studyPlace = Hsis.dictionary[Hsis.lang]['university'];
                                break;

                        }


                        //                        console.log(v.status.id + ' ' + v.id + ' ' + v.actionType.id + ' ' + v.actionDate + ' ' + studyPlace +
                        //                                ' ' + v.org.value[Hsis.lang] +
                        //                                ' ' + v.actionType.value[Hsis.lang] +
//                                ' ' + v.actionDate +
                        //                                ' ' + v.endActionType.value[Hsis.lang] +
                        //                                ' ' + v.endActionDate +
                        //                                ' ' + v.org.id +
                        //                                ' ' + v.org.typeId
                        //                                );
                        html += '<div class="col-md-12 for-align student-action" data-status-id="' + v.status.id + '" data-id ="' + v.id + '" data-action-type = "' + v.actionType.id + ' " data-action-date = "' + v.actionDate + '">' +
                            '<table class="table-block col-md-12">' +
                            '<thead>' +
                            '<tr data-pelc-id = "' + v.id + '" data-type-id="'+v.org.typeId+'">' +
                            '<th style="width:145px;">' + studyPlace + '</th>' +
                            '<th>' + Hsis.dictionary[Hsis.lang]["start_action_type"] + '</th>' +
                            '<th>' + Hsis.dictionary[Hsis.lang]["start_date"] + '</th>' +
                            '<th>' + Hsis.dictionary[Hsis.lang]["end_action_type"] + '</th>' +
                            '<th>' + Hsis.dictionary[Hsis.lang]["end_date"] + '</th>' +
                            '<th></th>' +
                            '</tr>' +
                            '</thead>' +
                            '<tbody>' +
                            '<tr >' +
                            '<td data-org-name style="width:145px;">' + (v.org.typeId == "1000056" ? v.org.value[Hsis.lang] : v.univer.value[Hsis.lang]) + '</td>' +
                            '<td data-action-type >' + v.actionType.value[Hsis.lang] + ' </td>' +
                            '<td data-action-date >' + v.actionDate + ' </td>' +
                            '<td data-end-action-type>' + v.endActionType.value[Hsis.lang] + ' </td>' +
                            '<td data-end-action-date>' + v.endActionDate + ' </td>' +
                            '<td></td>' +
                            '</tr>' +
                            '</tbody>' +
                            '</table>' +
                            '<div class="operations-button">' +
                            '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                            '<span class="glyphicon glyphicon-list"></span>' +
                            '</div>' +
                            '<ul class="dropdown-menu">' +
                            '<li><a class="show-student-action"  data-id = "' + v.id + '" href="#" data-type-id = "' + v.org.typeId + '">' + Hsis.dictionary[Hsis.lang]["show"] + ' </a></li>' +
                            // (v.status.id == 1000380 ?
                            '<li><a class="edit-student-action" data-org-id="' + v.uniParentId + '"  data-id = "' + v.id + '" href="#" data-type-id = "' + (v.org.typeId == "1000073" ? 1000073 : v.org.typeId) + '">' + Hsis.dictionary[Hsis.lang]["edit"] + '</a></li>' +
                            '<li><a class="erase-student-action" data-org-id="' + v.uniParentId + '"  data-id = "' + v.id + '" href="#" data-type-id = "' + v.org.typeId + '">' + Hsis.dictionary[Hsis.lang]["erase"] + '</a></li>' +
                            //: '') +
                            '</ul>' +
                            '</div>' +
                            '</div>';
                    });


                } else {
                    html += '<div class="blank-panel"><h3>' + Hsis.dictionary[Hsis.lang]['no_information'] + '</h3></div>';
                }

                //console.log(html);
                return html;
            } catch (err) {
                console.error(err)
            }

        },
        parseOneStudentAction: function (data) {
            try {
                var html = '';
                var studyPlace = "";
                if (data) {

                    switch (data.org.typeId) {
                        case 1000057:
                            studyPlace = Hsis.dictionary[Hsis.lang]['university'];
                            break;
                        case 1000056:
                            studyPlace = Hsis.dictionary[Hsis.lang]['school'];
                            break;
                        case 1000055:
                            studyPlace = Hsis.dictionary[Hsis.lang]['college'];
                            break;
                        default:
                            studyPlace = Hsis.dictionary[Hsis.lang]['university'];
                            break;
                    }
                    html += '<div class="col-md-12 for-align student-action past_edu" data-status-id="' + data.status.id + '" data-org-type="' + data.org.typeId + '" data-id ="' + data.id + '" data-action-type = "' + data.actionType.id + ' " data-action-date = "' + data.actionDate + ' ">' +
                        '<table class="table-block col-md-12">' +
                        '<thead>' +
                        '<tr data-pelc-id = "' + data.id + '" data-org-type = "' + data.org.typeId + '" data-type-id="'+data.typeId+'">' + '<th style="width:145px;">' + studyPlace + '</th>' +
                        '<th>' + Hsis.dictionary[Hsis.lang]["start_action_type"] + '</th>' +
                        '<th>' + Hsis.dictionary[Hsis.lang]["start_date"] + '</th>' +
                        '<th>' + Hsis.dictionary[Hsis.lang]["end_action_type"] + '</th>' +
                        '<th>' + Hsis.dictionary[Hsis.lang]["end_date"] + '</th>' +
                        '</tr>' +
                        '</thead>' +
                        '<tbody>' +
                        '<tr >' +
                        '<td style="width:145px;" data-org-name>' + (data.org.typeId == "1000056" ? data.org.value[Hsis.lang] : data.univer.value[Hsis.lang]) + '</td>' +
                        '<td data-action-type >' + data.actionType.value[Hsis.lang] + '</td>' +
                        '<td data-action-date >' + data.actionDate + '</td>' +
                        '<td data-end-action-type>' + data.endActionType.value[Hsis.lang] + '</td>' +
                        '<td data-end-action-date>' + data.endActionDate + '</td>' +
                        '</tr>' +
                        '</tbody>' +
                        '</table>' +
                        '<div class="operations-button">' +
                        '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<span class="glyphicon glyphicon-list"></span>' +
                        '</div>' +
                        '<ul class="dropdown-menu">' +
                        '<li><a class="edit-student-action" data-org-id="' + (data.org.typeId == "1000056" ? data.org.id : data.univer.id) + '"  data-id = "' + data.id + '" href="#" data-type-id = "' + (data.org.typeId == "1000056" ? data.org.typeId : 1000073) + '">' + Hsis.dictionary[Hsis.lang]["edit"] + '</a></li>' +
                        '<li><a class="erase-student-action" data-org-id="' + data.org.id + '"  data-id = "' + data.id + '" href="#" data-type-id = "' + data.org.typeId + '">' + Hsis.dictionary[Hsis.lang]["erase"] + '</a></li>' +
                        '</ul>' +
                        '</div>' +
                        '</div>';
                }
                if (html.length > 0 && $('#past_edu_doc').hasClass('hidden')) {
                    $('#past_edu_doc').removeClass('hidden');
                }

                return html;
            } catch (err) {
                console.error(err)
            }
        },
        parseTeacherLanguages: function (data) {
            try {
                var html = '';
                if (data) {
                    $.each(data.languages, function (i, v) {
                        html += '<div data-id ="' + v.lang.id + '" class="simple-panel language-item">' +
                            '<p>' + v.lang.value[Hsis.lang] + '</p>' +
                            '<div class="remove-button fa fa-remove remove-language" data-id = "' + v.id + '" data-lang-id ="' + v.lang.id + '"></div>' +
                            '</div>'
                    });
                    return html;
                }


            } catch (err) {
                console.error(err);
            }


        },
        parseViewTeacherLanguages: function (data) {
            try {
                var html = '';

                if (data) {
                    $.each(data.languages, function (i, v) {
                        html += '<div class="simple-panel language-item">' +
                            '<p>' + v.lang.value[Hsis.lang] + '</p>' +
                            '</div>'
                    });
                    return html;
                }

            } catch (err) {
                console.error(err);
            }


        },
        parseTeacherSubjects: function (data) {
            try {
                var html = '';
                if (data) {
                    $.each(data.subjects, function (i, v) {
                        html += '<div data-id ="' + v.subject.id + '" class="simple-panel subject-item">' +
                            '<p>' + v.subject.value[Hsis.lang] + '</p>' +
                            '<div class="remove-button fa fa-remove remove-subject" data-id = "' + v.id + '" data-subject-id ="' + v.subject.id + '"></div>' +
                            '</div>'
                    });
                    return html;
                }

            } catch (err) {
                console.error(err);
            }


        }, parseViewTeacherSubjects: function (data) {
            try {
                var html = '';

                if (data) {
                    $.each(data.subjects, function (i, v) {
                        html += '<div class="simple-panel subject-item">' +
                            '<p>' + v.subject.value[Hsis.lang] + '</p>' +
                            '</div>'
                    });
                    return html;
                }

            } catch (err) {
                console.error(err);
            }


        },
        parseStudents: function (data, page) {
            if (data) {
                var html = '';
                var count;

                if (page) {
                    count = $('#student_list tbody tr').length;
                } else {
                    count = 0;
                }

                var ref = data.studentList ? data.studentList : data;
                if (ref.length > 0) {
                    $.each(ref, function (i, v) {
                        var actionType = (v.endActionType.id == "0") ? v.actionType.value[Hsis.lang] : v.endActionType.value[Hsis.lang];
                        html += '<tr data-image = "' + (v.imagePath ? v.imagePath : '') + '" data-edu-pay-type="' + v.eduPayType.value[Hsis.lang] + '" data-edu-level="' + v.eduLevel.value[Hsis.lang] + '" data-edu-type="' + v.eduType.value[Hsis.lang] + '"  data-status-id="' + v.status.id + '" data-pelc-id="' + v.pelcId + '" data-id="' + v.id + '" data-firstname ="' + v.firstName + '" data-lastname ="' + v.lastName + '" data-speciality="' + (v.eduLifeCycleByOrgs ? v.eduLifeCycleByOrgs[0].name[Hsis.lang] : "") + '">' +
                            '<td>' + (++count) + '</td>' +
                            '<td style="white-space: pre-line;">' + (v.eduLifeCycleByOrgs ? v.eduLifeCycleByOrgs[0].name[Hsis.lang] : "") + '</td>' +
                            '<td style="white-space: pre-line;">' + v.lastName + ' ' + v.firstName + ' ' + v.middleName + '</td>' +
                            '<td>' + v.eduType.value[Hsis.lang] + '</td>' +
                            '<td>' + v.score + '</td>' +
                            '<td style="white-space: pre-line;">' + v.startYearName + '</td>' +
                            '<td style="white-space: pre-line;">' + v.status.value[Hsis.lang] + '</td>' +
                            // '<td endActionTypeId = "' + v.endActionType.id + '" >' + actionType + '</td>' +
                            '<td endActionTypeId = "' + v.endActionType.id + '" >' + v.groupName + '</td>' +
                            // '<td>' + Hsis.Service.parseOperations(Hsis.operationList, '2', v) + '</td>' +
                            '</tr>';
                    });

                    if (data.studentCount > 0) {
                        $('span[data-student-count]').html(data.studentCount);
                    }

                    if ($('#main-div #load_more_div').children().length == 0) {
                        $('#main-div #load_more_div').html('<button  data-table="students" class="btn loading-margins btn-load-more">' + Hsis.dictionary[Hsis.lang]["load.more"] + '</button>');
                    }
                } else {
                    $('span[data-student-count]').html(0);
                }


                if (page) {
                    $('body').find('#student_list tbody').append(html);
                } else {
                    $('body').find('#student_list tbody').html(html);
                }


            }

        },
        parseAbroadStudents: function (data, page) {
            if (data) {
                var html = '';
                var count;

                if (page) {
                    count = $('#abroad_student_list tbody tr').length;
                } else {
                    count = 0;
                }

                var ref = data.studentList ? data.studentList : data;
                if (ref.length > 0) {
                    $.each(ref, function (i, v) {
                        html += '<tr data-image = "' + (v.imagePath ? v.imagePath : '') + '" data-note = "' + v.note + '" data-abroad-number="' + v.abroadNumber + '" data-pelc-id="' + v.pelcId + '" data-id="' + v.id + '" data-firstname ="' + v.firstName + '" data-lastname ="' + v.lastName + '" data-university="' + (v.eduLifeCycleByOrgs ? v.eduLifeCycleByOrgs[0].name[Hsis.lang] : "") + '">' +
                            '<td>' + (++count) + '</td>' +
                            '<td style="white-space: pre-line;">' + v.abroadNumber + '</td>' +
                            '<td style="white-space: pre-line;">' + v.lastName + ' ' + v.firstName + ' ' + v.middleName + '</td>' +
                            '<td style="white-space: pre-line;">' + v.countryName + '</td>' +
                            '<td style="white-space: pre-line;">' + (v.eduLifeCycleByOrgs ? v.eduLifeCycleByOrgs[0].name[Hsis.lang] : "") + '</td>' +
                            '<td style="white-space: pre-line;">' + v.eduLevel.value[Hsis.lang] + '</td>' +
                            '<td style="white-space: pre-line;">' + v.specDicrection.value[Hsis.lang] + '</td>' +
                            '<td style="white-space: pre-line;">' + v.allContact + '</td>' +
                            '<td style="white-space: pre-line;">' + v.graduateDate + '</td>' +
                            '<td style="white-space: pre-line;">' + v.abroadStatus.value[Hsis.lang] + '</td>' +
                            //                                '<td>' + v.birthDate + '</td>' +
                            //                                '<td>' + v.gender.value[Hsis.lang] + '</td>' +

                            '</tr>';
                    });

                    if (data.studentCount > 0) {
                        $('span[data-student-count]').html(data.studentCount);
                    }

                    if ($('#main-div #load_more_div').children().length == 0) {
                        $('#main-div #load_more_div').html('<button  data-table="abroad_students" class="btn loading-margins btn-load-more">' + Hsis.dictionary[Hsis.lang]["load.more"] + '</button>');
                    }
                } else {
                    $('span[data-student-count]').html(0);
                }


                if (page) {
                    $('body').find('#abroad_student_list tbody').append(html);
                } else {
                    $('body').find('#abroad_student_list tbody').html(html);
                }


            }

        },
        parseAcademicGroups: function (data, page) {
            if (data) {
                var html = '';
                var count;

                if (page) {
                    count = $('.main-content-upd #group-list tbody tr').length;
                } else {
                    count = 0;
                }

                if (data.list.length > 0) {
                    $.each(data.list, function (i, v) {
                        html += '<tr data-id="' + v.id + '" data-name ="' + v.name[Hsis.lang] + '" >' +
                            '<td>' + (++count) + '</td>' +
                            '<td>' + v.name[Hsis.lang] + '</td>' + '<td style="white-space:pre-line;">' + v.university.value[Hsis.lang] + '</td>' +
                            '<td style="white-space:pre-line;">' + v.faculty.value[Hsis.lang] + '</td>' +
                            '<td style="white-space:pre-line;">' + v.speciality.value[Hsis.lang] + '</td>' +
                            '<td>' + v.educationLevel.value[Hsis.lang] + '</td>' +
                            // '<td>' + Hsis.Service.parseOperations(Hsis.operationList, '2', v) + '</td>' +
                            '</tr>';
                    });
                } else {
                    $('span[data-student-count]').html(0);
                    $('span[data-group-count]').html(0);

                }


                // if (data.studentCount > 0) {
                $('span[data-student-count]').html(data.studentCount);                 //}

                // if (data.groupCount > 0) {
                $('span[data-group-count]').html(data.groupCount);
                // }

                if (page) {
                    $('body').find('#group-list tbody').append(html);
                } else {
                    $('body').find('#group-list tbody').html(html);
                }

                if ($('#main-div #load_more_div').children().length == 0) {
                    $('#main-div #load_more_div').html('<button  data-table="academic_groups" class="btn loading-margins btn-load-more">' + Hsis.dictionary[Hsis.lang]["load.more"] + '</button>');
                }

            }
        }, parseShares: function (data, page) {
            if (data) {
                var html = '';
                var count;

                if (page) {
                    count = $('.main-content-upd #share-list tbody tr').length;
                } else {
                    count = 0;
                }

                $.each(data, function (i, v) {
                    html += '<tr data-id="' + v.id + '" >' +
                        '<td>' + (++count) + '</td>' +
                        '<td>' + v.type.value[Hsis.lang] + '</td>' + '<td style="white-space:pre-line;">' + (((v.content).substr(0, 100)).length == 100 ? (v.content).substr(0, 100) + '...' : v.content) + '</td>' +
                        '<td>' + v.priority.value[Hsis.lang] + '</td>' +
                        '<td>' + v.startDate + ' ' + v.startTime + '</td>' +
                        '<td>' + v.endDate + ' ' + v.endTime + '</td>' +
                        // '<td>' + Hsis.Service.parseOperations(Hsis.operationList, '2', v) + '</td>' +
                        '</tr>';
                });

                if (page) {
                    $('body').find('#share-list tbody').append(html);
                } else {
                    $('body').find('#share-list tbody').html(html);
                }

                if ($('#main-div #load_more_div').children().length == 0) {
                    $('#main-div #load_more_div').html('<button  data-table="share" class="btn loading-margins btn-load-more">' + Hsis.dictionary[Hsis.lang]["load.more"] + '</button>');
                }

            }
        },
        parseTeachers: function (data, page) {
            if (data) {
                var html = '';
                var count;

                if (page) {
                    count = $('.main-content-upd #teacher_list tbody tr').length;
                } else {
                    count = 0;
                }
                if (data.teacherList && data.teacherList.length > 0) {
                    $.each(data.teacherList, function (i, v) {
                        html += '<tr data-image = "' + (v.image.path ? v.image.path : '') + '"data-orgname="' + v.orgName.value[Hsis.lang] + '" data-status-id="' + v.status.id + '" data-pwlc-id = "' + v.pwlcId + '" data-id="' + v.id + '" data-firstname ="' + v.firstName + '" data-lastname ="' + v.lastName + '">' +
                            '<td>' + (++count) + '</td>' +
                            '<td style="white-space:pre-line;">' + v.orgName.value[Hsis.lang] + '</td>' +
                            '<td style="white-space:pre-line;">' + v.lastName + ' ' + v.firstName + ' ' + v.middleName + '</td>' +
                            '<td>' + v.staff.value[Hsis.lang] + '</td>' +
                            '<td>' + v.position.value[Hsis.lang] + '</td>' +
                            //                            '<td style="white-space:pre-line;">' + v.structure.value[Hsis.lang] + '</td>' +
                            '<td>' + v.academicDegree.value[Hsis.lang] + '</td>' +
                            '<td style="white-space:pre-line;">' + v.academicName.value[Hsis.lang] + '</td>' +
                            '<td style="white-space:pre-line;">' + v.actionDate + '</td>' +
                            '<td style="white-space:pre-line;">' + v.status.value[Hsis.lang] + '</td>' +
                            // '<td>' + Hsis.Service.parseOperations(Hsis.operationList, '2', v) + '</td>' +
                            '</tr>';
                    });

                    if (data.teacherCount > 0) {
                        $('span[data-teacher-count]').html(data.teacherCount);
                    }

                    if ($('#main-div #load_more_div').children().length == 0) {
                        $('#main-div #load_more_div').html('<button  data-table="teachers" class="btn loading-margins btn-load-more">' + Hsis.dictionary[Hsis.lang]["load.more"] + '</button>');
                    }
                } else {
                    $('span[data-teacher-count]').html(0);
                }


                if (page) {
                    $('body').find('#teacher_list tbody').append(html);

                } else {
                    $('body').find('#teacher_list tbody').html(html);
                }

            }
        },
        parseStaffTable: function (data, page) {
            if (data) {
                var html = '';
                var count;

                if (page) {
                    count = $('.main-content-upd #staff_table tbody tr').length;
                } else {
                    count = 0;
                }
                if (data.teacherList && data.teacherList.length > 0) {
                    $.each(data.teacherList, function (i, v) {
                        html += '<tr data-image = "' + (v.image.path ? v.image.path : '') + '"data-orgname="' + v.orgName.value[Hsis.lang] + '" data-status-id="' + v.status.id + '" data-pwlc-id = "' + v.pwlcId + '" data-id="' + v.id + '" data-firstname ="' + v.firstName + '" data-lastname ="' + v.lastName + '">' +
                            '<td>' + (++count) + '</td>' +
                            '<td style="white-space:pre-line;">' + v.orgName.value[Hsis.lang] + '</td>' +
                            '<td style="white-space:pre-line;">' + v.lastName + ' ' + v.firstName + ' ' + v.middleName + '</td>' +
                            '<td>' + v.staff.value[Hsis.lang] + '</td>' +
                            '<td>' + v.position.value[Hsis.lang] + '</td>' +
                            '</tr>';
                    });

                    if (data.teacherCount > 0) {
                        $('span[data-teacher-count]').html(data.teacherCount);
                    }

                    if ($('#main-div #load_more_div').children().length == 0) {
                        $('#main-div #load_more_div').html('<button  data-table="staff_table" class="btn loading-margins btn-load-more">' + Hsis.dictionary[Hsis.lang]["load.more"] + '</button>');
                    }
                } else {
                    $('span[data-teacher-count]').html(0);
                }


                if (page) {
                    $('body').find('#staff_table tbody').append(html);

                } else {
                    $('body').find('#staff_table tbody').html(html);
                }

            }
        },
        parseForeignTeachers: function (data, page) {
            if (data) {
                var html = '';
                var count;

                if (page) {
                    count = $('.main-content-upd #teacher_list tbody tr').length;
                } else {
                    count = 0;
                }
                if (data.teacherList && data.teacherList.length > 0) {
                    $.each(data.teacherList, function (i, v) {
                        html += '<tr data-orgname="' + v.universitet[Hsis.lang] + '" data-status-id="' + (v.status.id == 1000341 ? v.status.id : "") + '" data-pwlc-id = "' + v.pwlcId + '" data-id="' + v.id + '" data-firstname ="' + v.firstName + '" data-lastname ="' + v.lastName + '">' +
                            '<td>' + (++count) + '</td>' +
                            '<td style="white-space:pre-line;">' + v.lastName + ' ' + v.firstName + ' ' + v.middleName + '</td>' +
                            '<td style="white-space:pre-line;">' + v.citizenship.value[Hsis.lang] + '</td>' +
                            '<td>' + v.universitet[Hsis.lang] + '</td>' +
                            '<td style="white-space:pre-line;">' + v.actionDate + '</td>' +
                            '<td>' + v.address + '</td>' +
                            '<td style="white-space:pre-line;">' + v.contact + '</td>' +
                            '<td style="white-space:pre-line;">' + v.pinCode + '</td>' +
                            '<td style="white-space:pre-line;">' + v.status.value[Hsis.lang] + '</td>' +
                            // '<td>' + Hsis.Service.parseOperations(Hsis.operationList, '2', v) + '</td>' +
                            '</tr>';
                    });

                    if (data.teacherCount > 0) {
                        $('span[data-teacher-count]').html(data.teacherCount);
                    }

                    if ($('#main-div #load_more_div').children().length == 0) {
                        $('#main-div #load_more_div').html('<button  data-table="teachers" class="btn loading-margins btn-load-more">' + Hsis.dictionary[Hsis.lang]["load.more"] + '</button>');
                    }
                } else {
                    $('span[data-teacher-count]').html(0);
                }


                if (page) {
                    $('body').find('#teacher_list tbody').append(html);

                } else {
                    $('body').find('#teacher_list tbody').html(html);
                }

            }
        },
        parseTeacherAction: function (data) {
            if (data.length > 0) {
                var html = '<div class="col-md-12 for-align teacher-action">' +
                    '<table class="table  col-md-12">' +
                    '<thead>' +
                    '<tr>' +
                    '<td>' + Hsis.dictionary[Hsis.lang]['university_name'] + '</td>' +
                    '<td>' + Hsis.dictionary[Hsis.lang]['spec_name'] + '</td>' +
                    '<td>' + Hsis.dictionary[Hsis.lang]['action_type'] + '</td>' +
                    '<td>' + Hsis.dictionary[Hsis.lang]['issue_date'] + '</td>' +
                    '<td></td>' +
                    '</tr>' +
                    '</thead>' +
                    '<tbody>';

                $.each(data, function (i, v) {
                    html +=
                        '<tr >' +
                        '<td>' + v.univer.value[Hsis.lang] + '</td>' +
                        '<td>' + v.org.value[Hsis.lang] + '</td>' +
                        '<td>' + v.actionType.value[Hsis.lang] + '</td>' +
                        '<td>' + v.actionDate + '</td>' +
                        '<td><div class="operations-button">' +
                        '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<span class="glyphicon glyphicon-list"></span>' +
                        '</div>' +
                        '<ul class="dropdown-menu">' +
                        '<li><a class="show-student-action"  data-id = "' + v.id + '" href="#">' + Hsis.dictionary[Hsis.lang]["show"] + ' </a></li>' +
                        '</ul>' +
                        '</div>' +
                        '</td>' +
                        '</tr>';

                });

                html += '</tbody>' +
                    '</table>' +
                    '</div>';
            } else {
                html += '<div class="blank-panel"><h3>' + Hsis.dictionary[Hsis.lang]['no_information'] + '</h3></div>';
            }

            return html;
        },
        parseScholarshipPlan: function (plan) {
            if (plan) {
                var html = '';
                $.each(plan, function (i, v) {
                    html += '<div data-id="' + v.id + '" data-count="' + v.scholarshipPlan + '" data-year="' + v.eduYearId + '" class="col-md-12 for-align scholarship-item">' +
                        '<table class="table-block col-md-12">' + '<thead>' +
                        '<tr>' +
                        '<th>' + Hsis.dictionary[Hsis.lang]["edu_year"] + '</th>' +
                        '<th>' + Hsis.dictionary[Hsis.lang]["place_count"] + '</th>' + '</tr>' +
                        '</thead>' +
                        '<tbody>' +
                        '<tr>' +
                        '<td data-year>' + v.eduYearName + '</td>' + '<td data-count>' + v.scholarshipPlan + '</td>' +
                        '</tr>' +
                        '</tbody>' +
                        '</table>' +
                        '<div class="operations-button">' +
                        '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<span class="glyphicon glyphicon-list"></span>' + '</div>' +
                        '<ul class="dropdown-menu">' + '<li>' +
                        '<a edit-scholarship="" data-id="' + v.id + '" data-year-name="' + v.eduYearName + '" data-year="' + v.eduYearId + '" data-count="' + v.scholarshipPlan + '"  href="#" class="edit">' + Hsis.dictionary[Hsis.lang]["edit"] + '</a>' +
                        '</li>' +
                        '<li>' +
                        '<a remove-scholarship="" data-id="' + v.id + '" data-year-name="' + v.eduYearName + '" data-year="' + v.eduYearId + '" data-count="' + v.scholarshipPlan + '"  href="#" class="edit">' + Hsis.dictionary[Hsis.lang]["erase"] + '</a>' +
                        '</li>' +
                        '</ul>' +
                        '</div>' +
                        '</div>';
                });
                $('#scholarplan_div').html(html);
            }
        },
        parseApplyAndGradPlan: function (plan) {
            if (plan) {
                var html = '';
                $.each(plan, function (i, v) {
                    html += '<div data-id="' + v.id + '" graduate-count="' + v.graduatePlan + '" apply-count="' + v.applyPlan + '" data-year="' + v.eduYearId + '" class="col-md-12 for-align applyandgrad-item">' +
                        '<table class="table-block col-md-12">' + '<thead>' +
                        '<tr>' +
                        '<th>' + Hsis.dictionary[Hsis.lang]["edu_year"] + '</th>' +
                        '<th>' + Hsis.dictionary[Hsis.lang]["apply_plan"] + '</th>' + '<th>' + Hsis.dictionary[Hsis.lang]["graduate_plan"] + '</th>' + '</tr>' +
                        '</thead>' +
                        '<tbody>' +
                        '<tr>' +
                        '<td data-year>' + v.eduYearName + '</td>' +
                        '<td apply-count>' + v.applyPlan + '</td>' +
                        '<td graduate-count>' + v.graduatePlan + '</td>' +
                        '</tr>' +
                        '</tbody>' +
                        '</table>' +
                        '<div class="operations-button">' +
                        '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<span class="glyphicon glyphicon-list"></span>' +
                        '</div>' +
                        '<ul class="dropdown-menu">' +
                        '<li>' +
                        '<a edit-applyandgrad="" data-id="' + v.id + '" data-year-name="' + v.eduYearName + '" data-year="' + v.eduYearId + '" graduate-count="' + v.graduatePlan + '" apply-count="' + v.applyPlan + '"  href="#" class="edit">' + Hsis.dictionary[Hsis.lang]["edit"] + '</a>' +
                        '</li>' +
                        '<li>' +
                        '<a remove-applyandgrad="" data-id="' + v.id + '"  href="#" >' + Hsis.dictionary[Hsis.lang]["erase"] + '</a>' +
                        '</li>' +
                        '</ul>' +
                        '</div>' +
                        '</div>';
                });
                $('#applyandgradplan_div').html(html);
            }
        },
        operation_1000057: function () {  // student view
            $('#main-div').load('partials/student_view.html', function () {

                Hsis.Proxy.getStudentDetails(localStorage.personId, function (data) {
                    if (data) {
                        console.log(data.image, data.image.path)
                        var html = '';
                        $('body .input-file-con .new-img-con').fadeIn(1)
                        if (data.image && data.image.path) {

                            $('body .input-file-con .new-img-con img').attr('src', Hsis.urls.HSIS + 'students/image/' + data.image.path + '?token=' + Hsis.token + '&size=200x200&' + Math.random());

                            $('body .input-file-con .new-img-con img').on('error', function (e) {
                                $('body .input-file-con .new-img-con img').attr('src', 'assets/img/guest.png');
                            });
                        } else {
                            $('body .input-file-con .new-img-con img').attr('src', 'assets/img/guest.png');
                        }

                        $('#firstname').val(data.firstName).attr('disabled', 'disabled');
                        $('#lastname').val(data.lastName).attr('disabled', 'disabled');
                        $('#middlename').val(data.middleName).attr('disabled', 'disabled');
                        $('#pincode').val(data.pinCode).attr('disabled', 'disabled');
                        $('#disability_degree').text(data.disabilityDegree.value[Hsis.lang]).attr('disabled', 'disabled').attr('data-id', data.disabilityDegree.id);

                        setTimeout(function () {
                            Hsis.Service.parseEditStudentAddress(data);
                            $('.contact-info .panel-body').html(Hsis.Service.parseViewStudentContact(data));
                        }, 1000);


                        if (data.contacts.length > 0) {
                            //localStorage.setItem('studentAddress',JSON.stringify(data.addresses));
                            setTimeout(function () {
                                $('.contact-info .panel-body').html(Hsis.Service.parseViewStudentContact(data));
                            }, 1000);
                        }
                        $('#citizenship').find('option[value="' + data.citizenship.id + '"]').attr('selected', 'selected');
                        $('#citizenship').attr('disabled', 'disabled');
                        $('#gender').find('option[value="' + data.gender.id + '"]').attr('selected', 'selected');
                        $('#gender').attr('disabled', 'disabled')
                        $('#marital_status').find('option[value="' + data.maritalStatus.id + '"]').attr('selected', 'selected');
                        $('#marital_status').attr('disabled', 'disabled')
                        $('#social_status').find('option[value="' + data.socialStatus.id + '"]').attr('selected', 'selected');
                        $('#social_status').attr('disabled', 'disabled')
                        $('#orphan_degree').find('option[value="' + data.orphanDegree.id + '"]').attr('selected', 'selected');
                        $('#orphan_degree').attr('disabled', 'disabled')
                        $('#military_status').find('option[value="' + data.militaryService.id + '"]').attr('selected', 'selected');
                        $('#military_status').attr('disabled', 'disabled')
                        $('#nationality').find('option[value="' + data.nationality.id + '"]').attr('selected', 'selected');
                        $('#nationality').attr('disabled', 'disabled');
                        $('.date-birthdate').val(data.birthDate).attr('disabled', 'disabled');
                        $('#main-div').attr('data-id', data.id);
                        $('#main-div').attr('data-pelc-id', data.pelcId);


                        var personal = 'personal';
                        var academic = 'academic';
                        var school = 'school';

                        if (data.documents.length > 0) {
                            $('.add-doc-block .panel-body').html(Hsis.Service.parseViewStudentDocument(data.documents, personal));
                        }

                        if (data.pelcDocuments.length > 0) {
                            $('.activity_name #acad_doc_add').html(Hsis.Service.parseViewStudentDocument(data.pelcDocuments, academic));
                        } else {
                            $('#acad_doc_add').html('<div class="blank-panel"><h3>' + Hsis.dictionary[Hsis.lang]['no_information'] + '</h3></div>');
                        }

                        $('.activity_name #school_doc_add').html(Hsis.Service.parseViewStudentDocument(data.schoolDocuments, school));

                        $('.student-relationships-div .panel-body').html(Hsis.Service.parseViewStudentRelationShip(data.relations));

                        $('.action-students .panel-body').html(Hsis.Service.parseStudentActions(data.pelcAction));
                        $('#main-div .edit-student-action').parent('li').remove();
                        $('#main-div .erase-student-action').parent('li').remove();

                        $('#action_type').find('option[value="' + data.actionType.id + '"]').attr('selected', 'selected');
                        $('#action_type').attr('disabled', 'disabled');
                        $('#edu_line').find('option[value="' + data.eduLineId.id + '"]').attr('selected', 'selected');
                        $('#edu_line').attr('disabled', 'disabled');
                        $('#edu_lang').find('option[value="' + data.eduLangId.id + '"]').attr('selected', 'selected');
                        $('#edu_lang').attr('disabled', 'disabled');
                        $('#edu_type').find('option[value="' + data.eduType.id + '"]').attr('selected', 'selected');
                        $('#edu_type').attr('disabled', 'disabled');
                        $('#edu_pay_type').find('option[value="' + data.eduPayType.id + '"]').attr('selected', 'selected');
                        $('#edu_pay_type').attr('disabled', 'disabled');
                        $('.second-info-date').val(data.actionDate).attr('disabled', 'disabled');
                        $('.student-card-number').val(data.studentCardNo).attr('disabled', 'disabled');
                        $('#edu_level').find('option[value="' + data.eduLevel.id + '"]').attr('selected', 'selected');
                        $('#edu_level').attr('disabled', 'disabled');


                        var orderType;
                        if (data.endActionType.id != 0) {
                            $('.in-action').addClass('hidden');
                            $('.out-action').removeClass('hidden');
                            $('.add-out-action').addClass('hidden');
                            $('.add-edulifecycle, #edu_org, #past_edu_doc_info').addClass('out-action-type');
                            $('#out-action-date').val(data.endActionDate);
                            Hsis.Proxy.loadDictionariesByTypeId('1000025', 1000259, function (actionType) {
                                var html = Hsis.Service.parseDictionaryForSelect(actionType);
                                $('#main-div .student-action-type').html(html);
                                $('#main-div .student-action-type').find('option[value="' + data.endActionType.id + '"]').prop('selected', true);
                                $('#main-div #student-academic-note').html(data.note);
                                Hsis.Proxy.loadDictionariesByTypeId(1000050, 0, function (reasons) {
                                    var html = Hsis.Service.parseDictionaryForSelect(reasons);
                                    $('#outReasonId').html(html);
                                    $('#outReasonId').find('option[value="' + data.reasonId + '"]').prop('selected', true);
                                    $('.out-action :input').attr('disabled', 'disabled');
                                });

                            });

                            orderType = orderType = data.endActionType.id;

                            Hsis.Proxy.getOrderDocumentsByType(orderType, Hsis.structureId, function (order) {
                                if (order) {
                                    var html = '<option value="0">' + Hsis.dictionary[Hsis.lang]["select"] + '</option>';
                                    var st = '';
                                    $.each(order, function (i, v) {
                                        st = v.startDate == null ? '' : '-' + (v.startDate).toString().slice(6, 10);
                                        html += '<option value="' + v.id + '">' + v.serial + v.number + st + '</option>';
                                    });
                                    $('#order').html(html);
                                    $('#main-div #order').find('option[value="' + data.orderId + '"]').attr('selected', 'selected').trigger('change');
                                    $('#main-div #order').attr('disabled', 'disabled');
                                }
                            });


                        } else {

                            $('#student-academic-action-date').val(data.endActionDate);
                            Hsis.Proxy.loadDictionariesByTypeId('1000025', 1000259, function (actionType) {
                                var html = Hsis.Service.parseDictionaryForSelect(actionType);
                                $('#main-div .student-action-type').html(html);
                                $('#main-div .student-action-type').find('option[value="' + data.endActionType.id + '"]').prop('selected', true);
                                $('#main-div #student-academic-note').html(data.note);
                                Hsis.Proxy.loadDictionariesByTypeId(1000050, 0, function (reasons) {
                                    var html = Hsis.Service.parseDictionaryForSelect(reasons);
                                    // $('#reasonId').html(html);
                                    $('#reasonId').find('option[value="' + data.reasonId + '"]').prop('selected', true);
                                    $('.out-action :input').attr('disabled', 'disabled');
                                });

                            });
                            $('.in-action').removeClass('hidden');
                            if (data.status.id != 1000340) {
                                $('.add-out-action').addClass('hidden');
                            } else {
                                $('.add-out-action').removeClass('hidden');
                            }

                            orderType = data.actionType.id;
                        }

                        Hsis.Proxy.getOrderDocumentsByType(data.actionType.id, Hsis.structureId, function (order) {
                            if (order) {
                                var html = '<option value="0">' + Hsis.dictionary[Hsis.lang]["select"] + '</option>';
                                var st = '';
                                $.each(order, function (i, v) {
                                    st = v.startDate == null ? '' : '-' + (v.startDate).toString().slice(6, 10);
                                    html += '<option value="' + v.id + '">' + v.serial + v.number + st + '</option>';
                                });
                                $('#order').html(html);
                                $('#main-div #order').find('option[value="' + data.orderId + '"]').attr('selected', 'selected').trigger('change');
                                $('#main-div #order').attr('disabled', 'disabled');
                            }
                        });

                        $.each(data.eduLifeCycleByOrgs, function (i, v) {
                            if (v.type.id == 1000057 || v.type.id == 1000604) {
                                Hsis.Proxy.getFilteredStructureList(Hsis.structureId, v.type.id, 0, function (specialities) {
                                    if (specialities) {
                                        var html = '<option value = "0">' + Hsis.dictionary[Hsis.lang]['select'] + '</option>';
                                        $.each(specialities, function (k, l) {
                                            html += '<option value="' + l.id + '">' + l.name[Hsis.lang] + '</option>'
                                        })
                                        $('#main-div #orgId').html(html);
                                    }
                                    $('#orgId').find('option[value="' + v.id + '"]').attr('selected', 'selected');
                                    $('#orgId').attr('disabled', 'disabled');
                                });

                            } else if (v.type.id == 1000056) {
                                $('.edit-graduated-school').attr('data-pelc-id', v.pelcId);
                                Hsis.Proxy.getFilteredStructureList(Hsis.structureId, '1000056', v.addressTreeId, function (schools) {
                                    var html = '<option value="0">' + Hsis.dictionary[Hsis.lang]['select'] + '</option>';
                                    if (schools) {
                                        $.each(schools, function (k, j) {
                                            html += '<option value="' + j.id + '">' + j.name[Hsis.lang] + '</option>';
                                        })
                                    }
                                    ;
                                    $('#schoolId').html(html);
                                    $('#schoolId').find('option[value = "' + v.id + '"]').attr("selected", "selected");
                                    $('#schoolId').attr('disabled', 'disabled');
                                    $('#graduatedDate').val(v.actionDate).attr('disabled', 'disabled');
                                })
                            } else if (v.type.id == 1002306) {
                                $('#main-div #edu_level').find('option[value="1000604"]').prop('selected', true);
                                var eduLevel = 1000604;
                                Hsis.Proxy.getFilteredStructureList(Hsis.structureId, eduLevel, 0, function (specialities) {
                                    if (specialities) {
                                        var html = '<option value = "0">' + Hsis.dictionary[Hsis.lang]['select'] + '</option>';
                                        $.each(specialities, function (i, v) {
                                            html += '<option value="' + v.id + '">' + v.name[Hsis.lang] + '</option>'
                                        });
                                        $('#main-div #orgId').html(html);
                                        $('#main-div #orgId').find('option[value="' + v.type.parentId + '"]').prop('selected', true);
                                        $('#main-div #edit_uni_action_orgId').html(html);
                                        Hsis.Proxy.getFilteredStructureList(v.type.parentId, '1002306', 0, function (subSpeciality) {
                                            if (subSpeciality) {
                                                var html = '<option value = "0">' + Hsis.dictionary[Hsis.lang]['select'] + '</option>';
                                                $.each(subSpeciality, function (i, g) {
                                                    html += '<option value="' + g.id + '">' + g.name[Hsis.lang] + '</option>'
                                                })
                                                $('#sub_speciality').html(html);
                                                $('#sub_speciality').find('option[value="' + v.id + '"]').prop('selected', true);
                                                $('.sub_speciality').removeClass('hidden');
                                                $('#sub_speciality').attr('disabled', 'disabled');
                                                $('#orgId').attr('disabled', 'disabled');
                                            } else {
                                                $('.sub_speciality').addClass('hidden');
                                            }
                                        })
                                    }
                                });

                            }
                        })

                        $('#score').val(data.score).attr('disabled', 'disabled');


                        var pelcId = data.pelcId;
                        Hsis.Proxy.getStudentEduPlanSubject(pelcId, function (data) {
                            if (data && data.data) {
                                var html;
                                $('body .eduplan_name').text(data.data.name)
                                $.each(data.data.allSubjects, function (i, v) {

                                    var html = '<tr data-subject-id = "' + v.id + '" data-id = "' + v.pelcMark.id + '" data-pelc-id = "' + pelcId + '">' +
                                        '<td>' + (++i) + '</td>' +
                                        '<td>' + v.name + '</td>' +
                                        '<td>' + v.code + '</td>' +
                                        '<td><select class="form-control subject_type" disabled="disabled"></select></td>' +
                                        '<td><input name="graduatePoint" class="form-control graduate_point" disabled="disabled"></td>' +
                                        '</tr>'
                                    $('#main-div #subject_list tbody').append(html)
                                    Hsis.Proxy.loadDictionariesByTypeId('1000097', 0, function (maritalStatus) {
                                        var html = Hsis.Service.parseDictionaryForSelect(maritalStatus);
                                        $('#main-div #subject_list tbody tr[data-id = "' + v.pelcMark.id + '"] select').html(html);
                                        $('#main-div #subject_list tbody tr[data-id = "' + v.pelcMark.id + '"] select').val(v.pelcMark.graduateType.id);
                                    });
                                    $('#main-div #subject_list tbody tr[data-id = "' + v.pelcMark.id + '"] input').val(v.pelcMark.graduateMark > 0 ? v.pelcMark.graduateMark : '');

                                })
                            }
                        })
                    }


                });
            });
        },


        operation_1001362: function () {
            // student view
            $('#main-div').load('partials/abroad_student_view.html', function () {
                // return false
                Hsis.Proxy.getAbroadStudentDetails(localStorage.personId, function (data) {
                    if (data) {
                        var html = '';

                        if (data.image && data.image.path) {
                            $('body .input-file-con .new-img-con').fadeIn(1)
                            $('body .input-file-con .new-img-con img').attr('src', Hsis.urls.HSIS + 'students/image/' + data.image.path + '?token=' + Hsis.token + '&size=200x200&' + Math.random());

                            $('body .input-file-con .new-img-con img').on('error', function (e) {
                                $('body .input-file-con .new-img-con img').attr('src', 'assets/img/guest.png');
                            });
                        }

                        $('#firstname').val(data.firstName).attr('disabled', 'disabled');
                        $('#lastname').val(data.lastName).attr('disabled', 'disabled');
                        $('#middlename').val(data.middleName).attr('disabled', 'disabled');
                        $('#pincode').val(data.pinCode).attr('disabled', 'disabled');

                        if (data.contacts.length > 0) {
                            setTimeout(function () {
                                Hsis.Service.parseEditStudentAddress(data);
                                $('.contact-info .panel-body').html(Hsis.Service.parseViewStudentContact(data));
                            }, 1000);
                        }

                        // $('#gender').find('option[value="' + data.gender.id + '"]').attr('selected', 'selected');
                        // $('#gender').attr('disabled', 'disabled');
                        // $('#marital_status').find('option[value="' + data.maritalStatus.id + '"]').attr('selected', 'selected');
                        // $('#marital_status').attr('disabled', 'disabled');
                        // $('#military_status').find('option[value="' + data.militaryService.id + '"]').attr('selected', 'selected');
                        // $('#military_status').attr('disabled', 'disabled');
                        $('.date-birthdate').val(data.birthDate).attr('disabled', 'disabled');
                        // $('#main-div').attr('data-id', data.id);
                        // $('#main-div').attr('data-pelc-id', data.pelcId);

                        $('#citizenship').find('option[value="' + data.citizenship.id + '"]').attr('selected', 'selected');
                        $('#citizenship').attr('disabled', 'disabled');
                        $('#gender').find('option[value="' + data.gender.id + '"]').attr('selected', 'selected');
                        $('#gender').attr('disabled', 'disabled');
                        $('#marital_status').find('option[value="' + data.maritalStatus.id + '"]').attr('selected', 'selected');
                        $('#marital_status').attr('disabled', 'disabled');
                        $('#social_status').find('option[value="' + data.socialStatus.id + '"]').attr('selected', 'selected');
                        $('#social_status').attr('disabled', 'disabled');
                        $('#orphan_degree').find('option[value="' + data.orphanDegree.id + '"]').attr('selected', 'selected');
                        $('#orphan_degree').attr('disabled', 'disabled');
                        $('#military_status').find('option[value="' + data.militaryService.id + '"]').attr('selected', 'selected');
                        $('#military_status').attr('disabled', 'disabled');
                        $('#nationality').find('option[value="' + data.nationality.id + '"]').attr('selected', 'selected');
                        $('#nationality').attr('disabled', 'disabled');
                        $('#main-div').attr('data-id', data.id);
                        $('#main-div').attr('data-pelc-id', data.pelcId);


                        var personal = 'personal';
                        var academic = 'academic';
                        var school = 'school';

                        if (data.documents.length > 0) {
                            $('.add-doc-block .panel-body').html(Hsis.Service.parseViewStudentDocument(data.documents, personal));
                        }

                        if (data.pelcDocuments.length > 0) {
                            $('.activity_name #acad_doc_add').html(Hsis.Service.parseViewStudentDocument(data.pelcDocuments, academic));
                        } else {
                            $('#acad_doc_add').html('<div class="blank-panel"><h3>' + Hsis.dictionary[Hsis.lang]['no_information'] + '</h3></div>');
                        }

//                        $('.activity_name #school_doc_add').html(Hsis.Service.parseViewStudentDocument(data.schoolDocuments, school));

                        $('.student-relationships-div .panel-body').html(Hsis.Service.parseViewStudentRelationShip(data.relations));

                        $('.action-students .panel-body').html(Hsis.Service.parseStudentActions(data.pelcAction));
                        $('#main-div .edit-student-action').parent('li').remove();
                        $('#main-div .erase-student-action').parent('li').remove();

                        $('#main-div #edu_line').val(data.eduLineId.id);
                        $('#main-div #edu_lang').val(data.eduLangId.id);
                        $('#main-div #abroad_edu_level').val(data.eduLevel.id);
                        $('#main-div #action_date').val(data.actionDate);
                        $('#main-div #private_work_number').val(data.abroadNumber);
                        $('#main-div #graduate_date').val(data.graduateDate);
                        $('#main-div #edu-period').val(data.eduPeriod);
                        $('#main-div #status').val(data.abroadStatus.id);
                        $('#main-div #speciality').val(data.spec.id);
                        $('#main-div #spec_direction').val(data.specDicrection.id);
                        $('#main-div #note').val(data.note);

                        Hsis.Proxy.loadAdressTypes('1000051', function (country) {
                            var html = Hsis.Service.parseDictionaryForSelect(country);
                            $('#main-div #foreign_country').html(html);
                            $('#main-div #foreign_country').val(data.countryId);

                            Hsis.Proxy.loadAdressTypes(data.countryId, function (city) {
                                var html = Hsis.Service.parseDictionaryForSelect(city);
                                $('#main-div #foreign_city').html(html);
                                $('#main-div #foreign_city').val(data.cityId);

                                Hsis.Proxy.getStructureListByAdress(data.cityId, function (uni) {
                                    if (uni && uni.data) {
                                        var html = '';

                                        html = '<option value = "0">' + Hsis.dictionary[Hsis.lang]["select"] + '</option>'
                                        $.each(uni.data, function (i, v) {
                                            html += '<option value = "' + v.id + '">' + v.value[Hsis.lang] + '</option>'
                                        })
                                        $('#foreign_university').html(html)
                                        $('#foreign_university').val(data.curOrgId.id)

                                    }
                                })
                            });

                        });

                        if (data.achievements) {
                            Hsis.Service.parseViewAbroadStudentAchievement(data.achievements)
                        }
                        if (data.achievements) {
                            Hsis.Service.parseViewAbroadStudentRegistrationDate(data.registrationDates);
                        }
                    }


                });
            });
        },
        parseOrder: function (data, page) {
            if (data) {
                var html = '';
                var count;
                if (page) {
                    count = $('.main-content-upd #order-list tbody tr').length;
                } else {
                    count = 0;
                }
                $.each(data, function (i, v) {
                    html += '<tr data-id="' + v.id + '" data-org-id="' + v.org.id + '" data-type-parent-id="' + v.type.parentId + '" data-type-id="' + v.type.id + '" data-status-id="' + v.status.id + '">' +
                        '<td>' + (++count) + '</td>' +
                        '<td>' + v.org.value[Hsis.lang] + '</td>' +
                        '<td style="white-space:pre-line;">' + v.type.value[Hsis.lang] + '</td>' +
                        '<td>' + v.serial + '</td>' +
                        '<td>' + v.number + '</td>' +
                        '<td>' + v.startDate + '</td>' +
                        '<td>' + v.status.value[Hsis.lang] + '</td>' +
                        // '<td>' + Hsis.Service.parseOperations(Hsis.operationList, '2', v) + '</td>' +
                        '</tr>';
                });

                if (page) {
                    $('body').find('#order-list tbody').append(html);
                } else {
                    $('body').find('#order-list tbody').html(html);
                }

                if ($('#main-div #load_more_div').children().length == 0) {
                    $('#main-div #load_more_div').html('<button  data-table="order_module" class="btn loading-margins btn-load-more">' + Hsis.dictionary[Hsis.lang]["load.more"] + '</button>');
                }
            }
        },
        parseTechnical: function (data, page) {
            if (data) {
                var html = '';
                var count;
                if (page) {
                    count = $('.main-content-upd #technical-list tbody tr').length;
                } else {
                    count = 0;
                }
                $.each(data, function (i, v) {
                    html += '<tr data-id="' + v.id + '">' +
                        '<td>' + (++count) + '</td>' +
                        '<td>' + v.org.value[Hsis.lang] + '</td>' +
                        '<td style="white-space:pre-line;">' + v.type.value[Hsis.lang] + '</td>' +
                        '<td>' + v.name + '</td>' +
                        '<td>' + (v.volume ? v.volume : '-') + '</td>' +
                        '<td>' + (v.area ? v.area : '-') + '</td>' +
                        // '<td>' + Hsis.Service.parseOperations(Hsis.operationList, '2', v) + '</td>' +
                        '</tr>';
                });

                if (page) {
                    $('body').find('#technical-list tbody').append(html);
                } else {
                    $('body').find('#technical-list tbody').html(html);
                }

                if ($('#main-div #load_more_div').children().length == 0) {
                    $('#main-div #load_more_div').html('<button  data-table="technical_module" class="btn loading-margins btn-load-more">' + Hsis.dictionary[Hsis.lang]["load.more"] + '</button>');
                }
            }
        },
        parseDiplom: function (data, page) {
            if (data) {
                var html = '';
                var count;
                if (page) {
                    count = $('.main-content-upd #diplom-list tbody tr').length;
                } else {
                    count = 0;
                }
                $.each(data, function (i, v) {
                    html += '<tr data-serial="' + v.serial + '" data-org="' + v.org.id + '" data-year-id="' + v.graduateDate.id + '" data-type="' + v.type.id + '" data-level="' + v.eduLevel.id + '">' +
                        '<td>' + (++count) + '</td>' +
                        '<td>' + v.org.value[Hsis.lang] + '</td>' +
                        '<td style="white-space:pre-line;">' + v.type.value[Hsis.lang] + '</td>' +
                        '<td style="white-space:pre-line;">' + v.eduLevel.value[Hsis.lang] + '</td>' +
                        '<td>' + v.serial + '</td>' +
                        '<td>' + v.minNumber + ' - ' + v.maxNumber + '</td>' +
                        '<td style="white-space:pre-line;">' + v.graduateDate.value[Hsis.lang] + '</td>' +
                        //                            '<td style="white-space:pre-line;">' + (v.student.id > 0 ? (v.student.lastName + ' ' + v.student.firstName + ' ' + v.student.middleName) : '-') + '</td>' +
                        // '<td>' + Hsis.Service.parseOperations(Hsis.operationList, '2', v) + '</td>' +
                        '</tr>';
                });

                if (page) {
                    $('body').find('#diplom-list tbody').append(html);
                } else {
                    $('body').find('#diplom-list tbody').html(html);
                }

                if ($('#main-div #load_more_div').children().length == 0) {
                    $('#main-div #load_more_div').html('<button  data-table="diplom_module" class="btn loading-margins btn-load-more">' + Hsis.dictionary[Hsis.lang]["load.more"] + '</button>');
                }
            }
        },
        operation_1000058: function () { // teacher view
            $('#main-div').load('partials/teacher_view.html', function () {
                Hsis.Proxy.getTeacherDetails(localStorage.personId, function (data) {
                    var html = '';

                    if (data.image && data.image.path) {
                        $('body .input-file-con .new-img-con').fadeIn(1)
                        $('body .input-file-con .new-img-con img').attr('src', Hsis.urls.HSIS + 'teachers/image/' + data.image.path + '?token=' + Hsis.token + '&size=200x200&' + Math.random());

                        $('body .input-file-con .new-img-con img').on('error', function (e) {
                            $('body .input-file-con .new-img-con img').attr('src', 'assets/img/guest.png');
                        });
                    }


                    $('#firstname').val(data.firstName).attr('disabled', 'disabled');
                    $('#lastname').val(data.lastName).attr('disabled', 'disabled');
                    $('#middlename').val(data.middleName).attr('disabled', 'disabled');
                    $('#pincode').val(data.pinCode).attr('disabled', 'disabled');
//                    Hsis.Proxy.getPersonInfoByPinCode(data.pinCode, function (iamasdata) {
//                        if (data && data.firstName && data.lastName && data.middleName && data.birthDate) {
//                            if (iamasdata.image.file !== null) {
//                                $('#main-div .edit-common-info-image').attr('src', "data:image/png;base64," + iamasdata.image.file);
//                                $('#main-div .edit-common-info-image').on('error', function (e) {
//                                    $(this).attr('src', 'assets/img/guest.png');
//                                });
//                            }
//                        } else {
//                            $('#main-div .edit-common-info-image').attr('src', 'assets/img/guest.png');
//                        }
//
//
//                    });

                    $('#citizenship').find('option[value="' + data.citizenship.id + '"]').attr('selected', 'selected');
                    $('#citizenship').attr('disabled', 'disabled')
                    $('#gender').find('option[value="' + data.gender.id + '"]').attr('selected', 'selected');
                    $('#gender').attr('disabled', 'disabled');
                    $('#marital_status').find('option[value="' + data.maritalStatus.id + '"]').attr('selected', 'selected');
                    $('#marital_status').attr('disabled', 'disabled');
                    $('#social_status').find('option[value="' + data.socialStatus.id + '"]').attr('selected', 'selected');
                    $('#social_status').attr('disabled', 'disabled');
                    $('#orphan_degree').find('option[value="' + data.orphanDegree.id + '"]').attr('selected', 'selected');
                    $('#orphan_degree').attr('disabled', 'disabled');
                    $('#disability_degree').find('option[value="' + data.disabilityDegree.id + '"]').attr('selected', 'selected');
                    $('#disability_degree').attr('disabled', 'disabled');
                    $('#military_status').find('option[value="' + data.militaryService.id + '"]').attr('selected', 'selected');
                    $('#military_status').attr('disabled', 'disabled');
                    $('#nationality').find('option[value="' + data.nationality.id + '"]').attr('selected', 'selected');
                    $('#nationality').attr('disabled', 'disabled');
                    $('.date-birthdate').val(data.birthDate).attr('disabled', 'disabled');
                    $('#main-div').attr('data-id', data.id);
                    $('#main-div').attr('data-pwlc-id', data.pwlcId);
                    $('#main-div').attr('data-type', 'emp-view');

                    setTimeout(function () {
                        Hsis.Service.parseEditStudentAddress(data);
                    }, 1000);

                    $('body .contact-info .panel-body').html(Hsis.Service.parseViewStudentContact(data));
                    var personal = 'personal';
                    var work = 'work';

                    if (data.documents.length > 0) {
                        $('.add-doc-block .panel-body').html(Hsis.Service.parseViewTeacherDocument(data.documents, personal));
                    }

                    if (data.pwlcDocuments.length > 0) {
                        $('.activity_name #work_doc_add').html(Hsis.Service.parseViewTeacherDocument(data.pwlcDocuments, work));
                    }

                    if (data.languages.length > 0) {
                        $('#append_languages').html(Hsis.Service.parseViewTeacherLanguages(data));
                    }

                    if (data.subjects.length > 0) {
                        $('#append_subjects').html(Hsis.Service.parseViewTeacherSubjects(data));
                    }


                    $('.edu_info .edu-info-block').html(Hsis.Service.parseViewTeacherEduLifeCycle(data));

                    $('.edit-academic-degree-info .panel-body').html(Hsis.Service.parseViewTeacherAcademicDegree(data.academicDegrees));
                    $('.edit-research-history-info .panel-body').html(Hsis.Service.parseViewTeacherAcademicActivity(data.academicActivitys));

                    console.log(data);
                    Hsis.Service.parseWorkLifeCycle(data.workActions);
                    $('li .edit-work-action,li .erase-work-action').remove();

                });
            });

        },
        parseWorkLifeCycle: function (data) {
            if (data) {
                var html = '';
                $.each(data, function (i, v) {
                    html += '<div class="col-md-12 for-align work-action" org-parent="' + v.parentOrgType + '" data-status-id="1000341" data-id="' + v.id + '" start-action="' + v.actionType.id + '" start-date="' + v.actionDate + '" end-date="' + (v.endActionDate != null ? v.endActionDate : '') + '" end-action ="' + v.endActionType.id + '" card-no="' + (v.cardNo != null ? v.cardNo : '') + '" org="' + v.org.id + '" teaching="' + v.teaching + '" staff-type="' + v.staffType.id + '" position="' + v.position.id + '" note="' + (v.note != null ? v.note : '') + '" >' +
                        '<table class="table-block col-md-12">' +
                        '<thead>' +
                        '<tr>' +
                        '<th style="width:145px;">' + Hsis.dictionary[Hsis.lang]["university"] + '</th>' +
                        '<th>' + Hsis.dictionary[Hsis.lang]["start_action_type"] + ' </th>' +
                        '<th>' + Hsis.dictionary[Hsis.lang]["start_date"] + ' </th>' +
                        '<th>' + Hsis.dictionary[Hsis.lang]["end_action_type"] + ' </th>' +
                        '<th>' + Hsis.dictionary[Hsis.lang]["end_date"] + ' </th>' +
                        '<th></th>' +
                        '</tr>' +
                        '</thead>' +
                        '<tbody>' +
                        '<tr>' + '<td org-name="" style="width:145px;">' + v.university.value[Hsis.lang] + '</td>' +
                        '<td start-action="">' + v.actionType.value[Hsis.lang] + '</td>' +
                        '<td start-date="">' + v.actionDate + '</td>' +
                        '<td end-action="">' + v.endActionType.value[Hsis.lang] + '</td>' +
                        '<td end-date="">' + (v.endActionDate != null ? v.endActionDate : '') + '</td>' +
                        '<td></td>' +
                        '</tr>' +
                        '</tbody>' +
                        '</table>' +
                        '<div class="operations-button">' +
                        '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<span class="glyphicon glyphicon-list"></span>' +
                        '</div>' +
                        '<ul class="dropdown-menu">' +
                        '<li><a class="show-work-action"  href="#" university-name="' + v.university.value[Hsis.lang] + '" start-action-name="' + v.actionType.value[Hsis.lang] + '" teaching-name="" end-action-name="' + v.endActionType.value[Hsis.lang] + '" org-name="' + v.org.value[Hsis.lang] + '" position-name="' + v.position.value[Hsis.lang] + '" staff-name="' + v.staffType.value[Hsis.lang] + '">' + Hsis.dictionary[Hsis.lang]["show"] + '</a></li>' +
                        (v.endActionType.id == 0 ? ('<li><a class="edit-work-action"  href="#">' + Hsis.dictionary[Hsis.lang]["edit"] + '</a></li>' +
                            '<li><a class="erase-work-action" data-page="edit" >' + Hsis.dictionary[Hsis.lang]["erase"] + '</a></li>') : '') +
                        '</ul>' +
                        '</div>' +
                        '</div>';
                });
                $('#work_action_block').html(html);
            }
        },
        parseStudentsInAbroad: function (data, page) {
            if (data) {
                var html = '';
                var count;

                if (page) {
                    count = $('.main-content-upd #foreign_student_list tbody tr').length;
                } else {
                    count = 0;
                }

                $.each(data.list, function (i, v) {
                    html += '<tr data-edu-level="' + v.eduLevel.value[Hsis.lang] + '" data-parent-workplace ="' + v.parentsWorkPlace + '" data-contact = "' + v.contact + '" data-address = "' + v.address + '"  data-birthdate ="' + v.birthdate + '" data-edu-type="' + v.eduType.value[Hsis.lang] + '"  data-start-year="' + v.eduStartYear + '" data-end-year="' + v.eduEndYear + '" data-note="' + v.note + '" data-fullname ="' + v.fullname + '"  data-speciality="' + v.specialty[Hsis.lang] + '">' +
                        '<td>' + (++count) + '</td>' +
                        '<td style="white-space: pre-line;">' + v.university[Hsis.lang] + '</td>' +
                        '<td>' + v.specialty[Hsis.lang] + '</td>' +
                        '<td style="white-space: pre-line;">' + v.fullname + '</td>' +
                        '<td>' + v.gender.value[Hsis.lang] + '</td>' +
                        '</tr>';
                });

                if (data.count > 0) {
                    $('span[data-student-count]').html(data.count);
                }

                if ($('#main-div #load_more_div').children().length == 0) {
                    $('#main-div #load_more_div').html('<button  data-table="foreign_students" class="btn loading-margins btn-load-more">' + Hsis.dictionary[Hsis.lang]["load.more"] + '</button>');
                }


                if (page) {
                    $('body').find('#foreign_student_list tbody').append(html);
                } else {
                    $('body').find('#foreign_student_list tbody').html(html);
                }


            } else {
                $('span[data-student-count]').html(0);
            }

        },
        parseForeignStudents: function (data, page) {
            if (data) {
                var html = '';
                var count;

                if (page) {
                    count = $('#foreign_student_list tbody tr').length;
                } else {
                    count = 0;
                }

                if (data.studentList.length > 0) {
                    $.each(data.studentList, function (i, v) {

                        var actionType = (v.endActionType.id == "0") ? v.actionType.value[Hsis.lang] : v.endActionType.value[Hsis.lang];
                        html += '<tr  data-edu-level="' + v.eduLevel.value[Hsis.lang] + '" data-edu-type="' + v.eduType.value[Hsis.lang] + '"  data-pelc-id="' + v.pelcId + '" data-id="' + v.id + '" data-firstname ="' + v.firstName + '" data-lastname ="' + v.lastName + '" >' +
                            '<td>' + (++count) + '</td>' +
                            '<td style="white-space: pre-line;">' + v.lastName + ' ' + v.firstName + ' ' + v.middleName + '</td>' +
                            '<td style="white-space: pre-line;">' + v.citizenship.value[Hsis.lang] + '</td>' +
                            '<td style="white-space: pre-line;">' + v.universitet[Hsis.lang] + '</td>' +
                            '<td style="white-space: pre-line;">' + v.specialty[Hsis.lang] + '</td>' +
                            '<td>' + v.eduLevel.value[Hsis.lang] + '</td>' +
                            '<td>' + v.eduType.value[Hsis.lang] + '</td>' +
                            '<td>' + v.eduLineId.value[Hsis.lang] + '</td>' +
                            '<td>' + v.startYearName + '</td>' +
                            '<td>' + v.eduCourseYear + '</td>' +
                            '<td>' + v.pinCode + '</td>' +
                            '<td>' + v.myiNumber + '</td>' +
                            '<td>' + actionType + '</td>' +
                            '</tr>';
                    });

                    if (data.studentCount > 0) {
                        $('span[data-student-count]').html(data.studentCount);
                    }

                    if ($('#main-div #load_more_div').children().length == 0) {
                        $('#main-div #load_more_div').html('<button  data-table="students" class="btn loading-margins btn-load-more">' + Hsis.dictionary[Hsis.lang]["load.more"] + '</button>');
                    }
                } else {
                    $('span[data-student-count]').html(0);
                }


                if (page) {
                    $('body').find('#foreign_student_list tbody').append(html);
                } else {
                    $('body').find('#foreign_student_list tbody').html(html);
                }


            }

        },
        parseStudentsWithoutOrder: function (data, page) {
            var html = '';
            var count = 0;
            if (page) {
                count = $('#student_list_without tbody tr').length;
            } else {
                count = 0;
            }
            if (data && data.studentList.length > 0) {
                $.each(data.studentList, function (i, v) {
                    html += '<tr data-id = "' + v.pelcId + '">' +
                        '<td>' + (++count) + '</td>' +
                        '<td style="white-space: pre-line;">' + v.curOrgId.value[Hsis.lang] + '</td>' +
                        '<td>' + v.firstName + ' ' + v.lastName + ' ' + v.middleName + '</td>' +
                        '<td><div>' +
                        '<input name="studentsId" type="checkbox" value="' + v.pelcId + '">' +
                        '</div></td>' +
                        '</tr>';
                });
                if (data.studentCount > 0) {
                    count = data.studentCount;
                }


                if ($('#main-div #students_without_order').find('#load_more_div').children().length == 0) {
                    $('#main-div #students_without_order').find('#load_more_div').html('<button  data-table="students-without-order" class="btn loading-margins btn-load-more">' + Hsis.dictionary[Hsis.lang]["load.more"] + '</button>');
                }

            } else {
                $('#main-div #students_without_order').find('#load_more_div').html('');

            }
            $('[data-student-count]').html(count);
            if (page) {
                $('#student_list_without tbody').append(html);
            } else {
                $('#student_list_without tbody').html(html);
            }
            $('body').find('a[href=#tab1]').attr('data-count', count);

        },
        parseStudentsWithOrder: function (data, page, parseType) {
            var html = '';
            var count = 0;
            if (page) {
                count = $('#students_with_order tbody tr').length;
            } else {
                count = 0;
            }
            if (data && data.studentList.length > 0) {

                $.each(data.studentList, function (i, v) {
                    html += '<tr data-id ="' + v.pelcId + '">' +
                        '<td>' + (++count) + '</td>' +
                        '<td style="white-space: pre-line;">' + v.curOrgId.value[Hsis.lang] + '</td>' +
                        '<td>' + v.firstName + ' ' + v.lastName + ' ' + v.middleName + '</td>' +
                        '<td>' + ((parseType && parseType == "view") ? '' : '<a href="" class="removeStudent"><i class="fa fa-remove" style="font-size:24px;color:red"></i></a>') + '</td>' +
                        '</tr>';
                });
                if (data.studentCount > 0) {
                    count = data.studentCount;
                }


                if ($('#main-div #students_with_order').find('#load_more_div').children().length == 0) {
                    $('#main-div #students_with_order').find('#load_more_div').html('<button data-table="students-with-order" ' + (parseType && parseType == "view" ? 'data-parsetype="view"' : '') + '  class="btn loading-margins btn-load-more">' + Hsis.dictionary[Hsis.lang]["load.more"] + '</button>');
                }
            } else {
                $('#main-div #students_with_order').find('#load_more_div').html('');
            }
            $('[data-student-count]').html(count);
            if (page) {
                $('#students_with_order tbody').append(html);
            } else {
                $('#students_with_order tbody').html(html);
            }
            $('body').find('a[href=#tab2]').attr('data-count', count);


        },

        parseForeignRelation: function (data, page) {
            if (data) {
                var html = '';
                var count;
                if (page) {
                    count = $('.main-content-upd #foreign_relation_list tbody tr').length;
                } else {
                    count = 0;
                }
                $.each(data, function (i, v) {
                    html += '<tr data-id="' + v.id + '">' +
                        '<td>' + (++count) + '</td>' +
                        '<td>' + v.country.value[Hsis.lang] + '</td>' +
                        '<td>' + v.company.value[Hsis.lang] + '</td>' +
                        '<td>' + v.startDate + '</td>' +
                        '<td>' + v.endDate + '</td>' +
                        '</tr>';
                });

                if (page) {
                    $('body').find('#foreign_relation_list tbody').append(html);
                } else {
                    $('body').find('#foreign_relation_list tbody').html(html);
                }

                if ($('#main-div #load_more_div').children().length == 0) {
                    $('#main-div #load_more_div').html('<button  data-table="foreignRelations" class="btn loading-margins btn-load-more">' + Hsis.dictionary[Hsis.lang]["load.more"] + '</button>');
                }
            }
        },

        parseAbroadStudentAchievement: function (data) {
            if (data) {
                var html = '';
                $.each(data, function (i, v) {
                    html += '<div class="col-md-12 for-align archievement-item">' +
                        '<table class="table-block col-md-12">' +
                        '<thead>' +
                        '<tr><th>Tipi</th>' +
                        '<th>Qeyd</th>' +
                        '</tr></thead>' +
                        '<tbody>' +
                        '<tr data-id="' + v.id + '">' +
                        '<td>' + v.type.value[Hsis.lang] + '</td>' +
                        '<td>' + v.note + ' </td>' +
                        '</tr>' +
                        '</tbody>' +
                        '</table>' +
                        '<div class="operations-button">' +
                        '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span' +
                        ' class="glyphicon glyphicon-list"></span></div>' +
                        '<ul class="dropdown-menu">' +
                        '<li><a href="#" class="remove-archievement" data-id = "' + v.id + '">' + Hsis.dictionary[Hsis.lang]['erase'] + '</a></li>' +
                        '</ul>' +
                        '</div>' +
                        '</div>';
                });
                $('#main-div .archievement-panel .blank-panel').hide();
                $('#main-div .archievement-panel').prepend(html);
                $('#main-div #archievement_note').val('')
                $('#main-div #archievement_type').val(0);

            }
        },

        parseAbroadStudentRegistrationDate: function (data) {
            if (data) {
                var html = '';
                $.each(data, function (i, v) {
                    html += '<div class="col-md-12 for-align registration-date-item">' +
                        '<table class="table-block col-md-12">' +
                        '<thead>' +
                        '<tr><th>Tarix</th>' +
                        '<th>Qeyd</th>' +
                        '</tr></thead>' +
                        '<tbody>' +
                        '<tr data-id="' + v.id + '">' +
                        '<td>' + v.date + '</td>' +
                        '<td>' + v.note + ' </td>' +
                        '</tr>' +
                        '</tbody>' +
                        '</table>' +
                        '<div class="operations-button">' +
                        '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span' +
                        ' class="glyphicon glyphicon-list"></span></div>' +
                        '<ul class="dropdown-menu">' +
                        '<li><a href="#" class="remove-registration-date" data-id = "' + v.id + '">' + Hsis.dictionary[Hsis.lang]['erase'] + '</a></li>' +
                        '</ul>' +
                        '</div>' +
                        '</div>';
                });
                $('#main-div .registration-date-panel .blank-panel').hide();
                $('#main-div .registration-date-panel').prepend(html);
                $('#main-div #registration_date').val('');
                $('#main-div #registration_date_note').val('');

            }
        },

        parseViewAbroadStudentAchievement: function (data) {
            if (data) {
                var html = '';
                $.each(data, function (i, v) {
                    html += '<div class="col-md-12 for-align archievement-item">' +
                        '<table class="table-block col-md-12">' +
                        '<thead>' +
                        '<tr><th>Tipi</th>' +
                        '<th>Qeyd</th>' +
                        '</tr></thead>' +
                        '<tbody>' +
                        '<tr data-id="' + v.id + '">' +
                        '<td>' + v.type.value[Hsis.lang] + '</td>' +
                        '<td>' + v.note + ' </td>' +
                        '</tr>' +
                        '</tbody>' +
                        '</table>' +
                        '</div>';
                });
                $('#main-div .archievement-panel .blank-panel').hide();
                $('#main-div .archievement-panel').prepend(html);

            }
        },

        parseViewAbroadStudentRegistrationDate: function (data) {
            if (data) {
                var html = '';
                $.each(data, function (i, v) {
                    html += '<div class="col-md-12 for-align registration-date-item">' +
                        '<table class="table-block col-md-12">' +
                        '<thead>' +
                        '<tr><th>Tarix</th>' +
                        '<th>Qeyd</th>' +
                        '</tr></thead>' +
                        '<tbody>' +
                        '<tr data-id="' + v.id + '">' +
                        '<td>' + v.date + '</td>' +
                        '<td>' + v.note + ' </td>' +
                        '</tr>' +
                        '</tbody>' +
                        '</table>' +
                        '</div>';
                });
                $('#main-div .registration-date-panel .blank-panel').hide();
                $('#main-div .registration-date-panel').prepend(html);

            }
        },
        parseDictionaryByMultiParents: function (data, groupHtml) {
            var parents = [];
            var grouphObj = '';

            if (data) {
                $.each(data, function (i, v) {
                    if ($.inArray(v.parentId, parents) == -1) {
                        parents.push(v.parentId);
                        grouphObj = $('<optgroup label="' + v.parentName[Hsis.lang] + '"></optgroup>');
                        groupHtml.append(grouphObj);
                    }
                    var opt = $('<option value="' + v.id + '">' + v.value[Hsis.lang] + '</option>');
                    grouphObj.append(opt.get(0).outerHTML);

                });

            }

        },
        parseStudentsWithoutDiplom: function (data, page) {
            var html = '';
            var count = 0;
            if (page) {
                count = $('#students_with_order tbody tr').length;
            } else {
                count = 0;
            }
            if (data.studentList.length > 0) {
                $.each(data.studentList, function (i, v) {
                    html += '<tr>' +
                        '<td>' + (++i) + '</td>' +
                        '<td>' + v.specialty[Hsis.lang] + '</td>' +
                        '<td>' + v.lastName + ' ' + v.firstName + ' ' + v.middleName + '</td>' +
                        //'<td class="take-diplom"></td>' +
                        '<td><label><input type="checkbox"  name="pelcId" value="' + v.pelcId + '"></label></td>' +
                        '</tr>'
                })

                if (data.studentCount > 0) {
                    $('span[data-student-count]').html(data.studentCount);
                }

                if ($('#main-div #load_more_div [data-table="students-without-diplom"]').length == 0) {
                    $('#main-div #load_more_div').html('<button  data-table="students-without-diplom" class="btn loading-margins btn-load-more">' + Hsis.dictionary[Hsis.lang]["load.more"] + '</button>');
                }

            } else {
                $('span[data-student-count]').html(0);
            }
            if (page) {
                $('#main-div #graduate-student-list tbody').append(html);
            } else {
                $('#main-div #graduate-student-list tbody').html(html);
            }

        },
        parseStudentsWithDiplom: function (data, page) {
            var html = '';
            var count = 0;
            if (page) {
                count = $('#students_with_diplom tbody tr').length;
            } else {
                count = 0;
            }
            if (data.studentList && data.studentList.length > 0) {

                $.each(data.studentList, function (i, v) {
                    console.log(v);
                    html += '<tr data-pelc-id="' + v.student.pelcId + '" data-diplom-id="' + v.diplom.id + '" data-id ="' + v.id + '">' +
                        '<td>' + (++i) + '</td>' +
                        '<td>' + v.student.specialty[Hsis.lang] + '</td>' +
                        '<td>' + v.student.lastName + ' ' + v.student.firstName + ' ' + v.student.middleName + '</td>' +
                        '<td class="take-diplom">' + v.diplom.serial + ' - ' + v.diplom.startNumber + '</td>' +
                        '<td class="remove-student-diplom"><i class="fa fa-remove" style="font-size:24px;color:red"></i></td>' +
                        '</tr>'
                })

                if (data.studentCount > 0) {
                    $('span[data-student-count]').html(data.studentCount);
                }

                if ($('#main-div #load_more_div').children().length == 0) {
                    $('#main-div #load_more_div').html('<button  data-table="students-with-diplom" class="btn loading-margins btn-load-more">' + Hsis.dictionary[Hsis.lang]["load.more"] + '</button>');
                }


            } else {
                $('span[data-student-count]').html(0);
            }

            if (page) {
                $('#main-div #students_with_diplom tbody').append(html);
            } else {
                $('#main-div #students_with_diplom tbody').html(html);
            }

        }

    },
    Validation: {
        validateEmail: function (email) {
            var re = Hsis.REGEX.email;
            return re.test(email);
        },
        validateNumber: function (number) {
            var re = Hsis.REGEX.number;
            return re.test(number);
        },
        validatePhoneNumber: function (phone) {
            var re = Hsis.REGEX.phone;
            return re.test(phone);
        },
        validateDecimalNumber: function (number) {
            var re = Hsis.REGEX.decimalNumber;
            return re.test(number);
        },
        validateRequiredFields: function (requiredAttr) {
            var required = $('[' + requiredAttr + ']');

            var requiredIsEmpty = false;

            required.each(function (i, v) {
                if (v.value.length == 0 || (requiredAttr !== 'default-teaching-required' && requiredAttr !== 'default-required' && v.value == 0 && $(this).is('select'))) {
                    $(v).addClass('blank-required-field');

                    if (!requiredIsEmpty) {

                        $.notify(Hsis.dictionary[Hsis.lang]['required_fields'], {
                            type: 'warning'
                        });
                        requiredIsEmpty = true;
                    }

                    $(v).on('focusout', function (e) {
                        if (v.value.length && $(v).hasClass('blank-required-field')) {
                            $(v).removeClass('blank-required-field');
                            $(v).off('focusout');
                        }
                    });
                }
            });

            return !requiredIsEmpty;
        },
        checkFile: function (contentType, fileType) {
            var result = contentType.match(fileType);
            if (result) {
                return true;
            } else {

                return false;
            }
        }
    }

};

var fileTypes = {
    IMAGE_CONTENT_TYPE: '^(' + Hsis.REGEX.IMAGE_EXPRESSION + ')$',
    FILE_CONTENT_TYPE: '^(' + Hsis.REGEX.TEXT + '|' + Hsis.REGEX.PDF + '|' + Hsis.REGEX.XLS + '|' + Hsis.REGEX.XLSX + '|' + Hsis.REGEX.DOC + '|' + Hsis.REGEX.DOCX + '|' + Hsis.REGEX.IMAGE_EXPRESSION + ')$'
};


