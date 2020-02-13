const resTblBdy = document.getElementById('resTblBdy')

let tblCells = resTblBdy.getElementsByTagName('td'); //targets all cells in table
let tblRows = resTblBdy.getElementsByTagName('tr'); //targets all rows in table

let itemIDm0d = document.getElementById('itemID')
let deptIDm0d = document.getElementById('deptID')
let deptNamem0d = document.getElementById('deptName')
let recptAliasm0d = document.getElementById('recptAlias')
let brandm0d = document.getElementById('brand')
let itemNamem0d = document.getElementById('itemName')
let sizem0d = document.getElementById('size')
let suggRtlm0d = document.getElementById('suggRtl')
let lastCostm0d = document.getElementById('lastCost')
let basePricem0d = document.getElementById('basePrice')
let autoDiscom0d = document.getElementById('autoDisco')
let discoMultm0d = document.getElementById('discoMult')
let idealMargm0d = document.getElementById('idealMarg')
let weightProfm0d = document.getElementById('weightProf')
let tax1m0d = document.getElementById('tax1')
let tax2m0d = document.getElementById('tax2')
let tax3m0d = document.getElementById('tax3')
let specTndr1m0d = document.getElementById('specTndr1')
let specTndr2m0d = document.getElementById('specTndr2')
let posPromptm0d = document.getElementById('posPrompt')
let locationm0d = document.getElementById('location')
let altIDm0d = document.getElementById('altID')
let altRcptAliasm0d = document.getElementById('altRcptAlias')
let pkgQtym0d = document.getElementById('pkgQty')
let suppUnitIDm0d = document.getElementById('suppUnitID')
let suppIDm0d = document.getElementById('suppID')
let unitm0d = document.getElementById('unit')
let numPkgsm0d = document.getElementById('numPkgs')
let dsdm0d = document.getElementById('dsd')
let csPkMltm0d = document.getElementById('csPkMlt')
let ovrm0d = document.getElementById('ovr')
let categorym0d = document.getElementById('category')
let subCtgrym0d = document.getElementById('subCtgry')
let prodGroupm0d = document.getElementById('prodGroup')
let prodFlagm0d = document.getElementById('prodFlag')
let rbNotem0d = document.getElementById('rbNote')
let ediDefaultm0d = document.getElementById('ediDefault')
let pwrfld7m0d = document.getElementById('pwrfld7')
let tmpGroupm0d = document.getElementById('tmpGroup')
let onhndQtym0d = document.getElementById('onhndQty')
let reorderPtm0d = document.getElementById('reorderPt')
let mclm0d = document.getElementById('mcl')
let reorderQtym0d = document.getElementById('reorderQty')


let inputsArray = [
  itemIDm0d, deptIDm0d, deptNamem0d, recptAliasm0d, brandm0d, itemNamem0d, sizem0d, suggRtlm0d, lastCostm0d, basePricem0d, autoDiscom0d,
  discoMultm0d, idealMargm0d, weightProfm0d, tax1m0d, tax2m0d, tax3m0d, specTndr1m0d, specTndr2m0d, posPromptm0d, locationm0d, altIDm0d,
  altRcptAliasm0d, pkgQtym0d, suppUnitIDm0d, suppIDm0d, unitm0d, numPkgsm0d, dsdm0d, csPkMltm0d, ovrm0d, categorym0d, subCtgrym0d, prodGroupm0d,
  prodFlagm0d, rbNotem0d, ediDefaultm0d, pwrfld7m0d, tmpGroupm0d, onhndQtym0d, reorderPtm0d, mclm0d, reorderQty
]

console.log(`tblCells.length==> ${tblCells.length}`)
console.log(`tblRows.length==> ${tblRows.length}`)

function populateInputsWithClickedRowData() {

  for (let m = 0; m < tblRows.length; m++) {
    tblRows[m].addEventListener('click', function (event) {
      for (let n = 0; n < inputsArray.length; n++) {
        inputsArray[n].value = tblCells[(inputsArray.length * m) + (m + n + 1)].innerHTML
        console.log(`inputsArray[n].value==> ${inputsArray[n].value}`)
      }
    })
  }
}

populateInputsWithClickedRowData()