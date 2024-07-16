const Filter = ({setFilterValue, clearBrandsFilter}) => {
    
    
    return(
        <p onChange={(e)=>setFilterValue(e)} style={{width: '100%'}}><input className="hidden" style={{marginLeft: '10px'}} type="text" id='brandFilter' placeholder="Фильтр брендов" />&nbsp;<button id="clearBrandFilter" className="hidden" onClick={clearBrandsFilter}>Очистить</button></p>
    )
}

export default Filter