import cls from './Nacenki.module.css' 

const Nacenki = ({nacenki, setNacenkiOpened, nacenkiOpened, setNacenki, notify}) => { 
    const saveNacenki = async (el, nac) =>{ 
      if(el.value == '') return
     
          const res = await fetch('/api/nacenki', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({id: el.dataset.id, price: el.value.replace(/,/,'.')}),
          })
          if(res.status == 200){
            await setNacenki(nac.map(item=>(item.id == el.dataset.id ? {...item, price: el.value.replace(/,/,'.') } : {...item})))
            el.value = ''
            notify('Сохранено успешно!')
          }else{
            notify('Что-то пошло не так!', false)
          }
      }
    
    const closeNacenki = e => {
       if( Object.values(e.target.classList).includes('popupWrap') )   setNacenkiOpened(false)
     }

    return(
        <div onClick={closeNacenki} className={`popupWrap ${!nacenkiOpened  ? 'hidden' : ''}`}>
            <form className="popup">
            <h3 style={{margin:'5px auto 10px'}}>Наценки</h3>
            <table className={cls.table}>
              <tbody>
            {nacenki.map(item=>(
                <tr key={item.id} >
                  <td>{item.name}</td>
                  <td><input onBlur={e=>saveNacenki(e.target, nacenki)} data-id={item.id} type='text' name={item.name}  /></td>
                  <td><b>{item.price || 0} %</b></td>
                </tr>
            ))}
            </tbody>
            </table>
            </form>
        </div>
    )
}

export default Nacenki
