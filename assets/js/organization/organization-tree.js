import {LitElement, html, css} from 'lit-element'
import organizationSubOrgQuery from "./organization-query"
import OrganizationCache from "./organization-cache"
import client from "../lib/apollo"
import '@vaadin/vaadin-select'
/* NOTE: the organization-tree object has a variable to control logging level
     Go to the constructor near the bottom of this module to set the log level,
     or search for $$log (FIXME: use existing central logging control or factor out to create one)
*/
import _ from "lodash"
class OrganizationTreeListSelector extends LitElement {
  static get properties () {
    return {
      treelistid: {
        type: String,
        value: null
      }
    }
  }
  connectedCallback () {
   super.connectedCallback()
  }
  disconnectedCallback () {
    super.disconnectedCallback()
  }
  contentLoadedCallback () {
    let vm = this
    vm.treeList = document.getElementById(vm.treelistid)
  }
  constructor () {
    super()
    let vm = this
    vm.selected = 'Hierarchy'
    vm.treeList = null
    document.addEventListener('DOMContentLoaded', (event) => {
      vm.contentLoadedCallback(event)
    })
  }
  handleSelection (e) {
    let vm = this
    let selected = e.target.value
    // console.log('selected: ' + selected)
    if (vm.treeList) {
      // console.log('tree-list-id: ' + vm.treelistid)
      if (selected === 'list') {
        this.selected = 'Index'
        // console.log('setting treelist attribute showas to list')
        vm.treeList.setAttribute('showas','list')
      } else {
        this.selected = 'Hierarchy'
        vm.treeList.setAttribute('showas','tree')
        // console.log('setting treelist attribute showas to tree')
      }
    }  else {
      this.selected = 'Hierarchy'
    }
  }
  render () {
    // console.log('treeListId: ' + this.treelistid)
    let vm = this
    //return html`<select @change="${this.handleSelection}"><option value="tree">Hierarchy</option><option value="list">Index</option></input>`
    return html`
      <vaadin-select placeholder="${vm.selected}" value="${vm.selected}" @value-changed="${vm.handleSelection}">
      <template>
        <vaadin-list-box>
          <vaadin-item value="tree">Hierarchy</vaadin-item>
          <vaadin-item value="list">Index</vaadin-item>
        </vaadin-list-box>
      </template>
      </vaadin-select>
    `
  }
}
customElements.define('vivo-organizations-tree-list-selector', OrganizationTreeListSelector)

class OrganizationTree extends LitElement {
  
  // LOG LEVEL - The initial log level is set in the constructor() near the bottom of the module
  
  setLogLevel (level) {
    this.logLevel = level
  }
  
  openedHasChanged (newVal, oldVal) {
    this.logDebug(`openHasChanged from ${oldVal} to ${newVal}`)
    return true
  }
  
  dataHasChanged (newVal, oldVal) {
    let vm = this
    vm.logDebug(`dataHasChanged from ${vm.stringify(oldVal)} to ${vm.stringify(newVal)}`)
    vm.requestUpdate()
  }
  showasHasChanged(newVal, oldVal) {
    let vm = this
    vm.logDebug(`\n\nshowasHasChanged from ${vm.stringify(oldVal)} to ${vm.stringify(newVal)}\n\n`)
    let oldClass = 'showaslist'
    let newClass = 'showastree'
    if (newVal === 'list') {
      oldClass = 'showastree'
      newClass = 'showaslist'
    }
    vm.classList.remove(oldClass)
    vm.classList.add(newClass)
    if (newVal === 'list') {
      vm.logDebug('calling ensureCachePopulated')
      vm.ensureCachePopulated()
        .then(() => {
          vm.requestUpdate()
        })
    } else {
      vm.logDebug('NOT calling ensureCachePopulated')
      vm.requestUpdate()
    }
  }
  static get properties () {
    return {
      id: {
        type: String,
        value: null
      },
      orgid: {
        type: String,
        value: null
      },
      showas: {
        type: String,
        value: null,
        reflect: true,
        hasChanged: this.showasHasChanged
      },
      opened: {
        type: Boolean,
        value: false,
        reflect: true,
        hasChanged: this.openedHasChanged
      },
      graphql: {
        type: Object,
        value: {}
      },
      qldata: {
        type: Object,
        value: {},
        reflect: true,
        hasChanged: this.dataHasChanged
      }
    }
  }

