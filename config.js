config = module.exports = {
  port: 8001,
  files: {
    max_size: 2,
    max_fields_size: (2 * 1024 * 1024), // Limits the amount of memory a field (not file) can allocate in bytes  (2MB in this case)
    upload_dir: "./uploads"
  },
};

