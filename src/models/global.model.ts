import mongoose from "mongoose";

mongoose.plugin((schema) => {
  schema.pre(/^find/, function (next) {
    const query = this as any;
    const providerId = query.options.providerId;
    if (providerId) {
      query.where({ "provider._id": providerId });
    }
    next();
  });
});
