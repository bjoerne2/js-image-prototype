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
	
	$scope.urls = {};
	
	$scope.selectFile = function() {
		var f = $scope.files[0];
		if (!f.type.match('image.*')) {
			console.log('No image file');
			return;
		}
		var reader = new FileReader();
		reader.onload = function(event) {
			$scope.fileSelected = true;
			$scope.urls.plain = event.target.result;
			$scope.$apply();
		};
		reader.readAsDataURL(f);
	};

	$scope.unselectFile = function() {
		$scope.fileSelected = false;
		$scope.urls = {};
	};
};
