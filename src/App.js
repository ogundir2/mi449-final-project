import { useState } from "react";
import { supabase } from "./supabaseClient";
import './App.css';
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
import { hover } from "@testing-library/user-event/dist/hover";

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
      <AppBar sx={{ backgroundColor: "primary.main" }} position="sticky">
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
  const [mySemesters, setMySemesters] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [clickedSemester, setClickedSemester] = useState(0);
  

  async function getSemesters() {
    let { data: semesters, error} = await supabase
      .from("semesters")
      .select("*");
    
    if (error) {
      console.log(error);
    } else {
      setMySemesters(semesters);
    }
  }
  
  async function getCourses() {
      let { data: courses, error} = await supabase
      .from("courses")
      .select("*");

      if (error) {
      } else {
        setMyCourses(courses);
        const totalCredits = courses.reduce(
          (accumulator, currentValue) => accumulator + currentValue.course_credits,
          0
        );
      }
  }

  function handleClick(sem_id) {
    if (clickedSemester === sem_id) {
      setClickedSemester(0);
    } else {
      setClickedSemester(sem_id);
    }
  }

  getSemesters();
  getCourses();

  return (
    <Box sx={{ gridGap: 5, display: 'flex', padding: 5}}>
      <Box sx={{ borderRadius: 2, padding: 1, flex: 1, backgroundColor: "special.main" }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Semesters
        </Typography>
        <List>
          {
            mySemesters.map(s => (
              <ListItem >
                {clickedSemester === s.id ? 
                <ListItemButton sx={{ backgroundColor: "action.main", border: "solid", borderColor: "action.main", borderWidth: 1.5, borderRadius: 1, }} onClick={() => handleClick(s.id)}>
                  <ListItemText primary={s.semester_name} />
                </ListItemButton> : 
                <ListItemButton sx={{ border: "solid", borderColor: "action.main", borderWidth: 1.5, borderRadius: 1, }} onClick={() => handleClick(s.id)}>
                  <ListItemText primary={s.semester_name} />
                </ListItemButton>
              } 
                
              </ListItem>
            ))
          }
        </List>
      </Box>

      <Box sx={{borderRadius: 2, padding: 1, flex: 1, backgroundColor: "special.main"}}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Courses
        </Typography>
        <List>
        {
            myCourses.filter(c => {
              if (clickedSemester === 0 ) return true;

              if (c.semester_id === clickedSemester) return true;

              return false;
            }).map(c => (
              <ListItem disablePadding>
                
                  <ListItemText primary={c.course_name} secondary={"Credits: "+c.course_credits}/>
                
              </ListItem>
            ))
          }
        </List>
      </Box>
    </Box>
  );
}

function App() {
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
