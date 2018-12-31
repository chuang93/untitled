/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./public/javascripts/Login.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./public/javascripts/Login.js":
/*!*************************************!*\
  !*** ./public/javascripts/Login.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function onSignIn(googleUser) {\n  // Useful data for your client-side scripts:\n  var profile = googleUser.getBasicProfile();\n  console.log(\"ID: \" + profile.getId()); // Don't send this directly to your server!\n\n  console.log('Full Name: ' + profile.getName());\n  console.log('Given Name: ' + profile.getGivenName());\n  console.log('Family Name: ' + profile.getFamilyName());\n  console.log(\"Image URL: \" + profile.getImageUrl());\n  console.log(\"Email: \" + profile.getEmail()); // The ID token you need to pass to your backend:\n\n  var id_token = googleUser.getAuthResponse().id_token;\n  console.log(\"ID Token: \" + id_token);\n  var xhr = new XMLHttpRequest();\n  verifyURL = window.appServicesURL + \"verify\";\n  console.log(verifyURL);\n  xhr.open('POST', verifyURL);\n  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');\n\n  xhr.onload = function () {\n    console.log(xhr.responseText);\n    document.getElementById(\"userId\").textContent = \"Welcome \" + profile.getName();\n  };\n\n  xhr.onerror = function () {\n    console.log('Request to server to verify user failed with error: ' + xhr.errorMessage);\n  };\n\n  xhr.send('idtoken=' + id_token);\n}\n\nfunction signOut() {\n  console.log(\"attempting to signout\");\n  var auth2 = gapi.auth2.getAuthInstance();\n  auth2.signOut().then(function () {\n    console.log('User signed out.');\n    document.getElementById(\"userId\").textContent = \"\";\n  });\n}\n\n//# sourceURL=webpack:///./public/javascripts/Login.js?");

/***/ })

/******/ });