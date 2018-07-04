
//FETCHES DATA FROM THE API
function getFiles() {
  return $.ajax('/api/file')
    .then(res => {
      console.log("Results from getFiles()", res);
      return res;
    })
    .fail(err => {
      console.error("Error in getFiles()", err);
      throw err;
    });
}

//FETCH FILES FROM THE API AND RENDER TO THE PAGE
//Whenever the list of files is refreshed, save that array to a property on the global window object
function refreshFileList() {
  const template = $('#list-template').html();
  const compiledTemplate = Handlebars.compile(template);

  getFiles()
    .then(files => {

      window.fileList = files;

      const data = {files: files};
      const html = compiledTemplate(data);
      $('#list-container').html(html);
    })
}

//BUTTON FOR SHOWING FORM VISIBILITY
function handleAddFileClick() {
  console.log("Baby steps...");
  setFormData({});
  toggleAddFileFormVisibility();
}

//HANDLER FOR HIDING FORM VISIBILITY
function toggleAddFileFormVisibility() {
  $('#form-container').toggleClass('hidden');
}

//The Submit button will trigger a javascript function that grabs the data from the form and POSTs it to an API endpoint
// After POSTing the data and receiving a response, the page will refresh the list of Files.
function submitFileForm() {
  console.log("You clicked 'submit'. Congratulations.");

  const fileData = {
    title: $('#file-title').val(),
    description: $('#file-description').val(),
    _id: $('#file-id').val(),
  };

  let method, url;
  if (fileData._id) {
    method = 'PUT';
    url = '/api/file/' + fileData._id;
  } else {
    method = 'POST';
    url = '/api/file';
  }

  $.ajax({
    type: method,
    url: url,
    data: JSON.stringify(fileData),
    dataType: 'json',
    contentType : 'application/json',
  })
    .done(function(response) {
      console.log("We have posted the data");
      refreshFileList();
      toggleAddFileFormVisibility();
    })
    .fail(function(error) {
      console.log("Failures at posting, we are", error);
    })

  console.log("Your file data", fileData);
}

//CANCEL BUTTON WILL CLEAR THE FORM WITHOUT POSTING THE DATA
function cancelFileForm() {
  toggleAddFileFormVisibility();
}

//EDIT BUTTON HANDLER
function handleEditFileClick(id) {
  const file = window.fileList.find(file => file._id === id);
  if (file) {
    setFormData(file);
    toggleAddFileFormVisibility();
  }
}

//DELETE CLICK HANDLER
function handleDeleteFileClick(id) {
  if (confirm("Are you sure?")) {
    deleteFile(id);
  }
}

//SET FORM DATA
function setFormData(data) {
  data = data || {};

  const file = {
    title: data.title || '',
    description: data.description || '',
    _id: data._id || '',
  };

  $('#file-title').val(file.title);
  $('#file-description').val(file.description);
  $('#file-id').val(file._id);
}

//DELETE ELEMENT FUNCTION
function deleteFile(id) {
  $.ajax({
    type: 'DELETE',
    url: '/api/file/' + id,
    dataType: 'json',
    contentType : 'application/json',
  })
    .done(function(response) {
      console.log("File", id, "is DOOMED!!!!!!");
      refreshFileList();
    })
    .fail(function(error) {
      console.log("I'm not dead yet!", error);
    })
}

//REFRESHES THE LIST
refreshFileList();
