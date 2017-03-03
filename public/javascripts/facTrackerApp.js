var app = angular.module('factApp', ['ngRoute', 'ngResource', 'ngMaterial', 'ngMessages', 'ui.router'])
    .controller('factController', function($scope, $state, $http, factService, tagService, $rootScope, $timeout){
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
        $rootScope.testName = 'failed';
        $scope.testString = "Test String Success!";
        $rootScope.selected;
        $scope.checked = [];

        $scope.tags = [];
        $scope.tag = '';

        $scope.selected = [];
        $scope.testArray = ["Carrots", "Grapes"];

        // For testing: Begin Block
        $scope.singleInst = "C";
        $scope.singleInst2 = "F";
        $scope.singleInst3 = "R";

        $scope.recArray = ['A', 'C', 'F'];
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
            //console.clear();
            //$scope.findInArray(item, $scope.factsArrayReturned);

            var idx = list.indexOf(item);

            if (idx > -1) {
                list.splice(idx, 1);
            }
            else {
                list.push(item);
            }

            //console.log($scope.selected);

            //for(var i = 0; list.length - 1; i++){
            //    if(item.tagName === list[i].tagName){
            //        list.push(item);
            //    }
            //}


        };

        $scope.exists = function (item, list) {

            //var idx = list.indexOf(item);
            //
            //if (idx > -1) {
            //    copyTo.splice(idx, 1);
            //}
            //else {
            //    copyTo.push(item);
            //}

            return list.indexOf(item) > -1;
        };

        $scope.printThis = function (){
            console.log("working");
        }

        $scope.loadArray = function(item, list){
            console.clear();

            //console.log("First item is...")
            //console.log(item);
            //console.log("List is...")
            //console.log(list);

            console.log($rootScope.tagNames);
        }

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
            // THIS IS AN ERROR. IT IS SAVING JUST THE TAG NAME INSTEAD OF THE ENTIRE TAG OBJECT
            //$scope.newFact.factTags = $rootScope.selected;
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
            //$scope.newTag.tagName = $scope.tagName;
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
                //$rootScope.selected = data.factTags;
                $rootScope.selected = [];
                angular.forEach(data.factTags, function(tag){
                    $rootScope.selected.push(tag.tagName);
                });
                //console.clear();
                //console.log("Single Fact's Promise Completed")

                console.log("$rootScope.selected from Dashboard...")
                console.log($rootScope.selected);
                console.log("$rootScope.singleFact.factTags from Dashboard...")
                console.log($rootScope.singleFact.factTags);

                $state.go('details');
            });
            //$timeout(console.log('Timeout'), 1000);

        };


        $scope.getAllFacts = function() {
            $scope.factsArrayReturned = factService.query();
            //console.log($scope.factsArrayReturned);

        };

        $scope.getAllTags = function() {
            //$scope.tagsArrayReturned = tagService.query();
            tagService.query().$promise.then(function(data){
                $rootScope.tagNames = data;
            });
            //console.log($scope.tagsArrayReturned);
        };

        // TODO here could be why the $scope is being cleared when the state changes/loads
        $scope.getAllFacts();
        $scope.getAllTags();

        $scope.clearSelectedTagArray = function(){
            $rootScope.selected = [];
        }


        $scope.updateFact = function() {
            //alert($rootScope.singleReceipe._id);
            $scope.entry = factService.get({ id: $rootScope.singleFact._id }, function() {
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
                //$scope.entry.factTags = $rootScope.singleFact.factTags;
                //$scope.entry.factTags = $rootScope.selected;
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

            console.log(selectedArray);
            console.log(recordArray);
            console.log(_.difference(recordArray, selectedArray).length);
            // Return the result
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

        function foundEveryElement(checked, fact){
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
            console.log(fact);
            return foundAll;
        }


        for(var p = 0; p < input.length; p++){
            for(var i = 0; i < input[p].factTags.length; i++){
                if(foundEveryElement(checkBoxes, input[p].factTags[i]) === true){
                    output.push(input[p].factTags[i]);
                }
            }
        }

        return output;
    };
});

app.filter('consoleTest', function(){
    // This block run for each item in the list.
    return function(input, testString){
        // This prints each item in the list to the console. It can also input a $scope variable, in this case named 'testString'.
        console.log(input);
        console.log(testString);
        // This makes the item appear in the list to the user.
        return input;
    };
});

app.filter('consoleTest2', function(){
    // This block run for each item in the list.
    return function(thisFact, selectedTags){

        //_.each(selectedTags, function(selectedTag){
        //    if(_.includes(thisFact.factTags, selectedTag) === false){
        //        // don't do anything
        //    }else{
        //        return thisFact;
        //    }
        //});


    };
});

app.constant('_', window._)
    // use in views, ng-repeat="x in _.range(3)"
    .run(function ($rootScope) {
        $rootScope._ = window._;
    });
