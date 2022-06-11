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

module.exports = APIFeatures;
