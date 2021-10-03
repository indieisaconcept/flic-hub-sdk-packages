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

"use strict";var n=require("buttons"),e=require("http");function o(n){return n&&"object"==typeof n&&"default"in n?n:{default:n}}var t,r,u=o(n),l=decodeURIComponent,i=function(n,e){return['<u:SetEQ xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1">',"<InstanceID>0</InstanceID>","<EQType>"+n+"</EQType>","<DesiredValue>"+e+"</DesiredValue>","</u:SetEQ>"].join("")},s=function(n){return['<u:GetEQ xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1">',"<InstanceID>0</InstanceID>","<EQType>"+n+"</EQType>","</u:GetEQ>"].join("")},a=function(n,e,o){c(n,e,(function(t,r){if(t)return o(t);var u=+((null==r?void 0:r.CurrentValue)||"")?0:1;d(n,e,u,o)}))},c=function(n,e,o){f({url:"/MediaRenderer/RenderingControl/Control",content:s(e),headers:{host:n.ip,soapaction:"RenderingControl:1#GetEQ"}},(function(n,t){if(n)return o(n);var r=/<CurrentValue>(.*?)<\/CurrentValue>/gi.exec((null==t?void 0:t.content)||"");o(null,{EQType:e,CurrentValue:null==r?void 0:r[1]})}))},d=function(n,e,o,t){f({url:"/MediaRenderer/RenderingControl/Control",content:i(e,o),headers:{host:n.ip,soapaction:"RenderingControl:1#SetEQ"}},(function(o){if(o)return t(o);c(n,e,t)}))},f=function(n,o){var t;e.makeRequest({url:"http://"+n.headers.host+":1400"+n.url,method:"POST",headers:{Host:n.headers.host+":1400",soapaction:"urn:schemas-upnp-org:service:"+n.headers.soapaction,"Content-Type":'text/xml; charset="utf-8"'},content:(t=n.content,void 0===t&&(t=""),['<?xml version="1.0" encoding="utf-8"?>','<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">',"<s:Body>"+t+"</s:Body>","</s:Envelope>"].join(""))},(function(n,e){return n?o(n):200!==(null==e?void 0:e.statusCode)?o(new Error(JSON.stringify(e))):void o(null,e)}))},p=function(n){return{getEQValue:c.bind(null,n),setEQValue:d.bind(null,n),toggleEQValue:a.bind(null,n)}},g=function(n,e,o){var t=(void 0===o?{}:o).CurrentValue;if(e)return console.log(e);console.log("Sonos | "+n+" | "+t)};t={onClick:function(n){var e=p(n);e.toggleEQValue("SurroundEnable",(function(n,o){if(n)return console.log(n);e.setEQValue("SubEnable",null==o?void 0:o.CurrentValue,g.bind(null,"Home Theatre"))}))},onDoubleClick:function(n){return p(n).toggleEQValue("SurroundEnable",g.bind(null,"Surround"))},onHold:function(n){return p(n).toggleEQValue("SubEnable",g.bind(null,"Subwoofer"))}},r=new RegExp("^sdk://"+"sonos","i"),u.default.on("buttonSingleOrDoubleClickOrHold",(function(n){var e=u.default.getButton(n.bdaddr);if(r.test(e.name)){var o=function(n){return n.isSingleClick?"onClick":n.isDoubleClick?"onDoubleClick":"onHold"}(n),i=t[o];i&&i(function(n){var e=n.split("?")[1];return e?e.split("&").reduce((function(n,e){var o=e.split("="),t=o[0],r=o[1];return n[l(t)]=l(r),n}),{}):{}}(e.name),e)}}));
