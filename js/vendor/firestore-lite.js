var nn=()=>{};var sn=function(e){let t=[],n=0;for(let r=0;r<e.length;r++){let i=e.charCodeAt(r);i<128?t[n++]=i:i<2048?(t[n++]=i>>6|192,t[n++]=i&63|128):(i&64512)===55296&&r+1<e.length&&(e.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(e.charCodeAt(++r)&1023),t[n++]=i>>18|240,t[n++]=i>>12&63|128,t[n++]=i>>6&63|128,t[n++]=i&63|128):(t[n++]=i>>12|224,t[n++]=i>>6&63|128,t[n++]=i&63|128)}return t},Sr=function(e){let t=[],n=0,r=0;for(;n<e.length;){let i=e[n++];if(i<128)t[r++]=String.fromCharCode(i);else if(i>191&&i<224){let s=e[n++];t[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){let s=e[n++],l=e[n++],p=e[n++],m=((i&7)<<18|(s&63)<<12|(l&63)<<6|p&63)-65536;t[r++]=String.fromCharCode(55296+(m>>10)),t[r++]=String.fromCharCode(56320+(m&1023))}else{let s=e[n++],l=e[n++];t[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|l&63)}}return t.join("")},on={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();let n=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<e.length;i+=3){let s=e[i],l=i+1<e.length,p=l?e[i+1]:0,m=i+2<e.length,g=m?e[i+2]:0,I=s>>2,E=(s&3)<<4|p>>4,w=(p&15)<<2|g>>6,S=g&63;m||(S=64,l||(w=64)),r.push(n[I],n[E],n[w],n[S])}return r.join("")},encodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(e):this.encodeByteArray(sn(e),t)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):Sr(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();let n=t?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<e.length;){let s=n[e.charAt(i++)],p=i<e.length?n[e.charAt(i)]:0;++i;let g=i<e.length?n[e.charAt(i)]:64;++i;let E=i<e.length?n[e.charAt(i)]:64;if(++i,s==null||p==null||g==null||E==null)throw new Qt;let w=s<<2|p>>4;if(r.push(w),g!==64){let S=p<<4&240|g>>2;if(r.push(S),E!==64){let D=g<<6&192|E;r.push(D)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}},Qt=class extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}},Dr=function(e){let t=sn(e);return on.encodeByteArray(t,!0)},lt=function(e){return Dr(e).replace(/\./g,"")},an=function(e){try{return on.decodeString(e,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};function Vr(){if(typeof self!="undefined")return self;if(typeof window!="undefined")return window;if(typeof global!="undefined")return global;throw new Error("Unable to locate global object.")}var Rr=()=>Vr().__FIREBASE_DEFAULTS__,Pr=()=>{if(typeof process=="undefined"||typeof process.env=="undefined")return;let e=process.env.__FIREBASE_DEFAULTS__;if(e)return JSON.parse(e)},Cr=()=>{if(typeof document=="undefined")return;let e;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}let t=e&&an(e[1]);return t&&JSON.parse(t)},un=()=>{try{return nn()||Rr()||Pr()||Cr()}catch(e){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);return}},Or=e=>{var t,n;return(n=(t=un())==null?void 0:t.emulatorHosts)==null?void 0:n[e]},cn=e=>{let t=Or(e);if(!t)return;let n=t.lastIndexOf(":");if(n<=0||n+1===t.length)throw new Error(`Invalid host ${t} with no separate hostname and port!`);let r=parseInt(t.substring(n+1),10);return t[0]==="["?[t.substring(1,n-1),r]:[t.substring(0,n),r]},Jt=()=>{var e;return(e=un())==null?void 0:e.config};var vt=class{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((t,n)=>{this.resolve=t,this.reject=n})}wrapCallback(t){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof t=="function"&&(this.promise.catch(()=>{}),t.length===1?t(n):t(n,r))}}};function ln(e,t){if(e.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');let n={alg:"none",type:"JWT"},r=t||"demo-project",i=e.iat||0,s=e.sub||e.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");let l={iss:`https://securetoken.google.com/${r}`,aud:r,iat:i,exp:i+3600,auth_time:i,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}},...e};return[lt(JSON.stringify(n)),lt(JSON.stringify(l)),""].join(".")}function hn(){try{return typeof indexedDB=="object"}catch{return!1}}function fn(){return new Promise((e,t)=>{try{let n=!0,r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),e(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var s;t(((s=i.error)==null?void 0:s.message)||"")}}catch(n){t(n)}})}var kr="FirebaseError",M=class e extends Error{constructor(t,n,r){super(n),this.code=t,this.customData=r,this.name=kr,Object.setPrototypeOf(this,e.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,ht.prototype.create)}},ht=class{constructor(t,n,r){this.service=t,this.serviceName=n,this.errors=r}create(t,...n){let r=n[0]||{},i=`${this.service}/${t}`,s=this.errors[t],l=s?xr(s,r):"Error",p=`${this.serviceName}: ${l} (${i}).`;return new M(i,p,r)}};function xr(e,t){try{let n=0,r="";for(;n<e.length;){let i=e.indexOf("{$",n);if(i===-1){r+=e.substring(n);break}let s=e.indexOf("}",i+2);if(s===-1){r+=e.substring(n);break}let l=e.substring(i+2,s),p=t[l];r+=e.substring(n,i)+(p!=null?String(p):`<${l}?>`),n=s+1}return r}catch{return e}}function J(e,t){if(e===t)return!0;let n=Object.keys(e),r=Object.keys(t);for(let i of n){if(!r.includes(i))return!1;let s=e[i],l=t[i];if(rn(s)&&rn(l)){if(!J(s,l))return!1}else if(s!==l)return!1}for(let i of r)if(!n.includes(i))return!1;return!0}function rn(e){return e!==null&&typeof e=="object"}var ls=14400*1e3;function Y(e){return e&&e._delegate?e._delegate:e}function Yt(e){try{return(e.startsWith("http://")||e.startsWith("https://")?new URL(e).hostname:e).endsWith(".cloudworkstations.dev")}catch{return!1}}async function dn(e){return(await fetch(e,{credentials:"include"})).ok}var U=class{constructor(t,n,r){this.name=t,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(t){return this.instantiationMode=t,this}setMultipleInstances(t){return this.multipleInstances=t,this}setServiceProps(t){return this.serviceProps=t,this}setInstanceCreatedCallback(t){return this.onInstanceCreated=t,this}};var X="[DEFAULT]";var Xt=class{constructor(t,n){this.name=t,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(t){let n=this.normalizeInstanceIdentifier(t);if(!this.instancesDeferred.has(n)){let r=new vt;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{let i=this.getOrInitializeService({instanceIdentifier:n});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(t){var i;let n=this.normalizeInstanceIdentifier(t==null?void 0:t.identifier),r=(i=t==null?void 0:t.optional)!=null?i:!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(s){if(r)return null;throw s}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(t){if(t.name!==this.name)throw Error(`Mismatching Component ${t.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=t,!!this.shouldAutoInitialize()){if(Fr(t))try{this.getOrInitializeService({instanceIdentifier:X})}catch{}for(let[n,r]of this.instancesDeferred.entries()){let i=this.normalizeInstanceIdentifier(n);try{let s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(t=X){this.instancesDeferred.delete(t),this.instancesOptions.delete(t),this.instances.delete(t)}async delete(){let t=Array.from(this.instances.values());await Promise.all([...t.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...t.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(t=X){return this.instances.has(t)}getOptions(t=X){return this.instancesOptions.get(t)||{}}initialize(t={}){let{options:n={}}=t,r=this.normalizeInstanceIdentifier(t.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);let i=this.getOrInitializeService({instanceIdentifier:r,options:n});for(let[s,l]of this.instancesDeferred.entries()){let p=this.normalizeInstanceIdentifier(s);r===p&&l.resolve(i)}return i}onInit(t,n){var l;let r=this.normalizeInstanceIdentifier(n),i=(l=this.onInitCallbacks.get(r))!=null?l:new Set;i.add(t),this.onInitCallbacks.set(r,i);let s=this.instances.get(r);return s&&t(s,r),()=>{i.delete(t)}}invokeOnInitCallbacks(t,n){let r=this.onInitCallbacks.get(n);if(r)for(let i of r)try{i(t,n)}catch{}}getOrInitializeService({instanceIdentifier:t,options:n={}}){let r=this.instances.get(t);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Lr(t),options:n}),this.instances.set(t,r),this.instancesOptions.set(t,n),this.invokeOnInitCallbacks(r,t),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,t,r)}catch{}return r||null}normalizeInstanceIdentifier(t=X){return this.component?this.component.multipleInstances?t:X:t}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}};function Lr(e){return e===X?void 0:e}function Fr(e){return e.instantiationMode==="EAGER"}var Tt=class{constructor(t){this.name=t,this.providers=new Map}addComponent(t){let n=this.getProvider(t.name);if(n.isComponentSet())throw new Error(`Component ${t.name} has already been registered with ${this.name}`);n.setComponent(t)}addOrOverwriteComponent(t){this.getProvider(t.name).isComponentSet()&&this.providers.delete(t.name),this.addComponent(t)}getProvider(t){if(this.providers.has(t))return this.providers.get(t);let n=new Xt(t,this);return this.providers.set(t,n),n}getProviders(){return Array.from(this.providers.values())}};var Mr=[],A;(function(e){e[e.DEBUG=0]="DEBUG",e[e.VERBOSE=1]="VERBOSE",e[e.INFO=2]="INFO",e[e.WARN=3]="WARN",e[e.ERROR=4]="ERROR",e[e.SILENT=5]="SILENT"})(A||(A={}));var Ur={debug:A.DEBUG,verbose:A.VERBOSE,info:A.INFO,warn:A.WARN,error:A.ERROR,silent:A.SILENT},Br=A.INFO,$r={[A.DEBUG]:"log",[A.VERBOSE]:"log",[A.INFO]:"info",[A.WARN]:"warn",[A.ERROR]:"error"},qr=(e,t,...n)=>{if(t<e.logLevel)return;let r=new Date().toISOString(),i=$r[t];if(i)console[i](`[${r}]  ${e.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)},et=class{constructor(t){this.name=t,this._logLevel=Br,this._logHandler=qr,this._userLogHandler=null,Mr.push(this)}get logLevel(){return this._logLevel}set logLevel(t){if(!(t in A))throw new TypeError(`Invalid value "${t}" assigned to \`logLevel\``);this._logLevel=t}setLogLevel(t){this._logLevel=typeof t=="string"?Ur[t]:t}get logHandler(){return this._logHandler}set logHandler(t){if(typeof t!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=t}get userLogHandler(){return this._userLogHandler}set userLogHandler(t){this._userLogHandler=t}debug(...t){this._userLogHandler&&this._userLogHandler(this,A.DEBUG,...t),this._logHandler(this,A.DEBUG,...t)}log(...t){this._userLogHandler&&this._userLogHandler(this,A.VERBOSE,...t),this._logHandler(this,A.VERBOSE,...t)}info(...t){this._userLogHandler&&this._userLogHandler(this,A.INFO,...t),this._logHandler(this,A.INFO,...t)}warn(...t){this._userLogHandler&&this._userLogHandler(this,A.WARN,...t),this._logHandler(this,A.WARN,...t)}error(...t){this._userLogHandler&&this._userLogHandler(this,A.ERROR,...t),this._logHandler(this,A.ERROR,...t)}};var jr=(e,t)=>t.some(n=>e instanceof n),pn,mn;function zr(){return pn||(pn=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Gr(){return mn||(mn=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}var gn=new WeakMap,te=new WeakMap,_n=new WeakMap,Zt=new WeakMap,ne=new WeakMap;function Hr(e){let t=new Promise((n,r)=>{let i=()=>{e.removeEventListener("success",s),e.removeEventListener("error",l)},s=()=>{n(k(e.result)),i()},l=()=>{r(e.error),i()};e.addEventListener("success",s),e.addEventListener("error",l)});return t.then(n=>{n instanceof IDBCursor&&gn.set(n,e)}).catch(()=>{}),ne.set(t,e),t}function Wr(e){if(te.has(e))return;let t=new Promise((n,r)=>{let i=()=>{e.removeEventListener("complete",s),e.removeEventListener("error",l),e.removeEventListener("abort",l)},s=()=>{n(),i()},l=()=>{r(e.error||new DOMException("AbortError","AbortError")),i()};e.addEventListener("complete",s),e.addEventListener("error",l),e.addEventListener("abort",l)});te.set(e,t)}var ee={get(e,t,n){if(e instanceof IDBTransaction){if(t==="done")return te.get(e);if(t==="objectStoreNames")return e.objectStoreNames||_n.get(e);if(t==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return k(e[t])},set(e,t,n){return e[t]=n,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function yn(e){ee=e(ee)}function Kr(e){return e===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...n){let r=e.call(Nt(this),t,...n);return _n.set(r,t.sort?t.sort():[t]),k(r)}:Gr().includes(e)?function(...t){return e.apply(Nt(this),t),k(gn.get(this))}:function(...t){return k(e.apply(Nt(this),t))}}function Qr(e){return typeof e=="function"?Kr(e):(e instanceof IDBTransaction&&Wr(e),jr(e,zr())?new Proxy(e,ee):e)}function k(e){if(e instanceof IDBRequest)return Hr(e);if(Zt.has(e))return Zt.get(e);let t=Qr(e);return t!==e&&(Zt.set(e,t),ne.set(t,e)),t}var Nt=e=>ne.get(e);function wn(e,t,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){let l=indexedDB.open(e,t),p=k(l);return r&&l.addEventListener("upgradeneeded",m=>{r(k(l.result),m.oldVersion,m.newVersion,k(l.transaction),m)}),n&&l.addEventListener("blocked",m=>n(m.oldVersion,m.newVersion,m)),p.then(m=>{s&&m.addEventListener("close",()=>s()),i&&m.addEventListener("versionchange",g=>i(g.oldVersion,g.newVersion,g))}).catch(()=>{}),p}var Jr=["get","getKey","getAll","getAllKeys","count"],Yr=["put","add","delete","clear"],re=new Map;function En(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(re.get(t))return re.get(t);let n=t.replace(/FromIndex$/,""),r=t!==n,i=Yr.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||Jr.includes(n)))return;let s=async function(l,...p){let m=this.transaction(l,i?"readwrite":"readonly"),g=m.store;return r&&(g=g.index(p.shift())),(await Promise.all([g[n](...p),i&&m.done]))[0]};return re.set(t,s),s}yn(e=>({...e,get:(t,n,r)=>En(t,n)||e.get(t,n,r),has:(t,n)=>!!En(t,n)||e.has(t,n)}));var se=class{constructor(t){this.container=t}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(Xr(n)){let r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}};function Xr(e){let t=e.getComponent();return(t==null?void 0:t.type)==="VERSION"}var oe="@firebase/app",bn="0.16.2";var $=new et("@firebase/app"),Zr="@firebase/app-compat",ti="@firebase/analytics-compat",ei="@firebase/analytics",ni="@firebase/app-check-compat",ri="@firebase/app-check",ii="@firebase/auth",si="@firebase/auth-compat",oi="@firebase/database",ai="@firebase/data-connect",ui="@firebase/database-compat",ci="@firebase/functions",li="@firebase/functions-compat",hi="@firebase/installations",fi="@firebase/installations-compat",di="@firebase/messaging",pi="@firebase/messaging-compat",mi="@firebase/performance",gi="@firebase/performance-compat",_i="@firebase/remote-config",yi="@firebase/remote-config-compat",Ei="@firebase/storage",wi="@firebase/storage-compat",bi="@firebase/firestore",Ai="@firebase/ai",Ii="@firebase/firestore-compat",vi="firebase",Ti="12.19.0";var ae="[DEFAULT]",Ni={[oe]:"fire-core",[Zr]:"fire-core-compat",[ei]:"fire-analytics",[ti]:"fire-analytics-compat",[ri]:"fire-app-check",[ni]:"fire-app-check-compat",[ii]:"fire-auth",[si]:"fire-auth-compat",[oi]:"fire-rtdb",[ai]:"fire-data-connect",[ui]:"fire-rtdb-compat",[ci]:"fire-fn",[li]:"fire-fn-compat",[hi]:"fire-iid",[fi]:"fire-iid-compat",[di]:"fire-fcm",[pi]:"fire-fcm-compat",[mi]:"fire-perf",[gi]:"fire-perf-compat",[_i]:"fire-rc",[yi]:"fire-rc-compat",[Ei]:"fire-gcs",[wi]:"fire-gcs-compat",[bi]:"fire-fst",[Ii]:"fire-fst-compat",[Ai]:"fire-vertex","fire-js":"fire-js",[vi]:"fire-js-all"};var St=new Map,Si=new Map,ue=new Map;function An(e,t){try{e.container.addComponent(t)}catch(n){$.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,n)}}function ft(e){let t=e.name;if(ue.has(t))return $.debug(`There were multiple attempts to register component ${t}.`),!1;ue.set(t,e);for(let n of St.values())An(n,e);for(let n of Si.values())An(n,e);return!0}function Nn(e,t){let n=e.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),e.container.getProvider(t)}function Sn(e){return e==null?!1:e.settings!==void 0}var Di={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},B=new ht("app","Firebase",Di);var ce=class{constructor(t,n,r){this._isDeleted=!1,this._options={...t},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new U("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(t){this.checkDestroyed(),this._automaticDataCollectionEnabled=t}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(t){this._isDeleted=t}checkDestroyed(){if(this.isDeleted)throw B.create("app-deleted",{appName:this._name})}};var Dn=Ti;function fe(e,t={}){let n=e;typeof t!="object"&&(t={name:t});let r={name:ae,automaticDataCollectionEnabled:!0,...t},i=r.name;if(typeof i!="string"||!i)throw B.create("bad-app-name",{appName:String(i)});if(n||(n=Jt()),!n)throw B.create("no-options");let s=St.get(i);if(s)if(J(n,s.options)){if(J(r,s.config))return s;throw B.create("duplicate-app",{appName:i,mismatchedParam:"config",oldValue:JSON.stringify(s.config),newValue:JSON.stringify(r)})}else throw B.create("duplicate-app",{appName:i,mismatchedParam:"options",oldValue:JSON.stringify(s.options),newValue:JSON.stringify(n)});let l=new Tt(i);for(let m of ue.values())l.addComponent(m);let p=new ce(n,r,l);return St.set(i,p),p}function Vn(e=ae){let t=St.get(e);if(!t&&e===ae&&Jt())return fe();if(!t)throw B.create("no-app",{appName:e});return t}function z(e,t,n){var l;let r=(l=Ni[e])!=null?l:e;n&&(r+=`-${n}`);let i=r.match(/\s|\//),s=t.match(/\s|\//);if(i||s){let p=[`Unable to register library "${r}" with version "${t}":`];i&&p.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&s&&p.push("and"),s&&p.push(`version name "${t}" contains illegal characters (whitespace or "/")`),$.warn(p.join(" "));return}ft(new U(`${r}-version`,()=>({library:r,version:t}),"VERSION"))}var Vi="firebase-heartbeat-database",Ri=1,dt="firebase-heartbeat-store",ie=null;function Rn(){return ie||(ie=wn(Vi,Ri,{upgrade:(e,t)=>{switch(t){case 0:try{e.createObjectStore(dt)}catch(n){console.warn(n)}}}}).catch(e=>{throw B.create("idb-open",{originalErrorMessage:e.message})})),ie}async function Pi(e){try{let n=(await Rn()).transaction(dt),r=await n.objectStore(dt).get(Pn(e));return await n.done,r}catch(t){if(t instanceof M)$.warn(t.message);else{let n=B.create("idb-get",{originalErrorMessage:t==null?void 0:t.message});$.warn(n.message)}}}async function In(e,t){try{let r=(await Rn()).transaction(dt,"readwrite");await r.objectStore(dt).put(t,Pn(e)),await r.done}catch(n){if(n instanceof M)$.warn(n.message);else{let r=B.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});$.warn(r.message)}}}function Pn(e){return`${e.name}!${e.options.appId}`}var Ci=1024,Oi=30,le=class{constructor(t){this.container=t,this._heartbeatsCache=null;let n=this.container.getProvider("app").getImmediate();this._storage=new he(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var t,n;try{let i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=vn();if(((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)==null?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(l=>l.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats.length>Oi){let l=xi(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(l,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){$.warn(r)}}async getHeartbeatsHeader(){var t;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";let n=vn(),{heartbeatsToSend:r,unsentEntries:i}=ki(this._heartbeatsCache.heartbeats),s=lt(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(n){return $.warn(n),""}}};function vn(){return new Date().toISOString().substring(0,10)}function ki(e,t=Ci){let n=[],r=e.slice();for(let i of e){let s=n.find(l=>l.agent===i.agent);if(s){if(s.dates.push(i.date),Tn(n)>t){s.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),Tn(n)>t){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}var he=class{constructor(t){this.app=t,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return hn()?fn().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){let n=await Pi(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(t){var r;if(await this._canUseIndexedDBPromise){let i=await this.read();return In(this.app,{lastSentHeartbeatDate:(r=t.lastSentHeartbeatDate)!=null?r:i.lastSentHeartbeatDate,heartbeats:t.heartbeats})}else return}async add(t){var r;if(await this._canUseIndexedDBPromise){let i=await this.read();return In(this.app,{lastSentHeartbeatDate:(r=t.lastSentHeartbeatDate)!=null?r:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...t.heartbeats]})}else return}};function Tn(e){return lt(JSON.stringify({version:2,heartbeats:e})).length}function xi(e){if(e.length===0)return-1;let t=0,n=e[0].date;for(let r=1;r<e.length;r++)e[r].date<n&&(n=e[r].date,t=r);return t}function Li(e){ft(new U("platform-logger",t=>new se(t),"PRIVATE")),ft(new U("heartbeat",t=>new le(t),"PRIVATE")),z(oe,bn,e),z(oe,bn,"esm2020"),z("fire-js","")}Li("");var Fi="firebase",Mi="12.19.0";z(Fi,Mi,"app");var Cn=typeof globalThis!="undefined"?globalThis:typeof window!="undefined"?window:typeof global!="undefined"?global:typeof self!="undefined"?self:{},On={};var de,Ui;(function(){var e;function t(c,o){function u(){}u.prototype=o.prototype,c.F=o.prototype,c.prototype=new u,c.prototype.constructor=c,c.D=function(f,h,d){for(var a=Array(arguments.length-2),Q=2;Q<arguments.length;Q++)a[Q-2]=arguments[Q];return o.prototype[h].apply(f,a)}}function n(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}t(r,n),r.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(c,o,u){u||(u=0);let f=Array(16);if(typeof o=="string")for(var h=0;h<16;++h)f[h]=o.charCodeAt(u++)|o.charCodeAt(u++)<<8|o.charCodeAt(u++)<<16|o.charCodeAt(u++)<<24;else for(h=0;h<16;++h)f[h]=o[u++]|o[u++]<<8|o[u++]<<16|o[u++]<<24;o=c.g[0],u=c.g[1],h=c.g[2];let d=c.g[3],a;a=o+(d^u&(h^d))+f[0]+3614090360&4294967295,o=u+(a<<7&4294967295|a>>>25),a=d+(h^o&(u^h))+f[1]+3905402710&4294967295,d=o+(a<<12&4294967295|a>>>20),a=h+(u^d&(o^u))+f[2]+606105819&4294967295,h=d+(a<<17&4294967295|a>>>15),a=u+(o^h&(d^o))+f[3]+3250441966&4294967295,u=h+(a<<22&4294967295|a>>>10),a=o+(d^u&(h^d))+f[4]+4118548399&4294967295,o=u+(a<<7&4294967295|a>>>25),a=d+(h^o&(u^h))+f[5]+1200080426&4294967295,d=o+(a<<12&4294967295|a>>>20),a=h+(u^d&(o^u))+f[6]+2821735955&4294967295,h=d+(a<<17&4294967295|a>>>15),a=u+(o^h&(d^o))+f[7]+4249261313&4294967295,u=h+(a<<22&4294967295|a>>>10),a=o+(d^u&(h^d))+f[8]+1770035416&4294967295,o=u+(a<<7&4294967295|a>>>25),a=d+(h^o&(u^h))+f[9]+2336552879&4294967295,d=o+(a<<12&4294967295|a>>>20),a=h+(u^d&(o^u))+f[10]+4294925233&4294967295,h=d+(a<<17&4294967295|a>>>15),a=u+(o^h&(d^o))+f[11]+2304563134&4294967295,u=h+(a<<22&4294967295|a>>>10),a=o+(d^u&(h^d))+f[12]+1804603682&4294967295,o=u+(a<<7&4294967295|a>>>25),a=d+(h^o&(u^h))+f[13]+4254626195&4294967295,d=o+(a<<12&4294967295|a>>>20),a=h+(u^d&(o^u))+f[14]+2792965006&4294967295,h=d+(a<<17&4294967295|a>>>15),a=u+(o^h&(d^o))+f[15]+1236535329&4294967295,u=h+(a<<22&4294967295|a>>>10),a=o+(h^d&(u^h))+f[1]+4129170786&4294967295,o=u+(a<<5&4294967295|a>>>27),a=d+(u^h&(o^u))+f[6]+3225465664&4294967295,d=o+(a<<9&4294967295|a>>>23),a=h+(o^u&(d^o))+f[11]+643717713&4294967295,h=d+(a<<14&4294967295|a>>>18),a=u+(d^o&(h^d))+f[0]+3921069994&4294967295,u=h+(a<<20&4294967295|a>>>12),a=o+(h^d&(u^h))+f[5]+3593408605&4294967295,o=u+(a<<5&4294967295|a>>>27),a=d+(u^h&(o^u))+f[10]+38016083&4294967295,d=o+(a<<9&4294967295|a>>>23),a=h+(o^u&(d^o))+f[15]+3634488961&4294967295,h=d+(a<<14&4294967295|a>>>18),a=u+(d^o&(h^d))+f[4]+3889429448&4294967295,u=h+(a<<20&4294967295|a>>>12),a=o+(h^d&(u^h))+f[9]+568446438&4294967295,o=u+(a<<5&4294967295|a>>>27),a=d+(u^h&(o^u))+f[14]+3275163606&4294967295,d=o+(a<<9&4294967295|a>>>23),a=h+(o^u&(d^o))+f[3]+4107603335&4294967295,h=d+(a<<14&4294967295|a>>>18),a=u+(d^o&(h^d))+f[8]+1163531501&4294967295,u=h+(a<<20&4294967295|a>>>12),a=o+(h^d&(u^h))+f[13]+2850285829&4294967295,o=u+(a<<5&4294967295|a>>>27),a=d+(u^h&(o^u))+f[2]+4243563512&4294967295,d=o+(a<<9&4294967295|a>>>23),a=h+(o^u&(d^o))+f[7]+1735328473&4294967295,h=d+(a<<14&4294967295|a>>>18),a=u+(d^o&(h^d))+f[12]+2368359562&4294967295,u=h+(a<<20&4294967295|a>>>12),a=o+(u^h^d)+f[5]+4294588738&4294967295,o=u+(a<<4&4294967295|a>>>28),a=d+(o^u^h)+f[8]+2272392833&4294967295,d=o+(a<<11&4294967295|a>>>21),a=h+(d^o^u)+f[11]+1839030562&4294967295,h=d+(a<<16&4294967295|a>>>16),a=u+(h^d^o)+f[14]+4259657740&4294967295,u=h+(a<<23&4294967295|a>>>9),a=o+(u^h^d)+f[1]+2763975236&4294967295,o=u+(a<<4&4294967295|a>>>28),a=d+(o^u^h)+f[4]+1272893353&4294967295,d=o+(a<<11&4294967295|a>>>21),a=h+(d^o^u)+f[7]+4139469664&4294967295,h=d+(a<<16&4294967295|a>>>16),a=u+(h^d^o)+f[10]+3200236656&4294967295,u=h+(a<<23&4294967295|a>>>9),a=o+(u^h^d)+f[13]+681279174&4294967295,o=u+(a<<4&4294967295|a>>>28),a=d+(o^u^h)+f[0]+3936430074&4294967295,d=o+(a<<11&4294967295|a>>>21),a=h+(d^o^u)+f[3]+3572445317&4294967295,h=d+(a<<16&4294967295|a>>>16),a=u+(h^d^o)+f[6]+76029189&4294967295,u=h+(a<<23&4294967295|a>>>9),a=o+(u^h^d)+f[9]+3654602809&4294967295,o=u+(a<<4&4294967295|a>>>28),a=d+(o^u^h)+f[12]+3873151461&4294967295,d=o+(a<<11&4294967295|a>>>21),a=h+(d^o^u)+f[15]+530742520&4294967295,h=d+(a<<16&4294967295|a>>>16),a=u+(h^d^o)+f[2]+3299628645&4294967295,u=h+(a<<23&4294967295|a>>>9),a=o+(h^(u|~d))+f[0]+4096336452&4294967295,o=u+(a<<6&4294967295|a>>>26),a=d+(u^(o|~h))+f[7]+1126891415&4294967295,d=o+(a<<10&4294967295|a>>>22),a=h+(o^(d|~u))+f[14]+2878612391&4294967295,h=d+(a<<15&4294967295|a>>>17),a=u+(d^(h|~o))+f[5]+4237533241&4294967295,u=h+(a<<21&4294967295|a>>>11),a=o+(h^(u|~d))+f[12]+1700485571&4294967295,o=u+(a<<6&4294967295|a>>>26),a=d+(u^(o|~h))+f[3]+2399980690&4294967295,d=o+(a<<10&4294967295|a>>>22),a=h+(o^(d|~u))+f[10]+4293915773&4294967295,h=d+(a<<15&4294967295|a>>>17),a=u+(d^(h|~o))+f[1]+2240044497&4294967295,u=h+(a<<21&4294967295|a>>>11),a=o+(h^(u|~d))+f[8]+1873313359&4294967295,o=u+(a<<6&4294967295|a>>>26),a=d+(u^(o|~h))+f[15]+4264355552&4294967295,d=o+(a<<10&4294967295|a>>>22),a=h+(o^(d|~u))+f[6]+2734768916&4294967295,h=d+(a<<15&4294967295|a>>>17),a=u+(d^(h|~o))+f[13]+1309151649&4294967295,u=h+(a<<21&4294967295|a>>>11),a=o+(h^(u|~d))+f[4]+4149444226&4294967295,o=u+(a<<6&4294967295|a>>>26),a=d+(u^(o|~h))+f[11]+3174756917&4294967295,d=o+(a<<10&4294967295|a>>>22),a=h+(o^(d|~u))+f[2]+718787259&4294967295,h=d+(a<<15&4294967295|a>>>17),a=u+(d^(h|~o))+f[9]+3951481745&4294967295,c.g[0]=c.g[0]+o&4294967295,c.g[1]=c.g[1]+(h+(a<<21&4294967295|a>>>11))&4294967295,c.g[2]=c.g[2]+h&4294967295,c.g[3]=c.g[3]+d&4294967295}r.prototype.v=function(c,o){o===void 0&&(o=c.length);let u=o-this.blockSize,f=this.C,h=this.h,d=0;for(;d<o;){if(h==0)for(;d<=u;)i(this,c,d),d+=this.blockSize;if(typeof c=="string"){for(;d<o;)if(f[h++]=c.charCodeAt(d++),h==this.blockSize){i(this,f),h=0;break}}else for(;d<o;)if(f[h++]=c[d++],h==this.blockSize){i(this,f),h=0;break}}this.h=h,this.o+=o},r.prototype.A=function(){var c=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);c[0]=128;for(var o=1;o<c.length-8;++o)c[o]=0;o=this.o*8;for(var u=c.length-8;u<c.length;++u)c[u]=o&255,o/=256;for(this.v(c),c=Array(16),o=0,u=0;u<4;++u)for(let f=0;f<32;f+=8)c[o++]=this.g[u]>>>f&255;return c};function s(c,o){var u=p;return Object.prototype.hasOwnProperty.call(u,c)?u[c]:u[c]=o(c)}function l(c,o){this.h=o;let u=[],f=!0;for(let h=c.length-1;h>=0;h--){let d=c[h]|0;f&&d==o||(u[h]=d,f=!1)}this.g=u}var p={};function m(c){return-128<=c&&c<128?s(c,function(o){return new l([o|0],o<0?-1:0)}):new l([c|0],c<0?-1:0)}function g(c){if(isNaN(c)||!isFinite(c))return E;if(c<0)return T(g(-c));let o=[],u=1;for(let f=0;c>=u;f++)o[f]=c/u|0,u*=4294967296;return new l(o,0)}function I(c,o){if(c.length==0)throw Error("number format error: empty string");if(o=o||10,o<2||36<o)throw Error("radix out of range: "+o);if(c.charAt(0)=="-")return T(I(c.substring(1),o));if(c.indexOf("-")>=0)throw Error('number format error: interior "-" character');let u=g(Math.pow(o,8)),f=E;for(let d=0;d<c.length;d+=8){var h=Math.min(8,c.length-d);let a=parseInt(c.substring(d,d+h),o);h<8?(h=g(Math.pow(o,h)),f=f.j(h).add(g(a))):(f=f.j(u),f=f.add(g(a)))}return f}var E=m(0),w=m(1),S=m(16777216);e=l.prototype,e.m=function(){if(R(this))return-T(this).m();let c=0,o=1;for(let u=0;u<this.g.length;u++){let f=this.i(u);c+=(f>=0?f:4294967296+f)*o,o*=4294967296}return c},e.toString=function(c){if(c=c||10,c<2||36<c)throw Error("radix out of range: "+c);if(D(this))return"0";if(R(this))return"-"+T(this).toString(c);let o=g(Math.pow(c,6));var u=this;let f="";for(;;){let h=It(u,o).g;u=bt(u,h.j(o));let d=((u.g.length>0?u.g[0]:u.h)>>>0).toString(c);if(u=h,D(u))return d+f;for(;d.length<6;)d="0"+d;f=d+f}},e.i=function(c){return c<0?0:c<this.g.length?this.g[c]:this.h};function D(c){if(c.h!=0)return!1;for(let o=0;o<c.g.length;o++)if(c.g[o]!=0)return!1;return!0}function R(c){return c.h==-1}e.l=function(c){return c=bt(this,c),R(c)?-1:D(c)?0:1};function T(c){let o=c.g.length,u=[];for(let f=0;f<o;f++)u[f]=~c.g[f];return new l(u,~c.h).add(w)}e.abs=function(){return R(this)?T(this):this},e.add=function(c){let o=Math.max(this.g.length,c.g.length),u=[],f=0;for(let h=0;h<=o;h++){let d=f+(this.i(h)&65535)+(c.i(h)&65535),a=(d>>>16)+(this.i(h)>>>16)+(c.i(h)>>>16);f=a>>>16,d&=65535,a&=65535,u[h]=a<<16|d}return new l(u,u[u.length-1]&-2147483648?-1:0)};function bt(c,o){return c.add(T(o))}e.j=function(c){if(D(this)||D(c))return E;if(R(this))return R(c)?T(this).j(T(c)):T(T(this).j(c));if(R(c))return T(this.j(T(c)));if(this.l(S)<0&&c.l(S)<0)return g(this.m()*c.m());let o=this.g.length+c.g.length,u=[];for(var f=0;f<2*o;f++)u[f]=0;for(f=0;f<this.g.length;f++)for(let h=0;h<c.g.length;h++){let d=this.i(f)>>>16,a=this.i(f)&65535,Q=c.i(h)>>>16,en=c.i(h)&65535;u[2*f+2*h]+=a*en,At(u,2*f+2*h),u[2*f+2*h+1]+=d*en,At(u,2*f+2*h+1),u[2*f+2*h+1]+=a*Q,At(u,2*f+2*h+1),u[2*f+2*h+2]+=d*Q,At(u,2*f+2*h+2)}for(c=0;c<o;c++)u[c]=u[2*c+1]<<16|u[2*c];for(c=o;c<2*o;c++)u[c]=0;return new l(u,0)};function At(c,o){for(;(c[o]&65535)!=c[o];)c[o+1]+=c[o]>>>16,c[o]&=65535,o++}function ct(c,o){this.g=c,this.h=o}function It(c,o){if(D(o))throw Error("division by zero");if(D(c))return new ct(E,E);if(R(c))return o=It(T(c),o),new ct(T(o.g),T(o.h));if(R(o))return o=It(c,T(o)),new ct(T(o.g),o.h);if(c.g.length>30){if(R(c)||R(o))throw Error("slowDivide_ only works with positive integers.");for(var u=w,f=o;f.l(c)<=0;)u=tn(u),f=tn(f);var h=tt(u,1),d=tt(f,1);for(f=tt(f,2),u=tt(u,2);!D(f);){var a=d.add(f);a.l(c)<=0&&(h=h.add(u),d=a),f=tt(f,1),u=tt(u,1)}return o=bt(c,h.j(o)),new ct(h,o)}for(h=E;c.l(o)>=0;){for(u=Math.max(1,Math.floor(c.m()/o.m())),f=Math.ceil(Math.log(u)/Math.LN2),f=f<=48?1:Math.pow(2,f-48),d=g(u),a=d.j(o);R(a)||a.l(c)>0;)u-=f,d=g(u),a=d.j(o);D(d)&&(d=w),h=h.add(d),c=bt(c,a)}return new ct(h,c)}e.B=function(c){return It(this,c).h},e.and=function(c){let o=Math.max(this.g.length,c.g.length),u=[];for(let f=0;f<o;f++)u[f]=this.i(f)&c.i(f);return new l(u,this.h&c.h)},e.or=function(c){let o=Math.max(this.g.length,c.g.length),u=[];for(let f=0;f<o;f++)u[f]=this.i(f)|c.i(f);return new l(u,this.h|c.h)},e.xor=function(c){let o=Math.max(this.g.length,c.g.length),u=[];for(let f=0;f<o;f++)u[f]=this.i(f)^c.i(f);return new l(u,this.h^c.h)};function tn(c){let o=c.g.length+1,u=[];for(let f=0;f<o;f++)u[f]=c.i(f)<<1|c.i(f-1)>>>31;return new l(u,c.h)}function tt(c,o){let u=o>>5;o%=32;let f=c.g.length-u,h=[];for(let d=0;d<f;d++)h[d]=o>0?c.i(d+u)>>>o|c.i(d+u+1)<<32-o:c.i(d+u);return new l(h,c.h)}r.prototype.digest=r.prototype.A,r.prototype.reset=r.prototype.u,r.prototype.update=r.prototype.v,Ui=On.Md5=r,l.prototype.add=l.prototype.add,l.prototype.multiply=l.prototype.j,l.prototype.modulo=l.prototype.B,l.prototype.compare=l.prototype.l,l.prototype.toNumber=l.prototype.m,l.prototype.toString=l.prototype.toString,l.prototype.getBits=l.prototype.i,l.fromNumber=g,l.fromString=I,de=On.Integer=l}).apply(typeof Cn!="undefined"?Cn:typeof self!="undefined"?self:typeof window!="undefined"?window:{});var N=class{constructor(t){this.uid=t}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(t){return t.uid===this.uid}};N.UNAUTHENTICATED=new N(null),N.GOOGLE_CREDENTIALS=new N("google-credentials-uid"),N.FIRST_PARTY=new N("first-party-uid"),N.MOCK_USER=new N("mock-user");var ut="12.19.0";function Wn(e){ut=e}var it=new et("@firebase/firestore");function gt(e,...t){if(it.logLevel<=A.DEBUG){let n=t.map(Qe);it.debug(`Firestore (${ut}): ${e}`,...n)}}function Ke(e,...t){if(it.logLevel<=A.ERROR){let n=t.map(Qe);it.error(`Firestore (${ut}): ${e}`,...n)}}function Kn(e,...t){if(it.logLevel<=A.WARN){let n=t.map(Qe);it.warn(`Firestore (${ut}): ${e}`,...n)}}function Qe(e){if(typeof e=="string")return e;try{return(function(n){return JSON.stringify(n)})(e)}catch{return e}}function v(e,t,n){let r="Unexpected state";typeof t=="string"?r=t:n=t,Qn(e,r,n)}function Qn(e,t,n){let r=`FIRESTORE (${ut}) INTERNAL ASSERTION FAILED: ${t} (ID: ${e.toString(16)})`;if(n!==void 0)try{r+=" CONTEXT: "+JSON.stringify(n)}catch{r+=" CONTEXT: "+n}throw Ke(r),new Error(r)}function Rt(e,t,n,r){let i="Unexpected state";typeof n=="string"?i=n:r=n,e||Qn(t,i,r)}function Bi(e,t){return e}var _={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"},y=class extends M{constructor(t,n){super(t,n),this.code=t,this.message=n,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}};var Pt=class{constructor(t,n){this.user=n,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${t}`)}},_e=class{getToken(){return Promise.resolve(null)}invalidateToken(){}start(t,n){t.enqueueRetryable((()=>n(N.UNAUTHENTICATED)))}shutdown(){}},ye=class{constructor(t){this.token=t,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(t,n){this.changeListener=n,t.enqueueRetryable((()=>n(this.token.user)))}shutdown(){this.changeListener=null}},Ct=class{constructor(t){this.auth=null,t.onInit((n=>{this.auth=n}))}getToken(){return this.auth?this.auth.getToken().then((t=>t?(Rt(typeof t.accessToken=="string",42297,{Z:t}),new Pt(t.accessToken,new N(this.auth.getUid()))):null)):Promise.resolve(null)}invalidateToken(){}start(t,n){}shutdown(){}},Ee=class{constructor(t,n,r){this.ee=t,this.te=n,this.re=r,this.type="FirstParty",this.user=N.FIRST_PARTY,this.ne=new Map}ie(){return this.re?this.re():null}get headers(){this.ne.set("X-Goog-AuthUser",this.ee);let t=this.ie();return t&&this.ne.set("Authorization",t),this.te&&this.ne.set("X-Goog-Iam-Authorization-Token",this.te),this.ne}},we=class{constructor(t,n,r){this.ee=t,this.te=n,this.re=r}getToken(){return Promise.resolve(new Ee(this.ee,this.te,this.re))}start(t,n){t.enqueueRetryable((()=>n(N.FIRST_PARTY)))}shutdown(){}invalidateToken(){}},Ot=class{constructor(t){this.value=t,this.type="AppCheck",this.headers=new Map,t&&t.length>0&&this.headers.set("x-firebase-appcheck",this.value)}},kt=class{constructor(t,n){this.se=n,this.appCheck=null,this.oe=null,Sn(t)&&t.settings.appCheckToken&&(this.oe=t.settings.appCheckToken),n.onInit((r=>{this.appCheck=r}))}getToken(){return this.oe?Promise.resolve(new Ot(this.oe)):this.appCheck?this.appCheck.getToken().then((t=>t?(Rt(typeof t.token=="string",3470,{tokenResult:t}),new Ot(t.token)):null)):Promise.resolve(null)}invalidateToken(){}start(t,n){}shutdown(){}};var be=class{constructor(t,n,r,i,s,l,p,m,g,I,E,w,S){this.databaseId=t,this.appId=n,this.persistenceKey=r,this.host=i,this.ssl=s,this.forceLongPolling=l,this.autoDetectLongPolling=p,this.longPollingOptions=m,this.useFetchStreams=g,this.isUsingEmulator=I,this.apiKey=E,this._customHeaders=w,this.grpcFlowControlWindow=S}},Ae="(default)",Ie=class e{constructor(t,n){this.projectId=t,this.database=n||Ae}static empty(){return new e("","")}get isDefaultDatabase(){return this.database===Ae}isEqual(t){return t instanceof e&&t.projectId===this.projectId&&t.database===this.database}};function Jn(e,t){if(!Object.prototype.hasOwnProperty.apply(e.options,["projectId"]))throw new y(_.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Ie(e.options.projectId,t)}function $i(e){let t=typeof self!="undefined"&&(self.crypto||self.msCrypto),n=new Uint8Array(e);if(t&&typeof t.getRandomValues=="function")t.getRandomValues(n);else for(let r=0;r<e;r++)n[r]=Math.floor(256*Math.random());return n}var ve=class{static newId(){let t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=62*Math.floor(4.129032258064516),r="";for(;r.length<20;){let i=$i(40);for(let s=0;s<i.length;++s)r.length<20&&i[s]<n&&(r+=t.charAt(i[s]%62))}return r}};function W(e,t){return e<t?-1:e>t?1:0}function qi(e,t){let n=Math.min(e.length,t.length);for(let r=0;r<n;r++){let i=e.charAt(r),s=t.charAt(r);if(i!==s)return pe(i)===pe(s)?W(i,s):pe(i)?1:-1}return W(e.length,t.length)}var ji=55296,zi=57343;function pe(e){let t=e.charCodeAt(0);return t>=ji&&t<=zi}function Yn(e,t,n){return e.length===t.length&&e.every(((r,i)=>n(r,t[i])))}var kn="__name__",xt=class e{constructor(t,n,r){n===void 0?n=0:n>t.length&&v(637,{offset:n,range:t.length}),r===void 0?r=t.length-n:r>t.length-n&&v(1746,{length:r,range:t.length-n}),this.segments=t,this.offset=n,this.len=r}get length(){return this.len}isEqual(t){return e.comparator(this,t)===0}child(t){let n=this.segments.slice(this.offset,this.limit());return t instanceof e?t.forEach((r=>{n.push(r)})):n.push(t),this.construct(n)}limit(){return this.offset+this.length}popFirst(t){return t=t===void 0?1:t,this.construct(this.segments,this.offset+t,this.length-t)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(t){return this.segments[this.offset+t]}isEmpty(){return this.length===0}isPrefixOf(t){if(t.length<this.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==t.get(n))return!1;return!0}isImmediateParentOf(t){if(this.length+1!==t.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==t.get(n))return!1;return!0}forEach(t){for(let n=this.offset,r=this.limit();n<r;n++)t(this.segments[n])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(t,n){let r=Math.min(t.length,n.length);for(let i=0;i<r;i++){let s=e.compareSegments(t.get(i),n.get(i));if(s!==0)return s}return W(t.length,n.length)}static compareSegments(t,n){let r=e.isNumericId(t),i=e.isNumericId(n);return r&&!i?-1:!r&&i?1:r&&i?e.extractNumericId(t).compare(e.extractNumericId(n)):qi(t,n)}static isNumericId(t){return t.startsWith("__id")&&t.endsWith("__")}static extractNumericId(t){return de.fromString(t.substring(4,t.length-2))}},V=class e extends xt{construct(t,n,r){return new e(t,n,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toStringWithLeadingSlash(){return`/${this.canonicalString()}`}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...t){let n=[];for(let r of t){if(r.indexOf("//")>=0)throw new y(_.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);n.push(...r.split("/").filter((i=>i.length>0)))}return new e(n)}static emptyPath(){return new e([])}},Gi=/^[_a-zA-Z][_a-zA-Z0-9]*$/,_t=class nt extends xt{construct(t,n,r){return new nt(t,n,r)}static isValidIdentifier(t){return Gi.test(t)}canonicalString(){return this.toArray().map((t=>(t=t.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),nt.isValidIdentifier(t)||(t="`"+t+"`"),t))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===kn}static keyField(){return new nt([kn])}static fromServerFormat(t){let n=[],r="",i=0,s=()=>{if(r.length===0)throw new y(_.INVALID_ARGUMENT,`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);n.push(r),r=""},l=!1;for(;i<t.length;){let p=t[i];if(p==="\\"){if(i+1===t.length)throw new y(_.INVALID_ARGUMENT,"Path has trailing escape character: "+t);let m=t[i+1];if(m!=="\\"&&m!=="."&&m!=="`")throw new y(_.INVALID_ARGUMENT,"Path has invalid escape sequence: "+t);r+=m,i+=2}else p==="`"?(l=!l,i++):p!=="."||l?(r+=p,i++):(s(),i++)}if(s(),l)throw new y(_.INVALID_ARGUMENT,"Unterminated ` in path: "+t);return new nt(n)}static emptyPath(){return new nt([])}};var j=class e{constructor(t){this.path=t}static fromPath(t){return new e(V.fromString(t))}static fromName(t){return new e(V.fromString(t).popFirst(5))}static empty(){return new e(V.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(t){return this.path.length>=2&&this.path.get(this.path.length-2)===t}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(t){return t!==null&&V.comparator(this.path,t.path)===0}toString(){return this.path.toString()}static comparator(t,n){return V.comparator(t.path,n.path)}static isDocumentKey(t){return t.length%2==0}static fromSegments(t){return new e(new V(t.slice()))}};function Xn(e,t,n){if(!n)throw new y(_.INVALID_ARGUMENT,`Function ${e}() cannot be called with an empty ${t}.`)}function xn(e){if(!j.isDocumentKey(e))throw new y(_.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${e} has ${e.length}.`)}function Ln(e){if(j.isDocumentKey(e))throw new y(_.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${e} has ${e.length}.`)}function Zn(e){return typeof e=="object"&&e!==null&&(Object.getPrototypeOf(e)===Object.prototype||Object.getPrototypeOf(e)===null)}function Je(e){if(e===void 0)return"undefined";if(e===null)return"null";if(typeof e=="string")return e.length>20&&(e=`${e.substring(0,20)}...`),JSON.stringify(e);if(typeof e=="number"||typeof e=="boolean")return""+e;if(typeof e=="object"){if(e instanceof Array)return"an array";{let t=(function(r){return r.constructor?r.constructor.name:null})(e);return t?`a custom ${t} object`:"an object"}}return typeof e=="function"?"a function":v(12329,{type:typeof e})}function Ye(e,t){if("_delegate"in e&&(e=e._delegate),!(e instanceof t)){if(t.name===e.constructor.name)throw new y(_.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{let n=Je(e);throw new y(_.INVALID_ARGUMENT,`Expected type '${t.name}', but it was: ${n}`)}}return e}function tr(e){let t={};return e.timeoutSeconds!==void 0&&(t.timeoutSeconds=e.timeoutSeconds),t}var Dt=null;function Hi(){return Dt===null?Dt=(function(){return 268435456+Math.round(2147483648*Math.random())})():Dt++,"0x"+Dt.toString(16)}function Lt(e){return e===0&&1/e==-1/0}var me="RestConnection",Wi={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"},Te=class{get ae(){return!1}constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;let n=t.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.ue=n+"://"+t.host,this._e=`projects/${r}/databases/${i}`,this.ce=this.databaseId.database===Ae?`project_id=${r}`:`project_id=${r}&database_id=${i}`}le(t,n,r,i,s){let l=Hi(),p=this.he(t,n.toUriEncodedString());gt(me,`Sending RPC '${t}' ${l}:`,p,r);let m={"google-cloud-resource-prefix":this._e,"x-goog-request-params":this.ce};this.fe(m,i,s);let{host:g}=new URL(p),I=Yt(g);return this.me(t,p,m,r,I).then((E=>(gt(me,`Received RPC '${t}' ${l}: `,E),E)),(E=>{throw Kn(me,`RPC '${t}' ${l} failed with error: `,E,"url: ",p,"request:",r),E}))}de(t,n,r,i,s,l){return this.le(t,n,r,i,s)}fe(t,n,r){if(t["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+ut})(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),n&&n.headers.forEach(((i,s)=>t[s]=i)),r&&r.headers.forEach(((i,s)=>t[s]=i)),this.databaseInfo._customHeaders)for(let i of Object.keys(this.databaseInfo._customHeaders))t[i]=this.databaseInfo._customHeaders[i]}he(t,n){let r=Wi[t],i=`${this.ue}/v1/${n}:${r}`;return this.databaseInfo.apiKey&&(i=`${i}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),i}terminate(){}};var Fn,b;function Mn(e){if(e===void 0)return Ke("RPC_ERROR","HTTP error has no status"),_.UNKNOWN;switch(e){case 200:return _.OK;case 400:return _.FAILED_PRECONDITION;case 401:return _.UNAUTHENTICATED;case 403:return _.PERMISSION_DENIED;case 404:return _.NOT_FOUND;case 409:return _.ABORTED;case 416:return _.OUT_OF_RANGE;case 429:return _.RESOURCE_EXHAUSTED;case 499:return _.CANCELLED;case 500:return _.UNKNOWN;case 501:return _.UNIMPLEMENTED;case 503:return _.UNAVAILABLE;case 504:return _.DEADLINE_EXCEEDED;default:return e>=200&&e<300?_.OK:e>=400&&e<500?_.FAILED_PRECONDITION:e>=500&&e<600?_.INTERNAL:_.UNKNOWN}}(b=Fn||(Fn={}))[b.OK=0]="OK",b[b.CANCELLED=1]="CANCELLED",b[b.UNKNOWN=2]="UNKNOWN",b[b.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",b[b.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",b[b.NOT_FOUND=5]="NOT_FOUND",b[b.ALREADY_EXISTS=6]="ALREADY_EXISTS",b[b.PERMISSION_DENIED=7]="PERMISSION_DENIED",b[b.UNAUTHENTICATED=16]="UNAUTHENTICATED",b[b.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",b[b.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",b[b.ABORTED=10]="ABORTED",b[b.OUT_OF_RANGE=11]="OUT_OF_RANGE",b[b.UNIMPLEMENTED=12]="UNIMPLEMENTED",b[b.INTERNAL=13]="INTERNAL",b[b.UNAVAILABLE=14]="UNAVAILABLE",b[b.DATA_LOSS=15]="DATA_LOSS";var Ne=class extends Te{Ee(t,n){throw new Error("Not supported by FetchConnection")}async me(t,n,r,i,s){var m,g,I;let l=JSON.stringify(i),p;try{let E={method:"POST",headers:r,body:l};s&&(E.credentials="include"),p=await fetch(n,E)}catch(E){let w=E,S=w==null?void 0:w.message,D=w!=null&&w.cause?String(w.cause):void 0,R=(g=(m=S&&D?`${S} (${D})`:S!=null?S:D)!=null?m:w==null?void 0:w.statusText)!=null?g:String(E);throw new y(Mn(w==null?void 0:w.status),`Request failed with error: ${R}`)}if(!p.ok){let E=await p.json();Array.isArray(E)&&(E=E[0]);let w=(I=E==null?void 0:E.error)==null?void 0:I.message;throw new y(Mn(p.status),`Request failed with error: ${w!=null?w:p.statusText}`)}return p.json()}};function Un(e){let t=0;for(let n in e)Object.prototype.hasOwnProperty.call(e,n)&&t++;return t}function Xe(e,t){for(let n in e)Object.prototype.hasOwnProperty.call(e,n)&&t(n,e[n])}var Se=class extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}};var K=class e{constructor(t){this.binaryString=t}static fromBase64String(t){let n=(function(i){try{return atob(i)}catch(s){throw typeof DOMException!="undefined"&&s instanceof DOMException?new Se("Invalid base64 string: "+s):s}})(t);return new e(n)}static fromUint8Array(t){let n=(function(i){let s="";for(let l=0;l<i.length;++l)s+=String.fromCharCode(i[l]);return s})(t);return new e(n)}[Symbol.iterator](){let t=0;return{next:()=>t<this.binaryString.length?{value:this.binaryString.charCodeAt(t++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(n){return btoa(n)})(this.binaryString)}toUint8Array(){return(function(n){let r=new Uint8Array(n.length);for(let i=0;i<n.length;i++)r[i]=n.charCodeAt(i);return r})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(t){return W(this.binaryString,t.binaryString)}isEqual(t){return this.binaryString===t.binaryString}};K.EMPTY_BYTE_STRING=new K("");var Ki=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function De(e){if(Rt(!!e,39018),typeof e=="string"){let t=0,n=Ki.exec(e);if(Rt(!!n,46558,{timestamp:e}),n[1]){let i=n[1];i=(i+"000000000").substr(0,9),t=Number(i)}let r=new Date(e);return{seconds:Math.floor(r.getTime()/1e3),nanos:t}}return{seconds:x(e.seconds),nanos:x(e.nanos)}}function x(e){return typeof e=="number"?e:typeof e=="string"?Number(e):0}function Bn(e){return typeof e=="string"?K.fromBase64String(e):K.fromUint8Array(e)}function O(e,t){let n={typeString:e};return t&&(n.value=t),n}function wt(e,t){if(!Zn(e))throw new y(_.INVALID_ARGUMENT,"JSON must be an object");let n;for(let r in t)if(t[r]){let i=t[r].typeString,s="value"in t[r]?{value:t[r].value}:void 0;if(!(r in e)){n=`JSON missing required field: '${r}'`;break}let l=e[r];if(i&&typeof l!==i){n=`JSON field '${r}' must be a ${i}.`;break}if(s!==void 0&&l!==s.value){n=`Expected '${r}' field to equal '${s.value}'`;break}}if(n)throw new y(_.INVALID_ARGUMENT,n);return!0}var $n=-62135596800,qn=1e6,P=class e{static now(){return e.fromMillis(Date.now())}static fromDate(t){return e.fromMillis(t.getTime())}static fromMillis(t){let n=Math.floor(t/1e3),r=Math.floor((t-1e3*n)*qn);return new e(n,r)}static fromInstant(t){if(!t||typeof t.Te!="bigint")throw new y(_.INVALID_ARGUMENT,"Invalid Temporal.Instant object provided.");return e._fromEpochNanoseconds(t.Te)}static _fromEpochNanoseconds(t){let n,r;if(t>=BigInt(0))n=Number(t/BigInt(1000000000)),r=Number(t%BigInt(1000000000));else{let i=t%BigInt(1000000000);i===BigInt(0)?(n=Number(t/BigInt(1000000000)),r=0):(n=Number(t/BigInt(1000000000)-BigInt(1)),r=Number(i+BigInt(1000000000)))}return new e(n,r)}constructor(t,n){if(this.seconds=t,this.nanoseconds=n,n<0)throw new y(_.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(n>=1e9)throw new y(_.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(t<$n)throw new y(_.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t);if(t>=253402300800)throw new y(_.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/qn}toInstant(){if(typeof Temporal=="undefined"||!Temporal.Instant)throw new y(_.FAILED_PRECONDITION,"The Temporal object is not available in the current environment.");let t=BigInt(1000000000)*BigInt(this.seconds)+BigInt(this.nanoseconds);return Temporal.Instant.__PRIVATE_fromEpochNanoseconds(t)}_compareTo(t){return this.seconds===t.seconds?W(this.nanoseconds,t.nanoseconds):W(this.seconds,t.seconds)}isEqual(t){return t.seconds===this.seconds&&t.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:e._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(t){if(wt(t,e._jsonSchema))return new e(t.seconds,t.nanoseconds)}valueOf(){let t=this.seconds-$n;return String(t).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}};P._jsonSchemaVersion="firestore/timestamp/1.0",P._jsonSchema={type:O("string",P._jsonSchemaVersion),seconds:O("number"),nanoseconds:O("number")};function Qi(e){var n,r;return((r=(((n=e==null?void 0:e.mapValue)==null?void 0:n.fields)||{}).__type__)==null?void 0:r.stringValue)==="server_timestamp"}function jn(e){let t=De(e.mapValue.fields.__local_write_time__.timestampValue);return new P(t.seconds,t.nanos)}var er="__type__",Ji="__max__";var nr="__vector__",Yi="value";function zn(e){return"nullValue"in e?0:"booleanValue"in e?1:"integerValue"in e||"doubleValue"in e?2:"timestampValue"in e?3:"stringValue"in e?5:"bytesValue"in e?6:"referenceValue"in e?7:"geoPointValue"in e?8:"arrayValue"in e?9:"mapValue"in e?Qi(e)?4:(function(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue===Ji})(e)?9007199254740991:(function(n){var i,s;return((s=(((i=n==null?void 0:n.mapValue)==null?void 0:i.fields)||{})[er])==null?void 0:s.stringValue)===nr})(e)?10:11:v(28295,{value:e})}function Ve(e,t,n){if(e===t)return!0;let r=zn(e);if(r!==zn(t))return!1;switch(r){case 0:case 9007199254740991:return!0;case 1:return e.booleanValue===t.booleanValue;case 4:return jn(e).isEqual(jn(t));case 3:return(function(s,l){if(typeof s.timestampValue=="string"&&typeof l.timestampValue=="string"&&s.timestampValue.length===l.timestampValue.length)return s.timestampValue===l.timestampValue;let p=De(s.timestampValue),m=De(l.timestampValue);return p.seconds===m.seconds&&p.nanos===m.nanos})(e,t);case 5:return e.stringValue===t.stringValue;case 6:return(function(s,l){return Bn(s.bytesValue).isEqual(Bn(l.bytesValue))})(e,t);case 7:return e.referenceValue===t.referenceValue;case 8:return(function(s,l){return x(s.geoPointValue.latitude)===x(l.geoPointValue.latitude)&&x(s.geoPointValue.longitude)===x(l.geoPointValue.longitude)})(e,t);case 2:return(function(s,l,p){if("integerValue"in s&&"integerValue"in l)return x(s.integerValue)===x(l.integerValue);let m,g;return!("doubleValue"in s)||!("doubleValue"in l)?!1:(m=x(s.doubleValue),g=x(l.doubleValue),m===g?Lt(m)===Lt(g):!!(p===void 0||p.Pe)&&isNaN(m)&&isNaN(g))})(e,t,n);case 9:return Yn(e.arrayValue.values||[],t.arrayValue.values||[],((i,s)=>Ve(i,s,n)));case 10:case 11:return(function(s,l,p){let m=s.mapValue.fields||{},g=l.mapValue.fields||{};if(Un(m)!==Un(g))return!1;for(let I in m)if(m.hasOwnProperty(I)&&(g[I]===void 0||!Ve(m[I],g[I],p)))return!1;return!0})(e,t,n);default:return v(52216,{left:e})}}function ge(e){return!!e&&"mapValue"in e}function pt(e){if(e.geoPointValue)return{geoPointValue:{...e.geoPointValue}};if(e.timestampValue&&typeof e.timestampValue=="object")return{timestampValue:{...e.timestampValue}};if(e.mapValue){let t={mapValue:{fields:{}}};return Xe(e.mapValue.fields,((n,r)=>t.mapValue.fields[n]=pt(r))),t}if(e.arrayValue){let t={arrayValue:{values:[]}};for(let n=0;n<(e.arrayValue.values||[]).length;++n)t.arrayValue.values[n]=pt(e.arrayValue.values[n]);return t}return{...e}}var Re=class e{constructor(t,n){this.comparator=t,this.root=n||L.EMPTY}insert(t,n){return new e(this.comparator,this.root.insert(t,n,this.comparator).copy(null,null,L.BLACK,null,null))}remove(t){return new e(this.comparator,this.root.remove(t,this.comparator).copy(null,null,L.BLACK,null,null))}get(t){let n=this.root;for(;!n.isEmpty();){let r=this.comparator(t,n.key);if(r===0)return n.value;r<0?n=n.left:r>0&&(n=n.right)}return null}indexOf(t){let n=0,r=this.root;for(;!r.isEmpty();){let i=this.comparator(t,r.key);if(i===0)return n+r.left.size;i<0?r=r.left:(n+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(t){return this.root.inorderTraversal(t)}forEach(t){this.inorderTraversal(((n,r)=>(t(n,r),!1)))}toString(){let t=[];return this.inorderTraversal(((n,r)=>(t.push(`${n}:${r}`),!1))),`{${t.join(", ")}}`}reverseTraversal(t){return this.root.reverseTraversal(t)}getIterator(){return new rt(this.root,null,this.comparator,!1)}getIteratorFrom(t){return new rt(this.root,t,this.comparator,!1)}getReverseIterator(){return new rt(this.root,null,this.comparator,!0)}getReverseIteratorFrom(t){return new rt(this.root,t,this.comparator,!0)}},rt=class{constructor(t,n,r,i){this.isReverse=i,this.nodeStack=[];let s=1;for(;!t.isEmpty();)if(s=n?r(t.key,n):1,n&&i&&(s*=-1),s<0)t=this.isReverse?t.left:t.right;else{if(s===0){this.nodeStack.push(t);break}this.nodeStack.push(t),t=this.isReverse?t.right:t.left}}getNext(){let t=this.nodeStack.pop(),n={key:t.key,value:t.value};if(this.isReverse)for(t=t.left;!t.isEmpty();)this.nodeStack.push(t),t=t.right;else for(t=t.right;!t.isEmpty();)this.nodeStack.push(t),t=t.left;return n}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;let t=this.nodeStack[this.nodeStack.length-1];return{key:t.key,value:t.value}}},L=class e{constructor(t,n,r,i,s){this.key=t,this.value=n,this.color=r!=null?r:e.RED,this.left=i!=null?i:e.EMPTY,this.right=s!=null?s:e.EMPTY,this.size=this.left.size+1+this.right.size}copy(t,n,r,i,s){return new e(t!=null?t:this.key,n!=null?n:this.value,r!=null?r:this.color,i!=null?i:this.left,s!=null?s:this.right)}isEmpty(){return!1}inorderTraversal(t){return this.left.inorderTraversal(t)||t(this.key,this.value)||this.right.inorderTraversal(t)}reverseTraversal(t){return this.right.reverseTraversal(t)||t(this.key,this.value)||this.left.reverseTraversal(t)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(t,n,r){let i=this,s=r(t,i.key);return i=s<0?i.copy(null,null,null,i.left.insert(t,n,r),null):s===0?i.copy(null,n,null,null,null):i.copy(null,null,null,null,i.right.insert(t,n,r)),i.fixUp()}removeMin(){if(this.left.isEmpty())return e.EMPTY;let t=this;return t.left.isRed()||t.left.left.isRed()||(t=t.moveRedLeft()),t=t.copy(null,null,null,t.left.removeMin(),null),t.fixUp()}remove(t,n){let r,i=this;if(n(t,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(t,n),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),n(t,i.key)===0){if(i.right.isEmpty())return e.EMPTY;r=i.right.min(),i=i.copy(r.key,r.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(t,n))}return i.fixUp()}isRed(){return this.color}fixUp(){let t=this;return t.right.isRed()&&!t.left.isRed()&&(t=t.rotateLeft()),t.left.isRed()&&t.left.left.isRed()&&(t=t.rotateRight()),t.left.isRed()&&t.right.isRed()&&(t=t.colorFlip()),t}moveRedLeft(){let t=this.colorFlip();return t.right.left.isRed()&&(t=t.copy(null,null,null,null,t.right.rotateRight()),t=t.rotateLeft(),t=t.colorFlip()),t}moveRedRight(){let t=this.colorFlip();return t.left.left.isRed()&&(t=t.rotateRight(),t=t.colorFlip()),t}rotateLeft(){let t=this.copy(null,null,e.RED,null,this.right.left);return this.right.copy(null,null,this.color,t,null)}rotateRight(){let t=this.copy(null,null,e.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,t)}colorFlip(){let t=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,t,n)}checkMaxDepth(){let t=this.check();return Math.pow(2,t)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw v(43730,{key:this.key,value:this.value});if(this.right.isRed())throw v(14113,{key:this.key,value:this.value});let t=this.left.check();if(t!==this.right.check())throw v(27949);return t+(this.isRed()?0:1)}};L.EMPTY=null,L.RED=!0,L.BLACK=!1;L.EMPTY=new class{constructor(){this.size=0}get key(){throw v(57766)}get value(){throw v(16141)}get color(){throw v(16727)}get left(){throw v(29726)}get right(){throw v(36894)}copy(t,n,r,i,s){return this}insert(t,n,r){return new L(t,n)}remove(t,n){return this}isEmpty(){return!0}inorderTraversal(t){return!1}reverseTraversal(t){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};var Pe=class e{constructor(t){this.comparator=t,this.data=new Re(this.comparator)}has(t){return this.data.get(t)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(t){return this.data.indexOf(t)}forEach(t){this.data.inorderTraversal(((n,r)=>(t(n),!1)))}forEachInRange(t,n){let r=this.data.getIteratorFrom(t[0]);for(;r.hasNext();){let i=r.getNext();if(this.comparator(i.key,t[1])>=0)return;n(i.key)}}forEachWhile(t,n){let r;for(r=n!==void 0?this.data.getIteratorFrom(n):this.data.getIterator();r.hasNext();)if(!t(r.getNext().key))return}firstAfterOrEqual(t){let n=this.data.getIteratorFrom(t);return n.hasNext()?n.getNext().key:null}getIterator(){return new Ft(this.data.getIterator())}getIteratorFrom(t){return new Ft(this.data.getIteratorFrom(t))}add(t){return this.copy(this.data.remove(t).insert(t,!0))}delete(t){return this.has(t)?this.copy(this.data.remove(t)):this}isEmpty(){return this.data.isEmpty()}unionWith(t){let n=this;return n.size<t.size&&(n=t,t=this),t.forEach((r=>{n=n.add(r)})),n}isEqual(t){if(!(t instanceof e)||this.size!==t.size)return!1;let n=this.data.getIterator(),r=t.data.getIterator();for(;n.hasNext();){let i=n.getNext().key,s=r.getNext().key;if(this.comparator(i,s)!==0)return!1}return!0}toArray(){let t=[];return this.forEach((n=>{t.push(n)})),t}toString(){let t=[];return this.forEach((n=>t.push(n))),"SortedSet("+t.toString()+")"}copy(t){let n=new e(this.comparator);return n.data=t,n}},Ft=class{constructor(t){this.iter=t}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}};var Mt=class e{constructor(t){this.fields=t,t.sort(_t.comparator)}static empty(){return new e([])}unionWith(t){let n=new Pe(_t.comparator);for(let r of this.fields)n=n.add(r);for(let r of t)n=n.add(r);return new e(n.toArray())}covers(t){for(let n of this.fields)if(n.isPrefixOf(t))return!0;return!1}isEqual(t){return Yn(this.fields,t.fields,((n,r)=>n.isEqual(r)))}};var Ut=class e{constructor(t){this.value=t}static empty(){return new e({mapValue:{}})}field(t){if(t.isEmpty())return this.value;{let n=this.value;for(let r=0;r<t.length-1;++r)if(n=(n.mapValue.fields||{})[t.get(r)],!ge(n))return null;return n=(n.mapValue.fields||{})[t.lastSegment()],n||null}}set(t,n){this.getFieldsMap(t.popLast())[t.lastSegment()]=pt(n)}setAll(t){let n=_t.emptyPath(),r={},i=[];t.forEach(((l,p)=>{if(!n.isImmediateParentOf(p)){let m=this.getFieldsMap(n);this.applyChanges(m,r,i),r={},i=[],n=p.popLast()}l?r[p.lastSegment()]=pt(l):i.push(p.lastSegment())}));let s=this.getFieldsMap(n);this.applyChanges(s,r,i)}delete(t){let n=this.field(t.popLast());ge(n)&&n.mapValue.fields&&delete n.mapValue.fields[t.lastSegment()]}isEqual(t){return Ve(this.value,t.value)}getFieldsMap(t){let n=this.value;n.mapValue.fields||(n.mapValue={fields:{}});for(let r=0;r<t.length;++r){let i=n.mapValue.fields[t.get(r)];ge(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},n.mapValue.fields[t.get(r)]=i),n=i}return n.mapValue.fields}applyChanges(t,n,r){Xe(n,((i,s)=>t[i]=s));for(let i of r)delete t[i]}clone(){return new e(pt(this.value))}};var Ce=class{constructor(t,n=null,r=[],i=[],s=null,l="F",p=null,m=null){this.path=t,this.collectionGroup=n,this.explicitOrderBy=r,this.filters=i,this.limit=s,this.limitType=l,this.startAt=p,this.endAt=m,this.pe=null,this.ye=null,this.we=null,this.startAt,this.endAt}};function rr(e,t){if(e.useProto3Json){if(isNaN(t))return{doubleValue:"NaN"};if(t===1/0)return{doubleValue:"Infinity"};if(t===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Lt(t)?"-0":t}}function Xi(e,t,n){return(function(i){return typeof i=="number"&&Number.isInteger(i)&&!Lt(i)&&i<=Number.MAX_SAFE_INTEGER&&i>=Number.MIN_SAFE_INTEGER})(t)?(function(i){return{integerValue:""+i}})(t):rr(e,t)}var st=class{constructor(){this._=void 0}},Bt=class extends st{},Oe=class extends st{constructor(t){super(),this.elements=t}},ke=class extends st{constructor(t){super(),this.elements=t}},yt=class extends st{constructor(t,n){super(),this.serializer=t,this.ge=n}},xe=class extends yt{},Le=class extends yt{},Fe=class extends yt{};var Me=class{constructor(t,n){this.field=t,this.transform=n}},$t=class e{constructor(t,n){this.updateTime=t,this.exists=n}static none(){return new e}static exists(t){return new e(void 0,t)}static updateTime(t){return new e(t)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(t){return this.exists===t.exists&&(this.updateTime?!!t.updateTime&&this.updateTime.isEqual(t.updateTime):!t.updateTime)}},ot=class{},qt=class extends ot{constructor(t,n,r,i=[]){super(),this.key=t,this.value=n,this.precondition=r,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}},jt=class extends ot{constructor(t,n,r,i,s=[]){super(),this.key=t,this.data=n,this.fieldMask=r,this.precondition=i,this.fieldTransforms=s,this.type=1}getFieldMask(){return this.fieldMask}},zt=class extends ot{constructor(t,n){super(),this.key=t,this.precondition=n,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}},Gt=class extends ot{constructor(t,n){super(),this.key=t,this.precondition=n,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}};var Ue=class{constructor(t,n){this.databaseId=t,this.useProto3Json=n}};function Vt(e,t){return e.useProto3Json?`${new Date(1e3*t.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+t.nanoseconds).slice(-9)}Z`:{seconds:""+t.seconds,nanos:t.nanoseconds}}function Zi(e,t){return e.useProto3Json?t.toBase64():t.toUint8Array()}function ts(e,t){return Vt(e,t.toTimestamp())}function ir(e,t){return Be(e,t).canonicalString()}function Be(e,t){let n=(function(i){return new V(["projects",i.projectId,"databases",i.database])})(e).child("documents");return t===void 0?n:n.child(t)}function $e(e,t){return ir(e.databaseId,t.path)}function Gn(e,t,n){return{name:$e(e,t),fields:n.value.mapValue.fields}}function es(e,t){let n;if(t instanceof qt)n={update:Gn(e,t.key,t.value)};else if(t instanceof zt)n={delete:$e(e,t.key)};else if(t instanceof jt)n={update:Gn(e,t.key,t.data),updateMask:ns(t.fieldMask)};else{if(!(t instanceof Gt))return v(16599,{Fe:t.type});n={verify:$e(e,t.key)}}return t.fieldTransforms.length>0&&(n.updateTransforms=t.fieldTransforms.map((r=>(function(s,l){let p=l.transform;if(p instanceof Bt)return{fieldPath:l.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(p instanceof Oe)return{fieldPath:l.field.canonicalString(),appendMissingElements:{values:p.elements}};if(p instanceof ke)return{fieldPath:l.field.canonicalString(),removeAllFromArray:{values:p.elements}};if(p instanceof xe)return{fieldPath:l.field.canonicalString(),increment:p.ge};if(p instanceof Le)return{fieldPath:l.field.canonicalString(),minimum:p.ge};if(p instanceof Fe)return{fieldPath:l.field.canonicalString(),maximum:p.ge};throw v(20930,{transform:l.transform})})(0,r)))),t.precondition.isNone||(n.currentDocument=(function(i,s){return s.updateTime!==void 0?{updateTime:ts(i,s.updateTime)}:s.exists!==void 0?{exists:s.exists}:v(27497)})(e,t.precondition)),n}function ns(e){let t=[];return e.fields.forEach((n=>t.push(n.canonicalString()))),{fieldPaths:t}}function sr(e){return!!e&&typeof e._toProto=="function"&&e._protoValueType==="ProtoValue"}function Ze(e){return new Ue(e,!0)}var qe=class{},je=class extends qe{constructor(t,n,r,i){super(),this.authCredentials=t,this.appCheckCredentials=n,this.connection=r,this.serializer=i,this.be=!1}De(){if(this.be)throw new y(_.FAILED_PRECONDITION,"The client has already been terminated.")}le(t,n,r,i){return this.De(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([s,l])=>this.connection.le(t,Be(n,r),i,s,l))).catch((s=>{throw s.name==="FirebaseError"?(s.code===_.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),s):new y(_.UNKNOWN,s.toString())}))}de(t,n,r,i,s){return this.De(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([l,p])=>this.connection.de(t,Be(n,r),i,l,p,s))).catch((l=>{throw l.name==="FirebaseError"?(l.code===_.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),l):new y(_.UNKNOWN,l.toString())}))}terminate(){this.be=!0,this.connection.terminate()}};async function or(e,t){let n=Bi(e),r={writes:t.map((i=>es(n.serializer,i)))};await n.le("Commit",n.serializer.databaseId,V.emptyPath(),r)}var ar="ComponentProvider",mt=new Map;function ur(e){if(e._terminated)throw new y(_.FAILED_PRECONDITION,"The client has already been terminated.");if(!mt.has(e)){gt(ar,"Initializing Datastore");let t=(function(s){return new Ne(s)})((function(s,l,p,m,g){return new be(s,l,p,g.host,g.ssl,g.experimentalForceLongPolling,g.experimentalAutoDetectLongPolling,tr(g.experimentalLongPollingOptions),g.useFetchStreams,g.isUsingEmulator,m,g._customHeaders,g.grpcFlowControlWindow)})(e._databaseId,e.app.options.appId||"",e._persistenceKey,e.app.options.apiKey,e._freezeSettings())),n=Ze(e._databaseId),r=(function(s,l,p,m){return new je(s,l,p,m)})(e._authCredentials,e._appCheckCredentials,t,n);mt.set(e,r)}return mt.get(e)}var rs=1048576,cr="firestore.googleapis.com",Hn=!0,Ht=class{constructor(t){var n,r;if(t.host===void 0){if(t.ssl!==void 0)throw new y(_.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=cr,this.ssl=Hn}else this.host=t.host,this.ssl=(n=t.ssl)!=null?n:Hn;if(this.isUsingEmulator=t.emulatorOptions!==void 0,this.credentials=t.credentials,this.ignoreUndefinedProperties=!!t.ignoreUndefinedProperties,this.localCache=t.localCache,t._customHeaders&&(this._customHeaders={...t._customHeaders}),t.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(t.cacheSizeBytes!==-1&&t.cacheSizeBytes<rs)throw new y(_.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=t.cacheSizeBytes}if((function(s,l,p,m){if(l===!0&&m===!0)throw new y(_.INVALID_ARGUMENT,`${s} and ${p} cannot be used together.`)})("experimentalForceLongPolling",t.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",t.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!t.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:t.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!t.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=tr((r=t.experimentalLongPollingOptions)!=null?r:{}),(function(s){if(s.timeoutSeconds!==void 0){if(isNaN(s.timeoutSeconds))throw new y(_.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`);if(s.timeoutSeconds<5)throw new y(_.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`);if(s.timeoutSeconds>30)throw new y(_.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!t.useFetchStreams,t.grpcFlowControlWindow!==void 0){if(typeof t.grpcFlowControlWindow!="number"||t.grpcFlowControlWindow<=0||t.grpcFlowControlWindow>2147483647||!Number.isInteger(t.grpcFlowControlWindow))throw new y(_.INVALID_ARGUMENT,"grpcFlowControlWindow must be a positive integer and cannot exceed 2147483647");this.grpcFlowControlWindow=t.grpcFlowControlWindow}}isEqual(t){return this.host===t.host&&this.ssl===t.ssl&&this.credentials===t.credentials&&this.cacheSizeBytes===t.cacheSizeBytes&&this.experimentalForceLongPolling===t.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===t.experimentalAutoDetectLongPolling&&(function(r,i){return r.timeoutSeconds===i.timeoutSeconds})(this.experimentalLongPollingOptions,t.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===t.ignoreUndefinedProperties&&this.useFetchStreams===t.useFetchStreams&&this.grpcFlowControlWindow===t.grpcFlowControlWindow&&(function(r,i){if(r===i)return!0;if(!r||!i)return!1;let s=Object.keys(r),l=Object.keys(i);if(s.length!==l.length)return!1;for(let p of s)if(r[p]!==i[p])return!1;return!0})(this._customHeaders,t._customHeaders)}},Z=class{constructor(t,n,r,i){this._authCredentials=t,this._appCheckCredentials=n,this._databaseId=r,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Ht({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new y(_.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(t){if(this._settingsFrozen)throw new y(_.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Ht(t),this._emulatorOptions=t.emulatorOptions||{},t.credentials!==void 0&&(this._authCredentials=(function(r){if(!r)return new _e;switch(r.type){case"firstParty":return new we(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new y(_.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(t.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(n){let r=mt.get(n);r&&(gt(ar,"Removing Datastore"),mt.delete(n),r.terminate())})(this),Promise.resolve()}};function lr(e,t){let n=typeof e=="object"?e:Vn(),r=typeof e=="string"?e:t||"(default)",i=Nn(n,"firestore/lite").getImmediate({identifier:r});if(!i._initialized){let s=cn("firestore");s&&hr(i,...s)}return i}function hr(e,t,n,r={}){var g;e=Ye(e,Z);let i=Yt(t),s=e._getSettings(),l={...s,emulatorOptions:e._getEmulatorOptions()},p=`${t}:${n}`;i&&dn(`https://${p}`),s.host!==cr&&s.host!==p&&Kn("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");let m={...s,host:p,ssl:i,emulatorOptions:r};if(!J(m,l)&&(e._setSettings(m),r.mockUserToken)){let I,E;if(typeof r.mockUserToken=="string")I=r.mockUserToken,E=N.MOCK_USER;else{I=ln(r.mockUserToken,(g=e._app)==null?void 0:g.options.projectId);let w=r.mockUserToken.sub||r.mockUserToken.user_id;if(!w)throw new y(_.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");E=new N(w)}e._authCredentials=new ye(new Pt(I,E))}}var Wt=class e{constructor(t,n,r){this.converter=n,this._query=r,this.type="query",this.firestore=t}withConverter(t){return new e(this.firestore,t,this._query)}},C=class e{constructor(t,n,r){this.converter=n,this._key=r,this.type="document",this.firestore=t}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new F(this.firestore,this.converter,this._key.path.popLast())}withConverter(t){return new e(this.firestore,t,this._key)}toJSON(){return{type:e._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(t,n,r){if(wt(n,e._jsonSchema))return new e(t,r||null,new j(V.fromString(n.referencePath)))}};C._jsonSchemaVersion="firestore/documentReference/1.0",C._jsonSchema={type:O("string",C._jsonSchemaVersion),referencePath:O("string")};var F=class e extends Wt{constructor(t,n,r){super(t,n,(function(s){return new Ce(s)})(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){let t=this._path.popLast();return t.isEmpty()?null:new C(this.firestore,null,new j(t))}withConverter(t){return new e(this.firestore,t,this._path)}};function fr(e,t,...n){if(e=Y(e),Xn("collection","path",t),e instanceof Z){let r=V.fromString(t,...n);return Ln(r),new F(e,null,r)}{if(!(e instanceof C||e instanceof F))throw new y(_.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");let r=e._path.child(V.fromString(t,...n));return Ln(r),new F(e.firestore,null,r)}}function dr(e,t,...n){if(e=Y(e),arguments.length===1&&(t=ve.newId()),Xn("doc","path",t),e instanceof Z){let r=V.fromString(t,...n);return xn(r),new C(e,null,new j(r))}{if(!(e instanceof C||e instanceof F))throw new y(_.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");let r=e._path.child(V.fromString(t,...n));return xn(r),new C(e.firestore,e instanceof F?e.converter:null,new j(r))}}var G=class e{constructor(t){this._byteString=t}static fromBase64String(t){try{return new e(K.fromBase64String(t))}catch(n){throw new y(_.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+n)}}static fromUint8Array(t){return new e(K.fromUint8Array(t))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(t){return this._byteString.isEqual(t._byteString)}toJSON(){return{type:e._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(t){if(wt(t,e._jsonSchema))return e.fromBase64String(t.bytes)}};G._jsonSchemaVersion="firestore/bytes/1.0",G._jsonSchema={type:O("string",G._jsonSchemaVersion),bytes:O("string")};var Et=class{constructor(...t){for(let n=0;n<t.length;++n)if(t[n].length===0)throw new y(_.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new _t(t)}isEqual(t){return this._internalPath.isEqual(t._internalPath)}};var at=class{constructor(t){this._methodName=t}};var H=class e{constructor(t,n){if(!isFinite(t)||t<-90||t>90)throw new y(_.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+t);if(!isFinite(n)||n<-180||n>180)throw new y(_.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+n);this._lat=t,this._long=n}get latitude(){return this._lat}get longitude(){return this._long}isEqual(t){return this._lat===t._lat&&this._long===t._long}_compareTo(t){return W(this._lat,t._lat)||W(this._long,t._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:e._jsonSchemaVersion}}static fromJSON(t){if(wt(t,e._jsonSchema))return new e(t.latitude,t.longitude)}};H._jsonSchemaVersion="firestore/geoPoint/1.0",H._jsonSchema={type:O("string",H._jsonSchemaVersion),latitude:O("number"),longitude:O("number")};var q=class e{constructor(t){this._values=(t||[]).map((n=>n))}toArray(){return this._values.map((t=>t))}isEqual(t){return(function(r,i){if(r.length!==i.length)return!1;for(let s=0;s<r.length;++s)if(r[s]!==i[s])return!1;return!0})(this._values,t._values)}toJSON(){return{type:e._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(t){if(wt(t,e._jsonSchema)){if(Array.isArray(t.vectorValues)&&t.vectorValues.every((n=>typeof n=="number")))return new e(t.vectorValues);throw new y(_.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}};q._jsonSchemaVersion="firestore/vectorValue/1.0",q._jsonSchema={type:O("string",q._jsonSchemaVersion),vectorValues:O("object")};var is=/^__.*__$/,ze=class{constructor(t,n,r){this.data=t,this.fieldMask=n,this.fieldTransforms=r}toMutation(t,n){return this.fieldMask!==null?new jt(t,this.data,this.fieldMask,n,this.fieldTransforms):new qt(t,this.data,n,this.fieldTransforms)}};function pr(e){switch(e){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw v(40011,{dataSource:e})}}var Ge=class e{constructor(t,n,r,i,s,l){this.settings=t,this.databaseId=n,this.serializer=r,this.ignoreUndefinedProperties=i,s===void 0&&this.validatePath(),this.fieldTransforms=s||[],this.fieldMask=l||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}contextWith(t){return new e({...this.settings,...t},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}childContextForField(t){var i;let n=(i=this.path)==null?void 0:i.child(t),r=this.contextWith({path:n,arrayElement:!1});return r.validatePathSegment(t),r}childContextForFieldPath(t){var i;let n=(i=this.path)==null?void 0:i.child(t),r=this.contextWith({path:n,arrayElement:!1});return r.validatePath(),r}childContextForArray(t){return this.contextWith({path:void 0,arrayElement:!0})}createError(t){return Kt(t,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(t){return this.fieldMask.find((n=>t.isPrefixOf(n)))!==void 0||this.fieldTransforms.find((n=>t.isPrefixOf(n.field)))!==void 0}validatePath(){if(this.path)for(let t=0;t<this.path.length;t++)this.validatePathSegment(this.path.get(t))}validatePathSegment(t){if(t.length===0)throw this.createError("Document fields must not be empty");if(pr(this.dataSource)&&is.test(t))throw this.createError('Document fields cannot begin and end with "__"')}},He=class{constructor(t,n,r){this.databaseId=t,this.ignoreUndefinedProperties=n,this.serializer=r||Ze(t)}createContext(t,n,r,i=!1){return new Ge({dataSource:t,methodName:n,targetDoc:r,path:_t.emptyPath(),arrayElement:!1,hasConverter:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}};function mr(e){let t=e._freezeSettings(),n=Ze(e._databaseId);return new He(e._databaseId,!!t.ignoreUndefinedProperties,n)}function gr(e,t,n,r,i,s={}){let l=e.createContext(s.merge||s.mergeFields?2:0,t,n,i);br("Data must be an object, but it was:",l,r);let p=yr(r,l),m,g;if(s.merge)m=new Mt(l.fieldMask),g=l.fieldTransforms;else if(s.mergeFields){let I=[];for(let E of s.mergeFields){let w=Ar(t,E,n);if(!l.contains(w))throw new y(_.INVALID_ARGUMENT,`Field '${w}' is specified in your field mask but missing from your input data.`);as(I,w)||I.push(w)}m=new Mt(I),g=l.fieldTransforms.filter((E=>m.covers(E.field)))}else m=null,g=l.fieldTransforms;return new ze(new Ut(p),m,g)}var We=class e extends at{_toFieldTransform(t){return new Me(t.path,new Bt)}isEqual(t){return t instanceof e}};function _r(e,t,n){if(wr(e=Y(e)))return br("Unsupported field value:",t,e),yr(e,t);if(e instanceof at)return(function(i,s){if(!pr(s.dataSource))throw s.createError(`${i._methodName}() can only be used with update() and set()`);if(!s.path)throw s.createError(`${i._methodName}() is not currently supported inside arrays`);let l=i._toFieldTransform(s);l&&s.fieldTransforms.push(l)})(e,t),null;if(e===void 0&&t.ignoreUndefinedProperties)return null;if(t.path&&t.fieldMask.push(t.path),e instanceof Array){if(t.settings.arrayElement&&t.dataSource!==4)throw t.createError("Nested arrays are not supported");return(function(i,s){let l=[],p=0;for(let m of i){let g=_r(m,s.childContextForArray(p));g==null&&(g={nullValue:"NULL_VALUE"}),l.push(g),p++}return{arrayValue:{values:l}}})(e,t)}return(function(i,s,l){if((i=Y(i))===null)return{nullValue:"NULL_VALUE"};if(typeof i=="number")return Xi(s.serializer,i);if(typeof i=="boolean")return{booleanValue:i};if(typeof i=="string")return{stringValue:i};if(i instanceof Date){let p=P.fromDate(i);return{timestampValue:Vt(s.serializer,p)}}if(i instanceof P){let p=new P(i.seconds,1e3*Math.floor(i.nanoseconds/1e3));return{timestampValue:Vt(s.serializer,p)}}if(Er(i)){let p=P.fromInstant(i),m=new P(p.seconds,1e3*Math.floor(p.nanoseconds/1e3));return{timestampValue:Vt(s.serializer,m)}}if(i instanceof H)return{geoPointValue:{latitude:i.latitude,longitude:i.longitude}};if(i instanceof G)return{bytesValue:Zi(s.serializer,i._byteString)};if(i instanceof C){let p=s.databaseId,m=i.firestore._databaseId;if(!m.isEqual(p))throw s.createError(`Document reference is for database ${m.projectId}/${m.database} but should be for database ${p.projectId}/${p.database}`);return{referenceValue:ir(i.firestore._databaseId||s.databaseId,i._key.path)}}if(i instanceof q)return(function(m,g){let I=m instanceof q?m.toArray():m;return{mapValue:{fields:{[er]:{stringValue:nr},[Yi]:{arrayValue:{values:I.map((w=>{if(typeof w!="number")throw g.createError("VectorValues must only contain numeric values.");return rr(g.serializer,w)}))}}}}}})(i,s);if(sr(i))return i._toProto(s.serializer);throw s.createError(`Unsupported field value: ${Je(i)}`)})(e,t)}function yr(e,t){let n={};return(function(i){for(let s in i)if(Object.prototype.hasOwnProperty.call(i,s))return!1;return!0})(e)?t.path&&t.path.length>0&&t.fieldMask.push(t.path):Xe(e,((r,i)=>{let s=_r(i,t.childContextForField(r));s!=null&&(n[r]=s)})),{mapValue:{fields:n}}}function Er(e){if(typeof e!="object"||e===null)return!1;if(typeof Temporal!="undefined"&&typeof Temporal.Instant=="function"&&e instanceof Temporal.Instant)return!0;let t=e;return t[Symbol.toStringTag]==="Temporal.Instant"&&typeof t.Te=="bigint"}function wr(e){return!(typeof e!="object"||e===null||e instanceof Array||e instanceof Date||e instanceof P||e instanceof H||e instanceof G||e instanceof C||e instanceof at||e instanceof q||Er(e)||sr(e))}function br(e,t,n){if(!wr(n)||!Zn(n)){let r=Je(n);throw r==="an object"?t.createError(e+" a custom object"):t.createError(e+" "+r)}}function Ar(e,t,n){if((t=Y(t))instanceof Et)return t._internalPath;if(typeof t=="string")return os(e,t);throw Kt("Field path arguments must be of type string or ",e,!1,void 0,n)}var ss=new RegExp("[~\\*/\\[\\]]");function os(e,t,n){if(t.search(ss)>=0)throw Kt(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,e,!1,void 0,n);try{return new Et(...t.split("."))._internalPath}catch{throw Kt(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,e,!1,void 0,n)}}function Kt(e,t,n,r,i){let s=r&&!r.isEmpty(),l=i!==void 0,p=`Function ${t}() called with invalid data`;n&&(p+=" (via `toFirestore()`)"),p+=". ";let m="";return(s||l)&&(m+=" (found",s&&(m+=` in field ${r}`),l&&(m+=` in document ${i}`),m+=")"),new y(_.INVALID_ARGUMENT,p+e+m)}function as(e,t){return e.some((n=>n.isEqual(t)))}function Ir(e,t,n){let r;return r=e?n&&(n.merge||n.mergeFields)?e.toFirestore(t,n):e.toFirestore(t):t,r}function vr(e,t){let n=dr(e=Ye(e,F)),r=Ir(e.converter,t),i=gr(mr(e.firestore),"addDoc",n._key,r,n.converter!==null,{});return or(ur(e.firestore),[i.toMutation(n._key,$t.exists(!1))]).then((()=>n))}function Tr(){return new We("serverTimestamp")}var Nr="4.17.2";(function(){Wn(`${Dn}_lite`),ft(new U("firestore/lite",((t,{instanceIdentifier:n,options:r})=>{let i=t.getProvider("app").getImmediate(),s=new Z(new Ct(t.getProvider("auth-internal")),new kt(i,t.getProvider("app-check-internal")),Jn(i,n),i);return r&&s._setSettings(r),s}),"PUBLIC").setMultipleInstances(!0)),z("firestore-lite",Nr,""),z("firestore-lite",Nr,"esm2020")})();function Ko(e,t){let n=fe(e,t);try{n.container.providers.delete("heartbeat")}catch{}return n}export{vr as addDoc,fr as collection,lr as getFirestore,Ko as initApp,Tr as serverTimestamp};
/*! Bundled license information:

@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/logger/dist/esm/index.esm.js:
@firebase/firestore/dist/lite/common-B8fiiKst.esm.js:
@firebase/firestore/dist/lite/common-B8fiiKst.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/firestore/dist/lite/common-B8fiiKst.esm.js:
@firebase/firestore/dist/lite/common-B8fiiKst.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
@firebase/component/dist/esm/index.esm.js:
@firebase/app/dist/esm/index.esm.js:
@firebase/app/dist/esm/index.esm.js:
@firebase/firestore/dist/lite/common-B8fiiKst.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
firebase/app/dist/esm/index.esm.js:
@firebase/firestore/dist/lite/common-B8fiiKst.esm.js:
@firebase/firestore/dist/lite/common-B8fiiKst.esm.js:
@firebase/firestore/dist/lite/common-B8fiiKst.esm.js:
@firebase/firestore/dist/lite/common-B8fiiKst.esm.js:
@firebase/firestore/dist/lite/common-B8fiiKst.esm.js:
@firebase/firestore/dist/lite/common-B8fiiKst.esm.js:
@firebase/firestore/dist/lite/common-B8fiiKst.esm.js:
@firebase/firestore/dist/lite/common-B8fiiKst.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/webchannel-wrapper/dist/bloom-blob/esm/bloom_blob_es2018.js:
  (** @license
  Copyright The Closure Library Authors.
  SPDX-License-Identifier: Apache-2.0
  *)
  (** @license
  
   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  *)

@firebase/firestore/dist/lite/common-B8fiiKst.esm.js:
@firebase/firestore/dist/lite/common-B8fiiKst.esm.js:
@firebase/firestore/dist/lite/common-B8fiiKst.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/common-B8fiiKst.esm.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/common-B8fiiKst.esm.js:
@firebase/firestore/dist/lite/common-B8fiiKst.esm.js:
@firebase/firestore/dist/lite/common-B8fiiKst.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/common-B8fiiKst.esm.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/common-B8fiiKst.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/common-B8fiiKst.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
  * @license
  * Copyright 2017 Google LLC
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *   http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *)

@firebase/firestore/dist/lite/index.browser.esm.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
