/*
 * Copyright (C) 2014 yuSing.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301  USA
 */

const KEY_ENTER = 13
let selectBehave, inputWait

function setLocalText (name) {
  document.getElementById(name).innerHTML = chrome.i18n.getMessage(name)
}

function localization () {
  const localTexts = ['optionTitle', 'labelWhen', 'optMouseOver', 'optDblClick', 'optFocus', 'optCtrl', 'labelWait', 'labelPreview']
  localTexts.forEach(setLocalText)
}

function loadSetting () {
  chrome.storage.sync.get(data => {
    if ('behave' in data) {
      selectBehave.selectedIndex = data.behave
      inputWait.value = data.wait
      if (selectBehave.selectedIndex !== 0) {
        document.getElementById('divWait').style.display = 'none'
      }
    }
  })
}

function saveSetting () {
  chrome.storage.sync.set({
    behave: selectBehave.selectedIndex,
    wait: inputWait.value
  })
  window.location.reload()
}

document.addEventListener('DOMContentLoaded', () => {
  selectBehave = document.getElementById('selectBehave')
  inputWait = document.getElementById('inputWait')

  selectBehave.addEventListener('change', saveSetting, false)
  inputWait.addEventListener('blur', saveSetting, false)

  document.getElementById('passwordTest').addEventListener('keydown', e => {
    if (e.keyCode === KEY_ENTER) {
      if (document.getElementById('passwordTest').value.toLowerCase() === 'taiwan') {
        window.location = 'http://en.wikipedia.org/wiki/Taiwan'
      } else {
        window.location.reload()
      }
    }
  }, false)

  localization()
  loadSetting()
}, false)
