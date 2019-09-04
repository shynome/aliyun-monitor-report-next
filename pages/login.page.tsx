import React from "react";
import { NextPage } from "next";
import { CardContent, Card, CardHeader, CardActions, Button, TextField } from "@material-ui/core";
import { useFormField } from "~utils/form";
if (process.browser) {
  import('./auth')
}

export const Login: NextPage<{ AUTH_PUBLIC_PEM: string }> = (props) => {

  // @ts-ignore
  if (typeof global.AUTH_PUBLIC_PEM === 'undefined') { global.AUTH_PUBLIC_PEM = props.AUTH_PUBLIC_PEM }

  let [user, handleUserChange] = useFormField('')
  let [pass, handlePassChange] = useFormField('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const { setToken, encryptToken, checkToken } = await import("./auth");
    console.log(encryptToken(user, pass))
  }

  return (
    <form action="" onSubmit={onSubmit}>
      <Card style={{maxWidth:600, margin: '50px auto'}}>
        <CardHeader title='设置' style={{paddingBottom:0}} />
        <CardContent>
          <TextField
            label={'AccessKey'}
            required
            placeholder={'AccessKey'}
            fullWidth
            defaultValue={user}
            onChange={handleUserChange}
          />
          <TextField
            label={'AccessKeySecret'}
            required
            placeholder={'AccessKeySecret'}
            fullWidth
            defaultValue={pass}
            onChange={handlePassChange}
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
