import logo from './logo.svg';
import './App.css';
import { useEffect, useMemo, useState } from "react";
import MemoizedBrands from "./Components/Brands";
import Brands from "./Components/Brands";
import Loader from "./Components/Loader/Loader";
import Nacenki from "./Components/Nacenki/Nacenki";
import formatPrice from "./helpers/formatPrice";
import getFewDuplicates from "./helpers/getFewDuplicates";
import sort from "./helpers/sort"
import sortOpened from "./helpers/sortOpened"
import sortByBrand from "./helpers/sortByName";

import getMikadoApi from './Api/getMikadoApi';
import getAvtotoApi from './Api/getAvtotoApi';
import getForumAvtoApi from './Api/getForumAvtoApi';

function App() {
  const [showZakupochnyje, setShowZakupochnyje] = useState (true);
  const [notification, setNotification] = useState ({on:false, text:'', status: 'success'});
  const [nacenki, setNacenki] = useState ([]);
  const [nacenkiOpened, setNacenkiOpened] = useState (false);
  
  const [nacenkiProps, setNacenkiProps] = useState ([]);
  const [change, setChange] = useState (false);
  const [names, setNames] = useState ([]);
  const [warehouses, setWarehouses] = useState ([]);
  const [brands, setBrands] = useState ([]);
  const [opened, setOpened] = useState (false);
  const [search, setSearch] = useState ('');
  const [parts, setParts] = useState ([]);
  const [loading, setLoading] = useState (false);
  const [selected, setSelected] = useState ([]);
  const [sortOrder, setSortOrder] = useState ('price');
  const [sortOrderName, ] = useState ({'price': 'цене', 'delivery': 'сроку доставки'});
  const [allSuppliers, setAllSuppliers] = useState (false);
  const [suppliers, setSuppliers] = useState (
    [
      {
        title: 'Микадо',
        class: 'start',
        closed: true,
        selected: false,
        getParts: (search,title) =>getMikado(search, title)
      }
      // ,{
      //   title: 'Автото',
      //   class: 'start',
      //   closed: true,
      //   selected: false,
      //   getParts: (search,title)=>getAvtoto(search, title)
      // },
      // ,{
      //   title: 'Форум-Авто',
      //   class: 'start',
      //   closed: true,
      //   selected: false,
      //   getParts: (search,title)=>getForumAvto(search, title)
        
      // }
      // {
      //   title: 'Росско',
      //   class: 'start',
      //   closed: true,
      //   selected: false,
      //   getParts: () => getRossko()
      // },
      // {
      //   title: 'АБС',
      //   class: 'start',
      //   closed: true,
      //   selected: false,
      //   getParts: 'getAbs'
      // },
      //   {
      //   title: 'Микадо',
      //   class: 'start',
      //   closed: true,
      //   selected: false
      // }
      // ,{
      //   title: 'Фаворит',
      //   class: 'start',
      //   closed: true,
      //   selected: false
      // },{
      //   title: 'Профит-лига',
      //   class: 'start',
      //   closed: true,
      //   selected: false
      // }
    ]);


    useEffect(()=>(
        getNacenki()
    ),[])

  const  topFunction = () => {
    document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0;
    document.querySelector('#input').select() 
  }
  
   const handleSubmit = async e => { 
     e.preventDefault()
    setParts([])
    setBrands([])
    setWarehouses([])
    setNames([])
    setOpened(false)
    setSuppliers(suppliers => suppliers.map(item => ( {...item, class: 'search'} )))
    setLoading(true)
    selectAllSuppliers()
    setChange(prev=> !prev)
    document.querySelectorAll('[id^="allBrands"]')?.forEach(item=> item.classList.add('hidden'))
    document.querySelector('#brandFilter').value = ''
    document.querySelector('#brandFilter')?.classList.add('hidden')  
    document.querySelector('#clearBrandFilter')?.classList.add('hidden')  
  
    const el = e.currentTarget.elements[0]
    const search =el.value.trim()
    if(search == ''){
      setLoading(false) 
      return
    }

     await Promise.all([

      suppliers.forEach(item => item.getParts(search, item.title))
      // getAvtoto(search),
      // getMikado(search),

        // getForumAvto(search),
        // getAbs(search),
        // getFavorit(search),
        // getRossko(search), // росско один склад без названия
        // getProfitLiga(search)
     ]).then(result=>{ 
       setLoading(false)
      //  setSuppliers(suppliers =>  suppliers.map(item=>(item.class == 'start' ? {...item, class: 'error'} : {...item})))
       el.select()
       document.querySelector('#show').classList.remove('hidden')
       document.querySelector('#brandFilter').classList.remove('hidden')  
       document.querySelector('#input').select()
      }).catch(e => { 
        console.error(`There has been a problem with your fetch operation:  ${e.message} `);
        // setLoading(false)
      //  setSuppliers(suppliers =>  suppliers.map(item=>(item.class == 'start' ? {...item, class: 'error'} : {...item})))
      })
  }

  


  const notify= (text, status=true) =>{
    const st =  status == true ? 'success' : 'failure'
    setNotification({on: true, text, status: st})
    setTimeout(()=>(
      closeNotification()
    ),1500)
  }

  const closeNotification = ()=>{
    setNotification({on: false, text:''})
  }

  const sortDeliveryDate = () => {
    setSortOrder('delivery')
  }

  const sortPrice = () => {
    setSortOrder('price')
  }

  useEffect(()=>{
    setSelected( parts
      .filter((item)=>( suppliers.filter( it => it.selected == true )
    .map(itt => itt.title).includes(item.supplier) )  ) 
  
  )


    suppliers.filter( it => it.selected == true ).length ? setAllSuppliers(true) : setAllSuppliers(false)
  }, [suppliers])

  useEffect(()=>{
    // console.log(parts);
    setSelected(parts
      .filter((item)=>( brands.filter( it => it.selected == true )
      .map(itt => itt.brand).includes(item.brand) )  )  
      .map((item, k, arr)=>( ifNextBrandSelected(item, k, arr)  ? {...item} : {...item, brand: ''})) 
      .map((item, k, arr)=>( ifNextNameSelected(item, k, arr)  ? {...item} : {...item, product_name: ''})) 
      )
  }, [brands])


  const selectOne = e => { 
    if(suppliers.find(item=>(item.title == e.target.textContent && ['noConnection','notfound', 'error', 'start','search'].includes(item.class) )) ) return
    // selectAllBrands()
    // removeSelectColor()
    
    // if(brands.find(item=>(item.selected == true)) )
    // setBrands( prev=>(prev.filter(item=>(parts.filter((item)=>(item.supplier == e.target.textContent )  ).some(it=>(it.brand == item.title))))) )
    setSuppliers(prev => prev.map(item=>(item.title == e.target.textContent ? (item.selected == true ? {...item, selected: false} : {...item, selected: true} ): {...item})))

        
    
  }
  
  const selectAllSuppliers = () => {
    removeSelectColor()
    setSelected([])
  }
  
    const  selectOneBrand = (e,type) => {
      // removeBrandsSelectColor()
      // selectAllSuppliers()
      // setSelected(parts
      //   .filter( item =>(item[type] == e.target.textContent )  ) 
      //   .map((item, k, arr)=>( ifNextBrandSelected(item, k, arr)  ? {...item} : {...item, brand: ''})) 
      //   .map((item, k, arr)=>( ifNextNameSelected(item, k, arr)  ? {...item} : {...item, product_name: ''})) 
      //   )
      if(type == 'brand'){  
        setBrands(prev => prev.map(item=>(item[type] == e.target.textContent ? (item.selected == true ? {...item, selected: false} : {...item, selected: true} ) : {...item})))
        setWarehouses(prev => prev.map(item=>({...item, selected: false})))
        setNames(prev => prev.map(item=>({...item, selected: false})))
      }
        else if(type == 'warehouse_name'){
          setWarehouses(prev => prev.map(item=>(item[type] == e.target.textContent ? {...item, selected: true} : {...item, selected: false})))
          setBrands(prev => prev.map(item=>({...item, selected: false})))
          setNames(prev => prev.map(item=>({...item, selected: false})))
        }
        else if(type == 'product_name'){
          setNames(prev => prev.map(item=>(item[type] == e.target.textContent ? {...item, selected: true} : {...item, selected: false})))
          setWarehouses(prev => prev.map(item=>({...item, selected: false})))
          setBrands(prev => prev.map(item=>({...item, selected: false})))
        }
      // document.querySelectorAll('[id^="allBrands"]')?.forEach(item=> item.classList.add('hidden'))
      // document.querySelector('#allBrands'+type)?.classList.remove('hidden')
    }
    // const cachedselectOneBrand = useMemo(() =>selectOneBrand(), [])

  const selectAllBrands = type => {
    removeBrandsSelectColor()
    setSelected([])
    clearBrandsFilter()
    document.querySelectorAll('[id^="allBrands"]')?.forEach(item=> item.classList.add('hidden'))
  }

  const removeSelectColor = () => {
    setSuppliers(prev=>prev.map(item=>({...item, selected: false})))
  }

  const removeBrandsSelectColor = () => {
    setBrands(prev=>prev.map(item=>({...item, selected: false})))
    setNames(prev=>prev.map(item=>({...item, selected: false})))
    setWarehouses(prev=>prev.map(item=>({...item, selected: false})))
  }
 
  const ifNextArticle = (item, k, arr) => {
    return (k > 0 && item.article.toLowerCase().replace(/-/g,'') != arr[k-1].article.toLowerCase().replace(/-/g,'') )  || k == 0 
  }

  const setFilterValue = (e) => {
    if(e.target.value.length > 1 ){
      setTimeout(()=>{
        setBrands(brands.map(item=>(item.brand.toLowerCase().replace(/-/g,'').indexOf(e.target.value.toLowerCase().replace(/-/g,'')) ===  0 ? {brand: item.brand} : {...item, filtered: true}  )) )
        setSelected(parts.filter(item=>(item.brand.toLowerCase().replace(/-/g,'').indexOf(e.target.value.toLowerCase().replace(/-/g,'')) === 0 ))) 
        document.querySelector('#clearBrandFilter').classList.remove('hidden')
        !brands.filter(item=>(item.brand.toLowerCase().replace(/-/g,'').indexOf(e.target.value.toLowerCase().replace(/-/g,'')) === 0)).length ?
          document.querySelector('#notfound').classList.remove('hidden') :
          document.querySelector('#notfound').classList.add('hidden')
      },500)
    }
    else {
      document.querySelector('#notfound').classList.add('hidden')
      setBrands(brands.map(item=>({brand: item.brand})) )
      removeBrandsSelectColor()
    setSelected([])
    }
  }
  const clearBrandsFilter = () => {
      setBrands(brands.map(item=>({brand: item.brand})) )
      setSelected([])
      setOpened(false)
      document.querySelector('#brandFilter').value = ''
      document.querySelector('#clearBrandFilter').classList.add('hidden')
      document.querySelector('#notfound').classList.add('hidden')
      document.querySelectorAll('[id^="allBrands"]')?.forEach(item=> item.classList.add('hidden'))
  }

  const ifNextBrandSelected = (item, k, arr) => {
    return k > 0 && item.brand.toLowerCase().replace(/-/g,'') != arr[k-1].brand.toLowerCase().replace(/-/g,'') || k == 0
  }

  const ifNextNameSelected = (item, k, arr) => {
    return k > 0 && arr[k-1].product_name.toLowerCase().replace(/-/g,'').indexOf(item.product_name.split(' ')[0].toLowerCase().replace(/-/g,'')) === -1 || k == 0
  }

  const closeNacenki = e => {
    if( Object.values(e.target.classList).includes('popupWrap') )  setNacenkiOpened(false) 
  }

  const getNacenki = async () =>{ 
    const nacenki = await fetch('http://izicar.grainpro.ru/db.php?act=getAllNacenki/')
    const nacenkiProps = await nacenki.json()
    setNacenki([...nacenkiProps])
    // setNacenki(suppliers.map(item=>({name: item.title, price: 10})))
  }

const setNacenkiOpenedHandler = () => {
  setNacenkiOpened(prev=>!prev)
}


 
  const ifNextBrand = (item, k, arr) => {
    return (k > 0 && item.brand.toLowerCase().replace(/-/g,'') != arr[k-1].brand.toLowerCase().replace(/-/g,'')|| k > 0 && item.article.toLowerCase().replace(/-/g,'') != arr[k-1].article.toLowerCase().replace(/-/g,'') ) || k == 0
  }
 
  const ifNextName = (item, k, arr) => {
    return (k > 0 &&  arr[k-1].product_name.toLowerCase().replace(/-/,'').indexOf(item.product_name.split(' ')[0].toLowerCase().replace(/-/,'')) === -1 &&
    k > 1 &&  arr[k-2].product_name.toLowerCase().replace(/-/g,'').indexOf(item.product_name.split(' ')[0].toLowerCase().replace(/-/g,'')) === -1 &&
    k > 2 &&  arr[k-3].product_name.toLowerCase().replace(/-/g,'').indexOf(item.product_name.split(' ')[0].toLowerCase().replace(/-/g,'')) === -1 &&
    k > 3 &&  arr[k-4].product_name.toLowerCase().replace(/-/g,'').indexOf(item.product_name.split(' ')[0].toLowerCase().replace(/-/g,'')) === -1 &&
    k > 4 &&  arr[k-5].product_name.toLowerCase().replace(/-/g,'').indexOf(item.product_name.split(' ')[0].toLowerCase().replace(/-/g,'')) === -1 &&
    k > 5 &&  arr[k-6].product_name.toLowerCase().replace(/-/g,'').indexOf(item.product_name.split(' ')[0].toLowerCase().replace(/-/g,'')) === -1 &&
    k > 6 &&  arr[k-7].product_name.toLowerCase().replace(/-/g,'').indexOf(item.product_name.split(' ')[0].toLowerCase().replace(/-/g,'')) === -1 &&
    k > 7 &&  arr[k-8].product_name.toLowerCase().replace(/-/g,'').indexOf(item.product_name.split(' ')[0].toLowerCase().replace(/-/g,'')) === -1 &&
    k > 8 &&  arr[k-9].product_name.toLowerCase().replace(/-/g,'').indexOf(item.product_name.split(' ')[0].toLowerCase().replace(/-/g,'')) === -1 &&
    k > 9 &&  arr[k-10].product_name.toLowerCase().replace(/-/g,'').indexOf(item.product_name.split(' ')[0].toLowerCase().replace(/-/g,'')) === -1 &&
    k > 10 &&  arr[k-11].product_name.toLowerCase().replace(/-/g,'').indexOf(item.product_name.split(' ')[0].toLowerCase().replace(/-/g,'')) === -1 &&
    k > 11 &&  arr[k-12].product_name.toLowerCase().replace(/-/g,'').indexOf(item.product_name.split(' ')[0].toLowerCase().replace(/-/g,'')) === -1 
     || k > 0 && item.article.toLowerCase().replace(/-/g,'') != arr[k-1].article.toLowerCase().replace(/-/g,'') ) || ifNextBrand(item, k, arr)
      || k == 0 
  }

// const checkSelected = () => {
//   suppliers.find(item=>(item.selected))  ? setSelected(parts.filter((item)=>(item.supplier == suppliers.find(item=>(item.selected))['title'] )  ) ) : null
// }



const setPartsData = (dd, search, supplier) => { 
  if(dd.result && dd.result == 'notFound'){
    setSuppliers(suppliers => suppliers.map(item => (item.title == supplier ? {...item, class: 'notfound'} : {...item} )) ) 
  }
  else if (dd.result && dd.result == 'noConnection')
    setSuppliers(suppliers => suppliers.map(item => (item.title == supplier ? {...item, class: 'noConnection'} : {...item} )) ) 
else    
    {
      setParts(prev => [...prev, ...dd]), 
      setSuppliers(suppliers =>suppliers.map(item => (item.title == supplier ? {...item, class: 'found'} : {...item} )) ),
      setBrands(prev=>[...prev, ...[...new Map(dd.map(item => ( {brand: item.brand} )).map((item) => [item["brand"], item])).values()] ] ), 
      setNames(prev=>[...prev, ...dd.map(item => (  {product_name: item.product_name}  )).filter((power, toThe, yellowVests) =>yellowVests.map( updateDemocracy => updateDemocracy['product_name']?.toLowerCase().replace(/-/g,'').substring(0,1) ).indexOf(power['product_name']?.toLowerCase().replace(/-/g,'').substring(0,1)) === toThe) ]  ),
      setWarehouses(prev=>[...prev, ...[...new Map(dd.map(item => (  {warehouse_name: item.warehouse_name}  )).map((item) => [item["warehouse_name"], item])).values()] ] ),
      setSearch(search)
    }
}


  const getMikado = async (q, supplier) => { 

    const dd  = await getMikadoApi(q, supplier)
              
      if (dd?.length) {

        setPartsData(dd, search, supplier)

      } 
  }



  const getAvtoto = async (q, supplier) => { 

    const dd  = await getAvtotoApi(q, supplier)

    if (dd?.length) {
     
      setPartsData(dd, search, supplier)
   
      } 
  }

  

  const getForumAvto = async (q, supplier) => { 

    const dd  = await getForumAvtoApi(q, supplier)

    if (dd?.length) {
     
      setPartsData(dd, search, supplier)
   
      } 
  }
  
  

  
  const child1 = useMemo(() =><Brands
    items={brands}
    selectAllBrands={selectAllBrands}
    sortByBrand={sortByBrand}
    clearBrandsFilter={clearBrandsFilter}
    setFilterValue={setFilterValue}
    selectOneBrand={selectOneBrand }
    change = {change}
    type='brand'
    divClass = 'brands'
  />, [brands]
  )

  const child2 = useMemo(() =><Brands
    items={warehouses}
    selectAllBrands={selectAllBrands}
    sortByBrand={sortByBrand}
    clearBrandsFilter={clearBrandsFilter}
    setFilterValue={setFilterValue}
    selectOneBrand={selectOneBrand }
    change = {change}
    type='warehouse_name'
      divClass = 'warehouse'
  />, [warehouses]
  )

  const child3 = useMemo(() =><Brands
    items={names}
    selectAllBrands={selectAllBrands}
    sortByBrand={sortByBrand}
    clearBrandsFilter={clearBrandsFilter}
    setFilterValue={setFilterValue}
    selectOneBrand={selectOneBrand }
    change = {change}
    type='product_name'
    divClass = 'names'
  />, [names]
  )

  const child4 = useMemo(() =><Nacenki
    nacenki={nacenki}
    setNacenkiOpened = {setNacenkiOpened}
    nacenkiOpened = {nacenkiOpened}
    notify = {notify}
    setNacenki = {setNacenki}
  />, [nacenki, nacenkiOpened]
  )

  

  return (
    <>
    <p id="notification" className={`${!notification.on ? 'hidden' : ''} ${notification.status || ''}`}>{notification.text}</p>

    {child4}

{loading  ? <Loader /> :  <button className="top" onClick={topFunction}>&uarr;</button> }
      <form onSubmit={handleSubmit}>
        <input id="input" type="text" style={{height: '30px', paddingLeft: '5px'}} />
        <input style={{height: '30px'}}  type="submit" value={loading 
          ? 'Ищу...'
          : 'Поиск'}/> 
      </form>
      {/* <p style={{color: '#eb0040', fontWeight: 'bold'}}>Фаворит и Профитлига отключены чужие склады!!!</p> */}
      <div style={{display: 'flex', flexDirection:'column', alignItems: 'flex-end', marginRight: '50px'}}>
        <a href="#" onClick={()=>setShowZakupochnyje(prev=> !prev)}   style={{textDecoration:'underline'}}>{showZakupochnyje ? 'Спрятать' : 'Показать'}</a>
        <p onClick={setNacenkiOpenedHandler} style={{fontStyle: 'italic', cursor:'pointer', textDecoration:'underline', marginBottom:'0px'}}>Установить наценки</p>
        <p style={{fontStyle: 'italic'}}><b>Сортируется по:</b> {sortOrderName[sortOrder]}</p>
      </div>

          {child1}
          {child2}
          {child3}
       {/* <MemoizedBrands
          items={brands.map(item=>(item.brand != '' && {brand: item.brand})) }
          selectAllBrands={selectAllBrands}
          sortByBrand={sortByBrand}
          clearBrandsFilter={clearBrandsFilter}
          setFilterValue={setFilterValue}
          selectOneBrand={selectOneBrand }
          type='brand'
          divClass = 'brands'
       />

       <MemoizedBrands
          items={brands.map(item=>(item.warehouse_name != '' && {warehouse_name: item.warehouse_name})) }
          selectAllBrands={selectAllBrands}
          sortByBrand={sortByBrand}
          clearBrandsFilter={clearBrandsFilter}
          setFilterValue={setFilterValue}
          selectOneBrand={selectOneBrand }
          type='warehouse_name'
          divClass = 'warehouse'
       />
 

       <MemoizedBrands
          items={brands.map(item=>(item.product_name != '' && {product_name: item.product_name})) }
          selectAllBrands={selectAllBrands}
          sortByBrand={sortByBrand}
          clearBrandsFilter={clearBrandsFilter}
          setFilterValue={setFilterValue}
          selectOneBrand={selectOneBrand }
          type='product_name'
          divClass = 'names'
       />  */}
      <div className="suppliers">
      <span onClick={()=>setOpened(!opened)} id='show' className="hidden" style={opened ? {background: '#cac9ff'} : null}>Показать {opened ? 'только первые' :  'все запчасти'}</span>
        <span onClick={selectAllSuppliers} id='allSuppliers' className={allSuppliers ? '' : 'hidden'} style={{background: '#c9f0ff'}}>Все поставщики</span>
          {suppliers.map((item, k)=>(<span style={item.selected === true ? {background: '#8cdd8c'} : null} onClick={selectOne} className={item.class} key={k}>{item.title}</span>))} 
      </div>
      {selected && selected.length  ?
      
      <table>
      <thead>
        <tr>
        <th>Артикул</th>
            <th>Производитель</th>
            <th colSpan='2'>Название</th>
            <th>Кол-во</th>
            <th onClick={sortDeliveryDate} className={sortOrder == 'price' ? 'sort' : null} >Срок</th>
            {showZakupochnyje ? <th>Цена зак</th> : null}
           <th onClick={sortPrice} className={sortOrder == 'delivery'  ? 'sort' : null} >Цена</th>
            <th>Поставщик</th>
            <th>Склад</th>
        </tr>
      </thead> 
      <tbody> 
      {(opened ? sort(selected, search, sortOrder) : getFewDuplicates( sort(selected, search, sortOrder), 'brand', 3) )
      .map((item, k, arr)=>(
            <tr className={`${ifNextArticle(item, k, arr) && !opened ? 'articled' : ''}`} key={k} >
                <td style={ifNextArticle(item, k, arr) ? {background:'#d7d7d7'} : null}>{ifNextArticle(item, k, arr)  ? item.article : ''}</td>  
                <td title={
                  ifNextBrand(item, k, arr)   ? item.brand : ''
                } style={
                  ifNextBrand(item, k, arr)  ? {background:'#f0f1ed', fontWeight:'bold'} : null
                } onClick={selectOneBrand}>{ ifNextBrand(item, k, arr)  ? item.brand : ''}</td>
                <td>{ifNextName(item, k, arr)  ? item.product_name : ''}</td>
                <td style={{width:'50px'}}><a href={`https://www.google.ru/search?q=${search}%20${item.brand}&tbm=isch`} target='_blank'  rel="noopener noreferrer" ><img className="google" width='20' src='./google.svg' /></a></td>
                <td style={{textAlign: 'center', width: '100px', background: '#eff1fb'}}>{item.quantity}</td>
                <td style={{textAlign: 'center', width: '150px', background: '#effbf6', maxWidth: '100px'}}>{item.delivery_duration} дн.</td>
                {showZakupochnyje ?  <td style={{textAlign: 'center', width: '150px', whiteSpace: 'nowrap', background: '#fbefef'}}>{ Number( item.price ) > 0 && `${ formatPrice(item.price) } р.` }</td> : null}
                <td title={formatPrice(item.price)}  style={{textAlign: 'center', width: '150px', whiteSpace: 'nowrap', background: '#fbefef', fontWeight: 'bold'}}>{ Number( item.price ) > 0 && `${ formatPrice(item.price * (1 + nacenki.filter(it=>(it.name == item.supplier))[0].price / 100)) } р.` }</td>
                <td onClick={selectOne} style={{textAlign: 'center', color: item.color || '#ff6a00', whiteSpace: 'nowrap', fontSize: '13px', cursor: 'pointer', maxWidth: '100px', width: '100px'}}><b>{item.supplier}</b></td>
                <td style={{textAlign: 'center', color: item.color || '#ff6a00', fontSize: '13px', maxWidth: '120px', width: '120px'}}>{item.warehouse_name}</td>
            </tr>
        ))}
        </tbody>
          </table>
          : 
          <table>
      <thead>
        <tr>
            <th>Артикул</th>
            <th>Производитель</th>
            <th colSpan='2'>Название</th>
            <th>Кол-во</th>
            <th onClick={sortDeliveryDate} className={sortOrder == 'price'  ? 'sort' : null} >Срок</th>
            {showZakupochnyje ?   <th>Цена зак</th> : null}
            <th onClick={sortPrice} className={sortOrder == 'delivery' ? 'sort' : null} >Цена</th>
            <th>Поставщик</th>
            <th>Склад</th>
        </tr>
      </thead>
      <tbody> 
      {(opened ? sort(parts, search, sortOrder) : getFewDuplicates( sort(parts, search, sortOrder), 'brand', 3) )
      .map((item, k, arr)=>(  
        <tr key={k} className={`${ifNextBrand(item, k, arr)  ? 'bordered' : ''} ${ifNextArticle(item, k, arr) && !opened  ? 'articled' : ''}`} >
        <td style={ifNextArticle(item, k, arr) ? {background:'#d7d7d7'} : null}>{ifNextArticle(item, k, arr)  ? item.article : ''}</td>
        <td title={
          ifNextBrand(item, k, arr)  ? item.brand : ''
        } style={
          ifNextBrand(item, k, arr)  ? {background:'#f3f3f3', fontWeight:'bold'} : null
        } onClick={selectOneBrand}>{ifNextBrand(item, k, arr)  ? item.brand : ''}</td>
        <td>{ifNextName(item, k, arr)  ? item.product_name : ''}</td>
        <td style={{width:'50px'}}><a href={`https://www.google.ru/search?q=${search}%20${item.brand}&tbm=isch`} target='_blank'  rel="noopener noreferrer" ><img className="google" width='20' src='./google.svg' /></a></td>
        <td style={{textAlign: 'center', width: '100px', background: '#eff1fb'}}>{item.quantity}</td>
        <td style={{textAlign: 'center', width: '150px', background: '#effbf6', maxWidth: '100px'}}>{item.delivery_duration} дн.</td>
        {showZakupochnyje ?  <td style={{textAlign: 'center', width: '150px', whiteSpace: 'nowrap', background: '#fbefef'}}>{ Number( item.price ) > 0 && `${ formatPrice(item.price) } р.` }</td> : null}
        <td title={formatPrice(item.price)}  style={{textAlign: 'center', width: '150px', whiteSpace: 'nowrap', background: '#fbefef', fontWeight: 'bold'}}>{ Number( item.price ) > 0 && `${ formatPrice(item.price * (1 + nacenki.filter(it=>(it.name == item.supplier))[0].price / 100)) } р.` }</td>
        <td onClick={selectOne} style={{textAlign: 'center', color: item.color || '#ff6a00', whiteSpace: 'nowrap', fontSize: '13px', cursor: 'pointer', width: '100px', maxWidth: '100px'}}><b>{item.supplier}</b></td>
        <td style={{textAlign: 'center', color: item.color || '#ff6a00', fontSize: '13px', maxWidth: '120px', width: '120px'}}>{item.warehouse_name}</td>
    </tr>  
))} 
        </tbody>
          </table> 
      }
    </>
  )
}

export default App;
