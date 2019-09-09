Vue.use(
  new VueSocketIO({
    debug: true,
    connection: "http://127.0.0.1:5000/"
  })
);

var app = new Vue({
  el: '#app',
  data: {
    file: "",
    isDisabled: true,
    isConnected: false,
    socketMessage: '',
    message: "Drag your files here or click in this area."
  },
  sockets: {
    connect() {
      // Fired when the socket connects.
      console.log("Connected")
      this.isConnected = true;
    },

    disconnect() {
      this.isConnected = false;
    },

    // Fired when the server sends something on the "messageChannel" channel.
    json(data) {
      console.log(data);
      this.socketMessage = data
    }
  },
  methods: {
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
      this.message = this.file.name;
      this.isDisabled = false;
    },
    uploadFile() {
      let formData = new FormData();
      const axios = require('axios');
      formData.append('file', this.file);

      // this.$socket.emit('upload', formData)

      axios.post('http://localhost:5000/upload',formData)
      .then(response => {
        console.log(response)
        this.$socket.emit('process file')
      }).catch(error => {
        console.log('In error: ', error)
      });

      // event.target.reset();
      // this.isDisabled = true
    }
  }
})