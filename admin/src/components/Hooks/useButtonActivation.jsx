import { useState, useEffect } from 'react';

const useButtonActivation = (route) => {
  const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(false);
  const [createButtonDisabled, setCreateButtonDisabled] = useState(false);
  const [updateButtonDisabled, setUpdateButtonDisabled] = useState(false);

  useEffect(() => {
    let isMount = true;
    if (isMount) {
      //delete not active
      if(!route.crud[1]?.active){
        setDeleteButtonDisabled(true)
      }
      //create not active
      if(!route.crud[2]?.active){
        setCreateButtonDisabled(true)
      }
       //update not active
       if(!route.crud[3]?.active){
        setUpdateButtonDisabled(true)
      }
    }
    return () => {
      isMount = false;
    };
  }, [route]);

  return {
    deleteButtonDisabled,
    createButtonDisabled,
    updateButtonDisabled,
  };
};

export default useButtonActivation;