let GSscrollCalcDistance=0,GSonScrollIEvents=[],GSonMouseMoveIEvents=[];function GSfindChildrenWithoutStyle(e){let t=e.children;for(var r=[],i=0;i<t.length;i++){var l=t[i];"style"!==l.tagName.toLowerCase()&&r.push(l)}return r}function GSloopCall(e,t,r,i){let l=0;if(!i.aborted&&(e(),l++),l>=r)return;let n=setInterval(()=>{if(i.aborted){clearInterval(n),console.log("Loop aborted");return}e(),++l>=r&&clearInterval(n)},t)}let GSCookClass={setCookie(e,t,r){let i="";if(r){let l=new Date;l.setTime(l.getTime()+1e3*r),i="; expires="+l.toUTCString()}document.cookie=e+"="+(encodeURIComponent(t)||"")+i+"; path=/"},getCookie(e){let t=document.cookie.split(";");for(let r of t)if(r.indexOf(e+"=")>-1)return decodeURIComponent(r.split("=")[1]);return null},removeCookie(e){document.cookie=e+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"}};function GSPBgetTransformValue(e,t){let r=new DOMMatrix(e),i={scale:()=>Math.sqrt(r.a*r.a+r.b*r.b),rotate:()=>Math.atan2(r.b,r.a)*(180/Math.PI),scaleX:()=>r.a,scaleY:()=>r.d,rotateX(){let t=e.match(/rotateX\(([^)]+)\)/);return t?parseFloat(t[1]):0},rotateY(){let t=e.match(/rotateY\(([^)]+)\)/);return t?parseFloat(t[1]):0},translateX:()=>r.e,translateY:()=>r.f,translateZ:()=>r.m34};return i.hasOwnProperty(t)?i[t]():null}function GSPBsetTransformAttribute(e,t,r){let i=e.style.transform||"",l=RegExp(`${t}\\([^)]*\\)`,"g");i=i.match(l)?i.replace(l,`${t}(${r})`):`${i} ${t}(${r})`.trim(),e.style.transform=i}if(document.body&&document.body.classList.contains("gspb-bodyfront")){let e=document.querySelectorAll("[data-gspbactions]");GSPB_Trigger_Actions("front",e)}function GSPB_Trigger_Actions(e="front",t,r=window,i=document,l=null,n=null){if(t){if(null==l){let o=new AbortController;l=o.signal}t.forEach(o=>{if(null==o)return;let s=n||o.getAttribute("data-gspbactions");if(null==s){let a=o.querySelector("[data-gspbactions]");if(null==a)return;s=a.getAttribute("data-gspbactions")}let c=JSON.parse(s);c&&c.length&&c.forEach((s,a)=>{let c=s?.triggerData,f=c?.trigger;if("no-action"===s?.env&&!i.body.classList.contains("gspb-bodyfront"))return;"motion-scroll"===f&&"undefined"!=typeof GSPB_Motion_Scroll_Trigger&&GSPB_Motion_Scroll_Trigger(e,t,r,i,l,n);let g={root:null,rootMargin:c.rootmargin&&(c.rootmargin.includes("px")||c.rootmargin.includes("%"))?c.rootmargin:"0px 0px 0px 0px",threshold:c.threshold&&c.threshold>=0&&c.threshold<=1?c.threshold:.3},u=c?.selector,d=[];if(u){let p=i;if(u.includes("{CURRENT}")&&(p=o,u=u.replace("{CURRENT}","")),"."==(u=u.trim())||"#"==u)return;if(u.includes("{CLOSEST")){let b=u.match(/\{CLOSEST:(.*?)\}/)?.[1],h=u.match(/\{SELECTOR_ALL:(.*?)\}/)?.[1];b&&h?d=Array.from(o.closest(b).querySelectorAll(h)):b&&(d=[o.closest(b)])}else d=Array.from(p.querySelectorAll(u))}else d=[o];d.length&&d.forEach(t=>{switch(f){case"on-load":gspb_trigger_inter_Actions(o,t,s,null,r,i);break;case"on-slider-change":let n=t.querySelector(".swiper");n&&n.swiper.on("slideChange",function(){gspb_trigger_inter_Actions(o,t,s,null,r,i)});case"click":t.addEventListener("click",e=>{gspb_trigger_inter_Actions(o,t,s,e,r,i)},{capture:!0,signal:l});break;case"keydown":t.addEventListener("keydown",e=>{let l=c?.keycode;l&&l.length>0&&e.key===l&&gspb_trigger_inter_Actions(o,t,s,e,r,i)},{signal:l});break;case"mouse-enter":t.addEventListener("mouseenter",e=>{gspb_trigger_inter_Actions(o,t,s,e,r,i)},{signal:l});break;case"mouse-leave":t.addEventListener("mouseleave",e=>{gspb_trigger_inter_Actions(o,t,s,e,r,i)},{signal:l});break;case"exit-intent":i.addEventListener("mouseout",e=>{null==e.toElement&&null==e.relatedTarget&&e.clientY<10&&gspb_trigger_inter_Actions(o,t,s,e,r,i)},{signal:l});break;case"on-change":t.addEventListener("change",e=>{gspb_trigger_inter_Actions(o,t,s,e,r,i)},{signal:l});break;case"on-input":t.addEventListener("input",e=>{gspb_trigger_inter_Actions(o,t,s,e,r,i)},{signal:l});break;case"focus":t.addEventListener("focus",e=>{gspb_trigger_inter_Actions(o,t,s,e,r,i)},{signal:l});break;case"blur":t.addEventListener("blur",e=>{gspb_trigger_inter_Actions(o,t,s,e,r,i)},{signal:l});break;case"scroll-above":case"scroll-below":if("front"===e)GSonScrollIEvents.push({type:f,pixelScrollValue:c.pixel_scroll,element:o,triggerElement:t,layerData:s,windowobj:r,documentobj:i});else{let a=c.pixel_scroll,u=i.querySelector(".interface-interface-skeleton__content")?document.querySelector(".interface-interface-skeleton__content"):r;u.addEventListener("scroll",e=>{let l=u.scrollY;("scroll-above"===f&&l<a||"scroll-below"===f&&l>=a)&&gspb_trigger_inter_Actions(o,t,s,e,r,i)},{capture:!0,signal:l})}break;case"mouse-move":"front"===e?GSonMouseMoveIEvents.push({element:o,triggerElement:t,layerData:s,windowobj:r,documentobj:i}):r.addEventListener("mousemove",e=>{gspb_trigger_inter_Actions(o,t,s,e,r,i)},{signal:l});break;case"mouse-move-object":t.addEventListener("mousemove",e=>{gspb_trigger_inter_Actions(o,t,s,e,r,i)},{signal:l});break;case"on-view":new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&gspb_trigger_inter_Actions(o,t,s,e,r,i)})},g).observe(t);break;case"on-leave":new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting||gspb_trigger_inter_Actions(o,t,s,e,r,i)})},g).observe(t);break;case"loop":GSloopCall(function(){gspb_trigger_inter_Actions(o,t,s,event,r,i)},c.interval,c.loop_times,l)}})})})}}if(GSonScrollIEvents.length>0){let t=GSonScrollIEvents[0].windowobj||window;t.addEventListener("scroll",e=>{let r=t.scrollY;GSonScrollIEvents.forEach(t=>{("scroll-above"===t.type&&r<t.pixelScrollValue||"scroll-below"===t.type&&r>=t.pixelScrollValue)&&gspb_trigger_inter_Actions(t.element,t.triggerElement,t.layerData,e,t.windowobj,t.documentobj)})})}function GSPBDynamicMathPlaceholders(e,t,r,i,l,n){if(n?e=n:e&&e.length>0&&(e=e[0]),"string"!=typeof l)return l;if(l.indexOf("{{SCROLLVIEW}}")>-1){let o=e.getBoundingClientRect();if(o.top<r.innerHeight&&o.bottom>=0){let s=(r.innerHeight-o.top)/(r.innerHeight+o.height)*100;l=l.replace("{{SCROLLVIEW}}",s)}else l=o.bottom<0?l.replace("{{SCROLLVIEW}}",100):l.replace("{{SCROLLVIEW}}",0)}if(l.indexOf("{{CLIENT_X}}")>-1){let a=t.clientX;l=l.replace("{{CLIENT_X}}",a)}if(l.indexOf("{{VALUE}}")>-1){let c=t?.target?.value;c&&(l=l.replace("{{VALUE}}",c))}if(l.indexOf("{{ATTR:")>-1){let f=l.match(/\{{ATTR:(.*?)\}\}/)?.[1];if(f){let g=e.getAttribute(f);l=l.replace("{{ATTR:"+f+"}}",g)}}if(l.indexOf("{{RANDOM:")>-1){let u=l.match(/\{{RANDOM:(.*?)\}\}/)?.[1];if(u){let d=u.split("-"),p=d[0].trim(),b=d[1].trim(),h=parseFloat(p),m=parseFloat(b),E;if(p.includes(".")||b.includes(".")){let S=p.split(".")[1]?p.split(".")[1].length:0,T=b.split(".")[1]?b.split(".")[1].length:0;E=parseFloat((Math.random()*(m-h)+h).toFixed(Math.max(S,T)))}else E=Math.floor(Math.random()*(m-h+1))+h;l=l.replace(`{{RANDOM:${u}}}`,E)}}if(l.indexOf("{{STORAGE:")>-1){let v=l.match(/\{{STORAGE:(.*?)\}\}/)?.[1];if(v){let O=localStorage.getItem(v);l=l.replace("{{STORAGE:"+v+"}}",O)}}if(l.indexOf("{{COOKIE:")>-1){let y=l.match(/\{{COOKIE:(.*?)\}\}/)?.[1];if(y){let G=GSCookClass.getCookie(y);l=l.replace("{{COOKIE:"+y+"}}",G)}}if(l.indexOf("{{INDEX}}")>-1){let $=Array.from(GSfindChildrenWithoutStyle(e.parentNode)).indexOf(e);l=l.replace("{{INDEX}}",$)}if(l.indexOf("{{CHILD_COUNT}}")>-1){let C=Array.from(GSfindChildrenWithoutStyle(e)).length;l=l.replace("{{CHILD_COUNT}}",C)}if(l.indexOf("{{STYLE:")>-1){let A=l.match(/\{{STYLE:(.*?)\}\}/)?.[1];if(A){let I=window.getComputedStyle(e);if(["translateX","translateY","rotateX","rotateY","scaleX","scaleY","translateZ","scale","rotate"].includes(A)){let L=I.getPropertyValue("transform");cssValue=GSPBgetTransformValue(L,A)}else cssValue=I.getPropertyValue(A);l=l.replace("{{STYLE:"+A+"}}",cssValue)}}if(l.indexOf("{{CLIENT_Y}}")>-1){let k=t.clientY;l=l.replace("{{CLIENT_Y}}",k)}if(l.indexOf("{{CONTENT}}")>-1){let R=e.innerHTML;l=l.replace("{{CONTENT}}",R)}if(l.indexOf("{{OFFSET_X}}")>-1){let _=t.offsetX;l=l.replace("{{OFFSET_X}}",_)}if(l.indexOf("{{OFFSET_Y}}")>-1){let x=t.offsetY;l=l.replace("{{OFFSET_Y}}",x)}if(l.indexOf("{{CLIENT_X_%}}")>-1){let N=t.clientX/r.innerWidth*100;l=l.replace("{{CLIENT_X_%}}",Math.min(Math.max(N,0),100))}if(l.indexOf("{{CLIENT_Y_%}}")>-1){let w=t.clientY/r.innerHeight*100;l=l.replace("{{CLIENT_Y_%}}",Math.min(Math.max(w,0),100))}if(l.indexOf("{{WIDTH}}")>-1&&(l=l.replace("{{WIDTH}}",e.offsetWidth)),l.indexOf("{{HEIGHT}}")>-1&&(l=l.replace("{{HEIGHT}}",e.offsetHeight)),l.indexOf("{{OFFSET_LEFT}}")>-1&&(l=l.replace("{{OFFSET_LEFT}}",e.offsetLeft)),l.indexOf("{{OFFSET_TOP}}")>-1&&(l=l.replace("{{OFFSET_TOP}}",e.offsetTop)),l.indexOf("{{POSITION_TOP}}")>-1){let P=e.getBoundingClientRect().top;P>r.innerHeight&&(P=r.innerHeight),l=l.replace("{{POSITION_TOP}}",P)}return l.indexOf("{{POSITION_LEFT}}")>-1&&(l=l.replace("{{POSITION_LEFT}}",e.getBoundingClientRect().left)),l}function GSPBMathAttributeOperator(e,t,r,i,l,n,o,s,a){s&&"."!=s&&"#"!=s&&(s="{TRIGGERELEMENT}"==s?t:"{TRIGGERNEXT}"==s?t.nextElementSibling:"{TRIGGERPREVIOUS}"==s?t.previousElementSibling:"{TRIGGERPARENT}"==s?t.parentNode:"{TRIGGERGRANDPARENT}"==s?t.parentNode.parentNode:"{TRIGGERCHILD}"==s?t.children[0]:l.querySelector(s.trim()));let c=o=GSPBDynamicMathPlaceholders(e,r,i,l,o,s);return c&&a&&a.length>0&&a.forEach((t,n)=>{let o=t?.value,s=t?.selector,a=t?.type;if(a&&o){s&&"."!=(s=s.trim())&&"#"!=s&&(e=l.querySelector(s));let f=GSPBDynamicMathPlaceholders(e,r,i,l,o,s);f=parseFloat(f),c=parseFloat(c),"add"===a?c+=f:"subtract"===a?c-=f:"multiply"===a?c*=f:"divide"===a?c/=f:"modulo"===a&&(c%=f)}}),n&&(c+=n),c}function gspb_trigger_inter_Actions(e,t,r,i,l=window,n=document){if(!r)return;let o=r?.actions,s=r?.triggerData?.delay,a=r?.triggerData?.delaytime||0,c=r?.triggerData;void 0!==o&&(s&&a>0?setTimeout(()=>{gspb_execute_inter_Actions(e,t,o,i,l,n,c)},a):gspb_execute_inter_Actions(e,t,o,i,l,n,c))}function gspb_execute_inter_Actions(e,t,r,i,l=window,n=document,o={}){if(void 0!==r)for(let s of r){let a=s?.actionname,c=s?.selector,f=s?.conditions,g="",u=s?.classname,d=s?.attr,p=s?.attrValue,b=s?.attrValueSelector,h=s?.customMath,m=s?.attrUnit,E=[];if(c){let S=n;if(c.includes("{CURRENT}")&&(S=e,c=c.replace("{CURRENT}","")),c.includes("{POST_ID}")){let T=e.closest(".gspbgrid_item"),v="";if(T){let O=T.getAttribute("class").split(" ");for(let y=0;y<O.length;y++)if(O[y].startsWith("post-")){v=O[y].replace("post-","");break}}else{let G=n.body.getAttribute("class").split(" ");for(let $=0;$<G.length;$++)if(G[$].startsWith("post-")){v=G[$].replace("post-","");break}}c=c.replace("{POST_ID}",v)}if("."==(c=c.trim())||"#"==c)return;if(e.classList&&e.classList.contains("gspb-buttonbox")&&(t=e.classList.contains("wp-block-greenshift-blocks-buttonbox")?e.closest(".gspb_button_wrapper"):e.closest(".wp-block-greenshift-blocks-buttonbox")),c.includes("{CLOSEST")){let C=c.match(/\{CLOSEST:(.*?)\}/)?.[1],A=c.match(/\{SELECTOR_ALL:(.*?)\}/)?.[1];C&&A?(A=A.replace("{TRIGGERINDEX}",Array.from(GSfindChildrenWithoutStyle(t.parentNode)).indexOf(t)),E=Array.from(e.closest(C).querySelectorAll(A))):C&&(E=[e.closest(C)])}else"{CHILDREN}"==c?E=e.children:"{TRIGGERNEXT}"==c?E=[t.nextElementSibling]:"{TRIGGERPREVIOUS}"==c?E=[t.previousElementSibling]:"{TRIGGERPARENT}"==c?E=[t.parentNode]:"{TRIGGERGRANDPARENT}"==c?E=[t.parentNode.parentNode]:"{TRIGGERCHILD}"==c?E=[t.children[0]]:(c=c.replace("{TRIGGERINDEX}",Array.from(GSfindChildrenWithoutStyle(t.parentNode)).indexOf(t)+1),E=Array.from(S.querySelectorAll(c)))}else E=[t];if(!E.length){if(!(("panel"==a||"popup"==a)&&"undefined"!=typeof greenDynamicPanel&&greenDynamicPanel.panelcontent.find(e=>e.id===c)))return;E=[greenDynamicPanel.panelcontent.find(e=>e.id===c).src]}if("animation"===a&&"function"==typeof GSPB_Motion_Action){let I=!0;E.forEach(e=>{f&&f.length>0&&!1===(g=gspb_check_inter_Conditions(e,f,i))&&(I=!1)}),I&&GSPB_Motion_Action(E,e,s,o,i,l,n)}E.forEach(r=>{if(!f||!(f.length>0)||!1!==(g=gspb_check_inter_Conditions(r,f,i))){if("attach-class"===a)r.classList.add(u);else if("slideto"===a){let o=r.querySelector(".swiper");if(o){let E=s?.slideindex.replace("{TRIGGERINDEX}",Array.from(GSfindChildrenWithoutStyle(t.parentNode)).indexOf(t));E&&o.swiper.slideTo(E)}}else if("slidepause"===a){let S=r.querySelector(".swiper");S&&S.swiper.pause()}else if("slideresume"===a){let T=r.querySelector(".swiper");T&&T.swiper.resume()}else if("sethtml"===a)r.innerHTML=GSPBMathAttributeOperator(e,t,i,l,n,m,p,b,h);else if("copyelement"===a){let v=s?.targetcopy;if(v){let O=n.querySelector(v);if(O){let y=O.cloneNode(!0);r.appendChild(y)}}}else if("video"===a){let G=s?.videotype,$="";r instanceof HTMLVideoElement?$=r:r instanceof HTMLAudioElement?$=r:($=r.querySelector("video"))||($=r.querySelector("audio")),$&&("play"===G?$.play():"pause"===G?$.pause():"restart"===G?$.currentTime=0:$.play())}else if("reusable"===a){let C=s?.reusableid;C&&"function"==typeof GSEL_ajax_load&&GSEL_ajax_load(i,C,r)}else if("rive"===a){let A=s?.riveinput,I=s?.riveinputaction;void 0!==window[A]&&("fire"===I?window[A].fire():s?.riveinputvalue&&(window[A].value=GSPBMathAttributeOperator(e,t,i,l,n,m,p,b,h)))}else if("repeaterapi"===a){let L=s?.api_id;if(L&&"function"==typeof GSPB_Connector_API_Run){let k=n.querySelector('[data-api-id="'+L+'"]'),R=k.getAttribute("data-api-run-index");R=R?parseInt(R):-1,k&&GSPB_Connector_API_Run(k,L,{},R)}}else if("threed"===a){let _=s?.appid;"object"==typeof window[_]&&window[_].setVariable(d,GSPBMathAttributeOperator(e,t,i,l,n,m,p,b,h))}else if("attach-attribute"===a)r.setAttribute(d,GSPBMathAttributeOperator(e,t,i,l,n,m,p,b,h));else if("set-variable"===a){let x=["translateX","translateY","rotateX","rotateY","scaleX","scaleY","translateZ","scale","rotate"];x.includes(d)?GSPBsetTransformAttribute(r,d,GSPBMathAttributeOperator(e,t,i,l,n,m,p,b,h)):r.style.setProperty(d,GSPBMathAttributeOperator(e,t,i,l,n,m,p,b,h))}else if("toggle-class"===a)r.classList.toggle(u);else if("trigger-click"===a)t.click();else if("remove-class"===a)r.classList.remove(u);else if("remove-attribute"===a)r.removeAttribute(d);else if("toggle-attribute"===a)r.toggleAttribute(d);else if("save-to-browser-storage"===a){let N=s.storagekey,w=p||s.storagevalue;localStorage.setItem(N,GSPBMathAttributeOperator(e,t,i,l,n,m,w,b,h))}else if("save-to-cookie"===a){let P=s.storagekey,D=p||s.storagevalue,M=s.storagetime;GSCookClass.setCookie(P,GSPBMathAttributeOperator(e,t,i,l,n,m,D,b,h),M)}else if("remove-from-browser-storage"===a){let X=s.storagekey;localStorage.removeItem(X)}else if("remove-from-cookie"===a){let q=s.storagekey;GSCookClass.removeCookie(q)}else if("hide-element"===a)r.style.display="none";else if("show-element"===a)r.style.display="block";else if("toggle-element"===a)"none"===r.style.display?r.style.display="block":r.style.display="none";else if("lightbox"===a&&"function"==typeof openGreenlightbox){if(i.preventDefault(),t!=r)openGreenlightbox(r,t);else{let Y=s?.lightboxlink;Y?openGreenlightbox(Y,t):t.getAttribute("data-lightbox-src")?openGreenlightbox(t.getAttribute("data-lightbox-src"),t):t.getAttribute("href")&&openGreenlightbox(t.getAttribute("href"),t)}}else("panel"===a||"popup"===a)&&"function"==typeof openGreendynamicpanel?(i.preventDefault(),t!=r&&openGreendynamicpanel(r,t,c)):"popover"===a&&(i.preventDefault(),t!=r&&(r.togglePopover(),r.classList.toggle("active"),t.classList.toggle("gs-popover-open")))}})}}function gspb_check_inter_Conditions(e,t,r){let i=!1;return t&&t.forEach(t=>{let l=t.includeornot,n=t.classorid,o=t.additionalclass,s=t.value,a=(e,t,i)=>{let l="";if("value"===e?l=r?.target?.name:"storage"===e?l=localStorage.getItem(o):"cookie"===e?l=GSCookClass.getCookie(o):"window-width"===e?l=window.innerWidth:"window-height"===e&&(l=window.innerHeight),"more"===i)return l>parseFloat(t);if("less"===i)return l<parseFloat(t);if("equal"===i)return l==parseFloat(t);if("not-equal"===i)return l!=parseFloat(t);if("contains"===i)return l.includes(t);else if("not-contains"===i)return!l.includes(t);else if("between"===i){let n=t.split("-");return n&&n.length>0&&l>=parseFloat(n[0].trim())&&l<=parseFloat(n[1].trim())}};"includes"===l?"class"===n&&e.classList.contains(o)?i=!0:"id"===n&&e.id===o?i=!0:"storage"===n&&localStorage.getItem(o)?i=!0:"cookie"===n&&GSCookClass.getCookie(o)&&(i=!0):"not-includes"===l?"class"!==n||e.classList.contains(o)?"id"===n&&e.id!==o?i=!0:("storage"!==n||localStorage.getItem(o))&&("cookie"!==n||GSCookClass.getCookie(o))||(i=!0):i=!0:"more"==l?i=a(n,s,"more"):"less"==l?i=a(n,s,"less"):"equal"==l?i=a(n,s,"equal"):"not-equal"==l?i=a(n,s,"not-equal"):"contains"==l?i=a(n,s,"contains"):"not-contains"==l?i=a(n,s,"not-contains"):"checked"==l?"value"==n&&r?.target?.checked&&(i=!0):"not-checked"==l?"value"!=n||r?.target?.checked||(i=!0):"between"==l&&(i=a(n,s,"between"))}),i}GSonMouseMoveIEvents.length>0&&(GSonMouseMoveIEvents[0].windowobj||window).addEventListener("mousemove",e=>{GSonMouseMoveIEvents.forEach(t=>{gspb_trigger_inter_Actions(t.element,t.triggerElement,t.layerData,e,t.windowobj,t.documentobj)})}),window.GSPBMathAttributeOperator=GSPBMathAttributeOperator;