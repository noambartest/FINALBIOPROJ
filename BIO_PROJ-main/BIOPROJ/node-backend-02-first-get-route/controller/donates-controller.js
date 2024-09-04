const Donate = require("../models/Donate");
const HttpError = require("../models/http-error");
const logActivity = require("../models/audit");
const { jsPDF } = require("jspdf");
const { create } = require("xmlbuilder");
const { spawn } = require('child_process');
const path = require('path'); 
const bcrypt = require("bcryptjs");
const User = require("../models/User");



const getDonatesByBloodType = async (req, res, next) => {
  const btype = req.params.btype;
  let donate;

  try {
    donate = await Donate.find({ btype: btype });
  } catch (err) {
    const error = new HttpError(
      "Somthing went wrong, could not find a donate",
      500
    );
    logActivity(`ERROR: Failed to retrieve donates by blood type: ${btype}`);
    return next(error);
  }

  if (!donate) {
    const error = new HttpError(
      "Could not find donates for the given blood type.",
      500
    );
    logActivity(`ERROR: No donates found for blood type: ${btype}`);
    return next(error);
  }

  logActivity(`SUCCESS: Retrieved donates by blood type: ${btype}`);
  res.json({
    donates: donate.map((place) => place.toObject({ getters: true })),
  });
};

const getAllDonates = async (req, res, next) => {
  let donate;
  try {
    donate = await Donate.find();
  } catch (err) {
    const error = new HttpError(
      "Somthing went wrong, could not find donates",
      500
    );
    logActivity("ERROR: Failed to retrieve all donates");
    return next(error);
  }

  if (!donate) {
    const error = new HttpError("Could not find donates.", 500);
    logActivity("ERROR: No donates found");
    return next(error);
  }

  logActivity("SUCCESS: Retrieved all donates");
  res.json({
    donates: donate.map((place) => place.toObject({ getters: true })),
  });
};

const createDonate = async (req, res, next) => {
  const {
    fullName,
    btype,
    address,
    donatorID,
    birthDate,
    donateDate,
    mentalHealthCondition,
    careProvided,
    creditCard,
    health_fund
  } = req.body;

  // Create a new donation object
  const newDonation = new Donate({
    fullName,
    btype,
    address,
    donatorID,
    birthDate: {
      day: birthDate.day,
      month: birthDate.month,
      year: birthDate.year,
    },
    donateDate: {
      day: donateDate.day,
      month: donateDate.month,
      year: donateDate.year,
    },
    mentalHealthCondition,
    careProvided,
    creditCard,
    health_fund,
  });

  try {
    // Save the new donation to the database
    await newDonation.save();

    // Simulate AI features based on donation information
    const aiFeatures = simulateAIFeatures(newDonation);
    console.log("Simulated AI features:", aiFeatures);

    // Path to the Python executable
    const pythonExecutable = path.join(__dirname, '..', 'new_env', 'Scripts', 'python');

    // Path to the Python script
    const pythonScriptPath = path.join(__dirname, '..', 'AIHeartModel', 'predict.py');
    console.log("Python script path:", pythonScriptPath);

    // Spawn a new Python process to run the AI model
    const python = spawn(pythonExecutable, [pythonScriptPath, JSON.stringify(aiFeatures)]);

    let predictionResult = '';

    python.stdout.on('data', (data) => {
      predictionResult += data.toString();
      console.log(`Python stdout: ${data}`);
    });

    python.stderr.on('data', (data) => {
      console.error(`Python stderr: ${data}`);
      return res.status(500).json({ message: "Failed to run AI model.", error: data.toString() });
    });

    python.on('close', async (code) => {
      if (code !== 0) {
        return res.status(500).json({ message: "Failed to run AI model." });
      }

      const prediction = parseFloat(predictionResult.trim());

    if (isNaN(prediction)) {
      console.error('Invalid prediction result:', predictionResult);
      return res.status(500).json({ message: "Invalid prediction result from AI model." });
    }

    // Map prediction to results (same mapping used in the Python script)
    const predictionMap = {
      '0': "No heart disease detected.",
      '1': "Mild heart disease detected. Please consult a healthcare provider for further evaluation.",
      '2': "Moderate heart disease detected. Medical consultation is recommended.",
      '3': "Severe heart disease detected. Immediate medical attention is advised.",
      '4': "Very severe heart disease detected. Urgent medical intervention is necessary."
    };

      const resultMessage = predictionMap[prediction];

      // Save AI results to the donation
      newDonation.aiResults = {
        prediction: parseInt(prediction),
        message: resultMessage
      };

      try {
        await newDonation.save();
      } catch (err) {
        return res.status(500).json({ message: "Failed to save AI results.", error: err.message });
      }

      // Create a new donator user with hashed password
      const hashedPassword = await bcrypt.hash(donatorID, 12); // Default password can be updated as needed

      const donatorUser = new User({
        username: donatorID,  // Using donatorID as username for simplicity
        password: hashedPassword,
        name: fullName,
        birth_date: birthDate,
        ID: donatorID,
        role: 'donator',
        isApproved: true,
        aiFeatures: aiFeatures,
        aiResults: {
          prediction: parseInt(prediction),
          message: resultMessage
        }
      });
      console.log("creating new user");
      try {
        await donatorUser.save();
        console.log("User saved successfully");
        res.status(201).json({ message: "Donation and user created successfully!", aiResults: newDonation.aiResults });
      } catch (err) {
        console.error("Error saving user:", err);  // Log the specific error
        res.status(500).json({ message: "Failed to create donator user.", error: err.message });
      }
    });
    console.log("saving new user");


  } catch (error) {
    res.status(500).json({ message: "Failed to create donation.", error: error.message });
  }
};


