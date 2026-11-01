(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},t={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},n=1e3,r=1001,i=1002,a=1003,o=1004,s=1005,c=1006,l=1007,u=1008,d=1009,f=1010,p=1011,m=1012,h=1013,g=1014,_=1015,v=1016,y=1017,b=1018,x=1020,S=35902,C=35899,w=1021,T=1022,E=1023,D=1026,O=1027,k=1028,A=1029,j=1030,ee=1031,te=1033,M=33776,ne=33777,N=33778,re=33779,ie=35840,ae=35841,oe=35842,se=35843,ce=36196,le=37492,P=37496,ue=37488,de=37489,fe=37490,pe=37491,me=37808,he=37809,ge=37810,_e=37811,ve=37812,ye=37813,be=37814,xe=37815,Se=37816,Ce=37817,we=37818,Te=37819,Ee=37820,De=37821,Oe=36492,ke=36494,Ae=36495,je=36283,Me=36284,Ne=36285,F=36286,Pe=2300,Fe=2301,Ie=2302,I=2303,Le=2400,Re=2401,ze=2402,Be=3200,Ve=3201,He=`srgb`,Ue=`srgb-linear`,We=`linear`,Ge=`srgb`,Ke=7680,qe=35044,Je=35048,Ye=2e3;function Xe(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function Ze(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function Qe(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function $e(){let e=Qe(`canvas`);return e.style.display=`block`,e}var et={};function tt(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function nt(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function L(...e){e=nt(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function R(...e){e=nt(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function rt(...e){let t=e.join(` `);t in et||(et[t]=!0,L(...e))}function it(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var at={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3},ot=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},st=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),ct=1234567,lt=Math.PI/180,ut=180/Math.PI;function dt(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(st[e&255]+st[e>>8&255]+st[e>>16&255]+st[e>>24&255]+`-`+st[t&255]+st[t>>8&255]+`-`+st[t>>16&15|64]+st[t>>24&255]+`-`+st[n&63|128]+st[n>>8&255]+`-`+st[n>>16&255]+st[n>>24&255]+st[r&255]+st[r>>8&255]+st[r>>16&255]+st[r>>24&255]).toLowerCase()}function ft(e,t,n){return Math.max(t,Math.min(n,e))}function pt(e,t){return(e%t+t)%t}function mt(e,t,n,r,i){return r+(e-t)*(i-r)/(n-t)}function ht(e,t,n){return e===t?0:(n-e)/(t-e)}function gt(e,t,n){return(1-n)*e+n*t}function _t(e,t,n,r){return gt(e,t,1-Math.exp(-n*r))}function vt(e,t=1){return t-Math.abs(pt(e,t*2)-t)}function yt(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*(3-2*e))}function bt(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*e*(e*(e*6-15)+10))}function xt(e,t){return e+Math.floor(Math.random()*(t-e+1))}function St(e,t){return e+Math.random()*(t-e)}function Ct(e){return e*(.5-Math.random())}function wt(e){e!==void 0&&(ct=e);let t=ct+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Tt(e){return e*lt}function Et(e){return e*ut}function Dt(e){return e>0&&Number.isInteger(e)&&2**Math.round(Math.log2(e))===e}function Ot(e){return 2**Math.ceil(Math.log(e)/Math.LN2)}function kt(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function At(e,t,n,r,i){let a=Math.cos,o=Math.sin,s=a(n/2),c=o(n/2),l=a((t+r)/2),u=o((t+r)/2),d=a((t-r)/2),f=o((t-r)/2),p=a((r-t)/2),m=o((r-t)/2);switch(i){case`XYX`:e.set(s*u,c*d,c*f,s*l);break;case`YZY`:e.set(c*f,s*u,c*d,s*l);break;case`ZXZ`:e.set(c*d,c*f,s*u,s*l);break;case`XZX`:e.set(s*u,c*m,c*p,s*l);break;case`YXY`:e.set(c*p,s*u,c*m,s*l);break;case`ZYZ`:e.set(c*m,c*p,s*u,s*l);break;default:L(`MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: `+i)}}function jt(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:case Uint8ClampedArray:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}function Mt(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}var Nt={DEG2RAD:lt,RAD2DEG:ut,generateUUID:dt,clamp:ft,euclideanModulo:pt,mapLinear:mt,inverseLerp:ht,lerp:gt,damp:_t,pingpong:vt,smoothstep:yt,smootherstep:bt,randInt:xt,randFloat:St,randFloatSpread:Ct,seededRandom:wt,degToRad:Tt,radToDeg:Et,isPowerOfTwo:Dt,ceilPowerOfTwo:Ot,floorPowerOfTwo:kt,setQuaternionFromProperEuler:At,normalize:Mt,denormalize:jt},z=class e{static{e.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ft(this.x,e.x,t.x),this.y=ft(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ft(this.x,e,t),this.y=ft(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ft(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(ft(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},B=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:L(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ft(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},V=class e{static{e.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Ft.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Ft.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ft(this.x,e.x,t.x),this.y=ft(this.y,e.y,t.y),this.z=ft(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ft(this.x,e,t),this.y=ft(this.y,e,t),this.z=ft(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ft(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Pt.copy(this).projectOnVector(e),this.sub(Pt)}reflect(e){return this.sub(Pt.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(ft(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Pt=new V,Ft=new B,It=class e{static{e.prototype.isMatrix3=!0}constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return rt(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(Lt.makeScale(e,t)),this}rotate(e){return rt(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(Lt.makeRotation(-e)),this}translate(e,t){return rt(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(Lt.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Lt=new It,Rt=new It().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),zt=new It().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Bt(){let e={enabled:!0,workingColorSpace:Ue,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n||(this.spaces[t].transfer===`srgb`&&(e.r=Ht(e.r),e.g=Ht(e.g),e.b=Ht(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=Ut(e.r),e.g=Ut(e.g),e.b=Ut(e.b))),e},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?We:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(t,n){return rt(`ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`),e.workingToColorSpace(t,n)},toWorkingColorSpace:function(t,n){return rt(`ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`),e.colorSpaceToWorking(t,n)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[Ue]:{primaries:t,whitePoint:r,transfer:We,toXYZ:Rt,fromXYZ:zt,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:He},outputColorSpaceConfig:{drawingBufferColorSpace:He}},[He]:{primaries:t,whitePoint:r,transfer:Ge,toXYZ:Rt,fromXYZ:zt,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:He}}}),e}var Vt=Bt();function Ht(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function Ut(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var Wt,Gt=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Wt===void 0&&(Wt=Qe(`canvas`)),Wt.width=e.width,Wt.height=e.height;let t=Wt.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=Wt}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=Qe(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=Ht(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(Ht(t[e]/255)*255):t[e]=Ht(t[e]);return{data:t,width:e.width,height:e.height}}return L(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},Kt=0,qt=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Kt++}),this.uuid=dt(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width,t.height,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(Jt(r[t].image)):e.push(Jt(r[t]))}else e=Jt(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function Jt(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?Gt.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(L(`Texture: Unable to serialize Texture.`),{})}var Yt=0,Xt=new V,Zt=class e extends ot{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,i=r,a=r,o=c,s=u,l=E,f=d,p=e.DEFAULT_ANISOTROPY,m=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Yt++}),this.uuid=dt(),this.name=``,this.source=new qt(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=a,this.magFilter=o,this.minFilter=s,this.anisotropy=p,this.format=l,this.internalFormat=null,this.type=f,this.offset=new z(0,0),this.repeat=new z(1,1),this.center=new z(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new It,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=m,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Xt).x}get height(){return this.source.getSize(Xt).y}get depth(){return this.source.getSize(Xt).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){L(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?L(`Texture.setValues(): property '${t}' does not exist.`):r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case n:e.x-=Math.floor(e.x);break;case r:e.x=e.x<0?0:1;break;case i:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case n:e.y-=Math.floor(e.y);break;case r:e.y=e.y<0?0:1;break;case i:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Zt.DEFAULT_IMAGE=null,Zt.DEFAULT_MAPPING=300,Zt.DEFAULT_ANISOTROPY=1;var Qt=class e{static{e.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ft(this.x,e.x,t.x),this.y=ft(this.y,e.y,t.y),this.z=ft(this.z,e.z,t.z),this.w=ft(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ft(this.x,e,t),this.y=ft(this.y,e,t),this.z=ft(this.z,e,t),this.w=ft(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ft(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},$t=class extends ot{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:c,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Qt(0,0,e,t),this.scissorTest=!1,this.viewport=new Qt(0,0,e,t),this.textures=[];let r=new Zt({width:e,height:t,depth:n.depth}),i=n.count;for(let e=0;e<i;e++)this.textures[e]=r.clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:c,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new qt(n)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null){if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture}return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},en=class extends $t{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},tn=class extends Zt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=a,this.minFilter=a,this.wrapR=r,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},nn=class extends Zt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=a,this.minFilter=a,this.wrapR=r,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},rn=class e{static{e.prototype.isMatrix4=!0}constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/an.setFromMatrixColumn(e,0).length(),i=1/an.setFromMatrixColumn(e,1).length(),a=1/an.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(sn,e,cn)}lookAt(e,t,n){let r=this.elements;return dn.subVectors(e,t),dn.lengthSq()===0&&(dn.z=1),dn.normalize(),ln.crossVectors(n,dn),ln.lengthSq()===0&&(Math.abs(n.z)===1?dn.x+=1e-4:dn.z+=1e-4,dn.normalize(),ln.crossVectors(n,dn)),ln.normalize(),un.crossVectors(dn,ln),r[0]=ln.x,r[4]=un.x,r[8]=dn.x,r[1]=ln.y,r[5]=un.y,r[9]=dn.y,r[2]=ln.z,r[6]=un.z,r[10]=dn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],k=r[2],A=r[6],j=r[10],ee=r[14],te=r[3],M=r[7],ne=r[11],N=r[15];return i[0]=a*x+o*T+s*k+c*te,i[4]=a*S+o*E+s*A+c*M,i[8]=a*C+o*D+s*j+c*ne,i[12]=a*w+o*O+s*ee+c*N,i[1]=l*x+u*T+d*k+f*te,i[5]=l*S+u*E+d*A+f*M,i[9]=l*C+u*D+d*j+f*ne,i[13]=l*w+u*O+d*ee+f*N,i[2]=p*x+m*T+h*k+g*te,i[6]=p*S+m*E+h*A+g*M,i[10]=p*C+m*D+h*j+g*ne,i[14]=p*w+m*O+h*ee+g*N,i[3]=_*x+v*T+y*k+b*te,i[7]=_*S+v*E+y*A+b*M,i[11]=_*C+v*D+y*j+b*ne,i[15]=_*w+v*O+y*ee+b*N,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,O=d*g-f*h,k=_*O-v*D+y*E+b*T-x*w+S*C;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/k;return e[0]=(o*O-s*D+c*E)*A,e[1]=(r*D-n*O-i*E)*A,e[2]=(m*S-h*x+g*b)*A,e[3]=(d*x-u*S-f*b)*A,e[4]=(s*T-a*O-c*w)*A,e[5]=(t*O-r*T+i*w)*A,e[6]=(h*y-p*S-g*v)*A,e[7]=(l*S-d*y+f*v)*A,e[8]=(a*D-o*T+c*C)*A,e[9]=(n*T-t*D-i*C)*A,e[10]=(p*x-m*y+g*_)*A,e[11]=(u*y-l*x-f*_)*A,e[12]=(o*w-a*E-s*C)*A,e[13]=(t*E-n*w+r*C)*A,e[14]=(m*v-p*b-h*_)*A,e[15]=(l*b-u*v+d*_)*A,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=an.set(r[0],r[1],r[2]).length(),o=an.set(r[4],r[5],r[6]).length(),s=an.set(r[8],r[9],r[10]).length();i<0&&(a=-a),on.copy(this);let c=1/a,l=1/o,u=1/s;return on.elements[0]*=c,on.elements[1]*=c,on.elements[2]*=c,on.elements[4]*=l,on.elements[5]*=l,on.elements[6]*=l,on.elements[8]*=u,on.elements[9]*=u,on.elements[10]*=u,t.setFromRotationMatrix(on),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=Ye,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=Ye,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},an=new V,on=new rn,sn=new V(0,0,0),cn=new V(1,1,1),ln=new V,un=new V,dn=new V,fn=new rn,pn=new B,mn=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(ft(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-ft(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(ft(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-ft(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(ft(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-ft(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:L(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return fn.makeRotationFromQuaternion(e),this.setFromRotationMatrix(fn,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return pn.setFromEuler(this),this.setFromQuaternion(pn,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};mn.DEFAULT_ORDER=`XYZ`;var hn=class{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&1<<e)}},gn=0,_n=new V,vn=new B,yn=new rn,bn=new V,xn=new V,Sn=new V,Cn=new B,wn=new V(1,0,0),Tn=new V(0,1,0),En=new V(0,0,1),Dn={type:`added`},On={type:`removed`},kn={type:`childadded`,child:null},An={type:`childremoved`,child:null},jn=class e extends ot{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:gn++}),this.uuid=dt(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new V,n=new mn,r=new B,i=new V(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new rn},normalMatrix:{value:new It}}),this.matrix=new rn,this.matrixWorld=new rn,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new hn,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return vn.setFromAxisAngle(e,t),this.quaternion.multiply(vn),this}rotateOnWorldAxis(e,t){return vn.setFromAxisAngle(e,t),this.quaternion.premultiply(vn),this}rotateX(e){return this.rotateOnAxis(wn,e)}rotateY(e){return this.rotateOnAxis(Tn,e)}rotateZ(e){return this.rotateOnAxis(En,e)}translateOnAxis(e,t){return _n.copy(e).applyQuaternion(this.quaternion),this.position.add(_n.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(wn,e)}translateY(e){return this.translateOnAxis(Tn,e)}translateZ(e){return this.translateOnAxis(En,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(yn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?bn.copy(e):bn.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),xn.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?yn.lookAt(xn,bn,this.up):yn.lookAt(bn,xn,this.up),this.quaternion.setFromRotationMatrix(yn),r&&(yn.extractRotation(r.matrixWorld),vn.setFromRotationMatrix(yn),this.quaternion.premultiply(vn.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(R(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Dn),kn.child=e,this.dispatchEvent(kn),kn.child=null):R(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(On),An.child=e,this.dispatchEvent(An),An.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),yn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),yn.multiply(e.parent.matrixWorld)),e.applyMatrix4(yn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Dn),kn.child=e,this.dispatchEvent(kn),kn.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(xn,e,Sn),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(xn,Cn,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:`dispose`})}};jn.DEFAULT_UP=new V(0,1,0),jn.DEFAULT_MATRIX_AUTO_UPDATE=!0,jn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var H=class extends jn{constructor(){super(),this.isGroup=!0,this.type=`Group`}},Mn={type:`move`},Nn=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new H,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new H,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new V,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new V),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new H,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new V,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new V,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Mn)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new H;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Pn={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Fn={h:0,s:0,l:0},In={h:0,s:0,l:0};function Ln(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var U=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=He){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Vt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=Vt.workingColorSpace){return this.r=e,this.g=t,this.b=n,Vt.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=Vt.workingColorSpace){if(e=pt(e,1),t=ft(t,0,1),n=ft(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=Ln(i,r,e+1/3),this.g=Ln(i,r,e),this.b=Ln(i,r,e-1/3)}return Vt.colorSpaceToWorking(this,r),this}setStyle(e,t=He){function n(t){t!==void 0&&parseFloat(t)<1&&L(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:L(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);L(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=He){let n=Pn[e.toLowerCase()];return n===void 0?L(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ht(e.r),this.g=Ht(e.g),this.b=Ht(e.b),this}copyLinearToSRGB(e){return this.r=Ut(e.r),this.g=Ut(e.g),this.b=Ut(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=He){return Vt.workingToColorSpace(Rn.copy(this),e),Math.round(ft(Rn.r*255,0,255))*65536+Math.round(ft(Rn.g*255,0,255))*256+Math.round(ft(Rn.b*255,0,255))}getHexString(e=He){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Vt.workingColorSpace){Vt.workingToColorSpace(Rn.copy(this),t);let n=Rn.r,r=Rn.g,i=Rn.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=Vt.workingColorSpace){return Vt.workingToColorSpace(Rn.copy(this),t),e.r=Rn.r,e.g=Rn.g,e.b=Rn.b,e}getStyle(e=He){Vt.workingToColorSpace(Rn.copy(this),e);let t=Rn.r,n=Rn.g,r=Rn.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(Fn),this.setHSL(Fn.h+e,Fn.s+t,Fn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Fn),e.getHSL(In);let n=gt(Fn.h,In.h,t),r=gt(Fn.s,In.s,t),i=gt(Fn.l,In.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Rn=new U;U.NAMES=Pn;var zn=class e{constructor(e,t=25e-5){this.isFogExp2=!0,this.name=``,this.color=new U(e),this.density=t}clone(){return new e(this.color,this.density)}toJSON(){return{type:`FogExp2`,name:this.name,color:this.color.getHex(),density:this.density}}},Bn=class extends jn{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new mn,this.environmentIntensity=1,this.environmentRotation=new mn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Vn=new V,Hn=new V,Un=new V,Wn=new V,Gn=new V,Kn=new V,qn=new V,Jn=new V,Yn=new V,Xn=new V,Zn=new Qt,Qn=new Qt,$n=new Qt,er=class e{constructor(e=new V,t=new V,n=new V){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Vn.subVectors(e,t),r.cross(Vn);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){Vn.subVectors(r,t),Hn.subVectors(n,t),Un.subVectors(e,t);let a=Vn.dot(Vn),o=Vn.dot(Hn),s=Vn.dot(Un),c=Hn.dot(Hn),l=Hn.dot(Un),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Wn)!==null&&Wn.x>=0&&Wn.y>=0&&Wn.x+Wn.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,Wn)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,Wn.x),s.addScaledVector(a,Wn.y),s.addScaledVector(o,Wn.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return Zn.setScalar(0),Qn.setScalar(0),$n.setScalar(0),Zn.fromBufferAttribute(e,t),Qn.fromBufferAttribute(e,n),$n.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(Zn,i.x),a.addScaledVector(Qn,i.y),a.addScaledVector($n,i.z),a}static isFrontFacing(e,t,n,r){return Vn.subVectors(n,t),Hn.subVectors(e,t),Vn.cross(Hn).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Vn.subVectors(this.c,this.b),Hn.subVectors(this.a,this.b),Vn.cross(Hn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;Gn.subVectors(r,n),Kn.subVectors(i,n),Jn.subVectors(e,n);let s=Gn.dot(Jn),c=Kn.dot(Jn);if(s<=0&&c<=0)return t.copy(n);Yn.subVectors(e,r);let l=Gn.dot(Yn),u=Kn.dot(Yn);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(Gn,a);Xn.subVectors(e,i);let f=Gn.dot(Xn),p=Kn.dot(Xn);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(Kn,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return qn.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(qn,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(Gn,a).addScaledVector(Kn,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},tr=class{constructor(e=new V(1/0,1/0,1/0),t=new V(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(rr.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(rr.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=rr.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,rr):rr.fromBufferAttribute(r,t),rr.applyMatrix4(e.matrixWorld),this.expandByPoint(rr);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),ir.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),ir.copy(e.boundingBox)),ir.applyMatrix4(e.matrixWorld),this.union(ir)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,rr),rr.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(dr),fr.subVectors(this.max,dr),ar.subVectors(e.a,dr),or.subVectors(e.b,dr),sr.subVectors(e.c,dr),cr.subVectors(or,ar),lr.subVectors(sr,or),ur.subVectors(ar,sr);let t=[0,-cr.z,cr.y,0,-lr.z,lr.y,0,-ur.z,ur.y,cr.z,0,-cr.x,lr.z,0,-lr.x,ur.z,0,-ur.x,-cr.y,cr.x,0,-lr.y,lr.x,0,-ur.y,ur.x,0];return!hr(t,ar,or,sr,fr)||(t=[1,0,0,0,1,0,0,0,1],!hr(t,ar,or,sr,fr))?!1:(pr.crossVectors(cr,lr),t=[pr.x,pr.y,pr.z],hr(t,ar,or,sr,fr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,rr).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(rr).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(nr[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),nr[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),nr[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),nr[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),nr[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),nr[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),nr[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),nr[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(nr)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},nr=[new V,new V,new V,new V,new V,new V,new V,new V],rr=new V,ir=new tr,ar=new V,or=new V,sr=new V,cr=new V,lr=new V,ur=new V,dr=new V,fr=new V,pr=new V,mr=new V;function hr(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){mr.fromArray(e,a);let o=i.x*Math.abs(mr.x)+i.y*Math.abs(mr.y)+i.z*Math.abs(mr.z),s=t.dot(mr),c=n.dot(mr),l=r.dot(mr);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var gr=new V,_r=new z,vr=0,yr=class extends ot{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:vr++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=qe,this.updateRanges=[],this.gpuType=_,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)_r.fromBufferAttribute(this,t),_r.applyMatrix3(e),this.setXY(t,_r.x,_r.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)gr.fromBufferAttribute(this,t),gr.applyMatrix3(e),this.setXYZ(t,gr.x,gr.y,gr.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)gr.fromBufferAttribute(this,t),gr.applyMatrix4(e),this.setXYZ(t,gr.x,gr.y,gr.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)gr.fromBufferAttribute(this,t),gr.applyNormalMatrix(e),this.setXYZ(t,gr.x,gr.y,gr.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)gr.fromBufferAttribute(this,t),gr.transformDirection(e),this.setXYZ(t,gr.x,gr.y,gr.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=jt(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Mt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=jt(t,this.array)),t}setX(e,t){return this.normalized&&(t=Mt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=jt(t,this.array)),t}setY(e,t){return this.normalized&&(t=Mt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=jt(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Mt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=jt(t,this.array)),t}setW(e,t){return this.normalized&&(t=Mt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Mt(t,this.array),n=Mt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=Mt(t,this.array),n=Mt(n,this.array),r=Mt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=Mt(t,this.array),n=Mt(n,this.array),r=Mt(r,this.array),i=Mt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:`dispose`})}},br=class extends yr{constructor(e,t,n){super(new Uint16Array(e),t,n)}},xr=class extends yr{constructor(e,t,n){super(new Uint32Array(e),t,n)}},Sr=class extends yr{constructor(e,t,n){super(new Float32Array(e),t,n)}},Cr=new tr,wr=new V,Tr=new V,Er=class{constructor(e=new V,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?Cr.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;wr.subVectors(e,this.center);let t=wr.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(wr,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Tr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(wr.copy(e.center).add(Tr)),this.expandByPoint(wr.copy(e.center).sub(Tr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Dr=0,Or=new rn,kr=new jn,Ar=new V,jr=new tr,Mr=new tr,Nr=new V,Pr=class e extends ot{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Dr++}),this.uuid=dt(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(Xe(e)?xr:br)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new It().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Or.makeRotationFromQuaternion(e),this.applyMatrix4(Or),this}rotateX(e){return Or.makeRotationX(e),this.applyMatrix4(Or),this}rotateY(e){return Or.makeRotationY(e),this.applyMatrix4(Or),this}rotateZ(e){return Or.makeRotationZ(e),this.applyMatrix4(Or),this}translate(e,t,n){return Or.makeTranslation(e,t,n),this.applyMatrix4(Or),this}scale(e,t,n){return Or.makeScale(e,t,n),this.applyMatrix4(Or),this}lookAt(e){return kr.lookAt(e),kr.updateMatrix(),this.applyMatrix4(kr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ar).negate(),this.translate(Ar.x,Ar.y,Ar.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new Sr(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&L(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new tr);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)R(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new V(-1/0,-1/0,-1/0),new V(1/0,1/0,1/0));else{if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];jr.setFromBufferAttribute(n),this.morphTargetsRelative?(Nr.addVectors(this.boundingBox.min,jr.min),this.boundingBox.expandByPoint(Nr),Nr.addVectors(this.boundingBox.max,jr.max),this.boundingBox.expandByPoint(Nr)):(this.boundingBox.expandByPoint(jr.min),this.boundingBox.expandByPoint(jr.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&R(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Er);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)R(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new V,1/0);else if(e){let n=this.boundingSphere.center;if(jr.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Mr.setFromBufferAttribute(n),this.morphTargetsRelative?(Nr.addVectors(jr.min,Mr.min),jr.expandByPoint(Nr),Nr.addVectors(jr.max,Mr.max),jr.expandByPoint(Nr)):(jr.expandByPoint(Mr.min),jr.expandByPoint(Mr.max))}jr.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)Nr.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(Nr));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)Nr.fromBufferAttribute(a,t),o&&(Ar.fromBufferAttribute(e,t),Nr.add(Ar)),r=Math.max(r,n.distanceToSquared(Nr))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&R(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){R(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new yr(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[];for(let e=0;e<n.count;e++)o[e]=new V,s[e]=new V;let c=new V,l=new V,u=new V,d=new z,f=new z,p=new z,m=new V,h=new V;function g(e,t,r){c.fromBufferAttribute(n,e),l.fromBufferAttribute(n,t),u.fromBufferAttribute(n,r),d.fromBufferAttribute(i,e),f.fromBufferAttribute(i,t),p.fromBufferAttribute(i,r),l.sub(c),u.sub(c),f.sub(d),p.sub(d);let a=1/(f.x*p.y-p.x*f.y);isFinite(a)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(a),h.copy(u).multiplyScalar(f.x).addScaledVector(l,-p.x).multiplyScalar(a),o[e].add(m),o[t].add(m),o[r].add(m),s[e].add(h),s[t].add(h),s[r].add(h))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)g(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let v=new V,y=new V,b=new V,x=new V;function S(e){b.fromBufferAttribute(r,e),x.copy(b);let t=o[e];v.copy(t),v.sub(b.multiplyScalar(b.dot(t))).normalize(),y.crossVectors(x,t);let n=y.dot(s[e])<0?-1:1;a.setXYZW(e,v.x,v.y,v.z,n)}for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)S(e.getX(t+0)),S(e.getX(t+1)),S(e.getX(t+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new yr(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new V,i=new V,a=new V,o=new V,s=new V,c=new V,l=new V,u=new V;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Nr.fromBufferAttribute(e,t),Nr.normalize(),e.setXYZ(t,Nr.x,Nr.y,Nr.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new yr(a,r,i)}if(this.index===null)return L(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},Fr=new V,Ir=new V,Lr=new It,Rr=class{constructor(e=new V(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=Fr.subVectors(n,t).cross(Ir.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(Fr),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Lr.getNormalMatrix(e),r=this.coplanarPoint(Fr).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},zr=0,Br=class extends ot{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:zr++}),this.uuid=dt(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new U(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ke,this.stencilZFail=Ke,this.stencilZPass=Ke,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){L(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?L(`Material: '${t}' is not a property of THREE.${this.type}.`):r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(e=>e.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new U().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(e=>new Rr().fromJSON(e))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new z().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new z().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},Vr=new V,Hr=new V,Ur=new V,Wr=new V,Gr=class{constructor(e=new V,t=new V(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Vr)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Vr.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Vr.copy(this.origin).addScaledVector(this.direction,t),Vr.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Hr.copy(e).add(t).multiplyScalar(.5),Ur.copy(t).sub(e).normalize(),Wr.copy(this.origin).sub(Hr);let i=e.distanceTo(t)*.5,a=-this.direction.dot(Ur),o=Wr.dot(this.direction),s=-Wr.dot(Ur),c=Wr.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(Hr).addScaledVector(Ur,d),f}intersectSphere(e,t){if(e.radius<0)return null;Vr.subVectors(e.center,this.origin);let n=Vr.dot(this.direction),r=Vr.dot(Vr)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,Vr)!==null}intersectTriangle(e,t,n,r,i){let a=this.origin,o=this.direction,s=o.x,c=o.y,l=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,p=t.x-a.x,m=t.y-a.y,h=t.z-a.z,g=n.x-a.x,_=n.y-a.y,v=n.z-a.z,y=Math.abs(s),b=Math.abs(c),x=Math.abs(l),S,C,w,T,E,D,O,k,A,j,ee,te;if(y>=b&&y>=x?(w=s,D=u,A=p,te=g,s>=0?(S=c,C=l,T=d,E=f,O=m,k=h,j=_,ee=v):(S=l,C=c,T=f,E=d,O=h,k=m,j=v,ee=_)):b>=x?(w=c,D=d,A=m,te=_,c>=0?(S=l,C=s,T=f,E=u,O=h,k=p,j=v,ee=g):(S=s,C=l,T=u,E=f,O=p,k=h,j=g,ee=v)):(w=l,D=f,A=h,te=v,l>=0?(S=s,C=c,T=u,E=d,O=p,k=m,j=g,ee=_):(S=c,C=s,T=d,E=u,O=m,k=p,j=_,ee=g)),w===0)return null;let M=S/w,ne=C/w,N=1/w,re=T-M*D,ie=E-ne*D,ae=O-M*A,oe=k-ne*A,se=j-M*te,ce=ee-ne*te,le=se*oe-ce*ae,P=re*ce-ie*se,ue=ae*ie-oe*re;if(r){if(le<0||P<0||ue<0)return null}else if((le<0||P<0||ue<0)&&(le>0||P>0||ue>0))return null;let de=le+P+ue;if(de===0)return null;let fe=N*(le*D+P*A+ue*te);return(de>0?fe<0:fe>0)?null:this.at(fe/de,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Kr=class extends Br{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new U(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new mn,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},qr=new rn,Jr=new Gr,Yr=new Er,Xr=new V,Zr=new V,Qr=new V,$r=new V,ei=new V,ti=new V,ni=new V,ri=new V,W=class extends jn{constructor(e=new Pr,t=new Kr){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){ti.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(ei.fromBufferAttribute(s,e),a?ti.addScaledVector(ei,r):ti.addScaledVector(ei.sub(t),r))}t.add(ti)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Yr.copy(n.boundingSphere),Yr.applyMatrix4(i),Jr.copy(e.ray).recast(e.near),!(Yr.containsPoint(Jr.origin)===!1&&(Jr.intersectSphere(Yr,Xr)===null||Jr.origin.distanceToSquared(Xr)>(e.far-e.near)**2))&&(qr.copy(i).invert(),Jr.copy(e.ray).applyMatrix4(qr),(n.boundingBox===null||Jr.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,Jr)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=ai(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=ai(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=ai(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=ai(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function ii(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;ri.copy(s),ri.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(ri);return l<n.near||l>n.far?null:{distance:l,point:ri.clone(),object:e}}function ai(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,Zr),e.getVertexPosition(c,Qr),e.getVertexPosition(l,$r);let u=ii(e,t,n,r,Zr,Qr,$r,ni);if(u){let e=new V;er.getBarycoord(ni,Zr,Qr,$r,e),i&&(u.uv=er.getInterpolatedAttribute(i,s,c,l,e,new z)),a&&(u.uv1=er.getInterpolatedAttribute(a,s,c,l,e,new z)),o&&(u.normal=er.getInterpolatedAttribute(o,s,c,l,e,new V),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new V,materialIndex:0};er.getNormal(Zr,Qr,$r,t.normal),u.face=t,u.barycoord=e}return u}var oi=class extends Zt{constructor(e=null,t=1,n=1,r,i,o,s,c,l=a,u=a,d,f){super(null,o,s,c,l,u,r,i,d,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},si=class extends yr{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},ci=new rn,li=new rn,ui=[],di=new tr,fi=new rn,pi=new W,mi=new Er,hi=class extends W{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new si(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let e=0;e<n;e++)this.setMatrixAt(e,fi)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new tr),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ci),di.copy(e.boundingBox).applyMatrix4(ci),this.boundingBox.union(di)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Er),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ci),mi.copy(e.boundingSphere).applyMatrix4(ci),this.boundingSphere.union(mi)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,i=e*(n.length+1)+1;for(let e=0;e<n.length;e++)n[e]=r[i+e]}raycast(e,t){let n=this.matrixWorld,r=this.count;if(pi.geometry=this.geometry,pi.material=this.material,pi.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),mi.copy(this.boundingSphere),mi.applyMatrix4(n),e.ray.intersectsSphere(mi)!==!1))for(let i=0;i<r;i++){this.getMatrixAt(i,ci),li.multiplyMatrices(n,ci),pi.matrixWorld=li,pi.raycast(e,ui);for(let e=0,n=ui.length;e<n;e++){let n=ui[e];n.instanceId=i,n.object=this,t.push(n)}ui.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new si(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new oi(new Float32Array(r*this.count),r,this.count,k,_));let i=this.morphTexture.source.data.data,a=0;for(let e=0;e<n.length;e++)a+=n[e];let o=this.geometry.morphTargetsRelative?1:1-a,s=r*e;return i[s]=o,i.set(n,s+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},gi=new Er,_i=new z(.5,.5),vi=new V,yi=class{constructor(e=new Rr,t=new Rr,n=new Rr,r=new Rr,i=new Rr,a=new Rr){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Ye,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),gi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),gi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(gi)}intersectsSprite(e){return gi.center.set(0,0,0),gi.radius=.7071067811865476+_i.distanceTo(e.center),gi.applyMatrix4(e.matrixWorld),this.intersectsSphere(gi)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(vi.x=r.normal.x>0?e.max.x:e.min.x,vi.y=r.normal.y>0?e.max.y:e.min.y,vi.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(vi)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},bi=class extends Zt{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},xi=class extends Zt{constructor(e,t,n=g,r,i,o,s=a,c=a,l,u=D,d=1){if(u!==1026&&u!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:d},r,i,o,s,c,u,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new qt(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Si=class extends xi{constructor(e,t=g,n=301,r,i,o=a,s=a,c,l=D){let u={width:e,height:e,depth:1},d=[u,u,u,u,u,u];super(e,e,t,n,r,i,o,s,c,l),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Ci=class extends Zt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},wi=class e extends Pr{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new Sr(c,3)),this.setAttribute(`normal`,new Sr(l,3)),this.setAttribute(`uv`,new Sr(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new V;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},Ti=class e extends Pr{constructor(e=1,t=32,n=0,r=Math.PI*2){super(),this.type=`CircleGeometry`,this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:r},t=Math.max(3,t);let i=[],a=[],o=[],s=[],c=new V,l=new z;a.push(0,0,0),o.push(0,0,1),s.push(.5,.5);for(let i=0,u=3;i<=t;i++,u+=3){let d=n+i/t*r;c.x=e*Math.cos(d),c.y=e*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),l.x=(a[u]/e+1)/2,l.y=(a[u+1]/e+1)/2,s.push(l.x,l.y)}for(let e=1;e<=t;e++)i.push(e,e+1,0);this.setIndex(i),this.setAttribute(`position`,new Sr(a,3)),this.setAttribute(`normal`,new Sr(o,3)),this.setAttribute(`uv`,new Sr(s,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.segments,t.thetaStart,t.thetaLength)}},G=class e extends Pr{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new Sr(u,3)),this.setAttribute(`normal`,new Sr(d,3)),this.setAttribute(`uv`,new Sr(f,2));function _(){let a=new V,_=new V,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let n=0;n<r;n++)for(let r=0;r<i;r++){let a=m[r][n],o=m[r+1][n],s=m[r+1][n+1],c=m[r][n+1];(e>0||r!==0)&&(l.push(a,o,c),v+=3),(t>0||r!==i-1)&&(l.push(o,s,c),v+=3)}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new z,m=new V,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Ei=class e extends G{constructor(e=1,t=1,n=32,r=1,i=!1,a=0,o=Math.PI*2){super(0,e,t,n,r,i,a,o),this.type=`ConeGeometry`,this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:i,thetaStart:a,thetaLength:o}}static fromJSON(t){return new e(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Di=class e extends Pr{constructor(e=[],t=[],n=1,r=0){super(),this.type=`PolyhedronGeometry`,this.parameters={vertices:e,indices:t,radius:n,detail:r};let i=[],a=[];o(r),c(n),l(),this.setAttribute(`position`,new Sr(i,3)),this.setAttribute(`normal`,new Sr(i.slice(),3)),this.setAttribute(`uv`,new Sr(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(e){let n=new V,r=new V,i=new V;for(let a=0;a<t.length;a+=3)f(t[a+0],n),f(t[a+1],r),f(t[a+2],i),s(n,r,i,e)}function s(e,t,n,r){let i=r+1,a=[];for(let r=0;r<=i;r++){a[r]=[];let o=e.clone().lerp(n,r/i),s=t.clone().lerp(n,r/i),c=i-r;for(let e=0;e<=c;e++)e===0&&r===i?a[r][e]=o:a[r][e]=o.clone().lerp(s,e/c)}for(let e=0;e<i;e++)for(let t=0;t<2*(i-e)-1;t++){let n=Math.floor(t/2);t%2==0?(d(a[e][n+1]),d(a[e+1][n]),d(a[e][n])):(d(a[e][n+1]),d(a[e+1][n+1]),d(a[e+1][n]))}}function c(e){let t=new V;for(let n=0;n<i.length;n+=3)t.x=i[n+0],t.y=i[n+1],t.z=i[n+2],t.normalize().multiplyScalar(e),i[n+0]=t.x,i[n+1]=t.y,i[n+2]=t.z}function l(){let e=new V;for(let t=0;t<i.length;t+=3){e.x=i[t+0],e.y=i[t+1],e.z=i[t+2];let n=h(e)/2/Math.PI+.5,r=g(e)/Math.PI+.5;a.push(n,1-r)}p(),u()}function u(){for(let e=0;e<a.length;e+=6){let t=a[e+0],n=a[e+2],r=a[e+4];Math.max(t,n,r)>.9&&Math.min(t,n,r)<.1&&(t<.2&&(a[e+0]+=1),n<.2&&(a[e+2]+=1),r<.2&&(a[e+4]+=1))}}function d(e){i.push(e.x,e.y,e.z)}function f(t,n){let r=t*3;n.x=e[r+0],n.y=e[r+1],n.z=e[r+2]}function p(){let e=new V,t=new V,n=new V,r=new V,o=new z,s=new z,c=new z;for(let l=0,u=0;l<i.length;l+=9,u+=6){e.set(i[l+0],i[l+1],i[l+2]),t.set(i[l+3],i[l+4],i[l+5]),n.set(i[l+6],i[l+7],i[l+8]),o.set(a[u+0],a[u+1]),s.set(a[u+2],a[u+3]),c.set(a[u+4],a[u+5]),r.copy(e).add(t).add(n).divideScalar(3);let d=h(r);m(o,u+0,e,d),m(s,u+2,t,d),m(c,u+4,n,d)}}function m(e,t,n,r){r<0&&e.x===1&&(a[t]=e.x-1),n.x===0&&n.z===0&&(a[t]=r/2/Math.PI+.5)}function h(e){return Math.atan2(e.z,-e.x)}function g(e){return Math.atan2(-e.y,Math.sqrt(e.x*e.x+e.z*e.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.vertices,t.indices,t.radius,t.detail)}},Oi=class{constructor(){this.type=`Curve`,this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){L(`Curve: .getPoint() not implemented.`)}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,r=this.getPoint(0),i=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),i+=n.distanceTo(r),t.push(i),r=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),r=0,i=n.length,a;a=t||e*n[i-1];let o=0,s=i-1,c;for(;o<=s;)if(r=Math.floor(o+(s-o)/2),c=n[r]-a,c<0)o=r+1;else if(c>0)s=r-1;else{s=r;break}if(r=s,n[r]===a)return r/(i-1);let l=n[r],u=n[r+1]-l,d=(a-l)/u;return(r+d)/(i-1)}getTangent(e,t){let n=1e-4,r=e-n,i=e+n;r<0&&(r=0),i>1&&(i=1);let a=this.getPoint(r),o=this.getPoint(i),s=t||(a.isVector2?new z:new V);return s.copy(o).sub(a).normalize(),s}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new V,r=[],i=[],a=[],o=new V,s=new rn;for(let t=0;t<=e;t++){let n=t/e;r[t]=this.getTangentAt(n,new V)}i[0]=new V,a[0]=new V;let c=Number.MAX_VALUE,l=Math.abs(r[0].x),u=Math.abs(r[0].y),d=Math.abs(r[0].z);l<=c&&(c=l,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),i[0].crossVectors(r[0],o),a[0].crossVectors(r[0],i[0]);for(let t=1;t<=e;t++){if(i[t]=i[t-1].clone(),a[t]=a[t-1].clone(),o.crossVectors(r[t-1],r[t]),o.length()>2**-52){o.normalize();let e=Math.acos(ft(r[t-1].dot(r[t]),-1,1));i[t].applyMatrix4(s.makeRotationAxis(o,e))}a[t].crossVectors(r[t],i[t])}if(t===!0){let t=Math.acos(ft(i[0].dot(i[e]),-1,1));t/=e,r[0].dot(o.crossVectors(i[0],i[e]))>0&&(t=-t);for(let n=1;n<=e;n++)i[n].applyMatrix4(s.makeRotationAxis(r[n],t*n)),a[n].crossVectors(r[n],i[n])}return{tangents:r,normals:i,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:`Curve`,generator:`Curve.toJSON`}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},ki=class extends Oi{constructor(e=0,t=0,n=1,r=1,i=0,a=Math.PI*2,o=!1,s=0){super(),this.isEllipseCurve=!0,this.type=`EllipseCurve`,this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=r,this.aStartAngle=i,this.aEndAngle=a,this.aClockwise=o,this.aRotation=s}getPoint(e,t=new z){let n=t,r=Math.PI*2,i=this.aEndAngle-this.aStartAngle,a=Math.abs(i)<2**-52;for(;i<0;)i+=r;for(;i>r;)i-=r;i<2**-52&&(i=a?0:r),this.aClockwise===!0&&!a&&(i===r?i=-r:i-=r);let o=this.aStartAngle+e*i,s=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let e=Math.cos(this.aRotation),t=Math.sin(this.aRotation),n=s-this.aX,r=c-this.aY;s=n*e-r*t+this.aX,c=n*t+r*e+this.aY}return n.set(s,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Ai=class extends ki{constructor(e,t,n,r,i,a){super(e,t,n,n,r,i,a),this.isArcCurve=!0,this.type=`ArcCurve`}};function ji(){let e=0,t=0,n=0,r=0;function i(i,a,o,s){e=i,t=o,n=-3*i+3*a-2*o-s,r=2*i-2*a+o+s}return{initCatmullRom:function(e,t,n,r,a){i(t,n,a*(n-e),a*(r-t))},initNonuniformCatmullRom:function(e,t,n,r,a,o,s){let c=(t-e)/a-(n-e)/(a+o)+(n-t)/o,l=(n-t)/o-(r-t)/(o+s)+(r-n)/s;c*=o,l*=o,i(t,n,c,l)},calc:function(i){let a=i*i,o=a*i;return e+t*i+n*a+r*o}}}var Mi=new V,Ni=new V,Pi=new ji,Fi=new ji,Ii=new ji,Li=class extends Oi{constructor(e=[],t=!1,n=`centripetal`,r=.5){super(),this.isCatmullRomCurve3=!0,this.type=`CatmullRomCurve3`,this.points=e,this.closed=t,this.curveType=n,this.tension=r}getPoint(e,t=new V){let n=t,r=this.points,i=r.length,a=(i-+!this.closed)*e,o=Math.floor(a),s=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/i)+1)*i:s===0&&o===i-1&&(o=i-2,s=1);let c,l;this.closed||o>0?c=r[(o-1)%i]:(Ni.subVectors(r[0],r[1]).add(r[0]),c=Ni);let u=r[o%i],d=r[(o+1)%i];if(this.closed||o+2<i?l=r[(o+2)%i]:(Mi.subVectors(r[i-1],r[i-2]).add(r[i-1]),l=Mi),this.curveType===`centripetal`||this.curveType===`chordal`){let e=this.curveType===`chordal`?.5:.25,t=c.distanceToSquared(u)**+e,n=u.distanceToSquared(d)**+e,r=d.distanceToSquared(l)**+e;n<1e-4&&(n=1),t<1e-4&&(t=n),r<1e-4&&(r=n),Pi.initNonuniformCatmullRom(c.x,u.x,d.x,l.x,t,n,r),Fi.initNonuniformCatmullRom(c.y,u.y,d.y,l.y,t,n,r),Ii.initNonuniformCatmullRom(c.z,u.z,d.z,l.z,t,n,r)}else this.curveType===`catmullrom`&&(Pi.initCatmullRom(c.x,u.x,d.x,l.x,this.tension),Fi.initCatmullRom(c.y,u.y,d.y,l.y,this.tension),Ii.initCatmullRom(c.z,u.z,d.z,l.z,this.tension));return n.set(Pi.calc(s),Fi.calc(s),Ii.calc(s)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new V().fromArray(n))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Ri(e,t,n,r,i){let a=(r-t)*.5,o=(i-n)*.5,s=e*e,c=e*s;return(2*n-2*r+a+o)*c+(-3*n+3*r-2*a-o)*s+a*e+n}function zi(e,t){let n=1-e;return n*n*t}function Bi(e,t){return 2*(1-e)*e*t}function Vi(e,t){return e*e*t}function Hi(e,t,n,r){return zi(e,t)+Bi(e,n)+Vi(e,r)}function Ui(e,t){let n=1-e;return n*n*n*t}function Wi(e,t){let n=1-e;return 3*n*n*e*t}function Gi(e,t){return 3*(1-e)*e*e*t}function Ki(e,t){return e*e*e*t}function qi(e,t,n,r,i){return Ui(e,t)+Wi(e,n)+Gi(e,r)+Ki(e,i)}var Ji=class extends Oi{constructor(e=new z,t=new z,n=new z,r=new z){super(),this.isCubicBezierCurve=!0,this.type=`CubicBezierCurve`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new z){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(qi(e,r.x,i.x,a.x,o.x),qi(e,r.y,i.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Yi=class extends Oi{constructor(e=new V,t=new V,n=new V,r=new V){super(),this.isCubicBezierCurve3=!0,this.type=`CubicBezierCurve3`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new V){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(qi(e,r.x,i.x,a.x,o.x),qi(e,r.y,i.y,a.y,o.y),qi(e,r.z,i.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Xi=class extends Oi{constructor(e=new z,t=new z){super(),this.isLineCurve=!0,this.type=`LineCurve`,this.v1=e,this.v2=t}getPoint(e,t=new z){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new z){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Zi=class extends Oi{constructor(e=new V,t=new V){super(),this.isLineCurve3=!0,this.type=`LineCurve3`,this.v1=e,this.v2=t}getPoint(e,t=new V){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new V){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Qi=class extends Oi{constructor(e=new z,t=new z,n=new z){super(),this.isQuadraticBezierCurve=!0,this.type=`QuadraticBezierCurve`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new z){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(Hi(e,r.x,i.x,a.x),Hi(e,r.y,i.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},$i=class extends Oi{constructor(e=new V,t=new V,n=new V){super(),this.isQuadraticBezierCurve3=!0,this.type=`QuadraticBezierCurve3`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new V){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(Hi(e,r.x,i.x,a.x),Hi(e,r.y,i.y,a.y),Hi(e,r.z,i.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ea=class extends Oi{constructor(e=[]){super(),this.isSplineCurve=!0,this.type=`SplineCurve`,this.points=e}getPoint(e,t=new z){let n=t,r=this.points,i=(r.length-1)*e,a=Math.floor(i),o=i-a,s=r[a===0?a:a-1],c=r[a],l=r[a>r.length-2?r.length-1:a+1],u=r[a>r.length-3?r.length-1:a+2];return n.set(Ri(o,s.x,c.x,l.x,u.x),Ri(o,s.y,c.y,l.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new z().fromArray(n))}return this}},ta=Object.freeze({__proto__:null,ArcCurve:Ai,CatmullRomCurve3:Li,CubicBezierCurve:Ji,CubicBezierCurve3:Yi,EllipseCurve:ki,LineCurve:Xi,LineCurve3:Zi,QuadraticBezierCurve:Qi,QuadraticBezierCurve3:$i,SplineCurve:ea}),na=class extends Oi{constructor(){super(),this.type=`CurvePath`,this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?`LineCurve`:`LineCurve3`;this.curves.push(new ta[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),r=this.getCurveLengths(),i=0;for(;i<r.length;){if(r[i]>=n){let e=r[i]-n,a=this.curves[i],o=a.getLength(),s=o===0?0:1-e/o;return a.getPointAt(s,t)}i++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,r=this.curves.length;n<r;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let r=0,i=this.curves;r<i.length;r++){let a=i[r],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,s=a.getPoints(o);for(let e=0;e<s.length;e++){let r=s[e];n&&n.equals(r)||(t.push(r),n=r)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(n.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let n=this.curves[t];e.curves.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(new ta[n.type]().fromJSON(n))}return this}},ra=class extends na{constructor(e){super(),this.type=`Path`,this.currentPoint=new z,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new Xi(this.currentPoint.clone(),new z(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,r){let i=new Qi(this.currentPoint.clone(),new z(e,t),new z(n,r));return this.curves.push(i),this.currentPoint.set(n,r),this}bezierCurveTo(e,t,n,r,i,a){let o=new Ji(this.currentPoint.clone(),new z(e,t),new z(n,r),new z(i,a));return this.curves.push(o),this.currentPoint.set(i,a),this}splineThru(e){let t=new ea([this.currentPoint.clone()].concat(e));return this.curves.push(t),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,r,i,a){let o=this.currentPoint.x,s=this.currentPoint.y;return this.absarc(e+o,t+s,n,r,i,a),this}absarc(e,t,n,r,i,a){return this.absellipse(e,t,n,n,r,i,a),this}ellipse(e,t,n,r,i,a,o,s){let c=this.currentPoint.x,l=this.currentPoint.y;return this.absellipse(e+c,t+l,n,r,i,a,o,s),this}absellipse(e,t,n,r,i,a,o,s){let c=new ki(e,t,n,r,i,a,o,s);if(this.curves.length>0){let e=c.getPoint(0);e.equals(this.currentPoint)||this.lineTo(e.x,e.y)}this.curves.push(c);let l=c.getPoint(1);return this.currentPoint.copy(l),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},ia=class extends ra{constructor(e){super(e),this.uuid=dt(),this.type=`Shape`,this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,r=this.holes.length;n<r;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let n=this.holes[t];e.holes.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(new ra().fromJSON(n))}return this}};function aa(e,t,n=2){let r=t&&t.length,i=r?t[0]*n:e.length,a=oa(e,0,i,n,!0),o=[];if(!a||a.next===a.prev)return o;let s,c,l;if(r&&(a=pa(e,t,a,n)),e.length>80*n){s=e[0],c=e[1];let t=s,r=c;for(let a=n;a<i;a+=n){let n=e[a],i=e[a+1];n<s&&(s=n),i<c&&(c=i),n>t&&(t=n),i>r&&(r=i)}l=Math.max(t-s,r-c),l=l===0?0:32767/l}return ca(a,o,n,s,c,l,0),o}function oa(e,t,n,r,i){let a;if(i===La(e,t,n,r)>0)for(let i=t;i<n;i+=r)a=Pa(i/r|0,e[i],e[i+1],a);else for(let i=n-r;i>=t;i-=r)a=Pa(i/r|0,e[i],e[i+1],a);return a&&Ea(a,a.next)&&(Fa(a),a=a.next),a}function sa(e,t){if(!e)return e;t||=e;let n=e,r;do if(r=!1,!n.steiner&&(Ea(n,n.next)||Ta(n.prev,n,n.next)===0)){if(Fa(n),n=t=n.prev,n===n.next)break;r=!0}else n=n.next;while(r||n!==t);return t}function ca(e,t,n,r,i,a,o){if(!e)return;!o&&a&&va(e,r,i,a);let s=e;for(;e.prev!==e.next;){let c=e.prev,l=e.next;if(a?ua(e,r,i,a):la(e))t.push(c.i,e.i,l.i),Fa(e),e=l.next,s=l.next;else if(e=l,e===s){o?o===1?(e=da(sa(e),t),ca(e,t,n,r,i,a,2)):o===2&&fa(e,t,n,r,i,a):ca(sa(e),t,n,r,i,a,1);break}}}function la(e){let t=e.prev,n=e,r=e.next;if(Ta(t,n,r)>=0)return!1;let i=t.x,a=n.x,o=r.x,s=t.y,c=n.y,l=r.y,u=Math.min(i,a,o),d=Math.min(s,c,l),f=Math.max(i,a,o),p=Math.max(s,c,l),m=r.next;for(;m!==t;){if(m.x>=u&&m.x<=f&&m.y>=d&&m.y<=p&&Ca(i,s,a,c,o,l,m.x,m.y)&&Ta(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function ua(e,t,n,r){let i=e.prev,a=e,o=e.next;if(Ta(i,a,o)>=0)return!1;let s=i.x,c=a.x,l=o.x,u=i.y,d=a.y,f=o.y,p=Math.min(s,c,l),m=Math.min(u,d,f),h=Math.max(s,c,l),g=Math.max(u,d,f),_=ba(p,m,t,n,r),v=ba(h,g,t,n,r),y=e.prevZ,b=e.nextZ;for(;y&&y.z>=_&&b&&b.z<=v;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&Ca(s,u,c,d,l,f,y.x,y.y)&&Ta(y.prev,y,y.next)>=0||(y=y.prevZ,b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&Ca(s,u,c,d,l,f,b.x,b.y)&&Ta(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;y&&y.z>=_;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&Ca(s,u,c,d,l,f,y.x,y.y)&&Ta(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;b&&b.z<=v;){if(b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&Ca(s,u,c,d,l,f,b.x,b.y)&&Ta(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function da(e,t){let n=e;do{let r=n.prev,i=n.next.next;!Ea(r,i)&&Da(r,n,n.next,i)&&ja(r,i)&&ja(i,r)&&(t.push(r.i,n.i,i.i),Fa(n),Fa(n.next),n=e=i),n=n.next}while(n!==e);return sa(n)}function fa(e,t,n,r,i,a){let o=e;do{let e=o.next.next;for(;e!==o.prev;){if(o.i!==e.i&&wa(o,e)){let s=Na(o,e);o=sa(o,o.next),s=sa(s,s.next),ca(o,t,n,r,i,a,0),ca(s,t,n,r,i,a,0);return}e=e.next}o=o.next}while(o!==e)}function pa(e,t,n,r){let i=[];for(let n=0,a=t.length;n<a;n++){let o=oa(e,t[n]*r,n<a-1?t[n+1]*r:e.length,r,!1);o===o.next&&(o.steiner=!0),i.push(xa(o))}i.sort(ma);for(let e=0;e<i.length;e++)n=ha(i[e],n);return n}function ma(e,t){let n=e.x-t.x;return n===0&&(n=e.y-t.y,n===0&&(n=(e.next.y-e.y)/(e.next.x-e.x)-(t.next.y-t.y)/(t.next.x-t.x))),n}function ha(e,t){let n=ga(e,t);if(!n)return t;let r=Na(n,e);return sa(r,r.next),sa(n,n.next)}function ga(e,t){let n=t,r=e.x,i=e.y,a=-1/0,o;if(Ea(e,n))return n;do{if(Ea(e,n.next))return n.next;if(i<=n.y&&i>=n.next.y&&n.next.y!==n.y){let e=n.x+(i-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(e<=r&&e>a&&(a=e,o=n.x<n.next.x?n:n.next,e===r))return o}n=n.next}while(n!==t);if(!o)return null;let s=o,c=o.x,l=o.y,u=1/0;n=o;do{if(r>=n.x&&n.x>=c&&r!==n.x&&Sa(i<l?r:a,i,c,l,i<l?a:r,i,n.x,n.y)){let t=Math.abs(i-n.y)/(r-n.x);ja(n,e)&&(t<u||t===u&&(n.x>o.x||n.x===o.x&&_a(o,n)))&&(o=n,u=t)}n=n.next}while(n!==s);return o}function _a(e,t){return Ta(e.prev,e,t.prev)<0&&Ta(t.next,e,e.next)<0}function va(e,t,n,r){let i=e;do i.z===0&&(i.z=ba(i.x,i.y,t,n,r)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==e);i.prevZ.nextZ=null,i.prevZ=null,ya(i)}function ya(e){let t,n=1;do{let r=e,i;e=null;let a=null;for(t=0;r;){t++;let o=r,s=0;for(let e=0;e<n&&(s++,o=o.nextZ,o);e++);let c=n;for(;s>0||c>0&&o;)s!==0&&(c===0||!o||r.z<=o.z)?(i=r,r=r.nextZ,s--):(i=o,o=o.nextZ,c--),a?a.nextZ=i:e=i,i.prevZ=a,a=i;r=o}a.nextZ=null,n*=2}while(t>1);return e}function ba(e,t,n,r,i){return e=(e-n)*i|0,t=(t-r)*i|0,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e|t<<1}function xa(e){let t=e,n=e;do(t.x<n.x||t.x===n.x&&t.y<n.y)&&(n=t),t=t.next;while(t!==e);return n}function Sa(e,t,n,r,i,a,o,s){return(i-o)*(t-s)>=(e-o)*(a-s)&&(e-o)*(r-s)>=(n-o)*(t-s)&&(n-o)*(a-s)>=(i-o)*(r-s)}function Ca(e,t,n,r,i,a,o,s){return(e!==o||t!==s)&&Sa(e,t,n,r,i,a,o,s)}function wa(e,t){return e.next.i!==t.i&&e.prev.i!==t.i&&!Aa(e,t)&&(ja(e,t)&&ja(t,e)&&Ma(e,t)&&(Ta(e.prev,e,t.prev)||Ta(e,t.prev,t))||Ea(e,t)&&Ta(e.prev,e,e.next)>0&&Ta(t.prev,t,t.next)>0)}function Ta(e,t,n){return(t.y-e.y)*(n.x-t.x)-(t.x-e.x)*(n.y-t.y)}function Ea(e,t){return e.x===t.x&&e.y===t.y}function Da(e,t,n,r){let i=ka(Ta(e,t,n)),a=ka(Ta(e,t,r)),o=ka(Ta(n,r,e)),s=ka(Ta(n,r,t));return!!(i!==a&&o!==s||i===0&&Oa(e,n,t)||a===0&&Oa(e,r,t)||o===0&&Oa(n,e,r)||s===0&&Oa(n,t,r))}function Oa(e,t,n){return t.x<=Math.max(e.x,n.x)&&t.x>=Math.min(e.x,n.x)&&t.y<=Math.max(e.y,n.y)&&t.y>=Math.min(e.y,n.y)}function ka(e){return e>0?1:e<0?-1:0}function Aa(e,t){let n=e;do{if(n.i!==e.i&&n.next.i!==e.i&&n.i!==t.i&&n.next.i!==t.i&&Da(n,n.next,e,t))return!0;n=n.next}while(n!==e);return!1}function ja(e,t){return Ta(e.prev,e,e.next)<0?Ta(e,t,e.next)>=0&&Ta(e,e.prev,t)>=0:Ta(e,t,e.prev)<0||Ta(e,e.next,t)<0}function Ma(e,t){let n=e,r=!1,i=(e.x+t.x)/2,a=(e.y+t.y)/2;do n.y>a!=n.next.y>a&&n.next.y!==n.y&&i<(n.next.x-n.x)*(a-n.y)/(n.next.y-n.y)+n.x&&(r=!r),n=n.next;while(n!==e);return r}function Na(e,t){let n=Ia(e.i,e.x,e.y),r=Ia(t.i,t.x,t.y),i=e.next,a=t.prev;return e.next=t,t.prev=e,n.next=i,i.prev=n,r.next=n,n.prev=r,a.next=r,r.prev=a,r}function Pa(e,t,n,r){let i=Ia(e,t,n);return r?(i.next=r.next,i.prev=r,r.next.prev=i,r.next=i):(i.prev=i,i.next=i),i}function Fa(e){e.next.prev=e.prev,e.prev.next=e.next,e.prevZ&&(e.prevZ.nextZ=e.nextZ),e.nextZ&&(e.nextZ.prevZ=e.prevZ)}function Ia(e,t,n){return{i:e,x:t,y:n,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function La(e,t,n,r){let i=0;for(let a=t,o=n-r;a<n;a+=r)i+=(e[o]-e[a])*(e[a+1]+e[o+1]),o=a;return i}var Ra=class{static triangulate(e,t,n=2){return aa(e,t,n)}},za=class e{static area(e){let t=e.length,n=0;for(let r=t-1,i=0;i<t;r=i++)n+=e[r].x*e[i].y-e[i].x*e[r].y;return n*.5}static isClockWise(t){return e.area(t)<0}static triangulateShape(e,t){let n=[],r=[],i=[];Ba(e),Va(n,e);let a=e.length;t.forEach(Ba);for(let e=0;e<t.length;e++)r.push(a),a+=t[e].length,Va(n,t[e]);let o=Ra.triangulate(n,r);for(let e=0;e<o.length;e+=3)i.push(o.slice(e,e+3));return i}};function Ba(e){let t=e.length;t>2&&e[t-1].equals(e[0])&&e.pop()}function Va(e,t){for(let n=0;n<t.length;n++)e.push(t[n].x),e.push(t[n].y)}var Ha=class e extends Pr{constructor(e=new ia([new z(.5,.5),new z(-.5,.5),new z(-.5,-.5),new z(.5,-.5)]),t={}){super(),this.type=`ExtrudeGeometry`,this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,r=[],i=[];for(let t=0,n=e.length;t<n;t++){let n=e[t];a(n)}this.setAttribute(`position`,new Sr(r,3)),this.setAttribute(`uv`,new Sr(i,2)),this.computeVertexNormals();function a(e){let a=[],o=t.curveSegments===void 0?12:t.curveSegments,s=t.steps===void 0?1:t.steps,c=t.depth===void 0?1:t.depth,l=t.bevelEnabled===void 0||t.bevelEnabled,u=t.bevelThickness===void 0?.2:t.bevelThickness,d=t.bevelSize===void 0?u-.1:t.bevelSize,f=t.bevelOffset===void 0?0:t.bevelOffset,p=t.bevelSegments===void 0?3:t.bevelSegments,m=t.extrudePath,h=t.UVGenerator===void 0?Ua:t.UVGenerator,g,_=!1,v,y,b,x;if(m){g=m.getSpacedPoints(s),_=!0,l=!1;let e=m.isCatmullRomCurve3?m.closed:!1;v=m.computeFrenetFrames(s,e),y=new V,b=new V,x=new V}l||(p=0,u=0,d=0,f=0);let S=e.extractPoints(o),C=S.shape,w=S.holes;if(!za.isClockWise(C)){C=C.reverse();for(let e=0,t=w.length;e<t;e++){let t=w[e];za.isClockWise(t)&&(w[e]=t.reverse())}}function T(e){let t=e[0];for(let n=1;n<=e.length;n++){let r=n%e.length,i=e[r],a=i.x-t.x,o=i.y-t.y,s=a*a+o*o,c=Math.max(Math.abs(i.x),Math.abs(i.y),Math.abs(t.x),Math.abs(t.y));s<=10000000000000001e-36*c*c?(e.splice(r,1),n--):t=i}}T(C),w.forEach(T);let E=w.length,D=C;for(let e=0;e<E;e++){let t=w[e];C=C.concat(t)}function O(e,t,n){return t||R(`ExtrudeGeometry: vec does not exist`),e.clone().addScaledVector(t,n)}let k=C.length;function A(e,t,n){let r,i,a,o=e.x-t.x,s=e.y-t.y,c=n.x-e.x,l=n.y-e.y,u=o*o+s*s,d=o*l-s*c;if(Math.abs(d)>2**-52){let d=Math.sqrt(u),f=Math.sqrt(c*c+l*l),p=t.x-s/d,m=t.y+o/d,h=n.x-l/f,g=n.y+c/f,_=((h-p)*l-(g-m)*c)/(o*l-s*c);r=p+o*_-e.x,i=m+s*_-e.y;let v=r*r+i*i;if(v<=2)return new z(r,i);a=Math.sqrt(v/2)}else{let e=!1;o>2**-52?c>2**-52&&(e=!0):o<-(2**-52)?c<-(2**-52)&&(e=!0):Math.sign(s)===Math.sign(l)&&(e=!0),e?(r=-s,i=o,a=Math.sqrt(u)):(r=o,i=s,a=Math.sqrt(u/2))}return new z(r/a,i/a)}let j=[];for(let e=0,t=D.length,n=t-1,r=e+1;e<t;e++,n++,r++)n===t&&(n=0),r===t&&(r=0),j[e]=A(D[e],D[n],D[r]);let ee=[],te,M=j.concat();for(let e=0,t=E;e<t;e++){let t=w[e];te=[];for(let e=0,n=t.length,r=n-1,i=e+1;e<n;e++,r++,i++)r===n&&(r=0),i===n&&(i=0),te[e]=A(t[e],t[r],t[i]);ee.push(te),M=M.concat(te)}let ne;if(p===0)ne=za.triangulateShape(D,w);else{let e=[],t=[];for(let n=0;n<p;n++){let r=n/p,i=u*Math.cos(r*Math.PI/2),a=d*Math.sin(r*Math.PI/2)+f;for(let t=0,n=D.length;t<n;t++){let n=O(D[t],j[t],a);se(n.x,n.y,-i),r===0&&e.push(n)}for(let e=0,n=E;e<n;e++){let n=w[e];te=ee[e];let o=[];for(let e=0,t=n.length;e<t;e++){let t=O(n[e],te[e],a);se(t.x,t.y,-i),r===0&&o.push(t)}r===0&&t.push(o)}}ne=za.triangulateShape(e,t)}let N=ne.length,re=d+f;for(let e=0;e<k;e++){let t=l?O(C[e],M[e],re):C[e];_?(b.copy(v.normals[0]).multiplyScalar(t.x),y.copy(v.binormals[0]).multiplyScalar(t.y),x.copy(g[0]).add(b).add(y),se(x.x,x.y,x.z)):se(t.x,t.y,0)}for(let e=1;e<=s;e++)for(let t=0;t<k;t++){let n=l?O(C[t],M[t],re):C[t];_?(b.copy(v.normals[e]).multiplyScalar(n.x),y.copy(v.binormals[e]).multiplyScalar(n.y),x.copy(g[e]).add(b).add(y),se(x.x,x.y,x.z)):se(n.x,n.y,c/s*e)}for(let e=p-1;e>=0;e--){let t=e/p,n=u*Math.cos(t*Math.PI/2),r=d*Math.sin(t*Math.PI/2)+f;for(let e=0,t=D.length;e<t;e++){let t=O(D[e],j[e],r);se(t.x,t.y,c+n)}for(let e=0,t=w.length;e<t;e++){let t=w[e];te=ee[e];for(let e=0,i=t.length;e<i;e++){let i=O(t[e],te[e],r);_?se(i.x,i.y+g[s-1].y,g[s-1].x+n):se(i.x,i.y,c+n)}}}ie(),ae();function ie(){let e=r.length/3;if(l){let e=0,t=k*e;for(let e=0;e<N;e++){let n=ne[e];ce(n[2]+t,n[1]+t,n[0]+t)}e=s+p*2,t=k*e;for(let e=0;e<N;e++){let n=ne[e];ce(n[0]+t,n[1]+t,n[2]+t)}}else{for(let e=0;e<N;e++){let t=ne[e];ce(t[2],t[1],t[0])}for(let e=0;e<N;e++){let t=ne[e];ce(t[0]+k*s,t[1]+k*s,t[2]+k*s)}}n.addGroup(e,r.length/3-e,0)}function ae(){let e=r.length/3,t=0;oe(D,t),t+=D.length;for(let e=0,n=w.length;e<n;e++){let n=w[e];oe(n,t),t+=n.length}n.addGroup(e,r.length/3-e,1)}function oe(e,t){let n=e.length;for(;--n>=0;){let r=n,i=n-1;i<0&&(i=e.length-1);for(let e=0,n=s+p*2;e<n;e++){let n=k*e,a=k*(e+1);le(t+r+n,t+i+n,t+i+a,t+r+a)}}}function se(e,t,n){a.push(e),a.push(t),a.push(n)}function ce(e,t,i){P(e),P(t),P(i);let a=r.length/3,o=h.generateTopUV(n,r,a-3,a-2,a-1);ue(o[0]),ue(o[1]),ue(o[2])}function le(e,t,i,a){P(e),P(t),P(a),P(t),P(i),P(a);let o=r.length/3,s=h.generateSideWallUV(n,r,o-6,o-3,o-2,o-1);ue(s[0]),ue(s[1]),ue(s[3]),ue(s[1]),ue(s[2]),ue(s[3])}function P(e){r.push(a[e*3+0]),r.push(a[e*3+1]),r.push(a[e*3+2])}function ue(e){i.push(e.x),i.push(e.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return Wa(t,n,e)}static fromJSON(t,n){let r=[];for(let e=0,i=t.shapes.length;e<i;e++){let i=n[t.shapes[e]];r.push(i)}let i=t.options.extrudePath;return i!==void 0&&(t.options.extrudePath=new ta[i.type]().fromJSON(i)),new e(r,t.options)}},Ua={generateTopUV:function(e,t,n,r,i){let a=t[n*3],o=t[n*3+1],s=t[r*3],c=t[r*3+1],l=t[i*3],u=t[i*3+1];return[new z(a,o),new z(s,c),new z(l,u)]},generateSideWallUV:function(e,t,n,r,i,a){let o=t[n*3],s=t[n*3+1],c=t[n*3+2],l=t[r*3],u=t[r*3+1],d=t[r*3+2],f=t[i*3],p=t[i*3+1],m=t[i*3+2],h=t[a*3],g=t[a*3+1],_=t[a*3+2];return Math.abs(s-u)<Math.abs(o-l)?[new z(o,1-c),new z(l,1-d),new z(f,1-m),new z(h,1-_)]:[new z(s,1-c),new z(u,1-d),new z(p,1-m),new z(g,1-_)]}};function Wa(e,t,n){if(n.shapes=[],Array.isArray(e))for(let t=0,r=e.length;t<r;t++){let r=e[t];n.shapes.push(r.uuid)}else n.shapes.push(e.uuid);return n.options=Object.assign({},t),t.extrudePath!==void 0&&(n.options.extrudePath=t.extrudePath.toJSON()),n}var Ga=class e extends Di{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,r=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1];super(r,[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],e,t),this.type=`IcosahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},Ka=class e extends Pr{constructor(e=[new z(0,-.5),new z(.5,0),new z(0,.5)],t=12,n=0,r=Math.PI*2){super(),this.type=`LatheGeometry`,this.parameters={points:e,segments:t,phiStart:n,phiLength:r},t=Math.floor(t),r=ft(r,0,Math.PI*2);let i=[],a=[],o=[],s=[],c=[],l=1/t,u=new V,d=new z,f=new V,p=new V,m=new V,h=0,g=0;for(let t=0;t<=e.length-1;t++)switch(t){case 0:h=e[t+1].x-e[t].x,g=e[t+1].y-e[t].y,f.x=g*1,f.y=-h,f.z=g*0,m.copy(f),f.normalize(),s.push(f.x,f.y,f.z);break;case e.length-1:s.push(m.x,m.y,m.z);break;default:h=e[t+1].x-e[t].x,g=e[t+1].y-e[t].y,f.x=g*1,f.y=-h,f.z=g*0,p.copy(f),f.x+=m.x,f.y+=m.y,f.z+=m.z,f.normalize(),s.push(f.x,f.y,f.z),m.copy(p)}for(let i=0;i<=t;i++){let f=n+i*l*r,p=Math.sin(f),m=Math.cos(f);for(let n=0;n<=e.length-1;n++){u.x=e[n].x*p,u.y=e[n].y,u.z=e[n].x*m,a.push(u.x,u.y,u.z),d.x=i/t,d.y=n/(e.length-1),o.push(d.x,d.y);let r=s[3*n+0]*p,l=s[3*n+1],f=s[3*n+0]*m;c.push(r,l,f)}}for(let n=0;n<t;n++)for(let t=0;t<e.length-1;t++){let r=t+n*e.length,a=r,o=r+e.length,s=r+e.length+1,c=r+1;i.push(a,o,c),i.push(s,c,o)}this.setIndex(i),this.setAttribute(`position`,new Sr(a,3)),this.setAttribute(`uv`,new Sr(o,2)),this.setAttribute(`normal`,new Sr(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.points,t.segments,t.phiStart,t.phiLength)}},qa=class e extends Pr{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new Sr(p,3)),this.setAttribute(`normal`,new Sr(m,3)),this.setAttribute(`uv`,new Sr(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},Ja=class e extends Pr{constructor(e=1,t=32,n=16,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new V,d=new V,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=a+_*o,y=e*Math.cos(v),b=Math.sqrt(e*e-y*y),x=0;f===0&&a===0?x=.5/t:f===n&&s===Math.PI&&(x=-.5/t);for(let e=0;e<=t;e++){let n=e/t,a=r+n*i;u.x=-b*Math.cos(a),u.y=y,u.z=b*Math.sin(a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(n+x,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new Sr(p,3)),this.setAttribute(`normal`,new Sr(m,3)),this.setAttribute(`uv`,new Sr(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}},Ya=class e extends Pr{constructor(e=1,t=.4,n=12,r=48,i=Math.PI*2,a=0,o=Math.PI*2){super(),this.type=`TorusGeometry`,this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:r,arc:i,thetaStart:a,thetaLength:o},n=Math.floor(n),r=Math.floor(r);let s=[],c=[],l=[],u=[],d=new V,f=new V,p=new V;for(let s=0;s<=n;s++){let m=a+s/n*o;for(let a=0;a<=r;a++){let o=a/r*i;f.x=(e+t*Math.cos(m))*Math.cos(o),f.y=(e+t*Math.cos(m))*Math.sin(o),f.z=t*Math.sin(m),c.push(f.x,f.y,f.z),d.x=e*Math.cos(o),d.y=e*Math.sin(o),p.subVectors(f,d).normalize(),l.push(p.x,p.y,p.z),u.push(a/r),u.push(s/n)}}for(let e=1;e<=n;e++)for(let t=1;t<=r;t++){let n=(r+1)*e+t-1,i=(r+1)*(e-1)+t-1,a=(r+1)*(e-1)+t,o=(r+1)*e+t;s.push(n,i,o),s.push(i,a,o)}this.setIndex(s),this.setAttribute(`position`,new Sr(c,3)),this.setAttribute(`normal`,new Sr(l,3)),this.setAttribute(`uv`,new Sr(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}},Xa=class e extends Pr{constructor(e=new $i(new V(-1,-1,0),new V(-1,1,0),new V(1,1,0)),t=64,n=1,r=8,i=!1){super(),this.type=`TubeGeometry`,this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:r,closed:i};let a=e.computeFrenetFrames(t,i);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;let o=new V,s=new V,c=new z,l=new V,u=[],d=[],f=[],p=[];m(),this.setIndex(p),this.setAttribute(`position`,new Sr(u,3)),this.setAttribute(`normal`,new Sr(d,3)),this.setAttribute(`uv`,new Sr(f,2));function m(){for(let e=0;e<t;e++)h(e);h(i===!1?t:0),_(),g()}function h(i){l=e.getPointAt(i/t,l);let c=a.normals[i],f=a.binormals[i];for(let e=0;e<=r;e++){let t=e/r*Math.PI*2,i=Math.sin(t),a=-Math.cos(t);s.x=a*c.x+i*f.x,s.y=a*c.y+i*f.y,s.z=a*c.z+i*f.z,s.normalize(),d.push(s.x,s.y,s.z),o.x=l.x+n*s.x,o.y=l.y+n*s.y,o.z=l.z+n*s.z,u.push(o.x,o.y,o.z)}}function g(){for(let e=1;e<=t;e++)for(let t=1;t<=r;t++){let n=(r+1)*(e-1)+(t-1),i=(r+1)*e+(t-1),a=(r+1)*e+t,o=(r+1)*(e-1)+t;p.push(n,i,o),p.push(i,a,o)}}function _(){for(let e=0;e<=t;e++)for(let n=0;n<=r;n++)c.x=e/t,c.y=n/r,f.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(t){return new e(new ta[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}};function Za(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if($a(i))i.isRenderTargetTexture?(L(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if($a(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function Qa(e){let t={};for(let n=0;n<e.length;n++){let r=Za(e[n]);for(let e in r)t[e]=r[e]}return t}function $a(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function eo(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function to(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Vt.workingColorSpace}var no={clone:Za,merge:Qa},ro=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,io=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,ao=class extends Br{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ro,this.fragmentShader=io,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Za(e.uniforms),this.uniformsGroups=eo(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new U().setHex(r.value);break;case`v2`:this.uniforms[n].value=new z().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new V().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new Qt().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new It().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new rn().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},oo=class extends ao{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},so=class extends Br{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type=`MeshStandardMaterial`,this.defines={STANDARD:``},this.color=new U(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new U(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new z(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new mn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:``},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},co=class extends so{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:``,PHYSICAL:``},this.type=`MeshPhysicalMaterial`,this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new z(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return ft(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new U(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new U(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new U(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:``,PHYSICAL:``},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}},lo=class extends Br{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=Be,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},uo=class extends Br{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function fo(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function po(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}var mo=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},ho=class extends mo{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Le,endingEnd:Le}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case Re:i=e,o=2*t-n;break;case ze:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case Re:a=e,s=2*n-t;break;case ze:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},go=class extends mo{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},_o=class extends mo{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},vo=class extends mo{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=xo(n,t,g,y,r);i[p]=yo(x,o,_,b,m)}return i}};function yo(e,t,n,r,i){let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*r+e*e*e*i}function bo(e,t,n,r,i){let a=1-e;return 3*a*a*(n-t)+6*a*e*(r-n)+3*e*e*(i-r)}function xo(e,t,n,r,i){let a=(e-t)/(i-t);for(let o=0;o<8;o++){let o=yo(a,t,n,r,i)-e;if(Math.abs(o)<1e-10)break;let s=bo(a,t,n,r,i);if(Math.abs(s)<1e-10)break;a=Math.max(0,Math.min(1,a-o/s))}return a}var So=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=fo(t,this.TimeBufferType),this.values=fo(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:fo(e.times,Array),values:fo(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t),po(e.settings)&&(n.settings={inTangents:fo(e.settings.inTangents,Array),outTangents:fo(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new _o(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new go(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new ho(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new vo(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Pe:t=this.InterpolantFactoryMethodDiscrete;break;case Fe:t=this.InterpolantFactoryMethodLinear;break;case Ie:t=this.InterpolantFactoryMethodSmooth;break;case I:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return L(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Pe;case this.InterpolantFactoryMethodLinear:return Fe;case this.InterpolantFactoryMethodSmooth:return Ie;case this.InterpolantFactoryMethodBezier:return I}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e;po(this.settings)&&(Co(this.settings.inTangents,e),Co(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(R(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(R(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){R(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){R(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&Ze(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){R(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===Ie,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,po(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function Co(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]*=t}So.prototype.ValueTypeName=``,So.prototype.TimeBufferType=Float32Array,So.prototype.ValueBufferType=Float32Array,So.prototype.DefaultInterpolation=Fe;var wo=class extends So{constructor(e,t,n){super(e,t,n)}};wo.prototype.ValueTypeName=`bool`,wo.prototype.ValueBufferType=Array,wo.prototype.DefaultInterpolation=Pe,wo.prototype.InterpolantFactoryMethodLinear=void 0,wo.prototype.InterpolantFactoryMethodSmooth=void 0;var To=class extends So{constructor(e,t,n,r){super(e,t,n,r)}};To.prototype.ValueTypeName=`color`;var Eo=class extends So{constructor(e,t,n,r){super(e,t,n,r)}};Eo.prototype.ValueTypeName=`number`;var Do=class extends mo{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)B.slerpFlat(i,0,a,c-o,a,c,s);return i}},Oo=class extends So{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new Do(this.times,this.values,this.getValueSize(),e)}};Oo.prototype.ValueTypeName=`quaternion`,Oo.prototype.InterpolantFactoryMethodSmooth=void 0;var ko=class extends So{constructor(e,t,n){super(e,t,n)}};ko.prototype.ValueTypeName=`string`,ko.prototype.ValueBufferType=Array,ko.prototype.DefaultInterpolation=Pe,ko.prototype.InterpolantFactoryMethodLinear=void 0,ko.prototype.InterpolantFactoryMethodSmooth=void 0;var Ao=class extends So{constructor(e,t,n,r){super(e,t,n,r)}};Ao.prototype.ValueTypeName=`vector`;var jo=class extends jn{constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new U(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},Mo=class extends jo{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(jn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new U(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},No=new rn,Po=new V,Fo=new V,Io=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new z(512,512),this.mapType=d,this.map=null,this.mapPass=null,this.matrix=new rn,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new yi,this._frameExtents=new z(1,1),this._viewportCount=1,this._viewports=[new Qt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Po.setFromMatrixPosition(e.matrixWorld),t.position.copy(Po),Fo.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Fo),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,r){No.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(No,e.coordinateSystem,e.reversedDepth);let i=this._frameExtents,a=r?r.z/i.x:1,o=r?r.w/i.y:1,s=r?r.x/i.x:0,c=r?r.y/i.y:0;e.coordinateSystem===2001||e.reversedDepth?t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(No)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Lo=new V,Ro=new B,zo=new V,Bo=class extends jn{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new rn,this.projectionMatrix=new rn,this.projectionMatrixInverse=new rn,this.coordinateSystem=Ye,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Lo,Ro,zo),zo.x===1&&zo.y===1&&zo.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Lo,Ro,zo.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Lo,Ro,zo),zo.x===1&&zo.y===1&&zo.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Lo,Ro,zo.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Vo=new V,Ho=new z,Uo=new z,Wo=class extends Bo{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=ut*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(lt*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ut*2*Math.atan(Math.tan(lt*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Vo.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Vo.x,Vo.y).multiplyScalar(-e/Vo.z),Vo.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Vo.x,Vo.y).multiplyScalar(-e/Vo.z)}getViewSize(e,t){return this.getViewBounds(e,Ho,Uo),t.subVectors(Uo,Ho)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(lt*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Go=class extends Io{constructor(){super(new Wo(90,1,.5,500)),this.isPointLightShadow=!0}},Ko=class extends jo{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type=`PointLight`,this.distance=n,this.decay=r,this.shadow=new Go}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},qo=class extends Bo{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Jo=class extends Io{constructor(){super(new qo(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Yo=class extends jo{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(jn.DEFAULT_UP),this.updateMatrix(),this.target=new jn,this.shadow=new Jo}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},Xo=class extends Pr{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type=`InstancedBufferGeometry`,this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){let e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}},Zo=-90,Qo=1,$o=class extends jn{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new Wo(Zo,Qo,e,t);r.layers=this.layers,this.add(r);let i=new Wo(Zo,Qo,e,t);i.layers=this.layers,this.add(i);let a=new Wo(Zo,Qo,e,t);a.layers=this.layers,this.add(a);let o=new Wo(Zo,Qo,e,t);o.layers=this.layers,this.add(o);let s=new Wo(Zo,Qo,e,t);s.layers=this.layers,this.add(s);let c=new Wo(Zo,Qo,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},es=class extends Wo{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},ts=`\\[\\]\\.:\\/`,ns=RegExp(`[\\[\\]\\.:\\/]`,`g`),rs=`[^\\[\\]\\.:\\/]`,is=`[^`+ts.replace(`\\.`,``)+`]`,as=`((?:WC+[\\/:])*)`.replace(`WC`,rs),os=`(WCOD+)?`.replace(`WCOD`,is),ss=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,rs),cs=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,rs),ls=RegExp(`^`+as+os+ss+cs+`$`),us=[`material`,`materials`,`bones`,`map`],ds=class{constructor(e,t,n){let r=n||fs.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},fs=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(ns,``)}static parseTrackName(e){let t=ls.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);us.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){L(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){R(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){R(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){R(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){R(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){R(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){R(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){R(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;R(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){R(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){R(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};fs.Composite=ds,fs.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},fs.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},fs.prototype.GetterByBindingType=[fs.prototype._getValue_direct,fs.prototype._getValue_array,fs.prototype._getValue_arrayElement,fs.prototype._getValue_toArray],fs.prototype.SetterByBindingTypeAndVersioning=[[fs.prototype._setValue_direct,fs.prototype._setValue_direct_setNeedsUpdate,fs.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[fs.prototype._setValue_array,fs.prototype._setValue_array_setNeedsUpdate,fs.prototype._setValue_array_setMatrixWorldNeedsUpdate],[fs.prototype._setValue_arrayElement,fs.prototype._setValue_arrayElement_setNeedsUpdate,fs.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[fs.prototype._setValue_fromArray,fs.prototype._setValue_fromArray_setNeedsUpdate,fs.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var ps=class{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){let e=1e-6;return this.phi=ft(this.phi,e,Math.PI-e),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(ft(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};(class e{static{e.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}});var ms=class extends ot{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}};function hs(e,t,n,r){let i=gs(r);switch(n){case w:return e*t;case k:return e*t/i.components*i.byteLength;case A:return e*t/i.components*i.byteLength;case j:return e*t*2/i.components*i.byteLength;case ee:return e*t*2/i.components*i.byteLength;case T:return e*t*3/i.components*i.byteLength;case E:return e*t*4/i.components*i.byteLength;case te:return e*t*4/i.components*i.byteLength;case M:case ne:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case N:case re:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case ae:case se:return Math.max(e,16)*Math.max(t,8)/4;case ie:case oe:return Math.max(e,8)*Math.max(t,8)/2;case ce:case le:case ue:case de:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case P:case fe:case pe:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case me:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case he:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case ge:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case _e:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case ve:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case ye:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case be:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case xe:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case Se:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case Ce:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case we:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case Te:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case Ee:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case De:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case Oe:case ke:case Ae:return Math.ceil(e/4)*Math.ceil(t/4)*16;case je:case Me:return Math.ceil(e/4)*Math.ceil(t/4)*8;case Ne:case F:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function gs(e){switch(e){case d:case f:return{byteLength:1,components:1};case m:case p:case v:return{byteLength:2,components:1};case y:case b:return{byteLength:2,components:4};case g:case h:case _:return{byteLength:4,components:1};case S:case C:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`186`}})),typeof window<`u`&&(window.__THREE__?L(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`186`);function _s(){let e=null,t=!1,n=null,r=null;function i(t,a){r=e.requestAnimationFrame(i),n(t,a)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function vs(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var ys={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},K={common:{diffuse:{value:new U(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new It},alphaMap:{value:null},alphaMapTransform:{value:new It},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new It}},envmap:{envMap:{value:null},envMapRotation:{value:new It},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new It}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new It}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new It},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new It},normalScale:{value:new z(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new It},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new It}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new It}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new It}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new U(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new V},probesMax:{value:new V},probesResolution:{value:new V}},points:{diffuse:{value:new U(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new It},alphaTest:{value:0},uvTransform:{value:new It}},sprite:{diffuse:{value:new U(16777215)},opacity:{value:1},center:{value:new z(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new It},alphaMap:{value:null},alphaMapTransform:{value:new It},alphaTest:{value:0}}},bs={basic:{uniforms:Qa([K.common,K.specularmap,K.envmap,K.aomap,K.lightmap,K.fog]),vertexShader:ys.meshbasic_vert,fragmentShader:ys.meshbasic_frag},lambert:{uniforms:Qa([K.common,K.specularmap,K.envmap,K.aomap,K.lightmap,K.emissivemap,K.bumpmap,K.normalmap,K.displacementmap,K.fog,K.lights,{emissive:{value:new U(0)},envMapIntensity:{value:1}}]),vertexShader:ys.meshlambert_vert,fragmentShader:ys.meshlambert_frag},phong:{uniforms:Qa([K.common,K.specularmap,K.envmap,K.aomap,K.lightmap,K.emissivemap,K.bumpmap,K.normalmap,K.displacementmap,K.fog,K.lights,{emissive:{value:new U(0)},specular:{value:new U(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:ys.meshphong_vert,fragmentShader:ys.meshphong_frag},standard:{uniforms:Qa([K.common,K.envmap,K.aomap,K.lightmap,K.emissivemap,K.bumpmap,K.normalmap,K.displacementmap,K.roughnessmap,K.metalnessmap,K.fog,K.lights,{emissive:{value:new U(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ys.meshphysical_vert,fragmentShader:ys.meshphysical_frag},toon:{uniforms:Qa([K.common,K.aomap,K.lightmap,K.emissivemap,K.bumpmap,K.normalmap,K.displacementmap,K.gradientmap,K.fog,K.lights,{emissive:{value:new U(0)}}]),vertexShader:ys.meshtoon_vert,fragmentShader:ys.meshtoon_frag},matcap:{uniforms:Qa([K.common,K.bumpmap,K.normalmap,K.displacementmap,K.fog,{matcap:{value:null}}]),vertexShader:ys.meshmatcap_vert,fragmentShader:ys.meshmatcap_frag},points:{uniforms:Qa([K.points,K.fog]),vertexShader:ys.points_vert,fragmentShader:ys.points_frag},dashed:{uniforms:Qa([K.common,K.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ys.linedashed_vert,fragmentShader:ys.linedashed_frag},depth:{uniforms:Qa([K.common,K.displacementmap]),vertexShader:ys.depth_vert,fragmentShader:ys.depth_frag},normal:{uniforms:Qa([K.common,K.bumpmap,K.normalmap,K.displacementmap,{opacity:{value:1}}]),vertexShader:ys.meshnormal_vert,fragmentShader:ys.meshnormal_frag},sprite:{uniforms:Qa([K.sprite,K.fog]),vertexShader:ys.sprite_vert,fragmentShader:ys.sprite_frag},background:{uniforms:{uvTransform:{value:new It},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ys.background_vert,fragmentShader:ys.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new It}},vertexShader:ys.backgroundCube_vert,fragmentShader:ys.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ys.cube_vert,fragmentShader:ys.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ys.equirect_vert,fragmentShader:ys.equirect_frag},distance:{uniforms:Qa([K.common,K.displacementmap,{referencePosition:{value:new V},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ys.distance_vert,fragmentShader:ys.distance_frag},shadow:{uniforms:Qa([K.lights,K.fog,{color:{value:new U(0)},opacity:{value:1}}]),vertexShader:ys.shadow_vert,fragmentShader:ys.shadow_frag}};bs.physical={uniforms:Qa([bs.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new It},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new It},clearcoatNormalScale:{value:new z(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new It},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new It},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new It},sheen:{value:0},sheenColor:{value:new U(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new It},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new It},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new It},transmissionSamplerSize:{value:new z},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new It},attenuationDistance:{value:0},attenuationColor:{value:new U(0)},specularColor:{value:new U(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new It},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new It},anisotropyVector:{value:new z},anisotropyMap:{value:null},anisotropyMapTransform:{value:new It}}]),vertexShader:ys.meshphysical_vert,fragmentShader:ys.meshphysical_frag};var xs={r:0,b:0,g:0},Ss=new rn,Cs=new It;Cs.set(-1,0,0,0,1,0,0,0,1);function ws(e,t,n,r,i,a){let o=new U(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&(i.isCubeTexture||i.mapping===306)?(l===void 0&&(l=new W(new wi(1,1,1),new ao({name:`BackgroundCubeMaterial`,uniforms:Za(bs.backgroundCube.uniforms),vertexShader:bs.backgroundCube.vertexShader,fragmentShader:bs.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(Ss.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Cs),l.material.toneMapped=Vt.getTransfer(i.colorSpace)!==Ge,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new W(new qa(2,2),new ao({name:`BackgroundMaterial`,uniforms:Za(bs.background.uniforms),vertexShader:bs.background.vertexShader,fragmentShader:bs.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=Vt.getTransfer(i.colorSpace)!==Ge,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(xs,to(e)),n.buffers.color.setClear(xs.r,xs.g,xs.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function Ts(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function Es(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function Ds(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&n!==1015&&!i&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(L(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&L(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function Os(e){let t=this,n=null,r=0,i=!1,a=!1,o=new Rr,s=new It,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var ks=4,As=6,js=20,Ms=256,Ns=new qo,Ps=new U,Fs=null,Is=0,Ls=0,Rs=!1,zs=new V,Bs=new V,Vs=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=zs}=i;Fs=this._renderer.getRenderTarget(),Is=this._renderer.getActiveCubeFace(),Ls=this._renderer.getActiveMipmapLevel(),Rs=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Js(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=qs(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Fs,Is,Ls),this._renderer.xr.enabled=Rs,e.scissorTest=!1,Ws(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Fs=this._renderer.getRenderTarget(),Is=this._renderer.getActiveCubeFace(),Ls=this._renderer.getActiveMipmapLevel(),Rs=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:c,minFilter:c,generateMipmaps:!1,type:v,format:E,colorSpace:Ue,depthBuffer:!1},r=Us(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Us(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=Hs(r)),this._blurMaterial=Ks(r,e,t),this._ggxMaterial=Gs(r,e,t)}return r}_compileMaterial(e){let t=new W(new Pr,e);this._renderer.compile(t,Ns)}_sceneToCubeUV(e,t,n,r,i){let a=new Wo(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(Ps),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new W(new wi,new Kr({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy(Ps),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;Ws(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Js()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=qs());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;Ws(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,Ns)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-ks?n-d+ks:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,Ws(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,Ns),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,Ws(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,Ns)}_blur(e,t,n,r){let i=this._pingPongRenderTarget,a=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,i,t,n,a),this._blurPass(i,e,n,n,a)}_blurPass(e,t,n,r,i){let a=this._renderer,o=this._blurMaterial,s=this._lodMeshes[r];s.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=i,c.mipInt.value=this._lodMax-n;let l=this._sizeLods[r];Ws(t,3*l*(r>this._lodMax-ks?r-this._lodMax+ks:0),4*(this._cubeSize-l),3*l,2*l),a.setRenderTarget(t),a.render(s,Ns)}};function Hs(e){let t=[],n=[],r=e,i=e-ks+1+As;for(let e=0;e<i;e++){let e=2**r;t.push(e);let i=1/(e-2),a=-i,o=1+i,s=[a,a,o,a,o,o,a,a,o,o,a,o],c=new Float32Array(108),l=new Float32Array(108);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];c.set(r,18*e);for(let t=0;t<6;t++){let n=s[t*2]*2-1,r=s[t*2+1]*2-1;e===0?Bs.set(1,r,n):e===1?Bs.set(-n,1,-r):e===2?Bs.set(-n,r,1):e===3?Bs.set(-1,r,-n):e===4?Bs.set(-n,-1,r):Bs.set(n,r,-1),Bs.toArray(l,(e*6+t)*3)}}let u=new Pr;u.setAttribute(`position`,new yr(c,3)),u.setAttribute(`outputDirection`,new yr(l,3)),n.push(new W(u,null)),r>ks&&r--}return{lodMeshes:n,sizeLods:t}}function Us(e,t,n){let r=new en(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function Ws(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function Gs(e,t,n){return new ao({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:Ms,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Ys(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Ks(e,t,n){return new ao({name:`SphericalGaussianBlur`,defines:{SAMPLES:js,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Ys(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function qs(){return new ao({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:Ys(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Js(){return new ao({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ys(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Ys(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var Xs=class extends en{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new bi(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new wi(5,5,5),i=new ao({name:`CubemapFromEquirect`,uniforms:Za(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new W(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=c),new $o(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function Zs(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new Xs(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new Vs(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new Vs(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function Qs(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&rt(`WebGLRenderer: `+e+` extension not supported.`),t}}}function $s(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0||(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++),t}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?xr:br)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function ec(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function tc(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:R(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function nc(e,t,n){let r=new WeakMap,i=new Qt;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new tn(h,p,m,u);g.type=_,g.needsUpdate=!0;let v=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*v;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new z(p,m)},r.set(o,d);function y(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,y)}o.addEventListener(`dispose`,y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function rc(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var ic={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function ac(e,t,n,r,i,a){let o=new en(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),s=null,c=null,l=new Pr;l.setAttribute(`position`,new Sr([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute(`uv`,new Sr([0,2,0,0,2,0],2));let u=new oo({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new W(l,u),f=new qo(-1,1,1,-1,0,1),p=null,m=null,h=!1,g,_=null,y=[],b=!1;this.setSize=function(e,t){o.setSize(e,t),s!==null&&s.setSize(e,t),c!==null&&c.setSize(e,t);for(let n=0;n<y.length;n++){let r=y[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){y=e,b=y.length>0&&y[0].isRenderPass===!0;let t=o.width,n=o.height;y.length>0&&s===null&&(s=new en(t,n,{type:v,depthBuffer:!1,stencilBuffer:!1}),c=new en(t,n,{type:v,depthBuffer:!1,stencilBuffer:!1}));for(let e=0;e<y.length;e++){let r=y[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(h||e.toneMapping===0&&y.length===0)return!1;if(_=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return b===!1&&e.setRenderTarget(o),g=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return b},this.end=function(e,t){e.toneMapping=g,h=!0;let n=o,r=s;for(let i=0;i<y.length;i++){let a=y[i];a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1&&(n=r,r=r===s?c:s))}if(p!==e.outputColorSpace||m!==e.toneMapping){p=e.outputColorSpace,m=e.toneMapping,u.defines={},Vt.getTransfer(p)===`srgb`&&(u.defines.SRGB_TRANSFER=``);let t=ic[m];t&&(u.defines[t]=``),u.needsUpdate=!0}u.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(_),e.render(d,f),_=null,h=!1},this.isCompositing=function(){return h},this.dispose=function(){o.dispose(),s!==null&&s.dispose(),c!==null&&c.dispose(),l.dispose(),u.dispose()}}var oc=new Zt,sc=new xi(1,1),cc=new tn,lc=new nn,uc=new bi,dc=[],fc=[],pc=new Float32Array(16),mc=new Float32Array(9),hc=new Float32Array(4);function gc(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=dc[i];if(a===void 0&&(a=new Float32Array(i),dc[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function _c(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function vc(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function yc(e,t){let n=fc[t];n===void 0&&(n=new Int32Array(t),fc[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function bc(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function xc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(_c(n,t))return;e.uniform2fv(this.addr,t),vc(n,t)}}function Sc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(_c(n,t))return;e.uniform3fv(this.addr,t),vc(n,t)}}function Cc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(_c(n,t))return;e.uniform4fv(this.addr,t),vc(n,t)}}function wc(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(_c(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),vc(n,t)}else{if(_c(n,r))return;hc.set(r),e.uniformMatrix2fv(this.addr,!1,hc),vc(n,r)}}function Tc(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(_c(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),vc(n,t)}else{if(_c(n,r))return;mc.set(r),e.uniformMatrix3fv(this.addr,!1,mc),vc(n,r)}}function Ec(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(_c(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),vc(n,t)}else{if(_c(n,r))return;pc.set(r),e.uniformMatrix4fv(this.addr,!1,pc),vc(n,r)}}function Dc(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function Oc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(_c(n,t))return;e.uniform2iv(this.addr,t),vc(n,t)}}function kc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(_c(n,t))return;e.uniform3iv(this.addr,t),vc(n,t)}}function Ac(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(_c(n,t))return;e.uniform4iv(this.addr,t),vc(n,t)}}function jc(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function Mc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(_c(n,t))return;e.uniform2uiv(this.addr,t),vc(n,t)}}function Nc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(_c(n,t))return;e.uniform3uiv(this.addr,t),vc(n,t)}}function Pc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(_c(n,t))return;e.uniform4uiv(this.addr,t),vc(n,t)}}function Fc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(sc.compareFunction=n.isReversedDepthBuffer()?518:515,a=sc):a=oc,n.setTexture2D(t||a,i)}function Ic(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||lc,i)}function Lc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||uc,i)}function Rc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||cc,i)}function zc(e){switch(e){case 5126:return bc;case 35664:return xc;case 35665:return Sc;case 35666:return Cc;case 35674:return wc;case 35675:return Tc;case 35676:return Ec;case 5124:case 35670:return Dc;case 35667:case 35671:return Oc;case 35668:case 35672:return kc;case 35669:case 35673:return Ac;case 5125:return jc;case 36294:return Mc;case 36295:return Nc;case 36296:return Pc;case 35678:case 36198:case 36298:case 36306:case 35682:return Fc;case 35679:case 36299:case 36307:return Ic;case 35680:case 36300:case 36308:case 36293:return Lc;case 36289:case 36303:case 36311:case 36292:return Rc}}function Bc(e,t){e.uniform1fv(this.addr,t)}function Vc(e,t){let n=gc(t,this.size,2);e.uniform2fv(this.addr,n)}function Hc(e,t){let n=gc(t,this.size,3);e.uniform3fv(this.addr,n)}function Uc(e,t){let n=gc(t,this.size,4);e.uniform4fv(this.addr,n)}function Wc(e,t){let n=gc(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function Gc(e,t){let n=gc(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function Kc(e,t){let n=gc(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function qc(e,t){e.uniform1iv(this.addr,t)}function Jc(e,t){e.uniform2iv(this.addr,t)}function Yc(e,t){e.uniform3iv(this.addr,t)}function Xc(e,t){e.uniform4iv(this.addr,t)}function Zc(e,t){e.uniform1uiv(this.addr,t)}function Qc(e,t){e.uniform2uiv(this.addr,t)}function $c(e,t){e.uniform3uiv(this.addr,t)}function el(e,t){e.uniform4uiv(this.addr,t)}function tl(e,t,n){let r=this.cache,i=t.length,a=yc(n,i);_c(r,a)||(e.uniform1iv(this.addr,a),vc(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?sc:oc;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function nl(e,t,n){let r=this.cache,i=t.length,a=yc(n,i);_c(r,a)||(e.uniform1iv(this.addr,a),vc(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||lc,a[e])}function rl(e,t,n){let r=this.cache,i=t.length,a=yc(n,i);_c(r,a)||(e.uniform1iv(this.addr,a),vc(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||uc,a[e])}function il(e,t,n){let r=this.cache,i=t.length,a=yc(n,i);_c(r,a)||(e.uniform1iv(this.addr,a),vc(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||cc,a[e])}function al(e){switch(e){case 5126:return Bc;case 35664:return Vc;case 35665:return Hc;case 35666:return Uc;case 35674:return Wc;case 35675:return Gc;case 35676:return Kc;case 5124:case 35670:return qc;case 35667:case 35671:return Jc;case 35668:case 35672:return Yc;case 35669:case 35673:return Xc;case 5125:return Zc;case 36294:return Qc;case 36295:return $c;case 36296:return el;case 35678:case 36198:case 36298:case 36306:case 35682:return tl;case 35679:case 36299:case 36307:return nl;case 35680:case 36300:case 36308:case 36293:return rl;case 36289:case 36303:case 36311:case 36292:return il}}var ol=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=zc(t.type)}},sl=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=al(t.type)}},cl=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},ll=/(\w+)(\])?(\[|\.)?/g;function ul(e,t){e.seq.push(t),e.map[t.id]=t}function dl(e,t,n){let r=e.name,i=r.length;for(ll.lastIndex=0;;){let a=ll.exec(r),o=ll.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){ul(n,l===void 0?new ol(s,e,t):new sl(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new cl(s),ul(n,e)),n=e}}}var fl=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);dl(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function pl(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var ml=37297,hl=0;function gl(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var _l=new It;function vl(e){Vt._getMatrix(_l,Vt.workingColorSpace,e);let t=`mat3( ${_l.elements.map(e=>e.toFixed(4))} )`;switch(Vt.getTransfer(e)){case We:return[t,`LinearTransferOETF`];case Ge:return[t,`sRGBTransferOETF`];default:return L(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function yl(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+gl(e.getShaderSource(t),r)}return i}function bl(e,t){let n=vl(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var xl={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function Sl(e,t){let n=xl[t];return n===void 0?(L(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var Cl=new V;function wl(){return Vt.getLuminanceCoefficients(Cl),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${Cl.x.toFixed(4)}, ${Cl.y.toFixed(4)}, ${Cl.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function Tl(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(Ol).join(`
`)}function El(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function Dl(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function Ol(e){return e!==``}function kl(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Al(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var jl=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ml(e){return e.replace(jl,Pl)}var Nl=new Map;function Pl(e,t){let n=ys[t];if(n===void 0){let e=Nl.get(t);if(e!==void 0)n=ys[e],L(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`)}return Ml(n)}var Fl=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Il(e){return e.replace(Fl,Ll)}function Ll(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function Rl(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var zl={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function Bl(e){return zl[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var Vl={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function Hl(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:Vl[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var Ul={302:`ENVMAP_MODE_REFRACTION`};function Wl(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:Ul[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var Gl={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function Kl(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:Gl[e.combine]||`ENVMAP_BLENDING_NONE`}function ql(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function Jl(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=Bl(n),l=Hl(n),u=Wl(n),d=Kl(n),f=ql(n),p=Tl(n),m=El(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Ol).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Ol).join(`
`),_.length>0&&(_+=`
`)):(g=[Rl(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(Ol).join(`
`),_=[Rl(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.retroreflection?`#define USE_RETROREFLECTION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:ys.tonemapping_pars_fragment,n.toneMapping===0?``:Sl(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,ys.colorspace_pars_fragment,bl(`linearToOutputTexel`,n.outputColorSpace),wl(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(Ol).join(`
`)),o=Ml(o),o=kl(o,n),o=Al(o,n),s=Ml(s),s=kl(s,n),s=Al(s,n),o=Il(o),s=Il(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=pl(i,i.VERTEX_SHADER,y),S=pl(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=yl(i,x,`vertex`),n=yl(i,S,`fragment`);R(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):L(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new fl(i,h),T=Dl(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,ml)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=hl++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var Yl=0,Xl=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Zl(e),t.set(e,n)),n}},Zl=class{constructor(e){this.id=Yl++,this.code=e,this.usedTimes=0}};function Ql(e){return e===1030||e===37490||e===36285}function $l(e,t,n,r,i,a){let o=new hn,s=new Xl,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&L(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,O,k,A;if(C){let e=bs[C];D=e.vertexShader,O=e.fragmentShader}else{D=i.vertexShader,O=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),k=e.id,A=t.id}let j=e.getRenderTarget(),ee=e.state.buffers.depth.getReversed(),te=h.isInstancedMesh===!0,M=h.isBatchedMesh===!0,ne=!!i.map,N=!!i.matcap,re=!!x,ie=!!i.aoMap,ae=!!i.lightMap,oe=!!i.bumpMap&&i.wireframe===!1,se=!!i.normalMap,ce=!!i.displacementMap,le=!!i.emissiveMap,P=!!i.metalnessMap,ue=!!i.roughnessMap,de=i.anisotropy>0,fe=i.clearcoat>0,pe=i.dispersion>0,me=i.retroreflectivity>0,he=i.iridescence>0,ge=i.sheen>0,_e=i.transmission>0,ve=de&&!!i.anisotropyMap,ye=fe&&!!i.clearcoatMap,be=fe&&!!i.clearcoatNormalMap,xe=fe&&!!i.clearcoatRoughnessMap,Se=he&&!!i.iridescenceMap,Ce=he&&!!i.iridescenceThicknessMap,we=ge&&!!i.sheenColorMap,Te=ge&&!!i.sheenRoughnessMap,Ee=!!i.specularMap,De=!!i.specularColorMap,Oe=!!i.specularIntensityMap,ke=_e&&!!i.transmissionMap,Ae=_e&&!!i.thicknessMap,je=!!i.gradientMap,Me=!!i.alphaMap,Ne=i.alphaTest>0,F=!!i.alphaHash,Pe=!!i.extensions,Fe=0;i.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(Fe=e.toneMapping);let Ie={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:O,defines:i.defines,customVertexShaderID:k,customFragmentShaderID:A,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:M,batchingColor:M&&h._colorsTexture!==null,instancing:te,instancingColor:te&&h.instanceColor!==null,instancingMorph:te&&h.morphTexture!==null,outputColorSpace:j===null?e.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:Vt.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:ne,matcap:N,envMap:re,envMapMode:re&&x.mapping,envMapCubeUVHeight:S,aoMap:ie,lightMap:ae,bumpMap:oe,normalMap:se,displacementMap:ce,emissiveMap:le,normalMapObjectSpace:se&&i.normalMapType===1,normalMapTangentSpace:se&&i.normalMapType===0,packedNormalMap:se&&i.normalMapType===0&&Ql(i.normalMap.format),metalnessMap:P,roughnessMap:ue,anisotropy:de,anisotropyMap:ve,clearcoat:fe,clearcoatMap:ye,clearcoatNormalMap:be,clearcoatRoughnessMap:xe,dispersion:pe,retroreflection:me,iridescence:he,iridescenceMap:Se,iridescenceThicknessMap:Ce,sheen:ge,sheenColorMap:we,sheenRoughnessMap:Te,specularMap:Ee,specularColorMap:De,specularIntensityMap:Oe,transmission:_e,transmissionMap:ke,thicknessMap:Ae,gradientMap:je,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:Me,alphaTest:Ne,alphaHash:F,combine:i.combine,mapUv:ne&&m(i.map.channel),aoMapUv:ie&&m(i.aoMap.channel),lightMapUv:ae&&m(i.lightMap.channel),bumpMapUv:oe&&m(i.bumpMap.channel),normalMapUv:se&&m(i.normalMap.channel),displacementMapUv:ce&&m(i.displacementMap.channel),emissiveMapUv:le&&m(i.emissiveMap.channel),metalnessMapUv:P&&m(i.metalnessMap.channel),roughnessMapUv:ue&&m(i.roughnessMap.channel),anisotropyMapUv:ve&&m(i.anisotropyMap.channel),clearcoatMapUv:ye&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:be&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:xe&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:Se&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:Ce&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:we&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:Te&&m(i.sheenRoughnessMap.channel),specularMapUv:Ee&&m(i.specularMap.channel),specularColorMapUv:De&&m(i.specularColorMap.channel),specularIntensityMapUv:Oe&&m(i.specularIntensityMap.channel),transmissionMapUv:ke&&m(i.transmissionMap.channel),thicknessMapUv:Ae&&m(i.thicknessMap.channel),alphaMapUv:Me&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(se||de),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(ne||Me),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&se===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:ee,skinning:h.isSkinnedMesh===!0,hasPositionAttribute:v.attributes.position!==void 0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numSunLights:o.sun.length,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numSunLightShadows:o.sunShadowMap.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:Fe,decodeVideoTexture:ne&&i.map.isVideoTexture===!0&&Vt.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:le&&i.emissiveMap.isVideoTexture===!0&&Vt.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:Pe&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(Pe&&i.extensions.multiDraw===!0||M)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return Ie.vertexUv1s=c.has(1),Ie.vertexUv2s=c.has(2),Ie.vertexUv3s=c.has(3),c.clear(),Ie}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numSunLights),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numSunLightShadows),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.retroreflection&&o.enable(24),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function y(e){let t=p[e.type],n;if(t){let e=bs[t];n=no.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r=u.get(n);return r===void 0?(r=new Jl(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function x(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function S(e){s.remove(e)}function C(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:y,acquireProgram:b,releaseProgram:x,releaseShaderCache:S,programs:l,dispose:C}}function eu(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function tu(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function nu(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function ru(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l,u){u.reversedDepth===!0&&(c=-c);let d=s(e,t,a,o,c,l);a.transmission>0?r.push(d):a.transparent===!0?i.push(d):n.push(d)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||tu),r.length>1&&r.sort(t||nu),i.length>1&&i.sort(t||nu)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function iu(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new ru,e.set(t,[i])):n>=r.length?(i=new ru,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function au(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={direction:new V,color:new U};break;case`SpotLight`:n={position:new V,direction:new V,color:new U,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new V,color:new U,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new V,skyColor:new U,groundColor:new U};break;case`RectAreaLight`:n={color:new U,position:new V,halfWidth:new V,halfHeight:new V}}return e[t.id]=n,n}}}function ou(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new z};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new z};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new z,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var su=0;function cu(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function lu(e){let t=new au,n=ou(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new V);let i=new V,a=new rn,o=new rn;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=0,x=0;i.sort(cu);for(let e=0,S=i.length;e<S;e++){let S=i[e],C=S.color,w=S.intensity,T=S.distance,E=null;if(S.shadow&&S.shadow.map&&(E=S.shadow.map.texture.format===1030?S.shadow.map.texture:S.shadow.map.depthTexture||S.shadow.map.texture),S.isAmbientLight)a+=C.r*w,o+=C.g*w,s+=C.b*w;else if(S.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(S.sh.coefficients[e],w);x++}else if(S.isSunLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()),r.sunShadow[l]=t,r.sunShadowMap[l]=E;let i=e.getViewportCount();for(let t=0;t<i;t++)r.sunShadowMatrix[u+t]=e.getMatrix(t),r.sunShadowCascade[u+t]=e._cascadeData[t];u+=i,l++}r.sun[c]=e,c++}else if(S.isDirectionalLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[d]=t,r.directionalShadowMap[d]=E,r.directionalShadowMatrix[d]=S.shadow.matrix,g++}r.directional[d]=e,d++}else if(S.isSpotLight){let e=t.get(S);e.position.setFromMatrixPosition(S.matrixWorld),e.color.copy(C).multiplyScalar(w),e.distance=T,e.coneCos=Math.cos(S.angle),e.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),e.decay=S.decay,r.spot[p]=e;let i=S.shadow;if(S.map&&(r.spotLightMap[y]=S.map,y++,i.updateMatrices(S),S.castShadow&&b++),r.spotLightMatrix[p]=i.matrix,S.castShadow){let e=n.get(S);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[p]=e,r.spotShadowMap[p]=E,v++}p++}else if(S.isRectAreaLight){let e=t.get(S);e.color.copy(C).multiplyScalar(w),e.halfWidth.set(S.width*.5,0,0),e.halfHeight.set(0,S.height*.5,0),r.rectArea[m]=e,m++}else if(S.isPointLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),e.distance=S.distance,e.decay=S.decay,S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[f]=t,r.pointShadowMap[f]=E,r.pointShadowMatrix[f]=S.shadow.matrix,_++}r.point[f]=e,f++}else if(S.isHemisphereLight){let e=t.get(S);e.skyColor.copy(S.color).multiplyScalar(w),e.groundColor.copy(S.groundColor).multiplyScalar(w),r.hemi[h]=e,h++}}m>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=K.LTC_FLOAT_1,r.rectAreaLTC2=K.LTC_FLOAT_2):(r.rectAreaLTC1=K.LTC_HALF_1,r.rectAreaLTC2=K.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let S=r.hash;(S.sunLength!==c||S.directionalLength!==d||S.pointLength!==f||S.spotLength!==p||S.rectAreaLength!==m||S.hemiLength!==h||S.numSunShadows!==l||S.numDirectionalShadows!==g||S.numPointShadows!==_||S.numSpotShadows!==v||S.numSpotMaps!==y||S.numLightProbes!==x)&&(r.sun.length=c,r.directional.length=d,r.spot.length=p,r.rectArea.length=m,r.point.length=f,r.hemi.length=h,r.sunShadow.length=l,r.sunShadowMap.length=l,r.sunShadowMatrix.length=u,r.sunShadowCascade.length=u,r.directionalShadow.length=g,r.directionalShadowMap.length=g,r.directionalShadowMatrix.length=g,r.pointShadow.length=_,r.pointShadowMap.length=_,r.pointShadowMatrix.length=_,r.spotShadow.length=v,r.spotShadowMap.length=v,r.spotLightMatrix.length=v+y-b,r.spotLightMap.length=y,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=x,S.sunLength=c,S.directionalLength=d,S.pointLength=f,S.spotLength=p,S.rectAreaLength=m,S.hemiLength=h,S.numSunShadows=l,S.numDirectionalShadows=g,S.numPointShadows=_,S.numSpotShadows=v,S.numSpotMaps=y,S.numLightProbes=x,r.version=su++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=0,f=t.matrixWorldInverse;for(let t=0,p=e.length;t<p;t++){let p=e[t];if(p.isSunLight){let e=r.sun[n];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),n++}else if(p.isDirectionalLight){let e=r.directional[s];e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),s++}else if(p.isSpotLight){let e=r.spot[l];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),l++}else if(p.isRectAreaLight){let e=r.rectArea[u];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),o.identity(),a.copy(p.matrixWorld),a.premultiply(f),o.extractRotation(a),e.halfWidth.set(p.width*.5,0,0),e.halfHeight.set(0,p.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),u++}else if(p.isPointLight){let e=r.point[c];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),c++}else if(p.isHemisphereLight){let e=r.hemi[d];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),d++}}}return{setup:s,setupView:c,state:r}}function uu(e){let t=new lu(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function du(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new uu(e),t.set(n,[a])):r>=i.length?(a=new uu(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var fu=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,pu=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,mu=[new V(1,0,0),new V(-1,0,0),new V(0,1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1)],hu=[new V(0,-1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1),new V(0,-1,0),new V(0,-1,0)],gu=new rn,_u=new V,vu=new V;function yu(e,t,n){let r=new yi,i=new z,o=new z,s=new Qt,l=new lo,u=new uo,d={},f=n.maxTextureSize,p={0:1,1:0,2:2},m=new ao({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new z},radius:{value:4}},vertexShader:fu,fragmentShader:pu}),h=m.clone();h.defines.HORIZONTAL_PASS=1;let y=new Pr;y.setAttribute(`position`,new yr(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let b=new W(y,m),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let S=this.type;this.render=function(t,n,l){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||t.length===0)return;this.type===2&&(L(`WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead.`),this.type=1);let u=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),m=e.state;m.setBlending(0),m.buffers.depth.getReversed()===!0?m.buffers.color.setClear(0,0,0,0):m.buffers.color.setClear(1,1,1,1),m.buffers.depth.setTest(!0),m.setScissorTest(!1);let h=S!==this.type;h&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let u=0,d=t.length;u<d;u++){let d=t[u],p=d.shadow;if(p===void 0){L(`WebGLShadowMap:`,d,`has no shadow.`);continue}if(p.autoUpdate===!1&&p.needsUpdate===!1)continue;i.copy(p.mapSize);let y=p.getFrameExtents();i.multiply(y),o.copy(p.mapSize),(i.x>f||i.y>f)&&(i.x>f&&(o.x=Math.floor(f/y.x),i.x=o.x*y.x,p.mapSize.x=o.x),i.y>f&&(o.y=Math.floor(f/y.y),i.y=o.y*y.y,p.mapSize.y=o.y));let b=e.state.buffers.depth.getReversed();if(p.camera._reversedDepth=b,p.map===null||h===!0){if(p.map!==null&&(p.map.depthTexture!==null&&(p.map.depthTexture.dispose(),p.map.depthTexture=null),p.map.dispose()),this.type===3){if(d.isPointLight){L(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}p.map=new en(i.x,i.y,{format:j,type:v,minFilter:c,magFilter:c,generateMipmaps:!1}),p.map.texture.name=d.name+`.shadowMap`,p.map.depthTexture=new xi(i.x,i.y,_),p.map.depthTexture.name=d.name+`.shadowMapDepth`,p.map.depthTexture.format=D,p.map.depthTexture.compareFunction=null,p.map.depthTexture.minFilter=a,p.map.depthTexture.magFilter=a}else d.isPointLight?(p.map=new Xs(i.x),p.map.depthTexture=new Si(i.x,g)):(p.map=new en(i.x,i.y),p.map.depthTexture=new xi(i.x,i.y,g)),p.map.depthTexture.name=d.name+`.shadowMap`,p.map.depthTexture.format=D,this.type===1?(p.map.depthTexture.compareFunction=b?518:515,p.map.depthTexture.minFilter=c,p.map.depthTexture.magFilter=c):(p.map.depthTexture.compareFunction=null,p.map.depthTexture.minFilter=a,p.map.depthTexture.magFilter=a);p.camera.updateProjectionMatrix()}p.map.isWebGLCubeRenderTarget!==!0&&(p.map.width!==i.x||p.map.height!==i.y)&&p.map.setSize(i.x,i.y);let x=p.map.isWebGLCubeRenderTarget?6:p.getViewportCount();d.isPointLight!==!0&&p.updateMatrices(d,l);for(let t=0;t<x;t++){let i=p.getCamera(t);if(d.isPointLight){let e=p.camera,n=p.matrix,r=d.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),_u.setFromMatrixPosition(d.matrixWorld),e.position.copy(_u),vu.copy(e.position),vu.add(mu[t]),e.up.copy(hu[t]),e.lookAt(vu),e.updateMatrixWorld(),n.makeTranslation(-_u.x,-_u.y,-_u.z),gu.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),p._frustum.setFromProjectionMatrix(gu,e.coordinateSystem,e.reversedDepth)}if(p.map.isWebGLCubeRenderTarget)e.setRenderTarget(p.map,t),e.clear();else{t===0&&(e.setRenderTarget(p.map),e.clear());let n=p.getViewport(t);s.set(o.x*n.x,o.y*n.y,o.x*n.z,o.y*n.w),m.viewport(s)}r=p.getFrustum(t),T(n,l,i,d,this.type)}p.isPointLightShadow!==!0&&this.type===3&&C(p,l),p.needsUpdate=!1}S=this.type,x.needsUpdate=!1,e.setRenderTarget(u,d,p)};function C(n,r){let a=t.update(b);m.defines.VSM_SAMPLES!==n.blurSamples&&(m.defines.VSM_SAMPLES=n.blurSamples,h.defines.VSM_SAMPLES=n.blurSamples,m.needsUpdate=!0,h.needsUpdate=!0),n.mapPass===null?n.mapPass=new en(i.x,i.y,{format:j,type:v}):(n.mapPass.width!==n.map.width||n.mapPass.height!==n.map.height)&&n.mapPass.setSize(n.map.width,n.map.height),m.uniforms.shadow_pass.value=n.map.depthTexture,m.uniforms.resolution.value.set(n.map.width,n.map.height),m.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,m,b,null),h.uniforms.shadow_pass.value=n.mapPass.texture,h.uniforms.resolution.value.set(n.map.width,n.map.height),h.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,h,b,null)}function w(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?u:l,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=d[e];r===void 0&&(r={},d[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,E)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?p[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function T(n,i,a,o,s){if(n.visible===!1)return;if(n.layers.test(i.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||n.intersectsFrustum(r))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),c=n.material;if(Array.isArray(c)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=w(n,d,o,s);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(c.visible){let t=w(n,c,o,s);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)T(c[e],i,a,o,s)}function E(e){e.target.removeEventListener(`dispose`,E);for(let t in d){let n=d[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function bu(e,t){function n(){let t=!1,n=new Qt,r=null,i=new Qt(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?P(e.DEPTH_TEST):ue(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=at[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?P(e.STENCIL_TEST):ue(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new U(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,ee=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),te=!1,M=0,ne=e.getParameter(e.VERSION);ne.indexOf(`WebGL`)===-1?ne.indexOf(`OpenGL ES`)!==-1&&(M=parseFloat(/^OpenGL ES (\d)/.exec(ne)[1]),te=M>=2):(M=parseFloat(/^WebGL (\d)/.exec(ne)[1]),te=M>=1);let N=null,re={},ie=e.getParameter(e.SCISSOR_BOX),ae=e.getParameter(e.VIEWPORT),oe=new Qt().fromArray(ie),se=new Qt().fromArray(ae);function ce(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let le={};le[e.TEXTURE_2D]=ce(e.TEXTURE_2D,e.TEXTURE_2D,1),le[e.TEXTURE_CUBE_MAP]=ce(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),le[e.TEXTURE_2D_ARRAY]=ce(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),le[e.TEXTURE_3D]=ce(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),P(e.DEPTH_TEST),o.setFunc(3),ve(!1),ye(1),P(e.CULL_FACE),ge(0);function P(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function ue(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function de(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function fe(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function pe(t){return h!==t&&(e.useProgram(t),h=t,!0)}let me={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};me[103]=e.MIN,me[104]=e.MAX;let he={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function ge(t,n,r,i,a,o,s,c,l,u){if(t===0)g===!0&&(ue(e.BLEND),g=!1);else if(g===!1&&(P(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:R(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:R(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:R(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:R(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}}else a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(me[n],me[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(he[r],he[i],he[o],he[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function _e(t,n){t.side===2?ue(e.CULL_FACE):P(e.CULL_FACE);let r=t.side===1;n&&(r=!r),ve(r),t.blending===1&&t.transparent===!1?ge(0):ge(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),xe(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?P(e.SAMPLE_ALPHA_TO_COVERAGE):ue(e.SAMPLE_ALPHA_TO_COVERAGE)}function ve(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function ye(t){t===0?ue(e.CULL_FACE):(P(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function be(t){t!==k&&(te&&e.lineWidth(t),k=t)}function xe(t,n,r){t?(P(e.POLYGON_OFFSET_FILL),(A!==n||j!==r)&&(A=n,j=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):ue(e.POLYGON_OFFSET_FILL)}function Se(t){t?P(e.SCISSOR_TEST):ue(e.SCISSOR_TEST)}function Ce(t){t===void 0&&(t=e.TEXTURE0+ee-1),N!==t&&(e.activeTexture(t),N=t)}function we(t,n,r){r===void 0&&(r=N===null?e.TEXTURE0+ee-1:N);let i=re[r];i===void 0&&(i={type:void 0,texture:void 0},re[r]=i),(i.type!==t||i.texture!==n)&&(N!==r&&(e.activeTexture(r),N=r),e.bindTexture(t,n||le[t]),i.type=t,i.texture=n)}function Te(){let t=re[N];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function Ee(){try{e.compressedTexImage2D(...arguments)}catch(e){R(`WebGLState:`,e)}}function De(){try{e.compressedTexImage3D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Oe(){try{e.texSubImage2D(...arguments)}catch(e){R(`WebGLState:`,e)}}function ke(){try{e.texSubImage3D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Ae(){try{e.compressedTexSubImage2D(...arguments)}catch(e){R(`WebGLState:`,e)}}function je(){try{e.compressedTexSubImage3D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Me(){try{e.texStorage2D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Ne(){try{e.texStorage3D(...arguments)}catch(e){R(`WebGLState:`,e)}}function F(){try{e.texImage2D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Pe(){try{e.texImage3D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Fe(t){return d[t]===void 0?e.getParameter(t):d[t]}function Ie(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function I(t){oe.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),oe.copy(t))}function Le(t){se.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),se.copy(t))}function Re(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function ze(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function Be(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},N=null,re={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new U(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,oe.set(0,0,e.canvas.width,e.canvas.height),se.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:P,disable:ue,bindFramebuffer:de,drawBuffers:fe,useProgram:pe,setBlending:ge,setMaterial:_e,setFlipSided:ve,setCullFace:ye,setLineWidth:be,setPolygonOffset:xe,setScissorTest:Se,activeTexture:Ce,bindTexture:we,unbindTexture:Te,compressedTexImage2D:Ee,compressedTexImage3D:De,texImage2D:F,texImage3D:Pe,pixelStorei:Ie,getParameter:Fe,updateUBOMapping:Re,uniformBlockBinding:ze,texStorage2D:Me,texStorage3D:Ne,texSubImage2D:Oe,texSubImage3D:ke,compressedTexSubImage2D:Ae,compressedTexSubImage3D:je,scissor:I,viewport:Le,reset:Be}}function xu(e,t,d,f,p,m,h){let g=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,_=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),v=new z,y=new WeakMap,b=new Set,x,S=new WeakMap,C=!1;try{C=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function w(e,t){return C?new OffscreenCanvas(e,t):Qe(`canvas`)}function T(e,t,n){let r=1,i=Fe(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);x===void 0&&(x=w(n,a));let o=t?w(n,a):x;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),L(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&L(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function E(e){return e.generateMipmaps}function D(t){e.generateMipmap(t)}function k(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function A(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];L(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||L(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?We:Vt.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function j(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,L(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function ee(e,t){return E(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function te(e){let t=e.target;t.removeEventListener(`dispose`,te),ne(t),t.isVideoTexture&&y.delete(t),t.isHTMLTexture&&b.delete(t)}function M(e){let t=e.target;t.removeEventListener(`dispose`,M),re(t)}function ne(e){let t=f.get(e);if(t.__webglInit===void 0)return;let n=e.source,r=S.get(n);if(r){let i=r[t.__cacheKey];i.usedTimes--,i.usedTimes===0&&N(e),Object.keys(r).length===0&&S.delete(n)}f.remove(e)}function N(t){let n=f.get(t);e.deleteTexture(n.__webglTexture);let r=t.source,i=S.get(r);delete i[n.__cacheKey],h.memory.textures--}function re(t){let n=f.get(t);if(t.depthTexture&&(t.depthTexture.dispose(),f.remove(t.depthTexture)),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let r=t.textures;for(let t=0,n=r.length;t<n;t++){let n=f.get(r[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),h.memory.textures--),f.remove(r[t])}f.remove(t)}let ie=0;function ae(){ie=0}function oe(){return ie}function se(e){ie=e}function ce(){let e=ie;return e>=p.maxTextures&&L(`WebGLTextures: Trying to use `+(e+1)+` texture units while this GPU supports only `+p.maxTextures),ie+=1,e}function le(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function P(t,n){let r=f.get(t);if(t.isVideoTexture&&F(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&r.__version!==t.version){let e=t.image;if(e===null)L(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)L(`WebGLRenderer: Texture marked for update but image is incomplete`);else{be(r,t,n);return}}else t.isExternalTexture&&(r.__webglTexture=t.sourceTexture?t.sourceTexture:null);d.bindTexture(e.TEXTURE_2D,r.__webglTexture,e.TEXTURE0+n)}function ue(t,n){let r=f.get(t);t.isRenderTargetTexture===!1&&t.version>0&&r.__version!==t.version?be(r,t,n):(t.isExternalTexture&&(r.__webglTexture=t.sourceTexture?t.sourceTexture:null),d.bindTexture(e.TEXTURE_2D_ARRAY,r.__webglTexture,e.TEXTURE0+n))}function de(t,n){let r=f.get(t);t.isRenderTargetTexture===!1&&t.version>0&&r.__version!==t.version?be(r,t,n):d.bindTexture(e.TEXTURE_3D,r.__webglTexture,e.TEXTURE0+n)}function fe(t,n){let r=f.get(t);t.isCubeDepthTexture!==!0&&t.version>0&&r.__version!==t.version?xe(r,t,n):d.bindTexture(e.TEXTURE_CUBE_MAP,r.__webglTexture,e.TEXTURE0+n)}let pe={[n]:e.REPEAT,[r]:e.CLAMP_TO_EDGE,[i]:e.MIRRORED_REPEAT},me={[a]:e.NEAREST,[o]:e.NEAREST_MIPMAP_NEAREST,[s]:e.NEAREST_MIPMAP_LINEAR,[c]:e.LINEAR,[l]:e.LINEAR_MIPMAP_NEAREST,[u]:e.LINEAR_MIPMAP_LINEAR},he={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function ge(n,r){if(r.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(r.magFilter===1006||r.magFilter===1007||r.magFilter===1005||r.magFilter===1008||r.minFilter===1006||r.minFilter===1007||r.minFilter===1005||r.minFilter===1008)&&L(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,pe[r.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,pe[r.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,pe[r.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,me[r.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,me[r.minFilter]),r.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,he[r.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(r.magFilter===1003||r.minFilter!==1005&&r.minFilter!==1008||r.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(r.anisotropy>1||f.get(r).__currentAnisotropy){let i=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,i.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(r.anisotropy,p.getMaxAnisotropy())),f.get(r).__currentAnisotropy=r.anisotropy}}}function _e(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,te));let i=n.source,a=S.get(i);a===void 0&&(a={},S.set(i,a));let o=le(n);if(o!==t.__cacheKey){a[o]===void 0&&(a[o]={texture:e.createTexture(),usedTimes:0},h.memory.textures++,r=!0),a[o].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&N(n)),t.__cacheKey=o,t.__webglTexture=a[o].texture}return r}function ve(e,t,n){return Math.floor(Math.floor(e/n)/t)}function ye(t,n,r,i){let a=t.updateRanges;if(a.length===0)d.texSubImage2D(e.TEXTURE_2D,0,0,0,n.width,n.height,r,i,n.data);else{a.sort((e,t)=>e.start-t.start);let o=0;for(let e=1;e<a.length;e++){let t=a[o],r=a[e],i=t.start+t.count,s=ve(r.start,n.width,4),c=ve(t.start,n.width,4);r.start<=i+1&&s===c&&ve(r.start+r.count-1,n.width,4)===s?t.count=Math.max(t.count,r.start+r.count-t.start):(++o,a[o]=r)}a.length=o+1;let s=d.getParameter(e.UNPACK_ROW_LENGTH),c=d.getParameter(e.UNPACK_SKIP_PIXELS),l=d.getParameter(e.UNPACK_SKIP_ROWS);d.pixelStorei(e.UNPACK_ROW_LENGTH,n.width);for(let t=0,o=a.length;t<o;t++){let o=a[t],s=Math.floor(o.start/4),c=Math.ceil(o.count/4),l=s%n.width,u=Math.floor(s/n.width),f=c;d.pixelStorei(e.UNPACK_SKIP_PIXELS,l),d.pixelStorei(e.UNPACK_SKIP_ROWS,u),d.texSubImage2D(e.TEXTURE_2D,0,l,u,f,1,r,i,n.data)}t.clearUpdateRanges(),d.pixelStorei(e.UNPACK_ROW_LENGTH,s),d.pixelStorei(e.UNPACK_SKIP_PIXELS,c),d.pixelStorei(e.UNPACK_SKIP_ROWS,l)}}function be(t,n,r){let i=e.TEXTURE_2D;(n.isDataArrayTexture||n.isCompressedArrayTexture)&&(i=e.TEXTURE_2D_ARRAY),n.isData3DTexture&&(i=e.TEXTURE_3D);let a=_e(t,n),o=n.source;d.bindTexture(i,t.__webglTexture,e.TEXTURE0+r);let s=f.get(o);if(o.version!==s.__version||a===!0){if(d.activeTexture(e.TEXTURE0+r),!(typeof ImageBitmap<`u`&&n.image instanceof ImageBitmap)){let t=Vt.getPrimaries(Vt.workingColorSpace),r=n.colorSpace===``?null:Vt.getPrimaries(n.colorSpace),i=n.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;d.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,n.flipY),d.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,n.premultiplyAlpha),d.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,i)}d.pixelStorei(e.UNPACK_ALIGNMENT,n.unpackAlignment);let t=T(n.image,!1,p.maxTextureSize);t=Pe(n,t);let c=m.convert(n.format,n.colorSpace),l=m.convert(n.type),u=A(n.internalFormat,c,l,n.normalized,n.colorSpace,n.isVideoTexture);ge(i,n);let f,h=n.mipmaps,g=n.isVideoTexture!==!0,_=s.__version===void 0||a===!0,v=o.dataReady,y=ee(n,t);if(n.isDepthTexture)u=j(n.format===O,n.type),_&&(g?d.texStorage2D(e.TEXTURE_2D,1,u,t.width,t.height):d.texImage2D(e.TEXTURE_2D,0,u,t.width,t.height,0,c,l,null));else if(n.isDataTexture){if(h.length>0){g&&_&&d.texStorage2D(e.TEXTURE_2D,y,u,h[0].width,h[0].height);for(let t=0,n=h.length;t<n;t++)f=h[t],g?v&&d.texSubImage2D(e.TEXTURE_2D,t,0,0,f.width,f.height,c,l,f.data):d.texImage2D(e.TEXTURE_2D,t,u,f.width,f.height,0,c,l,f.data);n.generateMipmaps=!1}else g?(_&&d.texStorage2D(e.TEXTURE_2D,y,u,t.width,t.height),v&&ye(n,t,c,l)):d.texImage2D(e.TEXTURE_2D,0,u,t.width,t.height,0,c,l,t.data)}else if(n.isCompressedTexture){if(n.isCompressedArrayTexture){g&&_&&d.texStorage3D(e.TEXTURE_2D_ARRAY,y,u,h[0].width,h[0].height,t.depth);for(let r=0,i=h.length;r<i;r++)if(f=h[r],n.format!==1023){if(c!==null){if(g){if(v){if(n.layerUpdates.size>0){let t=hs(f.width,f.height,n.format,n.type);for(let i of n.layerUpdates){let n=f.data.subarray(i*t/f.data.BYTES_PER_ELEMENT,(i+1)*t/f.data.BYTES_PER_ELEMENT);d.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,r,0,0,i,f.width,f.height,1,c,n)}}else d.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,r,0,0,0,f.width,f.height,t.depth,c,f.data)}}else d.compressedTexImage3D(e.TEXTURE_2D_ARRAY,r,u,f.width,f.height,t.depth,0,f.data,0,0)}else L(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else g?v&&d.texSubImage3D(e.TEXTURE_2D_ARRAY,r,0,0,0,f.width,f.height,t.depth,c,l,f.data):d.texImage3D(e.TEXTURE_2D_ARRAY,r,u,f.width,f.height,t.depth,0,c,l,f.data);n.layerUpdates.size>0&&n.clearLayerUpdates()}else{g&&_&&d.texStorage2D(e.TEXTURE_2D,y,u,h[0].width,h[0].height);for(let t=0,r=h.length;t<r;t++)f=h[t],n.format===1023?g?v&&d.texSubImage2D(e.TEXTURE_2D,t,0,0,f.width,f.height,c,l,f.data):d.texImage2D(e.TEXTURE_2D,t,u,f.width,f.height,0,c,l,f.data):c===null?L(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):g?v&&d.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,f.width,f.height,c,f.data):d.compressedTexImage2D(e.TEXTURE_2D,t,u,f.width,f.height,0,f.data)}}else if(n.isDataArrayTexture){if(g){if(_&&d.texStorage3D(e.TEXTURE_2D_ARRAY,y,u,t.width,t.height,t.depth),v){if(n.layerUpdates.size>0){let r=hs(t.width,t.height,n.format,n.type);for(let i of n.layerUpdates){let n=t.data.subarray(i*r/t.data.BYTES_PER_ELEMENT,(i+1)*r/t.data.BYTES_PER_ELEMENT);d.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,i,t.width,t.height,1,c,l,n)}n.clearLayerUpdates()}else d.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,c,l,t.data)}}else d.texImage3D(e.TEXTURE_2D_ARRAY,0,u,t.width,t.height,t.depth,0,c,l,t.data)}else if(n.isData3DTexture)g?(_&&d.texStorage3D(e.TEXTURE_3D,y,u,t.width,t.height,t.depth),v&&d.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,c,l,t.data)):d.texImage3D(e.TEXTURE_3D,0,u,t.width,t.height,t.depth,0,c,l,t.data);else if(n.isFramebufferTexture){if(_){if(g)d.texStorage2D(e.TEXTURE_2D,y,u,t.width,t.height);else{let n=t.width,r=t.height;for(let t=0;t<y;t++)d.texImage2D(e.TEXTURE_2D,t,u,n,r,0,c,l,null),n>>=1,r>>=1}}}else if(n.isHTMLTexture){if(`texElementImage2D`in e){let r=e.canvas;if(r.hasAttribute(`layoutsubtree`)||r.setAttribute(`layoutsubtree`,`true`),t.parentNode!==r){r.appendChild(t),b.add(n),r.onpaint=e=>{let t=e.changedElements;for(let e of b)t.includes(e.image)&&(e.needsUpdate=!0)},r.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(h.length>0){if(g&&_){let t=Fe(h[0]);d.texStorage2D(e.TEXTURE_2D,y,u,t.width,t.height)}for(let t=0,n=h.length;t<n;t++)f=h[t],g?v&&d.texSubImage2D(e.TEXTURE_2D,t,0,0,c,l,f):d.texImage2D(e.TEXTURE_2D,t,u,c,l,f);n.generateMipmaps=!1}else if(g){if(_){let n=Fe(t);d.texStorage2D(e.TEXTURE_2D,y,u,n.width,n.height)}v&&d.texSubImage2D(e.TEXTURE_2D,0,0,0,c,l,t)}else d.texImage2D(e.TEXTURE_2D,0,u,c,l,t);E(n)&&D(i),s.__version=o.version,n.onUpdate&&n.onUpdate(n)}t.__version=n.version}function xe(t,n,r){if(n.image.length!==6)return;let i=_e(t,n),a=n.source;d.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+r);let o=f.get(a);if(a.version!==o.__version||i===!0){d.activeTexture(e.TEXTURE0+r);let t=Vt.getPrimaries(Vt.workingColorSpace),s=n.colorSpace===``?null:Vt.getPrimaries(n.colorSpace),c=n.colorSpace===``||t===s?e.NONE:e.BROWSER_DEFAULT_WEBGL;d.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,n.flipY),d.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,n.premultiplyAlpha),d.pixelStorei(e.UNPACK_ALIGNMENT,n.unpackAlignment),d.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,c);let l=n.isCompressedTexture||n.image[0].isCompressedTexture,u=n.image[0]&&n.image[0].isDataTexture,f=[];for(let e=0;e<6;e++)!l&&!u?f[e]=T(n.image[e],!0,p.maxCubemapSize):f[e]=u?n.image[e].image:n.image[e],f[e]=Pe(n,f[e]);let h=f[0],g=m.convert(n.format,n.colorSpace),_=m.convert(n.type),v=A(n.internalFormat,g,_,n.normalized,n.colorSpace),y=n.isVideoTexture!==!0,b=o.__version===void 0||i===!0,x=a.dataReady,S=ee(n,h);ge(e.TEXTURE_CUBE_MAP,n);let C;if(l){y&&b&&d.texStorage2D(e.TEXTURE_CUBE_MAP,S,v,h.width,h.height);for(let t=0;t<6;t++){C=f[t].mipmaps;for(let r=0;r<C.length;r++){let i=C[r];n.format===1023?y?x&&d.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,_,i.data):d.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,v,i.width,i.height,0,g,_,i.data):g===null?L(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):y?x&&d.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,i.data):d.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,v,i.width,i.height,0,i.data)}}}else{if(C=n.mipmaps,y&&b){C.length>0&&S++;let t=Fe(f[0]);d.texStorage2D(e.TEXTURE_CUBE_MAP,S,v,t.width,t.height)}for(let t=0;t<6;t++)if(u){y?x&&d.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,f[t].width,f[t].height,g,_,f[t].data):d.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,v,f[t].width,f[t].height,0,g,_,f[t].data);for(let n=0;n<C.length;n++){let r=C[n].image[t].image;y?x&&d.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,n+1,0,0,r.width,r.height,g,_,r.data):d.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,n+1,v,r.width,r.height,0,g,_,r.data)}}else{y?x&&d.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,g,_,f[t]):d.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,v,g,_,f[t]);for(let n=0;n<C.length;n++){let r=C[n];y?x&&d.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,n+1,0,0,g,_,r.image[t]):d.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,n+1,v,g,_,r.image[t])}}}E(n)&&D(e.TEXTURE_CUBE_MAP),o.__version=a.version,n.onUpdate&&n.onUpdate(n)}t.__version=n.version}function Se(t,n,r,i,a,o){let s=m.convert(r.format,r.colorSpace),c=m.convert(r.type),l=A(r.internalFormat,s,c,r.normalized,r.colorSpace),u=f.get(n),p=f.get(r);if(p.__renderTarget=n,!u.__hasExternalTextures){let t=Math.max(1,n.width>>o),r=Math.max(1,n.height>>o);a===e.TEXTURE_3D||a===e.TEXTURE_2D_ARRAY?d.texImage3D(a,o,l,t,r,n.depth,0,s,c,null):d.texImage2D(a,o,l,t,r,0,s,c,null)}d.bindFramebuffer(e.FRAMEBUFFER,t),Ne(n)?g.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,i,a,p.__webglTexture,0,Me(n)):(a===e.TEXTURE_2D||a>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&a<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,i,a,p.__webglTexture,o),d.bindFramebuffer(e.FRAMEBUFFER,null)}function Ce(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=j(n.stencilBuffer,a),s=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;Ne(n)?g.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Me(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Me(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,s,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let a=t[i],o=m.convert(a.format,a.colorSpace),s=m.convert(a.type),c=A(a.internalFormat,o,s,a.normalized,a.colorSpace);Ne(n)?g.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Me(n),c,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Me(n),c,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,c,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function we(t,n,r){let i=n.isWebGLCubeRenderTarget===!0;if(d.bindFramebuffer(e.FRAMEBUFFER,t),!(n.depthTexture&&n.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let a=f.get(n.depthTexture);if(a.__renderTarget=n,(!a.__webglTexture||n.depthTexture.image.width!==n.width||n.depthTexture.image.height!==n.height)&&(n.depthTexture.image.width=n.width,n.depthTexture.image.height=n.height,n.depthTexture.needsUpdate=!0),i){if(a.__webglInit===void 0&&(a.__webglInit=!0,n.depthTexture.addEventListener(`dispose`,te)),a.__webglTexture===void 0){a.__webglTexture=e.createTexture(),d.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture),ge(e.TEXTURE_CUBE_MAP,n.depthTexture);let t=m.convert(n.depthTexture.format),r=m.convert(n.depthTexture.type),i;n.depthTexture.format===1026?i=e.DEPTH_COMPONENT24:n.depthTexture.format===1027&&(i=e.DEPTH24_STENCIL8);for(let a=0;a<6;a++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+a,0,i,n.width,n.height,0,t,r,null)}}else P(n.depthTexture,0);let o=a.__webglTexture,s=Me(n),c=i?e.TEXTURE_CUBE_MAP_POSITIVE_X+r:e.TEXTURE_2D,l=n.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(n.depthTexture.format===1026)Ne(n)?g.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,l,c,o,0,s):e.framebufferTexture2D(e.FRAMEBUFFER,l,c,o,0);else if(n.depthTexture.format===1027)Ne(n)?g.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,l,c,o,0,s):e.framebufferTexture2D(e.FRAMEBUFFER,l,c,o,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function Te(t){let n=f.get(t),r=t.isWebGLCubeRenderTarget===!0;if(n.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(n.__depthDisposeCallback&&n.__depthDisposeCallback(),e){let t=()=>{delete n.__boundDepthTexture,delete n.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),n.__depthDisposeCallback=t}n.__boundDepthTexture=e}if(t.depthTexture&&!n.__autoAllocateDepthBuffer){if(r)for(let e=0;e<6;e++)we(n.__webglFramebuffer[e],t,e);else{let e=t.texture.mipmaps;e&&e.length>0?we(n.__webglFramebuffer[0],t,0):we(n.__webglFramebuffer,t,0)}}else if(r){n.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(d.bindFramebuffer(e.FRAMEBUFFER,n.__webglFramebuffer[r]),n.__webglDepthbuffer[r]===void 0)n.__webglDepthbuffer[r]=e.createRenderbuffer(),Ce(n.__webglDepthbuffer[r],t,!1);else{let i=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=n.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,i,e.RENDERBUFFER,a)}}else{let r=t.texture.mipmaps;if(r&&r.length>0?d.bindFramebuffer(e.FRAMEBUFFER,n.__webglFramebuffer[0]):d.bindFramebuffer(e.FRAMEBUFFER,n.__webglFramebuffer),n.__webglDepthbuffer===void 0)n.__webglDepthbuffer=e.createRenderbuffer(),Ce(n.__webglDepthbuffer,t,!1);else{let r=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,i=n.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,i),e.framebufferRenderbuffer(e.FRAMEBUFFER,r,e.RENDERBUFFER,i)}}d.bindFramebuffer(e.FRAMEBUFFER,null)}function Ee(t,n,r){let i=f.get(t);n!==void 0&&Se(i.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),r!==void 0&&Te(t)}function De(t){let n=t.texture,r=f.get(t),i=f.get(n);t.addEventListener(`dispose`,M);let a=t.textures,o=t.isWebGLCubeRenderTarget===!0,s=a.length>1;if(s||(i.__webglTexture===void 0&&(i.__webglTexture=e.createTexture()),i.__version=n.version,h.memory.textures++),o){r.__webglFramebuffer=[];for(let t=0;t<6;t++)if(n.mipmaps&&n.mipmaps.length>0){r.__webglFramebuffer[t]=[];for(let i=0;i<n.mipmaps.length;i++)r.__webglFramebuffer[t][i]=e.createFramebuffer()}else r.__webglFramebuffer[t]=e.createFramebuffer()}else{if(n.mipmaps&&n.mipmaps.length>0){r.__webglFramebuffer=[];for(let t=0;t<n.mipmaps.length;t++)r.__webglFramebuffer[t]=e.createFramebuffer()}else r.__webglFramebuffer=e.createFramebuffer();if(s)for(let t=0,n=a.length;t<n;t++){let n=f.get(a[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),h.memory.textures++)}if(t.samples>0&&Ne(t)===!1){r.__webglMultisampledFramebuffer=e.createFramebuffer(),r.__webglColorRenderbuffer=[],d.bindFramebuffer(e.FRAMEBUFFER,r.__webglMultisampledFramebuffer);for(let n=0;n<a.length;n++){let i=a[n];r.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,r.__webglColorRenderbuffer[n]);let o=m.convert(i.format,i.colorSpace),s=m.convert(i.type),c=A(i.internalFormat,o,s,i.normalized,i.colorSpace,t.isXRRenderTarget===!0),l=Me(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,l,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,r.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(r.__webglDepthRenderbuffer=e.createRenderbuffer(),Ce(r.__webglDepthRenderbuffer,t,!0)),d.bindFramebuffer(e.FRAMEBUFFER,null)}}if(o){d.bindTexture(e.TEXTURE_CUBE_MAP,i.__webglTexture),ge(e.TEXTURE_CUBE_MAP,n);for(let i=0;i<6;i++)if(n.mipmaps&&n.mipmaps.length>0)for(let a=0;a<n.mipmaps.length;a++)Se(r.__webglFramebuffer[i][a],t,n,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+i,a);else Se(r.__webglFramebuffer[i],t,n,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+i,0);E(n)&&D(e.TEXTURE_CUBE_MAP),d.unbindTexture()}else if(s){for(let n=0,i=a.length;n<i;n++){let i=a[n],o=f.get(i),s=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(s=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),d.bindTexture(s,o.__webglTexture),ge(s,i),Se(r.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0+n,s,0),E(i)&&D(s)}d.unbindTexture()}else{let a=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(a=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),d.bindTexture(a,i.__webglTexture),ge(a,n),n.mipmaps&&n.mipmaps.length>0)for(let i=0;i<n.mipmaps.length;i++)Se(r.__webglFramebuffer[i],t,n,e.COLOR_ATTACHMENT0,a,i);else Se(r.__webglFramebuffer,t,n,e.COLOR_ATTACHMENT0,a,0);E(n)&&D(a),d.unbindTexture()}t.depthBuffer&&Te(t)}function Oe(e){let t=e.textures;for(let n=0,r=t.length;n<r;n++){let r=t[n];if(E(r)){let t=k(e),n=f.get(r).__webglTexture;d.bindTexture(t,n),D(t),d.unbindTexture()}}}let ke=[],Ae=[];function je(t){if(t.samples>0){if(Ne(t)===!1){let n=t.textures,r=t.width,i=t.height,a=e.COLOR_BUFFER_BIT,o=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,s=f.get(t),c=n.length>1;if(c)for(let t=0;t<n.length;t++)d.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),d.bindFramebuffer(e.FRAMEBUFFER,s.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);d.bindFramebuffer(e.READ_FRAMEBUFFER,s.__webglMultisampledFramebuffer);let l=t.texture.mipmaps;l&&l.length>0?d.bindFramebuffer(e.DRAW_FRAMEBUFFER,s.__webglFramebuffer[0]):d.bindFramebuffer(e.DRAW_FRAMEBUFFER,s.__webglFramebuffer);for(let l=0;l<n.length;l++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(a|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(a|=e.STENCIL_BUFFER_BIT)),c){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,s.__webglColorRenderbuffer[l]);let t=f.get(n[l]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,r,i,0,0,r,i,a,e.NEAREST),_===!0&&(ke.length=0,Ae.length=0,ke.push(e.COLOR_ATTACHMENT0+l),t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&(ke.push(o),Ae.push(o),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,Ae)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,ke))}if(d.bindFramebuffer(e.READ_FRAMEBUFFER,null),d.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),c)for(let t=0;t<n.length;t++){d.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,s.__webglColorRenderbuffer[t]);let r=f.get(n[t]).__webglTexture;d.bindFramebuffer(e.FRAMEBUFFER,s.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,r,0)}d.bindFramebuffer(e.DRAW_FRAMEBUFFER,s.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&_){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function Me(e){return Math.min(p.maxSamples,e.samples)}function Ne(e){let n=f.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function F(e){let t=h.render.frame;y.get(e)!==t&&(y.set(e,t),e.update())}function Pe(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(Vt.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&L(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):R(`WebGLTextures: Unsupported texture color space:`,n)),t}function Fe(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(v.width=e.naturalWidth||e.width,v.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(v.width=e.displayWidth,v.height=e.displayHeight):(v.width=e.width,v.height=e.height),v}this.allocateTextureUnit=ce,this.resetTextureUnits=ae,this.getTextureUnits=oe,this.setTextureUnits=se,this.setTexture2D=P,this.setTexture2DArray=ue,this.setTexture3D=de,this.setTextureCube=fe,this.rebindTextures=Ee,this.setupRenderTarget=De,this.updateRenderTargetMipmap=Oe,this.updateMultisampleRenderTarget=je,this.setupDepthRenderbuffer=Te,this.setupFrameBufferTexture=Se,this.useMultisampledRTT=Ne,this.isReversedDepthBuffer=function(){return d.buffers.depth.getReversed()}}function Su(e,t){function n(n,r=``){let i,a=Vt.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var Cu=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,wu=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Tu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Ci(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new ao({vertexShader:Cu,fragmentShader:wu,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new W(new qa(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Eu=class extends ot{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,f=null,p=null,m=null,h=typeof XRWebGLBinding<`u`,_=new Tu,v={},y=t.getContextAttributes(),b=null,S=null,C=[],w=[],T=new z,k=null,A=null,j=new Wo;j.viewport=new Qt;let ee=new Wo;ee.viewport=new Qt;let te=[j,ee],M=new es,ne=null,N=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=C[e];return t===void 0&&(t=new Nn,C[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=C[e];return t===void 0&&(t=new Nn,C[e]=t),t.getGripSpace()},this.getHand=function(e){let t=C[e];return t===void 0&&(t=new Nn,C[e]=t),t.getHandSpace()};function re(e){let t=w.indexOf(e.inputSource);if(t===-1)return;let n=C[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function ie(){r.removeEventListener(`select`,re),r.removeEventListener(`selectstart`,re),r.removeEventListener(`selectend`,re),r.removeEventListener(`squeeze`,re),r.removeEventListener(`squeezestart`,re),r.removeEventListener(`squeezeend`,re),r.removeEventListener(`end`,ie),r.removeEventListener(`inputsourceschange`,ae);for(let e=0;e<C.length;e++){let t=w[e];t!==null&&(w[e]=null,C[e].disconnect(t))}ne=null,N=null,_.reset();for(let e in v)delete v[e];if(e.setRenderTarget(b),p=null,f=null,u=null,r=null,S=null,fe.stop(),n.isPresenting=!1,e.setPixelRatio(k),e.setSize(T.width,T.height,!1),A!==null){let e=A.camera;e.fov=A.fov,e.zoom=A.zoom,e.updateProjectionMatrix(),A=null}n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&L(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&L(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return f===null?p:f},this.getBinding=function(){return u===null&&h&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return m},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(b=e.getRenderTarget(),r.addEventListener(`select`,re),r.addEventListener(`selectstart`,re),r.addEventListener(`selectend`,re),r.addEventListener(`squeeze`,re),r.addEventListener(`squeezestart`,re),r.addEventListener(`squeezeend`,re),r.addEventListener(`end`,ie),r.addEventListener(`inputsourceschange`,ae),y.xrCompatible!==!0&&await t.makeXRCompatible(),k=e.getPixelRatio(),e.getSize(T),h&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;y.depth&&(o=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=y.stencil?O:D,a=y.stencil?x:g);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),f=u.createProjectionLayer(s),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),S=new en(f.textureWidth,f.textureHeight,{format:E,type:d,depthTexture:new xi(f.textureWidth,f.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}else{let n={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:i};p=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),S=new en(p.framebufferWidth,p.framebufferHeight,{format:E,type:d,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1,storeMultisampledDepthBuffer:p.ignoreDepthValues===!1,storeMultisampledStencilBuffer:p.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),fe.setContext(r),fe.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function ae(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=w.indexOf(n);r>=0&&(w[r]=null,C[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=w.indexOf(n);if(r===-1){for(let e=0;e<C.length;e++)if(e>=w.length){w.push(n),r=e;break}else if(w[e]===null){w[e]=n,r=e;break}if(r===-1)break}let i=C[r];i&&i.connect(n)}}let oe=new V,se=new V;function ce(e,t,n){oe.setFromMatrixPosition(t.matrixWorld),se.setFromMatrixPosition(n.matrixWorld);let r=oe.distanceTo(se),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function le(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;_.texture!==null&&(_.depthNear>0&&(t=_.depthNear),_.depthFar>0&&(n=_.depthFar)),M.near=ee.near=j.near=t,M.far=ee.far=j.far=n,(ne!==M.near||N!==M.far)&&(r.updateRenderState({depthNear:M.near,depthFar:M.far}),ne=M.near,N=M.far),M.layers.mask=e.layers.mask|6,j.layers.mask=M.layers.mask&-5,ee.layers.mask=M.layers.mask&-3;let i=e.parent,a=M.cameras;le(M,i);for(let e=0;e<a.length;e++)le(a[e],i);a.length===2?ce(M,j,ee):M.projectionMatrix.copy(j.projectionMatrix),A===null&&e.isPerspectiveCamera&&(A={camera:e,fov:e.fov,zoom:e.zoom}),P(e,M,i)};function P(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=ut*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(f!==null||p!==null)return s},this.setFoveation=function(e){s=e,f!==null&&(f.fixedFoveation=e),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=e)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(M)},this.getCameraTexture=function(e){return v[e]};let ue=null;function de(t,i){if(l=i.getViewerPose(c||a),m=i,l!==null){let t=l.views;p!==null&&(e.setRenderTargetFramebuffer(S,p.framebuffer),e.setRenderTarget(S));let i=!1;t.length!==M.cameras.length&&(M.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(p!==null)a=p.getViewport(r);else{let t=u.getViewSubImage(f,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(S,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(S))}let o=te[n];o===void 0&&(o=new Wo,o.layers.enable(n),o.viewport=new Qt,te[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(M.matrix.copy(o.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),i===!0&&M.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&h){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&_.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&h){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=v[n];e||(e=new Ci,v[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<C.length;e++){let t=w[e],n=C[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}ue&&ue(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),m=null}let fe=new _s;fe.setAnimationLoop(de),this.setAnimationLoop=function(e){ue=e},this.dispose=function(){}}},Du=new rn,Ou=new It;Ou.set(-1,0,0,0,1,0,0,0,1);function ku(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,to(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(Du.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(Ou),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.retroreflectivity>0&&(e.retroreflectivity.value=t.retroreflectivity),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function Au(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(g(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,v));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return R(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)p(t[n],e,n,a);else p(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(t,n,r,i){if(h(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=_(i);m(i,t.__data,e),typeof i!=`number`&&typeof i!=`boolean`&&!i.isMatrix3&&!ArrayBuffer.isView(i)&&(e+=a.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function m(e,t,n){typeof e==`number`||typeof e==`boolean`?t[0]=e:e.isMatrix3?(t[0]=e.elements[0],t[1]=e.elements[1],t[2]=e.elements[2],t[3]=0,t[4]=e.elements[3],t[5]=e.elements[4],t[6]=e.elements[5],t[7]=0,t[8]=e.elements[6],t[9]=e.elements[7],t[10]=e.elements[8],t[11]=0):ArrayBuffer.isView(e)?t.set(new e.constructor(e.buffer,e.byteOffset,t.length)):e.toArray(t,n)}function h(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:ArrayBuffer.isView(i)?i.slice():i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function g(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=_(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function _(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?L(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):L(`WebGLRenderer: Unsupported uniform value type.`,e),t}function v(t){let n=t.target;n.removeEventListener(`dispose`,v);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function y(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:y}}var ju=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Mu=null;function Nu(){return Mu===null&&(Mu=new oi(ju,16,16,j,v),Mu.name=`DFG_LUT`,Mu.minFilter=c,Mu.magFilter=c,Mu.wrapS=r,Mu.wrapT=r,Mu.generateMipmaps=!1,Mu.needsUpdate=!0),Mu}var Pu=class{constructor(e={}){let{canvas:t=$e(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:p=!1,outputBufferType:h=d}=e;this.isWebGLRenderer=!0;let _;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);_=n.getContextAttributes().alpha}else _=a;let S=h,C=new Set([te,ee,A]),w=new Set([d,g,m,x,y,b]),T=new Uint32Array(4),E=new Int32Array(4),D=new V,O=null,k=null,j=[],M=[],ne=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let N=this,re=!1,ie=null,ae=null,oe=null,se=null;this._outputColorSpace=He;let ce=0,le=0,P=null,ue=-1,de=null,fe=new Qt,pe=new Qt,me=null,he=new U(0),ge=0,_e=t.width,ve=t.height,ye=1,be=null,xe=null,Se=new Qt(0,0,_e,ve),Ce=new Qt(0,0,_e,ve),we=!1,Te=new yi,Ee=!1,De=!1,Oe=new rn,ke=new V,Ae=new Qt,je={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Me=!1;function Ne(){return P===null?ye:1}let F=n;function Pe(e,n){return t.getContext(e,n)}let Fe,Ie,I,Le,Re,ze,Be,Ve,Ue,We,Ge,Ke,qe,Je,Xe,Ze,Qe,et,nt,rt,at,ot,st;try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:f};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r186`),t.addEventListener(`webglcontextlost`,ut,!1),t.addEventListener(`webglcontextrestored`,dt,!1),t.addEventListener(`webglcontextcreationerror`,ft,!1),F===null){let t=`webgl2`;if(F=Pe(t,e),F===null)throw Pe(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}ct()}catch(e){throw t.removeEventListener(`webglcontextlost`,ut,!1),t.removeEventListener(`webglcontextrestored`,dt,!1),t.removeEventListener(`webglcontextcreationerror`,ft,!1),R(`WebGLRenderer: `+e.message),e}function ct(){Fe=new Qs(F),Fe.init(),at=new Su(F,Fe),Ie=new Ds(F,Fe,e,at),I=new bu(F,Fe),Ie.reversedDepthBuffer&&p&&I.buffers.depth.setReversed(!0),ae=F.createFramebuffer(),oe=F.createFramebuffer(),se=F.createFramebuffer(),Le=new tc(F),Re=new eu,ze=new xu(F,Fe,I,Re,Ie,at,Le),Be=new Zs(N),Ve=new vs(F),ot=new Ts(F,Ve),Ue=new $s(F,Ve,Le,ot),We=new rc(F,Ue,Ve,ot,Le),et=new nc(F,Ie,ze),Xe=new Os(Re),Ge=new $l(N,Be,Fe,Ie,ot,Xe),Ke=new ku(N,Re),qe=new iu,Je=new du(Fe),Qe=new ws(N,Be,I,We,_,s),Ze=new yu(N,We,Ie),st=new Au(F,Le,Ie,I),nt=new Es(F,Fe,Le),rt=new ec(F,Fe,Le),Le.programs=Ge.programs,N.capabilities=Ie,N.extensions=Fe,N.properties=Re,N.renderLists=qe,N.shadowMap=Ze,N.state=I,N.info=Le}S!==1009&&(ne=new ac(S,t.width,t.height,o,r,i));let lt=new Eu(N,F);this.xr=lt,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){let e=Fe.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=Fe.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return ye},this.setPixelRatio=function(e){e!==void 0&&(ye=e,this.setSize(_e,ve,!1))},this.getSize=function(e){return e.set(_e,ve)},this.setSize=function(e,n,r=!0){lt.isPresenting?L(`WebGLRenderer: Can't change size while VR device is presenting.`):(_e=e,ve=n,t.width=Math.floor(e*ye),t.height=Math.floor(n*ye),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),ne!==null&&ne.setSize(t.width,t.height),this.setViewport(0,0,e,n))},this.getDrawingBufferSize=function(e){return e.set(_e*ye,ve*ye).floor()},this.setDrawingBufferSize=function(e,n,r){_e=e,ve=n,ye=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(S===1009)R(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);else{if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){L(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}ne.setEffects(e||[])}},this.getCurrentViewport=function(e){return e.copy(fe)},this.getViewport=function(e){return e.copy(Se)},this.setViewport=function(e,t,n,r){e.isVector4?Se.set(e.x,e.y,e.z,e.w):Se.set(e,t,n,r),I.viewport(fe.copy(Se).multiplyScalar(ye).round())},this.getScissor=function(e){return e.copy(Ce)},this.setScissor=function(e,t,n,r){e.isVector4?Ce.set(e.x,e.y,e.z,e.w):Ce.set(e,t,n,r),I.scissor(pe.copy(Ce).multiplyScalar(ye).round())},this.getScissorTest=function(){return we},this.setScissorTest=function(e){I.setScissorTest(we=e)},this.setOpaqueSort=function(e){be=e},this.setTransparentSort=function(e){xe=e},this.getClearColor=function(e){return e.copy(Qe.getClearColor())},this.setClearColor=function(){Qe.setClearColor(...arguments)},this.getClearAlpha=function(){return Qe.getClearAlpha()},this.setClearAlpha=function(){Qe.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(P!==null){let t=P.texture.format;e=C.has(t)}if(e){let e=P.texture.type,t=w.has(e),n=Qe.getClearColor(),r=Qe.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(T[0]=i,T[1]=a,T[2]=o,T[3]=r,F.clearBufferuiv(F.COLOR,0,T)):(E[0]=i,E[1]=a,E[2]=o,E[3]=r,F.clearBufferiv(F.COLOR,0,E))}else r|=F.COLOR_BUFFER_BIT}t&&(r|=F.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&F.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),ie=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,ut,!1),t.removeEventListener(`webglcontextrestored`,dt,!1),t.removeEventListener(`webglcontextcreationerror`,ft,!1),Qe.dispose(),qe.dispose(),Je.dispose(),Re.dispose(),Be.dispose(),We.dispose(),ot.dispose(),st.dispose(),Ge.dispose(),lt.dispose(),lt.removeEventListener(`sessionstart`,yt),lt.removeEventListener(`sessionend`,bt),xt.stop()};function ut(e){e.preventDefault(),tt(`WebGLRenderer: Context Lost.`),re=!0}function dt(){tt(`WebGLRenderer: Context Restored.`),re=!1;let e=Le.autoReset,t=Ze.enabled,n=Ze.autoUpdate,r=Ze.needsUpdate,i=Ze.type;ct(),Le.autoReset=e,Ze.enabled=t,Ze.autoUpdate=n,Ze.needsUpdate=r,Ze.type=i}function ft(e){R(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function pt(e){let t=e.target;t.removeEventListener(`dispose`,pt),mt(t)}function mt(e){ht(e),Re.remove(e)}function ht(e){let t=Re.get(e).programs;t!==void 0&&(t.forEach(function(e){Ge.releaseProgram(e)}),e.isShaderMaterial&&Ge.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=je);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=jt(e,t,n,r,i);I.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=Ue.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;ot.setup(i,r,s,n,c);let h,g=nt;if(c!==null&&(h=Ve.get(c),g=rt,g.setIndex(h)),i.isMesh)r.wireframe===!0?(I.setLineWidth(r.wireframeLinewidth*Ne()),g.setMode(F.LINES)):g.setMode(F.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),I.setLineWidth(e*Ne()),i.isLineSegments?g.setMode(F.LINES):i.isLineLoop?g.setMode(F.LINE_LOOP):g.setMode(F.LINE_STRIP)}else i.isPoints?g.setMode(F.POINTS):i.isSprite&&g.setMode(F.TRIANGLES);if(i.isBatchedMesh){if(Fe.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?Ve.get(c).bytesPerElement:1,o=Re.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(F,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function gt(e,t,n,r){ie!==null&&e.isNodeMaterial&&ie.setObject(r,e),Ee===!0&&Xe.setState(e,n,!1),e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,Dt(e,t,r),e.side=0,e.needsUpdate=!0,Dt(e,t,r),e.side=2):Dt(e,t,r)}this.compile=function(e,t,n=null){n===null&&(n=e),ie!==null&&ie.renderStart(e,t,n),k=Je.get(n),k.init(t),M.push(k),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(k.pushLight(e),e.castShadow&&k.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(k.pushLight(e),e.castShadow&&k.pushShadow(e))}),k.setupLights(),ie!==null&&ie.updateLights(k.state.lightsArray),De=this.localClippingEnabled,Ee=Xe.init(this.clippingPlanes,De),Ee===!0&&Xe.setGlobalState(this.clippingPlanes,t),ie!==null&&Ze.render(k.state.shadowsArray,n,t);let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let i=e.material;if(i){if(Array.isArray(i))for(let a=0;a<i.length;a++){let o=i[a];gt(o,n,t,e),r.add(o)}else gt(i,n,t,e),r.add(i)}}),k=M.pop(),ie!==null&&ie.renderEnd(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){r.forEach(function(e){let t=Re.get(e).currentProgram;(t===void 0||t.isReady())&&r.delete(e)}),r.size===0?t(e):setTimeout(n,10)}Fe.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let _t=null;function vt(e){_t&&_t(e)}function yt(){xt.stop()}function bt(){xt.start()}let xt=new _s;xt.setAnimationLoop(vt),typeof self<`u`&&xt.setContext(self),this.setAnimationLoop=function(e){_t=e,lt.setAnimationLoop(e),e===null?xt.stop():xt.start()},lt.addEventListener(`sessionstart`,yt),lt.addEventListener(`sessionend`,bt),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){R(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(re===!0)return;ie!==null&&ie.renderStart(e,t);let n=lt.enabled===!0&&lt.isPresenting===!0,r=ne!==null&&(P===null||n)&&ne.begin(N,P);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),lt.enabled===!0&&lt.isPresenting===!0&&(ne===null||ne.isCompositing()===!1)&&(lt.cameraAutoUpdate===!0&&lt.updateCamera(t),t=lt.getCamera()),e.isScene===!0&&e.onBeforeRender(N,e,t,P),k=Je.get(e,M.length),k.init(t),k.state.textureUnits=ze.getTextureUnits(),M.push(k),Oe.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),Te.setFromProjectionMatrix(Oe,Ye,t.reversedDepth),De=this.localClippingEnabled,Ee=Xe.init(this.clippingPlanes,De),O=qe.get(e,j.length),O.init(),j.push(O),lt.enabled===!0&&lt.isPresenting===!0){let e=N.xr.getDepthSensingMesh();e!==null&&St(e,t,-1/0,N.sortObjects)}St(e,t,0,N.sortObjects),O.finish(),ie!==null&&ie.updateLights(k.state.lightsArray),N.sortObjects===!0&&O.sort(be,xe),Me=lt.enabled===!1||lt.isPresenting===!1||lt.hasDepthSensing()===!1,Me&&Qe.addToRenderList(O,e),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Ee===!0&&Xe.beginShadows();let i=k.state.shadowsArray;if(Ze.render(i,e,t),Ee===!0&&Xe.endShadows(),(r&&ne.hasRenderPass())===!1){let n=O.opaque,r=O.transmissive;if(k.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];wt(n,r,e,a)}Me&&Qe.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];Ct(O,e,n,n.viewport)}}else r.length>0&&wt(n,r,e,t),Me&&Qe.render(e),Ct(O,e,t)}P!==null&&le===0&&(ze.updateMultisampleRenderTarget(P),ze.updateRenderTargetMipmap(P)),r&&ne.end(N),e.isScene===!0&&e.onAfterRender(N,e,t),ot.resetDefaultState(),ue=-1,de=null,M.pop(),M.length>0?(k=M[M.length-1],ze.setTextureUnits(k.state.textureUnits),Ee===!0&&Xe.setGlobalState(N.clippingPlanes,k.state.camera)):k=null,j.pop(),O=j.length>0?j[j.length-1]:null,ie!==null&&ie.renderEnd()};function St(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)k.pushLightProbeGrid(e);else if(e.isLight)k.pushLight(e),e.castShadow&&k.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||e.intersectsFrustum(Te)){r&&Ae.setFromMatrixPosition(e.matrixWorld).applyMatrix4(Oe);let i=We.update(e),a=e.material;a.visible&&O.push(e,i,a,n,Ae.z,null,t)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||e.intersectsFrustum(Te))){let i=We.update(e),a=e.material;if(r&&(e.boundingSphere===void 0?(i.boundingSphere===null&&i.computeBoundingSphere(),Ae.copy(i.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),Ae.copy(e.boundingSphere.center)),Ae.applyMatrix4(e.matrixWorld).applyMatrix4(Oe)),Array.isArray(a)){let r=i.groups;for(let o=0,s=r.length;o<s;o++){let s=r[o],c=a[s.materialIndex];c&&c.visible&&O.push(e,i,c,n,Ae.z,s,t)}}else a.visible&&O.push(e,i,a,n,Ae.z,null,t)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)St(i[e],t,n,r)}function Ct(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;k.setupLightsView(n),Ee===!0&&Xe.setGlobalState(N.clippingPlanes,n),r&&I.viewport(fe.copy(r)),i.length>0&&Tt(i,t,n),a.length>0&&Tt(a,t,n),o.length>0&&Tt(o,t,n),I.buffers.depth.setTest(!0),I.buffers.depth.setMask(!0),I.buffers.color.setMask(!0),I.setPolygonOffset(!1)}function wt(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(k.state.transmissionRenderTarget[r.id]===void 0){let e=Fe.has(`EXT_color_buffer_half_float`)||Fe.has(`EXT_color_buffer_float`);k.state.transmissionRenderTarget[r.id]=new en(1,1,{generateMipmaps:!0,type:e?v:d,minFilter:u,samples:Math.max(4,Ie.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Vt.workingColorSpace})}let a=k.state.transmissionRenderTarget[r.id],o=r.viewport||fe;a.setSize(o.z*N.transmissionResolutionScale,o.w*N.transmissionResolutionScale);let s=N.getRenderTarget(),c=N.getActiveCubeFace(),l=N.getActiveMipmapLevel();N.setRenderTarget(a),N.getClearColor(he),ge=N.getClearAlpha(),ge<1&&N.setClearColor(16777215,.5),N.clear(),Me&&Qe.render(n);let f=N.toneMapping;N.toneMapping=0;let p=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),k.setupLightsView(r),Ee===!0&&Xe.setGlobalState(N.clippingPlanes,r),Tt(e,n,r),ze.updateMultisampleRenderTarget(a),ze.updateRenderTargetMipmap(a),Fe.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,Et(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(ze.updateMultisampleRenderTarget(a),ze.updateRenderTargetMipmap(a))}N.setRenderTarget(s,c,l),N.setClearColor(he,ge),p!==void 0&&(r.viewport=p),N.toneMapping=f}function Tt(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&Et(o,t,n,s,l,c)}}function Et(e,t,n,r,i,a){ie!==null&&i.isNodeMaterial&&ie.setObject(e,i),e.onBeforeRender(N,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(N,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,N.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,N.renderBufferDirect(n,t,r,i,e,a),i.side=2):N.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(N,t,n,r,i,a)}function Dt(e,t,n){t.isScene!==!0&&(t=je);let r=Re.get(e),i=k.state.lights,a=k.state.shadowsArray,o=i.state.version,s=Ge.getParameters(e,i.state,a,t,n,k.state.lightProbeGridArray),c=Ge.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=Be.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,pt),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return kt(e,s),d}else s.uniforms=Ge.getUniforms(e),ie!==null&&e.isNodeMaterial&&ie.build(e,n,s),e.onBeforeCompile(s,N),d=Ge.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Xe.uniform),kt(e,s),r.needsLights=Nt(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.sunLights.value=i.state.sun,f.sunLightShadows.value=i.state.sunShadow,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.sunShadowMatrix.value=i.state.sunShadowMatrix,f.sunShadowCascade.value=i.state.sunShadowCascade,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=k.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function Ot(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=fl.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function kt(e,t){let n=Re.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function At(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];D.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(D))return n}return null}function jt(e,t,n,r,i){t.isScene!==!0&&(t=je),ze.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=P===null?N.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:Vt.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=Be.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(h=N.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=Re.get(r),y=k.state.lights;if(Ee===!0&&(De===!0||e!==de)){let t=e===de&&r.id===ue;Xe.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i._colorsTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i._colorsTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Xe.numPlanes||v.numIntersection!==Xe.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=k.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let x=v.currentProgram;b===!0&&(x=Dt(r,t,i),ie&&r.isNodeMaterial&&ie.onUpdateProgram(r,x,v));let S=!1,C=!1,w=!1,T=x.getUniforms(),E=v.uniforms;if(I.useProgram(x.program)&&(S=!0,C=!0,w=!0),r.id!==ue&&(ue=r.id,C=!0),v.needsLights){let e=At(k.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,C=!0)}if(S||de!==e){I.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),T.setValue(F,`projectionMatrix`,e.projectionMatrix),T.setValue(F,`viewMatrix`,e.matrixWorldInverse);let t=T.map.cameraPosition;t!==void 0&&t.setValue(F,ke.setFromMatrixPosition(e.matrixWorld)),Ie.logarithmicDepthBuffer&&T.setValue(F,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&T.setValue(F,`isOrthographic`,e.isOrthographicCamera===!0),de!==e&&(de=e,C=!0,w=!0)}if(v.needsLights&&(y.state.sunShadowMap.length>0&&T.setValue(F,`sunShadowMap`,y.state.sunShadowMap,ze),y.state.directionalShadowMap.length>0&&T.setValue(F,`directionalShadowMap`,y.state.directionalShadowMap,ze),y.state.spotShadowMap.length>0&&T.setValue(F,`spotShadowMap`,y.state.spotShadowMap,ze),y.state.pointShadowMap.length>0&&T.setValue(F,`pointShadowMap`,y.state.pointShadowMap,ze)),i.isSkinnedMesh){T.setOptional(F,i,`bindMatrix`),T.setOptional(F,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),T.setValue(F,`boneTexture`,e.boneTexture,ze))}i.isBatchedMesh&&(T.setOptional(F,i,`batchingTexture`),T.setValue(F,`batchingTexture`,i._matricesTexture,ze),T.setOptional(F,i,`batchingIdTexture`),T.setValue(F,`batchingIdTexture`,i._indirectTexture,ze),T.setOptional(F,i,`batchingColorTexture`),i._colorsTexture!==null&&T.setValue(F,`batchingColorTexture`,i._colorsTexture,ze));let D=n.morphAttributes;if((D.position!==void 0||D.normal!==void 0||D.color!==void 0)&&et.update(i,n,x),(C||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,T.setValue(F,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(E.envMapIntensity.value=t.environmentIntensity),E.dfgLUT!==void 0&&(E.dfgLUT.value=Nu()),C){if(T.setValue(F,`toneMappingExposure`,N.toneMappingExposure),v.needsLights&&Mt(E,w),a&&r.fog===!0&&Ke.refreshFogUniforms(E,a),Ke.refreshMaterialUniforms(E,r,ye,ve,k.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;E.probesSH.value=e.texture,E.probesMin.value.copy(e.boundingBox.min),E.probesMax.value.copy(e.boundingBox.max),E.probesResolution.value.copy(e.resolution)}fl.upload(F,Ot(v),E,ze)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(fl.upload(F,Ot(v),E,ze),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&T.setValue(F,`center`,i.center),T.setValue(F,`modelViewMatrix`,i.modelViewMatrix),T.setValue(F,`normalMatrix`,i.normalMatrix),T.setValue(F,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];st.update(n,x),st.bind(n,x)}}return x}function Mt(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.sunLights.needsUpdate=t,e.sunLightShadows.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function Nt(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return ce},this.getActiveMipmapLevel=function(){return le},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(e,t,n){let r=Re.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),Re.get(e.texture).__webglTexture=t,Re.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=Re.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){P=e,ce=t,le=n;let r=null,i=!1,a=!1;if(e){let o=Re.get(e);if(o.__useDefaultFramebuffer!==void 0){I.bindFramebuffer(F.FRAMEBUFFER,o.__webglFramebuffer),fe.copy(e.viewport),pe.copy(e.scissor),me=e.scissorTest,I.viewport(fe),I.scissor(pe),I.setScissorTest(me),ue=-1;return}if(o.__webglFramebuffer===void 0)ze.setupRenderTarget(e);else if(o.__hasExternalTextures)ze.rebindTextures(e,Re.get(e.texture).__webglTexture,Re.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&Re.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);ze.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=Re.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&ze.useMultisampledRTT(e)===!1?Re.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,fe.copy(e.viewport),pe.copy(e.scissor),me=e.scissorTest}else fe.copy(Se).multiplyScalar(ye).floor(),pe.copy(Ce).multiplyScalar(ye).floor(),me=we;if(n!==0&&(r=ae),I.bindFramebuffer(F.FRAMEBUFFER,r)&&I.drawBuffers(e,r),I.viewport(fe),I.scissor(pe),I.setScissorTest(me),i){let r=Re.get(e.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=Re.get(e.textures[t]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=Re.get(e.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,t.__webglTexture,n)}ue=-1};function z(e){let t=Re.get(e);return(t.__readFormat!==e.format||t.__readType!==e.type)&&(t.__readFormat=e.format,t.__readType=e.type,t.__formatReadable=Ie.textureFormatReadable(e.format),t.__typeReadable=Ie.textureTypeReadable(e.type)),t}this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){R(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=Re.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){I.bindFramebuffer(F.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;e.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+s);let u=z(o);if(u.__formatReadable===!1){R(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(u.__typeReadable===!1){R(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&F.readPixels(t,n,r,i,at.convert(c),at.convert(l),a)}finally{let e=P===null?null:Re.get(P).__webglFramebuffer;I.bindFramebuffer(F.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=Re.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){I.bindFramebuffer(F.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;e.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+s);let d=z(o);if(d.__formatReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(d.__typeReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let f=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,f),F.bufferData(F.PIXEL_PACK_BUFFER,a.byteLength,F.STREAM_READ),F.readPixels(t,n,r,i,at.convert(l),at.convert(u),0),F.bindBuffer(F.PIXEL_PACK_BUFFER,null);let p=P===null?null:Re.get(P).__webglFramebuffer;I.bindFramebuffer(F.FRAMEBUFFER,p);let m=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await it(F,m,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,f),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,a),F.bindBuffer(F.PIXEL_PACK_BUFFER,null),F.deleteBuffer(f),F.deleteSync(m),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;ze.setTexture2D(e,0),F.copyTexSubImage2D(F.TEXTURE_2D,n,0,0,o,s,i,a),I.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=at.convert(t.format),_=at.convert(t.type),v;t.isData3DTexture?(ze.setTexture3D(t,0),v=F.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(ze.setTexture2DArray(t,0),v=F.TEXTURE_2D_ARRAY):(ze.setTexture2D(t,0),v=F.TEXTURE_2D),I.activeTexture(F.TEXTURE0),I.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,t.flipY),I.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),I.pixelStorei(F.UNPACK_ALIGNMENT,t.unpackAlignment);let y=I.getParameter(F.UNPACK_ROW_LENGTH),b=I.getParameter(F.UNPACK_IMAGE_HEIGHT),x=I.getParameter(F.UNPACK_SKIP_PIXELS),S=I.getParameter(F.UNPACK_SKIP_ROWS),C=I.getParameter(F.UNPACK_SKIP_IMAGES);I.pixelStorei(F.UNPACK_ROW_LENGTH,h.width),I.pixelStorei(F.UNPACK_IMAGE_HEIGHT,h.height),I.pixelStorei(F.UNPACK_SKIP_PIXELS,l),I.pixelStorei(F.UNPACK_SKIP_ROWS,u),I.pixelStorei(F.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=Re.get(e),r=Re.get(t),h=Re.get(n.__renderTarget),g=Re.get(r.__renderTarget);I.bindFramebuffer(F.READ_FRAMEBUFFER,h.__webglFramebuffer),I.bindFramebuffer(F.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Re.get(e).__webglTexture,i,d+n),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Re.get(t).__webglTexture,a,m+n)),F.blitFramebuffer(l,u,o,s,f,p,o,s,F.DEPTH_BUFFER_BIT,F.NEAREST);I.bindFramebuffer(F.READ_FRAMEBUFFER,null),I.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||Re.has(e)){let n=Re.get(e),r=Re.get(t);I.bindFramebuffer(F.READ_FRAMEBUFFER,oe),I.bindFramebuffer(F.DRAW_FRAMEBUFFER,se);for(let e=0;e<c;e++)w?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,n.__webglTexture,i),T?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,r.__webglTexture,a),i===0?T?F.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):F.copyTexSubImage2D(v,a,f,p,l,u,o,s):F.blitFramebuffer(l,u,o,s,f,p,o,s,F.COLOR_BUFFER_BIT,F.NEAREST);I.bindFramebuffer(F.READ_FRAMEBUFFER,null),I.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?F.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?F.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):F.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):F.texSubImage2D(F.TEXTURE_2D,a,f,p,o,s,g,_,h);I.pixelStorei(F.UNPACK_ROW_LENGTH,y),I.pixelStorei(F.UNPACK_IMAGE_HEIGHT,b),I.pixelStorei(F.UNPACK_SKIP_PIXELS,x),I.pixelStorei(F.UNPACK_SKIP_ROWS,S),I.pixelStorei(F.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&F.generateMipmap(v),I.unbindTexture()},this.initRenderTarget=function(e){Re.get(e).__webglFramebuffer===void 0&&ze.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?ze.setTextureCube(e,0):e.isData3DTexture?ze.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?ze.setTexture2DArray(e,0):ze.setTexture2D(e,0),I.unbindTexture()},this.resetState=function(){ce=0,le=0,P=null,I.reset(),ot.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return Ye}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Vt._getDrawingBufferColorSpace(e),t.unpackColorSpace=Vt._getUnpackColorSpace()}},Fu=Math.PI*2,Iu=(e,t=0,n=1)=>e<t?t:e>n?n:e,q=(e,t,n)=>e+(t-e)*n,Lu=(e,t,n)=>Iu((n-e)/(t-e)),J=(e,t,n)=>{let r=Lu(e,t,n);return r*r*(3-2*r)},Ru=e=>e*e*(3-2*e),Y=e=>e*e*e*(e*(e*6-15)+10),zu=e=>1-(1-e)**3,Bu=e=>e<.5?4*e*e*e:1-(-2*e+2)**3/2,X=(e,t,n)=>Lu(t,n,e);function Vu(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}var Hu=e=>{let t=Math.sin(e*127.1+311.7)*43758.5453;return t-Math.floor(t)};function Uu(e){let t=Math.floor(e),n=e-t,r=n*n*(3-2*n);return q(Hu(t),Hu(t+1),r)*2-1}var Wu=e=>Uu(e)*.6+Uu(e*2.3+7)*.3+Uu(e*5.1+19)*.1;function Gu(e,t,n,r,i){let a=Y(r);return e.lerpVectors(t,n,a),e.y+=Math.sin(Math.PI*a)*i,e}function Ku(e,t,n=Y){if(e<=t[0][0])return t[0][1];for(let r=1;r<t.length;r++)if(e<=t[r][0]){let[i,a]=t[r-1],[o,s]=t[r];return q(a,s,n((e-i)/(o-i)))}return t[t.length-1][1]}function qu(e,t,n,r){return e.r=q(t.r,n.r,r),e.g=q(t.g,n.g,r),e.b=q(t.b,n.b,r),e}function Ju(e,t){e.traverse(e=>{e.isMesh&&(e.castShadow=t)})}var Z={wallZ:-300,eaveZ:-165,tableTop:78,table:new V(0,0,-40),tableW:240,tableD:90,board:new V(-52,83,-40),bowl:new V(-14,78,-70),basket:new V(-92,78,-62),knifeRest:new V(-88,78,-5),scraperRest:new V(8,78,-6),press:new V(56,80,-42),boardRest:new V(156,0,-70),stoneRest:new V(152,0,-24),tray:new V(-6,78.6,-36),spool:new V(-24,78,-8),mug:new V(16,78,-78),washstand:new V(150,0,-140),stove:new V(-235,0,-257),stoveTop:80,wok:new V(-262,80,-255),wokR:31,water:-4.5,drain:new V(-200,80.15,-252),jar:new V(-345,0,-232),basketFloor:new V(-185,.15,-175),steelyard:new V(-218,186,-288),oven:new V(-118,0,-258),ovenTop:54.3,ovenSieveR:34,dry:new V(205,0,55),dryY:44.02,tree:new V(-360,0,110),door:new V(150,0,-300),window:new V(-10,0,-300),bulb:new V(46,292,-222)},Yu=new WeakMap;function Xu(e){let t=Yu.get(e);if(t)return t;let n=Math.floor(e.sampleRate*3);t=e.createBuffer(1,n,e.sampleRate);let r=t.getChannelData(0),i=2654435769;for(let e=0;e<n;e++)i^=i<<13,i^=i>>>17,i^=i<<5,r[e]=(i>>>0)/4294967296*2-1;return Yu.set(e,t),t}function Zu(e,t,n,r){let i=e.createBufferSource();return i.buffer=Xu(e),i.loop=!0,i.start(t,r()*2.8),i.stop(t+n+.05),i}function Qu(e,t,n,r,i){e.setValueAtTime(0,t),e.linearRampToValueAtTime(r,t+n),e.setTargetAtTime(0,t+n,i/4)}function $u(e,t,n,r,i){let a=r.a??.002,o=a+r.d*1.3,s=Zu(e,n,o,i),c=e.createBiquadFilter();c.type=r.type??`bandpass`,c.frequency.setValueAtTime(r.f,n),r.f2&&c.frequency.exponentialRampToValueAtTime(r.f2,n+o),c.Q.value=r.q??1;let l=e.createGain();Qu(l.gain,n,a,r.g,r.d),s.connect(c).connect(l).connect(t)}function ed(e,t,n,r){let i=r.a??.003,a=e.createOscillator();a.type=r.type??`sine`,a.frequency.setValueAtTime(r.f,n),r.f2&&a.frequency.exponentialRampToValueAtTime(r.f2,n+(r.glide??r.d));let o=e.createGain();Qu(o.gain,n,i,r.g,r.d),a.connect(o).connect(t),a.start(n),a.stop(n+i+r.d*1.3+.02)}function td(e,t,n,r,i){let a=Math.min(r.a??.05,r.dur*.4),o=Math.min(r.r??.12,r.dur*.4),s=Zu(e,n,r.dur+o*2,i),c=e.createBiquadFilter();c.type=`bandpass`,c.frequency.setValueAtTime(r.f,n),r.f2&&c.frequency.linearRampToValueAtTime(r.f2,n+r.dur),c.Q.value=r.q;let l=s.connect(c);if(r.hp){let t=e.createBiquadFilter();t.type=`highpass`,t.frequency.value=r.hp,l=l.connect(t)}let u=e.createGain(),d=u.gain;d.setValueAtTime(0,n),d.linearRampToValueAtTime(r.g*(1-r.depth*i()),n+a);for(let e=n+a;e<n+r.dur-o;e+=r.grain*(.6+.8*i()))d.setTargetAtTime(r.g*(1-r.depth*i()),e,r.grain*.3);d.setTargetAtTime(0,n+r.dur-o,o/3),l.connect(u).connect(t)}function nd(e,t,n,r,i){ed(e,t,n,{f:r,f2:r*2.2,glide:.04,a:.002,d:.05,g:i})}var rd={thud(e,t,n,r){let i=150*r.pitch;ed(e,t,n,{f:i*1.7,f2:i,glide:.04,d:.16,g:.17*r.gain}),$u(e,t,n,{type:`lowpass`,f:700*r.pitch,q:.7,d:.05,g:.17*r.gain},r.rnd)},tap(e,t,n,r){let i=1900*r.pitch*(.92+.16*r.rnd());$u(e,t,n,{f:i,q:3,d:.035,g:.7*r.gain},r.rnd),ed(e,t,n,{f:i*.55,d:.05,g:.056*r.gain})},knock(e,t,n,r){let i=150*r.pitch;ed(e,t,n,{f:i*1.15,f2:i,glide:.05,d:.26,g:.17*r.gain}),ed(e,t,n,{f:i*2.7,d:.11,g:.04*r.gain}),$u(e,t,n,{type:`lowpass`,f:1100,q:.6,d:.05,g:.14*r.gain},r.rnd)},stone(e,t,n,r){let i=92*r.pitch;ed(e,t,n,{f:i*1.2,f2:i,glide:.06,d:.3,g:.19*r.gain}),$u(e,t,n,{type:`lowpass`,f:520,q:.7,d:.11,g:.17*r.gain},r.rnd),$u(e,t,n+.004,{f:2300,q:1.6,d:.03,g:.034*r.gain},r.rnd)},plop(e,t,n,r){let i=380*r.pitch*(.85+.3*r.rnd());$u(e,t,n,{f:1500,q:.8,d:.12,g:.18*r.gain},r.rnd),ed(e,t,n+.006,{f:i,f2:i*2.6,glide:.06,d:.07,g:.2*r.gain});for(let i=0;i<2;i++)nd(e,t,n+.08+r.rnd()*.25,700+r.rnd()*900,.04*r.gain)},drip(e,t,n,r){nd(e,t,n,1200*r.pitch*(.8+.5*r.rnd()),.06*r.gain)},swish(e,t,n,r){$u(e,t,n,{f:600,f2:1500,q:.9,a:r.dur*.3,d:r.dur*.7,g:.16*r.gain},r.rnd)},pour(e,t,n,r){td(e,t,n,{f:1800,q:.7,dur:r.dur,g:.09*r.gain,a:.04,r:r.dur*.5,grain:.03,depth:.5},r.rnd);let i=.05;for(;i<r.dur;)rd.drip(e,t,n+i,{...r,gain:r.gain*(1-i/r.dur*.6)}),i+=.04+i/r.dur*.25*r.rnd()+.03*r.rnd()},slice(e,t,n,r){td(e,t,n,{f:3200*r.pitch,f2:2600*r.pitch,q:1,hp:1400,dur:r.dur,g:.16*r.gain,a:.08,r:.1,grain:.05,depth:.45},r.rnd),td(e,t,n,{f:520,q:1.2,dur:r.dur,g:.07*r.gain,a:.1,r:.1,grain:.08,depth:.6},r.rnd)},scrape(e,t,n,r){td(e,t,n,{f:1900*r.pitch,q:1.4,dur:r.dur,g:.2*r.gain,a:.05,r:.12,grain:.07,depth:.85},r.rnd)},squish(e,t,n,r){$u(e,t,n,{type:`lowpass`,f:520,q:.8,a:.02,d:.24*r.dur,g:.22*r.gain},r.rnd),ed(e,t,n,{type:`triangle`,f:180,f2:90,glide:.2,a:.01,d:.2,g:.06*r.gain});for(let i=0;i<3;i++)nd(e,t,n+.03+r.rnd()*.2,260+r.rnd()*240,.05*r.gain)},bowl(e,t,n,r){rd.thud(e,t,n,{...r,pitch:1.15}),ed(e,t,n,{f:1650,d:.3,g:.012*r.gain}),ed(e,t,n,{f:2710,d:.18,g:.006*r.gain})},crinkle(e,t,n,r){let i=Math.max(3,Math.round(24*r.dur));for(let a=0;a<i;a++)$u(e,t,n+r.rnd()*r.dur,{type:`highpass`,f:2400+r.rnd()*3e3,q:.7,d:.004+r.rnd()*.01,g:(.03+r.rnd()*.06)*r.gain},r.rnd)},rustle(e,t,n,r){td(e,t,n,{f:2600*r.pitch,q:.6,dur:r.dur,g:.1*r.gain,a:.08,r:r.dur*.35,grain:.04,depth:.8},r.rnd)},slide(e,t,n,r){td(e,t,n,{f:1150*r.pitch,f2:1300*r.pitch,q:5,dur:r.dur,g:.3*r.gain,a:.06,r:.1,grain:.05,depth:.5},r.rnd)},chop(e,t,n,r){$u(e,t,n,{type:`highpass`,f:2200,q:.7,d:.025,g:.09*r.gain},r.rnd),ed(e,t,n+.004,{f:240*r.pitch,f2:205*r.pitch,glide:.05,d:.09,g:.14*r.gain}),$u(e,t,n+.004,{type:`lowpass`,f:900,q:.7,d:.04,g:.1*r.gain},r.rnd)},rope(e,t,n,r){td(e,t,n,{f:950,f2:1300,q:1.6,dur:r.dur,g:.2*r.gain,a:.1,r:.2,grain:.045,depth:.7},r.rnd)},cinch(e,t,n,r){td(e,t,n,{f:1300,q:2,dur:.22,g:.22*r.gain,a:.03,r:.08,grain:.03,depth:.5},r.rnd),ed(e,t,n+.12,{f:1100,f2:1450,glide:.06,a:.01,d:.06,g:.02*r.gain})},clink(e,t,n,r){let i=.97+.06*r.rnd();for(let[a,o,s]of[[1320,.9,.03],[2210,.7,.02],[3530,.5,.013],[5080,.35,.007]])ed(e,t,n,{f:a*i*r.pitch,d:o,g:s*r.gain});rd.thud(e,t,n,{...r,gain:r.gain*.25,pitch:2})},glass(e,t,n,r){rd.thud(e,t,n,{...r,pitch:1.3}),ed(e,t,n,{f:1240*r.pitch,d:.35,g:.008*r.gain}),ed(e,t,n,{f:2080*r.pitch,d:.25,g:.005*r.gain})},stamp(e,t,n,r){ed(e,t,n,{f:115,f2:72,glide:.06,d:.12,g:.12*r.gain}),$u(e,t,n,{type:`lowpass`,f:420,q:.7,d:.06,g:.1*r.gain},r.rnd)},page(e,t,n,r){$u(e,t,n,{f:500,f2:1300,q:.7,a:.22,d:.45,g:.11*r.gain},r.rnd),rd.crinkle(e,t,n+.15,{...r,dur:.3,gain:r.gain*.35})},sprinkle(e,t,n,r){$u(e,t,n,{f:1200,f2:2600,q:.8,a:.08,d:.25,g:.1*r.gain},r.rnd);for(let i=0;i<26;i++)$u(e,t,n+.12+r.rnd()*.45,{f:3e3+r.rnd()*2500,q:2,d:.006,g:(.05+r.rnd()*.1)*r.gain},r.rnd)},flip(e,t,n,r){$u(e,t,n,{f:700,f2:1400,q:.8,a:.1,d:.2,g:.1*r.gain},r.rnd)},hiss(e,t,n,r){td(e,t,n,{f:4200,q:.8,hp:2e3,dur:r.dur,g:.05*r.gain,a:r.dur*.25,r:r.dur*.5,grain:.06,depth:.4},r.rnd)},click(e,t,n,r){$u(e,t,n,{f:2600,q:2.5,d:.006,g:.45*r.gain},r.rnd),$u(e,t,n+.05,{f:2100,q:2.5,d:.008,g:.38*r.gain},r.rnd)}};function id(e,t,n,r,i){let a=2600+r()*1800,o=2+Math.floor(r()*4),s=r(),c=n;for(let n=0;n<o;n++){let n=.05+r()*.07,o=a*(.9+.2*r()),l=s<.5?o*(1.25+.3*r()):o*(.7+.15*r());ed(e,t,c,{f:o,f2:l,glide:n,a:.008,d:n,g:i*(.7+.3*r())}),c+=n+.03+r()*.08}}function ad(e,t,n,r,i,a){let o=e.createOscillator();o.frequency.value=r;let s=e.createGain(),c=s.gain;c.setValueAtTime(0,n);for(let e=0;e<a;e++){let t=n+e*.034;c.setValueAtTime(0,t),c.linearRampToValueAtTime(i,t+.006),c.linearRampToValueAtTime(i*.7,t+.016),c.linearRampToValueAtTime(0,t+.022)}o.connect(s).connect(t),o.start(n),o.stop(n+a*.034+.03)}function od(e,t,n,r,i){nd(e,t,n,220+r()*r()*900,i*(.5+.5*r()))}function sd(e,t,n,r,i){let a=r()<.3?2:1;for(let o=0;o<a;o++)$u(e,t,n+o*(.012+r()*.02),{type:`highpass`,f:1600+r()*2600,q:.8,d:.003+r()*.008,g:i*(.4+.6*r())},r)}function cd(e,t,n){let r=e.createBufferSource();r.buffer=Xu(e),r.loop=!0;let i=r;for(let[t,r,a]of n){let n=e.createBiquadFilter();n.type=t,n.frequency.value=r,n.Q.value=a,i=i.connect(n)}let a=e.createGain();return a.gain.value=0,i.connect(a).connect(t),r.start(0,Math.random()*2.8),a}var ld=(e,t,n)=>new V(e,t,n),ud={wok:ld(Z.wok.x,Z.stoveTop-6,Z.wok.z),stove:ld(Z.wok.x,24,Z.stove.z+43),oven:ld(Z.oven.x,30,Z.oven.z),yard:ld(0,60,0),tree:ld(-322,318,52)};function dd(){let e={bed:.7,wind:1,fire:1,sfx:1,yard:1,hearth:1,reverb:1};try{let t=new URLSearchParams(location.search).get(`audio`);if(t)for(let n of t.split(`,`)){let[t,r]=n.trim().split(`=`),i=t;if(!(i in e))continue;if(r===void 0||r===``){e[i]=1;continue}let a=Number(r);Number.isFinite(a)&&(e[i]=Math.min(2,Math.max(0,a)))}}catch{}return e}var fd={yard:`yard-garden.mp3`,fire:`fire-hearth.mp3`},pd={yard:.62,stove:2.5,oven:1.5},md={wok:110,stove:120,oven:100,yard:300,tree:260},hd=class{pos;ref;input;pan;lp;constructor(e,t,n,r){this.pos=n,this.ref=r,this.input=e.createGain(),this.pan=e.createPanner(),this.pan.panningModel=`equalpower`,this.pan.distanceModel=`inverse`,this.pan.refDistance=r,this.pan.rolloffFactor=.9,this.pan.maxDistance=1e4,this.pan.positionX.value=n.x,this.pan.positionY.value=n.y,this.pan.positionZ.value=n.z,this.lp=e.createBiquadFilter(),this.lp.type=`lowpass`,this.lp.Q.value=.5,this.lp.frequency.value=18e3,this.input.connect(this.pan),this.pan.connect(this.lp),this.lp.connect(t)}tick(e,t){let n=e.distanceTo(this.pos),r=Iu(1500+16500*Math.min(1,this.ref/Math.max(n,1))**.9,900,18e3);this.lp.frequency.setTargetAtTime(r,t,.25)}},gd=class{cues;muted=!1;ctx=null;master;bus;amb;spots;beds;crickets=[];next={bird:0,bubble:0,crackle:0,coal:0};rnd=Vu(2027);live=!1;mix=dd();sfx=!1;sfxYard;sfxStove;sfxOven;lastNow=0;pauseFor=0;constructor(e){this.cues=e,this.cues.sort((e,t)=>e.t-t.t);try{this.muted=localStorage.getItem(`hjh-mute`)===`1`}catch{}}setCues(e){this.cues=e.sort((e,t)=>e.t-t.t),this.live=!1}unlock(){this.ctx||this.build(),this.ctx&&this.ctx.state===`suspended`&&!document.hidden&&this.ctx.resume()}suspend(){this.ctx&&this.ctx.state===`running`&&this.ctx.suspend()}setMuted(e){this.muted=e;try{localStorage.setItem(`hjh-mute`,e?`1`:`0`)}catch{}}build(){let e=window.AudioContext??window.webkitAudioContext;if(!e)return;let t=this.ctx=new e({latencyHint:`playback`});this.master=t.createGain(),this.master.gain.value=0;let n=t.createDynamicsCompressor();n.threshold.value=-8,n.knee.value=4,n.ratio.value=6,n.attack.value=.003,n.release.value=.2;let r=t.createBiquadFilter();r.type=`lowpass`,r.frequency.value=9e3,r.Q.value=.5,this.bus=t.createGain(),this.bus.connect(r).connect(n).connect(this.master).connect(t.destination),this.amb=t.createGain(),this.amb.connect(this.bus);let i=t.createGain();i.gain.value=.1*this.mix.reverb;let a=t.createConvolver();a.buffer=this.impulse(t,.85),this.bus.connect(a).connect(i).connect(this.master);let o={};for(let e of Object.keys(ud))o[e]=new hd(t,this.amb,ud[e],md[e]);this.spots=o,this.beds={air:cd(t,this.amb,[[`highpass`,80,.7],[`lowpass`,260,.5]]),wind:cd(t,this.amb,[[`bandpass`,650,.5],[`lowpass`,2200,.5]]),leaves:cd(t,this.spots.tree.input,[[`bandpass`,3200,.7],[`highpass`,1500,.5]]),simmer:cd(t,this.spots.wok.input,[[`bandpass`,1100,.6]]),fire:cd(t,this.spots.stove.input,[[`highpass`,60,.7],[`lowpass`,170,.7]]),coals:cd(t,this.spots.oven.input,[[`highpass`,60,.7],[`lowpass`,210,.7]]),coalHiss:cd(t,this.spots.oven.input,[[`bandpass`,2600,.6]])};for(let[e,n,r,i]of[[-.55,4550,.62,3],[.5,4300,.83,4]]){let a=t.createStereoPanner();a.pan.value=e,a.connect(this.spots.yard.input),this.crickets.push({pan:a,f:n,next:0,every:r,pulses:i})}this.loadSfx()}async loadSfx(){let e=this.ctx;if(!e||this.mix.sfx<=0)return;let t=async t=>{let n=await fetch(`/craft-3d/audio/`+t);if(!n.ok)throw Error(`${t} HTTP ${n.status}`);return e.decodeAudioData(await n.arrayBuffer())};try{let[n,r]=await Promise.all([t(fd.yard),t(fd.fire)]),i=e.currentTime+.05;this.sfxYard=this.loopClip(e,n,this.spots.yard.input,i,0,[[`highpass`,140,.7],[`lowpass`,2200,.6]]),this.sfxStove=this.loopClip(e,r,this.spots.stove.input,i,0,[[`highpass`,60,.7],[`lowpass`,950,.7]]),this.sfxOven=this.loopClip(e,r,this.spots.oven.input,i,r.duration*.5,[[`highpass`,55,.7],[`lowpass`,620,.7]]),this.sfx=!0}catch(e){console.warn(`[声音] 素材没加载上，继续用合成底噪`,e)}}loopClip(e,t,n,r,i,a){let o=e.createBufferSource();o.buffer=t,o.loop=!0;let s=o;for(let[t,n,r]of a){let i=e.createBiquadFilter();i.type=t,i.frequency.value=n,i.Q.value=r,s=s.connect(i)}let c=e.createGain();return c.gain.value=0,s.connect(c).connect(n),o.start(r,i%Math.max(.01,t.duration)),c}fire(e,t,n){let r=this.ctx,i=this.bus,a=e.gain;if(e.at){let t=e.at.distanceTo(n.position);if(a*Math.min(1,95/Math.max(t,1))**.85<.01)return;let o=r.createPanner();o.panningModel=`equalpower`,o.distanceModel=`inverse`,o.refDistance=95,o.rolloffFactor=.9,o.maxDistance=1e4,o.positionX.value=e.at.x,o.positionY.value=e.at.y,o.positionZ.value=e.at.z,o.connect(this.bus),i=o}rd[e.name](r,i,t,{gain:a,pitch:e.pitch,dur:e.dur,rnd:Vu(e.seed)})}syncListener(e,t){let n=this.ctx.listener,r=e.position,i=e.matrixWorld.elements,a=n.positionX,o=(e,n)=>e.setTargetAtTime(n,t,.02);a?(o(a,r.x),o(n.positionY,r.y),o(n.positionZ,r.z),o(n.forwardX,-i[8]),o(n.forwardY,-i[9]),o(n.forwardZ,-i[10]),o(n.upX,i[4]),o(n.upY,i[5]),o(n.upZ,i[6])):(n.setPosition(r.x,r.y,r.z),n.setOrientation(-i[8],-i[9],-i[10],i[4],i[5],i[6]))}impulse(e,t){let n=e.sampleRate,r=Math.max(1,Math.floor(n*t)),i=e.createBuffer(2,r,n),a=Math.floor(n*.012);for(let e=0;e<2;e++){let t=i.getChannelData(e),n=Vu(4471+e*977),o=0;for(let e=0;e<r;e++){if(e<a){t[e]=0;continue}let i=(e-a)/(r-a);o+=(n()*2-1-o)*.3,t[e]=o*(1-i)**2.6}}return i}update(e,t,n,r,i,a,o,s){let c=this.ctx;if(!c||c.state!==`running`)return;let l=c.currentTime,u=this.lastNow>0?Math.min(.25,l-this.lastNow):0;this.lastNow=l,this.pauseFor=n?0:this.pauseFor+u;let d=r&&!this.muted;if(this.master.gain.setTargetAtTime(+!!d,l,d?.6:.08),!d){this.live=!1;return}o.updateMatrixWorld(),o.matrixWorldInverse.copy(o.matrixWorld).invert();let f=.06,p=e-t;if(n&&this.live&&p>=0&&p<.35){let n=t+f*i,r=e+f*i;for(let t of this.cues)if(!(t.t<=n)){if(t.t>r)break;this.fire(t,l+Math.max(0,(t.t-e)/i),o)}}this.live=n;let m=n?1:this.pauseFor>5?.12:.3;this.amb.gain.setTargetAtTime(m,l,n?.4:this.pauseFor>5?1.2:.5);let h=.55+.45*(Wu(s*.11+4)*.5+.5),g=.55+.45*(Wu(s*.13+17)*.5+.5),_=(e,t)=>e.gain.setTargetAtTime(t*this.mix.bed,l,.25),v=a.day,y=this.sfx;if(_(this.beds.air,y?0:.04),_(this.beds.wind,(y?.018:.022+.011*v)*h*this.mix.wind),_(this.beds.leaves,y?0:.034*g*(.4+.6*v)*this.mix.wind),_(this.beds.simmer,.075*a.boil**1.4),_(this.beds.fire,y?0:.065*a.fire*this.mix.fire),_(this.beds.coals,y?0:.078*a.oven*this.mix.fire),_(this.beds.coalHiss,y?0:.018*a.oven*this.mix.fire),y){let e=pd.yard*(.15+.85*v)*this.mix.sfx*this.mix.yard;this.sfxYard?.gain.setTargetAtTime(e,l,.7),this.sfxStove?.gain.setTargetAtTime(pd.stove*a.fire*this.mix.sfx*this.mix.hearth,l,.4),this.sfxOven?.gain.setTargetAtTime(pd.oven*a.oven*this.mix.sfx*this.mix.hearth,l,.7)}this.syncListener(o,l);for(let e of Object.keys(ud))this.spots[e].tick(o.position,l);let b=e=>Math.min(1,md[e]/Math.max(o.position.distanceTo(ud[e]),1))**.85,x=b(`wok`),S=b(`stove`),C=b(`oven`),w=l+.15,T=this.rnd,E=this.next,D=(e,t,n,r)=>{for(E[e]<l&&(E[e]=l+T()*t);E[e]<w;)n&&r(E[e]),E[e]+=t*(.3+1.4*T())};if(D(`bubble`,1/(1+26*a.boil**1.5),x>.03,e=>od(c,this.spots.wok.input,e,T,.015+.015*a.boil)),D(`crackle`,1/(.4+(y?.9:2.2)*a.fire),S>.03&&a.fire>0,e=>sd(c,this.spots.stove.input,e,T,(y?.007:.015)*a.fire*this.mix.fire)),D(`coal`,1/(.2+1.6*a.oven),C>.03&&a.oven>.05,e=>sd(c,this.spots.oven.input,e,T,(y?.01:.017)*a.oven*this.mix.fire)),D(`bird`,1/(.05+.4*v),!y&&v>.15,e=>{let t=c.createStereoPanner();t.pan.value=(T()*2-1)*.7,t.connect(this.spots.yard.input),id(c,t,e,T,.024*v)}),a.night>.05)for(let e of this.crickets)for(e.next<l&&(e.next=l+T()*e.every);e.next<w;)ad(c,e.pan,e.next,e.f,.01*a.night,e.pulses),e.next+=e.every*(.9+.2*T())}};function _d(e,t){let n=[],r=1,i=e=>(t,i,a={})=>n.push({t:e+t,name:i,gain:a.gain??1,pitch:a.pitch??1,dur:a.dur??.5,at:a.at??null,seed:r++*7919});for(let t of e)t.sounds(i(t.start));return t(i(0)),n}var vd=`
float hash11(float p) { p = fract(p * 0.1031); p *= p + 33.33; p *= p + p; return fract(p); }
float hash12(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float hash13(vec3 p3) { p3 = fract(p3 * 0.1031); p3 += dot(p3, p3.zyx + 31.32); return fract((p3.x + p3.y) * p3.z); }
vec2 hash22(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973)); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.xx + p3.yz) * p3.zy); }
vec3 hash33(vec3 p3) { p3 = fract(p3 * vec3(0.1031, 0.1030, 0.0973)); p3 += dot(p3, p3.yxz + 33.33); return fract((p3.xxy + p3.yxx) * p3.zyx); }

float vnoise2(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x), mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x), u.y);
}
float vnoise3(vec3 p) {
  vec3 i = floor(p), f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash13(i), hash13(i + vec3(1, 0, 0)), u.x), mix(hash13(i + vec3(0, 1, 0)), hash13(i + vec3(1, 1, 0)), u.x), u.y),
    mix(mix(hash13(i + vec3(0, 0, 1)), hash13(i + vec3(1, 0, 1)), u.x), mix(hash13(i + vec3(0, 1, 1)), hash13(i + vec3(1, 1, 1)), u.x), u.y),
    u.z);
}

// Simplex 3D（Ian McEwan, Ashima Arts, MIT）
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float fbm3(vec3 p) {
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 4; i++) { s += a * snoise(p); p = p * 2.03 + vec3(17.1, 3.7, 9.2); a *= 0.5; }
  return s;
}
float fbm2(vec2 p) {
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 5; i++) { s += a * vnoise2(p); p = p * 2.03 + vec2(11.7, 5.3); a *= 0.5; }
  return s;
}

// 三维沃罗诺伊：x = 最近点距离，y = 次近减最近（越小越靠近边界），z = 格子编号
vec3 voronoi3(vec3 p) {
  vec3 i = floor(p), f = fract(p);
  float d1 = 8.0, d2 = 8.0, id = 0.0;
  for (int z = -1; z <= 1; z++)
  for (int y = -1; y <= 1; y++)
  for (int x = -1; x <= 1; x++) {
    vec3 g = vec3(float(x), float(y), float(z));
    vec3 r = g + hash33(i + g) - f;
    float d = dot(r, r);
    if (d < d1) { d2 = d1; d1 = d; id = hash13(i + g + 7.0); }
    else if (d < d2) { d2 = d; }
  }
  d1 = sqrt(d1); d2 = sqrt(d2);
  return vec3(d1, d2 - d1, id);
}
vec3 voronoi2(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  float d1 = 8.0, d2 = 8.0, id = 0.0;
  for (int y = -1; y <= 1; y++)
  for (int x = -1; x <= 1; x++) {
    vec2 g = vec2(float(x), float(y));
    vec2 r = g + hash22(i + g) - f;
    float d = dot(r, r);
    if (d < d1) { d2 = d1; d1 = d; id = hash12(i + g + 7.0); }
    else if (d < d2) { d2 = d; }
  }
  d1 = sqrt(d1); d2 = sqrt(d2);
  return vec3(d1, d2 - d1, id);
}

float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
`,yd=`
// 抗锯齿：p 是以"一个花纹周期"为单位的坐标。一个像素里走过的周期数越多，这层细节越该淡成平均色，
// 不然镜头一动，比像素还细的花纹就在像素格子之间乱跳（看着就是一闪一闪）。返回 1 = 细节照常，0 = 全淡掉
float aaFade(vec2 p) {
  vec2 w = fwidth(p);
  return 1.0 - smoothstep(0.22, 0.6, max(w.x, w.y));
}
float aaFade3(vec3 p) {
  vec3 w = fwidth(p);
  return 1.0 - smoothstep(0.22, 0.6, max(max(w.x, w.y), w.z));
}
vec3 procPerturb(vec3 surfPos, vec3 surfNorm, float h, float faceDir) {
  vec3 sx = dFdx(surfPos);
  vec3 sy = dFdy(surfPos);
  vec2 dh = vec2(dFdx(h), dFdy(h));
  // 坡度封顶：一个像素里高度变得比像素本身还宽，说明凹凸比像素还细（会闪），压下来
  float px = max(max(length(sx), length(sy)), 1e-6);
  float slope = length(dh) / px;
  dh *= min(1.0, 0.9 / max(slope, 1e-6));
  vec3 r1 = cross(sy, surfNorm);
  vec3 r2 = cross(surfNorm, sx);
  float det = dot(sx, r1) * faceDir;
  vec3 grad = sign(det) * (dh.x * r1 + dh.y * r2);
  vec3 n = abs(det) * surfNorm - grad;
  float l = length(n);
  // 退化的地方（面积为零的三角形）不出坏值
  return l > 1e-8 ? n / l : surfNorm;
}
`;function bd(e){if(typeof e==`number`)return`float`;if(typeof e==`boolean`)return`bool`;if(e instanceof U)return`vec3`;if(e instanceof z)return`vec2`;if(e instanceof V)return`vec3`;if(e instanceof Qt)return`vec4`;if(e instanceof Zt)return`sampler2D`;throw Error(`unknown uniform type`)}function xd(e){return e?Object.entries(e).map(([e,{value:t}])=>t instanceof Float32Array||Array.isArray(t)?`uniform ${t.length&&typeof t[0]!=`number`?bd(t[0]):`float`} ${e}[${t.length}];`:`uniform ${bd(t)} ${e};`).join(`
`):``}var Sd=0,Cd=new Map;function wd(e){let t=Cd.get(e);return t||Cd.set(e,t=`proc`+Sd++),t}function Td(e,t){return e.replace(`#include <common>`,`#include <common>
varying vec3 vPos;
varying vec3 vNrm;
varying vec3 vWPos;
varying vec3 vWNrm;
${t.attributes??``}
${t.varyings??``}
${xd(t.uniforms)}
${vd}
${t.vertexHead??``}`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
vPos = position;
vNrm = normal;
{
  vec3 wn = objectNormal;
  #ifdef USE_INSTANCING
    wn = mat3(instanceMatrix) * wn;
  #endif
  vWNrm = normalize(mat3(modelMatrix) * wn);
}
${t.vertex??``}`).replace(`#include <project_vertex>`,`#include <project_vertex>
{
  vec4 wp = vec4(transformed, 1.0);
  #ifdef USE_INSTANCING
    wp = instanceMatrix * wp;
  #endif
  vWPos = (modelMatrix * wp).xyz;
}`)}function Ed(e,t){return e.replace(`#include <common>`,`#include <common>
varying vec3 vPos;
varying vec3 vNrm;
varying vec3 vWPos;
varying vec3 vWNrm;
${t.varyings??``}
${xd(t.uniforms)}
${vd}
${yd}
${t.fragmentHead??``}`).replace(`#include <color_fragment>`,`#include <color_fragment>
float procBump = 0.0;
${t.discard??``}
${t.color??``}`).replace(`#include <roughnessmap_fragment>`,`#include <roughnessmap_fragment>\n${t.rough??``}`).replace(`#include <metalnessmap_fragment>`,`#include <metalnessmap_fragment>\n${t.metal??``}`).replace(`#include <normal_fragment_maps>`,`#include <normal_fragment_maps>
${t.bump?`normal = procPerturb(-vViewPosition, normal, procBump, faceDirection);`:``}`).replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>\n${t.emissive??``}`).replace(`#include <lights_physical_fragment>`,`#include <lights_physical_fragment>\n${t.physical??``}`)}function Dd(e,t){let n=JSON.stringify(t,(e,t)=>e===`uniforms`?Object.keys(t??{}):t)+e.type;return e.onBeforeCompile=e=>{Object.assign(e.uniforms,t.uniforms??{}),e.vertexShader=Td(e.vertexShader,t),e.fragmentShader=Ed(e.fragmentShader,t)},e.customProgramCacheKey=()=>wd(n),e.userData.proc=t,e}function Od(e,t){return Dd(new so(e),t)}function kd(e,t){return Dd(new co(e),t)}function Ad(e){let t=new lo({depthPacking:Ve}),n=`depth`+JSON.stringify({a:e.attributes,v:e.vertex,d:e.discard,vh:e.vertexHead,fh:e.fragmentHead});return t.onBeforeCompile=t=>{Object.assign(t.uniforms,e.uniforms??{}),t.vertexShader=t.vertexShader.replace(`#include <common>`,`#include <common>
varying vec3 vPos;
varying vec3 vNrm;
varying vec3 vWPos;
${e.attributes??``}
${e.varyings??``}
${xd(e.uniforms)}
${vd}
${e.vertexHead??``}`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
vPos = position;
vNrm = normal;
vWPos = vec3(0.0);
${e.vertex??``}`),e.discard&&(t.fragmentShader=t.fragmentShader.replace(`#include <common>`,`#include <common>
varying vec3 vPos;
varying vec3 vNrm;
varying vec3 vWPos;
${e.varyings??``}
${xd(e.uniforms)}
${vd}
${e.fragmentHead??``}`).replace(`#include <clipping_planes_fragment>`,`#include <clipping_planes_fragment>\n${e.discard}`))},t.customProgramCacheKey=()=>wd(n),t}var jd={paper:`#F2E9D8`,beige:`#E3CFA8`,bamboo:`#C9A66B`,wood:`#8A5A3B`,darkWood:`#5B3A29`,brick:`#B5654A`,clay:`#7E4A35`,iron:`#2F2A2B`,cement:`#A8A39A`,pomelo:`#9DBA4E`,leaf:`#4F7A3A`,shadow:`#6E6278`,fire:`#E8893A`,blue:`#5E7A93`,lightBlue:`#9DB3C6`,jade:`#B7CFA8`,red:`#C8452F`},Md={skin:[`#4E7027`,`#6A8F33`,`#8EAD4A`],blanch:[`#7C9A2C`,`#9CB83A`,`#BFD266`],pith:[`#DCD2B6`,`#F3ECD6`],inner:[`#B9BF80`,`#D6D9A2`],oil:`#9DA75A`,dried:[`#4F4E2C`,`#6F6E3C`,`#8C8A52`],driedInner:`#C4A276`,product:[`#575C41`,`#6C7155`,`#868A6C`],productInner:`#D9B597`,pulp:`#E9DFB4`},Nd=8.6,Pd=2.8,Fd=.09,Id=.05,Ld=3,Rd=new V(0,1,0),zd=8.65,Bd=.4,Vd=.85;function Hd(e){let t=Nd*(.9+.2*Hu(e)),n=Pd*(.9+.2*Hu(e+5)),r=e=>Math.max(.06,n*Math.sin(Math.PI*Math.min(1,e*1.06))**.78*(1-.22*e)),i=new ia;i.moveTo(-.16,-1.25);for(let e=0;e<=20;e++){let n=e/20;i.lineTo(r(n),n*t)}i.lineTo(0,t+.22);for(let e=20;e>=0;e--){let n=e/20;i.lineTo(-r(n),n*t)}i.lineTo(.16,-1.25),i.closePath();let a=new Ha(i,{depth:Fd,bevelEnabled:!1,steps:1});a.rotateX(-Math.PI/2);let o=.2+.09*Hu(e+11),s=.22+.12*Hu(e+13),c=(Hu(e+17)-.5)*.26,l=a.attributes.position;for(let e=0;e<l.count;e++){let r=l.getX(e),i=l.getZ(e),a=l.getY(e),u=Math.min(1,Math.max(0,-i/t)),d=c*u,f=Math.cos(d),p=Math.sin(d),m=r*f-a*p,h=Math.abs(r)/n,g=r*p+a*f+o*Math.abs(r)*(.55+.45*h)*(.75+.25*u)-s*u*u;l.setXYZ(e,m,g,i)}return l.needsUpdate=!0,a.computeVertexNormals(),a.computeBoundingBox(),a.translate(0,-(a.boundingBox?.min.y??0),0),a.computeBoundingBox(),a}function Ud(e){return kd({roughness:.55,metalness:0,clearcoat:.12,clearcoatRoughness:.6,side:2,transparent:!0},{uniforms:{uLeaf:{value:new U(jd.leaf).offsetHSL(.005*e,.04*e,.03*e)},uVein:{value:new U(`#93AD5E`)},uHalf:{value:Pd}},bump:!0,color:`
        float mid = 1.0 - smoothstep(0.0, 0.14, abs(vPos.x));
        float lat = sin((vPos.z + abs(vPos.x) * 1.35) * 2.5);
        float vein = smoothstep(0.86, 1.0, abs(lat)) * 0.22;
        float mott = snoise(vPos * 0.7) * 0.5 + 0.5;
        float edge = smoothstep(0.72, 1.0, abs(vPos.x) / uHalf);
        vec3 col = mix(uLeaf * (0.8 + 0.3 * mott), uVein, mid * 0.38 + vein);
        diffuseColor.rgb = mix(col, uLeaf * 0.55, edge * 0.55);
        // 主脉、侧脉真的凸一点，光扫过去会有筋
        procBump = 0.035 * mid + 0.02 * vein;
      `})}var Wd=class{group=new H;count=0;leaves=[];placed=[];m=new rn;p=new V;q=new B;s=new V;e=new mn;build(e){let t=e.layout.basket,n=e.w.tai?2:Ld;this.count=n;let r=t=>e.layout.lift(t),i=t.map((e,t)=>t).sort((e,n)=>t[n].y+r(n)-(t[e].y+r(e))),a=i.filter(e=>Math.hypot(t[e].x,t[e].z)<=5.6),o=(a.length>=n?a:i).slice(0,n);for(let e=0;e<n;e++){let n=11+e*23,i=Hd(n),a=t[o[e%o.length]],s=.6+.8*Hu(n+3),c=Hu(n+7)*Math.PI*2,l=a.x+Math.cos(c)*s,u=a.z+Math.sin(c)*s,d=Hu(n+9)*Math.PI*2,f=Gd(t,r,this.placed,i,l,u,d),p=new rn().compose(new V(l,f.y+Id,u),f.q,new V(1,1,1));this.placed.push(Jd(i,p));let m=Ud(e%2?1:-1),h=new W(i,m);h.castShadow=!0,h.receiveShadow=!0,this.group.add(h),this.leaves.push({mesh:h,mat:m,local:p,release:zd+Hu(n+13)*Bd,fall:14+5*Hu(n+19),phase:Hu(n+29)*Math.PI*2,spawn:null})}}update(e,t,n){t.updateWorldMatrix(!0,!1);let r=n?e-n.start:-1e9;for(let e of this.leaves){if(!n||r<e.release){this.m.multiplyMatrices(t.matrixWorld,e.local),this.m.decompose(this.p,this.q,this.s),e.mesh.position.copy(this.p),e.mesh.quaternion.copy(this.q),e.mesh.visible=!0,e.mat.opacity=1;continue}e.spawn||=(n.basketPose(e.release,this.p,this.q),this.m.compose(this.p,this.q,this.s.set(1,1,1)).multiply(e.local),new V().setFromMatrixPosition(this.m));let i=r-e.release,a=9+4*Hu(e.phase*40),o=Math.sin(i*2.3+e.phase);e.mesh.position.set(e.spawn.x-a*.55*i+o*i*.9,e.spawn.y-e.fall*i,e.spawn.z+a*.85*i+Math.cos(i*1.8+e.phase)*1.5*i),this.e.set(i*1.3+e.phase,i*1.1,i*.8+e.phase),e.mesh.quaternion.setFromEuler(this.e);let s=1-J(Vd,2.35,i);e.mat.opacity=s,e.mesh.visible=s>.004}}};function Gd(e,t,n,r,i,a,o){let s=new B().setFromEuler(new mn(0,o,0)),c=Yd(r),l=0,u=0,d=Math.cos(o),f=Math.sin(o);for(let[e,,t]of c)l+=e*d+t*f,u+=-e*f+t*d;l/=c.length,u/=c.length;let p=0,m=1,h=0,g=-1e9;for(let n=0;n<e.length;n++){let r=e[n],o=t(n),s=i+l-r.x,c=a+u-r.z,d=s*s+c*c;if(d>=o*o)continue;let f=Math.sqrt(o*o-d),_=r.y+f;_<=g||(g=_,p=s/o,m=f/o,h=c/o)}let _=new V(p,m,h);_.y<.78&&(_.y=.78,_.normalize());let v=g>-1e8?new B().setFromUnitVectors(Rd,_.normalize()).multiply(s):s,y=0,b=new V;for(let[r,o,s]of c){b.set(r,o,s).applyQuaternion(v);let c=Kd(e,t,n,i+b.x,a+b.z)-b.y;c>y&&(y=c)}return{q:v,y}}function Kd(e,t,n,r,i){let a=0;for(let n=0;n<e.length;n++){let o=e[n],s=t(n),c=r-o.x,l=i-o.z,u=c*c+l*l;if(u<s*s){let e=o.y+Math.sqrt(s*s-u);e>a&&(a=e)}}for(let e of n)for(let t=0;t<e.length;t+=9){let n=qd(e,t,r,i);n>a&&(a=n)}return a}function qd(e,t,n,r){let i=e[t],a=e[t+2],o=e[t+3],s=e[t+5],c=e[t+6],l=e[t+8],u=(s-l)*(i-c)+(c-o)*(a-l);if(Math.abs(u)<1e-6)return-1/0;let d=((s-l)*(n-c)+(c-o)*(r-l))/u,f=((l-a)*(n-c)+(i-c)*(r-l))/u,p=1-d-f;return d<-5e-4||f<-5e-4||p<-5e-4?-1/0:d*e[t+1]+f*e[t+4]+p*e[t+7]}function Jd(e,t){let n=e.attributes.position,r=new V,i=[];for(let e=0;e<n.count;e++)r.set(n.getX(e),n.getY(e),n.getZ(e)).applyMatrix4(t),i.push({x:r.x,y:r.y,z:r.z});let a=e.index,o=a?a.count:n.count,s=[];for(let e=0;e<o;e+=3){let t=i[a?a.getX(e):e],n=i[a?a.getX(e+1):e+1],r=i[a?a.getX(e+2):e+2];s.push(t.x,t.y,t.z,n.x,n.y,n.z,r.x,r.y,r.z)}return s}function Yd(e){let t=[],n=e.attributes.position,r=e.index,i=r?r.count:n.count;for(let e=0;e<i;e+=3){let i=r?r.getX(e):e,a=r?r.getX(e+1):e+1,o=r?r.getX(e+2):e+2;t.push([n.getX(i),n.getY(i),n.getZ(i)],[n.getX(a),n.getY(a),n.getZ(a)],[n.getX(o),n.getY(o),n.getZ(o)]),t.push([(n.getX(i)+n.getX(a))/2,(n.getY(i)+n.getY(a))/2,(n.getZ(i)+n.getZ(a))/2],[(n.getX(a)+n.getX(o))/2,(n.getY(a)+n.getY(o))/2,(n.getZ(a)+n.getZ(o))/2],[(n.getX(o)+n.getX(i))/2,(n.getY(o)+n.getY(i))/2,(n.getZ(o)+n.getZ(i))/2]),t.push([(n.getX(i)+n.getX(a)+n.getX(o))/3,(n.getY(i)+n.getY(a)+n.getY(o))/3,(n.getZ(i)+n.getZ(a)+n.getZ(o))/3])}return t}var Xd=class{s;id;dur;start=0;constructor(e,t,n){this.s=e,this.id=t,this.dur=n}get end(){return this.start+this.dur}lights(){return[]}carry(e){}sounds(e){}prepare(){}hide(){}},Zd=(e,t,n)=>new V(e,t,n),Qd=980,$d=new V(0,1,0),ef=new V(0,0,1),tf=new V(1,0,0),nf=6.8,rf=8.65,af=.07,of=.45,sf=12.4,cf=3,lf=Z.basketFloor,uf=-Math.PI/2+.25,df={tilt:8.25,basketDown:10.76,basketTap:10.78},ff=class extends Xd{sp=new V;sq=new B;e=new mn;constructor(e,t=`blanch`){super(e,t,30)}shots(e){let t=Z,n=t.wok,r=t.oven,i=this.s;e(0,7.6,{target:Zd(n.x+18,86,n.z+6),dist:170,az:22,el:30,fov:34,ap:.1},{target:Zd(n.x+18,84,n.z+8),dist:152,az:28,el:34,fov:34,ap:.12}),e(7.6,12.4,{target:Zd(n.x+4,84,n.z+2),dist:96,az:28,el:42,fov:32,ap:.16},{target:Zd(n.x+2,80,n.z+2),dist:84,az:34,el:46,fov:32,ap:.18},1),e(12.4,15.4,{target:i.fruitCenter,dist:44,az:18,el:30,fov:30,ap:.3},{target:i.fruitCenter,dist:38,az:28,el:34,fov:30,ap:.32},1),e(15.4,21.6,{target:Zd(-190,86,-252),dist:205,az:6,el:32,fov:34,ap:.06},{target:Zd(-188,84,-252),dist:190,az:12,el:35,fov:34,ap:.07},1.2),e(21.6,30,{target:Zd(r.x,t.ovenTop+5,r.z+2),dist:74,az:10,el:46,fov:32,ap:.16},{target:Zd(r.x,t.ovenTop+4,r.z+2),dist:58,az:22,el:40,fov:30,ap:.2},1.6)}lights(){return[[8,`morning`]]}carry(e){let t=this.s;e>=0&&(t.carry.boil=Ku(e,[[0,.2],[1,.25],[7,1],[22,1],[26,.55]]));let n=t.look;n.blanch=J(9.4,11.4,e),n.wet=n.blanch,n.wet*=1-.65*J(14,30,e)}sounds(e){let t=Z,n=Zd(t.wok.x,t.stoveTop,t.wok.z),r=Zd(t.oven.x,t.ovenTop,t.oven.z),i=this.s.layout;e(nf,`rustle`,{dur:.7,gain:.4,at:lf}),e(df.tilt,`rustle`,{dur:.8,gain:.45,pitch:.85,at:n});let a=this.s.w.leaves.count;for(let t=0;t<a;t++)e(zd+.05+Bd/a*t,`rustle`,{dur:.22,gain:.16-.03*t,pitch:1.35+.08*t,at:lf});i.pour.forEach((t,r)=>e(rf+r*af+of-.01,`plop`,{gain:.5-r%3*.12,pitch:.9+.05*(r*7%5),at:n})),e(df.basketDown,`thud`,{gain:.4,pitch:.8,at:lf}),e(df.basketTap,`tap`,{gain:.25,pitch:.75,at:lf}),i.scoops.forEach((t,i)=>{let a=sf+i*cf;e(a+.72,`swish`,{dur:.4,gain:.65,at:n}),e(a+1,`pour`,{dur:1.3,gain:.6,at:n}),e(a+2.24,`rustle`,{dur:.35,gain:.3,at:r}),t.forEach((t,n)=>e(a+2.28+n*.06+.47,`tap`,{gain:.4,pitch:.75+n%3*.08,at:r}))}),e(sf+i.scoops.length*cf+.58,`tap`,{gain:.35,pitch:.65,at:Zd(-171,t.stoveTop,-246)})}swirl(e){return .25*Math.max(0,e-9)}floatPos(e,t,n){let r=Z,i=this.swirl(t),a=this.s.layout.float[e],o=Math.cos(i),s=Math.sin(i),c=.55+.3*Math.sin(e*3.7),l=c*Math.sin(t*(.9+e%4*.13)+e*2.3),u=c*Math.cos(t*(.75+e%3*.11)+e*1.9);return n.set(r.wok.x+a.x*o-a.y*s+l,this.s.w.stove.waterY+.5+.25*Math.sin(t*2.1+e*1.7),r.wok.z+a.x*s+a.y*o+u)}sievePos(e,t){let n=Z,r=this.s.layout.sieve[e];return t.set(n.oven.x+r.x,n.ovenTop+this.s.layout.lift(e)+.03,n.oven.z+r.y)}scoopOf(e){let t=this.s.layout.scoops;for(let n=0;n<t.length;n++){let r=t[n].indexOf(e);if(r>=0)return{s:n,g:r,n:t[n].length}}return{s:0,g:0,n:4}}restQ(e,t){let n=this.s.layout.restRot;return n?n(e):new B().setFromAxisAngle($d,e*1.3).multiply(t)}basketPose(e,t,n){let r=Z,i=Zd(r.wok.x+16,112,r.wok.z+6);e<nf?t.copy(lf):e<8.4?Gu(t,lf,i,X(e,nf,8.4),22):e<9.4?t.copy(i):e<10.8?Gu(t,i,lf,X(e,9.4,10.8),10):t.copy(lf);let a=2*Y(X(e,8.2,9.1))*(1-Y(X(e,9.4,10.3)));n.setFromAxisAngle(ef,a)}strainerAt(e,t,n){let r=Z,i=Zd(-171,r.stoveTop+.05,-246),a=Zd(r.oven.x,r.ovenTop+21,r.oven.z),o=this.s.w.stove.waterY,s=0,c=-.35,l=this.s.layout.scoops,u=sf+l.length*cf;if(e<0||e>=this.dur||e<sf||e>u+1.2)t.copy(i),c=uf;else if(e>=u-.5){let n=X(e,u-.5,u+.6);Gu(t,a,i,n,8),c=q(-.35,uf,Y(n)),s=.8*(1-Y(X(e,u-.5,u)))}else{let n=Math.floor((e-sf)/cf),r=sf+n*cf,u=e-r,d=new V,f=new V;for(let e of l[n])d.add(this.floatPos(e,r+.85,f));d.multiplyScalar(1/l[n].length);let p=Zd(d.x,o+16,d.z),m=Zd(d.x,o-3,d.z),h=Zd(d.x,o+18,d.z);u<.7&&Gu(t,n===0?i:a,p,Y(X(u,0,.7)),n===0?8:14),n===0&&u<.7?c=q(uf,-.35,Y(X(u,0,.7))):u<1?t.lerpVectors(p,m,Bu(X(u,.7,1))):u<1.4?t.lerpVectors(m,h,zu(X(u,1,1.4))):u<2.2?Gu(t,h,a,X(u,1.4,2.2),10):t.copy(a),s=.8*Y(X(u,2.2,2.5))*(1-Y(X(u,2.55,3)))}this.e.set(0,c,s,`YXZ`),n.setFromEuler(this.e)}fruit(e,t,n,r){let i=this.s,a=i.layout.pour.indexOf(t);if(a<0){this.sievePos(t,n),r.copy(this.restQ(t,i.fruitRot(t)));return}let o=rf+a*af,s=o+of,c=new V,l=new B;if(e<o){this.basketPose(e,c,l),i.fruitInBasket(t,n,r,c,l);return}this.basketPose(o,c,l);let u=new V,d=new B;i.fruitInBasket(t,u,d,c,l);let f=new B().setFromAxisAngle(tf,2.5+t).premultiply(d);if(e<s){let i=X(e,o,s),a=this.floatPos(t,s,new V);n.set(q(u.x,a.x,i),u.y+(a.y-u.y)*i*i,q(u.z,a.z,i)),r.copy(d).slerp(f,i);return}let{s:p,g:m,n:h}=this.scoopOf(t),g=sf+p*cf,_=new B().setFromAxisAngle($d,this.swirl(e)).multiply(f),v=J(g+.8,g+1.1,e),y=g+2.28+m*.06,b=new V,x=new B;if(e<y){this.strainerAt(e,b,x);let a=this.floatPos(t,e,new V),o=i.layout.strainer(h,m,t,new V).applyQuaternion(x).add(b);n.lerpVectors(a,o,v),r.copy(_),v>0&&r.slerp(new B().copy(x).multiply(f),v);return}this.strainerAt(y,b,x);let S=i.layout.strainer(h,m,t,new V).applyQuaternion(x).add(b),C=this.sievePos(t,new V),w=this.restQ(t,f),T=X(e,y,y+.5);Gu(n,S,C,T,3),r.copy(x).multiply(f).slerp(w,Y(T))}pose(e,t){let n=this.s,r=n.w,i=Z,a=n.R;this.basketPose(e,n.basketPos,n.basketQuat),this.strainerAt(e,this.sp,this.sq),r.stove.strainer.position.copy(this.sp),r.stove.strainer.quaternion.copy(this.sq),Ju(r.stove.strainer,!0);let o=new V,s=new B;this.fruit(e,0,o,s),n.setHeroByCenter(o,s),n.applyHero();let c=n.fruits;for(let t=1;t<c.count;t++)this.fruit(e,t,o,s),c.setFruit(t,o,s);c.show(!0);let l=n.layout.pour,u=rf+l.indexOf(0)*af+of;r.stove.waterU.uSplash.value.set(0,0,t-(e-u),+(e>u-.1&&e<u+4));let d=J(13.4,14,e)*(1-J(14.600000000000001,15.600000000000001,e)),f=J(14.600000000000001,16.4,e)*(1-J(24,30,e));r.batchSteam.set(Zd(i.oven.x,i.ovenTop+a*1.5,i.oven.z),f),r.heroSteam.set(o.set(0,a*1.6,0).applyQuaternion(n.heroQuat).add(n.heroPos),d);let p=r.drops,m=new V;for(let t of[...l].sort((e,t)=>e-t)){let n=rf+l.indexOf(t)*af+of,i=e-n;if(i<0||i>.7)continue;let a=this.floatPos(t,n,new V),o=Vu(5+t);for(let e=0;e<7;e++){let e=o()*Fu,t=30+o()*55,n=110+o()*140;m.set(a.x+Math.cos(e)*3,r.stove.waterY,a.z+Math.sin(e)*3),m.x+=Math.cos(e)*t*i,m.z+=Math.sin(e)*t*i,m.y+=n*i-.5*Qd*i*i,m.y>r.stove.waterY-.2&&p.add(m,.2+o()*.18,1.3)}}let h=new V,g=new B;for(let t=0;t<n.layout.scoops.length;t++){let n=sf+t*cf;if(!(e<n+1||e>n+2.9))for(let a=0;a<28;a++){let o=n+1+a/28*1.3+Hu(a+t*31)*.05,s=e-o;if(s<0||s>.6)continue;this.strainerAt(o,h,g);let c=6*Math.sqrt(Hu(a*3.1+t)),l=Hu(a*7.7+t)*Fu;m.set(Math.cos(l)*c,.2,Math.sin(l)*c).applyQuaternion(g).add(h),m.y-=.5*Qd*s*s;let u=Math.hypot(m.x-i.oven.x,m.z-i.oven.z)<i.ovenSieveR?i.ovenTop:Math.hypot(m.x-i.wok.x,m.z-i.wok.z)<i.wokR?r.stove.waterY:i.stoveTop;m.y>u&&p.add(m,.2+.1*Hu(a),1+Math.min(1.5,s*4))}}}},pf=()=>({target:new V,dist:100,az:0,el:20,fov:35,ap:.1,shake:1});function mf(e,t,n){return typeof e.target==`function`?e.target(t,n.target):n.target.copy(e.target),n.dist=e.dist,n.az=e.az,n.el=e.el,n.fov=e.fov,n.ap=e.ap,n.shake=e.shake??1,n}function hf(e,t,n,r){return e.target.lerpVectors(t.target,n.target,r),e.dist=Math.exp(q(Math.log(t.dist),Math.log(n.dist),r)),e.az=q(t.az,n.az,r),e.el=q(t.el,n.el,r),e.fov=q(t.fov,n.fov,r),e.ap=q(t.ap,n.ap,r),e.shake=q(t.shake,n.shake,r),e}var gf=class{shots=[];camA=pf();camB=pf();camP=pf();adder(e){return(t,n,r,i,a=0,o)=>this.shots.push({t0:e+t,t1:e+n,a:r,b:i,blend:a,ease:o})}at(e,t){let n=this.shots,r=n.findIndex(t=>e>=t.t0&&e<t.t1);r<0&&(r=e<n[0].t0?0:n.length-1);let i=n[r],a=(i.ease??Y)(X(e,i.t0,i.t1));if(hf(t,mf(i.a,e,this.camA),mf(i.b,e,this.camB),a),i.blend>0&&r>0&&e<i.t0+i.blend){let a=n[r-1],o=(a.ease??Y)(X(e,a.t0,a.t1)),s=hf(this.camP,mf(a.a,e,this.camA),mf(a.b,e,this.camB),o),c=Y(X(e,i.t0,i.t0+i.blend));hf(t,s,{target:t.target.clone(),dist:t.dist,az:t.az,el:t.el,fov:t.fov,ap:t.ap,shake:t.shake},c)}return t}},_f=(()=>{try{let e=Number(new URLSearchParams(location.search).get(`fill`));return Number.isFinite(e)&&e>0?Math.min(2,e):1}catch{return 1}})(),vf=e=>({...e,sun:new V(...e.sun).normalize(),sunColor:new U(e.sunColor),zenith:new U(e.zenith),horizon:new U(e.horizon),ground:new U(e.ground),hemiSky:new U(e.hemiSky),hemiGround:new U(e.hemiGround),fog:new U(e.fog),cloudLit:new U(e.cloudLit),cloudShade:new U(e.cloudShade),warm:new U(e.warm)}),yf={morning:vf({sun:[.72,.36,.5],sunColor:`#FFD9AE`,sunI:3.4,zenith:`#5E9AD8`,horizon:`#FBE7CE`,ground:`#B9A894`,hemiSky:`#B8C8E2`,hemiGround:`#8A7A88`,hemiI:.85,envI:.55,fog:`#E8DCCB`,fogD:32e-5,cloud:.42,cloudLit:`#FFF1DE`,cloudShade:`#B9AFC2`,exposure:.86,warm:`#FFF0D8`,lift:.12}),forenoon:vf({sun:[.5,.62,.6],sunColor:`#FFE8C8`,sunI:3.7,zenith:`#4F91D6`,horizon:`#EFF3F2`,ground:`#B4A795`,hemiSky:`#BCD0EA`,hemiGround:`#8E7F8A`,hemiI:.8,envI:.55,fog:`#E2E1DA`,fogD:28e-5,cloud:.4,cloudLit:`#FFFFFF`,cloudShade:`#B8B6C8`,exposure:.83,warm:`#FFF3E2`,lift:.1}),noon:vf({sun:[.12,.93,.34],sunColor:`#FFF2DE`,sunI:3.9,zenith:`#4A8CD4`,horizon:`#EBF1F4`,ground:`#B6AA98`,hemiSky:`#C0D3EC`,hemiGround:`#8F808C`,hemiI:.78,envI:.55,fog:`#E0E3E2`,fogD:26e-5,cloud:.38,cloudLit:`#FFFFFF`,cloudShade:`#BCBACB`,exposure:.8,warm:`#FFF4E6`,lift:.1}),afternoon:vf({sun:[-.56,.52,.6],sunColor:`#FFE1B8`,sunI:3.6,zenith:`#5791D2`,horizon:`#F8E8D2`,ground:`#B7A693`,hemiSky:`#BCCBE4`,hemiGround:`#8C7B88`,hemiI:.8,envI:.55,fog:`#E6DCCD`,fogD:3e-4,cloud:.42,cloudLit:`#FFF4E4`,cloudShade:`#BBB2C6`,exposure:.83,warm:`#FFEFD6`,lift:.11}),golden:vf({sun:[-.72,.27,.6],sunColor:`#FFC48A`,sunI:3.3,zenith:`#7290C4`,horizon:`#F6CB9E`,ground:`#B09A88`,hemiSky:`#AFB8DA`,hemiGround:`#86707F`,hemiI:.85,envI:.55,fog:`#EBCDAE`,fogD:36e-5,cloud:.46,cloudLit:`#FFD9AE`,cloudShade:`#A99ABA`,exposure:.88,warm:`#FFE6C4`,lift:.13}),dusk:vf({sun:[-.78,.1,.58],sunColor:`#FF9E62`,sunI:2.4,zenith:`#5B6E9E`,horizon:`#F0A57C`,ground:`#9C8478`,hemiSky:`#959CC6`,hemiGround:`#6F5A69`,hemiI:.9,envI:.5,fog:`#D9A88E`,fogD:4e-4,cloud:.5,cloudLit:`#FFB98A`,cloudShade:`#8A7898`,exposure:.96,warm:`#FFDDB8`,lift:.15}),evening:vf({sun:[-.8,.035,.55],sunColor:`#FF8C5A`,sunI:1.3,zenith:`#4C5A8C`,horizon:`#E59674`,ground:`#7E6B6C`,hemiSky:`#7F86B5`,hemiGround:`#5E4C5E`,hemiI:.95,envI:.45,fog:`#B98C85`,fogD:42e-5,cloud:.52,cloudLit:`#F5A487`,cloudShade:`#6E6386`,exposure:1.12,warm:`#FFD9B5`,lift:.17}),night:vf({sun:[.42,.62,-.38],sunColor:`#A9BCE6`,sunI:.42,zenith:`#111A30`,horizon:`#2A3350`,ground:`#1A1A22`,hemiSky:`#3A4A78`,hemiGround:`#1F1B26`,hemiI:.42,envI:.22,fog:`#20263A`,fogD:45e-5,cloud:.3,cloudLit:`#56617F`,cloudShade:`#1C2036`,exposure:1.6,warm:`#FFE2C4`,lift:.1})};function bf(e){return{...e,sun:e.sun.clone(),sunColor:e.sunColor.clone(),zenith:e.zenith.clone(),horizon:e.horizon.clone(),ground:e.ground.clone(),hemiSky:e.hemiSky.clone(),hemiGround:e.hemiGround.clone(),fog:e.fog.clone(),cloudLit:e.cloudLit.clone(),cloudShade:e.cloudShade.clone(),warm:e.warm.clone()}}function xf(e,t,n,r){e.sun.copy(t.sun).lerp(n.sun,r).normalize();for(let i of[`sunColor`,`zenith`,`horizon`,`ground`,`hemiSky`,`hemiGround`,`fog`,`cloudLit`,`cloudShade`,`warm`])qu(e[i],t[i],n[i],r);for(let i of[`sunI`,`hemiI`,`envI`,`fogD`,`cloud`,`exposure`,`lift`])e[i]=q(t[i],n[i],r);return e}var Sf=`
uniform vec3 uSun, uSunColor, uZenith, uHorizon, uGround, uCloudLit, uCloudShade;
uniform float uTime, uCloud, uSunDisk;
varying vec3 vDir;
${vd}
void main() {
  vec3 d = normalize(vDir);
  float h = d.y;
  vec3 sky = mix(uHorizon, uZenith, pow(clamp(h, 0.0, 1.0), 0.5));
  sky = mix(sky, uGround, smoothstep(0.0, -0.06, h));
  float mu = dot(d, uSun);
  float m = max(mu, 0.0);
  // 太阳周围的光晕，贴地平线时更暖更宽
  sky += uSunColor * (pow(m, 6.0) * 0.28 + pow(m, 48.0) * 0.5) * (1.0 + 0.6 * (1.0 - smoothstep(0.0, 0.4, uSun.y)));
  // 云
  if (h > -0.02) {
    vec2 p = d.xz / (max(h, 0.0) + 0.16) * 1.4 + vec2(uTime * 0.018, uTime * 0.006);
    float n = fbm2(p * 1.2) + 0.25 * fbm2(p * 4.0 + 3.0);
    float c = smoothstep(1.0 - uCloud, 1.0 - uCloud + 0.32, n * 0.95);
    float lit = smoothstep(-0.4, 1.0, mu);
    float edge = smoothstep(0.0, 0.6, c) * (1.0 - smoothstep(0.6, 1.0, c));
    vec3 cc = mix(uCloudShade, uCloudLit, 0.35 + 0.65 * lit);
    cc += uSunColor * edge * pow(m, 4.0) * 0.6;
    sky = mix(sky, cc, c * smoothstep(-0.02, 0.1, h) * 0.92);
  }
  // 日轮
  float ang = acos(clamp(mu, -1.0, 1.0));
  sky += uSunColor * smoothstep(0.03, 0.022, ang) * uSunDisk;
  gl_FragColor = vec4(sky, 1.0);
}
`,Cf=`
varying vec3 vDir;
void main() {
  vDir = position;
  vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_Position = p.xyww;
}
`;function wf(){return new ao({uniforms:{uSun:{value:new V(0,1,0)},uSunColor:{value:new U},uZenith:{value:new U},uHorizon:{value:new U},uGround:{value:new U},uCloudLit:{value:new U},uCloudShade:{value:new U},uTime:{value:0},uCloud:{value:.4},uSunDisk:{value:40}},vertexShader:Cf,fragmentShader:Sf,side:1,depthWrite:!1,fog:!1})}var Tf=class{scene;sky;sun=new Yo(`#ffffff`,3);hemi=new Mo(`#ffffff`,`#888888`,.8);state=bf(yf.morning);envScene=new Bn;envSky;pmrem;envRT=null;lastEnvKey=``;shadowFocus=new V;shadowRadius=200;constructor(e,t){this.scene=t,this.sky=new W(new Ja(18e3,48,24),wf()),this.sky.renderOrder=-10,this.sky.frustumCulled=!1,t.add(this.sky);let n=this.sun;n.castShadow=!0,n.shadow.mapSize.set(2048,2048),n.shadow.bias=-25e-5,n.shadow.normalBias=.04,n.shadow.radius=2.5,n.shadow.camera.near=10,n.shadow.camera.far=4e3,t.add(n,n.target,this.hemi),t.fog=new zn(`#E8DCCB`,3e-4),this.envSky=new W(new Ja(100,32,16),wf()),this.envScene.add(this.envSky);let r=new W(new Ti(100,32),new Kr({color:`#9C8E84`,side:1}));r.rotation.x=Math.PI/2,r.position.y=-4,this.envScene.add(r),this.pmrem=new Vs(e)}dispose(){this.envRT?.dispose(),this.envRT=null,this.pmrem.dispose(),this.sun.shadow.dispose();for(let e of[this.sky,this.envSky])e.geometry.dispose(),e.material.dispose();this.envScene.traverse(e=>{let t=e;t.isMesh&&(t.geometry.dispose(),t.material.dispose())})}setShadowFocus(e,t){this.shadowFocus.copy(e),this.shadowRadius=2**(Math.ceil(Math.log2(t)*4)/4)}apply(e,t){let n=this.state;Object.assign(n,{sunI:e.sunI,hemiI:e.hemiI,envI:e.envI,fogD:e.fogD,cloud:e.cloud,exposure:e.exposure,lift:e.lift}),n.sun.copy(e.sun);for(let t of[`sunColor`,`zenith`,`horizon`,`ground`,`hemiSky`,`hemiGround`,`fog`,`cloudLit`,`cloudShade`,`warm`])n[t].copy(e[t]);for(let e of[this.sky,this.envSky]){let r=e.material.uniforms;r.uSun.value.copy(n.sun),r.uSunColor.value.copy(n.sunColor),r.uZenith.value.copy(n.zenith),r.uHorizon.value.copy(n.horizon),r.uGround.value.copy(n.ground),r.uCloudLit.value.copy(n.cloudLit),r.uCloudShade.value.copy(n.cloudShade),r.uCloud.value=n.cloud,r.uTime.value=t}this.envSky.material.uniforms.uSunDisk.value=4;let r=this.sun;r.color.copy(n.sunColor),r.intensity=n.sunI*1.32*Math.min(1,Math.max(0,n.sun.y+.04)*6);let i=this.shadowRadius,a=r.shadow.camera;a.left=-i,a.right=i,a.top=i,a.bottom=-i,a.updateProjectionMatrix();let o=2*i/r.shadow.mapSize.x,s=this.shadowFocus,c=new V(Math.round(s.x/o)*o,Math.round(s.y/o)*o,Math.round(s.z/o)*o);r.target.position.copy(c);let l=Math.min(1500,Math.max(80,i*3));r.position.copy(c).addScaledVector(n.sun,l),r.target.updateMatrixWorld(),a.near=Math.max(1,l-i*2.2),a.far=l+i*2.5,a.updateProjectionMatrix();let u=Math.min(1,Math.max(0,(i-60)/140));r.shadow.intensity=.55+.33*u,r.shadow.radius=6-3.5*u,this.hemi.color.copy(n.hemiSky),this.hemi.groundColor.copy(n.hemiGround),this.hemi.intensity=n.hemiI*.7*_f;let d=this.scene.fog;d.color.copy(n.fog),d.density=n.fogD;let f=[n.sun.x,n.sun.y,n.sun.z,n.zenith.r,n.horizon.g,n.sunColor.b,n.cloud].map(e=>Math.round(e/.08)).join();if(f!==this.lastEnvKey){this.lastEnvKey=f;let e=this.envRT;this.envRT=this.pmrem.fromScene(this.envScene,0,.1,1e3,{size:128}),this.scene.environment=this.envRT.texture,e?.dispose()}this.scene.environmentIntensity=n.envI*.78*_f}},Ef={open:.9,per:.075,pause:.35,wet:.45,ring:.03,hold:2.6,close:.8},Df=e=>[...e].length;function Of(e){let{sentence:t,chapters:n,captions:r,duration:i}=e,a=[];return n.forEach((e,o)=>{let s=e.phrases.map(e=>t.findIndex(t=>t.key===e)).filter(e=>e>=0);if(!s.length)return;let c=s.reduce((e,n)=>e+Df(t[n].text)*Ef.per,0)+(s.length-1)*Ef.pause+Ef.wet,l=.3+Math.max(...s.map(e=>Df(t[e].text)))*Ef.ring,u=Ef.open+c+l+Ef.close,d=e.start+3.3,f=o===n.length-1?i-15:e.end-.8,p=u+Math.max(1.2,Math.min(Ef.hold,f-d-u)),m=Math.max(...s.map(e=>t[e].clear))-1,h=d,g=1/0;for(let e=d;e<=Math.max(d,f-p)+1e-6;e+=.1){let t=e+.2,n=e+Ef.open+c,i=r.filter(([e])=>e>t&&e<n).length,a=Math.abs(e-m)+3*i;a<g&&(g=a,h=e)}let _=h+Ef.open;for(let e of s){let n=Df(t[e].text);t[e].ink=_,t[e].ring=_+n*Ef.per+Ef.wet*.6,_+=n*Ef.per+Ef.pause}a.push({chapter:o,open:h,close:h+p,phrases:s})}),a}function kf(e,t){let n=e.script,r=([n,r])=>{let i=t.find(e=>e.id===n);if(!i)throw Error(`台本里的段 "${n}" 不在 ${e.id} 里`);return i.start+r},i=t[t.length-1].end,a=n.chapters.map(e=>r([e.from,0])),o=n.sentence.map(e=>({key:e.key,text:e.text,clear:r(e.clear),ink:r(e.clear),ring:r(e.clear)+1})),s={line:e.id,name:e.name,duration:i,cover:n.cover,ending:n.ending,source:n.source,sentence:o,chapters:n.chapters.map((e,t)=>({num:e.num,title:e.title,seal:e.seal,start:a[t],end:t+1<a.length?a[t+1]:i,phrases:e.phrases,card:e.card??e.phrases.map(e=>n.sentence.find(t=>t.key===e).text).join(``)})),captions:n.captions.map(([e,t,n,i])=>[r([e,t]),r([e,n]),i])};return{...s,moments:Of(s)}}var Af={R:3.8,N:7,NS:72,NV:20,ALPHA_C:Math.PI/4,TH0:1,TH1:.34,GAP:.03},{R:jf,N:Mf,NS:Nf,NV:Pf,ALPHA_C:Ff,TH0:If,TH1:Lf,GAP:Rf}=Af,zf=Math.PI*2/Mf,Bf=zf/2,Vf=Pf/2,Hf=Pf+3,Uf=Math.ceil(Ff/Math.PI*Nf),Wf=.42,Gf=class{cut=new Float32Array(Mf);open=new Float32Array(Mf);cap=0;scrape=new Float32Array(Mf);hub=0;dry=0;soak=0;fold=0;press=0;shrink=0;copy(e){return this.cut.set(e.cut),this.open.set(e.open),this.scrape.set(e.scrape),this.fold=e.fold,this.cap=e.cap,this.hub=e.hub,this.dry=e.dry,this.soak=e.soak,this.press=e.press,this.shrink=e.shrink,this}key(){return[...this.cut,...this.open,...this.scrape,this.fold,this.cap,this.hub,this.dry,this.soak,this.press,this.shrink].map(e=>e.toFixed(4)).join(`,`)}},Kf=e=>Math.abs(e)<1e-4?1-e*e/6:Math.sin(e)/e,qf=e=>Math.abs(e)<1e-4?e/2:(1-Math.cos(e))/e;function Jf(e){let t=e=>new U(e);return kd({roughness:.6,metalness:0,sheen:1,sheenRoughness:.5,sheenColor:new U(`#ffffff`),clearcoat:1,clearcoatRoughness:.28},{uniforms:{uBlanch:{value:0},uWetGloss:{value:0},uDry:{value:0},uSoak:{value:0},uProduct:{value:0},uFuzz:{value:1},uPress:{value:0},uSeed:{value:e},cSkin0:{value:t(Md.skin[0])},cSkin1:{value:t(Md.skin[1])},cSkin2:{value:t(Md.skin[2])},cBl0:{value:t(Md.blanch[0])},cBl1:{value:t(Md.blanch[1])},cBl2:{value:t(Md.blanch[2])},cPith0:{value:t(Md.pith[0])},cPith1:{value:t(Md.pith[1])},cIn0:{value:t(Md.inner[0])},cIn1:{value:t(Md.inner[1])},cOil:{value:t(Md.oil)},cDry0:{value:t(Md.dried[0])},cDry1:{value:t(Md.dried[1])},cDry2:{value:t(Md.dried[2])},cDryIn:{value:t(Md.driedInner)},cProd0:{value:t(Md.product[0])},cProd1:{value:t(Md.product[1])},cProd2:{value:t(Md.product[2])},cProdIn:{value:t(Md.productInner)},cFuzz:{value:t(`#E9EDDA`)}},attributes:`attribute vec4 aRest; attribute vec4 aInfo;`,varyings:`varying vec3 vRest; varying vec4 vInfo;`,vertex:`vRest = aRest.xyz; vInfo = aInfo;`,color:`
        vec3 rp = vRest;
        float surf = vInfo.x;
        float scr = vInfo.w;
        float mott = snoise(rp * 2.6 + uSeed) * 0.45 + snoise(rp * 7.3 + uSeed * 2.0) * 0.18;
        float outerMask = 0.0;
        vec3 col;
        float bump = 0.0;
        float wetN = snoise(rp * 4.2 + 11.0 + uSeed) * 0.5 + 0.5;
        float wet = smoothstep(wetN, wetN + 0.3, uSoak * 1.3);
        if (surf < 0.5) {
          outerMask = 1.0;
          vec3 gl = voronoi3(rp * 40.0 + uSeed);
          // 油点、细绒都比像素细的时候淡成平均色（不然远看会闪）
          float aaG = aaFade3(rp * 40.0);
          float gland = mix(0.12, 1.0 - smoothstep(0.1, 0.36, gl.x), aaG);
          float lo = smoothstep(-0.8, 0.25, mott);
          float hi = smoothstep(0.3, 1.0, mott);
          vec3 fresh = mix(mix(cSkin0, cSkin1, lo), cSkin2, hi * 0.55);
          vec3 bl = mix(mix(cBl0, cBl1, lo), cBl2, hi * 0.5);
          col = mix(fresh, bl, uBlanch);
          vec3 dr = mix(mix(cDry0, cDry1, lo), cDry2, hi * 0.45);
          col = mix(col, dr, uDry);
          vec3 pr = mix(mix(cProd0, cProd1, lo), cProd2, hi * 0.45);
          col = mix(col, pr, uProduct);
          col = mix(col, col * mix(1.16, 0.84, uDry), gland * 0.5);
          float hair = mix(0.2, step(0.8, hash13(floor(rp * 460.0))), aaFade3(rp * 460.0));
          col = mix(col, cFuzz, hair * 0.1 * uFuzz);
          float apex = 1.0 - smoothstep(0.035, 0.065, length(rp - vec3(0.0, 1.0, 0.0)));
          col = mix(col, vec3(0.36, 0.3, 0.17), apex * 0.85);
          bump = -gland * 0.018 + mott * 0.008;
          // 烫完挂着的水珠
          vec3 dv = voronoi3(rp * 13.0 + 5.0);
          float dropR = 0.16 + 0.12 * dv.z;
          float drop = max(0.0, dropR * dropR - dv.x * dv.x);
          bump += sqrt(drop) * 0.35 * uWetGloss * step(0.45, dv.z);
        } else if (surf < 1.5) {
          float sp = fbm3(rp * 22.0);
          vec3 pith = mix(cPith0, cPith1, 0.55 + 0.45 * sp);
          vec3 vo = voronoi3(rp * 70.0);
          pith *= 1.0 - mix(0.04, 1.0 - smoothstep(0.05, 0.22, vo.x), aaFade3(rp * 70.0)) * 0.07;
          vec3 inn = mix(cIn0, cIn1, 0.5 + 0.5 * snoise(rp * 6.0));
          float oilDot = mix(0.06, 1.0 - smoothstep(0.09, 0.19, voronoi3(rp * 30.0 + 3.0).x), aaFade3(rp * 30.0));
          inn = mix(inn, cOil, oilDot * smoothstep(0.55, 1.0, scr) * 0.85);
          col = mix(pith, inn, scr);
          vec3 dri = cDryIn * (0.88 + 0.16 * snoise(rp * 5.0));
          dri = mix(dri, dri * 0.82, oilDot * 0.6);
          col = mix(col, dri, uDry);
          vec3 pri = cProdIn * (0.92 + 0.1 * snoise(rp * 5.0));
          pri = mix(pri, pri * 0.88, oilDot * 0.5);
          col = mix(col, pri, uProduct);
          bump = sp * mix(0.05, 0.012, scr);
        } else {
          float d = vInfo.y;
          vec3 rim = mix(mix(cSkin0, cBl0, uBlanch), cDry0, uDry);
          rim = mix(rim, cProd0, uProduct);
          vec3 pth = mix(cPith1, cIn1, scr);
          pth = mix(pth, cDryIn, uDry);
          pth = mix(pth, cProdIn, uProduct);
          float rimW = mix(0.12, 0.3, scr);
          col = mix(rim, pth, smoothstep(rimW * 0.6, rimW, d));
          bump = 0.0;
        }
        col *= mix(1.0, 0.68, wet * (1.0 - uPress * 0.6));
        diffuseColor.rgb = col;
        procBump = bump;
      `,rough:`
        float rOuter = mix(mix(0.6, 0.32, uWetGloss), 0.78, uDry);
        rOuter = mix(rOuter, 0.82, uProduct);
        float rr = surf < 0.5 ? rOuter : mix(0.92, 0.8, scr);
        roughnessFactor = mix(rr, 0.42, wet * 0.8);
      `,physical:`
        #ifdef USE_SHEEN
          material.sheenColor = cFuzz * uFuzz * outerMask * 0.38;
          material.sheenRoughness = 0.7;
        #endif
        #ifdef USE_CLEARCOAT
          material.clearcoat = outerMask * uWetGloss * 0.75 + wet * 0.25;
          material.clearcoatRoughness = 0.26;
        #endif
      `,bump:!0})}function Yf(e=0){return Jf(e)}function Xf(e,t){let n=e.userData.proc.uniforms;t.blanch!==void 0&&(n.uBlanch.value=t.blanch),t.wetGloss!==void 0&&(n.uWetGloss.value=t.wetGloss),t.dry!==void 0&&(n.uDry.value=t.dry),t.soak!==void 0&&(n.uSoak.value=t.soak),t.product!==void 0&&(n.uProduct.value=t.product),t.fuzz!==void 0&&(n.uFuzz.value=t.fuzz),t.press!==void 0&&(n.uPress.value=t.press)}function Zf(e,t){let n=e.userData.proc.uniforms,r=t.userData.proc.uniforms;for(let e of[`uBlanch`,`uWetGloss`,`uDry`,`uSoak`,`uProduct`,`uFuzz`,`uPress`])n[e].value=r[e].value}function Qf(e=jf){let t=new Ja(e,48,32),n=t.attributes.position,r=new Float32Array(n.count*4),i=new Float32Array(n.count*4);for(let t=0;t<n.count;t++)r[t*4]=n.getX(t)/e,r[t*4+1]=n.getY(t)/e,r[t*4+2]=n.getZ(t)/e;return t.setAttribute(`aRest`,new yr(r,4)),t.setAttribute(`aInfo`,new yr(i,4)),t}var $f=new V,ep=new V,tp=zf/4,np=new V(Math.cos(tp),0,Math.sin(tp)),rp=2*Lf*.7*.9+.06;function ip(e,t,n,r=Mf,i=zf,a=Bf){let o=Math.hypot(e,t),s=jf*Ff*n;if(o<s)return o-s;let c=Math.atan2(t,e),l=1/0;for(let e=0;e<r;e++){let t=c-e*i;t-=Math.round(t/(Math.PI*2))*Math.PI*2;let r=o*Math.cos(t);if(r<=0)continue;let s=Math.abs(o*Math.sin(t)),u=r/(jf*n),d=s-jf*Math.sin(Math.min(u,Math.PI))*a*n;u>Math.PI&&(d=Math.max(d,r-Math.PI*jf*n)),l=Math.min(l,d)}return l}function ap(e,t){return(Math.sin(e*1.3+t*.7)*Math.sin(t*1.1-e*.4+1.7)+.5*Math.sin(e*2.9-t*2.3+.4)+1.5)/3}function op(e,t,n,r){let i=e[t],a=e[t+1],o=e[t+2],s=-n.fz,c=n.fx,l=i*s+o*c-n.c;if(l<=0)return;let u=i*n.fx+o*n.fz,d=Math.max(n.ya-a,.005),f=n.rn*n.phi,p,m,h;if(l<f)p=l/n.rn,m=d*Math.sin(p),h=n.ya-d*Math.cos(p);else{p=n.phi;let e=l-f;m=d*Math.sin(p)+e*Math.cos(p),h=n.ya-d*Math.cos(p)+e*Math.sin(p)}let g=u*n.fx+(n.c+m)*s,_=u*n.fz+(n.c+m)*c;if(n.press>0&&n.drop>0&&l>=f&&(h-=n.drop*n.press*J(0,.45,ip(g,_,n.sc,n.n,n.dth,n.half))),e[t]=g,e[t+1]=h,e[t+2]=_,r){let e=r[t],i=r[t+1],a=r[t+2],o=e*n.fx+a*n.fz,l=e*s+a*c,u=Math.cos(p),d=Math.sin(p),f=l*u-i*d,m=l*d+i*u;r[t]=o*n.fx+f*s,r[t+1]=m,r[t+2]=o*n.fz+f*c}}var sp=class{group=new H;mesh;pulp;geometry=new Pr;material;state=new Gf;lastKey=``;O;In;Nm;TH;LAT;SCR;pos;nrm;info;wallStart=0;n;dth;half;tipFold;foldDir;constructor(e,t=Mf){this.material=e??Jf(0),this.n=t,this.dth=Math.PI*2/t,this.half=this.dth/2,this.tipFold=t!==7,this.foldDir=new V(Math.cos(this.dth/4),0,Math.sin(this.dth/4));let n=this.n*(Nf+1)*Hf;this.O=new Float32Array(n*3),this.In=new Float32Array(n*3),this.Nm=new Float32Array(n*3),this.TH=new Float32Array(n),this.LAT=new Float32Array(n),this.SCR=new Float32Array(this.n*(Nf+1));let r=this.n*(Nf+1)*(Pf+1),i=Nf-Uf+1,a=this.n*2*i*2,o=r*2+a;this.wallStart=r*2,this.pos=new yr(new Float32Array(o*3),3).setUsage(Je),this.nrm=new yr(new Float32Array(o*3),3).setUsage(Je),this.info=new yr(new Float32Array(o*4),4).setUsage(Je);let s=new Float32Array(o*4),c=[],l=(e,t,n)=>(e*(Nf+1)+t)*(Pf+1)+n,u=(e,t,n)=>r+l(e,t,n),d=(e,t,n,r)=>this.wallStart+((e*2+t)*i+n)*2+r,f=(e,t,n,r)=>{let i=e*this.dth+n*this.half;s[r]=Math.sin(t)*Math.cos(i),s[r+1]=-Math.cos(t),s[r+2]=Math.sin(t)*Math.sin(i),s[r+3]=e},p=this.info.array;for(let e=0;e<this.n;e++){for(let t=0;t<=Nf;t++){let n=Math.PI*t/Nf;for(let r=0;r<=Pf;r++){let i=-1+2*r/Pf,a=l(e,t,r),o=u(e,t,r);f(e,n,i,a*4),f(e,n,i,o*4),p[a*4]=0,p[o*4]=1,p[a*4+2]=t/Nf,p[o*4+2]=t/Nf}}for(let t=0;t<Nf;t++)for(let n=0;n<Pf;n++){let r=l(e,t,n),i=l(e,t+1,n),a=l(e,t,n+1),o=l(e,t+1,n+1);c.push(r,i,a,i,o,a);let s=u(e,t,n),d=u(e,t+1,n),f=u(e,t,n+1),p=u(e,t+1,n+1);c.push(s,f,d,d,f,p)}for(let t=0;t<2;t++){let n=t===0?-1:1;for(let r=0;r<i;r++){let i=Uf+r,a=Math.PI*i/Nf;for(let o=0;o<2;o++){let s=d(e,t,r,o);f(e,a,n,s*4),p[s*4]=2,p[s*4+1]=o,p[s*4+2]=i/Nf}}for(let n=0;n<i-1;n++){let r=d(e,t,n,0),i=d(e,t,n,1),a=d(e,t,n+1,0),o=d(e,t,n+1,1);t===0?c.push(r,i,a,i,o,a):c.push(r,a,i,i,a,o)}}}let m=this.geometry;m.setAttribute(`position`,this.pos),m.setAttribute(`normal`,this.nrm),m.setAttribute(`aRest`,new yr(s,4)),m.setAttribute(`aInfo`,this.info),m.setIndex(c),this.mesh=new W(m,this.material),this.mesh.castShadow=!0,this.mesh.receiveShadow=!0,this.mesh.frustumCulled=!1,this.group.add(this.mesh);let h=jf-If-.04,g=new Ja(h,40,28),_=g.attributes.position;for(let e=0;e<_.count;e++){$f.fromBufferAttribute(_,e);let t=Math.atan2($f.z,$f.x),n=1-.045*(1-Math.abs(Math.cos(t*6.5)))**6*Math.sqrt(Math.max(0,1-($f.y/h)**2));$f.multiplyScalar(n),_.setXYZ(e,$f.x,$f.y,$f.z)}g.computeVertexNormals(),this.pulp=new W(g,cp()),this.pulp.position.set(0,jf,0),this.pulp.castShadow=!0,this.pulp.receiveShadow=!0,this.group.add(this.pulp),this.update()}idx3(e,t,n){return((e*(Nf+1)+t)*Hf+n)*3}seamPoint(e,t,n,r=0){let i=e*this.dth+this.half,a=jf-r;return n.set(a*Math.sin(t)*Math.cos(i),jf-a*Math.cos(t),a*Math.sin(t)*Math.sin(i))}innerCenter(e,t,n,r){let i=Math.round(Iu(t/Math.PI)*Nf),a=this.idx3(e,i,Vf+1);return n.set(this.In[a],this.In[a+1],this.In[a+2]),r&&r.set(-this.Nm[a],-this.Nm[a+1],-this.Nm[a+2]),n}outerCenter(e,t,n){let r=Math.round(Iu(t/Math.PI)*Nf),i=this.idx3(e,r,Vf+1);return n.set(this.O[i],this.O[i+1],this.O[i+2])}update(){let e=this.state.key();e!==this.lastKey&&(this.lastKey=e,this.build())}build(){let e=this.state,t=this.O,n=this.In,r=this.Nm,i=1-.28*e.shrink,a=e.soak,o=e.dry*(1-a)*(1-e.press),s=(1-.3*e.dry)*(1+.12*e.soak*(1-e.press))*(1-.1*e.press),c=Lf*s,l=q(.35,.03,e.press),u=this.tipFold?J(0,.35,e.fold):0,d=this.tipFold?J(.3,1,e.fold):e.fold,f={phi:Math.PI*d*(.86+.14*e.press),c:0,fx:this.foldDir.x,fz:this.foldDir.z,ya:l+c,rn:l+c/2,sc:i,drop:2*l+c,press:e.press*d,n:this.n,dth:this.dth,half:this.half},p=.14*e.dry*(1-.75*e.press),m=new Float32Array(Nf+1),h=new Float32Array(Nf+1),g=new Float32Array(Nf+1);for(let a=0;a<this.n;a++){let l=a*this.dth,d=Math.cos(l),_=Math.sin(l),v=-Math.sin(l),y=Math.cos(l),b=e.open[a],x=(a+this.n-1)%this.n,S=0,C=0,w=0,T=t=>{if(t<=Ff)return(1-e.cap)/jf;let n=o*J(Math.PI*.55,Math.PI,t)*(.9/jf);return(1-b)/jf+n},E=T(0);m[0]=0,h[0]=0,g[0]=0;for(let e=1;e<=Nf;e++){let t=Math.PI*(e-1)/Nf,n=Math.PI*e/Nf,r=T(n),i=.5*(E+r);E=r;let a=jf*(n-t),o=S+i*a;Math.abs(i)<1e-6?(C+=Math.cos(S)*a,w+=Math.sin(S)*a):(C+=(Math.sin(o)-Math.sin(S))/i,w+=(Math.cos(S)-Math.cos(o))/i),S=o,m[e]=S,h[e]=C,g[e]=w}let D=t=>Math.PI-(Math.PI-Ff)*e.cut[t],O=D(a),k=D(x),A=(e,t,n)=>n<=0?0:Rf*(J(t-.02,t+.12,e)*J(Ff-.01,Ff+.2,e))*(.6+.8*(e-Ff)/(Math.PI-Ff))*(1-b*.7),j=e.scrape[a];for(let t=0;t<=Nf;t++){let n=Math.PI*t/Nf,r=q(Ff*.85,Math.PI+.25,j),i=j>0?J(r+.05,r-.2,n)*J(Ff,Ff+.12,n):0;i=Math.max(i,e.hub*(1-J(Ff+.02,Ff+.2,n))),this.SCR[a*(Nf+1)+t]=i}for(let n=0;n<=Nf;n++){let r=Math.PI*n/Nf,c=m[n],l=Math.cos(c),u=Math.sin(c),f=-u*d,p=l,S=-u*_,C=h[n]*d,w=g[n],T=h[n]*_,E=h[n],D=jf*Math.sin(r),j=J(Ff-.05,Ff+.3,r),ee=o*.42/Math.max(D*this.half,.35),te=q(J(.75,1,b),b,J(Ff,Ff+.6,r)),M=(1-te)/Math.max(D,1e-4)+ee*J(Ff,Ff+.4,r),ne=q(-d,f,te),N=q(0,p,te),re=q(-_,S,te),ie=Math.hypot(ne,N,re)||1;ne/=ie,N/=ie,re/=ie;let ae=A(r,O,e.cut[a]),oe=A(r,k,e.cut[x]),se=this.SCR[a*(Nf+1)+n],ce=q(If,Lf,se)*s;for(let e=0;e<Hf;e++){let r=-1+2*(e-1)/Pf,o=r*(this.half-(r>0?ae:oe)),s=Math.sin(o),c=Math.cos(o)-1,l=C+E*(s*v+c*d),u=w,f=T+E*(s*y+c*_),p=D*o,m=p*M,h=p*Kf(m),g=p*qf(m),b=C+h*v+g*ne,x=w+g*N,S=T+h*y+g*re,O=this.idx3(a,n,e);t[O]=q(l,b,j)*i,t[O+1]=q(u,x,j)*i,t[O+2]=q(f,S,j)*i,this.TH[O/3]=ce,this.LAT[O/3]=Math.abs(p)*i}}for(let e=0;e<=Nf;e++)for(let n=1;n<=Pf+1;n++){let i=this.idx3(a,e,n),o=this.idx3(a,Math.min(Nf,e+1),n),s=this.idx3(a,Math.max(0,e-1),n),c=this.idx3(a,e,n+1),l=this.idx3(a,e,n-1),u=t[o]-t[s],d=t[o+1]-t[s+1],f=t[o+2]-t[s+2],p=t[c]-t[l],m=t[c+1]-t[l+1],h=t[c+2]-t[l+2],g=d*h-f*m,_=f*p-u*h,v=u*m-d*p,y=Math.hypot(g,_,v);if(y<1e-9){let t=e>0?this.idx3(a,e-1,n):-1;t>=0&&r[t]*r[t]+r[t+1]*r[t+1]+r[t+2]*r[t+2]>.5?(g=r[t],_=r[t+1],v=r[t+2]):(g=0,_=e>0?1:-1,v=0)}else g/=y,_/=y,v/=y;r[i]=g,r[i+1]=_,r[i+2]=v}for(let e=1;e<=Pf+1;e++){let t=this.idx3(a,0,e);r[t]=0,r[t+1]=-1,r[t+2]=0;let n=this.idx3(a,Nf,e),i=this.idx3(a,Nf-1,e);r[n]=r[i],r[n+1]=r[i+1],r[n+2]=r[i+2]}for(let e=0;e<=Nf;e++)for(let i=1;i<=Pf+1;i++){let o=this.idx3(a,e,i),s=this.TH[o/3];n[o]=t[o]-r[o]*s,n[o+1]=t[o+1]-r[o+1]*s,n[o+2]=t[o+2]-r[o+2]*s}if(u>0){let o={phi:Math.PI*u*(.9+.1*e.press),fx:Math.sin(l),fz:-Math.cos(l),c:(Math.PI*jf-Wf)*i,ya:q(.12,.02,e.press)+c,rn:q(.12,.02,e.press)+c/2,sc:i,drop:0,press:0,n:this.n,dth:this.dth,half:this.half};for(let e=0;e<=Nf;e++)for(let i=1;i<=Pf+1;i++){let s=this.idx3(a,e,i);op(t,s,o,r),op(n,s,o,null)}}if(f.phi>0)for(let e=0;e<=Nf;e++)for(let i=1;i<=Pf+1;i++){let o=this.idx3(a,e,i);op(t,o,f,r),op(n,o,f,null)}if(p>0)for(let e=0;e<=Nf;e++)for(let r=1;r<=Pf+1;r++){let i=this.idx3(a,e,r),o=p*ap(t[i],t[i+2]);t[i+1]+=o,n[i+1]+=o}}let _=this.pos.array,v=this.nrm.array,y=this.info.array,b=this.n*(Nf+1)*(Pf+1);for(let e=0;e<this.n;e++)for(let i=0;i<=Nf;i++){let a=this.SCR[e*(Nf+1)+i];for(let o=0;o<=Pf;o++){let s=this.idx3(e,i,o+1),c=(e*(Nf+1)+i)*(Pf+1)+o,l=b+c;_[c*3]=t[s],_[c*3+1]=t[s+1],_[c*3+2]=t[s+2],v[c*3]=r[s],v[c*3+1]=r[s+1],v[c*3+2]=r[s+2],_[l*3]=n[s],_[l*3+1]=n[s+1],_[l*3+2]=n[s+2],v[l*3]=-r[s],v[l*3+1]=-r[s+1],v[l*3+2]=-r[s+2],y[c*4+3]=a,y[l*4+3]=a}}let x=Nf-Uf+1;for(let e=0;e<this.n;e++)for(let i=0;i<2;i++){let a=i===0?1:Pf+1,o=i===0?2:Pf;for(let s=0;s<x;s++){let c=Uf+s,l=this.idx3(e,c,a),u=this.idx3(e,c,o);$f.set(t[l]-t[u],t[l+1]-t[u+1],t[l+2]-t[u+2]),ep.set(r[l],r[l+1],r[l+2]),$f.addScaledVector(ep,-$f.dot(ep)),$f.lengthSq()<1e-12&&$f.copy(ep),$f.normalize();let d=this.SCR[e*(Nf+1)+c];for(let r=0;r<2;r++){let a=this.wallStart+((e*2+i)*x+s)*2+r,o=r?n:t;_[a*3]=o[l],_[a*3+1]=o[l+1],_[a*3+2]=o[l+2],v[a*3]=$f.x,v[a*3+1]=$f.y,v[a*3+2]=$f.z,y[a*4+3]=d}}}this.pos.needsUpdate=!0,this.nrm.needsUpdate=!0,this.info.needsUpdate=!0}snapshot(){let e=new Pr;for(let t of[`position`,`normal`,`aRest`,`aInfo`])e.setAttribute(t,this.geometry.attributes[t].clone());return e.setIndex(this.geometry.index.clone()),e.computeBoundingSphere(),e}};function cp(){return kd({roughness:.45,metalness:0,sheen:.6,sheenColor:new U(`#FFF6DA`),sheenRoughness:.4},{uniforms:{uPulp:{value:new U(Md.pulp)},uPith:{value:new U(Md.pith[1])}},color:`
        vec3 p = normalize(vPos);
        float az = atan(p.z, p.x);
        float seg = abs(cos(az * 6.5));
        float mem = 1.0 - smoothstep(0.0, 0.16, seg);
        float vesicle = voronoi3(vPos * 3.2).x;
        vec3 col = uPulp * (0.9 + 0.12 * smoothstep(0.1, 0.5, vesicle));
        col = mix(col, uPith, mem * 0.85);
        float fluff = fbm3(vPos * 2.2) * 0.5 + 0.5;
        col = mix(col, uPith, smoothstep(0.55, 0.8, fluff) * 0.5);
        diffuseColor.rgb = col;
        procBump = (1.0 - smoothstep(0.1, 0.45, vesicle)) * 0.03 - mem * 0.05;
      `,emissive:`totalEmissiveRadiance += diffuseColor.rgb * 0.05;`,bump:!0})}var lp=Af.R,up=e=>e*Math.PI/180,dp=(()=>{let e=lp+.06,t=8*Math.cos(up(30))*2/3,n=e+6.5,r=[];for(let e of[60,180,300])r.push(new V(Math.cos(up(e))*t,n,Math.sin(up(e))*t));r.push(new V(0,e,0));for(let t=0;t<6;t++){let n=up(30+60*t);r.push(new V(Math.cos(n)*8,e,Math.sin(n)*8))}return r})(),fp=[1,6,7,0,2,3,5,8,4,9];(()=>{let e=Vu(29),t=()=>new z((e()-.5)*1.2,(e()-.5)*1.2),n=[new z(0,0)];for(let e=0;e<6;e++)n.push(new z(Math.cos(up(60*e+8))*9,Math.sin(up(60*e+8))*9).add(t()));for(let e of[38,158,278])n.push(new z(Math.cos(up(e))*17.5,Math.sin(up(e))*17.5).add(t()));return n})();var pp={4:[45,135,225,315].map(e=>new V(Math.cos(up(e))*5.4,4.8,Math.sin(up(e))*5.4)),3:[90,210,330].map(e=>new V(Math.cos(up(e))*4.6,4.6,Math.sin(up(e))*4.6))};function mp(e){let t=Math.PI*2/e/4,n=[];for(let e of[1,-1])for(let r=0;r<5;r++){let i=e>0?r%2==0:r%2==1,a=e>0?i?9.6:8.8:i?-8.8:-9.6;n.push({x:(r-2)*9.6,z:a,yaw:i?t+Math.PI:t})}let r=n.findIndex(e=>e.x===0&&e.z>0),[i]=n.splice(r,1);return[i,...n]}mp(Af.N);var hp=(()=>{let e=Vu(8),t=[{x:0,z:0,rot:.3}];for(let n=0;n<9;n++){let r=up(20+40*n);t.push({x:Math.cos(r)*35,z:Math.sin(r)*35,rot:e()*Math.PI*2})}return t})(),gp=class{count=10;group=new H;fruits;fruitMat;fruitRot=[];pieces=[];dummy=new jn;constructor(e){this.fruitMat=Yf(4),this.fruits=new hi(Qf(lp),this.fruitMat,9),this.fruits.castShadow=!0,this.fruits.receiveShadow=!0,this.fruits.frustumCulled=!1,this.group.add(this.fruits);let t=Vu(17);for(let n=0;n<9;n++){this.fruitRot.push(new B().setFromAxisAngle(new V(t()-.5,t()-.5,t()-.5).normalize(),t()*Math.PI*2));let r=new W(e,Yf(10+n*7));r.castShadow=!0,r.receiveShadow=!0,r.frustumCulled=!1,r.visible=!1,this.pieces.push(r),this.group.add(r)}}setFruit(e,t,n){let r=this.dummy;r.position.copy(t),r.quaternion.copy(n),r.scale.setScalar(1),r.updateMatrix(),this.fruits.setMatrixAt(e-1,r.matrix)}rot(e){return this.fruitRot[e-1]}show(e){this.showFruits(e)}showFruits(e){this.fruits.visible=e,this.fruits.instanceMatrix.needsUpdate=!0}setPiece(e,t,n,r){let i=this.pieces[e-1];i.geometry!==t&&(i.geometry=t),i.position.copy(n),i.rotation.set(0,r,0),i.visible=!0}hidePieces(){for(let e of this.pieces)e.visible=!1}syncLook(e){Zf(this.fruitMat,e);for(let t of this.pieces)Zf(t.material,e)}},_p={uTime:{value:0},uSunDir:{value:new V(0,1,0)},uSunCol:{value:new U(`#ffffff`)},uWind:{value:1}},vp=e=>new U(e),yp=e=>e===`x`?`p.xyz`:e===`y`?`p.yxz`:`p.zxy`;function bp(e={}){return Od({roughness:e.rough??.74,metalness:0},{uniforms:{uLight:{value:vp(e.light??`#9A7253`)},uDark:{value:vp(e.dark??`#5A4030`)},uRing:{value:e.ring??1.6},uSeed:{value:e.seed??0},uWorn:{value:e.worn??.3},uScale:{value:e.scale??1},uPlank:{value:e.plank??0}},color:`
        vec3 p = vPos * uScale;
        vec3 g = ${yp(e.axis??`x`)};
        // 木板：沿 g.z 方向分成几块，每块自己的纹理和深浅
        float pk = uPlank > 0.0 ? floor(g.z / uPlank) : 0.0;
        float pf = uPlank > 0.0 ? fract(g.z / uPlank) : 0.5;
        float ps = hash11(pk * 3.7 + uSeed * 11.0);
        vec3 q = g + vec3(ps * 300.0, 0.0, ps * 50.0);
        float warp = snoise(vec3(q.x * 0.012, q.y * 0.2, q.z * 0.2)) * 0.9 + snoise(vec3(q.x * 0.003, 0.0, q.z * 0.05)) * 1.6;
        float r = length(vec2(q.y + 18.0 + ps * 25.0, (pf - 0.5) * max(uPlank, 12.0) * 0.8 + ps * 6.0)) * uRing + warp;
        float ring = fract(r);
        float late = smoothstep(0.62, 0.9, ring) * (1.0 - smoothstep(0.94, 1.0, ring));
        float fiber = snoise(vec3(q.x * 0.035, q.y * 4.0, q.z * 4.0)) * 0.5 + 0.5;
        float blot = fbm3(p * 0.025 + uSeed) * 0.5 + 0.5;
        vec3 col = mix(uLight, uDark, clamp(late * 0.42 + fiber * 0.18, 0.0, 1.0));
        col *= 0.86 + 0.26 * ps;
        col = mix(col, col * vec3(0.78, 0.76, 0.74), (1.0 - blot) * uWorn);
        float seam = uPlank > 0.0 ? 1.0 - smoothstep(0.0, 0.25 / uPlank, min(pf, 1.0 - pf)) : 0.0;
        col *= 1.0 - seam * 0.65;
        diffuseColor.rgb = col;
        procBump = -late * 0.012 + fiber * 0.006 - seam * 0.25;
      `,rough:`roughnessFactor = clamp(roughnessFactor + late * 0.06 - blot * 0.1, 0.3, 1.0);`,bump:!0})}function xp(e={}){return Od({roughness:.9,metalness:0},{uniforms:{uBrick:{value:vp(e.brick??`#A65A40`)},uBrick2:{value:vp(`#7E4636`)},uMortar:{value:vp(e.mortar??`#B9AD98`)},uPlaster:{value:vp(`#E6DCCB`)},uTop:{value:+!!e.plasterTop},uSoot:{value:e.soot??new Qt(0,-999,0,1)},uWash:{value:e.whitewash??0}},color:`
        vec3 n = normalize(vNrm);
        vec3 p = vPos;
        vec2 uv = abs(n.x) > 0.5 ? vec2(p.z, p.y) : (abs(n.z) > 0.5 ? vec2(p.x, p.y) : vec2(p.x, p.z));
        vec2 b = uv / vec2(24.0, 6.4);
        float row = floor(b.y);
        b.x += mod(row, 2.0) * 0.5;
        vec2 cell = floor(b);
        vec2 f = fract(b);
        vec2 mw = vec2(0.55 / 24.0, 0.55 / 6.4);
        float inside = smoothstep(0.0, mw.x, f.x) * smoothstep(0.0, mw.x, 1.0 - f.x) * smoothstep(0.0, mw.y, f.y) * smoothstep(0.0, mw.y, 1.0 - f.y);
        // 砖缝只有半厘米宽：一个像素比砖缝还宽的时候（远看）砖缝淡成平均色，不然一闪一闪。
        // 但淡下去不等于消失——留 20% 的暗线，远看才有一张砖墙的网，不然整面就是一块平色
        vec2 uvw = fwidth(uv);
        float maa = 1.0 - smoothstep(0.25, 0.7, max(uvw.x, uvw.y));
        float mortar = mix(0.20, 1.0 - inside, maa);
        float h = hash12(cell);
        float tex = snoise(vec3(uv * 0.45, h * 10.0)) * 0.5 + 0.5;
        // 一块砖一个深浅（0.70~1.30）：远处砖缝糊掉以后，墙面的层次全靠这个
        vec3 bc = uBrick * (0.70 + 0.60 * h) * (0.9 + 0.18 * tex);
        bc = mix(bc, uBrick2, step(0.72, hash12(cell + 3.1)) * 0.75);
        // 缝在远处当暗线（凹进去的阴影），走近了才看见灰浆本色
        vec3 mc = uMortar * (0.9 + 0.1 * tex);
        mc = mix(mc * 0.62, mc, maa);
        vec3 col = mix(bc, mc, mortar);
        // 白灰：整面薄薄刷一层，再按"这块砖新不新"整块剥落，缝里先露砖。
        // 不用原来那种半米大的随机斑——那看着就是一块白一块砖，不均匀
        float peel = hash12(cell + 5.3);
        float nz = fbm3(vWPos * 0.11) * 0.5 + 0.5;
        float wash = uWash * clamp(1.15 - peel * 0.60 - (1.0 - inside) * 0.30 + nz * 0.22, 0.0, 1.0);
        col = mix(col, uPlaster * (0.88 + 0.14 * nz), wash);
        // 墙根：地面积灰、溅水，越靠下越暗，墙才有"落地"的重量
        if (uTop < 0.5) col *= mix(0.74, 1.0, smoothstep(0.0, 70.0, vWPos.y));
        procBump = (-mortar * 0.38 * maa + tex * 0.09) * (1.0 - wash);
        if (uTop > 0.5 && vWNrm.y > 0.5) {
          float pn = fbm3(vWPos * 0.06) * 0.5 + 0.5;
          col = uPlaster * (0.80 + 0.20 * pn);
          procBump = pn * 0.05;
        }
        float sd = length(vWPos - uSoot.xyz) / uSoot.w;
        float soot = (1.0 - smoothstep(0.2, 1.0, sd + snoise(vPos * 0.08) * 0.2));
        col = mix(col, vec3(0.06, 0.05, 0.05), soot * 0.88);
        // 天光偏蓝，会把砖的暖调冲淡：整体往暖里推一点点，白天不至于发灰
        col *= vec3(1.035, 1.0, 0.955);
        diffuseColor.rgb = col;
      `,bump:!0})}function Sp(e={}){return Od({roughness:.95,metalness:0},{uniforms:{uPlaster:{value:vp(e.color??`#E2D7C4`)},uDamp:{value:vp(e.damp??`#A99C8C`)},uDampH:{value:e.dampH??55}},color:`
        vec3 p = vWPos;
        float n = fbm3(p * 0.01);
        float n2 = fbm3(p * 0.07) * 0.5 + 0.5;
        vec3 col = uPlaster * (0.86 + 0.18 * n2);
        float streak = smoothstep(0.15, 0.7, fbm3(vec3(p.x * 0.035, p.y * 0.004, p.z * 0.035)));
        col = mix(col, col * vec3(0.86, 0.83, 0.79), streak * 0.55);
        float patchy = smoothstep(0.35, 0.6, fbm3(p * 0.006 + 2.0));
        col = mix(col, col * vec3(0.9, 0.88, 0.86), patchy * 0.5);
        float damp = 1.0 - smoothstep(uDampH * 0.3, uDampH, p.y + n * 25.0);
        col = mix(col, uDamp, damp * 0.55);
        diffuseColor.rgb = col;
        procBump = n2 * 0.06 - streak * 0.02;
      `,bump:!0})}function Cp(){return Od({roughness:.92,metalness:0},{uniforms:{uCement:{value:vp(`#9C9488`)}},color:`
        vec2 p = vWPos.xz;
        float n = fbm2(p * 0.008);
        float n2 = fbm2(p * 0.09);
        vec3 col = uCement * (0.8 + 0.32 * n) * (0.94 + 0.1 * n2);
        vec2 g = abs(fract(p / 160.0 + 0.5) - 0.5) * 160.0;
        float joint = 1.0 - smoothstep(0.25, 0.9, min(g.x, g.y));
        vec3 v = voronoi2(p * 0.011);
        // 细裂纹、碎石点比像素细的时候（远看）淡掉，不然一闪一闪
        vec2 pw = fwidth(p);
        float px = max(pw.x, pw.y);
        float crack = (1.0 - smoothstep(0.0, 0.018, v.y)) * step(0.55, hash12(vec2(v.z, 1.0))) * smoothstep(0.4, 0.6, fbm2(p * 0.02)) * (1.0 - smoothstep(1.2, 3.0, px));
        col *= 1.0 - 0.38 * joint - 0.35 * crack;
        float stain = smoothstep(0.55, 0.85, fbm2(p * 0.004 + 3.0));
        col = mix(col, col * vec3(0.78, 0.8, 0.74), stain * 0.6);
        float pebble = mix(0.14, step(0.86, hash12(floor(p * 1.3))), 1.0 - smoothstep(0.17, 0.46, px));
        col *= 1.0 - pebble * 0.08;
        diffuseColor.rgb = col;
        procBump = -joint * 0.25 - crack * 0.12 + n2 * 0.04;
      `,bump:!0})}var wp=`
// 平纹竹编：x 方向和 y 方向的篾条一上一下。返回 (高度, 篾条编号, 空隙, 沿篾条方向的位置)
vec4 weave(vec2 uv, float w, float g) {
  vec2 q = uv / w;
  vec2 cl = floor(q);
  vec2 f = fract(q);
  float over = mod(cl.x + cl.y, 2.0);
  float inX = smoothstep(0.0, g, f.y) * smoothstep(0.0, g, 1.0 - f.y);
  float inY = smoothstep(0.0, g, f.x) * smoothstep(0.0, g, 1.0 - f.x);
  float ax = sin(f.x * 3.14159);
  float ay = sin(f.y * 3.14159);
  float hx = inX * (over > 0.5 ? 0.6 + 0.4 * ax : 0.3 * (1.0 - ax));
  float hy = inY * (over < 0.5 ? 0.6 + 0.4 * ay : 0.3 * (1.0 - ay));
  float h = max(hx, hy);
  float id = hx > hy ? cl.y * 1.37 + 3.0 : cl.x * 2.11 + 50.0;
  float hole = (1.0 - inX) * (1.0 - inY);
  return vec4(h, id, hole, hx > hy ? q.x : q.y);
}
`;function Tp(e={}){let t=e.holes??!1,n=e.mode??`auto`,r=`
    vec2 wuv;
    {
      vec3 n = normalize(vNrm);
      bool flatMode = ${n===`flat`?`true`:n===`cyl`?`false`:`abs(n.y) > 0.6`};
      ${n===`polar`?`flatMode = false;`:``}
      if (${n===`polar`?`true`:`false`}) {
        float rr = length(vPos.xz);
        wuv = vec2(atan(vPos.z, vPos.x) * max(rr, 1.5), rr * 1.1);
      } else if (flatMode) {
        float cr = cos(uRot), sr = sin(uRot);
        wuv = mat2(cr, -sr, sr, cr) * vPos.xz;
      } else {
        wuv = vec2(atan(vPos.z, vPos.x) * uRadius, vPos.y);
      }
    }
    vec4 wv = weave(wuv, uW, ${(e.gap??.16).toFixed(3)});
    // 篾条比像素还细的时候（远看）淡成平均色，孔也不再挖（不然一闪一闪）
    vec2 wfw = fwidth(wuv / uW);
    float waa = 1.0 - smoothstep(0.22, 0.6, max(wfw.x, wfw.y));
    wv.x = mix(0.42, wv.x, waa);
  `,i=t?`${r}\nif (wv.z > 0.5 && waa > 0.5) discard;`:``;return Od({roughness:.68,metalness:0,side:2},{uniforms:{uBamboo:{value:vp(e.color??jd.bamboo)},uBambooDark:{value:vp(e.dark??`#8C6A3E`)},uW:{value:e.w??1.1},uRadius:{value:e.radius??20},uRot:{value:e.rot??.785}},fragmentHead:wp,discard:i,color:`
        ${t?``:r}
        float sv = mix(0.5, hash11(wv.y), waa);
        float fib = mix(0.5, snoise(vec3(wv.w * 6.0, wv.y * 3.0, 0.0)) * 0.5 + 0.5, waa * waa);
        float node = smoothstep(0.92, 1.0, sin(wv.w * 0.9 + wv.y * 5.0) * 0.5 + 0.5);
        vec3 col = uBamboo * (0.8 + 0.32 * sv) * (0.9 + 0.12 * fib);
        col = mix(col, uBambooDark, (1.0 - wv.x) * 0.75 + node * 0.25);
        col *= 0.92 + 0.08 * (fbm3(vPos * 0.08) * 0.5 + 0.5);
        diffuseColor.rgb = col;
        procBump = (wv.x * 0.18 + fib * 0.02) * waa;
      `,bump:!0})}function Ep(e={}){return Od({roughness:.55,metalness:0},{uniforms:{uBamboo:{value:vp(e.color??jd.bamboo)},uNode:{value:e.node??0}},color:`
        vec3 p = vPos;
        vec3 g = ${yp(e.axis??`y`)};
        float fib = snoise(vec3(g.x * 0.05, g.y * 4.0, g.z * 4.0)) * 0.5 + 0.5;
        float node = uNode > 0.0 ? smoothstep(0.035, 0.0, abs(fract(g.x / uNode) - 0.5) - 0.465) : 0.0;
        vec3 col = uBamboo * (0.86 + 0.18 * fib);
        col = mix(col, col * 0.7, node);
        col *= 0.9 + 0.1 * (fbm3(p * 0.1) * 0.5 + 0.5);
        diffuseColor.rgb = col;
        procBump = fib * 0.01 + node * 0.05;
      `,bump:!0})}function Dp(e={}){return Od({roughness:.6,metalness:.55,color:jd.iron},{uniforms:{uIron:{value:vp(jd.iron)},uPolish:{value:e.polish??0},uRust:{value:e.rust??.3},uPolishR:{value:e.polishR??20}},color:`
        vec3 p = vPos;
        float n = fbm3(p * 0.12) * 0.5 + 0.5;
        float rust = smoothstep(0.6, 0.82, fbm3(p * 0.04 + 4.0) * 0.5 + 0.5) * uRust;
        vec3 col = mix(uIron * 0.8, uIron * 1.5, n * 0.5);
        col = mix(col, vec3(0.3, 0.16, 0.1), rust);
        float pol = uPolish * (1.0 - smoothstep(0.2, 1.0, length(p.xz) / uPolishR)) * step(0.0, -vNrm.y + 0.6);
        diffuseColor.rgb = col;
        procBump = n * 0.02;
      `,rough:`roughnessFactor = clamp(0.62 - pol * 0.35 + rust * 0.25, 0.2, 1.0);`,metal:`metalnessFactor = 0.55 - rust * 0.4;`,bump:!0})}function Op(e={}){return Od({roughness:.92,metalness:0},{uniforms:{uClay:{value:vp(e.color??`#9A5A3E`)},uSootTop:{value:e.sootTop??999}},color:`
        vec3 p = vPos;
        float n = fbm3(p * 0.09) * 0.5 + 0.5;
        float n2 = snoise(p * 0.7) * 0.5 + 0.5;
        vec3 col = uClay * (0.8 + 0.3 * n) * (0.95 + 0.08 * n2);
        float soot = smoothstep(uSootTop - 10.0, uSootTop, p.y + snoise(p * 0.15) * 4.0);
        col = mix(col, vec3(0.08, 0.06, 0.05), soot * 0.85);
        diffuseColor.rgb = col;
        procBump = n2 * 0.05 + n * 0.08;
      `,bump:!0})}function kp(e={}){let t=e.bandY??[];return kd({roughness:.22,metalness:0,clearcoat:.6,clearcoatRoughness:.15},{uniforms:{uGlaze:{value:vp(e.glaze??`#F1E8D6`)},uBand:{value:vp(e.band??jd.blue)},uFootY:{value:e.footY??-999},uBandA:{value:t[0]??-999},uBandB:{value:t[1]??-999}},color:`
        vec3 p = vPos;
        vec3 col = uGlaze * (0.97 + 0.03 * snoise(p * 0.6));
        float b = max(smoothstep(0.32, 0.12, abs(p.y - uBandA)), smoothstep(0.14, 0.04, abs(p.y - uBandB)));
        col = mix(col, uBand, b * 0.9);
        vec3 v = voronoi3(p * 0.9);
        col *= 1.0 - (1.0 - smoothstep(0.0, 0.03, v.y)) * 0.05;
        float foot = step(p.y, uFootY);
        col = mix(col, vec3(0.78, 0.66, 0.5), foot);
        diffuseColor.rgb = col;
      `,rough:`roughnessFactor = mix(0.2, 0.85, foot);`})}function Ap(e={}){return kd({roughness:.18,metalness:0,clearcoat:.8,clearcoatRoughness:.1},{uniforms:{uWhite:{value:vp(`#EFEAE0`)},uBlue:{value:vp(jd.blue)},uRimY:{value:e.rimY??10}},color:`
        vec3 p = vPos;
        vec3 col = uWhite;
        float rim = smoothstep(uRimY - 1.6, uRimY - 1.2, p.y);
        col = mix(col, uBlue, rim);
        vec3 v = voronoi3(p * 0.55);
        float chip = step(0.93, v.z) * (1.0 - smoothstep(0.12, 0.2, v.x)) * (0.4 + 0.6 * rim);
        col = mix(col, vec3(0.08, 0.07, 0.08), chip);
        diffuseColor.rgb = col;
      `,rough:`roughnessFactor = mix(0.16, 0.7, chip);`})}function jp(e={}){return Od({roughness:e.river?.62:.85,metalness:0},{uniforms:{uStone:{value:vp(e.color??`#8F8B86`)},uRiver:{value:+!!e.river}},color:`
        vec3 p = vPos;
        float n = fbm3(p * 0.12) * 0.5 + 0.5;
        float saa = aaFade3(p * 3.0);
        float sp = hash13(floor(p * 3.0)) * (1.0 - uRiver);
        vec3 col = uStone * (0.75 + 0.35 * n);
        col = mix(col, col * 0.45, mix(0.1, step(0.9, sp), saa) * (1.0 - uRiver));
        col = mix(col, col * 1.3, mix(0.05, step(0.95, hash13(floor(p * 2.3) + 5.0)), saa) * (1.0 - uRiver));
        float vein = 1.0 - smoothstep(0.0, 0.22, abs(sin(p.y * 0.55 + p.x * 0.2 + fbm3(p * 0.12) * 1.4)));
        col = mix(col, vec3(0.8, 0.78, 0.74), vein * 0.18 * uRiver);
        diffuseColor.rgb = col;
        procBump = mix(n * 0.25 + step(0.9, sp) * 0.02, n * 0.04, uRiver);
      `,bump:!0})}function Mp(e={}){return Od({roughness:.95,metalness:0},{uniforms:{uBark:{value:vp(e.color??`#6E5C4E`)}},color:`
        vec3 p = vWPos;
        float fis = abs(snoise(vec3(p.x * 0.35, p.y * 0.05, p.z * 0.35)));
        float n = fbm3(p * 0.08) * 0.5 + 0.5;
        vec3 col = uBark * (0.72 + 0.4 * n);
        col = mix(col, col * 0.45, 1.0 - smoothstep(0.0, 0.18, fis));
        float lichen = smoothstep(0.62, 0.8, fbm3(p * 0.05 + 9.0) * 0.5 + 0.5);
        col = mix(col, vec3(0.62, 0.66, 0.55), lichen * 0.5);
        diffuseColor.rgb = col;
        procBump = smoothstep(0.0, 0.2, fis) * 0.4 + n * 0.1;
      `,bump:!0})}function Np(){return Od({roughness:.8,metalness:0,shadowSide:2},{uniforms:{uTile:{value:vp(`#7B7D80`)}},color:`
        vec3 p = vPos;
        float row = floor(p.y / 18.0);
        float lane = floor(p.x / 22.0);
        float h = hash12(vec2(row, lane));
        float n = fbm3(vWPos * 0.04) * 0.5 + 0.5;
        vec3 col = uTile * (0.8 + 0.25 * h) * (0.85 + 0.25 * n);
        float moss = smoothstep(0.6, 0.85, fbm3(vWPos * 0.015 + 3.0) * 0.5 + 0.5);
        col = mix(col, vec3(0.38, 0.42, 0.28), moss * 0.45);
        float edge = smoothstep(0.82, 1.0, fract(p.y / 18.0));
        col *= 1.0 - edge * 0.35;
        diffuseColor.rgb = col;
        procBump = -edge * 0.6 + n * 0.1;
      `,bump:!0})}function Pp(e={}){return Od({roughness:.95,metalness:0,side:2},{uniforms:{uCloth:{value:vp(e.color??`#D9CCB4`)},uScale:{value:e.scale??3}},color:`
        vec2 q = vPos.xz * uScale;
        float wx = sin(q.x * 6.2832) * 0.5 + 0.5;
        float wy = sin(q.y * 6.2832) * 0.5 + 0.5;
        float n = fbm3(vPos * 0.3) * 0.5 + 0.5;
        vec3 col = uCloth * (0.86 + 0.12 * max(wx, wy)) * (0.9 + 0.12 * n);
        diffuseColor.rgb = col;
        procBump = max(wx, wy) * 0.02;
      `,bump:!0})}var Fp=class{mesh;uniforms;constructor(e){let t=new qa(1,1),n=new Xo;n.index=t.index,n.setAttribute(`position`,t.attributes.position),n.setAttribute(`uv`,t.attributes.uv);let r=Vu(e.seed??7),i=new Float32Array(e.count*4);for(let e=0;e<i.length;e++)i[e]=r();n.setAttribute(`aSeed`,new si(i,4)),n.instanceCount=e.count,this.uniforms={uTime:_p.uTime,uSunDir:_p.uSunDir,uSunCol:_p.uSunCol,uOrigin:{value:new V},uRadius:{value:e.radius},uLife:{value:e.life},uRise:{value:e.rise},uSpread:{value:e.spread},uSize:{value:e.size},uDrift:{value:e.drift??new V},uIntensity:{value:1},uOpacity:{value:e.opacity??.5},uLit:{value:new U(e.lit??`#FFF6EA`)},uShade:{value:new U(e.shade??`#B8AFC0`)},uNearFade:{value:new z(e.nearFade?.[0]??8,e.nearFade?.[1]??45)}};let a=new ao({uniforms:this.uniforms,vertexShader:`
        attribute vec4 aSeed;
        uniform float uTime, uLife, uRise, uSpread, uSize, uRadius, uIntensity;
        uniform vec3 uOrigin, uDrift;
        varying float vAlpha;
        varying vec2 vUv;
        varying float vSeed;
        varying float vAge;
        varying float vCam;
        void main() {
          float age = fract(uTime / uLife + aSeed.x);
          float ang = aSeed.y * 6.2832;
          float rad = sqrt(aSeed.z) * uRadius;
          vec3 p = uOrigin + vec3(cos(ang) * rad, 0.0, sin(ang) * rad);
          p.y += uRise * age * (1.5 - 0.5 * age);
          float sw = uTime * 0.5 + aSeed.w * 6.2832;
          p.x += sin(sw + age * 4.0) * uSpread * age;
          p.z += cos(sw * 0.8 + age * 3.0) * uSpread * age;
          p += uDrift * age * age;
          float size = uSize * (0.3 + 1.5 * age) * (0.7 + 0.6 * aSeed.w);
          vec4 mv = viewMatrix * vec4(p, 1.0);
          float rot = aSeed.w * 6.2832 + age * 1.5 * (aSeed.y - 0.5);
          vec2 c = position.xy;
          c = mat2(cos(rot), -sin(rot), sin(rot), cos(rot)) * c;
          mv.xy += c * size;
          gl_Position = projectionMatrix * mv;
          vCam = -mv.z;
          vAlpha = smoothstep(0.0, 0.18, age) * (1.0 - smoothstep(0.4, 1.0, age)) * uIntensity;
          vUv = uv;
          vSeed = aSeed.w;
          vAge = age;
        }
      `,fragmentShader:`
        uniform float uTime, uOpacity;
        uniform vec3 uLit, uShade, uSunCol;
        varying float vAlpha;
        varying vec2 vUv;
        varying float vSeed;
        varying float vAge;
        varying float vCam;
        uniform vec2 uNearFade;
        ${vd}
        void main() {
          vec2 q = vUv - 0.5;
          float d = length(q) * 2.0;
          float n = fbm2(vUv * 2.6 + vSeed * 17.0 + vec2(0.0, -uTime * 0.12));
          float a = (1.0 - smoothstep(0.15, 1.0, d)) * smoothstep(0.25, 0.75, n + 0.25 * (1.0 - d)) * vAlpha * uOpacity;
          a *= smoothstep(uNearFade.x, uNearFade.y, vCam);
          vec3 col = mix(uShade, uLit * mix(vec3(1.0), uSunCol, 0.35), 0.45 + 0.55 * (0.5 - q.y));
          if (a < 0.003) discard;
          gl_FragColor = vec4(col, a);
        }
      `,transparent:!0,depthWrite:!1,blending:1});this.mesh=new W(n,a),this.mesh.frustumCulled=!1,this.mesh.renderOrder=5}set(e,t){this.uniforms.uOrigin.value.copy(e),this.uniforms.uIntensity.value=t,this.mesh.visible=t>.002}},Ip=class{mesh;uniforms;constructor(e){let t=new qa(1,1),n=new Xo;n.index=t.index,n.setAttribute(`position`,t.attributes.position),n.setAttribute(`uv`,t.attributes.uv);let r=Vu(e.seed??3),i=new Float32Array(e.count*4);for(let e=0;e<i.length;e++)i[e]=r();n.setAttribute(`aSeed`,new si(i,4)),n.instanceCount=e.count,this.uniforms={uTime:_p.uTime,uOrigin:{value:new V},uBox:{value:e.box},uLife:{value:e.life},uRise:{value:e.rise},uSize:{value:e.size},uJitter:{value:e.jitter??1},uIntensity:{value:1},uColor:{value:new U(e.color)}};let a=new ao({uniforms:this.uniforms,vertexShader:`
        attribute vec4 aSeed;
        uniform float uTime, uLife, uRise, uSize, uIntensity, uJitter;
        uniform vec3 uOrigin, uBox;
        varying float vAlpha;
        varying vec2 vUv;
        void main() {
          float age = fract(uTime / (uLife * (0.6 + 0.8 * aSeed.w)) + aSeed.x);
          vec3 p = uOrigin + (vec3(aSeed.y, 0.0, aSeed.z) - vec3(0.5, 0.0, 0.5)) * uBox;
          p.y += uBox.y * aSeed.w * 0.3 + uRise * age;
          float t = uTime * 0.7 + aSeed.w * 40.0;
          p += vec3(sin(t * 1.3), sin(t * 0.9) * 0.6, cos(t * 1.1)) * uJitter * (0.4 + age);
          vec4 mv = viewMatrix * vec4(p, 1.0);
          mv.xy += position.xy * uSize * (0.6 + 0.8 * aSeed.y);
          gl_Position = projectionMatrix * mv;
          // 微微地明暗（快了一闪一闪，像屏幕在闪）
          float tw = 0.8 + 0.2 * sin(uTime * (0.8 + aSeed.z * 1.6) + aSeed.y * 30.0);
          vAlpha = smoothstep(0.0, 0.15, age) * (1.0 - smoothstep(0.6, 1.0, age)) * tw * uIntensity;
          vUv = uv;
        }
      `,fragmentShader:`
        uniform vec3 uColor;
        varying float vAlpha;
        varying vec2 vUv;
        void main() {
          float d = length(vUv - 0.5) * 2.0;
          float a = (1.0 - smoothstep(0.0, 1.0, d));
          a *= a * vAlpha;
          if (a < 0.003) discard;
          gl_FragColor = vec4(uColor * a, a);
        }
      `,transparent:!0,depthWrite:!1,blending:e.additive===!1?1:2});this.mesh=new W(n,a),this.mesh.frustumCulled=!1,this.mesh.renderOrder=6}set(e,t){this.uniforms.uOrigin.value.copy(e),this.uniforms.uIntensity.value=t,this.mesh.visible=t>.002}};function Lp(e){return new ao({uniforms:{uTime:_p.uTime,uI:e},vertexShader:`
      varying vec2 vUv;
      varying float vSeed;
      attribute float aSeed;
      void main() {
        vUv = uv;
        vSeed = aSeed;
        gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      uniform float uTime, uI;
      varying vec2 vUv;
      varying float vSeed;
      ${vd}
      void main() {
        vec2 uv = vUv;
        // 火舌慢慢地往上舔：快了在灶膛里一闪一闪
        float t = uTime * (0.45 + 0.25 * vSeed);
        float n = fbm2(vec2(uv.x * 3.0 + vSeed * 10.0, uv.y * 2.2 - t));
        float x = uv.x - 0.5 + (n - 0.5) * 0.45 * uv.y;
        float w = 0.42 * (1.0 - uv.y * 0.85);
        float shape = smoothstep(w, w * 0.2, abs(x)) * smoothstep(1.0, 0.25, uv.y + (n - 0.5) * 0.5) * smoothstep(0.0, 0.08, uv.y);
        vec3 col = mix(vec3(1.0, 0.32, 0.06), vec3(1.0, 0.78, 0.35), smoothstep(0.2, 0.9, shape));
        col = mix(col, vec3(1.0, 0.95, 0.75), smoothstep(0.75, 1.0, shape) * (1.0 - uv.y));
        float a = shape * uI;
        if (a < 0.004) discard;
        gl_FragColor = vec4(col * a * 1.8, a);
      }
    `,transparent:!0,depthWrite:!1,blending:2})}var Rp=class{mesh;m=new rn;q=new B;s=new V;n=0;constructor(e){let t=new co({color:`#dfe8e6`,roughness:.05,metalness:0,transmission:0,transparent:!0,opacity:.55,clearcoat:1});this.mesh=new hi(new Ja(1,10,8),t,e),this.mesh.instanceMatrix.setUsage(Je),this.mesh.frustumCulled=!1,this.mesh.count=0}begin(){this.n=0}add(e,t,n=1){this.n>=this.mesh.instanceMatrix.count||(this.s.set(t,t*n,t),this.m.compose(e,this.q,this.s),this.mesh.setMatrixAt(this.n++,this.m))}end(){this.mesh.count=this.n,this.mesh.instanceMatrix.needsUpdate=!0,this.mesh.visible=this.n>0}},zp=class{mesh;fade;dummy=new jn;n=0;constructor(e,t,n){this.mesh=new hi(e,t,n),this.mesh.instanceMatrix.setUsage(Je),this.mesh.castShadow=!0,this.mesh.receiveShadow=!0,this.mesh.frustumCulled=!1,this.mesh.count=0;let r=e.getAttribute(`aFade`);this.fade=r??new si(new Float32Array(n),1),r||e.setAttribute(`aFade`,this.fade)}begin(){this.n=0}add(e,t,n,r,i,a=1){if(this.n>=this.mesh.instanceMatrix.count)return;let o=this.dummy;o.position.copy(e),o.rotation.set(t,n,r),o.scale.setScalar(i),o.updateMatrix(),this.fade.setX(this.n,a),this.mesh.setMatrixAt(this.n++,o.matrix)}end(){this.mesh.count=this.n,this.mesh.instanceMatrix.needsUpdate=!0,this.fade.needsUpdate=!0,this.mesh.visible=this.n>0}};function Bp(e,t,n={}){let r=new H,i=new W(new Ka([new z(0,0),new z(e-1.5,0),new z(e,1.2),new z(e+.4,t)],64),Tp({w:n.w??1.2,holes:n.holes,radius:e}));i.castShadow=!0,i.receiveShadow=!0,r.add(i);let a=new W(new Ya(e+.6,.65,8,72),Ep({axis:`x`}));return a.rotation.x=Math.PI/2,a.position.y=t,a.castShadow=!0,r.add(a),r}var Vp=6.5;function Hp(){let e=new H,t=Vp,n=[];for(let e=0;e<=14;e++){let r=e/14;n.push(new z(12*Math.sin(r*Math.PI/2),t*(1-Math.cos(r*Math.PI/2))))}let r=new W(new Ka(n,48),Tp({w:1.15,holes:!0,mode:`polar`,gap:.24,color:`#B88F58`,dark:`#7A5A36`}));r.castShadow=!0,r.receiveShadow=!0,r.customDepthMaterial=void 0,e.add(r);let i=Ep({axis:`x`,color:`#A9824F`}),a=new W(new Ya(12,.7,8,56),i);a.rotation.x=Math.PI/2,a.position.y=t,a.castShadow=!0,e.add(a);let o=new W(new G(.75,.95,42,10),Ep({axis:`y`,node:13,color:`#B58C55`}));o.geometry.translate(0,21,0),o.position.set(11.4,6.3,0),o.rotation.z=-Math.PI/2+.42,o.castShadow=!0,e.add(o);let s=new W(new G(1.15,1.15,3.2,12),i);return s.position.set(12.6,6.9,0),s.rotation.z=-Math.PI/2+.42,e.add(s),e}var Up=class{group=new H;steam;smoke;fireLight;fireI={value:1};waterU;drain;strainer;waterY;constructor(){let e=this.group,t=Z.stove,n=Z.stoveTop,r=t.x-76,i=t.z-43,a=Z.wok,o=t.z+43,s=n-18,c=xp({plasterTop:!0,whitewash:.25,soot:new Qt(a.x,24,o,36)}),l=new ia;l.moveTo(-76,0),l.lineTo(76,0),l.lineTo(76,s),l.lineTo(-76,s),l.closePath();let u=new ra,d=a.x-t.x;u.moveTo(d-16,10),u.lineTo(d+16,10),u.lineTo(d+16,26),u.absarc(d,26,16,0,Math.PI,!1),u.lineTo(d-16,10),l.holes.push(u);let f=new W(new Ha(l,{depth:10,bevelEnabled:!1,curveSegments:16}),c);f.position.set(t.x,0,o-10),f.castShadow=f.receiveShadow=!0,e.add(f);let p=(t,n,r,i)=>{let a=new W(new wi(t,s,n),c);a.position.set(r,s/2,i),a.castShadow=a.receiveShadow=!0,e.add(a)};p(10,76,r+5,i+38),p(10,76,r+152-5,i+38),p(132,10,t.x,i+5);let m=new W(new wi(132-2*Wp,s-1-2*Wp,66-2*Wp),Gp());m.position.set(t.x,Wp+(s-1-2*Wp)/2,t.z),e.add(m);let h=new ia;h.moveTo(-78,-45),h.lineTo(78,-45),h.lineTo(78,45),h.lineTo(-78,45),h.closePath();let g=new ra;g.absarc(a.x-t.x,-(a.z-t.z),Z.wokR+.3,0,Math.PI*2,!0),h.holes.push(g);let _=new W(new Ha(h,{depth:17,bevelEnabled:!0,bevelThickness:1,bevelSize:1,bevelSegments:2,curveSegments:48}),c);_.rotation.x=-Math.PI/2,_.position.set(t.x,s,t.z),_.castShadow=_.receiveShadow=!0,e.add(_);let v=Z.wokR,y=[];for(let e=0;e<=16;e++){let t=e/16;y.push(new z(v*Math.sin(t*Math.PI/2),-15*Math.cos(t*Math.PI/2)))}y.push(new z(v+1.4,.4),new z(v+1.4,1.1),new z(v-.4,1));for(let e=16;e>=0;e--){let t=e/16;y.push(new z((v-.5)*Math.sin(t*Math.PI/2),-14.5*Math.cos(t*Math.PI/2)+.01))}let b=Dp({polish:.8,rust:.15,polishR:18});b.side=2;let x=new W(new Ka(y,72),b);x.position.set(a.x,n+.2,a.z),x.castShadow=x.receiveShadow=!0,e.add(x),this.waterY=n+Z.water;let S=v*Math.sin(Math.acos(Math.min(1,-Z.water/15)))-.4;this.waterU={uBoil:{value:0},uSplash:{value:new Qt(0,0,-100,0)},uTime:_p.uTime,uR:{value:S}};let C=new W(new G(S,S,.1,72,1),kd({color:`#5E6A4E`,roughness:.06,metalness:0,transparent:!0,opacity:.86,clearcoat:0,envMapIntensity:2.2},{uniforms:this.waterU,color:`
            vec2 p = vPos.xz;
            float t = uTime;
            float b = uBoil;
            // 火在锅底正中，滚得最凶的是中间：越往锅边越平
            float center = 1.0 - smoothstep(uR * 0.15, uR * 0.95, length(p));
            // 大的翻滚：几团慢慢鼓起、塌下去的水
            float churn = fbm2(p * 0.085 + vec2(t * 0.32, -t * 0.27)) - 0.5;
            churn += (fbm2(p * 0.16 + vec2(-t * 0.5, t * 0.41) + 7.0) - 0.5) * 0.6;
            float h = churn * 3.2 * b * (0.25 + 0.75 * center);
            h += sin(length(p) * 0.45 - t * 1.6) * 0.05 * (0.3 + b);
            // 两层气泡：一大一小，集中在中间；鼓起来，破掉，留一圈涟漪
            float bubbles = 0.0;
            for (int L = 0; L < 2; L++) {
              float sc = L == 0 ? 2.6 : 1.5;
              vec2 q = p / sc + float(L) * 17.0;
              vec2 cell = floor(q);
              vec2 f = fract(q) - 0.5;
              float rr = hash12(cell);
              float chance = b * (L == 0 ? 0.08 + 0.8 * center : 0.04 + 0.6 * center);
              float act = step(1.0 - chance, hash12(cell + 9.1));
              float ph = fract(t * (0.9 + rr * 1.1) + rr * 7.0);
              vec2 off = (hash22(cell) - 0.5) * 0.4;
              float d = length(f - off);
              float rad = 0.14 + 0.22 * ph;
              float dome = (1.0 - smoothstep(rad * 0.4, rad, d)) * smoothstep(0.0, 0.4, ph) * (1.0 - step(0.88, ph));
              float ring = (1.0 - smoothstep(0.0, 0.05, abs(d - (ph - 0.88) * 2.8))) * step(0.88, ph) * (1.0 - ph) * 8.0;
              h += (dome * 0.25 + ring * 0.06) * act * sc;
              bubbles += dome * act;
            }
            // 果子下锅时的一圈水花
            vec2 sd = p - uSplash.xy;
            float st = t - uSplash.z;
            if (st > 0.0 && st < 3.0) {
              float dd = length(sd);
              h += sin(dd * 1.6 - st * 9.0) * exp(-st * 1.4) * exp(-dd * 0.08) * smoothstep(st * 9.0 + 2.0, st * 9.0 - 2.0, dd * 1.6) * 0.9 * uSplash.w;
            }
            procBump = h * 0.4;
            // 泡沫：气泡挤在一起、水翻上来的地方发白
            float foam = clamp(bubbles * 0.45 + smoothstep(0.2, 0.7, churn) * center * 0.8, 0.0, 1.0) * b;
            // 水本身：浅一点的黄绿浑水，翻滚处更亮
            diffuseColor.rgb *= 1.0 + 0.35 * churn * b;
            diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.93, 0.92, 0.86), foam * 0.6);
            diffuseColor.a = mix(diffuseColor.a, 1.0, foam * 0.5);
          `,bump:!0}));C.position.set(a.x,this.waterY,a.z),C.receiveShadow=!0,e.add(C),this.steam=new Fp({count:60,life:4.2,rise:70,spread:10,size:24,radius:S*.8,drift:new V(6,0,10),opacity:.26,seed:3,nearFade:[20,70]}),e.add(this.steam.mesh);let w=new hi(new qa(14,22),Lp(this.fireI),6),T=new Float32Array(6),E=new jn,D=Vu(2);for(let e=0;e<6;e++)E.position.set(a.x-9+e*3.6,21,o-26+e%2*6),E.rotation.set(0,e%3*.9-.6,0),E.scale.setScalar(.8+D()*.5),E.updateMatrix(),w.setMatrixAt(e,E.matrix),T[e]=D();w.geometry.setAttribute(`aSeed`,new si(T,1)),w.frustumCulled=!1,e.add(w);let O=new hi(new G(2.6,3,40,8),Mp({color:`#5E4A3A`}),4);for(let e=0;e<4;e++)E.position.set(a.x-8+e*5,12.5,o-12-e*3),E.rotation.set(Math.PI/2+.1*(e-1.5),.25*(e-1.5),0),E.scale.setScalar(1),E.updateMatrix(),O.setMatrixAt(e,E.matrix);e.add(O),this.fireLight=new Ko(`#FF8C3E`,8e3,0,2),this.fireLight.position.set(a.x,24,o+4),e.add(this.fireLight);let k=r+152-16,A=i+15,j=new W(new wi(28,330,28),xp({whitewash:.5}));j.position.set(k,n+165,A),j.castShadow=!1,j.receiveShadow=!0,e.add(j),this.smoke=new Fp({count:40,life:9,rise:260,spread:40,size:90,radius:8,drift:new V(80,0,40),lit:`#F4EEE6`,shade:`#A9A2B0`,opacity:.32,seed:9}),this.smoke.set(new V(k,n+335,A),1),e.add(this.smoke.mesh);let ee=Z.oven.x+33+42,te=new hi(new G(3.2,3.6,62,7),Mp(),34),M=0;for(let e=0;e<5;e++)for(let t=0;t<7-e;t++)E.position.set(ee,3.5+e*6.2,i+12+t*7.2+e*3.6),E.rotation.set(0,0,Math.PI/2+(D()-.5)*.1),E.position.x+=(D()-.5)*8,E.scale.setScalar(.85+D()*.3),E.updateMatrix(),M<34&&te.setMatrixAt(M++,E.matrix);te.count=M,te.castShadow=te.receiveShadow=!0,e.add(te);let ne=new H,N=new W(new G(34,34,3,48),bp({axis:`x`,plank:11,seed:12,light:`#9A7A58`,dark:`#5C4331`}));N.castShadow=N.receiveShadow=!0,ne.add(N);let re=new W(new wi(30,4,5),bp({axis:`x`,seed:13}));re.position.y=3,ne.add(re),ne.rotation.set(Math.PI/2-.22,0,0),ne.position.set(ee+66,36,i+6),e.add(ne),this.drain=Bp(15,2.6),this.drain.position.copy(Z.drain),e.add(this.drain),this.strainer=Hp(),e.add(this.strainer)}},Wp=.6;function Gp(){return Od({roughness:1,metalness:0,side:1},{uniforms:{uSoot:{value:new U(`#1E1716`)}},color:`
        float n = fbm3(vPos * 0.1) * 0.5 + 0.5;
        diffuseColor.rgb = uSoot * (0.7 + 0.6 * n);
      `})}function Kp(e){let t=Array.from({length:10},()=>e),n=Array.from({length:10},(e,t)=>t),r=Xp(t,n,(e,t,n)=>Math.hypot(e,t)+n<22.5,23,1.3,5,new z(1.5,1)),i=Xp(t,n,(e,t,n)=>Math.hypot(e,t)+n<31,31,1.4,7,new z(2,3)),a=(e,t,n)=>[...t].sort((t,n)=>r[t].distanceTo(r[e])-r[n].distanceTo(r[e])).slice(0,n),o=n.filter(e=>e!==0),s=[0,...a(0,o,3)],c=o.filter(e=>!s.includes(e)),l=[...c].sort((e,t)=>r[t].distanceTo(r[0])-r[e].distanceTo(r[0]))[0],u=[l,...a(l,c.filter(e=>e!==l),2)];return{count:10,lift:()=>e,basket:dp,pour:fp,float:r,sieve:i,scoops:[s,u,c.filter(e=>!u.includes(e))],strainer:(e,t,n,r)=>r.copy(pp[e][t])}}function qp(e){let t=Math.min(.98,e/12);return Vp*(1-Math.sqrt(1-t*t))}function Jp(e){let t=[[0,13],[1.5,14.6],[9,17.2],[12,18]];for(let n=1;n<t.length;n++){let[r,i]=t[n-1],[a,o]=t[n];if(e<=a)return i+(o-i)*Math.max(0,e-r)/(a-r)}return 18}function Yp(e,t,n,r,i){let a=null;for(let o of n){let n=r+t;for(let r of e){let e=Math.hypot(o.x-r.p.x,o.y-r.p.z),i=t+r.r+.05;e<i&&(n=Math.max(n,r.p.y+Math.sqrt(i*i-e*e)))}i(o.x,o.y,n)&&(!a||n<a.y-1e-6)&&(a=new V(o.x,n,o.y))}return a}function Xp(e,t,n,r,i,a,o){for(let s=0;s<40;s++){let c=Zp(e,t,n,r,i,a+s*101,o);if(c)return c}throw Error(`摆不下`)}function Zp(e,t,n,r,i,a,o){let s=Vu(a),c=[],l=[];for(let a of t){let u=null;for(let c=0;c<4e3&&!u;c++){let d=c===0&&o&&a===t[0]?o.clone():new z((s()*2-1)*r,(s()*2-1)*r);n(d.x,d.y,e[a])&&l.every(t=>Math.hypot(t.x-d.x,t.z-d.y)>t.r+e[a]+i)&&(u=d)}if(!u)return null;c[a]=u,l.push({x:u.x,z:u.y,r:e[a]})}return c}function Qp(e){let t=e.count,n=t=>e.radius[t]*e.stretch[t],r=Array.from({length:t},(t,n)=>e.radius[n]),i=Vu(71),a=[],o=[],s=Array.from({length:t-1},(e,t)=>t+1).sort((e,t)=>r[t]-r[e]),c=e=>(t,n,r)=>Math.hypot(t,n)+e<Jp(r)-.4&&r<11;for(let e of[...s,0]){let t=[];if(e===0)for(let e=0;e<60;e++)t.push(new z(3.2+(i()-.5)*3,5.4+(i()-.5)*3));else for(let e=0;e<160;e++)t.push(new z((i()*2-1)*14,(i()*2-1)*14));let r=Yp(a,n(e),t,.06,c(n(e)));if(!r)throw Error(`篮里放不下`);a.push({p:r,r:n(e)}),o[e]=r}let l=Array.from({length:t},(e,t)=>t).filter(t=>e.blanched[t]),u=Array.from({length:t},(e,t)=>t).filter(t=>!e.blanched[t]),d=[...l].sort((e,t)=>o[e].x-o[e].y*.3-(o[t].x-o[t].y*.3)),f=Xp(r,[0,...l.filter(e=>e>0)],(e,t,n)=>Math.hypot(e,t)+n<17,17,.5,81,new z(0,0)),p=[],m=Xp(r,u,(e,t,n)=>e<-2.2-n&&Math.hypot(e,t)+n<30.5,31,.7,91),h=Xp(r,l,(e,t,n)=>e>2.2+n&&Math.hypot(e,t)+n<30.5,31,.7,93,new z(12,8));for(let e of u)p[e]=m[e];for(let e of l)p[e]=h[e];let g=l.filter(e=>e>0).sort((e,t)=>f[e].length()-f[t].length()),_=[0,...g.slice(0,7)],v=g.slice(7),y=e=>e>=8?5:4.6;return{count:t,lift:t=>e.lift(t),basket:o,pour:d,float:f,sieve:p,scoops:[_,v],restRot:t=>new B().setFromAxisAngle(new V(0,1,0),t*1.3).multiply(e.rot(t)),strainer:(e,t,r,i)=>{if(t===0)return i.set(0,qp(0)+n(r)+.08,0);let a=(t-1)/(e-1)*Math.PI*2+.3,o=y(e);return i.set(Math.cos(a)*o,qp(o)+n(r)*1.04+.12,Math.sin(a)*o)}}}var $p=()=>({boil:.15,fireLow:!1,ovenOn:0,lapse:0,bloom:.2,haze:0,bulb:0,interior:0}),em=()=>({blanch:0,wet:0,dry:0,soak:0,product:0,press:0}),tm=new V,nm=new mn,rm=class{w;heroPos=new V;heroQuat=new B;basketPos=new V;basketQuat=new B;carry=$p();look=em();heroBaseQ=new B().setFromEuler(new mn(.35,.8,.15));R;layout;fruits;heroGroup;constructor(e){this.w=e,e.tai?(this.R=0,this.layout=Qp(e.tai),this.fruits=e.tai,this.heroGroup=e.tai.heroGroup,this.heroBaseQ.copy(e.tai.rot(0))):e.cakes?(this.R=0,this.layout=Kp(Af.R),this.fruits=e.cakes,this.heroGroup=e.cakes.heroGroup):(this.R=Af.R,this.layout=Kp(Af.R),this.fruits=e.batch,this.heroGroup=e.hero.group),this.restBasket()}reset(){this.carry=$p(),this.look=em();let e=this.w.hero.state;e.cut.fill(0),e.open.fill(0),e.scrape.fill(0),e.cap=0,e.hub=0,e.dry=0,e.soak=0,e.fold=0,e.press=0,e.shrink=0,this.restBasket()}fruitCenter=(e,t)=>t.set(0,this.R,0).applyQuaternion(this.heroQuat).add(this.heroPos);heroFlat=(e,t)=>t.copy(this.heroPos).add(tm.set(0,.6,0));follow(e=0,t=0,n=0){return(r,i)=>i.copy(this.heroPos).add(tm.set(t,e,n))}restBasket(){let e=Z;this.basketPos.set(e.basket.x,e.tableTop+.15,e.basket.z),this.basketQuat.identity()}fruitRot(e){return e===0?this.heroBaseQ:this.fruits.rot(e)}fruitInBasket(e,t,n,r=this.basketPos,i=this.basketQuat){t.copy(this.layout.basket[e]).applyQuaternion(i).add(r),n.copy(i).multiply(this.fruitRot(e))}fruitsInBasket(){let e=this.fruits,t=new V,n=new B;for(let r=1;r<e.count;r++)this.fruitInBasket(r,t,n),e.setFruit(r,t,n);e.show(!0)}heroOnRack(){let e=this.w.dry.heroSlot;this.heroPos.copy(e.pos),this.heroQuat.setFromEuler(nm.set(0,e.rot,0))}piecesOnRack(){let e=Z,t=this.w.batch;for(let n=1;n<10;n++){let r=hp[n];t.setPiece(n,this.w.hero.geometry,tm.set(e.dry.x+r.x,e.dryY,e.dry.z+r.z),r.rot)}}setHeroByCenter(e,t){this.heroQuat.copy(t),this.heroPos.copy(e).sub(tm.set(0,this.R,0).applyQuaternion(t))}applyHero(){let e=this.heroGroup;e.position.copy(this.heroPos),e.quaternion.copy(this.heroQuat),e.updateMatrixWorld()}};function im(e,t=!1){let n=e[0].index!==null,r=new Set(Object.keys(e[0].attributes)),i=new Set(Object.keys(e[0].morphAttributes)),a={},o={},s=e[0].morphTargetsRelative,c=new Pr,l=0;for(let u=0;u<e.length;++u){let d=e[u],f=0;if(n!==(d.index!==null))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.`),null;for(let e in d.attributes){if(!r.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure "`+e+`" attribute exists among all geometries, or in none of them.`),null;a[e]===void 0&&(a[e]=[]),a[e].push(d.attributes[e]),f++}if(f!==r.size)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. Make sure all geometries have the same number of attributes.`),null;if(s!==d.morphTargetsRelative)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. .morphTargetsRelative must be consistent throughout all geometries.`),null;for(let e in d.morphAttributes){if(!i.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`.  .morphAttributes must be consistent throughout all geometries.`),null;o[e]===void 0&&(o[e]=[]),o[e].push(d.morphAttributes[e])}if(t){let e;if(n)e=d.index.count;else if(d.attributes.position!==void 0)e=d.attributes.position.count;else return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. The geometry must have either an index or a position attribute`),null;c.addGroup(l,e,u),l+=e}}if(n){let t=0,n=[];for(let r=0;r<e.length;++r){let i=e[r].index;for(let e=0;e<i.count;++e)n.push(i.getX(e)+t);t+=e[r].attributes.position.count}c.setIndex(n)}for(let e in a){let t=am(a[e]);if(!t)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` attribute.`),null;c.setAttribute(e,t)}for(let e in o){let t=o[e][0].length;if(t!==0){c.morphAttributes=c.morphAttributes||{},c.morphAttributes[e]=[];for(let n=0;n<t;++n){let t=[];for(let r=0;r<o[e].length;++r)t.push(o[e][r][n]);let r=am(t);if(!r)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` morphAttribute.`),null;c.morphAttributes[e].push(r)}}}return c}function am(e){let t,n,r,i=-1,a=0;for(let o=0;o<e.length;++o){let s=e[o];if(t===void 0&&(t=s.array.constructor),t!==s.array.constructor)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.`),null;if(n===void 0&&(n=s.itemSize),n!==s.itemSize)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.`),null;if(r===void 0&&(r=s.normalized),r!==s.normalized)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.`),null;if(i===-1&&(i=s.gpuType),i!==s.gpuType)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.`),null;a+=s.count*n}let o=new t(a),s=new yr(o,n,r),c=0;for(let t=0;t<e.length;++t){let r=e[t];if(r.isInterleavedBufferAttribute){let e=c/n;for(let t=0,i=r.count;t<i;t++)for(let i=0;i<n;i++){let n=r.getComponent(t,i);s.setComponent(t+e,i,n)}}else o.set(r.array,c);c+=r.count*n}return i!==void 0&&(s.gpuType=i),s}function om(e,t=1e-4){t=Math.max(t,2**-52);let n={},r=e.getIndex(),i=e.getAttribute(`position`),a=r?r.count:i.count,o=0,s=Object.keys(e.attributes),c={},l={},u=[],d=[`getX`,`getY`,`getZ`,`getW`],f=[`setX`,`setY`,`setZ`,`setW`];for(let t=0,n=s.length;t<n;t++){let n=s[t],r=e.attributes[n];c[n]=new r.constructor(new r.array.constructor(r.count*r.itemSize),r.itemSize,r.normalized);let i=e.morphAttributes[n];i&&(l[n]||(l[n]=[]),i.forEach((e,t)=>{let r=new e.array.constructor(e.count*e.itemSize);l[n][t]=new e.constructor(r,e.itemSize,e.normalized)}))}let p=t*.5,m=10**Math.log10(1/t),h=p*m;for(let t=0;t<a;t++){let i=r?r.getX(t):t,a=``;for(let t=0,n=s.length;t<n;t++){let n=s[t],r=e.getAttribute(n),o=r.itemSize;for(let e=0;e<o;e++)a+=`${Math.trunc(r[d[e]](i)*m+h)},`}if(a in n)u.push(n[a]);else{for(let t=0,n=s.length;t<n;t++){let n=s[t],r=e.getAttribute(n),a=e.morphAttributes[n],u=r.itemSize,p=c[n],m=l[n];for(let e=0;e<u;e++){let t=d[e],n=f[e];if(p[n](o,r[t](i)),a)for(let e=0,r=a.length;e<r;e++)m[e][n](o,a[e][t](i))}}n[a]=o,u.push(o),o++}}let g=e.clone();for(let t in e.attributes){let e=c[t];if(g.setAttribute(t,new e.constructor(e.array.slice(0,o*e.itemSize),e.itemSize,e.normalized)),t in l)for(let e=0;e<l[t].length;e++){let n=l[t][e];g.morphAttributes[t][e]=new n.constructor(n.array.slice(0,o*n.itemSize),n.itemSize,n.normalized)}}return g.setIndex(u),g}function sm(){let e=new Ja(1,40,28);e.deleteAttribute(`uv`),e.deleteAttribute(`normal`);let t=om(e),n=t.attributes.position,r=new V;for(let e=0;e<n.count;e++){r.fromBufferAttribute(n,e);let t=Math.hypot(r.x,r.z);if(r.y>0&&(r.y-=.13*(1-J(0,.42,t))*J(.6,1,r.y)),r.y<0){let e=J(-.7,-1,r.y);r.x*=1-.06*e,r.z*=1-.06*e}n.setXYZ(e,r.x,r.y,r.z)}t.computeVertexNormals();let i=new G(.17,.24,.07,14);i.translate(0,-.985,0);let a=new G(.045,.06,.08,8);a.translate(0,-1.05,0);let o=t.toNonIndexed(),s=[o];for(let e of[i,a])e.deleteAttribute(`uv`),s.push(e.toNonIndexed());let c=im(s),l=new Float32Array(c.attributes.position.count);return l.fill(1,o.attributes.position.count),c.setAttribute(`aPart`,new yr(l,1)),c}function cm(){let e=e=>new U(e);return kd({roughness:.7,metalness:0,sheen:1,sheenRoughness:.6,sheenColor:new U(`#ffffff`),clearcoat:1,clearcoatRoughness:.3},{uniforms:{uBlanch:{value:0},uWet:{value:0},uDry:{value:0},uFuzz:{value:1},cSkin0:{value:e(Md.skin[0])},cSkin1:{value:e(Md.skin[1])},cBl0:{value:e(Md.blanch[0])},cBl1:{value:e(Md.blanch[1])},cGreyBrown0:{value:e(`#3F4630`)},cGreyBrown1:{value:e(`#5E6142`)},cYellowBrown0:{value:e(`#6E5532`)},cYellowBrown1:{value:e(`#9A7A48`)},cFuzz:{value:e(`#F1F0E6`)},cStem:{value:e(`#6E7240`)},cStemDry:{value:e(`#6A5634`)}},attributes:`attribute float aPart; attribute vec2 aVar;`,varyings:`varying float vPart; varying vec2 vVar;`,vertex:`vPart = aPart;
#ifdef USE_INSTANCING
vVar = aVar;
#else
vVar = vec2(0.3, 0.7);
#endif`,color:`
        vec3 rp = vPos + vVar.y * 17.0;
        float mott = snoise(rp * 2.2) * 0.5 + snoise(rp * 6.1) * 0.2;
        float lo = smoothstep(-0.7, 0.4, mott);
        vec3 fresh = mix(cSkin0, cSkin1, lo * 0.8);
        vec3 bl = mix(cBl0, cBl1, lo);
        vec3 col = mix(fresh, bl, uBlanch);
        // 烘干：每个果自己偏青褐还是偏黄棕（vVar.x），同一个果上也有深浅
        vec3 gb = mix(cGreyBrown0, cGreyBrown1, lo);
        vec3 yb = mix(cYellowBrown0, cYellowBrown1, lo);
        vec3 dry = mix(gb, yb, smoothstep(0.25, 0.8, vVar.x));
        col = mix(col, dry, uDry);
        vec3 gl = voronoi3(vPos * 22.0 + vVar.y * 5.0);
        float gland = mix(0.12, 1.0 - smoothstep(0.1, 0.36, gl.x), aaFade3(vPos * 22.0));
        col *= 1.0 - gland * mix(0.12, 0.2, uDry);
        // 顶上那一点凹进去的地方颜色深一点
        float apex = 1.0 - smoothstep(0.0, 0.3, length(vPos.xz)) ;
        apex *= step(0.5, vPos.y);
        col = mix(col, col * 0.62, apex * 0.7);
        // 密白绒：细细的亮点，烘干以后底色暗了更显
        float hair = mix(0.3, step(0.7, hash13(floor(vPos * 220.0 + vVar.y * 31.0))), aaFade3(vPos * 220.0));
        float fz = uFuzz * mix(0.12, 0.2, uDry);
        col = mix(col, cFuzz, hair * fz);
        float outer = 1.0 - step(0.5, vPart);
        if (vPart > 0.5) {
          col = mix(cStem, cStemDry, uDry) * (0.85 + 0.2 * snoise(vPos * 9.0));
        }
        diffuseColor.rgb = col;
        procBump = -gland * 0.006 + mott * 0.004 + hair * 0.002;
      `,rough:`roughnessFactor = mix(mix(0.62, 0.36, uWet), 0.8, uDry);`,physical:`
        #ifdef USE_SHEEN
          material.sheenColor = cFuzz * uFuzz * outer * mix(0.28, 0.2, uDry);
          material.sheenRoughness = 0.6;
        #endif
        #ifdef USE_CLEARCOAT
          material.clearcoat = outer * uWet * 0.7;
          material.clearcoatRoughness = 0.3;
        #endif
      `,bump:!0})}function lm(e,t){let n=e.userData.proc.uniforms;t.blanch!==void 0&&(n.uBlanch.value=t.blanch),t.wet!==void 0&&(n.uWet.value=t.wet),t.dry!==void 0&&(n.uDry.value=t.dry),t.fuzz!==void 0&&(n.uFuzz.value=t.fuzz)}var um=class{group=new H;count;radius=[];stretch=[];rots=[];blanched=[];heroGroup=new H;heroMesh;fur;matBlanched;matRaw;matHero;meshB;meshR;slot=[];shrink=1;d=new jn;constructor(e,t,n=61){this.count=e;let r=Vu(n);for(let t=0;t<e;t++){this.radius.push(t===0?2.1:1.65+r()*.6),this.stretch.push(1+r()*r()*.14);let e=new B().setFromAxisAngle(new V(1,0,0),1.25+r()*.9);this.rots.push(new B().setFromAxisAngle(new V(0,1,0),r()*Math.PI*2).multiply(e))}let i=0;for(let n=0;n<e;n++){let e=n===0||n%2==1&&i<t;e&&i++,this.blanched.push(e)}let a=sm();this.matBlanched=cm(),this.matRaw=cm(),this.matHero=cm();let o=this.blanched.filter((e,t)=>e&&t>0).length,s=e-1-o,c=(e,t)=>{let n=a.clone();n.setAttribute(`aVar`,new si(new Float32Array(e*2),2));let r=new hi(n,t,Math.max(1,e));return r.count=e,r.castShadow=!0,r.receiveShadow=!0,r.frustumCulled=!1,this.group.add(r),r};this.meshB=c(o,this.matBlanched),this.meshR=c(s,this.matRaw),this.heroMesh=c(1,this.matHero),this.group.remove(this.heroMesh),this.heroGroup.add(this.heroMesh),this.fur=dm(a),this.heroGroup.add(this.fur);let l=0,u=0;for(let t=0;t<e;t++){t===0?this.slot.push({mesh:this.heroMesh,k:0}):this.blanched[t]?this.slot.push({mesh:this.meshB,k:l++}):this.slot.push({mesh:this.meshR,k:u++});let e=this.slot[t];e.mesh.geometry.attributes.aVar.setXY(e.k,r(),r())}this.setHeroLocal()}setHeroLocal(){let e=this.radius[0]*this.shrink;this.d.position.set(0,0,0),this.d.quaternion.identity(),this.d.scale.set(e,e*this.stretch[0],e),this.d.updateMatrix(),this.heroMesh.setMatrixAt(0,this.d.matrix),this.heroMesh.instanceMatrix.needsUpdate=!0,this.fur.scale.copy(this.d.scale)}lift(e){return this.radius[e]*this.shrink*this.stretch[e]}setFruit(e,t,n){let r=this.slot[e],i=this.radius[e]*this.shrink;this.d.position.copy(t),this.d.quaternion.copy(n),this.d.scale.set(i,i*this.stretch[e],i),this.d.updateMatrix(),r.mesh.setMatrixAt(r.k,this.d.matrix)}rot(e){return this.rots[e]}show(e){this.meshB.visible=e,this.meshR.visible=e,this.meshB.instanceMatrix.needsUpdate=!0,this.meshR.instanceMatrix.needsUpdate=!0}};function dm(e,t=8,n=.03){let r=new H;for(let i=1;i<=t;i++){let a=new W(e,Od({roughness:.8,metalness:0,color:`#DCDACB`},{uniforms:{uH:{value:i/t},uLen:{value:n}},vertex:`transformed += normal * uLen * uH;`,discard:`
          vec3 hp = vPos * 150.0 + vec3(0.0, 0.0, uH * 0.6);
          vec3 cell = floor(hp);
          vec3 jit = vec3(hash13(cell), hash13(cell + 3.1), hash13(cell + 7.7)) * 0.5 + 0.25;
          float rnd = hash13(cell + 11.0);
          float d = length(fract(hp) - jit);
          // 毛比像素还细（离得远）就不画，靠材质里的绒光（不然远看一闪一闪）
          vec3 fw = fwidth(hp);
          // 有的毛长有的短；越往外越细
          if (max(max(fw.x, fw.y), fw.z) > 0.45 || rnd < 0.5 || uH > 0.3 + 0.7 * (rnd - 0.5) * 2.0 || d > 0.17 * (1.0 - uH * 0.8)) discard;
        `,color:`diffuseColor.rgb *= 0.82 + 0.25 * uH;`}));a.castShadow=!1,a.receiveShadow=!0,a.renderOrder=1,r.add(a)}return r}var fm=class{group=new H;lid=new H;innerR=6.5;floorY=.9;height=19;constructor(){let e=this.height,t=[[1e-4,0],[6.4,0],[7,.5],[7,e-1.4],[6.7,e-.9],[6.7,e-.4],[7.25,e-.25],[7.25,e],[6.35,e],[6.35,e-.9],[this.innerR,e-1.5],[this.innerR,this.floorY+.4],[this.innerR-.4,this.floorY],[1e-4,this.floorY]].map(([e,t])=>new z(e,t)),n=new co({color:`#E6EFE8`,roughness:.05,metalness:0,transparent:!0,opacity:.2,clearcoat:1,clearcoatRoughness:.04,side:2,depthWrite:!1}),r=new W(new Ka(t,64),n);r.renderOrder=3,this.group.add(r);let i=bp({axis:`x`,light:`#9C7A56`,dark:`#5E4632`,seed:31}),a=new W(new G(7.6,7.6,1.4,48),i);a.position.y=.7;let o=new W(new G(6.25,6.2,1.2,40),i);o.position.y=-.55;let s=new W(new G(1.2,1.5,1.6,20),i);s.position.y=2.2;for(let e of[a,o,s])e.castShadow=!0,e.receiveShadow=!0,this.lid.add(e)}},pm=new V(0,1,0),mm=class{w;stage;acts;story;duration;shotList=new gf;lightKeys=[];camS=pf();light=bf(yf.morning);mouse=new z;frame;cues;blanch;constructor(e,t){this.w=e,this.stage=new rm(e),this.acts=t.acts(this.stage);let n=0;for(let e of this.acts)e.start=n,n+=e.dur;this.duration=n,this.story=kf(t,this.acts);for(let e of this.acts){e.shots(this.shotList.adder(e.start));for(let[t,n]of e.lights())this.lightKeys.push([e.start+t,n])}this.blanch=this.acts.find(e=>e instanceof ff),this.w.leaves.build(this.stage),this.cues=_d(this.acts,e=>{this.story.chapters.forEach((t,n)=>{n>0&&e(t.start-.6,`page`,{gain:.8}),e((n===0?.6:t.start)+1.22,`stamp`,{gain:.7})}),e(this.duration-13.6,`page`,{gain:.7});for(let t of this.story.moments)e(t.open+.05,`page`,{gain:.4}),e(t.close-.75,`page`,{gain:.22})}),e.scene.attach(e.hero.pulp),this.frame={post:{focus:100,aperture:.1,maxCoc:9,fade:0},light:this.light,chapter:0,ambience:{boil:0,fire:1,oven:0,day:1,night:0}}}mood={light:bf(yf.morning),k:0};setMouse(e,t){this.mouse.set(e,t)}actAt(e){let t=this.acts;for(let n=t.length-1;n>=0;n--)if(e>=t[n].start)return t[n];return t[0]}rest(){let e=this.w,t=Z,n=e.table;e.stove.strainer.position.set(-171,t.stoveTop+.05,-246),e.stove.strainer.quaternion.setFromEuler(new mn(0,uf,0,`YXZ`)),Ju(e.stove.strainer,!1),n.knife.position.copy(n.knifeRest.pos),n.knife.quaternion.copy(n.knifeRest.quat),n.scraper.position.copy(n.scraperRest.pos),n.scraper.quaternion.copy(n.scraperRest.quat),n.topBoard.position.copy(n.boardRest),n.topBoard.rotation.set(0,.04,0),n.stone.position.copy(n.stoneRest),n.stone.rotation.set(0,.4,0),e.steelyard.set(0,0),e.hero.pulp.visible=!1,e.batch.fruits.visible=!1,e.tai?.show(!1),e.cakes?.show(!1),e.cakes&&(e.cakes.heroGroup.visible=!0,e.cakes.setClip(null)),e.jar&&(e.jar.group.visible=!1,e.jar.lid.visible=!1),e.batch.hidePieces(),e.bundle.group.visible=!1,e.batchSteam.set(e.batchSteam.mesh.position,0),e.heroSteam.set(e.heroSteam.mesh.position,0),e.stove.waterU.uSplash.value.w=0}lightAt(e){let t=this.lightKeys,n=0;for(;n<t.length-1&&e>t[n+1][0];)n++;let[r,i]=t[n],[a,o]=t[Math.min(n+1,t.length-1)],s=a>r?Y(Iu((e-r)/(a-r))):0;return xf(this.light,yf[i],yf[o],s)}veil(e){let t=this.story.chapters,n=1-J(.2,2.4,e);for(let r=1;r<t.length;r++){let i=t[r].start,a=J(i-.75,i-.05,e),o=1-J(i+1.5,i+2.5,e);n=Math.max(n,Math.min(a,o)*.92)}return n=Math.max(n,J(this.duration-3.5,this.duration-.5,e)*.55),n}update(e,t,n){let r=this.w,i=this.stage,a=Z;e=Iu(e,0,this.duration),i.reset();for(let t of this.acts)t.carry(e-t.start);r.hero.update();let o=i.look,s=q(1,.45,o.blanch)+.2*o.dry+.25*o.product;if(Xf(r.hero.material,{blanch:o.blanch,wetGloss:o.wet,dry:o.dry,soak:o.soak,product:o.product,fuzz:s,press:o.press}),r.batch.syncLook(r.hero.material),r.tai){let e=r.tai;lm(e.matHero,{blanch:o.blanch,wet:o.wet,dry:o.dry,fuzz:1}),lm(e.matBlanched,{blanch:o.blanch,wet:o.wet,dry:o.dry,fuzz:1}),lm(e.matRaw,{blanch:0,wet:0,dry:o.dry,fuzz:1}),e.shrink=1-.1*o.dry,e.setHeroLocal()}r.cakes&&r.cakes.sync(o),this.rest();for(let e of this.acts)e.hide();r.drops.begin(),r.shavings.begin();let c=this.actAt(e);c.pose(e-c.start,t),r.drops.end(),r.shavings.end(),r.table.basket.position.copy(i.basketPos),r.table.basket.quaternion.copy(i.basketQuat),r.leaves.update(e,r.table.basket,this.blanch);let l=i.carry;r.stove.waterU.uBoil.value=l.boil,r.stove.steam.set(new V(a.wok.x,r.stove.waterY+1,a.wok.z),.25+l.boil*.85),r.stove.fireI.value=l.fireLow?.6:1,r.stove.fireLight.intensity=l.fireLow?5e3:9e3,r.oven.glowI.value=l.ovenOn,r.oven.light.intensity=l.ovenOn*4200,r.oven.upLight.intensity=l.ovenOn*3200,r.oven.sparks.set(new V(a.oven.x,a.ovenTop+2,a.oven.z),l.ovenOn);let u=l.bulb;r.yard.bulbMat.emissiveIntensity=u*6,r.yard.bulbLight.intensity=u*26e3,r.yard.interiorLight.intensity=l.interior*3e4;let d=this.lightAt(e);this.mood.k>.001&&xf(d,d,this.mood.light,this.mood.k),r.env.apply(d,t+l.lapse),_p.uSunDir.value.copy(d.sun),_p.uSunCol.value.copy(d.sunColor),_p.uWind.value=.8+.4*Math.sin(t*.13);let f=this.shotList.at(e,this.camS),p=f.shake,m=f.az+Wu(t*.23+3)*.6*p+this.mouse.x*2.2,h=f.el+Wu(t*.19+11)*.4*p-this.mouse.y*1.4,g=m*Math.PI/180,_=h*Math.PI/180,v=f.target;n.position.set(v.x+Math.cos(_)*Math.sin(g)*f.dist,v.y+Math.sin(_)*f.dist,v.z+Math.cos(_)*Math.cos(g)*f.dist),n.up.copy(pm),n.lookAt(v),n.fov=f.fov,n.near=Iu(f.dist*.05,.5,10),n.far=3e4,n.updateProjectionMatrix(),r.env.setShadowFocus(v,Iu(f.dist*.75,22,420)),r.dust.set(v,.55*Iu(d.sun.y*3));let y=this.frame,b=this.story.chapters;if(y.chapter=Math.max(0,b.findIndex(t=>e>=t.start&&e<t.end)),e>=this.duration&&(y.chapter=b.length-1),y.post.focus=n.position.distanceTo(v),y.post.aperture=f.ap,y.post.maxCoc=9,y.post.fade=this.veil(e),y.post.bloom=l.bloom,l.haze>0){let e=new V(a.oven.x,a.ovenTop+10,a.oven.z).project(n),t=18/y.post.focus;y.post.haze=new V(e.x*.5+.5,e.y*.5+.5,l.haze*.9),y.post.hazeR=new z(t*.9,t*1.6)}else y.post.haze=new V(0,0,0);y.post.fadeColor=hm;let x=y.ambience;return x.boil=l.boil,x.fire=l.fireLow?.6:1,x.oven=l.ovenOn,x.day=J(1.8,3.2,d.sunI),x.night=1-J(.8,2.6,d.sunI),y}},hm=new U(jd.paper),gm=new qo(-1,1,1,-1,0,1),_m=new class extends Pr{constructor(){super(),this.setAttribute(`position`,new Sr([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute(`uv`,new Sr([0,2,0,0,2,0],2))}},vm=class{constructor(e){this._mesh=new W(_m,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,gm)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}},ym=`
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`,bm=`
vec3 sane(vec3 c) {
  float s = c.r + c.g + c.b;
  return (s >= 0.0 && s < 1.0e5) ? clamp(c, vec3(0.0), vec3(60.0)) : vec3(0.0);
}
`,xm=`
uniform float uNear, uFar;
float viewZ(float d) { return (uNear * uFar) / ((uFar - uNear) * d - uFar); }
`,Sm=new ao({uniforms:{tColor:{value:null},tDepth:{value:null},uNear:{value:1},uFar:{value:1e3},uFocus:{value:100},uAperture:{value:.5},uMaxCoc:{value:10},uTexel:{value:new z}},vertexShader:ym,fragmentShader:`
    uniform sampler2D tColor, tDepth;
    uniform float uFocus, uAperture, uMaxCoc;
    uniform vec2 uTexel;
    varying vec2 vUv;
    ${xm}
    ${bm}
    void main() {
      vec2 o = uTexel * 0.5;
      vec3 c = sane(texture2D(tColor, vUv + vec2(-o.x, -o.y)).rgb) + sane(texture2D(tColor, vUv + vec2(o.x, -o.y)).rgb)
             + sane(texture2D(tColor, vUv + vec2(-o.x, o.y)).rgb) + sane(texture2D(tColor, vUv + vec2(o.x, o.y)).rgb);
      c *= 0.25;
      float d = texture2D(tDepth, vUv).x;
      float z = -viewZ(d);
      float coc = clamp(uAperture * (z - uFocus) / z, -1.0, 1.0) * uMaxCoc;
      gl_FragColor = vec4(min(c, vec3(60.0)), coc);
    }
  `,depthTest:!1,depthWrite:!1}),Cm=new ao({uniforms:{tCoc:{value:null},uTexel:{value:new z},uMaxCoc:{value:10}},vertexShader:ym,fragmentShader:`
    uniform sampler2D tCoc;
    uniform vec2 uTexel;
    uniform float uMaxCoc;
    varying vec2 vUv;
    const float GOLDEN = 2.39996323;
    const float RAD_SCALE = 0.7;
    void main() {
      vec4 c = texture2D(tCoc, vUv);
      float centerSize = abs(c.a);
      vec3 color = c.rgb;
      float tot = 1.0;
      float radius = RAD_SCALE;
      float ang = 0.0;
      for (int i = 0; i < 120; i++) {
        if (radius >= uMaxCoc) break;
        vec2 tc = vUv + vec2(cos(ang), sin(ang)) * uTexel * radius;
        vec4 s = texture2D(tCoc, tc);
        float sampleSize = abs(s.a);
        if (s.a > c.a) sampleSize = clamp(sampleSize, 0.0, centerSize * 2.0);
        float m = smoothstep(radius - 0.5, radius + 0.5, sampleSize);
        color += mix(color / tot, s.rgb, m);
        tot += 1.0;
        radius += RAD_SCALE / radius;
        ang += GOLDEN;
      }
      gl_FragColor = vec4(color / tot, centerSize);
    }
  `,depthTest:!1,depthWrite:!1}),wm=new ao({uniforms:{tSrc:{value:null},uThreshold:{value:1.2},uKnee:{value:.6}},vertexShader:ym,fragmentShader:`
    uniform sampler2D tSrc;
    uniform float uThreshold, uKnee;
    varying vec2 vUv;
    void main() {
      vec3 c = texture2D(tSrc, vUv).rgb;
      float br = max(c.r, max(c.g, c.b));
      float soft = clamp(br - uThreshold + uKnee, 0.0, 2.0 * uKnee);
      soft = soft * soft / (4.0 * uKnee + 1e-4);
      float w = max(soft, br - uThreshold) / max(br, 1e-4);
      gl_FragColor = vec4(c * w, 1.0);
    }
  `,depthTest:!1,depthWrite:!1}),Tm=new ao({uniforms:{tSrc:{value:null},uTexel:{value:new z}},vertexShader:ym,fragmentShader:`
    uniform sampler2D tSrc;
    uniform vec2 uTexel;
    varying vec2 vUv;
    void main() {
      vec2 h = uTexel * 0.5;
      vec3 s = texture2D(tSrc, vUv).rgb * 4.0;
      s += texture2D(tSrc, vUv - h).rgb;
      s += texture2D(tSrc, vUv + h).rgb;
      s += texture2D(tSrc, vUv + vec2(h.x, -h.y)).rgb;
      s += texture2D(tSrc, vUv - vec2(h.x, -h.y)).rgb;
      gl_FragColor = vec4(s / 8.0, 1.0);
    }
  `,depthTest:!1,depthWrite:!1}),Em=new ao({uniforms:{tSrc:{value:null},tAdd:{value:null},uTexel:{value:new z},uMix:{value:.7}},vertexShader:ym,fragmentShader:`
    uniform sampler2D tSrc, tAdd;
    uniform vec2 uTexel;
    uniform float uMix;
    varying vec2 vUv;
    void main() {
      vec2 h = uTexel * 0.5;
      vec3 s = texture2D(tSrc, vUv + vec2(-h.x * 2.0, 0.0)).rgb;
      s += texture2D(tSrc, vUv + vec2(-h.x, h.y)).rgb * 2.0;
      s += texture2D(tSrc, vUv + vec2(0.0, h.y * 2.0)).rgb;
      s += texture2D(tSrc, vUv + vec2(h.x, h.y)).rgb * 2.0;
      s += texture2D(tSrc, vUv + vec2(h.x * 2.0, 0.0)).rgb;
      s += texture2D(tSrc, vUv + vec2(h.x, -h.y)).rgb * 2.0;
      s += texture2D(tSrc, vUv + vec2(0.0, -h.y * 2.0)).rgb;
      s += texture2D(tSrc, vUv + vec2(-h.x, -h.y)).rgb * 2.0;
      s /= 12.0;
      gl_FragColor = vec4(mix(texture2D(tAdd, vUv).rgb, s, uMix) , 1.0);
    }
  `,depthTest:!1,depthWrite:!1}),Dm=new ao({uniforms:{tColor:{value:null},tDepth:{value:null},tBlur:{value:null},tBloom:{value:null},tAO:{value:null},uNear:{value:1},uFar:{value:1e3},uFocus:{value:100},uAperture:{value:.5},uMaxCoc:{value:10},uBloom:{value:.25},uAO:{value:.85},uExposure:{value:1},uTime:{value:0},uRes:{value:new z},uShadowTint:{value:new U(`#6E6278`)},uLift:{value:.1},uWarm:{value:new U(`#FFF1DC`)},uVignette:{value:.35},uGrain:{value:.035},uSat:{value:1.08},uHaze:{value:new V(.5,.5,0)},uHazeR:{value:new z(.1,.2)},uFade:{value:0},uFadeColor:{value:new U(`#F2E9D8`)}},vertexShader:ym,fragmentShader:`
    uniform sampler2D tColor, tDepth, tBlur, tBloom, tAO;
    uniform float uFocus, uAperture, uMaxCoc, uBloom, uExposure, uTime, uLift, uVignette, uGrain, uSat, uFade, uAO;
    uniform vec2 uRes, uHazeR;
    uniform vec3 uShadowTint, uWarm, uHaze, uFadeColor;
    varying vec2 vUv;
    ${xm}
    ${bm}

    const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(vec3(1.6605, -0.1246, -0.0182), vec3(-0.5876, 1.1329, -0.1006), vec3(-0.0728, -0.0083, 1.1187));
    const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(vec3(0.6274, 0.0691, 0.0164), vec3(0.3293, 0.9195, 0.0880), vec3(0.0433, 0.0113, 0.8956));
    vec3 agxContrast(vec3 x) {
      vec3 x2 = x * x; vec3 x4 = x2 * x2;
      return 15.5 * x4 * x2 - 40.14 * x4 * x + 31.96 * x4 - 6.868 * x2 * x + 0.4298 * x2 + 0.1191 * x - 0.00232;
    }
    vec3 agx(vec3 color) {
      const mat3 inset = mat3(vec3(0.856627153315983, 0.137318972929847, 0.11189821299995), vec3(0.0951212405381588, 0.761241990602591, 0.0767994186031903), vec3(0.0482516061458583, 0.101439036467562, 0.811302368396859));
      const mat3 outset = mat3(vec3(1.1271005818144368, -0.1413297634984383, -0.14132976349843826), vec3(-0.11060664309660323, 1.157823702216272, -0.11060664309660294), vec3(-0.016493938717834573, -0.016493938717834257, 1.2519364065950405));
      const float minEv = -12.47393;
      const float maxEv = 4.026069;
      color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
      color = inset * color;
      color = max(color, 1e-10);
      color = log2(color);
      color = (color - minEv) / (maxEv - minEv);
      color = clamp(color, 0.0, 1.0);
      color = agxContrast(color);
      color = outset * color;
      color = pow(max(vec3(0.0), color), vec3(2.2));
      color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
      return clamp(color, 0.0, 1.0);
    }
    vec3 toSRGB(vec3 c) { return mix(pow(c, vec3(0.41666)) * 1.055 - 0.055, c * 12.92, vec3(lessThanEqual(c, vec3(0.0031308)))); }
    float hash12(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
    float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash12(i), hash12(i + vec2(1, 0)), f.x), mix(hash12(i + vec2(0, 1)), hash12(i + vec2(1, 1)), f.x), f.y); }

    void main() {
      vec2 uv = vUv;
      // 热浪：焙炉上方一小块轻轻扭
      if (uHaze.z > 0.001) {
        vec2 d = (uv - uHaze.xy) / uHazeR;
        float m = exp(-dot(d, d)) * uHaze.z;
        if (m > 0.002) {
          vec2 q = uv * vec2(uRes.x / uRes.y, 1.0) * 18.0;
          float n1 = vn(q + vec2(0.0, uTime * 3.0)) - 0.5;
          float n2 = vn(q * 1.7 + vec2(5.0, uTime * 4.3)) - 0.5;
          uv += vec2(n1, n2) * 0.006 * m;
        }
      }
      vec3 sharp = sane(texture2D(tColor, uv).rgb);
      float z = -viewZ(texture2D(tDepth, uv).x);
      float coc = abs(clamp(uAperture * (z - uFocus) / z, -1.0, 1.0) * uMaxCoc);
      vec4 blur = texture2D(tBlur, uv);
      float t = smoothstep(0.35, 1.6, max(coc, blur.a));
      // 对焦清楚的地方很轻地锐化一下（四邻平均做反差）；锐化会把细碎的闪烁一起放大，所以只给一点点
      {
        vec2 px = 1.0 / uRes;
        vec3 nb = sane(texture2D(tColor, uv + vec2(px.x, 0.0)).rgb) + sane(texture2D(tColor, uv - vec2(px.x, 0.0)).rgb)
                + sane(texture2D(tColor, uv + vec2(0.0, px.y)).rgb) + sane(texture2D(tColor, uv - vec2(0.0, px.y)).rgb);
        vec3 edge = sharp - nb * 0.25;
        sharp = max(sharp + clamp(edge, -0.04, 0.04) * 0.25 * (1.0 - t), 0.0);
      }
      vec3 c = mix(sharp, blur.rgb, t);
      // 环境光遮蔽：角落、接缝、贴桌面的地方压暗；景深糊掉的地方淡出（免得糊块里有暗斑）
      float ao = texture2D(tAO, uv).r;
      c *= mix(1.0, ao, uAO * (1.0 - t * 0.75));
      c += texture2D(tBloom, uv).rgb * uBloom;
      c = agx(c * uExposure);
      c = toSRGB(c);
      // 轻轻的 S 曲线：暗处实一点、亮处透一点
      c = mix(c, c * c * (3.0 - 2.0 * c), 0.22);
      float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
      // 饱和度
      c = mix(vec3(l), c, uSat);
      // 暗部抬一点、偏影紫；亮部偏暖
      c = mix(c, uShadowTint, (1.0 - smoothstep(0.0, 0.5, l)) * uLift);
      c *= mix(vec3(1.0), uWarm, smoothstep(0.35, 1.0, l));
      // 暗角，偏暖褐
      vec2 q = vUv - 0.5;
      q.x *= uRes.x / uRes.y;
      float v = smoothstep(0.35, 1.05, length(q));
      c = mix(c, c * vec3(0.62, 0.52, 0.55), v * uVignette);
      // 胶片颗粒
      float g = hash12(vUv * uRes + fract(uTime * 13.7) * 91.0) - 0.5;
      c += g * uGrain * (0.6 + 0.4 * (1.0 - l));
      c = mix(c, uFadeColor, uFade);
      gl_FragColor = vec4(c, 1.0);
    }
  `,depthTest:!1,depthWrite:!1}),Om=new ao({uniforms:{tDepth:{value:null},uProj:{value:new rn},uProjInv:{value:new rn},uTexel:{value:new z},uRes:{value:new z},uRadius:{value:45},uBias:{value:.06},uNear:{value:1},uFar:{value:1e3}},vertexShader:ym,fragmentShader:`
    uniform sampler2D tDepth;
    uniform mat4 uProj, uProjInv;
    uniform vec2 uTexel, uRes;
    uniform float uRadius, uBias;
    varying vec2 vUv;
    ${xm}

    /** 由深度反投影到相机空间 */
    vec3 viewPos(vec2 uv) {
      float d = texture2D(tDepth, uv).x;
      vec4 c = vec4(uv * 2.0 - 1.0, d * 2.0 - 1.0, 1.0);
      vec4 v = uProjInv * c;
      return v.xyz / v.w;
    }
    float hash12(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }

    void main() {
      float d = texture2D(tDepth, vUv).x;
      // 天空不做
      if (d >= 0.9999) { gl_FragColor = vec4(1.0); return; }
      vec3 p = viewPos(vUv);
      // 法线：中心差分叉乘。uv 向右/向上各走一格，叉出来就是朝相机的法线
      vec3 qx = viewPos(vUv + vec2(uTexel.x, 0.0));
      vec3 qy = viewPos(vUv + vec2(0.0, uTexel.y));
      vec3 nrm = normalize(cross(qx - p, qy - p));
      if (nrm.z < 0.0) nrm = -nrm;
      // 轮廓边上（前后两层几何叠在同一个像素左右）重建出来的法线是噪声，退回"正对相机"那条
      float dz = max(abs(qx.z - p.z), abs(qy.z - p.z));
      if (dz > 0.06 * max(abs(p.z), 1.0)) nrm = vec3(0.0, 0.0, 1.0);

      // 45 厘米的半径投影到屏幕上会有多少像素：远处小、近处大
      float tanHalf = 1.0 / max(uProj[1][1], 1e-6);
      float pxPerCm = 0.5 * uRes.y / (max(abs(p.z), 1.0) * tanHalf);
      float rpx = clamp(uRadius * pxPerCm, 3.0, 64.0);

      float rot = hash12(floor(vUv * uRes)) * 6.2831853;
      float occ = 0.0;
      float tot = 0.0;
      for (int i = 0; i < 8; i++) {
        float a = float(i) * 0.785398 + rot;
        for (int k = 1; k <= 2; k++) {
          vec2 o = vec2(cos(a), sin(a)) * uTexel * (rpx * float(k) * 0.55);
          vec3 dv = viewPos(vUv + o) - p;
          float len = length(dv);
          // 邻居必须在本点法线的正方向（半球内）才算挡住；再按距离衰减
          float ndl = dot(nrm, dv / max(len, 1e-5)) - uBias;
          float fall = 1.0 - smoothstep(0.45 * uRadius, uRadius, len);
          occ += clamp(ndl, 0.0, 1.0) * fall;
          tot += 1.0;
        }
      }
      float ao = 1.0 - clamp(occ / max(tot, 1.0), 0.0, 1.0) * 1.8;
      gl_FragColor = vec4(vec3(clamp(ao, 0.0, 1.0)), 1.0);
    }
  `,depthTest:!1,depthWrite:!1}),km=new ao({uniforms:{tAO:{value:null},uTexel:{value:new z}},vertexShader:ym,fragmentShader:`
    uniform sampler2D tAO;
    uniform vec2 uTexel;
    varying vec2 vUv;
    void main() {
      float s = 0.0;
      float w = 0.0;
      for (int y = -2; y <= 2; y++)
        for (int x = -2; x <= 2; x++) {
          float k = 3.0 - abs(float(x)) - abs(float(y));
          s += texture2D(tAO, vUv + vec2(float(x), float(y)) * uTexel).r * k;
          w += k;
        }
      gl_FragColor = vec4(vec3(s / w), 1.0);
    }
  `,depthTest:!1,depthWrite:!1}),Am=class{renderer;scene;aoStrength=.85;coc;blur;ssao;ssaoBlur;down=[];up=[];quad=new vm;size=new z;levels=6;constructor(e){this.renderer=e;let t=new xi(1,1,g);this.scene=new en(1,1,{type:v,samples:4,depthTexture:t});let n={type:v,minFilter:c,magFilter:c,depthBuffer:!1};this.coc=new en(1,1,n),this.blur=new en(1,1,n),this.ssao=new en(1,1,n),this.ssaoBlur=new en(1,1,n);for(let e=0;e<this.levels;e++)this.down.push(new en(1,1,n)),this.up.push(new en(1,1,n))}setSize(e,t){if(e=Math.max(2,Math.floor(e)),t=Math.max(2,Math.floor(t)),this.size.x===e&&this.size.y===t)return;this.size.set(e,t),this.scene.setSize(e,t);let n=Math.ceil(e/2),r=Math.ceil(t/2);this.coc.setSize(n,r),this.blur.setSize(n,r),this.ssao.setSize(n,r),this.ssaoBlur.setSize(n,r);let i=n,a=r;for(let e=0;e<this.levels;e++)this.down[e].setSize(i,a),this.up[e].setSize(i,a),i=Math.max(1,Math.ceil(i/2)),a=Math.max(1,Math.ceil(a/2))}pass(e,t){this.quad.material=e,this.renderer.setRenderTarget(t),this.quad.render(this.renderer)}render(e,t,n,r){let i=this.renderer;i.setRenderTarget(this.scene),i.clear(),i.render(e,t);let[a,o]=[this.size.x,this.size.y],s=this.coc.width,c=this.coc.height,l=t.near,u=t.far,d=n.maxCoc*(c/540),f=this.ssao.width,p=this.ssao.height,m=Om.uniforms;m.tDepth.value=this.scene.depthTexture,m.uProj.value.copy(t.projectionMatrix),m.uProjInv.value.copy(t.projectionMatrixInverse),m.uTexel.value.set(1/f,1/p),m.uRes.value.set(f,p),m.uNear.value=l,m.uFar.value=u,this.pass(Om,this.ssao),km.uniforms.tAO.value=this.ssao.texture,km.uniforms.uTexel.value.set(1/f,1/p),this.pass(km,this.ssaoBlur);let h=Sm.uniforms;h.tColor.value=this.scene.texture,h.tDepth.value=this.scene.depthTexture,h.uNear.value=l,h.uFar.value=u,h.uFocus.value=n.focus,h.uAperture.value=n.aperture,h.uMaxCoc.value=d,h.uTexel.value.set(1/a,1/o),this.pass(Sm,this.coc);let g=Cm.uniforms;g.tCoc.value=this.coc.texture,g.uTexel.value.set(1/s,1/c),g.uMaxCoc.value=Math.max(1,d*Math.min(1,Math.abs(n.aperture)*4+.25)),this.pass(Cm,this.blur),wm.uniforms.tSrc.value=this.coc.texture,this.pass(wm,this.down[0]);for(let e=1;e<this.levels;e++)Tm.uniforms.tSrc.value=this.down[e-1].texture,Tm.uniforms.uTexel.value.set(1/this.down[e-1].width,1/this.down[e-1].height),this.pass(Tm,this.down[e]);let _=this.down[this.levels-1];for(let e=this.levels-2;e>=0;e--)Em.uniforms.tSrc.value=_.texture,Em.uniforms.tAdd.value=this.down[e].texture,Em.uniforms.uTexel.value.set(1/_.width,1/_.height),Em.uniforms.uMix.value=.62,this.pass(Em,this.up[e]),_=this.up[e];let v=Dm.uniforms;v.tColor.value=this.scene.texture,v.tDepth.value=this.scene.depthTexture,v.tBlur.value=this.blur.texture,v.tBloom.value=this.up[0].texture,v.uNear.value=l,v.uFar.value=u,v.uFocus.value=n.focus,v.uAperture.value=n.aperture,v.uMaxCoc.value=d*2,v.uBloom.value=n.bloom,v.tAO.value=this.ssaoBlur.texture,v.uAO.value=this.aoStrength,v.uExposure.value=n.exposure,v.uTime.value=r,v.uRes.value.set(a,o),v.uLift.value=n.lift,v.uVignette.value=n.vignette,v.uGrain.value=n.grain,v.uSat.value=n.sat,v.uShadowTint.value.copy(n.shadowTint),v.uWarm.value.copy(n.warm),v.uHaze.value.copy(n.haze),v.uHazeR.value.copy(n.hazeR),v.uFade.value=n.fade,v.uFadeColor.value.copy(n.fadeColor),this.pass(Dm,null)}},jm=(e,t,n)=>new V(e,t,n),Mm=new V(0,1,0),Nm=new V(1,0,0),Pm=new V(0,0,1),Fm={hiss:.8,flipA:9.15,flipALand:10.55,lift:18.05},Im=class extends Xd{q=new B;slots;constructor(e,t=`bake`){super(e,t,26),this.slots=mp(e.w.hero.n)}shots(e){let t=Z,n=this.s,r=jm(t.oven.x,t.ovenTop+1,t.oven.z),i=jm(t.oven.x+this.slots[0].x,t.ovenTop+1,t.oven.z+this.slots[0].z);e(0,12,{target:jm(r.x,r.y-6,r.z),dist:118,az:18,el:30,fov:32,ap:.1},{target:jm(r.x,r.y-4,r.z),dist:100,az:28,el:34,fov:32,ap:.12}),e(12,18,{target:i,dist:44,az:30,el:44,fov:30,ap:.3},{target:i,dist:40,az:12,el:48,fov:30,ap:.32},1.2),e(18,26,{target:n.follow(.5),dist:32,az:34,el:32,fov:30,ap:.46},{target:n.follow(.5),dist:28,az:58,el:28,fov:30,ap:.48},1.4)}lights(){return[[0,`dusk`]]}carry(e){let t=this.s;t.look.soak*=1-J(2,15,e),t.look.product=J(3,17,e);let n=t.carry;n.ovenOn=Math.max(n.ovenOn,J(-1,0,e)),n.bloom=q(.2,.42,J(-2,2,e)),n.haze=Math.max(n.haze,J(-1,1,e)*(1-J(this.dur-.5,this.dur,e)))}sounds(e){let t=Z,n=jm(t.oven.x+this.slots[0].x,t.ovenTop,t.oven.z+this.slots[0].z);e(Fm.hiss,`hiss`,{dur:5,gain:.55,at:n}),e(Fm.flipA,`flip`,{gain:.45,at:n}),e(Fm.flipALand,`tap`,{gain:.35,pitch:.75,at:n}),e(Fm.lift,`flip`,{gain:.3,at:n})}pose(e){let t=this.s,n=t.w,r=Z,i=this.slots[0],a=t.heroPos,o=t.heroQuat;a.set(r.oven.x+i.x,r.ovenTop+.02,r.oven.z+i.z);let s=Y(X(e,9,10.6));a.y+=Math.sin(Math.PI*s)*10+s*(rp+.02);let c=Y(X(e,18,19.8));a.y+=c*14;let l=c*(e-18)*.08;o.setFromAxisAngle(Mm,i.yaw),o.premultiply(this.q.setFromAxisAngle(Pm,s*Math.PI)),o.premultiply(this.q.setFromAxisAngle(Mm,l)),o.premultiply(this.q.setFromAxisAngle(Nm,c*.55)),t.applyHero();let u=new V;for(let e=1;e<10;e++){let t=this.slots[e];n.batch.setPiece(e,n.hero.geometry,u.set(r.oven.x+t.x,r.ovenTop+.02,r.oven.z+t.z),t.yaw)}let d=J(1,3,e)*(1-J(8,16,e))*.5;n.heroSteam.set(u.set(0,.8,0).applyQuaternion(o).add(a),d)}},Lm=(e,t,n)=>new V(e,t,n),Rm={heroLand:5.27,bulb:11.2},zm=class extends Xd{constructor(e,t=`bundle`){super(e,t,30)}shots(e){let t=Z,n=Lm(t.tray.x,t.tableTop+4,t.tray.z);e(0,12,{target:n,dist:46,az:-4,el:56,fov:30,ap:.3},{target:n,dist:38,az:14,el:48,fov:30,ap:.34}),e(12,this.dur+2,{target:Lm(n.x,n.y+2,n.z),dist:40,az:16,el:46,fov:30,ap:.3},{target:Lm(n.x+10,n.y+30,n.z-30),dist:170,az:70,el:18,fov:34,ap:.14},1.6,Ru)}lights(){return[[10,`dusk`],[24,`evening`]]}carry(e){let t=this.s.carry;t.bulb=Math.max(t.bulb,J(11.2,11.5,e)),t.interior=Math.max(t.interior,J(11.4,12.6,e))}sounds(e){let t=Z,n=Lm(t.tray.x,t.tableTop+2,t.tray.z);for(let t=0;t<9;t++)e(.6+(t+1)*.42-.03,`tap`,{gain:.3,pitch:.7+.03*t,at:n});e(Rm.heroLand,`tap`,{gain:.35,pitch:.75,at:n});let r=this.s.w.bundle.loops.length;for(let t=0;t<r;t++)e(5.8+4.368*t/r+.05,`rope`,{dur:4.368/r*.9,gain:.6,at:n});e(10.272,`cinch`,{gain:.6,at:n}),e(10.792,`cinch`,{gain:.45,at:n}),e(Rm.bulb,`click`,{gain:.5,at:t.bulb})}pose(e){let t=this.s,n=t.w.bundle,r=n.group.position.y+n.heroY,i=Y(X(e,4.5,5.3));t.heroPos.set(Z.tray.x,r+(1-i)*18,Z.tray.z),t.heroQuat.setFromAxisAngle(new V(0,1,0),(1-i)*.9),t.applyHero(),n.update(Iu((e-.6)/.42,0,9),X(e,5.8,11),null),n.group.visible=!0}},Bm=(e,t,n)=>new V(e,t,n),Vm=Af.ALPHA_C,Hm=1.6,Um={open:16.2,knifeBack:16.76,pulpOut:18.2,pulpRustle:20.4,pulpBowl:20.78,scraperBack:37.36},Wm=class extends Xd{phiK=.5;n;dth;cutDur;scrapeStep;e=new mn;m=new rn;a=new V;b=new V;constructor(e,t=`cut`){super(e,t,50),this.n=e.w.hero.n,this.dth=Fu/this.n,this.cutDur=this.n===7?1.6:9.6/(this.n-1),this.scrapeStep=this.n===7?1.55:10.85/this.n}shots(e){let t=Z.board,n=Bm(t.x,t.y+3.6,t.z);e(0,15.6,{target:n,dist:40,az:22,el:20,fov:30,ap:.36},{target:n,dist:35,az:34,el:26,fov:30,ap:.4}),e(15.6,22.6,{target:Bm(t.x,t.y+2.5,t.z),dist:42,az:40,el:40,fov:32,ap:.32},{target:Bm(t.x,t.y+1.5,t.z),dist:46,az:52,el:54,fov:32,ap:.3},1.2),e(22.6,37,{target:Bm(t.x,t.y+.5,t.z),dist:40,az:30,el:64,fov:32,ap:.26},{target:Bm(t.x,t.y+.5,t.z),dist:38,az:10,el:68,fov:32,ap:.26},1.2),e(37,50,{target:Bm(t.x,t.y+.4,t.z),dist:30,az:-24,el:26,fov:28,ap:.4},{target:Bm(t.x,t.y+.4,t.z),dist:26,az:-58,el:18,fov:28,ap:.44},1.6)}lights(){return[[0,`forenoon`]]}cutYaw(e){return e*this.dth+this.dth/2-this.phiK}cutWindow(e){let t=3.6+(e===0?0:2.1+(e-1)*this.cutDur),n=e===0?2.1:this.cutDur;return{start:t,sliceA:t+.3,sliceB:t+n-.65,outB:t+n-.4,end:t+n}}scrapeStart(e){return 23.8+e*this.scrapeStep}get hubAt(){return this.scrapeStart(this.n)+.15}carry(e){let t=this.s.w.hero.state;for(let n=0;n<this.n;n++){let r=this.cutWindow(n);t.cut[n]=J(r.sliceA,r.sliceB,e);let i=J(16.2+n*.1,17.9+n*.1,e),a=J(20.4+n*.06,22.4+n*.06,e);t.open[n]=zu(i)*.58+Ru(a)*.42,t.scrape[n]=J(this.scrapeStart(n),this.scrapeStart(n)+1.25,e)}t.cap=J(16.2,22.4,e),t.hub=J(this.hubAt,this.hubAt+1,e),this.s.look.wet*=1-J(2,20,e)}sounds(e){let t=Z;for(let t=0;t<this.n;t++){let n=this.cutWindow(t);e(n.sliceA,`slice`,{dur:n.sliceB-n.sliceA,gain:.75,pitch:.95+.04*(t*3%4)})}e(Um.knifeBack,`tap`,{gain:.3,pitch:1.4,at:t.knifeRest}),e(Um.open,`rustle`,{dur:1.6,gain:.25,pitch:.6}),e(Um.pulpOut,`squish`,{gain:.65}),e(Um.pulpBowl,`bowl`,{gain:.55,at:t.bowl}),e(Um.pulpRustle,`rustle`,{dur:1.8,gain:.18,pitch:.55});for(let t=0;t<this.n;t++){let n=this.scrapeStart(t);e(n,`scrape`,{dur:1.25,gain:.75,pitch:.9+.03*(t*5%7)});for(let t=0;t<4;t++)e(n+(t+.5)/4*1.25+.55,`tap`,{gain:.1,pitch:1.6})}e(this.hubAt,`scrape`,{dur:1,gain:.55,pitch:.85}),e(Um.scraperBack,`tap`,{gain:.3,pitch:1.3,at:t.scraperRest})}heroPose(e,t,n){let r=Z;t.set(r.board.x,r.board.y,r.board.z);let i=this.cutYaw(0);for(let t=0;t<this.n;t++){let n=this.cutWindow(t);e>=n.outB&&(i=this.cutYaw(Math.min(t+1,this.n))-(1-Y(X(e,n.outB,n.end)))*this.dth)}i+=Y(X(e,37,50))*.5,this.e.set(0,i,0),n.setFromEuler(this.e)}knifeLocal(e){let t=this.s.R,n=new V,r=new B,i=e=>e*this.dth+this.dth/2,a=0;for(let t=0;t<this.n;t++)e>=this.cutWindow(t).start&&(a=t);let o=this.cutWindow(a),s=(e,a,o)=>{let s=i(e),c=Math.sin(a),l=Math.cos(a),u=this.a.set(c*Math.cos(s),-l,c*Math.sin(s)),d=this.b.set(l*Math.cos(s),c,l*Math.sin(s)),f=new V(-Math.sin(s),0,Math.cos(s)).negate(),p=new V().addScaledVector(d,.55).addScaledVector(u,.83).normalize(),m=new V().crossVectors(f,p).normalize();this.m.makeBasis(p,m,f),r.setFromRotationMatrix(this.m);let h=t-Af.TH0*.6+o;n.set(h*c*Math.cos(s),t-h*l,h*c*Math.sin(s)),n.addScaledVector(p,o*.4)},c=this.n-1;if(e<o.sliceA){let t=Y(X(e,o.start,o.sliceA));s(a,Math.PI-.02,(1-t)*4+0)}else if(e<o.sliceB){let t=J(o.sliceA,o.sliceB,e);s(a,Math.PI-(Math.PI-Vm)*t,0)}else if(e<o.outB){let t=Y(X(e,o.sliceB,o.outB));s(a,Vm+t*.25,t*5)}else{let t=Y(X(e,o.outB,o.end));s(Math.min(a+1,c),q(Vm+.25,Math.PI-.02,t),q(5,4,t)+Math.sin(Math.PI*t)*3),a===c&&s(c,Vm+.25+t*.3,5+t*6)}return{p:n,q:r}}scraperLocal(e){let t=this.s.w.hero,n=new V,r=new B,i=0;for(let t=0;t<this.n;t++)e>=this.scrapeStart(t)-.3&&(i=t);let a=this.scrapeStart(i),o=Iu(t.state.scrape[i]),s=Iu(q(Vm*.85,Math.PI+.25,o)-.08,Vm*.8,Math.PI-.15),c=0;if(e<a){let t=Y(X(e,a-.3,a));s=Vm*.85,c=1.6*(1-t)}else o>=1&&(c=Y(X(e,a+1.25,a+this.scrapeStep))*1.6,s=Math.PI-.15);let l=i,u=this.hubAt;if(e>u-.2){l=0;let t=X(e,u,u+1);s=q(.1,Vm*.95,t),c=(1-Y(X(e,u-.3,u)))*1.5}t.innerCenter(l,s,n),n.y+=.04+c;let d=l*this.dth;return this.e.set(0,-(d+Math.PI),.2,`YZX`),r.setFromEuler(this.e),{p:n,q:r}}toolPose(e,t,n,r,i,a,o){this.m.compose(t.p,t.q,this.a.set(1,1,1)),this.m.premultiply(this.s.w.hero.group.matrixWorld);let s=new V,c=new B;this.m.decompose(s,c,this.a),i<1?(Gu(e.position,n,s,i,o),e.quaternion.slerpQuaternions(r,c,Y(i))):a>0?(Gu(e.position,s,n,a,o),e.quaternion.slerpQuaternions(c,r,Y(a))):(e.position.copy(s),e.quaternion.copy(c))}pose(e){let t=this.s,n=t.w,r=Z,i=t.R,a=n.hero,o=n.table;this.heroPose(e,t.heroPos,t.heroQuat),t.applyHero(),t.fruitsInBasket(),e>=1.4&&e<=16.8&&this.toolPose(o.knife,this.knifeLocal(e),o.knifeRest.pos,o.knifeRest.quat,J(1.4,3.4,e),J(15.4,16.8,e),10),e>=22.4&&e<=37.4&&this.toolPose(o.scraper,this.scraperLocal(e),o.scraperRest.pos,o.scraperRest.quat,J(22.4,23.7,e),J(36,37.4,e),8);let s=a.pulp,c=new V(0,i,0).applyMatrix4(a.group.matrixWorld),l=Bm(r.bowl.x,r.bowl.y+4.4,r.bowl.z),u=X(e,18.2,20.8);if(e<18.2)s.position.copy(c);else if(u<1){let e=c.clone().add(Bm(0,6,0));u<.3?s.position.lerpVectors(c,e,Y(u/.3)):Gu(s.position,e,l,(u-.3)/.7,6)}else s.position.copy(l);if(s.visible=e>12,s.rotation.set(0,u*2,u*.6),e>this.scrapeStart(0)){let t=n.shavings,r=Vm,i=new V,o=new B;this.heroPose(30,i,o);let s=new rn().compose(i,o,new V(1,1,1)),c=2*Math.atan2(o.y,o.w),l=new V,u=new V;for(let n=0;n<this.n;n++){let i=this.scrapeStart(n);for(let o=0;o<4;o++){let d=e-(i+(o+.5)/4*1.25);if(d<0)continue;let f=1-J(Hm,4,d);if(f<=.002)continue;let p=(o+.5)/4;a.innerCenter(n,q(r*.9,Math.PI*.92,p),l),l.y+=.2;let m=Hu(n*13+o)<.5?-1:1,h=n*this.dth+m*this.dth*.5+(Hu(n*7+o*3)-.5)*.12,g=7.6+3*Hu(n*5+o),_=Y(Iu(d/.6));u.set(q(l.x,Math.cos(h)*g,_),q(l.y,.32,_)+Math.sin(Math.PI*_)*1.2,q(l.z,Math.sin(h)*g,_)),u.applyMatrix4(s),t.add(u,(Hu(o+n*9)-.5)*.3,c-h+(Hu(n+o)-.5)*.5,(Hu(o*3+n)-.5)*.3,.75+.4*Hu(n*31+o),f)}}}}},Gm=(e,t,n)=>new V(e,t,n);function Km(e,t,n,r){let i=Z.tableTop+22,a=Gm(t.x,Math.max(i,t.y),t.z),o=Gm(n.x,Math.max(i,n.y),n.z);return r<.4?e.lerpVectors(t,a,Y(r/.4)):r<.8?e.lerpVectors(a,o,Y((r-.4)/.4)):e.lerpVectors(o,n,Y((r-.8)/.2)),e}function qm(e,t){let n=Z,r=Gm(n.press.x,n.press.y+4,n.press.z),[i,,a,,,o]=t.board,[,s,,c]=t.stone;e(i+.05,`slide`,{dur:.35,gain:.2,pitch:.45,at:n.boardRest}),e(a-.02,`knock`,{gain:.75,at:r}),e(s-.02,`stone`,{gain:.75,at:r}),e(c-.02,`stone`,{gain:.5,pitch:.9,at:n.stoneRest}),e(o-.02,`knock`,{gain:.5,pitch:.85,at:n.boardRest})}function Jm(e){return Z.press.y+e+1.2}function Ym(e,t,n){let r=Z,i=e.w.table,[a,o,s,c,l,u]=n.board,d=i.boardRest,f=Gm(r.press.x,r.press.y+13,r.press.z),p=typeof n.gap==`number`?n.gap:n.gap(t),m=Gm(r.press.x,Jm(p),r.press.z),h=i.topBoard;t<a?h.position.copy(d):t<o?Km(h.position,d,f,X(t,a,o)):t<s?h.position.lerpVectors(f,m,Bu(X(t,o,s))):t<c?h.position.copy(m):t<l?h.position.lerpVectors(m,f,zu(X(t,c,l))):Km(h.position,f,d,X(t,l,u));let g=h.position.y,[_,v,y,b]=n.stone,x=i.stoneRest,S=Gm(r.press.x+1,g+1.2,r.press.z),C=i.stone;t<_?C.position.copy(x):t<v?Km(C.position,x,S,X(t,_,v)):t<y?C.position.copy(S):t<b?Km(C.position,S,x,X(t,y,b)):C.position.copy(x)}var Xm=(e,t,n)=>new V(e,t,n),Zm=new V(0,1,0),Qm={turnOver:9.6,tipFold:9.7,foldIn:10.4,toPress:14.35},$m=class extends Xd{tips;slots;constructor(e,t=`fold`){super(e,t,37),this.tips=e.w.hero.tipFold,this.slots=mp(e.w.hero.n)}shots(e){let t=Z,n=this.s,r=Xm(t.press.x,t.press.y+.5,t.press.z),i=Xm(t.dry.x,t.dryY,t.dry.z);if(e(0,8.6,{target:i,dist:120,az:46,el:54,fov:32,ap:.07},{target:i,dist:104,az:56,el:50,fov:32,ap:.08}),this.tips){let t=n.w,r=(e,n)=>t.hero.outerCenter(0,Math.PI*.96,n).applyMatrix4(t.hero.group.matrixWorld);e(8.6,9.4,{target:n.follow(1),dist:32,az:24,el:44,fov:30,ap:.28},{target:n.follow(1),dist:30,az:20,el:46,fov:30,ap:.3}),e(9.4,11.6,{target:r,dist:13,az:30,el:36,fov:30,ap:.42},{target:r,dist:11,az:16,el:40,fov:30,ap:.46},.6),e(11.6,16,{target:n.follow(1.5),dist:46,az:20,el:38,fov:30,ap:.26},{target:n.follow(1.5),dist:42,az:6,el:42,fov:30,ap:.28},.9)}else e(8.6,16,{target:n.follow(1.5),dist:48,az:24,el:36,fov:30,ap:.26},{target:n.follow(1.5),dist:42,az:6,el:42,fov:30,ap:.28});e(16,30.4,{target:Xm(t.press.x,t.press.y+4,t.press.z),dist:96,az:34,el:26,fov:30,ap:.12},{target:Xm(t.press.x,t.press.y+4,t.press.z),dist:84,az:46,el:30,fov:30,ap:.14},1),e(30.4,37,{target:r,dist:66,az:10,el:58,fov:30,ap:.16},{target:r,dist:58,az:-10,el:62,fov:30,ap:.18},1.2)}lights(){return[[19,`afternoon`],[27,`golden`]]}carry(e){let t=this.s,n=t.w.hero.state,r=J(2,8,e);n.soak=r,t.look.soak=r,n.fold=Y(X(e,9.6,12.8)),n.press=J(17,17.9,e),t.look.press=n.press}press={board:[15.6,17.2,18,28.2,29,30.4],stone:[18.2,19.6,27,28.2],gap:.62};sounds(e){let t=Z,n=Xm(t.dry.x,t.dryY,t.dry.z);for(let t=0;t<3;t++)e(1.8+t*1.15+.35,`sprinkle`,{gain:.65,at:n});this.tips&&e(Qm.tipFold,`crinkle`,{dur:.6,gain:.22}),e(Qm.turnOver,`flip`,{gain:.45}),e(Qm.foldIn,`rustle`,{dur:1.6,gain:.2,pitch:.6}),e(Qm.toPress,`tap`,{gain:.3,pitch:.7,at:Xm(t.press.x,t.press.y,t.press.z)}),qm(e,this.press)}pose(e){let t=this.s,n=t.w,r=Z;if(e<8.6)t.heroOnRack(),t.applyHero(),t.piecesOnRack();else{let i=e<16.9?n.foldedGeo:n.hero.geometry,a=new V,o=10*(1-Y(X(e,13.2,14.4))),s=this.slots[0];t.heroPos.set(r.press.x+s.x,r.press.y+.02,r.press.z+s.z),t.heroPos.y+=o,t.heroQuat.setFromAxisAngle(Zm,s.yaw),t.applyHero();for(let e=1;e<10;e++){let t=this.slots[e];n.batch.setPiece(e,i,a.set(r.press.x+t.x,r.press.y+.02,r.press.z+t.z),t.yaw)}}if(Ym(t,e,this.press),e>1.5&&e<6){let t=n.drops,i=new V;for(let n=0;n<3;n++){let a=1.8+n*1.15,o=Vu(30+n);for(let s=0;s<26;s++){let s=o()*.15,c=e-a-s,l=o()*Fu,u=Math.sqrt(o())*44,d=Math.cos(l)*u,f=Math.sin(l)*u,p=.5+o()*.14;if(c<0||c>p)continue;let m=Xm(r.dry.x+40+(n-1)*14,r.dryY+52,r.dry.z+34),h=Xm(r.dry.x+d,r.dryY+.4,r.dry.z+f),g=c/p;i.lerpVectors(m,h,g),i.y+=Math.sin(Math.PI*g)*6*(1-g),t.add(i,.22+o()*.16,1.2)}}}}},eh=(e,t,n)=>new V(e,t,n),th=class extends Xd{zoom;p=new V;q=new B;constructor(e,t=1,n=`pick`){super(e,n,15),this.zoom=t}shots(e){let t=this.s;e(0,7.4,{target:eh(-322,318,52),dist:250,az:38,el:-36,fov:46,ap:.08},{target:eh(-318,300,50),dist:228,az:22,el:-28,fov:44,ap:.08});let n=this.zoom,r=30+34*(1-n),i=26+32*(1-n);e(7.4,15,{target:t.fruitCenter,dist:56*n,az:24,el:r,fov:30,ap:.35},{target:t.fruitCenter,dist:40*n,az:34,el:i,fov:28,ap:.42},2.6)}lights(){return[[0,`morning`]]}pose(){let e=this.s;e.fruitInBasket(0,this.p,this.q),e.setHeroByCenter(this.p,this.q),e.applyHero(),e.fruitsInBasket()}},nh=class extends Xd{constructor(e,t=`sun`){super(e,t,28)}shots(e){let t=Z,n=this.s,r=new V(t.dry.x,t.dryY,t.dry.z);e(0,6,{target:r,dist:170,az:40,el:50,fov:34,ap:.06},{target:r,dist:150,az:50,el:47,fov:34,ap:.07},0,e=>e),e(6,18,{target:n.heroFlat,dist:66,az:56,el:50,fov:32,ap:.16},{target:n.heroFlat,dist:50,az:70,el:44,fov:32,ap:.2},1.8),e(18,28,{target:n.heroFlat,dist:34,az:70,el:36,fov:30,ap:.36},{target:n.heroFlat,dist:28,az:88,el:30,fov:30,ap:.4},2.2)}lights(){return[[2,`forenoon`],[8,`noon`],[14,`afternoon`]]}carry(e){let t=this.s,n=J(3,17.5,e),r=t.w.hero.state;r.dry=n,r.shrink=n,t.look.dry=n,e>=0&&(t.carry.fireLow=!0),t.carry.lapse=260*J(1.5,17,e)}sounds(e){let t=new V(Z.dry.x,Z.dryY,Z.dry.z);for(let[n,r]of[[6.5,.5],[9.2,.4],[11.8,.6],[14.1,.4],[16.3,.5]])e(n,`crinkle`,{dur:r,gain:.3,at:t})}pose(){let e=this.s;e.heroOnRack(),e.applyHero(),e.piecesOnRack()}},rh=(e,t,n)=>new V(e,t,n),ih=new V(0,1,0),ah=1,oh=2.2,sh=2.9,ch=6.6,lh=7.7,uh={slideBack:4.02},dh=class extends Xd{liang;sim=[];p=new V;q=new B;constructor(e,t,n=`weigh`){super(e,n,8.4),this.liang=t,this.simulate()}weightAt(e){let t=Math.max(.25,this.liang*.12);return Ku(e,[[sh,0],[4,this.liang+t],[4.7,this.liang]])}simulate(){let e=1/120,t=0,n=0,r=.2;for(let i=0;i<=Math.ceil(this.dur/e);i++){let a=i*e,o=Iu(-((a>=oh?this.liang:0)-this.weightAt(a))*.06,-.2,r),s=-62*(t-o)-2.6*n;n+=s*e,t+=n*e,t<-.2?(t=-.2,n=-n*.25):t>r&&(t=r,n=-n*.25),this.sim.push({t:a,a:t})}}angleAt(e){let t=Iu(Math.floor(e*120),0,this.sim.length-1);return this.sim[t].a}shots(e){let t=Z.steelyard,n=this.s.w.steelyard,r=rh(t.x-16,t.y-17,t.z),i=(e,t)=>n.readWorld(t).add(rh(0,-3.2,0));e(0,2.6,{target:rh(t.x-18,138,t.z+14),dist:175,az:14,el:9,fov:34,ap:.08},{target:rh(t.x-16,140,t.z+12),dist:158,az:18,el:10,fov:34,ap:.09}),e(2.6,4.8,{target:r,dist:80,az:12,el:6,fov:32,ap:.14},{target:rh(r.x-2,r.y,r.z),dist:70,az:16,el:8,fov:32,ap:.16},.8),e(4.8,this.dur,{target:i,dist:36,az:18,el:12,fov:28,ap:.34},{target:i,dist:29,az:24,el:14,fov:28,ap:.38},1.1)}sounds(e){let t=Z.steelyard,n=rh(t.x-16,t.y-40,t.z),r=Z.basketFloor;e(.95,`rustle`,{dur:.4,gain:.45,at:r}),e(2.1900000000000004,`thud`,{gain:.7,pitch:1.1,at:n}),e(oh,`tap`,{gain:.22,pitch:.7,at:n}),e(sh,`slide`,{dur:1.1,gain:.6,at:n}),e(uh.slideBack,`slide`,{dur:.6,gain:.4,pitch:.95,at:n}),e(ch,`rustle`,{dur:.3,gain:.25,at:n}),e(7.680000000000001,`thud`,{gain:.55,pitch:.9,at:r}),e(lh,`rustle`,{dur:.35,gain:.3,at:r})}pose(e){let t=this.s,n=t.w.steelyard;t.basketPos.copy(Z.basketFloor),t.basketQuat.identity(),t.fruitsInBasket();let r=e-oh,i=r>0&&e<ch?.07*Math.exp(-2.4*r)*Math.sin(8*r):0;n.set(this.angleAt(e),this.weightAt(e),i),n.group.updateMatrixWorld();let a=new V,o=new B;t.fruitInBasket(0,a,o);let s=t.layout.lift(0),c=n.panFloorWorld(new V).add(rh(0,s,0)),l=this.p,u=this.q;if(e<ah||e>=lh)l.copy(a),u.copy(o);else if(e<oh){let t=new V;n.set(this.angleAt(2.1900000000000004),0,0),n.panFloorWorld(t).add(rh(0,s,0)),n.set(this.angleAt(e),this.weightAt(e),i),n.group.updateMatrixWorld();let r=X(e,ah,oh);Gu(l,a,t,r,40),u.copy(o).premultiply(new B().setFromAxisAngle(ih,Y(r)*1.2))}else if(e<ch)l.copy(c),u.copy(o).premultiply(new B().setFromAxisAngle(ih,1.2));else{let t=X(e,ch,lh);Gu(l,c,a,t,30),u.copy(o).premultiply(new B().setFromAxisAngle(ih,1.2*(1-Y(t))))}t.setHeroByCenter(l,u),t.applyHero()}},fh=[{key:`p1`,text:`柚类橘红系将未成熟的果实，`},{key:`p2`,text:`先投入沸水中，即捞出，`},{key:`p3`,text:`将果皮割成7瓣，`},{key:`p4`,text:`出去果瓤及内面部分白色的中果皮`},{key:`p5`,text:`后晒干或焙干，`},{key:`p6`,text:`再以水润透，对折以木板压平，`},{key:`p7`,text:`再焙干即得。`}],ph=`——《中国药典》1963 年版一部"橘红"`,mh=e=>fh.find(t=>t.key===e).text,hh={id:`qizhua`,name:`七爪橘红`,blurb:`割七瓣、刮白瓤、晒干，润透后整片对折压平，再焙，十片一扎。`,ready:!0,cast:{kind:`peel`},acts:e=>[new th(e),new dh(e,4.8),new ff(e),new Wm(e),new nh(e),new $m(e),new Im(e),new zm(e)],script:{cover:{title:`七爪橘红`,sub:`一句古法，从青果到成品`,play:`开始`},sentence:[{key:`p1`,text:mh(`p1`),clear:[`pick`,12.5]},{key:`p2`,text:mh(`p2`),clear:[`blanch`,16]},{key:`p3`,text:mh(`p3`),clear:[`cut`,16]},{key:`p4`,text:mh(`p4`),clear:[`cut`,36.5]},{key:`p5`,text:mh(`p5`),clear:[`sun`,18.5]},{key:`p6`,text:mh(`p6`),clear:[`fold`,29.5]},{key:`p7`,text:mh(`p7`),clear:[`bake`,18]}],source:ph,chapters:[{num:`一`,title:`青果`,seal:`摘`,from:`pick`,phrases:[`p1`]},{num:`二`,title:`烫果`,seal:`烫`,from:`blanch`,phrases:[`p2`]},{num:`三`,title:`割皮去瓤`,seal:`割`,from:`cut`,phrases:[`p3`,`p4`]},{num:`四`,title:`晒干`,seal:`晒`,from:`sun`,phrases:[`p5`]},{num:`五`,title:`润、折、压`,seal:`压`,from:`fold`,phrases:[`p6`]},{num:`六`,title:`再焙`,seal:`焙`,from:`bake`,phrases:[`p7`]},{num:``,title:`十片一扎`,seal:`成`,from:`bundle`,phrases:[],card:`十片一扎，红头绳捆好。`}],captions:[[`pick`,8.6,13.6,`青果还没熟，皮上一层细细的白绒。`],[`weigh`,1.4,4.4,`挑个大的，放上秤称一称。`],[`weigh`,4.9,8.2,`四两八。四两半以上的大果，才拿来割皮。`],[`blanch`,2.5,7.5,`水要滚透了才下锅。`],[`blanch`,8.2,12,`一篮十个，一起下锅。`],[`blanch`,13.8,18.6,`一烫就捞，颜色转亮了。`],[`blanch`,21.4,27,`摊在竹筛上放凉，沥干水。`],[`cut`,4.5,10,`从果顶往下划，底下留一截连着。`],[`cut`,16.6,20.8,`七瓣掰开，像开了一朵花。`],[`cut`,21.4,25.4,`果瓤整个掏出来。`],[`cut`,26,31.5,`白瓤刮掉，刮到见油眼就停。`],[`cut`,41,47,`十个都这样割好、刮好。`],[`sun`,2.5,8,`十片摊在竹匾上，天好就晒。`],[`sun`,11,17,`晒到颜色暗下来，边也卷起来。`],[`fold`,2.4,7.6,`干透的皮发脆，先洒水润透。`],[`fold`,9.4,15,`润软了，一片片整片对折，两边的瓣错开。`],[`fold`,17.6,22.6,`十片一起用木板压平，只压这一回。`],[`bake`,2.4,7.6,`火要细，隔着筛焙。`],[`bake`,9.6,14.6,`勤翻着，焙到干透就成了。`],[`bundle`,6,11.5,`十片一扎，红头绳捆好。`]],ending:{title:`七爪橘红`,seal:`成`,replay:`再看一遍`,more:`去展厅看看现在怎么做`}}},gh=(e,t,n)=>new V(e,t,n),_h=new V(0,1,0),vh=new B().setFromAxisAngle(new V(0,0,1),Math.PI/2),yh=9.4,bh=10.6,xh=11.2,Sh=12.6,Ch=class extends Xd{pile=[];q=new B;constructor(e,t=`jar`){super(e,t,26)}get jar(){return this.s.w.jar}layoutPile(){if(this.pile.length)return;let e=this.s,t=this.jar,n=Vu(101),r=[],i=Array.from({length:e.fruits.count-1},(e,t)=>t+1);for(let a of[...i,0]){let i=e.layout.lift(a),o=[];for(let e=0;e<120;e++)o.push(new z((n()*2-1)*t.innerR,(n()*2-1)*t.innerR));let s=Yp(r,i,o,t.floorY,(e,n)=>Math.hypot(e,n)+i<t.innerR-.15);if(!s)throw Error(`罐里放不下`);r.push({p:s,r:i}),this.pile[a]=s}}shots(e){let t=this.s,n=()=>this.jar.group.position,r=(e,t)=>t.copy(n()).add(gh(0,9,0));e(0,9.6,{target:t.fruitCenter,dist:9.5,az:18,el:10,fov:28,ap:.5,shake:.4},{target:t.fruitCenter,dist:7.4,az:58,el:18,fov:28,ap:.56,shake:.4}),e(9.6,15,{target:r,dist:52,az:24,el:26,fov:30,ap:.24},{target:r,dist:44,az:32,el:22,fov:30,ap:.28},1),e(15,this.dur+2,{target:r,dist:46,az:34,el:22,fov:30,ap:.26},{target:(e,t)=>t.copy(n()).add(gh(14,30,-30)),dist:170,az:66,el:16,fov:34,ap:.12},1.6,Ru)}lights(){return[[0,`forenoon`],[12,`afternoon`],[25,`golden`]]}sounds(e){e(10.58,`glass`,{gain:.65}),e(11.25,`tap`,{gain:.14,pitch:1.3}),e(12.57,`clink`,{gain:.55})}pose(e){let t=this.s,n=this.jar;this.layoutPile(),n.group.visible=!0,n.lid.visible=!0,n.group.updateMatrixWorld();let r=n.group.position,i=t.fruits,a=new V;for(let e=1;e<i.count;e++)a.copy(this.pile[e]).add(r),i.setFruit(e,a,t.fruitRot(e));i.show(!0);let o=gh(r.x,r.y+n.height+9,r.z),s=this.pile[0].clone().add(r),c=e<yh?this.q.setFromAxisAngle(_h,-.5+e*.09).multiply(vh):this.q.copy(t.fruitRot(0));e<yh?a.copy(o):e<bh?Gu(a,o,s,X(e,yh,bh),2):a.copy(s),t.setHeroByCenter(a,c),t.applyHero();let l=gh(r.x,r.y+1.2,r.z+17),u=gh(r.x,r.y+n.height+.02,r.z),d=r.y+n.height+6,f=n.lid.position;if(e<xh)f.copy(l);else{let t=X(e,xh,Sh);t<.4?f.lerpVectors(l,gh(l.x,d,l.z),Y(t/.4)):t<.8?f.lerpVectors(gh(l.x,d,l.z),gh(u.x,d,u.z),Y((t-.4)/.4)):f.lerpVectors(gh(u.x,d,u.z),u,Y((t-.8)/.2))}n.lid.rotation.set(0,.3*(1-Y(X(e,xh,Sh))),0)}},wh=(e,t,n)=>new V(e,t,n),Th=[17.2,33.4],Eh={hiss:.6},Dh=[[13.2,21.6],[32.2,40.2]],Oh=class extends Xd{q=new B;r=new B;c=new V;constructor(e,t=`oven`){super(e,t,44)}night(e){let t=0;for(let[n,r]of Dh)t=Math.max(t,J(n-1.5,n+1,e)*(1-J(r-1.5,r+.5,e)));return t}lights(){return[[1,`forenoon`],[6,`noon`],[9.5,`afternoon`],[11.6,`dusk`],[14,`night`],[20.4,`night`],[23.2,`morning`],[26.4,`noon`],[29.6,`golden`],[31.2,`dusk`],[33.2,`night`],[39,`night`],[41.6,`morning`],[44,`forenoon`]]}carry(e){let t=this.s,n=t.carry;e<0||(n.ovenOn=Math.max(n.ovenOn,J(0,1.8,e)*(e<this.dur?1:.6)),n.fireLow=!0,n.bloom=.32,e<this.dur&&(n.haze=Math.max(n.haze,J(.5,2.5,e)*(1-J(this.dur-1,this.dur,e))*.8)),n.lapse=2400*J(0,this.dur,e),e<this.dur&&(n.bulb=Math.max(n.bulb,this.night(e))),t.look.wet*=1-J(0,5,e),t.look.dry=Math.max(t.look.dry,J(3,40,e)))}shots(e){let t=this.s,n=Z.oven,r=Z.ovenTop,i=wh(n.x,r+2,n.z);e(0,8.6,{target:i,dist:124,az:20,el:30,fov:32,ap:.08},{target:i,dist:106,az:28,el:33,fov:32,ap:.09}),e(8.6,19.4,{target:wh(n.x+3,r+1,n.z+2),dist:64,az:12,el:54,fov:32,ap:.14},{target:wh(n.x+3,r+1,n.z+2),dist:56,az:2,el:58,fov:32,ap:.16},1.2),e(19.4,31.4,{target:t.fruitCenter,dist:19,az:22,el:28,fov:28,ap:.4},{target:t.fruitCenter,dist:14.5,az:46,el:22,fov:28,ap:.48},1.4),e(31.4,this.dur,{target:wh(n.x,r+1,n.z),dist:66,az:-8,el:46,fov:32,ap:.12},{target:wh(n.x,r+1,n.z),dist:82,az:10,el:40,fov:32,ap:.1},1.4)}sounds(e){let t=wh(Z.oven.x,Z.ovenTop,Z.oven.z);e(Eh.hiss,`hiss`,{dur:5,gain:.45,at:t});for(let n of Th){e(n,`rustle`,{dur:1.3,gain:.55,pitch:.7,at:t});for(let r=0;r<6;r++)e(n+.9+r*.06,`tap`,{gain:.14,pitch:.7,at:t})}}orient(e,t,n){let r=this.s,i=r.layout.restRot?r.layout.restRot(e):r.fruitRot(e),a=0;Th.forEach((n,r)=>a+=Y(J(n+e%7*.05,n+.9+e%7*.05,t))*(Math.PI/2)*(r%2?-1:1)*(e%2?1:-1));let o=this.c.set(0,-1,0).applyQuaternion(i);return n.copy(i).premultiply(this.r.setFromAxisAngle(o,a))}pose(e){let t=this.s,n=Z,r=t.fruits,i=new V;for(let a=0;a<r.count;a++){let o=t.layout.sieve[a],s=0;for(let t of Th){let n=(e-t-a%7*.05)/.9;n>0&&n<1&&(s=Math.sin(Math.PI*n)*.6)}i.set(n.oven.x+o.x,n.ovenTop+t.layout.lift(a)+.03+s,n.oven.z+o.y),this.orient(a,e,this.q),a===0?(t.setHeroByCenter(i,this.q),t.applyHero()):r.setFruit(a,i,this.q)}r.show(!0),t.w.batchSteam.set(wh(n.oven.x,n.ovenTop+3,n.oven.z),.5*J(.5,2.5,e)*(1-J(5,9,e)))}},kh={id:`tai`,name:`橘红胎`,blurb:`疏下来的小果，不割不压，一半烫过、一半直接，整个烘干。`,ready:!0,cast:{kind:`tai`},acts:e=>[new th(e,.62),new dh(e,.7),new ff(e),new Oh(e),new Ch(e)],script:{cover:{title:`橘红胎`,sub:`小果整个烘，不割不压`,play:`开始`},sentence:[{key:`q1`,text:`正毛橘红胎呈圆球形或近似圆球柱形，`,clear:[`pick`,12.5]},{key:`q2`,text:`直径约1～5厘米，`,clear:[`weigh`,7.6]},{key:`q3`,text:`表面青褐色或黄棕色，`,clear:[`oven`,14.5]},{key:`q4`,text:`披白色密绒毛，`,clear:[`oven`,24]},{key:`q5`,text:`果蒂明显，顶部稍凹，`,clear:[`oven`,29]},{key:`q6`,text:`质地干燥坚实，不易剖开。`,clear:[`oven`,41.5]},{key:`q7`,text:`系整果不割不压，`,clear:[`oven`,43]},{key:`q8`,text:`经沸水烫后烘干或直接烘干即得。`,clear:[`jar`,8]}],source:`——《化州县志》第六篇`,chapters:[{num:`一`,title:`青果`,seal:`摘`,from:`pick`,phrases:[`q1`,`q2`]},{num:`二`,title:`烫果`,seal:`烫`,from:`blanch`,phrases:[],card:`一半烫过再烘，一半直接烘。`},{num:`三`,title:`连烘几天`,seal:`烘`,from:`oven`,phrases:[`q3`,`q4`,`q5`,`q6`,`q7`],card:`表面青褐色或黄棕色，披白色密绒毛，果蒂明显，顶部稍凹，质地干燥坚实，不易剖开。`},{num:``,title:`一罐橘红胎`,seal:`成`,from:`jar`,phrases:[`q8`],card:`不割、不压，整个烘干就成了。`}],captions:[[`pick`,8.6,13.6,`疏果疏下来的小果，个头小，绒毛密。`],[`weigh`,1.4,4.4,`挑一个放上秤称一称。`],[`weigh`,4.9,8.2,`七钱。不到三两的小果，整个烘，做橘红胎。`],[`blanch`,2.5,7.5,`一半直接摊上竹筛，一半下锅烫。`],[`blanch`,8.2,12,`十五个一起下锅。`],[`blanch`,13.8,18.6,`一烫就捞，颜色转亮了。`],[`blanch`,21.4,27,`两种做法都有：烫过再烘，或者直接烘。`],[`oven`,2.5,7.5,`不割、不压，整个上焙炉烘。`],[`oven`,9.6,13.6,`火不断，白天烘，夜里也烘。`],[`oven`,16.2,19.6,`隔一阵翻一翻。`],[`oven`,23,28.5,`颜色慢慢转成青褐、黄棕，白绒越来越显。`],[`oven`,35,40,`烘到干透，摸着坚实。`],[`jar`,2.4,8.4,`一层密白绒，果蒂明显，顶上微微凹进去。`],[`jar`,12.6,17.6,`比胎大些、三两到四两半的叫橘红珠，也是整个烘。`]],ending:{title:`橘红胎`,seal:`成`,replay:`再看一遍`,more:`去展厅看看现在怎么做`}}},Ah=[{key:`p1`,text:`柚类橘红系将未成熟的果实，`},{key:`p2`,text:`先投入沸水中，即捞出，`},{key:`p3`,text:`将果皮割成5瓣，`},{key:`p4`,text:`除去果瓤及内面部分白色的中果皮`},{key:`p5`,text:`后晒干或焙干，`},{key:`p6`,text:`以水润透，瓣尖内折约3毫米，对折以木板压平，`},{key:`p7`,text:`再焙干即得。`}],jh=e=>Ah.find(t=>t.key===e).text,Mh={id:`wuzhua`,name:`大五爪`,blurb:`割五瓣、刮白瓤、晒干，润透后瓣尖折回一点再对折压平，十片一扎。`,ready:!0,cast:{kind:`peel`,petals:5},acts:e=>[new th(e),new dh(e,4.8),new ff(e),new Wm(e),new nh(e),new $m(e),new Im(e),new zm(e)],script:{cover:{title:`大五爪`,sub:`五瓣的橘红：瓣尖折回、对折压平`,play:`开始`},sentence:[{key:`p1`,text:jh(`p1`),clear:[`pick`,12.5]},{key:`p2`,text:jh(`p2`),clear:[`blanch`,16]},{key:`p3`,text:jh(`p3`),clear:[`cut`,16]},{key:`p4`,text:jh(`p4`),clear:[`cut`,36.5]},{key:`p5`,text:jh(`p5`),clear:[`sun`,18.5]},{key:`p6`,text:jh(`p6`),clear:[`fold`,29.5]},{key:`p7`,text:jh(`p7`),clear:[`bake`,18]}],source:ph,chapters:[{num:`一`,title:`青果`,seal:`摘`,from:`pick`,phrases:[`p1`]},{num:`二`,title:`烫果`,seal:`烫`,from:`blanch`,phrases:[`p2`]},{num:`三`,title:`割皮去瓤`,seal:`割`,from:`cut`,phrases:[`p3`,`p4`]},{num:`四`,title:`晒干`,seal:`晒`,from:`sun`,phrases:[`p5`]},{num:`五`,title:`润、折、压`,seal:`压`,from:`fold`,phrases:[`p6`]},{num:`六`,title:`再焙`,seal:`焙`,from:`bake`,phrases:[`p7`]},{num:``,title:`十片一扎`,seal:`成`,from:`bundle`,phrases:[],card:`十片一扎，红头绳捆好，叫大五爪。`}],captions:[[`pick`,8.6,13.6,`青果还没熟，皮上一层细细的白绒。`],[`weigh`,1.4,4.4,`挑个大的，放上秤称一称。`],[`weigh`,4.9,8.2,`四两八。四两半以上的大果，才拿来割皮。`],[`blanch`,2.5,7.5,`水要滚透了才下锅。`],[`blanch`,8.2,12,`一篮十个，一起下锅。`],[`blanch`,13.8,18.6,`一烫就捞，颜色转亮了。`],[`blanch`,21.4,27,`摊在竹筛上放凉，沥干水。`],[`cut`,4.5,10,`这回只割五刀，底下留一截连着。`],[`cut`,16.6,20.8,`五瓣掰开，像开了一朵花。`],[`cut`,21.4,25.4,`果瓤整个掏出来。`],[`cut`,26,31.5,`白瓤刮掉，刮到见油眼就停。`],[`cut`,41,47,`十个都这样割好、刮好。`],[`sun`,2.5,8,`十片摊在竹匾上，天好就晒。`],[`sun`,11,17,`晒到颜色暗下来，边也卷起来。`],[`fold`,2.4,7.6,`干透的皮发脆，先洒水润透。`],[`fold`,9.4,11.6,`五瓣的先把瓣尖往里折回一点，`],[`fold`,11.8,15.6,`再整片对折，两边的瓣错开。`],[`fold`,17.6,22.6,`十片一起用木板压平。`],[`bake`,2.4,7.6,`火要细，隔着筛焙。`],[`bake`,9.6,14.6,`勤翻着，焙到干透就成了。`],[`bundle`,6,11.5,`十片一扎，红头绳顺着瓣缝捆好，这就是大五爪。`]],ending:{title:`大五爪`,seal:`成`,replay:`再看一遍`,more:`去展厅看看现在怎么做`}}},Nh=Af.R,Q={shrunk:2,oval:{x:1.85,y:2.75,z:1.8},cylR:1.5,cylH:3.15,cylDome:1,disc:.36};function Ph(e,t,n){let r=e=>(1-Math.abs(Math.sin(e)))**5,i=r(3.1*e+1.7*t+2*Math.sin(2.2*n+.5)),a=r(2.6*t-2.2*n+1.6*Math.sin(2.9*e+1.9)),o=r(3.4*n+1.2*e+1.4*Math.sin(2.4*t+.7));return .022*(Math.sin(1.7*e+2.3*t+1)*Math.sin(2.1*n-1.1*e+.4))-.02*i-.016*a-.012*o}function Fh(e,t,n){let{cylR:r,cylH:i,cylDome:a}=Q,o=i-a,s=Math.PI/2*Math.sqrt((r*r+a*a)/2),c=Math.abs(e)*(o+s),l=r,u=c;if(c>o){let e=(c-o)/s*(Math.PI/2);l=r*Math.cos(e),u=o+a*Math.sin(e)}let d=(1-Math.abs(Math.sin(t*3+.6*Math.sin(u*.9))))**7;l*=1+.014*Math.sin(2.1*u+t*2+1)+.007*Math.sin(5.3*u+t*3)-.016*d,n[0]=l,n[1]=Math.sign(e)*u}var Ih=class{geo;unit;wr;cap;key=``;constructor(){let e=new Ja(1,96,72);e.deleteAttribute(`uv`),e.deleteAttribute(`normal`);let t=om(e);this.unit=t.attributes.position.array.slice(),t.attributes.position.setUsage(Je),t.setAttribute(`aRest`,new yr(this.unit.slice(),3)),this.geo=t;let n=this.unit;this.wr=new Float32Array(n.length/3),this.cap=new Float32Array(n.length);let r=[0,0];for(let e=0;e<n.length;e+=3){let[t,i,a]=[n[e],n[e+1],n[e+2]];this.wr[e/3]=Ph(t,i,a);let o=Math.hypot(t,a),s=Math.atan2(a,t);Fh(Math.asin(Iu(i,-1,1))/(Math.PI/2),s,r);let c=o>1e-6?r[0]/o:0;this.cap[e]=t*c,this.cap[e+1]=r[1],this.cap[e+2]=a*c}this.set({dry:0,oval:0,cyl:0})}set(e){let t=`${e.dry.toFixed(4)}|${e.oval.toFixed(4)}|${e.cyl.toFixed(4)}|${(e.mouth??99).toFixed(3)}|${e.mouthR??0}`;if(t===this.key)return;this.key=t;let n=this.geo.attributes.position.array,r=this.unit,i=this.cap,a=q(Nh,Q.shrunk,e.dry),o=q(1,Q.oval.x/Q.shrunk,e.oval),s=q(1,Q.oval.y/Q.shrunk,e.oval),c=q(1,Q.oval.z/Q.shrunk,e.oval),l=e.mouth??1/0,u=e.mouthR??1/0;for(let t=0;t<r.length;t+=3){let d=a*(1+this.wr[t/3]*e.dry),f=q(r[t]*d*o,i[t],e.cyl),p=q(r[t+1]*d*s,i[t+1],e.cyl),m=q(r[t+2]*d*c,i[t+2],e.cyl);if(p<l){let e=Math.hypot(f,m);e>u&&(f*=u/e,m*=u/e)}n[t]=f,n[t+1]=p,n[t+2]=m}this.geo.attributes.position.needsUpdate=!0,this.geo.computeVertexNormals(),this.geo.computeBoundingSphere()}};function Lh(e=0,t=0){let n=e=>new U(e);return kd({roughness:.6,metalness:0,sheen:1,sheenRoughness:.5,sheenColor:new U(`#ffffff`),clearcoat:1,clearcoatRoughness:.3},{uniforms:{uBlanch:{value:0},uWet:{value:0},uDry:{value:0},uCyl:{value:0},uRind:{value:0},uSeed:{value:e},cSkin0:{value:n(Md.skin[0])},cSkin1:{value:n(Md.skin[1])},cBl0:{value:n(Md.blanch[0])},cBl1:{value:n(Md.blanch[1])},cMid0:{value:n(`#5F5C18`)},cMid1:{value:n(`#8F8726`)},cDry0:{value:n(`#413C20`)},cDry1:{value:n(`#7C6C3C`)},cCyl0:{value:n(`#6A5320`)},cCyl1:{value:n(`#A5853C`)},cFuzz:{value:n(`#E9E2B8`)},cRind:{value:n(`#2A2A18`)}},attributes:`attribute vec3 aRest;`,varyings:`varying vec3 vRest;`,vertex:`vRest = aRest; transformed += normal * ${(t*.028).toFixed(3)};`,discard:t?`
          float hk = hash13(floor(vRest * 170.0));
          if (hk > ${(.62-t*.14).toFixed(3)} || aaFade3(vRest * 170.0) < 0.4) discard;
        `:void 0,color:`
        vec3 rp = vRest;
        float mott = snoise(rp * 2.6 + uSeed) * 0.45 + snoise(rp * 7.3 + uSeed * 2.0) * 0.18;
        float lo = smoothstep(-0.8, 0.25, mott);
        vec3 col = mix(mix(cSkin0, cSkin1, lo), mix(cBl0, cBl1, lo), uBlanch);
        // 油胞：鲜果上明显，烘软以后收进绒里
        vec3 gl = voronoi3(rp * 40.0 + uSeed);
        float gland = mix(0.12, 1.0 - smoothstep(0.1, 0.36, gl.x), aaFade3(rp * 40.0)) * (1.0 - smoothstep(0.2, 0.7, uDry));
        col *= 1.0 - gland * 0.12;
        // 烘：先转橄榄黄，再到黄褐，深色斑慢慢显出来
        vec3 mid = mix(cMid0, cMid1, lo);
        float blotch = smoothstep(-1.0, 0.9, mott + snoise(rp * 5.1 + 3.0) * 0.25);
        vec3 dried = mix(cDry0, cDry1, blotch);
        col = mix(col, mid, smoothstep(0.02, 0.45, uDry));
        col = mix(col, dried, smoothstep(0.4, 1.0, uDry));
        // 细绒：粗细两层小点，圆柱上顺长拉开，看着像绒毛
        float k1 = mix(0.5, hash13(floor(rp * 150.0)), aaFade3(rp * 150.0));
        float k2 = mix(0.5, hash13(floor(rp * 62.0 + 7.0)), aaFade3(rp * 62.0));
        float k3 = mix(0.5, hash13(floor(rp * 26.0 + 3.0)), aaFade3(rp * 26.0));
        float sn = snoise(rp * 18.0 + uSeed) * 0.5;
        float fz = (k1 - 0.5) * 0.8 + (k2 - 0.5) * 0.55 + (k3 - 0.5) * 0.25 + sn * 0.35;
        col *= 1.0 + fz * mix(0.08, 0.75, smoothstep(0.1, 0.9, uDry));
        // 定型：一身黄褐细绒，顺长几道浅沟
        float az = atan(rp.z, rp.x);
        float cr = abs(sin(az * 3.0 + 0.6 * sin(rp.y * 3.2)));
        float crease = (1.0 - smoothstep(0.0, 0.13, cr)) * uCyl;
        vec3 cyl = mix(cCyl0, cCyl1, smoothstep(-0.9, 0.7, mott * 0.7 + fz * 1.1));
        col = mix(col, cyl * (1.0 + fz * 0.8), uCyl);
        col *= 1.0 - crease * 0.16;
        // 烘透的外皮是深色的，上切药刀时绒面也看着发深，才接得上圆片那一圈
        col = mix(col, cRind * (1.0 + fz * 0.9), uRind);
        diffuseColor.rgb = col${t?` * `+(1+t*.13).toFixed(2):``};
        procBump = -gland * 0.016 + mott * 0.008 + fz * 0.014 * uDry - crease * 0.006;
      `,rough:`roughnessFactor = mix(mix(0.6, 0.34, uWet), 0.92, uDry);`,physical:`
        #ifdef USE_SHEEN
          material.sheenColor = cFuzz * mix(0.25, 0.42, uDry);
          material.sheenRoughness = 0.55;
        #endif
        #ifdef USE_CLEARCOAT
          material.clearcoat = uWet * 0.75;
          material.clearcoatRoughness = 0.28;
        #endif
      `,bump:!0})}function Rh(e,t){let n=e.userData.proc.uniforms;t.blanch!==void 0&&(n.uBlanch.value=t.blanch),t.wet!==void 0&&(n.uWet.value=t.wet),t.dry!==void 0&&(n.uDry.value=t.dry),t.cyl!==void 0&&(n.uCyl.value=t.cyl),t.rind!==void 0&&(n.uRind.value=t.rind)}function zh(e,t=Q.disc,n=1,r=Q.cylR,i=72){let a=Vu(1e3+e*37),o=[a()*6.28,a()*6.28,a()*6.28],s=1+(a()-.5)*.07*n,c=a()<.45?{a:a()*6.28,w:.1+a()*.16,d:.07+a()*.1}:null,l=Array.from({length:i},()=>(a()-.5)*.022),u=e=>{let t=e/i*Math.PI*2,r=1+.024*Math.sin(3*t+o[0])+.014*Math.sin(7*t+o[1])+.008*Math.sin(13*t+o[2])+l[e];if(c){let e=Math.atan2(Math.sin(t-c.a),Math.cos(t-c.a));r-=c.d*Math.exp(-(e*e)/(c.w*c.w))}return 1+(r-1)*n},d=[],f=[],p=[],m=[],h=Math.min(t*.2,.05),g=[.35,.7,.93,1],_=e=>{let n=d.length/3;d.push(0,0,e*t/2),f.push(0,0,e),p.push(1);let a=d.length/3;g.forEach((n,a)=>{for(let o=0;o<i;o++){let c=o/i*Math.PI*2,l=r*q(1,u(o),n)*n,m=a===g.length-1?t/2-h:t/2;d.push(Math.cos(c)*l*s,Math.sin(c)*l,e*m),f.push(Math.cos(c)*n,Math.sin(c)*n,e),p.push(1)}});let o=(t,n,r)=>e>0?m.push(t,n,r):m.push(t,r,n);for(let e=0;e<i;e++){let t=(e+1)%i;o(n,a+e,a+t);for(let n=0;n<g.length-1;n++){let r=a+n*i+e,s=a+n*i+t,c=a+(n+1)*i+e,l=a+(n+1)*i+t;o(r,c,l),o(r,l,s)}}};_(1),_(-1);let v=d.length/3;for(let e of[t/2-h,-t/2+h])for(let n=0;n<i;n++){let a=n/i*Math.PI*2,o=r*u(n);d.push(Math.cos(a)*o*s,Math.sin(a)*o,e),f.push(Math.cos(a),Math.sin(a),e/(t/2)),p.push(0)}for(let e=0;e<i;e++){let t=(e+1)%i;m.push(v+e,v+i+e,v+i+t,v+e,v+i+t,v+t)}let y=new Pr;return y.setAttribute(`position`,new yr(new Float32Array(d),3)),y.setAttribute(`aRest`,new yr(new Float32Array(f),3)),y.setAttribute(`aCut`,new yr(new Float32Array(p),1)),y.setAttribute(`aSeed`,new yr(new Float32Array(p.length).fill(e*1.37+.5),1)),y.setIndex(m),y.computeVertexNormals(),y}function Bh(){let e=e=>new U(e);return kd({roughness:.88,metalness:0,sheen:.4,sheenRoughness:.7,sheenColor:new U(`#7A6A50`)},{uniforms:{cAmber:{value:e(`#B47A30`)},cTea:{value:e(`#74441F`)},cDeep:{value:e(`#3C2110`)},cRim0:{value:e(`#0E110A`)},cRim1:{value:e(`#1F2517`)},cFray:{value:e(`#8D7450`)},cFib0:{value:e(`#4E3019`)},cFib1:{value:e(`#C2A06C`)},cSpeck:{value:e(`#EFE7D2`)},cCrack:{value:e(`#20130A`)}},attributes:`attribute vec3 aRest; attribute float aCut; attribute float aSeed;`,varyings:`varying vec3 vRest; varying float vCut; varying float vSeed;`,vertex:`vRest = aRest; vCut = aCut; vSeed = aSeed;`,color:`
        vec2 uv = vRest.xy;
        float sd = vSeed;
        float rr = length(uv);
        float ang = atan(uv.y, uv.x);
        vec3 col;
        float bump = 0.0;
        if (vCut > 0.5) {
          float wob = snoise(vec3(uv * 3.0, sd)) * 0.05 + snoise(vec3(uv * 9.0, sd * 2.0)) * 0.02;
          float e = rr + wob;
          col = mix(cAmber, cTea, smoothstep(0.12, 0.56, e));
          col = mix(col, cDeep, smoothstep(0.48, 0.86, e));
          // 径向的细纹和细颗粒（没有木纹那样的同心圈）
          float rad = snoise(vec3(cos(ang) * 9.0, sin(ang) * 9.0, rr * 1.5 + sd));
          float gr = mix(0.0, snoise(vec3(uv * 46.0, sd)), aaFade(uv * 46.0));
          col *= 0.95 + 0.06 * rad + 0.09 * gr;
          bump += gr * 0.006;
          // 纤维芯
          float core = 1.0 - smoothstep(0.09, 0.2, rr + snoise(vec3(uv * 8.0, sd + 3.0)) * 0.06);
          float fib = snoise(vec3(uv * 42.0, sd + 5.0));
          col = mix(col, mix(cFib0, cFib1, smoothstep(-0.3, 0.45, fib)), core);
          bump += core * fib * 0.03;
          // 细白点：不是每片都有
          vec2 q = uv * 21.0;
          vec2 cell = floor(q);
          vec2 jit = hash22(cell + sd * 13.0) - 0.5;
          float d = length(fract(q) - 0.5 - jit * 0.5);
          float spot = (1.0 - smoothstep(0.05, 0.15, d)) * step(0.8, hash12(cell + sd * 3.3)) * step(0.35, hash11(sd * 7.1));
          col = mix(col, cSpeck, spot * 0.85 * (1.0 - core) * aaFade(q));
          // 径向裂纹：从边往里，个别片才有
          float a0 = hash11(sd * 3.1) * 6.283;
          float da = abs(atan(sin(ang - a0 + wob * 1.6), cos(ang - a0 + wob * 1.6)));
          float crack = (1.0 - smoothstep(0.004, 0.022, da * rr)) * smoothstep(0.34, 0.62, rr) * step(0.42, hash11(sd * 5.7));
          col = mix(col, cCrack, crack);
          bump -= crack * 0.04;
          // 外皮一圈，交界处毛糙
          float wr = rr + wob * 0.55;
          float rim = smoothstep(0.885, 0.915, wr);
          float n = snoise(vec3(cos(ang) * 16.0, sin(ang) * 16.0, sd));
          col = mix(col, mix(cRim0, cRim1, n * 0.5 + 0.5), rim);
          // 交界处零星的毛刺（不连成一圈）
          float tick = snoise(vec3(cos(ang) * 38.0, sin(ang) * 38.0, sd + rr * 6.0));
          float fray = (1.0 - smoothstep(0.0, 0.022, abs(wr - 0.89 - tick * 0.012))) * smoothstep(0.15, 0.65, tick);
          col = mix(col, cFray, fray * 0.6);
        } else {
          // 侧壁：近黑的外皮，一层黄褐的细绒点
          float n = snoise(vec3(cos(ang) * 16.0, sin(ang) * 16.0, vRest.z * 2.0 + sd));
          float fl = mix(0.0, step(0.72, hash12(floor(vec2(ang * 34.0, vRest.z * 5.0 + sd)))), 1.0);
          col = mix(mix(cRim0, cRim1, n * 0.5 + 0.5), cFray, fl * 0.32);
          bump += n * 0.02;
        }
        diffuseColor.rgb = col;
        procBump = bump;
      `,bump:!0})}var Vh=class{count=10;group=new H;heroGroup=new H;hero;others=[];heroShape=new Ih;othersShape=new Ih;matHero;heroFuzz=[];fuzzMats=[];matOthers;matHeel;rots=[];form={dry:0,oval:0,cyl:0};othersCyl=0;rind=0;constructor(){this.matHero=Lh(0),this.matOthers=Lh(3),this.matHeel=Lh(0),this.hero=new W(this.heroShape.geo,this.matHero),this.hero.castShadow=!0,this.hero.receiveShadow=!0,this.heroGroup.add(this.hero);for(let e of[1,2,3]){let t=Lh(0,e);this.fuzzMats.push(t);let n=new W(this.heroShape.geo,t);n.receiveShadow=!0,n.visible=!1,this.heroFuzz.push(n),this.heroGroup.add(n)}let e=Vu(41);this.rots.push(new B);for(let t=1;t<this.count;t++){let t=new W(this.othersShape.geo,this.matOthers);t.castShadow=!0,t.receiveShadow=!0,t.visible=!1,this.others.push(t),this.group.add(t),this.rots.push(new B().setFromAxisAngle(new V(e()-.5,e()-.5,e()-.5).normalize(),e()*Math.PI*2))}}rot(e){return this.rots[e]}setFruit(e,t,n){let r=this.others[e-1];r.position.copy(t),r.quaternion.copy(n)}show(e){for(let t of this.others)t.visible=e}sync(e){let t=this.form;this.heroShape.set(t),this.othersShape.set({dry:t.dry,oval:0,cyl:this.othersCyl});for(let n of[this.matHero,this.matHeel,...this.fuzzMats])Rh(n,{blanch:e.blanch,wet:e.wet,dry:e.dry,cyl:t.cyl,rind:this.rind});Rh(this.matOthers,{blanch:e.blanch,wet:e.wet,dry:e.dry,cyl:this.othersCyl,rind:this.rind});for(let e of this.heroFuzz)e.visible=t.dry>.1}setOval(e,t,n=0){let r=q(1,Q.oval.x/Q.shrunk,t)*q(1,Q.cylR/Q.oval.x,n),i=q(1,Q.oval.y/Q.shrunk,t),a=q(1,Q.oval.z/Q.shrunk,t)*q(1,Q.cylR/Q.oval.z,n);this.others[e-1].scale.set(r,i,a)}resetScale(){for(let e of this.others)e.scale.set(1,1,1)}setClip(e){this.matHero.clippingPlanes=e;for(let t of this.fuzzMats)t.clippingPlanes=e}lift(e){return q(Nh,Q.shrunk,e)}};function Hh(e,t,n=!0){let r=new W(e,t);return r.castShadow=n,r.receiveShadow=!0,r}function Uh(){return kd({color:`#8E8A84`,roughness:.4,metalness:.85},{color:`
        float n = fbm3(vPos * vec3(0.4, 2.0, 2.0)) * 0.5 + 0.5;
        diffuseColor.rgb *= 0.7 + 0.35 * n;
        float edge = 1.0 - smoothstep(0.0, 0.7, vPos.y + 2.5);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.86, 0.85, 0.82), edge * 0.8);
        float rust = smoothstep(0.62, 0.82, fbm3(vPos * 0.5 + 4.0) * 0.5 + 0.5) * (1.0 - edge);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.36, 0.22, 0.14), rust * 0.6);
      `,rough:`roughnessFactor = mix(0.42, 0.22, edge) + rust * 0.3;`})}var Wh={len:46,depth:9,height:6,pinX:-21,pinY:2.2,bladeZ:.45},Gh=class{group=new H;blade=new H;constructor(){let e=Wh,t=bp({axis:`x`,light:`#9A7656`,dark:`#5C4130`,seed:51,worn:.5}),n=Hh(new wi(e.len,e.height,e.depth),t);n.position.set(0,-e.height/2,-e.depth/2),this.group.add(n);let r=Hh(new wi(e.len-4,1.2,.3),Dp({rust:.3,polish:.4}));r.position.set(1,-.6,.15),this.group.add(r);let i=Dp({rust:.4});for(let t of[-.1,1]){let n=Hh(new wi(3.2,8.5,.35),i);n.position.set(e.pinX,e.pinY-2.4,t),this.group.add(n)}let a=Hh(new G(.42,.42,1.9,12),i);a.rotation.x=Math.PI/2,a.position.set(e.pinX,e.pinY,.45),this.group.add(a),this.blade.position.set(e.pinX,e.pinY,e.bladeZ),this.group.add(this.blade);let o=new ia;o.moveTo(-1.2,1),o.lineTo(34,1.3),o.lineTo(34.5,-1.2),o.quadraticCurveTo(18,-3.4,1.5,-2.8),o.lineTo(-1.2,-1.6),o.lineTo(-1.2,1);let s=new Ha(o,{depth:.3,bevelEnabled:!0,bevelThickness:.05,bevelSize:.05,bevelSegments:1,curveSegments:12});s.translate(0,0,-.15);let c=Hh(s,Uh());this.blade.add(c);let l=Hh(new wi(33,.5,.55),i);l.position.set(16.5,1.05,0),this.blade.add(l);let u=Hh(new G(1.15,1.35,14,14),bp({axis:`y`,light:`#8A6444`,dark:`#4E3828`,seed:52}));u.rotation.z=-Math.PI/2+.06,u.position.set(41,.6,0),this.blade.add(u);let d=Hh(new G(1.4,1.4,1.2,14),i);d.rotation.z=-Math.PI/2,d.position.set(34.4,.3,0),this.blade.add(d),this.setOpen(.6)}setOpen(e){this.blade.rotation.set(0,0,e-.035)}},Kh=class{group=new H;halfW=22;front=20;back=-18;constructor(){let e=Tp({w:1.1,mode:`flat`,color:`#BE9A62`,dark:`#7E6040`}),t=Hh(new wi(48,.6,42),e);t.position.set(0,.3,0),this.group.add(t);let n=Hh(new Ka([new z(23.5,.2),new z(24.2,4),new z(24.8,9),new z(24.4,9.6),new z(23.6,8.8),new z(23,4),new z(22.8,.6)],48,Math.PI/2,Math.PI),e);n.scale.set(1,1,.9),n.position.z=-1,this.group.add(n);for(let t of[-1,1]){let n=new ia;n.moveTo(0,0),n.lineTo(0,9.4),n.lineTo(20.5,1.2),n.lineTo(20.5,0),n.lineTo(0,0);let r=new Ha(n,{depth:.7,bevelEnabled:!1});r.rotateY(-Math.PI/2);let i=Hh(r,e);i.position.set(t*23.6+.35,.2,-1),this.group.add(i)}let r=Hh(new G(.5,.5,46,10),new co({color:`#B08A55`,roughness:.6}));r.rotation.z=Math.PI/2,r.position.set(0,.6,20.6),this.group.add(r)}};function qh(e,t,n=!0){let r=new W(e,t);return r.castShadow=n,r.receiveShadow=!0,r}var Jh={r:2.1,rIn:1.58,len:7};function Yh(){let e=e=>new U(e);return kd({roughness:.42,metalness:0,clearcoat:.45,clearcoatRoughness:.4},{uniforms:{uAge:{value:0},uRIn:{value:Jh.rIn+.04},uR:{value:Jh.r-.02},uLen:{value:Jh.len},cGreen0:{value:e(`#6E7420`)},cGreen1:{value:e(`#A3A23A`)},cOld0:{value:e(`#857C3E`)},cOld1:{value:e(`#B8AC68`)},cMeat:{value:e(`#EDE3BC`)},cMeatOld:{value:e(`#C8BA80`)},cIn:{value:e(`#B8AF74`)},cInOld:{value:e(`#7C6C3C`)}},color:`
        float rho = length(vPos.xz);
        float az = atan(vPos.z, vPos.x);
        float low = snoise(vec3(cos(az) * 1.3, sin(az) * 1.3, vPos.y * 0.22 + 2.0));
        float fib = snoise(vec3(cos(az) * 22.0, sin(az) * 22.0, vPos.y * 0.5));
        // 带黄的橄榄绿，深浅一块一块的
        float blot0 = snoise(vec3(cos(az) * 1.8, sin(az) * 1.8, vPos.y * 0.26 + 5.0));
        vec3 green = mix(cGreen0, cGreen1, smoothstep(-1.0, 1.0, low * 0.5 + blot0 * 0.7)) * (0.98 + 0.035 * fib);
        // 烘过：黄褐，局部还留一点绿，靠下的地方熏得深一点
        float blot = snoise(vec3(cos(az) * 1.8, sin(az) * 1.8, vPos.y * 0.3 + 9.0));
        vec3 old = mix(cOld0, cOld1, smoothstep(-1.0, 1.0, blot + low * 0.4)) * (0.93 + 0.09 * fib);
        old *= 0.88 + 0.12 * smoothstep(0.0, uLen * 0.3, vPos.y);
        float turn = smoothstep(blot * 0.22, 1.0 + blot * 0.22, uAge * 1.2 - 0.1);
        vec3 skin = mix(green, old, turn);
        // 内壁、筒口的竹肉
        float inner = 1.0 - smoothstep(uRIn - 0.02, uRIn + 0.02, rho);
        float meat = smoothstep(uRIn, uRIn + 0.03, rho) * (1.0 - smoothstep(uR - 0.03, uR, rho));
        meat *= smoothstep(uLen - 0.02, uLen, vPos.y) + (1.0 - smoothstep(0.0, 0.02, vPos.y));
        vec3 col = mix(skin, mix(cIn, cInOld, uAge), inner);
        col = mix(col, mix(cMeat, cMeatOld, uAge), clamp(meat, 0.0, 1.0));
        diffuseColor.rgb = col;
        procBump = fib * 0.004;
      `,rough:`roughnessFactor = mix(0.42, 0.74, uAge);`,physical:`
        #ifdef USE_CLEARCOAT
          material.clearcoat = 0.45 * (1.0 - uAge * 0.8);
        #endif
      `,bump:!0})}function Xh(e){return Od({roughness:.74,metalness:0,side:2},{uniforms:{uN:{value:e},cA:{value:new U(`#D8C698`)},cB:{value:new U(`#B39C68`)}},discard:`
        
    float cvRho = max(length(vPos.xz), 1.5);
    float cvA = atan(vPos.z, vPos.x) / 6.28318530718 * uN;
    float cvV = log(cvRho) * uN / 6.28318530718;
    float cvU1 = cvA + cvV;
    float cvU2 = cvA - cvV;
    float cvD1 = abs(fract(cvU1) - 0.5);
    float cvD2 = abs(fract(cvU2) - 0.5);
    // 一格比像素还小的时候不挖孔（不然一闪一闪）
    float cvAA = 1.0 - smoothstep(0.25, 0.6, (fwidth(vPos.x) + fwidth(vPos.z) + fwidth(vPos.y)) / (cvRho * 6.28318530718 / uN));
  
        if (cvD1 > 0.37 && cvD2 > 0.37 && cvRho > 3.0 && vPos.y > 0.8 && cvAA > 0.5) discard;
      `,color:`
        float on1 = 1.0 - step(0.37, cvD1);
        float on2 = 1.0 - step(0.37, cvD2);
        float i1 = floor(cvU1);
        float i2 = floor(cvU2);
        // 一上一下：格子奇偶决定交叉处哪根在上
        float top1 = on1 * (1.0 - on2 * step(0.5, mod(i1 + i2, 2.0)));
        float id = mix(i2 + 61.0, i1, top1);
        float d = mix(cvD2, cvD1, top1);
        float along = mix(cvU1, cvU2, top1);
        float fib = snoise(vec3(d * 22.0 + id, along * 1.6, id));
        vec3 col = mix(cB, cA, hash11(mod(id, 97.0) + 1.3) * 0.75 + 0.1 * fib + 0.1);
        // 篾条边上一条暗线，压在下面那根靠近交叉处发暗
        col *= 1.0 - 0.34 * smoothstep(0.3, 0.37, d) * cvAA;
        diffuseColor.rgb = mix(mix(cA, cB, 0.5), col, cvAA);
        procBump = (1.0 - smoothstep(0.26, 0.37, d)) * 0.05 * cvAA;
      `,bump:!0})}var Zh={r:34.6,h:21,seat:4.2},Qh=class{group=new H;tubes=[];mat=Yh();rod=new H;cover=new H;constructor(){let{r:e,rIn:t,len:n}=Jh,r=[new z(t,0),new z(e,0),new z(e,n),new z(t,n),new z(t,0)],i=[];for(let e=0;e<r.length-1;e++)i.push(r[e],r[e].clone().lerp(r[e+1],.5));i.push(r[r.length-1]);let a=new Ka(i,40);for(let e=0;e<10;e++){let e=qh(a,this.mat);e.visible=!1,this.tubes.push(e),this.group.add(e)}let o=qh(new G(Q.cylR-.25,Q.cylR-.15,19,18),bp({axis:`y`,light:`#C9A06C`,dark:`#8E6A42`,seed:71}));o.position.y=9.5,this.rod.add(o),this.rod.visible=!1,this.group.add(this.rod);let s=[],{r:c,h:l}=Zh;for(let e=0;e<=28;e++){let t=e/28*Math.PI/2;s.push(new z(Math.max(.01,c*Math.cos(t)),l*Math.sin(t)**.85))}let u=qh(new Ka(s.reverse().reverse(),96),Xh(52));this.cover.add(u);let d=qh(new Ya(c,.55,8,96),bp({axis:`x`,light:`#BFA672`,dark:`#8A7248`,seed:72}));d.rotation.x=Math.PI/2,d.position.y=.4,this.cover.add(d),this.cover.visible=!1,this.group.add(this.cover)}setAge(e){this.mat.userData.proc.uniforms.uAge.value=e}hideAll(){for(let e of this.tubes)e.visible=!1;this.rod.visible=!1,this.cover.visible=!1}},$h=.76,eg={height:2.6*$h,pinX:-15*$h,pinY:.7*$h};function tg(e){let t=[],n=[];e.forEach(e=>{for(let n=0;n<20;n++){let r=n/20*Math.PI*2,i=Math.cos(r),a=Math.sin(r),o=q(.18,1,e.round),s=Math.sign(a)*Math.abs(a)**+o,c=Math.sign(i)*Math.abs(i)**+o;t.push(e.x,q(e.bot,e.top,s*.5+.5),c*e.w/2)}});for(let t=0;t<e.length-1;t++)for(let e=0;e<20;e++){let r=(e+1)%20,i=t*20+e,a=t*20+r,o=(t+1)*20+e,s=(t+1)*20+r;n.push(i,s,a,i,o,s)}let r=(e,r)=>{let i=t.length/3,a=0,o=0,s=0;for(let n=0;n<20;n++)a+=t[(e+n)*3]/20,o+=t[(e+n)*3+1]/20,s+=t[(e+n)*3+2]/20;t.push(a,o,s);for(let t=0;t<20;t++){let a=e+t,o=e+(t+1)%20;r?n.push(i,o,a):n.push(i,a,o)}};r(0,!1),r((e.length-1)*20,!0);let i=new Pr;return i.setAttribute(`position`,new yr(new Float32Array(t),3)),i.setIndex(n),i.computeVertexNormals(),i}var ng=class{group=new H;paddle=new H;constructor(){let e=new H;e.scale.setScalar($h),this.group.add(e);let t=bp({axis:`x`,light:`#6E5040`,dark:`#35241C`,seed:61,worn:.5}),n=qh(new wi(34,2.6,20),t);n.position.y=-2.6/2,e.add(n);let r=(n,r,i,a)=>{let o=qh(new wi(n,.7,r),t);o.position.set(i,.35,a),e.add(o)};r(28,1.4,3,9.3),r(28,1.4,3,-9.3),r(1.4,17.2,16.3,0);for(let n of[-5.6,5.6]){let r=qh(new wi(5,4,1.2),t);r.position.set(-15,1.6,n),e.add(r)}let i=qh(new G(.5,.5,13.4,12),Dp({rust:.5}));i.rotation.x=Math.PI/2,i.position.set(-15,2.0999999999999996,0),e.add(i),this.paddle.position.set(-15,.7,0),e.add(this.paddle);let a=bp({axis:`x`,light:`#DDB070`,dark:`#A77A42`,seed:62,worn:.25}),o=tg([{x:-2.2,w:8.6,top:3.2,bot:.6,round:.45},{x:-1.2,w:9.6,top:4.1,bot:.1,round:.3},{x:2,w:10,top:4.4,bot:0,round:.25},{x:22,w:10,top:4.2,bot:0,round:.25},{x:25,w:8.4,top:3.9,bot:0,round:.35},{x:28,w:5,top:3.1,bot:.15,round:.6},{x:31,w:3.3,top:2.75,bot:.3,round:.9},{x:44,w:3.2,top:2.7,bot:.4,round:1},{x:45,w:2.6,top:2.45,bot:.65,round:1}]);this.paddle.add(qh(o,a)),this.setOpen(.6)}setOpen(e){this.paddle.rotation.z=e}angleOnto(e,t,n){let r=eg,i=e-r.pinX,a=n-r.pinY,o=Math.hypot(i,a),s=Math.atan2(a,i),c=s;for(let e=0;e<5;e++){let e=Math.hypot(t*Math.sin(c),n*Math.cos(c));c=s+Math.asin(Math.min(.99,e/o))}return c}},rg=(e,t,n)=>new V(e,t,n),ig=new V(0,1,0),ag=new V(1,0,0),og=new V(0,0,1),sg={hiss:.5,flip:8.2},cg={first:3.6,second:6},lg={seat:4,push:7.2},ug={down:4.3,up:9.2},dg={drop:7.3,setDown:10.1},fg={pour:5.8,first:6.3,lidUp:11.65,lidOn:12.97},pg=.9,mg=new V(Z.press.x,Z.tableTop+.01,Z.press.z+33),hg=new WeakMap;function gg(e){let t=hg.get(e.w);return t||(t={tubes:new Qh,press:new ng,jar:new fm},t.press.group.visible=!1,t.jar.group.children[0].material.opacity=.11,t.jar.group.scale.setScalar(pg),t.jar.lid.scale.setScalar(pg),t.jar.group.position.copy(mg),t.jar.group.visible=!1,t.jar.lid.visible=!1,e.w.scene.add(t.tubes.group,t.press.group,t.jar.group,t.jar.lid),hg.set(e.w,t)),t}var _g={x:0,z:15.5},vg={x:0,z:13},yg={x:-10,z:-2},bg=(()=>{let e=Vu(303),t=[{x:0,z:0,yaw:.2}];for(let n=0;n<9;n++){let r=(10+40*n)*Math.PI/180+(e()-.5)*.12,i=20+(e()-.5)*1.6;t.push({x:Math.cos(r)*i,z:Math.sin(r)*i,yaw:e()*6.28})}return t})(),xg=new B().setFromAxisAngle(ag,-Math.PI/2).premultiply(new B().setFromAxisAngle(ig,Math.PI/2)),Sg=new B().setFromAxisAngle(og,-Math.PI/2),Cg=new B().setFromAxisAngle(ag,Math.PI/2),wg=new B,Tg=Jh.len-.1-Q.cylH,Eg=class extends Xd{q=new B;qf=new B;constructor(e,t=`cakeOven`){super(e,t,16)}lights(){return[[0,`forenoon`],[8.6,`noon`],[15.4,`noon`]]}carry(e){let t=this.s,n=J(1.5,15,e);t.w.cakes.form.dry=n,!(e<0)&&(t.look.wet*=1-J(0,4,e),t.look.dry=Math.max(t.look.dry,n),e<this.dur&&(t.carry.ovenOn=Math.max(t.carry.ovenOn,J(0,1.5,e)),t.carry.haze=Math.max(t.carry.haze,J(.5,2.5,e)*(1-J(this.dur-1,this.dur,e))*.8),t.carry.bloom=.32))}shots(e){let t=Z,n=this.s,r=rg(t.oven.x,t.ovenTop+1,t.oven.z);e(0,6.4,{target:r,dist:112,az:18,el:32,fov:32,ap:.09},{target:r,dist:98,az:28,el:34,fov:32,ap:.1}),e(6.4,11,{target:n.fruitCenter,dist:32,az:24,el:40,fov:30,ap:.3},{target:n.fruitCenter,dist:24,az:8,el:40,fov:30,ap:.34},1.2),e(11,16,{target:r,dist:72,az:-4,el:50,fov:32,ap:.12},{target:r,dist:64,az:10,el:52,fov:32,ap:.13},1.2)}sounds(e){let t=Z,n=rg(t.oven.x,t.ovenTop,t.oven.z);e(sg.hiss,`hiss`,{dur:5,gain:.45,at:n});for(let t=0;t<10;t++)e(sg.flip+t*.1-.02,`tap`,{gain:.28,pitch:.7,at:n})}hide(){let e=this.s.w;e.table.stone.visible=!1,e.table.topBoard.visible=!1,e.cakes.resetScale();let t=hg.get(e);t&&(t.tubes.hideAll(),t.press.group.visible=!1)}pose(e){let t=this.s,n=Z,r=t.w.cakes,i=r.lift(r.form.dry)+.03,a=new V;for(let o=0;o<10;o++){let s=t.layout.sieve[o],c=Y(X(e,sg.flip-1.2+o*.1,sg.flip+o*.1));a.set(n.oven.x+s.x,n.ovenTop+i+Math.sin(Math.PI*c)*7.5,n.oven.z+s.y),this.q.setFromAxisAngle(ag,c*Math.PI).multiply(this.qf.copy(t.fruitRot(o))),o===0?(t.setHeroByCenter(a,this.q),t.applyHero()):r.setFruit(o,a,this.q)}r.show(!0),t.w.batchSteam.set(rg(n.oven.x,n.ovenTop+3,n.oven.z),.45*J(.5,2.5,e)*(1-J(4,7,e)))}},Dg=class extends Xd{q=new B;constructor(e,t=`press`){super(e,t,13)}ovalAt(e){return Ku(e,[[3.2,0],[3.9,.7],[5.6,.7],[6.2,1]])}openAt(e){return Ku(e,[[2.6,.62],[3.6,0],[4.4,0],[5,.5],[5.3,.5],[5.9,0],[7,0],[8,.62]])}carry(e){this.s.w.cakes.form.oval=this.ovalAt(e)}lights(){return[[0,`afternoon`],[12.4,`afternoon`]]}seat(){let e=Z;return rg(e.press.x+yg.x,e.press.y+eg.height,e.press.z+yg.z)}shots(e){let t=this.seat().add(rg(0,1.8,0));e(0,2.6,{target:t,dist:46,az:26,el:18,fov:30,ap:.2},{target:t,dist:40,az:22,el:16,fov:30,ap:.22}),e(2.6,8,{target:t,dist:36,az:20,el:13,fov:30,ap:.24},{target:t,dist:32,az:14,el:14,fov:30,ap:.24},.8),e(8,13,{target:t,dist:30,az:12,el:20,fov:30,ap:.26},{target:t,dist:25,az:4,el:26,fov:30,ap:.3},.8)}sounds(e){let t=this.seat();e(cg.first,`squish`,{dur:1.1,gain:.4,at:t}),e(cg.second,`squish`,{dur:.9,gain:.32,at:t})}pose(e){let t=this.s,n=t.w.cakes,{press:r}=gg(t),i=this.seat(),a=Q.oval,o=Q.shrunk;r.group.visible=!0,r.group.position.copy(i);let s=n.form.oval,c=q(o,a.z,s),l=rg(i.x,i.y+c+.02,i.z),u=rg(i.x+vg.x,Z.press.y+o,i.z+vg.z),d=X(e,1.4,2.6),f=d<1?Gu(new V,u,l,d,2.2):l;t.setHeroByCenter(f,this.q.copy(t.fruitRot(0)).slerp(xg,Y(d))),t.applyHero(),r.setOpen(Math.max(this.openAt(e),r.angleOnto(0,q(o,a.y,s),c)))}},Og=Jh.len+.9,kg=class extends Xd{q=new B;constructor(e,t=`tube`){super(e,t,10)}yAt(e){return Ku(e,[[1.6,Q.oval.z],[2.8,Jh.len+Q.oval.y+.5],[3.1,Jh.len+Q.oval.y+.5],[4.1,Og],[6,Og],[7.6,Tg]])}cylAt(e){return Ku(e,[[3.1,0],[4.1,.35],[6,.35],[7.6,1]])}carry(e){let t=this.s.w.cakes.form;t.cyl=this.cylAt(e),e>=3.1&&e<7.6?(t.mouth=Jh.len-this.yAt(e),t.mouthR=Jh.rIn-.03):(t.mouth=void 0,t.mouthR=void 0)}lights(){return[[0,`afternoon`],[9.4,`afternoon`]]}shots(e){let t=Z,n=rg(t.press.x+_g.x+1.5,t.press.y+5.5,t.press.z+_g.z);e(0,10,{target:n,dist:36,az:22,el:12,fov:30,ap:.2},{target:n,dist:29,az:10,el:20,fov:30,ap:.22})}sounds(e){let t=Z,n=rg(t.press.x,t.press.y,t.press.z+15);e(lg.seat,`squish`,{dur:.5,gain:.25,at:n}),e(lg.push,`knock`,{gain:.25,pitch:1.4,at:n})}pose(e){let t=this.s,n=Z,r=t.w.cakes,{tubes:i}=gg(t);i.setAge(0);let a=i.tubes[0];a.visible=!0,a.rotation.set(0,0,0),a.position.set(n.press.x+_g.x,n.press.y+.02,n.press.z+_g.z);let o=this.yAt(e),s=Ku(e,[[1.9,5],[3,0]]),c=rg(n.press.x+_g.x+s,n.press.y+o,n.press.z+_g.z);t.setHeroByCenter(c,this.q.copy(xg).slerp(wg,Y(X(e,1.7,3)))),t.applyHero();let l=i.rod;if(l.visible=e>5&&e<8.8,l.visible){let t=c.y+q(Q.oval.y,Q.cylH,r.form.cyl),i=n.press.y+34,a=e<6?q(i,n.press.y+Og+q(Q.oval.y,Q.cylH,.35),Y(X(e,5,6))):e<7.6?t:q(t,i,Y(X(e,7.6,8.8)));l.rotation.set(0,0,0),l.position.set(c.x,a,c.z)}}},Ag=class extends Xd{constructor(e,t=`cover`){super(e,t,14.5)}lights(){return[[0,`afternoon`],[4.8,`golden`],[13.9,`dusk`]]}carry(e){let t=this.s.carry;e<0||e>=this.dur||(t.ovenOn=Math.max(t.ovenOn,J(0,1.5,e)),t.haze=Math.max(t.haze,J(.5,2.5,e)*(1-J(this.dur-1,this.dur,e))*.7),t.bloom=.3,t.lapse=Math.max(t.lapse,300*J(4.4,9.2,e)))}shots(e){let t=Z,n=rg(t.oven.x,t.ovenTop+6,t.oven.z);e(0,4.6,{target:n,dist:96,az:16,el:28,fov:32,ap:.09},{target:n,dist:110,az:22,el:24,fov:32,ap:.09}),e(4.6,9,{target:n,dist:112,az:24,el:22,fov:32,ap:.09},{target:n,dist:104,az:12,el:24,fov:32,ap:.09},1),e(9,11.6,{target:n,dist:96,az:8,el:30,fov:32,ap:.1},{target:n,dist:72,az:4,el:36,fov:32,ap:.12},1),e(11.6,14.5,{target:rg(n.x,t.ovenTop+4,n.z+4),dist:54,az:2,el:40,fov:30,ap:.16},{target:rg(n.x,t.ovenTop+4,n.z+2),dist:40,az:14,el:38,fov:30,ap:.2},1)}sounds(e){let t=Z,n=rg(t.oven.x,t.ovenTop,t.oven.z);e(ug.down,`rustle`,{dur:.6,gain:.45,at:n}),e(ug.up,`rustle`,{dur:.6,gain:.4,at:n})}pose(e){let t=this.s,n=Z,r=t.w.cakes,{tubes:i}=gg(t);i.setAge(J(4.6,9.2,e));let a=new V;for(let e=0;e<10;e++){let o=bg[e],s=n.ovenTop+.02,c=i.tubes[e];c.visible=!0,c.rotation.set(0,o.yaw,0),c.position.set(n.oven.x+o.x,s,n.oven.z+o.z),a.set(c.position.x,s+Tg,c.position.z),e===0?(t.setHeroByCenter(a,wg),t.applyHero()):(r.setFruit(e,a,wg),r.setOval(e,1,1))}r.show(!0);let o=Ku(e,[[2.2,70],[4.4,0],[9.2,0],[11.2,70]]);i.cover.visible=e>2.2&&e<11.2,i.cover.position.set(n.oven.x,n.ovenTop+Zh.seat+o,n.oven.z)}},jg=class{x0;z0;floor;cell;h;n;constructor(e,t,n,r,i=.4){this.x0=e,this.z0=t,this.floor=r,this.cell=i,this.n=Math.ceil(n/i),this.h=new Float32Array(this.n*this.n).fill(r)}place(e,t,n,r,i,a){let o=Math.cos(n),s=Math.sin(n),c=Math.hypot(r,i),l=[],u=this.floor,d=Math.max(0,Math.floor((e-c-this.x0)/this.cell)),f=Math.min(this.n-1,Math.ceil((e+c-this.x0)/this.cell)),p=Math.max(0,Math.floor((t-c-this.z0)/this.cell)),m=Math.min(this.n-1,Math.ceil((t+c-this.z0)/this.cell));for(let n=d;n<=f;n++)for(let a=p;a<=m;a++){let c=this.x0+(n+.5)*this.cell-e,d=this.z0+(a+.5)*this.cell-t,f=c*o-d*s,p=c*s+d*o;if(Math.abs(f)<=r+this.cell*.5&&Math.abs(p)<=i+this.cell*.5){let e=n*this.n+a;l.push(e),u=Math.max(u,this.h[e])}}let h=u+.012;for(let e of l)this.h[e]=h+a;return h}},Mg=class e{x0;z0;floor;cell;h;n;covered=0;constructor(e,t,n,r,i=.25){this.x0=e,this.z0=t,this.floor=r,this.cell=i,this.n=Math.ceil(n/i),this.h=new Float32Array(this.n*this.n).fill(r)}cells(e,t,n,r,i){let a=Math.cos(n),o=Math.sin(n),s=Math.hypot(r,i),c=[],l=Math.max(0,Math.floor((e-s-this.x0)/this.cell)),u=Math.min(this.n-1,Math.ceil((e+s-this.x0)/this.cell)),d=Math.max(0,Math.floor((t-s-this.z0)/this.cell)),f=Math.min(this.n-1,Math.ceil((t+s-this.z0)/this.cell));for(let n=l;n<=u;n++)for(let s=d;s<=f;s++){let l=this.x0+(n+.5)*this.cell-e,u=this.z0+(s+.5)*this.cell-t,d=l*a-u*o,f=l*o+u*a;Math.abs(d)<=r&&Math.abs(f)<=i&&c.push([n*this.n+s,d,f])}return c}static lean(e,t){let n=[];for(let t of e){for(;n.length>=2;){let[e,r]=n[n.length-2],[i,a]=n[n.length-1];if((i-e)*(t[1]-r)-(a-r)*(t[0]-e)>=0)n.pop();else break}n.push(t)}let r=0;for(;r<n.length-2&&n[r+1][0]<0;)r++;let[i,a]=n[r],[o,s]=n[Math.min(r+1,n.length-1)],c=o>i?(s-a)/(o-i):0;c=Iu(c,-t,t);let l=-1/0;for(let[t,n]of e)l=Math.max(l,n-c*t);return{base:l,slope:c}}rest(t,n,r,i,a){let o=this.cells(t,n,r,i,a),s=this.cell,c=new Map;for(let[e,t]of o){let n=Math.round(t/s);c.set(n,Math.max(c.get(n)??-1/0,this.h[e]))}let l=[...c.entries()].sort((e,t)=>e[0]-t[0]).map(([e,t])=>[e*s,t]),u=e.lean(l,.6),d=new Map;for(let[e,t,n]of o){let r=Math.round(n/s);d.set(r,Math.max(d.get(r)??-1/0,this.h[e]-(u.base+u.slope*t)))}let f=[...d.entries()].sort((e,t)=>e[0]-t[0]).map(([e,t])=>[e*s,t]),p=e.lean(f,.5);return{y:u.base+p.base,b:u.slope,c:p.slope,cells:o}}add(e,t){let n=t*Math.hypot(1,e.b,e.c);for(let[t,r,i]of e.cells)this.h[t]<=this.floor+1e-4&&this.covered++,this.h[t]=Math.max(this.h[t],e.y+e.b*r+e.c*i+n)}get coveredCells(){return this.covered}};function Ng(e,t=new B){return t.setFromAxisAngle(ag,-Math.PI/2).premultiply(new B().setFromAxisAngle(ig,e))}var Pg=Q.disc,Fg=Q.cylH-Q.cylDome,Ig=Math.floor(2*Fg/Pg),Lg=e=>Fg-e*Pg,Rg=10.6,zg=1.2,Bg=.62,Vg=e=>Rg+(e<=3?e*zg:3*zg+(e-3)*Bg),Hg=e=>{let t=e-Rg;return t<=3*zg?t/zg:3+(t-3*zg)/Bg},Ug={x:-8,z:13},Wg={rodIn:1.2,touch:2.2,out:6.6},Gg={from:8.4,to:10.2},Kg=class extends Xd{group=new H;discs=[];spots=[];heel=new H;heelMesh;cap;plane=new Rr(new V(0,0,-1),0);heelPlane=new Rr(new V(0,0,1),0);q=new B;built=!1;constructor(e,t=`slice`){super(e,t,23.4)}carry(e){let t=this.s.w.cakes;t.rind=J(Gg.from-.4,Gg.to-.2,e)*.8}prepare(){this.build(),this.s.w.cakes.setClip([this.plane]),this.group.visible=!0}build(){if(this.built)return;this.built=!0;let e=this.s,t=e.w.cakes,n=Bh();for(let e=0;e<Ig;e++){let t=new W(zh(e+1,Pg*.96),n);t.castShadow=!0,t.receiveShadow=!0,this.discs.push(t),this.group.add(t)}this.cap=new W(zh(40,.02,.4,Q.cylR*.985),n),this.cap.rotation.x=-Math.PI/2,t.heroGroup.add(this.cap),t.matHeel.clippingPlanes=[this.heelPlane],this.heelMesh=new W(t.heroShape.geo,t.matHeel),this.heelMesh.castShadow=!0,this.heel.add(this.heelMesh);let r=new W(zh(41,.02,.4,Q.cylR*.985),n);r.rotation.x=Math.PI/2,r.position.y=Fg+.01,this.heel.add(r),this.group.add(this.heel);let i=this.base(),a=new jg(i.x-30,i.z-2,60,Z.press.y),o=Vu(311),s=Q.cylR;for(let e=0;e<Ig;e++){let e=i.x+4+(o()*2-1)*5,t=i.z+3.4+o()*3.6,n=o()*6.28,r=a.place(e,t,n,s,s,Pg*.96);this.spots.push({c:new V(e,r+Pg*.48,t),q:Ng(n)})}e.w.scene.add(this.group)}sounds(e){let t=this.base(),n=rg(t.x+4,t.y,t.z);e(dg.drop,`tap`,{gain:.3,pitch:.85,at:n}),e(dg.setDown,`knock`,{gain:.3,pitch:1.6,at:n});for(let t=0;t<=Ig;t++)e(Vg(t+.58),`chop`,{gain:.7,pitch:.95+.025*(t*7%5),at:n}),e(this.offAt(t)+.5,`tap`,{gain:.2,pitch:1.2,at:n})}base(){let e=Z;return rg(e.press.x,e.press.y+Wh.height,e.press.z-4)}offAt(e){return Vg(e+.55)}hide(){let e=this.s.w.cutter;e&&(e.group.visible=!1),this.built&&(this.group.visible=!1,this.cap.visible=!1)}lights(){return[[.6,`forenoon`],[22.8,`afternoon`]]}shots(e){let t=Z,n=this.base(),r=n.z+Wh.bladeZ,i=rg(n.x+4,n.y+1.5,r+.5),a=rg(t.press.x+Ug.x-1,t.press.y+2.2,t.press.z+Ug.z),o=rg(n.x+4,t.press.y+1,n.z+5);e(0,4.6,{target:a,dist:38,az:10,el:16,fov:30,ap:.2},{target:a,dist:32,az:4,el:14,fov:30,ap:.22}),e(4.6,8.4,{target:rg(a.x-5,a.y-.6,a.z),dist:22,az:4,el:16,fov:30,ap:.32},{target:rg(a.x-6,a.y-.6,a.z),dist:18,az:-8,el:18,fov:30,ap:.36},.8),e(8.4,10.6,{target:rg(n.x+2,n.y-2,n.z+2),dist:70,az:24,el:28,fov:30,ap:.12},{target:i,dist:44,az:30,el:24,fov:30,ap:.18},.6),e(10.6,15.2,{target:i,dist:22,az:36,el:18,fov:30,ap:.34},{target:i,dist:19,az:44,el:16,fov:30,ap:.36},.8),e(15.2,19.8,{target:rg(n.x+4,n.y-2.5,n.z+1.5),dist:32,az:12,el:32,fov:30,ap:.22},{target:rg(n.x+4,n.y-2.5,n.z+1.5),dist:29,az:2,el:36,fov:30,ap:.24},1),e(19.8,23.4,{target:o,dist:15,az:-6,el:56,fov:30,ap:.3},{target:o,dist:12.5,az:6,el:60,fov:30,ap:.32},1)}pose(e){let t=this.s,n=t.w,r=Z,i=n.cakes,a=n.cutter,{tubes:o}=gg(t);this.build();let s=this.base();a.group.visible=!0,a.group.position.copy(s),this.group.visible=!0,o.setAge(1);let c=r.press.y+Jh.r+.02,l=r.press.x+Ug.x,u=r.press.z+Ug.z,d=o.tubes[0];d.visible=!0,d.rotation.set(0,0,-Math.PI/2),d.position.set(l,c,u);let f=l+Jh.len/2,p=l-Q.cylH-.3,m=q(f,p,Y(X(e,Wg.touch,Wg.out))),h=c-Jh.rIn+Q.cylR,g=r.press.y+Q.cylR+.03,_=q(h,g,J(Wg.out-.4,Wg.out+.7,e)),v=o.rod;v.visible=!0,v.rotation.set(0,0,-Math.PI/2);let y=l+Jh.len+12,b=e<Wg.touch?q(y,f+Q.cylH,Y(X(e,Wg.rodIn,Wg.touch))):e<Wg.out+.4?Math.min(f+Q.cylH,m+Q.cylH):q(m+Q.cylH,y,Y(X(e,Wg.out+.4,Wg.out+1.6)));v.position.set(b,c,u);let x=new V,S=s.z+Wh.bladeZ,C=s.y+Q.cylR+.02,w=s.x+4,T=Hg(e),E=Math.floor(T),D=T-E,O=Fg;E>Ig?O=Lg(Ig):E>0&&(O=q(Lg(E-1),Lg(E),Y(Iu(D/.3))));let k=S-O-(1-Y(X(e,Gg.to,Rg)))*1.6;if(e<Gg.from)x.set(m,_,u),this.q.copy(Sg);else if(e<Gg.to){let t=Y(X(e,Gg.from,Gg.to));Gu(x,rg(p,g,u),rg(w,C,k),t,10),this.q.copy(Sg).slerp(Cg,t)}else x.set(w,C,k),this.q.copy(Cg);t.setHeroByCenter(x,this.q),t.applyHero();let A=D<.3?.62:D<.6?q(.62,0,Ru((D-.3)/.3)):q(0,.62,Ru((D-.6)/.4));a.setOpen(e<Rg||E>Ig?.62:A);let j=0;for(;j<=Ig&&e>=this.offAt(j);)j++;if(j>0){let e=Lg(j-1);this.plane.set(new V(0,0,-1),x.z+e),i.setClip([this.plane]),this.cap.visible=!0,this.cap.position.set(0,e-.012,0)}if(this.heel.visible=j>0,j>0){let t=Ru(Iu((e-this.offAt(0))/.5)),n=Fg+.5,i=rg(w,C,S+.5),a=rg(s.x-3.5,r.press.y+.52,s.z+5.5),o=Gu(new V,i,a,t,1.2),c=this.q.copy(Cg).slerp(wg,t);this.heel.quaternion.copy(c),this.heel.position.copy(o).sub(new V(0,n,0).applyQuaternion(c));let l=new V(0,1,0).applyQuaternion(c);this.heelPlane.setFromNormalAndCoplanarPoint(l,this.heel.position.clone().addScaledVector(l,Fg))}let ee=new B;for(let t=0;t<Ig;t++){let n=this.discs[t],r=e-this.offAt(t+1);if(n.visible=r>=0,!n.visible)continue;let i=this.spots[t],a=Ru(Iu(r/.5));Gu(n.position,rg(w,C,S+Pg/2),i.c,a,1.2),n.quaternion.copy(ee.identity().slerp(i.q,a))}}},qg=8,Jg=new V(0,.6,20.6),Yg=.52,Xg=new V(mg.x,mg.y+19*pg+4.2,mg.z-1),Zg=new V(Z.press.x,Z.press.y+.02,Z.press.z+1),Qg=28,$g={lift0:3.6,lift1:5.6,start:5.2,span:4.8,back0:11.2,back1:12.6,lid0:11.6,lid1:13},e_=.45,t_=.85,n_=240,r_=class e extends Xd{group=new H;pile=[];flakes=[];built=!1;tp=new V;tq=new B;ta=new V;tb=new V;tc=new B;d=new jn;constructor(e,t=`bottle`){super(e,t,Qg)}prepare(){this.build(),this.group.visible=!0,gg(this.s)}static laid(e,t,n,r,i){let a=new B().setFromAxisAngle(ag,-Math.PI/2),o=new B;a.premultiply(o.setFromAxisAngle(ag,-Math.atan(r.c))),a.premultiply(o.setFromAxisAngle(og,Math.atan(r.b))),a.premultiply(o.setFromAxisAngle(ig,n));let s=new V(0,0,1).applyQuaternion(a);return{p:new V(e,r.y,t).addScaledVector(s,i*.5),q:a}}build(){if(this.built)return;this.built=!0;let t=this.s,n=Vu(331),r=t.w.winnow,i=Pg*.96,a=Q.cylR,o=(e,t)=>Math.abs(e)<r.halfW-1.2&&t<r.front-1&&t>r.back+1&&(t>-1||Math.hypot(e,(t+1)/.9)<21.5),s=0;for(let e=-r.halfW+.125;e<r.halfW;e+=.25)for(let t=r.back+.125;t<r.front;t+=.25)o(e,t)&&s++;let c=new Mg(-r.halfW,r.back,r.halfW*2,.62),l=[];for(let t=0;t<700&&c.coveredCells<s*.74;t++){let t=null;for(let e=0,i=0;e<4&&i<40;i++){let i=(n()*2-1)*(r.halfW-1.5),s=q(r.back+1.5,r.front-1.5,n()),l=n()*Math.PI*2,u=Math.cos(l),d=Math.sin(l),f=!0;for(let[e,t]of[[a,a],[a,-a],[-a,a],[-a,-a]])o(i+e*u+t*d,s-e*d+t*u)||(f=!1);if(!f)continue;e++;let p=c.rest(i,s,l,a,a);(!t||p.y<t.y)&&(t={...p,x:i,z:s,yaw:l})}t&&(c.add(t,i),l.push(e.laid(t.x,t.z,t.yaw,t,i)))}l.sort((e,t)=>Math.hypot(e.p.x,e.p.z-Jg.z)-3*e.p.y-(Math.hypot(t.p.x,t.p.z-Jg.z)-3*t.p.y));let u=6.5*pg,d=u-a-.15,f=new Mg(-5.8500000000000005,-5.8500000000000005,u*2,.9*pg,.2),p=l.length,m=Array(qg).fill(0),h=e=>(e+1)/p;for(let t=0;t<p;t++){let r=null;for(let e=0;e<6;e++){let e=n()*6.283,t=Math.sqrt(n())*d,i=Math.cos(e)*t,o=Math.sin(e)*t,s=n()*Math.PI*2,c=f.rest(i,o,s,a*.8,a*.8);(!r||c.y<r.y)&&(r={...c,x:i,z:o,yaw:s})}f.add(r,i);let o=e.laid(r.x,r.z,r.yaw,r,i),s=o.p.add(mg),c=l[t],u=n()*6.283,p=Math.sqrt(n())*3.2,g=new V(mg.x+Math.cos(u)*p,mg.y+19*pg+1.3,mg.z+Math.sin(u)*p),_=new V((n()*2-1)*8,1.35,Jg.z+.2),v=t%qg;this.flakes.push({vi:v,k:m[v]++,lp:c.p,lq:c.q,rel:$g.start+$g.span*h(t)**(1/t_),slide:.35+c.p.distanceTo(_)/60,exit:_,mouth:g,qMid:new B().setFromAxisAngle(new V(n()-.5,n()-.5,n()-.5).normalize(),1.2+n()*2.2),sp:s,sq:o.q,fall:Math.sqrt(2*Math.max(.2,g.y-s.y)/n_)})}let g=Bh();for(let e=0;e<qg;e++){let t=new hi(zh(50+e,i,1,a,36),g,Math.max(1,m[e]));t.castShadow=!0,t.receiveShadow=!0,t.frustumCulled=!1,t.count=m[e],this.pile.push(t),this.group.add(t)}t.w.scene.add(this.group)}hide(){let e=this.s.w.winnow;e&&(e.group.visible=!1),this.group.visible=!1;let t=hg.get(this.s.w);t&&(t.jar.group.visible=!1,t.jar.lid.visible=!1)}lights(){return[[0,`afternoon`],[27,`golden`]]}shots(e){let t=rg(Zg.x,Zg.y+3,Zg.z),n=rg(mg.x,mg.y+10.5,mg.z),r=rg(mg.x,mg.y+16,mg.z-12);e(0,3.8,{target:t,dist:50,az:10,el:54,fov:30,ap:.26},{target:t,dist:44,az:20,el:50,fov:30,ap:.3}),e(3.8,6.4,{target:r,dist:110,az:42,el:15,fov:30,ap:.12},{target:r,dist:88,az:46,el:12,fov:30,ap:.16}),e(6.4,11,{target:n,dist:60,az:42,el:10,fov:30,ap:.2},{target:n,dist:53,az:34,el:12,fov:30,ap:.24},1),e(11,13,{target:n,dist:55,az:32,el:13,fov:30,ap:.22},{target:n,dist:58,az:28,el:15,fov:30,ap:.2},.8);let i={target:rg(n.x-13.8,n.y+1.8,n.z+7.8),dist:88,az:30,el:14.3,fov:30,ap:.14};e(13,15,{target:n,dist:58,az:28,el:15,fov:30,ap:.2},i),e(15,this.dur+2,i,{target:rg(n.x-14.6,n.y+2,n.z+8.3),dist:93,az:31,el:14,fov:30,ap:.14},0,Ru)}sounds(e){let t=rg(mg.x,mg.y+10,mg.z);e(fg.pour,`rustle`,{dur:4.8,gain:.3,at:t});for(let n=0;n<16;n++)e(fg.first+n*.29+n%3*.02,`tap`,{gain:.16,pitch:1.1+n%4*.05,at:t});e(fg.lidUp,`tap`,{gain:.14,pitch:1.3,at:t}),e(fg.lidOn,`clink`,{gain:.55,at:t})}tray(e,t,n){let r=this.ta.copy(Jg).add(Zg),i=Ku(e,[[$g.lift0,r.y],[$g.lift0+1.2,Xg.y],[$g.back0+.8,Xg.y],[$g.back1,r.y]]),a=Ku(e,[[$g.lift0+.8,r.z],[$g.lift1,Xg.z],[$g.back0,Xg.z],[$g.back0+1,r.z]]),o=Ku(e,[[$g.lift0,0],[$g.lift1-.2,Yg],[$g.back0,Yg],[$g.back1,0]]);n.setFromAxisAngle(ag,o),t.set(Xg.x,i,a).sub(this.tb.copy(Jg).applyQuaternion(n))}pose(e){this.build();let t=this.s,{jar:n}=gg(t),r=t.w.winnow;t.w.cakes.heroGroup.visible=!1;let i=this.tp,a=this.tq;this.tray(e,i,a),r.group.visible=!0,r.group.position.copy(i),r.group.quaternion.copy(a);let o=this.d,s=this.ta,c=this.tb,l=this.tc;this.group.visible=!0;for(let t of this.flakes){let n=e-t.rel,r=n-t.slide,u=r-e_;if(u>=t.fall)o.position.copy(t.sp),o.quaternion.copy(t.sq);else if(u>=0){let e=u/t.fall;o.position.lerpVectors(t.mouth,t.sp,e*e),o.quaternion.copy(t.qMid).slerp(t.sq,e)}else if(r>=0){let e=r/e_;s.copy(t.exit).applyQuaternion(a).add(i),c.set(0,0,1).applyQuaternion(a).multiplyScalar(2.4).add(s);let n=(1-e)*(1-e),u=2*e*(1-e),d=e*e;o.position.set(n*s.x+u*c.x+d*t.mouth.x,n*s.y+u*c.y+d*t.mouth.y,n*s.z+u*c.z+d*t.mouth.z),o.quaternion.copy(l.copy(a).multiply(t.lq)).slerp(t.qMid,e)}else{if(n<=0)o.position.copy(t.lp);else{let e=n/t.slide;o.position.lerpVectors(t.lp,t.exit,e*e),o.position.y+=Math.sin(Math.PI*e)*.5}o.position.applyQuaternion(a).add(i),o.quaternion.copy(a).multiply(t.lq)}o.updateMatrix(),this.pile[t.vi].setMatrixAt(t.k,o.matrix)}for(let e of this.pile)e.instanceMatrix.needsUpdate=!0;n.group.visible=!0,n.lid.visible=!0;let u=mg,d=19*pg,f=rg(u.x+17,u.y+1.2*pg,u.z-4),p=rg(u.x,u.y+d+.02,u.z),m=u.y+d+6,h=n.lid.position;if(e<$g.lid0)h.copy(f);else{let t=X(e,$g.lid0,$g.lid1);t<.4?h.lerpVectors(f,rg(f.x,m,f.z),Y(t/.4)):t<.8?h.lerpVectors(rg(f.x,m,f.z),rg(p.x,m,p.z),Y((t-.4)/.4)):h.lerpVectors(rg(p.x,m,p.z),p,Y((t-.8)/.2))}n.lid.rotation.set(0,.3*(1-Y(X(e,$g.lid0,$g.lid1))),0)}},i_=[hh,Mh,{id:`yaguo`,name:`压果片`,blurb:`大果烫过烘软，压扁套进竹筒烘干，顶出来切成小圆片。`,ready:!0,cast:{kind:`cake`},acts:e=>[new th(e),new dh(e,4.8),new ff(e),new Eg(e),new Dg(e),new kg(e),new Ag(e),new Kg(e),new r_(e)],script:{cover:{title:`压果片`,sub:`整果压扁、入筒、切片`,play:`开始`},sentence:[{key:`y1`,text:`夏季采摘未成熟的果实，`,clear:[`pick`,12.5]},{key:`y2`,text:`置沸水中略烫后，`,clear:[`blanch`,16]},{key:`y3`,text:`焙干，`,clear:[`cakeOven`,13.5]},{key:`y4`,text:`压制成形，`,clear:[`press`,7]},{key:`y5`,text:`干燥。`,clear:[`cover`,11]},{key:`y6`,text:`每片真者可值一金。`,clear:[`slice`,19]},{key:`y7`,text:`置阴凉干燥处，防潮及虫蛀。`,clear:[`bottle`,11.5]}],source:`——集《中国药典》《岭南杂记》句`,chapters:[{num:`一`,title:`青果`,seal:`摘`,from:`pick`,phrases:[`y1`],card:`挑四两半以上的大果。`},{num:`二`,title:`烫果`,seal:`烫`,from:`blanch`,phrases:[`y2`],card:`大果整个烫过。`},{num:`三`,title:`初烘`,seal:`焙`,from:`cakeOven`,phrases:[`y3`],card:`小火烘软，缩小一大半。`},{num:`四`,title:`压果`,seal:`压`,from:`press`,phrases:[`y4`],card:`木压果器压成椭圆。`},{num:`五`,title:`入筒烘干`,seal:`烘`,from:`tube`,phrases:[`y5`],card:`套进竹筒定型，上焙炉烘干。`},{num:`六`,title:`切片`,seal:`切`,from:`slice`,phrases:[`y6`],card:`切成两到四毫米的圆片。`},{num:``,title:`装瓶`,seal:`成`,from:`bottle`,phrases:[`y7`],card:`一簸箕圆片，倒进瓶里。`}],captions:[[`pick`,8.6,13.6,`青果还没熟，皮上一层细细的白绒。`],[`weigh`,1.4,4.4,`挑个大的，放上秤称一称。`],[`weigh`,4.9,8.2,`四两八。四两半以上的大果，拿来压果。`],[`blanch`,2.5,7.5,`水要滚透了才下锅。`],[`blanch`,8.2,12,`一篮十个，一起下锅。`],[`blanch`,13.8,18.6,`一烫就捞，颜色转亮了。`],[`blanch`,21.4,27,`摊在竹筛上放凉，沥干水。`],[`cakeOven`,2,5.6,`整果摊上焙炉，小火烘。`],[`cakeOven`,6.6,9.6,`烘一阵，翻一面。`],[`cakeOven`,11,15.2,`烘软了，个头小了一大半。`],[`press`,1.4,5.6,`烘软的果放上压果器，压下去。`],[`press`,8,12.2,`抬起来，圆球压成了椭圆。`],[`tube`,1.8,4.6,`趁软套进竹筒。`],[`tube`,5.4,9.6,`木棍一推，压到筒里定型。`],[`cover`,1.8,4.6,`竹筒竖在竹筛上，盖上竹罩。`],[`cover`,5.2,8.8,`小火慢烘，直到烘透。`],[`cover`,10,13.8,`揭开罩，竹筒由青转黄。`],[`slice`,2.6,8,`木棍一顶，出来一根毛绒圆柱，模样像鹿茸。`],[`slice`,11,15.2,`推一点，切一刀，两到四毫米厚。`],[`slice`,19.8,22.9,`外皮一圈深色，切面由褐转琥珀黄。`],[`bottle`,1.8,4.4,`一簸箕压果片。`],[`bottle`,6.6,12.9,`倒进瓶里，盖好。`]],ending:{title:`压果片`,seal:`成`,replay:`再看一遍`,more:`去展厅看看现在怎么做`}}},kh];function a_(e){return i_.find(t=>t.id===e&&t.ready)??null}function o_(e,t){window.__shot=async n=>{t(),t();let r=await new Promise(t=>e.toBlob(t,`image/jpeg`,.88));return r?(await fetch(`/__shot?name=`+encodeURIComponent(n),{method:`POST`,body:r})).ok?`saved `+n:`fail`:`no blob`}}var s_=e=>e.toFixed(1),c_=(e,t,n,r)=>`${s_(e+n*Math.cos(r))} ${s_(t-n*Math.sin(r))}`,l_=(e,t,n)=>`M${s_(e-n)} ${s_(t)}a${n} ${n} 0 1 0 ${s_(2*n)} 0a${n} ${n} 0 1 0 ${s_(-2*n)} 0`,u_=e=>e*Math.PI/180;function d_(e,t,n,r=72,i=1,a=1){let o=``;for(let s=0;s<=r;s++){let c=s/r*Math.PI*2,l=n(c);o+=`${s?`L`:`M`}${s_(e+Math.cos(c)*l*i)} ${s_(t-Math.sin(c)*l*a)}`}return o+`Z`}function f_(e,t){let n=[];for(let e of[9,4.5])n.push({d:`M${s_(-8.64)} ${s_(146+e)}A112 ${112*.98} 0 0 1 ${s_(208.64)} ${s_(146+e)}`,w:1.1,soft:!0});let r=t?22:13,i=(180-r-r)/(e-1),a=u_(i)*.62,o=(e,n)=>{let r=u_(e),i=n?112:112*.93,o=`M${c_(100,146,12,r+a)}C${c_(100,146,i*.42,r+a*1.18)} ${c_(100,146,i*.84,r+a*.82)} `;return t?`${o}${c_(100,146,i*.95,r+a*.3)}L${c_(100,146,i*.95,r-a*.3)}C${c_(100,146,i*.84,r-a*.82)} ${c_(100,146,i*.42,r-a*1.18)} ${c_(100,146,12,r-a)}Z`:`${o}${c_(100,146,i,r)}C${c_(100,146,i*.84,r-a*.82)} ${c_(100,146,i*.42,r-a*1.18)} ${c_(100,146,12,r-a)}Z`};for(let t=1;t<e;t+=2)n.push({d:o(r+t*i,!1),w:1.5,fill:`back`,soft:!0});let s=Vu(e*31);for(let t=0;t<e;t+=2){let e=r+t*i;n.push({d:o(e,!0),w:2.1,fill:`paper`});let c=``;for(let t of[.38,.52,.66,.78]){let n=u_(e)+(s()-.5)*a*.7,[r,i]=c_(100,146,112*t,n).split(` `).map(Number);c+=l_(r,i,1.1+s()*.6)}n.push({d:c,w:1,soft:!0})}return n.push({d:`M${s_(100-110.88)} 146Q100 149 ${s_(210.88)} 146`,w:2.4}),n.push({d:`${l_(100,141,4.2)}M98 144.5q-6 9 -12 12M102 144.5q5 8 13 10`,w:1.8,red:!0}),n}function p_(){let e=[];for(let t of[{x:70,y:98,R:44,seed:3},{x:118,y:74,R:42,seed:7},{x:128,y:120,R:40,seed:11}]){let n=Vu(t.seed),r=n()*6,i=n()*6,a=e=>n=>t.R*e*(1+.045*Math.sin(3*n+r)+.03*Math.sin(5*n+i));e.push({d:d_(t.x,t.y,a(1),72,1,.94),w:2.1,fill:`paper`}),e.push({d:d_(t.x,t.y,a(.9),72,1,.94),w:1.1,soft:!0}),e.push({d:d_(t.x,t.y,e=>a(.14)(e)*(1+.16*Math.sin(7*e+i)),40,1,.94),w:1.4});let o=``,s=6+Math.floor(n()*3);for(let e=0;e<s;e++){let r=e/s*Math.PI*2+n()*.5,i=t.R*(.2+n()*.08),a=t.R*(.44+n()*.22),c=(n()-.5)*.4;o+=`M${c_(t.x,t.y,i,r)}Q${c_(t.x,t.y,(i+a)/2,r+c)} ${c_(t.x,t.y,a,r+c*.5)}`}e.push({d:o,w:1,soft:!0})}return e}function m_(){let e=[],t=(t,n,r,i,a)=>{let o=e=>r*(1-.09*Math.exp(-(((e-Math.PI/2)/.28)**2))+.012*Math.sin(7*e+i));e.push({d:d_(t,n,o,90,1.04,.95),w:a?2.1:1.6,fill:`paper`,soft:!a});let s=n-r*.95*.91;e.push({d:`M${s_(t-6)} ${s_(s+1)}Q${t} ${s_(s+4.5)} ${s_(t+6)} ${s_(s+1)}M${t} ${s_(s+2)}q1 -7 5 -11`,w:a?1.8:1.3});let c=Vu(i),l=``,u=a?64:40;for(let e=0;e<u;e++){let r=e/u*Math.PI*2+c()*.05,i=o(r),a=(c()-.5)*.25,s=t+Math.cos(r)*i*1.04,d=n-Math.sin(r)*i*.95,f=2.4+c()*2.6;l+=`M${s_(s)} ${s_(d)}l${s_(Math.cos(r+a)*f)} ${s_(-Math.sin(r+a)*f)}`}e.push({d:l,w:.8,soft:!0}),a&&e.push({d:`M${c_(t,n,r*.72,u_(160))}A${r*.72} ${r*.68} 0 0 1 ${c_(t,n,r*.72,u_(112))}`,w:1,soft:!0})};return t(66,116,30,5,!1),t(114,98,48,9,!0),e.push({d:`M20 152Q100 147 182 151`,w:1.2,soft:!0}),e}var h_={qizhua:()=>f_(7,!1),wuzhua:()=>f_(5,!0),yaguo:p_,tai:m_};function g_(e){let t=h_[e](),n=1.5/Math.max(1,t.length);return`<svg class="art" viewBox="0 0 200 170" aria-hidden="true">${t.map((e,t)=>{let r=[e.fill?`f-`+e.fill:``,e.soft?`soft`:``,e.red?`red`:``].filter(Boolean).join(` `);return`<path d="${e.d}" pathLength="1" class="${r}" style="--d:${(.15+t*n).toFixed(2)}s;stroke-width:${e.w}"/>`}).join(``)}</svg>`}var $=(e,t=``,n=``)=>{let r=document.createElement(e);return t&&(r.className=t),n&&(r.innerHTML=n),r};function __(e){let t=$(`div`,`seal`+([...e].length>1?` two`:``));return t.append($(`span`,``,e)),t}var v_={play:`<svg viewBox="0 0 24 24"><path d="M7 4.5v15l12.5-7.5z"/></svg>`,pause:`<svg viewBox="0 0 24 24"><path d="M6 4.5h4.2v15H6zM13.8 4.5H18v15h-4.2z"/></svg>`,prev:`<svg viewBox="0 0 24 24"><path d="M6 5h2.4v14H6zM20 5v14L9.5 12z"/></svg>`,next:`<svg viewBox="0 0 24 24"><path d="M15.6 5H18v14h-2.4zM4 5l10.5 7L4 19z"/></svg>`,full:`<svg viewBox="0 0 24 24"><path d="M4 9V4h5v2.2H6.2V9zM15 4h5v5h-2.2V6.2H15zM20 15v5h-5v-2.2h2.8V15zM9 20H4v-5h2.2v2.8H9z"/></svg>`,sound:`<svg viewBox="0 0 24 24"><path d="M4 9.2h3.6L12.5 5v14l-4.9-4.2H4z"/><path d="M15.2 8.6a4.6 4.6 0 0 1 0 6.8M17.6 6.2a8 8 0 0 1 0 11.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,mute:`<svg viewBox="0 0 24 24"><path d="M4 9.2h3.6L12.5 5v14l-4.9-4.2H4z"/><path d="M15.5 9.5l5 5M20.5 9.5l-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`},y_=e=>(e=Math.max(0,Math.floor(e)),`${String(Math.floor(e/60)).padStart(2,`0`)}:${String(e%60).padStart(2,`0`)}`),b_={qizhua:`七`,wuzhua:`五`,yaguo:`片`,tai:`胎`},x_=[`零`,`一`,`两`,`三`,`四`,`五`,`六`,`七`,`八`,`九`],S_=`，。、；：？！…—～·（）《》「」『』“”‘’`,C_=e=>e.replace(/"([^"]*)"/g,`「$1」`).replace(/\s+/g,``);function w_(e){return C_(e).replace(/[0-9A-Za-z]+/g,e=>e.length<=2?`<span class="tcy">${e}</span>`:[...e].map(e=>`<span class="up">${e}</span>`).join(``))}function T_(e){let t=[];for(let n of C_(e).matchAll(/[0-9]{1,2}|[\s\S]/gu)){let e=n[0];t.push({s:e,cls:/[0-9]/.test(e)?`tcy`:S_.includes(e)?`pu`:``})}return t}function E_(e,t){if(t<=0)e.style.cssText=``;else if(t>=1)e.style.cssText=`color: var(--ink); -webkit-text-stroke-color: transparent`;else{let n=1-t;e.style.cssText=`color: rgba(47, 36, 32, ${(t**.6).toFixed(3)}); -webkit-text-stroke-color: rgba(190, 70, 50, ${(.4*n).toFixed(3)});
      filter: blur(${(n*n*2.6).toFixed(2)}px); text-shadow: 0 0 ${(4+n*9).toFixed(1)}px rgba(52, 36, 30, ${(.5*n*Math.min(1,t*4)).toFixed(3)})`}}var D_=class{host;root;chooseEl;scrolls=new Map;cover;card;slip;cardNum;cardTitle;cardSeal;cardBrush;cardPhrase;tag;caption;book;bookLeaf;bookShade;bookCells=[];phraseChapter=[];end;endWrap;endLeaf;endShade;endSeal;endSide;curtain;ctrl;bar;fill;knob;time;playBtn;speedBtn;soundBtn;fps=null;last={};idleT=0;pinBook=!1;pinA=0;cardChapter=-1;story;T=0;constructor(e,t,n,r){this.host=t,this.root=e;let i=document.createElementNS(`http://www.w3.org/2000/svg`,`svg`);i.setAttribute(`width`,`0`),i.setAttribute(`height`,`0`),i.style.position=`absolute`,i.innerHTML=`<filter id="seal-rough" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" result="d"/>
      <feTurbulence type="fractalNoise" baseFrequency="0.18" numOctaves="3" seed="9" result="m"/>
      <feColorMatrix in="m" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.6 2.15" result="mask"/>
      <feComposite in="d" in2="mask" operator="in"/>
    </filter>
    <filter id="brush" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="2" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="dry-brush" x="-30%" y="-2%" width="160%" height="104%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85 0.025" numOctaves="2" seed="7" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.6 2.15" result="m"/>
      <feComposite in="SourceGraphic" in2="m" operator="in" result="c"/>
      <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="1" seed="3" result="w"/>
      <feDisplacementMap in="c" in2="w" scale="3" xChannelSelector="R" yChannelSelector="G"/>
    </filter>`,e.append(i),this.chooseEl=this.buildChooser(r),e.append(this.chooseEl),this.cover=$(`div`,`cover hide`),e.append(this.cover),this.card=$(`div`,`card`),this.slip=$(`div`,`slip paper-tex`);let a=$(`div`,`head`);this.cardNum=$(`div`,`num`),this.cardTitle=$(`div`,`title`),this.cardSeal=__(``),a.append(this.cardNum,this.cardTitle,this.cardSeal),this.cardBrush=$(`div`,`brush`),this.cardPhrase=$(`div`,`phrase`),this.slip.append(a,this.cardBrush,this.cardPhrase),this.card.append(this.slip),e.append(this.card),this.tag=$(`div`,`tag paper-tex`),e.append(this.tag),this.caption=$(`div`,`caption`),e.append(this.caption),this.book=this.bookHolder(),e.append(this.book),this.end=$(`div`,`end`),e.append(this.end),this.ctrl=$(`div`,`ctrl hit idle`);let o=$(`div`,`home`,`四种做法`);o.addEventListener(`click`,()=>t.home());let s=$(`div`,`b`,v_.prev);s.addEventListener(`click`,()=>this.jump(-1)),this.playBtn=$(`div`,`b`,v_.play),this.playBtn.addEventListener(`click`,()=>t.toggle());let c=$(`div`,`b`,v_.next);c.addEventListener(`click`,()=>this.jump(1)),this.bar=$(`div`,`bar`);let l=e=>{let n=this.bar.getBoundingClientRect();t.seek(Iu((e.clientX-n.left)/n.width)*this.story.duration)};this.bar.addEventListener(`pointerdown`,e=>{this.bar.setPointerCapture(e.pointerId),l(e);let t=e=>l(e),n=()=>{this.bar.removeEventListener(`pointermove`,t),this.bar.removeEventListener(`pointerup`,n)};this.bar.addEventListener(`pointermove`,t),this.bar.addEventListener(`pointerup`,n)}),this.time=$(`div`,`time`),this.speedBtn=$(`div`,`speed`,`1×`),this.speedBtn.addEventListener(`click`,()=>t.setSpeed(t.speed===1?2:t.speed===2?.5:1)),this.soundBtn=$(`div`,`b`,v_.sound),this.soundBtn.title=`声音（M）`,this.soundBtn.addEventListener(`click`,()=>t.setMuted(!t.muted));let u=$(`div`,`b`,v_.full);u.addEventListener(`click`,()=>O_()),this.ctrl.append(o,s,this.playBtn,c,this.bar,this.time,this.speedBtn,this.soundBtn,u),e.append(this.ctrl),this.curtain=$(`div`,`curtain`),this.curtain.append($(`div`,`tex`)),e.append(this.curtain),n&&(this.fps=$(`div`,`fps`),e.append(this.fps)),addEventListener(`pointermove`,()=>this.idleT=0),addEventListener(`keydown`,e=>{let n=t.mode;if(e.code===`KeyM`)t.setMuted(!t.muted);else if(e.code===`KeyF`)O_();else if(n===`choose`)return;else e.code===`Space`?(e.preventDefault(),t.started?t.toggle():t.play()):e.code===`ArrowRight`&&t.started?this.jump(1):e.code===`ArrowLeft`&&t.started&&this.jump(-1);this.idleT=0})}buildChooser(e){let t=$(`div`,`choose`);t.append($(`div`,`wash`));let n=$(`div`,`head`),r=$(`div`,`kuan`);r.append($(`div`,`s`,`同一个院子，四种古法做法`),__(`古法`)),n.append($(`div`,`t`,`化州橘红`),r),t.append(n);let i=$(`div`,`scrolls`);return e.forEach(({line:e,dur:n},r)=>{let a=$(`div`,`scroll hit`+(e.ready?``:` soon`));a.style.setProperty(`--i`,String(r)),a.dataset.line=e.id,a.append($(`div`,`cord`,`<svg viewBox="0 0 300 46"><path d="M28 44L150 6L272 44"/><circle cx="150" cy="6" r="3.2"/></svg>`)),a.append($(`div`,`rod top`));let o=$(`div`,`mount`),s=$(`div`,`paper paper-tex`),c=$(`div`,`upper`),l=$(`div`,`title`);l.append($(`div`,`name`,e.name),__(b_[e.id])),c.append(l,$(`div`,`blurb`,w_(e.blurb)),$(`div`,`dur`,e.ready?`约${x_[Math.max(1,Math.round(n/60))]??``}分钟`:`制作中`));let u=$(`div`,`lower`);u.append($(`div`,`rule`)),u.append($(`div`,`pic`,g_(e.id)));let d=e.script.sentence[0].text;[...d].length>14&&d.indexOf(`，`)>0&&d.indexOf(`，`)<d.length-1&&(d=d.slice(0,d.indexOf(`，`)+1)),u.append($(`div`,`quote`,w_(d.replace(/[，。]$/,``)+`……`)));let f=$(`div`,`steps`);e.script.chapters.forEach((e,t)=>{let n=__(e.seal);n.style.setProperty(`--k`,String(t)),f.append(n)}),u.append(f),s.append(c,u),o.append(s),a.append(o),a.append($(`div`,`rod bottom`,`<i></i><i></i>`)),e.ready&&(a.addEventListener(`pointerenter`,()=>this.host.mode===`choose`&&this.host.hover(e.id)),a.addEventListener(`pointerleave`,()=>this.host.mode===`choose`&&this.host.hover(null)),a.addEventListener(`click`,()=>{this.host.mode!==`choose`||t.classList.contains(`leaving`)||this.host.choose(e.id)})),this.scrolls.set(e.id,a),i.append(a)}),t.append(i),t}setStory(e){this.story=e,this.last={},this.cardChapter=-1,this.pinBook=!1,this.pinA=0;let{cover:t,chapters:n,duration:r,ending:i}=e,a=this.cover;a.innerHTML=``,a.classList.add(`hide`),a.append($(`div`,`wash`));let o=$(`div`,`head`),s=$(`div`,`tcol`);s.append($(`div`,`t`,t.title),__(b_[e.line])),o.append(s,$(`div`,`s`,t.sub)),a.append(o);let c=$(`div`,`go hit`,`<i></i>${t.play}`);c.addEventListener(`click`,()=>this.host.play()),a.append(c),a.append($(`div`,`tip`,`挪一挪鼠标，画面会跟着偏一点；空格暂停，左右键换章，M 键开关声音`));let l=$(`div`,`others hit`,`← 四种做法`);l.addEventListener(`click`,()=>this.host.home()),a.append(l);let[u,d,f,p]=this.page(e,`pg`,!1),m=this.bookHolder();m.append(u),this.book.replaceWith(m),this.book=m,this.bookLeaf=d,this.bookShade=f,this.bookCells=p,this.phraseChapter=e.sentence.map(t=>e.chapters.findIndex(e=>e.phrases.includes(t.key))),this.end.innerHTML=``;let[h,g,_]=this.page(e,`endbook`,!0);this.endWrap=h,this.endLeaf=g,this.endShade=_,this.endSeal=__(i.seal),g.append(this.endSeal),this.endSide=$(`div`,`side`),this.endSide.append($(`div`,`t`,i.title));let v=$(`div`,`btn hit`,i.replay);v.addEventListener(`click`,()=>{this.host.seek(0),this.host.play()});let y=$(`div`,`btn hit`,`看另外几种做法`);y.addEventListener(`click`,()=>this.host.home()),this.endSide.append(v,y),this.end.append(h,this.endSide),this.bar.innerHTML=``,this.bar.append($(`div`,`track`)),this.fill=$(`div`,`fill`),this.bar.append(this.fill);let b=[];for(let e of n){let t=e.start/r*100,n=$(`div`,`tick`);n.style.left=t+`%`;let i=$(`div`,`lab`,(e.num?e.num+` `:``)+e.title);i.style.left=t+`%`,this.bar.append(n,i),b.push(i)}this.spreadLabels(b),this.knob=$(`div`,`knob`),this.bar.append(this.knob)}spreadLabels(e){let t=e.map(e=>e.offsetLeft),n=[...t];for(let t=0;t<100;t++)for(let t=1;t<n.length;t++){let r=n[t-1]+e[t-1].offsetWidth+14-n[t];r<=0||(n[t-1]-=r/2,n[t]+=r/2)}e.forEach((e,r)=>{n[r]!==t[r]&&(e.style.left=n[r]/this.bar.offsetWidth*100+`%`)})}bookHolder(){let e=$(`div`,`book hit`);return e.addEventListener(`click`,()=>this.pinBook=!this.pinBook),e}page(e,t,n){let r=$(`div`,t),i=$(`div`,`leaf paper-tex`),a=$(`div`,`frame`),o=$(`div`,`kou`);o.append($(`div`,`kt`,e.name));let s=$(`div`,`cols`),c=[],l=0;e.sentence.forEach((e,t)=>{T_(e.text).forEach((e,r)=>{let i=$(`span`,`ch`+(e.cls?` `+e.cls:``)+(n?` inked`:``),e.s);l===18&&(e.cls===`pu`&&s.insertBefore(document.createElement(`br`),s.lastElementChild),l=+(e.cls===`pu`)),s.append(i),l+=1,c.push({e:i,p:t,k:r,pu:e.cls===`pu`})})}),s.append($(`div`,`src`,w_(e.source))),a.append(s,o);let u=$(`div`,`shade`);return i.append(a,u),r.append(i),[r,i,u,c]}setMode(e){if(this.root.dataset.mode=e,this.last={},e===`choose`){this.chooseEl.classList.remove(`leaving`);for(let e of this.scrolls.values())e.classList.remove(`picked`)}}async curtainIn(e){let t=this.curtain;for(let e of t.getAnimations({subtree:!0}))e.cancel();t.style.display=`block`;let n=t.firstElementChild,r;if(e){let i=this.scrolls.get(e);this.chooseEl.classList.add(`leaving`),i.classList.add(`picked`);let a=i.querySelector(`.paper`).getBoundingClientRect(),o=this.root.getBoundingClientRect(),s=this.root.offsetWidth/o.width,c=(a.top-o.top)*s,l=(a.left-o.left)*s,u=this.root.offsetHeight-(a.bottom-o.top)*s,d=this.root.offsetWidth-(a.right-o.left)*s,f=`inset(${c.toFixed(1)}px ${d.toFixed(1)}px ${u.toFixed(1)}px ${l.toFixed(1)}px)`,p={duration:950,delay:420,easing:`cubic-bezier(0.7, 0, 0.3, 1)`,fill:`both`};r=t.animate([{clipPath:f,backgroundColor:`#f4ecdc`,opacity:1},{clipPath:`inset(0px 0px 0px 0px)`,backgroundColor:`#e2d0af`,opacity:1}],p),n.animate([{opacity:1},{opacity:1,offset:.55},{opacity:0}],p)}else r=t.animate([{clipPath:`inset(0px 0px 0px 0px)`,backgroundColor:`#e2d0af`,opacity:0},{clipPath:`inset(0px 0px 0px 0px)`,backgroundColor:`#e2d0af`,opacity:1}],{duration:650,easing:`ease-in-out`,fill:`both`}),n.animate([{opacity:.6},{opacity:0}],{duration:650,fill:`both`});await r.finished,await new Promise(e=>setTimeout(e,60))}async curtainOut(e=650){let t=this.curtain;await t.animate([{clipPath:`inset(0px 0px 0px 0px)`,backgroundColor:`#e2d0af`,opacity:1},{clipPath:`inset(0px 0px 0px 0px)`,backgroundColor:`#e2d0af`,opacity:0}],{duration:e,easing:`ease-in-out`,fill:`both`}).finished;for(let e of t.getAnimations({subtree:!0}))e.cancel();t.style.display=`none`}quiet(){this.idleT=99}jump(e){let t=this.story.chapters,n=t.findIndex(e=>this.T>=e.start&&this.T<e.end),r=n+e;e<0&&this.T-t[Math.max(0,n)].start>3&&(r=n),r=Iu(r,0,t.length-1),this.host.seek(t[r].start+(r===0?0:.2)),this.host.started||this.host.play()}set(e,t,n){this.last[e]!==t&&(this.last[e]=t,n())}update(e,t,n){this.T=e;let{chapters:r,duration:i,captions:a,sentence:o}=this.story,s=this.host,c=s.mode!==`choose`&&s.started;this.idleT+=t,this.set(`cover`,s.mode===`cover`&&!s.started?`1`:`0`,()=>{let e=s.mode===`cover`&&!s.started;this.cover.classList.toggle(`hide`,!e),this.cover.style.pointerEvents=e?``:`none`});let l=Math.max(0,r.findIndex(t=>e>=t.start&&e<t.end)),u=e>=i?r.length-1:l,d=-1;for(let t=0;t<r.length;t++){let n=r[t].start;e>=(t===0?.25:n-.4)&&e<n+3.2&&(d=t)}if(c||(d=-1),d!==this.cardChapter&&(this.cardChapter=d,d>=0)){let e=r[d];this.cardNum.textContent=e.num?`其`+e.num:`终`,this.cardTitle.innerHTML=T_(e.title).map(e=>`<b class="${e.cls}">${e.s}</b>`).join(``),this.cardSeal.firstElementChild.textContent=e.seal,this.cardPhrase.innerHTML=T_(e.card).map(e=>`<b class="${e.cls}">${e.s}</b>`).join(``),this.slip.style.display=`none`,this.slip.offsetWidth,this.slip.style.display=``}if(d>=0){let t=d===0?.6:r[d].start,n=J(t-.35,t+.3,e),i=1-J(t+2.45,t+3.1,e),a=zu(Iu((e-(t-.35))/.75));this.card.style.opacity=String(Math.min(n,i)),this.slip.style.clipPath=`inset(0 0 ${((1-a)*100).toFixed(2)}% 0)`,this.slip.style.transform=`translateY(${(-(1-i)*16).toFixed(2)}px)`,this.cardNum.style.opacity=String(J(t-.1,t+.3,e));let o=this.cardTitle.children;for(let n=0;n<o.length;n++)E_(o[n],J(t+n*.12,t+.4+n*.12,e));this.cardBrush.style.transform=`scaleY(${zu(Iu((e-(t+.3))/.55)).toFixed(3)})`;let s=this.cardPhrase.children,c=Math.min(.05,1.25/Math.max(1,s.length));for(let n=0;n<s.length;n++)E_(s[n],J(t+.55+n*c,t+.95+n*c,e));let l=J(t+1.05,t+1.28,e);this.cardSeal.style.opacity=String(l),this.cardSeal.style.transform=`scale(${(1.7-.7*l).toFixed(3)}) rotate(${(-7+3*l).toFixed(2)}deg)`}else this.card.style.opacity=`0`;let f=c&&e>r[u].start+3&&e<i-15;this.set(`tag`,f?`c`+u:``,()=>{if(this.tag.innerHTML=``,!f)return;let e=r[u];this.tag.append(__(e.seal),$(`span`,``,(e.num?`其`+e.num+` · `:``)+e.title))}),this.tag.style.opacity=f?`1`:`0`;let p=c?a.find(([t,n])=>e>=t&&e<n):void 0;if(this.set(`cap`,p?p[2]:``,()=>this.caption.textContent=p?p[2]:``),p){let t=J(p[0],p[0]+.45,e)*(1-J(p[1]-.45,p[1],e));this.caption.style.opacity=String(t),this.caption.style.transform=`translateY(${(1-t)*8}px)`}else this.caption.style.opacity=`0`;let m=0;for(let t of this.story.moments)m=Math.max(m,J(t.open,t.open+Ef.open,e)*(1-J(t.close-Ef.close,t.close,e)));if(this.pinA+=(+!!this.pinBook-this.pinA)*(1-Math.exp(-t*6)),m=Math.max(m,this.pinA),(!c||e>=i-15)&&(m=0),this.leafPose(this.book,this.bookLeaf,this.bookShade,m),m>0){let t=r[u].end;for(let n of this.bookCells){let r=o[n.p],i=J(r.ink+n.k*Ef.per,r.ink+n.k*Ef.per+Ef.wet,e),a=i<=0?`0`:i>=1?`1`:i.toFixed(2),s=!n.pu&&this.phraseChapter[n.p]===u&&e<t&&e>=r.ring?J(r.ring+n.k*Ef.ring,r.ring+n.k*Ef.ring+.22,e):0,c=a+`|`+s.toFixed(2);n.e.dataset.s!==c&&(n.e.dataset.s=c,E_(n.e,i),s>0&&n.e.style.setProperty(`--c`,s.toFixed(3)),n.e.classList.toggle(`ring`,s>0))}}let h=c?J(i-14,i-12.6,e):0;this.leafPose(this.endWrap,this.endLeaf,this.endShade,h);let g=c?J(i-13,i-12,e):0;this.endSide.style.opacity=String(g),this.endSide.style.transform=`translateX(${((1-g)*-14).toFixed(2)}px)`;let _=c?J(i-12.1,i-11.85,e):0;this.endSeal.style.opacity=String(_),this.endSeal.style.transform=`scale(${(1.7-.7*_).toFixed(3)}) rotate(${(-8+3*_).toFixed(2)}deg)`,this.set(`endp`,g>.5?`1`:`0`,()=>this.endSide.querySelectorAll(`.hit`).forEach(e=>e.style.pointerEvents=g>.5?`auto`:`none`));let v=e/i*100;this.fill.style.width=v+`%`,this.knob.style.left=v+`%`,this.set(`time`,y_(e)+y_(i),()=>this.time.textContent=`${y_(e)} / ${y_(i)}`),this.set(`play`,s.playing?`1`:`0`,()=>this.playBtn.innerHTML=s.playing?v_.pause:v_.play),this.set(`speed`,String(s.speed),()=>this.speedBtn.textContent=(s.speed===.5?`½`:s.speed)+`×`),this.set(`mute`,s.muted?`1`:`0`,()=>this.soundBtn.innerHTML=s.muted?v_.mute:v_.sound);let y=!c||s.playing&&this.idleT>2.6;this.set(`idle`,y?`1`:`0`,()=>this.ctrl.classList.toggle(`idle`,y)),this.fps&&n.fps&&(this.fps.textContent=n.fps)}leafPose(e,t,n,r){let i=r<=0?`0`:r>=1?`1`:r.toFixed(3);if(e.dataset.v===i)return;e.dataset.v=i,e.style.visibility=r<=0?`hidden`:`visible`;let a=zu(r);t.style.transform=`rotateY(${(-(1-a)*92).toFixed(2)}deg)`,t.style.opacity=String(Iu(r*3)),n.style.opacity=String(((1-a)*.75).toFixed(3))}};function O_(){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen?.()}var k_=.1,A_=.15;function j_(){return Od({roughness:.75,metalness:0},{uniforms:{uRed:{value:new U(jd.red)}},varyings:`varying vec2 vTubeUv;`,vertex:`vTubeUv = uv;`,color:`
        float tw = mix(0.5, sin(vTubeUv.x * 900.0 + vTubeUv.y * 6.2832 * 2.0) * 0.5 + 0.5, aaFade(vec2(vTubeUv.x * 900.0 / 6.2832, vTubeUv.y * 2.0)));
        diffuseColor.rgb = uRed * (0.72 + 0.36 * tw);
        procBump = tw * 0.015;
      `,bump:!0})}var M_=class{half;cell;h;n;constructor(e,t=14,n=.08){this.half=t,this.cell=n;let r=this.n=Math.ceil(2*t/n),i=this.h=new Float32Array(r*r).fill(-1/0),a=e.attributes.position,o=e.index,s=new V,c=new V,l=new V,u=e=>Math.floor((e+t)/n);for(let e=0;e<o.count;e+=3){s.fromBufferAttribute(a,o.getX(e)),c.fromBufferAttribute(a,o.getX(e+1)),l.fromBufferAttribute(a,o.getX(e+2));let d=(c.z-l.z)*(s.x-l.x)+(l.x-c.x)*(s.z-l.z);if(Math.abs(d)<1e-9)continue;let f=Math.max(0,u(Math.min(s.x,c.x,l.x))),p=Math.min(r-1,u(Math.max(s.x,c.x,l.x))),m=Math.max(0,u(Math.min(s.z,c.z,l.z))),h=Math.min(r-1,u(Math.max(s.z,c.z,l.z)));for(let e=f;e<=p;e++){let a=-t+(e+.5)*n;for(let o=m;o<=h;o++){let u=-t+(o+.5)*n,f=((c.z-l.z)*(a-l.x)+(l.x-c.x)*(u-l.z))/d,p=((l.z-s.z)*(a-l.x)+(s.x-l.x)*(u-l.z))/d,m=1-f-p;if(f<-1e-6||p<-1e-6||m<-1e-6)continue;let h=f*s.y+p*c.y+m*l.y,g=e*r+o;h>i[g]&&(i[g]=h)}}}}at(e,t){let n=Math.floor((e+this.half)/this.cell),r=Math.floor((t+this.half)/this.cell);return n<0||r<0||n>=this.n||r>=this.n?-1/0:this.h[n*this.n+r]}};function N_(e,t){let n=[];for(let r=0;r<e.length;r++){for(;n.length>=2;){let i=n[n.length-2],a=n[n.length-1];if((e[a]-e[i])*(t[r]-t[i])-(t[a]-t[i])*(e[r]-e[i])>=0)n.pop();else break}n.push(r)}let r=t.slice(),i=0;for(let a=0;a<e.length;a++){for(;i<n.length-2&&e[n[i+1]]<e[a];)i++;let o=n[i],s=n[Math.min(i+1,n.length-1)];r[a]=o===s?t[o]:t[o]+(t[s]-t[o])*(e[a]-e[o])/(e[s]-e[o])}return r}var P_=class{group=new H;pieces=[];loops=[];knot=new H;stackH;spacing;lift=.3;rots=[];y0;constructor(e,t=np,n=7){e.computeBoundingBox();let r=e.boundingBox;this.y0=-r.min.y,this.spacing=rp+(n===7?.03:.12);let i=Vu(77);for(let t=0;t<9;t++){let n=Yf(10+t*7);Xf(n,{blanch:1,dry:1,product:1,fuzz:.85,press:1});let r=new W(e,n);r.castShadow=!0,r.receiveShadow=!0;let a=(i()-.5)*.05;this.rots.push(a),r.rotation.y=a,r.position.y=this.y0+this.pieceY(t),this.pieces.push(r),this.group.add(r)}this.rots.push(0),this.stackH=this.lift+10*this.spacing;let a=j_(),{curves:o,knot:s}=this.tie(e,t,n);for(let e of o){let t=new W(new Xa(e,420,k_,6,!1),a);t.castShadow=!0,this.loops.push(t),this.group.add(t)}let c=new W(new Ja(.4,12,8),a);c.scale.set(1.25,.75,1.05),this.knot.add(c);for(let e of[-1,1]){let t=new W(new Xa(new Li([new V(0,0,0),new V(.35*e,.02,.45),new V(.62*e,-.3,1.1),new V(.72*e,-1.2,1.25),new V(.78*e,-1.9,1.27)]),30,.1,6,!1),a);t.castShadow=!0,this.knot.add(t)}this.knot.position.copy(s).add(new V(0,.12,0)),this.knot.rotation.y=Math.atan2(-t.z,t.x),this.group.add(this.knot)}tie(e,t,n){let r=t.clone().setY(0).normalize(),i=new V(-r.z,0,r.x),a=new M_(e),o=this.heroY,s=this.rots,c=new V,l=(e,t)=>{let n=a.at(e,t);return n===-1/0?null:n+o},u=(e,t)=>{for(let n of s){let r=Math.cos(n),i=Math.sin(n);if(a.at(r*e-i*t,i*e+r*t)>-1/0)return!0}return!1},d=Math.PI*2/n,f=[];for(let e=0;e<n;e++){let t=new V(Math.cos(e*d),0,Math.sin(e*d)),n=t.dot(i);n>0&&t.addScaledVector(i,-2*n),f.push(Math.atan2(-t.dot(i),t.dot(r)))}f.sort((e,t)=>e-t);let p=[];for(let e=0;e+1<f.length;e++)p.push((f[e]+f[e+1])/2);let m=n===7?p.slice(1,5):p.slice(0,4),h=e=>r.clone().multiplyScalar(Math.cos(e)).addScaledVector(i,-Math.sin(e)),g=i.clone().multiplyScalar(-.55);g.y=(l(g.x,g.z)??this.stackH)+k_;let _=-1/0;for(let e=-.7;e<=.35;e+=.05)for(let t of[-.4,0,.4])c.copy(i).multiplyScalar(e).addScaledVector(r,t),_=Math.max(_,l(c.x,c.z)??-1/0);_===-1/0&&(_=this.stackH),_+=k_;let v=[];return m.forEach((e,t)=>{let n=h(e),a=new V(-n.z,0,n.x),o=9;for(let e=1.5;e<12;e+=.04){let t=!0;for(let r of[-.2,0,.2])if(c.copy(n).multiplyScalar(e).addScaledVector(a,r),u(c.x,c.z)){t=!1;break}if(t){o=e+.12;break}}let s=n.clone().multiplyScalar(o),d=Math.hypot(s.x-g.x,s.z-g.z),f=[],p=[],y=g.y;for(let e=0;e<=d;e+=.12){let t=e/d,n=l(g.x+(s.x-g.x)*t,g.z+(s.z-g.z)*t);n!==null&&(y=n+k_),f.push(e),p.push(n===null?-1/0:n+k_)}d-f[f.length-1]>.02?(f.push(d),p.push(y)):p[p.length-1]=y,p[0]=Math.max(p[0],g.y);let b=N_(f,p.map(e=>e===-1/0?0:e)),x=[];for(let e=0;e<f.length;e++){let t=f[e]/d;x.push(new V(g.x+(s.x-g.x)*t,Math.max(b[e],p[e]),g.z+(s.z-g.z)*t))}let S=x[x.length-1].y;for(let e of[.15,.5,.85])x.push(new V(s.x,S+(A_-S)*e,s.z));x.push(s.clone().setY(A_));let C=(t-(m.length-1)/2)*.24,w=i.clone().multiplyScalar(.42).addScaledVector(r,C);for(let e of[.3,.6,.85])x.push(new V(s.x+(w.x-s.x)*e,A_,s.z+(w.z-s.z)*e));x.push(w.clone().setY(A_));for(let e of[.15,.5,.85])x.push(w.clone().setY(A_+(_-.15-A_)*e));let T=(e,t)=>i.clone().multiplyScalar(e).addScaledVector(r,C*(e+.55)/.97).setY(t);x.push(T(.39999999999999997,_-.02)),x.push(T(.2,_+.02)),x.push(T(-.15,Math.max(_,g.y)+.01)),x.push(g.clone()),v.push(new Li(x,!1,`centripetal`))}),{curves:v,knot:g}}pieceY(e){return this.lift+e*this.spacing}get heroY(){return this.y0+this.pieceY(9)}update(e,t,n){this.pieces.forEach((t,n)=>{let r=Iu(e-n);t.visible=r>0;let i=(1-J(0,1,r))*14;t.position.y=this.y0+this.pieceY(n)+i,t.rotation.y=this.rots[n]+(1-r)*.6});let r=this.loops.length;this.loops.forEach((e,n)=>{let i=Iu((t-.84*n/r)/(.84/r)),a=e.geometry.index.count;e.geometry.setDrawRange(0,Math.floor(a/36*i)*36),e.visible=i>0});let i=Iu((t-.84)/.16);this.knot.visible=i>0,this.knot.scale.setScalar(Math.max(.001,J(0,1,i)))}};function F_(e,t,n=!0,r=!0){let i=new W(e,t);return i.castShadow=n,i.receiveShadow=r,i}var I_=(e,t=32)=>new Ka(e.map(([e,t])=>new z(e,t)),t);function L_(e){return Od({roughness:.92,metalness:0,side:2},{uniforms:{uPaper:{value:new U(e.color??`#B4493A`)},uInk:{value:new U(e.ink??`#2A1A16`)},uChars:{value:e.chars??7},uSize:{value:new z(e.w,e.h)},uFade:{value:e.fade??.55}},discard:`
        {
          vec2 e = (vPos.xy / uSize + 0.5);
          float rag = (snoise(vec3(vPos.xy * 0.9, 3.0)) * 0.5 + 0.5) * 0.035;
          if (min(min(e.x, 1.0 - e.x) * uSize.x, min(e.y, 1.0 - e.y) * uSize.y) < rag * 10.0 - 0.15) discard;
        }
      `,color:`
        vec2 e = vPos.xy / uSize + 0.5;
        float n = fbm3(vec3(vPos.xy * 0.35, 1.0)) * 0.5 + 0.5;
        vec3 col = uPaper * (0.78 + 0.3 * n);
        // 日晒雨淋：上半截褪得更厉害，泛白发粉
        float sun = smoothstep(0.2, 1.0, e.y) * 0.35 + (1.0 - n) * 0.25;
        col = mix(col, vec3(0.86, 0.66, 0.6), sun * uFade);
        // 字：每格里几笔，笔画随机，已经洇淡了（看不清写的什么，只看得出是字）
        bool vertical = uSize.y > uSize.x;
        vec2 g = vertical ? vec2(e.x, e.y * uChars) : vec2(e.x * uChars, e.y);
        vec2 cell = floor(g);
        vec2 f = fract(g);
        float ink = 0.0;
        for (int i = 0; i < 5; i++) {
          vec2 h1 = hash22(cell + float(i) * 7.3);
          vec2 h2 = hash22(cell + float(i) * 3.1 + 11.0);
          vec2 a = 0.22 + 0.56 * h1;
          vec2 b = 0.22 + 0.56 * h2;
          vec2 pa = f - a, ba = b - a;
          float t = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
          float d = length(pa - ba * t);
          ink = max(ink, 1.0 - smoothstep(0.035, 0.06, d));
        }
        ink *= step(0.08, f.x) * step(0.08, f.y) * step(f.x, 0.92) * step(f.y, 0.92);
        col = mix(col, uInk, ink * (0.75 - 0.45 * uFade) * (0.7 + 0.3 * n));
        diffuseColor.rgb = col;
        procBump = (n - 0.5) * 0.04;
      `,bump:!0})}function R_(e,t){return kd({roughness:.35,metalness:.15,clearcoat:.5,clearcoatRoughness:.3},{uniforms:{uBase:{value:new U(e)},uFlower:{value:new U(t)}},color:`
        vec3 p = vPos;
        float a = atan(p.z, p.x);
        vec2 q = vec2(a * 6.0, p.y * 0.8);
        vec2 c = fract(q) - 0.5;
        float r = length(c);
        float petal = abs(cos(atan(c.y, c.x) * 2.5));
        float fl = (1.0 - smoothstep(0.18, 0.22, r / (0.6 + 0.4 * petal))) * step(10.0, p.y) * step(p.y, 24.0);
        vec3 col = mix(uBase, uFlower, fl * 0.85);
        float chip = step(0.94, hash13(floor(p * 2.0))) * 0.6;
        col = mix(col, vec3(0.55, 0.55, 0.52), chip);
        col *= 0.9 + 0.1 * (fbm3(p * 0.3) * 0.5 + 0.5);
        diffuseColor.rgb = col;
      `})}function z_(){let e=new H,t=Od({roughness:.75,metalness:0,side:2},{uniforms:{uA:{value:new U(`#CDB27A`)},uB:{value:new U(`#9C7F4E`)}},color:`
        vec2 p = vPos.xz;
        float r = length(p);
        float a = atan(p.y, p.x);
        float rib = smoothstep(0.75, 1.0, abs(sin(a * 22.0)));
        float rim = smoothstep(10.6, 11.2, r);
        vec3 col = mix(uA, uB, rib * 0.45 + rim * 0.8);
        col *= 0.88 + 0.16 * (fbm3(vec3(p * 0.5, 0.0)) * 0.5 + 0.5);
        diffuseColor.rgb = col;
        procBump = rib * 0.03;
      `,bump:!0}),n=new ia;for(let e=0;e<=48;e++){let t=e/48*Math.PI*2,r=11.6*(1-.12*Math.max(0,Math.cos(t))**3),i=Math.cos(t)*r,a=Math.sin(t)*r*.92;e===0?n.moveTo(i,a):n.lineTo(i,a)}let r=new Ha(n,{depth:.12,bevelEnabled:!1});r.rotateX(-Math.PI/2),e.add(F_(r,t));let i=F_(new G(.55,.7,13,8),Ep({axis:`y`,color:`#B08A55`}));return i.rotation.z=Math.PI/2,i.position.set(17,.3,0),e.add(i),e}function B_(e,t=24){let n=new H,r=F_(new wi(26,2.6,20),bp({axis:`x`,seed:e,light:`#94704F`,dark:`#5A3F2D`,plank:10,worn:.5}));r.position.y=t-1.3,n.add(r);let i=bp({axis:`y`,seed:e+1,light:`#8A6447`,dark:`#4E372A`});for(let[e,r]of[[-10,-7],[10,-7],[-10,7],[10,7]]){let a=F_(new G(1.2,1.5,t-2.6,8),i);a.position.set(e*1.05,(t-2.6)/2,r*1.05),a.rotation.set(r>0?.07:-.07,0,e>0?-.07:.07),n.add(a)}return n}function V_(){let e=new H,t=Dp({polish:.2,rust:.5,polishR:6});for(let n of[-1,1]){let r=new Li([new V(n*.8,0,0),new V(n*.5,20,0),new V(n*.2,42,0),new V(n*1.6,46,0),new V(0,48.5,0)]);e.add(F_(new Xa(r,30,.32,6,!1),t))}return e}var H_=class{group=new H;constructor(){this.table(),this.stove(),this.oven(),this.facade(),this.washstand(),this.dryingSide()}add(e,t,n,r,i=0){return e.position.set(t,n,r),e.rotation.y=i,this.group.add(e),e}table(){let e=Z.tableTop,t=new H;t.add(F_(I_([[0,0],[3.9,0],[4.1,.4],[4.1,8.4],[4.35,8.6],[4.2,8.8],[3.85,8.6],[3.85,.6],[0,.6]],36),Ap({rimY:8.9})));let n=F_(new Ya(2.3,.42,8,20,Math.PI*1.2),Ap({rimY:99}));n.rotation.z=-Math.PI*.1-Math.PI/2,n.position.set(4.4,4.6,0),t.add(n);let r=F_(new G(3.82,3.82,.05,30),new co({color:`#6B4A22`,roughness:.05,clearcoat:1}),!1);r.position.y=5.6,t.add(r),this.add(t,Z.mug.x,e+.01,Z.mug.z,2.4);let i=new H;i.add(F_(I_([[0,0],[5.6,0],[6,.6],[6,26],[5.2,28.5],[3,30.5],[2.6,31],[0,31]],36),R_(`#4F7766`,`#E9E0C9`)));let a=F_(I_([[0,31],[2.9,31],[2.9,34.5],[2.6,35],[0,35]],24),new co({color:`#C9C7C1`,metalness:1,roughness:.35}));i.add(a);let o=F_(new Ya(6.05,.25,6,40),new co({color:`#BDBAB2`,metalness:1,roughness:.4}));o.rotation.x=Math.PI/2,o.position.y=1,i.add(o),this.add(i,-92,e+.01,-22);let s=z_();s.rotation.y=.5,this.add(s,100,e+.15,-10,.5);let c=F_(new wi(14,.8,10),Pp({color:`#6F86A0`,scale:1.2}));this.add(c,-40,e+.41,-78,.15)}stove(){let e=Z.stoveTop,t=new H;t.add(F_(I_([[0,0],[3.4,0],[4.2,2],[4.4,6],[3.6,8.4],[2.4,9],[0,9]],28),kp({glaze:`#D9CFB6`,bandY:[6.5,1.5],band:`#6B7E92`})));let n=F_(I_([[0,9.6],[2.6,9.6],[2.8,9],[0,9]],20),kp({glaze:`#CFC4A8`}));t.add(n),this.add(t,-224,e+.01,-287);let r=new co({color:`#C79A4A`,roughness:.08,metalness:0,transparent:!0,opacity:.55,clearcoat:1}),i=F_(I_([[0,0],[3,0],[3.2,.5],[3.2,13],[1.4,16],[1.1,19],[0,19]],28),r);this.add(i,-214,e+.01,-279);let a=F_(new G(2.95,2.95,7,24),new co({color:`#9A6A18`,roughness:.2,transparent:!0,opacity:.8}),!1);this.add(a,-214,e+3.6,-279);let o=F_(new wi(5.2,1.6,3.6),Od({roughness:.8,metalness:0},{uniforms:{uA:{value:new U(`#C9B98F`)},uB:{value:new U(`#3E5F7F`)}},color:`
          float label = step(abs(vPos.x), 1.8) * step(abs(vPos.z), 1.2) * step(0.7, vPos.y);
          float side = 1.0 - step(0.7, abs(vNrm.y));
          vec3 col = mix(uA, uB, label);
          col = mix(col, vec3(0.32, 0.2, 0.16), side * step(1.6, abs(vPos.z)));
          diffuseColor.rgb = col;
        `}));this.add(o,-297,e+.81,-222,.3);let s=Z.stove.z+43,c=V_();c.rotation.set(-.22,.3,0),this.add(c,-228,.2,s+9.5,.3);let l=F_(new G(1.6,1.8,62,10),Ep({axis:`y`,node:18,color:`#A88452`}));l.rotation.set(-.3,0,.08),this.add(l,-300,30,s+9.5);let u=new hi(new G(.9,1.1,40,6),Mp({color:`#6A5442`}),5),d=new jn,f=Vu(31);for(let e=0;e<5;e++)d.position.set(-245+(f()-.5)*30,1+e%2*1.6,s+22+(f()-.5)*10),d.rotation.set(Math.PI/2,0,.6+(f()-.5)*.9),d.updateMatrix(),u.setMatrixAt(e,d.matrix);u.castShadow=!0,u.receiveShadow=!0,this.group.add(u);let p=F_(new qa(16,24,1,1),L_({w:16,h:24,chars:3,color:`#A9473A`,fade:.6}),!1);this.add(p,-288,104,Z.wallZ+.4);let m=new H;m.add(F_(I_([[0,0],[2.4,0],[3.2,1.6],[3.4,3.4],[3,3.8],[0,3.6]],20),Op({color:`#6E4A36`})));let h=new co({color:`#7A2E22`,roughness:.8});for(let e=0;e<3;e++){let t=F_(new G(.12,.12,9,5),h,!1);t.position.set((e-1)*.8,7.5,0),t.rotation.z=(e-1)*.08,m.add(t)}this.add(m,-288,Z.stoveTop+.01,Z.wallZ+6)}oven(){let e=Z.oven,t=e.z+29,n=new H;n.add(F_(I_([[0,0],[9,0],[10.5,2],[12.5,14],[13,16]],32),Tp({w:1,radius:11,mode:`cyl`,color:`#9C7A48`,dark:`#5E4528`})));let r=new hi(new Ga(2.2,0),Od({roughness:.95,metalness:0},{color:`diffuseColor.rgb = vec3(0.09, 0.085, 0.085) * (0.8 + 0.5 * (fbm3(vPos * 0.6) * 0.5 + 0.5));`}),16),i=new jn,a=Vu(12);for(let e=0;e<16;e++){let t=a()*Math.PI*2,n=Math.sqrt(a())*8.5;i.position.set(Math.cos(t)*n,12+a()*3,Math.sin(t)*n),i.rotation.set(a()*6,a()*6,a()*6),i.scale.set(.8+a()*.6,.6+a()*.5,.8+a()*.5),i.updateMatrix(),r.setMatrixAt(e,i.matrix)}r.castShadow=!0,n.add(r),this.add(n,e.x-52,.01,t+14);let o=B_(61);this.add(o,e.x+6,0,t+34,-.25);let s=z_();s.rotation.set(0,2.2,0),this.add(s,e.x+4,24.2,t+33,2.2)}facade(){let e=Z.wallZ,t=Z.door;for(let n of[-1,1]){let r=F_(new qa(13,150),L_({w:13,h:150,chars:7,fade:.6}),!1);this.add(r,t.x+n*64,128,e+10.2)}let n=F_(new qa(84,15),L_({w:84,h:15,chars:4,fade:.65}),!1);this.add(n,t.x,253,e+12.2);let r=F_(I_([[0,6.2],[4.5,6],[7,4.2],[7.6,1.6],[8.4,.6],[15.5,0],[16,-.4],[15.4,-.2],[8.2,.2],[7.2,1.4],[6.6,3.8],[4.3,5.6],[0,5.8]],48),Tp({w:.55,mode:`polar`,color:`#D7BE86`,dark:`#9C8050`}));r.rotation.x=Math.PI/2-.12,this.add(r,t.x+112,196,e+2.2);let i=new H;i.add(F_(new wi(15,22,.8),bp({axis:`y`,seed:71,light:`#8A6A4C`,dark:`#5A4030`})));let a=F_(new wi(12,14,1.2),Od({roughness:.9,metalness:0},{color:`
          vec2 p = vPos.xy;
          vec3 col = vec3(0.93, 0.9, 0.84);
          col = mix(col, vec3(0.62, 0.22, 0.18), step(4.6, p.y));
          float dig = (1.0 - smoothstep(0.35, 0.6, abs(length(vec2(p.x * 1.2 + 1.6, p.y + 0.6)) - 2.0))) + (1.0 - smoothstep(0.35, 0.6, abs(p.x - 2.6))) * step(abs(p.y + 0.6), 2.6);
          col = mix(col, vec3(0.16, 0.14, 0.13), clamp(dig, 0.0, 1.0) * step(p.y, 4.0));
          diffuseColor.rgb = col;
        `}),!1);a.position.set(0,-2.5,.9),i.add(a),this.add(i,t.x+112,150,e+.5);let o=new H,s=F_(new G(1.1,1.3,110,10),Ep({axis:`y`,node:26,color:`#B89660`}));s.position.y=81,o.add(s);let c=new hi(new G(.15,.3,34,4),Mp({color:`#7B6448`}),40),l=new jn,u=Vu(19);for(let e=0;e<40;e++){let t=u()*Math.PI*2,n=.12+u()*.3;l.position.set(Math.cos(t)*n*17,14+u()*4,Math.sin(t)*n*8),l.rotation.set(Math.sin(t)*n*.9,0,-Math.cos(t)*n*.9),l.updateMatrix(),c.setMatrixAt(e,l.matrix)}c.castShadow=!0,o.add(c);let d=F_(new G(2.4,2.6,4,12),Ep({axis:`y`,color:`#8E6E42`}));d.position.y=30,o.add(d),o.rotation.set(-.16,0,.06),this.add(o,t.x+84,0,e+22);let f=new H;f.add(F_(I_([[0,0],[7,0],[9.6,4],[10.4,12],[9,20],[6,23.5],[6.4,25],[5.6,25.5],[5.2,24]],36),kd({roughness:.3,metalness:0,clearcoat:.6,clearcoatRoughness:.25},{uniforms:{uGlaze:{value:new U(`#5E3A26`)}},color:`
          float n = fbm3(vPos * 0.15) * 0.5 + 0.5;
          vec3 col = uGlaze * (0.75 + 0.45 * n);
          col = mix(col, vec3(0.62, 0.5, 0.38), 1.0 - smoothstep(3.0, 4.0, vPos.y));
          diffuseColor.rgb = col;
        `})));let p=F_(I_([[0,25.8],[6.6,25.4],[7.4,27.4],[0,26.6]],28),kp({glaze:`#D7CDB4`,footY:25.9}));f.add(p),this.add(f,66,.01,e+21);let m=new H;m.add(F_(new wi(22,13,8),kd({roughness:.45,metalness:0,clearcoat:.4},{uniforms:{uBody:{value:new U(`#6B4A34`)}},color:`
          vec3 p = vPos;
          vec3 col = uBody * (0.9 + 0.1 * (fbm3(p * 0.5) * 0.5 + 0.5));
          float front = step(3.9, p.z);
          vec2 g = p.xy - vec2(-5.0, 0.0);
          float grille = front * step(length(g), 4.6) * smoothstep(0.3, 0.5, abs(fract(g.x * 1.6) - 0.5));
          col = mix(col, vec3(0.78, 0.7, 0.55), front * step(length(g), 4.8) * 0.7);
          col = mix(col, vec3(0.18, 0.15, 0.13), grille * 0.8);
          float dial = front * step(abs(p.x - 5.5), 4.0) * step(abs(p.y - 2.5), 1.6);
          col = mix(col, vec3(0.86, 0.8, 0.62), dial);
          col = mix(col, vec3(0.6, 0.2, 0.15), dial * step(abs(p.x - 4.2), 0.12));
          diffuseColor.rgb = col;
        `})));for(let e of[3.5,7.5]){let t=F_(new G(1,1,1.2,14),new co({color:`#2C2622`,roughness:.5}));t.rotation.x=Math.PI/2,t.position.set(e,-3,4.4),m.add(t)}let h=F_(new G(.15,.2,26,6),new co({color:`#CFCBC3`,metalness:1,roughness:.3}));h.position.set(8,18.5,-1),h.rotation.z=-.5,m.add(h),this.add(m,10,108.01,e+6,-.08);let g=new co({color:`#E8F0EC`,roughness:.05,metalness:0,transparent:!0,opacity:.32,clearcoat:1}),_=new H;_.add(F_(I_([[0,0],[5.2,0],[5.6,.6],[5.6,14],[4.4,15.4],[4.4,16.6],[0,16.6]],28),g,!1));let v=F_(I_([[0,16.4],[4.7,16.4],[4.7,18.2],[0,18.2]],20),new co({color:`#A23C2E`,roughness:.5}));_.add(v);let y=new hi(new wi(3.2,.25,1.6),new co({color:`#6A6B4E`,roughness:.85}),9);for(let e=0;e<9;e++)l.position.set((u()-.5)*6,.6+e*.9,(u()-.5)*6),l.rotation.set((u()-.5)*1.2,u()*6,(u()-.5)*1.2),l.scale.setScalar(1),l.updateMatrix(),y.setMatrixAt(e,l.matrix);_.add(y),this.add(_,-24,101.51,e+7);let b=new H;b.add(F_(new G(4.2,4.2,8,20,1,!0),new co({color:`#B6B2A8`,metalness:.9,roughness:.45,side:2})));let x=F_(new G(4.1,4.1,.3,16),new co({color:`#4A3A2E`,roughness:1}));x.position.y=3.2,b.add(x);let S=new hi(new G(.12,.25,12,4),new co({color:`#7FA34E`,roughness:.6}),12);for(let e=0;e<12;e++)l.position.set((u()-.5)*5,9,(u()-.5)*5),l.rotation.set((u()-.5)*.5,0,(u()-.5)*.5),l.updateMatrix(),S.setMatrixAt(e,l.matrix);b.add(S),b.children.forEach(e=>{e instanceof W&&(e.castShadow=!0)}),this.add(b,-52,105.51,e+7)}washstand(){let e=Z.washstand,t=new H,n=bp({axis:`y`,seed:81,light:`#7E5A40`,dark:`#4A3426`});for(let e=0;e<3;e++){let r=e/3*Math.PI*2+.4,i=F_(new G(1.1,1.3,78,8),n);i.position.set(Math.cos(r)*15,39,Math.sin(r)*15),i.rotation.set(Math.sin(r)*.08,0,-Math.cos(r)*.08),t.add(i)}let r=F_(new Ya(15.6,1,8,40),n);r.rotation.x=Math.PI/2,r.position.y=70,t.add(r);let i=F_(new Ya(17,.8,6,36),n);i.rotation.x=Math.PI/2,i.position.y=22,t.add(i);let a=F_(new G(1.2,1.3,140,8),n);a.position.set(0,70,-17),t.add(a);let o=F_(new G(.9,.9,34,8),n);o.rotation.z=Math.PI/2,o.position.set(0,130,-17),t.add(o);let s=new qa(24,52,6,20),c=s.attributes.position;for(let e=0;e<c.count;e++){let t=c.getX(e),n=c.getY(e),r=1.4,i=2.2;if(Math.abs(n)<=i){let a=n/i*(Math.PI/2);c.setXYZ(e,t,130+r*Math.cos(a),-17+r*Math.sin(a))}else c.setXYZ(e,t,130-(Math.abs(n)-i),-17+r*Math.sign(n))}s.computeVertexNormals();let l=F_(s,Od({roughness:.95,metalness:0,side:2},{color:`
          vec3 col = vec3(0.92, 0.9, 0.84);
          float stripe = step(0.5, fract((vPos.y - 130.0) * 0.12)) * step(abs(vPos.y - 130.0), 40.0) * step(14.0, abs(vPos.y - 130.0));
          col = mix(col, vec3(0.42, 0.55, 0.68), stripe * 0.6);
          float terry = mix(0.5, hash13(floor(vPos * 4.0)), aaFade3(vPos * 4.0));
          col *= 0.9 + 0.12 * terry;
          diffuseColor.rgb = col;
          procBump = terry * 0.02;
        `,bump:!0}));t.add(l);let u=F_(new Ka([[0,0],[11,0],[12,.6],[16.5,8.4],[18.2,9.4],[18.2,10],[17.4,9.9],[15.8,8.5],[11.2,1],[0,.5]].map(([e,t])=>new z(e,t)),56),Ap({rimY:10}));u.position.y=69.2,t.add(u);let d=F_(new G(15.2,15.2,.1,48),new co({color:`#BFD3D0`,roughness:.03,metalness:0,transparent:!0,opacity:.55,clearcoat:1}),!1);d.position.y=75.8,t.add(d),t.traverse(e=>{e instanceof W&&(e.castShadow=e.receiveShadow=!0)}),this.add(t,e.x,0,e.z,-.3)}dryingSide(){let e=Z.dry,t=B_(91,30);this.add(t,e.x-96,0,e.z-34,.3);let n=Bp(22,3,{w:1.1});this.add(n,e.x-96,30.05,e.z-34);let r=new hi(new Ei(.9,7,8),Od({roughness:.35,metalness:0},{color:`diffuseColor.rgb = mix(vec3(0.55, 0.12, 0.08), vec3(0.72, 0.2, 0.1), smoothstep(-3.5, 3.5, vPos.y)) * (0.85 + 0.25 * (fbm3(vPos * 0.8) * 0.5 + 0.5));`}),60),i=new jn,a=Vu(51);for(let t=0;t<60;t++){let n=a()*Math.PI*2,o=Math.sqrt(a())*18;i.position.set(e.x-96+Math.cos(n)*o,30.95+t%3*.6,e.z-34+Math.sin(n)*o),i.rotation.set(Math.PI/2+(a()-.5)*.3,0,a()*Math.PI*2),i.updateMatrix(),r.setMatrixAt(t,i.matrix)}r.castShadow=!0,r.receiveShadow=!0,this.group.add(r)}};function U_(e){let t=new H,n=bp({axis:`x`,seed:e,light:`#94704F`,dark:`#5A3F2D`,plank:10}),r=bp({axis:`y`,seed:e+1,light:`#8A6447`,dark:`#4E372A`}),i=new W(new wi(34,3.5,22),n);i.position.y=42.25,i.castShadow=i.receiveShadow=!0,t.add(i);for(let[e,n]of[[-13,-7],[13,-7],[-13,7],[13,7]]){let i=new W(new G(1.6,1.9,42.5,8),r);i.position.set(e,42.5/2,n),i.rotation.set(n>0?-.06:.06,0,e>0?.08:-.08),i.castShadow=i.receiveShadow=!0,t.add(i)}let a=new W(new wi(26,2.5,2.5),r);return a.position.y=14,a.castShadow=!0,t.add(a),t}var W_=class{group=new H;sieve;heroSlot={pos:new V,rot:hp[0].rot};constructor(){let e=Z.dry,t=U_(51);t.position.set(e.x-26,-.6,e.z),t.rotation.y=.05;let n=U_(53);n.position.set(e.x+26,-.6,e.z+2),n.rotation.y=-.04,this.group.add(t,n),this.sieve=Bp(50,5,{w:1.5}),this.sieve.position.set(e.x,44,e.z),this.group.add(this.sieve),this.heroSlot.pos.set(e.x+hp[0].x,Z.dryY,e.z+hp[0].z)}},G_=class{group=new H;sieve;glowI={value:1};light;upLight;sparks;coalMat;constructor(){let e=this.group,t=Z.oven,n=Z.ovenTop-6.15,r=t.z+29,i=xp({plasterTop:!0,whitewash:.2,soot:new Qt(t.x,18,r,30)}),a=new ia;a.moveTo(-33,0),a.lineTo(33,0),a.lineTo(33,n),a.lineTo(-33,n),a.closePath();let o=new ra;o.moveTo(-12,6),o.lineTo(12,6),o.lineTo(12,16),o.absarc(0,16,12,0,Math.PI,!1),o.lineTo(-12,6),a.holes.push(o);let s=new W(new Ha(a,{depth:9,bevelEnabled:!1,curveSegments:12}),i);s.position.set(t.x,0,r-9),s.castShadow=s.receiveShadow=!0,e.add(s);let c=(t,r,a,o)=>{let s=new W(new wi(t,n,r),i);s.position.set(a,n/2,o),s.castShadow=s.receiveShadow=!0,e.add(s)};c(9,49,t.x-33+4.5,t.z-4.5),c(9,49,t.x+33-4.5,t.z-4.5),c(48,9,t.x,t.z-29+4.5);let l=n-.8-2*Wp,u=new W(new wi(48-2*Wp,l,40-2*Wp),Gp());u.position.set(t.x,Wp+l/2,t.z),e.add(u);let d=new ia;d.moveTo(-34,-30),d.lineTo(34,-30),d.lineTo(34,30),d.lineTo(-34,30),d.closePath();let f=new ra;f.absarc(0,0,19,0,Math.PI*2,!0),d.holes.push(f);let p=new W(new Ha(d,{depth:5.2,bevelEnabled:!0,bevelSize:.8,bevelThickness:.8,bevelSegments:1,curveSegments:40}),i);p.rotation.x=-Math.PI/2,p.position.set(t.x,n,t.z),p.castShadow=p.receiveShadow=!0,e.add(p),this.coalMat=Od({roughness:.95,metalness:0,color:`#2a2424`},{uniforms:{uGlow:this.glowI},color:`
          vec3 v = voronoi3(vPos * 0.55 + 3.0);
          float crack = 1.0 - smoothstep(0.0, 0.12, v.y);
          float n = fbm3(vPos * 0.3) * 0.5 + 0.5;
          diffuseColor.rgb = mix(vec3(0.09, 0.08, 0.08), vec3(0.32, 0.3, 0.29), smoothstep(0.4, 0.8, n) * 0.6);
          float glow = (crack * 0.9 + smoothstep(0.55, 0.9, n) * 0.5) * uGlow;
        `,emissive:`totalEmissiveRadiance += vec3(1.0, 0.36, 0.08) * glow * 3.2;`});let m=new hi(new Ga(3,0),this.coalMat,26),h=new jn,g=Vu(4);for(let e=0;e<26;e++)h.position.set(t.x+(g()-.5)*34,4+g()*7,t.z+(g()-.5)*30),h.rotation.set(g()*6,g()*6,g()*6),h.scale.set(.8+g()*.8,.6+g()*.6,.8+g()*.7),h.updateMatrix(),m.setMatrixAt(e,h.matrix);m.castShadow=!0,e.add(m),this.light=new Ko(`#FF8A3A`,3e3,0,2),this.light.position.set(t.x,18,r+6),e.add(this.light),this.upLight=new Ko(`#FF9A4E`,2500,0,2),this.upLight.position.set(t.x,n-6,t.z),e.add(this.upLight),this.sieve=Bp(Z.ovenSieveR,3.4,{w:1.2}),this.sieve.position.set(t.x,Z.ovenTop,t.z),e.add(this.sieve),this.sparks=new Ip({count:26,life:2.6,box:new V(26,2,26),rise:46,size:.7,color:`#FFB060`,seed:12,jitter:2.5}),this.sparks.set(new V(t.x,n+8,t.z),1),e.add(this.sparks.mesh)}},K_=9,q_=7.4,J_=-49,Y_=3,X_=2,Z_=9;function Q_(e,t,n=!0){let r=new W(e,t);return r.castShadow=n,r.receiveShadow=!0,r}function $_(e){return .85-.4*((K_-e)/58)}function ev(e=`#8C7558`){return Od({roughness:.85,metalness:0},{uniforms:{uC:{value:new U(e)}},varyings:`varying vec2 vTubeUv;`,vertex:`vTubeUv = uv;`,color:`
        float tw = mix(0.5, sin(vTubeUv.x * 600.0 + vTubeUv.y * 6.2832 * 2.0) * 0.5 + 0.5, aaFade(vec2(vTubeUv.x * 600.0 / 6.2832, vTubeUv.y * 2.0)));
        diffuseColor.rgb = uC * (0.75 + 0.35 * tw);
        procBump = tw * 0.012;
      `,bump:!0})}var tv=()=>new co({color:`#B58E4E`,metalness:1,roughness:.34,clearcoat:.2});function nv(){return Od({roughness:.42,metalness:.9,color:`#A98448`},{uniforms:{uB:{value:new U(`#A98448`)}},color:`
        float n = fbm3(vPos * 0.5) * 0.5 + 0.5;
        float rim = smoothstep(7.5, 9.0, length(vPos.xz));
        vec3 col = mix(uB * 0.62, uB * 1.08, n * 0.6 + rim * 0.5);
        col = mix(col, vec3(0.33, 0.36, 0.28), smoothstep(0.62, 0.8, fbm3(vPos * 0.9 + 7.0) * 0.5 + 0.5) * 0.35);
        diffuseColor.rgb = col;
      `,rough:`roughnessFactor = 0.34 + n * 0.2;`})}var rv=class e{group=new H;beam=new H;pan=new H;weight=new H;panFloor=new V(0,-18.7,0);pivot=new V(0,-9,0);loop;constructor(){let e=this.group,t=bp({axis:`x`,light:`#8C5034`,dark:`#4A2718`,ring:3.2,rough:.42,worn:.15,seed:21}),n=ev(),r=Q_(new G(.62,.8,13,12),bp({axis:`y`,light:`#7A5A40`,dark:`#4E3828`,seed:22}));r.rotation.x=Math.PI/2-.12,r.position.set(0,.6,-6),e.add(r);let i=new Li([new V(-.5,.9,-.2),new V(0,-1.2,0),new V(0,-7.8,0)]);e.add(Q_(new Xa(i,16,.14,6,!1),n));let a=new Li([new V(.5,.9,.2),new V(.05,-1.2,.05),new V(.05,-7.8,.05)]);e.add(Q_(new Xa(a,16,.14,6,!1),n));let o=Q_(new Ya(1.05,.16,8,20),tv());o.position.copy(this.pivot),o.rotation.y=Math.PI/2,e.add(o),this.beam.position.copy(this.pivot),e.add(this.beam);let s=[];for(let e=0;e<=24;e++){let t=J_+58*e/24;s.push(new z($_(t),t))}s.unshift(new z(1e-4,J_)),s.push(new z(1e-4,K_));let c=new Ka(s,20);c.rotateZ(-Math.PI/2);let l=Q_(c,t);this.beam.add(l);let u=Q_(new G($_(K_)+.08,$_(K_)+.08,2,20),tv());u.rotation.z=Math.PI/2,u.position.x=8,this.beam.add(u);let d=Q_(new G($_(J_)+.07,$_(J_)+.07,1.4,16),tv());d.rotation.z=Math.PI/2,d.position.x=-48.3,this.beam.add(d);let f=Q_(new Ya(.45,.1,6,14),tv());f.position.set(q_,-$_(q_)-.35,0),this.beam.add(f);let p=[{x:-3,s:1.3,dy:0}];for(let e=1;e<=44;e++){let t=e/2,n=-(Y_+t*X_);if(n<-47.4)break;if(t%10==0)for(let[e,t]of[[0,0],[.32,.28],[-.32,.28],[.32,-.28],[-.32,-.28]])p.push({x:n+e,s:.9,dy:t});else if(t%5==0)for(let[e,t]of[[0,.3],[.3,-.18],[-.3,-.18]])p.push({x:n+e,s:.9,dy:t});else p.push({x:n,s:Number.isInteger(t)?1:.7,dy:0})}let m=new hi(new Ja(.1,8,6),new co({color:`#E2C88A`,metalness:1,roughness:.22}),p.length),h=new jn;p.forEach((e,t)=>{let n=$_(e.x),r=.55+e.dy/n;h.position.set(e.x,Math.sin(r)*n,Math.cos(r)*n),h.scale.setScalar(e.s),h.updateMatrix(),m.setMatrixAt(t,h.matrix)}),this.beam.add(m);let g=Q_(new Ka([new z(1e-4,-1.9),new z(5.5,-1.9),new z(7.6,-1.3),new z(Z_,0),new z(9.15,.12),new z(8.9,.1),new z(7.5,-1.15),new z(5.4,-1.7),new z(1e-4,-1.7)],48),nv());g.position.y=-17,this.pan.add(g);for(let e=0;e<3;e++){let t=e/3*Math.PI*2+.3,r=new V(0,-.2,0),i=new V(Math.cos(t)*8.6,-16.85,Math.sin(t)*8.6),a=new Li([r,r.clone().lerp(i,.5),i]);this.pan.add(Q_(new Xa(a,8,.08,5,!1),n));let o=Q_(new Ya(.22,.06,5,10),tv());o.position.copy(i),this.pan.add(o)}let _=Q_(new Ja(.3,10,8),n);_.position.y=-.1,this.pan.add(_),e.add(this.pan);let v=Q_(new Ka([[1e-4,-7.6],[1.5,-7.6],[1.9,-7.2],[1.95,-6.2],[1.6,-5.2],[1.1,-4.7],[1.25,-4.4],[1,-3.9],[.6,-3.7],[1e-4,-3.7]].map(([e,t])=>new z(e,t)),24),Dp({rust:.35}));this.weight.add(v);let y=Q_(new Ya(.45,.16,6,12),Dp({rust:.2}));y.position.y=-3.35,this.weight.add(y);let b=new Li([new V(0,0,0),new V(0,-1.5,0),new V(0,-3,0)]);this.weight.add(Q_(new Xa(b,6,.09,5,!1),n)),e.add(this.weight),this.loop=Q_(new Ya(1,.1,6,16),n),this.loop.rotation.y=Math.PI/2,this.beam.add(this.loop),this.set(0,0)}static armX(e){return-(Y_+e*X_)}set(t,n,r=0){this.beam.rotation.set(0,0,t);let i=Math.cos(t),a=Math.sin(t),o=q_,s=-$_(q_)-.7;this.pan.position.set(this.pivot.x+o*i-s*a,this.pivot.y+o*a+s*i,0),this.pan.rotation.set(r,0,r*.4);let c=e.armX(n),l=-$_(c)+.05;this.loop.position.set(c,0,0),this.loop.scale.setScalar(($_(c)+.12)/1),this.weight.position.set(this.pivot.x+c*i-l*a,this.pivot.y+c*a+l*i,0),this.weight.rotation.set(0,0,0)}panFloorWorld(e){return this.group.updateMatrixWorld(),e.copy(this.panFloor).applyMatrix4(this.pan.matrixWorld)}readWorld(e){return this.group.updateMatrixWorld(),e.copy(this.loop.position).applyMatrix4(this.beam.matrixWorld)}};function iv(e,t,n=!0){let r=new W(e,t);return r.castShadow=n,r.receiveShadow=!0,r}function av(e,t,n,r,i=18){let a=new Ka(e.map(([e,t])=>new z(Math.max(t,1e-4),e)),i);return a.applyQuaternion(new B().setFromUnitVectors(new V(0,1,0),n.clone().normalize())),a.translate(t.x,t.y,t.z),iv(a,r)}function ov(){return Od({roughness:.78,metalness:0},{uniforms:{uA:{value:new U(`#C29B74`)},uB:{value:new U(`#86613F`)},uHeart:{value:new U(`#8A5E3F`)},uBark:{value:new U(`#4E3A2E`)}},color:`
        vec3 p = vPos;
        float r = length(p.xz);
        float a = atan(p.z, p.x);
        // 年轮：两三毫米一圈，圈有点歪、宽窄不一
        float warp = snoise(vec3(p.xz * 0.06, 1.0)) * 0.9 + snoise(vec3(p.xz * 0.25, 4.0)) * 0.12;
        float rr = (r + warp) * 3.4;
        float ring = fract(rr + 0.3 * snoise(vec3(floor(rr) * 0.37, 2.0, 0.0)));
        float late = mix(0.22, smoothstep(0.55, 0.85, ring) * (1.0 - smoothstep(0.9, 1.0, ring)), aaFade(vec2(rr * 3.0)));
        vec3 col = mix(uA, uB, late * 0.5);
        // 心材深一点，往外过渡到浅的边材
        col = mix(uHeart, col, smoothstep(5.0, 14.0, r + warp * 2.0));
        // 放射状的干裂：只有两三道，从边上往里裂
        float crack = 0.0;
        for (int i = 0; i < 3; i++) {
          float ca = float(i) * 2.1 + 0.6;
          float da = abs(mod(a - ca + 3.14159, 6.28318) - 3.14159) * r;
          float w = 0.05 + 0.07 * smoothstep(12.0, 21.0, r);
          crack = max(crack, (1.0 - smoothstep(0.0, w, da + snoise(vec3(r * 0.3, float(i), 1.0)) * 0.08)) * smoothstep(9.0 + float(i) * 2.0, 18.0, r));
        }
        col *= 1.0 - crack * 0.6;
        // 刀痕：很多短短的细划痕，两三个方向
        float cut = 0.0;
        for (int i = 0; i < 3; i++) {
          float ang = float(i) * 1.05 + 0.3;
          vec2 d = vec2(cos(ang), sin(ang));
          vec2 q = vec2(dot(p.xz, d), dot(p.xz, vec2(-d.y, d.x)));
          float lane = q.y * 1.6 + float(i) * 7.0;
          float seg = hash12(vec2(floor(lane), floor(q.x * 0.25 + hash12(vec2(floor(lane), 3.0)) * 4.0)));
          cut = max(cut, step(0.82, seg) * (1.0 - smoothstep(0.0, 0.06, abs(fract(lane) - 0.5))) * aaFade(vec2(lane * 8.0)));
        }
        cut *= 1.0 - smoothstep(14.0, 20.0, r);
        col *= 1.0 - cut * 0.2;
        col *= 0.9 + 0.12 * (fbm3(p * 0.3) * 0.5 + 0.5);
        // 中间用得多，颜色发暗发亮
        col *= 1.0 - 0.08 * (1.0 - smoothstep(0.0, 12.0, r));
        if (abs(vNrm.y) < 0.5) {
          float n = fbm3(vec3(a * 6.0, p.y * 0.8, 0.0)) * 0.5 + 0.5;
          col = mix(uBark, uB, 0.3) * (0.7 + 0.5 * n);
        }
        diffuseColor.rgb = col;
        procBump = -late * 0.01 - crack * 0.25 - cut * 0.03;
      `,rough:`roughnessFactor = mix(0.82, 0.62, 1.0 - smoothstep(0.0, 12.0, r));`,bump:!0})}var sv=()=>kd({color:`#B9B6B0`,roughness:.32,metalness:.9},{uniforms:{},color:`
        float n = fbm3(vPos * vec3(0.3, 3.0, 3.0)) * 0.5 + 0.5;
        diffuseColor.rgb *= 0.82 + 0.25 * n;
        float stain = smoothstep(0.55, 0.8, fbm3(vPos * 0.6 + 3.0) * 0.5 + 0.5);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.45, 0.4, 0.36), stain * 0.5);
        // 顺着刀身的细磨痕
        float brush = snoise(vec3(vPos.x * 0.4, vPos.y * 40.0, vPos.z * 40.0)) * 0.5 + 0.5;
      `,rough:`roughnessFactor = 0.22 + n * 0.18 + stain * 0.25 + brush * 0.08;`}),cv=()=>new co({color:`#B08D57`,metalness:1,roughness:.38}),lv=-.32;function uv(){let e=new H,t=new ia;t.moveTo(0,0),t.quadraticCurveTo(2.8,-1.05,7,-1.12),t.lineTo(13,-1.15),t.lineTo(13,.5),t.lineTo(7,.5),t.quadraticCurveTo(2.6,.46,0,0);let n=new Ha(t,{depth:.09,bevelEnabled:!0,bevelThickness:.03,bevelSize:.04,bevelSegments:1,curveSegments:16});n.translate(0,0,-.045);let r=iv(n,sv());e.add(r);let i=new V(1,0,0);e.add(av([[0,.5],[.15,.56],[.75,.56],[.9,.52]],new V(12.9,lv,0),i,cv(),20));let a=bp({axis:`x`,light:`#8E6A4C`,dark:`#5A3E2C`,seed:21,ring:3}),o=av([[0,.5],[.6,.6],[3.5,.7],[7,.74],[9.4,.68],[10.2,.52],[10.5,.2],[10.55,0]],new V(13.75,lv,0),i,a,20);o.scale.set(1,1,.82),o.position.z=0,e.add(o);for(let t of[16.2,21.4]){let n=iv(new G(.16,.16,1.24,10),cv(),!1);n.rotation.x=Math.PI/2,n.position.set(t,lv,0),e.add(n)}return e}var dv=.32;function fv(){let e=new H,t=new ia;t.moveTo(0,-1.15),t.quadraticCurveTo(0,-1.3,.2,-1.3),t.lineTo(2,-1.22),t.quadraticCurveTo(3.8,-.62,4.6,-.28),t.lineTo(4.6,.28),t.quadraticCurveTo(3.8,.62,2,1.22),t.lineTo(.2,1.3),t.quadraticCurveTo(0,1.3,0,1.15),t.lineTo(0,-1.15);let n=new Ha(t,{depth:.07,bevelEnabled:!1,curveSegments:10});n.rotateX(Math.PI/2),n.translate(0,.07,0);let r=n.attributes.position;for(let e=0;e<r.count;e++){let t=r.getZ(e);r.setY(e,r.getY(e)+.16*(t/1.3)**2)}n.computeVertexNormals();let i=sv(),a=iv(n,i);e.add(a);let o=new V(Math.cos(dv),Math.sin(dv),0),s=new V(3.6,.2,0),c=new V(5.6,.2,0),l=c.clone().addScaledVector(o,1.7),u=iv(new Xa(new $i(s,c,l),24,.19,10,!1),Dp({polish:.4,rust:.25,polishR:8}));e.add(u);let d=iv(new Ga(.26,2),i);d.scale.set(1.6,.6,1),d.position.set(3.75,.12,0),e.add(d);let f=av([[0,.3],[.1,.42],[1.05,.42],[1.15,.46]],l.clone().addScaledVector(o,-.15),o,cv(),18);e.add(f);let p=av([[0,.46],[.5,.56],[3,.62],[6.5,.66],[9,.6],[9.8,.46],[10.1,.18],[10.15,0]],l.clone().addScaledVector(o,1),o,bp({axis:`y`,light:`#9A7656`,dark:`#634631`,seed:23,ring:3}),18);return e.add(p),e}function pv(e,t,n,r){return iv(new wi(e,t,n),bp({axis:`x`,plank:11.5,seed:r,light:`#A58260`,dark:`#634632`,worn:.4}))}function mv(){let e=new Ga(7,6);e.deleteAttribute(`normal`),e.deleteAttribute(`uv`);let t=om(e),n=t.attributes.position,r=new V;for(let e=0;e<n.count;e++){r.fromBufferAttribute(n,e);let t=1+.06*Math.sin(r.x*.9+1)*Math.cos(r.z*.8)+.04*Math.sin(r.y*1.7+r.x);r.multiplyScalar(t),r.y*=.55,r.x*=1.15,n.setXYZ(e,r.x,r.y,r.z)}return t.computeVertexNormals(),t.computeBoundingBox(),t.translate(0,-t.boundingBox.min.y,0),iv(t,jp({color:`#8C877F`,river:!0}))}var hv=new V,gv=new B;function _v(e,t,n){e.position.set(0,0,0),e.quaternion.copy(t),e.updateMatrixWorld(!0);let r=1/0,i=1/0,a=1/0;return e.traverse(e=>{if(!(e instanceof W))return;let t=e.geometry.attributes.position;for(let o=0;o<t.count;o++)hv.fromBufferAttribute(t,o).applyMatrix4(e.matrixWorld),r=Math.min(r,hv.y),hv.x<n?i=Math.min(i,hv.y):a=Math.min(a,hv.y)}),{lo:r,left:i,right:a}}function vv(e,t,n,r,i,a=0){let o=0,s=1/0;for(let r=0;r<=80;r++){let i=-.4+.8*r/80;gv.setFromAxisAngle(new V(0,0,1),i).multiply(t);let{left:a,right:c}=_v(e,gv,n),l=Math.abs(a-c);l<s&&(s=l,o=i)}let c=new B().setFromAxisAngle(new V(0,0,1),o).multiply(t);c.premultiply(new B().setFromAxisAngle(new V(0,1,0),a));let{lo:l}=_v(e,c,n),u=new V(r.x,i-l+.01,r.z);return e.position.copy(u),e.quaternion.copy(c),{pos:u,quat:c}}var yv=class{group=new H;knife=uv();scraper=fv();bottomBoard;topBoard;stone;basket=new H;heroSlot=new V;tray;spool=new H;bowl;knifeRest;scraperRest;boardRest;stoneRest;constructor(){let e=this.group,t=Z.table,n=Z.tableTop,r=Z.tableW,i=Z.tableD,a=bp({axis:`x`,plank:22.5,light:`#9C7656`,dark:`#5C4231`,worn:.45,seed:1}),o=bp({axis:`y`,light:`#8A6548`,dark:`#523A2B`,seed:2}),s=iv(new wi(r,5.5,i),a);s.position.set(t.x,n-2.75,t.z),e.add(s);for(let[a,s]of[[-1,-1],[1,-1],[-1,1],[1,1]]){let c=iv(new wi(6.5,n-5.5,6.5),o);c.position.set(t.x+a*(r/2-9),(n-5.5)/2,t.z+s*(i/2-8)),e.add(c)}for(let a of[-1,1]){let s=iv(new wi(r-20,9,2.5),o);s.position.set(t.x,n-10,t.z+a*(i/2-8)),e.add(s);let c=iv(new wi(r-20,4,3),o);c.position.set(t.x,16,t.z+a*(i/2-8)),e.add(c)}for(let a of[-1,1]){let s=iv(new wi(2.5,9,i-18),o);s.position.set(t.x+a*(r/2-9),n-10,t.z),e.add(s)}let c=iv(new G(21,21.5,5,64),ov());c.position.set(Z.board.x,Z.board.y-2.5,Z.board.z),e.add(c),this.knifeRest=vv(this.knife,new B().setFromAxisAngle(new V(1,0,0),-Math.PI/2),12,Z.knifeRest,n),e.add(this.knife),this.scraperRest=vv(this.scraper,new B,6,Z.scraperRest,n),e.add(this.scraper);let l=[new z(0,.6),new z(3.6,.6),new z(3.8,0),new z(4.6,0),new z(4.6,.9),new z(7.2,2.6),new z(9,5.2),new z(9.6,6.6),new z(9.3,6.8),new z(8.6,5.6),new z(6.8,3),new z(4,1.6),new z(0,1.4)];this.bowl=iv(new Ka(l,48),kp({bandY:[5.9,1.2],footY:.8})),this.bowl.position.copy(Z.bowl),this.bowl.position.y=n+.01,e.add(this.bowl),this.bottomBoard=pv(60,2,42,31),this.bottomBoard.position.set(Z.press.x,Z.press.y-1,Z.press.z),e.add(this.bottomBoard),this.topBoard=pv(62,2.4,44,32),this.boardRest=new V(Z.boardRest.x,1.21,Z.boardRest.z),this.topBoard.position.copy(this.boardRest),e.add(this.topBoard),this.stone=mv(),this.stoneRest=new V(Z.stoneRest.x,.01,Z.stoneRest.z),this.stone.position.copy(this.stoneRest),e.add(this.stone);let u=iv(new Ka([new z(0,0),new z(13,0),new z(14.6,1.5),new z(17.2,9),new z(18,12)],56),Tp({w:1.25,radius:16,rot:.785}));this.basket.add(u);let d=iv(new Ya(18.2,.8,8,64),Ep({axis:`x`}));d.rotation.x=Math.PI/2,d.position.y=12,this.basket.add(d);let f=iv(new Ya(17.5,.9,8,48,Math.PI),Ep({axis:`x`}));f.position.y=12,f.rotation.y=.3,this.basket.add(f),this.basket.position.copy(Z.basket),this.basket.position.y=n+.15,e.add(this.basket);let p=dp[0];this.heroSlot.set(this.basket.position.x+p.x,this.basket.position.y+p.y,this.basket.position.z+p.z),this.tray=Bp(15,2.6,{w:1.1}),this.tray.position.copy(Z.tray),this.tray.position.y=n+.15,e.add(this.tray);let m=iv(new G(1.6,1.6,3.4,20),bp({axis:`y`,seed:40}));m.position.y=1.7,this.spool.add(m);let h=iv(new G(2.6,2.6,2.6,28),Od({roughness:.7,metalness:0},{uniforms:{uRed:{value:new U(jd.red)}},color:`
            float th = sin(vPos.y * 22.0 + atan(vPos.z, vPos.x) * 0.6) * 0.5 + 0.5;
            diffuseColor.rgb = uRed * (0.78 + 0.3 * th);
            procBump = th * 0.02;
          `,bump:!0}));h.position.y=1.7,this.spool.add(h),this.spool.position.copy(Z.spool),this.spool.rotation.z=Math.PI/2,this.spool.position.y=n+2.6+.01,e.add(this.spool)}};function bv(){let e=[],t=[],n=[];for(let n=0;n<=9;n++){let r=n/9,i=2.7*Math.sin(Math.PI*Math.min(1,r*1.08))**.8*(1-.25*r);for(let n=0;n<=4;n++){let a=-1+2*n/4,o=a*i,s=r*11,c=Math.abs(a)*i*.28-r*r*2.2;e.push(o,s,c),t.push(a*.5+.5,r)}}for(let e=0;e<9;e++)for(let t=0;t<4;t++){let r=e*5+t,i=r+4+1;n.push(r,r+1,i,r+1,i+1,i)}let r=new Pr;return r.setAttribute(`position`,new yr(new Float32Array(e),3)),r.setAttribute(`uv`,new yr(new Float32Array(t),2)),r.setIndex(n),r.computeVertexNormals(),r}var xv=`
{
  vec3 ip = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);
  float ph = dot(ip, vec3(0.031, 0.017, 0.027));
  float gust = 0.6 + 0.4 * sin(uTime * 0.35 + ip.x * 0.004);
  float w = uWind * gust * (sin(uTime * 1.9 + ph * 6.0) * 0.55 + sin(uTime * 3.3 + ph * 11.0) * 0.3 + sin(uTime * 0.7 + ph * 3.0) * 0.35);
  float bend = transformed.y / 11.0;
  float ang = w * 0.22 * bend;
  float c = cos(ang), s = sin(ang);
  transformed.yz = mat2(c, -s, s, c) * transformed.yz;
  float tw = w * 0.18 * bend;
  transformed.xz = mat2(cos(tw), -sin(tw), sin(tw), cos(tw)) * transformed.xz;
}
`,Sv=class{group=new H;leaves;fruits;fruitSpots=[];constructor(){let e=Z.tree,t=Vu(42),n=[],r=[],i=[],a=new B,o=new V(0,1,0),s=(e,c,l,u,d)=>{let f=[e.clone()],p=c.clone(),m=e.clone();for(let e=1;e<=4;e++)p.add(new V((t()-.5)*.35,(t()-.35)*.25,(t()-.5)*.35)).normalize(),d>=2&&(p.y-=.08*e),p.normalize(),m=m.clone().addScaledVector(p,l/4),f.push(m);let h=new Li(f),g=new Xa(h,d<2?10:6,u,d<2?9:5,!1),_=g.attributes.position,v=d<2?10:6,y=d<2?9:5;for(let e=0;e<=v;e++){let t=e/v,n=h.getPointAt(t),r=1-.55*t;for(let t=0;t<=y;t++){let i=e*(y+1)+t,a=_.getX(i)-n.x,o=_.getY(i)-n.y,s=_.getZ(i)-n.z;_.setXYZ(i,n.x+a*r,n.y+o*r,n.z+s*r)}}if(n.push(g),d>=2){let e=d===2?26:34;for(let n=0;n<e;n++){let e=.25+.75*t(),n=h.getPointAt(e),i=h.getTangentAt(e),s=new V(t()-.5,t()*.9-.2,t()-.5).normalize(),c=i.clone().multiplyScalar(.6).add(s).normalize();a.setFromUnitVectors(o,c);let l=new B().setFromAxisAngle(c,t()*Math.PI*2);a.premultiply(l);let u=.75+t()*.5;r.push(new rn().compose(n.clone().addScaledVector(s,1.5),a.clone(),new V(u,u,u)))}d===3&&t()<.4&&i.push(h.getPointAt(.7+.3*t()))}if(d>=3)return;let b=d===0?4:3+ +(t()<.5);for(let e=0;e<b;e++){let n=d===0?.62+e/b*.38:.35+.65*t(),r=h.getPointAt(n),i=h.getTangentAt(n),a=new V(Math.cos(e/b*Math.PI*2+t()),0,Math.sin(e/b*Math.PI*2+t())),o=i.clone().multiplyScalar(.55).addScaledVector(a,.8+.3*t());o.y+=d===0?.55:.25,o.normalize(),s(r,o,l*(.62+.15*t()),u*(.55+.1*t()),d+1)}};s(e.clone(),new V(.18,1,-.08).normalize(),160,13,0);let c=new W(im(n),Mp({color:`#6A5A4C`}));c.castShadow=!0,c.receiveShadow=!0,this.group.add(c);let l={uniforms:{uTime:_p.uTime,uWind:_p.uWind,uSunDir:_p.uSunDir,uSunCol:_p.uSunCol,uTop:{value:new U(`#3E6A2E`)},uBottom:{value:new U(`#7C9C55`)}},vertex:xv,color:`
        vec2 lu = vec2(vPos.x / 2.7, vPos.y / 11.0);
        float mid = 1.0 - smoothstep(0.0, 0.07, abs(lu.x));
        float vein = smoothstep(0.88, 1.0, abs(sin((lu.y - abs(lu.x) * 0.45) * 26.0))) * (1.0 - mid) * 0.5;
        vec3 base = gl_FrontFacing ? uTop : uBottom;
        float tint = hash13(floor(vWPos * 0.05));
        vec3 leafCol = base * (0.85 + 0.3 * tint) * (1.0 + 0.45 * mid + 0.12 * vein);
        diffuseColor.rgb *= leafCol;
      `,emissive:`
        // 逆光时叶子透出黄绿
        vec3 V = normalize(cameraPosition - vWPos);
        float back = pow(max(dot(-V, uSunDir), 0.0), 3.0);
        totalEmissiveRadiance += uSunCol * vec3(0.55, 0.75, 0.2) * back * 0.55 * max(uSunDir.y + 0.1, 0.0);
      `},u=kd({roughness:.42,metalness:0,clearcoat:.5,clearcoatRoughness:.35,side:2},l);this.leaves=new hi(bv(),u,r.length);let d=new U;r.forEach((e,n)=>{this.leaves.setMatrixAt(n,e),d.setHSL(.24+t()*.05,.25+t()*.2,.62+t()*.2),this.leaves.setColorAt(n,d)}),this.leaves.castShadow=!0,this.leaves.receiveShadow=!0,this.leaves.customDepthMaterial=Ad(l),this.group.add(this.leaves);let f=Yf(9);Xf(f,{fuzz:1}),this.fruits=new hi(Qf(3.6),f,Math.max(1,i.length));let p=new jn;i.forEach((e,n)=>{p.position.copy(e).add(new V(0,-4.2,0)),p.rotation.set(t(),t(),t()),p.scale.setScalar(.85+t()*.3),p.updateMatrix(),this.fruits.setMatrixAt(n,p.matrix),this.fruitSpots.push(p.position.clone())}),this.fruits.count=i.length,this.fruits.castShadow=!0,this.group.add(this.fruits)}};function Cv(e,t,n,r,i,a,o,s=!0){let c=new W(new wi(e,t,n),r);return c.position.set(i,a,o),c.castShadow=s,c.receiveShadow=!0,c}var wv=class{group=new H;bulb;bulbLight;bulbMat;interiorLight;constructor(){let e=this.group,t=Z.wallZ,n=new W(new qa(9e3,9e3),Cp());n.rotation.x=-Math.PI/2,n.receiveShadow=!0,e.add(n);let r=new ia;r.moveTo(-470,0),r.lineTo(470,0),r.lineTo(470,345),r.lineTo(-470,345),r.closePath();let i=Z.door,a=new ra;a.moveTo(i.x-55,14),a.lineTo(i.x+55,14),a.lineTo(i.x+55,242),a.lineTo(i.x-55,242),a.closePath(),r.holes.push(a);let o=Z.window,s=new ra;s.moveTo(o.x-52,108),s.lineTo(o.x+52,108),s.lineTo(o.x+52,208),s.lineTo(o.x-52,208),s.closePath(),r.holes.push(s);let c=new W(new Ha(r,{depth:34,bevelEnabled:!1,curveSegments:4}),Sp({color:`#E0D3BE`,dampH:70}));c.position.z=t-34,c.castShadow=!0,c.receiveShadow=!0,e.add(c);let l=xp({brick:`#7F8086`,mortar:`#B9B4AA`,whitewash:.15}),u=-470,d=i.x-55-18,f=i.x+55+18;e.add(Cv(d-u,48,6,l,(u+d)/2,24,t+2)),e.add(Cv(470-f,48,6,l,(f+470)/2,24,t+2));let p=jp({color:`#9A958C`});e.add(Cv(18,260,12,p,i.x-55-9,128,t+4)),e.add(Cv(18,260,12,p,i.x+55+9,128,t+4)),e.add(Cv(164,22,14,p,i.x,253,t+5)),e.add(Cv(140,14,40,p,i.x,7,t+4));let m=bp({axis:`y`,light:`#7C5A43`,dark:`#4A3427`,plank:9,seed:3,worn:.5});for(let n of[-1,1]){let r=Cv(55,224,5,m,0,0,0);r.position.set(n*110/4,112,0);let a=new H;a.position.set(i.x+n*110/2,14,t-20),a.rotation.y=n*1.25,a.add(r),r.position.x=-n*110/4,e.add(a)}let h=Sp({color:`#6A6056`,damp:`#4E463F`}),g=new W(new wi(900,360,420),h);g.material.side=1,g.position.set(0,180.3,t-34-210),g.receiveShadow=!0,e.add(g);let _=bp({axis:`x`,light:`#5E4535`,dark:`#3A2A22`,seed:7}),v=new H;v.add(Cv(90,5,90,_,0,82,0));for(let[e,t]of[[-40,-40],[40,-40],[-40,40],[40,40]])v.add(Cv(6,80,6,_,e,40,t));v.position.set(i.x+40,0,t-34-230),e.add(v),e.add(Cv(120,4,26,_,i.x-70,46,t-34-160)),this.interiorLight=new Ko(`#FFB56E`,0,0,2),this.interiorLight.position.set(i.x+20,210,t-34-200),e.add(this.interiorLight);let y=bp({axis:`y`,light:`#6B4C38`,dark:`#40302A`,seed:5}),b=new H;b.add(Cv(118,8,14,y,0,104,0)),b.add(Cv(118,8,14,y,0,212,0)),b.add(Cv(8,116,14,y,-55,158,0)),b.add(Cv(8,116,14,y,55,158,0));for(let e=1;e<=9;e++)b.add(Cv(3.2,100,3.2,y,-52+104*e/10,158,0));b.position.set(o.x,0,t-17),e.add(b),e.add(Cv(134,5,18,p,o.x,99,t+2));let x=this.roof();e.add(x);let S=xp({whitewash:.45});e.add(Cv(24,190,760,S,-482,95,70)),e.add(Cv(24,190,760,S,482,95,70));let C=Np();e.add(Cv(36,8,764,C,-482,194,70)),e.add(Cv(36,8,764,C,482,194,70));let w=new W(new Ka([new z(0,0),new z(24,0),new z(30,6),new z(37,26),new z(38,44),new z(34,62),new z(31,68),new z(33,70),new z(32.5,72),new z(29,71),new z(28,64)],40),kd({roughness:.3,metalness:0,clearcoat:.6,clearcoatRoughness:.25,side:2},{uniforms:{uGlaze:{value:new U(`#5A3A2A`)}},color:`
            float n = fbm3(vPos * 0.08) * 0.5 + 0.5;
            vec3 col = uGlaze * (0.75 + 0.45 * n);
            float drip = smoothstep(0.55, 0.75, fbm3(vec3(vPos.x * 0.1, vPos.y * 0.02, vPos.z * 0.1)) * 0.5 + 0.5);
            col = mix(col, col * 1.5, drip * step(30.0, vPos.y));
            col = mix(col, vec3(0.62, 0.48, 0.36), 1.0 - smoothstep(14.0, 16.0, vPos.y));
            diffuseColor.rgb = col;
          `}));w.position.copy(Z.jar),w.castShadow=w.receiveShadow=!0,e.add(w);let T=new W(new G(28.5,28.5,.2,40),new so({color:`#25302F`,roughness:.03,metalness:.2}));T.position.set(Z.jar.x,64,Z.jar.z),e.add(T);let E=new W(new G(36,36,3,40),bp({axis:`x`,plank:12,seed:9}));E.position.set(Z.jar.x+6,73.5,Z.jar.z+4),E.rotation.set(.04,0,-.03),E.scale.set(1,1,.55),E.castShadow=E.receiveShadow=!0,e.add(E),this.pots(e);let D=Z.bulb,O=new W(new G(.25,.25,30,6),new so({color:`#2F2A2B`,roughness:.6}));O.position.set(D.x,D.y+18,D.z),e.add(O);let k=new W(new G(1.6,1.8,5,12),new so({color:`#3A3433`,roughness:.5}));k.position.set(D.x,D.y+2.5,D.z),e.add(k),this.bulbMat=new so({color:`#F4EBDD`,roughness:.15,emissive:new U(`#FFB46A`),emissiveIntensity:0,transparent:!0,opacity:.92}),this.bulb=new W(new Ja(3.2,20,14),this.bulbMat),this.bulb.scale.set(1,1.25,1),this.bulb.position.set(D.x,D.y-3,D.z),e.add(this.bulb),this.bulbLight=new Ko(`#FFB066`,0,0,2),this.bulbLight.position.set(D.x,D.y-6,D.z),this.bulbLight.castShadow=!1,e.add(this.bulbLight),this.backdrop(e)}roof(){let e=new H,t=Z.wallZ,n=Z.eaveZ,r=-470,i=Math.hypot(n-r,218),a=Math.atan2(218,n-r),o=new qa(960,i,240,40),s=o.attributes.position;for(let e=0;e<s.count;e++){let t=s.getX(e)/22*Math.PI;s.setZ(e,Math.abs(Math.sin(t))**.7*4.2)}o.computeVertexNormals();let c=new W(o,Np());c.castShadow=!0,c.receiveShadow=!0,c.rotation.x=-Math.PI/2+a,c.position.set(0,411,(n+r)/2),c.rotation.order=`XYZ`,e.add(c);let l=bp({axis:`x`,light:`#6E5442`,dark:`#463429`,plank:16,seed:2});l.shadowSide=2;let u=new W(new qa(960,i),l);u.rotation.x=Math.PI/2+a,u.position.set(0,408,(n+r)/2),u.receiveShadow=!0,u.castShadow=!0,e.add(u);let d=new W(new wi(964,12,3),bp({axis:`x`,light:`#5C4434`,dark:`#3A2B22`,seed:4}));d.position.set(0,300,n+1),d.castShadow=!0,e.add(d);let f=bp({axis:`z`,light:`#5E4636`,dark:`#3C2C23`,seed:6}),p=new wi(6,7,(n-t)/Math.cos(a));for(let r=-460;r<=460;r+=34){let i=new W(p,f);i.position.set(r,296+(n-t)/2*Math.tan(a),(n+t)/2),i.rotation.x=a,i.castShadow=!0,e.add(i)}e.add(Cv(940,14,14,f,0,302+(n-t)*.25*Math.tan(a)-14,t+(n-t)*.25));let m=new W(new wi(970,16,22),Np());return m.position.set(0,526,r),e.add(m),e}pots(e){let t=Op({color:`#9B5B40`}),n=Od({roughness:.5,metalness:0,side:2},{uniforms:{uLeaf:{value:new U(jd.leaf)}},color:`
          float n = hash13(floor(vWPos * 0.2));
          diffuseColor.rgb = uLeaf * (0.75 + 0.5 * n) * vec3(1.0, 1.05, 0.9);
        `}),r=new Ja(1,6,4);r.scale(1,.18,2.6);let i=[new V(330,0,-272),new V(372,0,-268),new V(290,0,-276),new V(-420,0,-150)],a=Vu(11),o=new jn,s=new hi(r,n,i.length*26),c=0;for(let n of i){let r=22+a()*10,i=new W(new Ka([new z(0,0),new z(11,0),new z(15,r),new z(16.5,r+.5),new z(16,r+2.4),new z(14,r+2)],24),t);i.position.copy(n),i.castShadow=i.receiveShadow=!0,e.add(i);for(let e=0;e<26;e++){let e=a()*Math.PI*2,t=.3+a()*1,i=7+a()*6;o.position.set(n.x+Math.cos(e)*3,r+2+a()*6,n.z+Math.sin(e)*3),o.rotation.set(-t,e+Math.PI/2,0,`YXZ`),o.rotation.y=-e+Math.PI/2,o.rotation.x=-t,o.scale.set(i*.38,i*.4,i),o.position.x+=Math.cos(e)*i*.8,o.position.z+=Math.sin(e)*i*.8,o.position.y+=Math.sin(t)*i*.6,o.updateMatrix(),s.setMatrixAt(c++,o.matrix)}}s.castShadow=!0,s.receiveShadow=!0,e.add(s)}backdrop(e){let t=Vu(5),n=[],r=(e,r,i)=>{let a=new G(i*.06,i*.09,i*.7,6);a.translate(e,i*.35,r),n.push(a);for(let a=0;a<4;a++){let o=new Ga(i*(.32+t()*.18),2),s=o.attributes.position;for(let e=0;e<s.count;e++){let t=new V().fromBufferAttribute(s,e),n=1+.18*Math.sin(t.x*.07+a)*Math.cos(t.z*.06+t.y*.05);t.multiplyScalar(n),s.setXYZ(e,t.x,t.y,t.z)}o.translate(e+(t()-.5)*i*.6,i*(.75+t()*.35),r+(t()-.5)*i*.5),n.push(o)}};for(let e=0;e<14;e++)r(-1600+e*240+t()*80,-900-t()*500,380+t()*260);for(let e=0;e<6;e++)r(-1200-t()*600,-300+e*260,360+t()*200);for(let e=0;e<6;e++)r(1200+t()*600,-300+e*260,360+t()*200);let i=im(n.map(e=>e.index?e.toNonIndexed():e));i.computeVertexNormals();let a=new W(i,Od({roughness:.9,metalness:0,flatShading:!0},{uniforms:{uA:{value:new U(`#4F7A3A`)},uB:{value:new U(`#7A9A4A`)}},color:`
          float n = fbm3(vWPos * 0.01) * 0.5 + 0.5;
          diffuseColor.rgb = mix(uA, uB, n) * (vWPos.y < 200.0 ? 0.55 : 1.0);
        `}));a.castShadow=!1,a.receiveShadow=!0,e.add(a);let o=new Float32Array(1086),s=[];for(let e=0;e<=180;e++){let t=Math.PI*(1.04+.92*e/180),n=9e3,r=Math.cos(t)*n,i=Math.sin(t)*n,a=950+650*Math.sin(e*.09)*Math.sin(e*.031+1)+300*Math.sin(e*.27+2)+120*Math.sin(e*.9);o.set([r,-60,i,r,a,i],e*6),e<180&&s.push(e*2,e*2+2,e*2+1,e*2+1,e*2+2,e*2+3)}let c=new Pr;c.setAttribute(`position`,new yr(o,3)),c.setIndex(s);let l=new W(c,new Kr({color:`#7F9A98`,side:2}));e.add(l)}},Tv=class{cast;scene=new Bn;env;yard=new wv;stove=new Up;table=new yv;leaves=new Wd;oven=new G_;tree=new Sv;props=new H_;steelyard=new rv;hero;dry;batch;foldedGeo;batchSteam;bundle;drops=new Rp(80);shavings;heroSteam;dust;tai=null;jar=null;cakes=null;cutter=null;winnow=null;constructor(e,t={kind:`peel`}){this.cast=t;let n=this.scene;this.env=new Tf(e,n);let r=t.petals??7;this.hero=new sp(void 0,r),n.add(this.yard.group,this.stove.group,this.table.group,this.leaves.group,this.oven.group,this.tree.group,this.props.group),n.add(this.hero.group),this.steelyard.group.position.copy(Z.steelyard),n.add(this.steelyard.group),this.dry=new W_,n.add(this.dry.group),this.batch=new gp(this.hero.geometry),n.add(this.batch.group);let i=new sp(void 0,r),a=new Gf;a.cut.fill(1),a.open.fill(1),a.cap=1,a.scrape.fill(1),a.hub=1,a.dry=1,a.soak=1,a.shrink=1,a.fold=1,a.press=0,i.state.copy(a),i.update(),this.foldedGeo=i.snapshot(),a.press=1,i.state.copy(a),i.update(),this.bundle=new P_(i.snapshot(),i.foldDir,r),i.geometry.dispose(),this.bundle.group.position.set(Z.tray.x,Z.tableTop+.15,Z.tray.z),n.add(this.bundle.group),n.add(this.drops.mesh);let o=new G(.3,.3,1.3,10,1,!0,0,Math.PI*1.2);o.rotateZ(Math.PI/2),this.shavings=new zp(o,Od({roughness:.9,metalness:0,side:2,transparent:!0},{uniforms:{uPith:{value:new U(Md.pith[1])}},attributes:`attribute float aFade;`,varyings:`varying float vFade;`,vertex:`vFade = aFade;`,color:`diffuseColor.rgb = uPith * (0.9 + 0.12 * snoise(vPos * 3.0));
            diffuseColor.a *= vFade;`}),90),n.add(this.shavings.mesh),this.batchSteam=new Fp({count:44,life:3.2,rise:26,spread:5,size:10,radius:17,drift:new V(3,0,4),opacity:.32,seed:23}),n.add(this.batchSteam.mesh),this.heroSteam=new Fp({count:26,life:2.8,rise:22,spread:3,size:7,radius:2.4,drift:new V(2,0,3),opacity:.4,seed:21}),n.add(this.heroSteam.mesh),this.dust=new Ip({count:140,life:9,box:new V(160,120,160),rise:6,size:.35,color:`#FFE9C8`,seed:5,jitter:4}),n.add(this.dust.mesh),t.kind===`tai`&&(this.tai=new um(30,15),n.add(this.tai.group,this.tai.heroGroup),this.hero.group.visible=!1,this.jar=new fm,this.jar.group.position.set(17,Z.tableTop+.01,-38),n.add(this.jar.group,this.jar.lid)),t.kind===`cake`&&(this.cakes=new Vh,n.add(this.cakes.group,this.cakes.heroGroup),this.hero.group.visible=!1,e.localClippingEnabled=!0,this.cutter=new Gh,this.winnow=new Kh,n.add(this.cutter.group,this.winnow.group))}},Ev=[{lift:1,bloom:1,exposure:1.12,sat:1.07,vignette:.34},{lift:.62,bloom:1.2,exposure:1.14,sat:.99,vignette:.4},{lift:.45,bloom:1.5,exposure:1.18,sat:.93,vignette:.46}],Dv=Ev[0],Ov={fade:.14,focus:2,aperture:1.2,maxCoc:13},kv={qizhua:`morning`,wuzhua:`forenoon`,yaguo:`evening`,tai:`golden`},Av=e=>new Promise(t=>setTimeout(t,e)),jv=class{playing=!1;started=!1;speed=1;mode;line;T=0;renderer;camera=new Wo(35,16/9,1,3e4);world;director;sound;post;ui;stage;canvas;params;mouse=new z;mouseS=new z;scale=1;frameMs=16;last=performance.now();ambient=0;fpsAcc={n:0,t:0,ms:0,k:0,text:``};slow=0;fast=0;pendingScale=!1;duration=0;blend=0;hovered=null;busy=!1;routePending=!1;startIn=0;embed=!1;sentHome=null;constructor(e,t){let n=new URLSearchParams(location.search);this.embed=n.has(`embed`),this.mode=t,this.stage=document.getElementById(`stage`),this.embed&&(document.documentElement.style.background=`#f4ecdc`,document.body.style.background=`#f4ecdc`,this.stage.style.background=`#f4ecdc`),this.canvas=document.getElementById(`gl`),this.renderer=new Pu({canvas:this.canvas,antialias:!1,powerPreference:`high-performance`,stencil:!1}),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=2,this.sound=new gd([]),this.post=new Am(this.renderer),this.params={focus:100,aperture:.1,maxCoc:9,bloom:.22,exposure:1,lift:.1,vignette:.34,grain:.022,sat:1.07,shadowTint:new U(`#6E6278`),warm:new U(`#FFF0D8`),haze:new V,hazeR:new z(.1,.1),fade:0,fadeColor:new U(`#F2E9D8`)},Dv=Ev[Math.min(2,Math.max(0,Math.round(Number(n.get(`look`)??0))||0))],this.post.aoStrength=Math.max(0,Math.min(1.5,Number(n.get(`ao`)??.7)||0)),this.assemble(e);let r=i_.map(e=>({line:e,dur:e.ready?e.acts(this.director.stage).reduce((e,t)=>e+t.dur,0):0}));this.ui=new D_(document.getElementById(`ui`),this,n.has(`debug`),r),this.install(),n.has(`t`)&&(this.T=Iu(Number(n.get(`t`)),0,this.duration)),n.has(`speed`)&&(this.speed=Number(n.get(`speed`))||1),(n.has(`autoplay`)||n.has(`t`))&&(this.mode=`play`,this.started=!0,this.playing=!n.has(`pause`),this.blend=1),this.ui.setMode(this.mode),history.replaceState({line:this.mode===`choose`?null:e.id},``),addEventListener(`popstate`,()=>{this.busy?this.routePending=!0:this.sync()}),addEventListener(`resize`,()=>this.resize()),addEventListener(`pointermove`,e=>{let t=this.stage.getBoundingClientRect();this.mouse.set(Iu((e.clientX-t.left)/t.width*2-1,-1,1),Iu((e.clientY-t.top)/t.height*2-1,-1,1))}),document.addEventListener(`visibilitychange`,()=>{this.last=performance.now(),document.hidden?this.sound.suspend():this.started&&this.sound.unlock()});let i=()=>this.sound.unlock();addEventListener(`pointerdown`,i,{capture:!0}),addEventListener(`keydown`,i,{capture:!0}),this.resize(),this.renderer.setAnimationLoop(()=>this.tick()),this.embed&&addEventListener(`message`,e=>{e.origin===location.origin&&(e.data===`craft-3d:pause`?(this.renderer.setAnimationLoop(null),this.sound.suspend()):e.data===`craft-3d:resume`&&(this.last=performance.now(),this.renderer.setAnimationLoop(()=>this.tick()),this.started&&this.sound.unlock()))}),o_(this.canvas,()=>this.render(0)),window.__seek=e=>{this.mode=`play`,this.ui.setMode(`play`),this.started=!0,this.blend=1,this.seek(e)},window.__sound=this.sound,window.__app=this}build(e){this.disposeWorld(this.world),this.assemble(e),this.install()}assemble(e){this.line=e,this.world=new Tv(this.renderer,e.cast),this.director=new mm(this.world,e),this.duration=this.director.duration}install(){let e=this.line;this.sound.setCues(this.director.cues),this.ui.setStory(this.director.story),this.T=0,this.warmUp(),document.title=`${e.name} · 古法`,window.__world=this.world,window.__acts=this.director.acts.map(e=>[e.id,e.start,e.end]),window.__story=this.director.story}disposeWorld(e){let t=new Set,n=new Set;e.scene.traverse(e=>{let r=e;if(r.geometry&&t.add(r.geometry),r.material)for(let e of Array.isArray(r.material)?r.material:[r.material])n.add(e)});for(let e of t)e.dispose();for(let e of n){for(let t of Object.values(e))t?.isTexture&&t.dispose();let t=e.uniforms;if(t)for(let e of Object.values(t))e.value?.isTexture&&e.value.dispose();e.dispose()}e.env.dispose(),e.scene.clear()}hover(e){this.hovered=e}choose(e){let t=a_(e);if(!t||this.busy)return;let n=new URL(location.href);for(let e of[`t`,`pause`,`autoplay`])n.searchParams.delete(e);n.searchParams.set(`line`,e),this.embed?history.replaceState({line:e},``,n):history.pushState({line:e,fromChooser:!0},``,n),this.goLine(t,e)}home(){if(!this.busy){if(history.state?.fromChooser)history.back();else{let e=new URL(location.href);for(let t of[`t`,`pause`,`autoplay`,`line`])e.searchParams.delete(t);this.embed?history.replaceState({line:null},``,e):history.pushState({line:null},``,e),this.goHome()}}}sync(){let e=a_(new URLSearchParams(location.search).get(`line`));e?(this.mode===`choose`||e!==this.line)&&this.goLine(e):this.mode!==`choose`&&this.goHome()}done(){this.busy=!1,this.routePending&&(this.routePending=!1,this.sync())}async goLine(e,t=null){this.busy||(this.busy=!0,this.playing=!1,await this.ui.curtainIn(t),e!==this.line&&this.build(e),this.mode=`play`,this.ui.setMode(`play`),this.hovered=null,this.director.mood.k=0,this.T=0,this.started=!0,this.blend=1,await Av(80),this.playing=!0,this.ui.quiet(),await this.ui.curtainOut(),this.done())}async goHome(){this.busy||(this.busy=!0,this.playing=!1,await this.ui.curtainIn(null),this.mode=`choose`,this.ui.setMode(`choose`),this.started=!1,this.T=0,this.blend=0,await Av(80),await this.ui.curtainOut(800),this.done())}warmUp(){for(let e of this.director.acts)e.prepare();this.director.update(this.T,0,this.camera);let e=this.world.scene,t=[],n=[],r=[];e.traverse(e=>{e.visible||=(t.push(e),!0),e.frustumCulled&&=(n.push(e),!1);let i=e;i.isInstancedMesh&&i.count===0&&(r.push(i),i.count=1)});let i=this.renderer;i.setRenderTarget(this.post.scene),i.render(e,this.camera),i.setRenderTarget(null);for(let e of t)e.visible=!1;for(let e of n)e.frustumCulled=!0;for(let e of r)e.count=0}play(){this.busy||this.mode===`choose`||(this.T>=this.duration-.05&&(this.T=0),this.started?this.playing=!0:this.startIn=.75,this.mode=`play`,this.started=!0)}pause(){this.playing=!1}toggle(){this.busy||(this.playing?this.pause():this.play())}seek(e){this.T=Iu(e,0,this.duration)}setSpeed(e){this.speed=e}get muted(){return this.sound.muted}setMuted(e){this.sound.setMuted(e),e||this.sound.unlock()}resize(){let e=innerWidth,t=innerHeight,n=16/9,r=e,i=e/n;this.embed&&e/t>=1.7577777777777777?i=t:i>t&&(i=t,r=t*n);let a=this.stage.style;a.width=r+`px`,a.height=i+`px`,a.left=(e-r)/2+`px`,a.top=(t-i)/2+`px`;let o=document.getElementById(`ui`);if(this.embed){let e=Math.min(r/1920,i/1080);o.style.width=r/e+`px`,o.style.height=i/e+`px`,o.style.setProperty(`--bleed`,(r/e-1920)/2+`px`),o.style.transform=`scale(${e})`,this.camera.aspect=r/i,this.camera.updateProjectionMatrix()}else o.style.transform=`scale(${r/1920})`;this.renderer.setSize(r,i,!1),this.applyScale(r,i)}applyScale(e=this.stage.clientWidth,t=this.stage.clientHeight){let n=Math.min(devicePixelRatio,2),r=n*Math.min(1,1920/(e*n))*this.scale;this.renderer.setPixelRatio(r),this.renderer.setSize(e,t,!1),this.post.setSize(e*r,t*r)}render(e){let t=this.director.mood,n=this.mode===`choose`?this.hovered:null;n&&xf(t.light,t.light,yf[kv[n]],t.k<.02?1:1-Math.exp(-e*2.4)),t.k+=(+!!n-t.k)*(1-Math.exp(-e*2.2));let r=this.director.update(this.T,this.ambient,this.camera);this.blend+=(+!!this.started-this.blend)*(1-Math.exp(-e*3.5));let i=this.blend,a=this.params,o=r.light;a.focus=q(Ov.focus,r.post.focus,i),a.aperture=q(Ov.aperture,r.post.aperture*.8,i),a.maxCoc=q(Ov.maxCoc,r.post.maxCoc,i),a.fade=q(Ov.fade,r.post.fade,i),a.bloom=(r.post.bloom??.22)*Dv.bloom,a.exposure=o.exposure*Dv.exposure,a.lift=o.lift*.7*Dv.lift,a.sat=Dv.sat,a.vignette=Dv.vignette,a.warm.copy(o.warm),r.post.haze&&a.haze.copy(r.post.haze),r.post.hazeR&&a.hazeR.copy(r.post.hazeR),this.post.render(this.world.scene,this.camera,a,this.ambient),this.ui.update(this.T,e,{fps:this.fpsAcc.text})}tick(){let e=performance.now(),t=(e-this.last)/1e3,n=Math.min(.1,t);this.last=e,this.pendingScale&&(this.pendingScale=!1,this.applyScale()),this.ambient+=n,_p.uTime.value=this.ambient;let r=this.T;if(this.startIn>0&&(this.startIn-=n,this.startIn<=0&&(this.playing=!0)),this.playing&&(this.T+=n*this.speed,this.T>=this.duration&&(this.T=this.duration,this.playing=!1)),this.mouseS.lerp(this.mouse,1-Math.exp(-n*2.5)),this.director.setMouse(this.mouseS.x,this.mouseS.y),this.render(n),this.embed){let e=this.mode===`choose`&&!this.busy;e!==this.sentHome&&(this.sentHome=e,parent.postMessage({type:`craft-3d`,home:e},location.origin))}this.sound.update(this.T,r,this.playing,this.started,this.speed,this.director.frame.ambience,this.camera,this.ambient);let i=this.fpsAcc;if(i.n++,i.t+=n,t<.08&&(i.ms+=t*1e3,i.k++),i.t>.5){let e=i.k?i.ms/i.k:this.frameMs;this.frameMs=e,i.text=`${(i.n/i.t).toFixed(0)} fps  ${e.toFixed(1)} ms  ×${this.scale.toFixed(2)}\nT ${this.T.toFixed(2)}`,i.n=0,i.t=0,i.ms=0,i.k=0,this.slow=e>26?this.slow+1:0,this.fast=e<14?this.fast+1:0;let t=this.scale;this.slow>=4?(this.scale=Math.max(.6,this.scale-.1),this.slow=0):this.fast>=10&&this.scale<1&&(this.scale=Math.min(1,this.scale+.05),this.fast=0),t!==this.scale&&(this.pendingScale=!0)}}},Mv={type:`change`},Nv={type:`start`},Pv={type:`end`},Fv=new Gr,Iv=new Rr,Lv=Math.cos(70*Nt.DEG2RAD),Rv=new V,zv=2*Math.PI,Bv={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Vv=1e-6,Hv=class extends ms{constructor(n,r=null){super(n,r),this.state=Bv.NONE,this.target=new V,this.cursor=new V,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:`ArrowLeft`,UP:`ArrowUp`,RIGHT:`ArrowRight`,BOTTOM:`ArrowDown`},this.mouseButtons={LEFT:e.ROTATE,MIDDLE:e.DOLLY,RIGHT:e.PAN},this.touches={ONE:t.ROTATE,TWO:t.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle=`auto`,this._domElementKeyEvents=null,this._lastPosition=new V,this._lastQuaternion=new B,this._lastTargetPosition=new V,this._quat=new B().setFromUnitVectors(n.up,new V(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new ps,this._sphericalDelta=new ps,this._scale=1,this._panOffset=new V,this._rotateStart=new z,this._rotateEnd=new z,this._rotateDelta=new z,this._panStart=new z,this._panEnd=new z,this._panDelta=new z,this._dollyStart=new z,this._dollyEnd=new z,this._dollyDelta=new z,this._dollyDirection=new V,this._mouse=new z,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Wv.bind(this),this._onPointerDown=Uv.bind(this),this._onPointerUp=Gv.bind(this),this._onContextMenu=Qv.bind(this),this._onMouseWheel=Jv.bind(this),this._onKeyDown=Yv.bind(this),this._onTouchStart=Xv.bind(this),this._onTouchMove=Zv.bind(this),this._onMouseDown=Kv.bind(this),this._onMouseMove=qv.bind(this),this._interceptControlDown=$v.bind(this),this._interceptControlUp=ey.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e===`grab`?this.domElement.style.cursor=`grab`:this.domElement.style.cursor=`auto`}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener(`pointerdown`,this._onPointerDown),this.domElement.addEventListener(`pointercancel`,this._onPointerUp),this.domElement.addEventListener(`contextmenu`,this._onContextMenu),this.domElement.addEventListener(`wheel`,this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener(`keydown`,this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction=`none`}disconnect(){this.state=Bv.NONE,this.domElement.removeEventListener(`pointerdown`,this._onPointerDown),this.domElement.ownerDocument.removeEventListener(`pointermove`,this._onPointerMove),this.domElement.ownerDocument.removeEventListener(`pointerup`,this._onPointerUp),this.domElement.removeEventListener(`pointercancel`,this._onPointerUp),this.domElement.removeEventListener(`wheel`,this._onMouseWheel),this.domElement.removeEventListener(`contextmenu`,this._onContextMenu),this.stopListenToKeyEvents();let e=this.domElement.getRootNode();e.removeEventListener(`keydown`,this._interceptControlDown,{capture:!0}),e.removeEventListener(`keyup`,this._interceptControlUp,{capture:!0}),this._controlActive=!1,this._pointers.length=0,this._pointerPositions={},this.domElement.style.touchAction=``,this.domElement.style.cursor=`auto`}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener(`keydown`,this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener(`keydown`,this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Mv),this.update(),this.state=Bv.NONE}pan(e,t){this._pan(e,t),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){let t=this.object.position;Rv.copy(t).sub(this.target),Rv.applyQuaternion(this._quat),this._spherical.setFromVector3(Rv),this.autoRotate&&this.state===Bv.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(n)&&isFinite(r)&&(n<-Math.PI?n+=zv:n>Math.PI&&(n-=zv),r<-Math.PI?r+=zv:r>Math.PI&&(r-=zv),n<=r?this._spherical.theta=Math.max(n,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+r)/2?Math.max(n,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let i=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let e=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),i=e!=this._spherical.radius}if(Rv.setFromSpherical(this._spherical),Rv.applyQuaternion(this._quatInverse),t.copy(this.target).add(Rv),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let e=null;if(this.object.isPerspectiveCamera){let t=Rv.length();e=this._clampDistance(t*this._scale);let n=t-e;this.object.position.addScaledVector(this._dollyDirection,n),this.object.updateMatrixWorld(),i=!!n}else if(this.object.isOrthographicCamera){let t=new V(this._mouse.x,this._mouse.y,0);t.unproject(this.object);let n=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),i=n!==this.object.zoom;let r=new V(this._mouse.x,this._mouse.y,0);r.unproject(this.object),this.object.position.sub(r).add(t),this.object.updateMatrixWorld(),e=Rv.length()}else console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled.`),this.zoomToCursor=!1;e!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(e).add(this.object.position):(Fv.origin.copy(this.object.position),Fv.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Fv.direction))<Lv?this.object.lookAt(this.target):(Iv.setFromNormalAndCoplanarPoint(this.object.up,this.target),Fv.intersectPlane(Iv,this.target))))}else if(this.object.isOrthographicCamera){let e=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),e!==this.object.zoom&&(this.object.updateProjectionMatrix(),i=!0)}return this._scale=1,this._performCursorZoom=!1,i||this._lastPosition.distanceToSquared(this.object.position)>Vv||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Vv||this._lastTargetPosition.distanceToSquared(this.target)>Vv?(this.dispatchEvent(Mv),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e===null?zv/60/60*this.autoRotateSpeed:zv/60*this.autoRotateSpeed*e}_getZoomScale(e){let t=Math.abs(e*.01);return .95**(this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Rv.setFromMatrixColumn(t,0),Rv.multiplyScalar(-e),this._panOffset.add(Rv)}_panUp(e,t){this.screenSpacePanning===!0?Rv.setFromMatrixColumn(t,1):(Rv.setFromMatrixColumn(t,0),Rv.crossVectors(this.object.up,Rv)),Rv.multiplyScalar(e),this._panOffset.add(Rv)}_pan(e,t){let n=this.domElement;if(this.object.isPerspectiveCamera){let r=this.object.position;Rv.copy(r).sub(this.target);let i=Rv.length();i*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*i/n.clientHeight,this.object.matrix),this._panUp(2*t*i/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.`),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.`),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.`),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),r=e-n.left,i=t-n.top,a=n.width,o=n.height;this._mouse.x=r/a*2-1,this._mouse.y=-(i/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(zv*this._rotateDelta.x/t.clientHeight),this._rotateUp(zv*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(zv*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-zv*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(zv*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-zv*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._rotateStart.set(n,r)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panStart.set(n,r)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,r=e.pageY-t.y,i=Math.sqrt(n*n+r*r);this._dollyStart.set(0,i)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._rotateEnd.set(n,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(zv*this._rotateDelta.x/t.clientHeight),this._rotateUp(zv*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panEnd.set(n,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,r=e.pageY-t.y,i=Math.sqrt(n*n+r*r);this._dollyEnd.set(0,i),this._dollyDelta.set(0,(this._dollyEnd.y/this._dollyStart.y)**+this.zoomSpeed),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let a=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new z,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function Uv(e){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(e.pointerId),this.domElement.ownerDocument.addEventListener(`pointermove`,this._onPointerMove),this.domElement.ownerDocument.addEventListener(`pointerup`,this._onPointerUp)),!this._isTrackingPointer(e)&&(this._addPointer(e),e.pointerType===`touch`?this._onTouchStart(e):this._onMouseDown(e),this._cursorStyle===`grab`&&(this.domElement.style.cursor=`grabbing`)))}function Wv(e){this.enabled!==!1&&(e.pointerType===`touch`?this._onTouchMove(e):this._onMouseMove(e))}function Gv(e){switch(this._removePointer(e),this._pointers.length){case 0:this.domElement.releasePointerCapture(e.pointerId),this.domElement.ownerDocument.removeEventListener(`pointermove`,this._onPointerMove),this.domElement.ownerDocument.removeEventListener(`pointerup`,this._onPointerUp),this.dispatchEvent(Pv),this.state=Bv.NONE,this._cursorStyle===`grab`&&(this.domElement.style.cursor=`grab`);break;case 1:let t=this._pointers[0],n=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:n.x,pageY:n.y})}}function Kv(t){let n;switch(t.button){case 0:n=this.mouseButtons.LEFT;break;case 1:n=this.mouseButtons.MIDDLE;break;case 2:n=this.mouseButtons.RIGHT;break;default:n=-1}switch(n){case e.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(t),this.state=Bv.DOLLY;break;case e.ROTATE:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=Bv.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=Bv.ROTATE}break;case e.PAN:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=Bv.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=Bv.PAN}break;default:this.state=Bv.NONE}this.state!==Bv.NONE&&this.dispatchEvent(Nv)}function qv(e){switch(this.state){case Bv.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(e);break;case Bv.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(e);break;case Bv.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(e)}}function Jv(e){this.enabled!==!1&&this.enableZoom!==!1&&this.state===Bv.NONE&&(e.preventDefault(),this.dispatchEvent(Nv),this._handleMouseWheel(this._customWheelEvent(e)),this.dispatchEvent(Pv))}function Yv(e){this.enabled!==!1&&this._handleKeyDown(e)}function Xv(e){switch(this._trackPointer(e),this._pointers.length){case 1:switch(this.touches.ONE){case t.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(e),this.state=Bv.TOUCH_ROTATE;break;case t.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(e),this.state=Bv.TOUCH_PAN;break;default:this.state=Bv.NONE}break;case 2:switch(this.touches.TWO){case t.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(e),this.state=Bv.TOUCH_DOLLY_PAN;break;case t.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(e),this.state=Bv.TOUCH_DOLLY_ROTATE;break;default:this.state=Bv.NONE}break;default:this.state=Bv.NONE}this.state!==Bv.NONE&&this.dispatchEvent(Nv)}function Zv(e){switch(this._trackPointer(e),this.state){case Bv.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(e),this.update();break;case Bv.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(e),this.update();break;case Bv.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(e),this.update();break;case Bv.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(e),this.update();break;default:this.state=Bv.NONE}}function Qv(e){this.enabled!==!1&&e.preventDefault()}function $v(e){e.key===`Control`&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener(`keyup`,this._interceptControlUp,{passive:!0,capture:!0}))}function ey(e){e.key===`Control`&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener(`keyup`,this._interceptControlUp,{passive:!0,capture:!0}))}function ty(e,t){document.getElementById(`stage`).style.inset=`0`;let n=new Pu({canvas:e,antialias:!1,powerPreference:`high-performance`});n.shadowMap.enabled=!0,n.shadowMap.type=2,n.autoClear=!0;let r=new Bn,i=new Wo(32,16/9,.5,3e4),a=new URLSearchParams(location.search),[o,s,c]=(a.get(`cam`)??`55,40,38`).split(`,`).map(Number),l=Number(a.get(`ty`)??80),u=s*Math.PI/180,d=c*Math.PI/180;i.position.set(Math.cos(d)*Math.sin(u)*o,l+Math.sin(d)*o,Math.cos(d)*Math.cos(u)*o);let f=new Hv(i,e);f.target.set(0,l,0),f.update();let p=new Tf(n,r),m=new Am(n),h=new W(new qa(6e3,6e3),Cp());h.rotation.x=-Math.PI/2,h.receiveShadow=!0,r.add(h);let g=new W(new wi(120,6,70),bp({axis:`x`,plank:17.5}));g.position.set(0,75,0),g.castShadow=g.receiveShadow=!0,r.add(g);let _=new sp(void 0,Number(a.get(`petals`)??7));_.group.position.set(0,78,0),r.add(_.group);let v=_.state,y={blanch:0,wetGloss:0,dry:0,soak:0,product:0,fuzz:1,press:0},b=(e,t)=>e.fill(t);switch(t){case`blanch`:y.blanch=1,y.wetGloss=1,y.fuzz=.4;break;case`cut`:y.blanch=1,y.fuzz=.5,b(v.cut,1),v.cut[6]=.5;break;case`half`:y.blanch=1,y.fuzz=.5,b(v.cut,1),b(v.open,.5),v.cap=.4;break;case`open`:y.blanch=1,y.fuzz=.5,b(v.cut,1),b(v.open,1),v.cap=1,_.pulp.visible=!1;break;case`scrape`:y.blanch=1,y.fuzz=.5,b(v.cut,1),b(v.open,1),v.cap=1,v.scrape.set([1,1,1,.6,.3,0,0]),v.hub=1,_.pulp.visible=!1;break;case`dry`:y.blanch=1,y.dry=1,y.fuzz=.5,b(v.cut,1),b(v.open,1),v.cap=1,b(v.scrape,1),v.hub=1,v.dry=1,v.shrink=1,_.pulp.visible=!1;break;case`fold`:y.blanch=1,y.dry=1,y.soak=1,y.fuzz=.5,b(v.cut,1),b(v.open,1),v.cap=1,b(v.scrape,1),v.hub=1,v.dry=1,v.soak=1,v.shrink=1,v.fold=.6,_.pulp.visible=!1;break;case`final`:y.blanch=1,y.dry=1,y.product=1,y.fuzz=.8,y.press=1,b(v.cut,1),b(v.open,1),v.cap=1,b(v.scrape,1),v.hub=1,v.dry=1,v.soak=1,v.shrink=1,v.fold=1,v.press=1,_.pulp.visible=!1}a.has(`o`)&&b(v.open,Number(a.get(`o`))),a.has(`cap`)&&(v.cap=Number(a.get(`cap`))),a.has(`nopulp`)&&(_.pulp.visible=!1),a.has(`f`)&&(v.fold=Number(a.get(`f`))),a.has(`p`)&&(v.press=Number(a.get(`p`))),Xf(_.material,y),_.update();let x={focus:50,aperture:.25,maxCoc:8,bloom:.2,exposure:1,lift:.1,vignette:.3,grain:.03,sat:1.05,shadowTint:new U(`#6E6278`),warm:new U(`#FFF0D8`),haze:new V,hazeR:new z(.1,.1),fade:0,fadeColor:new U(`#F2E9D8`)},S=a.get(`light`)??`forenoon`;function C(){let t=e.clientWidth,r=e.clientHeight,a=Math.min(devicePixelRatio,1.5);n.setPixelRatio(a),n.setSize(t,r,!1),m.setSize(t*a,r*a),i.aspect=t/r,i.updateProjectionMatrix()}addEventListener(`resize`,C),C();let w=performance.now();n.setAnimationLoop(()=>{let e=(performance.now()-w)/1e3;_p.uTime.value=e,f.update(),p.setShadowFocus(f.target,40),p.apply(yf[S],e),x.focus=i.position.distanceTo(f.target),x.exposure=p.state.exposure,x.lift=p.state.lift,x.warm.copy(p.state.warm),m.render(r,i,x,e)})}function ny(e){document.getElementById(`stage`).style.inset=`0`;let t=new Pu({canvas:e,antialias:!1,powerPreference:`high-performance`});t.shadowMap.enabled=!0,t.shadowMap.type=2;let n=new Tv(t),r=new URLSearchParams(location.search),i=new Wo(Number(r.get(`fov`)??40),16/9,2,3e4),a=(r.get(`view`)??`120,260,520,0,90,-120`).split(`,`).map(Number);i.position.set(a[0],a[1],a[2]);let o=new Hv(i,e);o.target.set(a[3],a[4],a[5]),o.update();let s=new Am(t),c=r.get(`light`)??`forenoon`,l={focus:300,aperture:Number(r.get(`ap`)??.05),maxCoc:8,bloom:.25,exposure:1,lift:.1,vignette:.3,grain:.03,sat:1.05,shadowTint:new U(`#6E6278`),warm:new U(`#FFF0D8`),haze:new V,hazeR:new z(.1,.1),fade:0,fadeColor:new U(`#F2E9D8`)},u=n;u.stove.steam.set(new V(-262,75.5,-255),.8),u.stove.waterU.uBoil.value=.9,u.hero.group.position.copy(u.table.heroSlot),u.bundle.update(0,0,null),u.table.topBoard.position.set(60,79.2,-10),u.table.stone.position.set(80,78,-12),u.drops.begin(),u.drops.end(),u.shavings.begin(),u.shavings.end(),u.heroSteam.set(new V,0);function d(){let n=e.clientWidth,r=e.clientHeight,a=Math.min(devicePixelRatio,1.5);t.setPixelRatio(a),t.setSize(n,r,!1),s.setSize(n*a,r*a),i.aspect=n/r,i.updateProjectionMatrix()}addEventListener(`resize`,d),d();let f=performance.now(),p=()=>{let e=(performance.now()-f)/1e3;_p.uTime.value=e,_p.uSunDir.value.copy(yf[c].sun),_p.uSunCol.value.copy(yf[c].sunColor),o.update(),u.env.setShadowFocus(o.target,Number(r.get(`sr`)??500)),u.env.apply(yf[c],e),u.dust.set(o.target,.6),l.focus=i.position.distanceTo(o.target),l.exposure=u.env.state.exposure,l.lift=u.env.state.lift,l.warm.copy(u.env.state.warm),s.render(u.scene,i,l,e)};t.setAnimationLoop(p),o_(e,p),window.cam={camera:i,controls:o}}var ry=new URLSearchParams(location.search),iy=document.getElementById(`gl`);if(ry.get(`lab`)===`world`)ny(iy);else if(ry.has(`lab`))ty(iy,ry.get(`lab`)||`whole`);else{let e=a_(ry.get(`line`));new jv(e??hh,e?`cover`:`choose`)}