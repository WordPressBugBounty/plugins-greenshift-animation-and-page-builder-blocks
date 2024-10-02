let GSscrollCalcDistance = 0;
let GSonScrollIEvents = [];
let GSonMouseMoveIEvents = [];

function GSfindChildrenWithoutStyle(parentNode) {
    let children = parentNode.children;
    var result = [];

    for (var i = 0; i < children.length; i++) {
        var child = children[i];

        // Ignore if node is a <style> element
        if (child.tagName.toLowerCase() === 'style') {
            continue;
        }

        // Add child to result
        result.push(child);
    }

    return result;
}

let GSCookClass = {

    setCookie(name, value, sec) {
        let expires = '';

        if (sec) {
            const date = new Date();
            date.setTime(date.getTime() + (sec * 1000));
            expires = '; expires=' + date.toUTCString();
        }

        document.cookie = name + '=' + (encodeURIComponent(value) || '') + expires + '; path=/';
    },

    getCookie(name) {
        const cookies = document.cookie.split(';');

        for (const cookie of cookies) {
            if (cookie.indexOf(name + '=') > -1) {
                return decodeURIComponent(cookie.split('=')[1]);
            }
        }

        return null;
    },

    removeCookie(name) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    }
}

function GSPBgetTransformValue(transformString, valueName) {
    const matrix = new DOMMatrix(transformString);

    const values = {
        scale: () => Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b),
        rotate: () => Math.atan2(matrix.b, matrix.a) * (180 / Math.PI),
        scaleX: () => matrix.a,
        scaleY: () => matrix.d,
        rotateX: () => {
            const match = transformString.match(/rotateX\(([^)]+)\)/);
            return match ? parseFloat(match[1]) : 0;
        },
        rotateY: () => {
            const match = transformString.match(/rotateY\(([^)]+)\)/);
            return match ? parseFloat(match[1]) : 0;
        },
        translateX: () => matrix.e,
        translateY: () => matrix.f,
        translateZ: () => matrix.m34
    };

    if (values.hasOwnProperty(valueName)) {
        return values[valueName]();
    } else {
        return null;
    }
}

if (document.body && document.body.classList.contains('gspb-bodyfront')) {
    const layersElements = document.querySelectorAll("[data-gspbactions]");
    GSPB_Trigger_Actions('front', layersElements);
}

