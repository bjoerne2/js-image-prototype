function fileChangeDirective() {
	return {
		controller : function($parse, $element, $attrs, $scope) {
			var modelExpr = $parse($attrs.customFiles);
			var changeExpr = $parse($attrs.customFileChange);
			$element.bind('change', function() {
				modelExpr.assign($scope, this.files);
				changeExpr($scope);
				$scope.$apply();
			});
		}
	};
}


angular.module('jsip', ['ui.bootstrap']).directive('customFileChange', fileChangeDirective)

var AppCtrl = function($scope) {
	$scope.selectFile = function() {
		var f = $scope.files[0];
		var reader = new FileReader();
		reader.onload = function() {
			$scope.fileSelected = true; // too late, apply is executed before
		};
		reader.readAsDataURL(f);
	};

	$scope.unselectFile = function() {
		$scope.fileSelected = false;
	};

	$scope.blackAndWhite = function() {

	};
};
