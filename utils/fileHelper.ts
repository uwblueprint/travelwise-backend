const calculateFileSize = bytes => {
  if (bytes < 1024) {
    return bytes.toString() + " Bytes";
  } else if (bytes < 1048576) {
    return (bytes / 1024).toFixed(1).toString() + " KB";
  } else if (bytes < 1073741824) {
    return (bytes / 1048576).toFixed(1).toString() + " MB";
  } else {
    return (bytes / 1073741824).toFixed(1).toString() + " GB";
  }
};

module.exports = { calculateFileSize };
