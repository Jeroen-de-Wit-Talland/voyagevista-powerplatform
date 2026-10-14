var voy;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./webresources_src/voy_quote_CommandBar.ts"
/*!**************************************************!*\
  !*** ./webresources_src/voy_quote_CommandBar.ts ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   voy_quote_CommandBar: () => (/* binding */ voy_quote_CommandBar)
/* harmony export */ });
class voy_quote_CommandBar {
    static async ExecuteCalculate(primaryControl) {
        const formContext = primaryControl;
        try {
            if (formContext.data.entity.getIsDirty()) {
                await formContext.data.save();
            }
            Xrm.Utility.showProgressIndicator("Calculating quote...");
            const quoteId = formContext.data.entity.getId().replace(/[{}]/g, "");
            console.log(quoteId);
            const request = {
                entity: { entityType: "voy_quote", id: quoteId },
                getMetadata: () => ({
                    boundParameter: "entity",
                    parameterTypes: {
                        entity: { typeName: "mscrm.voy_quote", structuralProperty: 5 },
                    },
                    operationType: 0,
                    operationName: "voy_CalculateQuote",
                }),
            };
            const result = await Xrm.WebApi.online.execute(request);
            if (!result.ok) {
                throw new Error(`Quote calculation failed (${result.status}).`);
            }
            await formContext.data.refresh(false);
            Xrm.Utility.closeProgressIndicator();
        }
        catch (error) {
            Xrm.Navigation.openErrorDialog({
                message: error?.message ?? "An error occurred while calculating the quote.",
            });
        }
        finally {
            Xrm.Utility.closeProgressIndicator();
        }
    }
}


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			const e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	// define getter/value functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop));
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ 	
/************************************************************************/
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*************************************!*\
  !*** ./webresources_src/library.ts ***!
  \*************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   voy_quote_CommandBar: () => (/* reexport safe */ _voy_quote_CommandBar__WEBPACK_IMPORTED_MODULE_0__.voy_quote_CommandBar)
/* harmony export */ });
/* harmony import */ var _voy_quote_CommandBar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./voy_quote_CommandBar */ "./webresources_src/voy_quote_CommandBar.ts");


})();