// Example function to simulate AI features based on donor info
const simulateAIFeatures = (donation) => {
  console.log(donation.birthDate);
  const age = calculateAge(donation.birthDate);

  const sex = determineSex(donation.fullName); // Example logic based on name
  const cp = determineChestPainType(donation.mentalHealthCondition);
  const trestbps = simulateRestingBloodPressure(age);
  console.log("i am here");

  const chol = simulateCholesterol(age, donation.health_fund);
  const fbs = simulateFastingBloodSugar(donation.health_fund);
  const restecg = simulateECGResults();
  const thalach = simulateMaxHeartRate(age);
  const exang = simulateExerciseInducedAngina(age, donation.mentalHealthCondition);


  return {
    age,
    sex,
    cp,
    trestbps,
    chol,
    fbs,
    restecg,
    thalach,
    exang
  };
};

// Helper function to determine sex based on name (example, not reliable)
const determineSex = (fullName) => {
  // This is just a placeholder. In a real scenario, you would have more reliable data.
  return fullName.toLowerCase().endsWith('a') ? 0 : 1; // Assume names ending with 'a' are female
};

// Example logic to determine chest pain type
const determineChestPainType = (mentalHealthCondition) => {
  if (mentalHealthCondition.toLowerCase().includes('stress')) {
    return 2; // non-anginal pain
  }
  return 3; // asymptomatic
};

// Simulate resting blood pressure based on age
const simulateRestingBloodPressure = (age) => {
  if (age < 30) return 110;
  if (age < 50) return 120;
  return 140;
};

// Simulate cholesterol based on age and health fund
const simulateCholesterol = (age, healthFund) => {
  if (healthFund === 'Aetna') return 180;
  return age < 40 ? 200 : 240;
};

// Simulate fasting blood sugar based on health fund
const simulateFastingBloodSugar = (healthFund) => {
  return healthFund === 'Aetna' ? 1 : 0;
};

// Simulate ECG results (random example)
const simulateECGResults = () => {
  return Math.random() > 0.5 ? 0 : 1;
};

// Simulate maximum heart rate achieved based on age
const simulateMaxHeartRate = (age) => {
  return 220 - age; // Simplified formula for max heart rate
};

// Simulate exercise-induced angina based on age and mental health condition
const simulateExerciseInducedAngina = (age, mentalHealthCondition) => {
  if (mentalHealthCondition.toLowerCase().includes('anxiety') && age > 50) {
    return 1;
  }
  return 0;
};

const calculateAge = (birthDate) => {
  const today = new Date();
  const birthYear = parseInt(birthDate.year, 10);
  const birthMonth = parseInt(birthDate.month, 10) - 1;
  const birthDay = parseInt(birthDate.day, 10);
  const birth = new Date(birthYear, birthMonth, birthDay);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};


const updateDonate = async (req, res, next) => {
  const donateId = req.params.donateId;
  let donate;
  try {
    donate = await Donate.findById(donateId);
  } catch (err) {
    const error = new HttpError(
      "Somthing went wrong, could not update donate",
      500
    );
    logActivity(`ERROR: Failed to find donate with ID: ${donateId}`);
    return next(error);
  }

  if (!donate) {
    const error = new HttpError("Could not find donates.", 500);
    logActivity(`ERROR: No donate found with ID: ${donateId}`);
    return next(error);
  }

  donate.used = true;

  try {
    await donate.save();
  } catch (err) {
    const error = new HttpError("Could not update donate.", 500);
    logActivity(`ERROR: Failed to update donate with ID: ${donateId}`);
    return next(error);
  }

  logActivity(`SUCCESS: Updated donate with ID: ${donateId}`);
  res.status(200).json({ donate: donate.toObject({ getters: true }) });
};

