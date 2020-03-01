module.exports = {
  paginPost: function (postBodyData, paginPostObjData) {
    // paginPostObjDataArr = []
    // paginPostObjData = {}
    currentPage = parseInt(postBodyData['currentPagePost'])
    if (currentPage == undefined || isNaN(currentPage) == true) {
      currentPage = 0
    }
    paginPostObjData['currentPage'] = currentPage
    console.log(`currentPage from paginPost==> ${currentPage}`)
    numQueryRes = parseInt(postBodyData['numQueryResPost'])
    paginPostObjData['numQueryRes'] = numQueryRes
    console.log(`numQueryRes from paginPost==> ${numQueryRes}`)
    offsetPost = currentPage * numQueryRes
    paginPostObjData['offsetPost'] = offsetPost
    console.log(`JSON.stringify(paginPostObjData) from paginPost==> ${JSON.stringify(paginPostObjData)}`)
    // paginPostObjDataArr.push(paginPostObjData)
  }
}