const fs = require('fs')
const formidable = require('formidable')
const path = require('path')

const handleUpload = (req, res, callback) => {
  // create an incoming form object
  const form = new formidable.IncomingForm()
  let filePath = ""

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = false

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(path.dirname(require.main.filename), '/uploads')

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    filePath = path.join(form.uploadDir, file.name)

    fs.renameSync(file.path, filePath)
  })

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err)
  })

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    callback(filePath, res)
  })

  // parse the incoming request containing the form data
  form.parse(req)
}

module.exports.handleUpload = handleUpload