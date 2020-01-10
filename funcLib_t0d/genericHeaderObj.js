module.exports = {
  // //v//handle skuMismatchFlagOption////////////////////////////////////////////////////////////////////////////////
  skuMismatchFlagOptionHandler: function skuMismatchFlagOptionHandler() { //Flag SKU mismatch & leave SKU blank for IMW if skuMismatchFlagOption = "yes"
    if (nejRows[i][genericHeaderObj.cpltSKUHeader] !== nejRows[i][genericHeaderObj.ediSKUHeader]) {
      if (skuMismatchOption == "yes") {
        console.log(`skuMismatchOption==> ${skuMismatchOption}`)
        srcRsObj['imwSKU'] = reviewObj['imwSKU'] = ""
        srcRsObj['pf4'] = reviewObj['pf4'] = "skuMismatch"
        console.log(`nejRows[${i}][genericHeaderObj.cpltSKUHeader]==> ${nejRows[i][genericHeaderObj.cpltSKUHeader]}`)
        console.log(`nejRows[${i}][genericHeaderObj.ediSKUHeader]==> ${nejRows[i][genericHeaderObj.ediSKUHeader]}`)
        console.log(`srcRsObj['imwSKU']==> ${srcRsObj['imwSKU']}`)
        console.log(`srcRsObj['pf4']==> ${srcRsObj['pf4']}`)
      }
    }
  }
  // //v//handle skuMismatchFlagOption////////////////////////////////////////////////////////////////////////////////
}