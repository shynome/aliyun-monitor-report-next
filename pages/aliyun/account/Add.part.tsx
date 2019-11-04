import {
  makeStyles,
  TextField, Button, useTheme,
} from "@material-ui/core";
import { useFormField } from "~libs/web-utils/form";
import { localAccountStoreContainer } from "./useLocalAccountStore";
import { TabSelectStatusContainer, AccountPanelType } from "./TabSelectStatus";

export const useStyles = makeStyles(theme => ({
  input: {
    marginBottom: '10px',
  },
  submit: {
    margin: '10px 0 0',
  },
}))

export const AccountAdd: React.StatelessComponent = () => {

  const styles = useStyles(useTheme())
  const { accountManager } = localAccountStoreContainer.useContainer()
  const { setSelectedTab } = TabSelectStatusContainer.useContainer()

  const [uniqueName, setUniqueName] = useFormField('')
  const [AccessKey, setAccessKey] = useFormField('')
  const [AccessKeySecret, setAccessKeySecret] = useFormField('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await accountManager.add({
      displayName: uniqueName,
      accessKey: AccessKey,
      token: AccessKey + ':' + AccessKeySecret,
    })
    setSelectedTab(AccountPanelType.List)
    // reset
    let v = { target: { value: '' } }
    // @ts-ignore
    setUniqueName(v); setAccessKey(v); setAccessKeySecret(v)
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label={'显示名'}
        className={`${styles.input}`}
        required
        onChange={setUniqueName}
        value={uniqueName}
        fullWidth
      />
      <TextField
        label={'阿里云 AccessKey'}
        className={`${styles.input}`}
        required
        onChange={setAccessKey}
        value={AccessKey}
        fullWidth
      />
      <TextField
        label={'阿里云 AccessKeySecret'}
        className={`${styles.input}`}
        required
        onChange={setAccessKeySecret}
        value={AccessKeySecret}
        fullWidth
      />
      <Button className={styles.submit} type='submit' fullWidth size='large' variant='contained' color='primary'>
        添加新帐号
      </Button>
    </form>
  )
}