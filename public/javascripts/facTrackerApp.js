var app = angular.module('factApp', ['ngRoute', 'ngResource', 'ngMaterial', 'ngMessages', 'ui.router', 'angular-jwt', 'auth0', 'angular-storage']);

app.controller('factController', function($scope, $state, $http, factService, tagService, $rootScope, $timeout){
        $scope.facts = factService.query();
        $scope.newFact = {factName: '', factDescription: '', factURL: '', factTags: [], factSource: ''};
        $scope.newTag = {tagName: ''};
        $scope.tagName = '';
        $scope.factName = '';
        $scope.factDescription = '';
        $scope.factURL = '';
        $scope.factTags = ['two'];
        $scope.factSource = '';
        $scope.factID;
        $rootScope.singleFact;
        $rootScope.selected;
        $scope.checked = [];

        $scope.tags = [];
        $scope.tag = '';
        $scope.test = "FacTrackerController Working";

        $scope.selected = [];
        $scope.selectedArray = [];
        $scope.resultsArray = [];
        $rootScope.tagNames = [];

        $scope.findInArray = function(inst, list) {
            for(var l = 0; l < list.length-1; l++){
                for(var i = 0; i < list[l].factTags.length; i++){
                    if(!list[l].factTags[i] === inst){
                        //Nothing
                    }else if(list[l].factTags[i] === inst){
                        $scope.resultsArray.push(list[l]);
                    }else{
                    }
                }
            }
        };

        $scope.toggle = function (item, list) {
            var idx = list.indexOf(item);

            if (idx > -1) {
                list.splice(idx, 1);
            }
            else {
                list.push(item);
            }
        };

        $scope.exists = function (item, list) {
            return list.indexOf(item) > -1;
        };

        $scope.choices = [{id: 'choice1'}, {id: 'choice2'}];

        $scope.addNewFact = function(){
            var newFact = $scope.fact;
            $scope.facts.push(newFact);
            $scope.fact = '';
        };

        $scope.removeChoice = function() {
            var lastItem = $scope.choices.length-1;
            $scope.choices.splice(lastItem);
        };

        $scope.postToMongo = function() {
            _.each($rootScope.selected, function(data){
                var tagObject = {
                    tagName: data
                }
                $scope.newFact.factTags.push(tagObject);
            });

            $scope.newFact.factName = $scope.factName;
            $scope.newFact.factDescription = $scope.factDescription;
            $scope.newFact.factURL = $scope.factURL;
            $scope.newFact.factSource = $scope.factSource;
            factService.save($scope.newFact, function(){
                $scope.facts = factService.query();
                $scope.newFact = {factName: '', factDescription: '', factURL: '', factTags: [], factSource: ''};
            });
            $scope.factName = '';
            $scope.factDescription = '';
            $scope.factURL = '';
            $scope.factTags = [];
            $scope.factSource = '';
            $scope.getAllFacts();
            $state.go('first');
        };

        $scope.postTagToMongo = function() {
            tagService.save($scope.newTag, function(){
                $scope.tags = tagService.query();
                $scope.newTag = {tagName: ''};
            });
            $scope.tagName = '';
            $scope.getAllTags();
            $state.go('first');
        };

        $scope.getOneFact = function(id) {
            $rootScope.singleFact = factService.get({id: id}, function(fact) {
                var thisFact = {factName: '', factDescription: '', factURL: '', factTags: [], factSource: ''};
                thisFact.factName = fact.factName;
                thisFact.factDescription = fact.factDescription;
                thisFact.factURL = fact.factURL;
                thisFact.factTags = fact.factTags;
                thisFact.factSource = fact.factSource;
                return thisFact;
            });
            $rootScope.singleFact.$promise.then(function(data){
                $rootScope.selected = [];
                angular.forEach(data.factTags, function(tag){
                    $rootScope.selected.push(tag.tagName);
                });
                console.log("$rootScope.selected from Dashboard...")
                console.log($rootScope.selected);
                console.log("$rootScope.singleFact.factTags from Dashboard...")
                console.log($rootScope.singleFact.factTags);

                $state.go('details');
            });
        };

        $scope.getAllFacts = function() {
            $scope.factsArrayReturned = factService.query();
        };

        $scope.getAllTags = function() {
            tagService.query().$promise.then(function(data){
                $rootScope.tagNames = data;
            });
        };

        // TODO here could be why the $scope is being cleared when the state changes/loads
        $scope.getAllFacts();
        $scope.getAllTags();

        $scope.clearSelectedTagArray = function(){
            $rootScope.selected = [];
        }


        $scope.updateFact = function() {
            $scope.entry = factService.get({ id: $rootScope.singleFact._id }, function() {
                $scope.entry.factTags = [];
                _.each($rootScope.selected, function(data){
                    var tagObject = {
                        tagName: data
                    }
                    $scope.entry.factTags.push(tagObject);
                });
                $scope.entry.factName = $rootScope.singleFact.factName;
                $scope.entry.factDescription = $rootScope.singleFact.factDescription;
                $scope.entry.factURL = $rootScope.singleFact.factURL;
                $scope.entry.factSource = $rootScope.singleFact.factSource;
                // TODO add a way to update picture URL.
                $scope.entry.$update(function() {
                    $state.go('first');
                });

            });

        };

        $scope.deleteFact = function(id) {
            factService.delete({id: id});
            $scope.getAllFacts();
            $state.go('first');
        };

        $scope.highlightFilteredHeader = function( row, rowRenderIndex, col, colRenderIndex ) {
            if( col.filters[0].term ){
                return 'header-filtered';
            } else {
                return '';
            }
        };

        $scope.testFunction = function(){
            console.log($rootScope.tagNames);

        };

        $scope.checkTags = function(rec){

            var passed = true;
            var recordArray = [];
            var selectedArray = [];

            // Load tags array from RECORD
            _.each(rec.factTags, function(recFactTag){
                recordArray.push(recFactTag.tagName);
            });

            // Load tags array from SELECTED
            _.each($scope.selected, function(selectedFactTag){
                selectedArray.push(selectedFactTag.tagName);
            })

            // Compare the two arrays
            if(_.difference(selectedArray, recordArray).length !== 0){
                passed = false;
            }

            return passed;

        };

    });

