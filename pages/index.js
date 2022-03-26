import React, { useState } from 'react';
import Head from 'next/head'
import QRCode from 'qrcode'
import { Box, TextField, Button, Grid, Divider, Chip } from '@mui/material';

export default function Home() {
  const [text, setText] = useState('');
  const [optsData, setOptsData] = useState({
    errorCorrectionLevel: 'H',
    type: 'image/jpeg',
    quality: 1,
    margin: 1,
    color: {
      dark:"#000000FF",
      light:"#FFFFFFFF"
    }
  })
  const [dataUrl, setDataUrl] = useState('');

  async function submit() {
    const dataUrl = await QRCode.toDataURL(text, optsData);
    setDataUrl(dataUrl);
  }

  return (
    <div className="container">
      <Head>
        <title>QR Code Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Box sx={{ 
          mx: 'auto',
          paddingTop: '20px',
          width: '100%',
          '@media (min-width: 769px)' : {
            width: '80%'
          },
          '@media (min-width: 1025px)' : {
            width: '60%'
          },
          '@media (min-width: 1201px)' : {
            width: '40%'
          }
        }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL / Text for QR Code"
                defaultValue=""
                onChange={(e) => setText(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="outlined"
                onClick={submit}
              >
                Submit
              </Button>
            </Grid>

            {dataUrl !== ''
              ? <Grid item xs={12}>
                  <Divider
                    style={{ paddingTop: '30px' }}>
                    <Chip label="Result" />
                  </Divider>
                  <div style={{ textAlign: 'center' }}>
                    <img 
                      id="canvas" 
                      src={dataUrl}
                      style={{ paddingTop: '10px' }}/>
                    <p>Right click the image and select "Save image as..."</p>
                  </div>
                </Grid>
              : <div></div>
            }
          </Grid>
        </Box>
      </main>
    </div>
  )
}
