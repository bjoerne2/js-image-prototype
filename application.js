function fileChangeDirective() {
	return {
		restrict : 'A',
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

function canvasFactoryDirective() {
	return {
		restrict : 'E',
		controller : function($parse, $element, $attrs, $scope) {
			var factoryMethodExpr = $parse($attrs.factoryMethod);
			factoryMethodExpr.assign($scope, function() {
				$parent = $element.parent();
				$parent.append('<canvas style="display: none;"></canvas>');
				return $parent.find('canvas');
			});
		}
	};
}


angular.module('jsip', ['ui.bootstrap']).directive('customFileChange', fileChangeDirective).directive('customCanvasFactory', canvasFactoryDirective);

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
			$scope.urls = {};
			$scope.urls.plain = event.target.result;
			$scope.$apply();
		};
		reader.readAsDataURL(f);
	};

	$scope.scale = function() {
		if ($scope.urls.scaled) {
			return;
		}
		var $canvas = $scope.createCanvas();
		var img = new Image();
		img.onload = function(event) {
			var image = event.target;
			var newWidth = image.width / 2;
			var newHeight = image.height / 2;
			var ctx = $canvas[0].getContext('2d');
			$canvas.attr('width', newWidth).attr('height', newHeight);
			ctx.drawImage(image, 0, 0, newWidth, newHeight);
			$scope.urls.scaled = $canvas[0].toDataURL("image/jpeg");
			$canvas.remove();
			$scope.$apply();
		};
		img.src = $scope.urls.plain;
	};

	$scope.blackAndWhite = function() {
		if ($scope.urls.blackAndWhite) {
			return;
		}
		var $canvas = $scope.createCanvas();
		var img = new Image();
		img.onload = function(event) {
			var image = event.target;
			var ctx = $canvas[0].getContext('2d');
			$canvas.attr('width', image.width).attr('height', image.height);
			ctx.drawImage(image, 0, 0);
			var imageData = ctx.getImageData(0, 0, image.width, image.height);
			var pixelData = imageData.data;
			for (var i = 0; i < pixelData.length; i += 4) {
				var r = pixelData[i];
				var g = pixelData[i + 1];
				var b = pixelData[i + 2];
				var greyscale = r * .3 + g * .59 + b * .11;
				pixelData[i] = greyscale;
				pixelData[i + 1] = greyscale;
				pixelData[i + 2] = greyscale;
			}
			ctx.putImageData(imageData, 0, 0);
			$scope.urls.blackAndWhite = $canvas[0].toDataURL("image/jpeg");
			$canvas.remove();
			$scope.$apply();
		};
		img.src = $scope.urls.plain;
	};

	$scope.withLove = function() {
		if ($scope.urls.withLove) {
			return;
		}
		var $canvas = $scope.createCanvas();
		var img = new Image();
		img.onload = function(event) {
			var image = event.target;
			var ctx = $canvas[0].getContext('2d');
			$canvas.attr('width', image.width).attr('height', image.height);
			ctx.drawImage(image, 0, 0);
			var scaleFactor = Math.min(image.width, image.height);
			var offsetLeft = (image.width - scaleFactor) / 2;
			var offsetTop = (image.height - scaleFactor) / 2;
			var fontSize = scaleFactor * 0.1;
			ctx.font = fontSize + "pt Arial";
			var text = "from bjoerne with love";
			var textMetrics = ctx.measureText(text);
			var textTop = fontSize + 0.05 * image.height + offsetTop;
			var textLeft = (image.width - textMetrics.width) / 2;
			ctx.fillText(text, textLeft, textTop);
			canvas = $canvas[0];

			ctx.strokeStyle = "#000000";
			ctx.strokeWeight = 3;
			ctx.shadowOffsetX = 4.0;
			ctx.shadowOffsetY = 4.0;
			ctx.lineWidth = 5.0;
			ctx.fillStyle = "#FF0000";
			var d = scaleFactor * 0.7;
			var heartLeft = offsetLeft + (scaleFactor * 0.3) / 2;
			var heartTop = textTop + fontSize;

			ctx.moveTo(heartLeft, heartTop + d / 4);
			ctx.quadraticCurveTo(heartLeft, heartTop, heartLeft + d / 4, heartTop);
			ctx.quadraticCurveTo(heartLeft + d / 2, heartTop, heartLeft + d / 2, heartTop + d / 4);
			ctx.quadraticCurveTo(heartLeft + d / 2, heartTop, heartLeft + d * 3 / 4, heartTop);
			ctx.quadraticCurveTo(heartLeft + d, heartTop, heartLeft + d, heartTop + d / 4);
			ctx.quadraticCurveTo(heartLeft + d, heartTop + d / 2, heartLeft + d * 3 / 4, heartTop + d * 3 / 4);
			ctx.lineTo(heartLeft + d / 2, heartTop + d);
			ctx.lineTo(heartLeft + d / 4, heartTop + d * 3 / 4);
			ctx.quadraticCurveTo(heartLeft, heartTop + d / 2, heartLeft, heartTop + d / 4);
			ctx.stroke();
			ctx.fill();
			$scope.urls.withLove = $canvas[0].toDataURL("image/jpeg");
			$canvas.remove();
			$scope.$apply();
		};
		img.src = $scope.urls.plain;
	};

	$scope.unselectFile = function() {
		$scope.fileSelected = false;
		$scope.urls = {};
	};
};
