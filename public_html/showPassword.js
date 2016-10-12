(function(win){
    'use strict';
	var KEY_ENTER = 13;
    var KEY_CTRL = 17;
    var behave = 0, wait = 500;
	var hasLoadSetting = false;
	
    function mouseOver(tar) {
        tar.addEventListener('mouseover', function() {
            tar.isMouseOver = true;
            setTimeout(function() {
                if (tar.isMouseOver) {
                    tar.type = 'text';
                }
            }, wait);
        }, false);

        tar.addEventListener('mouseout', function() {
            tar.isMouseOver = false;
            tar.type = 'password';
        }, false);

    }

    function mouseDblClick(tar) {
        tar.addEventListener('dblclick', function() {
            if (tar.type === 'password') {
                tar.type = 'text';
            } else {
                tar.type = 'password';
            }
        }, false);

        tar.addEventListener('blur', function() {
            tar.type = 'password';
        }, false);

        tar.addEventListener('keydown', function(e) {
            if (e.keyCode === KEY_ENTER)
                tar.type = 'password';
        }, false);

    }

    function mouseFocus(tar) {
        tar.addEventListener('focus', function() {
            tar.type = 'text';
        }, false);

        tar.addEventListener('blur', function() {
            tar.type = 'password';
        }, false);

        tar.addEventListener('keydown', function(e) {
            if (e.keyCode === KEY_ENTER)
                tar.type = 'password';
        }, false);
    }

    function ctrlKeyShift(tar) {
        var isHide = true;
        var notPressCtrl = true;
        var onlyCtrl = true;

        tar.addEventListener('blur', function() {
            tar.type = 'password';
            isHide = true;
            notPressCtrl = true;
            onlyCtrl = true;
        }, false);

        tar.addEventListener('keyup', function(e) {
            if (e.keyCode === KEY_CTRL) {
                if (onlyCtrl) {
                    isHide = !isHide;
                } else {
                    isHide = false;
                }

                if (isHide) {
                    tar.type = 'password';
                } else {
                    tar.type = 'text';
                }
                notPressCtrl = true;
                onlyCtrl = true;
            }
        }, false);


        tar.addEventListener('keydown', function(e) {
            if (e.keyCode === KEY_ENTER) {
                tar.type = 'password';
                isHide = true;
                notPressCtrl = true;
                onlyCtrl = true;
            } else if (e.keyCode === KEY_CTRL) {
                if (notPressCtrl) {
                    tar.type = 'text';
                    notPressCtrl = false;
                    onlyCtrl = true;
                }
            } else {
                onlyCtrl = notPressCtrl;
            }

        }, false);
    }
	
	var actionsArr = [mouseOver, mouseDblClick, mouseFocus, ctrlKeyShift];
	
    var doc = win.document;
	var MutationObserver = win.MutationObserver || win.WebKitMutationObserver;
	
	function modifyInputs(){
		var passwordInputs = doc.querySelectorAll('input[type=password]');
		for(var j = 0; j < passwordInputs.length; j++){
			var passwordInput = passwordInputs[j];

			if(!passwordInput.ready){
				actionsArr[behave](passwordInput);
				passwordInput.ready = true; //mark as modified
			}
		}			
	}
	
	function modifyWeb(){
		if(hasLoadSetting){
			modifyInputs();
		}else{
			 //loadSetting
			chrome.storage.sync.get(function(data) {
				if (data.hasOwnProperty('behave')) {
					behave = data.behave;
					wait = data.wait;
				}
				modifyInputs();
				hasLoadSetting = true;
			});
		}
	}
	
	modifyWeb();
	
	var observer = new MutationObserver(modifyWeb);
	
	observer.observe(doc.documentElement, {
		childList: true,
		subtree: true
	});	

	
})(this);