function GSPB_Trigger_Actions(place = 'front', layersElements, windowobj = window, documentobj = document, signal = null, dataLayers = null) {
    if (layersElements) {
        if (signal == null) {
            const abortcontroller = new AbortController();
            signal = abortcontroller.signal;
        }
        layersElements.forEach((element) => {
            if (element == null) return;
            let dataSetActions = dataLayers ? dataLayers : element.getAttribute("data-gspbactions");
            if (dataSetActions == null) {
                let newElement = element.querySelector('[data-gspbactions]');
                if (newElement == null) return;
                dataSetActions = newElement.getAttribute("data-gspbactions");
            }
            const layersArr = JSON.parse(dataSetActions);
            if (!layersArr || !layersArr.length) return;
            layersArr.forEach((layerData, layerIndex) => {

                const triggerData = layerData?.triggerData;
                const triggerType = triggerData?.trigger;
                let env = layerData?.env;
                if (env === 'no-action' && !documentobj.body.classList.contains('gspb-bodyfront')) {
                    return;
                }
                if (triggerType === 'motion-scroll' && typeof GSPB_Motion_Scroll_Trigger != 'undefined') {
                    GSPB_Motion_Scroll_Trigger(place, layersElements, windowobj, documentobj, signal, dataLayers);
                };
                let observerargs = {
                    root: null,
                    rootMargin: (triggerData.rootmargin && (triggerData.rootmargin.includes('px') || triggerData.rootmargin.includes('%'))) ? triggerData.rootmargin : '0px 0px 0px 0px',
                    threshold: (triggerData.threshold && triggerData.threshold >= 0 && triggerData.threshold <= 1) ? triggerData.threshold : 0.3
                }

                let triggerSelector = triggerData?.selector;
                let triggerElements = [];
                if (triggerSelector) {
                    let searchIn = documentobj;
                    if (triggerSelector.includes('{CURRENT}')) {
                        searchIn = element;
                        triggerSelector = triggerSelector.replace('{CURRENT}', '');
                    }
                    triggerSelector = triggerSelector.trim();
                    if (triggerSelector == '.' || triggerSelector == '#') return;
                    if (triggerSelector.includes('{CLOSEST')) {
                        let matchesClosest = triggerSelector.match(/\{CLOSEST:(.*?)\}/)?.[1];
                        let matchesSelector = triggerSelector.match(/\{SELECTOR_ALL:(.*?)\}/)?.[1];
                        if (matchesClosest && matchesSelector) {
                            triggerElements = Array.from(element.closest(matchesClosest).querySelectorAll(matchesSelector));
                        } else if (matchesClosest) {
                            triggerElements = [element.closest(matchesClosest)];
                        }
                    }else{
                        triggerElements = Array.from(searchIn.querySelectorAll(triggerSelector));
                    }
                } else {
                    triggerElements = [element];
                }

                if (!triggerElements.length) {
                    return;
                }

                triggerElements.forEach(triggerElement => {
                    switch (triggerType) {
                        case 'on-load':
                            gspb_trigger_inter_Actions(element, triggerElement, layerData, null, windowobj, documentobj);
                            break;
                        case "on-slider-change":
                            let sliderFind = triggerElement.querySelector('.swiper');
                            if(sliderFind){
                                let sliderObj = sliderFind.swiper;
                                sliderObj.on('slideChange', function () {
                                    gspb_trigger_inter_Actions(element, triggerElement, layerData, null, windowobj, documentobj);
                                });
                            }
                        case "click":
                            triggerElement.addEventListener("click", (event) => {
                                gspb_trigger_inter_Actions(element, triggerElement, layerData, event, windowobj, documentobj);
                            }, { capture: true, signal: signal });
                            break;
                        case "keydown":
                            triggerElement.addEventListener("keydown", (event) => {
                                let keyCode = triggerData?.keycode;
                                if (keyCode && keyCode.length > 0) {
                                    if (event.key === keyCode) {
                                        gspb_trigger_inter_Actions(element, triggerElement, layerData, event, windowobj, documentobj);
                                    }
                                }
                            }, { signal: signal });
                            break;
                        case 'mouse-enter':
                            triggerElement.addEventListener("mouseenter", (event) => {
                                gspb_trigger_inter_Actions(element, triggerElement, layerData, event, windowobj, documentobj);
                            }, { signal: signal });
                            break;
                        case 'mouse-leave':
                            triggerElement.addEventListener("mouseleave", (event) => {
                                gspb_trigger_inter_Actions(element, triggerElement, layerData, event, windowobj, documentobj);
                            }, { signal: signal });
                            break;

                        case 'on-change':
                            triggerElement.addEventListener("change", (event) => {
                                gspb_trigger_inter_Actions(element, triggerElement, layerData, event, windowobj, documentobj);
                            }, { signal: signal });
                            break;

                        case 'on-input':
                            triggerElement.addEventListener("input", (event) => {
                                gspb_trigger_inter_Actions(element, triggerElement, layerData, event, windowobj, documentobj);
                            }, { signal: signal });
                            break;

                        case "focus":
                            triggerElement.addEventListener("focus", (event) => {
                                gspb_trigger_inter_Actions(element, triggerElement, layerData, event, windowobj, documentobj);
                            }, { signal: signal });
                            break;

                        case "blur":
                            triggerElement.addEventListener("blur", (event) => {
                                gspb_trigger_inter_Actions(element, triggerElement, layerData, event, windowobj, documentobj);
                            }, { signal: signal });
                            break;

                        case "scroll-above":
                        case "scroll-below":
                            if (place === 'front') {
                                GSonScrollIEvents.push(
                                    {
                                        type: triggerType,
                                        pixelScrollValue: triggerData.pixel_scroll,
                                        element: element,
                                        triggerElement: triggerElement,
                                        layerData: layerData,
                                        windowobj: windowobj,
                                        documentobj: documentobj
                                    }
                                );
                            } else {
                                let pixelScrollAbove = triggerData.pixel_scroll;
                                let triggerObj = documentobj.querySelector('.interface-interface-skeleton__content') ? document.querySelector(".interface-interface-skeleton__content") : windowobj;
                                triggerObj.addEventListener("scroll", (event) => {
                                    let scrollY = triggerObj.scrollY;
                                    if ((triggerType === 'scroll-above' && scrollY < pixelScrollAbove) || (triggerType === 'scroll-below' && scrollY >= pixelScrollAbove)) {
                                        gspb_trigger_inter_Actions(element, triggerElement, layerData, event, windowobj, documentobj);
                                    }
                                }, { capture: true, signal: signal });
                            }
                            break;
                        case "mouse-move":
                            if (place === 'front') {
                                GSonMouseMoveIEvents.push(
                                    {
                                        element: element,
                                        triggerElement: triggerElement,
                                        layerData: layerData,
                                        windowobj: windowobj,
                                        documentobj: documentobj
                                    }
                                );
                            } else {
                                windowobj.addEventListener("mousemove", (event) => {
                                    gspb_trigger_inter_Actions(element, triggerElement, layerData, event, windowobj, documentobj);
                                }, { signal: signal });
                            }
                            break;
                        case "mouse-move-object":
                            triggerElement.addEventListener("mousemove", (event) => {
                                gspb_trigger_inter_Actions(element, triggerElement, layerData, event, windowobj, documentobj);
                            }, { signal: signal });
                            break;
                        case "on-view":
                            let gspb_inview_inter_observe = new IntersectionObserver(entries => {
                                entries.forEach(entry => {
                                    if (entry.isIntersecting) {
                                        gspb_trigger_inter_Actions(element, triggerElement, layerData, entry, windowobj, documentobj);
                                    }
                                });
                            }, observerargs);
                            gspb_inview_inter_observe.observe(triggerElement);
                            break;
                        case "on-leave":
                            let gspb_leaveview_inter_observe = new IntersectionObserver(entries => {
                                entries.forEach(entry => {
                                    if (!entry.isIntersecting) {
                                        gspb_trigger_inter_Actions(element, triggerElement, layerData, entry, windowobj, documentobj);
                                    }
                                });
                            }, observerargs);
                            gspb_leaveview_inter_observe.observe(triggerElement);
                            break;

                        default:
                            break;
                    }
                });
            });
        });
    }
}

