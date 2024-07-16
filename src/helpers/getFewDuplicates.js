
const getFewDuplicates =  (arr, field, count = 1) => {
    const uniqueIds = [];
    const uniqEls = [];
    
    arr.map(element => {
      const isDuplicate = uniqueIds.includes(element[field]) && uniqueIds.filter(item=> item == element[field]).length > count
    
      if (!isDuplicate) {
          uniqEls.push(element);
          uniqueIds.push(element[field]);
        return true;
      }
      return false;
    });
    
    return uniqEls
    }

export default getFewDuplicates 