function splitTextIntoLinesAndWords(){let t=document.querySelectorAll(".gs-split-words");t.forEach(t=>{let e=t.innerText.split(/\s+/),s=t.offsetWidth,n=[],i=[],l=document.createElement("span");l.style.visibility="hidden",l.style.position="absolute",l.style.whiteSpace="nowrap",t.appendChild(l),e.forEach(t=>{i.push(t),l.textContent=i.join(" "),l.offsetWidth>s&&(i.length>1?(i.pop(),n.push(i),i=[t]):(n.push(i),i=[]))}),i.length>0&&n.push(i),t.removeChild(l);let o=0,a=n.map(t=>{let e=t.map(t=>`<span class="gs-words" style="transition-delay: calc(var(--gs-root-transition-delay, 0.01s) + calc(var(--gs-root-transition-delay-multiplier, 0.1s) * ${++o}));">${t}</span>`).join(" ");return`<span class="gs-lines">${e}</span>`}).join("");t.innerHTML=a})}document.addEventListener("DOMContentLoaded",splitTextIntoLinesAndWords),window.addEventListener("resize",splitTextIntoLinesAndWords);