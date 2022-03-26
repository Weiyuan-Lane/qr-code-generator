import React, { useState } from 'react';
import Head from 'next/head'
import QRCode from 'qrcode'
import { Box, TextField, Button, Grid, Divider, Chip, Input, FormControl, InputLabel } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import { CompactPicker } from 'react-color';

let QrCodeWithLogo;
if (global.window) {
  QrCodeWithLogo = require('qrcode-with-logos').default;
}

const FILE_DOWNLOAD_NAME = 'qrcode.jpg';
const CANVAS_HOLDER = 'logoQrCanvas';
const LOGO_IMAGE_INPUT_ID = 'contained-button-file';

export default function Home() {
  const [text, setText] = useState('');
  const [darkColor, setDarkColor] = useState('#000000');
  const [lightColor, setLightColor] = useState('#FFFFFF');
  const [isTextEmptyError, setIsTextEmptyError] = useState(false);
  const [logoImageSrc, setLogoImageSrc] = useState('');
  const [dataUrl, setDataUrl] = useState('');

  async function submit() {
    if (text) {
      setIsTextEmptyError(false);

      let dataUrl;
      const optsData = {
        errorCorrectionLevel: 'H',
        type: 'image/jpeg',
        quality: 1,
        margin: 1,
        color: {
          dark: darkColor,
          light: lightColor
        }
      };

      if (logoImageSrc) {
        dataUrl = await new QrCodeWithLogo({
          canvas: document.getElementById(CANVAS_HOLDER),
          content: text,
          nodeQrCodeOptions: optsData,
          width: 1000,
          download: false,
          logo: {
            src: logoImageSrc,
          }
        }).getCanvas().then(canvas => {
          return canvas.toDataURL();
        });

      } else {
        dataUrl = await QRCode.toDataURL(text, optsData);
      }

      setDataUrl(dataUrl);
    } else {
      setIsTextEmptyError(true);
    }
  }

  function clickSetLogo(event) {
    if (event && event.target) {
      setLogoImageSrc(URL.createObjectURL(event.target.files[0]));
    }
  }

  function clickClearLogo(event) {
    if (event && event.target) {
      setLogoImageSrc('');
      document.getElementById(LOGO_IMAGE_INPUT_ID).value = null;
    }
  }

  return (
    <div className="container">
      <Head>
        <title>Frontend-only QR Code Generator</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta property="og:title" content="Frontend-only QR Code Generator" key="title" />
        <meta property="og:url" content="https://weiyuan-lane.github.io/qr-code-generator" />
        <meta property="og:description" content="Generate QR codes for yourself, without worries of being tracked." />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image" content="/shareable-image.jpeg" />

        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"/>
      </Head>

      <main>
        <Box sx={{ 
          mx: 'auto',
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
          <Grid item xs={12}>
            <Divider
              style={{ paddingTop: '30px', paddingBottom: '30px' }}>
              <Chip label="QR Code Generator" />
            </Divider>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                error={isTextEmptyError}
                helperText={isTextEmptyError ? 'Eh bo text leh. Can don\'t liddat ornot?' : ''}
                label="URL / Text for QR Code"
                defaultValue=""
                onChange={(e) => setText(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6} style={{ textAlign: 'center' }}>
              <InputLabel>Dark Color (For Scanning)</InputLabel>
              <CompactPicker 
                color={ darkColor }
                onChangeComplete={ (color) => setDarkColor(color.hex) }/>
            </Grid>
            <Grid item xs={12} md={6} style={{ textAlign: 'center' }}>
              <InputLabel>Light Color (For Background)</InputLabel>
              <CompactPicker 
                color={ lightColor }
                onChangeComplete={ (color) => setLightColor(color.hex) }/>
            </Grid>
            <Grid item xs={12}>
              <label htmlFor={LOGO_IMAGE_INPUT_ID}>
                <Input accept="image/*" id={LOGO_IMAGE_INPUT_ID} type="file" style={{ display: 'none' }} onChange={clickSetLogo} />
                <Button 
                  fullWidth
                  variant="outlined" 
                  component="span"
                  startIcon={<ImageIcon />}>
                  (Optional) Upload Logo
                </Button>
              </label>
              {logoImageSrc != ''
                ? <div style={{ textAlign: 'center' }}>
                    <img 
                      src={logoImageSrc}
                      style={{ paddingTop: '10px' }}/>
                    <Button 
                      fullWidth
                      color="error"
                      component="span"
                      onClick={clickClearLogo}>
                      Remove Logo
                    </Button>
                  </div>
                : ''
              }
            </Grid>

            <Grid item xs={12}>
              <Divider></Divider>
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                onClick={submit}
              >
                Submit
              </Button>
            </Grid>

            {dataUrl !== ''
              ? <Grid item xs={12}>
                  <Divider
                    style={{ paddingTop: '10px', paddingBottom: '30px' }}>
                    <Chip label="Result" />
                  </Divider>
                  <div style={{ textAlign: 'center' }}>
                    <img
                      src={dataUrl}
                      style={{ paddingTop: '10px', maxWidth: '100%' }}/>
                    <Button 
                      fullWidth
                      color="secondary"
                      download={FILE_DOWNLOAD_NAME}
                      href={dataUrl}>
                      Download JPEG file
                    </Button>
                  </div>
                </Grid>
              : ''
            }

            <Grid item xs={12}>
              <Divider
                style={{ paddingTop: '30px', paddingBottom: '30px' }}>
                <Chip label="Disclaimer" />
              </Divider>
            </Grid>

            <Grid item xs={12} style={{ fontFamily: "'Roboto'", textAlign: 'justify', lineHeight: '25px' }}>
              <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.08)', padding: '1px 25px', borderRadius: '10px' }}>
                <p>Hi there! I'm <a href="https://weiyuan-lane.github.io/">Weiyuan</a>.</p> 
                <p>I initially did this for a family member, and decided to create a more "scalable" way to solve this problem for myself since I do face it often.</p>
                <p>Another objective was that I didn't want to be tracked by a third party.</p>
                <p style={{ fontWeight: '600' }}>This is entirely a frontend solution. Do monitor your network console, where the QR generation process should only load the DataURL as image, and not to a backend server.</p>
                <p style={{ fontWeight: '600' }}>No cookies/sessions are used too.</p>
                <p>The code can always be found <a href="https://github.com/Weiyuan-Lane/qr-code-generator" target="_blank">here</a>, hosted on Github Pages on the <a href="https://github.com/Weiyuan-Lane/qr-code-generator/tree/gh-pages" target="_blank">"gh-pages"</a> branch.</p>
              </div>
            </Grid>
          </Grid>
        </Box>

        <canvas id={CANVAS_HOLDER} style={{ display: 'none' }}></canvas>
      </main>
    </div>
  )
}
