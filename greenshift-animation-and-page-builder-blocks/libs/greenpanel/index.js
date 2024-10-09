class GSDynamicPanel{constructor(e={}){this.options={...e},this.injectStyles(),this.createDynamicPanelElement(),this.dynamicpanel=document.getElementById("gs-dynamicpanel"),this.content=this.dynamicpanel.querySelector(".gs-dynamicpanel-content"),this.dynamicpanel.addEventListener("click",e=>{e.target===this.dynamicpanel&&this.close()}),document.addEventListener("keydown",e=>{"Escape"===e.key&&this.close()})}injectStyles(){let e=document.createElement("style");e.textContent=`
    .gs-dynamicpanel {
        position: fixed;
        z-index: 999999;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }
    .gs-dynamicpanel.active {
        pointer-events: auto;
    }
    .gs-dynamicpanel-close {
        position: absolute;
        top: 15px;
        right: 15px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.5);
        border: none;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        transition: var(--gs-root-transition, all .3s ease-in-out);
        transform: scale(0);
        opacity: 0;
    }
    .gs-dynamicpanel.active .gs-dynamicpanel-close {
        transform: scale(1);
        opacity: 1;
    }
    .gs-dynamicpanel.active .gs-dynamicpanel-close:hover {
        background-color: rgba(0, 0, 0, 0.8);
        transform: scale(1.1);
    }
`,document.head.appendChild(e)}createDynamicPanelElement(){let e=`
    <div id="gs-dynamicpanel" class="gs-dynamicpanel" aria-hidden="true" role="dialog" aria-modal="true">
        <div class="gs-dynamicpanel-content" tabindex="-1"></div>
    </div>
`;document.body.insertAdjacentHTML("beforeend",e)}open(e,t){if(this.content.innerHTML="",this.triggerElement=t,e instanceof HTMLElement){let n=e;if(n&&"function"==typeof n.cloneNode)try{let i=n.cloneNode(!0);i.classList.add("gs-panel-initial"),this.content.appendChild(i),setTimeout(()=>{i.classList.add("active"),i.classList.remove("gs-panel-initial")},10)}catch(a){console.error("Failed to clone element:",a)}else n&&(this.content.innerHTML=n.outerHTML||n.textContent)}setTimeout(()=>{this.dynamicpanel.classList.add("active")},10),this.triggerElement&&this.triggerElement.classList.add("triggeractive"),this.dynamicpanel.setAttribute("aria-hidden","false"),this.content.querySelector(".gs-panel-close")?this.closeBtn.addEventListener("click",()=>this.close()):this.dynamicpanel.querySelector(".gs-dynamicpanel-close")||(this.closeBtn=document.createElement("button"),this.closeBtn.classList.add("gs-dynamicpanel-close"),this.closeBtn.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',this.dynamicpanel.appendChild(this.closeBtn),this.closeBtn.addEventListener("click",()=>this.close())),this.content.focus()}close(){this.dynamicpanel.classList.remove("active"),this.dynamicpanel.setAttribute("aria-hidden","true"),this.content.classList.remove("active"),this.content.querySelector(".active").classList.remove("active"),this.triggerElement&&this.triggerElement.classList.remove("triggeractive"),this.triggerElement&&this.triggerElement.focus()}}let greenDynamicPanel;function openGreendynamicpanel(e,t){greenDynamicPanel&&greenDynamicPanel.open(e,t)}document.addEventListener("DOMContentLoaded",()=>{greenDynamicPanel=new GSDynamicPanel});