  static get styles () {
    return css`
      :host(.showaslist) {
        display: block;
      }
      :host(.showastree) {
        display: block;
        padding-left: 0.5em;
      }
    `
  }
  
  handleClick (ev) {
    let vm = this
    this.logDebug('click')
    vm.opened = !vm.opened
  }
  getAllOrgData (orgid) {
    let vm = this
    let func = 'getAllOrgData'
    vm.logDebug(func + ' - called - orgid: ' + orgid)
    return new Promise((resolve, reject) => {
      vm.getData(orgid)
        .then((data) => {
          if (data && data.hasSubOrganizations) {
            let promises = []
            data.hasSubOrganizations.forEach((v, idx) => {
              vm.logDebug(func + ' hasSubOrganizations - looking for: ' + v.id)
              promises.push(vm.getAllOrgData(v.id))
            })
            Promise.all(promises)
              .then(() => {
                resolve()
              })
          } else {
            resolve()
          }
        })
        .catch((err) => {
          vm.logError('getAllOrgData - getData error. OrgId: ' + orgId + ' Error: ' + err)
          reject(err)
        })
    })
  }
  ensureCachePopulated () {
    let vm = this
    let func = 'ensureCachePopulated'
    vm.logDebug(func + ' - called')
    return new Promise((resolve, reject) => {
      if (!vm.getCache().isFullyPopulated()) {
        vm.getAllOrgData(vm.orgid)
          .then(() => {
            vm.getCache().setFullyPopulated()
            vm.logDebug(func + ' - resolving after setting fully populated')
            resolve()
          })
          .catch((err) => {
            vm.logError(func + ' - error: ' + err)
            reject(err)
          })
      } else {
        vm.logDebug(func + ' - resolving - already fully populated')
        resolve()
      }
    })
  }
  getData (orgid) {
    let func = 'organizationTree.getData'
    let vm = this
    return new Promise((resolve, reject) => {
      vm.logDebug('graphql object: ')
      vm.logDebug(vm.graphql)
      if (!orgid) {
        orgid = vm.orgid
      }
      vm.logDebug('getData tree query for orgid: ' + orgid)
      let orgData = vm.getCache().getOrg(orgid)
      if (!orgData) {
        client.query({
          query: vm.graphql,
          variables: {
            id: orgid
          }
        })
          .then((resp) => {
            let data = resp.data
            vm.logDebug('data returned by query: ')
            vm.logDebug(data)
            // vm.qldata = data.organization
            vm.logDebug(func + ' - added data to cache for orgid: ' + orgid)
            vm.getCache().putOrg(orgid, data.organization)
            if (vm.logLevelDebug()) {
              vm.getCache().dump()
            }
            resolve(data.organization)
          })
          .catch((error) => {
            vm.logDebug('getData error: ' + error)
            reject(error)
          })
      } else {
        vm.logDebug(func + ' - resolved data from cache for orgid: ' + vm.orgid)
        // vm.qldata = orgData
        resolve(orgData)
      }
    })
  }
  onMutation (mutations, observer) {
    // This pointer is incorrect at this point, can't call logdebug until after
    //   set via mutation.target, but cannot set that until looping through mutations to get one
    //   Possibly could use mutations[0].target if absolutely necessary
    
    // console.log('onMutation')
    // console.log(mutations)
    // console.log(observer)
    for (let mutation of mutations) {
      let vm = mutation.target // the original this of the organization-tree element
      if (mutation.type === 'attributes') {
        if (mutation.attributeName === 'showas') {
          vm.logDebug(mutation.attributeName + ' changed')
          // Call the hasChanged for manually since lit-element does not detect attributes changed
          //  on this element by another element (it seems to only track changes made by this element)
          //  We could obtain the old value from vm.showas, but it's not used by showAsHasChanged
          let newVal = vm.getAttribute('showas')
          vm.showasHasChanged(newVal, '')
        }
      }
    }
  }
  connectedCallback () {
    super.connectedCallback ()
    let vm = this
    vm.logDebug('connectedCallback this: ' + vm)
    vm.logDebug(vm)
    vm.logDebug('vivo-organizations-tree connected')
    vm.observer = new MutationObserver(vm.onMutation)
    vm.observer.observe(vm /* element */, {
      attributes: true,
      childList: false,
      subtree: false
    })
    // if (vm.opened) {
      vm.getData()
        .then((data) => {
          vm.logDebug('getData callback')
          vm.qldata = data
      })
    //}
    vm.logDebug('getData complete')
  }
  
