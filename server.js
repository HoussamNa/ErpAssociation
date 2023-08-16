const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const xlsx = require('xlsx');


const multer = require('multer');
const excelToJson = require('convert-excel-to-json');





const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());
app.use(fileUpload());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use(express.json());

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "AssociationDB",
};

const pool = mysql.createPool(dbConfig);

const createTableQuery = `
CREATE TABLE IF NOT EXISTS العائلات (
  id INT AUTO_INCREMENT PRIMARY KEY,
  region VARCHAR(255),
  situation VARCHAR(255),
  responsible VARCHAR(255),
  widowName VARCHAR(255),
  widowBirthDate VARCHAR(255),
  nationalId VARCHAR(255),
  widowOccupation VARCHAR(255),
  widowHealthStatus VARCHAR(255),
  governmentSupport VARCHAR(255),
  deathDate VARCHAR(255),
  orphanLastName VARCHAR(255),
  orphanFirstName VARCHAR(255),
  educationLevel2023_2022 VARCHAR(255),
  employer VARCHAR(255),
  section VARCHAR(255),
  course1Score VARCHAR(255),
  exam1Score VARCHAR(255),
  course2Score VARCHAR(255),
  overallScore VARCHAR(255),
  transferStatus VARCHAR(255),
  educationLevel2023_2024 VARCHAR(255),
  address VARCHAR(255),
  phone VARCHAR(255),
  notes VARCHAR(255),
  committeeNotes VARCHAR(255),
  decisionDate VARCHAR(255),
  updateDate VARCHAR(255),
  support VARCHAR(255)
);
`;

pool.query(createTableQuery, (err) => {
  if (err) {
    console.error("Error creating table:", err);
  } else {
    console.log("Table created or already exists");
  }
});

app.post('/save-data', (req, res) => {
  const formData = req.body;

  const insertQuery = `
    INSERT INTO العائلات
    SET
      region = ?,
      situation = ?,
      responsible = ?,
      widowName = ?,
      widowBirthDate = ?,
      nationalId = ?,
      widowOccupation = ?,
      widowHealthStatus = ?,
      governmentSupport = ?,
      deathDate = ?,
      orphanLastName = ?,
      orphanFirstName = ?,
      educationLevel2023_2022 = ?,
      employer = ?,
      section = ?,
      course1Score = ?,
      exam1Score = ?,
      course2Score = ?,
      overallScore = ?,
      transferStatus = ?,
      educationLevel2023_2024 = ?,
      address = ?,
      phone = ?,
      notes = ?,
      committeeNotes = ?,
      decisionDate = ?,
      updateDate = ?,
      support = ?
  `;
  
  pool.query(insertQuery, [
    formData.region,
    formData.situation,
    formData.responsible,
    formData.widowName,
    formData.widowBirthDate,
    formData.nationalId,
    formData.widowOccupation,
    formData.widowHealthStatus,
    formData.governmentSupport,
    formData.deathDate,
    formData.orphanLastName,
    formData.orphanFirstName,
    formData.educationLevel2023_2022,
    formData.employer,
    formData.section,
    formData.course1Score,
    formData.exam1Score,
    formData.course2Score,
    formData.overallScore,
    formData.transferStatus,
    formData.educationLevel2023_2024,
    formData.address,
    formData.phone,
    formData.notes,
    formData.committeeNotes,
    formData.decisionDate,
    formData.updateDate,
    formData.support
  ], (error, results) => {
    if (error) {
      console.error('Error saving data:', error);
      res.status(500).json({ message: 'Error saving data', error: error.message });
    } else {
      res.status(200).json({ message: 'Data saved successfully' });
    }
  });
});


