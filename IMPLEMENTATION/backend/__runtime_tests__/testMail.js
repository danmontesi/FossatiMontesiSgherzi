const nm = require('nodemailer')

const transporter = nm.createTransport({
  service: 'gmail',
  auth: {
    user: 'ingsw2.fms@torrescalla.it',
    pass: 'albi1945'
  }
})

const mailOptions = {
  from: 'ingsw2.fms@torrescalla.it',
  to: 'francesco.sgherzi@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
}

transporter.sendMail(mailOptions, (error, info) => {
  if (error) console.log(error)
  console.log(info)
})