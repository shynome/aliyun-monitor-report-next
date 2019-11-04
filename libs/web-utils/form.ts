import { useState } from "react";

export type ChangeHandler = React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>

export const useFormField = <T = string>(defaultValue: T): [T, ChangeHandler] => {

  let [value, setValue] = useState(defaultValue)

  let handleChange: ChangeHandler = (e: any) => {
    setValue(e.target.value)
  }

  return [value, handleChange]

}


export const useFormFields = <T extends object>(defaultFields: T): [T, (t: keyof T) => ChangeHandler] => {

  let [fields, setFields] = useState(defaultFields)

  let saveFormField = (t: keyof T): ChangeHandler => (e: any) => {
    setFields({
      ...fields,
      [t]: e.target.value
    })
  }

  return [fields, saveFormField]

}
