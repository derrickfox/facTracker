var app = angular.module('factApp', ['ngRoute', 'ngResource', 'ngMaterial', 'ngMessages', 'ui.router'])
    .controller('factController', function($scope, $state, $http, factService, tagService, $rootScope){
        $scope.facts = factService.query();
        $scope.newFact = {factName: '', factDescription: '', factURL: '', factTags: [], factSource: ''};
        $scope.newTag = {tagName: ''};
        $scope.tagName = '';
        $scope.factName = '';
        $scope.factDescription = '';
        $scope.factURL = '';
        $scope.factTags = [];
        $scope.factSource = '';
        $scope.factID;
        $rootScope.singleFact;

        $scope.tags = ["Apple","Onions","Carrots","Mushrooms","Grapes"];
        $scope.tag = '';

        $scope.selected = ["Carrots"];
        $scope.testArray = ["Carrots", "Grapes"];

        // For testing: Begin Block
        $scope.singleInst = "C";
        $scope.singleInst2 = "F";
        $scope.singleInst3 = "R";

        $scope.recArray = ['A', 'C', 'F'];
        $scope.selectedArray = [];
        $scope.resultsArray = [];

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

        //$scope.findInArray($scope.singleInst);
        //$scope.findInArray($scope.singleInst2);
        //$scope.findInArray($scope.singleInst3);

        // Testing: End Block
        $scope.printThis = function(){
            alert($scope.factTags);
        };

        $scope.toggle = function (item, list) {

            $scope.findInArray(item, $scope.factsArrayReturned);

            var idx = list.indexOf(item);
            var myIdx = $scope.factTags.indexOf(item);

            if (myIdx > -1) {
                $scope.factTags.splice(myIdx, 1);
            }
            else {
                $scope.factTags.push(item);
            }

            if (idx > -1) {
                list.splice(idx, 1);
            }
            else {
                list.push(item);
                //myList.push(item);
            }
            //console.clear();
            console.log(list);
        };

        $scope.choices = [{id: 'choice1'}, {id: 'choice2'}];

        //$scope.addNewChoice = function() {
        //    var newItemNo = $scope.choices.length+1;
        //    $scope.choices.push({'id':'choice'+newItemNo});
        //};

        $scope.addNewFact = function(){
            var newFact = $scope.fact;
            $scope.facts.push(newFact);
            $scope.fact = '';
        };

        $scope.removeChoice = function() {
            var lastItem = $scope.choices.length-1;
            $scope.choices.splice(lastItem);
        };

        $scope.exists = function (item, list) {
            return list.indexOf(item) > -1;
        };

        $scope.postToMongo = function() {
            $scope.newFact.factName = $scope.factName;
            $scope.newFact.factDescription = $scope.factDescription;
            $scope.newFact.factURL = $scope.factURL;
            $scope.newFact.factTags = $scope.factTags;
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
            $scope.newTag.tagName = $scope.tagName;
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
            $state.go('details');
        };

        $scope.getAllFacts = function() {
            $scope.factsArrayReturned = factService.query();
            console.log($scope.factsArrayReturned);

        };

        $scope.getAllTags = function() {
            $scope.tagsArrayReturned = tagService.query();
            console.log($scope.tagsArrayReturned);

        };

        // TODO here could be why the $scope is being cleared when the state changes/loads
        $scope.getAllFacts();
        $scope.getAllTags();


        $scope.updateFact = function() {
            //alert($rootScope.singleReceipe._id);
            $scope.entry = factService.get({ id: $rootScope.singleFact._id }, function() {
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

    });


/**
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that can be in foundin the LICENSE file at http://material.angularjs.org/license.
 **/

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

app.config(function($stateProvider, $urlRouterProvider) {

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

        .state('test/', {
            url: '/test/',
            templateUrl: 'test.html',
            controller: 'factController'
        })

        .state('new', {
            url: '/new',
            templateUrl: 'newFact.html',
            controller: 'factController'
        });

});


app.directive('card', function(){
    return {
        templateUrl: 'factCell.html'
    };
});

app.filter('testFilter', function(){
    console.log("Entered Filter Function");
    return function(input){

        var out = [];

        // Using the angular.forEach method, go through the array of data and perform the operation of figuring out if the language is statically or dynamically typed.
        angular.forEach(input, function(item) {

            item = item + '-ish';
            out.push(item);

        });

        return out;
    };
})

app.filter('testFilter2', function(){
    return function(input, checkBoxes){
        var output = [];

        function foundEveryElement(checked, receipe){
            var array = [];

            var foundAll = false;

            for(var i = 0; i < checked.length; i++){
                var found = false;
                for(var p = 0; p < fact.tags.length; p++){
                    if(checked[i] === fact.tags[p]){
                        found = true;
                        break;
                    }else{
                        //nothing
                    }
                }
                array.push(found);
            };

            foundAll = _.every(array);

            if(checked.length > fact.tags.length){
                foundAll = false;
            }
            return foundAll;
        }

        //console.log(input);
        //for(var i = 0; i < input.factTags.length; i++){
        //    if(foundEveryElement(checkBoxes, input.factTags[i]) === true){
        //        output.push(input.factTags[i]);
        //    }
        //}

        return output;
    };
});

