angular.module('vdui.widget.gallery', ['vdui.service.configService'])
.directive('vduiGallery', ['ObsService', 'ConfigService', function(obsService, configService) {
  return {

    restrict: 'E',
    scope: {
      config: '=?',
      obsQuery: '='
    },
    templateUrl: '/' + module.getPartialsPath(OPENMRS_CONTEXT_PATH) + '/gallery.html',

    controller: function($scope, $rootScope) {

      // Loading i18n messages
      var msgCodes = [
      module.getProvider() + ".gallery.loadMore",
      module.getProvider() + ".gallery.noDocuments"
      ]
      emr.loadMessages(msgCodes.toString(), function(msgs) {
        $scope.msgs = msgs;
      });

      var fetch = function(query) {
        query.startIndex = $scope.startIndex;
        $scope.showSpinner = true;
        obsService.getObs(query)
        .then(function(obs) {
          $scope.showSpinner = false;
          $scope.obsArray.push.apply($scope.obsArray, obs);
          if (obs.length === $scope.config.maxRestResults) {
            $scope.startIndex += $scope.config.maxRestResults;
          }
          else {
            $scope.startIndex = 0;
          }
        }, function(reason) {
          $scope.showSpinner = false;
        });
      }

      $scope.load = function(config, index) {
        $scope.obsQuery.v = config.obsRep;
        fetch($scope.obsQuery);
      }

      configService.getConfig().then(function(config) {
        // merging the privileges in the config
        $scope.config = angular.extend({}, config, $scope.config);
        $scope.obsArray = [];
        $scope.startIndex = 0;
        $scope.load($scope.config, $scope.startIndex);
      });

      $rootScope.$on(module.eventNewFile, function(event, obs) {
        $scope.obsArray.unshift(obs);
        $scope.$apply();
      });

    }
  };
}]);