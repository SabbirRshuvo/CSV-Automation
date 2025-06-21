const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");

const uploadDir = path.join(__dirname, "..", "uploads");

// Upload page render
exports.uploadPage = (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    res.render("upload", {
      files,
      columns: null,
      selectedFile: null,
      deduplicatedFileName: null,
    });
  });
};

// Upload original file
exports.uploadOriginal = (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    res.render("upload", {
      files,
      columns: null,
      selectedFile: null,
      deduplicatedFileName: null,
    });
  });
};

// Upload old file
exports.uploadOld = (req, res) => {
  res.redirect("/");
};

// Delete file
exports.deleteFile = (req, res) => {
  const filePath = path.join(uploadDir, req.body.filename);
  fs.unlink(filePath, () => {
    fs.readdir(uploadDir, (err, files) => {
      res.render("upload", {
        files,
        columns: null,
        selectedFile: null,
        deduplicatedFileName: null,
      });
    });
  });
};

// Select column page
exports.selectFile = (req, res) => {
  const filename = req.body.filename;
  const filePath = path.join(uploadDir, filename);
  const columns = new Set();

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      Object.keys(row).forEach((col) => columns.add(col));
    })
    .on("end", () => {
      fs.readdir(uploadDir, (err, files) => {
        res.render("upload", {
          files,
          columns: Array.from(columns),
          selectedFile: filename,
          deduplicatedFileName: null,
        });
      });
    });
};

// Remove duplicate
exports.removeDuplicate = (req, res) => {
  const { column, filename } = req.body;
  const filePath = path.join(uploadDir, filename);
  const rows = [];
  const unique = new Set();

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      if (!unique.has(row[column])) {
        unique.add(row[column]);
        rows.push(row);
      }
    })
    .on("end", () => {
      const deduplicatedFile = "deduplicated-" + filename;
      const newFilePath = path.join(uploadDir, deduplicatedFile);

      const headers = Object.keys(rows[0]).join(",");
      const data = rows.map((r) => Object.values(r).join(",")).join("\n");
      fs.writeFileSync(newFilePath, headers + "\n" + data);

      fs.readdir(uploadDir, (err, files) => {
        res.render("upload", {
          files,
          columns: null,
          selectedFile: null,
          deduplicatedFileName: deduplicatedFile,
        });
      });
    });
};
