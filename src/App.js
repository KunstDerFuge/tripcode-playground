import logo from './logo.svg'
import './App.css'
import React from 'react'
import {TextField, useTheme} from '@mui/material'
import sha1 from 'crypto-js/sha1'
import Base64 from 'crypto-js/enc-base64'
import CryptoJS from 'crypto-js'
import useMediaQuery from '@mui/material/useMediaQuery'

function App() {
  const [salt, setSalt] = React.useState('secret_salt')
  const [trip1, setTrip1] = React.useState('pass1')
  const [trip2, setTrip2] = React.useState('pass2')
  const [trip3, setTrip3] = React.useState('pass3')
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isSmall = useMediaQuery(theme.breakpoints.down('xs'))
  const passWidth = isMobile ? '12ch' : '16ch'
  const tripSaltWidth = isMobile ? '16ch' : '18ch'
  const tripcodeWidth = isMobile ? '13ch' : '16ch'

  // I am so tired this function is just copypasted from StackOverflow
  // https://stackoverflow.com/a/37468518
  function encryptDesCbcPkcs7Padding(message, key) {
    var keyWords = CryptoJS.enc.Utf8.parse(key)
    var ivWords = CryptoJS.lib.WordArray.create([0, 0])
    var encrypted = CryptoJS.DES.encrypt(message, keyWords, {iv: ivWords})

    return encrypted//.toString(CryptoJS.enc.Utf8);
  }

  function generate_tripcode(password, salt) {
    // Roughly the 8chan-style "secure tripcode" algorithm
    const hashed = encryptDesCbcPkcs7Padding(password,
      Base64.stringify(sha1(password + salt)).substring(0, 4)).toString()
    return hashed.substring(hashed.length - 10) // Return last 10 chars
  }

  return (
    <div className="App" style={{display: 'flex', flexDirection: 'column'}}>
      <div>
        <TextField sx={{m: 4, width: tripcodeWidth}} name="salt" label="Secret Salt" value={salt}
                   onChange={e => setSalt(e.target.value)}/>
      </div>
      <div style={{display: 'flex', alignItems: 'center', alignSelf: 'center'}}>
        {!isMobile && '##'}<TextField sx={{m: 1, width: passWidth}} name="trip1" label="Trip Password 1" value={trip1}
                                      onChange={e => setTrip1(e.target.value)}/>
        =>
        <TextField sx={{m: 1, width: tripSaltWidth}} label="Pass1 + Salt" value={trip1 + salt}/>
        =>{!isMobile && "  !!"}<TextField sx={{m: 1, width: tripcodeWidth}} label="Tripcode 1"
                                   value={generate_tripcode(trip1, salt)}/>
      </div>
      <div style={{display: 'flex', alignItems: 'center', alignSelf: 'center'}}>
        {!isMobile && '##'}<TextField sx={{m: 1, width: passWidth}} name="trip2" label="Trip Password 2" value={trip2}
                                      onChange={e => setTrip2(e.target.value)}/>
        =>
        <TextField sx={{m: 1, width: tripSaltWidth}} label="Pass2 + Salt" value={trip2 + salt}/>
        =>{!isMobile && "  !!"}<TextField sx={{m: 1, width: tripcodeWidth}} label="Tripcode 2"
                                   value={generate_tripcode(trip2, salt)}/>
      </div>
      <div style={{display: 'flex', alignItems: 'center', alignSelf: 'center'}}>
        {!isMobile && '##'}<TextField sx={{m: 1, width: passWidth}} name="trip3" label="Trip Password 3" value={trip3}
                                      onChange={e => setTrip3(e.target.value)}/>
        =>
        <TextField sx={{m: 1, width: tripSaltWidth}} label="Pass3 + Salt" value={trip3 + salt}/>
        =>{!isMobile && "  !!"}<TextField sx={{m: 1, width: tripcodeWidth}} label="Tripcode 3"
                                   value={generate_tripcode(trip3, salt)}/>
      </div>
    </div>
  )
}

export default App
