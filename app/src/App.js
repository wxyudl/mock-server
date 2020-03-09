import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    marginBottom: 8
  },
  container: {
    boxShadow: '1px 1px 10px #ccc',
    padding: 0,
    minHeight: '100vh',
  },
}));

export default function App() {
  const classes = useStyles();
  const [mocks, setMocks] = useState([]);
  const [open, setOpen] = useState(false);
  const [openTest, setOpenTest] = useState(false);
  const [method, setMethod] = React.useState('GET');
  const [name, setName] = React.useState('');
  const [payload, setPayload] = React.useState('{}');
  const mockServer = 'http://localhost:3100';

  const StyledTableCell = withStyles(theme => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);

  const StyledTableRow = withStyles(theme => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.background.default,
      },
    },
  }))(TableRow);

  const handleCloseEditDialog = () => {
    setMethod('');
    setName('');
    setPayload('{}');

    setOpen(false);
  };

  const handleCloseTestDialog = () => {
    setMethod('');
    setName('');
    setPayload('{}');

    setOpenTest(false);
  };

  const handleSave = async () => {
    await newMockHandle();
    handleCloseEditDialog();

    getAllMocks();
  }

  const handleEdit = ({ method, name }) => {
    setMethod(method);
    setName(name);
    setPayload('Loading ...');

    fetch(`${ mockServer }/mock/${ name }`).then(res => res.json()).then(d => {
      setPayload(JSON.stringify(d));
    });

    setOpen(true);
  }

  const handleTest = ({ method, name }) => {
    setMethod(method);
    setName(name);
    setPayload('Loading ...');

    fetch(`${ mockServer }/mock/${ name }`).then(res => res.json()).then(d => {
      setPayload(JSON.stringify(d));
    });

    setOpenTest(true);
  }

  const newMockHandle = async () => {
    await fetch(`${ mockServer }/_/mocks`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        method,
        payload
      })
    }).then(res => {
      console.info(res);
    })
  }

  const getAllMocks = () => {
    fetch(`${ mockServer }/_/mocks`).then(res => res.json()).then(d => {
      setMocks(d);
    })
  }

  useEffect(() => {
    getAllMocks();
  }, []);

  return (
    <div className={ classes.root }>
      <Container maxWidth="md" className={ classes.container }>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Online Mock Server
            </Typography>
          </Toolbar>
        </AppBar>
        <Box p={ 3 }>
          <Grid container style={{ marginBottom: 20 }}>
            <Grid item xs={6}>
              <Typography variant="h6">All Mocks</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6" align="right">
                <Button color="primary" variant="contained" onClick={ () => setOpen(true) }><AddIcon /> New mock</Button>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">Mock server: <span style={{ color: '#C62828' }}>{ mockServer }</span></Typography>
            </Grid>
          </Grid>
          <TableContainer component={Paper}>
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell align="right">Method</StyledTableCell>
                  <StyledTableCell align="right">Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  mocks.length ? mocks.map(mock => (
                    <StyledTableRow key={ mock.name }>
                      <StyledTableCell component="th" scope="row">
                        /mock/{ mock.name }
                      </StyledTableCell>
                      <StyledTableCell align="right">{ mock.method }</StyledTableCell>
                      <StyledTableCell align="right">
                        <Button variant="outlined" onClick={ () => handleEdit({ method: mock.method, name: mock.name }) } style={{ marginRight: 12 }}><EditIcon fontSize="small" /> Edit</Button>
                        <Button variant="outlined" onClick={ () => handleTest({ method: mock.method, name: mock.name }) }><PlayArrowIcon fontSize="small" />  Test</Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  )) : (
                    <Box p={ 2 } style={{ opacity: .5 }}>No data</Box>
                  )
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
      <Dialog open={ open } onClose={ handleCloseEditDialog } aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">New mock</DialogTitle>
        <DialogContent style={{ width: 400 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label" shrink={ true }>Method</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={ method }
              onChange={ e => setMethod(e.target.value) }
            >
              <MenuItem value="GET">GET</MenuItem>
              <MenuItem value="POST">POST</MenuItem>
              <MenuItem value="PUT">PUT</MenuItem>
              <MenuItem value="DELETE">DELETE</MenuItem>
            </Select>
          </FormControl>
          <Box my={ 2 }>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={ name }
              onChange={ e => setName(e.target.value) }
              InputProps={{
                startAdornment: <InputAdornment position="start">/mock/</InputAdornment>,
              }}
            />
          </Box>
          <TextField
            id="standard-multiline-flexible"
            label="Response Data"
            multiline
            rows="10"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={ payload }
            onChange={ e => setPayload(e.target.value) }
          />
        </DialogContent>
        <DialogActions style={{ margin: 15, justifyContent: 'left' }}>
          <Button onClick={ handleSave } color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={ openTest }
        onClose={ handleCloseTestDialog }
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Test mock</DialogTitle>
        <DialogContent style={{ width: 400 }}>
          <Box>
            <Typography variant="body1" className={classes.title}><strong>Method:</strong> { method }</Typography>
            <Typography variant="body1" className={classes.title}><strong>Endpoint:</strong> { `${ mockServer }/mock/${ name }` }</Typography>
            <Typography variant="body1" className={classes.title}><strong>Payload:</strong></Typography>
            <Box style={{ backgroundColor: '#e4e4e4', padding: 10, fontSize: 14 }}>
              { payload }
            </Box>
          </Box>
        </DialogContent>
        <DialogActions style={{ margin: 15, justifyContent: 'left' }}>
          <Button onClick={ handleCloseTestDialog } color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}