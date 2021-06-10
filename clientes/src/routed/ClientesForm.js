import { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import InputMask from 'react-input-mask'
import { makeStyles } from '@material-ui/core/styles'
import InputAdornment from '@material-ui/core/InputAdornment'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import axios from 'axios'
import { useHistory, useParams } from 'react-router-dom'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'
import React from 'react'
import ConfirmDialog from '../ui/ConfirmDialog'

const useStyles = makeStyles(theme => ({
  form: {
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    maxWidth: '80%',
    margin: '0 auto',
    '& .MuiFormControl-root': {
      minWidth: '200px',
      maxWidth: '500px',
      margin: '0 24px 24px 0'
    }
  },
  toolbar: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-around',
    marginTop: '36px'
  }
}))

export default function ClientesForm() {
  const classes = useStyles()


  const formatChars = {
    'A': '[A-Za-z]',
    '0': '[0-9]',
    '#': '[0-9A-Ja-j]'
  }
  const cpfMask = '000.000.000-00'

  // Máscara para CPF: '000.000.000-00'
  // Máscara para CNPJ: '00.000.000/0000-00'
  const telefoneMask = '(00)0000-0000'


  // Máscara para CPF: '000.000.000-00'

  const [cliente, setCliente] = useState({
    id: null,
    nome: '',
    cpf: '',
    rg: '',
    logradouro: '',
    num_imovel: '',
    complemento: '',
    bairro: '',
    municipio: '',
    uf: '',
    telefone: '',
    email: ''
   
  })
  const [currentId, setCurrentId] = useState()

  const [importadoChecked, setImportadoChecked] = useState(false)

  const [sendBtnStatus, setSendBtnStatus] = useState({
    disabled: false,
    label: 'Enviar'
  })

  const [sbStatus, setSbStatus] = useState({
    open: false,
    severity: 'success',
    message: '' 
  })

  const [error, setError] = useState({
    nome: '',
    cpf: '',
    rg: '',
    logradouro: '',
    num_imovel: '',
    complemento: '',
    bairro: '',
    municipio: '',
    uf: '',
    telefone: '',
    email: ''
  
  })

  const [isModified, setIsModified] = useState(false)

  const [dialogOpen, setDialogOpen] = useState(false) // O diálogo de confirmação está aberto?

  const [title, setTitle] = useState('Cadastrar novo cliente')

  const history = useHistory()
  const params = useParams()

  // useEffect() para quando o formulário for carregado (só na inicialização)
  useEffect(() => {
    // Verificamos se a rota atual contém o parâmetro id
    // Em caso positivo, buscamos os dados no back-end e carregamos o formulário para edição
    if(params.id) {
      setTitle('Editar cliente')
      getData(params.id)
    }
  }, [])

  async function getData(id) {
    try {
      let response = await axios.get(`https://api.faustocintra.com.br/cliente/${id}`)
      setCliente(response.data)
    }
    catch(error) {

      setSbStatus({
        open: true,
        severity: 'error',
        message: 'Não foi possível carregar os dados para edição.'
      })
    }
  }

  function handleInputChange(event, property) {

    const clienteTemp = {...cliente}

    setCurrentId(event.target.id)
    if(event.target.id) property = event.target.id

    if(property === 'importado') {
      const newState = ! importadoChecked // Inverte o valor
      if(newState) clienteTemp.importado = '1'
      else clienteTemp.importado = '0'
      setImportadoChecked(newState) 
    }
    else if(property === 'placa') {
      clienteTemp.placa = event.target.value.toUpperCase()
    }
    else {
      // Quando o nome de uma propriedade de objeto aparece entre [],
      // significa que o nome da propriedade será determinado pela
      // variável ou expressão contida dentro dos colchetes
      clienteTemp[property] = event.target.value
    }
    setCliente(clienteTemp)
    setIsModified(true)   // O formulário foi modificado
    validate(clienteTemp)  // Dispara a validação
  }

  function validate(data) {
    let isValid = true

    const errorTemp = {
      nome: '',
    cpf: '',
    rg: '',
    logradouro: '',
    num_imovel: '',
    complemento: '',
    bairro: '',
    municipio: '',
    uf: '',
    telefone: '',
    email: ''
    
    }

    // trim(): retira espaços em branco do início e do final de uma string
    if(data.nome.trim() === '') {
      errorTemp.nome = 'O nome deve ser preenchida'
      isValid = false
    }     
    if(data.cpf.trim() === '') {
      errorTemp.cpf = 'O cpf deve ser preenchida'
      isValid = false
    }     
    if(data.rg.trim() === '') {
      errorTemp.rg = 'O rg deve ser preenchida'
      isValid = false
    }     
    if(data.logradouro.trim() === '') {
      errorTemp.logradouro = 'O logradouro deve ser preenchida'
      isValid = false
    }     
    if(data.num_imovel.trim() === '') {
      errorTemp.num_imovel = 'O num_imovel deve ser preenchida'
      isValid = false
    }     
    if(data.complemento.trim() === '') {
      errorTemp.complemento = 'O complemento deve ser preenchida'
      isValid = false
    }     
    if(data.bairro.trim() === '') {
      errorTemp.bairro = 'O bairro deve ser preenchida'
      isValid = false
    }     
    if(data.municipio.trim() === '') {
      errorTemp.municipio = 'O municipio deve ser preenchida'
      isValid = false
    }     
    if(data.uf.trim() === '') {
      errorTemp.uf = 'O uf deve ser preenchida'
      isValid = false
    }     
    if(data.telefone.trim() === '') {
      errorTemp.telefone = 'O telefone deve ser preenchida'
      isValid = false
    }     
    if(data.email.trim() === '') {
      errorTemp.email = 'O email deve ser preenchida'
      isValid = false
    }     

    
    setError(errorTemp)
    return isValid
  }

  async function saveData() {
    try {
      // Desabilita o botão de enviar para evitar envios duplicados
      setSendBtnStatus({disabled: true, label: 'Enviando...'})
      
      // Se estivermos editando, precisamos enviar os dados com o verbo HTTP PUT
      if(params.id) await axios.put(`https://api.faustocintra.com.br/clientes/${params.id}`, cliente)
      // Senão, estaremos criando um novo registro, e o verbo HTTP a ser usado é o POST
      else await axios.post('https://api.faustocintra.com.br/clientes', cliente)
      
      // Mostra a SnackBar
      setSbStatus({open: true, severity: 'success', message: 'Dados salvos com sucesso!'})
      
    }
    catch(error) {
      // Mostra a SnackBar
      setSbStatus({open: true, severity: 'error', message: 'ERRO: ' + error.message})
    }
    // Restaura o estado inicial do botão de envio
    setSendBtnStatus({disabled: false, label: 'Enviar'})
  }

  function handleSubmit(event) {

    event.preventDefault()    // Evita que a página seja recarregada

    // Só envia para o banco de dados se o formulário for válido
    if(validate(cliente)) saveData()

  }

  function handleSbClose() {
    setSbStatus({...sbStatus, open: false})

    // Retorna para a página de listagem em caso de sucesso
    if(sbStatus.severity === 'success') history.push('/list')
  }

  function handleDialogClose(result) {
    setDialogOpen(false)

    // Se o usuário concordou em voltar 
    if(result) history.push('/list')
  }

  function handleGoBack() {
    // Se o formulário tiver sido modificado, exibimos o diálogo de confirmação
    if(isModified) setDialogOpen(true)
    // Senão, podemos voltar diretamente para a listagem
    else history.push('/list')
  }

  return (
    <>

      <ConfirmDialog isOpen={dialogOpen} onClose={handleDialogClose}>
        Há dados não salvos. Deseja realmente voltar?
      </ConfirmDialog>

      <Snackbar open={sbStatus.open} autoHideDuration={6000} onClose={handleSbClose}>
        <MuiAlert elevation={6} variant="filled" onClose={handleSbClose} severity={sbStatus.severity}>
          {sbStatus.message}
        </MuiAlert>
      </Snackbar>

      <h1>{title}</h1>
      <form className={classes.form} onSubmit={handleSubmit}>
        
        <TextField 
          id="nome" 
          label="nome" 
          variant="filled"
          value={cliente.nome}
          onChange={handleInputChange}
          required  /* not null, precisa ser preenchido */
          placeholder="Informe o nome"
          fullWidth
          error={error.nome !== ''}
          helperText={error.nome}
        />
   
            <InputMask
          id="cpf" 
          mask={cpfMask}
          formatChars={formatChars}
          value={cliente.cpf}
          onChange={(event) => handleInputChange(event, 'cpf')}
        >
          {() => <TextField 
            label="cpf" 
            variant="filled"
            required  /* not null, precisa ser preenchido */
            placeholder="Informe o cpf"
            fullWidth
            error={error.cpf !== ''}
            helperText={error.cpf}
          />}
        </InputMask>
        <TextField 
          id="rg" 
          label="rg" 
          variant="filled"
          value={cliente.rg}
          onChange={handleInputChange}
          required  /* not null, precisa ser preenchido */
          placeholder="Informe o rg"
          fullWidth
          error={error.rg !== ''}
          helperText={error.rg}
        />
        <TextField 
          id="logradouro" 
          label="logradouro" 
          variant="filled"
          value={cliente.logradouro}
          onChange={handleInputChange}
          required  /* not null, precisa ser preenchido */
          placeholder="Informe o logradouro"
          fullWidth
          error={error.logradouro !== ''}
          helperText={error.logradouro}
        />
        <TextField 
          id="num_imovel" 
          label="num_imovel" 
          variant="filled"
          value={cliente.num_imovel}
          onChange={handleInputChange}
          required  /* not null, precisa ser preenchido */
          placeholder="Informe o numero do imovel"
          fullWidth
          error={error.num_imovel !== ''}
          helperText={error.num_imovel}
        />
        <TextField 
          id="complemento" 
          label="complemento" 
          variant="filled"
          value={cliente.complemento}
          onChange={handleInputChange}
          required  /* not null, precisa ser preenchido */
          placeholder="Informe o complemento"
          fullWidth
          error={error.complemento !== ''}
          helperText={error.complemento}
        />
        <TextField 
          id="bairro" 
          label="bairro" 
          variant="filled"
          value={cliente.bairro}
          onChange={handleInputChange}
          required  /* not null, precisa ser preenchido */
          placeholder="Informe o bairro"
          fullWidth
          error={error.bairro !== ''}
          helperText={error.bairro}
        />
        <TextField 
          id="municipio" 
          label="municipio" 
          variant="filled"
          value={cliente.municipio}
          onChange={handleInputChange}
          required  /* not null, precisa ser preenchido */
          placeholder="Informe o municipio"
          fullWidth
          error={error.municipio !== ''}
          helperText={error.municipio}
        />
        <TextField 
          id="uf" 
          label="uf" 
          variant="filled"
          value={cliente.uf}
          onChange={handleInputChange}
          required  /* not null, precisa ser preenchido */
          placeholder="Informe o uf"
          fullWidth
          error={error.uf !== ''}
          helperText={error.uf}
        />
    
         <InputMask
          id="telefone" 
          mask={telefoneMask}
          formatChars={formatChars}
          value={cliente.telefone}
          onChange={(event) => handleInputChange(event, 'telefone')}
        >
          {() => <TextField 
            label="telefone" 
            variant="filled"
            required  /* not null, precisa ser preenchido */
            placeholder="Informe o telefone"
            fullWidth
            error={error.telefone !== ''}
            helperText={error.telefone}
          />}
        </InputMask>
        <TextField 
          id="email" 
          label="email" 
          variant="filled"
          value={cliente.email}
          onChange={handleInputChange}
          required  /* not null, precisa ser preenchido */
          placeholder="Informe o email"
          fullWidth
          error={error.email !== ''}
          helperText={error.email}
        />

      
        <Toolbar className={classes.toolbar}>
          <Button type="submit" variant="contained" color="secondary" disabled={sendBtnStatus.disabled}>
            {sendBtnStatus.label}
          </Button>
          <Button variant="contained" onClick={handleGoBack}>Voltar</Button>
        </Toolbar>

        {/* <div>
          {JSON.stringify(karango)}
          <br />
          currentId: {JSON.stringify(currentId)}
          <br />
          isModified: {JSON.stringify(isModified)}
        </div> */}
      </form>
    </>
  )
}