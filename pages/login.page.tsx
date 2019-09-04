import React from "react";
import { NextPage } from "next";
import { CardContent, Card, CardHeader, CardActions, Button, TextField } from "@material-ui/core";
import { useFormField } from "~utils/form";
import { useSnackbar } from "notistack";
if (process.browser) {
  import('./auth')
}

async function login(AccessKey: string, AccessKeySecret: string) {
  const { setToken, encryptToken, checkToken } = await import("./auth");
  let token = encryptToken(AccessKey, AccessKeySecret)
  console.log(token)
  await checkToken(token)
  setToken(token)
}

export const Login: NextPage<{ AUTH_PUBLIC_PEM: string }> = (props) => {

  // @ts-ignore
  if (typeof global.AUTH_PUBLIC_PEM === 'undefined') { global.AUTH_PUBLIC_PEM = props.AUTH_PUBLIC_PEM }

  const { enqueueSnackbar } = useSnackbar()
  let [AccessKey, handleAccessKeyChange] = useFormField('')
  let [AccessKeySecret, handleAccessKeySecretChange] = useFormField('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    login(AccessKey, AccessKeySecret).then(
      () => {
        enqueueSnackbar('登录成功, 切换首页查看报表', {
          autoHideDuration: 2e3,
        })
      },
      (err) => {
        enqueueSnackbar('登录失败', {
          autoHideDuration: 2e3
        })
        console.error(err)
      }
    )
  }

  return (
    <form action="" onSubmit={onSubmit}>
      <Card style={{ maxWidth: 600, margin: '50px auto' }}>
        <CardHeader title='设置' style={{ paddingBottom: 0 }} />
        <CardContent>
          <TextField
            label={'AccessKey'}
            required
            placeholder={'AccessKey'}
            fullWidth
            defaultValue={AccessKey}
            onChange={handleAccessKeyChange}
          />
          <TextField
            label={'AccessKeySecret'}
            required
            placeholder={'AccessKeySecret'}
            fullWidth
            defaultValue={AccessKeySecret}
            onChange={handleAccessKeySecretChange}
          />
        </CardContent>
        <CardActions>
          <Button type='submit'>登录</Button>
        </CardActions>
      </Card>
    </form>
  )
}

Login.getInitialProps = async () => {
  return { AUTH_PUBLIC_PEM: process.env['AUTH_PUBLIC_PEM'] }
}

export default Login
