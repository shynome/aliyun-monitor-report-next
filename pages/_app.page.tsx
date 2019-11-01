import React from 'react';
import App, { Container } from 'next/app';
import { ThemeProvider } from '@material-ui/styles';
import { SnackbarProvider } from "notistack";
import { CssBaseline, NoSsr } from '@material-ui/core';
import { theme } from './theme';

class MyApp extends App {
  
  render() {
    const { Component, pageProps, } = this.props;

    return (
      <NoSsr>
        <SnackbarProvider>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        </SnackbarProvider>
      </NoSsr>
    );
  }
}

export default MyApp;
