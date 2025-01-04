let GSscrollCalcDistance=0,GSonScrollIEvents=[],GSonMouseMoveIEvents=[];function GSfindChildrenWithoutStyle(e){let t=e.children;for(var r=[],i=0;i<t.length;i++){var l=t[i];"style"!==l.tagName.toLowerCase()&&r.push(l)}return r}let GSCookClass={setCookie(e,t,r){let i="";if(r){let l=new Date;l.setTime(l.getTime()+1e3*r),i="; expires="+l.toUTCString()}document.cookie=e+"="+(encodeURIComponent(t)||"")+i+"; path=/"},getCookie(e){let t=document.cookie.split(";");for(let r of t)if(r.indexOf(e+"=")>-1)return decodeURIComponent(r.split("=")[1]);return null},removeCookie(e){document.cookie=e+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"}};function GSPBgetTransformValue(e,t){let r=new DOMMatrix(e),i={scale:()=>Math.sqrt(r.a*r.a+r.b*r.b),rotate:()=>Math.atan2(r.b,r.a)*(180/Math.PI),scaleX:()=>r.a,scaleY:()=>r.d,rotateX(){let t=e.match(/rotateX\(([^)]+)\)/);return t?parseFloat(t[1]):0},rotateY(){let t=e.match(/rotateY\(([^)]+)\)/);return t?parseFloat(t[1]):0},translateX:()=>r.e,translateY:()=>r.f,translateZ:()=>r.m34};return i.hasOwnProperty(t)?i[t]():null}function GSPBsetTransformAttribute(e,t,r){let i=e.style.transform||"",l=RegExp(`${t}\\([^)]*\\)`,"g");i=i.match(l)?i.replace(l,`${t}(${r})`):`${i} ${t}(${r})`.trim(),e.style.transform=i}if(document.body&&document.body.classList.contains("gspb-bodyfront")){let e=document.querySelectorAll("[data-gspbactions]");GSPB_Trigger_Actions("front",e)}function GSPB_Trigger_Actions(e="front",t,r=window,i=document,l=null,o=null){if(t){if(null==l){let n=new AbortController;l=n.signal}t.forEach(n=>{if(null==n)return;let s=o||n.getAttribute("data-gspbactions");if(null==s){let a=n.querySelector("[data-gspbactions]");if(null==a)return;s=a.getAttribute("data-gspbactions")}let c=JSON.parse(s);c&&c.length&&c.forEach((s,a)=>{let c=s?.triggerData,g=c?.trigger;if("no-action"===s?.env&&!i.body.classList.contains("gspb-bodyfront"))return;"motion-scroll"===g&&"undefined"!=typeof GSPB_Motion_Scroll_Trigger&&GSPB_Motion_Scroll_Trigger(e,t,r,i,l,o);let f={root:null,rootMargin:c.rootmargin&&(c.rootmargin.includes("px")||c.rootmargin.includes("%"))?c.rootmargin:"0px 0px 0px 0px",threshold:c.threshold&&c.threshold>=0&&c.threshold<=1?c.threshold:.3},u=c?.selector,d=[];if(u){let p=i;if(u.includes("{CURRENT}")&&(p=n,u=u.replace("{CURRENT}","")),"."==(u=u.trim())||"#"==u)return;if(u.includes("{CLOSEST")){let b=u.match(/\{CLOSEST:(.*?)\}/)?.[1],h=u.match(/\{SELECTOR_ALL:(.*?)\}/)?.[1];b&&h?d=Array.from(n.closest(b).querySelectorAll(h)):b&&(d=[n.closest(b)])}else d=Array.from(p.querySelectorAll(u))}else d=[n];d.length&&d.forEach(t=>{switch(g){case"on-load":gspb_trigger_inter_Actions(n,t,s,null,r,i);break;case"on-slider-change":let o=t.querySelector(".swiper");o&&o.swiper.on("slideChange",function(){gspb_trigger_inter_Actions(n,t,s,null,r,i)});case"click":t.addEventListener("click",e=>{gspb_trigger_inter_Actions(n,t,s,e,r,i)},{capture:!0,signal:l});break;case"keydown":t.addEventListener("keydown",e=>{let l=c?.keycode;l&&l.length>0&&e.key===l&&gspb_trigger_inter_Actions(n,t,s,e,r,i)},{signal:l});break;case"mouse-enter":t.addEventListener("mouseenter",e=>{gspb_trigger_inter_Actions(n,t,s,e,r,i)},{signal:l});break;case"mouse-leave":t.addEventListener("mouseleave",e=>{gspb_trigger_inter_Actions(n,t,s,e,r,i)},{signal:l});break;case"exit-intent":i.addEventListener("mouseout",e=>{null==e.toElement&&null==e.relatedTarget&&e.clientY<10&&gspb_trigger_inter_Actions(n,t,s,e,r,i)},{signal:l});break;case"on-change":t.addEventListener("change",e=>{gspb_trigger_inter_Actions(n,t,s,e,r,i)},{signal:l});break;case"on-input":t.addEventListener("input",e=>{gspb_trigger_inter_Actions(n,t,s,e,r,i)},{signal:l});break;case"focus":t.addEventListener("focus",e=>{gspb_trigger_inter_Actions(n,t,s,e,r,i)},{signal:l});break;case"blur":t.addEventListener("blur",e=>{gspb_trigger_inter_Actions(n,t,s,e,r,i)},{signal:l});break;case"scroll-above":case"scroll-below":if("front"===e)GSonScrollIEvents.push({type:g,pixelScrollValue:c.pixel_scroll,element:n,triggerElement:t,layerData:s,windowobj:r,documentobj:i});else{let a=c.pixel_scroll,u=i.querySelector(".interface-interface-skeleton__content")?document.querySelector(".interface-interface-skeleton__content"):r;u.addEventListener("scroll",e=>{let l=u.scrollY;("scroll-above"===g&&l<a||"scroll-below"===g&&l>=a)&&gspb_trigger_inter_Actions(n,t,s,e,r,i)},{capture:!0,signal:l})}break;case"mouse-move":"front"===e?GSonMouseMoveIEvents.push({element:n,triggerElement:t,layerData:s,windowobj:r,documentobj:i}):r.addEventListener("mousemove",e=>{gspb_trigger_inter_Actions(n,t,s,e,r,i)},{signal:l});break;case"mouse-move-object":t.addEventListener("mousemove",e=>{gspb_trigger_inter_Actions(n,t,s,e,r,i)},{signal:l});break;case"on-view":new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&gspb_trigger_inter_Actions(n,t,s,e,r,i)})},f).observe(t);break;case"on-leave":new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting||gspb_trigger_inter_Actions(n,t,s,e,r,i)})},f).observe(t)}})})})}}if(GSonScrollIEvents.length>0){let t=GSonScrollIEvents[0].windowobj||window;t.addEventListener("scroll",e=>{let r=t.scrollY;GSonScrollIEvents.forEach(t=>{("scroll-above"===t.type&&r<t.pixelScrollValue||"scroll-below"===t.type&&r>=t.pixelScrollValue)&&gspb_trigger_inter_Actions(t.element,t.triggerElement,t.layerData,e,t.windowobj,t.documentobj)})})}function GSPBDynamicMathPlaceholders(e,t,r,i,l,o){if(o?e=o:e&&e.length>0&&(e=e[0]),"string"!=typeof l)return l;if(l.indexOf("{{SCROLLVIEW}}")>-1){let n=e.getBoundingClientRect();if(n.top<r.innerHeight&&n.bottom>=0){let s=(r.innerHeight-n.top)/(r.innerHeight+n.height)*100;l=l.replace("{{SCROLLVIEW}}",s)}else l=n.bottom<0?l.replace("{{SCROLLVIEW}}",100):l.replace("{{SCROLLVIEW}}",0)}if(l.indexOf("{{CLIENT_X}}")>-1){let a=t.clientX;l=l.replace("{{CLIENT_X}}",a)}if(l.indexOf("{{VALUE}}")>-1){let c=t?.target?.value;c&&(l=l.replace("{{VALUE}}",c))}if(l.indexOf("{{ATTR:")>-1){let g=l.match(/\{{ATTR:(.*?)\}\}/)?.[1];if(g){let f=e.getAttribute(g);l=l.replace("{{ATTR:"+g+"}}",f)}}if(l.indexOf("{{RANDOM:")>-1){let u=l.match(/\{{RANDOM:(.*?)\}\}/)?.[1];if(u){let d=u.split("-"),p=parseInt(d[0],10),b=parseInt(d[1],10);l=l.replace(`{{RANDOM:${u}}}`,Math.floor(Math.random()*(b-p+1))+p)}}if(l.indexOf("{{STORAGE:")>-1){let h=l.match(/\{{STORAGE:(.*?)\}\}/)?.[1];if(h){let m=localStorage.getItem(h);l=l.replace("{{STORAGE:"+h+"}}",m)}}if(l.indexOf("{{COOKIE:")>-1){let E=l.match(/\{{COOKIE:(.*?)\}\}/)?.[1];if(E){let S=GSCookClass.getCookie(E);l=l.replace("{{COOKIE:"+E+"}}",S)}}if(l.indexOf("{{STYLE:")>-1){let T=l.match(/\{{STYLE:(.*?)\}\}/)?.[1];if(T){let v=window.getComputedStyle(e);if(["translateX","translateY","rotateX","rotateY","scaleX","scaleY","translateZ","scale","rotate"].includes(T)){let O=v.getPropertyValue("transform");cssValue=GSPBgetTransformValue(O,T)}else cssValue=v.getPropertyValue(T);l=l.replace("{{STYLE:"+T+"}}",cssValue)}}if(l.indexOf("{{CLIENT_Y}}")>-1){let y=t.clientY;l=l.replace("{{CLIENT_Y}}",y)}if(l.indexOf("{{CONTENT}}")>-1){let $=e.innerHTML;l=l.replace("{{CONTENT}}",$)}if(l.indexOf("{{OFFSET_X}}")>-1){let C=t.offsetX;l=l.replace("{{OFFSET_X}}",C)}if(l.indexOf("{{OFFSET_Y}}")>-1){let A=t.offsetY;l=l.replace("{{OFFSET_Y}}",A)}if(l.indexOf("{{CLIENT_X_%}}")>-1){let L=t.clientX/r.innerWidth*100;l=l.replace("{{CLIENT_X_%}}",Math.min(Math.max(L,0),100))}if(l.indexOf("{{CLIENT_Y_%}}")>-1){let G=t.clientY/r.innerHeight*100;l=l.replace("{{CLIENT_Y_%}}",Math.min(Math.max(G,0),100))}if(l.indexOf("{{WIDTH}}")>-1&&(l=l.replace("{{WIDTH}}",e.offsetWidth)),l.indexOf("{{HEIGHT}}")>-1&&(l=l.replace("{{HEIGHT}}",e.offsetHeight)),l.indexOf("{{OFFSET_LEFT}}")>-1&&(l=l.replace("{{OFFSET_LEFT}}",e.offsetLeft)),l.indexOf("{{OFFSET_TOP}}")>-1&&(l=l.replace("{{OFFSET_TOP}}",e.offsetTop)),l.indexOf("{{POSITION_TOP}}")>-1){let k=e.getBoundingClientRect().top;k>r.innerHeight&&(k=r.innerHeight),l=l.replace("{{POSITION_TOP}}",k)}return l.indexOf("{{POSITION_LEFT}}")>-1&&(l=l.replace("{{POSITION_LEFT}}",e.getBoundingClientRect().left)),l}function GSPBMathAttributeOperator(e,t,r,i,l,o,n,s,a){s&&"."!=s&&"#"!=s&&(s="{TRIGGERELEMENT}"==s?t:"{TRIGGERNEXT}"==s?t.nextElementSibling:"{TRIGGERPREVIOUS}"==s?t.previousElementSibling:"{TRIGGERPARENT}"==s?t.parentNode:"{TRIGGERGRANDPARENT}"==s?t.parentNode.parentNode:"{TRIGGERCHILD}"==s?t.children[0]:l.querySelector(s.trim()));let c=n=GSPBDynamicMathPlaceholders(e,r,i,l,n,s);return c&&a&&a.length>0&&a.forEach((t,o)=>{let n=t?.value,s=t?.selector,a=t?.type;if(a&&n){s&&"."!=(s=s.trim())&&"#"!=s&&(e=l.querySelector(s));let g=GSPBDynamicMathPlaceholders(e,r,i,l,n,s);g=parseFloat(g),c=parseFloat(c),"add"===a?c+=g:"subtract"===a?c-=g:"multiply"===a?c*=g:"divide"===a?c/=g:"modulo"===a&&(c%=g)}}),o&&(c+=o),c}function gspb_trigger_inter_Actions(e,t,r,i,l=window,o=document){if(!r)return;let n=r?.actions,s=r?.triggerData?.delay,a=r?.triggerData?.delaytime||0,c=r?.triggerData;void 0!==n&&(s&&a>0?setTimeout(()=>{gspb_execute_inter_Actions(e,t,n,i,l,o,c)},a):gspb_execute_inter_Actions(e,t,n,i,l,o,c))}function gspb_execute_inter_Actions(e,t,r,i,l=window,o=document,n={}){if(void 0!==r)for(let s of r){let a=s?.actionname,c=s?.selector,g=s?.conditions,f="",u=s?.classname,d=s?.attr,p=s?.attrValue,b=s?.attrValueSelector,h=s?.customMath,m=s?.attrUnit,E=[];if(c){let S=o;if(c.includes("{CURRENT}")&&(S=e,c=c.replace("{CURRENT}","")),"."==(c=c.trim())||"#"==c)return;if(e.classList&&e.classList.contains("gspb-buttonbox")&&(t=e.classList.contains("wp-block-greenshift-blocks-buttonbox")?e.closest(".gspb_button_wrapper"):e.closest(".wp-block-greenshift-blocks-buttonbox")),c.includes("{CLOSEST")){let T=c.match(/\{CLOSEST:(.*?)\}/)?.[1],v=c.match(/\{SELECTOR_ALL:(.*?)\}/)?.[1];T&&v?(v=v.replace("{TRIGGERINDEX}",Array.from(GSfindChildrenWithoutStyle(t.parentNode)).indexOf(t)),E=Array.from(e.closest(T).querySelectorAll(v))):T&&(E=[e.closest(T)])}else"{CHILDREN}"==c?E=e.children:(c=c.replace("{TRIGGERINDEX}",Array.from(GSfindChildrenWithoutStyle(t.parentNode)).indexOf(t)+1),E=Array.from(S.querySelectorAll(c)))}else E=[t];if(!E.length)return;if("animation"===a&&"function"==typeof GSPB_Motion_Action){let O=!0;E.forEach(e=>{g&&g.length>0&&!1===(f=gspb_check_inter_Conditions(e,g,i))&&(O=!1)}),O&&GSPB_Motion_Action(E,e,s,n,i,l,o)}E.forEach(r=>{if(!g||!(g.length>0)||!1!==(f=gspb_check_inter_Conditions(r,g,i))){if("attach-class"===a)r.classList.add(u);else if("slideto"===a){let n=r.querySelector(".swiper");if(n){let c=s?.slideindex.replace("{TRIGGERINDEX}",Array.from(GSfindChildrenWithoutStyle(t.parentNode)).indexOf(t));c&&n.swiper.slideTo(c)}}else if("slidepause"===a){let E=r.querySelector(".swiper");E&&E.swiper.pause()}else if("slideresume"===a){let S=r.querySelector(".swiper");S&&S.swiper.resume()}else if("sethtml"===a)r.innerHTML=GSPBMathAttributeOperator(e,t,i,l,o,m,p,b,h);else if("copyelement"===a){let T=s?.targetcopy;if(T){let v=o.querySelector(T);if(v){let O=v.cloneNode(!0);r.appendChild(O)}}}else if("video"===a){let y=s?.videotype,$="";r instanceof HTMLVideoElement?$=r:r instanceof HTMLAudioElement?$=r:($=r.querySelector("video"))||($=r.querySelector("audio")),$&&("play"===y?$.play():"pause"===y?$.pause():"restart"===y?$.currentTime=0:$.play())}else if("reusable"===a){let C=s?.reusableid;C&&"function"==typeof GSEL_ajax_load&&GSEL_ajax_load(i,C,r)}else if("rive"===a){let A=s?.riveinput,L=s?.riveinputaction;void 0!==window[A]&&("fire"===L?window[A].fire():s?.riveinputvalue&&(window[A].value=GSPBMathAttributeOperator(e,t,i,l,o,m,p,b,h)))}else if("threed"===a){let G=s?.appid;"object"==typeof window[G]&&window[G].setVariable(d,GSPBMathAttributeOperator(e,t,i,l,o,m,p,b,h))}else if("attach-attribute"===a)r.setAttribute(d,GSPBMathAttributeOperator(e,t,i,l,o,m,p,b,h));else if("set-variable"===a){let k=["translateX","translateY","rotateX","rotateY","scaleX","scaleY","translateZ","scale","rotate"];k.includes(d)?GSPBsetTransformAttribute(r,d,GSPBMathAttributeOperator(e,t,i,l,o,m,p,b,h)):r.style.setProperty(d,GSPBMathAttributeOperator(e,t,i,l,o,m,p,b,h))}else if("toggle-class"===a)r.classList.toggle(u);else if("remove-class"===a)r.classList.remove(u);else if("remove-attribute"===a)r.removeAttribute(d);else if("toggle-attribute"===a)r.toggleAttribute(d);else if("save-to-browser-storage"===a){let I=s.storagekey,_=p||s.storagevalue;localStorage.setItem(I,GSPBMathAttributeOperator(e,t,i,l,o,m,_,b,h))}else if("save-to-cookie"===a){let x=s.storagekey,R=p||s.storagevalue,w=s.storagetime;GSCookClass.setCookie(x,GSPBMathAttributeOperator(e,t,i,l,o,m,R,b,h),w)}else if("remove-from-browser-storage"===a){let N=s.storagekey;localStorage.removeItem(N)}else if("remove-from-cookie"===a){let P=s.storagekey;GSCookClass.removeCookie(P)}else if("hide-element"===a)r.style.display="none";else if("show-element"===a)r.style.display="block";else if("toggle-element"===a)"none"===r.style.display?r.style.display="block":r.style.display="none";else if("lightbox"===a&&"function"==typeof openGreenlightbox){if(i.preventDefault(),t!=r)openGreenlightbox(r,t);else{let M=s?.lightboxlink;M?openGreenlightbox(M,t):t.getAttribute("data-lightbox-src")?openGreenlightbox(t.getAttribute("data-lightbox-src"),t):t.getAttribute("href")&&openGreenlightbox(t.getAttribute("href"),t)}}else("panel"===a||"popup"===a)&&"function"==typeof openGreendynamicpanel?(i.preventDefault(),t!=r&&openGreendynamicpanel(r,t)):"popover"===a&&(i.preventDefault(),t!=r&&(r.togglePopover(),r.classList.toggle("active"),t.classList.toggle("gs-popover-open")))}})}}function gspb_check_inter_Conditions(e,t,r){let i=!1;return t&&t.forEach(t=>{let l=t.includeornot,o=t.classorid,n=t.additionalclass,s=t.value,a=(e,t,i)=>{let l="";if("value"===e?l=r?.target?.name:"storage"===e?l=localStorage.getItem(n):"cookie"===e?l=GSCookClass.getCookie(n):"window-width"===e?l=window.innerWidth:"window-height"===e&&(l=window.innerHeight),"more"===i)return l>parseFloat(t);if("less"===i)return l<parseFloat(t);if("equal"===i)return l==parseFloat(t);if("not-equal"===i)return l!=parseFloat(t);if("contains"===i)return l.includes(t);else if("not-contains"===i)return!l.includes(t);else if("between"===i){let o=t.split("-");return o&&o.length>0&&l>=parseFloat(o[0].trim())&&l<=parseFloat(o[1].trim())}};"includes"===l?"class"===o&&e.classList.contains(n)?i=!0:"id"===o&&e.id===n?i=!0:"storage"===o&&localStorage.getItem(n)?i=!0:"cookie"===o&&GSCookClass.getCookie(n)&&(i=!0):"not-includes"===l?"class"!==o||e.classList.contains(n)?"id"===o&&e.id!==n?i=!0:("storage"!==o||localStorage.getItem(n))&&("cookie"!==o||GSCookClass.getCookie(n))||(i=!0):i=!0:"more"==l?i=a(o,s,"more"):"less"==l?i=a(o,s,"less"):"equal"==l?i=a(o,s,"equal"):"not-equal"==l?i=a(o,s,"not-equal"):"contains"==l?i=a(o,s,"contains"):"not-contains"==l?i=a(o,s,"not-contains"):"checked"==l?"value"==o&&r?.target?.checked&&(i=!0):"not-checked"==l?"value"!=o||r?.target?.checked||(i=!0):"between"==l&&(i=a(o,s,"between"))}),i}GSonMouseMoveIEvents.length>0&&(GSonMouseMoveIEvents[0].windowobj||window).addEventListener("mousemove",e=>{GSonMouseMoveIEvents.forEach(t=>{gspb_trigger_inter_Actions(t.element,t.triggerElement,t.layerData,e,t.windowobj,t.documentobj)})}),window.GSPBMathAttributeOperator=GSPBMathAttributeOperator;