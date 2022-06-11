const Tour = require('../models/tourModel');

// REQUEST HANDLERS

exports.top5Cheapest = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

class APIFeatures {
  constructor(mongoQueryObject, requestQueryObject) {
    this.mongoQueryObject = mongoQueryObject;
    this.requestQueryObject = requestQueryObject;
  }

  filter() {
    // BUILD QUERY
    const queryObj = { ...this.requestQueryObject };
    const specialQueries = ['page', 'sort', 'limit', 'fields'];
    specialQueries.forEach((each) => delete queryObj[each]);

    // COMPLEX FILTERING
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(lt|gt|lte|gte)\b/g,
      (match) => `$${match}`
    );
    this.mongoQueryObject = this.mongoQueryObject.find(JSON.parse(queryString));
    return this;
  }

  //  SORT QUERY
  sort() {
    if (this.requestQueryObject.sort) {
      this.mongoQueryObject = this.mongoQueryObject.sort(
        this.requestQueryObject.sort.split(',').join(' ')
      );
    } else {
      this.mongoQueryObject = this.mongoQueryObject.sort('createdAt');
    }
    return this;
  }

  // FIELD LIMITING
  limitFields() {
    const { fields } = this.requestQueryObject;

    if (fields) {
      this.mongoQueryObject = this.mongoQueryObject.select(
        fields.split(',').join(' ')
      );
    } else {
      this.mongoQueryObject = this.mongoQueryObject.select('-__v');
    }
    return this;
  }

  // PAGINATION
  paginate() {
    const page = this.requestQueryObject.page * 1 || 1;
    const limit = this.requestQueryObject.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.mongoQueryObject = this.mongoQueryObject.skip(skip).limit(limit);
    return this;
  }
}

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
    const query = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await query.mongoQueryObject;

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