app.put('/update-data/:id', (req, res) => {
  const updateData = req.body;
  const id = req.params.id;

  const updateQuery = `
    UPDATE العائلات
    SET
      region = ?,
      situation = ?,
      responsible = ?,
      widowName = ?,
      widowBirthDate = ?,
      nationalId = ?,
      widowOccupation = ?,
      widowHealthStatus = ?,
      governmentSupport = ?,
      deathDate = ?,
      orphanLastName = ?,
      orphanFirstName = ?,
      educationLevel2023_2022 = ?,
      employer = ?,
      section = ?,
      course1Score = ?,
      exam1Score = ?,
      course2Score = ?,
      overallScore = ?,
      transferStatus = ?,
      educationLevel2023_2024 = ?,
      address = ?,
      phone = ?,
      notes = ?,
      committeeNotes = ?,
      decisionDate = ?,
      updateDate = ?,
      support = ?
    WHERE id = ?;
  `;

  pool.query(updateQuery, [
    updateData.region,
    updateData.situation,
    updateData.responsible,
    updateData.widowName,
    updateData.widowBirthDate,
    updateData.nationalId,
    updateData.widowOccupation,
    updateData.widowHealthStatus,
    updateData.governmentSupport,
    updateData.deathDate,
    updateData.orphanLastName,
    updateData.orphanFirstName,
    updateData.educationLevel2023_2022,
    updateData.employer,
    updateData.section,
    updateData.course1Score,
    updateData.exam1Score,
    updateData.course2Score,
    updateData.overallScore,
    updateData.transferStatus,
    updateData.educationLevel2023_2024,
    updateData.address,
    updateData.phone,
    updateData.notes,
    updateData.committeeNotes,
    updateData.decisionDate,
    updateData.updateDate,
    updateData.support,
    id
  ], (error, results) => {
    if (error) {
      console.error('Error updating data:', error);
      res.status(500).json({ message: 'Error updating data', error: error.message });
    } else {
      res.status(200).json({ message: 'Data updated successfully' });
    }
  });
});

app.delete('/delete-data/:id', (req, res) => {
  const id = req.params.id;

  const deleteQuery = `
    DELETE FROM العائلات WHERE id = ?;
  `;

  pool.query(deleteQuery, [id], (error, results) => {
    if (error) {
      console.error('Error deleting data:', error);
      res.status(500).json({ message: 'Error deleting data', error: error.message });
    } else {
      res.status(200).json({ message: 'Data deleted successfully' });
    }
  });
});



app.get('/get-data', (req, res) => {
  const getDataQuery = `
    SELECT * FROM العائلات;
  `;
  
  pool.query(getDataQuery, (error, results) => {
    if (error) {
      console.error('Error retrieving data:', error);
      res.status(500).json({ message: 'Error retrieving data', error: error.message });
    } else {
      res.status(200).json(results);
    }
  });
});

app.post('/import-excel', upload.single('excelFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const excelData = excelToJson({
      source: req.file.buffer,
      header: {
        rows: 1
      }
    })[Object.keys(excelToJson({ source: req.file.buffer }))[0]];

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const insertQuery = `
        INSERT INTO العائلات (
          region, situation, responsible, widowName, widowBirthDate,
          nationalId, widowOccupation, widowHealthStatus, governmentSupport,
          deathDate, orphanLastName, orphanFirstName, educationLevel2023_2022,
          employer, section, course1Score, exam1Score, course2Score,
          overallScore, transferStatus, educationLevel2023_2024, address,
          phone, notes, committeeNotes, decisionDate, updateDate, support
        )
        VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
      `;

      for (const row of excelData) {
        await connection.query(insertQuery, [
          row[' المنطقة'],
          row['الوضعية'],
          row['مسؤول المنطقة'],
          row['اسم الأرملة'],
          row['تاريخ ازدياد الأرملة'],
          row['رقم البطاقة الوطنية للأرملة'],
          row['مهنة الأرملة'],
          row['الوضعية الصحية للأرملة'],
          row['الدعم الحكومي/التغطية الاجتماعية'],
          row['تاريخ وفاة الهالك'],
          row['الاسم العائلي لليتيم'],
          row['الاسم الشخصي\r\n لليتيم'],
          row['/النوع /المستوى الدراسي\r\n2023/2022'],
          row['المشغل/المؤسسة'],
          row['الشعبة'],
          row['معدل الدورة 1'],
          row['معدل الامتحان\r\nالدورة1'],
          row['معدل الدورة2'],
          row['المعدل\r\n العام'],
          row['ينتقل \r\nنعم/لا'],
          row['/النوع /المستوى الدراسي\r\n2023/2024'],
          row['العنوان'],
          row['الهاتف'],
          row['ملاحظات / قرار اللجنة'],
          row['تاريخ القرار'],
          row['تاريخ التحيين'],
          row['المساعدات']
        ]);

        console.log('Row inserted successfully:', row);
      }

      await connection.commit();
      connection.release();

      return res.status(200).json({ message: 'Excel data imported and saved successfully' });
    } catch (error) {
      await connection.rollback();
      connection.release();

      console.error('Error inserting rows:', error);
      return res.status(500).json({ message: 'Error inserting rows', error: error.message });
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return res.status(500).json({ message: 'An error occurred while processing the request', error: error.message });
  }
});





app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
