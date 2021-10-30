const mongoose = require("mongoose");

const Link = require("../models/Link");
const ErrorResponse = require("../utils/errorResponse");

//get

exports.addLink = async (req, res, next) => {
  const {
    user,
    body: { linkUrl, category, description },
  } = req;

  if (!linkUrl || !category) {
    return next(
      new ErrorResponse(
        `Please enter a valid ${!linkUrl ? "url" : "category"}`,
        500
      )
    );
  }

  try {
    const link = await Link.create({
      linkUrl,
      category,
      description,
      userId: user._id,
    });
    const linkData = link.toClient();

    res.status(200).json({
      success: true,
      link: linkData,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteLink = async (req, res, next) => {
  const {
    params: { id },
    user,
  } = req;

  if (!mongoose.isValidObjectId(id)) {
    return next(
      new ErrorResponse("Please pass a valid link id for delete", 404)
    );
  }

  try {
    const link = await Link.findOneAndDelete({
      _id: id,
      userId: user._id,
    });

    if (!link) {
      return next(new ErrorResponse("No such link exists"), 404);
    }

    res.status(200).json({
      success: true,
      message: "Link delete successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.updateLink = async (req, res, next) => {
  const {
    params: { id },
    user,
    body: { description },
  } = req;

  if (!mongoose.isValidObjectId(id)) {
    return next(
      new ErrorResponse(
        "Please pass a valid link id for updaing this link",
        404
      )
    );
  }

  try {
    const link = await Link.findOneAndUpdate(
      { _id: id, userId: user._id },
      { $set: { description } },
      { new: true }
    );

    if (!link) {
      return next(new ErrorResponse("No such link exists for updating", 404));
    }
    const linkData = link.toClient();
    res.status(200).json({
      success: true,
      link: linkData,
    });
  } catch (error) {
    next(error);
  }
};
