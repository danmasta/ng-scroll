var app = angular.module('app', ['ngScroll']);

app.directive('scrollTest', ['scroll', function(scroll){
  return{
    restrict:'A',
    controller: function($scope){
      scroll.bind();
      $scope.$on('scroll', function(data, $event){
        $scope.scroll = $event;
      });
    },
    template:'<li data-test-item ng-repeat="item in testitems">{{item.title}}</li>',
    link:function($scope, $element, $attribute){
      $scope.testitems = [];
      for( var i = 0; i < 500; i++){
        $scope.testitems.push({title:'test item ' + i, value:i});
      }
    }
  };
}]);
