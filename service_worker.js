!function(Q){function I(g){if(C[g])return C[g].exports;var F=C[g]={i:g,l:!1,exports:{}};return Q[g].call(F.exports,F,F.exports,I),F.l=!0,F.exports}var C={};I.m=Q,I.c=C,I.d=function(Q,C,g){I.o(Q,C)||Object.defineProperty(Q,C,{configurable:!1,enumerable:!0,get:g})},I.n=function(Q){var C=Q&&Q.__esModule?function(){return Q.default}:function(){return Q};return I.d(C,"a",C),C},I.o=function(Q,I){return Object.prototype.hasOwnProperty.call(Q,I)},I.p="",I(I.s=7)}({0:function(module,exports,__webpack_require__){"use strict";eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\nvar SERVER_URL = 'http://localhost:3005/';\n\nvar request = void 0,\n    db = void 0;\n\nfunction getObjectStore() {\n    return db.transaction(['ToDoItems'], 'readwrite').objectStore('ToDoItems');\n}\n\nfunction getAll() {\n    return fetch(SERVER_URL).then(function (response) {\n        return response.json();\n    });\n}\n\nfunction postAll(obj) {\n    return fetch(SERVER_URL, {\n        'method': 'POST',\n        'Content-Type': 'application/json',\n        'body': JSON.stringify(obj)\n    }).then(function (response) {\n        return response.json();\n    }).then(function (items) {\n        navigator.serviceWorker.controller.postMessage('updateScreens');\n        return items;\n    });\n}\n\nvar DB = exports.DB = {\n    getAll: getAll, postAll: postAll,\n    start: function start() {\n        var _this = this;\n\n        return new Promise(function (resolve) {\n            request = indexedDB.open('toDo', 1);\n            request.onsuccess = function (event) {\n                db = request.result;\n                resolve(_this);\n            };\n\n            request.onupgradeneeded = function (event) {\n                db = event.target.result;\n                db.createObjectStore('ToDoItems', { keyPath: 'id' });\n            };\n        });\n    },\n\n    get request() {\n        return request;\n    },\n    get db() {\n        return db;\n    },\n    selectedItem: {},\n    find: function find(id) {\n        var _this2 = this;\n\n        return new Promise(function (resolve) {\n            var request = getObjectStore().get(+id);\n            request.onsuccess = function (event) {\n                _this2.selectedItem = request.result;\n                resolve(request.result);\n            };\n        });\n    },\n    findAll: function findAll() {\n        var location = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'server';\n\n        return new Promise(function (resolve) {\n\n            var request = getObjectStore().getAll();\n            request.onsuccess = function (event) {\n                resolve(request.result);\n            };\n        });\n    },\n    insert: function insert(item) {\n        var _this3 = this;\n\n        return new Promise(function (resolve) {\n            item.id = new Date().getTime();\n            item.isChecked = false;\n\n            var request = getObjectStore().add(item);\n            request.onsuccess = function (event) {\n                resolve(_this3.findAll());\n            };\n        });\n    },\n    update: function update(item) {\n        var _this4 = this;\n\n        return new Promise(function (resolve) {\n            var updatedItem = Object.assign(_this4.selectedItem, item);\n            var request = getObjectStore().put(updatedItem);\n            request.onsuccess = function (event) {\n                resolve(_this4.findAll());\n            };\n        });\n    },\n    remove: function remove(id) {\n        var _this5 = this;\n\n        return new Promise(function (resolve) {\n            var request = getObjectStore().delete(id);\n            request.onsuccess = function (event) {\n                resolve(_this5.findAll());\n            };\n        });\n    },\n    checkAll: function checkAll() {\n        var _this6 = this;\n\n        var isChecked = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;\n\n        var isAllUpdated = false,\n            isUpdated = false;\n        return new Promise(function (resolve) {\n            getObjectStore().openCursor().onsuccess = function (event) {\n                var cursor = event.target.result;\n                if (cursor) {\n                    isUpdated = false;\n                    var newData = cursor.value;\n                    newData.isChecked = isChecked;\n                    var request = cursor.update(newData);\n                    request.onsuccess = function () {\n                        isUpdated = true;\n                        if (isAllUpdated && isUpdated) {\n                            resolve(_this6.findAll());\n                        }\n                    };\n                    cursor.continue();\n                } else {\n                    isAllUpdated = true;\n                    if (isAllUpdated && isUpdated) {\n                        resolve(_this6.findAll());\n                    }\n                }\n            };\n        });\n    },\n    clearAll: function clearAll() {\n        var _this7 = this;\n\n        var isAllRemoved = false,\n            isRemoved = false;\n        return new Promise(function (resolve) {\n            getObjectStore().openCursor().onsuccess = function (event) {\n                var cursor = event.target.result;\n                if (cursor) {\n                    isRemoved = false;\n                    if (cursor.value.isChecked) {\n                        var request = cursor.delete();\n                        request.onsuccess = function () {\n                            isRemoved = true;\n                            if (isAllRemoved && isRemoved) {\n                                resolve(_this7.findAll());\n                            }\n                        };\n                    } else {\n                        isRemoved = true;\n                    }\n                    cursor.continue();\n                } else {\n                    isAllRemoved = true;\n                    if (isAllRemoved && isRemoved) {\n                        resolve(_this7.findAll());\n                    }\n                }\n            };\n        });\n    }\n};//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9qcy90b0RvREIuanM/ODNmYiJdLCJuYW1lcyI6WyJTRVJWRVJfVVJMIiwicmVxdWVzdCIsImRiIiwiZ2V0T2JqZWN0U3RvcmUiLCJ0cmFuc2FjdGlvbiIsIm9iamVjdFN0b3JlIiwiZ2V0QWxsIiwiZmV0Y2giLCJ0aGVuIiwicmVzcG9uc2UiLCJqc29uIiwicG9zdEFsbCIsIm9iaiIsIkpTT04iLCJzdHJpbmdpZnkiLCJuYXZpZ2F0b3IiLCJzZXJ2aWNlV29ya2VyIiwiY29udHJvbGxlciIsInBvc3RNZXNzYWdlIiwiaXRlbXMiLCJEQiIsInN0YXJ0IiwiUHJvbWlzZSIsImluZGV4ZWREQiIsIm9wZW4iLCJvbnN1Y2Nlc3MiLCJldmVudCIsInJlc3VsdCIsInJlc29sdmUiLCJvbnVwZ3JhZGVuZWVkZWQiLCJ0YXJnZXQiLCJjcmVhdGVPYmplY3RTdG9yZSIsImtleVBhdGgiLCJzZWxlY3RlZEl0ZW0iLCJmaW5kIiwiaWQiLCJnZXQiLCJmaW5kQWxsIiwibG9jYXRpb24iLCJpbnNlcnQiLCJpdGVtIiwiRGF0ZSIsImdldFRpbWUiLCJpc0NoZWNrZWQiLCJhZGQiLCJ1cGRhdGUiLCJ1cGRhdGVkSXRlbSIsIk9iamVjdCIsImFzc2lnbiIsInB1dCIsInJlbW92ZSIsImRlbGV0ZSIsImNoZWNrQWxsIiwiaXNBbGxVcGRhdGVkIiwiaXNVcGRhdGVkIiwib3BlbkN1cnNvciIsImN1cnNvciIsIm5ld0RhdGEiLCJ2YWx1ZSIsImNvbnRpbnVlIiwiY2xlYXJBbGwiLCJpc0FsbFJlbW92ZWQiLCJpc1JlbW92ZWQiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsSUFBTUEsYUFBYSx3QkFBbkI7O0FBRUEsSUFBSUMsZ0JBQUo7QUFBQSxJQUNJQyxXQURKOztBQUdBLFNBQVNDLGNBQVQsR0FBeUI7QUFDckIsV0FBT0QsR0FBR0UsV0FBSCxDQUFlLENBQUMsV0FBRCxDQUFmLEVBQThCLFdBQTlCLEVBQTJDQyxXQUEzQyxDQUF1RCxXQUF2RCxDQUFQO0FB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QUFDSDtBQUNKO0FBQ0osYUF0QkQ7QUF1QkgsU0F4Qk0sQ0FBUDtBQXlCSDtBQXRIYSxDQUFYIiwiZmlsZSI6IjAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBTRVJWRVJfVVJMID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwNS8nO1xyXG5cclxubGV0IHJlcXVlc3QsXHJcbiAgICBkYjtcclxuXHJcbmZ1bmN0aW9uIGdldE9iamVjdFN0b3JlKCl7XHJcbiAgICByZXR1cm4gZGIudHJhbnNhY3Rpb24oWydUb0RvSXRlbXMnXSwgJ3JlYWR3cml0ZScpLm9iamVjdFN0b3JlKCdUb0RvSXRlbXMnKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0QWxsKCl7XHJcbiAgICByZXR1cm4gZmV0Y2goU0VSVkVSX1VSTCkudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwb3N0QWxsKG9iail7XHJcbiAgICByZXR1cm4gZmV0Y2goU0VSVkVSX1VSTCwge1xyXG4gICAgICAgICdtZXRob2QnOiAnUE9TVCcsXHJcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuICAgICAgICAnYm9keSc6IEpTT04uc3RyaW5naWZ5KG9iailcclxuICAgIH0pXHJcbiAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxyXG4gICAgICAgIC50aGVuKGl0ZW1zID0+IHtcclxuICAgICAgICAgICAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuY29udHJvbGxlci5wb3N0TWVzc2FnZSgndXBkYXRlU2NyZWVucycpO1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbXM7XHJcbiAgICAgICAgfSlcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IERCID0ge1xyXG4gICAgZ2V0QWxsLCBwb3N0QWxsLFxyXG4gICAgc3RhcnQoKXtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICAgICAgICAgIHJlcXVlc3QgPSBpbmRleGVkREIub3BlbigndG9EbycsIDEpO1xyXG4gICAgICAgICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGIgPSByZXF1ZXN0LnJlc3VsdDtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3Qub251cGdyYWRlbmVlZGVkID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkYiA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICBkYi5jcmVhdGVPYmplY3RTdG9yZSgnVG9Eb0l0ZW1zJywgeyBrZXlQYXRoOiAnaWQnIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBnZXQgcmVxdWVzdCgpeyByZXR1cm4gcmVxdWVzdDsgfSxcclxuICAgIGdldCBkYigpeyByZXR1cm4gZGI7IH0sXHJcbiAgICBzZWxlY3RlZEl0ZW06IHt9LFxyXG4gICAgZmluZChpZCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IGdldE9iamVjdFN0b3JlKCkuZ2V0KCtpZCk7XHJcbiAgICAgICAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbSA9IHJlcXVlc3QucmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXF1ZXN0LnJlc3VsdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfSxcclxuICAgIGZpbmRBbGwobG9jYXRpb24gPSAnc2VydmVyJyl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG5cclxuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBnZXRPYmplY3RTdG9yZSgpLmdldEFsbCgpO1xyXG4gICAgICAgICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXF1ZXN0LnJlc3VsdCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBpbnNlcnQoaXRlbSl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICAgICAgICBpdGVtLmlkID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcclxuICAgICAgICAgICAgaXRlbS5pc0NoZWNrZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gZ2V0T2JqZWN0U3RvcmUoKS5hZGQoaXRlbSk7XHJcbiAgICAgICAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRoaXMuZmluZEFsbCgpKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgdXBkYXRlKGl0ZW0pe1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuICAgICAgICAgICAgdmFyIHVwZGF0ZWRJdGVtID0gT2JqZWN0LmFzc2lnbih0aGlzLnNlbGVjdGVkSXRlbSwgaXRlbSk7XHJcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gZ2V0T2JqZWN0U3RvcmUoKS5wdXQodXBkYXRlZEl0ZW0pO1xyXG4gICAgICAgICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9IChldmVudCkgPT4geyByZXNvbHZlKHRoaXMuZmluZEFsbCgpKSB9XHJcbiAgICAgICAgfSlcclxuICAgIH0sXHJcbiAgICByZW1vdmUoaWQpe1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBnZXRPYmplY3RTdG9yZSgpLmRlbGV0ZShpZCk7XHJcbiAgICAgICAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7IHJlc29sdmUodGhpcy5maW5kQWxsKCkpIH1cclxuICAgICAgICB9KVxyXG4gICAgfSxcclxuICAgIGNoZWNrQWxsKGlzQ2hlY2tlZCA9IGZhbHNlKXtcclxuICAgICAgICB2YXIgaXNBbGxVcGRhdGVkID0gZmFsc2UsXHJcbiAgICAgICAgICAgIGlzVXBkYXRlZCA9IGZhbHNlO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuICAgICAgICAgICAgZ2V0T2JqZWN0U3RvcmUoKS5vcGVuQ3Vyc29yKCkub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3Vyc29yID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcclxuICAgICAgICAgICAgICAgIGlmKGN1cnNvcil7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNVcGRhdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0RhdGEgPSBjdXJzb3IudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3RGF0YS5pc0NoZWNrZWQgPSBpc0NoZWNrZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBjdXJzb3IudXBkYXRlKG5ld0RhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc1VwZGF0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihpc0FsbFVwZGF0ZWQgJiYgaXNVcGRhdGVkKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5maW5kQWxsKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnNvci5jb250aW51ZSgpO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNBbGxVcGRhdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBpZihpc0FsbFVwZGF0ZWQgJiYgaXNVcGRhdGVkKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLmZpbmRBbGwoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBjbGVhckFsbCgpe1xyXG4gICAgICAgIHZhciBpc0FsbFJlbW92ZWQgPSBmYWxzZSxcclxuICAgICAgICAgICAgaXNSZW1vdmVkID0gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICAgICAgICBnZXRPYmplY3RTdG9yZSgpLm9wZW5DdXJzb3IoKS5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciBjdXJzb3IgPSBldmVudC50YXJnZXQucmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgaWYoY3Vyc29yKXtcclxuICAgICAgICAgICAgICAgICAgICBpc1JlbW92ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBpZihjdXJzb3IudmFsdWUuaXNDaGVja2VkKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBjdXJzb3IuZGVsZXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNSZW1vdmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGlzQWxsUmVtb3ZlZCAmJiBpc1JlbW92ZWQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5maW5kQWxsKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzUmVtb3ZlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnNvci5jb250aW51ZSgpO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNBbGxSZW1vdmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBpZihpc0FsbFJlbW92ZWQgJiYgaXNSZW1vdmVkKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLmZpbmRBbGwoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2pzL3RvRG9EQi5qcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///0\n")},7:function(Q,I,C){Q.exports=C(8)},8:function(module,exports,__webpack_require__){"use strict";eval("\n\nvar _toDoDB = __webpack_require__(0);\n\n_toDoDB.DB.start();\n\nvar CACHE_NAME = 'v1.0.0';\nvar FILES = ['./', './index.html', './css/styles.css', './app.bundle.js'];\n\nself.addEventListener('install', function (event) {\n    event.waitUntil(caches.open(CACHE_NAME).then(function (cache) {\n        return cache.addAll(FILES);\n    }));\n});\n\nself.addEventListener('activate', function (event) {\n    event.waitUntil(caches.keys().then(function (keys) {\n        return Promise.all(keys.filter(function (key) {\n            return key.indexOf(CACHE_NAME) !== 0;\n        }).map(function (key) {\n            return caches.delete(key);\n        }));\n    }));\n});\n\nself.addEventListener('fetch', function (event) {\n    event.respondWith(caches.match(event.request).then(function (response) {\n        return response || fetch(event.request);\n    }));\n});\n\nfunction sendItems() {\n    return _toDoDB.DB.findAll('local').then(function (items) {\n        return _toDoDB.DB.postAll(items);\n    });\n}\n\nfunction updateScreens() {\n    self.clients.matchAll().then(function (clients) {\n        clients.forEach(function (client) {\n            client.postMessage('updateScreens');\n        });\n    });\n}\n\nself.addEventListener('sync', function (event) {\n    if (event.tag === 'newItem' || event.tag === 'test-tag-from-devtools') {\n        event.waitUntil(sendItems());\n    }\n});\n\nself.addEventListener('message', function (event) {\n    if (event.data === 'updateScreens') {\n        updateScreens();\n    }\n});\n\nself.addEventListener('push', function (event) {\n    var message = event.data.text();\n    self.registration.showNotification('Push message received', {\n        body: message,\n        icon: './images/tw_icon.png',\n        actions: [{ action: 'confirm1', title: 'Abrir PWA' }, { action: 'confirm2', title: 'Abrir TreinaWeb' }]\n    });\n});\n\nself.addEventListener('notificationclick', function (event) {\n    event.notification.close();\n    var url = event.action === 'confirm1' ? 'http://localhost:3000' : 'https://treinaweb.com.br';\n\n    event.waitUntil(self.clients.matchAll().then(function (activeClients) {\n        if (activeClients.length > 0) {\n            activeClients[0].navigate(url);\n        } else {\n            self.clients.openWindow(url);\n        }\n    }));\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdi5qcz80OTc2Il0sIm5hbWVzIjpbInN0YXJ0IiwiQ0FDSEVfTkFNRSIsIkZJTEVTIiwic2VsZiIsImFkZEV2ZW50TGlzdGVuZXIiLCJldmVudCIsIndhaXRVbnRpbCIsImNhY2hlcyIsIm9wZW4iLCJ0aGVuIiwiY2FjaGUiLCJhZGRBbGwiLCJrZXlzIiwiUHJvbWlzZSIsImFsbCIsImZpbHRlciIsImtleSIsImluZGV4T2YiLCJtYXAiLCJkZWxldGUiLCJyZXNwb25kV2l0aCIsIm1hdGNoIiwicmVxdWVzdCIsInJlc3BvbnNlIiwiZmV0Y2giLCJzZW5kSXRlbXMiLCJmaW5kQWxsIiwicG9zdEFsbCIsIml0ZW1zIiwidXBkYXRlU2NyZWVucyIsImNsaWVudHMiLCJtYXRjaEFsbCIsImZvckVhY2giLCJjbGllbnQiLCJwb3N0TWVzc2FnZSIsInRhZyIsImRhdGEiLCJtZXNzYWdlIiwidGV4dCIsInJlZ2lzdHJhdGlvbiIsInNob3dOb3RpZmljYXRpb24iLCJib2R5IiwiaWNvbiIsImFjdGlvbnMiLCJhY3Rpb24iLCJ0aXRsZSIsIm5vdGlmaWNhdGlvbiIsImNsb3NlIiwidXJsIiwiYWN0aXZlQ2xpZW50cyIsImxlbmd0aCIsIm5hdmlnYXRlIiwib3BlbldpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7QUFFQSxXQUFHQSxLQUFIOztBQUVBLElBQU1DLGFBQWEsUUFBbkI7QUFDQSxJQUFNQyxRQUFRLENBQ1YsSUFEVSxFQUVWLGNBRlUsRUFHVixrQkFIVSxFQUlWLGlCQUpVLENBQWQ7O0FBVUFDLEtBQUtDLGdCQUFMLENBQXNCLFNBQXRCLEVBQWlDLFVBQVNDLEtBQVQsRUFBZTtBQUM1Q0EsVUFBTUMsU0FBTixDQUNJQyxPQUFPQyxJQUFQLENBQVlQLFVBQVosRUFBd0JRLElBQXhCLENBQTZCLFVBQVNDLEtBQVQsRUFBZTtBQUN4QyxlQUFPQSxNQUFNQyxNQUFOLENBQWFULEtBQWIsQ0FBUDtBQUNILEtBRkQsQ0FESjtBQUtILENB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ZCxFQUFpQkUsUUFBakIsQ0FBMEJILEdBQTFCO0FBQ0gsU0FGRCxNQUVLO0FBQ0Q3QyxpQkFBSzJCLE9BQUwsQ0FBYXNCLFVBQWIsQ0FBd0JKLEdBQXhCO0FBQ0g7QUFDSixLQU5ELENBREo7QUFTSCxDQWJEIiwiZmlsZSI6IjguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEQiB9IGZyb20gJy4vanMvdG9Eb0RCJztcclxuXHJcbkRCLnN0YXJ0KCk7XHJcblxyXG5jb25zdCBDQUNIRV9OQU1FID0gJ3YxLjAuMCc7XHJcbmNvbnN0IEZJTEVTID0gW1xyXG4gICAgJy4vJyxcclxuICAgICcuL2luZGV4Lmh0bWwnLFxyXG4gICAgJy4vY3NzL3N0eWxlcy5jc3MnLFxyXG4gICAgJy4vYXBwLmJ1bmRsZS5qcydcclxuXVxyXG5cclxuXHJcblxyXG5cclxuc2VsZi5hZGRFdmVudExpc3RlbmVyKCdpbnN0YWxsJywgZnVuY3Rpb24oZXZlbnQpe1xyXG4gICAgZXZlbnQud2FpdFVudGlsKFxyXG4gICAgICAgIGNhY2hlcy5vcGVuKENBQ0hFX05BTUUpLnRoZW4oZnVuY3Rpb24oY2FjaGUpe1xyXG4gICAgICAgICAgICByZXR1cm4gY2FjaGUuYWRkQWxsKEZJTEVTKTtcclxuICAgICAgICB9KVxyXG4gICAgKVxyXG59KVxyXG5cclxuc2VsZi5hZGRFdmVudExpc3RlbmVyKCdhY3RpdmF0ZScsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgZXZlbnQud2FpdFVudGlsKFxyXG4gICAgICAgIGNhY2hlcy5rZXlzKCkudGhlbihmdW5jdGlvbiAoa2V5cykge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoa2V5c1xyXG4gICAgICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleS5pbmRleE9mKENBQ0hFX05BTUUpICE9PSAwO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWNoZXMuZGVsZXRlKGtleSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0pXHJcbiAgICApO1xyXG59KTtcclxuXHJcbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignZmV0Y2gnLCBmdW5jdGlvbihldmVudCl7XHJcbiAgICBldmVudC5yZXNwb25kV2l0aChcclxuICAgICAgICBjYWNoZXMubWF0Y2goZXZlbnQucmVxdWVzdCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZSB8fCBmZXRjaChldmVudC5yZXF1ZXN0KTtcclxuICAgICAgICB9KVxyXG4gICAgKVxyXG59KVxyXG5cclxuXHJcbmZ1bmN0aW9uIHNlbmRJdGVtcygpe1xyXG4gICAgcmV0dXJuIERCLmZpbmRBbGwoJ2xvY2FsJylcclxuICAgICAgICAudGhlbihpdGVtcyA9PiBEQi5wb3N0QWxsKGl0ZW1zKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZVNjcmVlbnMoKXtcclxuICAgIHNlbGYuY2xpZW50cy5tYXRjaEFsbCgpLnRoZW4oZnVuY3Rpb24oY2xpZW50cyl7XHJcbiAgICAgICAgY2xpZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGNsaWVudCl7XHJcbiAgICAgICAgICAgIGNsaWVudC5wb3N0TWVzc2FnZSgndXBkYXRlU2NyZWVucycpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG59XHJcblxyXG5zZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ3N5bmMnLCBmdW5jdGlvbihldmVudCl7XHJcbiAgICBpZihldmVudC50YWcgPT09ICduZXdJdGVtJyB8fCBldmVudC50YWcgPT09ICd0ZXN0LXRhZy1mcm9tLWRldnRvb2xzJyApe1xyXG4gICAgICAgIGV2ZW50LndhaXRVbnRpbChzZW5kSXRlbXMoKSlcclxuICAgIH1cclxufSlcclxuXHJcblxyXG5zZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbihldmVudCl7XHJcbiAgICBpZihldmVudC5kYXRhID09PSAndXBkYXRlU2NyZWVucycpe1xyXG4gICAgICAgIHVwZGF0ZVNjcmVlbnMoKTtcclxuICAgIH1cclxufSlcclxuXHJcblxyXG5zZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ3B1c2gnLCBmdW5jdGlvbihldmVudCl7XHJcbiAgICB2YXIgbWVzc2FnZSA9IGV2ZW50LmRhdGEudGV4dCgpO1xyXG4gICAgc2VsZi5yZWdpc3RyYXRpb24uc2hvd05vdGlmaWNhdGlvbignUHVzaCBtZXNzYWdlIHJlY2VpdmVkJywge1xyXG4gICAgICAgIGJvZHk6IG1lc3NhZ2UsXHJcbiAgICAgICAgaWNvbjogJy4vaW1hZ2VzL3R3X2ljb24ucG5nJyxcclxuICAgICAgICBhY3Rpb25zOiBbXHJcbiAgICAgICAgICAgIHthY3Rpb246ICdjb25maXJtMScsIHRpdGxlOiAnQWJyaXIgUFdBJ30sXHJcbiAgICAgICAgICAgIHthY3Rpb246ICdjb25maXJtMicsIHRpdGxlOiAnQWJyaXIgVHJlaW5hV2ViJ31cclxuICAgICAgICBdXHJcbiAgICB9KVxyXG59KVxyXG5cclxuc2VsZi5hZGRFdmVudExpc3RlbmVyKCdub3RpZmljYXRpb25jbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgIGV2ZW50Lm5vdGlmaWNhdGlvbi5jbG9zZSgpO1xyXG4gICAgdmFyIHVybCA9IGV2ZW50LmFjdGlvbiA9PT0gJ2NvbmZpcm0xJyA/ICdodHRwOi8vbG9jYWxob3N0OjMwMDAnIDogJ2h0dHBzOi8vdHJlaW5hd2ViLmNvbS5icic7XHJcblxyXG4gICAgZXZlbnQud2FpdFVudGlsKFxyXG4gICAgICAgIHNlbGYuY2xpZW50cy5tYXRjaEFsbCgpLnRoZW4oZnVuY3Rpb24oYWN0aXZlQ2xpZW50cyl7XHJcbiAgICAgICAgICAgIGlmKGFjdGl2ZUNsaWVudHMubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgICAgICBhY3RpdmVDbGllbnRzWzBdLm5hdmlnYXRlKHVybCk7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgc2VsZi5jbGllbnRzLm9wZW5XaW5kb3codXJsKTtcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICB9KVxyXG4gICAgKVxyXG59KVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3N2LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///8\n")}});