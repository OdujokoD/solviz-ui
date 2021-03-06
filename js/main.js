const url = 'https://lda-irs.ew.r.appspot.com';
// const url = 'http://localhost:5000';
const FILE_NAME = 'solviz_file_name'

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: url
  })
);

var app = new Vue({
  el: '#app',
  data: {
    file: "",
    isDisabled: true,
    isConnected: false,
    showStatus: false,
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
      window.localStorage.setItem('lda', JSON.stringify(data));
      window.location.href = '/visualize.html';//'http://localhost:8000/visualize.html';
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
      // const axios = require('axios');
      formData.append('file', this.file);
      window.localStorage.setItem(FILE_NAME, this.file.name)

      this.resetForm();
      this.showStatus = true;
      console.log("Form data: ", formData)

      axios.post(`${url}/upload`,formData, {
        headers: {
          'content-type': 'multipart/form-data'
        }
      })
      .then(response => {
        console.log(response)
        this.$socket.emit('process file', window.localStorage.getItem(FILE_NAME))
      }).catch(error => {
        console.log('In error: ', error)
      });

      // event.target.reset();
      // this.isDisabled = true
    },
    resetForm() {
      this.file = "";
      this.message = "Drag your files here or click in this area.";
      this.isDisabled = true;
    }
  }
})