if (GSonScrollIEvents.length > 0) {
    let windowobj = GSonScrollIEvents[0].windowobj || window;
    windowobj.addEventListener("scroll", (event) => {
        let scrollY = windowobj.scrollY;
        GSonScrollIEvents.forEach((scrollItem) => {
            if ((scrollItem.type === 'scroll-above' && scrollY < scrollItem.pixelScrollValue) || (scrollItem.type === 'scroll-below' && scrollY >= scrollItem.pixelScrollValue)) {
                gspb_trigger_inter_Actions(scrollItem.element, scrollItem.triggerElement, scrollItem.layerData, event, scrollItem.windowobj, scrollItem.documentobj);
            }
        });
    });
}

if (GSonMouseMoveIEvents.length > 0) {
    let windowobj = GSonMouseMoveIEvents[0].windowobj || window;
    windowobj.addEventListener("mousemove", (event) => {
        GSonMouseMoveIEvents.forEach((moveItem) => {
            gspb_trigger_inter_Actions(moveItem.element, moveItem.triggerElement, moveItem.layerData, event, moveItem.windowobj, moveItem.documentobj);
        });
    });
}

function GSPBDynamicMathPlaceholders(element, event, windowobj, documentobj, value, selector) {
    if (selector) {
        element = selector;
    }else if(element && element.length > 0){
        element = element[0];
    }
    if(typeof value != 'string') return value;
    if (value.indexOf('{{SCROLLVIEW}}') > -1) {
        const rect = element.getBoundingClientRect();
        if (rect.top < windowobj.innerHeight && rect.bottom >= 0) {
            const normalizedscroll = ((windowobj.innerHeight - rect.top) / (windowobj.innerHeight + rect.height)) * 100;
            value = value.replace('{{SCROLLVIEW}}', normalizedscroll);
        } else if (rect.bottom < 0) {
            value = value.replace('{{SCROLLVIEW}}', 100);
        } else {
            value = value.replace('{{SCROLLVIEW}}', 0);
        }
    } 
    if (value.indexOf('{{CLIENT_X}}') > -1) {
        let clientX = event.clientX;
        value = value.replace('{{CLIENT_X}}', clientX);
    } 
    if (value.indexOf('{{VALUE}}') > -1) {
        let inputVal = event?.target?.value;
        if (inputVal) {
            value = value.replace('{{VALUE}}', inputVal);
        }
    } 
    if (value.indexOf('{{ATTR:') > -1) {
        let matches = value.match(/\{{ATTR:(.*?)\}\}/)?.[1];
        if (matches) {
            let attrValue = element.getAttribute(matches);
            value = value.replace('{{ATTR:' + matches + '}}', attrValue);
        }
    } 
    if (value.indexOf('{{RANDOM:') > -1) {
        let matches = value.match(/\{{RANDOM:(.*?)\}\}/)?.[1];
        if (matches) {
            let splitMatches = matches.split('-');
            let min = parseInt(splitMatches[0], 10);
            let max = parseInt(splitMatches[1], 10);
            let randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
            value = value.replace(`{{RANDOM:${matches}}}`, randomValue);
        }
    } 
    if (value.indexOf('{{STORAGE:') > -1) {
        let matches = value.match(/\{{STORAGE:(.*?)\}\}/)?.[1];
        if (matches) {
            let storageValue = localStorage.getItem(matches);
            value = value.replace('{{STORAGE:' + matches + '}}', storageValue);
        }
    } 
    if (value.indexOf('{{COOKIE:') > -1) {
        let matches = value.match(/\{{COOKIE:(.*?)\}\}/)?.[1];
        if (matches) {
            let cookieValue = GSCookClass.getCookie(matches);
            value = value.replace('{{COOKIE:' + matches + '}}', cookieValue);
        }
    } 
    if (value.indexOf('{{STYLE:') > -1) {
        let matches = value.match(/\{{STYLE:(.*?)\}\}/)?.[1];
        if (matches) {
            let computedStyle = window.getComputedStyle(element);
            if (['translateX', 'translateY', 'rotateX', 'rotateY', 'scaleX', 'scaleY', 'translateZ', 'scale', 'rotate'].includes(matches)) {
                const transformValue = computedStyle.getPropertyValue('transform');
                cssValue = GSPBgetTransformValue(transformValue, matches);
            } else {
                cssValue = computedStyle.getPropertyValue(matches);
            }
            value = value.replace('{{STYLE:' + matches + '}}', cssValue);
        }
    } 
    if (value.indexOf('{{CLIENT_Y}}') > -1) {
        let clientY = event.clientY;
        value = value.replace('{{CLIENT_Y}}', clientY);
    } 
    if (value.indexOf('{{CONTENT}}') > -1) {
        let content = element.innerHTML;
        value = value.replace('{{CONTENT}}', content);
    } 
    if (value.indexOf('{{OFFSET_X}}') > -1) {
        let offsetX = event.offsetX;
        value = value.replace('{{OFFSET_X}}', offsetX);
    } 
    if (value.indexOf('{{OFFSET_Y}}') > -1) {
        let offsetY = event.offsetY;
        value = value.replace('{{OFFSET_Y}}', offsetY);
    } 
    if (value.indexOf('{{CLIENT_X_%}}') > -1) {
        let clientX = event.clientX;
        let percentValue = (clientX / windowobj.innerWidth) * 100;
        let clampedValue = Math.min(Math.max(percentValue, 0), 100);
        value = value.replace('{{CLIENT_X_%}}', clampedValue);
    } 
    if (value.indexOf('{{CLIENT_Y_%}}') > -1) {
        let clientY = event.clientY;
        let percentValue = (clientY / windowobj.innerHeight) * 100;
        let clampedValue = Math.min(Math.max(percentValue, 0), 100);
        value = value.replace('{{CLIENT_Y_%}}', clampedValue);
    } 
    if (value.indexOf('{{WIDTH}}') > -1) {
        value = value.replace('{{WIDTH}}', element.offsetWidth);
    } 
    if (value.indexOf('{{HEIGHT}}') > -1) {
        value = value.replace('{{HEIGHT}}', element.offsetHeight);
    } 
    if (value.indexOf('{{OFFSET_LEFT}}') > -1) {
        value = value.replace('{{OFFSET_LEFT}}', element.offsetLeft);
    } 
    if (value.indexOf('{{OFFSET_TOP}}') > -1) {
        value = value.replace('{{OFFSET_TOP}}', element.offsetTop);
    } 
    if (value.indexOf('{{POSITION_TOP}}') > -1) {
        let top = element.getBoundingClientRect().top;
        if(top > windowobj.innerHeight){
            top = windowobj.innerHeight;
        }
        value = value.replace('{{POSITION_TOP}}', top);
    } 
    if (value.indexOf('{{POSITION_LEFT}}') > -1) {
        value = value.replace('{{POSITION_LEFT}}', element.getBoundingClientRect().left);
    }
    return value;
}

