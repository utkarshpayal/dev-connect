const DHT = require('holesail-server')
const libKeys = require('hyper-cmd-lib-keys') 
const b4a = require('b4a') 

const { createHash } = require('node:crypto') 
const boxConsole = require('cli-box') 
const colors = require('colors/safe')
const qrcode = require('qrcode-terminal')

class Server {
 
  constructor (options) {
    this.options = options
    this.host = options.host || '127.0.0.1'
    this.public = options.public
    this.connector = this.setupConnector(options.connector)
    this.localServer = new DHT()
    this.isConnectorSet 
    this.udp = this.options.udp
    this.service = options.service
    this.customText = options.customText || ''
  }

  setupConnector (connector) {
    if (this.public) {
      this.isConnectorSet = false
      return null 
    }

    if (connector && typeof (connector) !== 'boolean') {
      this.isConnectorSet = true
      return createHash('sha256').update(connector.toString()).digest('hex') 
    } else {
      const buffer = Buffer.from(libKeys.randomBytes(32).toString('hex'), 'hex')
      const connectorSeed = b4a.toString(buffer, 'hex').substring(0, 60)
      this.options.connector = connectorSeed

      this.isConnectorSet = true
      return createHash('sha256').update(connectorSeed.toString()).digest('hex') 
    }
  }

  start () {
    this.localServer.serve({
      port: this.options.port,
      address: this.host,
      buffSeed: this.connector,
      secure: this.isConnectorSet,
      udp: this.udp
    }, () => {
      console.log('Server started on port: ' + colors.white(this.options.port))
      // this.printBox()
    })
  }

  printBox () {
    // Pretty output in the terminal
    if (this.isConnectorSet) {
      let protocol
      if (this.udp) {
        protocol = 'UDP [BETA]'
      } else {
        protocol = 'TCP'
      }
      var box = boxConsole('100x10', {
        text: colors.cyan.underline.bold(`Holesail ${protocol} ${this.service} Started`) + ' ⛵️' + '\n' +
                        colors.magenta('Connection Mode: ') + colors.cyan('Private Connection String') + '\n' +
                        colors.magenta('Holesail is now listening on ') + `${this.host}:` + this.options.port + '\n' +
                        colors.green(this.customText) +
                        'Connection string: ' + colors.white(`${this.options.connector}`) + '\n' +
                        colors.gray('   NOTE: TREAT PRIVATE CONNECTION STRINGS HOW YOU WOULD TREAT SSH KEY, DO NOT SHARE IT WITH ANYONE YOU DO NOT TRUST    '),
        autoEOL: true,
        vAlign: 'middle',
        hAlign: 'middle',
        stretch: true
      }
      )

      console.log(box)
      console.log('OR Scan the QR to connect: ')
      qrcode.generate(this.options.connector, { small: true }, function (qrcode) {
        console.log(qrcode)
      })
    } else {
      var box = boxConsole('100x10', {
        text: colors.cyan.underline.bold(`Holesail ${this.service} Started`) + ' ⛵️' + '\n' +
                        colors.magenta('Connection Mode: ') + colors.yellow('Public Connection String \n') +
                        colors.magenta('Holesail is now listening on ') + `${this.host}:` + this.options.port + '\n' +
                        colors.green(this.customText) +
                        'Connection string: ' + colors.white(`${this.localServer.getPublicKey()}`) + '\n' +
                        colors.gray('   NOTICE: TREAT PUBLIC STRING LIKE YOU WOULD TREAT A DOMAIN NAME ON PUBLIC SERVER, IF THERE IS ANYTHING PRIVATE ON IT, IT IS YOUR RESPONSIBILITY TO PASSWORD PROTECT IT OR USE PRIVATE MODE   \n'),
        autoEOL: true,
        vAlign: 'middle',
        hAlign: 'middle',
        stretch: true
      }
      )
      console.log(box)
      console.log('OR Scan the QR to connect: ')
      qrcode.generate(this.localServer.getPublicKey(), { small: true }, function (qrcode) {
        console.log(qrcode)
      })
    }
  }

  async destroy () {
    await this.localServer.destroy()
  }
}

module.exports = Server