import logo from './logo.svg';
import './App.css';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import yellow from '@material-ui/core/colors/yellow';
import pink from '@material-ui/core/colors/pink';
import TopBar from './ui/TopBar'
import FooterBar from './ui/FooterBar'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core/styles'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import ClientesList from './routed/ClientesList'
import ClientesForm from './routed/ClientesForm'
const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: yellow[500],
    },
    secondary: {
      main: pink[500],
    },
  },
});
const useStyles = makeStyles((theme) => ({
  main: {
    backgroundColor: theme.palette.background.default,
    paddingBottom: '42px',  // evita que o footer cubra o conteúdo
    minHeight: '100vh' // 100% da altura da área de visualização
  },
  routed: {
    padding: '25px',
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily
  }
}))
function Main() {
  const classes = useStyles()
  return (
    <Box className={classes.main}>
      <BrowserRouter> {/*  Inicia a região onde pode haver troca dinâmica de elementos */}
        <TopBar />
        <Box id="routed" className={classes.routed}>
          <Switch> {/* Determina qual elemento será exibido, de acordo com a rota */}
            
            <Route path="/list">
              <ClientesList />
            </Route>

            <Route path="/new">
              <ClientesForm />
            </Route>

            {/* :id é um parâmetro (espécie de variável de rota) */}
            <Route path="/edit/:id">
              <ClientesForm />
            </Route>

          </Switch>
        </Box>
        <FooterBar />
      </BrowserRouter>
    </Box>
  )
}
function App() {
  return (
    <ThemeProvider theme={theme}>
      <Main />
    </ThemeProvider>
  );
}

export default App;
