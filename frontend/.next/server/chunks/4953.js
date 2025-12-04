exports.id=4953,exports.ids=[4953],exports.modules={9724:e=>{"use strict";var t={single_source_shortest_paths:function(e,i,r){var o,n,s,l,a,c,h,d={},u={};u[i]=0;var p=t.PriorityQueue.make();for(p.push(i,0);!p.empty();)for(s in n=(o=p.pop()).value,l=o.cost,a=e[n]||{})a.hasOwnProperty(s)&&(c=l+a[s],h=u[s],(void 0===u[s]||h>c)&&(u[s]=c,p.push(s,c),d[s]=n));if(void 0!==r&&void 0===u[r])throw Error(["Could not find a path from ",i," to ",r,"."].join(""));return d},extract_shortest_path_from_predecessor_list:function(e,t){for(var i=[],r=t;r;)i.push(r),e[r],r=e[r];return i.reverse(),i},find_path:function(e,i,r){var o=t.single_source_shortest_paths(e,i,r);return t.extract_shortest_path_from_predecessor_list(o,r)},PriorityQueue:{make:function(e){var i,r=t.PriorityQueue,o={};for(i in e=e||{},r)r.hasOwnProperty(i)&&(o[i]=r[i]);return o.queue=[],o.sorter=e.sorter||r.default_sorter,o},default_sorter:function(e,t){return e.cost-t.cost},push:function(e,t){this.queue.push({value:e,cost:t}),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return 0===this.queue.length}}};e.exports=t},25748:e=>{"use strict";e.exports=function(e){for(var t=[],i=e.length,r=0;r<i;r++){var o=e.charCodeAt(r);if(o>=55296&&o<=56319&&i>r+1){var n=e.charCodeAt(r+1);n>=56320&&n<=57343&&(o=(o-55296)*1024+n-56320+65536,r+=1)}if(o<128){t.push(o);continue}if(o<2048){t.push(o>>6|192),t.push(63&o|128);continue}if(o<55296||o>=57344&&o<65536){t.push(o>>12|224),t.push(o>>6&63|128),t.push(63&o|128);continue}if(o>=65536&&o<=1114111){t.push(o>>18|240),t.push(o>>12&63|128),t.push(o>>6&63|128),t.push(63&o|128);continue}t.push(239,191,189)}return new Uint8Array(t).buffer}},69655:(e,t,i)=>{"use strict";let r=i(64723),o=[function(){},function(e,t,i,r){if(r===t.length)throw Error("Ran out of data");let o=t[r];e[i]=o,e[i+1]=o,e[i+2]=o,e[i+3]=255},function(e,t,i,r){if(r+1>=t.length)throw Error("Ran out of data");let o=t[r];e[i]=o,e[i+1]=o,e[i+2]=o,e[i+3]=t[r+1]},function(e,t,i,r){if(r+2>=t.length)throw Error("Ran out of data");e[i]=t[r],e[i+1]=t[r+1],e[i+2]=t[r+2],e[i+3]=255},function(e,t,i,r){if(r+3>=t.length)throw Error("Ran out of data");e[i]=t[r],e[i+1]=t[r+1],e[i+2]=t[r+2],e[i+3]=t[r+3]}],n=[function(){},function(e,t,i,r){let o=t[0];e[i]=o,e[i+1]=o,e[i+2]=o,e[i+3]=r},function(e,t,i){let r=t[0];e[i]=r,e[i+1]=r,e[i+2]=r,e[i+3]=t[1]},function(e,t,i,r){e[i]=t[0],e[i+1]=t[1],e[i+2]=t[2],e[i+3]=r},function(e,t,i){e[i]=t[0],e[i+1]=t[1],e[i+2]=t[2],e[i+3]=t[3]}];t.dataToBitMap=function(e,t){let i,s,l,a,c=t.width,h=t.height,d=t.depth,u=t.bpp,p=t.interlace;if(8!==d){let t,r;t=[],r=0,i={get:function(i){for(;t.length<i;)!function(){let i,o,n,s,l,a,c,h;if(r===e.length)throw Error("Ran out of data");let u=e[r];switch(r++,d){default:throw Error("unrecognised depth");case 16:c=e[r],r++,t.push((u<<8)+c);break;case 4:c=15&u,h=u>>4,t.push(h,c);break;case 2:l=3&u,a=u>>2&3,c=u>>4&3,h=u>>6&3,t.push(h,c,a,l);break;case 1:i=1&u,o=u>>1&1,n=u>>2&1,s=u>>3&1,l=u>>4&1,a=u>>5&1,c=u>>6&1,h=u>>7&1,t.push(h,c,a,l,s,n,o,i)}}();let o=t.slice(0,i);return t=t.slice(i),o},resetAfterLine:function(){t.length=0},end:function(){if(r!==e.length)throw Error("extra data found")}}}s=d<=8?Buffer.alloc(c*h*4):new Uint16Array(c*h*4);let f=Math.pow(2,d)-1,g=0;if(p)l=r.getImagePasses(c,h),a=r.getInterlaceIterator(c,h);else{let e=0;a=function(){let t=e;return e+=4,t},l=[{width:c,height:h}]}for(let t=0;t<l.length;t++)8===d?g=function(e,t,i,r,n,s){let l=e.width,a=e.height,c=e.index;for(let e=0;e<a;e++)for(let a=0;a<l;a++){let l=i(a,e,c);o[r](t,n,l,s),s+=r}return s}(l[t],s,a,u,e,g):function(e,t,i,r,o,s){let l=e.width,a=e.height,c=e.index;for(let e=0;e<a;e++){for(let a=0;a<l;a++){let l=o.get(r),h=i(a,e,c);n[r](t,l,h,s)}o.resetAfterLine()}}(l[t],s,a,u,i,f);if(8===d){if(g!==e.length)throw Error("extra data found")}else i.end();return s}},67654:(e,t,i)=>{"use strict";let r=i(97048);e.exports=function(e,t,i,o){let n=-1!==[r.COLORTYPE_COLOR_ALPHA,r.COLORTYPE_ALPHA].indexOf(o.colorType);if(o.colorType===o.inputColorType){let t;let i=(new DataView(t=new ArrayBuffer(2)).setInt16(0,256,!0),256!==new Int16Array(t)[0]);if(8===o.bitDepth||16===o.bitDepth&&i)return e}let s=16!==o.bitDepth?e:new Uint16Array(e.buffer),l=255,a=r.COLORTYPE_TO_BPP_MAP[o.inputColorType];4!==a||o.inputHasAlpha||(a=3);let c=r.COLORTYPE_TO_BPP_MAP[o.colorType];16===o.bitDepth&&(l=65535,c*=2);let h=Buffer.alloc(t*i*c),d=0,u=0,p=o.bgColor||{};void 0===p.red&&(p.red=l),void 0===p.green&&(p.green=l),void 0===p.blue&&(p.blue=l);for(let e=0;e<i;e++)for(let e=0;e<t;e++){let e=function(){let e,t,i;let a=l;switch(o.inputColorType){case r.COLORTYPE_COLOR_ALPHA:a=s[d+3],e=s[d],t=s[d+1],i=s[d+2];break;case r.COLORTYPE_COLOR:e=s[d],t=s[d+1],i=s[d+2];break;case r.COLORTYPE_ALPHA:a=s[d+1],t=e=s[d],i=e;break;case r.COLORTYPE_GRAYSCALE:t=e=s[d],i=e;break;default:throw Error("input color type:"+o.inputColorType+" is not supported at present")}return o.inputHasAlpha&&!n&&(a/=l,e=Math.min(Math.max(Math.round((1-a)*p.red+a*e),0),l),t=Math.min(Math.max(Math.round((1-a)*p.green+a*t),0),l),i=Math.min(Math.max(Math.round((1-a)*p.blue+a*i),0),l)),{red:e,green:t,blue:i,alpha:a}}(s,d);switch(o.colorType){case r.COLORTYPE_COLOR_ALPHA:case r.COLORTYPE_COLOR:8===o.bitDepth?(h[u]=e.red,h[u+1]=e.green,h[u+2]=e.blue,n&&(h[u+3]=e.alpha)):(h.writeUInt16BE(e.red,u),h.writeUInt16BE(e.green,u+2),h.writeUInt16BE(e.blue,u+4),n&&h.writeUInt16BE(e.alpha,u+6));break;case r.COLORTYPE_ALPHA:case r.COLORTYPE_GRAYSCALE:{let t=(e.red+e.green+e.blue)/3;8===o.bitDepth?(h[u]=t,n&&(h[u+1]=e.alpha)):(h.writeUInt16BE(t,u),n&&h.writeUInt16BE(e.alpha,u+2));break}default:throw Error("unrecognised color Type "+o.colorType)}d+=a,u+=c}return h}},91489:(e,t,i)=>{"use strict";let r=i(21764),o=i(76162),n=e.exports=function(){o.call(this),this._buffers=[],this._buffered=0,this._reads=[],this._paused=!1,this._encoding="utf8",this.writable=!0};r.inherits(n,o),n.prototype.read=function(e,t){this._reads.push({length:Math.abs(e),allowLess:e<0,func:t}),process.nextTick((function(){this._process(),this._paused&&this._reads&&this._reads.length>0&&(this._paused=!1,this.emit("drain"))}).bind(this))},n.prototype.write=function(e,t){let i;return this.writable?(Buffer.isBuffer(e)?i=e:i=Buffer.from(e,t||this._encoding),this._buffers.push(i),this._buffered+=i.length,this._process(),this._reads&&0===this._reads.length&&(this._paused=!0),this.writable&&!this._paused):(this.emit("error",Error("Stream not writable")),!1)},n.prototype.end=function(e,t){e&&this.write(e,t),this.writable=!1,this._buffers&&(0===this._buffers.length?this._end():(this._buffers.push(null),this._process()))},n.prototype.destroySoon=n.prototype.end,n.prototype._end=function(){this._reads.length>0&&this.emit("error",Error("Unexpected end of input")),this.destroy()},n.prototype.destroy=function(){this._buffers&&(this.writable=!1,this._reads=null,this._buffers=null,this.emit("close"))},n.prototype._processReadAllowingLess=function(e){this._reads.shift();let t=this._buffers[0];t.length>e.length?(this._buffered-=e.length,this._buffers[0]=t.slice(e.length),e.func.call(this,t.slice(0,e.length))):(this._buffered-=t.length,this._buffers.shift(),e.func.call(this,t))},n.prototype._processRead=function(e){this._reads.shift();let t=0,i=0,r=Buffer.alloc(e.length);for(;t<e.length;){let o=this._buffers[i++],n=Math.min(o.length,e.length-t);o.copy(r,t,0,n),t+=n,n!==o.length&&(this._buffers[--i]=o.slice(n))}i>0&&this._buffers.splice(0,i),this._buffered-=e.length,e.func.call(this,r)},n.prototype._process=function(){try{for(;this._buffered>0&&this._reads&&this._reads.length>0;){let e=this._reads[0];if(e.allowLess)this._processReadAllowingLess(e);else if(this._buffered>=e.length)this._processRead(e);else break}this._buffers&&!this.writable&&this._end()}catch(e){this.emit("error",e)}}},97048:e=>{"use strict";e.exports={PNG_SIGNATURE:[137,80,78,71,13,10,26,10],TYPE_IHDR:1229472850,TYPE_IEND:1229278788,TYPE_IDAT:1229209940,TYPE_PLTE:1347179589,TYPE_tRNS:1951551059,TYPE_gAMA:1732332865,COLORTYPE_GRAYSCALE:0,COLORTYPE_PALETTE:1,COLORTYPE_COLOR:2,COLORTYPE_ALPHA:4,COLORTYPE_PALETTE_COLOR:3,COLORTYPE_COLOR_ALPHA:6,COLORTYPE_TO_BPP_MAP:{0:1,2:3,3:1,4:2,6:4},GAMMA_DIVISION:1e5}},60039:e=>{"use strict";let t=[];!function(){for(let e=0;e<256;e++){let i=e;for(let e=0;e<8;e++)1&i?i=3988292384^i>>>1:i>>>=1;t[e]=i}}();let i=e.exports=function(){this._crc=-1};i.prototype.write=function(e){for(let i=0;i<e.length;i++)this._crc=t[(this._crc^e[i])&255]^this._crc>>>8;return!0},i.prototype.crc32=function(){return -1^this._crc},i.crc32=function(e){let i=-1;for(let r=0;r<e.length;r++)i=t[(i^e[r])&255]^i>>>8;return -1^i}},50728:(e,t,i)=>{"use strict";let r=i(94853),o={0:function(e,t,i,r,o){for(let n=0;n<i;n++)r[o+n]=e[t+n]},1:function(e,t,i,r,o,n){for(let s=0;s<i;s++){let i=s>=n?e[t+s-n]:0,l=e[t+s]-i;r[o+s]=l}},2:function(e,t,i,r,o){for(let n=0;n<i;n++){let s=t>0?e[t+n-i]:0,l=e[t+n]-s;r[o+n]=l}},3:function(e,t,i,r,o,n){for(let s=0;s<i;s++){let l=s>=n?e[t+s-n]:0,a=t>0?e[t+s-i]:0,c=e[t+s]-(l+a>>1);r[o+s]=c}},4:function(e,t,i,o,n,s){for(let l=0;l<i;l++){let a=l>=s?e[t+l-s]:0,c=t>0?e[t+l-i]:0,h=t>0&&l>=s?e[t+l-(i+s)]:0,d=e[t+l]-r(a,c,h);o[n+l]=d}}},n={0:function(e,t,i){let r=0,o=t+i;for(let i=t;i<o;i++)r+=Math.abs(e[i]);return r},1:function(e,t,i,r){let o=0;for(let n=0;n<i;n++){let i=n>=r?e[t+n-r]:0;o+=Math.abs(e[t+n]-i)}return o},2:function(e,t,i){let r=0,o=t+i;for(let n=t;n<o;n++){let o=t>0?e[n-i]:0;r+=Math.abs(e[n]-o)}return r},3:function(e,t,i,r){let o=0;for(let n=0;n<i;n++){let s=n>=r?e[t+n-r]:0,l=t>0?e[t+n-i]:0;o+=Math.abs(e[t+n]-(s+l>>1))}return o},4:function(e,t,i,o){let n=0;for(let s=0;s<i;s++){let l=s>=o?e[t+s-o]:0,a=t>0?e[t+s-i]:0,c=t>0&&s>=o?e[t+s-(i+o)]:0;n+=Math.abs(e[t+s]-r(l,a,c))}return n}};e.exports=function(e,t,i,r,s){let l;if("filterType"in r&&-1!==r.filterType){if("number"==typeof r.filterType)l=[r.filterType];else throw Error("unrecognised filter types")}else l=[0,1,2,3,4];16===r.bitDepth&&(s*=2);let a=t*s,c=0,h=0,d=Buffer.alloc((a+1)*i),u=l[0];for(let t=0;t<i;t++){if(l.length>1){let t=1/0;for(let i=0;i<l.length;i++){let r=n[l[i]](e,h,a,s);r<t&&(u=l[i],t=r)}}d[c]=u,c++,o[u](e,h,a,d,c,s),c+=a,h+=a}return d}},5934:(e,t,i)=>{"use strict";let r=i(21764),o=i(91489),n=i(26805),s=e.exports=function(e){o.call(this);let t=[],i=this;this._filter=new n(e,{read:this.read.bind(this),write:function(e){t.push(e)},complete:function(){i.emit("complete",Buffer.concat(t))}}),this._filter.start()};r.inherits(s,o)},18187:(e,t,i)=>{"use strict";let r=i(89592),o=i(26805);t.process=function(e,t){let i=[],n=new r(e);return new o(t,{read:n.read.bind(n),write:function(e){i.push(e)},complete:function(){}}).start(),n.process(),Buffer.concat(i)}},26805:(e,t,i)=>{"use strict";let r=i(64723),o=i(94853);function n(e,t,i){let r=e*t;return 8!==i&&(r=Math.ceil(r/(8/i))),r}let s=e.exports=function(e,t){let i=e.width,o=e.height,s=e.interlace,l=e.bpp,a=e.depth;if(this.read=t.read,this.write=t.write,this.complete=t.complete,this._imageIndex=0,this._images=[],s){let e=r.getImagePasses(i,o);for(let t=0;t<e.length;t++)this._images.push({byteWidth:n(e[t].width,l,a),height:e[t].height,lineIndex:0})}else this._images.push({byteWidth:n(i,l,a),height:o,lineIndex:0});8===a?this._xComparison=l:16===a?this._xComparison=2*l:this._xComparison=1};s.prototype.start=function(){this.read(this._images[this._imageIndex].byteWidth+1,this._reverseFilterLine.bind(this))},s.prototype._unFilterType1=function(e,t,i){let r=this._xComparison,o=r-1;for(let n=0;n<i;n++){let i=e[1+n],s=n>o?t[n-r]:0;t[n]=i+s}},s.prototype._unFilterType2=function(e,t,i){let r=this._lastLine;for(let o=0;o<i;o++){let i=e[1+o],n=r?r[o]:0;t[o]=i+n}},s.prototype._unFilterType3=function(e,t,i){let r=this._xComparison,o=r-1,n=this._lastLine;for(let s=0;s<i;s++){let i=e[1+s],l=n?n[s]:0,a=Math.floor(((s>o?t[s-r]:0)+l)/2);t[s]=i+a}},s.prototype._unFilterType4=function(e,t,i){let r=this._xComparison,n=r-1,s=this._lastLine;for(let l=0;l<i;l++){let i=e[1+l],a=s?s[l]:0,c=o(l>n?t[l-r]:0,a,l>n&&s?s[l-r]:0);t[l]=i+c}},s.prototype._reverseFilterLine=function(e){let t,i=e[0],r=this._images[this._imageIndex],o=r.byteWidth;if(0===i)t=e.slice(1,o+1);else switch(t=Buffer.alloc(o),i){case 1:this._unFilterType1(e,t,o);break;case 2:this._unFilterType2(e,t,o);break;case 3:this._unFilterType3(e,t,o);break;case 4:this._unFilterType4(e,t,o);break;default:throw Error("Unrecognised filter type - "+i)}this.write(t),r.lineIndex++,r.lineIndex>=r.height?(this._lastLine=null,this._imageIndex++,r=this._images[this._imageIndex]):this._lastLine=t,r?this.read(r.byteWidth+1,this._reverseFilterLine.bind(this)):(this._lastLine=null,this.complete())}},14807:e=>{"use strict";e.exports=function(e,t){let i=t.depth,r=t.width,o=t.height,n=t.colorType,s=t.transColor,l=t.palette,a=e;return 3===n?function(e,t,i,r,o){let n=0;for(let s=0;s<r;s++)for(let r=0;r<i;r++){let i=o[e[n]];if(!i)throw Error("index "+e[n]+" not in palette");for(let e=0;e<4;e++)t[n+e]=i[e];n+=4}}(e,a,r,o,l):(s&&function(e,t,i,r,o){let n=0;for(let s=0;s<r;s++)for(let r=0;r<i;r++){let i=!1;if(1===o.length?o[0]===e[n]&&(i=!0):o[0]===e[n]&&o[1]===e[n+1]&&o[2]===e[n+2]&&(i=!0),i)for(let e=0;e<4;e++)t[n+e]=0;n+=4}}(e,a,r,o,s),8!==i&&(16===i&&(a=Buffer.alloc(r*o*4)),function(e,t,i,r,o){let n=Math.pow(2,o)-1,s=0;for(let o=0;o<r;o++)for(let r=0;r<i;r++){for(let i=0;i<4;i++)t[s+i]=Math.floor(255*e[s+i]/n+.5);s+=4}}(e,a,r,o,i))),a}},64723:(e,t)=>{"use strict";let i=[{x:[0],y:[0]},{x:[4],y:[0]},{x:[0,4],y:[4]},{x:[2,6],y:[0,4]},{x:[0,2,4,6],y:[2,6]},{x:[1,3,5,7],y:[0,2,4,6]},{x:[0,1,2,3,4,5,6,7],y:[1,3,5,7]}];t.getImagePasses=function(e,t){let r=[],o=e%8,n=t%8,s=(e-o)/8,l=(t-n)/8;for(let e=0;e<i.length;e++){let t=i[e],a=s*t.x.length,c=l*t.y.length;for(let e=0;e<t.x.length;e++)if(t.x[e]<o)a++;else break;for(let e=0;e<t.y.length;e++)if(t.y[e]<n)c++;else break;a>0&&c>0&&r.push({width:a,height:c,index:e})}return r},t.getInterlaceIterator=function(e){return function(t,r,o){let n=t%i[o].x.length,s=(t-n)/i[o].x.length*8+i[o].x[n],l=r%i[o].y.length;return 4*s+((r-l)/i[o].y.length*8+i[o].y[l])*e*4}}},69490:(e,t,i)=>{"use strict";let r=i(21764),o=i(76162),n=i(97048),s=i(14949),l=e.exports=function(e){o.call(this),this._packer=new s(e||{}),this._deflate=this._packer.createDeflate(),this.readable=!0};r.inherits(l,o),l.prototype.pack=function(e,t,i,r){this.emit("data",Buffer.from(n.PNG_SIGNATURE)),this.emit("data",this._packer.packIHDR(t,i)),r&&this.emit("data",this._packer.packGAMA(r));let o=this._packer.filterData(e,t,i);this._deflate.on("error",this.emit.bind(this,"error")),this._deflate.on("data",(function(e){this.emit("data",this._packer.packIDAT(e))}).bind(this)),this._deflate.on("end",(function(){this.emit("data",this._packer.packIEND()),this.emit("end")}).bind(this)),this._deflate.end(o)}},30846:(e,t,i)=>{"use strict";let r=!0,o=i(71568);o.deflateSync||(r=!1);let n=i(97048),s=i(14949);e.exports=function(e,t){if(!r)throw Error("To use the sync capability of this library in old node versions, please pin pngjs to v2.3.0");let i=new s(t||{}),l=[];l.push(Buffer.from(n.PNG_SIGNATURE)),l.push(i.packIHDR(e.width,e.height)),e.gamma&&l.push(i.packGAMA(e.gamma));let a=i.filterData(e.data,e.width,e.height),c=o.deflateSync(a,i.getDeflateOptions());if(a=null,!c||!c.length)throw Error("bad png - invalid compressed data response");return l.push(i.packIDAT(c)),l.push(i.packIEND()),Buffer.concat(l)}},14949:(e,t,i)=>{"use strict";let r=i(97048),o=i(60039),n=i(67654),s=i(50728),l=i(71568),a=e.exports=function(e){if(this._options=e,e.deflateChunkSize=e.deflateChunkSize||32768,e.deflateLevel=null!=e.deflateLevel?e.deflateLevel:9,e.deflateStrategy=null!=e.deflateStrategy?e.deflateStrategy:3,e.inputHasAlpha=null==e.inputHasAlpha||e.inputHasAlpha,e.deflateFactory=e.deflateFactory||l.createDeflate,e.bitDepth=e.bitDepth||8,e.colorType="number"==typeof e.colorType?e.colorType:r.COLORTYPE_COLOR_ALPHA,e.inputColorType="number"==typeof e.inputColorType?e.inputColorType:r.COLORTYPE_COLOR_ALPHA,-1===[r.COLORTYPE_GRAYSCALE,r.COLORTYPE_COLOR,r.COLORTYPE_COLOR_ALPHA,r.COLORTYPE_ALPHA].indexOf(e.colorType))throw Error("option color type:"+e.colorType+" is not supported at present");if(-1===[r.COLORTYPE_GRAYSCALE,r.COLORTYPE_COLOR,r.COLORTYPE_COLOR_ALPHA,r.COLORTYPE_ALPHA].indexOf(e.inputColorType))throw Error("option input color type:"+e.inputColorType+" is not supported at present");if(8!==e.bitDepth&&16!==e.bitDepth)throw Error("option bit depth:"+e.bitDepth+" is not supported at present")};a.prototype.getDeflateOptions=function(){return{chunkSize:this._options.deflateChunkSize,level:this._options.deflateLevel,strategy:this._options.deflateStrategy}},a.prototype.createDeflate=function(){return this._options.deflateFactory(this.getDeflateOptions())},a.prototype.filterData=function(e,t,i){let o=n(e,t,i,this._options),l=r.COLORTYPE_TO_BPP_MAP[this._options.colorType];return s(o,t,i,this._options,l)},a.prototype._packChunk=function(e,t){let i=t?t.length:0,r=Buffer.alloc(i+12);return r.writeUInt32BE(i,0),r.writeUInt32BE(e,4),t&&t.copy(r,8),r.writeInt32BE(o.crc32(r.slice(4,r.length-4)),r.length-4),r},a.prototype.packGAMA=function(e){let t=Buffer.alloc(4);return t.writeUInt32BE(Math.floor(e*r.GAMMA_DIVISION),0),this._packChunk(r.TYPE_gAMA,t)},a.prototype.packIHDR=function(e,t){let i=Buffer.alloc(13);return i.writeUInt32BE(e,0),i.writeUInt32BE(t,4),i[8]=this._options.bitDepth,i[9]=this._options.colorType,i[10]=0,i[11]=0,i[12]=0,this._packChunk(r.TYPE_IHDR,i)},a.prototype.packIDAT=function(e){return this._packChunk(r.TYPE_IDAT,e)},a.prototype.packIEND=function(){return this._packChunk(r.TYPE_IEND,null)}},94853:e=>{"use strict";e.exports=function(e,t,i){let r=e+t-i,o=Math.abs(r-e),n=Math.abs(r-t),s=Math.abs(r-i);return o<=n&&o<=s?e:n<=s?t:i}},37521:(e,t,i)=>{"use strict";let r=i(21764),o=i(71568),n=i(91489),s=i(5934),l=i(63493),a=i(69655),c=i(14807),h=e.exports=function(e){n.call(this),this._parser=new l(e,{read:this.read.bind(this),error:this._handleError.bind(this),metadata:this._handleMetaData.bind(this),gamma:this.emit.bind(this,"gamma"),palette:this._handlePalette.bind(this),transColor:this._handleTransColor.bind(this),finished:this._finished.bind(this),inflateData:this._inflateData.bind(this),simpleTransparency:this._simpleTransparency.bind(this),headersFinished:this._headersFinished.bind(this)}),this._options=e,this.writable=!0,this._parser.start()};r.inherits(h,n),h.prototype._handleError=function(e){this.emit("error",e),this.writable=!1,this.destroy(),this._inflate&&this._inflate.destroy&&this._inflate.destroy(),this._filter&&(this._filter.destroy(),this._filter.on("error",function(){})),this.errord=!0},h.prototype._inflateData=function(e){if(!this._inflate){if(this._bitmapInfo.interlace)this._inflate=o.createInflate(),this._inflate.on("error",this.emit.bind(this,"error")),this._filter.on("complete",this._complete.bind(this)),this._inflate.pipe(this._filter);else{let e=((this._bitmapInfo.width*this._bitmapInfo.bpp*this._bitmapInfo.depth+7>>3)+1)*this._bitmapInfo.height,t=Math.max(e,o.Z_MIN_CHUNK);this._inflate=o.createInflate({chunkSize:t});let i=e,r=this.emit.bind(this,"error");this._inflate.on("error",function(e){i&&r(e)}),this._filter.on("complete",this._complete.bind(this));let n=this._filter.write.bind(this._filter);this._inflate.on("data",function(e){i&&(e.length>i&&(e=e.slice(0,i)),i-=e.length,n(e))}),this._inflate.on("end",this._filter.end.bind(this._filter))}}this._inflate.write(e)},h.prototype._handleMetaData=function(e){this._metaData=e,this._bitmapInfo=Object.create(e),this._filter=new s(this._bitmapInfo)},h.prototype._handleTransColor=function(e){this._bitmapInfo.transColor=e},h.prototype._handlePalette=function(e){this._bitmapInfo.palette=e},h.prototype._simpleTransparency=function(){this._metaData.alpha=!0},h.prototype._headersFinished=function(){this.emit("metadata",this._metaData)},h.prototype._finished=function(){this.errord||(this._inflate?this._inflate.end():this.emit("error","No Inflate block"))},h.prototype._complete=function(e){let t;if(!this.errord){try{let i=a.dataToBitMap(e,this._bitmapInfo);t=c(i,this._bitmapInfo),i=null}catch(e){this._handleError(e);return}this.emit("parsed",t)}}},82013:(e,t,i)=>{"use strict";let r=!0,o=i(71568),n=i(73973);o.deflateSync||(r=!1);let s=i(89592),l=i(18187),a=i(63493),c=i(69655),h=i(14807);e.exports=function(e,t){let i,d,u,p;if(!r)throw Error("To use the sync capability of this library in old node versions, please pin pngjs to v2.3.0");let f=[],g=new s(e);if(new a(t,{read:g.read.bind(g),error:function(e){i=e},metadata:function(e){d=e},gamma:function(e){u=e},palette:function(e){d.palette=e},transColor:function(e){d.transColor=e},inflateData:function(e){f.push(e)},simpleTransparency:function(){d.alpha=!0}}).start(),g.process(),i)throw i;let m=Buffer.concat(f);if(f.length=0,d.interlace)p=o.inflateSync(m);else{let e=((d.width*d.bpp*d.depth+7>>3)+1)*d.height;p=n(m,{chunkSize:e,maxLength:e})}if(m=null,!p||!p.length)throw Error("bad png - invalid inflate data response");let w=l.process(p,d);m=null;let b=c.dataToBitMap(w,d);w=null;let y=h(b,d);return d.data=y,d.gamma=u||0,d}},63493:(e,t,i)=>{"use strict";let r=i(97048),o=i(60039),n=e.exports=function(e,t){this._options=e,e.checkCRC=!1!==e.checkCRC,this._hasIHDR=!1,this._hasIEND=!1,this._emittedHeadersFinished=!1,this._palette=[],this._colorType=0,this._chunks={},this._chunks[r.TYPE_IHDR]=this._handleIHDR.bind(this),this._chunks[r.TYPE_IEND]=this._handleIEND.bind(this),this._chunks[r.TYPE_IDAT]=this._handleIDAT.bind(this),this._chunks[r.TYPE_PLTE]=this._handlePLTE.bind(this),this._chunks[r.TYPE_tRNS]=this._handleTRNS.bind(this),this._chunks[r.TYPE_gAMA]=this._handleGAMA.bind(this),this.read=t.read,this.error=t.error,this.metadata=t.metadata,this.gamma=t.gamma,this.transColor=t.transColor,this.palette=t.palette,this.parsed=t.parsed,this.inflateData=t.inflateData,this.finished=t.finished,this.simpleTransparency=t.simpleTransparency,this.headersFinished=t.headersFinished||function(){}};n.prototype.start=function(){this.read(r.PNG_SIGNATURE.length,this._parseSignature.bind(this))},n.prototype._parseSignature=function(e){let t=r.PNG_SIGNATURE;for(let i=0;i<t.length;i++)if(e[i]!==t[i]){this.error(Error("Invalid file signature"));return}this.read(8,this._parseChunkBegin.bind(this))},n.prototype._parseChunkBegin=function(e){let t=e.readUInt32BE(0),i=e.readUInt32BE(4),n="";for(let t=4;t<8;t++)n+=String.fromCharCode(e[t]);let s=!!(32&e[4]);if(!this._hasIHDR&&i!==r.TYPE_IHDR){this.error(Error("Expected IHDR on beggining"));return}if(this._crc=new o,this._crc.write(Buffer.from(n)),this._chunks[i])return this._chunks[i](t);if(!s){this.error(Error("Unsupported critical chunk type "+n));return}this.read(t+4,this._skipChunk.bind(this))},n.prototype._skipChunk=function(){this.read(8,this._parseChunkBegin.bind(this))},n.prototype._handleChunkEnd=function(){this.read(4,this._parseChunkEnd.bind(this))},n.prototype._parseChunkEnd=function(e){let t=e.readInt32BE(0),i=this._crc.crc32();if(this._options.checkCRC&&i!==t){this.error(Error("Crc error - "+t+" - "+i));return}this._hasIEND||this.read(8,this._parseChunkBegin.bind(this))},n.prototype._handleIHDR=function(e){this.read(e,this._parseIHDR.bind(this))},n.prototype._parseIHDR=function(e){this._crc.write(e);let t=e.readUInt32BE(0),i=e.readUInt32BE(4),o=e[8],n=e[9],s=e[10],l=e[11],a=e[12];if(8!==o&&4!==o&&2!==o&&1!==o&&16!==o){this.error(Error("Unsupported bit depth "+o));return}if(!(n in r.COLORTYPE_TO_BPP_MAP)){this.error(Error("Unsupported color type"));return}if(0!==s){this.error(Error("Unsupported compression method"));return}if(0!==l){this.error(Error("Unsupported filter method"));return}if(0!==a&&1!==a){this.error(Error("Unsupported interlace method"));return}this._colorType=n;let c=r.COLORTYPE_TO_BPP_MAP[this._colorType];this._hasIHDR=!0,this.metadata({width:t,height:i,depth:o,interlace:!!a,palette:!!(n&r.COLORTYPE_PALETTE),color:!!(n&r.COLORTYPE_COLOR),alpha:!!(n&r.COLORTYPE_ALPHA),bpp:c,colorType:n}),this._handleChunkEnd()},n.prototype._handlePLTE=function(e){this.read(e,this._parsePLTE.bind(this))},n.prototype._parsePLTE=function(e){this._crc.write(e);let t=Math.floor(e.length/3);for(let i=0;i<t;i++)this._palette.push([e[3*i],e[3*i+1],e[3*i+2],255]);this.palette(this._palette),this._handleChunkEnd()},n.prototype._handleTRNS=function(e){this.simpleTransparency(),this.read(e,this._parseTRNS.bind(this))},n.prototype._parseTRNS=function(e){if(this._crc.write(e),this._colorType===r.COLORTYPE_PALETTE_COLOR){if(0===this._palette.length){this.error(Error("Transparency chunk must be after palette"));return}if(e.length>this._palette.length){this.error(Error("More transparent colors than palette size"));return}for(let t=0;t<e.length;t++)this._palette[t][3]=e[t];this.palette(this._palette)}this._colorType===r.COLORTYPE_GRAYSCALE&&this.transColor([e.readUInt16BE(0)]),this._colorType===r.COLORTYPE_COLOR&&this.transColor([e.readUInt16BE(0),e.readUInt16BE(2),e.readUInt16BE(4)]),this._handleChunkEnd()},n.prototype._handleGAMA=function(e){this.read(e,this._parseGAMA.bind(this))},n.prototype._parseGAMA=function(e){this._crc.write(e),this.gamma(e.readUInt32BE(0)/r.GAMMA_DIVISION),this._handleChunkEnd()},n.prototype._handleIDAT=function(e){this._emittedHeadersFinished||(this._emittedHeadersFinished=!0,this.headersFinished()),this.read(-e,this._parseIDAT.bind(this,e))},n.prototype._parseIDAT=function(e,t){if(this._crc.write(t),this._colorType===r.COLORTYPE_PALETTE_COLOR&&0===this._palette.length)throw Error("Expected palette not found");this.inflateData(t);let i=e-t.length;i>0?this._handleIDAT(i):this._handleChunkEnd()},n.prototype._handleIEND=function(e){this.read(e,this._parseIEND.bind(this))},n.prototype._parseIEND=function(e){this._crc.write(e),this._hasIEND=!0,this._handleChunkEnd(),this.finished&&this.finished()}},58984:(e,t,i)=>{"use strict";let r=i(82013),o=i(30846);t.read=function(e,t){return r(e,t||{})},t.write=function(e,t){return o(e,t)}},28202:(e,t,i)=>{"use strict";let r=i(21764),o=i(76162),n=i(37521),s=i(69490),l=i(58984),a=t.y=function(e){o.call(this),e=e||{},this.width=0|e.width,this.height=0|e.height,this.data=this.width>0&&this.height>0?Buffer.alloc(4*this.width*this.height):null,e.fill&&this.data&&this.data.fill(0),this.gamma=0,this.readable=this.writable=!0,this._parser=new n(e),this._parser.on("error",this.emit.bind(this,"error")),this._parser.on("close",this._handleClose.bind(this)),this._parser.on("metadata",this._metadata.bind(this)),this._parser.on("gamma",this._gamma.bind(this)),this._parser.on("parsed",(function(e){this.data=e,this.emit("parsed",e)}).bind(this)),this._packer=new s(e),this._packer.on("data",this.emit.bind(this,"data")),this._packer.on("end",this.emit.bind(this,"end")),this._parser.on("close",this._handleClose.bind(this)),this._packer.on("error",this.emit.bind(this,"error"))};r.inherits(a,o),a.sync=l,a.prototype.pack=function(){return this.data&&this.data.length?process.nextTick((function(){this._packer.pack(this.data,this.width,this.height,this.gamma)}).bind(this)):this.emit("error","No data provided"),this},a.prototype.parse=function(e,t){if(t){let e,i;e=(function(e){this.removeListener("error",i),this.data=e,t(null,this)}).bind(this),i=(function(i){this.removeListener("parsed",e),t(i,null)}).bind(this),this.once("parsed",e),this.once("error",i)}return this.end(e),this},a.prototype.write=function(e){return this._parser.write(e),!0},a.prototype.end=function(e){this._parser.end(e)},a.prototype._metadata=function(e){this.width=e.width,this.height=e.height,this.emit("metadata",e)},a.prototype._gamma=function(e){this.gamma=e},a.prototype._handleClose=function(){this._parser.writable||this._packer.readable||this.emit("close")},a.bitblt=function(e,t,i,r,o,n,s,l){if(r|=0,o|=0,n|=0,s|=0,l|=0,(i|=0)>e.width||r>e.height||i+o>e.width||r+n>e.height)throw Error("bitblt reading outside image");if(s>t.width||l>t.height||s+o>t.width||l+n>t.height)throw Error("bitblt writing outside image");for(let a=0;a<n;a++)e.data.copy(t.data,(l+a)*t.width+s<<2,(r+a)*e.width+i<<2,(r+a)*e.width+i+o<<2)},a.prototype.bitblt=function(e,t,i,r,o,n,s){return a.bitblt(this,e,t,i,r,o,n,s),this},a.adjustGamma=function(e){if(e.gamma){for(let t=0;t<e.height;t++)for(let i=0;i<e.width;i++){let r=e.width*t+i<<2;for(let t=0;t<3;t++){let i=e.data[r+t]/255;i=Math.pow(i,1/2.2/e.gamma),e.data[r+t]=Math.round(255*i)}}e.gamma=0}},a.prototype.adjustGamma=function(){a.adjustGamma(this)}},73973:(e,t,i)=>{"use strict";let r=i(27790).ok,o=i(71568),n=i(21764),s=i(78893).kMaxLength;function l(e){if(!(this instanceof l))return new l(e);e&&e.chunkSize<o.Z_MIN_CHUNK&&(e.chunkSize=o.Z_MIN_CHUNK),o.Inflate.call(this,e),this._offset=void 0===this._offset?this._outOffset:this._offset,this._buffer=this._buffer||this._outBuffer,e&&null!=e.maxLength&&(this._maxLength=e.maxLength)}function a(e,t){t&&process.nextTick(t),e._handle&&(e._handle.close(),e._handle=null)}function c(e,t){return function(e,t){if("string"==typeof t&&(t=Buffer.from(t)),!(t instanceof Buffer))throw TypeError("Not a string or buffer");let i=e._finishFlushFlag;return null==i&&(i=o.Z_FINISH),e._processChunk(t,i)}(new l(t),e)}l.prototype._processChunk=function(e,t,i){let n,l;if("function"==typeof i)return o.Inflate._processChunk.call(this,e,t,i);let c=this,h=e&&e.length,d=this._chunkSize-this._offset,u=this._maxLength,p=0,f=[],g=0;this.on("error",function(e){n=e}),r(this._handle,"zlib binding closed");do l=(l=this._handle.writeSync(t,e,p,h,this._buffer,this._offset,d))||this._writeState;while(!this._hadError&&function(e,t){if(c._hadError)return;let i=d-t;if(r(i>=0,"have should not go down"),i>0){let e=c._buffer.slice(c._offset,c._offset+i);if(c._offset+=i,e.length>u&&(e=e.slice(0,u)),f.push(e),g+=e.length,0==(u-=e.length))return!1}return(0===t||c._offset>=c._chunkSize)&&(d=c._chunkSize,c._offset=0,c._buffer=Buffer.allocUnsafe(c._chunkSize)),0===t&&(p+=h-e,h=e,!0)}(l[0],l[1]));if(this._hadError)throw n;if(g>=s)throw a(this),RangeError("Cannot create final Buffer. It would be larger than 0x"+s.toString(16)+" bytes");let m=Buffer.concat(f,g);return a(this),m},n.inherits(l,o.Inflate),e.exports=t=c,t.Inflate=l,t.createInflate=function(e){return new l(e)},t.inflateSync=c},89592:e=>{"use strict";let t=e.exports=function(e){this._buffer=e,this._reads=[]};t.prototype.read=function(e,t){this._reads.push({length:Math.abs(e),allowLess:e<0,func:t})},t.prototype.process=function(){for(;this._reads.length>0&&this._buffer.length;){let e=this._reads[0];if(this._buffer.length&&(this._buffer.length>=e.length||e.allowLess)){this._reads.shift();let t=this._buffer;this._buffer=t.slice(e.length),e.func.call(this,t.slice(0,e.length))}else break}return this._reads.length>0?Error("There are some read requests waitng on finished stream"):this._buffer.length>0?Error("unrecognised content at end of stream"):void 0}},68937:(e,t,i)=>{let r=i(10426),o=i(94837),n=i(65829),s=i(99888);function l(e,t,i,n,s){let l=[].slice.call(arguments,1),a=l.length,c="function"==typeof l[a-1];if(!c&&!r())throw Error("Callback required as last argument");if(c){if(a<2)throw Error("Too few arguments provided");2===a?(s=i,i=t,t=n=void 0):3===a&&(t.getContext&&void 0===s?(s=n,n=void 0):(s=n,n=i,i=t,t=void 0))}else{if(a<1)throw Error("Too few arguments provided");return 1===a?(i=t,t=n=void 0):2!==a||t.getContext||(n=i,i=t,t=void 0),new Promise(function(r,s){try{let s=o.create(i,n);r(e(s,t,n))}catch(e){s(e)}})}try{let r=o.create(i,n);s(null,e(r,t,n))}catch(e){s(e)}}o.create,t.toCanvas=l.bind(null,n.render),l.bind(null,n.renderToDataURL),l.bind(null,function(e,t,i){return s.render(e,i)})},10426:e=>{e.exports=function(){return"function"==typeof Promise&&Promise.prototype&&Promise.prototype.then}},23345:(e,t,i)=>{let r=i(14778).getSymbolSize;t.getRowColCoords=function(e){if(1===e)return[];let t=Math.floor(e/7)+2,i=r(e),o=145===i?26:2*Math.ceil((i-13)/(2*t-2)),n=[i-7];for(let e=1;e<t-1;e++)n[e]=n[e-1]-o;return n.push(6),n.reverse()},t.getPositions=function(e){let i=[],r=t.getRowColCoords(e),o=r.length;for(let e=0;e<o;e++)for(let t=0;t<o;t++)(0!==e||0!==t)&&(0!==e||t!==o-1)&&(e!==o-1||0!==t)&&i.push([r[e],r[t]]);return i}},41074:(e,t,i)=>{let r=i(96608),o=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":"];function n(e){this.mode=r.ALPHANUMERIC,this.data=e}n.getBitsLength=function(e){return 11*Math.floor(e/2)+e%2*6},n.prototype.getLength=function(){return this.data.length},n.prototype.getBitsLength=function(){return n.getBitsLength(this.data.length)},n.prototype.write=function(e){let t;for(t=0;t+2<=this.data.length;t+=2){let i=45*o.indexOf(this.data[t]);i+=o.indexOf(this.data[t+1]),e.put(i,11)}this.data.length%2&&e.put(o.indexOf(this.data[t]),6)},e.exports=n},11058:e=>{function t(){this.buffer=[],this.length=0}t.prototype={get:function(e){return(this.buffer[Math.floor(e/8)]>>>7-e%8&1)==1},put:function(e,t){for(let i=0;i<t;i++)this.putBit((e>>>t-i-1&1)==1)},getLengthInBits:function(){return this.length},putBit:function(e){let t=Math.floor(this.length/8);this.buffer.length<=t&&this.buffer.push(0),e&&(this.buffer[t]|=128>>>this.length%8),this.length++}},e.exports=t},64197:e=>{function t(e){if(!e||e<1)throw Error("BitMatrix size must be defined and greater than 0");this.size=e,this.data=new Uint8Array(e*e),this.reservedBit=new Uint8Array(e*e)}t.prototype.set=function(e,t,i,r){let o=e*this.size+t;this.data[o]=i,r&&(this.reservedBit[o]=!0)},t.prototype.get=function(e,t){return this.data[e*this.size+t]},t.prototype.xor=function(e,t,i){this.data[e*this.size+t]^=i},t.prototype.isReserved=function(e,t){return this.reservedBit[e*this.size+t]},e.exports=t},43143:(e,t,i)=>{let r=i(25748),o=i(96608);function n(e){this.mode=o.BYTE,"string"==typeof e&&(e=r(e)),this.data=new Uint8Array(e)}n.getBitsLength=function(e){return 8*e},n.prototype.getLength=function(){return this.data.length},n.prototype.getBitsLength=function(){return n.getBitsLength(this.data.length)},n.prototype.write=function(e){for(let t=0,i=this.data.length;t<i;t++)e.put(this.data[t],8)},e.exports=n},65152:(e,t,i)=>{let r=i(55958),o=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],n=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];t.getBlocksCount=function(e,t){switch(t){case r.L:return o[(e-1)*4+0];case r.M:return o[(e-1)*4+1];case r.Q:return o[(e-1)*4+2];case r.H:return o[(e-1)*4+3];default:return}},t.getTotalCodewordsCount=function(e,t){switch(t){case r.L:return n[(e-1)*4+0];case r.M:return n[(e-1)*4+1];case r.Q:return n[(e-1)*4+2];case r.H:return n[(e-1)*4+3];default:return}}},55958:(e,t)=>{t.L={bit:1},t.M={bit:0},t.Q={bit:3},t.H={bit:2},t.isValid=function(e){return e&&void 0!==e.bit&&e.bit>=0&&e.bit<4},t.from=function(e,i){if(t.isValid(e))return e;try{return function(e){if("string"!=typeof e)throw Error("Param is not a string");switch(e.toLowerCase()){case"l":case"low":return t.L;case"m":case"medium":return t.M;case"q":case"quartile":return t.Q;case"h":case"high":return t.H;default:throw Error("Unknown EC Level: "+e)}}(e)}catch(e){return i}}},2096:(e,t,i)=>{let r=i(14778).getSymbolSize;t.getPositions=function(e){let t=r(e);return[[0,0],[t-7,0],[0,t-7]]}},52587:(e,t,i)=>{let r=i(14778),o=r.getBCHDigit(1335);t.getEncodedBits=function(e,t){let i=e.bit<<3|t,n=i<<10;for(;r.getBCHDigit(n)-o>=0;)n^=1335<<r.getBCHDigit(n)-o;return(i<<10|n)^21522}},60237:(e,t)=>{let i=new Uint8Array(512),r=new Uint8Array(256);(function(){let e=1;for(let t=0;t<255;t++)i[t]=e,r[e]=t,256&(e<<=1)&&(e^=285);for(let e=255;e<512;e++)i[e]=i[e-255]})(),t.log=function(e){if(e<1)throw Error("log("+e+")");return r[e]},t.exp=function(e){return i[e]},t.mul=function(e,t){return 0===e||0===t?0:i[r[e]+r[t]]}},27022:(e,t,i)=>{let r=i(96608),o=i(14778);function n(e){this.mode=r.KANJI,this.data=e}n.getBitsLength=function(e){return 13*e},n.prototype.getLength=function(){return this.data.length},n.prototype.getBitsLength=function(){return n.getBitsLength(this.data.length)},n.prototype.write=function(e){let t;for(t=0;t<this.data.length;t++){let i=o.toSJIS(this.data[t]);if(i>=33088&&i<=40956)i-=33088;else if(i>=57408&&i<=60351)i-=49472;else throw Error("Invalid SJIS character: "+this.data[t]+"\nMake sure your charset is UTF-8");i=(i>>>8&255)*192+(255&i),e.put(i,13)}},e.exports=n},72198:(e,t)=>{t.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};let i={N1:3,N2:3,N3:40,N4:10};t.isValid=function(e){return null!=e&&""!==e&&!isNaN(e)&&e>=0&&e<=7},t.from=function(e){return t.isValid(e)?parseInt(e,10):void 0},t.getPenaltyN1=function(e){let t=e.size,r=0,o=0,n=0,s=null,l=null;for(let a=0;a<t;a++){o=n=0,s=l=null;for(let c=0;c<t;c++){let t=e.get(a,c);t===s?o++:(o>=5&&(r+=i.N1+(o-5)),s=t,o=1),(t=e.get(c,a))===l?n++:(n>=5&&(r+=i.N1+(n-5)),l=t,n=1)}o>=5&&(r+=i.N1+(o-5)),n>=5&&(r+=i.N1+(n-5))}return r},t.getPenaltyN2=function(e){let t=e.size,r=0;for(let i=0;i<t-1;i++)for(let o=0;o<t-1;o++){let t=e.get(i,o)+e.get(i,o+1)+e.get(i+1,o)+e.get(i+1,o+1);(4===t||0===t)&&r++}return r*i.N2},t.getPenaltyN3=function(e){let t=e.size,r=0,o=0,n=0;for(let i=0;i<t;i++){o=n=0;for(let s=0;s<t;s++)o=o<<1&2047|e.get(i,s),s>=10&&(1488===o||93===o)&&r++,n=n<<1&2047|e.get(s,i),s>=10&&(1488===n||93===n)&&r++}return r*i.N3},t.getPenaltyN4=function(e){let t=0,r=e.data.length;for(let i=0;i<r;i++)t+=e.data[i];return Math.abs(Math.ceil(100*t/r/5)-10)*i.N4},t.applyMask=function(e,i){let r=i.size;for(let o=0;o<r;o++)for(let n=0;n<r;n++)i.isReserved(n,o)||i.xor(n,o,function(e,i,r){switch(e){case t.Patterns.PATTERN000:return(i+r)%2==0;case t.Patterns.PATTERN001:return i%2==0;case t.Patterns.PATTERN010:return r%3==0;case t.Patterns.PATTERN011:return(i+r)%3==0;case t.Patterns.PATTERN100:return(Math.floor(i/2)+Math.floor(r/3))%2==0;case t.Patterns.PATTERN101:return i*r%2+i*r%3==0;case t.Patterns.PATTERN110:return(i*r%2+i*r%3)%2==0;case t.Patterns.PATTERN111:return(i*r%3+(i+r)%2)%2==0;default:throw Error("bad maskPattern:"+e)}}(e,n,o))},t.getBestMask=function(e,i){let r=Object.keys(t.Patterns).length,o=0,n=1/0;for(let s=0;s<r;s++){i(s),t.applyMask(s,e);let r=t.getPenaltyN1(e)+t.getPenaltyN2(e)+t.getPenaltyN3(e)+t.getPenaltyN4(e);t.applyMask(s,e),r<n&&(n=r,o=s)}return o}},96608:(e,t,i)=>{let r=i(40732),o=i(69721);t.NUMERIC={id:"Numeric",bit:1,ccBits:[10,12,14]},t.ALPHANUMERIC={id:"Alphanumeric",bit:2,ccBits:[9,11,13]},t.BYTE={id:"Byte",bit:4,ccBits:[8,16,16]},t.KANJI={id:"Kanji",bit:8,ccBits:[8,10,12]},t.MIXED={bit:-1},t.getCharCountIndicator=function(e,t){if(!e.ccBits)throw Error("Invalid mode: "+e);if(!r.isValid(t))throw Error("Invalid version: "+t);return t>=1&&t<10?e.ccBits[0]:t<27?e.ccBits[1]:e.ccBits[2]},t.getBestModeForData=function(e){return o.testNumeric(e)?t.NUMERIC:o.testAlphanumeric(e)?t.ALPHANUMERIC:o.testKanji(e)?t.KANJI:t.BYTE},t.toString=function(e){if(e&&e.id)return e.id;throw Error("Invalid mode")},t.isValid=function(e){return e&&e.bit&&e.ccBits},t.from=function(e,i){if(t.isValid(e))return e;try{return function(e){if("string"!=typeof e)throw Error("Param is not a string");switch(e.toLowerCase()){case"numeric":return t.NUMERIC;case"alphanumeric":return t.ALPHANUMERIC;case"kanji":return t.KANJI;case"byte":return t.BYTE;default:throw Error("Unknown mode: "+e)}}(e)}catch(e){return i}}},1852:(e,t,i)=>{let r=i(96608);function o(e){this.mode=r.NUMERIC,this.data=e.toString()}o.getBitsLength=function(e){return 10*Math.floor(e/3)+(e%3?e%3*3+1:0)},o.prototype.getLength=function(){return this.data.length},o.prototype.getBitsLength=function(){return o.getBitsLength(this.data.length)},o.prototype.write=function(e){let t,i;for(t=0;t+3<=this.data.length;t+=3)i=parseInt(this.data.substr(t,3),10),e.put(i,10);let r=this.data.length-t;r>0&&(i=parseInt(this.data.substr(t),10),e.put(i,3*r+1))},e.exports=o},31073:(e,t,i)=>{let r=i(60237);t.mul=function(e,t){let i=new Uint8Array(e.length+t.length-1);for(let o=0;o<e.length;o++)for(let n=0;n<t.length;n++)i[o+n]^=r.mul(e[o],t[n]);return i},t.mod=function(e,t){let i=new Uint8Array(e);for(;i.length-t.length>=0;){let e=i[0];for(let o=0;o<t.length;o++)i[o]^=r.mul(t[o],e);let o=0;for(;o<i.length&&0===i[o];)o++;i=i.slice(o)}return i},t.generateECPolynomial=function(e){let i=new Uint8Array([1]);for(let o=0;o<e;o++)i=t.mul(i,new Uint8Array([1,r.exp(o)]));return i}},94837:(e,t,i)=>{let r=i(14778),o=i(55958),n=i(11058),s=i(64197),l=i(23345),a=i(2096),c=i(72198),h=i(65152),d=i(25261),u=i(57864),p=i(52587),f=i(96608),g=i(64055);function m(e,t,i){let r,o;let n=e.size,s=p.getEncodedBits(t,i);for(r=0;r<15;r++)o=(s>>r&1)==1,r<6?e.set(r,8,o,!0):r<8?e.set(r+1,8,o,!0):e.set(n-15+r,8,o,!0),r<8?e.set(8,n-r-1,o,!0):r<9?e.set(8,15-r-1+1,o,!0):e.set(8,15-r-1,o,!0);e.set(n-8,8,1,!0)}t.create=function(e,t){let i,p;if(void 0===e||""===e)throw Error("No input text");let w=o.M;return void 0!==t&&(w=o.from(t.errorCorrectionLevel,o.M),i=u.from(t.version),p=c.from(t.maskPattern),t.toSJISFunc&&r.setToSJISFunction(t.toSJISFunc)),function(e,t,i,o){let p;if(Array.isArray(e))p=g.fromArray(e);else if("string"==typeof e){let r=t;if(!r){let t=g.rawSplit(e);r=u.getBestVersionForData(t,i)}p=g.fromString(e,r||40)}else throw Error("Invalid data");let w=u.getBestVersionForData(p,i);if(!w)throw Error("The amount of data is too big to be stored in a QR Code");if(t){if(t<w)throw Error("\nThe chosen QR Code version cannot contain this amount of data.\nMinimum version required to store current data is: "+w+".\n")}else t=w;let b=function(e,t,i){let o=new n;i.forEach(function(t){o.put(t.mode.bit,4),o.put(t.getLength(),f.getCharCountIndicator(t.mode,e)),t.write(o)});let s=(r.getSymbolTotalCodewords(e)-h.getTotalCodewordsCount(e,t))*8;for(o.getLengthInBits()+4<=s&&o.put(0,4);o.getLengthInBits()%8!=0;)o.putBit(0);let l=(s-o.getLengthInBits())/8;for(let e=0;e<l;e++)o.put(e%2?17:236,8);return function(e,t,i){let o,n;let s=r.getSymbolTotalCodewords(t),l=s-h.getTotalCodewordsCount(t,i),a=h.getBlocksCount(t,i),c=s%a,u=a-c,p=Math.floor(s/a),f=Math.floor(l/a),g=f+1,m=p-f,w=new d(m),b=0,y=Array(a),C=Array(a),v=0,x=new Uint8Array(e.buffer);for(let e=0;e<a;e++){let t=e<u?f:g;y[e]=x.slice(b,b+t),C[e]=w.encode(y[e]),b+=t,v=Math.max(v,t)}let _=new Uint8Array(s),E=0;for(o=0;o<v;o++)for(n=0;n<a;n++)o<y[n].length&&(_[E++]=y[n][o]);for(o=0;o<m;o++)for(n=0;n<a;n++)_[E++]=C[n][o];return _}(o,e,t)}(t,i,p),y=new s(r.getSymbolSize(t));return function(e,t){let i=e.size,r=a.getPositions(t);for(let t=0;t<r.length;t++){let o=r[t][0],n=r[t][1];for(let t=-1;t<=7;t++)if(!(o+t<=-1)&&!(i<=o+t))for(let r=-1;r<=7;r++)n+r<=-1||i<=n+r||(t>=0&&t<=6&&(0===r||6===r)||r>=0&&r<=6&&(0===t||6===t)||t>=2&&t<=4&&r>=2&&r<=4?e.set(o+t,n+r,!0,!0):e.set(o+t,n+r,!1,!0))}}(y,t),function(e){let t=e.size;for(let i=8;i<t-8;i++){let t=i%2==0;e.set(i,6,t,!0),e.set(6,i,t,!0)}}(y),function(e,t){let i=l.getPositions(t);for(let t=0;t<i.length;t++){let r=i[t][0],o=i[t][1];for(let t=-2;t<=2;t++)for(let i=-2;i<=2;i++)-2===t||2===t||-2===i||2===i||0===t&&0===i?e.set(r+t,o+i,!0,!0):e.set(r+t,o+i,!1,!0)}}(y,t),m(y,i,0),t>=7&&function(e,t){let i,r,o;let n=e.size,s=u.getEncodedBits(t);for(let t=0;t<18;t++)i=Math.floor(t/3),r=t%3+n-8-3,o=(s>>t&1)==1,e.set(i,r,o,!0),e.set(r,i,o,!0)}(y,t),function(e,t){let i=e.size,r=-1,o=i-1,n=7,s=0;for(let l=i-1;l>0;l-=2)for(6===l&&l--;;){for(let i=0;i<2;i++)if(!e.isReserved(o,l-i)){let r=!1;s<t.length&&(r=(t[s]>>>n&1)==1),e.set(o,l-i,r),-1==--n&&(s++,n=7)}if((o+=r)<0||i<=o){o-=r,r=-r;break}}}(y,b),isNaN(o)&&(o=c.getBestMask(y,m.bind(null,y,i))),c.applyMask(o,y),m(y,i,o),{modules:y,version:t,errorCorrectionLevel:i,maskPattern:o,segments:p}}(e,i,w,p)}},25261:(e,t,i)=>{let r=i(31073);function o(e){this.genPoly=void 0,this.degree=e,this.degree&&this.initialize(this.degree)}o.prototype.initialize=function(e){this.degree=e,this.genPoly=r.generateECPolynomial(this.degree)},o.prototype.encode=function(e){if(!this.genPoly)throw Error("Encoder not initialized");let t=new Uint8Array(e.length+this.degree);t.set(e);let i=r.mod(t,this.genPoly),o=this.degree-i.length;if(o>0){let e=new Uint8Array(this.degree);return e.set(i,o),e}return i},e.exports=o},69721:(e,t)=>{let i="[0-9]+",r="(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+",o="(?:(?![A-Z0-9 $%*+\\-./:]|"+(r=r.replace(/u/g,"\\u"))+")(?:.|[\r\n]))+";t.KANJI=RegExp(r,"g"),t.BYTE_KANJI=RegExp("[^A-Z0-9 $%*+\\-./:]+","g"),t.BYTE=RegExp(o,"g"),t.NUMERIC=RegExp(i,"g"),t.ALPHANUMERIC=RegExp("[A-Z $%*+\\-./:]+","g");let n=RegExp("^"+r+"$"),s=RegExp("^"+i+"$"),l=RegExp("^[A-Z0-9 $%*+\\-./:]+$");t.testKanji=function(e){return n.test(e)},t.testNumeric=function(e){return s.test(e)},t.testAlphanumeric=function(e){return l.test(e)}},64055:(e,t,i)=>{let r=i(96608),o=i(1852),n=i(41074),s=i(43143),l=i(27022),a=i(69721),c=i(14778),h=i(9724);function d(e){return unescape(encodeURIComponent(e)).length}function u(e,t,i){let r;let o=[];for(;null!==(r=e.exec(i));)o.push({data:r[0],index:r.index,mode:t,length:r[0].length});return o}function p(e){let t,i;let o=u(a.NUMERIC,r.NUMERIC,e),n=u(a.ALPHANUMERIC,r.ALPHANUMERIC,e);return c.isKanjiModeEnabled()?(t=u(a.BYTE,r.BYTE,e),i=u(a.KANJI,r.KANJI,e)):(t=u(a.BYTE_KANJI,r.BYTE,e),i=[]),o.concat(n,t,i).sort(function(e,t){return e.index-t.index}).map(function(e){return{data:e.data,mode:e.mode,length:e.length}})}function f(e,t){switch(t){case r.NUMERIC:return o.getBitsLength(e);case r.ALPHANUMERIC:return n.getBitsLength(e);case r.KANJI:return l.getBitsLength(e);case r.BYTE:return s.getBitsLength(e)}}function g(e,t){let i;let a=r.getBestModeForData(e);if((i=r.from(t,a))!==r.BYTE&&i.bit<a.bit)throw Error('"'+e+'" cannot be encoded with mode '+r.toString(i)+".\n Suggested mode is: "+r.toString(a));switch(i!==r.KANJI||c.isKanjiModeEnabled()||(i=r.BYTE),i){case r.NUMERIC:return new o(e);case r.ALPHANUMERIC:return new n(e);case r.KANJI:return new l(e);case r.BYTE:return new s(e)}}t.fromArray=function(e){return e.reduce(function(e,t){return"string"==typeof t?e.push(g(t,null)):t.data&&e.push(g(t.data,t.mode)),e},[])},t.fromString=function(e,i){let o=function(e,t){let i={},o={start:{}},n=["start"];for(let s=0;s<e.length;s++){let l=e[s],a=[];for(let e=0;e<l.length;e++){let c=l[e],h=""+s+e;a.push(h),i[h]={node:c,lastCount:0},o[h]={};for(let e=0;e<n.length;e++){let s=n[e];i[s]&&i[s].node.mode===c.mode?(o[s][h]=f(i[s].lastCount+c.length,c.mode)-f(i[s].lastCount,c.mode),i[s].lastCount+=c.length):(i[s]&&(i[s].lastCount=c.length),o[s][h]=f(c.length,c.mode)+4+r.getCharCountIndicator(c.mode,t))}}n=a}for(let e=0;e<n.length;e++)o[n[e]].end=0;return{map:o,table:i}}(function(e){let t=[];for(let i=0;i<e.length;i++){let o=e[i];switch(o.mode){case r.NUMERIC:t.push([o,{data:o.data,mode:r.ALPHANUMERIC,length:o.length},{data:o.data,mode:r.BYTE,length:o.length}]);break;case r.ALPHANUMERIC:t.push([o,{data:o.data,mode:r.BYTE,length:o.length}]);break;case r.KANJI:t.push([o,{data:o.data,mode:r.BYTE,length:d(o.data)}]);break;case r.BYTE:t.push([{data:o.data,mode:r.BYTE,length:d(o.data)}])}}return t}(p(e,c.isKanjiModeEnabled())),i),n=h.find_path(o.map,"start","end"),s=[];for(let e=1;e<n.length-1;e++)s.push(o.table[n[e]].node);return t.fromArray(s.reduce(function(e,t){let i=e.length-1>=0?e[e.length-1]:null;return i&&i.mode===t.mode?e[e.length-1].data+=t.data:e.push(t),e},[]))},t.rawSplit=function(e){return t.fromArray(p(e,c.isKanjiModeEnabled()))}},14778:(e,t)=>{let i;let r=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];t.getSymbolSize=function(e){if(!e)throw Error('"version" cannot be null or undefined');if(e<1||e>40)throw Error('"version" should be in range from 1 to 40');return 4*e+17},t.getSymbolTotalCodewords=function(e){return r[e]},t.getBCHDigit=function(e){let t=0;for(;0!==e;)t++,e>>>=1;return t},t.setToSJISFunction=function(e){if("function"!=typeof e)throw Error('"toSJISFunc" is not a valid function.');i=e},t.isKanjiModeEnabled=function(){return void 0!==i},t.toSJIS=function(e){return i(e)}},40732:(e,t)=>{t.isValid=function(e){return!isNaN(e)&&e>=1&&e<=40}},57864:(e,t,i)=>{let r=i(14778),o=i(65152),n=i(55958),s=i(96608),l=i(40732),a=r.getBCHDigit(7973);function c(e,t){return s.getCharCountIndicator(e,t)+4}t.from=function(e,t){return l.isValid(e)?parseInt(e,10):t},t.getCapacity=function(e,t,i){if(!l.isValid(e))throw Error("Invalid QR Code version");void 0===i&&(i=s.BYTE);let n=(r.getSymbolTotalCodewords(e)-o.getTotalCodewordsCount(e,t))*8;if(i===s.MIXED)return n;let a=n-c(i,e);switch(i){case s.NUMERIC:return Math.floor(a/10*3);case s.ALPHANUMERIC:return Math.floor(a/11*2);case s.KANJI:return Math.floor(a/13);case s.BYTE:default:return Math.floor(a/8)}},t.getBestVersionForData=function(e,i){let r;let o=n.from(i,n.M);if(Array.isArray(e)){if(e.length>1)return function(e,i){for(let r=1;r<=40;r++)if(function(e,t){let i=0;return e.forEach(function(e){let r=c(e.mode,t);i+=r+e.getBitsLength()}),i}(e,r)<=t.getCapacity(r,i,s.MIXED))return r}(e,o);if(0===e.length)return 1;r=e[0]}else r=e;return function(e,i,r){for(let o=1;o<=40;o++)if(i<=t.getCapacity(o,r,e))return o}(r.mode,r.getLength(),o)},t.getEncodedBits=function(e){if(!l.isValid(e)||e<7)throw Error("Invalid QR Code version");let t=e<<12;for(;r.getBCHDigit(t)-a>=0;)t^=7973<<r.getBCHDigit(t)-a;return e<<12|t}},88253:(e,t,i)=>{"use strict";e.exports=i(66758)},65829:(e,t,i)=>{let r=i(30348);t.render=function(e,t,i){var o;let n=i,s=t;void 0!==n||t&&t.getContext||(n=t,t=void 0),t||(s=function(){try{return document.createElement("canvas")}catch(e){throw Error("You need to specify a canvas element")}}()),n=r.getOptions(n);let l=r.getImageWidth(e.modules.size,n),a=s.getContext("2d"),c=a.createImageData(l,l);return r.qrToImageData(c.data,e,n),o=s,a.clearRect(0,0,o.width,o.height),o.style||(o.style={}),o.height=l,o.width=l,o.style.height=l+"px",o.style.width=l+"px",a.putImageData(c,0,0),s},t.renderToDataURL=function(e,i,r){let o=r;void 0!==o||i&&i.getContext||(o=i,i=void 0),o||(o={});let n=t.render(e,i,o),s=o.type||"image/png",l=o.rendererOpts||{};return n.toDataURL(s,l.quality)}},14551:(e,t,i)=>{let r=i(92048),o=i(28202).y,n=i(30348);t.render=function(e,t){let i=n.getOptions(t),r=i.rendererOpts,s=n.getImageWidth(e.modules.size,i);r.width=s,r.height=s;let l=new o(r);return n.qrToImageData(l.data,e,i),l},t.renderToDataURL=function(e,i,r){void 0===r&&(r=i,i=void 0),t.renderToBuffer(e,i,function(e,t){e&&r(e);let i="data:image/png;base64,";i+=t.toString("base64"),r(null,i)})},t.renderToBuffer=function(e,i,r){void 0===r&&(r=i,i=void 0);let o=t.render(e,i),n=[];o.on("error",r),o.on("data",function(e){n.push(e)}),o.on("end",function(){r(null,Buffer.concat(n))}),o.pack()},t.renderToFile=function(e,i,o,n){void 0===n&&(n=o,o=void 0);let s=!1,l=(...e)=>{s||(s=!0,n.apply(null,e))},a=r.createWriteStream(e);a.on("error",l),a.on("close",l),t.renderToFileStream(a,i,o)},t.renderToFileStream=function(e,i,r){t.render(i,r).pack().pipe(e)}},99888:(e,t,i)=>{let r=i(30348);function o(e,t){let i=e.a/255,r=t+'="'+e.hex+'"';return i<1?r+" "+t+'-opacity="'+i.toFixed(2).slice(1)+'"':r}function n(e,t,i){let r=e+t;return void 0!==i&&(r+=" "+i),r}t.render=function(e,t,i){let s=r.getOptions(t),l=e.modules.size,a=e.modules.data,c=l+2*s.margin,h=s.color.light.a?"<path "+o(s.color.light,"fill")+' d="M0 0h'+c+"v"+c+'H0z"/>':"",d="<path "+o(s.color.dark,"stroke")+' d="'+function(e,t,i){let r="",o=0,s=!1,l=0;for(let a=0;a<e.length;a++){let c=Math.floor(a%t),h=Math.floor(a/t);c||s||(s=!0),e[a]?(l++,a>0&&c>0&&e[a-1]||(r+=s?n("M",c+i,.5+h+i):n("m",o,0),o=0,s=!1),c+1<t&&e[a+1]||(r+=n("h",l),l=0)):o++}return r}(a,l,s.margin)+'"/>',u='<svg xmlns="http://www.w3.org/2000/svg" '+(s.width?'width="'+s.width+'" height="'+s.width+'" ':"")+('viewBox="0 0 '+c)+" "+c+'" shape-rendering="crispEdges">'+h+d+"</svg>\n";return"function"==typeof i&&i(null,u),u}},53077:(e,t,i)=>{let r=i(99888);t.render=r.render,t.renderToFile=function(e,r,o,n){void 0===n&&(n=o,o=void 0);let s=i(92048),l=t.render(r,o);s.writeFile(e,'<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'+l,n)}},81626:(e,t,i)=>{let r=i(7115),o=i(68640);t.render=function(e,t,i){return t&&t.small?o.render(e,t,i):r.render(e,t,i)}},68640:(e,t)=>{let i="\x1b[37m",r="\x1b[30m",o="\x1b[0m",n="\x1b[47m"+r,s="\x1b[40m"+i,l=function(e,t,i,r){let o=t+1;return i>=o||r>=o||r<-1||i<-1?"0":i>=t||r>=t||r<0||i<0?"1":e[r*t+i]?"2":"1"},a=function(e,t,i,r){return l(e,t,i,r)+l(e,t,i,r+1)};t.render=function(e,t,l){var c,h;let d=e.modules.size,u=e.modules.data,p=!!(t&&t.inverse),f=t&&t.inverse?s:n,g={"00":o+" "+f,"01":o+(c=p?r:i)+"▄"+f,"02":o+(h=p?i:r)+"▄"+f,10:o+c+"▀"+f,11:" ",12:"▄",20:o+h+"▀"+f,21:"▀",22:"█"},m=o+"\n"+f,w=f;for(let e=-1;e<d+1;e+=2){for(let t=-1;t<d;t++)w+=g[a(u,d,t,e)];w+=g[a(u,d,d,e)]+m}return w+=o,"function"==typeof l&&l(null,w),w}},7115:(e,t)=>{t.render=function(e,t,i){let r=e.modules.size,o=e.modules.data,n="\x1b[47m  \x1b[0m",s="",l=Array(r+3).join(n),a=[,,].join(n);s+=l+"\n";for(let e=0;e<r;++e){s+=n;for(let t=0;t<r;t++)s+=o[e*r+t]?"\x1b[40m  \x1b[0m":n;s+=a+"\n"}return s+=l+"\n","function"==typeof i&&i(null,s),s}},41320:(e,t,i)=>{let r=i(30348),o={WW:" ",WB:"▄",BB:"█",BW:"▀"},n={BB:" ",BW:"▄",WW:"█",WB:"▀"};t.render=function(e,t,i){let s=r.getOptions(t),l=o;("#ffffff"===s.color.dark.hex||"#000000"===s.color.light.hex)&&(l=n);let a=e.modules.size,c=e.modules.data,h="",d=Array(a+2*s.margin+1).join(l.WW);d=Array(s.margin/2+1).join(d+"\n");let u=Array(s.margin+1).join(l.WW);h+=d;for(let e=0;e<a;e+=2){h+=u;for(let t=0;t<a;t++){var p;let i=c[e*a+t],r=c[(e+1)*a+t];h+=(p=l,i&&r?p.BB:i&&!r?p.BW:!i&&r?p.WB:p.WW)}h+=u+"\n"}return h+=d.slice(0,-1),"function"==typeof i&&i(null,h),h},t.renderToFile=function(e,r,o,n){void 0===n&&(n=o,o=void 0);let s=i(92048),l=t.render(r,o);s.writeFile(e,l,n)}},30348:(e,t)=>{function i(e){if("number"==typeof e&&(e=e.toString()),"string"!=typeof e)throw Error("Color should be defined as hex string");let t=e.slice().replace("#","").split("");if(t.length<3||5===t.length||t.length>8)throw Error("Invalid hex color: "+e);(3===t.length||4===t.length)&&(t=Array.prototype.concat.apply([],t.map(function(e){return[e,e]}))),6===t.length&&t.push("F","F");let i=parseInt(t.join(""),16);return{r:i>>24&255,g:i>>16&255,b:i>>8&255,a:255&i,hex:"#"+t.slice(0,6).join("")}}t.getOptions=function(e){e||(e={}),e.color||(e.color={});let t=void 0===e.margin||null===e.margin||e.margin<0?4:e.margin,r=e.width&&e.width>=21?e.width:void 0,o=e.scale||4;return{width:r,scale:r?4:o,margin:t,color:{dark:i(e.color.dark||"#000000ff"),light:i(e.color.light||"#ffffffff")},type:e.type,rendererOpts:e.rendererOpts||{}}},t.getScale=function(e,t){return t.width&&t.width>=e+2*t.margin?t.width/(e+2*t.margin):t.scale},t.getImageWidth=function(e,i){let r=t.getScale(e,i);return Math.floor((e+2*i.margin)*r)},t.qrToImageData=function(e,i,r){let o=i.modules.size,n=i.modules.data,s=t.getScale(o,r),l=Math.floor((o+2*r.margin)*s),a=r.margin*s,c=[r.color.light,r.color.dark];for(let t=0;t<l;t++)for(let i=0;i<l;i++){let h=(t*l+i)*4,d=r.color.light;t>=a&&i>=a&&t<l-a&&i<l-a&&(d=c[n[Math.floor((t-a)/s)*o+Math.floor((i-a)/s)]?1:0]),e[h++]=d.r,e[h++]=d.g,e[h++]=d.b,e[h]=d.a}}},66758:(e,t,i)=>{let r=i(10426),o=i(94837),n=i(14551),s=i(41320),l=i(81626),a=i(53077);function c(e,t,i){if(void 0===e)throw Error("String required as first argument");if(void 0===i&&(i=t,t={}),"function"!=typeof i){if(r())t=i||{},i=null;else throw Error("Callback required as last argument")}return{opts:t,cb:i}}function h(e){switch(e){case"svg":return a;case"txt":case"utf8":return s;default:return n}}function d(e,t,i){if(!i.cb)return new Promise(function(r,n){try{let s=o.create(t,i.opts);return e(s,i.opts,function(e,t){return e?n(e):r(t)})}catch(e){n(e)}});try{let r=o.create(t,i.opts);return e(r,i.opts,i.cb)}catch(e){i.cb(e)}}t.create=o.create,t.toCanvas=i(68937).toCanvas,t.toString=function(e,t,i){let r=c(e,t,i);return d(function(e){switch(e){case"svg":return a;case"terminal":return l;default:return s}}(r.opts?r.opts.type:void 0).render,e,r)},t.toDataURL=function(e,t,i){let r=c(e,t,i);return d(h(r.opts.type).renderToDataURL,e,r)},t.toBuffer=function(e,t,i){let r=c(e,t,i);return d(h(r.opts.type).renderToBuffer,e,r)},t.toFile=function(e,t,i,o){if("string"!=typeof e||!("string"==typeof t||"object"==typeof t))throw Error("Invalid argument");if(arguments.length<3&&!r())throw Error("Too few arguments provided");let n=c(t,i,o);return d(h(n.opts.type||e.slice((e.lastIndexOf(".")-1>>>0)+2).toLowerCase()).renderToFile.bind(null,e),t,n)},t.toFileStream=function(e,t,i){if(arguments.length<2)throw Error("Too few arguments provided");let r=c(t,i,e.emit.bind(e,"error"));d(h("png").renderToFileStream.bind(null,e),t,r)}},74953:(e,t,i)=>{"use strict";i.r(t),i.d(t,{W3mAllWalletsView:()=>td,W3mConnectingWcBasicView:()=>eR,W3mDownloadsView:()=>tg});var r=i(2288),o=i(62651),n=i(98420),s=i(99067),l=i(72041),a=i(17099),c=i(83644);i(33142);var h=i(61667),d=i(77170),u=i(40666),p=i(24261),f=i(10665),g=i(42618);i(72505);var m=function(e,t,i,r){var o,n=arguments.length,s=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(o=e[l])&&(s=(n<3?o(s):n>3?o(t,i,s):o(t,i))||s);return n>3&&s&&Object.defineProperty(t,i,s),s};let w=class extends r.oi{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=u.ConnectorController.state.connectors,this.count=l.ApiController.state.count,this.filteredCount=l.ApiController.state.filteredWallets.length,this.isFetchingRecommendedWallets=l.ApiController.state.isFetchingRecommendedWallets,this.unsubscribe.push(u.ConnectorController.subscribeKey("connectors",e=>this.connectors=e),l.ApiController.subscribeKey("count",e=>this.count=e),l.ApiController.subscribeKey("filteredWallets",e=>this.filteredCount=e.length),l.ApiController.subscribeKey("isFetchingRecommendedWallets",e=>this.isFetchingRecommendedWallets=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=this.connectors.find(e=>"walletConnect"===e.id),{allWallets:t}=s.OptionsController.state;if(!e||"HIDE"===t||"ONLY_MOBILE"===t&&!n.j.isMobile())return null;let i=l.ApiController.state.featured.length,o=this.count+i,a=this.filteredCount>0?this.filteredCount:o<10?o:10*Math.floor(o/10),c=`${a}`;this.filteredCount>0?c=`${this.filteredCount}`:a<o&&(c=`${a}+`);let u=p.ConnectionController.hasAnyConnection(d.b.CONNECTOR_ID.WALLET_CONNECT);return(0,r.dy)`
      <wui-list-wallet
        name="Search Wallet"
        walletIcon="search"
        showAllWallets
        @click=${this.onAllWallets.bind(this)}
        tagLabel=${c}
        tagVariant="info"
        data-testid="all-wallets"
        tabIdx=${(0,h.o)(this.tabIdx)}
        .loading=${this.isFetchingRecommendedWallets}
        ?disabled=${u}
        size="sm"
      ></wui-list-wallet>
    `}onAllWallets(){f.X.sendEvent({type:"track",event:"CLICK_ALL_WALLETS"}),g.RouterController.push("AllWallets",{redirectView:g.RouterController.state.data?.redirectView})}};m([(0,o.Cb)()],w.prototype,"tabIdx",void 0),m([(0,o.SB)()],w.prototype,"connectors",void 0),m([(0,o.SB)()],w.prototype,"count",void 0),m([(0,o.SB)()],w.prototype,"filteredCount",void 0),m([(0,o.SB)()],w.prototype,"isFetchingRecommendedWallets",void 0),w=m([(0,c.Mo)("w3m-all-wallets-widget")],w);var b=i(80135),y=i(17565),C=i(16490),v=i(7734);let x=(0,c.iv)`
  :host {
    margin-top: ${({spacing:e})=>e["1"]};
  }
  wui-separator {
    margin: ${({spacing:e})=>e["3"]} calc(${({spacing:e})=>e["3"]} * -1)
      ${({spacing:e})=>e["2"]} calc(${({spacing:e})=>e["3"]} * -1);
    width: calc(100% + ${({spacing:e})=>e["3"]} * 2);
  }
`;var _=function(e,t,i,r){var o,n=arguments.length,s=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(o=e[l])&&(s=(n<3?o(s):n>3?o(t,i,s):o(t,i))||s);return n>3&&s&&Object.defineProperty(t,i,s),s};let E=class extends r.oi{constructor(){super(),this.unsubscribe=[],this.connectors=u.ConnectorController.state.connectors,this.recommended=l.ApiController.state.recommended,this.featured=l.ApiController.state.featured,this.explorerWallets=l.ApiController.state.explorerWallets,this.connections=p.ConnectionController.state.connections,this.connectorImages=b.W.state.connectorImages,this.loadingTelegram=!1,this.unsubscribe.push(u.ConnectorController.subscribeKey("connectors",e=>this.connectors=e),p.ConnectionController.subscribeKey("connections",e=>this.connections=e),b.W.subscribeKey("connectorImages",e=>this.connectorImages=e),l.ApiController.subscribeKey("recommended",e=>this.recommended=e),l.ApiController.subscribeKey("featured",e=>this.featured=e),l.ApiController.subscribeKey("explorerFilteredWallets",e=>{this.explorerWallets=e?.length?e:l.ApiController.state.explorerWallets}),l.ApiController.subscribeKey("explorerWallets",e=>{this.explorerWallets?.length||(this.explorerWallets=e)})),n.j.isTelegram()&&n.j.isIos()&&(this.loadingTelegram=!p.ConnectionController.state.wcUri,this.unsubscribe.push(p.ConnectionController.subscribeKey("wcUri",e=>this.loadingTelegram=!e)))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return(0,r.dy)`
      <wui-flex flexDirection="column" gap="2"> ${this.connectorListTemplate()} </wui-flex>
    `}mapConnectorsToExplorerWallets(e,t){return e.map(e=>{if("MULTI_CHAIN"===e.type&&e.connectors){let i=e.connectors.map(e=>e.id),r=e.connectors.map(e=>e.name),o=e.connectors.map(e=>e.info?.rdns),n=t?.find(e=>i.includes(e.id)||r.includes(e.name)||e.rdns&&(o.includes(e.rdns)||i.includes(e.rdns)));return e.explorerWallet=n??e.explorerWallet,e}let i=t?.find(t=>t.id===e.id||t.rdns===e.info?.rdns||t.name===e.name);return e.explorerWallet=i??e.explorerWallet,e})}processConnectorsByType(e,t=!0){let i=v.C.sortConnectorsByExplorerWallet([...e]);return t?i.filter(v.C.showConnector):i}connectorListTemplate(){let e=this.mapConnectorsToExplorerWallets(this.connectors,this.explorerWallets??[]),t=v.C.getConnectorsByType(e,this.recommended,this.featured),i=this.processConnectorsByType(t.announced.filter(e=>"walletConnect"!==e.id)),r=this.processConnectorsByType(t.injected),o=this.processConnectorsByType(t.multiChain.filter(e=>"WalletConnect"!==e.name),!1),s=t.custom,l=t.recent,a=this.processConnectorsByType(t.external.filter(e=>e.id!==d.b.CONNECTOR_ID.COINBASE_SDK)),c=t.recommended,h=t.featured,u=v.C.getConnectorTypeOrder({custom:s,recent:l,announced:i,injected:r,multiChain:o,recommended:c,featured:h,external:a}),p=this.connectors.find(e=>"walletConnect"===e.id),f=n.j.isMobile(),g=[];for(let e of u)switch(e){case"walletConnect":!f&&p&&g.push({kind:"connector",subtype:"walletConnect",connector:p});break;case"recent":v.C.getFilteredRecentWallets().forEach(e=>g.push({kind:"wallet",subtype:"recent",wallet:e}));break;case"injected":o.forEach(e=>g.push({kind:"connector",subtype:"multiChain",connector:e})),i.forEach(e=>g.push({kind:"connector",subtype:"announced",connector:e})),r.forEach(e=>g.push({kind:"connector",subtype:"injected",connector:e}));break;case"featured":h.forEach(e=>g.push({kind:"wallet",subtype:"featured",wallet:e}));break;case"custom":v.C.getFilteredCustomWallets(s??[]).forEach(e=>g.push({kind:"wallet",subtype:"custom",wallet:e}));break;case"external":a.forEach(e=>g.push({kind:"connector",subtype:"external",connector:e}));break;case"recommended":v.C.getCappedRecommendedWallets(c).forEach(e=>g.push({kind:"wallet",subtype:"recommended",wallet:e}));break;default:console.warn(`Unknown connector type: ${e}`)}return g.map((e,t)=>"connector"===e.kind?this.renderConnector(e,t):this.renderWallet(e,t))}renderConnector(e,t){let i,o;let n=e.connector,s=y.f.getConnectorImage(n)||this.connectorImages[n?.imageId??""],l=(this.connections.get(n.chain)??[]).some(e=>C.g.isLowerCaseMatch(e.connectorId,n.id));"multiChain"===e.subtype?(i="multichain",o="info"):"walletConnect"===e.subtype?(i="qr code",o="accent"):"injected"===e.subtype||"announced"===e.subtype?(i=l?"connected":"installed",o=l?"info":"success"):(i=void 0,o=void 0);let a=p.ConnectionController.hasAnyConnection(d.b.CONNECTOR_ID.WALLET_CONNECT),c=("walletConnect"===e.subtype||"external"===e.subtype)&&a;return(0,r.dy)`
      <w3m-list-wallet
        displayIndex=${t}
        imageSrc=${(0,h.o)(s)}
        .installed=${!0}
        name=${n.name??"Unknown"}
        .tagVariant=${o}
        tagLabel=${(0,h.o)(i)}
        data-testid=${`wallet-selector-${n.id.toLowerCase()}`}
        size="sm"
        @click=${()=>this.onClickConnector(e)}
        tabIdx=${(0,h.o)(this.tabIdx)}
        ?disabled=${c}
        rdnsId=${(0,h.o)(n.explorerWallet?.rdns||void 0)}
        walletRank=${(0,h.o)(n.explorerWallet?.order)}
      >
      </w3m-list-wallet>
    `}onClickConnector(e){let t=g.RouterController.state.data?.redirectView;if("walletConnect"===e.subtype){u.ConnectorController.setActiveConnector(e.connector),n.j.isMobile()?g.RouterController.push("AllWallets"):g.RouterController.push("ConnectingWalletConnect",{redirectView:t});return}if("multiChain"===e.subtype){u.ConnectorController.setActiveConnector(e.connector),g.RouterController.push("ConnectingMultiChain",{redirectView:t});return}if("injected"===e.subtype){u.ConnectorController.setActiveConnector(e.connector),g.RouterController.push("ConnectingExternal",{connector:e.connector,redirectView:t,wallet:e.connector.explorerWallet});return}if("announced"===e.subtype){if("walletConnect"===e.connector.id){n.j.isMobile()?g.RouterController.push("AllWallets"):g.RouterController.push("ConnectingWalletConnect",{redirectView:t});return}g.RouterController.push("ConnectingExternal",{connector:e.connector,redirectView:t,wallet:e.connector.explorerWallet});return}g.RouterController.push("ConnectingExternal",{connector:e.connector,redirectView:t})}renderWallet(e,t){let i=e.wallet,o=y.f.getWalletImage(i),n=p.ConnectionController.hasAnyConnection(d.b.CONNECTOR_ID.WALLET_CONNECT),s=this.loadingTelegram,l="recent"===e.subtype?"recent":void 0,a="recent"===e.subtype?"info":void 0;return(0,r.dy)`
      <w3m-list-wallet
        displayIndex=${t}
        imageSrc=${(0,h.o)(o)}
        name=${i.name??"Unknown"}
        @click=${()=>this.onClickWallet(e)}
        size="sm"
        data-testid=${`wallet-selector-${i.id}`}
        tabIdx=${(0,h.o)(this.tabIdx)}
        ?loading=${s}
        ?disabled=${n}
        rdnsId=${(0,h.o)(i.rdns||void 0)}
        walletRank=${(0,h.o)(i.order)}
        tagLabel=${(0,h.o)(l)}
        .tagVariant=${a}
      >
      </w3m-list-wallet>
    `}onClickWallet(e){let t=g.RouterController.state.data?.redirectView;if("featured"===e.subtype){u.ConnectorController.selectWalletConnector(e.wallet);return}if("recent"===e.subtype){if(this.loadingTelegram)return;u.ConnectorController.selectWalletConnector(e.wallet);return}if("custom"===e.subtype){if(this.loadingTelegram)return;g.RouterController.push("ConnectingWalletConnect",{wallet:e.wallet,redirectView:t});return}if(this.loadingTelegram)return;let i=u.ConnectorController.getConnector({id:e.wallet.id,rdns:e.wallet.rdns});i?g.RouterController.push("ConnectingExternal",{connector:i,redirectView:t}):g.RouterController.push("ConnectingWalletConnect",{wallet:e.wallet,redirectView:t})}};E.styles=x,_([(0,o.Cb)({type:Number})],E.prototype,"tabIdx",void 0),_([(0,o.SB)()],E.prototype,"connectors",void 0),_([(0,o.SB)()],E.prototype,"recommended",void 0),_([(0,o.SB)()],E.prototype,"featured",void 0),_([(0,o.SB)()],E.prototype,"explorerWallets",void 0),_([(0,o.SB)()],E.prototype,"connections",void 0),_([(0,o.SB)()],E.prototype,"connectorImages",void 0),_([(0,o.SB)()],E.prototype,"loadingTelegram",void 0),E=_([(0,c.Mo)("w3m-connector-list")],E);var $=i(51192),k=i(58665),R=i(86986),T=i(55303),I=i(12407),A=i(30984),P=i(42240),S=i(34866);i(22518),i(21828);var O=i(12128);let L=(0,O.iv)`
  :host {
    flex: 1;
    height: 100%;
  }

  button {
    width: 100%;
    height: 100%;
    display: inline-flex;
    align-items: center;
    padding: ${({spacing:e})=>e[1]} ${({spacing:e})=>e[2]};
    column-gap: ${({spacing:e})=>e[1]};
    color: ${({tokens:e})=>e.theme.textSecondary};
    border-radius: ${({borderRadius:e})=>e[20]};
    background-color: transparent;
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color;
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  button[data-active='true'] {
    color: ${({tokens:e})=>e.theme.textPrimary};
    background-color: ${({tokens:e})=>e.theme.foregroundTertiary};
  }

  button:hover:enabled:not([data-active='true']),
  button:active:enabled:not([data-active='true']) {
    wui-text,
    wui-icon {
      color: ${({tokens:e})=>e.theme.textPrimary};
    }
  }
`;var B=function(e,t,i,r){var o,n=arguments.length,s=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(o=e[l])&&(s=(n<3?o(s):n>3?o(t,i,s):o(t,i))||s);return n>3&&s&&Object.defineProperty(t,i,s),s};let M={lg:"lg-regular",md:"md-regular",sm:"sm-regular"},D={lg:"md",md:"sm",sm:"sm"},N=class extends r.oi{constructor(){super(...arguments),this.icon="mobile",this.size="md",this.label="",this.active=!1}render(){return(0,r.dy)`
      <button data-active=${this.active}>
        ${this.icon?(0,r.dy)`<wui-icon size=${D[this.size]} name=${this.icon}></wui-icon>`:""}
        <wui-text variant=${M[this.size]}> ${this.label} </wui-text>
      </button>
    `}};N.styles=[P.ET,P.ZM,L],B([(0,o.Cb)()],N.prototype,"icon",void 0),B([(0,o.Cb)()],N.prototype,"size",void 0),B([(0,o.Cb)()],N.prototype,"label",void 0),B([(0,o.Cb)({type:Boolean})],N.prototype,"active",void 0),N=B([(0,S.M)("wui-tab-item")],N);let j=(0,O.iv)`
  :host {
    display: inline-flex;
    align-items: center;
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    border-radius: ${({borderRadius:e})=>e[32]};
    padding: ${({spacing:e})=>e["01"]};
    box-sizing: border-box;
  }

  :host([data-size='sm']) {
    height: 26px;
  }

  :host([data-size='md']) {
    height: 36px;
  }
`;var W=function(e,t,i,r){var o,n=arguments.length,s=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(o=e[l])&&(s=(n<3?o(s):n>3?o(t,i,s):o(t,i))||s);return n>3&&s&&Object.defineProperty(t,i,s),s};let U=class extends r.oi{constructor(){super(...arguments),this.tabs=[],this.onTabChange=()=>null,this.size="md",this.activeTab=0}render(){return this.dataset.size=this.size,this.tabs.map((e,t)=>{let i=t===this.activeTab;return(0,r.dy)`
        <wui-tab-item
          @click=${()=>this.onTabClick(t)}
          icon=${e.icon}
          size=${this.size}
          label=${e.label}
          ?active=${i}
          data-active=${i}
          data-testid="tab-${e.label?.toLowerCase()}"
        ></wui-tab-item>
      `})}onTabClick(e){this.activeTab=e,this.onTabChange(e)}};U.styles=[P.ET,P.ZM,j],W([(0,o.Cb)({type:Array})],U.prototype,"tabs",void 0),W([(0,o.Cb)()],U.prototype,"onTabChange",void 0),W([(0,o.Cb)()],U.prototype,"size",void 0),W([(0,o.SB)()],U.prototype,"activeTab",void 0),U=W([(0,S.M)("wui-tabs")],U);var z=function(e,t,i,r){var o,n=arguments.length,s=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(o=e[l])&&(s=(n<3?o(s):n>3?o(t,i,s):o(t,i))||s);return n>3&&s&&Object.defineProperty(t,i,s),s};let H=class extends r.oi{constructor(){super(...arguments),this.platformTabs=[],this.unsubscribe=[],this.platforms=[],this.onSelectPlatfrom=void 0}disconnectCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=this.generateTabs();return(0,r.dy)`
      <wui-flex justifyContent="center" .padding=${["0","0","4","0"]}>
        <wui-tabs .tabs=${e} .onTabChange=${this.onTabChange.bind(this)}></wui-tabs>
      </wui-flex>
    `}generateTabs(){let e=this.platforms.map(e=>"browser"===e?{label:"Browser",icon:"extension",platform:"browser"}:"mobile"===e?{label:"Mobile",icon:"mobile",platform:"mobile"}:"qrcode"===e?{label:"Mobile",icon:"mobile",platform:"qrcode"}:"web"===e?{label:"Webapp",icon:"browser",platform:"web"}:"desktop"===e?{label:"Desktop",icon:"desktop",platform:"desktop"}:{label:"Browser",icon:"extension",platform:"unsupported"});return this.platformTabs=e.map(({platform:e})=>e),e}onTabChange(e){let t=this.platformTabs[e];t&&this.onSelectPlatfrom?.(t)}};z([(0,o.Cb)({type:Array})],H.prototype,"platforms",void 0),z([(0,o.Cb)()],H.prototype,"onSelectPlatfrom",void 0),H=z([(0,c.Mo)("w3m-connecting-header")],H);var F=i(76362);i(8607),i(25149),i(92095),i(36557);let Y=(0,O.iv)`
  :host {
    display: block;
    width: 100px;
    height: 100px;
  }

  svg {
    width: 100px;
    height: 100px;
  }

  rect {
    fill: none;
    stroke: ${e=>e.colors.accent100};
    stroke-width: 3px;
    stroke-linecap: round;
    animation: dash 1s linear infinite;
  }

  @keyframes dash {
    to {
      stroke-dashoffset: 0px;
    }
  }
`;var q=function(e,t,i,r){var o,n=arguments.length,s=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(o=e[l])&&(s=(n<3?o(s):n>3?o(t,i,s):o(t,i))||s);return n>3&&s&&Object.defineProperty(t,i,s),s};let G=class extends r.oi{constructor(){super(...arguments),this.radius=36}render(){return this.svgLoaderTemplate()}svgLoaderTemplate(){let e=this.radius>50?50:this.radius,t=36-e;return(0,r.dy)`
      <svg viewBox="0 0 110 110" width="110" height="110">
        <rect
          x="2"
          y="2"
          width="106"
          height="106"
          rx=${e}
          stroke-dasharray="${116+t} ${245+t}"
          stroke-dashoffset=${360+1.75*t}
        />
      </svg>
    `}};G.styles=[P.ET,Y],q([(0,o.Cb)({type:Number})],G.prototype,"radius",void 0),G=q([(0,S.M)("wui-loading-thumbnail")],G),i(26463),i(28658),i(33846),i(93676);let K=(0,O.iv)`
  wui-flex {
    width: 100%;
    height: 52px;
    box-sizing: border-box;
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[5]};
    padding-left: ${({spacing:e})=>e[3]};
    padding-right: ${({spacing:e})=>e[3]};
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${({spacing:e})=>e[6]};
  }

  wui-text {
    color: ${({tokens:e})=>e.theme.textSecondary};
  }

  wui-icon {
    width: 12px;
    height: 12px;
  }
`;var V=function(e,t,i,r){var o,n=arguments.length,s=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(o=e[l])&&(s=(n<3?o(s):n>3?o(t,i,s):o(t,i))||s);return n>3&&s&&Object.defineProperty(t,i,s),s};let X=class extends r.oi{constructor(){super(...arguments),this.disabled=!1,this.label="",this.buttonLabel=""}render(){return(0,r.dy)`
      <wui-flex justifyContent="space-between" alignItems="center">
        <wui-text variant="lg-regular" color="inherit">${this.label}</wui-text>
        <wui-button variant="accent-secondary" size="sm">
          ${this.buttonLabel}
          <wui-icon name="chevronRight" color="inherit" size="inherit" slot="iconRight"></wui-icon>
        </wui-button>
      </wui-flex>
    `}};X.styles=[P.ET,P.ZM,K],V([(0,o.Cb)({type:Boolean})],X.prototype,"disabled",void 0),V([(0,o.Cb)()],X.prototype,"label",void 0),V([(0,o.Cb)()],X.prototype,"buttonLabel",void 0),X=V([(0,S.M)("wui-cta-button")],X);let J=(0,c.iv)`
  :host {
    display: block;
    padding: 0 ${({spacing:e})=>e["5"]} ${({spacing:e})=>e["5"]};
  }
`;var Q=function(e,t,i,r){var o,n=arguments.length,s=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(o=e[l])&&(s=(n<3?o(s):n>3?o(t,i,s):o(t,i))||s);return n>3&&s&&Object.defineProperty(t,i,s),s};let Z=class extends r.oi{constructor(){super(...arguments),this.wallet=void 0}render(){if(!this.wallet)return this.style.display="none",null;let{name:e,app_store:t,play_store:i,chrome_store:o,homepage:s}=this.wallet,l=n.j.isMobile(),a=n.j.isIos(),h=n.j.isAndroid(),d=[t,i,s,o].filter(Boolean).length>1,u=c.Hg.getTruncateString({string:e,charsStart:12,charsEnd:0,truncate:"end"});return d&&!l?(0,r.dy)`
        <wui-cta-button
          label=${`Don't have ${u}?`}
          buttonLabel="Get"
          @click=${()=>g.RouterController.push("Downloads",{wallet:this.wallet})}
        ></wui-cta-button>
      `:!d&&s?(0,r.dy)`
        <wui-cta-button
          label=${`Don't have ${u}?`}
          buttonLabel="Get"
          @click=${this.onHomePage.bind(this)}
        ></wui-cta-button>
      `:t&&a?(0,r.dy)`
        <wui-cta-button
          label=${`Don't have ${u}?`}
          buttonLabel="Get"
          @click=${this.onAppStore.bind(this)}
        ></wui-cta-button>
      `:i&&h?(0,r.dy)`
        <wui-cta-button
          label=${`Don't have ${u}?`}
          buttonLabel="Get"
          @click=${this.onPlayStore.bind(this)}
        ></wui-cta-button>
      `:(this.style.display="none",null)}onAppStore(){this.wallet?.app_store&&n.j.openHref(this.wallet.app_store,"_blank")}onPlayStore(){this.wallet?.play_store&&n.j.openHref(this.wallet.play_store,"_blank")}onHomePage(){this.wallet?.homepage&&n.j.openHref(this.wallet.homepage,"_blank")}};Z.styles=[J],Q([(0,o.Cb)({type:Object})],Z.prototype,"wallet",void 0),Z=Q([(0,c.Mo)("w3m-mobile-download-links")],Z);let ee=(0,c.iv)`
  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(3px);
    }
    50% {
      transform: translateX(-3px);
    }
    75% {
      transform: translateX(3px);
    }
    100% {
      transform: translateX(0);
    }
  }

  wui-flex:first-child:not(:only-child) {
    position: relative;
  }

  wui-wallet-image {
    width: 56px;
    height: 56px;
  }

  wui-loading-thumbnail {
    position: absolute;
  }

  wui-icon-box {
    position: absolute;
    right: calc(${({spacing:e})=>e["1"]} * -1);
    bottom: calc(${({spacing:e})=>e["1"]} * -1);
    opacity: 0;
    transform: scale(0.5);
    transition-property: opacity, transform;
    transition-duration: ${({durations:e})=>e.lg};
    transition-timing-function: ${({easings:e})=>e["ease-out-power-2"]};
    will-change: opacity, transform;
  }

  wui-text[align='center'] {
    width: 100%;
    padding: 0px ${({spacing:e})=>e["4"]};
  }

  [data-error='true'] wui-icon-box {
    opacity: 1;
    transform: scale(1);
  }

  [data-error='true'] > wui-flex:first-child {
    animation: shake 250ms ${({easings:e})=>e["ease-out-power-2"]} both;
  }

  [data-retry='false'] wui-link {
    display: none;
  }

  [data-retry='true'] wui-link {
    display: block;
    opacity: 1;
  }

  w3m-mobile-download-links {
    padding: 0px;
    width: 100%;
  }
`;var et=function(e,t,i,r){var o,n=arguments.length,s=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(o=e[l])&&(s=(n<3?o(s):n>3?o(t,i,s):o(t,i))||s);return n>3&&s&&Object.defineProperty(t,i,s),s};class ei extends r.oi{constructor(){super(),this.wallet=g.RouterController.state.data?.wallet,this.connector=g.RouterController.state.data?.connector,this.timeout=void 0,this.secondaryBtnIcon="refresh",this.onConnect=void 0,this.onRender=void 0,this.onAutoConnect=void 0,this.isWalletConnect=!0,this.unsubscribe=[],this.imageSrc=y.f.getConnectorImage(this.connector)??y.f.getWalletImage(this.wallet),this.name=this.wallet?.name??this.connector?.name??"Wallet",this.isRetrying=!1,this.uri=p.ConnectionController.state.wcUri,this.error=p.ConnectionController.state.wcError,this.ready=!1,this.showRetry=!1,this.label=void 0,this.secondaryBtnLabel="Try again",this.secondaryLabel="Accept connection request in the wallet",this.isLoading=!1,this.isMobile=!1,this.onRetry=void 0,this.unsubscribe.push(p.ConnectionController.subscribeKey("wcUri",e=>{this.uri=e,this.isRetrying&&this.onRetry&&(this.isRetrying=!1,this.onConnect?.())}),p.ConnectionController.subscribeKey("wcError",e=>this.error=e)),(n.j.isTelegram()||n.j.isSafari())&&n.j.isIos()&&p.ConnectionController.state.wcUri&&this.onConnect?.()}firstUpdated(){this.onAutoConnect?.(),this.showRetry=!this.onAutoConnect}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),p.ConnectionController.setWcError(!1),clearTimeout(this.timeout)}render(){this.onRender?.(),this.onShowRetry();let e=this.error?"Connection can be declined if a previous request is still active":this.secondaryLabel,t="";return this.label?t=this.label:(t=`Continue in ${this.name}`,this.error&&(t="Connection declined")),(0,r.dy)`
      <wui-flex
        data-error=${(0,h.o)(this.error)}
        data-retry=${this.showRetry}
        flexDirection="column"
        alignItems="center"
        .padding=${["10","5","5","5"]}
        gap="6"
      >
        <wui-flex gap="2" justifyContent="center" alignItems="center">
          <wui-wallet-image size="lg" imageSrc=${(0,h.o)(this.imageSrc)}></wui-wallet-image>

          ${this.error?null:this.loaderTemplate()}

          <wui-icon-box
            color="error"
            icon="close"
            size="sm"
            border
            borderColor="wui-color-bg-125"
          ></wui-icon-box>
        </wui-flex>

        <wui-flex flexDirection="column" alignItems="center" gap="6"> <wui-flex
          flexDirection="column"
          alignItems="center"
          gap="2"
          .padding=${["2","0","0","0"]}
        >
          <wui-text align="center" variant="lg-medium" color=${this.error?"error":"primary"}>
            ${t}
          </wui-text>
          <wui-text align="center" variant="lg-regular" color="secondary">${e}</wui-text>
        </wui-flex>

        ${this.secondaryBtnLabel?(0,r.dy)`
                <wui-button
                  variant="neutral-secondary"
                  size="md"
                  ?disabled=${this.isRetrying||this.isLoading}
                  @click=${this.onTryAgain.bind(this)}
                  data-testid="w3m-connecting-widget-secondary-button"
                >
                  <wui-icon
                    color="inherit"
                    slot="iconLeft"
                    name=${this.secondaryBtnIcon}
                  ></wui-icon>
                  ${this.secondaryBtnLabel}
                </wui-button>
              `:null}
      </wui-flex>

      ${this.isWalletConnect?(0,r.dy)`
              <wui-flex .padding=${["0","5","5","5"]} justifyContent="center">
                <wui-link
                  @click=${this.onCopyUri}
                  variant="secondary"
                  icon="copy"
                  data-testid="wui-link-copy"
                >
                  Copy link
                </wui-link>
              </wui-flex>
            `:null}

      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links></wui-flex>
      </wui-flex>
    `}onShowRetry(){if(this.error&&!this.showRetry){this.showRetry=!0;let e=this.shadowRoot?.querySelector("wui-button");e?.animate([{opacity:0},{opacity:1}],{fill:"forwards",easing:"ease"})}}onTryAgain(){p.ConnectionController.setWcError(!1),this.onRetry?(this.isRetrying=!0,this.onRetry?.()):this.onConnect?.()}loaderTemplate(){let e=F.ThemeController.state.themeVariables["--w3m-border-radius-master"],t=e?parseInt(e.replace("px",""),10):4;return(0,r.dy)`<wui-loading-thumbnail radius=${9*t}></wui-loading-thumbnail>`}onCopyUri(){try{this.uri&&(n.j.copyToClopboard(this.uri),R.SnackController.showSuccess("Link copied"))}catch{R.SnackController.showError("Failed to copy")}}}ei.styles=ee,et([(0,o.SB)()],ei.prototype,"isRetrying",void 0),et([(0,o.SB)()],ei.prototype,"uri",void 0),et([(0,o.SB)()],ei.prototype,"error",void 0),et([(0,o.SB)()],ei.prototype,"ready",void 0),et([(0,o.SB)()],ei.prototype,"showRetry",void 0),et([(0,o.SB)()],ei.prototype,"label",void 0),et([(0,o.SB)()],ei.prototype,"secondaryBtnLabel",void 0),et([(0,o.SB)()],ei.prototype,"secondaryLabel",void 0),et([(0,o.SB)()],ei.prototype,"isLoading",void 0),et([(0,o.Cb)({type:Boolean})],ei.prototype,"isMobile",void 0),et([(0,o.Cb)()],ei.prototype,"onRetry",void 0);let er=class extends ei{constructor(){if(super(),!this.wallet)throw Error("w3m-connecting-wc-browser: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.onAutoConnect=this.onConnectProxy.bind(this),f.X.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"browser",displayIndex:this.wallet?.display_index,walletRank:this.wallet.order,view:g.RouterController.state.view}})}async onConnectProxy(){try{this.error=!1;let{connectors:e}=u.ConnectorController.state,t=e.find(e=>"ANNOUNCED"===e.type&&e.info?.rdns===this.wallet?.rdns||"INJECTED"===e.type||e.name===this.wallet?.name);if(t)await p.ConnectionController.connectExternal(t,t.chain);else throw Error("w3m-connecting-wc-browser: No connector found");T.I.close(),f.X.sendEvent({type:"track",event:"CONNECT_SUCCESS",properties:{method:"browser",name:this.wallet?.name||"Unknown",view:g.RouterController.state.view,walletRank:this.wallet?.order}})}catch(e){e instanceof I.g&&e.originalName===$.jD.PROVIDER_RPC_ERROR_NAME.USER_REJECTED_REQUEST?f.X.sendEvent({type:"track",event:"USER_REJECTED",properties:{message:e.message}}):f.X.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:e?.message??"Unknown"}}),this.error=!0}}};er=function(e,t,i,r){var o,n=arguments.length,s=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(o=e[l])&&(s=(n<3?o(s):n>3?o(t,i,s):o(t,i))||s);return n>3&&s&&Object.defineProperty(t,i,s),s}([(0,c.Mo)("w3m-connecting-wc-browser")],er);let eo=class extends ei{constructor(){if(super(),!this.wallet)throw Error("w3m-connecting-wc-desktop: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.onRender=this.onRenderProxy.bind(this),f.X.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"desktop",displayIndex:this.wallet?.display_index,walletRank:this.wallet.order,view:g.RouterController.state.view}})}onRenderProxy(){!this.ready&&this.uri&&(this.ready=!0,this.onConnect?.())}onConnectProxy(){if(this.wallet?.desktop_link&&this.uri)try{this.error=!1;let{desktop_link:e,name:t}=this.wallet,{redirect:i,href:r}=n.j.formatNativeUrl(e,this.uri);p.ConnectionController.setWcLinking({name:t,href:r}),p.ConnectionController.setRecentWallet(this.wallet),n.j.openHref(i,"_blank")}catch{this.error=!0}}};eo=function(e,t,i,r){var o,n=arguments.length,s=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(o=e[l])&&(s=(n<3?o(s):n>3?o(t,i,s):o(t,i))||s);return n>3&&s&&Object.defineProperty(t,i,s),s}([(0,c.Mo)("w3m-connecting-wc-desktop")],eo);var en=i(90249),es=function(e,t,i,r){var o,n=arguments.length,s=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(o=e[l])&&(s=(n<3?o(s):n>3?o(t,i,s):o(t,i))||s);return n>3&&s&&Object.defineProperty(t,i,s),s};let el=class extends ei{constructor(){if(super(),this.btnLabelTimeout=void 0,this.redirectDeeplink=void 0,this.redirectUniversalLink=void 0,this.target=void 0,this.preferUniversalLinks=s.OptionsController.state.experimental_preferUniversalLinks,this.isLoading=!0,this.onConnect=()=>{if(this.wallet?.mobile_link&&this.uri)try{this.error=!1;let{mobile_link:e,link_mode:t,name:i}=this.wallet,{redirect:r,redirectUniversalLink:o,href:s}=n.j.formatNativeUrl(e,this.uri,t);this.redirectDeeplink=r,this.redirectUniversalLink=o,this.target=n.j.isIframe()?"_top":"_self",p.ConnectionController.setWcLinking({name:i,href:s}),p.ConnectionController.setRecentWallet(this.wallet),this.preferUniversalLinks&&this.redirectUniversalLink?n.j.openHref(this.redirectUniversalLink,this.target):n.j.openHref(this.redirectDeeplink,this.target)}catch(e){f.X.sendEvent({type:"track",event:"CONNECT_PROXY_ERROR",properties:{message:e instanceof Error?e.message:"Error parsing the deeplink",uri:this.uri,mobile_link:this.wallet.mobile_link,name:this.wallet.name}}),this.error=!0}},!this.wallet)throw Error("w3m-connecting-wc-mobile: No wallet provided");this.secondaryBtnLabel="Open",this.secondaryLabel=en.bq.CONNECT_LABELS.MOBILE,this.secondaryBtnIcon="externalLink",this.onHandleURI(),this.unsubscribe.push(p.ConnectionController.subscribeKey("wcUri",()=>{this.onHandleURI()})),f.X.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"mobile",displayIndex:this.wallet?.display_index,walletRank:this.wallet.order,view:g.RouterController.state.view}})}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.btnLabelTimeout)}onHandleURI(){this.isLoading=!this.uri,!this.ready&&this.uri&&(this.ready=!0,this.onConnect?.())}onTryAgain(){p.ConnectionController.setWcError(!1),this.onConnect?.()}};es([(0,o.SB)()],el.prototype,"redirectDeeplink",void 0),es([(0,o.SB)()],el.prototype,"redirectUniversalLink",void 0),es([(0,o.SB)()],el.prototype,"target",void 0),es([(0,o.SB)()],el.prototype,"preferUniversalLinks",void 0),es([(0,o.SB)()],el.prototype,"isLoading",void 0),el=es([(0,c.Mo)("w3m-connecting-wc-mobile")],el),i(29837);var ea=i(88253);function ec(e,t,i){return e!==t&&(e-t<0?t-e:e-t)<=i+.1}let eh={generate({uri:e,size:t,logoSize:i,padding:o=8,dotColor:n="var(--apkt-colors-black)"}){let s=[],l=function(e,t){let i=Array.prototype.slice.call(ea.create(e,{errorCorrectionLevel:"Q"}).modules.data,0),r=Math.sqrt(i.length);return i.reduce((e,t,i)=>(i%r==0?e.push([t]):e[e.length-1].push(t))&&e,[])}(e,0),a=(t-2*o)/l.length,c=[{x:0,y:0},{x:1,y:0},{x:0,y:1}];c.forEach(({x:e,y:t})=>{let i=(l.length-7)*a*e+o,h=(l.length-7)*a*t+o;for(let e=0;e<c.length;e+=1){let t=a*(7-2*e);s.push((0,r.YP)`
            <rect
              fill=${2===e?"var(--apkt-colors-black)":"var(--apkt-colors-white)"}
              width=${0===e?t-10:t}
              rx= ${0===e?(t-10)*.45:.45*t}
              ry= ${0===e?(t-10)*.45:.45*t}
              stroke=${n}
              stroke-width=${0===e?10:0}
              height=${0===e?t-10:t}
              x= ${0===e?h+a*e+5:h+a*e}
              y= ${0===e?i+a*e+5:i+a*e}
            />
          `)}});let h=Math.floor((i+25)/a),d=l.length/2-h/2,u=l.length/2+h/2-1,p=[];l.forEach((e,t)=>{e.forEach((e,i)=>{!l[t][i]||t<7&&i<7||t>l.length-8&&i<7||t<7&&i>l.length-8||t>d&&t<u&&i>d&&i<u||p.push([t*a+a/2+o,i*a+a/2+o])})});let f={};return p.forEach(([e,t])=>{f[e]?f[e]?.push(t):f[e]=[t]}),Object.entries(f).map(([e,t])=>{let i=t.filter(e=>t.every(t=>!ec(e,t,a)));return[Number(e),i]}).forEach(([e,t])=>{t.forEach(t=>{s.push((0,r.YP)`<circle cx=${e} cy=${t} fill=${n} r=${a/2.5} />`)})}),Object.entries(f).filter(([e,t])=>t.length>1).map(([e,t])=>{let i=t.filter(e=>t.some(t=>ec(e,t,a)));return[Number(e),i]}).map(([e,t])=>{t.sort((e,t)=>e<t?-1:1);let i=[];for(let e of t){let t=i.find(t=>t.some(t=>ec(e,t,a)));t?t.push(e):i.push([e])}return[e,i.map(e=>[e[0],e[e.length-1]])]}).forEach(([e,t])=>{t.forEach(([t,i])=>{s.push((0,r.YP)`
              <line
                x1=${e}
                x2=${e}
                y1=${t}
                y2=${i}
                stroke=${n}
                stroke-width=${a/1.25}
                stroke-linecap="round"
              />
            `)})}),s}},ed=(0,O.iv)`
  :host {
    position: relative;
    user-select: none;
    display: block;
    overflow: hidden;
    aspect-ratio: 1 / 1;
    width: 100%;
    height: 100%;
    background-color: ${({colors:e})=>e.white};
    border: 1px solid ${({tokens:e})=>e.theme.borderPrimary};
  }

  :host {
    border-radius: ${({borderRadius:e})=>e[4]};
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :host([data-clear='true']) > wui-icon {
    display: none;
  }

  svg:first-child,
  wui-image,
  wui-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    box-shadow: inset 0 0 0 4px ${({tokens:e})=>e.theme.backgroundPrimary};
    border-radius: ${({borderRadius:e})=>e[6]};
  }

  wui-image {
    width: 25%;
    height: 25%;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  wui-icon {
    width: 100%;
    height: 100%;
    color: #3396ff !important;
    transform: translateY(-50%) translateX(-50%) scale(0.25);
  }

  wui-icon > svg {
    width: inherit;
    height: inherit;
  }
`;var eu=function(e,t,i,r){var o,n=arguments.length,s=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(o=e[l])&&(s=(n<3?o(s):n>3?o(t,i,s):o(t,i))||s);return n>3&&s&&Object.defineProperty(t,i,s),s};let ep=class extends r.oi{constructor(){super(...arguments),this.uri="",this.size=500,this.theme="dark",this.imageSrc=void 0,this.alt=void 0,this.arenaClear=void 0,this.farcaster=void 0}render(){return this.dataset.theme=this.theme,this.dataset.clear=String(this.arenaClear),(0,r.dy)`<wui-flex
      alignItems="center"
      justifyContent="center"
      class="wui-qr-code"
      direction="column"
      gap="4"
      width="100%"
      style="height: 100%"
    >
      ${this.templateVisual()} ${this.templateSvg()}
    </wui-flex>`}templateSvg(){return(0,r.YP)`
      <svg viewBox="0 0 ${this.size} ${this.size}" width="100%" height="100%">
        ${eh.generate({uri:this.uri,size:this.size,logoSize:this.arenaClear?0:this.size/4})}
      </svg>
    `}templateVisual(){return this.imageSrc?(0,r.dy)`<wui-image src=${this.imageSrc} alt=${this.alt??"logo"}></wui-image>`:this.farcaster?(0,r.dy)`<wui-icon
        class="farcaster"
        size="inherit"
        color="inherit"
        name="farcaster"
      ></wui-icon>`:(0,r.dy)`<wui-icon size="inherit" color="inherit" name="walletConnect"></wui-icon>`}};ep.styles=[P.ET,ed],eu([(0,o.Cb)()],ep.prototype,"uri",void 0),eu([(0,o.Cb)({type:Number})],ep.prototype,"size",void 0),eu([(0,o.Cb)()],ep.prototype,"theme",void 0),eu([(0,o.Cb)()],ep.prototype,"imageSrc",void 0),eu([(0,o.Cb)()],ep.prototype,"alt",void 0),eu([(0,o.Cb)({type:Boolean})],ep.prototype,"arenaClear",void 0),eu([(0,o.Cb)({type:Boolean})],ep.prototype,"farcaster",void 0),ep=eu([(0,S.M)("wui-qr-code")],ep);let ef=(0,O.iv)`
  :host {
    display: block;
    background: linear-gradient(
      90deg,
      ${({tokens:e})=>e.theme.foregroundSecondary} 0%,
      ${({tokens:e})=>e.theme.foregroundTertiary} 50%,
      ${({tokens:e})=>e.theme.foregroundSecondary} 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1s ease-in-out infinite;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  :host([data-rounded='true']) {
    border-radius: ${({borderRadius:e})=>e[16]};
  }

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;var eg=function(e,t,i,r){var o,n=arguments.length,s=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(o=e[l])&&(s=(n<3?o(s):n>3?o(t,i,s):o(t,i))||s);return n>3&&s&&Object.defineProperty(t,i,s),s};let em=class extends r.oi{constructor(){super(...arguments),this.width="",this.height="",this.variant="default",this.rounded=!1}render(){return this.style.cssText=`
      width: ${this.width};
      height: ${this.height};
    `,this.dataset.rounded=this.rounded?"true":"false",(0,r.dy)`<slot></slot>`}};em.styles=[ef],eg([(0,o.Cb)()],em.prototype,"width",void 0),eg([(0,o.Cb)()],em.prototype,"height",void 0),eg([(0,o.Cb)()],em.prototype,"variant",void 0),eg([(0,o.Cb)({type:Boolean})],em.prototype,"rounded",void 0),em=eg([(0,S.M)("wui-shimmer")],em),i(16912);let ew=(0,c.iv)`
  wui-shimmer {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: ${({borderRadius:e})=>e[4]};
  }

  wui-qr-code {
    opacity: 0;
    animation-duration: ${({durations:e})=>e.xl};
    animation-timing-function: ${({easings:e})=>e["ease-out-power-2"]};
    animation-name: fade-in;
    animation-fill-mode: forwards;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;var eb=function(e,t,i,r){var o,n=arguments.length,s=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(o=e[l])&&(s=(n<3?o(s):n>3?o(t,i,s):o(t,i))||s);return n>3&&s&&Object.defineProperty(t,i,s),s};let ey=class extends ei{constructor(){super(),this.basic=!1}firstUpdated(){this.basic||f.X.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet?.name??"WalletConnect",platform:"qrcode",displayIndex:this.wallet?.display_index,walletRank:this.wallet?.order,view:g.RouterController.state.view}})}disconnectedCallback(){super.disconnectedCallback(),this.unsubscribe?.forEach(e=>e())}render(){return this.onRenderProxy(),(0,r.dy)`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["0","5","5","5"]}
        gap="5"
      >
        <wui-shimmer width="100%"> ${this.qrCodeTemplate()} </wui-shimmer>
        <wui-text variant="lg-medium" color="primary"> Scan this QR Code with your phone </wui-text>
        ${this.copyTemplate()}
      </wui-flex>
      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}onRenderProxy(){!this.ready&&this.uri&&(this.ready=!0)}qrCodeTemplate(){if(!this.uri||!this.ready)return null;let e=this.wallet?this.wallet.name:void 0;return p.ConnectionController.setWcLinking(void 0),p.ConnectionController.setRecentWallet(this.wallet),(0,r.dy)` <wui-qr-code
      theme=${F.ThemeController.state.themeMode}
      uri=${this.uri}
      imageSrc=${(0,h.o)(y.f.getWalletImage(this.wallet))}
      color=${(0,h.o)(F.ThemeController.state.themeVariables["--w3m-qr-color"])}
      alt=${(0,h.o)(e)}
      data-testid="wui-qr-code"
    ></wui-qr-code>`}copyTemplate(){let e=!this.uri||!this.ready;return(0,r.dy)`<wui-button
      .disabled=${e}
      @click=${this.onCopyUri}
      variant="neutral-secondary"
      size="sm"
      data-testid="copy-wc2-uri"
    >
      Copy link
      <wui-icon size="sm" color="inherit" name="copy" slot="iconRight"></wui-icon>
    </wui-button>`}};ey.styles=ew,eb([(0,o.Cb)({type:Boolean})],ey.prototype,"basic",void 0),ey=eb([(0,c.Mo)("w3m-connecting-wc-qrcode")],ey);let eC=class extends r.oi{constructor(){if(super(),this.wallet=g.RouterController.state.data?.wallet,!this.wallet)throw Error("w3m-connecting-wc-unsupported: No wallet provided");f.X.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"browser",displayIndex:this.wallet?.display_index,walletRank:this.wallet?.order,view:g.RouterController.state.view}})}render(){return(0,r.dy)`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["10","5","5","5"]}
        gap="5"
      >
        <wui-wallet-image
          size="lg"
          imageSrc=${(0,h.o)(y.f.getWalletImage(this.wallet))}
        ></wui-wallet-image>

        <wui-text variant="md-regular" color="primary">Not Detected</wui-text>
      </wui-flex>

      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}};eC=function(e,t,i,r){var o,n=arguments.length,s=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(o=e[l])&&(s=(n<3?o(s):n>3?o(t,i,s):o(t,i))||s);return n>3&&s&&Object.defineProperty(t,i,s),s}([(0,c.Mo)("w3m-connecting-wc-unsupported")],eC);var ev=function(e,t,i,r){var o,n=arguments.length,s=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(o=e[l])&&(s=(n<3?o(s):n>3?o(t,i,s):o(t,i))||s);return n>3&&s&&Object.defineProperty(t,i,s),s};let ex=class extends ei{constructor(){if(super(),this.isLoading=!0,!this.wallet)throw Error("w3m-connecting-wc-web: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.secondaryBtnLabel="Open",this.secondaryLabel=en.bq.CONNECT_LABELS.MOBILE,this.secondaryBtnIcon="externalLink",this.updateLoadingState(),this.unsubscribe.push(p.ConnectionController.subscribeKey("wcUri",()=>{this.updateLoadingState()})),f.X.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"web",displayIndex:this.wallet?.display_index,walletRank:this.wallet?.order,view:g.RouterController.state.view}})}updateLoadingState(){this.isLoading=!this.uri}onConnectProxy(){if(this.wallet?.webapp_link&&this.uri)try{this.error=!1;let{webapp_link:e,name:t}=this.wallet,{redirect:i,href:r}=n.j.formatUniversalUrl(e,this.uri);p.ConnectionController.setWcLinking({name:t,href:r}),p.ConnectionController.setRecentWallet(this.wallet),n.j.openHref(i,"_blank")}catch{this.error=!0}}};ev([(0,o.SB)()],ex.prototype,"isLoading",void 0),ex=ev([(0,c.Mo)("w3m-connecting-wc-web")],ex);let e_=(0,c.iv)`
  :host([data-mobile-fullscreen='true']) {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  :host([data-mobile-fullscreen='true']) wui-ux-by-reown {
    margin-top: auto;
  }
`;var eE=function(e,t,i,r){var o,n=arguments.length,s=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(o=e[l])&&(s=(n<3?o(s):n>3?o(t,i,s):o(t,i))||s);return n>3&&s&&Object.defineProperty(t,i,s),s};let e$=class extends r.oi{constructor(){super(),this.wallet=g.RouterController.state.data?.wallet,this.unsubscribe=[],this.platform=void 0,this.platforms=[],this.isSiwxEnabled=!!s.OptionsController.state.siwx,this.remoteFeatures=s.OptionsController.state.remoteFeatures,this.displayBranding=!0,this.basic=!1,this.determinePlatforms(),this.initializeConnection(),this.unsubscribe.push(s.OptionsController.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return s.OptionsController.state.enableMobileFullScreen&&this.setAttribute("data-mobile-fullscreen","true"),(0,r.dy)`
      ${this.headerTemplate()}
      <div class="platform-container">${this.platformTemplate()}</div>
      ${this.reownBrandingTemplate()}
    `}reownBrandingTemplate(){return this.remoteFeatures?.reownBranding&&this.displayBranding?(0,r.dy)`<wui-ux-by-reown></wui-ux-by-reown>`:null}async initializeConnection(e=!1){if("browser"!==this.platform&&(!s.OptionsController.state.manualWCControl||e))try{let{wcPairingExpiry:t,status:i}=p.ConnectionController.state,{redirectView:r}=g.RouterController.state.data??{};if(e||s.OptionsController.state.enableEmbedded||n.j.isPairingExpired(t)||"connecting"===i){let e=p.ConnectionController.getConnections(k.R.state.activeChain),t=this.remoteFeatures?.multiWallet,i=e.length>0;await p.ConnectionController.connectWalletConnect({cache:"never"}),this.isSiwxEnabled||(i&&t?(g.RouterController.replace("ProfileWallets"),R.SnackController.showSuccess("New Wallet Added")):r?g.RouterController.replace(r):T.I.close())}}catch(e){if(e instanceof Error&&e.message.includes("An error occurred when attempting to switch chain")&&!s.OptionsController.state.enableNetworkSwitch&&k.R.state.activeChain){k.R.setActiveCaipNetwork(A.f.getUnsupportedNetwork(`${k.R.state.activeChain}:${k.R.state.activeCaipNetwork?.id}`)),k.R.showUnsupportedChainUI();return}e instanceof I.g&&e.originalName===$.jD.PROVIDER_RPC_ERROR_NAME.USER_REJECTED_REQUEST?f.X.sendEvent({type:"track",event:"USER_REJECTED",properties:{message:e.message}}):f.X.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:e?.message??"Unknown"}}),p.ConnectionController.setWcError(!0),R.SnackController.showError(e.message??"Connection error"),p.ConnectionController.resetWcConnection(),g.RouterController.goBack()}}determinePlatforms(){if(!this.wallet){this.platforms.push("qrcode"),this.platform="qrcode";return}if(this.platform)return;let{mobile_link:e,desktop_link:t,webapp_link:i,injected:r,rdns:o}=this.wallet,l=r?.map(({injected_id:e})=>e).filter(Boolean),a=[...o?[o]:l??[]],c=!s.OptionsController.state.isUniversalProvider&&a.length,h=p.ConnectionController.checkInstalled(a),d=c&&h,u=t&&!n.j.isMobile();d&&!k.R.state.noAdapters&&this.platforms.push("browser"),e&&this.platforms.push(n.j.isMobile()?"mobile":"qrcode"),i&&this.platforms.push("web"),u&&this.platforms.push("desktop"),d||!c||k.R.state.noAdapters||this.platforms.push("unsupported"),this.platform=this.platforms[0]}platformTemplate(){switch(this.platform){case"browser":return(0,r.dy)`<w3m-connecting-wc-browser></w3m-connecting-wc-browser>`;case"web":return(0,r.dy)`<w3m-connecting-wc-web></w3m-connecting-wc-web>`;case"desktop":return(0,r.dy)`
          <w3m-connecting-wc-desktop .onRetry=${()=>this.initializeConnection(!0)}>
          </w3m-connecting-wc-desktop>
        `;case"mobile":return(0,r.dy)`
          <w3m-connecting-wc-mobile isMobile .onRetry=${()=>this.initializeConnection(!0)}>
          </w3m-connecting-wc-mobile>
        `;case"qrcode":return(0,r.dy)`<w3m-connecting-wc-qrcode ?basic=${this.basic}></w3m-connecting-wc-qrcode>`;default:return(0,r.dy)`<w3m-connecting-wc-unsupported></w3m-connecting-wc-unsupported>`}}headerTemplate(){return this.platforms.length>1?(0,r.dy)`
      <w3m-connecting-header
        .platforms=${this.platforms}
        .onSelectPlatfrom=${this.onSelectPlatform.bind(this)}
      >
      </w3m-connecting-header>
    `:null}async onSelectPlatform(e){let t=this.shadowRoot?.querySelector("div");t&&(await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.platform=e,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}};e$.styles=e_,eE([(0,o.SB)()],e$.prototype,"platform",void 0),eE([(0,o.SB)()],e$.prototype,"platforms",void 0),eE([(0,o.SB)()],e$.prototype,"isSiwxEnabled",void 0),eE([(0,o.SB)()],e$.prototype,"remoteFeatures",void 0),eE([(0,o.Cb)({type:Boolean})],e$.prototype,"displayBranding",void 0),eE([(0,o.Cb)({type:Boolean})],e$.prototype,"basic",void 0),e$=eE([(0,c.Mo)("w3m-connecting-wc-view")],e$);var ek=function(e,t,i,r){var o,n=arguments.length,s=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(o=e[l])&&(s=(n<3?o(s):n>3?o(t,i,s):o(t,i))||s);return n>3&&s&&Object.defineProperty(t,i,s),s};let eR=class extends r.oi{constructor(){super(),this.unsubscribe=[],this.isMobile=n.j.isMobile(),this.remoteFeatures=s.OptionsController.state.remoteFeatures,this.unsubscribe.push(s.OptionsController.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){if(this.isMobile){let{featured:e,recommended:t}=l.ApiController.state,{customWallets:i}=s.OptionsController.state,o=a.M.getRecentWallets(),n=e.length||t.length||i?.length||o.length;return(0,r.dy)`<wui-flex flexDirection="column" gap="2" .margin=${["1","3","3","3"]}>
        ${n?(0,r.dy)`<w3m-connector-list></w3m-connector-list>`:null}
        <w3m-all-wallets-widget></w3m-all-wallets-widget>
      </wui-flex>`}return(0,r.dy)`<wui-flex flexDirection="column" .padding=${["0","0","4","0"]}>
        <w3m-connecting-wc-view ?basic=${!0} .displayBranding=${!1}></w3m-connecting-wc-view>
        <wui-flex flexDirection="column" .padding=${["0","3","0","3"]}>
          <w3m-all-wallets-widget></w3m-all-wallets-widget>
        </wui-flex>
      </wui-flex>
      ${this.reownBrandingTemplate()} `}reownBrandingTemplate(){return this.remoteFeatures?.reownBranding?(0,r.dy)` <wui-flex flexDirection="column" .padding=${["1","0","1","0"]}>
      <wui-ux-by-reown></wui-ux-by-reown>
    </wui-flex>`:null}};ek([(0,o.SB)()],eR.prototype,"isMobile",void 0),ek([(0,o.SB)()],eR.prototype,"remoteFeatures",void 0),eR=ek([(0,c.Mo)("w3m-connecting-wc-basic-view")],eR);var eT=i(14260);let{I:eI}=eT._$LH,eA=e=>void 0===e.strings;var eP=i(4107);let eS=(e,t)=>{let i=e._$AN;if(void 0===i)return!1;for(let e of i)e._$AO?.(t,!1),eS(e,t);return!0},eO=e=>{let t,i;do{if(void 0===(t=e._$AM))break;(i=t._$AN).delete(e),e=t}while(0===i?.size)},eL=e=>{for(let t;t=e._$AM;e=t){let i=t._$AN;if(void 0===i)t._$AN=i=new Set;else if(i.has(e))break;i.add(e),eD(t)}};function eB(e){void 0!==this._$AN?(eO(this),this._$AM=e,eL(this)):this._$AM=e}function eM(e,t=!1,i=0){let r=this._$AH,o=this._$AN;if(void 0!==o&&0!==o.size){if(t){if(Array.isArray(r))for(let e=i;e<r.length;e++)eS(r[e],!1),eO(r[e]);else null!=r&&(eS(r,!1),eO(r))}else eS(this,e)}}let eD=e=>{e.type==eP.pX.CHILD&&(e._$AP??=eM,e._$AQ??=eB)};class eN extends eP.Xe{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,t,i){super._$AT(e,t,i),eL(this),this.isConnected=e._$AU}_$AO(e,t=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),t&&(eS(this,e),eO(this))}setValue(e){if(eA(this._$Ct))this._$Ct._$AI(e,this);else{let t=[...this._$Ct._$AH];t[this._$Ci]=e,this._$Ct._$AI(t,this,0)}}disconnected(){}reconnected(){}}let ej=()=>new eW;class eW{}let eU=new WeakMap,ez=(0,eP.XM)(class extends eN{render(e){return eT.Ld}update(e,[t]){let i=t!==this.G;return i&&void 0!==this.G&&this.rt(void 0),(i||this.lt!==this.ct)&&(this.G=t,this.ht=e.options?.host,this.rt(this.ct=e.element)),eT.Ld}rt(e){if(this.isConnected||(e=void 0),"function"==typeof this.G){let t=this.ht??globalThis,i=eU.get(t);void 0===i&&(i=new WeakMap,eU.set(t,i)),void 0!==i.get(this.G)&&this.G.call(this.ht,void 0),i.set(this.G,e),void 0!==e&&this.G.call(this.ht,e)}else this.G.value=e}get lt(){return"function"==typeof this.G?eU.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}}),eH=(0,O.iv)`
  :host {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  label {
    position: relative;
    display: inline-block;
    user-select: none;
    transition:
      background-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      color ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      border ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      box-shadow ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      width ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      height ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      transform ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      opacity ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color, color, border, box-shadow, width, height, transform, opacity;
  }

  input {
    width: 0;
    height: 0;
    opacity: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${({colors:e})=>e.neutrals300};
    border-radius: ${({borderRadius:e})=>e.round};
    border: 1px solid transparent;
    will-change: border;
    transition:
      background-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      color ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      border ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      box-shadow ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      width ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      height ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      transform ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      opacity ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color, color, border, box-shadow, width, height, transform, opacity;
  }

  span:before {
    content: '';
    position: absolute;
    background-color: ${({colors:e})=>e.white};
    border-radius: 50%;
  }

  /* -- Sizes --------------------------------------------------------- */
  label[data-size='lg'] {
    width: 48px;
    height: 32px;
  }

  label[data-size='md'] {
    width: 40px;
    height: 28px;
  }

  label[data-size='sm'] {
    width: 32px;
    height: 22px;
  }

  label[data-size='lg'] > span:before {
    height: 24px;
    width: 24px;
    left: 4px;
    top: 3px;
  }

  label[data-size='md'] > span:before {
    height: 20px;
    width: 20px;
    left: 4px;
    top: 3px;
  }

  label[data-size='sm'] > span:before {
    height: 16px;
    width: 16px;
    left: 3px;
    top: 2px;
  }

  /* -- Focus states --------------------------------------------------- */
  input:focus-visible:not(:checked) + span,
  input:focus:not(:checked) + span {
    border: 1px solid ${({tokens:e})=>e.core.iconAccentPrimary};
    background-color: ${({tokens:e})=>e.theme.textTertiary};
    box-shadow: 0px 0px 0px 4px rgba(9, 136, 240, 0.2);
  }

  input:focus-visible:checked + span,
  input:focus:checked + span {
    border: 1px solid ${({tokens:e})=>e.core.iconAccentPrimary};
    box-shadow: 0px 0px 0px 4px rgba(9, 136, 240, 0.2);
  }

  /* -- Checked states --------------------------------------------------- */
  input:checked + span {
    background-color: ${({tokens:e})=>e.core.iconAccentPrimary};
  }

  label[data-size='lg'] > input:checked + span:before {
    transform: translateX(calc(100% - 9px));
  }

  label[data-size='md'] > input:checked + span:before {
    transform: translateX(calc(100% - 9px));
  }

  label[data-size='sm'] > input:checked + span:before {
    transform: translateX(calc(100% - 7px));
  }

  /* -- Hover states ------------------------------------------------------- */
  label:hover > input:not(:checked):not(:disabled) + span {
    background-color: ${({colors:e})=>e.neutrals400};
  }

  label:hover > input:checked:not(:disabled) + span {
    background-color: ${({colors:e})=>e.accent080};
  }

  /* -- Disabled state --------------------------------------------------- */
  label:has(input:disabled) {
    pointer-events: none;
    user-select: none;
  }

  input:not(:checked):disabled + span {
    background-color: ${({colors:e})=>e.neutrals700};
  }

  input:checked:disabled + span {
    background-color: ${({colors:e})=>e.neutrals700};
  }

  input:not(:checked):disabled + span::before {
    background-color: ${({colors:e})=>e.neutrals400};
  }

  input:checked:disabled + span::before {
    background-color: ${({tokens:e})=>e.theme.textTertiary};
  }
`;var eF=function(e,t,i,r){var o,n=arguments.length,s=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(o=e[l])&&(s=(n<3?o(s):n>3?o(t,i,s):o(t,i))||s);return n>3&&s&&Object.defineProperty(t,i,s),s};let eY=class extends r.oi{constructor(){super(...arguments),this.inputElementRef=ej(),this.checked=!1,this.disabled=!1,this.size="md"}render(){return(0,r.dy)`
      <label data-size=${this.size}>
        <input
          ${ez(this.inputElementRef)}
          type="checkbox"
          ?checked=${this.checked}
          ?disabled=${this.disabled}
          @change=${this.dispatchChangeEvent.bind(this)}
        />
        <span></span>
      </label>
    `}dispatchChangeEvent(){this.dispatchEvent(new CustomEvent("switchChange",{detail:this.inputElementRef.value?.checked,bubbles:!0,composed:!0}))}};eY.styles=[P.ET,P.ZM,eH],eF([(0,o.Cb)({type:Boolean})],eY.prototype,"checked",void 0),eF([(0,o.Cb)({type:Boolean})],eY.prototype,"disabled",void 0),eF([(0,o.Cb)()],eY.prototype,"size",void 0),eY=eF([(0,S.M)("wui-toggle")],eY);let eq=(0,O.iv)`
  :host {
    height: auto;
  }

  :host > wui-flex {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: ${({spacing:e})=>e["2"]};
    padding: ${({spacing:e})=>e["2"]} ${({spacing:e})=>e["3"]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e["4"]};
    box-shadow: inset 0 0 0 1px ${({tokens:e})=>e.theme.foregroundPrimary};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color;
    cursor: pointer;
  }

  wui-switch {
    pointer-events: none;
  }
`;var eG=function(e,t,i,r){var o,n=arguments.length,s=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(o=e[l])&&(s=(n<3?o(s):n>3?o(t,i,s):o(t,i))||s);return n>3&&s&&Object.defineProperty(t,i,s),s};let eK=class extends r.oi{constructor(){super(...arguments),this.checked=!1}render(){return(0,r.dy)`
      <wui-flex>
        <wui-icon size="xl" name="walletConnectBrown"></wui-icon>
        <wui-toggle
          ?checked=${this.checked}
          size="sm"
          @switchChange=${this.handleToggleChange.bind(this)}
        ></wui-toggle>
      </wui-flex>
    `}handleToggleChange(e){e.stopPropagation(),this.checked=e.detail,this.dispatchSwitchEvent()}dispatchSwitchEvent(){this.dispatchEvent(new CustomEvent("certifiedSwitchChange",{detail:this.checked,bubbles:!0,composed:!0}))}};eK.styles=[P.ET,P.ZM,eq],eG([(0,o.Cb)({type:Boolean})],eK.prototype,"checked",void 0),eK=eG([(0,S.M)("wui-certified-switch")],eK);let eV=(0,O.iv)`
  :host {
    position: relative;
    width: 100%;
    display: inline-flex;
    flex-direction: column;
    gap: ${({spacing:e})=>e[3]};
    color: ${({tokens:e})=>e.theme.textPrimary};
    caret-color: ${({tokens:e})=>e.core.textAccentPrimary};
  }

  .wui-input-text-container {
    position: relative;
    display: flex;
  }

  input {
    width: 100%;
    border-radius: ${({borderRadius:e})=>e[4]};
    color: inherit;
    background: transparent;
    border: 1px solid ${({tokens:e})=>e.theme.borderPrimary};
    caret-color: ${({tokens:e})=>e.core.textAccentPrimary};
    padding: ${({spacing:e})=>e[3]} ${({spacing:e})=>e[3]}
      ${({spacing:e})=>e[3]} ${({spacing:e})=>e[10]};
    font-size: ${({textSize:e})=>e.large};
    line-height: ${({typography:e})=>e["lg-regular"].lineHeight};
    letter-spacing: ${({typography:e})=>e["lg-regular"].letterSpacing};
    font-weight: ${({fontWeight:e})=>e.regular};
    font-family: ${({fontFamily:e})=>e.regular};
  }

  input[data-size='lg'] {
    padding: ${({spacing:e})=>e[4]} ${({spacing:e})=>e[3]}
      ${({spacing:e})=>e[4]} ${({spacing:e})=>e[10]};
  }

  @media (hover: hover) and (pointer: fine) {
    input:hover:enabled {
      border: 1px solid ${({tokens:e})=>e.theme.borderSecondary};
    }
  }

  input:disabled {
    cursor: unset;
    border: 1px solid ${({tokens:e})=>e.theme.borderPrimary};
  }

  input::placeholder {
    color: ${({tokens:e})=>e.theme.textSecondary};
  }

  input:focus:enabled {
    border: 1px solid ${({tokens:e})=>e.theme.borderSecondary};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    -webkit-box-shadow: 0px 0px 0px 4px ${({tokens:e})=>e.core.foregroundAccent040};
    -moz-box-shadow: 0px 0px 0px 4px ${({tokens:e})=>e.core.foregroundAccent040};
    box-shadow: 0px 0px 0px 4px ${({tokens:e})=>e.core.foregroundAccent040};
  }

  div.wui-input-text-container:has(input:disabled) {
    opacity: 0.5;
  }

  wui-icon.wui-input-text-left-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    left: ${({spacing:e})=>e[4]};
    color: ${({tokens:e})=>e.theme.iconDefault};
  }

  button.wui-input-text-submit-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: ${({spacing:e})=>e[3]};
    width: 24px;
    height: 24px;
    border: none;
    background: transparent;
    border-radius: ${({borderRadius:e})=>e[2]};
    color: ${({tokens:e})=>e.core.textAccentPrimary};
  }

  button.wui-input-text-submit-button:disabled {
    opacity: 1;
  }

  button.wui-input-text-submit-button.loading wui-icon {
    animation: spin 1s linear infinite;
  }

  button.wui-input-text-submit-button:hover {
    background: ${({tokens:e})=>e.core.foregroundAccent010};
  }

  input:has(+ .wui-input-text-submit-button) {
    padding-right: ${({spacing:e})=>e[12]};
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }

  input[type='search']::-webkit-search-decoration,
  input[type='search']::-webkit-search-cancel-button,
  input[type='search']::-webkit-search-results-button,
  input[type='search']::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }

  /* -- Keyframes --------------------------------------------------- */
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;var eX=function(e,t,i,r){var o,n=arguments.length,s=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(o=e[l])&&(s=(n<3?o(s):n>3?o(t,i,s):o(t,i))||s);return n>3&&s&&Object.defineProperty(t,i,s),s};let eJ=class extends r.oi{constructor(){super(...arguments),this.inputElementRef=ej(),this.disabled=!1,this.loading=!1,this.placeholder="",this.type="text",this.value="",this.size="md"}render(){return(0,r.dy)` <div class="wui-input-text-container">
        ${this.templateLeftIcon()}
        <input
          data-size=${this.size}
          ${ez(this.inputElementRef)}
          data-testid="wui-input-text"
          type=${this.type}
          enterkeyhint=${(0,h.o)(this.enterKeyHint)}
          ?disabled=${this.disabled}
          placeholder=${this.placeholder}
          @input=${this.dispatchInputChangeEvent.bind(this)}
          @keydown=${this.onKeyDown}
          .value=${this.value||""}
        />
        ${this.templateSubmitButton()}
        <slot class="wui-input-text-slot"></slot>
      </div>
      ${this.templateError()} ${this.templateWarning()}`}templateLeftIcon(){return this.icon?(0,r.dy)`<wui-icon
        class="wui-input-text-left-icon"
        size="md"
        data-size=${this.size}
        color="inherit"
        name=${this.icon}
      ></wui-icon>`:null}templateSubmitButton(){return this.onSubmit?(0,r.dy)`<button
        class="wui-input-text-submit-button ${this.loading?"loading":""}"
        @click=${this.onSubmit?.bind(this)}
        ?disabled=${this.disabled||this.loading}
      >
        ${this.loading?(0,r.dy)`<wui-icon name="spinner" size="md"></wui-icon>`:(0,r.dy)`<wui-icon name="chevronRight" size="md"></wui-icon>`}
      </button>`:null}templateError(){return this.errorText?(0,r.dy)`<wui-text variant="sm-regular" color="error">${this.errorText}</wui-text>`:null}templateWarning(){return this.warningText?(0,r.dy)`<wui-text variant="sm-regular" color="warning">${this.warningText}</wui-text>`:null}dispatchInputChangeEvent(){this.dispatchEvent(new CustomEvent("inputChange",{detail:this.inputElementRef.value?.value,bubbles:!0,composed:!0}))}};eJ.styles=[P.ET,P.ZM,eV],eX([(0,o.Cb)()],eJ.prototype,"icon",void 0),eX([(0,o.Cb)({type:Boolean})],eJ.prototype,"disabled",void 0),eX([(0,o.Cb)({type:Boolean})],eJ.prototype,"loading",void 0),eX([(0,o.Cb)()],eJ.prototype,"placeholder",void 0),eX([(0,o.Cb)()],eJ.prototype,"type",void 0),eX([(0,o.Cb)()],eJ.prototype,"value",void 0),eX([(0,o.Cb)()],eJ.prototype,"errorText",void 0),eX([(0,o.Cb)()],eJ.prototype,"warningText",void 0),eX([(0,o.Cb)()],eJ.prototype,"onSubmit",void 0),eX([(0,o.Cb)()],eJ.prototype,"size",void 0),eX([(0,o.Cb)({attribute:!1})],eJ.prototype,"onKeyDown",void 0),eJ=eX([(0,S.M)("wui-input-text")],eJ);let eQ=(0,O.iv)`
  :host {
    position: relative;
    display: inline-block;
    width: 100%;
  }

  wui-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: ${({spacing:e})=>e[3]};
    color: ${({tokens:e})=>e.theme.iconDefault};
    cursor: pointer;
    padding: ${({spacing:e})=>e[2]};
    background-color: transparent;
    border-radius: ${({borderRadius:e})=>e[4]};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
  }

  @media (hover: hover) {
    wui-icon:hover {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
  }
`;var eZ=function(e,t,i,r){var o,n=arguments.length,s=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(o=e[l])&&(s=(n<3?o(s):n>3?o(t,i,s):o(t,i))||s);return n>3&&s&&Object.defineProperty(t,i,s),s};let e0=class extends r.oi{constructor(){super(...arguments),this.inputComponentRef=ej(),this.inputValue=""}render(){return(0,r.dy)`
      <wui-input-text
        ${ez(this.inputComponentRef)}
        placeholder="Search wallet"
        icon="search"
        type="search"
        enterKeyHint="search"
        size="sm"
        @inputChange=${this.onInputChange}
      >
        ${this.inputValue?(0,r.dy)`<wui-icon
              @click=${this.clearValue}
              color="inherit"
              size="sm"
              name="close"
            ></wui-icon>`:null}
      </wui-input-text>
    `}onInputChange(e){this.inputValue=e.detail||""}clearValue(){let e=this.inputComponentRef.value,t=e?.inputElementRef.value;t&&(t.value="",this.inputValue="",t.focus(),t.dispatchEvent(new Event("input")))}};e0.styles=[P.ET,eQ],eZ([(0,o.Cb)()],e0.prototype,"inputValue",void 0),e0=eZ([(0,S.M)("wui-search-bar")],e0);let e1=(0,r.YP)`<svg  viewBox="0 0 48 54" fill="none">
  <path
    d="M43.4605 10.7248L28.0485 1.61089C25.5438 0.129705 22.4562 0.129705 19.9515 1.61088L4.53951 10.7248C2.03626 12.2051 0.5 14.9365 0.5 17.886V36.1139C0.5 39.0635 2.03626 41.7949 4.53951 43.2752L19.9515 52.3891C22.4562 53.8703 25.5438 53.8703 28.0485 52.3891L43.4605 43.2752C45.9637 41.7949 47.5 39.0635 47.5 36.114V17.8861C47.5 14.9365 45.9637 12.2051 43.4605 10.7248Z"
  />
</svg>`,e2=(0,O.iv)`
  :host {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 104px;
    width: 104px;
    row-gap: ${({spacing:e})=>e[2]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[5]};
    position: relative;
  }

  wui-shimmer[data-type='network'] {
    border: none;
    -webkit-clip-path: var(--apkt-path-network);
    clip-path: var(--apkt-path-network);
  }

  svg {
    position: absolute;
    width: 48px;
    height: 54px;
    z-index: 1;
  }

  svg > path {
    stroke: ${({tokens:e})=>e.theme.foregroundSecondary};
    stroke-width: 1px;
  }

  @media (max-width: 350px) {
    :host {
      width: 100%;
    }
  }
`;var e3=function(e,t,i,r){var o,n=arguments.length,s=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(o=e[l])&&(s=(n<3?o(s):n>3?o(t,i,s):o(t,i))||s);return n>3&&s&&Object.defineProperty(t,i,s),s};let e4=class extends r.oi{constructor(){super(...arguments),this.type="wallet"}render(){return(0,r.dy)`
      ${this.shimmerTemplate()}
      <wui-shimmer width="80px" height="20px"></wui-shimmer>
    `}shimmerTemplate(){return"network"===this.type?(0,r.dy)` <wui-shimmer data-type=${this.type} width="48px" height="54px"></wui-shimmer>
        ${e1}`:(0,r.dy)`<wui-shimmer width="56px" height="56px"></wui-shimmer>`}};e4.styles=[P.ET,P.ZM,e2],e3([(0,o.Cb)()],e4.prototype,"type",void 0),e4=e3([(0,S.M)("wui-card-select-loader")],e4);var e5=i(35435);let e6=(0,r.iv)`
  :host {
    display: grid;
    width: inherit;
    height: inherit;
  }
`;var e8=function(e,t,i,r){var o,n=arguments.length,s=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(o=e[l])&&(s=(n<3?o(s):n>3?o(t,i,s):o(t,i))||s);return n>3&&s&&Object.defineProperty(t,i,s),s};let e7=class extends r.oi{render(){return this.style.cssText=`
      grid-template-rows: ${this.gridTemplateRows};
      grid-template-columns: ${this.gridTemplateColumns};
      justify-items: ${this.justifyItems};
      align-items: ${this.alignItems};
      justify-content: ${this.justifyContent};
      align-content: ${this.alignContent};
      column-gap: ${this.columnGap&&`var(--apkt-spacing-${this.columnGap})`};
      row-gap: ${this.rowGap&&`var(--apkt-spacing-${this.rowGap})`};
      gap: ${this.gap&&`var(--apkt-spacing-${this.gap})`};
      padding-top: ${this.padding&&e5.H.getSpacingStyles(this.padding,0)};
      padding-right: ${this.padding&&e5.H.getSpacingStyles(this.padding,1)};
      padding-bottom: ${this.padding&&e5.H.getSpacingStyles(this.padding,2)};
      padding-left: ${this.padding&&e5.H.getSpacingStyles(this.padding,3)};
      margin-top: ${this.margin&&e5.H.getSpacingStyles(this.margin,0)};
      margin-right: ${this.margin&&e5.H.getSpacingStyles(this.margin,1)};
      margin-bottom: ${this.margin&&e5.H.getSpacingStyles(this.margin,2)};
      margin-left: ${this.margin&&e5.H.getSpacingStyles(this.margin,3)};
    `,(0,r.dy)`<slot></slot>`}};e7.styles=[P.ET,e6],e8([(0,o.Cb)()],e7.prototype,"gridTemplateRows",void 0),e8([(0,o.Cb)()],e7.prototype,"gridTemplateColumns",void 0),e8([(0,o.Cb)()],e7.prototype,"justifyItems",void 0),e8([(0,o.Cb)()],e7.prototype,"alignItems",void 0),e8([(0,o.Cb)()],e7.prototype,"justifyContent",void 0),e8([(0,o.Cb)()],e7.prototype,"alignContent",void 0),e8([(0,o.Cb)()],e7.prototype,"columnGap",void 0),e8([(0,o.Cb)()],e7.prototype,"rowGap",void 0),e8([(0,o.Cb)()],e7.prototype,"gap",void 0),e8([(0,o.Cb)()],e7.prototype,"padding",void 0),e8([(0,o.Cb)()],e7.prototype,"margin",void 0),e7=e8([(0,S.M)("wui-grid")],e7);var e9=i(54613);let te=(0,c.iv)`
  button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    width: 104px;
    row-gap: ${({spacing:e})=>e["2"]};
    padding: ${({spacing:e})=>e["3"]} ${({spacing:e})=>e["0"]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: clamp(0px, ${({borderRadius:e})=>e["4"]}, 20px);
    transition:
      color ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-1"]},
      background-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-1"]},
      border-radius ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-1"]};
    will-change: background-color, color, border-radius;
    outline: none;
    border: none;
  }

  button > wui-flex > wui-text {
    color: ${({tokens:e})=>e.theme.textPrimary};
    max-width: 86px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    justify-content: center;
  }

  button > wui-flex > wui-text.certified {
    max-width: 66px;
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
  }

  button:disabled > wui-flex > wui-text {
    color: ${({tokens:e})=>e.core.glass010};
  }

  [data-selected='true'] {
    background-color: ${({colors:e})=>e.accent020};
  }

  @media (hover: hover) and (pointer: fine) {
    [data-selected='true']:hover:enabled {
      background-color: ${({colors:e})=>e.accent010};
    }
  }

  [data-selected='true']:active:enabled {
    background-color: ${({colors:e})=>e.accent010};
  }

  @media (max-width: 350px) {
    button {
      width: 100%;
    }
  }
`;var tt=function(e,t,i,r){var o,n=arguments.length,s=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(o=e[l])&&(s=(n<3?o(s):n>3?o(t,i,s):o(t,i))||s);return n>3&&s&&Object.defineProperty(t,i,s),s};let ti=class extends r.oi{constructor(){super(),this.observer=new IntersectionObserver(()=>void 0),this.visible=!1,this.imageSrc=void 0,this.imageLoading=!1,this.isImpressed=!1,this.explorerId="",this.walletQuery="",this.certified=!1,this.displayIndex=0,this.wallet=void 0,this.observer=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting?(this.visible=!0,this.fetchImageSrc(),this.sendImpressionEvent()):this.visible=!1})},{threshold:.01})}firstUpdated(){this.observer.observe(this)}disconnectedCallback(){this.observer.disconnect()}render(){let e=this.wallet?.badge_type==="certified";return(0,r.dy)`
      <button>
        ${this.imageTemplate()}
        <wui-flex flexDirection="row" alignItems="center" justifyContent="center" gap="1">
          <wui-text
            variant="md-regular"
            color="inherit"
            class=${(0,h.o)(e?"certified":void 0)}
            >${this.wallet?.name}</wui-text
          >
          ${e?(0,r.dy)`<wui-icon size="sm" name="walletConnectBrown"></wui-icon>`:null}
        </wui-flex>
      </button>
    `}imageTemplate(){return(this.visible||this.imageSrc)&&!this.imageLoading?(0,r.dy)`
      <wui-wallet-image
        size="lg"
        imageSrc=${(0,h.o)(this.imageSrc)}
        name=${(0,h.o)(this.wallet?.name)}
        .installed=${this.wallet?.installed??!1}
        badgeSize="sm"
      >
      </wui-wallet-image>
    `:this.shimmerTemplate()}shimmerTemplate(){return(0,r.dy)`<wui-shimmer width="56px" height="56px"></wui-shimmer>`}async fetchImageSrc(){this.wallet&&(this.imageSrc=y.f.getWalletImage(this.wallet),this.imageSrc||(this.imageLoading=!0,this.imageSrc=await y.f.fetchWalletImage(this.wallet.image_id),this.imageLoading=!1))}sendImpressionEvent(){this.wallet&&!this.isImpressed&&(this.isImpressed=!0,f.X.sendWalletImpressionEvent({name:this.wallet.name,walletRank:this.wallet.order,explorerId:this.explorerId,view:g.RouterController.state.view,query:this.walletQuery,certified:this.certified,displayIndex:this.displayIndex}))}};ti.styles=te,tt([(0,o.SB)()],ti.prototype,"visible",void 0),tt([(0,o.SB)()],ti.prototype,"imageSrc",void 0),tt([(0,o.SB)()],ti.prototype,"imageLoading",void 0),tt([(0,o.SB)()],ti.prototype,"isImpressed",void 0),tt([(0,o.Cb)()],ti.prototype,"explorerId",void 0),tt([(0,o.Cb)()],ti.prototype,"walletQuery",void 0),tt([(0,o.Cb)()],ti.prototype,"certified",void 0),tt([(0,o.Cb)()],ti.prototype,"displayIndex",void 0),tt([(0,o.Cb)({type:Object})],ti.prototype,"wallet",void 0),ti=tt([(0,c.Mo)("w3m-all-wallets-list-item")],ti);let tr=(0,c.iv)`
  wui-grid {
    max-height: clamp(360px, 400px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
    grid-auto-rows: min-content;
    grid-template-columns: repeat(auto-fill, 104px);
  }

  :host([data-mobile-fullscreen='true']) wui-grid {
    max-height: none;
  }

  @media (max-width: 350px) {
    wui-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  wui-grid[data-scroll='false'] {
    overflow: hidden;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  w3m-all-wallets-list-item {
    opacity: 0;
    animation-duration: ${({durations:e})=>e.xl};
    animation-timing-function: ${({easings:e})=>e["ease-inout-power-2"]};
    animation-name: fade-in;
    animation-fill-mode: forwards;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  wui-loading-spinner {
    padding-top: ${({spacing:e})=>e["4"]};
    padding-bottom: ${({spacing:e})=>e["4"]};
    justify-content: center;
    grid-column: 1 / span 4;
  }
`;var to=function(e,t,i,r){var o,n=arguments.length,s=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(o=e[l])&&(s=(n<3?o(s):n>3?o(t,i,s):o(t,i))||s);return n>3&&s&&Object.defineProperty(t,i,s),s};let tn="local-paginator",ts=class extends r.oi{constructor(){super(),this.unsubscribe=[],this.paginationObserver=void 0,this.loading=!l.ApiController.state.wallets.length,this.wallets=l.ApiController.state.wallets,this.recommended=l.ApiController.state.recommended,this.featured=l.ApiController.state.featured,this.filteredWallets=l.ApiController.state.filteredWallets,this.mobileFullScreen=s.OptionsController.state.enableMobileFullScreen,this.unsubscribe.push(l.ApiController.subscribeKey("wallets",e=>this.wallets=e),l.ApiController.subscribeKey("recommended",e=>this.recommended=e),l.ApiController.subscribeKey("featured",e=>this.featured=e),l.ApiController.subscribeKey("filteredWallets",e=>this.filteredWallets=e))}firstUpdated(){this.initialFetch(),this.createPaginationObserver()}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),this.paginationObserver?.disconnect()}render(){return this.mobileFullScreen&&this.setAttribute("data-mobile-fullscreen","true"),(0,r.dy)`
      <wui-grid
        data-scroll=${!this.loading}
        .padding=${["0","3","3","3"]}
        gap="2"
        justifyContent="space-between"
      >
        ${this.loading?this.shimmerTemplate(16):this.walletsTemplate()}
        ${this.paginationLoaderTemplate()}
      </wui-grid>
    `}async initialFetch(){this.loading=!0;let e=this.shadowRoot?.querySelector("wui-grid");e&&(await l.ApiController.fetchWalletsByPage({page:1}),await e.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.loading=!1,e.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}shimmerTemplate(e,t){return[...Array(e)].map(()=>(0,r.dy)`
        <wui-card-select-loader type="wallet" id=${(0,h.o)(t)}></wui-card-select-loader>
      `)}getWallets(){let e=[...this.featured,...this.recommended];this.filteredWallets?.length>0?e.push(...this.filteredWallets):e.push(...this.wallets);let t=n.j.uniqueBy(e,"id"),i=e9.J.markWalletsAsInstalled(t);return e9.J.markWalletsWithDisplayIndex(i)}walletsTemplate(){return this.getWallets().map((e,t)=>(0,r.dy)`
        <w3m-all-wallets-list-item
          data-testid="wallet-search-item-${e.id}"
          @click=${()=>this.onConnectWallet(e)}
          .wallet=${e}
          explorerId=${e.id}
          certified=${"certified"===this.badge}
          displayIndex=${t}
        ></w3m-all-wallets-list-item>
      `)}paginationLoaderTemplate(){let{wallets:e,recommended:t,featured:i,count:r,mobileFilteredOutWalletsLength:o}=l.ApiController.state,n=window.innerWidth<352?3:4,s=e.length+t.length,a=Math.ceil(s/n)*n-s+n;return(a-=e.length?i.length%n:0,0===r&&i.length>0)?null:0===r||[...i,...e,...t].length<r-(o??0)?this.shimmerTemplate(a,tn):null}createPaginationObserver(){let e=this.shadowRoot?.querySelector(`#${tn}`);e&&(this.paginationObserver=new IntersectionObserver(([e])=>{if(e?.isIntersecting&&!this.loading){let{page:e,count:t,wallets:i}=l.ApiController.state;i.length<t&&l.ApiController.fetchWalletsByPage({page:e+1})}}),this.paginationObserver.observe(e))}onConnectWallet(e){u.ConnectorController.selectWalletConnector(e)}};ts.styles=tr,to([(0,o.SB)()],ts.prototype,"loading",void 0),to([(0,o.SB)()],ts.prototype,"wallets",void 0),to([(0,o.SB)()],ts.prototype,"recommended",void 0),to([(0,o.SB)()],ts.prototype,"featured",void 0),to([(0,o.SB)()],ts.prototype,"filteredWallets",void 0),to([(0,o.SB)()],ts.prototype,"badge",void 0),to([(0,o.SB)()],ts.prototype,"mobileFullScreen",void 0),ts=to([(0,c.Mo)("w3m-all-wallets-list")],ts),i(70339);let tl=(0,r.iv)`
  wui-grid,
  wui-loading-spinner,
  wui-flex {
    height: 360px;
  }

  wui-grid {
    overflow: scroll;
    scrollbar-width: none;
    grid-auto-rows: min-content;
    grid-template-columns: repeat(auto-fill, 104px);
  }

  :host([data-mobile-fullscreen='true']) wui-grid {
    max-height: none;
    height: auto;
  }

  wui-grid[data-scroll='false'] {
    overflow: hidden;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  wui-loading-spinner {
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 350px) {
    wui-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`;var ta=function(e,t,i,r){var o,n=arguments.length,s=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(o=e[l])&&(s=(n<3?o(s):n>3?o(t,i,s):o(t,i))||s);return n>3&&s&&Object.defineProperty(t,i,s),s};let tc=class extends r.oi{constructor(){super(...arguments),this.prevQuery="",this.prevBadge=void 0,this.loading=!0,this.mobileFullScreen=s.OptionsController.state.enableMobileFullScreen,this.query=""}render(){return this.mobileFullScreen&&this.setAttribute("data-mobile-fullscreen","true"),this.onSearch(),this.loading?(0,r.dy)`<wui-loading-spinner color="accent-primary"></wui-loading-spinner>`:this.walletsTemplate()}async onSearch(){(this.query.trim()!==this.prevQuery.trim()||this.badge!==this.prevBadge)&&(this.prevQuery=this.query,this.prevBadge=this.badge,this.loading=!0,await l.ApiController.searchWallet({search:this.query,badge:this.badge}),this.loading=!1)}walletsTemplate(){let{search:e}=l.ApiController.state,t=e9.J.markWalletsAsInstalled(e);return e.length?(0,r.dy)`
      <wui-grid
        data-testid="wallet-list"
        .padding=${["0","3","3","3"]}
        rowGap="4"
        columngap="2"
        justifyContent="space-between"
      >
        ${t.map((e,t)=>(0,r.dy)`
            <w3m-all-wallets-list-item
              @click=${()=>this.onConnectWallet(e)}
              .wallet=${e}
              data-testid="wallet-search-item-${e.id}"
              explorerId=${e.id}
              certified=${"certified"===this.badge}
              walletQuery=${this.query}
              displayIndex=${t}
            ></w3m-all-wallets-list-item>
          `)}
      </wui-grid>
    `:(0,r.dy)`
        <wui-flex
          data-testid="no-wallet-found"
          justifyContent="center"
          alignItems="center"
          gap="3"
          flexDirection="column"
        >
          <wui-icon-box size="lg" color="default" icon="wallet"></wui-icon-box>
          <wui-text data-testid="no-wallet-found-text" color="secondary" variant="md-medium">
            No Wallet found
          </wui-text>
        </wui-flex>
      `}onConnectWallet(e){u.ConnectorController.selectWalletConnector(e)}};tc.styles=tl,ta([(0,o.SB)()],tc.prototype,"loading",void 0),ta([(0,o.SB)()],tc.prototype,"mobileFullScreen",void 0),ta([(0,o.Cb)()],tc.prototype,"query",void 0),ta([(0,o.Cb)()],tc.prototype,"badge",void 0),tc=ta([(0,c.Mo)("w3m-all-wallets-search")],tc);var th=function(e,t,i,r){var o,n=arguments.length,s=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(o=e[l])&&(s=(n<3?o(s):n>3?o(t,i,s):o(t,i))||s);return n>3&&s&&Object.defineProperty(t,i,s),s};let td=class extends r.oi{constructor(){super(...arguments),this.search="",this.badge=void 0,this.onDebouncedSearch=n.j.debounce(e=>{this.search=e})}render(){let e=this.search.length>=2;return(0,r.dy)`
      <wui-flex .padding=${["1","3","3","3"]} gap="2" alignItems="center">
        <wui-search-bar @inputChange=${this.onInputChange.bind(this)}></wui-search-bar>
        <wui-certified-switch
          ?checked=${"certified"===this.badge}
          @certifiedSwitchChange=${this.onCertifiedSwitchChange.bind(this)}
          data-testid="wui-certified-switch"
        ></wui-certified-switch>
        ${this.qrButtonTemplate()}
      </wui-flex>
      ${e||this.badge?(0,r.dy)`<w3m-all-wallets-search
            query=${this.search}
            .badge=${this.badge}
          ></w3m-all-wallets-search>`:(0,r.dy)`<w3m-all-wallets-list .badge=${this.badge}></w3m-all-wallets-list>`}
    `}onInputChange(e){this.onDebouncedSearch(e.detail)}onCertifiedSwitchChange(e){e.detail?(this.badge="certified",R.SnackController.showSvg("Only WalletConnect certified",{icon:"walletConnectBrown",iconColor:"accent-100"})):this.badge=void 0}qrButtonTemplate(){return n.j.isMobile()?(0,r.dy)`
        <wui-icon-box
          size="xl"
          iconSize="xl"
          color="accent-primary"
          icon="qrCode"
          border
          borderColor="wui-accent-glass-010"
          @click=${this.onWalletConnectQr.bind(this)}
        ></wui-icon-box>
      `:null}onWalletConnectQr(){g.RouterController.push("ConnectingWalletConnect")}};th([(0,o.SB)()],td.prototype,"search",void 0),th([(0,o.SB)()],td.prototype,"badge",void 0),td=th([(0,c.Mo)("w3m-all-wallets-view")],td);let tu=(0,O.iv)`
  :host {
    width: 100%;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${({spacing:e})=>e[3]};
    width: 100%;
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    border-radius: ${({borderRadius:e})=>e[4]};
    transition:
      background-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      scale ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color, scale;
  }

  wui-text {
    text-transform: capitalize;
  }

  wui-image {
    color: ${({tokens:e})=>e.theme.textPrimary};
  }

  @media (hover: hover) {
    button:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    }
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;var tp=function(e,t,i,r){var o,n=arguments.length,s=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(o=e[l])&&(s=(n<3?o(s):n>3?o(t,i,s):o(t,i))||s);return n>3&&s&&Object.defineProperty(t,i,s),s};let tf=class extends r.oi{constructor(){super(...arguments),this.imageSrc="google",this.loading=!1,this.disabled=!1,this.rightIcon=!0,this.rounded=!1,this.fullSize=!1}render(){return this.dataset.rounded=this.rounded?"true":"false",(0,r.dy)`
      <button
        ?disabled=${!!this.loading||!!this.disabled}
        data-loading=${this.loading}
        tabindex=${(0,h.o)(this.tabIdx)}
      >
        <wui-flex gap="2" alignItems="center">
          ${this.templateLeftIcon()}
          <wui-flex gap="1">
            <slot></slot>
          </wui-flex>
        </wui-flex>
        ${this.templateRightIcon()}
      </button>
    `}templateLeftIcon(){return this.icon?(0,r.dy)`<wui-image
        icon=${this.icon}
        iconColor=${(0,h.o)(this.iconColor)}
        ?boxed=${!0}
        ?rounded=${this.rounded}
      ></wui-image>`:(0,r.dy)`<wui-image
      ?boxed=${!0}
      ?rounded=${this.rounded}
      ?fullSize=${this.fullSize}
      src=${this.imageSrc}
    ></wui-image>`}templateRightIcon(){return this.rightIcon?this.loading?(0,r.dy)`<wui-loading-spinner size="md" color="accent-primary"></wui-loading-spinner>`:(0,r.dy)`<wui-icon name="chevronRight" size="lg" color="default"></wui-icon>`:null}};tf.styles=[P.ET,P.ZM,tu],tp([(0,o.Cb)()],tf.prototype,"imageSrc",void 0),tp([(0,o.Cb)()],tf.prototype,"icon",void 0),tp([(0,o.Cb)()],tf.prototype,"iconColor",void 0),tp([(0,o.Cb)({type:Boolean})],tf.prototype,"loading",void 0),tp([(0,o.Cb)()],tf.prototype,"tabIdx",void 0),tp([(0,o.Cb)({type:Boolean})],tf.prototype,"disabled",void 0),tp([(0,o.Cb)({type:Boolean})],tf.prototype,"rightIcon",void 0),tp([(0,o.Cb)({type:Boolean})],tf.prototype,"rounded",void 0),tp([(0,o.Cb)({type:Boolean})],tf.prototype,"fullSize",void 0),tf=tp([(0,S.M)("wui-list-item")],tf);let tg=class extends r.oi{constructor(){super(...arguments),this.wallet=g.RouterController.state.data?.wallet}render(){if(!this.wallet)throw Error("w3m-downloads-view");return(0,r.dy)`
      <wui-flex gap="2" flexDirection="column" .padding=${["3","3","4","3"]}>
        ${this.chromeTemplate()} ${this.iosTemplate()} ${this.androidTemplate()}
        ${this.homepageTemplate()}
      </wui-flex>
    `}chromeTemplate(){return this.wallet?.chrome_store?(0,r.dy)`<wui-list-item
      variant="icon"
      icon="chromeStore"
      iconVariant="square"
      @click=${this.onChromeStore.bind(this)}
      chevron
    >
      <wui-text variant="md-medium" color="primary">Chrome Extension</wui-text>
    </wui-list-item>`:null}iosTemplate(){return this.wallet?.app_store?(0,r.dy)`<wui-list-item
      variant="icon"
      icon="appStore"
      iconVariant="square"
      @click=${this.onAppStore.bind(this)}
      chevron
    >
      <wui-text variant="md-medium" color="primary">iOS App</wui-text>
    </wui-list-item>`:null}androidTemplate(){return this.wallet?.play_store?(0,r.dy)`<wui-list-item
      variant="icon"
      icon="playStore"
      iconVariant="square"
      @click=${this.onPlayStore.bind(this)}
      chevron
    >
      <wui-text variant="md-medium" color="primary">Android App</wui-text>
    </wui-list-item>`:null}homepageTemplate(){return this.wallet?.homepage?(0,r.dy)`
      <wui-list-item
        variant="icon"
        icon="browser"
        iconVariant="square-blue"
        @click=${this.onHomePage.bind(this)}
        chevron
      >
        <wui-text variant="md-medium" color="primary">Website</wui-text>
      </wui-list-item>
    `:null}openStore(e){e.href&&this.wallet&&(f.X.sendEvent({type:"track",event:"GET_WALLET",properties:{name:this.wallet.name,walletRank:this.wallet.order,explorerId:this.wallet.id,type:e.type}}),n.j.openHref(e.href,"_blank"))}onChromeStore(){this.wallet?.chrome_store&&this.openStore({href:this.wallet.chrome_store,type:"chrome_store"})}onAppStore(){this.wallet?.app_store&&this.openStore({href:this.wallet.app_store,type:"app_store"})}onPlayStore(){this.wallet?.play_store&&this.openStore({href:this.wallet.play_store,type:"play_store"})}onHomePage(){this.wallet?.homepage&&this.openStore({href:this.wallet.homepage,type:"homepage"})}};tg=function(e,t,i,r){var o,n=arguments.length,s=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(o=e[l])&&(s=(n<3?o(s):n>3?o(t,i,s):o(t,i))||s);return n>3&&s&&Object.defineProperty(t,i,s),s}([(0,c.Mo)("w3m-downloads-view")],tg)}};