module.exports = {
  paginPost: function (postBodyData) {
    let currentPage = parseInt(postBodyData['currentPagePost'])
    if (currentPage == undefined || isNaN(currentPage) == true) {
      currentPage = 0
    }
    let numQueryRes = parseInt(postBodyData['numQueryResPost'])
    let offsetPost = currentPage * numQueryRes
  }
}