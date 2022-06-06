const { format }   = require('date-fns')
const { v4: uuid } = require('uuid')

const fs         = require('fs')
const fsPromises = require('fs').promises
const path       = require('path')
const { __DEBUG__, HTTP_STATUS_CODES }  = require('../const/constrefs')
const baseFileName = __filename.split("/")[__filename.split("/").length - 1];

/**
 * Write log into the log file, logFileName
 * @param {*} message 
 * @param {*} logFileName 
 */
const logEvents = async(message, logFileName) => {

  const dateTime = `${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`
  const logItem  = `${dateTime}\t${uuid()}\t${message}\n`

  if(__DEBUG__) {
    console.log(`[${baseFileName} > logItem]: `, logItem);
  }  

  try {
    if(!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
      fs.mkdir(path.join(__dirname, '..', 'logs'), (err) => {
        if(err) throw err
        console.log(`[Directory created]: `)
      })
    }
    await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem)
  } catch (err) {
    console.error(err)
  }
}

/**
 * Write Request tx log into the reqLog.txt file
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const logger = (req, res, next) => {
  logEvents(`[${baseFileName}]: ${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt')
  if(__DEBUG__) {
    console.log(`[${baseFileName}] > ${req.method}\t${req.path}`);
  }  
  next()
}

/**
 * Write errlog tx into the errLog.txt file
 * @param {*} err 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const errorHandler = (err, req, res, next) => {
  logEvents(`${err.name}: ${err.message}`, 'errLog.txt')
  if(__DEBUG__) {
    console.error(err.status)
  }
  res.status(HTTP_STATUS_CODES.Internal_Server_Err_500).send(err.message)
}

module.exports = { logger, logEvents, errorHandler }