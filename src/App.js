import { useState } from "react";
import { supabase } from "./supabaseClient";
import './App.css';
import { Container } from "@mui/material";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import { useTheme } from "@emotion/react";
import { ThemeProvider } from "@emotion/react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

const myTheme = createTheme({
  palette: {
    primary: {
      main: '#053c5e',
      contrast: '#fff',
    },
    secondary: {
      main: '#fff',
      contrast: '#053c5e',
    },
    special: {
      main: "#bfdbf7"
    },
    error: {
      main: "#db222a",
    },
    action: {
      main: "#1f7a8c",
    }
  },
});

function ButtonAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar sx={{ backgroundColor: "primary.main" }} position="static">
        <Toolbar >
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            Course Tracker
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

function Content() {
  return (
    <Box sx={{ gridGap: 5, display: 'flex', padding: 5}}>
      <Box sx={{ borderRadius: 2, padding: 1, flex: 1, backgroundColor: "special.main" }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Semesters
        </Typography>
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Trash" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component="a" href="#simple-list">
              <ListItemText primary="Spam" />
            </ListItemButton>
          </ListItem>
        </List>
        <Typography variant="h6" component="div" sx={{ fontSize: 14, flexGrow: 1 }}>
          Total Semesters: 0
        </Typography>
      </Box>

      <Box sx={{borderRadius: 2, padding: 1, flex: 1, backgroundColor: "special.main"}}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Courses
        </Typography>
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Trash" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component="a" href="#simple-list">
              <ListItemText primary="Spam" />
            </ListItemButton>
          </ListItem>
        </List>
        <Typography variant="h6" component="div" sx={{ fontSize: 14, flexGrow: 1 }}>
          Total Credits: 0
        </Typography>
      </Box>
    </Box>
  );
}

function App() {
  const theme = useTheme();

  return (
    <ThemeProvider theme={myTheme}>
      <div>
        <ButtonAppBar />
        <Content/>
      </div>
    </ThemeProvider>
  );
}

export default App;
