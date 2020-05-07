const ResTblBdy = document.getElementById("resTblBdy")

function highlight_row() {
  let cells = ResTblBdy.getElementsByTagName('td'); //targets all cells in table
  let rows = ResTblBdy.getElementsByTagName('tr'); //targets all rows in table
  console.log('cells.length==>', cells.length)
  console.log('rows.length==>', rows.length)

  for (let i = 0; i < cells.length; i++) { //loop through all table cells
    // Take each cells
    console.log('cells[' + i + ']', cells[i])
    //let cells = cells[i];
    console.log('cells[' + i + '][' + i + ']', cells[i][i])
    //console.log('cells[' + i + '].innerHTML', cells[i].innerHTML)
    console.log('cells[i].parentNode==>', cells[i].parentNode)
    console.log('cells[i].parentNode.childNodes==>', cells[i].parentNode.childNodes)
    console.log('cells[i].parentNode.childNodes[0].innerHTML==>', cells[i].parentNode.childNodes[0].innerHTML)
  }
}
if (ResTblBdy) {
  highlight_row()
}