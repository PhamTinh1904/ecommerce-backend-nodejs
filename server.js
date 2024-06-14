const app = require('./app.js')
const PORT = 3000

const server = app.listen(PORT, () => {
  console.log(`Running on port ${PORT} `);
});

process.on('SIGINT', () =>{
    server.close(()=>{console.log(`Exit Server Express`);})
})