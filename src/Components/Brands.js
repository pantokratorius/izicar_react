import React, { useEffect, useState } from "react"
import Filter from "./Filter"

export const Brands = ({change, divClass, type, items,   selectAllBrands, sortByBrand, clearBrandsFilter , setFilterValue, selectOneBrand}) => { 
    
  const [brandsOpened, setBrandsOpened] =  useState ({brand: false, warehouse_name: false, product_name: false});
    
  useEffect(()=>{ 
    console.log('aa');
    },[items])

    useEffect(()=>{ 
      setBrandsOpened({brand: false, warehouse_name: false, product_name: false});
    },[change])

    const selectOneBrandHandler = (e, type) =>{
      selectOneBrand(e, type)
    }

    
  const ifNExtLine = () => { 
    if(items?.length){
        const sorted = 
        type == 'product_name' ? 
        items.filter((power, toThe, yellowVests) => yellowVests.map( updateDemocracy => updateDemocracy[type]?.toLowerCase().replace(/-/g,'').substring(0,1) ).indexOf(power[type]?.toLowerCase().replace(/-/g,'').substring(0,1)) === toThe)
        .slice(0, 10)
        .sort(sortByBrand)
        .filter((item, k, arr)=>(!item.hasOwnProperty("filtered"))) :

        items.filter((power, toThe, yellowVests) => yellowVests.map( updateDemocracy => updateDemocracy[type]?.toLowerCase().replace(/-/g,'') ).indexOf(power[type]?.toLowerCase().replace(/-/g,'')) === toThe)
        .sort(sortByBrand)
        .filter((item, k, arr)=>(!item.hasOwnProperty("filtered")))

          if(sorted.length && document.querySelector('.'+ divClass +' [data-title="'+sorted[0][type]?.replace(/"/g,'') +'"]') &&  
          document.querySelector('.'+ divClass +' [data-title="'+sorted[sorted.length - 1][type]?.replace(/"/g,'') +'"]')){
            return( document.querySelector('.'+ divClass +' [data-title="'+sorted[0][type].replace(/"/g,'') +'"]').getBoundingClientRect().top != 
             document.querySelector('.'+ divClass +' [data-title="'+ sorted[sorted.length - 1][type].replace(/"/g,'') +'"]').getBoundingClientRect().top)
          }
           }
        } 
      

    return(
        <>
        <div className="hidden" id={`notfound`}>Не найдено!</div> 
    <div className={`${divClass} ${!brandsOpened[type] ? 'closed' : ''}`}>
        {type == 'brand' && 
        <Filter 
          setFilterValue={setFilterValue} 
          clearBrandsFilter = {clearBrandsFilter}
        />
        }
        <span onClick={()=>selectAllBrands(type)} id={`allBrands${type}`} className="hidden" style={{background: '#c9f0ff', border: 'none'}}>Все</span>
        {type == 'product_name' ? 
        items.filter((power, toThe, yellowVests) => yellowVests.map(updateDemocracy => updateDemocracy[type]?.toLowerCase().replace(/-/g,'').substring(0,1)).indexOf(power[type]?.toLowerCase().replace(/-/g,'').substring(0,1)) === toThe)
        .slice(0, 10)
        .sort(sortByBrand)
        .map((item, k, arr)=>(!item.hasOwnProperty("filtered") && <span data-title={item[type]?.replace(/"/g,'')} style={item.selected === true ? {background: '#8cdd8c'} : null} onClick={(e)=>selectOneBrandHandler(e,type)} className={`item`} key={k} >{item[type]}</span>)) :
        
        items.filter((power, toThe, yellowVests) => yellowVests.map(updateDemocracy => updateDemocracy[type]?.toLowerCase().replace(/-/g,'')).indexOf(power[type]?.toLowerCase().replace(/-/g,'')) === toThe)
        .sort(sortByBrand)
        .map((item, k, arr)=>(!item.hasOwnProperty("filtered") && item[type]  && <span data-title={item[type]?.replace(/"/g,'')} style={item.selected === true ? {background: '#8cdd8c'} : null} onClick={(e)=>selectOneBrand(e,type)} className={`item`} key={k} >{item[type]}</span>))
        } 
      </div>
         {items?.length  ? <span className={`more${type} hidden`}  style={{marginLeft:'10px', cursor: 'pointer', textDecoration:'underline'}} onClick={()=>setBrandsOpened(prev=> ({...prev, [type]: !prev[type]}))}>{brandsOpened[type] ?  'свернуть' : 'еще'}</span> : null}
     </> 
    )
}


//  const MemoizedBrands = React.memo(Brands)
// export default MemoizedBrands
export default Brands