function GSPBMathAttributeOperator(element, event, windowobj, documentobj, unit, value, selector, math) {
    if (selector && selector != '.' && selector != '#') {
        selector = documentobj.querySelector(selector.trim());
    }
    value = GSPBDynamicMathPlaceholders(element, event, windowobj, documentobj, value, selector);
    let finalValue = value;
    if (finalValue && math && math.length > 0) {
        math.forEach((mathItem, mathIndex) => {
            let mathValue = mathItem?.value;
            let mathSelector = mathItem?.selector;
            let mathType = mathItem?.type;
            if (mathType && mathValue) {
                if (mathSelector) {
                    mathSelector = mathSelector.trim();
                    if (mathSelector != '.' && mathSelector != '#') {
                        element = documentobj.querySelector(mathSelector);
                    };
                }
                let currentVal = GSPBDynamicMathPlaceholders(element, event, windowobj, documentobj, mathValue, mathSelector);
                currentVal = parseFloat(currentVal);
                finalValue = parseFloat(finalValue);
                if (mathType === 'add') {
                    finalValue = finalValue + currentVal;
                } else if (mathType === 'subtract') {
                    finalValue = finalValue - currentVal;
                } else if (mathType === 'multiply') {
                    finalValue = finalValue * currentVal;
                } else if (mathType === 'divide') {
                    finalValue = finalValue / currentVal;
                } else if (mathType === 'modulo') {
                    finalValue = finalValue % currentVal;
                }
            }
        });

    }
    if (unit) {
        finalValue = finalValue + unit;
    }
    return finalValue;
}
window.GSPBMathAttributeOperator = GSPBMathAttributeOperator;