const deleteDonate = async (req, res, next) => {
  const donateId = req.params.donateId;
  let donate;
  try {
    donate = await Donate.findById(donateId);
  } catch (err) {
    const error = new HttpError(
      "Somthing went wrong, could not delete donate",
      500
    );
    logActivity(`ERROR: Failed to find donate with ID: ${donateId}`);
    return next(error);
  }

  try {
    await Donate.findByIdAndDelete(donateId);
  } catch (err) {
    const error = new HttpError("Could not delete donate.", 500);
    logActivity(`ERROR: Failed to delete donate with ID: ${donateId}`);
    return next(error);
  }

  logActivity(`SUCCESS: Deleted donate with ID: ${donateId}`);
  res.status(200).json({ message: "Deleted donate." });
};

const exportToPDF = async (req, res, next) => {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  let y = 20; // Start a bit lower to leave room for the title

  try {
    const donate = await Donate.find();

    // Add a title
    doc.setFontSize(18);
    doc.text("Donation Records", 10, 10);
    doc.setFontSize(12);
    doc.text(`Export Date: ${new Date().toLocaleDateString()}`, 10, 16);
    
    donate.forEach((item) => {
      if (y + 60 > pageHeight - 20) { // Check if we need to add a new page
        doc.addPage();
        y = 20; // Reset y position for the new page
        doc.text(`Donation Records (cont.)`, 10, 10); // Add title on new pages
      }

      // Print donation details
      doc.setFont("helvetica", "bold");
      doc.text(`Donate ID:`, 10, y);
      doc.setFont("helvetica", "normal");
      doc.text(`${item._id}`, 50, y);
      y += 10;

      doc.setFont("helvetica", "bold");
      doc.text(`Blood Type:`, 10, y);
      doc.setFont("helvetica", "normal");
      doc.text(`${item.btype}`, 50, y);
      y += 10;

      doc.setFont("helvetica", "bold");
      doc.text(`Donator ID:`, 10, y);
      doc.setFont("helvetica", "normal");
      doc.text(`${item.donatorID}`, 50, y);
      y += 10;

      doc.setFont("helvetica", "bold");
      doc.text(`Place:`, 10, y);
      doc.setFont("helvetica", "normal");
      doc.text(`${item.place}`, 50, y);
      y += 10;

      doc.setFont("helvetica", "bold");
      doc.text(`Used:`, 10, y);
      doc.setFont("helvetica", "normal");
      doc.text(`${item.used}`, 50, y);
      y += 20;

      // Draw a line after each donation entry
      doc.setLineWidth(0.5);
      doc.line(10, y - 10, 200, y - 10);
    });

    // Add page numbers at the bottom within the page's margins
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2 - 10, pageHeight - 10);
    }

    doc.save('donates.pdf');
  } catch (err) {
    const error = new HttpError("Could not export to PDF", 500);
    logActivity("ERROR: Failed to export donates to PDF");
    return next(error);
  }
  logActivity("SUCCESS: Exported donates to PDF");
  res.setHeader("Content-Disposition", "attachment; filename=donates.pdf");
  res.setHeader("Content-Type", "application/pdf");
  res.send(doc.output());
};


const exportToXML = async (req, res, next) => {
  let donate;
  try {
    donate = await Donate.find();
    const root = create("Donates");
    donate.forEach((item) => {
      const donateElement = root.ele("Donate");
      donateElement.ele("ID", item._id);
      donateElement.ele("BloodType", item.btype);
      donateElement.ele("DonatorID", item.donatorID);
      donateElement.ele("Place", item.place);
      donateElement.ele("Used", item.used.toString());
    });
    const xmlString = root.end({ pretty: true });
    logActivity("SUCCESS: Exported donates to XML");
    res.setHeader("Content-Disposition", "attachment; filename=donates.xml");
    res.setHeader("Content-Type", "application/xml");
    res.send(xmlString);
  } catch (err) {
    const error = new HttpError("Could not export to XML", 500);
    logActivity("ERROR: Failed to export donates to XML");
    return next(error);
  }
};

exports.getDonatesByBloodType = getDonatesByBloodType;
exports.createDonate = createDonate;
exports.updateDonate = updateDonate;
exports.deleteDonate = deleteDonate;
exports.getAllDonates = getAllDonates;
exports.exportToPDF = exportToPDF;
exports.exportToXML = exportToXML;
