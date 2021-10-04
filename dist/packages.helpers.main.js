/**
 * MIT License
 * 
 * Copyright (c) 2021 Jonathan Barnett
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */

"use strict";function e(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}Object.defineProperty(exports,"__esModule",{value:!0});var t=e(require("buttons")),n=decodeURIComponent;exports.registerButtonPackage=function(e){var o=e.namespace,r=e.events;t.default.on("buttonSingleOrDoubleClickOrHold",(function(e){var i,u=t.default.getButton(e.bdaddr),l=!1;if(o&&(l=!(i=i||new RegExp("^sdk://"+o,"i")).test(u.name)),!l){var a=function(e){return e.isSingleClick?"onClick":e.isDoubleClick?"onDoubleClick":"onHold"}(e),c=r[a];if(c){var s=function(e){var t=e.split("?")[1];return t?t.split("&").reduce((function(e,t){var o=t.split("="),r=o[0],i=o[1];return e[n(r)]=n(i),e}),{}):{}}(u.name);c.call(u,s)}}}))};
