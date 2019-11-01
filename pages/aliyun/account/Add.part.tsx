import {
  makeStyles,
  TextField, Button, useTheme,
} from "@material-ui/core";
import { localAccountStore } from "../account";
import { useFormField } from "~libs/web-utils/form";

const useStyles = makeStyles(theme => ({
  input: {
    marginBottom: '10px',
  },
  submit: {
    margin: '10px 0 0',
  },
}))

export const AccountAdd: React.StatelessComponent = () => {

  const styles = useStyles(useTheme())

  const [uniqueName, setUniqueName] = useFormField('')
  const [AccessKey, setAccessKey] = useFormField('')
  const [AccessKeySecret, setAccessKeySecret] = useFormField('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let a = await localAccountStore.add({
      displayName: uniqueName,
      token: AccessKey + ':' + AccessKeySecret,
    })
    console.log(a)
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label={'显示名'}
        className={`${styles.input}`}
        required
        onChange={setUniqueName}
        fullWidth
      />
      <TextField
        label={'阿里云 AccessKey'}
        className={`${styles.input}`}
        required
        onChange={setAccessKey}
        fullWidth
      />
      <TextField
        label={'阿里云 AccessKeySecret'}
        className={`${styles.input}`}
        required
        onChange={setAccessKeySecret}
        fullWidth
      />
      <Button className={styles.submit} type='submit' fullWidth size='large' variant='contained' color='primary'>
        添加新帐号
      </Button>
    </form>
  )
}