function gspb_trigger_inter_Actions(element, triggerElement, layerData, event, windowobj = window, documentobj = document) {
    if (!layerData) return;
    let layersActions = layerData?.actions;
    let triggerDelay = layerData?.triggerData?.delay;
    let triggerDelayTime = layerData?.triggerData?.delaytime || 0;
    let triggerActions = layerData?.triggerData;

    if (typeof layersActions === 'undefined') return;
    if (triggerDelay && triggerDelayTime > 0) {
        setTimeout(() => {
            gspb_execute_inter_Actions(element, layersActions, event, windowobj, documentobj, triggerActions);
        }, triggerDelayTime);
    } else {
        gspb_execute_inter_Actions(element, layersActions, event, windowobj, documentobj, triggerActions);
    }
}

function gspb_execute_inter_Actions(triggerElement, layersActions, event, windowobj = window, documentobj = document, triggerActions = {}) {
    if (typeof layersActions === 'undefined') return;
    for (const actionItem of layersActions) {
        const actionName = actionItem?.actionname;
        let actionSelector = actionItem?.selector;
        const conditions = actionItem?.conditions;

        let checkCondition = '';

        let targetEleClass = actionItem?.classname;
        let targetEleAttribute = actionItem?.attr;
        let targetEleAttributeValue = actionItem?.attrValue;
        const targetEleAttributeSelector = actionItem?.attrValueSelector;
        const targetEleAttributecustomMath = actionItem?.customMath;
        let targetEleAttributeUnit = actionItem?.attrUnit;

        let targetElements = [];
        if (actionSelector) {
            let searchIn = documentobj;
            if(actionSelector.includes('{CURRENT}')){
                searchIn = triggerElement;
                actionSelector = actionSelector.replace('{CURRENT}', '');
            }
            actionSelector = actionSelector.trim();
            if (actionSelector == '.' || actionSelector == '#') return;
            if (triggerElement.classList && triggerElement.classList.contains('gspb-buttonbox')) {
                if (!triggerElement.classList.contains('wp-block-greenshift-blocks-buttonbox')) {
                    triggerElement = triggerElement.closest('.wp-block-greenshift-blocks-buttonbox');
                } else {
                    triggerElement = triggerElement.closest('.gspb_button_wrapper');
                }
            }
            if (actionSelector.includes('{CLOSEST')) {
                let matchesClosest = actionSelector.match(/\{CLOSEST:(.*?)\}/)?.[1];
                let matchesSelector = actionSelector.match(/\{SELECTOR_ALL:(.*?)\}/)?.[1];
                if (matchesClosest && matchesSelector) {
                    matchesSelector = matchesSelector.replace('{TRIGGERINDEX}', Array.from(GSfindChildrenWithoutStyle(triggerElement.parentNode)).indexOf(triggerElement));
                    targetElements = Array.from(triggerElement.closest(matchesClosest).querySelectorAll(matchesSelector));
                } else if (matchesClosest) {
                    targetElements = [triggerElement.closest(matchesClosest)];
                }
            } else if (actionSelector == '{CHILDREN}') {
                targetElements = triggerElement.children;
            }  else {
                actionSelector = actionSelector.replace('{TRIGGERINDEX}', (Array.from(GSfindChildrenWithoutStyle(triggerElement.parentNode)).indexOf(triggerElement) + 1));
                targetElements = Array.from(searchIn.querySelectorAll(actionSelector));
            }
        } else {
            targetElements = [triggerElement];
        }

        if (!targetElements.length) {
            return;
        }

        if ((actionName === 'animation') && typeof GSPB_Motion_Action === 'function') {
            let conditionCheck = true;
            targetElements.forEach((targetEle) => {
                if (conditions && conditions.length > 0) {
                    checkCondition = gspb_check_inter_Conditions(targetEle, conditions, event);
                    if (checkCondition === false) {
                        conditionCheck = false;
                    }
                }
            });
            if (conditionCheck) {
                GSPB_Motion_Action(targetElements, triggerElement, actionItem, triggerActions, event, windowobj, documentobj);
            }
        }

        targetElements.forEach((targetEle) => {
            if (conditions && conditions.length > 0) {
                checkCondition = gspb_check_inter_Conditions(targetEle, conditions, event);
                if (checkCondition === false) {
                    return;
                }
            }
            if (actionName === 'attach-class') {
                targetEle.classList.add(targetEleClass);
            }
            else if (actionName === 'slideto') {
                let sliderobj = targetEle.querySelector('.swiper');
                if (sliderobj) {
                    let slideIndex = actionItem?.slideindex.replace('{TRIGGERINDEX}', (Array.from(GSfindChildrenWithoutStyle(triggerElement.parentNode)).indexOf(triggerElement)));
                    if (slideIndex) {
                        sliderobj.swiper.slideTo(slideIndex);
                    }
                }
            }
            else if (actionName === 'slidepause') {
                let sliderobj = targetEle.querySelector('.swiper');
                if (sliderobj) {
                    sliderobj.swiper.pause();
                }
            }
            else if (actionName === 'slideresume') {
                let sliderobj = targetEle.querySelector('.swiper');
                if (sliderobj) {
                    sliderobj.swiper.resume();
                }
            }
            else if (actionName === 'sethtml') {
                targetEle.innerHTML = GSPBMathAttributeOperator(triggerElement, event, windowobj, documentobj, targetEleAttributeUnit, targetEleAttributeValue, targetEleAttributeSelector, targetEleAttributecustomMath);
            }

            else if (actionName === 'video') {
                let videoType = actionItem?.videotype;
                let videoObj = '';
                if (targetEle instanceof HTMLVideoElement) {
                    videoObj = targetEle;
                } else {
                    videoObj = targetEle.querySelector('video');
                }
                if (videoObj) {
                    if (videoType === 'play') {
                        videoObj.play();
                    } else if (videoType === 'pause') {
                        videoObj.pause();
                    } else if (videoType === 'restart') {
                        videoObj.currentTime = 0;
                    } else {
                        videoObj.play();
                    }
                }
            }

            else if (actionName === 'reusable') {
                let reusableID = actionItem?.reusableid;
                if (reusableID && typeof GSEL_ajax_load === 'function') {
                    GSEL_ajax_load(event, reusableID, targetEle);
                }
            }

            else if (actionName === 'rive') {
                let riveInput = actionItem?.riveinput;
                let riveInputAction = actionItem?.riveinputaction;
                if (typeof window[riveInput] != 'undefined') {
                    if (riveInputAction === 'fire') {
                        window[riveInput].fire();
                    } else {
                        let riveInputValue = actionItem?.riveinputvalue;
                        if (riveInputValue) {
                            window[riveInput].value = GSPBMathAttributeOperator(triggerElement, event, windowobj, documentobj, targetEleAttributeUnit, targetEleAttributeValue, targetEleAttributeSelector, targetEleAttributecustomMath);
                        }
                    }
                }
            }

            else if (actionName === 'threed') {
                let appid = actionItem?.appid;
                if (typeof window[appid] == 'object') {
                    window[appid].setVariable(targetEleAttribute, GSPBMathAttributeOperator(triggerElement, event, windowobj, documentobj, targetEleAttributeUnit, targetEleAttributeValue, targetEleAttributeSelector, targetEleAttributecustomMath));
                }
            }

            else if (actionName === 'attach-attribute') {
                targetEle.setAttribute(targetEleAttribute, GSPBMathAttributeOperator(triggerElement, event, windowobj, documentobj, targetEleAttributeUnit, targetEleAttributeValue, targetEleAttributeSelector, targetEleAttributecustomMath));
            }

            else if (actionName === 'set-variable') {
                targetEle.style.setProperty(targetEleAttribute, GSPBMathAttributeOperator(triggerElement, event, windowobj, documentobj, targetEleAttributeUnit, targetEleAttributeValue, targetEleAttributeSelector, targetEleAttributecustomMath));
            }

            else if (actionName === 'toggle-class') {
                targetEle.classList.toggle(targetEleClass);
            }

            else if (actionName === 'remove-class') {
                targetEle.classList.remove(targetEleClass);
            }

            else if (actionName === 'remove-attribute') {
                targetEle.removeAttribute(targetEleAttribute);
            }

            else if (actionName === 'toggle-attribute') {
                targetEle.toggleAttribute(targetEleAttribute);
            }

            else if (actionName === 'save-to-browser-storage') {
                let storageKeyAdd = actionItem.storagekey;
                let storageValAdd = targetEleAttributeValue || actionItem.storagevalue;
                localStorage.setItem(storageKeyAdd, GSPBMathAttributeOperator(triggerElement, event, windowobj, documentobj, targetEleAttributeUnit, storageValAdd, targetEleAttributeSelector, targetEleAttributecustomMath));
            }

            else if (actionName === 'save-to-cookie') {
                let storageKeyAdd = actionItem.storagekey;
                let storageValAdd = targetEleAttributeValue || actionItem.storagevalue;
                let storageValTime = actionItem.storagetime;
                GSCookClass.setCookie(storageKeyAdd, GSPBMathAttributeOperator(triggerElement, event, windowobj, documentobj, targetEleAttributeUnit, storageValAdd, targetEleAttributeSelector, targetEleAttributecustomMath), storageValTime);
            }

            else if (actionName === 'remove-from-browser-storage') {
                let storageKeyRemove = actionItem.storagekey;
                localStorage.removeItem(storageKeyRemove);
            }

            else if (actionName === 'remove-from-cookie') {
                let storageKeyRemove = actionItem.storagekey;
                GSCookClass.removeCookie(storageKeyRemove);
            }

            else if (actionName === 'hide-element') {
                targetEle.style.display = 'none';
            }

            else if (actionName === 'show-element') {
                targetEle.style.display = 'block';
            }

            else if (actionName === 'toggle-element') {
                if (targetEle.style.display === "none") {
                    targetEle.style.display = "block";
                } else {
                    targetEle.style.display = "none";
                }
            }
            else if (actionName === 'lightbox' && typeof openGreenlightbox === 'function') {
                event.preventDefault();
                if (triggerElement != targetEle) {
                    openGreenlightbox(targetEle, triggerElement);
                }else{
                    let lightboxlink = actionItem?.lightboxlink;
                    if(lightboxlink){
                        openGreenlightbox(lightboxlink, triggerElement);
                    }else if(triggerElement.getAttribute('data-lightbox-src')){
                        openGreenlightbox(triggerElement.getAttribute('data-lightbox-src'), triggerElement);
                    }else if(triggerElement.getAttribute('href')){
                        openGreenlightbox(triggerElement.getAttribute('href'), triggerElement);
                    }
                }
            }
        });
    }
}

