const server = require('./app');
const mailingConfig = require('./config/mailConfig');
const port = 3000;

mailingConfig.transporter.verify((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Nodemailer is ready to receive messages');
    }
});

require('./database');

server.listen(port, () => {
    console.log(`Pacchi Server running at port ${port}`);
});