  disconnectedCallback () {
    super.disconnectedCallback ()
    this.logDebug('vivo-organizations-tree disconnected')
  }

  getCache (cache) { // FIXME need a better place for this cache e.g. a top level object TBD
    if (!window.organizationCache) {
      window.organizationCache = new OrganizationCache()
    }
    return window.organizationCache
  }
  
  isObject (obj) {
    return obj instanceof Object && !(Array.isArray(obj))
  }
  
  isArray (obj) {
    return Array.isArray(obj)
  }
  isPrimitive (obj) {
    let rv = !(obj === undefined) && !(obj === null) && !this.isObject(obj) && !this.isArray(obj)
    this.logDebug('isPrimitive of obj: ' + JSON.stringify(obj) + ' is: ' + rv)
    return rv
  }
  stringify (obj) {
    let msg = 'Error converting to string'
    let rv = msg
    try {
      rv = JSON.stringify(obj)
    } catch (err) {
      this.logError(obj)
      this.logError(msg)
    }
    return rv
  }
  getName (obj) {
    this.logDebug('getName: ' + this.stringify(obj))
    return obj.name || obj.label
  }
  getShowAsType () {
    let rv = (this.showas ? this.showas : 'tree')
    this.logDebug('getShowAsType: ' + rv)
    return rv
  }
  getShowAsClass () {
    return (this.getShowAsType() === 'list' ? 'showaslist' : 'showastree')
  }
  render () {
    let vm = this
    try {
      vm.logDebug('tree after graphql: ' + vm.stringify(vm.qldata))
      vm.logDebug('My id(non-root is undefined): ' + vm.id)
      let templates = []
      if (vm.getShowAsType() === 'tree') {
        templates.push(html`<div @click="${vm.handleClick}">${vm.getName(vm.qldata)}</div>`)
        if (vm.opened) {
          if (vm.qldata && !_.isEmpty(vm.qldata)) {
            if (vm.isArray(vm.qldata.hasSubOrganizations)) {
              vm.qldata.hasSubOrganizations.forEach((v, idx) => {
                this.logDebug('tree creating object elem directly for array item: ' + idx + '. ' + vm.stringify(vm.qldata))
                templates.push(html`<vivo-organizations-tree class="${vm.getShowAsClass()}" orgid="${v.id}" orgname="${v.label}" qldata="{}">`)
              })
            } //else {
              // this.logDebug('tree creating ERROR directly. ' + vm.stringify(vm.qldata))
              // templates.push(html`<div>Organization tree - Error: unknown qldata type. Orgid is: ${vm.orgid}</div>`)
            //}
          }
        }
      } else { // show as list
        let sorted = vm.getCache().getAsSortedByNameArray()
        if (vm.logLevelDebug()) {
          console.log(sorted)
        }
        sorted.forEach((v, idx) => {
          templates.push(html`<div orgid="${v[0]}">${v[1].name}</div>`)
        })
      }
      return html`${templates}`
    } catch (err) {
      let msg = 'render: get data error: ' + err
      vm.logError(msg)
      return (html`<div>${msg}</div>`)
    }
  }
  constructor () {
    super ()
    let vm = this
    vm.graphql = organizationSubOrgQuery
    vm.levelTrace = 5
    vm.levelDebug = 4
    vm.levelInfo = 3
    vm.levelWarn = 2
    vm.levelError = 1
    vm.levelNone = 0
    vm.logLevel = vm.levelError // vm.levelDebug // $$Log level setting
  }
  logLevelTrace () {
    return this.logLevel >= this.levelTrace
  }
  logLevelDebug () {
    return this.logLevel >= this.levelDebug
  }
  logLevelInfo () {
    return this.logLevel >= this.levelInfo
  }
  logLevelWarn () {
    return this.logLevel >= this.levelWarn
  }
  logLevelError () {
    return this.logLevel >= this.levelError
  }
  
  logTrace(msg) {
    if (this.logLevelTrace()) {
      console.log(msg)
    }
  }
  logDebug(msg) {
    if (this.logLevelDebug()) {
      console.log(msg)
    }
  }
  logInfo(msg) {
    if (this.logLevelInfo()) {
      console.log(msg)
    }
  }
  logWarn(msg) {
    if (this.logLevelWarn()) {
      console.log(msg)
    }
  }
  logError(msg) {
    if (this.logLevelError()) {
      console.trace(msg)
    }
  }
  
  
}
customElements.define('vivo-organizations-tree', OrganizationTree)
