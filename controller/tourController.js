const Tour = require('../models/tourModel');

// REQUEST HANDLERS

exports.createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getAllTours = async (req, res) => {
  try {
    // BUILD QUERY
    const queryObj = { ...req.query };
    const specialQueries = ['page', 'sort', 'limit', 'fields'];
    specialQueries.forEach((each) => delete queryObj[each]);

    // COMPLEX FILTERING
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(lt|gt|lte|gte)\b/g,
      (match) => `$${match}`
    );

    let query = Tour.find(JSON.parse(queryString));

    //  SORT QUERY
    if (req.query.sort) {
      query = query.sort(req.query.sort.split(',').join(' '));
    } else {
      query = query.sort('createdAt');
    }

    // FIELD LIMITING
    const { fields } = req.query;

    const fieldString = fields.split(',').join(' ');
    if (fields) {
      query = query.select(fieldString);
    } else {
      query = query.select('-__v');
    }

    // PAGINATION
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    if (req.query.page) {
      const requestedPage = await Tour.countDocuments();
      if (skip >= requestedPage) throw new Error('Page number not found');
    }

    query = query.skip(skip).limit(limit);

    // EXECUTE QUERY
    const tours = await query;

    res.status(200).json({
      status: 'success',
      resultCount: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getOneTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'success',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      message: 'Successfully deleted',
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      data: null,
    });
  }
};
