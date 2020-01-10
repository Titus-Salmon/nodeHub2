module.exports = {
  showSearchResults: function showSearchResults(rows) {
    console.log(`rows.length==>${rows.length}`)
    let nejRows = rows[0] //targets 1st query on NEJ table
    let edlpRows = rows[1] //targets 2nd query on rb_edlp_data table
    // let rainbowCatRows = rows[2] //targets 3rd query on rcth (rainbow--cat table hub) table

    console.log(`JSON.stringify(nejRows[0])==> ${JSON.stringify(nejRows[0])}`)
    console.log(`JSON.stringify(edlpRows[0])==> ${JSON.stringify(edlpRows[0])}`)

    for (let i = 0; i < nejRows.length; i++) { //Add searched-for table entries from db to searchResults array, for
      //displaying in the dynamic DOM table. Also add margin data, & retail & charm calcs to display in DOM table
      let srcRsObj = {}
      let reviewObj = {} //push data to this obj for review CSV

      //v//handle skuMismatchFlagOption////////////////////////////////////////////////////////////////////////////////
      function skuMismatchFlagOptionHandler() { //Flag SKU mismatch & leave SKU blank for IMW if skuMismatchFlagOption = "yes"
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
      // skuMismatchFlagOptionHandler()
      //v//handle skuMismatchFlagOption////////////////////////////////////////////////////////////////////////////////

      srcRsObj['invPK'] = reviewObj['invPK'] = nejRows[i]['invPK'] //populate srcRsObj & reviewObj with invPK from Catapult
      srcRsObj['invCPK'] = reviewObj['invCPK'] = nejRows[i]['invCPK'] //populate srcRsObj & reviewObj with invCPK from Catapult

      function divideCostToUOS_Rtl_IMW() {
        if (srcRsObj['edlpVar'] !== 'EDLP') { //we actually don't want to apply ongoing discount (discountToApply) OR edplDisco
          //at the RETAIL level, since we should have already applied it at the WHOLESALE level. VERY IMPORTANT!!!
          var wsDiscoVar = discountToApply
        } else {
          var wsDiscoVar = edlpDisco
        }
        ////v//handle "case" and "each" division//////////////////////////////////////////////////////////////////////////////////
        let oupNameVar = nejRows[i][genericHeaderObj.oupName]
        oupNameSplit = oupNameVar.split(/([0-9]+)/) //should split oupName into array with the digit as the 2nd array element
        if (oupNameSplit[0].toLowerCase().includes('ea') && oupNameSplit[0].toLowerCase() !== 'each' && oupNameSplit[0].toLowerCase() !== 'ea' ||
          oupNameSplit[0].toLowerCase().includes('cs') && oupNameSplit[0].toLowerCase() !== 'case' && oupNameSplit[0].toLowerCase() !== 'cs') {
          if (oupNameSplit[1] !== undefined) {
            reviewObj['ediCostMod'] = srcRsObj['ediCostMod'] = Math.round(((srcRsObj['ediCost'] - srcRsObj['ediCost'] * wsDiscoVar) / oupNameSplit[1]) * 100) / 100 //divide ediCost by oupName parsed value (index 1 = numerical value)
            //AND deduct any vendor discount from ediCost
            reviewObj['lastCost'] = srcRsObj['lastCost'] = Math.round(((srcRsObj['ediCost'] - srcRsObj['ediCost'] * wsDiscoVar) / oupNameSplit[1]) * 100) / 100 //change lastCost to ediCostMod for wholesale IMWs
            //AND deduct any vendor discount from ediCost
            reviewObj['csPkgMltpl'] = srcRsObj['csPkgMltpl'] = oupNameSplit[1] //set csPkgMltpl to numerical portion of oupName
          }
        } else {
          // console.log(`oupNameSplit[0].toLowerCase()==> ${oupNameSplit[0].toLowerCase()}`)
          // console.log(`oupNameVar==> ${oupNameVar}`)
          if (oupNameVar.trim().toLowerCase() == 'each' || oupNameVar.trim().toLowerCase() == 'ea' ||
            oupNameVar.trim().toLowerCase() == 'case' || oupNameVar.trim().toLowerCase() == 'cs') {
            reviewObj['ediCostMod'] = srcRsObj['ediCostMod'] = Math.round(((srcRsObj['ediCost'] - srcRsObj['ediCost'] * wsDiscoVar) / 1) * 100) / 100 //divide ediCost by 1 for items with oupName value of just "each", "ea", "case", or "cs"
            //AND deduct any vendor discount from ediCost
            reviewObj['lastCost'] = srcRsObj['lastCost'] = Math.round(((srcRsObj['ediCost'] - srcRsObj['ediCost'] * wsDiscoVar) / 1) * 100) / 100 //change lastCost to ediCostMod for wholesale IMWs
            //AND deduct any vendor discount from ediCost
            reviewObj['csPkgMltpl'] = srcRsObj['csPkgMltpl'] = 1 //set csPkgMltpl to 1 for just "EA", "EACH", "CS", or "CASE"
          } else {
            reviewObj['ediCostMod'] = srcRsObj['ediCostMod'] = Math.round(((srcRsObj['ediCost'] - srcRsObj['ediCost'] * wsDiscoVar) / oupNameVar) * 100) / 100 //divide ediCost by oupName non-parsed value
            //AND deduct any vendor discount from ediCost
            reviewObj['lastCost'] = srcRsObj['lastCost'] = Math.round(((srcRsObj['ediCost'] - srcRsObj['ediCost'] * wsDiscoVar) / oupNameVar) * 100) / 100 //change lastCost to ediCostMod for wholesale IMWs
            //AND deduct any vendor discount from ediCost
            reviewObj['csPkgMltpl'] = srcRsObj['csPkgMltpl'] = oupNameVar //set csPkgMltpl to oupNameVar (since at this point, oupName should just be a number)
          }
        }
        ////^//handle "case" and "each" division//////////////////////////////////////////////////////////////////////////////////
      }

      function divideCostToUOS_WS_IMW() {
        if (typeOfIMW.toLowerCase() == 'wholesale') {

          if (srcRsObj['edlpVar'] !== 'EDLP') { //we actually don't want to apply ongoing discount (discountToApply) OR edplDisco
            //at the RETAIL level, since we should have already applied it at the WHOLESALE level. VERY IMPORTANT!!!
            var wsDiscoVar = discountToApply
          } else {
            var wsDiscoVar = edlpDisco
          }

          ////v//handle "case" and "each" division//////////////////////////////////////////////////////////////////////////////////
          let oupNameVar = nejRows[i][genericHeaderObj.oupName]
          oupNameSplit = oupNameVar.split(/([0-9]+)/) //should split oupName into array with the digit as the 2nd array element
          if (oupNameSplit[0].toLowerCase().includes('ea') && oupNameSplit[0].toLowerCase() !== 'each' && oupNameSplit[0].toLowerCase() !== 'ea' ||
            oupNameSplit[0].toLowerCase().includes('cs') && oupNameSplit[0].toLowerCase() !== 'case' && oupNameSplit[0].toLowerCase() !== 'cs') {
            if (oupNameSplit[1] !== undefined) {
              let ediTestCost1 = `${(srcRsObj['ediCost'] - srcRsObj['ediCost'] * wsDiscoVar) / oupNameSplit[1]}` //apply vendor WS discount, if applicable
              let ediTstCst1Tr = ediTestCost1.trim().replace(/"/g, '')
              let ediTstCst1TrRnd = Math.round(ediTstCst1Tr * 100) / 100 //converts the result to a number with just 2 decimal places
              let cpltTstCst1Tr = srcRsObj['cpltCost'].trim().replace(/"/g, '')
              let cpltTstCst1TrRnd = Math.round(cpltTstCst1Tr * 100) / 100 //converts the result to a number with just 2 decimal places
              if (ediTstCst1TrRnd !== cpltTstCst1TrRnd) { //only handle items where new edi cat cost not equal to exist. catapult cost
                reviewObj['ediCostMod'] = srcRsObj['ediCostMod'] = Math.round(((srcRsObj['ediCost'] - srcRsObj['ediCost'] * wsDiscoVar) / oupNameSplit[1]) * 100) / 100 //divide ediCost by oupName parsed value (index 1 = numerical value)
                //AND apply wsDiscoVar to cost to account for ongoing discos as well as EDLP discos
                reviewObj['lastCost'] = srcRsObj['lastCost'] = Math.round(((srcRsObj['ediCost'] - srcRsObj['ediCost'] * wsDiscoVar) / oupNameSplit[1]) * 100) / 100 //change lastCost to ediCostMod for wholesale IMWs
                //AND apply wsDiscoVar to cost to account for ongoing discos as well as EDLP discos
                reviewObj['csPkgMltpl'] = srcRsObj['csPkgMltpl'] = oupNameSplit[1] //set csPkgMltpl to numerical portion of oupName
                // console.log(`ediTstCst1TrRnd==> ${ediTstCst1TrRnd}`)
                // console.log(`cpltTstCst1TrRnd==> ${cpltTstCst1TrRnd}`)
                // console.log(`oupNameSplit[1]==> ${oupNameSplit[1]}`)
              } else {
                // srcRsObj['ediCostMod'] = reviewObj['ediCostMod'] = 'test1'
              }

            }
          } else {
            if (oupNameVar.trim().toLowerCase() == 'each' || oupNameVar.trim().toLowerCase() == 'ea' ||
              oupNameVar.trim().toLowerCase() == 'case' || oupNameVar.trim().toLowerCase() == 'cs') {
              let ediTestCost2 = `${(srcRsObj['ediCost'] - srcRsObj['ediCost'] * wsDiscoVar) / 1}` //apply vendor WS discount, if applicable
              let ediTstCst2Tr = ediTestCost2.trim().replace(/"/g, '')
              let ediTstCst2TrRnd = Math.round(ediTstCst2Tr * 100) / 100 //converts the result to a number with just 2 decimal places
              let cpltTstCst2Tr = srcRsObj['cpltCost'].trim().replace(/"/g, '')
              let cpltTstCst2TrRnd = Math.round(cpltTstCst2Tr * 100) / 100 //converts the result to a number with just 2 decimal places
              if (ediTstCst2TrRnd !== cpltTstCst2TrRnd) { //only handle items where new edi cat cost not equal to exist. catapult cost  
                reviewObj['ediCostMod'] = srcRsObj['ediCostMod'] = Math.round(((srcRsObj['ediCost'] - srcRsObj['ediCost'] * wsDiscoVar) / 1) * 100) / 100 //divide ediCost by oupName parsed value (index 1 = numerical value)
                //AND apply wsDiscoVar to cost to account for ongoing discos as well as EDLP discos
                reviewObj['lastCost'] = srcRsObj['lastCost'] = Math.round(((srcRsObj['ediCost'] - srcRsObj['ediCost'] * wsDiscoVar) / 1) * 100) / 100 //change lastCost to ediCostMod for wholesale IMWs
                //AND apply wsDiscoVar to cost to account for ongoing discos as well as EDLP discos
                reviewObj['csPkgMltpl'] = srcRsObj['csPkgMltpl'] = 1 //set csPkgMltpl to 1 for just "EA", "EACH", "CS", or "CASE"
                // console.log(`ediTstCst2TrRnd==> ${ediTstCst2TrRnd}`)
                // console.log(`cpltTstCst2TrRnd==> ${cpltTstCst2TrRnd}`)
              } else {
                // srcRsObj['ediCostMod'] = reviewObj['ediCostMod'] = 'test2'
              }
            } //divide ediCost by 1 for items with oupName value of just "each", "ea", "case", or "cs"
            else {
              let ediTestCost3 = `${(srcRsObj['ediCost'] - srcRsObj['ediCost'] * wsDiscoVar) / oupNameVar}` //apply vendor WS discount, if applicable
              let ediTestCost3Tr = ediTestCost3.trim().replace(/"/g, '')
              let ediTestCost3TrRnd = Math.round(ediTestCost3Tr * 100) / 100 //converts the result to a number with just 2 decimal places
              let cpltTstCst3Tr = srcRsObj['cpltCost'].trim().replace(/"/g, '')
              let cpltTstCst3TrRnd = Math.round(cpltTstCst3Tr * 100) / 100 //converts the result to a number with just 2 decimal places
              if (ediTestCost3TrRnd !== cpltTstCst3TrRnd) { //only handle items where new edi cat cost not equal to exist. catapult cost
                reviewObj['ediCostMod'] = srcRsObj['ediCostMod'] = Math.round(((srcRsObj['ediCost'] - srcRsObj['ediCost'] * wsDiscoVar) / oupNameVar) * 100) / 100 //divide ediCost by oupName non-parsed value
                //AND apply wsDiscoVar to cost to account for ongoing discos as well as EDLP discos
                reviewObj['lastCost'] = srcRsObj['lastCost'] = Math.round(((srcRsObj['ediCost'] - srcRsObj['ediCost'] * wsDiscoVar) / oupNameVar) * 100) / 100 //change lastCost to ediCostMod for wholesale IMWs
                //AND apply wsDiscoVar to cost to account for ongoing discos as well as EDLP discos
                reviewObj['csPkgMltpl'] = srcRsObj['csPkgMltpl'] = oupNameVar //set csPkgMltpl to oupNameVar (since at this point, oupName should just be a number)
                // console.log(`ediTstCst3TrRnd==> ${ediTstCst3TrRnd}`)
                // console.log(`cpltTstCst3TrRnd==> ${cpltTstCst3TrRnd}`)
              } else {
                // srcRsObj['ediCostMod'] = reviewObj['ediCostMod'] = 'test3'
              }
            }
          }
          ////^//handle "case" and "each" division//////////////////////////////////////////////////////////////////////////////////
          //}
        }

      }

      function calcCharm(departmentMargin, lowerCutRqdRtl, lowerCutoffCharm1, lowerCutoffCharm2, lowerCutoffCharm3, lowerCutoffCharm4,
        lowerCutoffCharm5, lowerCutoffCharm6, lowerCutoffCharm7, upperCharmRqdRtl, defaultCharm1, defaultCharm2, defaultCharm3, defaultCharm4) {

        if (typeOfIMW.toLowerCase() == 'retail') {
          //apply DEPARTMENT margin to calculate charm pricing

          if (srcRsObj['ediCost'] > 0) {

            divideCostToUOS_Rtl_IMW()

            srcRsObj['reqdRetail'] = reviewObj['reqdRetail'] = Math.round((-(srcRsObj['ediCostMod']) / (departmentMargin - 1)) * 100) / 100 //applies margin to WS
            //v//ACTUALLY, IT APPEARS WE DO NOT want to apply ongoing discount (discountToApply) OR edplDisco at the RETAIL level/////////////////////
            // if (srcRsObj['edlpVar'] !== 'EDLP') { //we actually DO want to apply ongoing discount (discountToApply) OR edplDisco
            //   //at the RETAIL level, since even though we should have already applied it at the WHOLESALE level, we are using
            //   //cost from the EDI Vendor catalog (which has not yet had the disco applied) to calc updated retail VERY IMPORTANT!!!
            //   srcRsObj['reqdRetail'] = reviewObj['reqdRetail'] = Math.round((-(srcRsObj['ediCostMod'] - srcRsObj['ediCostMod'] * discountToApply) / (departmentMargin - 1)) * 100) / 100
            //   //applies margin to WS for NON-EDLP
            // } else {
            //   srcRsObj['reqdRetail'] = reviewObj['reqdRetail'] = Math.round((-(srcRsObj['ediCostMod'] - srcRsObj['ediCostMod'] * edlpDisco) / (departmentMargin - 1)) * 100) / 100 //applies margin to WS
            //   //applies margin to WS for EDLP
            // }
            //^//ACTUALLY, IT APPEARS WE DO NOT want to apply ongoing discount (discountToApply) OR edplDisco at the RETAIL level/////////////////////
            // srcRsObj['reqdRetail'] = reviewObj['reqdRetail'] = Math.round((-(srcRsObj['ediCostMod'] - srcRsObj['ediCostMod'] * discountToApply) / (departmentMargin - 1)) * 100) / 100 //applies margin to WS
            //AND also applies any % discount; discountToApply is set at default 0
            //Finally, Math.round(number*100)/100 converts the result to a number with just 2 decimal places.
            if (srcRsObj['reqdRetail'] % 1 < .10 && srcRsObj['reqdRetail'] > 0) { //change charm price to (#-1).99 if req'd rtl is #.00 -> #.10
              dbl0Or10CharmResult = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 - .01
              // reviewObj['charm'] = srcRsObj['charm'] = '"' + dbl0Or10CharmResult + '"'
              reviewObj['charm'] = srcRsObj['charm'] = dbl0Or10CharmResult
              return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm']
            } else {
              if (srcRsObj['reqdRetail'] > 0) {
                if (srcRsObj['reqdRetail'] < lowerCutRqdRtl) { //if req'd rtl is below lower cutoff
                  if ((srcRsObj['reqdRetail'] % 1) < .20) {
                    if (lowerCutoffCharm1 > 0) {
                      return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + lowerCutoffCharm1
                    } else {
                      return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + lowerCutoffCharm2
                    }
                  }
                  if ((srcRsObj['reqdRetail'] % 1) < .30) {
                    if (lowerCutoffCharm2 > 0) {
                      return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + lowerCutoffCharm2
                    } else {
                      return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + lowerCutoffCharm3
                    }
                  }
                  if ((srcRsObj['reqdRetail'] % 1) < .40) {
                    if (lowerCutoffCharm3 > 0) {
                      return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + lowerCutoffCharm3
                    } else {
                      return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + lowerCutoffCharm4
                    }
                  }
                  if ((srcRsObj['reqdRetail'] % 1) < .50) {
                    if (lowerCutoffCharm4 > 0) {
                      return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + lowerCutoffCharm4
                    } else {
                      return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + lowerCutoffCharm5
                    }
                  }
                  if ((srcRsObj['reqdRetail'] % 1) < .60) {
                    if (lowerCutoffCharm5 > 0) {
                      return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + lowerCutoffCharm5
                    } else {
                      return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + lowerCutoffCharm6
                    }
                  }
                  if ((srcRsObj['reqdRetail'] % 1) < .80) {
                    if (lowerCutoffCharm6 > 0) {
                      return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + lowerCutoffCharm6
                    } else {
                      return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + lowerCutoffCharm7
                    }
                  }
                  if ((srcRsObj['reqdRetail'] % 1) > .80) {
                    if (lowerCutoffCharm7 > 0) {
                      return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + lowerCutoffCharm7
                    } else {
                      return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail']
                    }
                  }
                } else {
                  if (srcRsObj['reqdRetail'] < upperCharmRqdRtl) { //if req'd rtl is below upper charm cutoff ($12 for Brad & $9999 for Andrea)
                    if ((srcRsObj['reqdRetail'] % 1) <= .35) { //bump anything from #.10 to #.35 ==> #.29
                      if (defaultCharm1 > 0) {
                        return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + defaultCharm1
                      } else {
                        return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + defaultCharm2
                      }
                    }
                    if ((srcRsObj['reqdRetail'] % 1) <= .55) { //bump anything from #.36 to #.55 ==> #.49
                      if (defaultCharm2 > 0) {
                        return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + defaultCharm2
                      } else {
                        return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + defaultCharm3
                      }
                    }
                    if (srcRsObj['reqdRetail'] % 1 <= .855) { //bump anything from #.56 to #.85 ==> #.79 (Brad); Andrea gets bumped
                      //to #.99 for anything from #.56 to #.85 (because defaultCharm3 for Brad is .79, but for Andrea it is .99)
                      if (defaultCharm3 > 0) {
                        return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + defaultCharm3
                      } else {
                        return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + defaultCharm4
                      }
                    }
                    if (srcRsObj['reqdRetail'] % 1 > .856) { //bump anything from #.85+ and higher ==> #.99
                      if (lowerCutoffCharm4 > 0) {
                        return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + defaultCharm4
                      }
                    }
                  } else {
                    return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + defaultCharm4
                  }
                }
              }
            }
          } else {
            srcRsObj['reqdRetail'] = ""
            srcRsObj['charm'] = ""
          }
        }
      }

      function revealAppliedMarg(departmentMargin) {
        srcRsObj['appldMrgn'] = reviewObj['appldMrgn'] = departmentMargin * 100
      }

      srcRsObj['ri_t0d'] = nejRows[i][genericHeaderObj.primarykeyHeader] //for every row returned from sql query of NEJ table,
      //populate search results onject (srcRsObj) with corresponding primary key mapped to a key of 'ri_t0d' 
      srcRsObj['upc'] = nejRows[i][genericHeaderObj.upcHeader] //Item ID
      // console.log('calcResults says: srcRsObj[\'upc\']~~~>', srcRsObj['upc'])
      reviewObj['upc'] = nejRows[i][genericHeaderObj.upcHeader] //Item ID


      //v//EDLP HANDLER///////////////////////////////////////////////////////////////////////////////////////
      for (let j = 0; j < edlpRows.length; j++) {
        srcRsObj['edlpUPC'] = edlpRows[j]['edlp_upc']
        reviewObj['edlpUPC'] = edlpRows[j]['edlp_upc'] //INCLUDE in save2CSVreview export data

        if (srcRsObj['upc'] == srcRsObj['edlpUPC']) {
          srcRsObj['edlpVar'] = "EDLP"
          reviewObj['edlpVar'] = "EDLP"
        }
      }
      //^//EDLP HANDLER///////////////////////////////////////////////////////////////////////////////////////

      srcRsObj['cpltCost'] = reviewObj['cpltCost'] = nejRows[i][genericHeaderObj.invLastcostHeader]

      srcRsObj['deptID'] = "" //Department ID
      srcRsObj['deptName'] = "" //Department Name
      srcRsObj['rcptAlias'] = "" //Receipt Alias
      srcRsObj['brand'] = "" //Brand

      if (typeOfIMW.toLowerCase() == 'new') {
        if (nejRows[i][genericHeaderObj.nameHeader].includes(',')) { //remove any commas from item names, so csv isn't horked
          var cleanedName = nejRows[i][genericHeaderObj.nameHeader].replace(',', '')
          srcRsObj['itemName'] = cleanedName
        } else {
          srcRsObj['itemName'] = nejRows[i][genericHeaderObj.nameHeader]
        }
      } else {
        srcRsObj['itemName'] = "" //Item Name
      }

      srcRsObj['size'] = "" //Size
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //v//20191122 moved SUGGESTED RETAIL to pf8 & now populating the IMW sugstdRtl column with RB charm price
      // srcRsObj['sugstdRtl'] = nejRows[i][genericHeaderObj.msrpHeader] //Suggested Retail
      //TODO: May need to change this to srcRsObj['sugstdRtl'] = srcRsObj['charm'] (will have to declare it in calcCharm() function,
      //where you are actually calculating srcRsObj['charm']. I don't think this is a good idea AT ALL, especially given the fact
      //that Catapult specifically defines suggested retail as MSRP, so the way you're currently doing it is the correct way.
      //For now, if it is an issue with Tom, just manually change sugstdRtl column to be same as charm column)
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      // srcRsObj['charm'] = "" //Base Price ==>INCLUDE in save2CSVreview export data
      srcRsObj['autoDiscount'] = "" //Auto Discount

      // srcRsObj['idealMarg'] = "" //Ideal Margin
      srcRsObj['idealMarg'] = nejRows[i][genericHeaderObj.sibIdealMarginHeader] //set idealMarg to what it actually is in Catapult

      srcRsObj['wtPrfl'] = "" //Weight Profile
      srcRsObj['tax1'] = "" //Tax1
      srcRsObj['tax2'] = "" //Tax2
      srcRsObj['tax3'] = "" //Tax3
      srcRsObj['spclTndr1'] = "" //Special Tender 1
      srcRsObj['spclTndr2'] = "" //Special Tender 2
      srcRsObj['posPrmpt'] = "" //POS Prompt
      srcRsObj['lctn'] = "" //Location
      srcRsObj['altID'] = "" //Alternate ID
      srcRsObj['altRcptAlias'] = "" //Alternate Receipt Alias
      srcRsObj['pkgQnt'] = "" //Package Quantity
      srcRsObj['cpltSKU'] = nejRows[i][genericHeaderObj.cpltSKUHeader] //Supplier Unit ID
      reviewObj['cpltSKU'] = nejRows[i][genericHeaderObj.cpltSKUHeader] //Supplier Unit ID
      srcRsObj['ediSKU'] = nejRows[i][genericHeaderObj.ediSKUHeader] //Supplier Unit ID
      reviewObj['ediSKU'] = nejRows[i][genericHeaderObj.ediSKUHeader] //Supplier Unit ID

      if (skuToggle.toLowerCase() == 'edi') { //provide option to choose which SKU (EDI vs Catapult) to populate IMW with
        srcRsObj['imwSKU'] = reviewObj['imwSKU'] = srcRsObj['ediSKU']
      } else {
        srcRsObj['imwSKU'] = reviewObj['imwSKU'] = srcRsObj['cpltSKU']
      }

      if (reviewObj['ediSKU'] !== reviewObj['cpltSKU']) {
        srcRsObj['skuMismatch'] = reviewObj['skuMismatch'] = reviewObj['upc']
      } else {
        srcRsObj['skuMismatch'] = reviewObj['skuMismatch'] = ''
      }

      srcRsObj['splrID'] = nejRows[i][genericHeaderObj.rbSupplierHeader] //Supplier ID (EDI-VENDORNAME)
      srcRsObj['unit'] = "" //Unit

      srcRsObj['oupName'] = nejRows[i][genericHeaderObj.oupName] //oupName from catapult
      reviewObj['oupName'] = nejRows[i][genericHeaderObj.oupName] //oupName from catapult

      srcRsObj['stoName'] = nejRows[i][genericHeaderObj.stoName] //stoName from catapult
      reviewObj['stoName'] = nejRows[i][genericHeaderObj.stoName] //stoName from catapult

      // srcRsObj['numPkgs'] = "" //Number of Packages

      srcRsObj['numPkgs'] = reviewObj['numPkgs'] = 1 //set numPkgs (for IMW) to 1 FOR EVERYTHING (CRITICAL)

      srcRsObj['pf1'] = "" //Power Field 1 (today's date) - no, Tom says this should be pf5
      srcRsObj['pf2'] = "" //Power Field 2 (Supplier ID (EDI-VENDORNAME) again, for some reason)
      reviewObj['pf2'] = "" //Power Field 2 (Supplier ID (EDI-VENDORNAME) again, for some reason)
      srcRsObj['pf3'] = "" //Power Field 3 try to get department margin
      // reviewObj['pf3'] = //Power Field 3 revealAppliedMarg()
      srcRsObj['pf4'] = "" //Power Field 4
      //v//provide different update messages, based on what type of update you're doing (i.e. ws IMW, retail IMW, new item IMW)
      if (typeOfIMW.toLowerCase() == 'wholesale') {
        srcRsObj['pf5'] = new Date().toISOString().split('T', 1)[0] + " WS UPDT (pf5)" //Power Field 5 - today's date
        srcRsObj['pf8'] = "" //Power Field 8
      }
      if (typeOfIMW.toLowerCase() == 'retail') {
        srcRsObj['pf5'] = new Date().toISOString().split('T', 1)[0] + " RTL UPDT (pf5)" //Power Field 5 - today's date
        srcRsObj['pf8'] = `ACTUAL MSRP: ${nejRows[i][genericHeaderObj.msrpHeader]}` //Suggested Retail //Power Field 8 - this will target the ACTUAL MSRP
      }
      if (typeOfIMW.toLowerCase() == 'new') {
        srcRsObj['pf5'] = new Date().toISOString().split('T', 1)[0] + " NEW ITEM UPDT (pf5)" //Power Field 5 - today's date
        srcRsObj['pf8'] = "" //Power Field 8
      }
      //^//provide different update messages, based on what type of update you're doing (i.e. ws IMW, retail IMW, new item IMW)

      // srcRsObj['pf5'] = new Date().toISOString().split('T', 1)[0] + "RTL UPDT (pf5)" //Power Field 5 - today's date
      srcRsObj['pf6'] = nejRows[i][genericHeaderObj.rbSupplierHeader] //Power Field 6 //EDI-VENDORNAME INCLUDE in save2CSVreview export data
      reviewObj['pf6'] = nejRows[i][genericHeaderObj.rbSupplierHeader] //Power Field 6 //EDI-VENDORNAME INCLUDE in save2CSVreview export data
      srcRsObj['pf7'] = "" //Power Field 7
      // srcRsObj['pf8'] = "" //Power Field 8

      srcRsObj['onhndQnt'] = "" //On Hand Quantity
      srcRsObj['rdrPnt'] = "" //Reorder Point
      srcRsObj['mcl'] = "" //Maintain Constant Level
      srcRsObj['rdrQnt'] = "" //Reorder Quantity

      srcRsObj['memo'] = "" //Memo

      srcRsObj['flrRsn'] = "" //Failure Reason

      srcRsObj['dsd'] = "" //DSD

      srcRsObj['dscMltplr'] = "" //Discount Multiplier

      // srcRsObj['csPkgMltpl'] = "" //Case Package Multiple -- THIS IS NOW SET IN divideCostToUOS_Rtl_IMW() & divideCostToUOS_WS_IMW()

      // srcRsObj['ovr'] = reviewObj['ovr'] = 0 //set ovr (for IMW) to 0 FOR EVERYTHING (CRITICAL)
      // //this will NOT give buyers the option to override to buy "eaches" for items vendors sell to us in cases
      // //AS A GENERAL RULE, THIS SHOULD ALWAYS BE SET TO 0... IN SOME CASES, WE MIGHT CHANGE TO 1

      srcRsObj['ovr'] = reviewObj['ovr'] = 1 //20191224 set ovr (for IMW) to 1 FOR EVERYTHING per MaryKate's request
      //this WILL give buyers the option to override to buy "eaches" for items vendors sell to us in "cases"

      // srcRsObj['ovr'] = "" //OVR
      // srcRsObj['ovr'] = "" //OVR


      srcRsObj['name'] = nejRows[i][genericHeaderObj.nameHeader] //INCLUDE in save2CSVreview export data
      reviewObj['name'] = nejRows[i][genericHeaderObj.nameHeader]

      //v//this should get set as the value from edi catalog & never changed 
      reviewObj['ediCost'] = srcRsObj['ediCost'] = nejRows[i][genericHeaderObj.ediCostHeader] //INCLUDE in save2CSVreview export data
      //^//this should get set as the value from edi catalog & never changed 


      if (typeOfIMW.toLowerCase() == 'retail') { //only apply this if running retail
        //v//this should get initially set as the value from edi catalog & then changed according to division to UOS in calcCharm()
        reviewObj['ediCostMod'] = srcRsObj['ediCostMod'] = nejRows[i][genericHeaderObj.ediCostHeader] //NEED TO CHECK
        //^//this should get initially set as the value from edi catalog & then changed according to division to UOS in calcCharm()
      }


      if (nejRows[i][genericHeaderObj.ediCostHeaderItemCost] == "") { //generate blankEdiCostUPC entry to flag any margin report item_cost
        //values that are blank. This will then appear in the retail review worksheet under column name blankEdiCost. THESE ITEMS NEED
        //TO BE INVESTIGATED TO SEE IF SKUs ARE INACCURATE, OR WHATEVER ELSE IS GOING ON
        reviewObj['blankEdiCostUPC'] = srcRsObj['blankEdiCostUPC'] = nejRows[i][genericHeaderObj.upcHeader]
      }

      // srcRsObj['ediCost'] = nejRows[i][genericHeaderObj.ediCostHeader] 
      // reviewObj['ediCost'] = nejRows[i][genericHeaderObj.ediCostHeader]//INCLUDE in save2CSVreview export data
      srcRsObj['ediPrice'] = nejRows[i][genericHeaderObj.msrpHeader] //INCLUDE in csv to export data
      reviewObj['ediPrice'] = nejRows[i][genericHeaderObj.msrpHeader] //INCLUDE in save2CSVreview export data

      // srcRsObj['rb_price'] = nejRows[i][genericHeaderObj.rbPriceHeader] //INCLUDE in csv to export data
      // reviewObj['rb_price'] = nejRows[i][genericHeaderObj.rbPriceHeader] //INCLUDE in save2CSVreview export data

      srcRsObj['sibBasePrice'] = nejRows[i][genericHeaderObj.sibBasePriceHeader] //INCLUDE in csv to export data
      reviewObj['sibBasePrice'] = nejRows[i][genericHeaderObj.sibBasePriceHeader] //INCLUDE in save2CSVreview export data

      srcRsObj['globalMargin'] = globalMargin //do not include in csv to export data
      // srcRsObj['rb_dept'] = nejRows[i][genericHeaderObj.rbDeptHeader]
      // reviewObj['rb_dept'] = nejRows[i][genericHeaderObj.rbDeptHeader] //INCLUDE in save2CSVreview export data 

      srcRsObj['dptName'] = nejRows[i][genericHeaderObj.rbDeptHeader]
      reviewObj['dptName'] = nejRows[i][genericHeaderObj.rbDeptHeader] //INCLUDE in save2CSVreview export data 

      // srcRsObj['rb_dept_id'] = nejRows[i][genericHeaderObj.rbDeptIDHeader]
      // reviewObj['rb_dept_id'] = nejRows[i][genericHeaderObj.rbDeptIDHeader] //INCLUDE in save2CSVreview export data

      srcRsObj['dptNumber'] = nejRows[i][genericHeaderObj.rbDeptIDHeader]
      reviewObj['dptNumber'] = nejRows[i][genericHeaderObj.rbDeptIDHeader] //INCLUDE in save2CSVreview export data

      for (let m = 0; m < deptFilterArr.length; m++) {
        if (srcRsObj['dptNumber'] == Object.keys(deptFilterArr[m])) {
          srcRsObj['defaultMarg'] = reviewObj['defaultMarg'] = deptFilterArr[m][Object.keys(deptFilterArr[m])]['dfltMrg'] //populate defaultMarg column in retail review
          //with default rb margin for a particular department number
        }
      }

      // srcRsObj['rb_dept_margin'] = nejRows[i][genericHeaderObj.rbDeptMarginHeader]
      // reviewObj['rb_dept_margin'] = nejRows[i][genericHeaderObj.rbDeptMarginHeader] //INCLUDE in save2CSVreview export data

      srcRsObj['sibIdealMargin'] = nejRows[i][genericHeaderObj.sibIdealMarginHeader]
      reviewObj['sibIdealMargin'] = nejRows[i][genericHeaderObj.sibIdealMarginHeader] //INCLUDE in save2CSVreview export data

      // srcRsObj['edlp_flag'] = nejRows[i][genericHeaderObj.edlpFlagHeader]
      // reviewObj['edlp_flag'] = nejRows[i][genericHeaderObj.edlpFlagHeader] //INCLUDE in save2CSVreview export data

      srcRsObj['sale_flag'] = nejRows[i][genericHeaderObj.saleFlagHeader]
      reviewObj['sale_flag'] = nejRows[i][genericHeaderObj.saleFlagHeader] //INCLUDE in save2CSVreview export data

      srcRsObj['discountToApply'] = discountToApply * 100
      reviewObj['discountToApply'] = discountToApply * 100 //INCLUDE in save2CSVreview export data

      if (postBody['wsDiffResultsPost'] !== undefined && postBody['wsDiffResultsPost'].length > 0) { //must check to see if anything was entered in WS Diff Results
        //input, otherwise wsDiffResults will be undefined
        let wsDiffResults = JSON.parse(postBody['wsDiffResultsPost'])
        for (let j = 0; j < wsDiffResults.length; j++) {
          if (srcRsObj['upc'] == wsDiffResults[j]['wsDiffNewTable_upc']) {
            srcRsObj['wsDiff_t0d'] = wsDiffResults[j]['wsDiffNewTable_upc'] //INCLUDE in save2CSVreview export data
            reviewObj['wsDiff_t0d'] = wsDiffResults[j]['wsDiffNewTable_upc'] //INCLUDE in save2CSVreview export data
            // console.log('calcResults says: wsDiffResults[j][\'wsDiffNewTable_upc\']##>>', wsDiffResults[j]['wsDiffNewTable_upc'])
          }
        }
      }

      if (typeOfIMW.toLowerCase() == 'wholesale') { //start dept filtering handling with wholesale imw,
        //because lower down, we will be filtering for retail imw after running calcCharm()
        divideCostToUOS_WS_IMW()
        skuMismatchFlagOptionHandler()
        // skuMismatchFlagOptionHandler.skuMismatchFlagOptionHandler() //this should fire skuMismatchFlagOptionHandler() from the
        // //skuMismatchFlagOptionHandler.js file located in funcLib_t0d folder
        if (srcRsObj['ediCostMod'] !== undefined) { //only push items that have ediCostMod value (which means that exist cplt cost
          //is different than new divided-to-uos edi cost, as determined in divideCostToUOS_WS_IMW())

          // console.log(`srcRsObj['upc'](${i})...srcRsObj['ediCostMod'](${i})==>${srcRsObj['upc']}...${srcRsObj['ediCostMod']}`)
          if (skuOveride.toLowerCase() == 'matchonly') { //option for including or excluding matching catapult/edi SKUs
            if (nejRows[i][genericHeaderObj.cpltSKUHeader] == nejRows[i][genericHeaderObj.ediSKUHeader]) {
              srcRsObj['sugstdRtl'] = "" //set sugstdRtl to empty if typeofIMW = 'wholesale'
              srcRsObj['charm'] = "" //set charm to empty if typeofIMW = 'wholesale'
              if (deptFilterToApply !== null) { //if a valid dept filter option is entered,
                if (srcRsObj['dptNumber'] == deptFilterToApply) { //only push that dept into searchResults
                  searchResults.push(srcRsObj)
                  searchResultsForCSV.push(srcRsObj)
                  searchResultsForCSVreview.push(reviewObj)
                }
              } else { //otherwise, push all depts into searchResults
                searchResults.push(srcRsObj)
                searchResultsForCSV.push(srcRsObj)
                searchResultsForCSVreview.push(reviewObj)
              }
            }
          } else {
            srcRsObj['sugstdRtl'] = "" //set sugstdRtl to empty if typeofIMW = 'wholesale'
            srcRsObj['charm'] = "" //set charm to empty if typeofIMW = 'wholesale'
            if (deptFilterToApply !== null) { //if a valid dept filter option is entered,
              if (srcRsObj['dptNumber'] == deptFilterToApply) { //only push that dept into searchResults
                searchResults.push(srcRsObj)
                searchResultsForCSV.push(srcRsObj)
                searchResultsForCSVreview.push(reviewObj)
              }
            } else { //otherwise, push all depts into searchResults
              searchResults.push(srcRsObj)
              searchResultsForCSV.push(srcRsObj)
              searchResultsForCSVreview.push(reviewObj)
            }
          }
        }
      } else {
        // if (edlpSwitch == 'no') {

        // }
        //v//need to run calcCharm for edi catalogs, thus there will be no rb_dept_id key; use value input for globalMargin
        if (formInput0.includes('edi_')) {
          calcCharm(globalMargin, lowerCutRqdRtlBrad, lowerCutoffCharm1Brad, lowerCutoffCharm2Brad, lowerCutoffCharm3Brad,
            lowerCutoffCharm4Brad, lowerCutoffCharm5Brad, lowerCutoffCharm6Brad, lowerCutoffCharm7Brad, upperCharmRqdRtlBrad,
            defaultCharm1Brad, defaultCharm2Brad, defaultCharm3Brad, defaultCharm4Brad)
        }
        //^//need to run calcCharm for edi catalogs, thus there will be no rb_dept_id key; use value input for globalMargin

        if (srcRsObj['dptNumber'] == '54') { //Beer & Alcohol
          //apply Department margin to calculate charm pricing
          calcCharm(beerAlcMargin, lowerCutRqdRtlBrad, lowerCutoffCharm1Brad, lowerCutoffCharm2Brad, lowerCutoffCharm3Brad,
            lowerCutoffCharm4Brad, lowerCutoffCharm5Brad, lowerCutoffCharm6Brad, lowerCutoffCharm7Brad, upperCharmRqdRtlBrad,
            defaultCharm1Brad, defaultCharm2Brad, defaultCharm3Brad, defaultCharm4Brad)
          revealAppliedMarg(beerAlcMargin)
        }
        if (srcRsObj['dptNumber'] == '152') { //Body Care
          calcCharm(bodyCareMargin, lowerCutRqdRtlAndrea, lowerCutoffCharm1Andrea, lowerCutoffCharm2Andrea, lowerCutoffCharm3Andrea,
            lowerCutoffCharm4Andrea, lowerCutoffCharm5Andrea, lowerCutoffCharm6Andrea, lowerCutoffCharm7Andrea, upperCharmRqdRtlAndrea,
            defaultCharm1Andrea, defaultCharm2Andrea, defaultCharm3Andrea, defaultCharm4Andrea)
          revealAppliedMarg(bodyCareMargin)
        }
        if (srcRsObj['dptNumber'] == '9') { //Books
          calcCharm(booksMargin, lowerCutRqdRtlAndrea, lowerCutoffCharm1Andrea, lowerCutoffCharm2Andrea, lowerCutoffCharm3Andrea,
            lowerCutoffCharm4Andrea, lowerCutoffCharm5Andrea, lowerCutoffCharm6Andrea, lowerCutoffCharm7Andrea, upperCharmRqdRtlAndrea,
            defaultCharm1Andrea, defaultCharm2Andrea, defaultCharm3Andrea, defaultCharm4Andrea)
          revealAppliedMarg(booksMargin)
        }
        if (srcRsObj['dptNumber'] == '19') { //Bulk
          calcCharm(bulkMargin, lowerCutRqdRtlBrad, lowerCutoffCharm1Brad, lowerCutoffCharm2Brad, lowerCutoffCharm3Brad,
            lowerCutoffCharm4Brad, lowerCutoffCharm5Brad, lowerCutoffCharm6Brad, lowerCutoffCharm7Brad, upperCharmRqdRtlBrad,
            defaultCharm1Brad, defaultCharm2Brad, defaultCharm3Brad, defaultCharm4Brad)
          revealAppliedMarg(bulkMargin)
        }
        if (srcRsObj['dptNumber'] == '30') { //Bulk & Herb Prepack
          calcCharm(bulkHrbPrpkMargin, lowerCutRqdRtlBrad, lowerCutoffCharm1Brad, lowerCutoffCharm2Brad, lowerCutoffCharm3Brad,
            lowerCutoffCharm4Brad, lowerCutoffCharm5Brad, lowerCutoffCharm6Brad, lowerCutoffCharm7Brad, upperCharmRqdRtlBrad,
            defaultCharm1Brad, defaultCharm2Brad, defaultCharm3Brad, defaultCharm4Brad)
          revealAppliedMarg(bulkHrbPrpkMargin)
        }
        if (srcRsObj['dptNumber'] == '175') { //CBD - Grocery
          calcCharm(cbdGrocMargin, lowerCutRqdRtlBrad, lowerCutoffCharm1Brad, lowerCutoffCharm2Brad, lowerCutoffCharm3Brad,
            lowerCutoffCharm4Brad, lowerCutoffCharm5Brad, lowerCutoffCharm6Brad, lowerCutoffCharm7Brad, upperCharmRqdRtlBrad,
            defaultCharm1Brad, defaultCharm2Brad, defaultCharm3Brad, defaultCharm4Brad)
          revealAppliedMarg(cbdGrocMargin)
        }
        if (srcRsObj['dptNumber'] == '176') { //CBD - Supplements
          calcCharm(cbdSuppMargin, lowerCutRqdRtlAndrea, lowerCutoffCharm1Andrea, lowerCutoffCharm2Andrea, lowerCutoffCharm3Andrea,
            lowerCutoffCharm4Andrea, lowerCutoffCharm5Andrea, lowerCutoffCharm6Andrea, lowerCutoffCharm7Andrea, upperCharmRqdRtlAndrea,
            defaultCharm1Andrea, defaultCharm2Andrea, defaultCharm3Andrea, defaultCharm4Andrea)
          revealAppliedMarg(cbdSuppMargin)
        }
        if (srcRsObj['dptNumber'] == '177') { //CBD - Topicals
          calcCharm(cbdTopMargin, lowerCutRqdRtlAndrea, lowerCutoffCharm1Andrea, lowerCutoffCharm2Andrea, lowerCutoffCharm3Andrea,
            lowerCutoffCharm4Andrea, lowerCutoffCharm5Andrea, lowerCutoffCharm6Andrea, lowerCutoffCharm7Andrea, upperCharmRqdRtlAndrea,
            defaultCharm1Andrea, defaultCharm2Andrea, defaultCharm3Andrea, defaultCharm4Andrea)
          revealAppliedMarg(cbdTopMargin)
        }
        if (srcRsObj['dptNumber'] == '148') { //Consignments
          calcCharm(consignMargin, lowerCutRqdRtlBrad, lowerCutoffCharm1Brad, lowerCutoffCharm2Brad, lowerCutoffCharm3Brad,
            lowerCutoffCharm4Brad, lowerCutoffCharm5Brad, lowerCutoffCharm6Brad, lowerCutoffCharm7Brad, upperCharmRqdRtlBrad,
            defaultCharm1Brad, defaultCharm2Brad, defaultCharm3Brad, defaultCharm4Brad)
          revealAppliedMarg(consignMargin)
        }
        if (srcRsObj['dptNumber'] == '18') { //Frozen
          calcCharm(frozenMargin, lowerCutRqdRtlBrad, lowerCutoffCharm1Brad, lowerCutoffCharm2Brad, lowerCutoffCharm3Brad,
            lowerCutoffCharm4Brad, lowerCutoffCharm5Brad, lowerCutoffCharm6Brad, lowerCutoffCharm7Brad, upperCharmRqdRtlBrad,
            defaultCharm1Brad, defaultCharm2Brad, defaultCharm3Brad, defaultCharm4Brad)
          revealAppliedMarg(frozenMargin)
        }
        if (srcRsObj['dptNumber'] == '150') { //General Merchandise
          calcCharm(genMerchMargin, lowerCutRqdRtlBrad, lowerCutoffCharm1Brad, lowerCutoffCharm2Brad, lowerCutoffCharm3Brad,
            lowerCutoffCharm4Brad, lowerCutoffCharm5Brad, lowerCutoffCharm6Brad, lowerCutoffCharm7Brad, upperCharmRqdRtlBrad,
            defaultCharm1Brad, defaultCharm2Brad, defaultCharm3Brad, defaultCharm4Brad)
          revealAppliedMarg(genMerchMargin)
        }
        if (srcRsObj['dptNumber'] == '13') { //Gift Items
          calcCharm(giftMargin, lowerCutRqdRtlAndrea, lowerCutoffCharm1Andrea, lowerCutoffCharm2Andrea, lowerCutoffCharm3Andrea,
            lowerCutoffCharm4Andrea, lowerCutoffCharm5Andrea, lowerCutoffCharm6Andrea, lowerCutoffCharm7Andrea, upperCharmRqdRtlAndrea,
            defaultCharm1Andrea, defaultCharm2Andrea, defaultCharm3Andrea, defaultCharm4Andrea)
          revealAppliedMarg(giftMargin)
        }
        if (srcRsObj['dptNumber'] == '62') { //Grab & Go
          calcCharm(grabGoMargin, lowerCutRqdRtlBrad, lowerCutoffCharm1Brad, lowerCutoffCharm2Brad, lowerCutoffCharm3Brad,
            lowerCutoffCharm4Brad, lowerCutoffCharm5Brad, lowerCutoffCharm6Brad, lowerCutoffCharm7Brad, upperCharmRqdRtlBrad,
            defaultCharm1Brad, defaultCharm2Brad, defaultCharm3Brad, defaultCharm4Brad)
          revealAppliedMarg(grabGoMargin)
        }
        if (srcRsObj['dptNumber'] == '25') { //Grocery
          calcCharm(grocMargin, lowerCutRqdRtlBrad, lowerCutoffCharm1Brad, lowerCutoffCharm2Brad, lowerCutoffCharm3Brad,
            lowerCutoffCharm4Brad, lowerCutoffCharm5Brad, lowerCutoffCharm6Brad, lowerCutoffCharm7Brad, upperCharmRqdRtlBrad,
            defaultCharm1Brad, defaultCharm2Brad, defaultCharm3Brad, defaultCharm4Brad)
          revealAppliedMarg(grocMargin)
        }
        if (srcRsObj['dptNumber'] == '179') { //Grocery - Local
          calcCharm(grocLocMargin, lowerCutRqdRtlBrad, lowerCutoffCharm1Brad, lowerCutoffCharm2Brad, lowerCutoffCharm3Brad,
            lowerCutoffCharm4Brad, lowerCutoffCharm5Brad, lowerCutoffCharm6Brad, lowerCutoffCharm7Brad, upperCharmRqdRtlBrad,
            defaultCharm1Brad, defaultCharm2Brad, defaultCharm3Brad, defaultCharm4Brad)
          revealAppliedMarg(grocLocMargin)
        }
        if (srcRsObj['dptNumber'] == '38') { //Grocery - Local Meat
          calcCharm(grocLcMtMargin, lowerCutRqdRtlBrad, lowerCutoffCharm1Brad, lowerCutoffCharm2Brad, lowerCutoffCharm3Brad,
            lowerCutoffCharm4Brad, lowerCutoffCharm5Brad, lowerCutoffCharm6Brad, lowerCutoffCharm7Brad, upperCharmRqdRtlBrad,
            defaultCharm1Brad, defaultCharm2Brad, defaultCharm3Brad, defaultCharm4Brad)
          revealAppliedMarg(grocLcMtMargin)
        }
        if (srcRsObj['dptNumber'] == '12') { //HBA - had this as 17 & was causing hba items not to get charm applied
          calcCharm(hbaMargin, lowerCutRqdRtlAndrea, lowerCutoffCharm1Andrea, lowerCutoffCharm2Andrea, lowerCutoffCharm3Andrea,
            lowerCutoffCharm4Andrea, lowerCutoffCharm5Andrea, lowerCutoffCharm6Andrea, lowerCutoffCharm7Andrea, upperCharmRqdRtlAndrea,
            defaultCharm1Andrea, defaultCharm2Andrea, defaultCharm3Andrea, defaultCharm4Andrea)
          revealAppliedMarg(hbaMargin)
        }
        if (srcRsObj['dptNumber'] == '158') { //Herbs & Homeopathic
          calcCharm(herbsHomeoMargin, lowerCutRqdRtlAndrea, lowerCutoffCharm1Andrea, lowerCutoffCharm2Andrea, lowerCutoffCharm3Andrea,
            lowerCutoffCharm4Andrea, lowerCutoffCharm5Andrea, lowerCutoffCharm6Andrea, lowerCutoffCharm7Andrea, upperCharmRqdRtlAndrea,
            defaultCharm1Andrea, defaultCharm2Andrea, defaultCharm3Andrea, defaultCharm4Andrea)
          revealAppliedMarg(herbsHomeoMargin)
        }
        if (srcRsObj['dptNumber'] == '80') { //LifeBar
          calcCharm(lfBrMargin, lowerCutRqdRtlBrad, lowerCutoffCharm1Brad, lowerCutoffCharm2Brad, lowerCutoffCharm3Brad,
            lowerCutoffCharm4Brad, lowerCutoffCharm5Brad, lowerCutoffCharm6Brad, lowerCutoffCharm7Brad, upperCharmRqdRtlBrad,
            defaultCharm1Brad, defaultCharm2Brad, defaultCharm3Brad, defaultCharm4Brad)
          revealAppliedMarg(lfBrMargin)
        }
        if (srcRsObj['dptNumber'] == '151') { //Other
          calcCharm(otherMargin, lowerCutRqdRtlAndrea, lowerCutoffCharm1Andrea, lowerCutoffCharm2Andrea, lowerCutoffCharm3Andrea,
            lowerCutoffCharm4Andrea, lowerCutoffCharm5Andrea, lowerCutoffCharm6Andrea, lowerCutoffCharm7Andrea, upperCharmRqdRtlAndrea,
            defaultCharm1Andrea, defaultCharm2Andrea, defaultCharm3Andrea, defaultCharm4Andrea)
          revealAppliedMarg(otherMargin)
        }
        if (srcRsObj['dptNumber'] == '155') { //Refrigerated
          calcCharm(refrigMargin, lowerCutRqdRtlBrad, lowerCutoffCharm1Brad, lowerCutoffCharm2Brad, lowerCutoffCharm3Brad,
            lowerCutoffCharm4Brad, lowerCutoffCharm5Brad, lowerCutoffCharm6Brad, lowerCutoffCharm7Brad, upperCharmRqdRtlBrad,
            defaultCharm1Brad, defaultCharm2Brad, defaultCharm3Brad, defaultCharm4Brad)
          revealAppliedMarg(refrigMargin)
        }
        if (srcRsObj['dptNumber'] == '157') { //Vitamins & Supplements
          calcCharm(vitSuppMargin, lowerCutRqdRtlAndrea, lowerCutoffCharm1Andrea, lowerCutoffCharm2Andrea, lowerCutoffCharm3Andrea,
            lowerCutoffCharm4Andrea, lowerCutoffCharm5Andrea, lowerCutoffCharm6Andrea, lowerCutoffCharm7Andrea, upperCharmRqdRtlAndrea,
            defaultCharm1Andrea, defaultCharm2Andrea, defaultCharm3Andrea, defaultCharm4Andrea)
          revealAppliedMarg(vitSuppMargin)
        }

        function populateResultsObj_Rtl() {
          skuMismatchFlagOptionHandler()
          if (srcRsObj['charm'] !== "" && Math.round((srcRsObj['charm']) * 100) / 100 !== Math.round((srcRsObj['sibBasePrice']) * 100) / 100) { // only push results that have some
            //value for "charm" column, AND ALSO select only items whose updated price is different than the exist. price in cplt
            if (skuOveride.toLowerCase() == 'matchonly') { //option for including or excluding matching catapult/edi SKUs
              if (nejRows[i][genericHeaderObj.cpltSKUHeader] == nejRows[i][genericHeaderObj.ediSKUHeader]) {
                if (deptFilterToApply !== null) { //if a valid dept filter option is entered,
                  if (srcRsObj['dptNumber'] == deptFilterToApply) { //only push that dept into searchResults
                    searchResults.push(srcRsObj)
                    searchResultsForCSV.push(srcRsObj)
                    searchResultsForCSVreview.push(reviewObj)
                  }
                } else { //otherwise, push all depts into searchResults
                  searchResults.push(srcRsObj)
                  searchResultsForCSV.push(srcRsObj)
                  searchResultsForCSVreview.push(reviewObj)
                }
              }
            } else {
              if (deptFilterToApply !== null) { //if a valid dept filter option is entered,
                if (srcRsObj['dptNumber'] == deptFilterToApply) { //only push that dept into searchResults
                  searchResults.push(srcRsObj)
                  searchResultsForCSV.push(srcRsObj)
                  searchResultsForCSVreview.push(reviewObj)
                }
              } else { //otherwise, push all depts into searchResults
                searchResults.push(srcRsObj)
                searchResultsForCSV.push(srcRsObj)
                searchResultsForCSVreview.push(reviewObj)
              }
            }
          }
        }
        //v//EDLP switch handler. This should exclude EDLPS from calcCharm results if switch is set to 'no', but include them if set to 'yes'
        if (edlpSwitch == 'no') {
          if (srcRsObj['edlpVar'] !== 'EDLP') {
            populateResultsObj_Rtl()
          }
        } else {
          populateResultsObj_Rtl()
        }
        //^//EDLP switch handler. This should exclude EDLPS from calcCharm results if switch is set to 'no', but include them if set to 'yes'
      }

    }
    console.log('calcResults says: searchResults[0] from showSearchResults()==>', searchResults[0])
    // console.log('calcResults says: searchResultsForCSV from showSearchResults()==>', searchResultsForCSV)
    console.log('calcResults says: searchResultsForCSVreview[0] from showSearchResults()==>', searchResultsForCSVreview[0])
  }
}