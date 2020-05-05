
export default class OrganizationCache {
  constructor() {
    this.cache = {} // { 'org1/org2/org3' : {org data}, ... }
    this.fFullyPopulated = false
  }
  
  isFullyPopulated() {
    return this.fFullyPopulated
  }
  
  setFullyPopulated() {
    this.fFullyPopulated = true
  }
  
  resetFullyPopulated() {
    this.fFullyPopulated = false
  }
  
  clear () {
    this.cache = {}
  }
  dump () {
    try {
      console.log(JSON.stringify(this.cache))
    } catch (err) {
      console.log('Error dumping cache: ' + err)
    }
  }
  getAsSortedByNameArray () {
    let vm = this
    let sorted = []
    for (let [k, v] of Object.entries(vm.cache)) {
      sorted.push([k, v])
    }
    return sorted.sort((a, b) => a[1].name >= b[1].name)
  }
  
  getOrg (idStr) {
    // Returns undefined for an undefined key
    return this.cache[idStr]
  }
  
  putOrg (idStr, data) {
    this.cache[idStr] = data
  }
  
}