voy = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidm95X2xpYnJhcnkuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQU8sTUFBTSxvQkFBb0I7SUFDL0IsTUFBTSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFtQjtRQUMvQyxNQUFNLFdBQVcsR0FBRyxjQUFjLENBQUM7UUFFbkMsSUFBSSxDQUFDO1lBQ0gsSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDO2dCQUN6QyxNQUFNLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDaEMsQ0FBQztZQUVELEdBQUcsQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUUxRCxNQUFNLE9BQU8sR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3JFLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDckIsTUFBTSxPQUFPLEdBQUc7Z0JBQ2QsTUFBTSxFQUFFLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFO2dCQUNoRCxXQUFXLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztvQkFDbEIsY0FBYyxFQUFFLFFBQVE7b0JBQ3hCLGNBQWMsRUFBRTt3QkFDZCxNQUFNLEVBQUUsRUFBRSxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsa0JBQWtCLEVBQUUsQ0FBQyxFQUFFO3FCQUMvRDtvQkFDRCxhQUFhLEVBQUUsQ0FBQztvQkFDaEIsYUFBYSxFQUFFLG9CQUFvQjtpQkFDcEMsQ0FBQzthQUNILENBQUM7WUFFRixNQUFNLE1BQU0sR0FBRyxNQUFNLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN4RCxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNmLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDO1lBQ2xFLENBQUM7WUFFRCxNQUFNLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3RDLEdBQUcsQ0FBQyxPQUFPLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUN2QyxDQUFDO1FBQUMsT0FBTyxLQUFVLEVBQUUsQ0FBQztZQUNwQixHQUFHLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQztnQkFDN0IsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLElBQUksZ0RBQWdEO2FBQzVFLENBQUMsQ0FBQztRQUNMLENBQUM7Z0JBQVMsQ0FBQztZQUNULEdBQUcsQ0FBQyxPQUFPLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUN2QyxDQUFDO0lBQ0gsQ0FBQztDQUNGOzs7Ozs7O1VDeENEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUM1QkE7VUFDQTtVQUNBO1VBQ0E7VUFDQSx5Q0FBeUMsd0NBQXdDO1VBQ2pGO1VBQ0E7VUFDQSxFOzs7VUNQQSx5Rjs7O1VDQUE7VUFDQTtVQUNBLHNEQUFzRCxpQkFBaUI7VUFDdkUsZ0RBQWdELGFBQWE7VUFDN0QsRTs7Ozs7Ozs7Ozs7Ozs7QUNGdUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly92b3kvLi93ZWJyZXNvdXJjZXNfc3JjL3ZveV9xdW90ZV9Db21tYW5kQmFyLnRzIiwid2VicGFjazovL3ZveS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly92b3kvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3ZveS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3ZveS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3ZveS8uL3dlYnJlc291cmNlc19zcmMvbGlicmFyeS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3Mgdm95X3F1b3RlX0NvbW1hbmRCYXIge1xuICBzdGF0aWMgYXN5bmMgRXhlY3V0ZUNhbGN1bGF0ZShwcmltYXJ5Q29udHJvbDogYW55KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgZm9ybUNvbnRleHQgPSBwcmltYXJ5Q29udHJvbDtcblxuICAgIHRyeSB7XG4gICAgICBpZiAoZm9ybUNvbnRleHQuZGF0YS5lbnRpdHkuZ2V0SXNEaXJ0eSgpKSB7XG4gICAgICAgIGF3YWl0IGZvcm1Db250ZXh0LmRhdGEuc2F2ZSgpO1xuICAgICAgfVxuXG4gICAgICBYcm0uVXRpbGl0eS5zaG93UHJvZ3Jlc3NJbmRpY2F0b3IoXCJDYWxjdWxhdGluZyBxdW90ZS4uLlwiKTtcblxuICAgICAgY29uc3QgcXVvdGVJZCA9IGZvcm1Db250ZXh0LmRhdGEuZW50aXR5LmdldElkKCkucmVwbGFjZSgvW3t9XS9nLCBcIlwiKTtcbiAgICAgIGNvbnNvbGUubG9nKHF1b3RlSWQpO1xuICAgICAgY29uc3QgcmVxdWVzdCA9IHtcbiAgICAgICAgZW50aXR5OiB7IGVudGl0eVR5cGU6IFwidm95X3F1b3RlXCIsIGlkOiBxdW90ZUlkIH0sXG4gICAgICAgIGdldE1ldGFkYXRhOiAoKSA9PiAoe1xuICAgICAgICAgIGJvdW5kUGFyYW1ldGVyOiBcImVudGl0eVwiLFxuICAgICAgICAgIHBhcmFtZXRlclR5cGVzOiB7XG4gICAgICAgICAgICBlbnRpdHk6IHsgdHlwZU5hbWU6IFwibXNjcm0udm95X3F1b3RlXCIsIHN0cnVjdHVyYWxQcm9wZXJ0eTogNSB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgb3BlcmF0aW9uVHlwZTogMCxcbiAgICAgICAgICBvcGVyYXRpb25OYW1lOiBcInZveV9DYWxjdWxhdGVRdW90ZVwiLFxuICAgICAgICB9KSxcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IFhybS5XZWJBcGkub25saW5lLmV4ZWN1dGUocmVxdWVzdCk7XG4gICAgICBpZiAoIXJlc3VsdC5vaykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFF1b3RlIGNhbGN1bGF0aW9uIGZhaWxlZCAoJHtyZXN1bHQuc3RhdHVzfSkuYCk7XG4gICAgICB9XG5cbiAgICAgIGF3YWl0IGZvcm1Db250ZXh0LmRhdGEucmVmcmVzaChmYWxzZSk7XG4gICAgICBYcm0uVXRpbGl0eS5jbG9zZVByb2dyZXNzSW5kaWNhdG9yKCk7XG4gICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgICAgWHJtLk5hdmlnYXRpb24ub3BlbkVycm9yRGlhbG9nKHtcbiAgICAgICAgbWVzc2FnZTogZXJyb3I/Lm1lc3NhZ2UgPz8gXCJBbiBlcnJvciBvY2N1cnJlZCB3aGlsZSBjYWxjdWxhdGluZyB0aGUgcXVvdGUuXCIsXG4gICAgICB9KTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgWHJtLlV0aWxpdHkuY2xvc2VQcm9ncmVzc0luZGljYXRvcigpO1xuICAgIH1cbiAgfVxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbmNvbnN0IF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0Y29uc3QgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdGNvbnN0IG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0aWYgKCEobW9kdWxlSWQgaW4gX193ZWJwYWNrX21vZHVsZXNfXykpIHtcblx0XHRkZWxldGUgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0XHRjb25zdCBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIG1vZHVsZUlkICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlci92YWx1ZSBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKTsiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gV2ViIHJlc291cmNlIGNsYXNzZXMgYXJlIHJlLWV4cG9ydGVkIGZyb20gaGVyZSBhcyB5b3UgY3JlYXRlIHRoZW1cbi8vIChEYXRhdmVyc2UgUG93ZXJUb29sczogQ3JlYXRlIFdlYiBSZXNvdXJjZSBDbGFzcyBhcHBlbmRzIGVhY2ggb25lKS5cbmV4cG9ydCAqIGZyb20gXCIuL3ZveV9xdW90ZV9Db21tYW5kQmFyXCI7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=