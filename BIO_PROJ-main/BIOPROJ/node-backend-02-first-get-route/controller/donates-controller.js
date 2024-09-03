const Donate = require("../models/Donate");
const HttpError = require("../models/http-error");
const logActivity = require("../models/audit");
const { jsPDF } = require("jspdf");
const { create } = require("xmlbuilder");

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
  });
console.log(newDonation);
  try {
    await newDonation.save();
    res.status(201).json({ message: "Donation created successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to create donation.", error: error.message });
  }
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
