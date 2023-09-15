/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/(function(){var M=["require","exports","vs/base/common/platform","vs/base/common/extpath","vs/base/common/strings","vs/base/common/network","vs/base/common/uri","vs/base/common/path","vs/base/common/resources","vs/base/common/types","vs/base/common/errors","vs/workbench/contrib/output/common/outputLinkComputer","vs/editor/common/core/range"],L=function(E){for(var e=[],s=0,m=E.length;s<m;s++)e[s]=M[E[s]];return e};define(M[3],L([0,1,7,2,4,9]),function(E,e,s,m,d,g){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.$Oe=e.$Ne=e.$Me=e.$Le=e.$Ke=e.$Je=e.$Ie=e.$He=e.$Ge=e.$Fe=e.$Ee=e.$De=e.$Ce=e.$Be=e.$Ae=e.$ze=void 0;function w(t){return t===47||t===92}e.$ze=w;function R(t){return t.replace(/[\\/]/g,s.$0b.sep)}e.$Ae=R;function y(t){return t.indexOf("/")===-1&&(t=R(t)),/^[a-zA-Z]:(\/|$)/.test(t)&&(t="/"+t),t}e.$Be=y;function l(t,f=s.$0b.sep){if(!t)return"";const a=t.length,A=t.charCodeAt(0);if(w(A)){if(w(t.charCodeAt(1))&&!w(t.charCodeAt(2))){let P=3;const O=P;for(;P<a&&!w(t.charCodeAt(P));P++);if(O!==P&&!w(t.charCodeAt(P+1))){for(P+=1;P<a;P++)if(w(t.charCodeAt(P)))return t.slice(0,P+1).replace(/[\\/]/g,f)}}return f}else if(c(A)&&t.charCodeAt(1)===58)return w(t.charCodeAt(2))?t.slice(0,2)+f:t.slice(0,2);let C=t.indexOf("://");if(C!==-1){for(C+=3;C<a;C++)if(w(t.charCodeAt(C)))return t.slice(0,C+1)}return""}e.$Ce=l;function u(t){if(!m.$i||!t||t.length<5)return!1;let f=t.charCodeAt(0);if(f!==92||(f=t.charCodeAt(1),f!==92))return!1;let a=2;const A=a;for(;a<t.length&&(f=t.charCodeAt(a),f!==92);a++);return!(A===a||(f=t.charCodeAt(a+1),isNaN(f)||f===92))}e.$De=u;const v=/[\\/:\*\?"<>\|]/g,$=/[\\/]/g,o=/^(con|prn|aux|clock\$|nul|lpt[0-9]|com[0-9])(\.(.*?))?$/i;function n(t,f=m.$i){const a=f?v:$;return!(!t||t.length===0||/^\s+$/.test(t)||(a.lastIndex=0,a.test(t))||f&&o.test(t)||t==="."||t===".."||f&&t[t.length-1]==="."||f&&t.length!==t.trim().length||t.length>255)}e.$Ee=n;function i(t,f,a){const A=t===f;return!a||A?A:!t||!f?!1:(0,d.$Kd)(t,f)}e.$Fe=i;function r(t,f,a,A=s.sep){if(t===f)return!0;if(!t||!f||f.length>t.length)return!1;if(a){if(!(0,d.$Ld)(t,f))return!1;if(f.length===t.length)return!0;let P=f.length;return f.charAt(f.length-1)===A&&P--,t.charAt(P)===A}return f.charAt(f.length-1)!==A&&(f+=A),t.indexOf(f)===0}e.$Ge=r;function c(t){return t>=65&&t<=90||t>=97&&t<=122}e.$He=c;function h(t,f){return m.$i&&t.endsWith(":")&&(t+=s.sep),(0,s.$_b)(t)||(t=(0,s.$ac)(f,t)),t=(0,s.$$b)(t),m.$i?(t=(0,d.$td)(t,s.sep),t.endsWith(":")&&(t+=s.sep)):(t=(0,d.$td)(t,s.sep),t||(t=s.sep)),t}e.$Ie=h;function b(t){const f=(0,s.$$b)(t);return m.$i?t.length>3?!1:V(f)&&(t.length===2||f.charCodeAt(2)===92):f===s.$0b.sep}e.$Je=b;function V(t,f=m.$i){return f?c(t.charCodeAt(0))&&t.charCodeAt(1)===58:!1}e.$Ke=V;function I(t,f=m.$i){return V(t,f)?t[0]:void 0}e.$Le=I;function U(t,f,a){return f.length>t.length?-1:t===f?0:(a&&(t=t.toLowerCase(),f=f.toLowerCase()),t.indexOf(f))}e.$Me=U;function k(t){const f=t.split(":");let a,A,C;for(const P of f){const O=Number(P);(0,g.$le)(O)?A===void 0?A=O:C===void 0&&(C=O):a=a?[a,P].join(":"):P}if(!a)throw new Error("Format for `--goto` should be: `FILE:LINE(:COLUMN)`");return{path:a,line:A!==void 0?A:void 0,column:C!==void 0?C:A!==void 0?1:void 0}}e.$Ne=k;const N="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",T="BDEFGHIJKMOQRSTUVWXYZbdefghijkmoqrstuvwxyz0123456789";function q(t,f,a=8){let A="";for(let P=0;P<a;P++){let O;P===0&&m.$i&&!f&&(a===3||a===4)?O=T:O=N,A+=O.charAt(Math.floor(Math.random()*O.length))}let C;return f?C=`${f}-${A}`:C=A,t?(0,s.$ac)(t,C):C}e.$Oe=q}),define(M[5],L([0,1,10,2,6]),function(E,e,s,m,d){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.COI=e.$Ze=e.$Ye=e.$Xe=e.$We=e.$Ve=e.$Ue=e.$Te=e.$Se=e.Schemas=void 0;var g;(function(l){l.inMemory="inmemory",l.vscode="vscode",l.internal="private",l.walkThrough="walkThrough",l.walkThroughSnippet="walkThroughSnippet",l.http="http",l.https="https",l.file="file",l.mailto="mailto",l.untitled="untitled",l.data="data",l.command="command",l.vscodeRemote="vscode-remote",l.vscodeRemoteResource="vscode-remote-resource",l.vscodeManagedRemoteResource="vscode-managed-remote-resource",l.vscodeUserData="vscode-userdata",l.vscodeCustomEditor="vscode-custom-editor",l.vscodeNotebookCell="vscode-notebook-cell",l.vscodeNotebookCellMetadata="vscode-notebook-cell-metadata",l.vscodeNotebookCellOutput="vscode-notebook-cell-output",l.vscodeInteractiveInput="vscode-interactive-input",l.vscodeSettings="vscode-settings",l.vscodeWorkspaceTrust="vscode-workspace-trust",l.vscodeTerminal="vscode-terminal",l.vscodeChatSesssion="vscode-chat-editor",l.webviewPanel="webview-panel",l.vscodeWebview="vscode-webview",l.extension="extension",l.vscodeFileResource="vscode-file",l.tmp="tmp",l.vsls="vsls",l.vscodeSourceControl="vscode-scm"})(g||(e.Schemas=g={})),e.$Se="vscode-tkn",e.$Te="tkn";class w{constructor(){this.a=Object.create(null),this.b=Object.create(null),this.c=Object.create(null),this.d="http",this.e=null,this.f=`/${g.vscodeRemoteResource}`}setPreferredWebSchema(u){this.d=u}setDelegate(u){this.e=u}setServerRootPath(u){this.f=`${u}/${g.vscodeRemoteResource}`}set(u,v,$){this.a[u]=v,this.b[u]=$}setConnectionToken(u,v){this.c[u]=v}getPreferredWebSchema(){return this.d}rewrite(u){if(this.e)try{return this.e(u)}catch(r){return s.$Y(r),u}const v=u.authority;let $=this.a[v];$&&$.indexOf(":")!==-1&&$.indexOf("[")===-1&&($=`[${$}]`);const o=this.b[v],n=this.c[v];let i=`path=${encodeURIComponent(u.path)}`;return typeof n=="string"&&(i+=`&${e.$Te}=${encodeURIComponent(n)}`),d.URI.from({scheme:m.$o?this.d:g.vscodeRemoteResource,authority:`${$}:${o}`,path:this.f,query:i})}}e.$Ue=new w,e.$Ve="vs/../../extensions",e.$We="vs/../../node_modules",e.$Xe="vs/../../node_modules.asar",e.$Ye="vs/../../node_modules.asar.unpacked";class R{static{this.a="vscode-app"}asBrowserUri(u){const v=this.b(u,E);return this.uriToBrowserUri(v)}uriToBrowserUri(u){return u.scheme===g.vscodeRemote?e.$Ue.rewrite(u):u.scheme===g.file&&(m.$m||m.$p&&m.$g.origin===`${g.vscodeFileResource}://${R.a}`)?u.with({scheme:g.vscodeFileResource,authority:u.authority||R.a,query:null,fragment:null}):u}asFileUri(u){const v=this.b(u,E);return this.uriToFileUri(v)}uriToFileUri(u){return u.scheme===g.vscodeFileResource?u.with({scheme:g.file,authority:u.authority!==R.a?u.authority:null,query:null,fragment:null}):u}b(u,v){return d.URI.isUri(u)?u:d.URI.parse(v.toUrl(u))}}e.$Ze=new R;var y;(function(l){const u=new Map([["1",{"Cross-Origin-Opener-Policy":"same-origin"}],["2",{"Cross-Origin-Embedder-Policy":"require-corp"}],["3",{"Cross-Origin-Opener-Policy":"same-origin","Cross-Origin-Embedder-Policy":"require-corp"}]]);l.CoopAndCoep=Object.freeze(u.get("3"));const v="vscode-coi";function $(n){let i;typeof n=="string"?i=new URL(n).searchParams:n instanceof URL?i=n.searchParams:d.URI.isUri(n)&&(i=new URL(n.toString(!0)).searchParams);const r=i?.get(v);if(r)return u.get(r)}l.getHeadersFromQuery=$;function o(n,i,r){if(!globalThis.crossOriginIsolated)return;const c=i&&r?"3":r?"2":"1";n instanceof URLSearchParams?n.set(v,c):n[v]=c}l.addSearchParam=o})(y||(e.COI=y={}))}),define(M[8],L([0,1,3,5,7,2,4,6]),function(E,e,s,m,d,g,w,R){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.$dg=e.DataUri=e.$cg=e.$bg=e.$ag=e.$_f=e.$$f=e.$0f=e.$9f=e.$8f=e.$7f=e.$6f=e.$5f=e.$4f=e.$3f=e.$2f=e.$1f=e.$Zf=e.$Yf=e.$Xf=e.$Wf=e.$Vf=e.$Uf=e.$Tf=void 0;function y(o){return(0,R.$Re)(o,!0)}e.$Tf=y;class l{constructor(n){this.a=n}compare(n,i,r=!1){return n===i?0:(0,w.$Dd)(this.getComparisonKey(n,r),this.getComparisonKey(i,r))}isEqual(n,i,r=!1){return n===i?!0:!n||!i?!1:this.getComparisonKey(n,r)===this.getComparisonKey(i,r)}getComparisonKey(n,i=!1){return n.with({path:this.a(n)?n.path.toLowerCase():void 0,fragment:i?null:void 0}).toString()}ignorePathCasing(n){return this.a(n)}isEqualOrParent(n,i,r=!1){if(n.scheme===i.scheme){if(n.scheme===m.Schemas.file)return s.$Ge(y(n),y(i),this.a(n))&&n.query===i.query&&(r||n.fragment===i.fragment);if((0,e.$$f)(n.authority,i.authority))return s.$Ge(n.path,i.path,this.a(n),"/")&&n.query===i.query&&(r||n.fragment===i.fragment)}return!1}joinPath(n,...i){return R.URI.joinPath(n,...i)}basenameOrAuthority(n){return(0,e.$3f)(n)||n.authority}basename(n){return d.$0b.basename(n.path)}extname(n){return d.$0b.extname(n.path)}dirname(n){if(n.path.length===0)return n;let i;return n.scheme===m.Schemas.file?i=R.URI.file(d.$dc(y(n))).path:(i=d.$0b.dirname(n.path),n.authority&&i.length&&i.charCodeAt(0)!==47&&(console.error(`dirname("${n.toString})) resulted in a relative path`),i="/")),n.with({path:i})}normalizePath(n){if(!n.path.length)return n;let i;return n.scheme===m.Schemas.file?i=R.URI.file(d.$$b(y(n))).path:i=d.$0b.normalize(n.path),n.with({path:i})}relativePath(n,i){if(n.scheme!==i.scheme||!(0,e.$$f)(n.authority,i.authority))return;if(n.scheme===m.Schemas.file){const h=d.$cc(y(n),y(i));return g.$i?s.$Ae(h):h}let r=n.path||"/";const c=i.path||"/";if(this.a(n)){let h=0;for(const b=Math.min(r.length,c.length);h<b&&!(r.charCodeAt(h)!==c.charCodeAt(h)&&r.charAt(h).toLowerCase()!==c.charAt(h).toLowerCase());h++);r=c.substr(0,h)+r.substr(h)}return d.$0b.relative(r,c)}resolvePath(n,i){if(n.scheme===m.Schemas.file){const r=R.URI.file(d.$bc(y(n),i));return n.with({authority:r.authority,path:r.path})}return i=s.$Be(i),n.with({path:d.$0b.resolve(n.path,i)})}isAbsolutePath(n){return!!n.path&&n.path[0]==="/"}isEqualAuthority(n,i){return n===i||n!==void 0&&i!==void 0&&(0,w.$Kd)(n,i)}hasTrailingPathSeparator(n,i=d.sep){if(n.scheme===m.Schemas.file){const r=y(n);return r.length>s.$Ce(r).length&&r[r.length-1]===i}else{const r=n.path;return r.length>1&&r.charCodeAt(r.length-1)===47&&!/^[a-zA-Z]:(\/$|\\$)/.test(n.fsPath)}}removeTrailingPathSeparator(n,i=d.sep){return(0,e.$_f)(n,i)?n.with({path:n.path.substr(0,n.path.length-1)}):n}addTrailingPathSeparator(n,i=d.sep){let r=!1;if(n.scheme===m.Schemas.file){const c=y(n);r=c!==void 0&&c.length===s.$Ce(c).length&&c[c.length-1]===i}else{i="/";const c=n.path;r=c.length===1&&c.charCodeAt(c.length-1)===47}return!r&&!(0,e.$_f)(n,i)?n.with({path:n.path+"/"}):n}}e.$Uf=l,e.$Vf=new l(()=>!1),e.$Wf=new l(o=>o.scheme===m.Schemas.file?!g.$k:!0),e.$Xf=new l(o=>!0),e.$Yf=e.$Vf.isEqual.bind(e.$Vf),e.$Zf=e.$Vf.isEqualOrParent.bind(e.$Vf),e.$1f=e.$Vf.getComparisonKey.bind(e.$Vf),e.$2f=e.$Vf.basenameOrAuthority.bind(e.$Vf),e.$3f=e.$Vf.basename.bind(e.$Vf),e.$4f=e.$Vf.extname.bind(e.$Vf),e.$5f=e.$Vf.dirname.bind(e.$Vf),e.$6f=e.$Vf.joinPath.bind(e.$Vf),e.$7f=e.$Vf.normalizePath.bind(e.$Vf),e.$8f=e.$Vf.relativePath.bind(e.$Vf),e.$9f=e.$Vf.resolvePath.bind(e.$Vf),e.$0f=e.$Vf.isAbsolutePath.bind(e.$Vf),e.$$f=e.$Vf.isEqualAuthority.bind(e.$Vf),e.$_f=e.$Vf.hasTrailingPathSeparator.bind(e.$Vf),e.$ag=e.$Vf.removeTrailingPathSeparator.bind(e.$Vf),e.$bg=e.$Vf.addTrailingPathSeparator.bind(e.$Vf);function u(o,n){const i=[];for(let r=0;r<o.length;r++){const c=n(o[r]);o.some((h,b)=>b===r?!1:(0,e.$Zf)(c,n(h)))||i.push(o[r])}return i}e.$cg=u;var v;(function(o){o.META_DATA_LABEL="label",o.META_DATA_DESCRIPTION="description",o.META_DATA_SIZE="size",o.META_DATA_MIME="mime";function n(i){const r=new Map;i.path.substring(i.path.indexOf(";")+1,i.path.lastIndexOf(";")).split(";").forEach(b=>{const[V,I]=b.split(":");V&&I&&r.set(V,I)});const h=i.path.substring(0,i.path.indexOf(";"));return h&&r.set(o.META_DATA_MIME,h),r}o.parseMetaData=n})(v||(e.DataUri=v={}));function $(o,n,i){if(n){let r=o.path;return r&&r[0]!==d.$0b.sep&&(r=d.$0b.sep+r),o.with({scheme:i,authority:n,path:r})}return o.with({scheme:i})}e.$dg=$}),define(M[11],L([0,1,6,3,8,4,12,2,5]),function(E,e,s,m,d,g,w,R,y){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.create=e.OutputLinkComputer=void 0;class l{constructor($,o){this.b=$,this.a=new Map,this.c(o)}c($){const o=$.workspaceFolders.sort((n,i)=>i.length-n.length).map(n=>s.URI.parse(n));for(const n of o){const i=l.createPatterns(n);this.a.set(n,i)}}d($){return this.b.getMirrorModels().find(n=>n.uri.toString()===$)}computeLinks($){const o=this.d($);if(!o)return[];const n=[],i=g.$yd(o.getValue());for(const[r,c]of this.a){const h={toResource:b=>typeof b=="string"?d.$6f(r,b):null};for(let b=0,V=i.length;b<V;b++)n.push(...l.detectLinks(i[b],b+1,c,h))}return n}static createPatterns($){const o=[],n=$.scheme===y.Schemas.file?$.fsPath:$.path,i=[n];R.$i&&$.scheme===y.Schemas.file&&i.push(m.$Ae(n));for(const r of i){const c='[^\\s\\(\\):<>"]',b=`${`(?:${c}| ${c})`}+\\.${c}+`,V=`${c}+`;o.push(new RegExp(g.$od(r)+`(${b}) on line ((\\d+)(, column (\\d+))?)`,"gi")),o.push(new RegExp(g.$od(r)+`(${b}):line ((\\d+)(, column (\\d+))?)`,"gi")),o.push(new RegExp(g.$od(r)+`(${b})(\\s?\\((\\d+)(,(\\d+))?)\\)`,"gi")),o.push(new RegExp(g.$od(r)+`(${V})(:(\\d+))?(:(\\d+))?`,"gi"))}return o}static detectLinks($,o,n,i){const r=[];return n.forEach(c=>{c.lastIndex=0;let h,b=0;for(;(h=c.exec($))!==null;){const V=g.$td(h[1],".").replace(/\\/g,"/");let I;try{const T=i.toResource(V);T&&(I=T.toString())}catch{continue}if(h[3]){const T=h[3];if(h[5]){const q=h[5];I=g.$ld("{0}#{1},{2}",I,T,q)}else I=g.$ld("{0}#{1}",I,T)}const U=g.$td(h[0],"."),k=$.indexOf(U,b);b=k+U.length;const N={startColumn:k+1,startLineNumber:o,endColumn:k+1+U.length,endLineNumber:o};if(r.some(T=>w.$Mr.areIntersectingOrTouching(T.range,N)))return;r.push({range:N,url:I})}}),r}}e.OutputLinkComputer=l;function u(v,$){return new l(v,$)}e.create=u})}).call(this);

//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/1afcd2c22a9d0310393da8b4ffb4eeba3dfdbdc6/core/vs/workbench/contrib/output/common/outputLinkComputer.js.map