app.factory('factService', function($resource){
    return $resource("/api/facts/:id", {
            id: "@_id",
            factName: "@factName",
            factDescription: "@factDescription",
            factURL: "@factURL",
            factTags: "@factTags",
            factSource: "@factSource"
        },
        {
            update: {
                method: 'PUT'
            }
        });
});

app.factory('tagService', function($resource){
    return $resource("/api/tags/:id", {
            id: "@_id",
            tagName: "@tagName"
        },
        {
            update: {
                method: 'PUT'
            }
        });
});

app.config(function($provide, $urlRouterProvider, $stateProvider, $httpProvider, jwtOptionsProvider, jwtInterceptorProvider, authProvider) {
    'use strict';

    authProvider.init({
        // TODO Configure Me or I Won't Work!!
        domain: 'derrickfox-auth.auth0.com',
        clientID: 'AtIFffBkNSn1ohWviV9CneIuoxTURDpb'
    });

    jwtInterceptorProvider.tokenGetter = function (store) {
        // console.info(store.get('id_token'));
        return store.get('id_token');
    };

    $urlRouterProvider.otherwise('/first');

    $stateProvider
        // HOME STATES AND NESTED VIEWS ========================================
        .state('first', {
            url: '/first',
            templateUrl: 'main.html',
            controller: 'factController'
        })

        .state('details', {
            url: '/details',
            templateUrl: 'factDetails.html',
            controller: 'factController'
        })

        .state('details/:id', {
            url: '/details/:id',
            templateUrl: 'factDetails.html',
            controller: 'factController'
        })

        .state('profile', {
            url: '/profile',
            templateUrl: 'profile.html',
            controller: 'profileController as user'
        })

        .state('test/', {
            url: '/test/',
            templateUrl: 'test.html',
            controller: 'factController'
        })

        .state('newTag', {
            url: '/newTag/',
            templateUrl: 'newTag.html',
            controller: 'factController'
        })

        .state('newFact', {
            url: '/newFact/',
            templateUrl: 'newFact.html',
            controller: 'factController'
        });

    // This function redirects the user if their token gets rejected to the homepage
    function redirect($q, $injector, $timeout, store, $location) {
        var auth;
        $timeout(function () {
            auth = $injector.get('auth');
        });

        return {
            responseError: function (rejection) {
                if (rejection.status === 401) {
                    auth.signout();
                    store.remove('profile');
                    store.remove('id_token');
                    $location.path('/first');
                }

                return $q.reject(rejection);
            }
        }
    }

    jwtOptionsProvider.config({ whiteListedDomains: ['http://localhost'] });
    $provide.factory('redirect', redirect);
    $httpProvider.interceptors.push('redirect');
    $httpProvider.interceptors.push('jwtInterceptor');

});

app.directive('card', function(){
    return {
        templateUrl: 'factCell.html'
    };
});

// Toolbar Assembly

app.directive('toolbar', function (auth, store, $location) {
    return {
        templateUrl: 'toolbar.html',
        controller: toolbarController,
        controllerAs: 'toolbar'
    };

    function toolbarController($location, auth, store) {

        var viewModel = this;
        viewModel.test = testFunc;
        viewModel.login = login;
        viewModel.logout = logout;
        viewModel.auth = auth;

        function testFunc() {
            console.log("Test function working");
            alert("Working");
        }

        function login() {
            auth.signin({}, function (profile, token) {
                store.set('profile', profile);
                store.set('id_token', token);
                $location.path('/home');
            }, function (error) {
                console.log(error);
            });
        }

        function logout() {
            store.remove('profile');
            store.remove('id_token');
            auth.signout();
            $location.path('/home');
        }

    }

});

app.constant('_', window._)
    // use in views, ng-repeat="x in _.range(3)"
    .run(function ($rootScope) {
        $rootScope._ = window._;
});

app.controller('profileController', profileController);

function profileController($scope, $http, store) {
    var viewModel = this;
    viewModel.test = 'Test working';

    viewModel.getMessage = getMessage;
    viewModel.getSecretMessage = getSecretMessage;
    viewModel.getTestMessage = getTestMessage;
    viewModel.message;

    viewModel.profile = store.get('profile');
    console.log(viewModel.profile);

    function getTestMessage() {
        viewModel.test = "getTestMessage clicked";
    }

    function getMessage() {
        console.log("getMessage() clicked");
        $http.get('http://localhost:3000/api/public', {
            skipAuthorization: true
        }).then(function (response) {
            viewModel.message = response.data.message;
        });
    }

    function getSecretMessage() {
        $http.get('http://localhost:3000/api/private', {
            headers: {
                "Authorization": "Bearer " + store.get('id_token')
            }
        }).then(function (response) {
            viewModel.message = response.data.message;
        });
    }


}


