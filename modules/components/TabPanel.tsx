import React from "react";
import { Typography, Box } from "@material-ui/core";

export interface TabPanelProps<T> {
  index: T;
  value: T;
  children: React.ReactNode,
}


export function TabPanel<T>(props: TabPanelProps<T>) {
  const { children, value, index, ...other } = props;
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      aria-labelledby={`wrapped-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

export default TabPanel
