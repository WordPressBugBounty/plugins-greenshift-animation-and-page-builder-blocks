"use strict";function GSPB_Accordion_Toggle(e){let t=e.closest(".gs-accordion-item"),s=e.closest(".gs-accordion"),o=s.getAttribute("data-scroll"),c=t.querySelector(".gs-accordion-item__content");if(t.classList.contains("gsopen")){if(s.classList.contains("togglelogic")){let l=s.getElementsByClassName("gs-accordion-item");for(let r=0;r<l.length;r++){l[r].classList.replace("gsopen","gsclose");l[r].querySelector(".gs-accordion-item__title").setAttribute("aria-expanded","false");let a=l[r].querySelector(".gs-accordion-item__content");a.setAttribute("aria-hidden","true"),a.style.maxHeight=null}}else t.classList.replace("gsopen","gsclose"),t.querySelector(".gs-accordion-item__title").setAttribute("aria-expanded","false"),c.setAttribute("aria-hidden","true"),c.style.maxHeight=null}else{if(s.classList.contains("togglelogic")){let n=s.getElementsByClassName("gs-accordion-item");for(let g=0;g<n.length;g++){n[g].classList.replace("gsopen","gsclose");n[g].querySelector(".gs-accordion-item__title").setAttribute("aria-expanded","false");let d=n[g].querySelector(".gs-accordion-item__content");d.setAttribute("aria-hidden","true"),d.style.maxHeight=null}}t.classList.replace("gsclose","gsopen"),c.style.maxHeight=c.scrollHeight+"px",t.querySelector(".gs-accordion-item__title").setAttribute("aria-expanded","true"),c.setAttribute("aria-hidden","false"),o&&t.scrollIntoView({behavior:"smooth"})}}document.addEventListener("click",function(e){let t=e.target;(t.classList.contains("gs-accordion-item__title")||t.closest(".gs-accordion-item__title"))&&GSPB_Accordion_Toggle(e.target)},!1);let accordionItems=document.querySelectorAll(".gs-accordion-item__title");for(let i=0;i<accordionItems.length;i++){let e=accordionItems[i].closest(".gs-accordion-item");if(e.classList.contains("gsopen")){let t=e.querySelector(".gs-accordion-item__content");t.style.maxHeight=t.scrollHeight+"px"}accordionItems[i].addEventListener("keydown",function(e){let t=void 0!==e.key?e.key:e.keyCode;("Enter"===t||13===t||["Spacebar"," "].indexOf(t)>=0||32===t)&&(e.preventDefault(),GSPB_Accordion_Toggle(accordionItems[i]))})}