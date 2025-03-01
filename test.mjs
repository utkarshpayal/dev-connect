import DevConnectServer from '../lets-connect-server/index.mjs'

const server = new DevConnectServer()
server.serve({ port: 3000, address: 'localhost' }, () => {
    console.log('Server started')
})