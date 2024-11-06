const Cake = require('../models/Cake');

// Fetch cakes by main category and subcategory
exports.getCakesByCategory = async (req, res) => {
  const { mainCategory, subcategory } = req.query;

  try {
    const cakes = await Cake.find({
      mainCategory: mainCategory,
      subcategory: subcategory.replace(/-/g, ' '), 
    });

    return res.status(200).json(cakes);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error });
  }
};