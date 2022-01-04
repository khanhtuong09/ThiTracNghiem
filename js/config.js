function config($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
    $stateProvider
       .state('home', {
            url: "/home",
            templateUrl: "views/home.html"
        })
        .state('add', {
            url: "/add",
            templateUrl: "views/add.html"
        })
        .state('user', {
            url: "/user",
            templateUrl: "views/user.html"
        })
        .state('qltk', {
            url: "/qltk",
            templateUrl: "views/qltk.html"
        })
        .state('quiz', {
            url: "/quiz",
            templateUrl: "views/quiz.html"
        })
        .state('about', {
            url: "/about",
            templateUrl: "views/about.html"
        })
        .state('contac', {
            url: "/contac",
            templateUrl: "views/contac.html"
        })
}

angular
    .module('app')
    .config(config)