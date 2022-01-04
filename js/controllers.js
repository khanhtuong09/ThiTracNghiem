function addUserCtrl($scope, $state) {
    var path = "Users";
    $scope.add = function () {
        // dữ liệu trong form $scope.formData
        AddNewUser(path, $scope.formData, $state);

    }
};

function UpdateUser(uid, postData) {


    try {
        var UserInfo = {
            key: postData.key,
            username: postData.username,
            password: postData.password,
            email: postData.email,
            fullname: postData.fullname,
            admin: 0
        };
        var UserKey = postData.key;
        var updates = {};
        updates['/' + uid + '/' + UserKey] = UserInfo;

        firebase.database().ref().update(updates);
        var myaccountJson = sessionStorage.getItem("User");

        if (myaccountJson == null) {

        } else {
            var myaccount = JSON.parse(myaccountJson);
            if (postData.key == myaccount.key) {
                sessionStorage.setItem("User", JSON.stringify(UserInfo));
            }
        }

        alert("Cập Nhật Thành Công!");
        document.getElementById("capnhat").click();
    } catch (error) {
        alert("Đã xảy ra lỗi!");
    }

}

function AddNewUser(uid, postData, $state) {
    try {
        var NewIdUser = firebase.database().ref().child(uid).push().key;
        var UserInfo = {
            key: NewIdUser,
            username: postData.username,
            password: postData.password,
            email: postData.email,
            fullname: postData.fullname,
            admin: 0
        };
        var updates = {};
        updates['/' + uid + '/' + NewIdUser] = UserInfo;
        firebase.database().ref().update(updates);
        alert("Đăng ký thành công!");
        postData.username = "";
        postData.password = "";
        postData.email = "";
        postData.fullname = "";
        document.getElementById("btndk").click();

    } catch (error) {
        alert("Ôi! Đã xảy ra lỗi!");
    }
    s
}
function homeCtrl($scope, $firebaseObject, $state) {
    const ref = firebase.database().ref('Users');
    const reflogos = firebase.database().ref('Logos');

    $scope.logos = $firebaseObject(reflogos);
    $scope.contacts = $firebaseObject(ref);
    $scope.login = function () {
        ref.on("child_added", function (snapshot) {
            var User = snapshot.val();

            if (!($scope.formData.username == User.username) && !($scope.formData.password == User.password)) {
                document.getElementById("tb").innerHTML = "Vui lòng thử lại!";
            } else if (($scope.formData.username == User.username) && ($scope.formData.password == User.password)) {
                alert("Đăng Nhập Thành Công!");
                document.getElementById("tb").innerHTML = "";
                sessionStorage.setItem("User", JSON.stringify(User));
                $scope.formData.username = "";
                $scope.formData.password = "";
                window.location.reload();
                return;
            }

        });

    }

    $scope.remove = function (User) {
        var conf = confirm("BẠN CÓ MUỐN XÓA?");
        if (conf == true) {
            var IdUser = User.key;
            console.log(IdUser);
            ref.child(IdUser).remove();
        }

    }
    $scope.edit = function (User) {
        var IdUser = User.key;
        firebase.database().ref('/Users/' + IdUser).once('value').then(function (snapshot) {
            console.log((snapshot.val()));
            $scope.edituser = snapshot.val();
            $state.go("qltk");
        });

    }
    $scope.update = function () {
        var path = "Users";
        UpdateUser(path, $scope.edituser);
    }
    var daq = "";
    $scope.dataq = null;
    $scope.quiz = function (data) {
        daq = data.Id;
        sessionStorage.setItem("keyquiz", daq);
        $state.go("quiz");
    }
    $scope.changemk = function () {
        var passwordold = $scope.formData.passwordold;
        var passwordnew = $scope.formData.passwordnew;
        var passwordcheck = $scope.formData.passwordcheck;
        var myaccountJson = sessionStorage.getItem("User");
        var myaccount = JSON.parse(myaccountJson);
        console.log("mkcu: " + passwordold);
        console.log("mkmoi: " + passwordnew);
        console.log("mkxnmkm: " + passwordcheck);
        if (passwordold != (myaccount.password)) {
            alert("Mật khẩu cũ không chính xác!")
        } else if (passwordnew != passwordcheck) {
            alert("Xác nhận mật khẩu không chính xác!")
        } else {
            try {
                var UserInfo = {
                    key: myaccount.key,
                    username: myaccount.username,
                    password: passwordnew,
                    email: myaccount.email,
                    fullname: myaccount.fullname,
                    admin: 0
                };
                var updates = {};
                updates['/Users/' + myaccount.key] = UserInfo;
                firebase.database().ref().update(updates);
                sessionStorage.setItem("User", JSON.stringify(UserInfo));
                $scope.formData.passwordold = "";
                $scope.formData.passwordnew = "";
                $scope.formData.passwordcheck = "";
                alert("Đổi mật khẩu thành công!");
                document.getElementById("doimkne").click();
            } catch (error) {
                alert("Đổi mật khẩu không thành công! :((((");
            }
        }
    }
    $scope.quenmkroi = function () {
        $scope.formData.hidden = "";
        ref.on("child_added", function (snapshot) {
            check(snapshot.val(), $scope.formData);
        });


    }

    $scope.dataquiz = $firebaseObject(ref);
}
function check(User, data) {
    if (!(data.email == User.email) && !(data.username == User.username)) {

    } else {
        if ((data.email == User.email) && (data.username == User.username)) {
            data.hidden = User.password;
            return;
        }

    }
}
function loadQ($scope, $firebaseObject, $state) {
    var idq = sessionStorage.getItem("keyquiz");
    try {

        sessionStorage.clear("keyquiz");
        var Ob = [];
        const ref = firebase.database().ref('/Quiz/' + idq);
        $scope.dataq =
            Ob = ($firebaseObject(ref));
        Ob.length = 20;
        $scope.dataq = Ob;

        $state.go("quiz");


    } catch (error) {
        alert("Ôi! Bạn không thể làm bài khác ngay lúc này!")
    }


}





angular
    .module('app')
    .controller('homeCtrl', homeCtrl)
    .controller('addUserCtrl', addUserCtrl)
    .controller('loadQ', loadQ)


