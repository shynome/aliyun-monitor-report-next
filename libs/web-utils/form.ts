import { useState } from "react";

export type ChangeHandler = React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>

export const useFormField = <T=string>(defaultValue:T):[T,ChangeHandler]=>{

  let [ value, setValue ] = useState(defaultValue)
  
  let handleChange:ChangeHandler = (e:any)=>{
    setValue(e.target.value)
  }
  
  return [ value, handleChange ]
  
}
