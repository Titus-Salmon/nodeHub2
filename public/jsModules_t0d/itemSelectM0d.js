const resTblBdy = document.getElementById('resTblBdy')

let tblCells = resTblBdy.getElementsByTagName('td'); //targets all cells in table
let tblRows = resTblBdy.getElementsByTagName('tr'); //targets all rows in table

let itemIDm0d = document.getElementById('itemID')
let suppUnitIDm0d = document.getElementById('suppUnitID')

console.log(`tblCells.length==> ${tblCells.length}`)
console.log(`tblRows.length==> ${tblRows.length}`)

for (let i = 0; i < tblRows.length; i++) {
  console.log(`tblRows[${i}].innerHTML==> ${tblRows[i].innerHTML}`)
  tblRows[i].addEventListener('click', function (event) {
    console.log(`tblRows[${i}].innerHTML==> ${tblRows[i].innerHTML}`)
    console.log(`tblCells[2*(${i}) + (${i}+0)].innerHTML==> ${tblCells[2*(i) + (i+0)].innerHTML}`)
    console.log(`tblCells[2*(${i}) + (${i}+1)].innerHTML==> ${tblCells[2*(i) + (i+1)].innerHTML}`)
    console.log(`tblCells[2*(${i}) + (${i}+2)].innerHTML==> ${tblCells[2*(i) + (i+2)].innerHTML}`)
    itemIDm0d.value = tblCells[2 * (i) + (i + 1)].innerHTML
    suppUnitIDm0d.value = tblCells[2 * (i) + (i + 2)].innerHTML
    // for (let j = 0; j < tblCells.length; j++) {
    //   console.log(`tblCells[${j}].innerHTML==> ${tblCells[j].innerHTML}`)
    // }
  })
}

// for (let i = 0; i < tblCells.length; i++) {
//   console.log(`tblCells[${i}].innerHTML==> ${tblCells[i].innerHTML}`)
//   tblCells[i].addEventListener('click', function (event) {
//     console.log(`tblCells[${i}].innerHTML==> ${tblCells[i].innerHTML}`)
//     // itemIDm0d.value = tblRows[i]
//   })
// }