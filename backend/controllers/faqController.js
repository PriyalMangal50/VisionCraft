import faqModel from "../models/faqModel.js";

// Add FAQ
const addFAQ = async (req, res) => {
  try {
    const { question, answer, category, isActive, order } = req.body;

    const faqData = {
      question,
      answer,
      category: category || 'General',
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0,
      date: Date.now(),
    };

    const faq = new faqModel(faqData);
    await faq.save();

    res.json({ success: true, message: "FAQ added successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// List all FAQs
const listFAQs = async (req, res) => {
  try {
    const faqs = await faqModel.find({}).sort({ order: 1, date: -1 });
    res.json({ success: true, faqs });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Remove FAQ
const removeFAQ = async (req, res) => {
  try {
    await faqModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "FAQ removed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update FAQ
const updateFAQ = async (req, res) => {
  try {
    const { id, question, answer, category, isActive, order } = req.body;
    
    const updateData = {};
    if (question) updateData.question = question;
    if (answer) updateData.answer = answer;
    if (category) updateData.category = category;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (order !== undefined) updateData.order = order;

    await faqModel.findByIdAndUpdate(id, updateData);
    res.json({ success: true, message: "FAQ updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get single FAQ
const singleFAQ = async (req, res) => {
  try {
    const { id } = req.body;
    const faq = await faqModel.findById(id);
    res.json({ success: true, faq });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addFAQ, listFAQs, removeFAQ, updateFAQ, singleFAQ };
