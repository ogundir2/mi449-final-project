import { useState } from "react";
import { supabase } from "./supabaseClient";
import './App.css';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from "@emotion/react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import LinearProgress from '@mui/material/LinearProgress';

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
  const [season, setSeason] = useState('');
  const [year, setYear] = useState(0);
  const [courseName, setCourseName] = useState('');
  const [credits, setCredits] = useState(0);
  const [courseCompleted, setCourseCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  

  async function getSemesters() {
    let { data: semesters, error} = await supabase
      .from("semesters")
      .select("*");
    
    if (error) {
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
        
        let totalCrdts = 0;
        let completedCrdts = 0;
        for (let i=0; i < myCourses.length; i++) {
          let c = myCourses[i];
          totalCrdts += c.course_credits;

          if (c.course_completed) completedCrdts += c.course_credits;
        }

        setProgress(completedCrdts * 100 / totalCrdts);
      }
  }

  function handleClick(sem_id) {
    console.log(sem_id);
    if (clickedSemester === sem_id) {
      setClickedSemester(0);
    } else {
      setClickedSemester(sem_id);
    }
  }

  const handleSeasonChange = (event) => {
    setSeason(event.target.value);
  };

  const handleYearChange = (event, date) => {
    console.log(event, date);
    setYear(event.$y);
  };

  async function addSemester() {
    if (!["Fall", "Spring", "Summer"].includes(season)) {
      alert("Please select a valid season!");
      return;
    }

    if (year < 1900 || year > 2100 ) {
      alert("Please select a valid year!");
      return;
    }

    const sem = `${season} ${year}`;

    let duplicate = false;

    mySemesters.forEach(mySem => {
      if (mySem.semester_name === sem) {
        duplicate = true;
      }
    });

    if (duplicate) {
      alert("The semester is already in your list!");
      return;
    }
    
    const { data, error } = await supabase
    .from('semesters')
    .insert([
      { "semester_name": sem },
    ])

    if (error) {
      console.log(error);
    } else {
      console.log(data)
    }
  }

  const handleCourseNameChange = (event) => {
    setCourseName(event.target.value);
  };

  const handleCreditsChange = (event) => {
    setCredits(event.target.value);
  };

  const handleCourseCompletedChange = (event) => {
    setCourseCompleted(event.target.checked);
  };

  async function addCourse() {
    if (credits < 1 || credits > 4) {
      alert("Please select a valid number of credits!");
      return;
    }

    if (courseName.length < 2) {
      alert("Please input a valid course name!");
      return;
    }

    let duplicate = false;

    myCourses.forEach(myCourse => {
      if (myCourse.course_name.toLowerCase() === courseName.toLowerCase()) {
        duplicate = true;
      }
    });

    if (duplicate) {
      alert("The course is already in your list!");
      return;
    }

    if (clickedSemester <= 0) {
      alert("Please select a semester before adding a course!");
      return;
    }
    
    console.log(courseName, credits, clickedSemester, courseCompleted);
    
    const { data, error } = await supabase
    .from('courses')
    .insert([
      { "course_name": courseName, "semester_id": clickedSemester, "course_completed": courseCompleted, "course_credits": credits },
    ])

    if (error) {
      console.log(error);
    } else {
      console.log(data)
    }
  }

  getSemesters();
  getCourses();

  return (
    <Box sx={{height: 0.75, padding: 5}}>

      <Box sx={{marginBottom: 3}}>
        Course Completion %
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <Typography variant="body2" color="text.secondary">{`${Math.round(
              progress,
            )}%`}</Typography>
          </Box>
        </Box>
      </Box>
    
      <Box sx={{ gridGap: 10, display: 'flex', height: 0.9}}>
        <Box sx={{ borderRadius: 2, padding: 2, flex: 1, backgroundColor: "special.main" }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Semesters
          </Typography>
          <List sx={{height: 0.7, marginBottom: 1, overflowY: "auto"}}>
            {
              mySemesters.map(s => (
                <ListItem disablePadding sx={{ marginBottom: 1 }} >
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
          <Box>
            <Typography sx={{marginBottom: 0.5, fontWeight: 500, fontSize: 14}} variant="p" component="p">
              Add Semester
            </Typography>
            <Box sx={{ display: "flex", }}>
              <FormControl sx={{ width: 1, marginRight: 1 }} size="medium">
                <InputLabel>Season</InputLabel>
                <Select
                  sx={{ borderColor: "primary.main" }}
                  value={season}
                  label="Season"
                  onChange={handleSeasonChange}
                >
                  <MenuItem value="Fall">Fall</MenuItem>
                  <MenuItem value="Spring">Spring</MenuItem>
                  <MenuItem value="Summer">Summer</MenuItem>
                </Select>
              </FormControl>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker onChange={handleYearChange.bind(this)} sx={{ marginRight: 1}} label={'Year'} openTo="year" views={['year']} />
              </LocalizationProvider>
              <Button onClick={addSemester} variant="contained" aria-label="add-semester" size="small">
                <AddIcon sx={{ color: "primary.contrast", fontSize: 28 }} />
              </Button>
            </Box>
          </Box>
        </Box>

        <Box sx={{borderRadius: 2, padding: 2, flex: 1, backgroundColor: "special.main"}}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {
              clickedSemester > 0 ?
              `${mySemesters.filter(mySem => mySem.id === clickedSemester)[0].semester_name} Courses`:
              'All Courses'
            }
          </Typography>
          <List sx={{height: 0.7, marginBottom: 1, overflowY: "auto"}}>
          {
              myCourses.filter(c => {
                if (clickedSemester === 0 ) return true;

                if (c.semester_id === clickedSemester) return true;

                return false;
              }).map(c => (
                <ListItem disablePadding>
                  <ListItemButton sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <ListItemText primary={c.course_name} secondary={"Credits: "+c.course_credits}/>
                    {
                      c.course_completed ? 
                      <CheckCircleIcon sx={{color: "action.main"}} /> :
                      <RadioButtonUncheckedIcon sx={{color: "action.main"}} />
                    }
                  </ListItemButton>
                </ListItem>
              ))
            }
          </List>
          <Box>
            <Typography sx={{marginBottom: 0.5, fontWeight: 500, fontSize: 14}} variant="p" component="p">
              Add Course
            </Typography>
            <Box sx={{ display: "flex", }}>
            <TextField value={courseName} onChange={handleCourseNameChange} sx={{ width: 1, marginRight: 1 }} id="outlined-basic" label="Course Name" variant="outlined" />
            <FormControl sx={{ width: 1, marginRight: 1 }} size="medium">
                <InputLabel>Credits</InputLabel>
                <Select
                  sx={{ borderColor: "primary.main" }}
                  value={credits}
                  label="Credits"
                  onChange={handleCreditsChange}
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                </Select>
              </FormControl>
              <FormGroup>
                <FormControlLabel onChange={handleCourseCompletedChange} labelPlacement="top" control={<Checkbox />} label="Completed" />
              </FormGroup>
            <Button onClick={addCourse} variant="contained" aria-label="add-course" size="small">
              <AddIcon sx={{ color: "primary.contrast", fontSize: 28 }} />
            </Button>
          </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={myTheme}>
      <div className="app-container">
        <ButtonAppBar />
        <Content/>
      </div>
    </ThemeProvider>
  );
}

export default App;
