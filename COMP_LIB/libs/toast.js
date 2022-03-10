let TOAST = {
    toastsContainer : document.querySelector('.toasts-container'),
    
    display: (msg, seconds, options = {}) => {
        return new Promise((resolve, reject)=>{
            let toast = TOAST.factory({
                message: msg,
                state: options.state,
                icon: options.icon ? options.icon : null,
                action: typeof options.action == 'string' ? options.action : false,
                cancel: typeof options.cancel == 'string' ? options.cancel : false,
                class: options.class,
                closable: options.closable ? true : false,
            });
            console.log("** GENERATED TOAST -- ", toast);
            if(options.container){
                let container = options.container instanceof HTMLElement ? options.container : document.querySelector(options.container);
                if(container){
                    container.style.position = "relative";
                    let customContainer = container.querySelector('.custom-toast-container');
                    if(!customContainer){
                        customContainer = document.createElement('div');
                        customContainer.classList.add('custom-toast-container');
                        container.append(customContainer);
                    }
                    customContainer.prepend(toast.toastWrapper);
                } else {
                    console.log("container not found");
                }
            } else { 
                TOAST.toastsContainer.prepend(toast.toastWrapper);
            }
            if (options.action){
                toast.actionBtn.addEventListener('click', ()=>{
                    TOAST.closeToast(toast.toastWrapper);
                    resolve();
                })
            }
            if (options.cancel){
                toast.cancelBtn.addEventListener('click', ()=>{
                    TOAST.closeToast(toast.toastWrapper);
                    reject();
                })
            }
            if (options.closable){
                toast.closeBtn.addEventListener('click', ()=>{
                    TOAST.closeToast(toast.toastWrapper);
                })
            }
            setTimeout(()=>{
                toast.toastWrapper.classList.add('active');
            })
            if(seconds != 'infinit'){
                setTimeout(()=>{
                    TOAST.closeToast(toast.toastWrapper);
                }, seconds && typeof seconds == "number" ? seconds : 5000)
            }
        })
    },

    displayPopup: (participant, seconds = 'infinit', options = {}) => {
        return new Promise((resolve, reject)=>{
            let toast = TOAST.factory({
                action: 'Answer',
                cancel: 'Decline',
                class: 'popup',
                closable: true,
                isPopup: true,
            }, participant)
            console.log("** GENERATED TOAST -- ", toast);
            if(options.container){
                let container = options.container instanceof HTMLElement ? options.container : document.querySelector(options.container);
                if(container){
                    container.style.position = "relative";
                    let customContainer = container.querySelector('.custom-toast-container');
                    if(!customContainer){
                        customContainer = document.createElement('div');
                        customContainer.classList.add('custom-toast-container');
                        container.append(customContainer);
                    }
                    customContainer.prepend(toast.toastWrapper);
                } else {
                    console.log("container not found");
                }
            } else { 
                toastsContainer.prepend(toast.toastWrapper);
            }
            toast.actionBtn.addEventListener('click', ()=>{
                TOAST.closeToast(toast.toastWrapper);
                resolve();
            })
            toast.cancelBtn.addEventListener('click', ()=>{
                TOAST.closeToast(toast.toastWrapper);
                reject();
            })
            toast.closeBtn.addEventListener('click', ()=>{
                TOAST.closeToast(toast.toastWrapper);
            })
            setTimeout(()=>{
                toast.toastWrapper.classList.add('active');
            })
            if(seconds != 'infinit'){
                setTimeout(()=>{
                    TOAST.closeToast(toast.toastWrapper);
                }, seconds && typeof seconds == "number" ? seconds : 5000)
            }
        })
    },

    closeToast: (toastWrapper) => {
        toastWrapper.classList.remove('active');
        setTimeout(()=>{
            toastWrapper.remove();
        }, 250)
    },
    
    factory: (options, popupdata = {}) => {
        let toastWrapper = document.createElement('div');
        toastWrapper.classList.add('toast-wrapper');
        let toastIcon, toastContentWrapper, toastContent, toastAction, toastPopupInfo;
        let actionBtn, cancelBtn, closeBtn;
        if(options.class){
            toastWrapper.classList.add(options.class.split(' '));
        }

        if(options.state){
            toastWrapper.classList.add(options.state)
            if(!options.icon){
                if (options.state == 'success')
                    options.icon = '<span class="material-icons-outlined">done</span>';
                if (options.state == 'warn')
                    options.icon = '<span class="material-icons-outlined">report_problem</span>';
                if (options.state == 'error')
                    options.icon = '<span class="material-icons-outlined">error_outline</span>';
            }
        }
        if(options.icon){
            toastIcon = document.createElement('div');
            toastIcon.classList.add('toast-icon');
            toastIcon.innerHTML = options.icon;
            toastWrapper.append(toastIcon);
        }
        toastContentWrapper = document.createElement('div');
        toastContentWrapper.classList.add('toast-content-wrapper');
        if(options.message){
            toastContent = document.createElement('div');
            toastContent.classList.add('toast-content');
            toastContent.innerHTML = options.message;
        }
        if(options.isPopup){
            toastPopupInfo = document.createElement('div');
            toastPopupInfo.classList.add('toast-call-info');
                let participantImage = document.createElement('img');
                participantImage.src = popupdata.image ? popupdata.image : 'null';
                toastPopupInfo.append(participantImage);
                let participantName = document.createElement('span');
                participantName.classList.add('toast-call-username');
                participantName.innerHTML= popupdata.name ? popupdata.name: 'John Doe';
                toastPopupInfo.append(participantName);
                if(popupdata.status){
                    let statusMsg = document.createElement('small');
                    statusMsg.innerText = popupdata.status;
                    toastPopupInfo.append(statusMsg);
                }
        }
        if(options.action || options.cancel || options.closable){
            toastAction = document.createElement('div');
            toastAction.classList.add('toast-action');
            if(options.action){
                actionBtn = document.createElement('button');
                actionBtn.innerHTML = typeof options.action == 'string' ? options.action : 'Accept';
                actionBtn.classList.add('primary');
                toastAction.append(actionBtn);
            }
            if(options.cancel){
                cancelBtn = document.createElement('button');
                cancelBtn.innerHTML = typeof options.cancel == 'string' ? options.cancel : 'Accept';
                toastAction.append(cancelBtn);
            }
            if(options.closable){
                closeBtn = document.createElement('button');
                closeBtn.classList.add('toast-close');
                closeBtn.innerHTML = '<span class="material-icons">close</span>';
                toastAction.append(closeBtn);
            }
        }

        let cnt = [toastContent, toastPopupInfo, toastAction];
        cnt.forEach(element => {
            if(element){
                toastContentWrapper.append(element);
            }
        });
        toastWrapper.append(toastContentWrapper);

        return {toastWrapper, actionBtn, cancelBtn, closeBtn};
    }
}

