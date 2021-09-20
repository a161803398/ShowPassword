(function (win) {
  'use strict'
  const KEY_ENTER = 13
  const KEY_CTRL = 17
  let behave = 0
  let wait = 500
  let hasLoadSetting = false

  function mouseOver (tar) {
    tar.addEventListener('mouseover', () => {
      tar.isMouseOver = true
      setTimeout(() => {
        if (tar.isMouseOver) {
          tar.type = 'text'
        }
      }, wait)
    }, false)

    tar.addEventListener('mouseout', () => {
      tar.isMouseOver = false
      tar.type = 'password'
    }, false)

    tar.addEventListener('blur', () => {
      tar.type = 'password'
    }, false)

    tar.addEventListener('keydown', e => {
      if (e.keyCode === KEY_ENTER) {
        tar.type = 'password'
      }
    }, false)
  }

  function mouseDblClick (tar) {
    tar.addEventListener('dblclick', () => {
      if (tar.type === 'password') {
        tar.type = 'text'
      } else {
        tar.type = 'password'
      }
    }, false)

    tar.addEventListener('blur', () => {
      tar.type = 'password'
    }, false)

    tar.addEventListener('keydown', e => {
      if (e.keyCode === KEY_ENTER) {
        tar.type = 'password'
      }
    }, false)
  }

  function mouseFocus (tar) {
    tar.addEventListener('focus', () => {
      tar.type = 'text'
    }, false)

    tar.addEventListener('blur', () => {
      tar.type = 'password'
    }, false)

    tar.addEventListener('keydown', e => {
      if (e.keyCode === KEY_ENTER) {
        tar.type = 'password'
      }
    }, false)
  }

  function ctrlKeyShift (tar) {
    let isHide = true
    let notPressCtrl = true
    let onlyCtrl = true

    tar.addEventListener('blur', () => {
      tar.type = 'password'
      isHide = true
      notPressCtrl = true
      onlyCtrl = true
    }, false)

    tar.addEventListener('keyup', e => {
      if (e.keyCode === KEY_CTRL) {
        if (onlyCtrl) {
          isHide = !isHide
        } else {
          isHide = false
        }

        if (isHide) {
          tar.type = 'password'
        } else {
          tar.type = 'text'
        }
        notPressCtrl = true
        onlyCtrl = true
      }
    }, false)

    tar.addEventListener('keydown', e => {
      if (e.keyCode === KEY_ENTER) {
        tar.type = 'password'
        isHide = true
        notPressCtrl = true
        onlyCtrl = true
      } else if (e.keyCode === KEY_CTRL) {
        if (notPressCtrl) {
          tar.type = 'text'
          notPressCtrl = false
          onlyCtrl = true
        }
      } else {
        onlyCtrl = notPressCtrl
      }
    }, false)
  }

  const actionsArr = [mouseOver, mouseDblClick, mouseFocus, ctrlKeyShift]
  const doc = win.document
  const modified = new WeakSet()

  function modifyInput (target) {
    actionsArr[behave](target)
    modified.add(target)
  }
  function checkAndModify (target) {
    if (!target || modified.has(target)) {
      return
    }
    if (target.tagName === 'INPUT' && target.getAttribute('type') === 'password') {
      modifyInput(target)
    }
    if (target.children) {
      for (const child of target.children) {
        checkAndModify(child)
      }
    }
  }

  function modifyAllInputs () {
    const passwordInputs = doc.querySelectorAll('input[type=password]')
    passwordInputs.forEach(input => {
      if (!modified.has(input)) {
        modifyInput(input)
      }
    })
  }

  function modifyWeb () {
    if (hasLoadSetting) {
      modifyAllInputs()
    } else {
    // loadSetting
      chrome.storage.sync.get(data => {
        if ('behave' in data) {
          behave = data.behave
          wait = data.wait
        }
        modifyAllInputs()
        hasLoadSetting = true
      })
    }
  }

  modifyWeb()

  const docObserver = new MutationObserver(records => {
    records.forEach(record => {
      checkAndModify(record.target)
      if (!record.addedNodes) {
        return
      }
      for (const node of record.addedNodes) {
        checkAndModify(node)
      }
    })
  })

  docObserver.observe(doc.documentElement, {
    childList: true,
    subtree: true,
    // Some website add input with text type at first, then change its type to password.
    attributes: true,
    attributeFilter: ['type']
  })
})(this)
