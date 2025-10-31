const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const Registration = require('./Models/Registration');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST /register
app.post('/register', upload.single('image'), async (req, res) => {
  try {
    const lastEntry = await Registration.findOne().sort({ serialNumber: -1 });
    const lastSerial = lastEntry?.serialNumber || 0;
    const nextSerial = lastSerial + 1;
    const formattedSerial = `techkriti2.0-${String(nextSerial).padStart(4, '0')}`;

    const registration = new Registration({
      ...req.body,
      serialNumber: nextSerial,
      image: req.file
        ? {
            data: req.file.buffer,
            contentType: req.file.mimetype
          }
        : undefined
    });

    await registration.save();
    res.status(200).send(`Thank you for registering, ${req.body.name}! Your registration ID is ${formattedSerial}.`);
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).send('Error saving registration.');
  }
});

// GET /image/:id
app.get('/image/:id', async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration || !registration.image || !registration.image.data) {
      return res.status(404).send('Image not found');
    }

    res.set('Content-Type', registration.image.contentType);
    res.send(registration.image.data);
  } catch (err) {
    res.status(500).send('Error retrieving image');
  }
});

app.listen(3000, () => {
  console.log('Backend running on http://localhost:3000');
});