function gspb_check_inter_Conditions(targetElement, conditions, event) {
    let condtionResult = false;
    conditions && conditions.forEach(condition => {

        const includeOrNot = condition.includeornot;
        const classOrId = condition.classorid;
        const name = condition.additionalclass;
        const value = condition.value;

        const compareTwo = (type, value, compare) => {

            let compareElement = '';
            if (type === 'value') {
                compareElement = event?.target?.name;
            } else if (type === 'storage') {
                compareElement = localStorage.getItem(name);
            } else if (type === 'cookie') {
                compareElement = GSCookClass.getCookie(name);
            }

            if (compare === 'more') {
                return compareElement > parseFloat(value);
            } else if (compare === 'less') {
                return compareElement < parseFloat(value);
            } else if (compare === 'equal') {
                return compareElement == parseFloat(value);
            } else if (compare === 'not-equal') {
                return compareElement != parseFloat(value);
            } else if (compare === 'contains') {
                return compareElement.includes(value);
            } else if (compare === 'not-contains') {
                return !compareElement.includes(value);
            } else if (compare === 'between') {
                let valueBetween = value.split('-');
                return valueBetween && valueBetween.length > 0 && compareElement >= parseFloat(valueBetween[0].trim()) && compareElement <= parseFloat(valueBetween[1].trim());
            }
        }

        if (includeOrNot === 'includes') {
            if (classOrId === 'class' && targetElement.classList.contains(name)) {
                condtionResult = true;
            } else if (classOrId === 'id' && targetElement.id === name) {
                condtionResult = true;
            } else if (classOrId === 'storage' && localStorage.getItem(name)) {
                condtionResult = true;
            } else if (classOrId === 'cookie' && GSCookClass.getCookie(name)) {
                condtionResult = true;
            }

        } else if (includeOrNot === 'not-includes') {
            if (classOrId === 'class' && !targetElement.classList.contains(name)) {
                condtionResult = true;
            } else if (classOrId === 'id' && targetElement.id !== name) {
                condtionResult = true;
            } else if (classOrId === 'storage' && !localStorage.getItem(name)) {
                condtionResult = true;
            } else if (classOrId === 'cookie' && !GSCookClass.getCookie(name)) {
                condtionResult = true;
            }
        } else if (includeOrNot == 'more') {
            condtionResult = compareTwo(classOrId, value, 'more');
        } else if (includeOrNot == 'less') {
            condtionResult = compareTwo(classOrId, value, 'less');
        } else if (includeOrNot == 'equal') {
            condtionResult = compareTwo(classOrId, value, 'equal');
        } else if (includeOrNot == 'not-equal') {
            condtionResult = compareTwo(classOrId, value, 'not-equal');
        } else if (includeOrNot == 'contains') {
            condtionResult = compareTwo(classOrId, value, 'contains');
        } else if (includeOrNot == 'not-contains') {
            condtionResult = compareTwo(classOrId, value, 'not-contains');
        } else if (includeOrNot == 'checked') {
            if (classOrId == 'value') {
                if (event?.target?.checked) {
                    condtionResult = true;
                }
            }
        } else if (includeOrNot == 'not-checked') {
            if (classOrId == 'value') {
                if (!event?.target?.checked) {
                    condtionResult = true;
                }
            }
        } else if (includeOrNot == 'between') {
            condtionResult = compareTwo(classOrId, value, 'between');
        }

    });
    return condtionResult;
}