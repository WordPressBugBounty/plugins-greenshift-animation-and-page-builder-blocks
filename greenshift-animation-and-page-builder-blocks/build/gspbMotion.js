(()=>{"use strict";const t=t=>"number"==typeof t,e=t=>"function"==typeof t,n=()=>{},i=t=>t,a=(t,e,n)=>(((1-3*n+3*e)*t+(3*n-6*e))*t+3*e)*t,r=1e-7,s=12;function o(t,e,n,o){if(t===e&&n===o)return i;return i=>0===i||1===i?i:a(function(t,e,n,i,o){let l,c,u=0;do{c=e+(n-e)/2,l=a(c,i,o)-t,l>0?n=c:e=c}while(Math.abs(l)>r&&++u<s);return c}(i,0,1,t,n),e,o)}const l=(t,e,n)=>Math.min(Math.max(n,t),e),c=(t,e="end")=>n=>{const i=(n="end"===e?Math.min(n,.999):Math.max(n,.001))*t,a="end"===e?Math.floor(i):Math.ceil(i);return l(0,1,a/t)},u=e=>Array.isArray(e)&&t(e[0]),h={ease:o(.25,.1,.25,1),"ease-in":o(.42,0,1,1),"ease-in-out":o(.42,0,.58,1),"ease-out":o(0,0,.58,1)},d=/\((.*?)\)/;function f(t){if(e(t))return t;if(u(t))return o(...t);const n=h[t];if(n)return n;if(t.startsWith("steps")){const e=d.exec(t);if(e){const t=e[1].split(",");return c(parseFloat(t[0]),t[1].trim())}}return i}function m(t,n,i){return e(t)?t(n,i):t}const p={duration:.3,delay:0,endDelay:0,repeat:0,easing:"ease"},g=t=>1e3*t,y=t=>t/1e3;function v(t,e=!0){if(t&&"finished"!==t.playState)try{t.stop?t.stop():(e&&t.commitStyles(),t.cancel())}catch(t){}}const S=t=>t(),w=(t,e,n=p.duration)=>new Proxy({animations:t.map(S).filter(Boolean),duration:n,options:e},b),b={get:(t,e)=>{const i=t.animations[0];switch(e){case"duration":return t.duration;case"currentTime":return y((null==i?void 0:i[e])||0);case"playbackRate":case"playState":return null==i?void 0:i[e];case"finished":return t.finished||(t.finished=Promise.all(t.animations.map(M)).catch(n)),t.finished;case"stop":return()=>{t.animations.forEach((t=>v(t)))};case"forEachNative":return e=>{t.animations.forEach((n=>e(n,t)))};default:return void 0===(null==i?void 0:i[e])?void 0:()=>t.animations.forEach((t=>t[e]()))}},set:(t,e,n)=>{switch(e){case"currentTime":n=g(n);case"playbackRate":for(let i=0;i<t.animations.length;i++)t.animations[i][e]=n;return!0}return!1}},M=t=>t.finished,A=t=>"object"==typeof t&&Boolean(t.createAnimation),E=e=>Array.isArray(e)&&!t(e[0]),T=(t,e,n)=>-n*t+n*e+t,P=(t,e,n)=>e-t==0?1:(n-t)/(e-t);function D(t,e){const n=t[t.length-1];for(let i=1;i<=e;i++){const a=P(0,e,i);t.push(T(n,1,a))}}class k{constructor(t,e=[0,1],{easing:n,duration:a=p.duration,delay:r=p.delay,endDelay:s=p.endDelay,repeat:o=p.repeat,offset:c,direction:u="normal",autoplay:h=!0}={}){if(this.startTime=null,this.rate=1,this.t=0,this.cancelTimestamp=null,this.easing=i,this.duration=0,this.totalDuration=0,this.repeat=0,this.playState="idle",this.finished=new Promise(((t,e)=>{this.resolve=t,this.reject=e})),n=n||p.easing,A(n)){const t=n.createAnimation(e);n=t.easing,e=t.keyframes||e,a=t.duration||a}this.repeat=o,this.easing=E(n)?i:f(n),this.updateDuration(a);const d=function(t,e=function(t){const e=[0];return D(e,t-1),e}(t.length),n=i){const a=t.length,r=a-e.length;return r>0&&D(e,r),i=>{let r=0;for(;r<a-2&&!(i<e[r+1]);r++);let s=l(0,1,P(e[r],e[r+1],i));const o=function(t,e){return E(t)?t[((t,e,n)=>{const i=e-t;return((n-t)%i+i)%i+t})(0,t.length,e)]:t}(n,r);return s=o(s),T(t[r],t[r+1],s)}}(e,c,E(n)?n.map(f):i);this.tick=e=>{var n;let i=0;i=void 0!==this.pauseTime?this.pauseTime:(e-this.startTime)*this.rate,this.t=i,i/=1e3,i=Math.max(i-r,0),"finished"===this.playState&&void 0===this.pauseTime&&(i=this.totalDuration);const a=i/this.duration;let o=Math.floor(a),l=a%1;!l&&a>=1&&(l=1),1===l&&o--;const c=o%2;("reverse"===u||"alternate"===u&&c||"alternate-reverse"===u&&!c)&&(l=1-l);const h=i>=this.totalDuration?1:Math.min(l,1),f=d(this.easing(h));t(f),void 0===this.pauseTime&&("finished"===this.playState||i>=this.totalDuration+s)?(this.playState="finished",null===(n=this.resolve)||void 0===n||n.call(this,f)):"idle"!==this.playState&&(this.frameRequestId=requestAnimationFrame(this.tick))},h&&this.play()}play(){const t=performance.now();this.playState="running",void 0!==this.pauseTime?this.startTime=t-this.pauseTime:this.startTime||(this.startTime=t),this.cancelTimestamp=this.startTime,this.pauseTime=void 0,this.frameRequestId=requestAnimationFrame(this.tick)}pause(){this.playState="paused",this.pauseTime=this.t}finish(){this.playState="finished",this.tick(0)}stop(){var t;this.playState="idle",void 0!==this.frameRequestId&&cancelAnimationFrame(this.frameRequestId),null===(t=this.reject)||void 0===t||t.call(this,!1)}cancel(){this.stop(),this.tick(this.cancelTimestamp)}reverse(){this.rate*=-1}commitStyles(){}updateDuration(t){this.duration=t,this.totalDuration=t*(this.repeat+1)}get currentTime(){return this.t}set currentTime(t){void 0!==this.pauseTime||0===this.rate?this.pauseTime=t:this.startTime=performance.now()-t/this.rate}get playbackRate(){return this.rate}set playbackRate(t){this.rate=t}}class O{setAnimation(t){this.animation=t,null==t||t.finished.then((()=>this.clearAnimation())).catch((()=>{}))}clearAnimation(){this.animation=this.generator=void 0}}const x=new WeakMap;function B(t){return x.has(t)||x.set(t,{transforms:[],values:new Map}),x.get(t)}const F=["","X","Y","Z"],R={x:"translateX",y:"translateY",z:"translateZ"},$={syntax:"<angle>",initialValue:"0deg",toDefaultUnit:t=>t+"deg"},_={translate:{syntax:"<length-percentage>",initialValue:"0px",toDefaultUnit:t=>t+"px"},rotate:$,scale:{syntax:"<number>",initialValue:1,toDefaultUnit:i},skew:$},q=new Map,W=t=>`--motion-${t}`,j=["x","y","z"];["translate","scale","rotate","skew"].forEach((t=>{F.forEach((e=>{j.push(t+e),q.set(W(t+e),_[t])}))}));const G=(t,e)=>j.indexOf(t)-j.indexOf(e),V=new Set(j),U=t=>V.has(t),C=t=>t.sort(G).reduce(I,"").trim(),I=(t,e)=>`${t} ${e}(var(${W(e)}))`,z=t=>t.startsWith("--"),H=new Set,L=(t,e)=>document.createElement("div").animate(t,e),N={cssRegisterProperty:()=>"undefined"!=typeof CSS&&Object.hasOwnProperty.call(CSS,"registerProperty"),waapi:()=>Object.hasOwnProperty.call(Element.prototype,"animate"),partialKeyframes:()=>{try{L({opacity:[1]})}catch(t){return!1}return!0},finished:()=>Boolean(L({opacity:[0,1]},{duration:.001}).finished),linearEasing:()=>{try{L({opacity:0},{easing:"linear(0, 1)"})}catch(t){return!1}return!0}},K={},X={};for(const t in N)X[t]=()=>(void 0===K[t]&&(K[t]=N[t]()),K[t]);const Y=(t,n)=>e(t)?X.linearEasing()?`linear(${((t,e)=>{let n="";const i=Math.round(e/.015);for(let e=0;e<i;e++)n+=t(P(0,i-1,e))+", ";return n.substring(0,n.length-2)})(t,n)})`:p.easing:u(t)?Z(t):t,Z=([t,e,n,i])=>`cubic-bezier(${t}, ${e}, ${n}, ${i})`;function J(t){return R[t]&&(t=R[t]),U(t)?W(t):t}const Q=(t,e)=>{e=J(e);let n=z(e)?t.style.getPropertyValue(e):getComputedStyle(t)[e];if(!n&&0!==n){const t=q.get(e);t&&(n=t.initialValue)}return n},tt=(t,e,n)=>{e=J(e),z(e)?t.style.setProperty(e,n):t.style[e]=n};function et(a,r,s,o={},l){const c=window.__MOTION_DEV_TOOLS_RECORD,u=!1!==o.record&&c;let h,{duration:d=p.duration,delay:f=p.delay,endDelay:m=p.endDelay,repeat:y=p.repeat,easing:S=p.easing,persist:w=!1,direction:b,offset:M,allowWebkitAcceleration:T=!1,autoplay:P=!0}=o;const D=B(a),k=U(r);let x=X.waapi();k&&((t,e)=>{R[e]&&(e=R[e]);const{transforms:n}=B(t);var i,a;a=e,-1===(i=n).indexOf(a)&&i.push(a),t.style.transform=C(n)})(a,r);const F=J(r),$=function(t,e){return t.has(e)||t.set(e,new O),t.get(e)}(D.values,F),_=q.get(F);return v($.animation,!(A(S)&&$.generator)&&!1!==o.record),()=>{const p=()=>{var t,e;return null!==(e=null!==(t=Q(a,F))&&void 0!==t?t:null==_?void 0:_.initialValue)&&void 0!==e?e:0};let v=function(t,e){for(let n=0;n<t.length;n++)null===t[n]&&(t[n]=n?t[n-1]:e());return t}((t=>Array.isArray(t)?t:[t])(s),p);const D=function(t,e){var n;let a=(null==e?void 0:e.toDefaultUnit)||i;const r=t[t.length-1];if("string"==typeof r){const t=(null===(n=r.match(/(-?[\d.]+)([a-z%]*)/))||void 0===n?void 0:n[2])||"";t&&(a=e=>e+t)}return a}(v,_);if(A(S)){const t=S.createAnimation(v,"opacity"!==r,p,F,$);S=t.easing,v=t.keyframes||v,d=t.duration||d}if(z(F)&&(X.cssRegisterProperty()?function(t){if(!H.has(t)){H.add(t);try{const{syntax:e,initialValue:n}=q.has(t)?q.get(t):{};CSS.registerProperty({name:t,inherits:!1,syntax:e,initialValue:n})}catch(t){}}}(F):x=!1),k&&!X.linearEasing()&&(e(S)||E(S)&&S.some(e))&&(x=!1),x){_&&(v=v.map((e=>t(e)?_.toDefaultUnit(e):e))),1!==v.length||X.partialKeyframes()&&!u||v.unshift(p());const e={delay:g(f),duration:g(d),endDelay:g(m),easing:E(S)?void 0:Y(S,d),direction:b,iterations:y+1,fill:"both"};h=a.animate({[F]:v,offset:M,easing:E(S)?S.map((t=>Y(t,d))):void 0},e),h.finished||(h.finished=new Promise(((t,e)=>{h.onfinish=t,h.oncancel=e})));const i=v[v.length-1];h.finished.then((()=>{w||(tt(a,F,i),h.cancel())})).catch(n),T||(h.playbackRate=1.000001)}else if(l&&k)v=v.map((t=>"string"==typeof t?parseFloat(t):t)),1===v.length&&v.unshift(parseFloat(p())),h=new l((t=>{tt(a,F,D?D(t):t)}),v,Object.assign(Object.assign({},o),{duration:d,easing:S}));else{const e=v[v.length-1];tt(a,F,_&&t(e)?_.toDefaultUnit(e):e)}return u&&c(a,r,v,{duration:d,delay:f,easing:S,repeat:y,offset:M},"motion-one"),$.setAnimation(h),h&&!P&&h.pause(),h}}const nt=(t,e)=>t[e]?Object.assign(Object.assign({},t),t[e]):Object.assign({},t),it=(at=k,function(t,e,n={}){const i=(t=function(t,e){return"string"==typeof t?t=document.querySelectorAll(t):t instanceof Element&&(t=[t]),Array.from(t||[])}(t)).length;Boolean(i),Boolean(e);const a=[];for(let r=0;r<i;r++){const s=t[r];for(const t in e){const o=nt(n,t);o.delay=m(o.delay,r,i);const l=et(s,t,e[t],o,at);a.push(l)}}return w(a,n,n.duration)});var at;function rt(t,e={}){return w([()=>{const n=new k(t,[0,1],e);return n.finished.catch((()=>{})),n}],e,e.duration)}function st(t,n,i){return(e(t)?rt:it)(t,n,i)}function ot(e,n,i,a,r,s=window,o=document,l=!1){let c=i?.aopts,u=i?.aprops,h={},d={};c&&c.length>0&&c.forEach((t=>{let e=t?.value.trim(),i=t?.type.trim(),a=t?.keyframed,l=t?.keyframes;if(i)if(a&&l&&l.length>0){let t=[];l.forEach((e=>{let i=e?.value.trim();const a=e?.attrValueSelector,l=e?.customMath;let c=e?.attrUnit;(i||0==i)&&("undefined"!=typeof GSPBDynamicMathPlaceholders&&(i=GSPBMathAttributeOperator(n,r,s,o,c,i,a,l)),i=/^-?\d+(\.\d+)?$/.test(i)?parseFloat(i):i,"null"==i&&(i=null),t.push(i))})),h[i]=t}else{if(e=/^-?\d+(\.\d+)?$/.test(e)?parseFloat(e):e,"null"==e&&(e=null),"undefined"!=typeof GSPBDynamicMathPlaceholders){const i=t?.attrValueSelector,a=t?.customMath;let l=t?.attrUnit;e=GSPBMathAttributeOperator(n,r,s,o,l,e,i,a)}h[i]=e}})),u&&u.length>0&&u.forEach((n=>{let i=n?.value,a=n?.type.trim(),r=n?.keyframed,s=n?.extra,o=n?.stagger,l=n?.keyframes;if(a)if(o){let i=parseFloat(n?.staggervalue)||.1,r={from:n?.staggerfrom||"first",start:parseFloat(n?.staggerstart)||0,easing:n?.staggereasing||"linear"};d[a]=function(e=.1,{start:n=0,from:i=0,easing:a}={}){return(r,s)=>{const o=t(i)?i:function(t,e){if("first"===t)return 0;{const n=e-1;return"last"===t?n:n/2}}(i,s),l=Math.abs(o-r);let c=e*l;if(a){const t=s*e;c=f(a)(c/t)*t}return n+c}}(i,r),1==e.length&&e[0].children&&(e=e[0].children)}else if(r&&l&&l.length>0){let t=[];l.forEach((e=>{let n=e.trim();n=/^-?\d+(\.\d+)?$/.test(n)?parseFloat(n):n,n&&t.push(n)})),d[a]=t}else if(s&&s.length>0){let t={};s.forEach((e=>{let n=e?.value.trim(),i=e?.key.trim();i&&(n||0==n)&&(n=/^-?\d+(\.\d+)?$/.test(n)?parseFloat(n):n,"spring"==n&&"undefined"!=typeof GSPBMotionSpring&&(n=GSPBMotionSpring()),t[i]=n)})),d[a]=t}else i=/^-?\d+(\.\d+)?$/.test(i)?parseFloat(i):i,"spring"==i&&"undefined"!=typeof GSPBMotionSpring&&(i=GSPBMotionSpring()),d[a]=i}));let m=a?.trigger;if("motion-scroll"==m?d.duration=1:d.duration||(d.duration=.5),e&&"object"==typeof e){let t=e.length>0?e[0]:e,n=t.getAttribute("data-delay")?parseFloat(t.getAttribute("data-delay")):null;n&&(d.delay=n)}if(l)return st(e,h,d);st(e,h,d)}window.GSPB_Motion_Action=ot,window.GSPBAnimate=st,window.GSPB_Motion_Scroll_Trigger=function(t="front",e,n=window,i=document,a=null,r=null){if(e){if(null==a){const t=new AbortController;a=t.signal}e.forEach((t=>{if(null==t)return;let e=r||t.getAttribute("data-gspbactions");if(null==e){let n=t.querySelector("[data-gspbactions]");if(null==n)return;e=n.getAttribute("data-gspbactions")}const s=JSON.parse(e);s&&s.length&&s.forEach(((e,r)=>{const s=e?.triggerData,o=s?.trigger;if("motion-scroll"!=o)return;let l=e?.actions;if(!l||!l.length)return;let c=s?.selector,u=[];if(c){if(c=c.trim(),"."==c||"#"==c)return;u=Array.from(i.querySelectorAll(c))}else u=[t];u.length&&l.forEach(((e,r)=>{const o=e?.actionname;if(!o)return;if("animation"!=o)return;let l=e?.selector,c=[];if(l){if(l=l.trim(),"."==l||"#"==l)return;c=Array.from(i.querySelectorAll(l))}else c=[t];let h=ot(c,u,e,s,null,n,i,!0);h.pause(),u.forEach((t=>{let e=i.querySelector(".interface-interface-skeleton__content")?document.querySelector(".interface-interface-skeleton__content"):n,r=s?.scrollcontainer;if(r){if(r=r.trim(),"."==r||"#"==r)return;e=i.querySelector(r)}const o=()=>{let n=s?.startElement,i=s?.startWindow,a=s?.endElement,r=s?.endWindow;window.innerWidth<768&&(s?.startElementMobile&&(n=s?.startElementMobile),s?.startWindowMobile&&(i=s?.startWindowMobile),s?.endElementMobile&&(a=s?.endElementMobile),s?.endWindowMobile&&(r=s?.endWindowMobile));let o=((t,e=window,n=0,i=100,a=100,r=0,s="vertical")=>{const o=t.getBoundingClientRect();let l=null;const c="vertical"===s?o.top:o.left,u="vertical"===s?o.height:o.width;let h=0;h=e.innerHeight?"vertical"===s?e.innerHeight:e.innerWidth:"vertical"===s?e.clientHeight:e.clientWidth;const d=c+u*n/100,f=c+u*a/100,m=h*i/100,p=h*r/100;return d<=m&&f>=p?(l=(m-d)/(m-p+(f-d))*100,l=((t,e,n=100)=>((t=Math.max(e,Math.min(n,t)))-e)/(n-e)*100)(l,t.getAttribute("data-scroll-initial")||0,100)):l=f<p?100:0,l})(t,e,n,i,a,r,s?.orientation);return o};e.addEventListener("load",(e=>{let n=o();n&&t.setAttribute("data-scroll-initial",n)})),e.addEventListener("scroll",(e=>{let n=o();n&&(h.currentTime=n/100,t.setAttribute("data-scroll-progress",n))}),{capture:!0,signal:a})}))}))}))}))}}})();