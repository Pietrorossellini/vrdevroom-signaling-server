# VR deVRoom Signaling Server

<img src="https://github.com/Pietrorossellini/vrdevroom/raw/master/docs/logo.png" align="right" />

This is a simple WebSockets-based signaling server that accompanies the [VR deVRoom](https://github.com/Pietrorossellini/vrdevroom), a networked WebVR prototype application for supporting remote collaboration within agile software development.

> Try VR deVRoom out at [vrdevroom.com](https://www.vrdevroom.com)

## Getting started

Interested in forking the signaling server? Get up-and-running with these steps:

1. Configure the server port and the allowed origins:

   Copy the `.example-env` to `.env` and dial in the appropriate values.
   
2. Type:

    ```
    npm start
    ```
    
### License

Copyright (c) 2017 Petri Myllys / Reaktor.
This software is licensed according to the used modules, i.e.,
the license used is BSD-3-Clause. Please see `LICENSE` and the modules in `package.json` for details.